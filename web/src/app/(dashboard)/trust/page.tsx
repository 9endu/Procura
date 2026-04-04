"use client";

import { Shield, Award, Star, CheckCircle2, Clock } from "lucide-react";
import { mockTrustProfile } from "@/data/mockData";
import { Card, SectionHeader } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

export default function TrustPage() {
  const profile = mockTrustProfile;
  const progressToNext = ((profile.score - 750) / (profile.nextTierAt - 750)) * 100;

  const tierColors: Record<string, string> = {
    Bronze: "text-orange-400",
    Silver: "text-zinc-300",
    Gold: "text-amber-400",
    Platinum: "text-indigo-300",
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          Trust & Reputation
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">Your credibility score and badges on the Procura network.</p>
      </div>

      {/* Score + tier card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-indigo-600/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <CircularProgress value={(profile.score / profile.maxScore) * 100} size={120} strokeWidth={8}>
            <div className="text-center">
              <div className="text-2xl font-black text-white">{profile.score}</div>
              <div className="text-[10px] text-zinc-500">/ {profile.maxScore}</div>
            </div>
          </CircularProgress>

          <div className="flex-1 min-w-0">
            <div className={`text-3xl font-black mb-1 ${tierColors[profile.tier]}`}>
              {profile.tier} Tier 🏅
            </div>
            <p className="text-zinc-500 text-sm mb-4">
              {profile.nextTierAt - profile.score} more points to reach <span className={tierColors[profile.nextTier]}>{profile.nextTier}</span>
            </p>

            {/* Tier progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-zinc-600 mb-1">
                <span>{profile.tier}</span><span>{profile.nextTier}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Transactions", value: profile.totalTransactions },
                { label: "Completed Pools", value: profile.completedPools },
                { label: "On-Time Payment", value: profile.onTimePayment },
                { label: "Dispute Rate", value: profile.disputeRate },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-800/50 rounded-xl p-3 text-center">
                  <div className="text-base font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <SectionHeader title="Badges Earned" subtitle={`${profile.badges.filter((b) => b.earned).length}/${profile.badges.length} unlocked`} className="mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profile.badges.map((badge) => (
            <div
              key={badge.name}
              className={`p-4 rounded-2xl border text-center transition-all ${
                badge.earned
                  ? "bg-zinc-800/80 border-indigo-500/30 hover:border-indigo-400/50"
                  : "bg-zinc-900/30 border-zinc-800 opacity-50 grayscale"
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-xs font-bold text-white">{badge.name}</p>
              <p className="text-[10px] text-zinc-600 mt-1">{badge.description}</p>
              {badge.earned && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews */}
      <Card className="p-6">
        <SectionHeader title="Recent Reviews" subtitle="From your co-pool members" className="mb-5" />
        <div className="space-y-4">
          {profile.recentReviews.map((review, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/40 border border-zinc-800">
              <Avatar name={review.reviewer} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-zinc-200">{review.reviewer}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{review.comment}</p>
                <p className="text-[10px] text-zinc-700 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{review.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
