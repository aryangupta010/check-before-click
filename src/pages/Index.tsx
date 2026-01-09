import { useState, useRef, useEffect, useCallback } from "react";
import { Cpu, Scan, Eye, Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LinkChecker from "@/components/LinkChecker";
import UtilityNav from "@/components/UtilityNav";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PasswordGenerator from "@/components/PasswordGenerator";
import TempEmailGenerator from "@/components/TempEmailGenerator";
import PricingSection from "@/components/PricingSection";
import SignInModal from "@/components/SignInModal";
import UserMenu from "@/components/UserMenu";
import LivingBrandIndicator, { type BrandState } from "@/components/LivingBrandIndicator";
import { useSubscription } from "@/hooks/useSubscription";
import type { RiskLevel } from "@/lib/urlAnalyzer";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [brandState, setBrandState] = useState<BrandState>("idle");
  const [resultRiskLevel, setResultRiskLevel] = useState<RiskLevel | undefined>();
  const mainRef = useRef<HTMLDivElement>(null);
  const prevSectionRef = useRef<string>(activeSection);
  const { isPro } = useSubscription();

  const handleLogoClick = () => {
    setActiveSection("home");
    setBrandState("idle");
    setResultRiskLevel(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionChange = useCallback((section: string) => {
    // Trigger switching animation
    setBrandState("switching");
    setResultRiskLevel(undefined);
    
    // After animation, return to idle
    setTimeout(() => {
      setBrandState("idle");
    }, 250);
    
    setActiveSection(section);
    prevSectionRef.current = section;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Expose methods for LinkChecker to update brand state
  const handleAnalysisStart = useCallback(() => {
    setBrandState("analyzing");
    setResultRiskLevel(undefined);
  }, []);

  const handleAnalysisComplete = useCallback((riskLevel: RiskLevel) => {
    setBrandState("result");
    setResultRiskLevel(riskLevel);
  }, []);

  const handleAnalysisReset = useCallback(() => {
    setBrandState("idle");
    setResultRiskLevel(undefined);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "qr":
        return <QRCodeGenerator />;
      case "password":
        return <PasswordGenerator />;
      case "tempmail":
        return <TempEmailGenerator />;
      case "pricing":
        return <PricingSection />;
      case "home":
      default:
        return (
          <LinkChecker 
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            onReset={handleAnalysisReset}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      {/* Utility Navigation */}
      <UtilityNav activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Animated scan line effect */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scan-line pointer-events-none z-50" />

      {/* Grid glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full py-6 px-4 border-b border-primary/10">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <LivingBrandIndicator 
              state={brandState}
              riskLevel={resultRiskLevel}
              onClick={handleLogoClick}
            />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {isPro && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-sm glow-accent">
                  <Crown className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-mono text-accent hidden sm:inline">PRO</span>
                </div>
              )}
              <UserMenu onSignInClick={() => setIsSignInModalOpen(true)} />
            </motion.div>
          </nav>
        </header>

        {/* Sign In Modal */}
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
        />

        {/* Hero Section */}
        <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            {/* Terminal-style badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-primary/30 mb-8"
            >
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                Link Analysis System v2.0
              </span>
            </motion.div>

            {/* Main heading with glitch effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              <span className="text-foreground">VERIFY</span>
              <br />
              <span className="gradient-text animate-flicker">BEFORE</span>
              <br />
              <span className="text-foreground">YOU CLICK</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground max-w-xl mx-auto font-mono text-sm leading-relaxed"
            >
              <span className="text-primary">&gt;</span> Paste suspicious URLs for instant threat analysis.
              <br />
              <span className="text-primary">&gt;</span> Protect against phishing, malware, and scams.
            </motion.p>
          </div>

          {/* Active Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20"
          >
            {[
              {
                icon: Scan,
                label: "SCAN",
                value: "<10s",
                desc: "Analysis time",
              },
              {
                icon: Eye,
                label: "DETECT",
                value: "99.9%",
                desc: "Threat coverage",
              },
              {
                icon: Zap,
                label: "PROTECT",
                value: "0",
                desc: "Data stored",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="terminal-card p-6 text-center group hover:border-primary/40 transition-all"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-mono text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-primary glow-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-4 border-t border-primary/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-xs font-mono text-muted-foreground">
              <span className="text-primary">&gt;</span> STATUS: ONLINE
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              © 2024 BEFORE.CLICK
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;