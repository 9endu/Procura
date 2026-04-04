import type { Metadata } from "next";
import Link from "next/link";
import { Users2, CheckCircle2, TrendingDown, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Procura",
};

const stats = [
  { label: "Active Buyers", value: "2,400+" },
  { label: "Avg. Discount", value: "43%" },
  { label: "Pools Completed", value: "1,200+" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#09090b]">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12 bg-zinc-950 border-r border-white/[0.05]">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-transparent to-violet-600/10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[100px] rounded-full" />
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.4)]">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Pro<span className="text-indigo-400">cura</span>
            </span>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Collective Buying.<br />
            <span className="gradient-text">Smarter Margins.</span>
          </h2>

          <ul className="space-y-4 mb-10">
            {[
              "AI-curated buying pools match your needs",
              "Guaranteed wholesale prices for every buyer",
              "Verified sellers, secure escrow payments",
              "Build trust score and unlock better deals",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-zinc-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-black text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="glass rounded-2xl p-5 border border-white/[0.06]">
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              &quot;Procura saved us ₹2.4L on our quarterly FMCG procurement. The pool matching is incredible — joined a Lays pool and got 60% off within 24 hours.&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">R</div>
              <div>
                <p className="text-xs font-semibold text-white">Rohan Mehta</p>
                <p className="text-xs text-zinc-600">Owner, QuickMart Retail</p>
              </div>
              <Award className="w-4 h-4 text-amber-400 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 bg-[#09090b] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Users2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white">Pro<span className="text-indigo-400">cura</span></span>
        </Link>

        <div className="relative z-10 w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
