"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Package, Star, Clock, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { useOffers } from "@/services/offerService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Grains & Staples", "Dairy & Eggs", "Oils & Fats", "Spices & Condiments", "Snacks"];

const badgeVariantMap: Record<string, "indigo" | "emerald" | "green" | "orange" | "purple" | "blue"> = {
  indigo: "indigo",
  emerald: "emerald",
  green: "green",
  orange: "orange",
  purple: "purple",
  blue: "blue",
};

// ── Skeleton card shown while data is loading ──────────────────────────────
function OfferCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-zinc-700 rounded" />
        <div className="h-4 w-2/3 bg-zinc-700 rounded" />
        <div className="h-3 w-1/2 bg-zinc-700 rounded" />
        <div className="h-7 w-1/3 bg-zinc-700 rounded" />
        <div className="flex gap-2 mt-4">
          <div className="flex-1 h-10 bg-zinc-700 rounded-xl" />
          <div className="w-10 h-10 bg-zinc-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: offers, isLoading, isError, error } = useOffers();

  const filtered = (offers ?? []).filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || o.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Offers Marketplace</h1>
          <p className="text-zinc-500 mt-1 text-sm">Browse and join verified wholesale offers from top suppliers.</p>
        </div>
        <Link href="/offers/upload">
          <Button variant="secondary" size="md">+ List Your Offer</Button>
        </Link>
      </div>

      {/* Search + filter bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              id="offer-search"
              placeholder="Search offers, sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <Button variant="secondary" size="md" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`category-${cat.replace(/\s+/g, "-").replace(/&/g, "and").toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Could not reach the backend — showing cached offer data.{" "}
            <span className="text-red-500/70 text-xs">{String(error)}</span>
          </span>
        </div>
      )}

      {/* Results count / loading indicator */}
      {isLoading ? (
        <p className="text-xs text-zinc-600 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> Loading offers…
        </p>
      ) : (
        <p className="text-xs text-zinc-600">
          {filtered.length} offer{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Offer grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <OfferCardSkeleton key={i} />)
          : filtered.map((offer) => (
              <Card key={offer.id} hover className="overflow-hidden group">
                {/* Image area */}
                <div className="relative h-44 bg-zinc-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
                  <Package className="w-16 h-16 text-zinc-700 group-hover:text-zinc-600 transition-colors" />
                  {offer.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge variant={badgeVariantMap[offer.badgeColor ?? "indigo"] ?? "indigo"}>
                        {offer.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-lg">
                    {offer.discount}% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    {offer.category}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{offer.title}</h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    {offer.seller} {offer.verified && "✓"}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-black text-white">₹{offer.bulkPrice}</span>
                    <span className="text-xs text-zinc-600 line-through">₹{offer.unitPrice}</span>
                    <span className="text-xs text-zinc-500">/ {offer.unit}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {offer.rating.toFixed(1)}
                    </span>
                    <span>({offer.reviews})</span>
                    <span className="ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {offer.deliveryDays}d delivery
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id={`start-pool-${offer.id}`}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold transition-all"
                    >
                      Start Pool
                    </button>
                    <button
                      id={`view-offer-${offer.id}`}
                      className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
