// ==========================================
// CORE DOMAIN TYPES
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "buyer" | "seller" | "admin";
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string | null;
  mrp: number;
  poolPrice: number;
  discount: number;
  progress: number;
  buyers: number;
  maxBuyers: number;
  targetUnits: number;
  filledUnits: number;
  timeRemaining: string;
  expiresAt: string;
  status: "Active" | "Filling Fast" | "Completed" | "Expired" | string;
  aiMatchScore: number;
  minOrder: number;
  seller: string;
  sellerRating: number;
  tags: string[];
}

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
  badge?: string;
  badgeColor?: string;
  description: string;
  tags: string[];
  stock: number;
  deliveryDays: number;
  verified: boolean;
}

export interface Transaction {
  id: string;
  pool: string;
  poolId: string;
  amount: number;
  units: number;
  date: string;
  status: "Completed" | "Processing" | "Disputed" | "Failed" | string;
  paymentMethod: string;
  savings: number;
  invoice: string;
}

export interface TrustBadge {
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

export interface TrustReview {
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TrustProfile {
  score: number;
  maxScore: number;
  tier: string;
  nextTier: string;
  nextTierAt: number;
  totalTransactions: number;
  completedPools: number;
  disputeRate: string;
  onTimePayment: string;
  memberSince: string;
  badges: TrustBadge[];
  recentReviews: TrustReview[];
}

export interface Recommendation {
  id: string;
  type: "pool" | "offer";
  title: string;
  subtitle: string;
  matchScore: number;
  savings: string;
  urgency: string;
  pool?: Pool;
  offer?: Offer;
  reasons: string[];
  action: string;
}

export interface DashboardSummary {
  activePools: number;
  totalSavings: number;
  completedDeals: number;
  trustScore: number;
  savingsThisMonth: number;
  poolsJoined: number;
  offersAvailable: number;
  networkSize: number;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, string[]>;
}
