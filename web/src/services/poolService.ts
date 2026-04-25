import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Pool } from '@/types';
import { mockPools } from '@/data/mockData';

// Temporary mapper to combine real API data with fallback UI properties
// that the backend doesn't support yet (like AI score, seller ratings).
const mapPoolResponse = (apiPool: any): Pool => {
  // Find a matching mock pool to steal its rich UI data if available
  // or provide sensible defaults.
  const mockFallback = mockPools.find((m) => m.name === apiPool.name) || mockPools[0];

  const progress = Math.min(Math.round((apiPool.filledUnits / apiPool.targetUnits) * 100), 100);

  // Format time remaining naively for demo purposes
  const expiresDate = new Date(apiPool.expiresAt);
  const now = new Date();
  const diffHours = Math.max(0, Math.floor((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const timeRemaining = diffHours > 24 
    ? `${Math.floor(diffHours / 24)}d ${diffHours % 24}h` 
    : `${diffHours}h 0m`;

  return {
    id: apiPool.id,
    name: apiPool.name,
    description: apiPool.description,
    category: apiPool.category,
    image: apiPool.image || mockFallback.image || null,
    mrp: apiPool.mrp,
    poolPrice: apiPool.poolPrice,
    discount: apiPool.discount,
    progress: progress,
    buyers: Math.max(1, Math.floor(apiPool.filledUnits / apiPool.minOrder)),
    maxBuyers: Math.ceil(apiPool.targetUnits / apiPool.minOrder),
    targetUnits: apiPool.targetUnits,
    filledUnits: apiPool.filledUnits,
    timeRemaining: timeRemaining,
    expiresAt: apiPool.expiresAt,
    status: apiPool.status,
    aiMatchScore: mockFallback.aiMatchScore,
    minOrder: apiPool.minOrder,
    seller: mockFallback.seller,
    sellerRating: mockFallback.sellerRating,
    tags: apiPool.tags || [],
  };
};

export const poolKeys = {
  all: ['pools'] as const,
  lists: () => [...poolKeys.all, 'list'] as const,
  list: (filters: string) => [...poolKeys.lists(), { filters }] as const,
  details: () => [...poolKeys.all, 'detail'] as const,
  detail: (id: string) => [...poolKeys.details(), id] as const,
};

// Hook to get all pools
export function usePools() {
  return useQuery({
    queryKey: poolKeys.lists(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<any[]>('/pools');
        if (response && response.length > 0) {
          return response.map(mapPoolResponse);
        }
        // Fallback to mock data if DB is empty for demo purposes
        console.log('No pools returned from API, falling back to mock data');
        return mockPools;
      } catch (error) {
        console.error('Failed to fetch pools from API, using mock data fallback:', error);
        return mockPools;
      }
    },
  });
}

// Hook to get a single pool by ID
export function usePool(id: string) {
  return useQuery({
    queryKey: poolKeys.detail(id),
    queryFn: async () => {
      // If it's a mock ID (e.g., "pool-001"), go straight to mock
      if (id.startsWith('pool-')) {
        const pool = mockPools.find(p => p.id === id);
        if (!pool) throw new Error('Pool not found');
        return pool;
      }
      
      try {
        const response = await apiClient.get<any>(`/pools/${id}`);
        return mapPoolResponse(response);
      } catch (error) {
        console.error(`Failed to fetch pool ${id} from API, checking mock data:`, error);
        const pool = mockPools.find(p => p.id === id);
        if (!pool) throw new Error('Pool not found');
        return pool;
      }
    },
    enabled: !!id,
  });
}

// Hook to create a new pool
export function useCreatePool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPool: any) => {
      // API payload expects normalized_product_id, we can inject a random one if the backend doesn't care
      const payload = {
        normalized_product_id: crypto.randomUUID(),
        ...newPool
      };
      const response = await apiClient.post('/pools/', payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poolKeys.all });
    },
  });
}
