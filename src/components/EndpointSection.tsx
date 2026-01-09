import { motion } from "framer-motion";
import { Check, X, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

const features = [
  { label: "Link safety check", basic: true, pro: true },
  { label: "Basic verdict & explanation", basic: true, pro: true },
  { label: "Free utilities (QR, Password, Email)", basic: true, pro: true },
  { label: "Website screenshot preview", basic: false, pro: true },
  { label: "Scam & phishing detection", basic: false, pro: true },
  { label: "Pro security guidance", basic: false, pro: true },
];

const EndpointSection = () => {
  const { plan, isPro, upgradeToPro } = useSubscription();

  if (isPro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 border-t border-primary/10"
      >
        <div className="inline-flex items-center gap-2 text-accent">
          <Crown className="w-5 h-5" />
          <span className="font-mono text-sm">Pro intelligence active</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          Full security features unlocked
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 terminal-card p-6"
    >
      {/* Compact comparison */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Basic */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-medium text-foreground">Basic</span>
            <span className="text-xs text-muted-foreground">Free</span>
          </div>
          <ul className="space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                {f.basic ? (
                  <Check className="w-3 h-3 text-safe flex-shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={cn(
                  f.basic ? "text-foreground/70" : "text-muted-foreground/50"
                )}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm font-medium text-foreground">Pro</span>
            <span className="text-xs text-accent">$5/mo</span>
          </div>
          <ul className="space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <Check className={cn(
                  "w-3 h-3 flex-shrink-0",
                  f.basic ? "text-safe" : "text-accent"
                )} />
                <span className={cn(
                  f.basic ? "text-foreground/70" : "text-accent font-medium"
                )}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Single CTA */}
      <Button
        onClick={upgradeToPro}
        className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-sm uppercase tracking-wider glow-accent"
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade to Pro
      </Button>
    </motion.div>
  );
};

export default EndpointSection;
