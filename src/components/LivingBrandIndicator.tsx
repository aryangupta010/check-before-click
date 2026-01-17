import { motion, useReducedMotion, type Easing } from "framer-motion";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/urlAnalyzer";

export type BrandState = "idle" | "switching" | "analyzing" | "result";

interface LivingBrandIndicatorProps {
  state: BrandState;
  riskLevel?: RiskLevel;
  onClick?: () => void;
}

const easeInOut: Easing = "easeInOut";
const easeOut: Easing = "easeOut";

const LivingBrandIndicator = ({ 
  state, 
  riskLevel,
  onClick 
}: LivingBrandIndicatorProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Determine the pulse/glow color based on result
  const getResultAccent = () => {
    if (state !== "result" || !riskLevel) return "primary";
    switch (riskLevel) {
      case "safe": return "safe";
      case "suspicious": return "suspicious";
      case "dangerous": return "dangerous";
    }
  };

  const accentColor = getResultAccent();

  // Animation variants for the logo container
  const containerVariants = {
    idle: {
      scale: 1,
      opacity: 1,
    },
    switching: {
      scale: [1, 0.95, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 0.25,
        ease: easeInOut,
      },
    },
    analyzing: {
      scale: [1, 0.97, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    result: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Animation for the breathing glow
  const glowVariants = {
    idle: {
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    switching: {
      opacity: 0.6,
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
    analyzing: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.15, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    result: {
      opacity: riskLevel === "safe" ? 0.4 : riskLevel === "suspicious" ? 0.5 : 0.6,
      scale: riskLevel === "dangerous" ? 1.1 : 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // Animation for the status dot
  const dotVariants = {
    idle: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    switching: {
      scale: 0.8,
      opacity: 0.5,
      transition: {
        duration: 0.15,
      },
    },
    analyzing: {
      scale: [1, 1.4, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
    result: {
      scale: riskLevel === "dangerous" ? [1, 1.3, 1] : 1,
      opacity: 1,
      transition: riskLevel === "dangerous" 
        ? { duration: 1.5, repeat: Infinity, ease: easeInOut }
        : { type: "spring" as const, stiffness: 300 },
    },
  };

  // If user prefers reduced motion, simplify all animations
  if (prefersReducedMotion) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
      >
        <div className="relative">
          <Terminal className="w-8 h-8 text-primary" />
          <div 
            className={cn(
              "absolute -top-1 -right-1 w-2 h-2 rounded-full",
              accentColor === "primary" && "bg-primary",
              accentColor === "safe" && "bg-safe",
              accentColor === "suspicious" && "bg-suspicious",
              accentColor === "dangerous" && "bg-dangerous"
            )} 
          />
        </div>
        <div className="font-mono">
          <span className="text-primary font-bold tracking-tight">BEFORE</span>
          <span className="text-muted-foreground">.click</span>
        </div>
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Logo Container */}
      <motion.div 
        className="relative"
        variants={containerVariants}
        animate={state}
      >
        {/* Ambient glow layer */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-lg -z-10",
            accentColor === "primary" && "bg-primary/30",
            accentColor === "safe" && "bg-safe/30",
            accentColor === "suspicious" && "bg-suspicious/30",
            accentColor === "dangerous" && "bg-dangerous/30"
          )}
          variants={glowVariants}
          animate={state}
          style={{ 
            width: "150%", 
            height: "150%", 
            left: "-25%", 
            top: "-25%" 
          }}
        />

        {/* Main icon */}
        <img 
          src="/logo.png"
          alt="Logo"
          className={cn(
            "w-8 h-8 transition-opacity duration-300 object-contain",
            accentColor !== "primary" && "opacity-80" // slight dim if not primary since we can't easily recolor a PNG with classes like we can an SVG
          )} 
        />

        {/* Status dot */}
        <motion.div
          className={cn(
            "absolute -top-1 -right-1 w-2 h-2 rounded-full",
            accentColor === "primary" && "bg-primary",
            accentColor === "safe" && "bg-safe",
            accentColor === "suspicious" && "bg-suspicious",
            accentColor === "dangerous" && "bg-dangerous"
          )}
          variants={dotVariants}
          animate={state}
        />

        {/* Processing ring (only visible during analysis) */}
        {state === "analyzing" && (
          <motion.div
            className="absolute inset-0 border-2 border-primary/40 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0.9, 1.3, 1.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ 
              width: "140%", 
              height: "140%", 
              left: "-20%", 
              top: "-20%" 
            }}
          />
        )}
      </motion.div>

      {/* Brand text */}
      <motion.div 
        className="font-mono"
        animate={{
          opacity: state === "switching" ? 0.7 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <span 
          className={cn(
            "font-bold tracking-tight transition-colors duration-300",
            accentColor === "primary" && "text-primary",
            accentColor === "safe" && "text-safe",
            accentColor === "suspicious" && "text-suspicious",
            accentColor === "dangerous" && "text-dangerous"
          )}
        >
          BEFORE
        </span>
        <span className="text-muted-foreground">.click</span>
      </motion.div>
    </motion.button>
  );
};

export default LivingBrandIndicator;
