import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, CheckCircle2 } from "lucide-react";
import type { RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface AnalysisSummaryBarProps {
  riskLevel: RiskLevel;
  explanation: string;
}

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return {
        icon: ShieldCheck,
        label: "SAFE",
        borderColor: "border-safe/40",
        textColor: "text-safe",
        bgColor: "bg-safe/10",
      };
    case "suspicious":
      return {
        icon: ShieldAlert,
        label: "SUSPICIOUS",
        borderColor: "border-suspicious/40",
        textColor: "text-suspicious",
        bgColor: "bg-suspicious/10",
      };
    case "dangerous":
      return {
        icon: ShieldX,
        label: "DANGEROUS",
        borderColor: "border-dangerous/40",
        textColor: "text-dangerous",
        bgColor: "bg-dangerous/10",
      };
  }
};

const AnalysisSummaryBar = ({ riskLevel, explanation }: AnalysisSummaryBarProps) => {
  const config = getRiskConfig(riskLevel);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-20 backdrop-blur-md border rounded-sm mb-6",
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Verdict */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <StatusIcon className={cn("w-6 h-6", config.textColor)} />
            <span className={cn("font-mono text-lg font-bold", config.textColor)}>
              {config.label}
            </span>
          </motion.div>
          
          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-primary/20" />
        </div>

        {/* Explanation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 text-sm text-foreground/80 font-mono leading-relaxed"
        >
          {explanation}
        </motion.p>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-primary/20 rounded-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-safe" />
          <span className="text-xs font-mono text-safe uppercase tracking-wider">
            Completed
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisSummaryBar;
