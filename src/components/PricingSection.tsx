import { motion } from "framer-motion";
import { Check, X, Crown, Shield, Sparkles, Lock, Camera, FileSearch, AlertTriangle, Globe, Target, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

interface PlanFeature {
  label: string;
  basic: boolean;
  pro: boolean;
}

const features: PlanFeature[] = [
  { label: "URL paste & safety check", basic: true, pro: true },
  { label: "Basic risk verdict (Safe / Suspicious / Dangerous)", basic: true, pro: true },
  { label: "Human-readable explanation", basic: true, pro: true },
  { label: "QR Code Generator", basic: true, pro: true },
  { label: "Password Generator", basic: true, pro: true },
  { label: "Temporary Email", basic: true, pro: true },
  { label: "Link screenshot preview (without clicking)", basic: false, pro: true },
  { label: "Behind-the-scenes website behavior", basic: false, pro: true },
  { label: "Scam & phishing pattern detection", basic: false, pro: true },
  { label: "Website profile summary", basic: false, pro: true },
  { label: "Page intent analysis", basic: false, pro: true },
  { label: "Pro security response guidance", basic: false, pro: true },
];

const PricingSection = () => {
  const { plan, isPro, upgradeToPro, downgradeToBasic } = useSubscription();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-primary/30 mb-6"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            Choose Your Protection Level
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="text-foreground">Upgrade Your</span>{" "}
          <span className="gradient-text">Security</span>
        </h2>
        <p className="text-muted-foreground font-mono text-sm max-w-lg mx-auto">
          Get professional-grade link intelligence and advanced threat detection.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "terminal-card p-6 relative",
            plan === "basic" && "border-primary/50"
          )}
        >
          {plan === "basic" && (
            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono uppercase">
              Current Plan
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-mono text-xl font-bold text-foreground">BASIC</h3>
              <p className="text-xs text-muted-foreground font-mono">Essential Protection</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground font-mono text-sm">/forever</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Free forever</p>
          </div>

          <ul className="space-y-3 mb-6">
            {features.slice(0, 6).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-safe flex-shrink-0" />
                <span className="text-foreground/80">{feature.label}</span>
              </li>
            ))}
            {features.slice(6).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm opacity-50">
                <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{feature.label}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            className="w-full h-11 font-mono text-sm uppercase tracking-wider border-primary/30"
            disabled={plan === "basic"}
            onClick={downgradeToBasic}
          >
            {plan === "basic" ? "Active" : "Downgrade"}
          </Button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "terminal-card p-6 relative border-2",
            plan === "pro" ? "border-accent/60 glow-accent" : "border-accent/30"
          )}
        >
          {plan === "pro" && (
            <div className="absolute -top-3 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-mono uppercase">
              Current Plan
            </div>
          )}

          <div className="absolute -top-3 right-4 px-3 py-1 bg-suspicious text-suspicious-foreground text-xs font-mono uppercase">
            Popular
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-accent" />
            <div>
              <h3 className="font-mono text-xl font-bold text-foreground">PRO</h3>
              <p className="text-xs text-accent font-mono">Advanced Protection</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">$5</span>
              <span className="text-muted-foreground font-mono text-sm">/month</span>
            </div>
            <p className="text-xs text-accent mt-1">Full security intelligence</p>
          </div>

          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className={cn(
                  "w-4 h-4 flex-shrink-0",
                  index >= 6 ? "text-accent" : "text-safe"
                )} />
                <span className={cn(
                  index >= 6 ? "text-accent font-medium" : "text-foreground/80"
                )}>
                  {feature.label}
                  {index >= 6 && <span className="ml-1 text-xs text-accent/70">(Pro)</span>}
                </span>
              </li>
            ))}
          </ul>

          <Button
            className={cn(
              "w-full h-11 font-mono text-sm uppercase tracking-wider",
              plan === "pro"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-accent text-accent-foreground hover:bg-accent/90 glow-accent"
            )}
            disabled={plan === "pro"}
            onClick={upgradeToPro}
          >
            {plan === "pro" ? "Active" : "Upgrade to Pro"}
          </Button>
        </motion.div>
      </div>

      {/* Pro Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <h3 className="text-center font-mono text-lg text-primary mb-6">
          <span className="text-muted-foreground">[ </span>
          Pro Features Overview
          <span className="text-muted-foreground"> ]</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Camera, title: "Screenshot Preview", desc: "See the website before clicking" },
            { icon: FileSearch, title: "Behavior Analysis", desc: "What happens behind the scenes" },
            { icon: AlertTriangle, title: "Scam Detection", desc: "Identify phishing patterns" },
            { icon: Globe, title: "Website Profile", desc: "Domain age, hosting, structure" },
            { icon: Target, title: "Intent Analysis", desc: "What does the site want?" },
            { icon: ShieldCheck, title: "Pro Guidance", desc: "Expert security recommendations" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="p-4 bg-secondary/30 border border-primary/10 rounded-sm group hover:border-accent/30 transition-all"
            >
              <feature.icon className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-mono text-sm font-medium text-foreground mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PricingSection;
