import Image from "next/image";
import LoginPage from "./(auth)/login/page";

export default function Home() {
  return (
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={100}
    //       height={20}
    //       priority
    //     />
    //     <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
    //       <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
    //         To get started, edit the page.tsx file.
    //       </h1>
    //       <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
    //         Looking for a starting point or more instructions? Head over to{" "}
    //         <a
    //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Templates
    //         </a>{" "}
    //         or the{" "}
    //         <a
    //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Learning
    //         </a>{" "}
    //         center.
    //       </p>
    //     </div>
    //     <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    //       <a
    //         className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={16}
    //           height={16}
    //         />
    //         Deploy Now
    //       </a>
    //       <a
    //         className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Documentation
    //       </a>
    //     </div>
    //   </main>
    // </div>

    <>
      <LoginPage />
    </>
  );
}
// NEST Store — Premium Footwear E-Commerce
// Design: Glassmorphism + Claymorphism + Neomorphism + Liquid Glass
// Inspired by allbirds.com — Cormorant + Inter typography
// Skill: UI/UX Pro Max | Colors: #1C1917 primary, #A16207 accent, #FAFAF9 bg

// "use client"
// import { useState, useEffect, useRef, useCallback } from "react";

// // ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// const TOKENS = {
//   colors: {
//     bg: "#FAFAF9",
//     bgDark: "#0F0E0C",
//     surface: "#FFFFFF",
//     surfaceDark: "#1A1916",
//     primary: "#1C1917",
//     primaryDark: "#F5F0EB",
//     secondary: "#44403C",
//     accent: "#A16207",
//     accentLight: "#D4A017",
//     muted: "#78716C",
//     border: "#E7E5E4",
//     borderDark: "#292524",
//     glass: "rgba(255,255,255,0.12)",
//     glassDark: "rgba(15,14,12,0.6)",
//   },
// };

// // ─── PRODUCT DATA ───────────────────────────────────────────────────────────────
// const PRODUCTS = [
//   {
//     id: 1, slug: "tree-runner-nz", name: "Tree Runner NZ", brand: "NEST",
//     price: 98, originalPrice: 125, isNew: true, isBestSeller: true,
//     rating: 4.9, reviews: 3241,
//     colors: [{ name: "Natural White", hex: "#F5F0E8" }, { name: "Midnight", hex: "#1C1917" }, { name: "Sage", hex: "#6B8F71" }],
//     sizes: ["6","7","8","9","10","11","12"],
//     badge: "BESTSELLER",
//     badgeColor: "#A16207",
//     images: [
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85",
//       "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=85",
//     ],
//     tags: ["Sustainable", "Lightweight", "Breathable"],
//     description: "Eucalyptus tree fiber upper meets bio-based cushioning. The lightest step you'll ever take.",
//   },
//   {
//     id: 2, slug: "wool-runner", name: "Wool Runner Classic", brand: "NEST",
//     price: 110, isNew: false, isBestSeller: true,
//     rating: 4.8, reviews: 5102,
//     colors: [{ name: "Cream", hex: "#F0EBE1" }, { name: "Navy", hex: "#1B2A4A" }, { name: "Clay", hex: "#C4956A" }],
//     sizes: ["6","7","8","9","10","11","12"],
//     badge: "CLASSIC",
//     badgeColor: "#1C1917",
//     images: [
//       "https://images.unsplash.com/photo-1607522370275-f6fd21f7a10f?w=600&q=85",
//       "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=85",
//     ],
//     tags: ["ZQ Merino", "Temperature Regulating", "Machine Washable"],
//     description: "ZQ Merino Wool that breathes with you. Like your favorite sweater, in sneaker form.",
//   },
//   {
//     id: 3, slug: "dasher-nz", name: "Dasher NZ Runner", brand: "NEST",
//     price: 135, isNew: true, isBestSeller: false,
//     rating: 4.7, reviews: 892,
//     colors: [{ name: "Natural Black", hex: "#2D2926" }, { name: "Blizzard", hex: "#E8E4DC" }],
//     sizes: ["7","8","9","10","11","12"],
//     badge: "NEW DROP",
//     badgeColor: "#059669",
//     images: [
//       "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=85",
//       "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=85",
//     ],
//     tags: ["Trail Ready", "4mm Lugs", "Water Resistant"],
//     description: "The trail runner that never looks like one. Peak performance, effortless style.",
//   },
//   {
//     id: 4, slug: "wool-piper", name: "Wool Piper Slip-On", brand: "NEST",
//     price: 85, isNew: false, isBestSeller: false,
//     rating: 4.6, reviews: 1847,
//     colors: [{ name: "Oat", hex: "#E8D5B7" }, { name: "Fog", hex: "#C9C5BE" }, { name: "Ember", hex: "#B85C38" }],
//     sizes: ["6","7","8","9","10","11"],
//     badge: "COMFORT",
//     badgeColor: "#7C3AED",
//     images: [
//       "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=85",
//       "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=85",
//     ],
//     tags: ["No Lace", "Plush Wool", "Collapsible Heel"],
//     description: "Slip on, step out. The most effortless shoe in our line.",
//   },
//   {
//     id: 5, slug: "superlight-runner", name: "SuperLight Runner", brand: "NEST",
//     price: 150, originalPrice: 175, isNew: true, isBestSeller: false,
//     rating: 4.9, reviews: 438,
//     badge: "ULTRALIGHT",
//     badgeColor: "#0891B2",
//     colors: [{ name: "Arctic White", hex: "#F8F8F6" }, { name: "Storm", hex: "#4A5568" }],
//     sizes: ["7","8","9","10","11","12"],
//     images: [
//       "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=85",
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85",
//     ],
//     tags: ["7.9 oz", "Carbon Plate", "Energy Return"],
//     description: "Weighs almost nothing. Performs like everything.",
//   },
//   {
//     id: 6, slug: "canvas-cruiser", name: "Canvas Cruiser", brand: "NEST",
//     price: 95, isNew: true, isBestSeller: false,
//     rating: 4.7, reviews: 621,
//     badge: "NEW",
//     badgeColor: "#059669",
//     colors: [{ name: "Port", hex: "#722F37" }, { name: "Canvas", hex: "#D4C5A9" }, { name: "Moss", hex: "#4A5D43" }],
//     sizes: ["6","7","8","9","10","11","12"],
//     images: [
//       "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=85",
//       "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=85",
//     ],
//     tags: ["Organic Canvas", "Vulcanized Sole", "Street Ready"],
//     description: "Classic canvas, reimagined with natural materials and modern cushioning.",
//   },
// ];

// const CATEGORIES = [
//   { name: "Sneakers", count: 124, img: "photo-1542291026-7eec264c27ff", color: "#1C1917" },
//   { name: "Running", count: 87, img: "photo-1491553895911-0055eca6402d", color: "#A16207" },
//   { name: "Casual", count: 156, img: "photo-1600185365483-26d7a4cc7519", color: "#059669" },
//   { name: "Trail", count: 63, img: "photo-1591154669695-5f2a8d20c089", color: "#7C3AED" },
//   { name: "Slip-Ons", count: 48, img: "photo-1638247025967-b4e38f787b76", color: "#0891B2" },
//   { name: "Sandals", count: 37, img: "photo-1603487742131-4160ec999306", color: "#B85C38" },
// ];

// const TESTIMONIALS = [
//   { id: 1, name: "Sarah M.", role: "Marathon Runner", rating: 5, text: "I walked 18,000 steps on day one with zero discomfort. These are genuinely unlike anything I've worn before.", product: "Tree Runner NZ" },
//   { id: 2, name: "James K.", role: "Product Designer", rating: 5, text: "The Wool Runner changed how I think about footwear. Warm in winter, cool in summer — the regulation is actually real.", product: "Wool Runner Classic" },
//   { id: 3, name: "Elena R.", role: "Trail Enthusiast", rating: 5, text: "The grip is phenomenal, they're ultralight, and they look incredible after miles of use. Absolutely worth it.", product: "Dasher NZ Runner" },
// ];

// const HERO_SLIDES = [
//   {
//     id: 1,
//     eyebrow: "NEW SEASON DROP",
//     title: "Wildly\nComfortable.",
//     accent: "Super Natural.",
//     desc: "Crafted from eucalyptus tree fiber. Cushioned with sugarcane foam. Built for the world you live in.",
//     cta: "Shop Men",
//     cta2: "Shop Women",
//     bg: "from-[#1C1917] via-[#292420] to-[#0F0E0C]",
//     img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=90",
//     accent2: "https://images.unsplash.com/photo-1607522370275-f6fd21f7a10f?w=600&q=85",
//   },
//   {
//     id: 2,
//     eyebrow: "ALL NEW DASHER NZ",
//     title: "Built for\nthe Bold.",
//     accent: "Zero Compromise.",
//     desc: "4mm lug outsole. Water-resistant upper. Natural rubber sole. Trail performance, everyday aesthetic.",
//     cta: "Explore Dasher NZ",
//     cta2: "View Collection",
//     bg: "from-[#0A1628] via-[#0F1F3D] to-[#071018]",
//     img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1400&q=90",
//     accent2: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=85",
//   },
//   {
//     id: 3,
//     eyebrow: "CANVAS CRUISER",
//     title: "Classic\nCanvas.",
//     accent: "Modern Soul.",
//     desc: "Organic canvas meets next-gen cushioning. The shoe that goes everywhere and looks good doing it.",
//     cta: "Shop New Arrivals",
//     cta2: "All Styles",
//     bg: "from-[#1A0F0A] via-[#2D1A10] to-[#0F0A06]",
//     img: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=1400&q=90",
//     accent2: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=85",
//   },
// ];

// const NAV_MENUS = {
//   Men: {
//     featured: ["New Arrivals", "Bestsellers", "Leather Alternatives", "Varsity Collection"],
//     shoes: ["Shop All", "Sneakers", "Slip-Ons", "Slippers", "Sandals", "Active", "All-Weather"],
//     favorites: ["Tree Runner NZ", "Cruiser", "Dasher NZ", "Varsity"],
//     apparel: ["Socks", "Tops", "Shorts"],
//     imgs: [
//       { url: "photo-1542291026-7eec264c27ff", label: "Tree Runner NZ", price: "$98" },
//       { url: "photo-1607522370275-f6fd21f7a10f", label: "Wool Runner", price: "$110" },
//     ],
//   },
//   Women: {
//     featured: ["New Arrivals", "Bestsellers", "Dasher NZ", "Varsity Airy"],
//     shoes: ["Shop All", "Trainers", "Sneakers", "Flats", "Sandals", "Slip-Ons", "Active", "All-Weather"],
//     favorites: ["Tree Runner NZ", "Canvas Cruiser", "Varsity Cruiser", "Wool Piper"],
//     apparel: ["Socks", "Tops", "Bottoms"],
//     imgs: [
//       { url: "photo-1600185365483-26d7a4cc7519", label: "Dasher NZ", price: "$135" },
//       { url: "photo-1638247025967-b4e38f787b76", label: "Wool Piper", price: "$85" },
//     ],
//   },
//   Sale: {
//     featured: ["All Sale", "Up to 40% Off"],
//     shoes: ["Men's Sale", "Women's Sale"],
//     favorites: [],
//     apparel: ["Men's Apparel Sale", "Women's Apparel Sale"],
//     imgs: [
//       { url: "photo-1491553895911-0055eca6402d", label: "Sale Picks", price: "From $59" },
//       { url: "photo-1556906781-9a412961a28c", label: "Last Sizes", price: "Up to 40% off" },
//     ],
//   },
// };

