"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePool } from "@/services/poolService";
import { useJoinRequests, useVoteJoinRequest } from "@/services/joinRequestService";
import {
  ArrowLeft,
  Package,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  Shield,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Crown,
  MapPin,
  Hash,
  Eye,
  EyeOff,
  MessageSquare,
  Flag,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Truck,
  Lock,
  Check,
  X,
  Info,
  CircleAlert,
  Timer,
  TrendingUp,
  Award,
  UserPlus,
  ShieldAlert,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PoolProgress, CircularProgress } from "@/components/ui/progress";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — Everything self-contained
   ═══════════════════════════════════════════════════════════ */

type PoolStatus =
  | "Open"
  | "Approval Pending"
  | "Active"
  | "MOQ Reached"
  | "Locked"
  | "Pickup Pending"
  | "Distribution In Progress"
  | "Completed"
  | "Disputed";

const POOL = {
  id: "pool-001",
  name: "Tata Sampann Unpolished Toor Dal",
  brand: "Tata Sampann",
  category: "Grains & Staples",
  description:
    "Premium unpolished toor dal, 1kg packs. Rich in protein and fiber. Direct supply from Tata Consumer Products with FSSAI certification. Ideal for retail stores and restaurant bulk buying.",
  image: null,
  mrp: 180,
  poolPrice: 142,
  discount: 21,
  unit: "1kg pack",
  moqTarget: 200,
  committedQty: 155,
  progress: 77.5,
  buyers: 8,
  maxBuyers: 15,
  timeRemaining: "2d 14h",
  status: "Active" as PoolStatus,
  offerType: "Slab Discount",
  slabs: [
    { qty: "50+", price: 142, discount: "21%" },
    { qty: "100+", price: 135, discount: "25%" },
    { qty: "200+", price: 128, discount: "29%" },
  ],
  supplier: {
    name: "Sri Balaji Wholesale Traders",
    rating: 4.7,
    totalOrders: 342,
    onTimeRate: "96%",
    verified: true,
    location: "Secunderabad, Telangana",
  },
  leader: {
    name: "Rahul Kumar",
    initials: "RK",
    trustScore: 847,
    isCurrentUser: true,
  },
  createdAt: "2025-04-01T10:30:00Z",
  pickupLocation: "Warehouse #4, Bowenpally Market, Secunderabad",
};

/* ── Members ────────────────────────────────────────────── */

interface PoolMember {
  id: string;
  name: string;
  qty: number;
  joinedAt: string;
  trustScore: number;
  isLeader: boolean;
  paymentStatus: "Paid" | "Pending" | "Partial";
  previousDefaults: number;
}

const MEMBERS: PoolMember[] = [
  { id: "m1", name: "Rahul Kumar", qty: 30, joinedAt: "Apr 1", trustScore: 847, isLeader: true, paymentStatus: "Paid", previousDefaults: 0 },
  { id: "m2", name: "Priya Mehra", qty: 25, joinedAt: "Apr 1", trustScore: 812, isLeader: false, paymentStatus: "Paid", previousDefaults: 0 },
  { id: "m3", name: "Ankita Sharma", qty: 20, joinedAt: "Apr 2", trustScore: 756, isLeader: false, paymentStatus: "Paid", previousDefaults: 0 },
  { id: "m4", name: "Ravi Deshmukh", qty: 25, joinedAt: "Apr 2", trustScore: 691, isLeader: false, paymentStatus: "Pending", previousDefaults: 1 },
  { id: "m5", name: "Suresh Patel", qty: 15, joinedAt: "Apr 2", trustScore: 890, isLeader: false, paymentStatus: "Paid", previousDefaults: 0 },
  { id: "m6", name: "Meena Rao", qty: 10, joinedAt: "Apr 3", trustScore: 723, isLeader: false, paymentStatus: "Partial", previousDefaults: 0 },
  { id: "m7", name: "Ajay Tiwari", qty: 15, joinedAt: "Apr 3", trustScore: 801, isLeader: false, paymentStatus: "Paid", previousDefaults: 0 },
  { id: "m8", name: "Kavya Lakshmi", qty: 15, joinedAt: "Apr 3", trustScore: 778, isLeader: false, paymentStatus: "Paid", previousDefaults: 0 },
];

/* ── Pending Approval Requests ──────────────────────────── */

