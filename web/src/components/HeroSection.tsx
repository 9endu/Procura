"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, TrendingDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#09090b]" />
      <div className="absolute inset-0 line-grid opacity-60" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-violet-600/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Collective Buying</span>
          <span className="text-indigo-500">→</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6"
        >
          Collective Buying.{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text-brand">Smarter Margins.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10"
        >
          Join buying pools with hundreds of businesses. Procura&apos;s AI groups you with like-minded buyers to unlock real wholesale prices — no warehouse, no massive capital needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-semibold text-base transition-all shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] w-full sm:w-auto justify-center"
          >
            Start Buying Together <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#pools"
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-2xl font-semibold text-base transition-all w-full sm:w-auto justify-center"
          >
            Browse Active Pools
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span><strong className="text-zinc-200">2,400+</strong> active buyers</span>
          </div>
          <div className="w-px h-4 bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Avg. <strong className="text-zinc-200">43% off</strong> MRP</span>
          </div>
          <div className="w-px h-4 bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span><strong className="text-zinc-200">180+</strong> active pools</span>
          </div>
        </motion.div>
      </div>

      {/* Floating pool preview cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-20"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Lays Chips Pool", progress: 85, discount: "60% off", buyers: 102, color: "from-indigo-500 to-violet-500" },
            { name: "Red Bull Bulk Deal", progress: 60, discount: "49% off", buyers: 45, color: "from-blue-500 to-indigo-500" },
            { name: "Oreo Family Pack", progress: 40, discount: "57% off", buyers: 28, color: "from-violet-500 to-fuchsia-500" },
          ].map((pool, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-4 border border-white/[0.06] hover:border-indigo-500/20 transition-all"
            >
              <p className="text-xs font-semibold text-zinc-400 mb-1 truncate">{pool.name}</p>
              <p className="text-lg font-black text-white mb-2">{pool.discount}</p>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pool.progress}%` }}
                  transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${pool.color}`}
                />
              </div>
              <p className="text-[10px] text-zinc-600">{pool.buyers} buyers joined</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
    </section>
  );
}