// // ─── UTILITY ────────────────────────────────────────────────────────────────────
// const fmt = (n) => `$${n}`;
// const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
// function useScrolled(threshold = 60) {
//   const [scrolled, setScrolled] = useState(false);
//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > threshold);
//     window.addEventListener("scroll", fn, { passive: true });
//     return () => window.removeEventListener("scroll", fn);
//   }, [threshold]);
//   return scrolled;
// }

// // ─── ICONS (inline SVG) ──────────────────────────────────────────────────────────
// const Icon = {
//   Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
//   Bag: ({ n }) => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
//   Heart: ({ filled }) => <svg width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
//   Menu: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
//   X: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
//   Star: ({ filled = true }) => <svg width="14" height="14" fill={filled ? "#A16207" : "none"} stroke="#A16207" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
//   ChevronRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg>,
//   ChevronLeft: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>,
//   ChevronDown: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>,
//   Plus: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
//   Minus: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
//   Trash: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"/></svg>,
//   ArrowRight: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
//   Leaf: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
//   Zap: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
//   Shield: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
//   Recycle: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16 3-3-3-3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>,
//   User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
//   Check: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>,
//   Package: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
//   Truck: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
// };

// const StarRow = ({ rating }) => (
//   <div style={{ display: "flex", gap: 2 }}>
//     {[1,2,3,4,5].map(i => <Icon.Star key={i} filled={i <= Math.round(rating)} />)}
//   </div>
// );

// // ─── GLASS MORPHISM STYLES ───────────────────────────────────────────────────────
// const glassStyle = {
//   background: "rgba(255,255,255,0.08)",
//   backdropFilter: "blur(20px) saturate(180%)",
//   WebkitBackdropFilter: "blur(20px) saturate(180%)",
//   border: "1px solid rgba(255,255,255,0.15)",
//   boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
// };

// const glassCardStyle = {
//   background: "rgba(255,255,255,0.85)",
//   backdropFilter: "blur(24px) saturate(200%)",
//   WebkitBackdropFilter: "blur(24px) saturate(200%)",
//   border: "1px solid rgba(255,255,255,0.6)",
//   boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
// };

// // Claymorphism style
// const clayStyle = (color = "#F5F0E8") => ({
//   background: color,
//   borderRadius: 24,
//   boxShadow: `8px 8px 20px rgba(0,0,0,0.15), -4px -4px 12px rgba(255,255,255,0.8), inset 0 2px 4px rgba(255,255,255,0.9)`,
//   border: "1.5px solid rgba(255,255,255,0.7)",
// });

// // Neomorphism style
// const neoStyle = (bg = "#FAFAF9") => ({
//   background: bg,
//   borderRadius: 20,
//   boxShadow: `8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px rgba(255,255,255,0.95)`,
// });

// // Liquid Glass button
// const liquidGlassBtn = {
//   background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
//   backdropFilter: "blur(20px) saturate(180%)",
//   WebkitBackdropFilter: "blur(20px) saturate(180%)",
//   border: "1.5px solid rgba(255,255,255,0.3)",
//   boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
// };

// // ─── ANIMATIONS (CSS keyframes injected) ────────────────────────────────────────
// const CSS_ANIMATIONS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
  
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   html { scroll-behavior: smooth; }
//   body { font-family: 'Inter', sans-serif; }
  
//   @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//   @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
//   @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
//   @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
//   @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
//   @keyframes liquidFlow { 0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; } 100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; } }
//   @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
//   @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
//   @keyframes heroFade { 0% { opacity: 0; transform: scale(1.04) translateX(30px); } 100% { opacity: 1; transform: scale(1) translateX(0); } }
//   @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//   @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
//   @keyframes ripple { 0% { transform: scale(0); opacity: 0.6; } 100% { transform: scale(4); opacity: 0; } }
  
//   .fade-up { animation: fadeUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both; }
//   .fade-in { animation: fadeIn 0.5s ease both; }
//   .float-anim { animation: float 6s ease-in-out infinite; }
//   .liquid-anim { animation: liquidFlow 8s ease-in-out infinite; }
//   .spin { animation: spin 1s linear infinite; }
//   .marquee-track { animation: marquee 28s linear infinite; }
  
//   .btn-primary {
//     background: #1C1917; color: #fff; border: none; border-radius: 100px;
//     padding: 14px 32px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
//     letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s cubic-bezier(0.25,0.46,0.45,0.94);
//     display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
//     box-shadow: 0 4px 20px rgba(28,25,23,0.3);
//   }
//   .btn-primary:hover { background: #44403C; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(28,25,23,0.4); }
//   .btn-primary:active { transform: translateY(0); }
  
//   .btn-outline {
//     background: transparent; color: #1C1917; border: 2px solid #1C1917; border-radius: 100px;
//     padding: 12px 28px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
//     cursor: pointer; transition: all 0.2s cubic-bezier(0.25,0.46,0.45,0.94);
//     display: inline-flex; align-items: center; gap: 8px;
//   }
//   .btn-outline:hover { background: #1C1917; color: #fff; transform: translateY(-2px); }
  
//   .btn-glass {
//     background: rgba(255,255,255,0.15);
//     backdrop-filter: blur(20px) saturate(180%);
//     -webkit-backdrop-filter: blur(20px) saturate(180%);
//     color: #fff; border: 1.5px solid rgba(255,255,255,0.3); border-radius: 100px;
//     padding: 14px 32px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
//     cursor: pointer; transition: all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
//     display: inline-flex; align-items: center; gap: 8px;
//     box-shadow: 0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4);
//   }
//   .btn-glass:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
  
//   .btn-clay {
//     background: #F5F0E8; color: #1C1917; border: 1.5px solid rgba(255,255,255,0.7); border-radius: 100px;
//     padding: 14px 32px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
//     cursor: pointer; transition: all 0.2s ease;
//     box-shadow: 6px 6px 16px rgba(0,0,0,0.12), -3px -3px 10px rgba(255,255,255,0.9);
//     display: inline-flex; align-items: center; gap: 8px;
//   }
//   .btn-clay:hover { box-shadow: 10px 10px 24px rgba(0,0,0,0.18), -5px -5px 14px rgba(255,255,255,0.95); transform: translateY(-2px); }
  
//   .card-hover { transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s ease; }
//   .card-hover:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.12) !important; }
  
//   .img-zoom img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
//   .img-zoom:hover img { transform: scale(1.06); }
  
//   .underline-anim { position: relative; }
//   .underline-anim::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: currentColor; transition: width 0.3s ease; border-radius: 2px; }
//   .underline-anim:hover::after { width: 100%; }
  
//   .scrollbar-thin::-webkit-scrollbar { width: 5px; }
//   .scrollbar-thin::-webkit-scrollbar-track { background: #F5F5F4; }
//   .scrollbar-thin::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 10px; }
  
//   @media (prefers-reduced-motion: reduce) {
//     *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
//   }
//   @media (max-width: 768px) {
//     .hide-mobile { display: none !important; }
//   }
// `;

// // ─── SEARCH MODAL ────────────────────────────────────────────────────────────────
// function SearchModal({ open, onClose }) {
//   const [query, setQuery] = useState("");
//   const inputRef = useRef(null);
//   useEffect(() => { if (open && inputRef.current) { setTimeout(() => inputRef.current?.focus(), 100); } }, [open]);
//   useEffect(() => { if (!open) setQuery(""); }, [open]);
//   const results = query.length > 1 ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) : [];
//   if (!open) return null;
//   return (
//     <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 16px 16px", animation: "fadeIn 0.2s ease" }}>
//       <div onClick={e => e.stopPropagation()} style={{ ...glassCardStyle, width: "100%", maxWidth: 640, borderRadius: 24, overflow: "hidden" }}>
//         <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
//           <Icon.Search />
//           <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search shoes, styles, collections..." style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "'Inter', sans-serif", background: "transparent", color: "#1C1917" }} />
//           <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C", padding: 4 }}><Icon.X /></button>
//         </div>
//         {query.length > 1 && (
//           <div style={{ maxHeight: 400, overflowY: "auto" }} className="scrollbar-thin">
//             {results.length === 0 ? (
//               <div style={{ padding: 32, textAlign: "center", color: "#78716C", fontFamily: "'Inter', sans-serif" }}>No results for "{query}"</div>
//             ) : results.map(p => (
//               <div key={p.id} style={{ display: "flex", gap: 16, padding: "16px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                 <img src={p.images[0]} alt={p.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", background: "#F5F5F4" }} />
//                 <div>
//                   <div style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{p.name}</div>
//                   <div style={{ fontSize: 13, color: "#78716C", marginTop: 2 }}>{p.tags.join(" · ")}</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#A16207", marginTop: 4 }}>{fmt(p.price)}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         {query.length === 0 && (
//           <div style={{ padding: "20px 24px" }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#78716C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>Popular Searches</div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//               {["Tree Runner", "Wool Runner", "Dasher NZ", "New Arrivals", "Women's Sale", "Slip-Ons"].map(s => (
//                 <button key={s} onClick={() => setQuery(s)} style={{ ...neoStyle("#FAFAF9"), padding: "8px 16px", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#44403C", fontWeight: 500 }}>{s}</button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── MEGA MENU ───────────────────────────────────────────────────────────────────
// function MegaMenu({ section, onClose }) {
//   const data = NAV_MENUS[section];
//   if (!data) return null;
//   return (
//     <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, animation: "slideDown 0.25s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
//       <div style={{ ...glassCardStyle, background: "rgba(250,250,249,0.97)", margin: "0 0", borderRadius: "0 0 24px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 40 }}>
//           <div>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#A16207", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>Featured</div>
//             {data.featured.map(item => (
//               <a key={item} href="#" onClick={onClose} className="underline-anim" style={{ display: "block", padding: "5px 0", fontSize: 14, fontWeight: 600, color: "#1C1917", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{item}</a>
//             ))}
//             {data.apparel.length > 0 && <>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#78716C", letterSpacing: "0.12em", textTransform: "uppercase", margin: "24px 0 12px", fontFamily: "'Inter', sans-serif" }}>Apparel</div>
//               {data.apparel.map(item => (
//                 <a key={item} href="#" onClick={onClose} className="underline-anim" style={{ display: "block", padding: "5px 0", fontSize: 13, color: "#44403C", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{item}</a>
//               ))}
//             </>}
//           </div>
//           <div>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#78716C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>Shoes</div>
//             {data.shoes.map(item => (
//               <a key={item} href="#" onClick={onClose} className="underline-anim" style={{ display: "block", padding: "5px 0", fontSize: 13, color: "#44403C", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{item}</a>
//             ))}
//           </div>
//           <div>
//             {data.favorites.length > 0 && <>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#78716C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>Customer Favorites</div>
//               {data.favorites.map(item => (
//                 <a key={item} href="#" onClick={onClose} className="underline-anim" style={{ display: "block", padding: "5px 0", fontSize: 13, color: "#44403C", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{item}</a>
//               ))}
//             </>}
//           </div>
//           <div style={{ display: "flex", gap: 16 }}>
//             {data.imgs.map(img => (
//               <div key={img.label} className="img-zoom" style={{ ...clayStyle("#F5F0E8"), overflow: "hidden", width: 160, cursor: "pointer" }} onClick={onClose}>
//                 <img src={`https://images.unsplash.com/${img.url}?w=320&q=80`} alt={img.label} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
//                 <div style={{ padding: "12px 14px" }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{img.label}</div>
//                   <div style={{ fontSize: 12, color: "#A16207", fontWeight: 700, marginTop: 2 }}>{img.price}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── HEADER ──────────────────────────────────────────────────────────────────────
// function Header({ cart, wishlist, onCartOpen, onWishlistOpen, onSearchOpen, page, setPage }) {
//   const scrolled = useScrolled(60);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const cartCount = cart.reduce((s, i) => s + i.qty, 0);

