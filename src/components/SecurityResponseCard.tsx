import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Flag, 
  Trash2, 
  MessageCircle,
  Eye,
  Ban,
  FileWarning,
  ArrowRight
} from "lucide-react";
import type { RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface SecurityAction {
  icon: typeof CheckCircle2;
  label: string;
  description: string;
}

const getSecurityActions = (level: RiskLevel): SecurityAction[] => {
  switch (level) {
    case "safe":
      return [
        {
          icon: CheckCircle2,
          label: "You're good to go",
          description: "This link passed all safety checks.",
        },
        {
          icon: Bookmark,
          label: "Save for later",
          description: "Bookmark this page if you need it again.",
        },
        {
          icon: Share2,
          label: "Share with confidence",
          description: "Safe to send to friends or colleagues.",
        },
      ];
    case "suspicious":
      return [
        {
          icon: Eye,
          label: "Double-check the source",
          description: "Verify who sent you this link before clicking.",
        },
        {
          icon: MessageCircle,
          label: "Ask the sender",
          description: "Confirm if they actually meant to share this.",
        },
        {
          icon: Flag,
          label: "Report if unsure",
          description: "When in doubt, report it as potential spam.",
        },
      ];
    case "dangerous":
      return [
        {
          icon: Ban,
          label: "Do not open this link",
          description: "Clicking may expose you to scams or malware.",
        },
        {
          icon: Trash2,
          label: "Delete the message",
          description: "Remove it from your inbox or chat immediately.",
        },
        {
          icon: FileWarning,
          label: "Report as phishing",
          description: "Help protect others by reporting this threat.",
        },
      ];
  }
};

const getCardConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return {
        title: "What to do next",
        borderColor: "border-safe/30",
        iconColor: "text-safe",
        bgColor: "bg-safe/5",
      };
    case "suspicious":
      return {
        title: "Recommended actions",
        borderColor: "border-suspicious/30",
        iconColor: "text-suspicious",
        bgColor: "bg-suspicious/5",
      };
    case "dangerous":
      return {
        title: "Protect yourself now",
        borderColor: "border-dangerous/30",
        iconColor: "text-dangerous",
        bgColor: "bg-dangerous/5",
      };
  }
};

interface SecurityResponseCardProps {
  riskLevel: RiskLevel;
}

const SecurityResponseCard = ({ riskLevel }: SecurityResponseCardProps) => {
  const actions = getSecurityActions(riskLevel);
  const config = getCardConfig(riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={cn(
        "mt-4 border rounded-sm overflow-hidden",
        config.borderColor,
        config.bgColor
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-primary/10 flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.9 }}
        >
          <ArrowRight className={cn("w-4 h-4", config.iconColor)} />
        </motion.div>
        <span 
          className="text-sm font-medium text-foreground"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {config.title}
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Security Response
        </span>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-start gap-3 group"
            >
              <div
                className={cn(
                  "p-1.5 rounded-sm transition-all duration-200",
                  "bg-card border border-primary/10",
                  "group-hover:border-primary/30"
                )}
              >
                <Icon className={cn("w-4 h-4", config.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium text-foreground"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SecurityResponseCard;