interface JoinRequest {
  id: string;
  name: string;
  requestedQty: number;
  trustScore: number;
  previousDefaults: number;
  previousPools: number;
  requestedAt: string;
  approvals: number;
  rejections: number;
  totalVoters: number;
  threshold: number; // percentage
  userVoted: null | "approve" | "reject";
  rejectReason?: string;
  trustWarning?: string;
}

const PENDING_REQUESTS: JoinRequest[] = [
  {
    id: "jr1",
    name: "Vikram Joshi",
    requestedQty: 20,
    trustScore: 620,
    previousDefaults: 2,
    previousPools: 5,
    requestedAt: "2 hours ago",
    approvals: 3,
    rejections: 1,
    totalVoters: 8,
    threshold: 75,
    userVoted: null,
    trustWarning: "2 previous defaults detected — last default 45 days ago on Pool #P-892",
  },
  {
    id: "jr2",
    name: "Deepa Nair",
    requestedQty: 15,
    trustScore: 810,
    previousDefaults: 0,
    previousPools: 12,
    requestedAt: "5 hours ago",
    approvals: 5,
    rejections: 0,
    totalVoters: 8,
    threshold: 75,
    userVoted: "approve",
  },
];

/* ── Rejected Request (for display) ────────────────────── */

const REJECTED_REQUEST = {
  name: "Sameer Khan",
  trustScore: 420,
  requestedQty: 30,
  reason: "Low trust score and 4 previous defaults in last 90 days",
  trustNote: "User has been flagged for repeated non-payment across 3 pools. Recommended for probation.",
  rejectedAt: "Apr 2, 2025",
  approvals: 1,
  rejections: 6,
};

/* ── Pool Timeline ─────────────────────────────────────── */

const TIMELINE = [
  { status: "Open", date: "Apr 1, 10:30 AM", done: true, description: "Pool created by Rahul Kumar" },
  { status: "Active", date: "Apr 1, 2:15 PM", done: true, description: "First 3 members joined" },
  { status: "Approval Pending", date: "Apr 3, 4:00 PM", done: true, description: "New join request from Vikram Joshi" },
  { status: "MOQ Reached", date: "—", done: false, description: "Waiting for 45 more units" },
  { status: "Locked", date: "—", done: false, description: "Pool locks after MOQ met" },
  { status: "Pickup Pending", date: "—", done: false, description: "OTP will be generated for pickup" },
  { status: "Distribution In Progress", date: "—", done: false, description: "Leader distributes to members" },
  { status: "Completed", date: "—", done: false, description: "All members confirm receipt" },
];

/* ── Ratings ──────────────────────────────────────────── */

const PAST_RATINGS = [
  { reviewer: "Priya Mehra", rating: 5, comment: "Great coordination! Smooth pickup and quality product.", date: "3 days ago", poolName: "Basmati Rice Bulk Buy" },
  { reviewer: "Suresh Patel", rating: 4, comment: "Good experience overall. Minor delay in OTP generation.", date: "1 week ago", poolName: "Amul Butter Commercial" },
  { reviewer: "Ankita Sharma", rating: 5, comment: "Rahul is a reliable pool leader. Recommended!", date: "2 weeks ago", poolName: "Maggi Noodles Pallet" },
];

/* ── Issue Reports ────────────────────────────────────── */

const ISSUE_REPORTS = [
  { id: "ISS-421", reporter: "Ravi Deshmukh", type: "Quality", description: "2 packets found damaged in last batch", status: "Under Review", date: "Apr 3" },
];