//   const navLinks = ["Men", "Women", "Sale", "New Arrivals", "About"];

//   return (
//     <>
//       <style>{CSS_ANIMATIONS}</style>
//       <header style={{
//         position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
//         transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
//         ...(scrolled ? {
//           background: "rgba(250,250,249,0.95)",
//           backdropFilter: "blur(24px) saturate(180%)",
//           WebkitBackdropFilter: "blur(24px) saturate(180%)",
//           boxShadow: "0 1px 0 rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
//           borderBottom: "1px solid rgba(0,0,0,0.06)",
//         } : {
//           background: "transparent",
//         }),
//       }} onMouseLeave={() => setActiveMenu(null)}>
//         {/* Announcement bar */}
//         <div style={{ background: "#1C1917", color: "#F5F0E8", textAlign: "center", padding: "10px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" }}>
//           <span>Free shipping on orders over $100 &nbsp;·&nbsp; </span>
//           <a href="#" style={{ color: "#D4A017", textDecoration: "underline", fontWeight: 600 }}>Shop New Arrivals →</a>
//         </div>

//         <div style={{ position: "relative" }}>
//           <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             {/* Logo */}
//             <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 700, letterSpacing: "0.04em", color: scrolled ? "#1C1917" : "#1C1917" }}>
//               NEST
//             </button>

//             {/* Desktop Nav */}
//             <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               {navLinks.map(link => (
//                 <div key={link} style={{ position: "relative" }} onMouseEnter={() => ["Men", "Women", "Sale"].includes(link) ? setActiveMenu(link) : setActiveMenu(null)}>
//                   <button
//                     className="underline-anim"
//                     style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "#1C1917", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4, borderRadius: 8, transition: "background 0.15s" }}
//                     onFocus={() => ["Men", "Women", "Sale"].includes(link) && setActiveMenu(link)}
//                   >
//                     {link}
//                     {["Men", "Women", "Sale"].includes(link) && <span style={{ transition: "transform 0.2s", transform: activeMenu === link ? "rotate(180deg)" : "rotate(0deg)" }}><Icon.ChevronDown /></span>}
//                   </button>
//                 </div>
//               ))}
//             </nav>

//             {/* Actions */}
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <ActionBtn label="Search" onClick={onSearchOpen} scrolled><Icon.Search /></ActionBtn>
//               <ActionBtn label="Account" onClick={() => setPage("account")} scrolled><Icon.User /></ActionBtn>
//               <ActionBtn label={`Wishlist (${wishlist.length})`} onClick={onWishlistOpen} scrolled>
//                 <div style={{ position: "relative" }}>
//                   <Icon.Heart filled={wishlist.length > 0} />
//                   {wishlist.length > 0 && <Badge count={wishlist.length} color="#ef4444" />}
//                 </div>
//               </ActionBtn>
//               <ActionBtn label={`Cart (${cartCount})`} onClick={onCartOpen} scrolled>
//                 <div style={{ position: "relative" }}>
//                   <Icon.Bag />
//                   {cartCount > 0 && <Badge count={cartCount} color="#1C1917" />}
//                 </div>
//               </ActionBtn>
//               <button className="hide-mobile" style={{ display: "none" }} />
//               <ActionBtn label="Menu" onClick={() => setMobileOpen(true)} scrolled style={{ display: "none" }} className="show-mobile">
//                 <Icon.Menu />
//               </ActionBtn>
//             </div>
//           </div>

//           {/* Mega Menu */}
//           {activeMenu && <MegaMenu section={activeMenu} onClose={() => setActiveMenu(null)} />}
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#FAFAF9", animation: "slideInLeft 0.3s ease" }} className="scrollbar-thin" >
//           <div style={{ padding: "20px 24px", borderBottom: "1px solid #E7E5E4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <span style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 700 }}>NEST</span>
//             <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon.X /></button>
//           </div>
//           <nav style={{ padding: 24 }}>
//             {navLinks.map((link, i) => (
//               <a key={link} href="#" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "16px 0", fontSize: 22, fontWeight: 600, color: "#1C1917", textDecoration: "none", borderBottom: "1px solid #E7E5E4", fontFamily: "'Cormorant', serif", animation: `fadeUp 0.4s ${i*0.06}s both` }}>{link}</a>
//             ))}
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }

// function Badge({ count, color }) {
//   return (
//     <span style={{ position: "absolute", top: -8, right: -8, background: color, color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif", lineHeight: 1, minWidth: 18 }}>
//       {count > 9 ? "9+" : count}
//     </span>
//   );
// }

// function ActionBtn({ children, label, onClick, style: extraStyle, className }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       aria-label={label}
//       title={label}
//       style={{ background: hov ? "rgba(0,0,0,0.05)" : "transparent", border: "none", cursor: "pointer", width: 44, height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917", transition: "all 0.15s", flexShrink: 0, ...extraStyle }}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       className={className}
//     >
//       {children}
//     </button>
//   );
// }

// // ─── CART DRAWER ─────────────────────────────────────────────────────────────────
// function CartDrawer({ cart, open, onClose, onUpdate, onRemove, setPage }) {
//   const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
//   const ship = sub >= 100 ? 0 : 12;
//   const total = sub + ship;
//   if (!open) return null;
//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
//       <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />
//       <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 420, background: "#FAFAF9", display: "flex", flexDirection: "column", animation: "slideInRight 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", boxShadow: "-20px 0 60px rgba(0,0,0,0.15)" }}>
//         {/* Header */}
//         <div style={{ padding: "20px 24px", borderBottom: "1px solid #E7E5E4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <Icon.Bag />
//             <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Your Cart</span>
//             {cart.length > 0 && <span style={{ background: "#1C1917", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{cart.reduce((s, i) => s + i.qty, 0)}</span>}
//           </div>
//           <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C", padding: 4 }}><Icon.X /></button>
//         </div>

//         {/* Items */}
//         <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="scrollbar-thin">
//           {cart.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 24px" }}>
//               <div style={{ width: 80, height: 80, borderRadius: 40, background: "#F5F5F4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", ...neoStyle("#F5F5F4") }}>
//                 <Icon.Bag />
//               </div>
//               <p style={{ fontWeight: 600, color: "#1C1917", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Your cart is empty</p>
//               <p style={{ fontSize: 13, color: "#78716C", marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>Discover something you'll love</p>
//               <button className="btn-primary" onClick={onClose}>Browse Shop</button>
//             </div>
//           ) : cart.map(item => (
//             <div key={item.id} style={{ display: "flex", gap: 16, marginBottom: 20, padding: 16, ...clayStyle("#fff"), borderRadius: 20 }}>
//               <img src={item.img} alt={item.name} style={{ width: 80, height: 80, borderRadius: 14, objectFit: "cover", background: "#F5F5F4", flexShrink: 0 }} />
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ fontSize: 13, color: "#78716C", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>{item.brand}</div>
//                 <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917", lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
//                 {item.color && <div style={{ fontSize: 12, color: "#78716C", marginTop: 2 }}>{item.color} {item.size && `· Size ${item.size}`}</div>}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
//                   <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E7E5E4", borderRadius: 100, overflow: "hidden" }}>
//                     <button onClick={() => onUpdate(item.id, item.qty - 1)} style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#78716C" }}><Icon.Minus /></button>
//                     <span style={{ width: 28, textAlign: "center", fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{item.qty}</span>
//                     <button onClick={() => onUpdate(item.id, item.qty + 1)} style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917" }}><Icon.Plus /></button>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(item.price * item.qty)}</span>
//                     <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", padding: 4, borderRadius: 6, transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#A8A29E"}><Icon.Trash /></button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         {cart.length > 0 && (
//           <div style={{ padding: 24, borderTop: "1px solid #E7E5E4" }}>
//             {sub < 100 && (
//               <div style={{ background: "linear-gradient(90deg, #FFF7E6, #FEF3C7)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400E", fontFamily: "'Inter', sans-serif" }}>
//                 Add <strong>{fmt(100 - sub)}</strong> more for free shipping! 🎉
//               </div>
//             )}
//             <div style={{ marginBottom: 16 }}>
//               {[["Subtotal", fmt(sub)], ["Shipping", ship === 0 ? "FREE" : fmt(ship)], ["Total", fmt(total)]].map(([label, val], i) => (
//                 <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i === 2 ? "1.5px solid #E7E5E4" : "none", marginTop: i === 2 ? 8 : 0 }}>
//                   <span style={{ fontSize: i === 2 ? 15 : 13, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "#1C1917" : "#78716C", fontFamily: "'Inter', sans-serif" }}>{label}</span>
//                   <span style={{ fontSize: i === 2 ? 15 : 13, fontWeight: i === 2 ? 700 : 500, color: i === 2 ? "#1C1917" : ship === 0 && i === 1 ? "#059669" : "#44403C", fontFamily: "'Inter', sans-serif" }}>{val}</span>
//                 </div>
//               ))}
//             </div>
//             <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={() => { onClose(); setPage("checkout"); }}>
//               Checkout · {fmt(total)} <Icon.ArrowRight />
//             </button>
//             <button className="btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onClose(); setPage("cart"); }}>
//               View Cart
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── WISHLIST DRAWER ─────────────────────────────────────────────────────────────
// function WishlistDrawer({ wishlist, open, onClose, onRemove, onAddToCart }) {
//   if (!open) return null;
//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
//       <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />
//       <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 420, background: "#FAFAF9", display: "flex", flexDirection: "column", animation: "slideInRight 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", boxShadow: "-20px 0 60px rgba(0,0,0,0.15)" }}>
//         <div style={{ padding: "20px 24px", borderBottom: "1px solid #E7E5E4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <Icon.Heart filled />
//             <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Wishlist</span>
//             {wishlist.length > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{wishlist.length}</span>}
//           </div>
//           <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C" }}><Icon.X /></button>
//         </div>
//         <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="scrollbar-thin">
//           {wishlist.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 24px" }}>
//               <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
//               <p style={{ fontWeight: 600, color: "#1C1917", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Nothing saved yet</p>
//               <p style={{ fontSize: 13, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>Heart items you love to save them here</p>
//             </div>
//           ) : wishlist.map(item => (
//             <div key={item.id} style={{ display: "flex", gap: 16, marginBottom: 16, padding: 16, ...clayStyle("#fff"), borderRadius: 20 }}>
//               <img src={item.img} alt={item.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917", marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#A16207", marginBottom: 10 }}>{fmt(item.price)}</div>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => onAddToCart(item)}>Add to Cart</button>
//                   <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "1.5px solid #E7E5E4", cursor: "pointer", padding: "8px 10px", borderRadius: 100, color: "#78716C", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Remove</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── PRODUCT CARD ─────────────────────────────────────────────────────────────────
// function ProductCard({ product, onAddToCart, onWishlistToggle, isWishlisted, onClick }) {
//   const [hov, setHov] = useState(false);
//   const [imgIdx, setImgIdx] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [justAdded, setJustAdded] = useState(false);
//   const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

