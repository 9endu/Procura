"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Clock, Users, ChevronRight, Zap } from "lucide-react";
import { mockPools } from "@/data/mockData";
import { PoolProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ActivePools() {
  const displayPools = mockPools.slice(0, 3);

  return (
    <section id="pools" className="py-28 bg-[#09090b] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-4">
              <Zap className="w-3 h-3 text-amber-400" />
              Live Pools — Join Before Time Runs Out
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Trending Pools</h2>
            <p className="text-zinc-400 mt-2 text-lg">FMCG bulk deals filling fast. Every buyer makes the price drop.</p>
          </div>
          <Link
            href="/pools"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All Pools <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Pool cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPools.map((pool, idx) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col"
            >
              {/* Image placeholder / product icon */}
              <div className="relative h-52 bg-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10" />
                <Package className="w-20 h-20 text-zinc-700 group-hover:text-zinc-600 group-hover:scale-110 transition-all duration-500" />
                {/* Discount badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-black tracking-wider shadow-lg">
                    SAVE {pool.discount}%
                  </span>
                </div>
                {/* Status */}
                <div className="absolute top-4 right-4">
                  <Badge variant={pool.status === "Filling Fast" ? "filling" : "active"} dot>
                    {pool.status}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">{pool.category}</div>
                <h3 className="text-base font-bold text-white mb-3 line-clamp-2">{pool.name}</h3>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-2xl font-black text-white">${pool.poolPrice}</span>
                  <span className="text-sm text-zinc-600 line-through">MRP ${pool.mrp}</span>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <PoolProgress value={pool.progress} showLabel animate size="md" />
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs text-zinc-500 bg-zinc-800/60 rounded-xl p-3 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{pool.buyers} buyers</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-700" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pool.timeRemaining} left</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-700" />
                  <div className="text-emerald-400 font-medium">AI {pool.aiMatchScore}%</div>
                </div>

                {/* CTA */}
                <Link
                  href={`/pools/${pool.id}`}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold text-sm text-center transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] block"
                >
                  Join Pool
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <Link
          href="/pools"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 py-4 border border-zinc-800 rounded-xl font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
        >
          View All Pools <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
