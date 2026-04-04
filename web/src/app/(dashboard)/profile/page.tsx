"use client";

import { useState } from "react";
import { User, Building, Mail, Phone, MapPin, Shield, Camera } from "lucide-react";
import { mockTrustProfile } from "@/data/mockData";
import { Card, SectionHeader } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

const tabs = ["Profile", "Business Info", "Security", "Notifications"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      {/* Header card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative">
            <Avatar name="Rahul Kumar" size="xl" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center border-2 border-zinc-950 transition-colors">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">Rahul Kumar</h1>
            <p className="text-zinc-500 text-sm">rahul@procura.app</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="active" dot>Verified</Badge>
              <Badge variant="indigo">Gold Member</Badge>
              <span className="text-xs text-zinc-600">Since {mockTrustProfile.memberSince}</span>
            </div>
          </div>
          <CircularProgress value={(mockTrustProfile.score / mockTrustProfile.maxScore) * 100} size={64} strokeWidth={6}>
            <span className="text-xs font-black text-white">{mockTrustProfile.score}</span>
          </CircularProgress>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Profile" && (
        <Card className="p-6 space-y-5">
          <SectionHeader title="Personal Information" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="text" defaultValue="Rahul Kumar" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="email" defaultValue="rahul@procura.app" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="tel" defaultValue="+91 98765 43210" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="text" defaultValue="Bengaluru, Karnataka" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="md">Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === "Business Info" && (
        <Card className="p-6 space-y-5">
          <SectionHeader title="Business Details" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Business Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="text" defaultValue="QuickMart Retail Pvt Ltd" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Business Type</label>
              <select className={inputClass}>
                <option selected>Retailer</option>
                <option>Wholesaler</option>
                <option>Distributor</option>
                <option>Supplier</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>GST Number</label>
              <input type="text" defaultValue="29ABCDE1234F1Z5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>PAN Number</label>
              <input type="text" defaultValue="ABCDE1234F" className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="md">Update Business</Button>
          </div>
        </Card>
      )}

      {activeTab === "Security" && (
        <Card className="p-6 space-y-5">
          <SectionHeader title="Password & Security" />
          <div className="space-y-4">
            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
              <div key={label}>
                <p className={labelClass}>{label}</p>
                <input type="password" placeholder="••••••••" className={inputClass} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                <p className="text-xs text-zinc-500">Add an extra layer of security</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="md">Update Password</Button>
          </div>
        </Card>
      )}

      {activeTab === "Notifications" && (
        <Card className="p-6 space-y-4">
          <SectionHeader title="Notification Preferences" />
          {[
            { label: "Pool updates", desc: "When a pool you joined reaches milestones" },
            { label: "New AI recommendations", desc: "Personalized deal alerts from our AI" },
            { label: "Transaction receipts", desc: "Confirmations for payments and orders" },
            { label: "Pool filling alerts", desc: "When a pool you're watching is almost full" },
            { label: "Weekly digest", desc: "Summary of savings and pool activity" },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/40 transition-colors">
              <div>
                <p className="text-sm font-medium text-zinc-200">{n.label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{n.desc}</p>
              </div>
              <div className="w-9 h-5 bg-indigo-600 rounded-full relative cursor-pointer flex-shrink-0">
                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
