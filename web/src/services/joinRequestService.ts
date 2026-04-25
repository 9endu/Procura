import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Join Request Types based on backend JoinRequestResponse
export interface JoinRequest {
  id: string; // uuid
  pool_id: string; // uuid
  user_id: string; // uuid
  requested_quantity: number;
  status: string; // pending, approved, rejected
  created_at: string;
  updated_at: string;
  approvals: number;
  rejections: number;
  total_voters: number;
  threshold_percentage: number;
  // Mock UI specific additions mapped on frontend
  name?: string;
  trustScore?: number;
  previousDefaults?: number;
  previousPools?: number;
  requestedAt?: string;
  userVoted?: "approve" | "reject" | null;
  trustWarning?: string;
}

export const joinRequestKeys = {
  all: ['joinRequests'] as const,
  lists: () => [...joinRequestKeys.all, 'list'] as const,
  list: (poolId: string) => [...joinRequestKeys.lists(), poolId] as const,
};

// Map real API request to include mock UI properties for users since auth/users is incomplete
const mapJoinRequest = (req: any, index: number): JoinRequest => {
  const mockNames = ["Vikram Joshi", "Deepa Nair", "Ramesh Singh", "Priya Verma"];
  const mockTrust = [620, 810, 540, 920];
  const mockDefaults = [2, 0, 4, 0];
  
  return {
    ...req,
    // Add mock properties to support rich UI
    name: mockNames[index % mockNames.length],
    trustScore: mockTrust[index % mockTrust.length],
    previousDefaults: mockDefaults[index % mockDefaults.length],
    previousPools: Math.floor(Math.random() * 10) + 1,
    requestedAt: "recently",
    userVoted: null, 
    trustWarning: mockDefaults[index % mockDefaults.length] > 0 
      ? `${mockDefaults[index % mockDefaults.length]} previous defaults detected`
      : undefined
  };
};

export function useJoinRequests(poolId: string) {
  return useQuery({
    queryKey: joinRequestKeys.list(poolId),
    queryFn: async () => {
      // Mock ID fallback
      if (poolId.startsWith('pool-')) {
        return []; 
      }
      
      try {
        const response = await apiClient.get<any[]>(`/pools/${poolId}/join-requests`);
        return response.map((req, index) => mapJoinRequest(req, index));
      } catch (error) {
        console.error(`Failed to fetch join requests for pool ${poolId}:`, error);
        return [];
      }
    },
    enabled: !!poolId,
  });
}

export function useVoteJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, approved }: { requestId: string; approved: boolean }) => {
      return apiClient.post(`/join-requests/${requestId}/vote`, { approved });
    },
    onSuccess: (_, variables) => {
      // We don't have the exact poolId here without returning it from the backend, 
      // so we invalidate all join requests to ensure UI freshness
      queryClient.invalidateQueries({ queryKey: joinRequestKeys.all });
    },
  });
}