//   const handleAdd = (e) => {
//     e.stopPropagation();
//     onAddToCart(product, product.colors?.[selectedColor]);
//     setJustAdded(true);
//     setTimeout(() => setJustAdded(false), 1800);
//   };

//   return (
//     <div
//       className="card-hover img-zoom"
//       onClick={onClick}
//       onMouseEnter={() => { setHov(true); setImgIdx(1); }}
//       onMouseLeave={() => { setHov(false); setImgIdx(0); }}
//       style={{ cursor: "pointer", borderRadius: 24, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)", transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" }}
//     >
//       {/* Image */}
//       <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "#F5F0E8" }}>
//         <img
//           src={(product.images[imgIdx] || product.images[0]) + (imgIdx === 0 ? "" : "")}
//           alt={product.name}
//           style={{ width: "100%", height: "100%", objectFit: "cover", transition: "all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", transform: hov ? "scale(1.06)" : "scale(1)" }}
//           loading="lazy"
//         />
//         {/* Badges */}
//         <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6 }}>
//           {product.badge && (
//             <span style={{ background: product.badgeColor, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif" }}>
//               {product.badge}
//             </span>
//           )}
//           {disc > 0 && (
//             <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif" }}>−{disc}%</span>
//           )}
//         </div>
//         {/* Actions overlay */}
//         <div style={{ position: "absolute", top: 14, right: 14, display: "flex", flexDirection: "column", gap: 8, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(12px)", transition: "all 0.25s ease" }}>
//           <button
//             onClick={e => { e.stopPropagation(); onWishlistToggle(product); }}
//             aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//             style={{ width: 38, height: 38, borderRadius: 19, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", ...(isWishlisted ? { background: "#ef4444", color: "#fff" } : { ...glassCardStyle, color: "#1C1917" }) }}
//           >
//             <Icon.Heart filled={isWishlisted} />
//           </button>
//         </div>
//         {/* Add to Cart */}
//         <div style={{ position: "absolute", inset: "auto 12px 12px", opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(12px)", transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
//           <button
//             onClick={handleAdd}
//             style={{ width: "100%", padding: "13px 20px", background: justAdded ? "#059669" : "rgba(28,25,23,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#fff", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
//           >
//             {justAdded ? <><Icon.Check /> Added!</> : <><Icon.Bag /> Add to Cart</>}
//           </button>
//         </div>
//       </div>

//       {/* Info */}
//       <div style={{ padding: "18px 18px 20px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
//           <div>
//             <div style={{ fontSize: 11, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, fontFamily: "'Inter', sans-serif" }}>{product.brand}</div>
//             <div style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}>{product.name}</div>
//           </div>
//           <div style={{ textAlign: "right", flexShrink: 0 }}>
//             <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(product.price)}</div>
//             {product.originalPrice && <div style={{ fontSize: 12, color: "#A8A29E", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</div>}
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
//           <StarRow rating={product.rating} />
//           <span style={{ fontSize: 12, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>({product.reviews.toLocaleString()})</span>
//         </div>
//         {product.colors && (
//           <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
//             {product.colors.map((c, i) => (
//               <button key={c.name} title={c.name} onClick={e => { e.stopPropagation(); setSelectedColor(i); }}
//                 style={{ width: 18, height: 18, borderRadius: 9, background: c.hex, border: selectedColor === i ? `2px solid #1C1917` : "2px solid rgba(0,0,0,0.08)", cursor: "pointer", transition: "transform 0.15s", transform: selectedColor === i ? "scale(1.25)" : "scale(1)", outline: "none", boxShadow: selectedColor === i ? "0 0 0 2px #fff" : "none" }} />
//             ))}
//             {product.colors.length > 3 && <span style={{ fontSize: 11, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>+{product.colors.length - 3} more</span>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── HERO SECTION ────────────────────────────────────────────────────────────────
// function HeroSection({ setPage }) {
//   const [slide, setSlide] = useState(0);
//   const [animKey, setAnimKey] = useState(0);
//   const timerRef = useRef(null);

//   const goTo = useCallback((idx) => {
//     setSlide(idx);
//     setAnimKey(k => k + 1);
//   }, []);

//   useEffect(() => {
//     timerRef.current = setInterval(() => goTo(s => (s + 1) % HERO_SLIDES.length), 6000);
//     return () => clearInterval(timerRef.current);
//   }, [goTo]);

//   const s = HERO_SLIDES[slide];

//   return (
//     <section style={{ position: "relative", height: "100vh", minHeight: 600, maxHeight: 920, overflow: "hidden", display: "flex", alignItems: "center" }}>
//       {/* BG */}
//       <div key={`bg-${slide}`} style={{ position: "absolute", inset: 0, animation: "heroFade 1s ease both" }}>
//         <img src={s.img} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.1) 100%)" }} />
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
//       </div>

//       {/* Liquid Glass Orbs */}
//       <div className="float-anim" style={{ position: "absolute", top: "15%", right: "12%", width: 240, height: 240, borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%", background: "linear-gradient(135deg, rgba(212,160,23,0.15), rgba(255,255,255,0.06))", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", pointerEvents: "none", animation: "float 8s ease-in-out infinite, liquidFlow 10s ease-in-out infinite" }} />
//       <div style={{ position: "absolute", bottom: "22%", right: "24%", width: 140, height: 140, borderRadius: "40% 60% 55% 45% / 50% 60% 40% 50%", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none", animation: "float 12s ease-in-out infinite reverse, liquidFlow 14s ease-in-out infinite" }} />

//       {/* Content */}
//       <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 40px", paddingTop: 80, width: "100%" }}>
//         <div key={animKey} style={{ maxWidth: 620 }}>
//           {/* Eyebrow */}
//           <div style={{ animation: "fadeUp 0.5s 0.1s both" }}>
//             <span style={{ ...glassStyle, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
//               <span style={{ width: 6, height: 6, borderRadius: 3, background: "#D4A017", display: "inline-block" }} />
//               {s.eyebrow}
//             </span>
//           </div>

//           {/* Headline */}
//           <h1 style={{ animation: "fadeUp 0.6s 0.2s both", fontFamily: "'Cormorant', serif", fontSize: "clamp(56px, 9vw, 96px)", fontWeight: 700, lineHeight: 0.92, color: "#FFFFFF", marginBottom: 16, letterSpacing: "-0.02em" }}>
//             {s.title.split("\n").map((line, i) => (
//               <span key={i} style={{ display: "block" }}>{line}</span>
//             ))}
//           </h1>
//           <h2 style={{ animation: "fadeUp 0.6s 0.3s both", fontFamily: "'Cormorant', serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1, color: "rgba(212,160,23,0.9)", marginBottom: 28 }}>
//             {s.accent}
//           </h2>

//           {/* Desc */}
//           <p style={{ animation: "fadeUp 0.6s 0.4s both", fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.65, marginBottom: 40, maxWidth: 480, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
//             {s.desc}
//           </p>

//           {/* CTAs */}
//           <div style={{ animation: "fadeUp 0.6s 0.5s both", display: "flex", gap: 14, flexWrap: "wrap" }}>
//             <button className="btn-primary" style={{ background: "#fff", color: "#1C1917", boxShadow: "0 6px 30px rgba(255,255,255,0.25)" }} onClick={() => setPage("shop")}>
//               {s.cta} <Icon.ArrowRight />
//             </button>
//             <button className="btn-glass" onClick={() => setPage("shop")}>
//               {s.cta2}
//             </button>
//           </div>
//         </div>

//         {/* Floating Product Card — Glassmorphism */}
//         <div className="float-anim hide-mobile" style={{ position: "absolute", bottom: 80, right: 40, animation: "fadeUp 0.8s 0.6s both, float 6s 0.8s ease-in-out infinite", zIndex: 3 }}>
//           <div style={{ ...glassStyle, borderRadius: 24, padding: 16, width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
//             <img src={s.accent2} alt="Featured product" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 16, background: "rgba(255,255,255,0.1)" }} />
//             <div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", marginBottom: 3 }}>FEATURED</div>
//               <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'Inter', sans-serif" }}>{PRODUCTS[slide]?.name}</div>
//               <div style={{ fontSize: 13, color: "#D4A017", fontWeight: 700, marginTop: 3 }}>{fmt(PRODUCTS[slide]?.price)}</div>
//             </div>
//             <button style={{ ...liquidGlassBtn, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setPage("shop")}>
//               Shop Now <Icon.ArrowRight />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Slide Controls */}
//       <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 24, zIndex: 3 }}>
//         <button onClick={() => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} style={{ ...glassStyle, width: 40, height: 40, borderRadius: 20, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s" }} aria-label="Previous slide">
//           <Icon.ChevronLeft />
//         </button>
//         <div style={{ display: "flex", gap: 8 }}>
//           {HERO_SLIDES.map((_, i) => (
//             <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
//               style={{ height: 3, borderRadius: 2, border: "none", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", background: i === slide ? "#fff" : "rgba(255,255,255,0.4)", width: i === slide ? 28 : 10 }} />
//           ))}
//         </div>
//         <button onClick={() => goTo((slide + 1) % HERO_SLIDES.length)} style={{ ...glassStyle, width: 40, height: 40, borderRadius: 20, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s" }} aria-label="Next slide">
//           <Icon.ChevronRight />
//         </button>
//       </div>

