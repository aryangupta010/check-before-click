import { motion } from "framer-motion";
import { Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProDividerProps {
  className?: string;
}

const ProDivider = ({ className }: ProDividerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={cn("relative my-8", className)}
    >
      {/* Line with gradient */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
      
      {/* Center badge */}
      <div className="relative flex justify-center">
        <div className="px-4 py-2 bg-background border border-accent/30 rounded-sm flex items-center gap-2">
          <Crown className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            Advanced Intelligence
          </span>
          <span className="text-[10px] font-mono text-accent/70">(Pro)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProDivider;
