import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 p-6">
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full mix-blend-overlay"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white/5 rounded-full mix-blend-overlay"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <Sparkles size={14} className="text-brand-neon" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/70">Intelligence Reimagined</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl lg:text-[140px] font-black leading-none tracking-tighter mb-6 text-glow"
        >
          MEETING<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-purple-500 to-brand-aqua">
            AI HUB
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-2xl text-white/50 font-light max-w-2xl mb-12"
        >
          Transform your raw discussions into structured intelligence. Unlock sentiments, tracking tasks, and navigating your team's collective mind.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, letterSpacing: "2px" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          transition={{ duration: 0.3, delay: 0 }} // Short hover duration, but entrance uses standard staggered delay visually handled by parent or layout if wrapped
          className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-full overflow-hidden"
          style={{ animationFillMode: "backwards", animationDelay: "1.2s", animationName: "fadeUp", animationDuration: "1s" }}
        >
          <span className="relative z-10">Initialize Session</span>
          <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-brand-neon to-brand-aqua opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"></div>
        </motion.button>
        
        {/* Entrance animation CSS injection for the button delay workaround without framer motion complex states */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      
    </div>
  );
};

export default Landing;
