"use client";

import { Download, Printer, BarChart3, PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockAnalytics } from "@/data/mockData";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive procurement data exports and visual breakdowns.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
             <Printer className="w-4 h-4" /> Print PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 shadow-sm transition-colors">
             <Download className="w-4 h-4 text-primary-100" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500 mb-1">Total Fiscal Spend</p>
           <h3 className="text-3xl font-bold text-slate-900 mb-2">$452,500</h3>
           <p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -5.2% vs last year</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500 mb-1">AI Cost Savings</p>
           <h3 className="text-3xl font-bold text-emerald-600 mb-2">$42,300</h3>
           <p className="text-xs text-slate-500 font-medium">Accumulated via optimization</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500 mb-1">Top Supplier</p>
           <h3 className="text-xl font-bold text-slate-900 mb-2 mt-1 truncate">TechNova Solutions</h3>
           <p className="text-xs text-slate-500 font-medium">32% of total volume</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500 mb-1">Most Requested</p>
           <h3 className="text-xl font-bold text-slate-900 mb-2 mt-1 truncate">React JS Dev Servers</h3>
           <p className="text-xs text-slate-500 font-medium">IT Equipment</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
             <BarChart3 className="w-5 h-5 text-primary-600" />
             <h2 className="text-lg font-bold text-slate-900">Spend by Month</h2>
          </div>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockAnalytics.spendTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v)=>`$${v/1000}k`} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="spend" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={50} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
             <PieChartIcon className="w-5 h-5 text-emerald-600" />
             <h2 className="text-lg font-bold text-slate-900">Category Distribution</h2>
          </div>
          <div className="h-72 flex flex-col md:flex-row items-center">
             <div className="w-full h-full flex-1">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={mockAnalytics.categorySpend} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                      {mockAnalytics.categorySpend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex-1 w-full space-y-3 mt-4 md:mt-0 pl-0 md:pl-4">
                {mockAnalytics.categorySpend.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></span>
                      <span className="font-medium text-slate-700">{cat.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{cat.value}%</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
