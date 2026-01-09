import { motion } from "framer-motion";
import { 
  Camera, FileSearch, AlertTriangle, Globe, Target, ShieldCheck,
  Lock, Crown, ExternalLink, Clock, Server, Users, Building,
  CheckCircle2, XCircle, AlertCircle, Eye, Download, CreditCard,
  LogIn, MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import type { AnalysisResult, RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface ProIntelligenceSectionProps {
  result: AnalysisResult;
  onUpgradeClick: () => void;
}

// Simulated Pro data - in production this would come from backend
const getProData = (result: AnalysisResult) => {
  const domain = result.riskLevel === "safe" 
    ? "example.com" 
    : result.riskLevel === "suspicious"
    ? "suspicious-site.net"
    : "malware-host.ru";

  return {
    screenshot: result.riskLevel === "safe" 
      ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
      : result.riskLevel === "suspicious"
      ? "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop"
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    resolvedUrl: `https://${domain}/landing-page`,
    behavior: {
      redirects: result.riskLevel === "dangerous" ? 3 : result.riskLevel === "suspicious" ? 1 : 0,
      asksCreds: result.riskLevel !== "safe",
      asksPayment: result.riskLevel === "dangerous",
      initiatesDownload: result.riskLevel === "dangerous",
    },
    scamStatus: {
      detected: result.riskLevel !== "safe",
      patterns: result.riskLevel === "dangerous" 
        ? ["Fake login form", "Urgency manipulation", "Brand impersonation"]
        : result.riskLevel === "suspicious"
        ? ["Unusual URL structure", "Generic content"]
        : [],
    },
    profile: {
      domainAge: result.riskLevel === "safe" ? "8 years" : result.riskLevel === "suspicious" ? "3 months" : "12 days",
      domainAgeNew: result.riskLevel !== "safe",
      domain,
      title: result.riskLevel === "safe" 
        ? "Example Corporation - Official Website"
        : result.riskLevel === "suspicious"
        ? "Account Verification Required"
        : "URGENT: Verify Your Account Now!",
      hosting: result.riskLevel === "safe" ? "United States (AWS)" : result.riskLevel === "suspicious" ? "Netherlands (Unknown)" : "Russia (Bulletproof hosting)",
      brandImpersonation: result.riskLevel === "dangerous",
    },
    intent: result.riskLevel === "safe" 
      ? "Informational browsing"
      : result.riskLevel === "suspicious"
      ? "Collect login credentials"
      : "Steal personal data and payment info",
    guidance: result.riskLevel === "safe"
      ? [
          "Safe to proceed with this website",
          "Standard security practices apply",
          "No additional precautions needed",
        ]
      : result.riskLevel === "suspicious"
      ? [
          "Avoid entering any personal information",
          "Do not log in with your real credentials",
          "Verify the sender if you received this link",
        ]
      : [
          "Do not interact with this website in any way",
          "Report this link to your IT security team",
          "If you already clicked, run a security scan",
        ],
  };
};

const LockedOverlay = ({ onUpgradeClick }: { onUpgradeClick: () => void }) => (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
    <Lock className="w-8 h-8 text-accent" />
    <p className="font-mono text-sm text-muted-foreground text-center max-w-xs">
      Unlock Pro features for advanced threat intelligence
    </p>
    <Button
      onClick={onUpgradeClick}
      className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-sm uppercase tracking-wider"
    >
      <Crown className="w-4 h-4 mr-2" />
      Upgrade to Pro
    </Button>
  </div>
);

const ProIntelligenceSection = ({ result, onUpgradeClick }: ProIntelligenceSectionProps) => {
  const { isPro } = useSubscription();
  const proData = getProData(result);

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

  const config = getRiskConfig(result.riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-5 h-5 text-accent" />
        <h3 className="font-mono text-lg text-foreground">
          Advanced Link Intelligence
          <span className="ml-2 text-xs text-accent font-normal">(Pro)</span>
        </h3>
      </div>

      <div className="space-y-4">
        {/* 1. Screenshot Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[200px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <Camera className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">Website Preview</span>
          </div>
          
          <div className={cn("p-4", !isPro && "blur-sm pointer-events-none")}>
            <div className="aspect-video bg-secondary rounded-sm overflow-hidden mb-3">
              <img 
                src={proData.screenshot} 
                alt="Website preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <ExternalLink className="w-3 h-3" />
              <span>Resolved URL:</span>
              <span className={config.color}>{proData.resolvedUrl}</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Behind the Website */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[150px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">What's Happening Behind the Website</span>
          </div>
          
          <div className={cn("p-4 space-y-2", !isPro && "blur-sm pointer-events-none")}>
            <div className="flex items-center gap-3 text-sm">
              {proData.behavior.redirects > 0 ? (
                <AlertCircle className="w-4 h-4 text-suspicious flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
              )}
              <span className="text-foreground/80">
                {proData.behavior.redirects > 0 
                  ? `Site redirects ${proData.behavior.redirects} time(s) before landing`
                  : "No suspicious redirects detected"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {proData.behavior.asksCreds ? (
                <XCircle className="w-4 h-4 text-dangerous flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
              )}
              <span className="text-foreground/80">
                {proData.behavior.asksCreds 
                  ? "Asks for login credentials"
                  : "Does not request login credentials"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {proData.behavior.asksPayment ? (
                <XCircle className="w-4 h-4 text-dangerous flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
              )}
              <span className="text-foreground/80">
                {proData.behavior.asksPayment 
                  ? "Requests payment information"
                  : "No payment requests detected"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {proData.behavior.initiatesDownload ? (
                <XCircle className="w-4 h-4 text-dangerous flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
              )}
              <span className="text-foreground/80">
                {proData.behavior.initiatesDownload 
                  ? "Initiates automatic downloads"
                  : "No automatic downloads"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3. Scam/Phishing Detection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[120px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">Scam & Phishing Status</span>
          </div>
          
          <div className={cn("p-4", !isPro && "blur-sm pointer-events-none")}>
            <div className={cn(
              "p-3 rounded-sm border mb-3",
              proData.scamStatus.detected ? config.border : "border-safe/30",
              proData.scamStatus.detected ? config.bg : "bg-safe/10"
            )}>
              <div className="flex items-center gap-2">
                {proData.scamStatus.detected ? (
                  <AlertTriangle className={cn("w-5 h-5", config.color)} />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-safe" />
                )}
                <span className={cn(
                  "font-mono text-sm",
                  proData.scamStatus.detected ? config.color : "text-safe"
                )}>
                  {proData.scamStatus.detected 
                    ? "Patterns commonly used in scams detected"
                    : "No scam patterns detected"}
                </span>
              </div>
            </div>
            
            {proData.scamStatus.patterns.length > 0 && (
              <div className="space-y-1">
                {proData.scamStatus.patterns.map((pattern, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={config.color}>•</span>
                    <span>{pattern}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 4. Website Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[180px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">Website Profile</span>
          </div>
          
          <div className={cn("p-4 space-y-3", !isPro && "blur-sm pointer-events-none")}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className={cn("w-4 h-4", proData.profile.domainAgeNew ? "text-suspicious" : "text-safe")} />
                <div>
                  <div className="text-xs text-muted-foreground">Domain Age</div>
                  <div className={cn(
                    "text-sm font-mono",
                    proData.profile.domainAgeNew ? "text-suspicious" : "text-foreground"
                  )}>
                    {proData.profile.domainAge}
                    {proData.profile.domainAgeNew && <span className="ml-1 text-xs">(New!)</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Domain</div>
                  <div className="text-sm font-mono text-foreground">{proData.profile.domain}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 col-span-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Hosting Location</div>
                  <div className="text-sm font-mono text-foreground">{proData.profile.hosting}</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-primary/10">
              <div className="text-xs text-muted-foreground mb-1">Website Title</div>
              <div className="text-sm text-foreground">{proData.profile.title}</div>
            </div>
            
            {proData.profile.brandImpersonation && (
              <div className="p-2 bg-dangerous/10 border border-dangerous/30 rounded-sm">
                <div className="flex items-center gap-2 text-dangerous text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-mono">Brand Impersonation Warning</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 5. Page Intent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[100px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">Page Intent Summary</span>
          </div>
          
          <div className={cn("p-4", !isPro && "blur-sm pointer-events-none")}>
            <div className="text-xs text-muted-foreground mb-2">
              What does this website want from you?
            </div>
            <div className={cn(
              "p-3 rounded-sm border flex items-center gap-3",
              config.border,
              config.bg
            )}>
              {result.riskLevel === "safe" ? (
                <Eye className={cn("w-5 h-5", config.color)} />
              ) : result.riskLevel === "suspicious" ? (
                <LogIn className={cn("w-5 h-5", config.color)} />
              ) : (
                <CreditCard className={cn("w-5 h-5", config.color)} />
              )}
              <span className={cn("font-medium", config.color)}>{proData.intent}</span>
            </div>
          </div>
        </motion.div>

        {/* 6. Pro Security Guidance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className={cn(
            "terminal-card overflow-hidden relative",
            !isPro && "min-h-[150px]"
          )}
        >
          {!isPro && <LockedOverlay onUpgradeClick={onUpgradeClick} />}
          
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-foreground">Pro Security Guidance</span>
          </div>
          
          <div className={cn("p-4 space-y-2", !isPro && "blur-sm pointer-events-none")}>
            {proData.guidance.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProIntelligenceSection;