/* ═══════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function TrustScoreBadge({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const color =
    score >= 800
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 600
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-rose-400 bg-rose-500/10 border-rose-500/20";

  const label = score >= 800 ? "Gold" : score >= 600 ? "Silver" : "At Risk";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border font-bold",
        color,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <Shield className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {score} {label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Partial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-md border", map[status] || map.Pending)}>
      {status}
    </span>
  );
}

function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <div className="w-7 h-7 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center flex-shrink-0">
      <Check className="w-3.5 h-3.5 text-emerald-400" />
    </div>
  ) : (
    <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-zinc-600" />
    </div>
  );
}

function OTPCard({ title, otp, revealed, onToggle, status, icon: Icon }: {
  title: string;
  otp: string;
  revealed: boolean;
  onToggle: () => void;
  status: "generated" | "pending" | "verified";
  icon: typeof MapPin;
}) {
  const statusMap = {
    generated: { label: "Generated", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    pending: { label: "Awaiting", color: "text-zinc-400 bg-zinc-800 border-zinc-700" },
    verified: { label: "Verified ✓", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  };
  const s = statusMap[status];
  return (
    <Card className="p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", s.color)}>{s.label}</span>
          </div>
        </div>
      </div>
      {status !== "pending" ? (
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-lg tracking-[0.3em] text-center">
            {revealed ? (
              <span className="text-white font-bold">{otp}</span>
            ) : (
              <span className="text-zinc-600">• • • • • •</span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-all"
          >
            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {revealed && (
            <button className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-all">
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <p className="text-xs text-zinc-600">OTP will be generated when pool is locked</p>
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [showPickupOTP, setShowPickupOTP] = useState(false);
  const [showDeliveryOTP, setShowDeliveryOTP] = useState(false);
  const [joinQty, setJoinQty] = useState(10);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [expandedTimeline, setExpandedTimeline] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState(true);
  const [votes, setVotes] = useState<Record<string, "approve" | "reject" | null>>({
    jr1: null,
    jr2: "approve",
  });

  const { data: apiPendingRequests = [] } = useJoinRequests(id);
  const voteMutation = useVoteJoinRequest();

  // Prefer API data, but fallback to mock data if empty (for demo purposes)
  const pendingRequests = apiPendingRequests.length > 0 ? apiPendingRequests : PENDING_REQUESTS;

  const handleVote = (requestId: string, vote: "approve" | "reject") => {
    if (requestId.startsWith('jr')) {
      // Mock local state update
      setVotes((prev) => ({ ...prev, [requestId]: prev[requestId] === vote ? null : vote }));
      return;
    }
    
    // Remote API Mutation
    voteMutation.mutate({ requestId, approved: vote === "approve" });
    setVotes((prev) => ({ ...prev, [requestId]: prev[requestId] === vote ? null : vote }));
  };

  const handleJoinSubmit = () => {
    setJoinSubmitted(true);
    setTimeout(() => setShowJoinForm(false), 200);
  };

  const { data: apiPool, isLoading } = usePool(id);

  // Merge the real API pool with mock data for fields the API doesn't support yet
  const pool = apiPool ? { ...POOL, ...apiPool } : POOL;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading pool details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Back Nav ──────────────────────────────────── */}
      <Link
        href="/pools"
        className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pools
      </Link>

      {/* ═══════════════════════════════════════════════════
          1. PRODUCT SUMMARY CARD
          ═══════════════════════════════════════════════════ */}
      <Card className="overflow-hidden">
        <div className="relative h-44 bg-gradient-to-br from-indigo-600/20 via-zinc-900 to-violet-600/10 flex items-center justify-center">
          <Package className="w-20 h-20 text-zinc-700" />
          <div className="absolute top-4 left-5 flex items-center gap-2">
            <Badge variant="active" dot>{pool.status}</Badge>
            <Badge variant="indigo">{pool.offerType}</Badge>
          </div>
          <div className="absolute top-4 right-5 flex gap-2">
            <Badge variant="default" size="sm">
              <Clock className="w-3 h-3 mr-1" />
              {pool.timeRemaining} left
            </Badge>
          </div>
          <div className="absolute bottom-4 left-5">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {pool.discount}% OFF
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">{pool.category}</p>
              <h1 className="text-2xl font-black text-white mb-1">{pool.name}</h1>
              <p className="text-xs text-zinc-500 mb-2">by {pool.brand}</p>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{pool.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-zinc-600 mb-1">Pool Price</div>
              <div className="text-3xl font-black text-white">₹{pool.poolPrice}</div>
              <div className="text-sm text-zinc-600 line-through">MRP ₹{pool.mrp}</div>
              <div className="text-xs text-zinc-500 mt-1">per {pool.unit}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════
          MAIN GRID
          ═══════════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── LEFT COLUMN (2/3) ───────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* ═════════════════════════════════════════════════
              2. SUPPLIER OFFER DETAILS
              ═════════════════════════════════════════════════ */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Supplier & Offer Details</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Verified wholesale partner</p>
              </div>
              {pool.supplier.verified && (
                <Badge variant="emerald" size="sm" className="ml-auto">
                  <BadgeCheck className="w-3 h-3 mr-0.5" /> Verified
                </Badge>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5">
              {[
                { label: "Supplier", value: pool.supplier.name },
                { label: "Location", value: pool.supplier.location },
                { label: "Rating", value: `${pool.supplier.rating} ★ (${pool.supplier.totalOrders} orders)` },
                { label: "On-Time Delivery", value: pool.supplier.onTimeRate },
                { label: "Offer Type", value: pool.offerType },
                { label: "Unit", value: pool.unit },
              ].map((d) => (
                <div key={d.label} className="flex justify-between items-center py-2.5 border-b border-zinc-800/60 last:border-0">
                  <span className="text-zinc-500 text-xs">{d.label}</span>
                  <span className="text-zinc-200 font-medium text-xs">{d.value}</span>
                </div>
              ))}
            </div>

            {/* Slab pricing table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Slab Pricing</p>
              <div className="space-y-2">
                {pool.slabs.map((slab, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between py-2 px-3 rounded-lg text-xs",
                      i === 0 ? "bg-indigo-500/5 border border-indigo-500/15" : "bg-transparent"
                    )}
                  >
                    <span className="text-zinc-400 font-medium">{slab.qty} units</span>
                    <span className="text-white font-bold">₹{slab.price}/unit</span>
                    <Badge variant={i === 2 ? "emerald" : i === 1 ? "indigo" : "default"} size="sm">
                      {slab.discount} off
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              3. MOQ PROGRESS
              ═════════════════════════════════════════════════ */}
          <Card className="p-6">
            <div className="flex items-center gap-5 mb-5">
              <CircularProgress value={pool.progress} size={85} strokeWidth={7}>
                <span className="text-sm font-black text-white">{Math.round(pool.progress)}%</span>
              </CircularProgress>
              <div>
                <p className="text-sm font-bold text-white">
                  {pool.committedQty} / {pool.moqTarget} units committed
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {pool.moqTarget - pool.committedQty} more units needed to unlock best price
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" /> {pool.buyers} members
                  </span>
                  <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pool.timeRemaining}
                  </span>
                </div>
              </div>
            </div>
            <PoolProgress value={pool.progress} size="lg" animate />

            {/* MOQ milestones */}
            <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-600">
              <span>0</span>
              <span className="text-amber-400 font-medium">50 — 21% off</span>
              <span className="text-indigo-400 font-medium">100 — 25% off</span>
              <span className="text-emerald-400 font-medium">200 — 29% off 🎯</span>
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              4. MEMBER LIST
              ═════════════════════════════════════════════════ */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setExpandedMembers(!expandedMembers)}
              className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Pool Members ({MEMBERS.length})</p>
                  <p className="text-[10px] text-zinc-500">Total committed: {pool.committedQty} units</p>
                </div>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", expandedMembers && "rotate-180")} />
            </button>

            <AnimatePresence>
              {expandedMembers && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-2">
                    {MEMBERS.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all group"
                      >
                        <Avatar name={member.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-zinc-200 truncate">{member.name}</p>
                            {member.isLeader && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" /> Leader
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-zinc-500">Joined {member.joinedAt}</span>
                            {member.previousDefaults > 0 && (
                              <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" /> {member.previousDefaults} default{member.previousDefaults > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <TrustScoreBadge score={member.trustScore} />
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{member.qty} units</p>
                            <PaymentBadge status={member.paymentStatus} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* ═════════════════════════════════════════════════
              6/7. PENDING APPROVAL REQUESTS + VOTING PANEL
              ═════════════════════════════════════════════════ */}
          <Card className="overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="p-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Pending Approval Requests</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Members vote to approve or reject • 75% threshold needed
                  </p>
                </div>
                <Badge variant="warning" size="sm" className="ml-auto">{pendingRequests.length} pending</Badge>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {pendingRequests.map((req: any) => {
                const approvalPct = req.total_voters ? Math.round((req.approvals / req.total_voters) * 100) : Math.round((req.approvals / (req.totalVoters || 1)) * 100);
                const rejectionPct = req.total_voters ? Math.round((req.rejections / req.total_voters) * 100) : Math.round((req.rejections / (req.totalVoters || 1)) * 100);
                const currentVote = votes[req.id];
                const threshold = req.threshold_percentage || req.threshold || 75;
                const meetsThreshold = approvalPct >= threshold;
                const totalVoters = req.total_voters || req.totalVoters || 8;
                const requestedQty = req.requested_quantity || req.requestedQty;

                return (
                  <div key={req.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                    {/* Request header */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar name={req.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white">{req.name}</p>
                            <TrustScoreBadge score={req.trustScore} size="md" />
                            <span className="text-[10px] text-zinc-500">• {req.previousPools} past pools</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            Wants to join with <span className="text-white font-semibold">{requestedQty} units</span>
                            <span className="text-zinc-600 ml-2">• Requested {req.requestedAt}</span>
                          </p>
                        </div>
                      </div>

                      {/* Trust warning */}
                      {req.trustWarning && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-rose-500/5 border border-rose-500/15 rounded-lg">
                          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Trust Warning</p>
                            <p className="text-xs text-zinc-400">{req.trustWarning}</p>
                          </div>
                        </div>
                      )}

                      {/* Approval progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-zinc-400">
                            Approval Progress: <span className="text-white font-semibold">{req.approvals}/{totalVoters}</span> approved
                            <span className="text-zinc-600 ml-1">({approvalPct}%)</span>
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                            meetsThreshold
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-zinc-500 bg-zinc-800 border-zinc-700"
                          )}>
                            {meetsThreshold ? "Threshold Met ✓" : `${threshold}% needed`}
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${approvalPct}%` }}
                          />
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500"
                            style={{ width: `${rejectionPct}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-[10px]">
                          <span className="text-emerald-400">{req.approvals} approved</span>
                          <span className="text-rose-400">{req.rejections} rejected</span>
                          <span className="text-zinc-600">{totalVoters - req.approvals - req.rejections} pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting buttons */}
                    <div className="px-4 py-3 bg-zinc-900/30 border-t border-zinc-800/60 flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 mr-2">Your vote:</span>
                      <button
                        onClick={() => handleVote(req.id, "approve")}
                        disabled={voteMutation.isPending}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
                          currentVote === "approve"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-emerald-400 hover:border-emerald-500/30"
                        )}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Approve
                        {currentVote === "approve" && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                      <button
                        onClick={() => handleVote(req.id, "reject")}
                        disabled={voteMutation.isPending}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
                          currentVote === "reject"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-rose-400 hover:border-rose-500/30"
                        )}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Reject
                        {currentVote === "reject" && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Rejected request display */}
              <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-4 opacity-70">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-rose-300">{REJECTED_REQUEST.name}</p>
                      <TrustScoreBadge score={REJECTED_REQUEST.trustScore} />
                      <Badge variant="danger" size="sm">Rejected</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {REJECTED_REQUEST.requestedQty} units • {REJECTED_REQUEST.rejectedAt}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 ml-11">
                  <div className="text-xs text-zinc-400">
                    <span className="text-rose-400 font-medium">Reason: </span>{REJECTED_REQUEST.reason}
                  </div>
                  <div className="text-xs text-zinc-500 italic flex items-start gap-1.5">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-zinc-600" />
                    {REJECTED_REQUEST.trustNote}
                  </div>
                  <div className="text-[10px] text-zinc-600">
                    Votes: {REJECTED_REQUEST.approvals} approved, {REJECTED_REQUEST.rejections} rejected
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              11. PICKUP & DELIVERY OTP
              ═════════════════════════════════════════════════ */}
          <div className="grid sm:grid-cols-2 gap-4">
            <OTPCard
              title="Pickup OTP"
              otp="849 271"
              revealed={showPickupOTP}
              onToggle={() => setShowPickupOTP(!showPickupOTP)}
              status="generated"
              icon={MapPin}
            />
            <OTPCard
              title="Delivery OTP"
              otp="—"
              revealed={showDeliveryOTP}
              onToggle={() => setShowDeliveryOTP(!showDeliveryOTP)}
              status="pending"
              icon={Truck}
            />
          </div>

          {/* ═════════════════════════════════════════════════
              12. RATINGS & ISSUE REPORTS
              ═════════════════════════════════════════════════ */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ratings & Feedback</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Past pool reviews for this leader</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {PAST_RATINGS.map((r, i) => (
                <div key={i} className="p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar name={r.reviewer} size="xs" />
                    <span className="text-xs font-semibold text-zinc-200">{r.reviewer}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={cn("w-3 h-3", si < r.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700")}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{r.comment}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-600">
                    <span>{r.date}</span>
                    <span>•</span>
                    <span>{r.poolName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Issue reports */}
            {ISSUE_REPORTS.length > 0 && (
              <div className="border-t border-zinc-800">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag className="w-4 h-4 text-rose-400" />
                    <p className="text-sm font-bold text-white">Issue Reports</p>
                  </div>
                  {ISSUE_REPORTS.map((issue) => (
                    <div key={issue.id} className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <CircleAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{issue.id}</span>
                          <Badge variant="warning" size="sm">{issue.status}</Badge>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{issue.description}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Reported by {issue.reporter} • {issue.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── RIGHT COLUMN (1/3) ──────────────────────────── */}
        <div className="space-y-5">

          {/* ═════════════════════════════════════════════════
              5. JOIN REQUEST SECTION
              ═════════════════════════════════════════════════ */}
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              {!joinSubmitted ? (
                <>
                  <p className="text-xs text-zinc-500 mb-1">Request to join this pool</p>
                  <div className="mb-4">
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Quantity (units)</label>
                    <input
                      type="number"
                      value={joinQty}
                      onChange={(e) => setJoinQty(Number(e.target.value))}
                      min={1}
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  <div className="text-xs text-zinc-500 space-y-1.5 mb-5">
                    <div className="flex justify-between">
                      <span>Pool price</span>
                      <span className="text-white font-medium">₹{pool.poolPrice} / {pool.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your total</span>
                      <span className="text-white font-semibold">₹{(pool.poolPrice * joinQty).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>You save</span>
                      <span className="text-emerald-400 font-medium">₹{((pool.mrp - pool.poolPrice) * joinQty).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="lg" className="w-full mb-3" onClick={handleJoinSubmit}>
                    Request to Join
                  </Button>
                  <p className="text-[10px] text-zinc-600 text-center">
                    Existing members must approve your request (75% threshold)
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-emerald-300 mb-1">Join Request Submitted!</p>
                  <p className="text-xs text-zinc-500">
                    Waiting for member approvals ({joinQty} units)
                  </p>
                  <Badge variant="warning" size="sm" dot className="mt-3">Approval Pending</Badge>
                </div>
              )}
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              10. LEADER ASSIGNMENT
              ═════════════════════════════════════════════════ */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Pool Leader</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <Avatar name={pool.leader.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-200">{pool.leader.name}</p>
                  {pool.leader.isCurrentUser && (
                    <Badge variant="indigo" size="sm">You</Badge>
                  )}
                </div>
                <TrustScoreBadge score={pool.leader.trustScore} size="md" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Coordinates pickup & distribution
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Holds OTP codes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Resolves member disputes
              </div>
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              8. TRUST SCORE DISPLAY
              ═════════════════════════════════════════════════ */}
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-600/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Your Trust Score</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <CircularProgress value={(pool.leader.trustScore / 1000) * 100} size={70} strokeWidth={6}>
                <span className="text-xs font-black text-emerald-400">{pool.leader.trustScore}</span>
              </CircularProgress>
              <div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">Gold Tier</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">53 points to Platinum</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Completed Pools", value: "18" },
                { label: "On-time Payment", value: "100%" },
                { label: "Dispute Rate", value: "0%" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-xs py-1.5 border-b border-zinc-800/60 last:border-0">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="text-zinc-200 font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ═════════════════════════════════════════════════
              9. POOL STATUS TIMELINE
              ═════════════════════════════════════════════════ */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setExpandedTimeline(!expandedTimeline)}
              className="w-full p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Pool Timeline</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", expandedTimeline && "rotate-180")} />
            </button>
            <AnimatePresence>
              {expandedTimeline && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-[13px] top-4 bottom-4 w-px bg-zinc-800" />

                      <div className="space-y-4">
                        {TIMELINE.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 relative"
                          >
                            <StatusDot done={step.done} />
                            <div className="pt-0.5">
                              <p className={cn("text-xs font-semibold", step.done ? "text-zinc-200" : "text-zinc-600")}>
                                {step.status}
                              </p>
                              <p className="text-[10px] text-zinc-600">{step.description}</p>
                              <p className={cn("text-[10px] mt-0.5", step.done ? "text-zinc-500" : "text-zinc-700")}>
                                {step.date}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Buyer Protection */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Buyer Protection</span>
            </div>
            {["Escrow-backed payments", "Quality guarantee", "Dispute resolution", "Verified seller", "OTP-secured pickup"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-zinc-500 py-1.5 border-b border-zinc-800 last:border-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
