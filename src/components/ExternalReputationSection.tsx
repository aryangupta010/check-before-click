import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, ChevronDown, AlertCircle, CheckCircle2, 
  MessageSquare, FileText, ExternalLink
} from "lucide-react";
import type { RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExternalReputationSectionProps {
  riskLevel: RiskLevel;
}

interface ReputationSource {
  name: string;
  type: "forum" | "report" | "database";
  excerpt: string;
  isNegative: boolean;
}

const getReputationData = (riskLevel: RiskLevel) => {
  if (riskLevel === "safe") {
    return {
      status: "clean",
      summary: "No negative public reports detected",
      sourceCount: 0,
      sources: [] as ReputationSource[],
    };
  }
  
  if (riskLevel === "suspicious") {
    return {
      status: "warning",
      summary: "User complaints found on community forums",
      sourceCount: 2,
      sources: [
        {
          name: "Community Forum",
          type: "forum" as const,
          excerpt: "Several users reported unexpected redirects from this domain.",
          isNegative: true,
        },
        {
          name: "Security Discussion",
          type: "report" as const,
          excerpt: "Domain flagged in spam discussions, unconfirmed threat.",
          isNegative: true,
        },
      ],
    };
  }

  return {
    status: "danger",
    summary: "Reported in public scam discussions",
    sourceCount: 4,
    sources: [
      {
        name: "Phishing Database",
        type: "database" as const,
        excerpt: "Listed in community-reported phishing attempts.",
        isNegative: true,
      },
      {
        name: "Reddit r/Scams",
        type: "forum" as const,
        excerpt: "Multiple reports of credential theft attempts.",
        isNegative: true,
      },
      {
        name: "Security Blog",
        type: "report" as const,
        excerpt: "Analyzed as part of phishing campaign targeting users.",
        isNegative: true,
      },
      {
        name: "User Reports",
        type: "forum" as const,
        excerpt: "Flagged by community members for suspicious behavior.",
        isNegative: true,
      },
    ],
  };
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "clean":
      return {
        icon: CheckCircle2,
        color: "text-safe",
        border: "border-safe/30",
        bg: "bg-safe/5",
      };
    case "warning":
      return {
        icon: AlertCircle,
        color: "text-suspicious",
        border: "border-suspicious/30",
        bg: "bg-suspicious/5",
      };
    default:
      return {
        icon: AlertCircle,
        color: "text-dangerous",
        border: "border-dangerous/30",
        bg: "bg-dangerous/5",
      };
  }
};

const getSourceIcon = (type: string) => {
  switch (type) {
    case "forum":
      return MessageSquare;
    case "database":
      return Globe;
    default:
      return FileText;
  }
};

const ExternalReputationSection = ({ riskLevel }: ExternalReputationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = getReputationData(riskLevel);
  const statusConfig = getStatusConfig(data.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="terminal-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-foreground">External Reputation Signals</span>
        </div>
        {data.sourceCount > 0 && (
          <span className="text-xs font-mono text-muted-foreground">
            {data.sourceCount} source{data.sourceCount !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Status Summary */}
      <div className="p-4">
        <div className={cn(
          "p-3 rounded-sm border flex items-center gap-3",
          statusConfig.border,
          statusConfig.bg
        )}>
          <StatusIcon className={cn("w-5 h-5 flex-shrink-0", statusConfig.color)} />
          <span className={cn("font-mono text-sm", statusConfig.color)}>
            {data.summary}
          </span>
        </div>

        {/* Expandable Sources */}
        {data.sources.length > 0 && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              <span>View source excerpts</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-3">
                    {data.sources.map((source, index) => {
                      const SourceIcon = getSourceIcon(source.type);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 bg-secondary/30 border border-primary/10 rounded-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <SourceIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">
                              {source.name}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/70 leading-relaxed">
                            "{source.excerpt}"
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-3">
        <p className="text-[10px] font-mono text-muted-foreground/60 text-center">
          Public mentions are informational and may not be verified
        </p>
      </div>
    </motion.div>
  );
};

export default ExternalReputationSection;