//       {/* Scroll indicator */}
//       <div style={{ position: "absolute", bottom: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3, opacity: 0.6 }}>
//         <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)", animation: "pulse 2s infinite" }} />
//         <span style={{ fontSize: 9, color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", writingMode: "vertical-lr" }}>Scroll</span>
//       </div>
//     </section>
//   );
// }

// // ─── MARQUEE BANNER ──────────────────────────────────────────────────────────────
// function MarqueeBanner() {
//   const items = ["🌿 Sustainably Made", "✦ Carbon Neutral Shipping", "✦ Natural Materials", "✦ Machine Washable", "✦ Free Returns", "✦ B Corp Certified", "🌿 Sustainably Made", "✦ Carbon Neutral Shipping", "✦ Natural Materials", "✦ Machine Washable", "✦ Free Returns", "✦ B Corp Certified"];
//   return (
//     <div style={{ background: "#1C1917", overflow: "hidden", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
//       <div className="marquee-track" style={{ display: "flex", gap: 48, whiteSpace: "nowrap", width: "max-content" }}>
//         {items.map((item, i) => (
//           <span key={i} style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,235,225,0.85)", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>{item}</span>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── CATEGORY ROW ─────────────────────────────────────────────────────────────────
// function CategoryRow({ setPage }) {
//   return (
//     <section style={{ padding: "80px 24px", background: "#FAFAF9" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Browse</p>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#1C1917", lineHeight: 1.1 }}>Shop by Category</h2>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 20 }}>
//           {CATEGORIES.map((cat, i) => (
//             <div key={cat.name} className="card-hover" onClick={() => setPage("shop")}
//               style={{ cursor: "pointer", ...clayStyle("#fff"), borderRadius: 22, overflow: "hidden", animation: `fadeUp 0.5s ${i * 0.08}s both` }}>
//               <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
//                 <img src={`https://images.unsplash.com/${cat.img}?w=300&q=80`} alt={cat.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
//               </div>
//               <div style={{ padding: "14px 14px 16px", textAlign: "center" }}>
//                 <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>{cat.name}</div>
//                 <div style={{ fontSize: 11, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>{cat.count} styles</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── PRODUCT GRID SECTION ─────────────────────────────────────────────────────────
// function ProductGridSection({ title, subtitle, badge, products, onAddToCart, onWishlistToggle, wishlist, setPage, viewAll = "/shop" }) {
//   return (
//     <section style={{ padding: "80px 24px" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, gap: 20, flexWrap: "wrap" }}>
//           <div className="fade-up">
//             {badge && <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>{badge}</p>}
//             <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, color: "#1C1917", lineHeight: 1.1 }}>{title}</h2>
//             {subtitle && <p style={{ fontSize: 15, color: "#78716C", marginTop: 8, fontFamily: "'Inter', sans-serif" }}>{subtitle}</p>}
//           </div>
//           <button className="btn-outline" style={{ flexShrink: 0 }} onClick={() => setPage("shop")}>View All <Icon.ArrowRight /></button>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
//           {products.map((p, i) => (
//             <div key={p.id} style={{ animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
//               <ProductCard product={p} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} isWishlisted={wishlist.some(w => w.id === p.id)} onClick={() => setPage("product")} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── BRAND VALUES ─────────────────────────────────────────────────────────────────
// function BrandValues() {
//   const vals = [
//     { icon: Icon.Leaf, title: "Natural Materials", desc: "Eucalyptus fiber, ZQ Merino Wool, sugarcane foam — materials that come from and return to the earth.", color: "#059669", bg: "#ECFDF5" },
//     { icon: Icon.Zap, title: "Engineered Performance", desc: "Bio-based midsoles with cloud-like cushioning. Light enough to forget you're wearing shoes.", color: "#0891B2", bg: "#ECFEFF" },
//     { icon: Icon.Shield, title: "Built to Last", desc: "Machine washable. Durable construction. The shoe you'll reach for every single day.", color: "#7C3AED", bg: "#F5F3FF" },
//     { icon: Icon.Recycle, title: "Circular Design", desc: "Our ReRun take-back program gives your old pair a second life. Zero waste is the goal.", color: "#A16207", bg: "#FFFBEB" },
//   ];
//   return (
//     <section style={{ padding: "80px 24px", background: "#FAFAF9" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }} className="fade-up">
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Our Promise</p>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#1C1917" }}>Why NEST?</h2>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
//           {vals.map((v, i) => (
//             <div key={v.title} className="card-hover" style={{ ...clayStyle("#fff"), padding: "32px 28px", borderRadius: 28, animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
//               <div style={{ width: 56, height: 56, borderRadius: 18, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: v.color }}>
//                 <v.icon />
//               </div>
//               <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>{v.title}</h3>
//               <p style={{ fontSize: 13, color: "#78716C", lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>{v.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── COLLECTIONS SECTION ─────────────────────────────────────────────────────────
// function CollectionsSection({ setPage }) {
//   const collections = [
//     { name: "Summer Essentials", desc: "Light, breathable, ready for anything.", img: "photo-1515372039744-b8f02a3ae446", wide: true },
//     { name: "Urban Explorer", desc: "Built for city streets.", img: "photo-1542291026-7eec264c27ff", wide: false },
//     { name: "Trail & Terrain", desc: "Conquer every surface.", img: "photo-1591154669695-5f2a8d20c089", wide: false },
//     { name: "The Luxury Edit", desc: "Premium materials, iconic design.", img: "photo-1556906781-9a412961a28c", wide: false },
//   ];
//   return (
//     <section style={{ padding: "80px 24px", background: "#F5F0E8" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Collections</p>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#1C1917" }}>Curated for You</h2>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: 20 }}>
//           {collections.map((c, i) => (
//             <div key={c.name} onClick={() => setPage("shop")} className="img-zoom card-hover"
//               style={{ gridColumn: i === 0 ? "1 / 3" : "auto", gridRow: i === 0 ? "1 / 3" : "auto", borderRadius: 28, overflow: "hidden", cursor: "pointer", position: "relative", minHeight: i === 0 ? 440 : 200, animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
//               <img src={`https://images.unsplash.com/${c.img}?w=800&q=85`} alt={c.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
//               <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent)" }} />
//               {/* Glassmorphism card */}
//               <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//                 <div style={{ ...glassStyle, borderRadius: 18, padding: "16px 20px" }}>
//                   <div style={{ fontSize: i === 0 ? 20 : 15, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant', serif", marginBottom: 4 }}>{c.name}</div>
//                   <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
//                     {c.desc} <Icon.ArrowRight />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── SUSTAINABILITY STRIP ──────────────────────────────────────────────────────────
// function SustainabilityStrip() {
//   const stats = [
//     { val: "100%", label: "Natural Materials" },
//     { val: "7.6kg", label: "Avg Carbon per Pair" },
//     { val: "1M+", label: "Returns Recycled" },
//     { val: "Net Zero", label: "Goal by 2030" },
//   ];
//   return (
//     <section style={{ background: "#1C1917", padding: "60px 24px" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 48, textAlign: "center" }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Sustainability</p>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#F5F0E8", marginBottom: 16 }}>
//             The Planet is Our Partner
//           </h2>
//           <p style={{ fontSize: 16, color: "rgba(245,240,232,0.65)", maxWidth: 480, lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
//             Every NEST shoe comes with a carbon footprint label — because transparency is the first step to accountability.
//           </p>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
//           {stats.map((s, i) => (
//             <div key={s.label} style={{ ...glassStyle, borderRadius: 24, padding: "32px 24px", textAlign: "center", animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
//               <div style={{ fontFamily: "'Cormorant', serif", fontSize: 44, fontWeight: 700, color: "#D4A017", lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
//               <div style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── TESTIMONIALS ────────────────────────────────────────────────────────────────
// function Testimonials() {
//   const [active, setActive] = useState(0);
//   return (
//     <section style={{ padding: "80px 24px", background: "#FAFAF9" }}>
//       <div style={{ maxWidth: 900, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Reviews</p>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#1C1917" }}>What They're Saying</h2>
//         </div>
//         {/* Active testimonial — Neomorphism card */}
//         <div key={active} style={{ ...neoStyle("#FAFAF9"), borderRadius: 32, padding: "48px 56px", textAlign: "center", marginBottom: 32, animation: "fadeIn 0.4s ease" }}>
//           <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
//             {[1,2,3,4,5].map(i => <Icon.Star key={i} filled />)}
//           </div>
//           <p style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 500, fontStyle: "italic", color: "#1C1917", lineHeight: 1.5, marginBottom: 28 }}>
//             "{TESTIMONIALS[active].text}"
//           </p>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 15, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{TESTIMONIALS[active].name}</div>
//             <div style={{ fontSize: 13, color: "#78716C", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{TESTIMONIALS[active].role} · {TESTIMONIALS[active].product}</div>
//           </div>
//         </div>
//         {/* Dots */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
//           {TESTIMONIALS.map((_, i) => (
//             <button key={i} onClick={() => setActive(i)} aria-label={`View testimonial ${i + 1}`}
//               style={{ height: 3, borderRadius: 2, border: "none", cursor: "pointer", transition: "all 0.3s", background: i === active ? "#1C1917" : "#D6D3D1", width: i === active ? 28 : 10 }} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── NEWSLETTER ──────────────────────────────────────────────────────────────────
// function Newsletter() {
//   const [email, setEmail] = useState("");
//   const [done, setDone] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return;
//     setLoading(true);
//     await new Promise(r => setTimeout(r, 900));
//     setLoading(false);
//     setDone(true);
//   };
//   return (
//     <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #1C1917 0%, #2D2420 50%, #1C1917 100%)", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", top: "-40%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(161,98,7,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
//       <div style={{ position: "absolute", bottom: "-30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(161,98,7,0.08)", filter: "blur(50px)", pointerEvents: "none" }} />
//       <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
//         <p style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Stay in the Loop</p>
//         <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "#F5F0E8", marginBottom: 16 }}>Early Access. Always.</h2>
//         <p style={{ fontSize: 16, color: "rgba(245,240,232,0.6)", lineHeight: 1.65, marginBottom: 40, fontFamily: "'Inter', sans-serif" }}>
//           Get first access to new drops, exclusive offers, and sustainability updates.
//         </p>
//         {done ? (
//           <div style={{ ...glassStyle, borderRadius: 20, padding: "24px 32px", display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
//             <span style={{ width: 32, height: 32, borderRadius: 16, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Icon.Check /></span>
//             <div style={{ textAlign: "left" }}>
//               <div style={{ fontWeight: 700, color: "#F5F0E8", fontFamily: "'Inter', sans-serif" }}>You're in!</div>
//               <div style={{ fontSize: 13, color: "rgba(245,240,232,0.65)", fontFamily: "'Inter', sans-serif" }}>Check your inbox for a welcome gift.</div>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto", flexWrap: "wrap" }}>
//             <label htmlFor="nl-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Email address</label>
//             <input id="nl-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email address"
//               style={{ flex: 1, minWidth: 200, height: 52, padding: "0 20px", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#F5F0E8", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }} />
//             <button type="submit" className="btn-primary" style={{ height: 52, background: "#A16207", flexShrink: 0 }}>
//               {loading ? <span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: 8 }} /> : "Subscribe"}
//             </button>
//           </form>
//         )}
//         <p style={{ fontSize: 11, color: "rgba(245,240,232,0.35)", marginTop: 16, fontFamily: "'Inter', sans-serif" }}>No spam, ever. Unsubscribe anytime.</p>
//       </div>
//     </section>
//   );
// }

