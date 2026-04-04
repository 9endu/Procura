"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadOfferPage() {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/offers");
  };

  const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/offers" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">List Your Offer</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Create a wholesale offer and invite buyers to form a pool.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <Card className="p-6">
          <p className={labelClass}>Product Images</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer ${
              dragOver
                ? "border-indigo-500/60 bg-indigo-500/5"
                : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-300">Drag & drop product images</p>
              <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors">
              <Upload className="w-3.5 h-3.5" /> Browse Files
            </button>
          </div>
        </Card>

        {/* Product details */}
        <Card className="p-6 space-y-5">
          <p className="text-sm font-bold text-white">Product Details</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input required type="text" placeholder="e.g. Lays Classic Chips 400 Units" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select required className={inputClass}>
                <option value="">Select category...</option>
                <option>Snacks</option>
                <option>Beverages</option>
                <option>Grains & Staples</option>
                <option>Dairy & Eggs</option>
                <option>Oils & Fats</option>
                <option>Spices & Condiments</option>
                <option>Instant Foods</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Product Description</label>
            <textarea rows={3} placeholder="Describe the product, quality, packaging..." className={`${inputClass} resize-none`} />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>MRP (₹) *</label>
              <input required type="number" placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pool Price (₹) *</label>
              <input required type="number" placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Min. Order Qty *</label>
              <input required type="number" placeholder="e.g. 50" className={inputClass} />
            </div>
          </div>
        </Card>

        {/* Pool settings */}
        <Card className="p-6 space-y-5">
          <p className="text-sm font-bold text-white">Pool Settings</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Target Units</label>
              <input type="number" placeholder="e.g. 400" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pool Duration</label>
              <select className={inputClass}>
                <option>3 Days</option>
                <option>5 Days</option>
                <option>7 Days</option>
                <option>14 Days</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Delivery Days</label>
              <input type="number" placeholder="e.g. 3" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unit of Measure</label>
              <input type="text" placeholder="e.g. kg, pack, liter" className={inputClass} />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link href="/offers">
            <Button variant="secondary" size="lg" type="button">Cancel</Button>
          </Link>
          <Button variant="primary" size="lg" loading={loading} type="submit">
            Publish Offer
          </Button>
        </div>
      </form>
    </div>
  );
}
