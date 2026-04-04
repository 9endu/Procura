"use client";

import { Box, Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { mockProducts } from "@/data/mockData";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Inventory</h1>
          <p className="text-slate-500 mt-1">Manage stock tracking and reorder levels.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-sm">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <Search className="h-4 w-4 text-slate-400" />
             </div>
             <input type="text" placeholder="Search product ID or name..." className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-full focus:ring-primary-500 focus:border-primary-500 placeholder-slate-400" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" /> Categories
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Product ID</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Qty</th>
                <th className="px-6 py-4">Reorder Lvl</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{prod.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{prod.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{prod.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{prod.stock}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{prod.reorderLevel}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">${prod.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                      ${prod.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                        prod.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'}`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button className="text-slate-400 hover:text-primary-600 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Showing 1 to 5 of 124 products</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-primary-50 text-primary-600 border border-primary-200 rounded font-medium">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
