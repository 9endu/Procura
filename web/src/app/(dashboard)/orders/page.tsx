"use client";

import { Search, Filter, Box, MapPin, CheckCircle, Package, Truck, AlertCircle } from "lucide-react";
import { mockOrders } from "@/data/mockData";

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-500 mt-1">Track PO status and delivery progression.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-sm">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <Search className="h-4 w-4 text-slate-400" />
             </div>
             <input type="text" placeholder="Search PO Number..." className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-full focus:ring-primary-500 focus:border-primary-500 placeholder-slate-400" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4 text-slate-500" /> Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Status & Tracker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockOrders.map((order) => (
                <tr key={order.po} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-6 text-sm font-bold text-primary-600 cursor-pointer hover:underline">{order.po}</td>
                  <td className="px-6 py-6 text-sm font-medium text-slate-900">{order.supplier}</td>
                  <td className="px-6 py-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                       <Box className="w-4 h-4 text-slate-400" />
                       <span className="font-medium">{order.qty}x</span> {order.items}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-700">${order.cost.toLocaleString()}</td>
                  <td className="px-6 py-6 text-sm text-slate-500">{order.orderDate}</td>
                  <td className="px-6 py-6 min-w-[280px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold
                        ${order.status === 'Delivered' ? 'text-emerald-700 bg-emerald-50' : 
                          order.status === 'Delayed' ? 'text-rose-700 bg-rose-50' : 
                          order.status === 'Shipped' ? 'text-blue-700 bg-blue-50' :
                          'text-amber-700 bg-amber-50'}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">ETA: {order.deliveryDate}</span>
                    </div>
                    {/* Progress Tracker */}
                    <div className="flex items-center justify-between relative mt-3 px-2">
                       <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-slate-200 -z-10 mx-2"></div>
                       {/* Ordered step */}
                       <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 ${['Ordered', 'Shipped', 'Delivered', 'Delayed'].includes(order.status) ? 'bg-primary-500 text-white ring-2 ring-white' : 'bg-slate-200 ring-2 ring-white'}`}>
                          {['Shipped', 'Delivered', 'Delayed'].includes(order.status) ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                       </div>
                       {/* Shipped/Delayed step */}
                       <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 
                          ${order.status === 'Delivered' ? 'bg-primary-500 text-white ring-2 ring-white' : 
                            order.status === 'Delayed' ? 'bg-rose-500 text-white ring-2 ring-white' :
                            order.status === 'Shipped' ? 'bg-primary-500 text-white ring-2 ring-white' : 'bg-slate-200 ring-2 ring-white'}`}
                       >
                          {order.status === 'Delayed' ? <AlertCircle className="w-3 h-3" /> : (order.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-white"></div>)}
                       </div>
                       {/* Delivered step */}
                       <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 ${order.status === 'Delivered' ? 'bg-emerald-500 text-white ring-2 ring-white' : 'bg-slate-200 ring-2 ring-white'}`}>
                          {order.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : <MapPin className="w-2 h-2" />}
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