// // ─── FOOTER ──────────────────────────────────────────────────────────────────────
// function Footer({ setPage }) {
//   const cols = [
//     { title: "Shop", links: ["Men's Shoes", "Women's Shoes", "New Arrivals", "Bestsellers", "Sale"] },
//     { title: "Company", links: ["Our Story", "Sustainability", "Careers", "Press", "Blog"] },
//     { title: "Support", links: ["Help Center", "Returns", "Shipping Info", "Size Guide", "Contact"] },
//     { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookies", "Accessibility"] },
//   ];
//   return (
//     <footer style={{ background: "#0F0E0C", color: "#F5F0E8", padding: "64px 24px 32px" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(4, 1fr)", gap: 48, marginBottom: 56, flexWrap: "wrap" }}>
//           <div>
//             <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#F5F0E8", marginBottom: 16, padding: 0 }}>NEST</button>
//             <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", lineHeight: 1.7, maxWidth: 220, fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
//               The world's most comfortable shoes, made with natural materials for the modern explorer.
//             </p>
//             <div style={{ display: "flex", gap: 10 }}>
//               {["IG", "TW", "FB", "YT"].map(s => (
//                 <a key={s} href="#" aria-label={s} style={{ width: 36, height: 36, borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,240,232,0.6)", fontSize: 11, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", fontFamily: "'Inter', sans-serif" }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(245,240,232,0.6)"; }}>
//                   {s}
//                 </a>
//               ))}
//             </div>
//           </div>
//           {cols.map(col => (
//             <div key={col.title}>
//               <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,240,232,0.4)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>{col.title}</div>
//               {col.links.map(link => (
//                 <a key={link} href="#" className="underline-anim" style={{ display: "block", padding: "5px 0", fontSize: 13, color: "rgba(245,240,232,0.55)", textDecoration: "none", fontFamily: "'Inter', sans-serif", transition: "color 0.15s" }}
//                   onMouseEnter={e => e.currentTarget.style.color = "#F5F0E8"}
//                   onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,232,0.55)"}>
//                   {link}
//                 </a>
//               ))}
//             </div>
//           ))}
//         </div>
//         <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
//           <p style={{ fontSize: 12, color: "rgba(245,240,232,0.35)", fontFamily: "'Inter', sans-serif" }}>© {new Date().getFullYear()} NEST Store. All rights reserved.</p>
//           <div style={{ display: "flex", gap: 8 }}>
//             {["🌍 EN", "🇺🇸 USD"].map(item => (
//               <button key={item} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "6px 14px", fontSize: 12, color: "rgba(245,240,232,0.5)", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>{item}</button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// // ─── SHOP PAGE ────────────────────────────────────────────────────────────────────
// function ShopPage({ onAddToCart, onWishlistToggle, wishlist, setPage }) {
//   const [sort, setSort] = useState("featured");
//   const [search, setSearch] = useState("");
//   const [priceMax, setPriceMax] = useState(200);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedCats, setSelectedCats] = useState([]);
//   const sorts = { featured: () => 0, newest: (a, b) => b.id - a.id, "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
//   const filtered = PRODUCTS.filter(p => (search ? p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) : true) && p.price <= priceMax && (selectedCats.length === 0 || selectedCats.some(c => p.tags.some(t => t.toLowerCase().includes(c.toLowerCase()))))).sort(sorts[sort] || (() => 0));

//   return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 120 }}>
//       {/* Shop Header */}
//       <div style={{ background: "#1C1917", padding: "56px 24px 48px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>All Products</p>
//           <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700, color: "#F5F0E8", marginBottom: 16 }}>Shop All</h1>
//           <p style={{ fontSize: 15, color: "rgba(245,240,232,0.6)", fontFamily: "'Inter', sans-serif" }}>{filtered.length} styles · Sustainably crafted for the modern explorer</p>
//         </div>
//       </div>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//         {/* Filters & Sort Bar */}
//         <div style={{ display: "flex", gap: 16, padding: "24px 0", alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #E7E5E4", marginBottom: 32 }}>
//           <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
//             <Icon.Search />
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
//               style={{ width: "100%", height: 44, padding: "0 16px 0 44px", borderRadius: 100, border: "1.5px solid #E7E5E4", background: "#fff", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" }}
//             />
//             <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#78716C", pointerEvents: "none" }}><Icon.Search /></div>
//           </div>
//           <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//             <span style={{ fontSize: 13, color: "#78716C", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>Max: ${priceMax}</span>
//             <input type="range" min={50} max={200} value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: 100, accentColor: "#A16207" }} aria-label="Maximum price filter" />
//           </div>
//           <select value={sort} onChange={e => setSort(e.target.value)} style={{ height: 44, padding: "0 16px", borderRadius: 100, border: "1.5px solid #E7E5E4", background: "#fff", fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: "pointer", outline: "none", color: "#1C1917" }}>
//             <option value="featured">Sort: Featured</option>
//             <option value="newest">Newest First</option>
//             <option value="price-asc">Price: Low to High</option>
//             <option value="price-desc">Price: High to Low</option>
//             <option value="rating">Top Rated</option>
//           </select>
//           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//             {["New", "Sustainable", "Trail", "Wool"].map(cat => (
//               <button key={cat} onClick={() => setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
//                 style={{ padding: "8px 16px", borderRadius: 100, border: "1.5px solid", borderColor: selectedCats.includes(cat) ? "#1C1917" : "#E7E5E4", background: selectedCats.includes(cat) ? "#1C1917" : "#fff", color: selectedCats.includes(cat) ? "#fff" : "#44403C", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s" }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Grid */}
//         {filtered.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "80px 24px" }}>
//             <p style={{ fontWeight: 600, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>No products match your filters. Try adjusting them.</p>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28, paddingBottom: 80 }}>
//             {filtered.map((p, i) => (
//               <div key={p.id} style={{ animation: `fadeUp 0.5s ${i * 0.07}s both` }}>
//                 <ProductCard product={p} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} isWishlisted={wishlist.some(w => w.id === p.id)} onClick={() => setPage("product")} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────────
// function ProductDetail({ product = PRODUCTS[0], onAddToCart, onWishlistToggle, wishlist, setPage }) {
//   const [imgIdx, setImgIdx] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [addedMsg, setAddedMsg] = useState(false);
//   const isWished = wishlist.some(w => w.id === product.id);

//   const handleAdd = () => {
//     if (!selectedSize) { alert("Please select a size"); return; }
//     onAddToCart(product, product.colors?.[selectedColor], selectedSize, qty);
//     setAddedMsg(true);
//     setTimeout(() => setAddedMsg(false), 2000);
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 100 }}>
//       {/* Breadcrumb */}
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
//         <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>
//           <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>Home</button>
//           <Icon.ChevronRight />
//           <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>Shop</button>
//           <Icon.ChevronRight />
//           <span style={{ color: "#1C1917", fontWeight: 500 }}>{product.name}</span>
//         </div>
//       </div>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
//         {/* Images */}
//         <div>
//           <div style={{ position: "relative", borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", background: "#F5F0E8", marginBottom: 16 }}>
//             <img src={product.images[imgIdx]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "all 0.4s ease" }} />
//             {product.isNew && <span style={{ position: "absolute", top: 20, left: 20, background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 100, fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em" }}>NEW</span>}
//           </div>
//           {product.images.length > 1 && (
//             <div style={{ display: "flex", gap: 10 }}>
//               {product.images.map((img, i) => (
//                 <button key={i} onClick={() => setImgIdx(i)} style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", border: `2.5px solid ${imgIdx === i ? "#1C1917" : "transparent"}`, cursor: "pointer", background: "#F5F0E8", transition: "border-color 0.2s", padding: 0 }}>
//                   <img src={img} alt={`View ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Info */}
//         <div style={{ animation: "fadeUp 0.6s both" }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#A16207", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>{product.brand}</p>
//           <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#1C1917", lineHeight: 1.1, marginBottom: 12 }}>{product.name}</h1>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
//             <StarRow rating={product.rating} />
//             <span style={{ fontSize: 13, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>{product.reviews.toLocaleString()} reviews</span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
//             <span style={{ fontFamily: "'Cormorant', serif", fontSize: 40, fontWeight: 700, color: "#1C1917" }}>{fmt(product.price)}</span>
//             {product.originalPrice && <span style={{ fontSize: 18, color: "#A8A29E", textDecoration: "line-through", fontFamily: "'Inter', sans-serif" }}>{fmt(product.originalPrice)}</span>}
//           </div>
//           <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.75, marginBottom: 32, fontFamily: "'Inter', sans-serif" }}>{product.description}</p>

