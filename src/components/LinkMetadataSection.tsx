import { motion } from "framer-motion";
import { 
  Globe, MapPin, Server, User, Target, Lock, Crown,
  ExternalLink, Database, Shield, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import type { RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface LinkMetadataSectionProps {
  riskLevel: RiskLevel;
  url: string;
  onUpgradeClick: () => void;
}

// Simulated metadata - in production this would come from backend
const getMetadata = (riskLevel: RiskLevel, url: string) => {
  let domain = "example.com";
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    domain = urlObj.hostname;
  } catch {
    domain = url.split("/")[0];
  }

  return {
    domain,
    referrer: riskLevel === "safe" 
      ? "Direct / Organic"
      : riskLevel === "suspicious"
      ? "Shortened link service"
      : "Email campaign / Unknown",
    ipRegion: riskLevel === "safe"
      ? "United States (California)"
      : riskLevel === "suspicious"
      ? "Netherlands (Amsterdam)"
      : "Russia (Moscow)",
    registrar: riskLevel === "safe"
      ? "GoDaddy LLC"
      : riskLevel === "suspicious"
      ? "NameCheap Inc"
      : "Unknown Registrar",
    owner: riskLevel === "safe"
      ? "Verified Corporation"
      : riskLevel === "suspicious"
      ? "Privacy Protected"
      : "Hidden / Anonymous",
    intent: riskLevel === "safe"
      ? "Informational"
      : riskLevel === "suspicious"
      ? "Data Collection"
      : "Credential Theft",
  };
};

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return { color: "text-safe", border: "border-safe/30", bg: "bg-safe/10" };
    case "suspicious":
      return { color: "text-suspicious", border: "border-suspicious/30", bg: "bg-suspicious/10" };
    case "dangerous":
      return { color: "text-dangerous", border: "border-dangerous/30", bg: "bg-dangerous/10" };
  }
};

const LockedOverlay = ({ onUpgradeClick }: { onUpgradeClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4"
  >
    <Lock className="w-8 h-8 text-accent" />
    <p className="font-mono text-sm text-muted-foreground text-center max-w-xs px-4">
      Unlock Pro features for advanced threat intelligence
    </p>
    <Button
      onClick={onUpgradeClick}
      className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-sm uppercase tracking-wider"
    >
      <Crown className="w-4 h-4 mr-2" />
      Upgrade to Pro
    </Button>
  </motion.div>
);

const MetadataItem = ({ 
  icon: Icon, 
  label, 
  value, 
  isLocked,
  highlight
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  isLocked: boolean;
  highlight?: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-secondary/30 border border-primary/10 rounded-sm">
    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isLocked ? "text-muted-foreground/50" : "text-accent")} />
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className={cn(
        "text-sm font-mono truncate",
        isLocked ? "text-muted-foreground/50" : "text-foreground",
        highlight && !isLocked && highlight
      )}>
        {isLocked ? "••••••••••" : value}
      </div>
    </div>
    {!isLocked && (
      <span className="text-[8px] font-mono text-accent uppercase bg-accent/10 px-1.5 py-0.5 rounded">
        Pro
      </span>
    )}
  </div>
);

const LinkMetadataSection = ({ riskLevel, url, onUpgradeClick }: LinkMetadataSectionProps) => {
  const { isPro } = useSubscription();
  const metadata = getMetadata(riskLevel, url);
  const config = getRiskConfig(riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        "terminal-card overflow-hidden relative mt-6",
        !isPro && "min-h-[300px]"
      )}
    >
      {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          <span className="font-mono text-sm text-foreground">Advanced Link Intelligence</span>
          <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-sm">
            PRO
          </span>
        </div>
        {isPro && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-[10px] font-mono text-safe">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Metadata Grid */}
      <div className={cn(
        "p-4 grid grid-cols-1 sm:grid-cols-2 gap-3",
        !isPro && "blur-sm pointer-events-none"
      )}>
        <MetadataItem 
          icon={Globe}
          label="Domain Name"
          value={metadata.domain}
          isLocked={!isPro}
        />
        <MetadataItem 
          icon={ExternalLink}
          label="Source / Referrer"
          value={metadata.referrer}
          isLocked={!isPro}
          highlight={riskLevel !== "safe" ? config.color : undefined}
        />
        <MetadataItem 
          icon={MapPin}
          label="Approximate Region"
          value={metadata.ipRegion}
          isLocked={!isPro}
          highlight={riskLevel === "dangerous" ? config.color : undefined}
        />
        <MetadataItem 
          icon={Server}
          label="Registrar Info"
          value={metadata.registrar}
          isLocked={!isPro}
        />
        <MetadataItem 
          icon={User}
          label="Website Owner"
          value={metadata.owner}
          isLocked={!isPro}
          highlight={riskLevel !== "safe" ? config.color : undefined}
        />
        <MetadataItem 
          icon={Target}
          label="Detected Intent"
          value={metadata.intent}
          isLocked={!isPro}
          highlight={config.color}
        />
      </div>

      {/* Pro Insight Footer */}
      <div className={cn(
        "p-4 border-t border-primary/10 bg-accent/5",
        !isPro && "blur-sm"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            Pro Insight
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {riskLevel === "safe" 
            ? "This domain has established credibility with a verified owner and standard hosting infrastructure."
            : riskLevel === "suspicious"
            ? "Domain characteristics suggest potential risks. Owner information is hidden and the source is flagged."
            : "Multiple red flags detected. Anonymous ownership, suspicious hosting region, and high-risk intent patterns."}
        </p>
      </div>
    </motion.div>
  );
};

export default LinkMetadataSection;
