"use client";

import Link from "next/link";
import { ArrowLeft, Package, Clock, Users, Zap, CheckCircle2, Tag, Star, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { mockPools } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { PoolProgress, CircularProgress } from "@/components/ui/progress";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";

const mockBuyerNames = ["Rahul K", "Priya M", "Ankita S", "Ravi D", "Suresh P", "Meena R", "Ajay T", "Kavya L"];

interface PoolDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PoolDetailPage({ params }: PoolDetailPageProps) {
  const { id } = await params;
  const pool = mockPools.find((p) => p.id === id);
  if (!pool) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Back */}
      <Link href="/pools" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pools
      </Link>

      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-indigo-600/20 via-zinc-900 to-violet-600/10 flex items-center justify-center">
          <Package className="w-24 h-24 text-zinc-700" />
          <div className="absolute top-5 left-5">
            <StatusBadge status={pool.status} />
          </div>
          <div className="absolute top-5 right-5 flex gap-2">
            {pool.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
          <div className="absolute bottom-5 left-5">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {pool.discount}% off
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">{pool.category}</div>
              <h1 className="text-2xl font-black text-white mb-2">{pool.name}</h1>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{pool.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-zinc-600 mb-1">Pool Price</div>
              <div className="text-3xl font-black text-white">${pool.poolPrice}</div>
              <div className="text-sm text-zinc-600 line-through">MRP ${pool.mrp}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main content grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Left — pool progress + join */}
        <div className="md:col-span-2 space-y-5">
          {/* Progress card */}
          <Card className="p-6">
            <div className="flex items-center gap-5 mb-5">
              <CircularProgress value={pool.progress} size={80} strokeWidth={7}>
                <span className="text-sm font-black text-white">{pool.progress}%</span>
              </CircularProgress>
              <div>
                <p className="text-sm font-bold text-white">{pool.filledUnits} / {pool.targetUnits} units committed</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {pool.targetUnits - pool.filledUnits} more units needed to complete
                </p>
              </div>
            </div>
            <PoolProgress value={pool.progress} size="lg" animate />
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: "Buyers", value: `${pool.buyers}/${pool.maxBuyers}`, color: "text-indigo-400" },
              { icon: Clock, label: "Time Left", value: pool.timeRemaining, color: "text-amber-400" },
              { icon: Zap, label: "AI Match", value: `${pool.aiMatchScore}%`, color: "text-violet-400" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="text-lg font-black text-white">{stat.value}</div>
                <div className="text-xs text-zinc-600">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Buyer avatars */}
          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-3">
              <Users className="w-4 h-4 inline mr-2 text-indigo-400" />
              Buyers in this pool
            </p>
            <div className="flex items-center gap-4">
              <AvatarGroup names={mockBuyerNames} max={7} size="sm" />
              <span className="text-xs text-zinc-500">+{pool.buyers - 7} more buyers have joined</span>
            </div>
          </Card>

          {/* Pool details */}
          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-4">Pool Details</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Seller", value: pool.seller },
                { label: "Seller Rating", value: `${pool.sellerRating} ★` },
                { label: "Min. Order", value: `${pool.minOrder} units` },
                { label: "Category", value: pool.category },
              ].map((d) => (
                <div key={d.label} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-500 text-xs">{d.label}</span>
                  <span className="text-zinc-200 font-medium text-xs">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — join CTA */}
        <div className="space-y-5">
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
            <div className="relative z-10">
              <p className="text-xs text-zinc-500 mb-1">Your commitment</p>
              <div className="flex items-center gap-2 mb-4">
                <input type="number" defaultValue={pool.minOrder} min={pool.minOrder}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50"
                />
                <span className="text-xs text-zinc-500 whitespace-nowrap">units</span>
              </div>
              <div className="text-xs text-zinc-500 mb-5 space-y-1">
                <div className="flex justify-between">
                  <span>Pool price</span><span className="text-white font-medium">${pool.poolPrice} / unit</span>
                </div>
                <div className="flex justify-between">
                  <span>You save</span>
                  <span className="text-emerald-400 font-medium">{pool.discount}% vs MRP</span>
                </div>
              </div>
              <Button variant="primary" size="lg" className="w-full mb-3">
                Join This Pool
              </Button>
              <Button variant="secondary" size="md" className="w-full">
                Save for Later
              </Button>
            </div>
          </Card>

          {/* Trust badge */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Buyer Protection</span>
            </div>
            {["Escrow-backed payments", "Quality guarantee", "Dispute resolution", "Verified seller"].map((item) => (
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
