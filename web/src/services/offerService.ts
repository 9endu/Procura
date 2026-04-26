import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { mockOffers } from '@/data/mockData';

// ── Shared type ────────────────────────────────────────────────────────────

export interface Offer {
  id: string;
  title: string;
  seller: string;
  category: string;
  unitPrice: number;
  bulkPrice: number;
  moq: number;
  unit: string;
  discount: number;
  rating: number;
  reviews: number;
  badge?: string | null;
  badgeColor?: string | null;
  description: string;
  tags: string[];
  stock: number;
  deliveryDays: number;
  verified: boolean;
}

// ── Query keys ─────────────────────────────────────────────────────────────

export const offerKeys = {
  all: ['offers'] as const,
  lists: () => [...offerKeys.all, 'list'] as const,
  list: (category?: string) => [...offerKeys.lists(), { category }] as const,
  detail: (id: string) => [...offerKeys.all, 'detail', id] as const,
};

// ── Mapper: API response → Offer ───────────────────────────────────────────

function mapApiOffer(raw: any): Offer {
  return {
    id: String(raw.id),
    title: raw.title,
    seller: raw.seller ?? '',
    category: raw.category,
    unitPrice: raw.unitPrice,
    bulkPrice: raw.bulkPrice,
    moq: raw.moq,
    unit: raw.unit,
    discount: raw.discount,
    rating: raw.rating ?? 0,
    reviews: raw.reviews ?? 0,
    badge: raw.badge ?? null,
    badgeColor: raw.badgeColor ?? null,
    description: raw.description,
    tags: raw.tags ?? [],
    stock: raw.stock,
    deliveryDays: raw.deliveryDays,
    verified: raw.verified ?? false,
  };
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetches all offers from the backend, with graceful fallback to mock data
 * if the backend is unreachable or returns an empty list.
 */
export function useOffers(category?: string) {
  return useQuery<Offer[]>({
    queryKey: offerKeys.list(category),
    queryFn: async () => {
      try {
        const params = category ? `?category=${encodeURIComponent(category)}` : '';
        const response = await apiClient.get<any[]>(`/offers/${params}`);
        if (response && response.length > 0) {
          return response.map(mapApiOffer);
        }
        console.log('[offerService] No offers from API, falling back to mock data');
        return mockOffers as Offer[];
      } catch (error) {
        console.error('[offerService] API error, using mock data fallback:', error);
        return mockOffers as Offer[];
      }
    },
  });
}

/**
 * Fetches a single offer by ID. Falls back to mock data for demo IDs.
 */
export function useOffer(id: string) {
  return useQuery<Offer>({
    queryKey: offerKeys.detail(id),
    queryFn: async () => {
      // Short-circuit mock IDs so they always resolve instantly
      if (id.startsWith('off-')) {
        const mock = mockOffers.find((o) => o.id === id);
        if (!mock) throw new Error('Offer not found');
        return mock as Offer;
      }
      try {
        const response = await apiClient.get<any>(`/offers/${id}`);
        return mapApiOffer(response);
      } catch (error) {
        console.error(`[offerService] Failed to fetch offer ${id}:`, error);
        const mock = mockOffers.find((o) => o.id === id);
        if (!mock) throw new Error('Offer not found');
        return mock as Offer;
      }
    },
    enabled: !!id,
  });
}
