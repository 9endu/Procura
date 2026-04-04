import Link from "next/link";
import { Users2, Mail, Globe, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Users2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Pro<span className="text-indigo-400">cura</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5 max-w-xs">
              The AI-assisted pooled wholesale buying platform. Democratizing bulk discounts for every business.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageSquare, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              {["How it Works", "Active Pools", "Offers", "AI Recommendations"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-indigo-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              {["About Procura", "Blog", "Careers", "Contact Us"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-indigo-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              {["Privacy Policy", "Terms of Service", "Escrow Guidelines", "Cookie Policy"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-indigo-400 transition-colors">{l}</Link></li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-xs text-zinc-600 mb-2 font-medium">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 min-w-0"
                />
                <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-semibold transition-colors flex-shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Procura Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
            <span>MCA Final Year Project — 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
