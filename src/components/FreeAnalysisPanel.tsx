import { motion } from "framer-motion";
import { 
  Terminal, AlertTriangle, Shield, RotateCcw, ExternalLink,
  Lock, ShieldOff, Link2, Skull, GitBranch, Type, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurityResponseCard from "@/components/SecurityResponseCard";
import type { AnalysisResult, RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface FreeAnalysisPanelProps {
  result: AnalysisResult;
  onReset: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock, ShieldOff, Link2, AlertTriangle, Skull, GitBranch, Type, Clock, Shield,
};

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return { color: "text-safe", border: "border-safe/30", bg: "bg-safe/5" };
    case "suspicious":
      return { color: "text-suspicious", border: "border-suspicious/30", bg: "bg-suspicious/5" };
    case "dangerous":
      return { color: "text-dangerous", border: "border-dangerous/30", bg: "bg-dangerous/5" };
  }
};

const FreeAnalysisPanel = ({ result, onReset }: FreeAnalysisPanelProps) => {
  const config = getRiskConfig(result.riskLevel);

  return (
    <div className="space-y-4">
      {/* Threat Analysis - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="terminal-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest">
            Threat Analysis
          </h3>
        </div>
        
        <div className="space-y-2">
          {result.riskFactors.slice(0, 4).map((factor, index) => {
            const FactorIcon = iconMap[factor.icon] || Shield;
            const severityConfig = {
              low: { color: "text-safe", border: "border-safe/30", bg: "bg-safe/5" },
              medium: { color: "text-suspicious", border: "border-suspicious/30", bg: "bg-suspicious/5" },
              high: { color: "text-dangerous", border: "border-dangerous/30", bg: "bg-dangerous/5" },
            };
            const sev = severityConfig[factor.severity];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-2.5 border font-mono text-sm",
                  sev.border, sev.bg
                )}
              >
                <FactorIcon className={cn("w-4 h-4 flex-shrink-0", sev.color)} />
                <span className="text-foreground/90 flex-1 text-xs">{factor.label}</span>
                <span className={cn("text-[10px] uppercase", sev.color)}>
                  [{factor.severity}]
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendation - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-secondary/50 border border-primary/20 rounded-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-mono text-primary uppercase tracking-widest">
            Recommendation
          </h4>
        </div>
        <p className="text-sm font-mono text-foreground/80">
          <span className="text-primary">&gt;</span> {result.recommendation}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex gap-3"
      >
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 h-10 font-mono text-xs uppercase tracking-wider border-primary/30 hover:bg-primary/10"
        >
          <RotateCcw className="w-4 h-4" />
          New Scan
        </Button>
        
        {result.riskLevel === "safe" && (
          <Button
            variant="secondary"
            className="flex-1 h-10 font-mono text-xs uppercase tracking-wider bg-safe/10 text-safe hover:bg-safe/20 border border-safe/30"
          >
            <ExternalLink className="w-4 h-4" />
            Proceed
          </Button>
        )}
      </motion.div>

      {/* Security Response */}
      <SecurityResponseCard riskLevel={result.riskLevel} />
    </div>
  );
};

export default FreeAnalysisPanel;