//           {/* Colors */}
//           {product.colors && (
//             <div style={{ marginBottom: 28 }}>
//               <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
//                 Colour: <span style={{ fontWeight: 400, color: "#78716C" }}>{product.colors[selectedColor]?.name}</span>
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 {product.colors.map((c, i) => (
//                   <button key={c.name} title={c.name} onClick={() => setSelectedColor(i)}
//                     style={{ width: 36, height: 36, borderRadius: 18, background: c.hex, border: selectedColor === i ? "3px solid #1C1917" : "2px solid rgba(0,0,0,0.1)", cursor: "pointer", outline: selectedColor === i ? "3px solid #fff" : "none", outlineOffset: "-5px", transition: "all 0.2s", boxShadow: selectedColor === i ? "0 0 0 3px #1C1917" : "none" }} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Sizes */}
//           <div style={{ marginBottom: 32 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//               <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>Select Size</span>
//               <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#A16207", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Size Guide</button>
//             </div>
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {product.sizes.map(size => (
//                 <button key={size} onClick={() => setSelectedSize(size)}
//                   style={{ width: 52, height: 52, borderRadius: 14, border: `1.5px solid ${selectedSize === size ? "#1C1917" : "#E7E5E4"}`, background: selectedSize === size ? "#1C1917" : "#fff", color: selectedSize === size ? "#fff" : "#44403C", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s", boxShadow: selectedSize === size ? "none" : neoStyle("#fff").boxShadow }}>
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Qty + Add */}
//           <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center" }}>
//             <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E7E5E4", borderRadius: 100, overflow: "hidden", ...neoStyle("#FAFAF9"), borderColor: "#E7E5E4" }}>
//               <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", width: 44, height: 52, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#78716C" }}><Icon.Minus /></button>
//               <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: 16 }}>{qty}</span>
//               <button onClick={() => setQty(q => q + 1)} style={{ background: "none", border: "none", width: 44, height: 52, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917" }}><Icon.Plus /></button>
//             </div>
//             <button className="btn-primary" style={{ flex: 1, justifyContent: "center", height: 52, background: addedMsg ? "#059669" : "#1C1917" }} onClick={handleAdd}>
//               {addedMsg ? <><Icon.Check /> Added to Cart!</> : <><Icon.Bag /> Add to Cart · {fmt(product.price * qty)}</>}
//             </button>
//             <button onClick={() => onWishlistToggle(product)} aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
//               style={{ width: 52, height: 52, borderRadius: 100, border: "1.5px solid #E7E5E4", background: isWished ? "#FFF1F2" : "#fff", color: isWished ? "#ef4444" : "#78716C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
//               <Icon.Heart filled={isWished} />
//             </button>
//           </div>

//           {/* Trust badges */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
//             {[["Free Returns", Icon.Package], ["Free Shipping $100+", Icon.Truck]].map(([label, Ico]) => (
//               <div key={label} style={{ ...neoStyle("#FAFAF9"), borderRadius: 16, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
//                 <div style={{ color: "#A16207" }}><Ico /></div>
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>{label}</span>
//               </div>
//             ))}
//           </div>

//           {/* Tags */}
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             {product.tags.map(tag => (
//               <span key={tag} style={{ ...clayStyle("#F5F0E8"), padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>{tag}</span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <div style={{ background: "#F5F0E8", padding: "60px 24px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 36, fontWeight: 700, color: "#1C1917", marginBottom: 32 }}>You May Also Like</h2>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24 }}>
//             {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
//               <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} isWishlisted={wishlist.some(w => w.id === p.id)} onClick={() => setPage("product")} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────────
// function CheckoutPage({ cart, setPage }) {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({ email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", country: "US", phone: "" });
//   const [payForm, setPayForm] = useState({ card: "", name: "", expiry: "", cvv: "" });
//   const [placing, setPlacing] = useState(false);
//   const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
//   const ship = sub >= 100 ? 0 : 12;
//   const total = sub + ship;
//   const steps = ["Contact", "Shipping", "Payment", "Review"];

//   const handleOrder = async () => {
//     setPlacing(true);
//     await new Promise(r => setTimeout(r, 1800));
//     setPlacing(false);
//     setStep(5);
//   };

//   if (step === 5) return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px" }}>
//       <div style={{ ...clayStyle("#fff"), borderRadius: 32, padding: "60px 48px", textAlign: "center", maxWidth: 500 }}>
//         <div style={{ width: 72, height: 72, borderRadius: 36, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#fff" }}><Icon.Check /></div>
//         <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 40, fontWeight: 700, color: "#1C1917", marginBottom: 12 }}>Order Placed!</h1>
//         <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.7, marginBottom: 32, fontFamily: "'Inter', sans-serif" }}>Thank you for your purchase. You'll receive a confirmation email shortly. Your order will ship within 2 business days.</p>
//         <div style={{ background: "#F5F0E8", borderRadius: 16, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 13, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>Order Number</span>
//             <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>#NEST-{Math.floor(Math.random() * 90000) + 10000}</span>
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <span style={{ fontSize: 13, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>Total</span>
//             <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(total)}</span>
//           </div>
//         </div>
//         <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPage("home")}>Continue Shopping</button>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 100 }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 48, alignItems: "start" }}>
//         {/* Left */}
//         <div>
//           {/* Step Progress */}
//           <div style={{ display: "flex", gap: 0, marginBottom: 40, background: "#fff", borderRadius: 20, padding: 6, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
//             {steps.map((s, i) => (
//               <button key={s} onClick={() => i + 1 < step && setStep(i + 1)}
//                 style={{ flex: 1, padding: "10px 8px", borderRadius: 14, border: "none", background: step === i + 1 ? "#1C1917" : "transparent", color: step === i + 1 ? "#fff" : step > i + 1 ? "#059669" : "#A8A29E", fontSize: 12, fontWeight: 600, cursor: i + 1 < step ? "pointer" : "default", fontFamily: "'Inter', sans-serif", transition: "all 0.2s" }}>
//                 {step > i + 1 ? "✓ " : ""}{s}
//               </button>
//             ))}
//           </div>

//           {/* Step 1 */}
//           {step === 1 && (
//             <div style={{ animation: "fadeUp 0.4s both" }}>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Contact Information</h2>
//               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                 {[["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]].map(([field, label, type]) => (
//                   <div key={field}>
//                     <label htmlFor={`co-${field}`} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#44403C", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{label}</label>
//                     <input id={`co-${field}`} type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
//                       style={{ width: "100%", height: 48, padding: "0 16px", borderRadius: 14, border: "1.5px solid #E7E5E4", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", background: "#fff" }}
//                       onFocus={e => e.target.style.borderColor = "#1C1917"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
//                   </div>
//                 ))}
//                 <button className="btn-primary" style={{ marginTop: 8, alignSelf: "flex-start" }} onClick={() => setStep(2)}>Continue to Shipping <Icon.ArrowRight /></button>
//               </div>
//             </div>
//           )}

//           {/* Step 2 */}
//           {step === 2 && (
//             <div style={{ animation: "fadeUp 0.4s both" }}>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Shipping Address</h2>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//                 {[["firstName", "First Name"], ["lastName", "Last Name"], ["address", "Address", "1fr / span 2"], ["city", "City"], ["state", "State"], ["zip", "ZIP Code"], ["country", "Country"]].map(([field, label, span]) => (
//                   <div key={field} style={{ gridColumn: span || "auto" }}>
//                     <label htmlFor={`sh-${field}`} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#44403C", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{label}</label>
//                     <input id={`sh-${field}`} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
//                       style={{ width: "100%", height: 48, padding: "0 16px", borderRadius: 14, border: "1.5px solid #E7E5E4", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", background: "#fff" }}
//                       onFocus={e => e.target.style.borderColor = "#1C1917"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
//                   </div>
//                 ))}
//               </div>
//               <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
//                 <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
//                 <button className="btn-primary" onClick={() => setStep(3)}>Continue to Payment <Icon.ArrowRight /></button>
//               </div>
//             </div>
//           )}

//           {/* Step 3 */}
//           {step === 3 && (
//             <div style={{ animation: "fadeUp 0.4s both" }}>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Payment</h2>
//               <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
//                 {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map(method => (
//                   <div key={method} style={{ ...neoStyle("#FAFAF9"), borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 700, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>{method}</div>
//                 ))}
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                 {[["card", "Card Number", "text", "0000 0000 0000 0000"], ["name", "Name on Card", "text", "Full name"], ["expiry", "Expiry Date", "text", "MM/YY"], ["cvv", "CVV", "password", "•••"]].map(([field, label, type, ph]) => (
//                   <div key={field}>
//                     <label htmlFor={`pay-${field}`} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#44403C", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{label}</label>
//                     <input id={`pay-${field}`} type={type} placeholder={ph} value={payForm[field]} onChange={e => setPayForm(f => ({ ...f, [field]: e.target.value }))}
//                       style={{ width: "100%", height: 48, padding: "0 16px", borderRadius: 14, border: "1.5px solid #E7E5E4", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box", background: "#fff" }}
//                       onFocus={e => e.target.style.borderColor = "#1C1917"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
//                   </div>
//                 ))}
//               </div>
//               <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
//                 <button className="btn-outline" onClick={() => setStep(2)}>Back</button>
//                 <button className="btn-primary" onClick={() => setStep(4)}>Review Order <Icon.ArrowRight /></button>
//               </div>
//             </div>
//           )}

//           {/* Step 4 */}
//           {step === 4 && (
//             <div style={{ animation: "fadeUp 0.4s both" }}>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Review Your Order</h2>
//               {cart.map(item => (
//                 <div key={item.id} style={{ display: "flex", gap: 16, marginBottom: 16, padding: 16, ...clayStyle("#fff"), borderRadius: 18 }}>
//                   <img src={item.img} alt={item.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
//                     <div style={{ fontSize: 12, color: "#78716C", fontFamily: "'Inter', sans-serif" }}>Qty: {item.qty} {item.color && `· ${item.color}`}</div>
//                   </div>
//                   <div style={{ fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(item.price * item.qty)}</div>
//                 </div>
//               ))}
//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 <button className="btn-outline" onClick={() => setStep(3)}>Back</button>
//                 <button className="btn-primary" style={{ flex: 1, justifyContent: "center", background: placing ? "#78716C" : "#1C1917" }} onClick={handleOrder} disabled={placing}>
//                   {placing ? <><span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: 8 }} /> Placing Order…</> : <>Place Order · {fmt(total)} <Icon.ArrowRight /></>}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div style={{ position: "sticky", top: 100 }}>
//           <div style={{ ...clayStyle("#fff"), borderRadius: 28, padding: "28px 24px" }}>
//             <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 700, color: "#1C1917", marginBottom: 20 }}>Order Summary</h3>
//             {cart.map(item => (
//               <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
//                 <div style={{ position: "relative" }}>
//                   <img src={item.img} alt={item.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />
//                   <span style={{ position: "absolute", top: -6, right: -6, background: "#1C1917", color: "#fff", borderRadius: 10, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{item.qty}</span>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
//                   <div style={{ fontSize: 12, color: "#78716C" }}>{fmt(item.price)}</div>
//                 </div>
//                 <div style={{ fontWeight: 700, fontSize: 13, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(item.price * item.qty)}</div>
//               </div>
//             ))}
//             <div style={{ borderTop: "1px solid #E7E5E4", paddingTop: 16, marginTop: 16 }}>
//               {[["Subtotal", fmt(sub)], ["Shipping", ship === 0 ? "FREE 🎉" : fmt(ship)], ["Tax", "Calculated at next step"], ["Total", fmt(total)]].map(([label, val], i) => (
//                 <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i === 3 ? "1.5px solid #E7E5E4" : "none", marginTop: i === 3 ? 8 : 0 }}>
//                   <span style={{ fontSize: i === 3 ? 15 : 13, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? "#1C1917" : "#78716C", fontFamily: "'Inter', sans-serif" }}>{label}</span>
//                   <span style={{ fontSize: i === 3 ? 15 : 13, fontWeight: i === 3 ? 700 : 500, color: i === 3 ? "#1C1917" : "#44403C", fontFamily: "'Inter', sans-serif" }}>{val}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── HOME PAGE ────────────────────────────────────────────────────────────────────
// function HomePage({ onAddToCart, onWishlistToggle, wishlist, setPage }) {
//   return (
//     <>
//       <HeroSection setPage={setPage} />
//       <MarqueeBanner />
//       <ProductGridSection title="New Arrivals" badge="Just Dropped" subtitle="Fresh from the lab — natural materials, next-gen performance." products={PRODUCTS.filter(p => p.isNew)} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} wishlist={wishlist} setPage={setPage} />
//       <CategoryRow setPage={setPage} />
//       <ProductGridSection title="Best Sellers" badge="Fan Favourites" subtitle="The styles our community keeps coming back to." products={PRODUCTS.filter(p => p.isBestSeller)} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} wishlist={wishlist} setPage={setPage} />
//       <CollectionsSection setPage={setPage} />
//       <BrandValues />
//       <SustainabilityStrip />
//       <Testimonials />
//       <ProductGridSection title="You'll Also Love" badge="Discover More" subtitle="Explore our full range of natural comfort." products={PRODUCTS.slice(2, 6)} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle} wishlist={wishlist} setPage={setPage} />
//       <Newsletter />
//     </>
//   );
// }

// // ─── ACCOUNT PAGE (simple) ────────────────────────────────────────────────────────
// function AccountPage({ setPage }) {
//   const [tab, setTab] = useState("profile");
//   const tabs = ["profile", "orders", "addresses", "settings"];
//   return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 100 }}>
//       <div style={{ background: "#1C1917", padding: "48px 24px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Account</p>
//           <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 48, fontWeight: 700, color: "#F5F0E8" }}>My Account</h1>
//         </div>
//       </div>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 40 }}>
//         <nav>
//           {tabs.map(t => (
//             <button key={t} onClick={() => setTab(t)}
//               style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 14, border: "none", background: tab === t ? "#1C1917" : "transparent", color: tab === t ? "#fff" : "#44403C", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 4, fontFamily: "'Inter', sans-serif", textTransform: "capitalize", transition: "all 0.2s" }}>
//               {t}
//             </button>
//           ))}
//           <button className="btn-outline" style={{ marginTop: 24, width: "100%", justifyContent: "center", fontSize: 13 }} onClick={() => setPage("home")}>Sign Out</button>
//         </nav>
//         <div style={{ ...clayStyle("#fff"), borderRadius: 28, padding: "36px 32px", animation: "fadeUp 0.4s both" }}>
//           {tab === "profile" && (
//             <>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Profile</h2>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 {[["First Name", "Junair"], ["Last Name", "PT"], ["Email", "junair@example.com"], ["Phone", "+91 00000 00000"]].map(([label, val]) => (
//                   <div key={label}>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{label}</label>
//                     <input defaultValue={val} style={{ width: "100%", height: 44, padding: "0 14px", borderRadius: 12, border: "1.5px solid #E7E5E4", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box" }} />
//                   </div>
//                 ))}
//               </div>
//               <button className="btn-primary" style={{ marginTop: 24 }}>Save Changes</button>
//             </>
//           )}
//           {tab === "orders" && (
//             <>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Order History</h2>
//               {[{ num: "#NEST-48291", date: "June 15, 2025", items: "Tree Runner NZ, Wool Runner", total: "$208", status: "Delivered" }, { num: "#NEST-39104", date: "April 3, 2025", items: "Dasher NZ Runner", total: "$135", status: "Delivered" }].map(o => (
//                 <div key={o.num} style={{ border: "1.5px solid #E7E5E4", borderRadius: 18, padding: "20px 24px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
//                   <div>
//                     <div style={{ fontWeight: 700, color: "#1C1917", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{o.num}</div>
//                     <div style={{ fontSize: 12, color: "#78716C", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{o.date} · {o.items}</div>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <div style={{ fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{o.total}</div>
//                     <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: 100, display: "inline-block", marginTop: 4 }}>{o.status}</span>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//           {tab === "addresses" && (
//             <>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Addresses</h2>
//               <div style={{ border: "1.5px solid #E7E5E4", borderRadius: 18, padding: 20, display: "inline-flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
//                 <div>
//                   <div style={{ fontWeight: 700, color: "#1C1917", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Home</div>
//                   <div style={{ fontSize: 13, color: "#78716C", marginTop: 4, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>123 Main St<br />Kerala, IN 682001</div>
//                   <button style={{ marginTop: 10, fontSize: 12, color: "#A16207", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Edit</button>
//                 </div>
//               </div>
//               <div><button className="btn-outline" style={{ fontSize: 13 }}>+ Add New Address</button></div>
//             </>
//           )}
//           {tab === "settings" && (
//             <>
//               <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 700, color: "#1C1917", marginBottom: 24 }}>Settings</h2>
//               {["Email notifications", "Order updates", "New arrivals", "Promotional offers"].map(s => (
//                 <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F5F5F4" }}>
//                   <span style={{ fontSize: 14, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>{s}</span>
//                   <button style={{ width: 44, height: 24, borderRadius: 12, background: "#1C1917", border: "none", cursor: "pointer", position: "relative" }}>
//                     <div style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: 9, background: "#fff" }} />
//                   </button>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── CART PAGE ────────────────────────────────────────────────────────────────────
// function CartPage({ cart, onUpdate, onRemove, setPage }) {
//   const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
//   const ship = sub >= 100 ? 0 : 12;
//   return (
//     <div style={{ minHeight: "100vh", background: "#FAFAF9", paddingTop: 100 }}>
//       <div style={{ background: "#1C1917", padding: "48px 24px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 48, fontWeight: 700, color: "#F5F0E8" }}>Your Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h1>
//         </div>
//       </div>
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 40 }}>
//         <div>
//           {cart.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 24px" }}>
//               <p style={{ fontWeight: 600, color: "#78716C", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>Your cart is empty</p>
//               <button className="btn-primary" onClick={() => setPage("shop")}>Continue Shopping</button>
//             </div>
//           ) : cart.map(item => (
//             <div key={item.id} style={{ display: "flex", gap: 20, marginBottom: 20, padding: 20, ...clayStyle("#fff"), borderRadius: 24 }}>
//               <img src={item.img} alt={item.name} style={{ width: 100, height: 100, borderRadius: 16, objectFit: "cover" }} />
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 16, fontWeight: 700, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{item.name}</div>
//                 <div style={{ fontSize: 13, color: "#78716C", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{item.color && `${item.color} · `}{item.size && `Size ${item.size}`}</div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
//                   <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E7E5E4", borderRadius: 100 }}>
//                     <button onClick={() => onUpdate(item.id, item.qty - 1)} style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#78716C" }}><Icon.Minus /></button>
//                     <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{item.qty}</span>
//                     <button onClick={() => onUpdate(item.id, item.qty + 1)} style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917" }}><Icon.Plus /></button>
//                   </div>
//                   <span style={{ fontWeight: 700, fontSize: 16, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{fmt(item.price * item.qty)}</span>
//                   <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", marginLeft: "auto", padding: 8 }}><Icon.Trash /></button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {cart.length > 0 && (
//           <div>
//             <div style={{ ...clayStyle("#fff"), borderRadius: 28, padding: "28px 24px", position: "sticky", top: 100 }}>
//               <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 700, color: "#1C1917", marginBottom: 20 }}>Order Summary</h3>
//               {[["Subtotal", fmt(sub)], ["Shipping", ship === 0 ? "FREE 🎉" : fmt(ship)], ["Total", fmt(sub + ship)]].map(([l, v], i) => (
//                 <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i === 2 ? "1.5px solid #E7E5E4" : "none", marginTop: i === 2 ? 8 : 0 }}>
//                   <span style={{ fontSize: i === 2 ? 16 : 13, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "#1C1917" : "#78716C", fontFamily: "'Inter', sans-serif" }}>{l}</span>
//                   <span style={{ fontSize: i === 2 ? 16 : 13, fontWeight: i === 2 ? 700 : 500, color: "#1C1917", fontFamily: "'Inter', sans-serif" }}>{v}</span>
//                 </div>
//               ))}
//               <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => setPage("checkout")}>Proceed to Checkout <Icon.ArrowRight /></button>
//               <button className="btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={() => setPage("shop")}>Continue Shopping</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── ROOT APP ─────────────────────────────────────────────────────────────────────
// export default function App() {
//   const [page, setPage] = useState("home");
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [wishlistOpen, setWishlistOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);

//   const addToCart = (product, color, size, qty = 1) => {
//     setCart(prev => {
//       const key = `${product.id}-${color?.name || ""}-${size || ""}`;
//       const existing = prev.find(i => i.id === key);
//       if (existing) return prev.map(i => i.id === key ? { ...i, qty: i.qty + qty } : i);
//       return [...prev, { id: key, name: product.name, brand: product.brand, price: product.price, img: product.images[0], qty, color: color?.name, size }];
//     });
//     setCartOpen(true);
//   };

//   const toggleWishlist = (product) => {
//     setWishlist(prev => prev.some(w => w.id === product.id)
//       ? prev.filter(w => w.id !== product.id)
//       : [...prev, { id: product.id, name: product.name, brand: product.brand, price: product.price, img: product.images[0] }]);
//   };

//   const updateCart = (id, qty) => {
//     if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id));
//     else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
//   };

//   const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
//   const removeFromWishlist = (id) => setWishlist(prev => prev.filter(w => w.id !== id));
//   const addWishlistToCart = (item) => { addToCart({ id: item.id, name: item.name, brand: item.brand, price: item.price, images: [item.img] }, null, null); };

//   const goToProduct = (product) => { setSelectedProduct(product || PRODUCTS[0]); setPage("product"); };

//   const pageProps = { onAddToCart: addToCart, onWishlistToggle: toggleWishlist, wishlist, setPage, cart };

//   return (
//     <div style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAF9", minHeight: "100vh" }}>
//       <Header cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} onWishlistOpen={() => setWishlistOpen(true)} onSearchOpen={() => setSearchOpen(true)} page={page} setPage={setPage} />
//       <main>
//         {page === "home" && <HomePage {...pageProps} />}
//         {page === "shop" && <ShopPage {...pageProps} />}
//         {page === "product" && <ProductDetail product={selectedProduct} {...pageProps} />}
//         {page === "cart" && <CartPage cart={cart} onUpdate={updateCart} onRemove={removeFromCart} setPage={setPage} />}
//         {page === "checkout" && <CheckoutPage cart={cart} setPage={setPage} />}
//         {page === "account" && <AccountPage setPage={setPage} />}
//       </main>
//       {!["checkout"].includes(page) && <Footer setPage={setPage} />}
//       <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onUpdate={updateCart} onRemove={removeFromCart} setPage={setPage} />
//       <WishlistDrawer wishlist={wishlist} open={wishlistOpen} onClose={() => setWishlistOpen(false)} onRemove={removeFromWishlist} onAddToCart={addWishlistToCart} />
//       <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
//     </div>
//   );
// }