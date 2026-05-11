"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client, urlFor } from "@/sanity/lib/client";
import Image from "next/image";

export default function Gallery() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchArt = async () => {
      try {
        const data = await client.fetch(`*[_type == "artwork"] | order(_createdAt desc)`);
        setArtworks(data);
      } catch (err) {
        console.error("Sanity fetch failed:", err);
      }
    };
    fetchArt();
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  const featuredArt = artworks.find((a) => a.isFeatured) || artworks[0];
  const commissions = artworks.filter((a) => a.category === "commission");
  const originals = artworks.filter((a) => a.category === "original");

  const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <main className="relative min-h-screen bg-[#050505] p-6 md:p-12 text-white/90 overflow-hidden font-sans selection:bg-pink-500/30">

      {/* AMBIENT GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25"
        style={{
          background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236,72,153,0.12), rgba(168,85,247,0.08), transparent 80%)`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] brightness-200 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* NAV */}
      <nav className="relative z-10 flex justify-between items-center mb-12">
        <Link href="/" className="text-[10px] uppercase tracking-[0.4em] font-black text-pink-400/40 hover:text-pink-400 transition-colors cursor-none">
          ← Back_to_Studio
        </Link>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Gallery // Archive</p>
      </nav>

      <div className="relative z-10 flex flex-col gap-6">

        {/* ── FEATURED BOX ── */}
        <motion.section
          custom={0} variants={fadeIn} initial="initial" animate="animate"
          className="w-full aspect-[21/9] bg-[#0c0c0c] rounded-[3rem] border border-pink-500/20 overflow-hidden relative group shadow-[0_0_80px_-20px_rgba(236,72,153,0.1)]"
        >
          {featuredArt?.image && (
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000">
              <Image src={urlFor(featuredArt.image).url()} alt={featuredArt?.title || "Featured"} fill className="object-cover" priority />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

          <div className="absolute top-10 left-10 z-20">
            <span className="bg-pink-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest animate-pulse">
              Featured
            </span>
          </div>

          <div className="absolute bottom-10 left-10 z-20">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-2">Selected Works // 2026</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              {featuredArt?.title || "No_Featured_Piece"}
            </h1>
          </div>

          {!featuredArt?.image && (
            <div className="w-full h-full flex items-center justify-center italic text-white/5 text-[10px] uppercase tracking-[1.5em]">
              Featured_Asset_Pending
            </div>
          )}
        </motion.section>

        {/* ── CATEGORY BOXES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COMMISSIONS */}
          <motion.section
            custom={1} variants={fadeIn} initial="initial" animate="animate"
            className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 hover:border-pink-500/30 transition-all duration-500 overflow-hidden group"
          >
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-pink-400 mb-2">Category_01</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Commissions</h2>
              </div>
              <span className="text-[10px] font-black text-white/20 font-mono">{commissions.length} pieces</span>
            </div>

            <div className="grid grid-cols-2 auto-rows-[180px] gap-3 p-3">
              {commissions.length > 0 ? (
                commissions.slice(0, 4).map((art) => (
                  <div key={art._id} onClick={() => art.image && setLightbox({ url: urlFor(art.image).url(), title: art.title })} className="relative rounded-[1.5rem] overflow-hidden bg-[#111] group/item cursor-none">
                    {art.image && (
                      <Image src={urlFor(art.image).url()} alt={art.title} fill className="object-cover opacity-70 group-hover/item:opacity-100 transition-opacity duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                      <span className="text-[9px] uppercase tracking-widest font-black bg-black/60 px-3 py-1 rounded-full">View</span>
                    </div>
                    <p className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-tight z-10">{art.title}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center h-[180px] text-white/10 text-[10px] uppercase tracking-[1em] italic">
                  No_Commissions_Yet
                </div>
              )}
            </div>

            {commissions.length > 4 && (
              <div className="p-6 text-center">
                <span className="text-[9px] uppercase tracking-widest font-black text-pink-400/60">+{commissions.length - 4} more</span>
              </div>
            )}
          </motion.section>

          {/* ORIGINAL WORKS */}
          <motion.section
            custom={2} variants={fadeIn} initial="initial" animate="animate"
            className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden group"
          >
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-purple-400 mb-2">Category_02</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Original Works</h2>
              </div>
              <span className="text-[10px] font-black text-white/20 font-mono">{originals.length} pieces</span>
            </div>

            <div className="grid grid-cols-2 auto-rows-[180px] gap-3 p-3">
              {originals.length > 0 ? (
                originals.slice(0, 4).map((art) => (
                  <div key={art._id} onClick={() => art.image && setLightbox({ url: urlFor(art.image).url(), title: art.title })} className="relative rounded-[1.5rem] overflow-hidden bg-[#111] group/item cursor-none">
                    {art.image && (
                      <Image src={urlFor(art.image).url()} alt={art.title} fill className="object-cover opacity-70 group-hover/item:opacity-100 transition-opacity duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                      <span className="text-[9px] uppercase tracking-widest font-black bg-black/60 px-3 py-1 rounded-full">View</span>
                    </div>
                    <p className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-tight z-10">{art.title}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center h-[180px] text-white/10 text-[10px] uppercase tracking-[1em] italic">
                  No_Originals_Yet
                </div>
              )}
            </div>

            {originals.length > 4 && (
              <div className="p-6 text-center">
                <span className="text-[9px] uppercase tracking-widest font-black text-purple-400/60">+{originals.length - 4} more</span>
              </div>
            )}
          </motion.section>

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-none"
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] font-black text-white/40">{lightbox.title}</p>
          <button onClick={() => setLightbox(null)} className="mt-4 text-[9px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-colors cursor-none">✕ Close</button>
        </motion.div>
      )}

      <footer className="relative z-10 mt-24 pb-20 text-center opacity-20">
        <p className="text-[10px] uppercase tracking-[1em] italic">Archive Complete</p>
      </footer>
    </main>
  );
}
