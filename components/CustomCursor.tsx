"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Removed useSpring

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('[data-cursor="big"]'));
    };

    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block bg-white"
      animate={{
        x: mousePosition.x + (isHovering ? -40 : -8),
        y: mousePosition.y + (isHovering ? -40 : -8),
        width: isHovering ? 80 : 16,
        height: isHovering ? 80 : 16,
      }}
      transition={{
        type: "tween", // 'tween' is linear, no bounce/velocity
        ease: "backOut", // or use "linear" for zero easing
        duration: 0.15, // extremely fast response
      }}
    >
      {isHovering && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-black"
        >
          View
        </motion.span>
      )}
    </motion.div>
  );
}