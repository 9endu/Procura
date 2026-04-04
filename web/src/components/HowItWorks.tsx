"use client";

import { motion } from "framer-motion";
import { Search, Users2, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Browse & Discover",
    description: "Explore AI-curated offers and active buying pools across FMCG, grocery, and essentials categories.",
    highlight: "Smart AI matching",
  },
  {
    number: "02",
    icon: Users2,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    title: "Join a Pool",
    description: "Commit your units to a shared buying pool. As more buyers join, everyone unlocks deeper wholesale discounts.",
    highlight: "Collective power",
  },
  {
    number: "03",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Pay & Receive",
    description: "Once the pool hits its target, payment is processed. Your goods are delivered directly — no middlemen.",
    highlight: "Direct delivery",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-[#09090b] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Simple 3-step process
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            How <span className="gradient-text">Procura</span> Works
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            From browsing to delivery — we handle the complexity. You just buy smarter.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting dashes */}
          <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-px border-t border-dashed border-zinc-800" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="text-[10px] font-black tracking-widest text-zinc-700 mb-4">{step.number}</div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${step.iconBg}`}>
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4 max-w-xs">{step.description}</p>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {step.highlight}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
