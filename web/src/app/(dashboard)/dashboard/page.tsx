"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users2, DollarSign, ShoppingBag, Shield, TrendingUp, ArrowUpRight, Clock, Sparkles, Zap,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockAnalytics, mockDashboardKPIs, mockPools, mockTransactions, mockRecommendations } from "@/data/mockData";
import { KPIWidget } from "@/components/ui/kpi-widget";
import { Card, SectionHeader } from "@/components/ui/card";
import { PoolProgress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const kpis = [
    {
      label: "Active Pools",
      value: mockDashboardKPIs.activePools,
      icon: <Users2 className="w-5 h-5" />,
      iconColor: "text-indigo-400",
      trend: { value: "+2 this week", direction: "up" as const },
      accent: "bg-gradient-to-r from-indigo-500/50 via-indigo-400/30 to-transparent",
    },
    {
      label: "Total Savings",
      value: `₹${mockDashboardKPIs.totalSavings.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      iconColor: "text-emerald-400",
      trend: { value: "₹1,540 this month", direction: "up" as const },
      accent: "bg-gradient-to-r from-emerald-500/50 via-emerald-400/30 to-transparent",
    },
    {
      label: "Offers Available",
      value: mockDashboardKPIs.offersAvailable,
      icon: <ShoppingBag className="w-5 h-5" />,
      iconColor: "text-violet-400",
      trend: { value: "+6 new today", direction: "up" as const },
      accent: "bg-gradient-to-r from-violet-500/50 via-violet-400/30 to-transparent",
    },
    {
      label: "Trust Score",
      value: mockDashboardKPIs.trustScore,
      icon: <Shield className="w-5 h-5" />,
      iconColor: "text-amber-400",
      trend: { value: "Gold Tier", direction: "neutral" as const },
      accent: "bg-gradient-to-r from-amber-500/50 via-amber-400/30 to-transparent",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Good evening, Rahul 👋</h1>
          <p className="text-zinc-500 mt-1 text-sm">Here&apos;s what&apos;s happening with your buying pools.</p>
        </div>
        <Link href="/offers">
          <Button variant="primary" size="md" icon={<ShoppingBag className="w-4 h-4" />}>
            Browse Offers
          </Button>
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <KPIWidget {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Spend chart */}
        <Card className="xl:col-span-2 p-6">
          <SectionHeader
            title="Spending Trend"
            subtitle="Monthly procurement overview"
            action={
              <Button variant="ghost" size="sm" iconRight={<TrendingUp className="w-3.5 h-3.5" />}>
                6 Months
              </Button>
            }
            className="mb-6"
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalytics.spendTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} width={42} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Spend"]}
                  contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", color: "#fafafa", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", stroke: "#09090b", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#818cf8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Recommendation banner */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/5 rounded-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Picks for You</span>
            </div>
            <div className="space-y-3">
              {mockRecommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-indigo-500/30 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{rec.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{rec.savings} · {rec.urgency}</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 flex-shrink-0">{rec.matchScore}%</span>
                </div>
              ))}
            </div>
            <Link href="/recommendations">
              <Button variant="outline" size="sm" className="w-full mt-4" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
                View All Recommendations
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Active pools */}
        <Card className="p-6">
          <SectionHeader
            title="Your Active Pools"
            action={
              <Link href="/pools" className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
            className="mb-5"
          />
          <div className="space-y-4">
            {mockPools.slice(0, 3).map((pool) => (
              <Link key={pool.id} href={`/pools/${pool.id}`} className="block">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{pool.name}</p>
                    <PoolProgress value={pool.progress} size="sm" className="mt-1.5" />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-400">{pool.discount}% off</p>
                    <p className="text-[10px] text-zinc-600 flex items-center gap-0.5 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />{pool.timeRemaining}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <SectionHeader
            title="Recent Transactions"
            action={
              <Link href="/transactions" className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
            className="mb-5"
          />
          <div className="space-y-3">
            {mockTransactions.slice(0, 4).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-300 truncate">{txn.pool}</p>
                    <p className="text-[10px] text-zinc-600">{txn.id} · {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">₹{txn.amount.toLocaleString()}</p>
                  <StatusBadge status={txn.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
