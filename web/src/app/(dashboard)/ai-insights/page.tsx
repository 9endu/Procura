"use client";

import { Brain, TrendingUp, AlertTriangle, Lightbulb, PackageSearch } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { mockAiInsights } from "@/data/mockData";

export default function AiInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Intelligence Hub</h1>
          <p className="text-slate-500 mt-1">Predictive analytics, demand forecasting, and risk alerts.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg border border-primary-200 text-sm font-semibold shadow-sm">
          <Brain className="w-4 h-4" /> AI Confidence Score: 94%
        </div>
      </div>

      {/* Top Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Smart Reorder Suggestions</h2>
          </div>
          <div className="space-y-3">
             {mockAiInsights.reorderSuggestions.map((req, idx) => (
               <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                       <PackageSearch className="w-4 h-4 text-slate-500" /> {req.item}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.urgency === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{req.urgency} Urgency</span>
                  </div>
                  <p className="text-sm text-slate-600">{req.reason}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-900">Procurement Risk Alerts</h2>
          </div>
          <div className="space-y-3">
             {mockAiInsights.riskAlerts.map((risk, idx) => (
               <div key={idx} className="p-4 bg-rose-50/50 rounded-lg border border-rose-100 border-l-4 border-l-rose-500 hover:bg-rose-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{risk.risk}</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{risk.detail}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Forecasting Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Prediction */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-primary-600" /> IT Equipment Price Forecast
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAiInsights.priceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v)=>`$${v}k`} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={3} dot={{r:4}} name="Actual ($)" />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={false} name="AI Predicted ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Demand Volume Prediction</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAiInsights.priceTrend}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" name="Volume Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
