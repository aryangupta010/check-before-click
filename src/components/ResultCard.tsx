import { motion } from "framer-motion";
import { 
  ShieldCheck, ShieldAlert, ShieldX, 
  Lock, ShieldOff, Link2, AlertTriangle, 
  Skull, GitBranch, Type, Clock, Shield,
  RotateCcw, ExternalLink, Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurityResponseCard from "@/components/SecurityResponseCard";
import ProIntelligenceSection from "@/components/ProIntelligenceSection";
import LinkMetadataSection from "@/components/LinkMetadataSection";
import type { AnalysisResult, RiskLevel } from "@/lib/urlAnalyzer";

interface ResultCardProps {
  result: AnalysisResult;
  url: string;
  onReset: () => void;
  onUpgradeClick: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock,
  ShieldOff,
  Link2,
  AlertTriangle,
  Skull,
  GitBranch,
  Type,
  Clock,
  Shield,
};

const getVerdict = (level: RiskLevel, score: number) => {
  if (level === "safe") {
    if (score <= 10) return "This link looks completely safe to open.";
    if (score <= 20) return "Safe to use — nothing unusual detected.";
    return "Looks okay, but stay cautious.";
  }
  if (level === "suspicious") {
    if (score <= 50) return "Something feels off — better to avoid.";
    return "Suspicious patterns found — proceed with care.";
  }
  // dangerous
  if (score >= 80) return "High risk detected — do not click this link.";
  return "This link shows dangerous warning signs.";
};

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return {
        icon: ShieldCheck,
        label: "SAFE",
        code: "0x00",
        borderColor: "border-safe/50",
        textColor: "text-safe",
        glowClass: "glow-safe",
        bgGlow: "bg-safe/5",
      };
    case "suspicious":
      return {
        icon: ShieldAlert,
        label: "SUSPICIOUS",
        code: "0x01",
        borderColor: "border-suspicious/50",
        textColor: "text-suspicious",
        glowClass: "glow-suspicious",
        bgGlow: "bg-suspicious/5",
      };
    case "dangerous":
      return {
        icon: ShieldX,
        label: "DANGEROUS",
        code: "0xFF",
        borderColor: "border-dangerous/50",
        textColor: "text-dangerous",
        glowClass: "glow-dangerous",
        bgGlow: "bg-dangerous/5",
      };
  }
};

const ResultCard = ({ result, url, onReset, onUpgradeClick }: ResultCardProps) => {
  const config = getRiskConfig(result.riskLevel);
  const StatusIcon = config.icon;
  const verdict = getVerdict(result.riskLevel, result.riskScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className={`terminal-card ${config.borderColor} border-2`}
    >
      {/* 10-Second Safety Verdict Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`${config.bgGlow} border-b ${config.borderColor} px-6 py-4`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className={`w-3 h-3 rounded-full ${
              result.riskLevel === "safe" 
                ? "bg-safe" 
                : result.riskLevel === "suspicious" 
                ? "bg-suspicious" 
                : "bg-dangerous"
            }`}
            style={{
              boxShadow: `0 0 12px ${
                result.riskLevel === "safe"
                  ? "hsl(var(--safe))"
                  : result.riskLevel === "suspicious"
                  ? "hsl(var(--suspicious))"
                  : "hsl(var(--dangerous))"
              }`
            }}
          />
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`text-base sm:text-lg font-medium ${config.textColor}`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {verdict}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 ml-6"
        >
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            10-Second Safety Verdict
          </span>
        </motion.div>
      </motion.div>

      {/* Terminal header */}
      <div className="flex items-center gap-2 p-4 border-b border-primary/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-dangerous" />
          <div className="w-2.5 h-2.5 rounded-full bg-suspicious" />
          <div className="w-2.5 h-2.5 rounded-full bg-safe" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">
          analysis_report.log
        </span>
      </div>

      {/* Status Header */}
      <div className={`${config.bgGlow} p-6 border-b border-primary/10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className={`p-3 ${config.glowClass} status-pulse`}
            >
              <StatusIcon className={`w-8 h-8 ${config.textColor}`} />
            </motion.div>
            <div>
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`font-mono text-xl font-bold ${config.textColor}`}
                >
                  {config.label}
                </motion.span>
                <span className="font-mono text-xs text-muted-foreground">
                  [{config.code}]
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-foreground/80 font-mono mt-1"
              >
                {result.explanation}
              </motion.p>
            </div>
          </div>
          
          {/* Risk Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:block text-right"
          >
            <div className={`font-mono text-4xl font-bold ${config.textColor}`}>
              {result.riskScore}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Threat Level
            </div>
          </motion.div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-mono text-primary uppercase tracking-widest">
              Threat Analysis
            </h3>
          </div>
          
          <div className="space-y-2">
            {result.riskFactors.map((factor, index) => {
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  className={`flex items-center gap-3 p-3 border ${sev.border} ${sev.bg} font-mono text-sm`}
                >
                  <FactorIcon className={`w-4 h-4 flex-shrink-0 ${sev.color}`} />
                  <span className="text-foreground/90">{factor.label}</span>
                  <span className={`ml-auto text-xs uppercase ${sev.color}`}>
                    [{factor.severity}]
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-secondary/50 border border-primary/20"
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
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 h-11 font-mono text-sm uppercase tracking-wider border-primary/30 hover:bg-primary/10 hover:border-primary/50"
          >
            <RotateCcw className="w-4 h-4" />
            New Scan
          </Button>
          
          {result.riskLevel === "safe" && (
            <Button
              variant="secondary"
              className="flex-1 h-11 font-mono text-sm uppercase tracking-wider bg-safe/10 text-safe hover:bg-safe/20 border border-safe/30"
              onClick={() => window.open(result.riskLevel === "safe" ? "#" : undefined)}
            >
              <ExternalLink className="w-4 h-4" />
              Proceed
            </Button>
          )}
        </motion.div>

        {/* Security Response Mode */}
        <SecurityResponseCard riskLevel={result.riskLevel} />

        {/* Link Metadata Section (Pro) */}
        <LinkMetadataSection 
          riskLevel={result.riskLevel} 
          url={url} 
          onUpgradeClick={onUpgradeClick} 
        />

        {/* Pro Intelligence Section */}
        <ProIntelligenceSection result={result} onUpgradeClick={onUpgradeClick} />
      </div>
    </motion.div>
  );
};

export default ResultCard;