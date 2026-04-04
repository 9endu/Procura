"use client";

import { Users, UserPlus, Search, Filter, Star, ShieldCheck, Mail, Phone, Sparkles } from "lucide-react";
import { mockVendors } from "@/data/mockData";

export default function Vendors() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
          <p className="text-slate-500 mt-1">Directory of partnered suppliers and ratings.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-sm">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <Search className="h-4 w-4 text-slate-400" />
             </div>
             <input type="text" placeholder="Search vendor name or ID..." className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-full focus:ring-primary-500 focus:border-primary-500 placeholder-slate-400" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-500" /> Filter Rating
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/50">
           {mockVendors.map((vendor) => (
             <div key={vendor.id} className={`bg-white rounded-xl border ${vendor.recommended ? 'border-primary-300 ring-1 ring-primary-100 shadow-md transform hover:-translate-y-1' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm transform hover:-translate-y-0.5'} transition-all p-5 relative overflow-hidden group cursor-pointer`}>
                
                {vendor.recommended && (
                  <div className="absolute top-0 right-0 bg-primary-50 text-primary-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10 border-b border-l border-primary-200">
                    <Sparkles className="w-3 h-3 text-primary-500" /> AI RECOMMENDED
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg border-2 border-white shadow-sm">
                     {vendor.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                     <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{vendor.name}</h3>
                     <p className="text-xs text-slate-500 font-medium">ID: {vendor.id}</p>
                   </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-slate-400" /> Contact: <span className="text-slate-900">{vendor.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" /> <a href={`mailto:${vendor.email}`} className="text-primary-600 hover:underline truncate">{vendor.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" /> {vendor.phone}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Rating</span>
                      <div className="flex items-center gap-1 mt-0.5">
                         <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                         <span className="text-sm font-bold text-slate-700">{vendor.rating}</span>
                      </div>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="flex flex-col text-right">
                      <span className="text-xs text-slate-500">Reliability</span>
                      <span className={`text-sm font-bold ${vendor.reliability > '90%' ? 'text-emerald-600' : 'text-amber-600'}`}>{vendor.reliability}</span>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="flex flex-col text-right">
                      <span className="text-xs text-slate-500">Status</span>
                      <span className={`text-sm font-bold ${vendor.status === 'Active' ? 'text-emerald-600':'text-rose-600'}`}>{vendor.status}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
