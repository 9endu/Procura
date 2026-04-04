"use client";

import { useState } from "react";
import { CreditCard, Download, Search, ArrowUpDown } from "lucide-react";
import { mockTransactions } from "@/data/mockData";
import { Card, SectionHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTransactions.filter(
    (t) =>
      t.pool.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = mockTransactions.filter((t) => t.status === "Completed").reduce((acc, t) => acc + t.amount, 0);
  const totalSavings = mockTransactions.filter((t) => t.status === "Completed").reduce((acc, t) => acc + t.savings, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-violet-400" />
            Transactions
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Complete history of your pool purchases and payments.</p>
        </div>
        <Button variant="secondary" size="md" icon={<Download className="w-4 h-4" />}>
          Export CSV
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "text-white" },
          { label: "Total Saved", value: `₹${totalSavings.toLocaleString()}`, color: "text-emerald-400" },
          { label: "Transactions", value: mockTransactions.length, color: "text-indigo-400" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-zinc-600 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <SectionHeader title="All Transactions" />
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                {["Transaction ID", "Pool", "Date", "Amount", "Savings", "Method", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-medium text-indigo-400">{txn.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-zinc-200 line-clamp-1 max-w-[160px]">{txn.pool}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(txn.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-white">₹{txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-emerald-400">₹{txn.savings.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-zinc-500">{txn.paymentMethod}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={txn.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-600 text-sm">No transactions match your search.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
