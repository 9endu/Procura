"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreatePool } from "@/services/poolService";
import {
  ArrowLeft,
  Link2,
  ImageIcon,
  FileText,
  Type,
  Sparkles,
  Upload,
  X,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  Copy,
  Users2,
  Package,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Eye,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────── */

type InputMode = "url" | "image" | "pdf" | "text";
type ParseStep = "idle" | "parsing" | "done";

interface ConfidenceField {
  value: string;
  confidence: number; // 0–100
}

interface ParsedOffer {
  productName: ConfidenceField;
  brand: ConfidenceField;
  category: ConfidenceField;
  packSize: ConfidenceField;
  unit: ConfidenceField;
  price: ConfidenceField;
  moq: ConfidenceField;
  offerType: ConfidenceField;
  supplierName: ConfidenceField;
  sourceRef: ConfidenceField;
}

/* ─── Mock Data ───────────────────────────────────────── */

const MOCK_PARSED: ParsedOffer = {
  productName: { value: "Tata Sampann Unpolished Toor Dal", confidence: 97 },
  brand: { value: "Tata Sampann", confidence: 95 },
  category: { value: "Grains & Staples", confidence: 92 },
  packSize: { value: "1 kg × 30 units", confidence: 88 },
  unit: { value: "kg", confidence: 94 },
  price: { value: "₹142.00", confidence: 96 },
  moq: { value: "30 units", confidence: 85 },
  offerType: { value: "Slab Discount", confidence: 78 },
  supplierName: { value: "Sri Balaji Wholesale Traders", confidence: 91 },
  sourceRef: { value: "IndiaMART Listing #IN-48291", confidence: 73 },
};

const MOCK_SIMILAR_POOLS = [
  {
    id: 1,
    name: "Toor Dal 1kg Pool",
    members: 12,
    target: 200,
    filled: 145,
    price: "₹138",
    daysLeft: 3,
  },
  {
    id: 2,
    name: "Premium Dal Bulk Buy",
    members: 8,
    target: 100,
    filled: 67,
    price: "₹145",
    daysLeft: 5,
  },
];

/* ─── Parsing Progress Messages ─────────────────────── */

const PARSE_MESSAGES = [
  "Analyzing input source...",
  "Extracting product information...",
  "Identifying brand & category...",
  "Detecting pricing structure...",
  "Matching against product database...",
  "Calculating confidence scores...",
  "Generating structured preview...",
];

/* ─── Confidence Helpers ──────────────────────────────── */

function confidenceColor(c: number) {
  if (c >= 90) return "text-emerald-400";
  if (c >= 75) return "text-amber-400";
  return "text-rose-400";
}

function confidenceBg(c: number) {
  if (c >= 90) return "bg-emerald-500/10 border-emerald-500/20";
  if (c >= 75) return "bg-amber-500/10 border-amber-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

function confidenceLabel(c: number) {
  if (c >= 90) return "High";
  if (c >= 75) return "Medium";
  return "Low";
}

/* ─── Input Type Tab Config ───────────────────────────── */

const INPUT_TABS: { key: InputMode; label: string; icon: typeof Link2; desc: string }[] = [
  { key: "url", label: "Product URL", icon: Link2, desc: "Paste a link from IndiaMART, Amazon, etc." },
  { key: "image", label: "Image Upload", icon: ImageIcon, desc: "Upload a screenshot or catalog photo" },
  { key: "pdf", label: "PDF Upload", icon: FileText, desc: "Upload a supplier catalog or price list" },
  { key: "text", label: "Paste Text", icon: Type, desc: "Paste raw offer or quotation text" },
];

/* ─── Component ───────────────────────────────────────── */

export default function OfferUploadPage() {
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [parseStep, setParseStep] = useState<ParseStep>("idle");
  const [parseProgress, setParseProgress] = useState(0);
  const [parseMsg, setParseMsg] = useState("");
  const [parsed, setParsed] = useState<ParsedOffer | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [showDuplicateNotice, setShowDuplicateNotice] = useState(true);
  const [showSimilarPools, setShowSimilarPools] = useState(true);

  const router = useRouter();
  const createPoolMutation = useCreatePool();

  // Input state
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Handlers ──────────────────────────────────────── */

  const hasInput = useCallback(() => {
    switch (inputMode) {
      case "url":
        return urlValue.trim().length > 0;
      case "text":
        return textValue.trim().length > 0;
      case "image":
      case "pdf":
        return uploadedFile !== null;
    }
  }, [inputMode, urlValue, textValue, uploadedFile]);

  const handleParse = async () => {
    setParseStep("parsing");
    setParseProgress(0);
    setParsed(null);

    for (let i = 0; i < PARSE_MESSAGES.length; i++) {
      setParseMsg(PARSE_MESSAGES[i]);
      setParseProgress(Math.round(((i + 1) / PARSE_MESSAGES.length) * 100));
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    }

    // Initialize edit values from parsed
    const ev: Record<string, string> = {};
    for (const [k, v] of Object.entries(MOCK_PARSED)) {
      ev[k] = (v as ConfidenceField).value;
    }
    setEditValues(ev);
    setParsed(MOCK_PARSED);
    setParseStep("done");
  };

  const handleReset = () => {
    setParseStep("idle");
    setParsed(null);
    setEditValues({});
    setUrlValue("");
    setTextValue("");
    setUploadedFile(null);
    setShowDuplicateNotice(true);
    setShowSimilarPools(true);
  };

  const handlePublish = async () => {
    setPublishing(true);
    
    try {
      // Parse numerical values to avoid API validation errors
      const priceVal = parseFloat(editValues.price?.replace(/[^0-9.]/g, '') || '100');
      const moqVal = parseInt(editValues.moq?.replace(/[^0-9]/g, '') || '50', 10);
      
      const payload = {
        name: editValues.productName || "New Pool Item",
        description: `${editValues.brand || ''} ${editValues.packSize || ''} from ${editValues.supplierName || 'Unknown Supplier'}`,
        category: editValues.category || "General",
        mrp: priceVal > 0 ? priceVal * 1.3 : 130, // Mock MRP 30% higher than pool price
        poolPrice: priceVal,
        targetUnits: moqVal,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        minOrder: 5,
        tags: [editValues.offerType].filter(Boolean),
        creator_desired_quantity: Math.max(5, Math.floor(moqVal * 0.1))
      };

      const newPool = await createPoolMutation.mutateAsync(payload);
      
      // Redirect to the newly minted pool detail page
      if (newPool && newPool.id) {
        router.push(`/pools/${newPool.id}`);
      } else {
        setPublishing(false);
      }
    } catch (error) {
      console.error("Failed to publish pool:", error);
      setPublishing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const getFieldLabel = (key: string) => {
    const map: Record<string, string> = {
      productName: "Product Name",
      brand: "Brand",
      category: "Category",
      packSize: "Pack Size",
      unit: "Unit",
      price: "Price",
      moq: "Minimum Order Qty (MOQ)",
      offerType: "Offer Type",
      supplierName: "Supplier Name",
      sourceRef: "Source Reference",
    };
    return map[key] || key;
  };

  /* ─── Render ────────────────────────────────────────── */

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Link
          href="/offers"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white">Upload Offer</h1>
            <Badge variant="indigo" size="sm">
              <Sparkles className="w-3 h-3 mr-0.5" />
              AI Powered
            </Badge>
          </div>
          <p className="text-zinc-500 text-sm mt-0.5">
            Upload product data from any source — our AI extracts and structures it for you.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {parseStep === "idle" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* ── Step Indicator ──────────────────────── */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[11px] font-bold border border-indigo-500/30">
                  1
                </span>
                <span className="text-indigo-300 font-medium">Select & Upload</span>
              </div>
              <div className="h-px w-8 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-600 flex items-center justify-center text-[11px] font-bold border border-zinc-700">
                  2
                </span>
                <span className="text-zinc-600">AI Parse</span>
              </div>
              <div className="h-px w-8 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-600 flex items-center justify-center text-[11px] font-bold border border-zinc-700">
                  3
                </span>
                <span className="text-zinc-600">Review & Publish</span>
              </div>
            </div>

            {/* ── Input Type Selection ────────────────── */}
            <Card className="p-1.5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {INPUT_TABS.map((tab) => {
                  const active = inputMode === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setInputMode(tab.key);
                        setUploadedFile(null);
                      }}
                      className={cn(
                        "relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center group",
                        active
                          ? "bg-indigo-500/10 border border-indigo-500/30"
                          : "bg-transparent hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          active
                            ? "bg-indigo-500/20 text-indigo-400"
                            : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                        )}
                      >
                        <tab.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold transition-colors",
                          active ? "text-indigo-300" : "text-zinc-400 group-hover:text-zinc-200"
                        )}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* ── Input Area (varies by mode) ─────────── */}
            <Card className="p-6 relative overflow-hidden">
              {/* Subtle gradient background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-600/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-sm font-bold text-white mb-1">
                  {INPUT_TABS.find((t) => t.key === inputMode)?.label}
                </p>
                <p className="text-xs text-zinc-500 mb-5">
                  {INPUT_TABS.find((t) => t.key === inputMode)?.desc}
                </p>

                {/* URL Input */}
                {inputMode === "url" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input
                        id="offer-url-input"
                        type="url"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        placeholder="https://www.indiamart.com/product/..."
                        className="w-full pl-10 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["IndiaMART", "Amazon", "TradeIndia", "Flipkart Wholesale"].map((src) => (
                        <span
                          key={src}
                          className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-medium text-zinc-500"
                        >
                          {src}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 text-[10px] font-medium text-zinc-600">
                        + any product URL
                      </span>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                {inputMode === "image" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all cursor-pointer",
                      dragOver
                        ? "border-indigo-500/60 bg-indigo-500/5"
                        : uploadedFile
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-300">{uploadedFile}</p>
                          <p className="text-xs text-zinc-500 mt-1">Ready for parsing</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-300">
                            Drop a catalog image or screenshot
                          </p>
                          <p className="text-xs text-zinc-600 mt-1">
                            PNG, JPG, WEBP up to 10MB • WhatsApp screenshots work too
                          </p>
                        </div>
                        <span className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" /> Browse Files
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* PDF Upload */}
                {inputMode === "pdf" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all cursor-pointer",
                      dragOver
                        ? "border-indigo-500/60 bg-indigo-500/5"
                        : uploadedFile
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-300">{uploadedFile}</p>
                          <p className="text-xs text-zinc-500 mt-1">PDF ready for parsing</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-300">
                            Drop a supplier catalog or price list
                          </p>
                          <p className="text-xs text-zinc-600 mt-1">
                            PDF up to 20MB • Multi-page catalogs supported
                          </p>
                        </div>
                        <span className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors">
                          <Upload className="w-3.5 h-3.5" /> Browse Files
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Raw Text */}
                {inputMode === "text" && (
                  <div className="space-y-3">
                    <textarea
                      id="offer-text-input"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      rows={7}
                      placeholder={`Paste raw offer text here...\n\nExample:\nTata Sampann Toor Dal 1kg\nMRP: ₹180 | Bulk Price: ₹142/unit\nMOQ: 30 units\nSlab: 50+ units @ ₹135, 100+ units @ ₹128\nSupplier: Sri Balaji Wholesale Traders`}
                      className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none font-mono leading-relaxed"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                      <Copy className="w-3 h-3" />
                      Copy-paste from WhatsApp, email, or any source
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* ── Parse Button ────────────────────────── */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                disabled={!hasInput()}
                onClick={handleParse}
                icon={<Sparkles className="w-4 h-4" />}
                className="min-w-[200px]"
              >
                Parse with AI
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Parsing Animation ─────────────────────── */}
        {parseStep === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="p-10 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                {/* Spinning icon */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Parsing Your Offer</h2>
                  <p className="text-sm text-zinc-400">Our AI is extracting structured data from your input</p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md">
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${parseProgress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                      {parseMsg}
                    </span>
                    <span className="text-xs font-semibold text-indigo-400">{parseProgress}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Parsed Results ────────────────────────── */}
        {parseStep === "done" && parsed && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Step indicator — step 3 active */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-zinc-500 font-medium">Upload</span>
              </div>
              <div className="h-px w-8 bg-emerald-500/30" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-zinc-500 font-medium">Parsed</span>
              </div>
              <div className="h-px w-8 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[11px] font-bold border border-indigo-500/30">
                  3
                </span>
                <span className="text-indigo-300 font-medium">Review & Publish</span>
              </div>
            </div>

            {/* Success banner */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-300">
                  Successfully extracted 10 fields
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Review and edit the extracted data below before publishing
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Start Over
              </button>
            </div>

            {/* ── Duplicate Product Notice ────────────── */}
            <AnimatePresence>
              {showDuplicateNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-300">
                        Potential Duplicate Product Found
                      </p>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        <span className="text-zinc-300 font-medium">"Tata Sampann Toor Dal 1kg"</span>{" "}
                        already exists in the catalog with 93% similarity. Consider linking to the
                        existing product instead of creating a new one.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-lg transition-all">
                          <Eye className="w-3 h-3" /> View Existing
                        </button>
                        <button
                          onClick={() => setShowDuplicateNotice(false)}
                          className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDuplicateNotice(false)}
                      className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Extracted Fields Form ───────────────── */}
            <Card className="overflow-hidden">
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Package className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Extracted Product Data</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                      Click any field to edit
                    </p>
                  </div>
                </div>

                {/* Avg confidence */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      Avg Confidence
                    </p>
                    <p className="text-sm font-bold text-emerald-400">
                      {Math.round(
                        Object.values(parsed).reduce(
                          (a, f) => a + f.confidence,
                          0
                        ) / Object.values(parsed).length
                      )}
                      %
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {Object.entries(parsed).map(([key, field], idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                    className="group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {getFieldLabel(key)}
                      </label>
                      {/* Confidence badge */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border",
                          confidenceBg(field.confidence)
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            field.confidence >= 90
                              ? "bg-emerald-400"
                              : field.confidence >= 75
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          )}
                        />
                        <span className={confidenceColor(field.confidence)}>
                          {field.confidence}% {confidenceLabel(field.confidence)}
                        </span>
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editValues[key] || ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className={cn(
                        "w-full px-4 py-3 bg-zinc-900 border rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all",
                        editValues[key] !== field.value
                          ? "border-indigo-500/30 bg-indigo-500/5"
                          : "border-zinc-800"
                      )}
                    />
                    {editValues[key] !== field.value && (
                      <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Manually edited — original: {field.value}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* ── Similar Pools Suggestion ────────────── */}
            <AnimatePresence>
              {showSimilarPools && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="overflow-hidden relative">
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                    <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                          <Users2 className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Existing Similar Pools Found
                          </p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                            Join instead of creating a new one
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSimilarPools(false)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors rounded-lg hover:bg-zinc-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      {MOCK_SIMILAR_POOLS.map((pool) => (
                        <div
                          key={pool.id}
                          className="flex items-center gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-violet-500/20 transition-all group/pool cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-zinc-200">{pool.name}</p>
                              <Badge variant="active" size="sm" dot>Active</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <span>{pool.members} members</span>
                              <span>
                                {pool.filled}/{pool.target} units filled
                              </span>
                              <span>{pool.price}/unit</span>
                              <span className="text-amber-400">{pool.daysLeft}d left</span>
                            </div>
                            {/* Mini progress */}
                            <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden w-48">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                style={{
                                  width: `${Math.round((pool.filled / pool.target) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-violet-300 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 rounded-xl transition-all opacity-70 group-hover/pool:opacity-100">
                            Join Pool <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Action Bar ─────────────────────────── */}
            <div className="flex items-center justify-between gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  AI-extracted data verified. Edit any field before publishing.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleReset}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  loading={publishing}
                  onClick={handlePublish}
                  icon={<Upload className="w-4 h-4" />}
                >
                  Publish Offer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
