"use client";

import { useState } from "react";
import { ShoppingCart, Plus, History, Clock } from "lucide-react";
import { mockRequests } from "@/data/mockData";

export default function Requests() {
  const [activeTab, setActiveTab] = useState<"history" | "new">("history");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Requests</h1>
          <p className="text-slate-500 mt-1">Submit and track procurement requests.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <History className="w-4 h-4" /> Request History
        </button>
        <button 
          onClick={() => setActiveTab("new")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'new' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Plus className="w-4 h-4" /> Create Request
        </button>
      </div>

      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{req.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{req.item}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{req.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.qty}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {req.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold
                        ${req.priority === 'High' ? 'text-rose-700 bg-rose-50' : req.priority === 'Medium' ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-100'}`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                        ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                          req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                          'bg-blue-100 text-blue-700'}`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "new" && (
        <form className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900 mb-6">New Purchase Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
              <input type="text" placeholder="E.g., MacBook Pro 16&quot;" className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900 bg-white">
                <option>IT Equipment</option>
                <option>Office Supplies</option>
                <option>Furniture</option>
                <option>Software</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input type="number" min="1" defaultValue="1" className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" placeholder="E.g., Engineering" className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900 bg-white">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Required Date</label>
              <input type="date" className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Budget ($)</label>
              <input type="number" placeholder="Optional" className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Justification</label>
              <textarea rows={4} placeholder="Reason for purchase..." className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-900 resize-none"></textarea>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="button" onClick={() => setActiveTab("history")} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="button" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 transition-colors shadow-sm">
              Submit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
