'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FluidBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-dark">
      {/* Interactive Fluid Blob - Follows Mouse with delay */}
      <motion.div 
        animate={{ 
          x: mousePos.x - 250,
          y: mousePos.y - 250,
        }}
        style={{ willChange: 'transform' }}
        transition={{ type: 'spring', damping: 30, stiffness: 50, restDelta: 0.001 }}
        className="absolute w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] opacity-50"
      />

      {/* Autonomous Physics-like Blobs */}
      <motion.div 
        animate={{ 
          x: [100, 300, 100],
          y: [200, 500, 200],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        style={{ willChange: 'transform' }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] bg-sky/5 rounded-full blur-[140px]"
      />

      <motion.div 
        animate={{ 
          x: ['80%', '60%', '80%'],
          y: ['20%', '50%', '20%'],
          scale: [1, 1.5, 1],
        }}
        style={{ willChange: 'transform' }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[800px] h-[800px] bg-brand/5 rounded-full blur-[160px]"
      />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
}
