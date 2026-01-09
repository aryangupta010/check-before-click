import { motion } from "framer-motion";
import { 
  Camera, FileSearch, AlertTriangle, Globe, Target, ShieldCheck,
  Lock, Crown, CheckCircle2, XCircle, AlertCircle, Eye, CreditCard, LogIn, Clock, Building, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import type { AnalysisResult, RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface ProFeaturesGridProps {
  result: AnalysisResult;
  onUpgradeClick: () => void;
}

// Simulated Pro data
const getProData = (result: AnalysisResult) => {
  return {
    screenshot: result.riskLevel === "safe" 
      ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
      : result.riskLevel === "suspicious"
      ? "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop"
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    behavior: {
      redirects: result.riskLevel === "dangerous" ? 3 : result.riskLevel === "suspicious" ? 1 : 0,
      asksCreds: result.riskLevel !== "safe",
      asksPayment: result.riskLevel === "dangerous",
    },
    scamDetected: result.riskLevel !== "safe",
    profile: {
      domainAge: result.riskLevel === "safe" ? "8 years" : result.riskLevel === "suspicious" ? "3 months" : "12 days",
      isNew: result.riskLevel !== "safe",
      hosting: result.riskLevel === "safe" ? "US (AWS)" : result.riskLevel === "suspicious" ? "NL (Unknown)" : "RU (Bulletproof)",
    },
    intent: result.riskLevel === "safe" 
      ? "Informational browsing"
      : result.riskLevel === "suspicious"
      ? "Collect login credentials"
      : "Steal personal data",
    guidance: result.riskLevel === "safe"
      ? ["Safe to proceed", "Standard practices apply"]
      : result.riskLevel === "suspicious"
      ? ["Avoid personal info", "Verify sender"]
      : ["Do not interact", "Report this link"],
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

interface ProCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  isPro: boolean;
  onUpgradeClick: () => void;
  delay?: number;
}

const ProCard = ({ icon: Icon, title, children, isPro, onUpgradeClick, delay = 0 }: ProCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn(
      "terminal-card overflow-hidden relative h-full",
      !isPro && "min-h-[140px]"
    )}
  >
    {!isPro && (
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-background/70 transition-colors"
        onClick={onUpgradeClick}
      >
        <Lock className="w-6 h-6 text-accent" />
        <span className="text-xs font-mono text-muted-foreground">Unlock with Pro</span>
      </div>
    )}
    
    <div className="p-3 border-b border-primary/10 flex items-center gap-2">
      <Icon className="w-4 h-4 text-accent" />
      <span className="font-mono text-xs text-foreground">{title}</span>
    </div>
    
    <div className={cn("p-3", !isPro && "blur-sm pointer-events-none")}>
      {children}
    </div>
  </motion.div>
);

const ProFeaturesGrid = ({ result, onUpgradeClick }: ProFeaturesGridProps) => {
  const { isPro } = useSubscription();
  const proData = getProData(result);
  const config = getRiskConfig(result.riskLevel);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Screenshot Preview */}
      <ProCard 
        icon={Camera} 
        title="Website Preview" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.1}
      >
        <div className="aspect-video bg-secondary rounded-sm overflow-hidden">
          <img 
            src={proData.screenshot} 
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </ProCard>

      {/* Behavior Analysis */}
      <ProCard 
        icon={FileSearch} 
        title="Behind the Website" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.15}
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            {proData.behavior.redirects > 0 ? (
              <AlertCircle className="w-3 h-3 text-suspicious" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-safe" />
            )}
            <span className="text-foreground/70">
              {proData.behavior.redirects > 0 
                ? `${proData.behavior.redirects} redirects`
                : "No redirects"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {proData.behavior.asksCreds ? (
              <XCircle className="w-3 h-3 text-dangerous" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-safe" />
            )}
            <span className="text-foreground/70">
              {proData.behavior.asksCreds ? "Asks for credentials" : "No login requests"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {proData.behavior.asksPayment ? (
              <XCircle className="w-3 h-3 text-dangerous" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-safe" />
            )}
            <span className="text-foreground/70">
              {proData.behavior.asksPayment ? "Payment requested" : "No payment requests"}
            </span>
          </div>
        </div>
      </ProCard>

      {/* Scam Detection */}
      <ProCard 
        icon={AlertTriangle} 
        title="Scam Status" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.2}
      >
        <div className={cn(
          "p-2 rounded-sm border text-center",
          proData.scamDetected ? config.border : "border-safe/30",
          proData.scamDetected ? config.bg : "bg-safe/10"
        )}>
          <div className="flex items-center justify-center gap-2">
            {proData.scamDetected ? (
              <AlertTriangle className={cn("w-4 h-4", config.color)} />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-safe" />
            )}
            <span className={cn(
              "font-mono text-xs",
              proData.scamDetected ? config.color : "text-safe"
            )}>
              {proData.scamDetected ? "Patterns detected" : "No scam patterns"}
            </span>
          </div>
        </div>
      </ProCard>

      {/* Website Profile */}
      <ProCard 
        icon={Globe} 
        title="Website Profile" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.25}
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Domain Age</span>
            <span className={cn("font-mono", proData.profile.isNew ? "text-suspicious" : "text-foreground")}>
              {proData.profile.domainAge}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hosting</span>
            <span className="font-mono text-foreground">{proData.profile.hosting}</span>
          </div>
        </div>
      </ProCard>

      {/* Page Intent */}
      <ProCard 
        icon={Target} 
        title="Page Intent" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.3}
      >
        <div className={cn(
          "p-2 rounded-sm border flex items-center gap-2",
          config.border,
          config.bg
        )}>
          {result.riskLevel === "safe" ? (
            <Eye className={cn("w-4 h-4", config.color)} />
          ) : result.riskLevel === "suspicious" ? (
            <LogIn className={cn("w-4 h-4", config.color)} />
          ) : (
            <CreditCard className={cn("w-4 h-4", config.color)} />
          )}
          <span className={cn("font-mono text-xs", config.color)}>
            {proData.intent}
          </span>
        </div>
      </ProCard>

      {/* Security Guidance */}
      <ProCard 
        icon={ShieldCheck} 
        title="Pro Guidance" 
        isPro={isPro} 
        onUpgradeClick={onUpgradeClick}
        delay={0.35}
      >
        <div className="space-y-1.5">
          {proData.guidance.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-foreground/70">{tip}</span>
            </div>
          ))}
        </div>
      </ProCard>
    </div>
  );
};

export default ProFeaturesGrid;
