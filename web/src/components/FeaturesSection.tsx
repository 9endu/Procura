"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users2, Brain, BadgeDollarSign, ShieldCheck, Zap, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Users2,
    iconColor: "text-indigo-400",
    iconBg: "from-indigo-600/10 to-transparent",
    border: "group-hover:border-indigo-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]",
    title: "Group Purchasing Power",
    description: "Combine buying intent with hundreds of others to reach MOQ for genuine wholesale prices.",
  },
  {
    icon: Brain,
    iconColor: "text-violet-400",
    iconBg: "from-violet-600/10 to-transparent",
    border: "group-hover:border-violet-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]",
    title: "AI-Curated Deals",
    description: "Our AI matches your preferences and finds the most cost-effective bulk opportunities in real-time.",
  },
  {
    icon: BadgeDollarSign,
    iconColor: "text-emerald-400",
    iconBg: "from-emerald-600/10 to-transparent",
    border: "group-hover:border-emerald-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    title: "Transparent Pricing",
    description: "See exactly how much you save. As the pool grows, the price drops — guaranteed.",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-blue-400",
    iconBg: "from-blue-600/10 to-transparent",
    border: "group-hover:border-blue-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
    title: "Verified Suppliers",
    description: "All sellers are vetted and verified. Quality assurance and escrow-backed payments.",
  },
  {
    icon: Zap,
    iconColor: "text-amber-400",
    iconBg: "from-amber-600/10 to-transparent",
    border: "group-hover:border-amber-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    title: "Lightning Fast Pools",
    description: "Most pools fill within 48 hours. Get your bulk order processed and delivered fast.",
  },
  {
    icon: BarChart3,
    iconColor: "text-rose-400",
    iconBg: "from-rose-600/10 to-transparent",
    border: "group-hover:border-rose-500/30",
    glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]",
    title: "Savings Analytics",
    description: "Track your savings, pool history, and trust score on a beautiful real-time dashboard.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 line-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Why Buy on <span className="gradient-text-brand">Procura?</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            We&apos;ve reimagined wholesale buying. No warehouse, no massive capital — just collective intelligence and smarter margins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.07 }}
              className={`group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 cursor-default relative overflow-hidden ${feature.border} ${feature.glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-semibold text-base transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]"
          >
            Join 2,400+ Buyers Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
