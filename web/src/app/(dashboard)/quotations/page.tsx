"use client";

import { FileText, Sparkles, Award, Zap, DollarSign } from "lucide-react";
import { mockQuotations } from "@/data/mockData";

export default function Quotations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotation Comparison</h1>
          <p className="text-slate-500 mt-1">AI-assisted analysis of RFQ responses for PR-2023-001 (MacBook Pro 16").</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Quote Price</th>
                  <th className="px-6 py-4">Delivery</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Quality Score</th>
                  <th className="px-6 py-4">Overall Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockQuotations.map((quote) => (
                  <tr key={quote.vendor} className={`${quote.isAiRecommended ? 'bg-primary-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {quote.vendor}
                        {quote.isAiRecommended && <span className="bg-primary-100 text-primary-700 text-[10px] px-2 py-0.5 rounded font-bold ml-2 hidden sm:inline-block">AI PICK</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        ${quote.quote.toLocaleString()}
                        {quote.quote === Math.min(...mockQuotations.map(q => q.quote)) && <DollarSign className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-700 flex items-center gap-2">
                        {quote.delivery}
                        {quote.delivery === "2 Days" && <Zap className="w-4 h-4 text-amber-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-700">★ {quote.rating}</td>
                    <td className="px-6 py-5 font-medium text-slate-700">{quote.qualityScore}/100</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 max-w-[100px]">
                          <div className={`h-2.5 rounded-full ${quote.overallScore > 90 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${quote.overallScore}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{quote.overallScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation Panel */}
        <div className="bg-gradient-to-b from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24" />
           </div>
           
           <div className="flex items-center gap-2 mb-6">
             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               <Award className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-lg font-bold">AI Recommendation</h2>
           </div>

           <div className="mb-6 relative z-10">
              <p className="text-primary-100 text-sm font-medium mb-1">Recommended Supplier</p>
              <h3 className="text-2xl font-extrabold text-white">TechNova Solutions</h3>
           </div>

           <div className="space-y-4 relative z-10">
              <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-primary-100 text-xs font-medium mb-1">Reasoning</p>
                <p className="text-sm">TechNova offers the best balance of price reliability (98%) and extended warranty (2 Years), yielding the highest long-term ROI score (95/100).</p>
              </div>
              
              <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-primary-100 text-xs font-medium mb-1">Predicted Cost Efficiency</p>
                <p className="text-sm font-bold text-emerald-400">+12% vs Historical Average</p>
              </div>
           </div>

           <button className="w-full mt-6 bg-white text-primary-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
             Approve Quotation
           </button>
        </div>
      </div>
    </div>
  );
}
