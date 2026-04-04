<div align="center">
  <h1>Procura</h1>
  <p><strong>Collective Buying. Smarter Margins.</strong></p>
  <p>An AI-assisted pooled wholesale buying platform that democratizes bulk discounts for every business.</p>
</div>

<br />

## 🚀 Overview
Procura is a modern B2B SaaS platform designed to reimagine wholesale procurement. By aggregating the buying intent of independent businesses into collective "pools", Procura allows small retailers to reach Minimum Order Quantities (MOQs) and unlock deep wholesale discounts that were traditionally restricted to large corporations. 

**This repository contains the Procura frontend foundation.**

*Note: This is an MCA Final Year Project (2025).*

## ✨ Key Features
- **Smart Buying Pools**: Live progress bars tracking committed units vs target units.
- **AI Match Engine**: Analyzes transaction history and network connections to surface personalized recommendations.
- **Offers Marketplace**: Verified supplier catalog with categorised filtering and bulk pricing breakdowns.
- **Trust & Reputation System**: Built-in score rings, tier progression, verification badges, and peer reviews.
- **Transactions Dashboard**: Clean, searchable history table calculating exact savings compared to MRP. 
- **Premium B2B UI**: Dark-mode-first aesthetic with glassmorphism, subtle glowing animations, and high-quality charts.

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** Hand-crafted primitives based on headless Radix UI / shadcn patterns
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

## 📂 Project Structure
```text
Procura/
├── api/                   # FastAPI Backend (Planned)
└── web/                   # Next.js Frontend App
    ├── src/
    │   ├── app/           # App router pages (/, /dashboard, /pools, /offers, etc.)
    │   ├── components/    # Reusable complex layout components (Sidebar, NavBar, Hero)
    │   │   └── ui/        # Core UI primitives (Buttons, Badges, Cards, Progress)
    │   ├── data/          # Mock data models for the frontend demonstration
    │   └── lib/           # Utility functions (cn, clsx wrappers)
    └── tailwind.config.ts # Tailwind CSS configuration
```

## 💻 Getting Started

Currently, the UI shell is fully populated using detailed mock data to allow for end-to-end presentation of the platform flow.

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/9endu/Procura.git
   cd Procura/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design Philosophy
Procura was heavily inspired by modern dev-tooling / B2B SaaS aesthetics (e.g., Vercel, Linear). We rely entirely on a CSS-variables-based design system housed in `globals.css` rather than hardcoding complex utility chains, making sweeping visual updates clean and highly scalable.

---

<div align="center">
  <p>🛠 Built by Nayanendu for the MCA 2025 Project</p>
</div>