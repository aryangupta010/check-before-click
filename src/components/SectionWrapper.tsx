import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  focusSelector?: string;
  className?: string;
}

const SectionWrapper = ({ 
  title, 
  subtitle, 
  icon: Icon,
  children, 
  focusSelector,
  className 
}: SectionWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus primary input on mount
  useEffect(() => {
    if (focusSelector && containerRef.current) {
      const timer = setTimeout(() => {
        const input = containerRef.current?.querySelector(focusSelector) as HTMLInputElement;
        if (input && typeof input.focus === 'function') {
          input.focus();
        }
      }, 400); // Delay to allow animation to complete
      return () => clearTimeout(timer);
    }
  }, [focusSelector]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ 
        duration: 0.25, 
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn("relative", className)}
    >
      {/* Section Context Header */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="text-center mb-6"
      >
        {/* Active section indicator */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-sm mb-3"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icon className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
            {title}
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm text-muted-foreground font-mono"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Section Content with focus state */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="section-content"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper;
