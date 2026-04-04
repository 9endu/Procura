"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Package, ShoppingBag, Zap, Brain } from "lucide-react";
import { mockRecommendations } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            AI Recommendations
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Personalized pool and offer suggestions based on your buying history and network.</p>
        </div>
        <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full font-semibold">
          Updated just now
        </span>
      </div>

      {/* AI model card */}
      <Card className="p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-violet-600/5 to-transparent" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Procura AI Engine</p>
            <p className="text-xs text-zinc-500 mt-0.5">Analyzing your 23 past transactions, purchase categories, and 156-person network to surface the best deals.</p>
          </div>
        </div>
      </Card>

      {/* Recommendation cards */}
      <div className="space-y-4">
        {mockRecommendations.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hover className="p-5 group">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                {/* Match score ring */}
                <div className="flex-shrink-0">
                  <CircularProgress value={rec.matchScore} size={72} strokeWidth={6}>
                    <span className="text-xs font-black text-white">{rec.matchScore}%</span>
                  </CircularProgress>
                  <p className="text-[10px] text-zinc-600 text-center mt-1">Match</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={rec.type === "pool" ? "indigo" : "purple"}>
                          {rec.type === "pool" ? "Buying Pool" : "Direct Offer"}
                        </Badge>
                        <span className="text-[10px] text-amber-400 font-semibold">{rec.urgency}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{rec.title}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{rec.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-emerald-400">{rec.savings}</p>
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.reasons.map((r) => (
                      <span key={r} className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-indigo-400" />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <Link href={rec.type === "pool" && rec.pool ? `/pools/${rec.pool.id}` : "/offers"}>
                    <Button variant="primary" size="md" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
                      {rec.action}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
