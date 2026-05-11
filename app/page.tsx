"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client, urlFor } from '@/sanity/lib/client';
import Image from 'next/image';

export default function Home() {
  const [time, setTime] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [wip, setWip] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Fetch live data from Sanity
    const fetchArt = async () => {
      try {
        const query = `*[_type == "artwork"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        setArtworks(data);
        const wipData = await client.fetch(`*[_type == "wip"][0]`);
        setWip(wipData);
      } catch (err) {
        console.error("Sanity fetch failed:", err);
      }
    };
    fetchArt();

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 40 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }
    })
  };

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  // Find the piece she marked as "Featured" in the Studio
  const featuredArt = artworks.find(art => art.isFeatured) || artworks[0];

  return (
    <main className="relative min-h-screen p-4 md:p-10 text-white/90 overflow-hidden font-sans selection:bg-pink-500/30">
      
      {/* 1. FLOWY BACKGROUND MESH */}
      <div className="bg-mesh" />
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[140px] animate-float opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-float opacity-50" style={{ animationDelay: '-5s' }} />
      </div>

      {/* AMBIENT MOUSE GLOW */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-20" 
        style={{
          background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.05), transparent 80%)`
        }}
      />

      {/* GRAIN OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* TOP NAVIGATION */}
      <nav className="relative z-10 flex justify-between items-center mb-16 text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 border-b border-white/5 pb-6">
        <div className="flex gap-8">
          <Link href="/" className="text-pink-400/80 hover:text-pink-400 hover:line-through transition-all cursor-none">Index</Link>
          <Link href="/gallery" className="hover:text-purple-400 hover:line-through transition-all cursor-none">Gallery</Link>
        </div>
        <div className="flex gap-4 items-center font-mono">
          <span className="text-pink-500 animate-pulse text-[6px]">●</span>
          <span className="opacity-60">{time} GMT+5:30</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-24"
      >
        <h1 className="text-[14vw] md:text-[16vw] font-black tracking-[-0.07em] leading-[0.8] uppercase bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-100 to-purple-400/80 pb-4">
          Sandiya<span className="align-top text-xs md:text-2xl font-normal text-pink-500/30 ml-2 tracking-normal italic"></span>
        </h1>
        <div className="mt-12 flex justify-between items-start">
           <p className="text-xs font-medium text-white/30 max-w-[280px] leading-relaxed uppercase tracking-tight">
             I create pieces that feel <span className="text-pink-400/60">personal, soft, and lived in.</span>
           </p>
           <div className="text-right font-mono">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-pink-500/20 italic">Studio_Access_v3.0</p>
           </div>
        </div>
      </motion.div>

      {/* BENTO GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">

        {/* 0. DYNAMIC FEATURED ART BOX */}
        <motion.div 
          custom={0} variants={fadeIn} initial="initial" animate="animate"
          data-cursor="big"
          className="md:col-span-12 md:row-span-4 frosted-glass rounded-[3.5rem] relative overflow-hidden group mb-6"
        >
          {featuredArt?.image && (
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000">
               <Image 
                src={urlFor(featuredArt.image).url()} 
                alt={featuredArt.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-12">
            <p className="text-[10px] uppercase tracking-[0.5em] text-pink-500 font-black mb-4">Latest_Masterpiece // 2026</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              {featuredArt?.title || "Loading_Studio..."}
            </h2>
            <Link href="/gallery" className="inline-block px-8 py-3 rounded-full border border-white/20 text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all cursor-none">
              View Gallery ↗
            </Link>
          </div>
        </motion.div>
        
        {/* 1. COMMISSIONS */}
        <motion.div 
          custom={1} variants={fadeIn} initial="initial" animate="animate"
          className="md:col-span-8 md:row-span-2 frosted-glass rounded-[3rem] relative overflow-hidden shadow-[0_0_80px_-20px_rgba(236,72,153,0.1)] group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/[0.03] to-transparent bg-[length:100%_4px] animate-scanline pointer-events-none" />
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">Status: Open_for_Commissions</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Want - one?</h3>
            <p className="text-[10px] uppercase tracking-widest text-white/20 max-w-xs mb-8"> Portraits, custom artworks, and quiet details made with care.</p>
            <button 
              onClick={() => window.location.href = 'https://ig.me/m/sandydoesarts'}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase rounded-full hover:scale-105 transition-transform cursor-none active:scale-95"
            >
              Request Work
            </button>
          </div>
        </motion.div>

        {/* 2. WORK IN PROGRESS */}
        <motion.div
          custom={2} variants={fadeIn} initial="initial" animate="animate"
          className="md:col-span-4 md:row-span-3 frosted-glass rounded-[3rem] p-10 flex flex-col justify-between hover:border-yellow-500/20 transition-all group relative overflow-hidden"
        >
          {/* Blurred WIP image background */}
          {wip?.image && (
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
              <Image src={urlFor(wip.image).url()} alt="WIP" fill className="object-cover blur-xl scale-110" />
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">Live_Studio_Feed</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Work_in<br/>Progress</h3>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-1">Current Piece</p>
              <p className="text-sm font-black uppercase tracking-tight text-white/80">{wip?.title || "—"}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3">Stage</p>
              <div className="flex gap-1.5 flex-wrap">
                {["Sketching", "Inking", "Coloring", "Finalizing", "Done"].map((stage) => {
                  const stages = ["Sketching", "Inking", "Coloring", "Finalizing", "Done"];
                  const current = stages.indexOf(wip?.stage);
                  const idx = stages.indexOf(stage);
                  const isActive = stage === wip?.stage;
                  const isPast = current > -1 && idx < current;
                  return (
                    <span key={stage} className={`text-[8px] uppercase font-black px-2 py-1 rounded-full tracking-widest transition-all ${
                      isActive ? "bg-yellow-400 text-black" :
                      isPast ? "bg-white/10 text-white/40" :
                      "bg-white/5 text-white/15"
                    }`}>{stage}</span>
                  );
                })}
              </div>
            </div>
            {wip?.startedAt && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-1">Started</p>
                <p className="text-[10px] font-black font-mono text-white/40">{new Date(wip.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            )}
          </div>

          <p className="text-[9px] uppercase font-black tracking-widest text-yellow-400/40 group-hover:text-yellow-400/80 transition-colors">Updated via Studio ↗</p>
        </motion.div>

        {/* 3. ORIGINAL WORKS */}
        <motion.div 
          custom={3} variants={fadeIn} initial="initial" animate="animate"
          className="md:col-span-8 md:row-span-1 frosted-glass rounded-[2.5rem] px-10 flex items-center justify-between hover:border-pink-500/20 transition-all group"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20 mb-1">Personal_Collection</p>
            <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-pink-400 transition-colors">Original_Artworks</h3>
          </div>
          <Link href="/gallery" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-none text-xl">
            ↗
          </Link>
        </motion.div>
      </div>

      <footer className="relative z-10 mt-32 border-t border-white/5 pt-12 pb-20 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] uppercase tracking-[0.4em] font-bold text-white/20">
        <div>Sandiya // {new Date().getFullYear()}</div>
        <div className="flex gap-12 font-mono">
          <a href="https://www.instagram.com/sandydoesarts?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:text-pink-400 transition-colors tracking-[0.6em] cursor-none">Instagram</a>
          <a href="mailto:" className="hover:text-purple-400 transition-colors tracking-[0.6em] cursor-none">Email</a>
        </div>
      </footer>
    </main>
  );
}