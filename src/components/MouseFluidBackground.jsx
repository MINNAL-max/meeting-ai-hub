import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const MouseFluidBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0a0c]">
      
      {/* Dynamic Ambient Glow connected to cursor */}
      <motion.div
        className="absolute rounded-[100%] blur-[120px] mix-blend-screen opacity-60"
        style={{
          width: "60vw",
          height: "60vw",
          x: useTransform(x, (val) => val - window.innerWidth * 0.3),
          y: useTransform(y, (val) => val - window.innerWidth * 0.3),
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%)"
        }}
      />

      <motion.div
        className="absolute rounded-[100%] blur-[80px] mix-blend-screen opacity-80"
        style={{
          width: "30vw",
          height: "30vw",
          x: useTransform(x, (val) => val - window.innerWidth * 0.15),
          y: useTransform(y, (val) => val - window.innerWidth * 0.15),
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)"
        }}
        transition={{ type: "spring", stiffness: 50, damping: 40, delay: 0.1 }}
      />
      
      {/* Base Grid Texture for Brutalist Tech feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
    </div>
  );
};

export default MouseFluidBackground;
