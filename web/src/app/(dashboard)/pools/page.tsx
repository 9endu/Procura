"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Users, Package, Search, Filter, ArrowUpRight } from "lucide-react";
import { usePools } from "@/services/poolService";
import { Card } from "@/components/ui/card";
import { PoolProgress } from "@/components/ui/progress";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sortOptions = ["Most Popular", "Ending Soon", "Discount ↑", "AI Match"];

export default function PoolsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most Popular");

  const { data: pools = [], isLoading, isError } = usePools();

  const filtered = pools.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-zinc-500 py-10 text-center animate-pulse font-medium">Loading AI-matched pools...</div>;
  }

  if (isError) {
    return <div className="text-red-500 py-10 text-center font-medium">Failed to load pools. Please try again.</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Buying Pools</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {pools.length} active pools · Join to unlock wholesale prices
          </p>
        </div>
        <Link href="/offers/upload">
          <Button variant="primary" size="md">+ Start a Pool</Button>
        </Link>
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Search pools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {sortOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  sort === s
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Pool list */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((pool) => (
          <Link key={pool.id} href={`/pools/${pool.id}`}>
            <Card hover className="p-5 group">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-indigo-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {pool.name}
                    </h3>
                    <StatusBadge status={pool.status} />
                  </div>
                  <p className="text-xs text-zinc-600 mb-3">{pool.seller} · {pool.category}</p>

                  {/* Progress */}
                  <PoolProgress value={pool.progress} showLabel size="sm" className="mb-3" />

                  {/* Stats strips */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                      {pool.discount}% off
                    </span>
                    <div className="w-px h-3 bg-zinc-800" />
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-indigo-400" />{pool.buyers}/{pool.maxBuyers}</span>
                    <div className="w-px h-3 bg-zinc-800" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" />{pool.timeRemaining}</span>
                    <div className="w-px h-3 bg-zinc-800" />
                    <span className="text-violet-400 font-medium">AI {pool.aiMatchScore}%</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pool.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
