import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Search, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeUrl, type AnalysisResult, type RiskLevel } from "@/lib/urlAnalyzer";
import AnalysisWorkspace from "./AnalysisWorkspace";

interface LinkCheckerProps {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (riskLevel: RiskLevel) => void;
  onReset?: () => void;
}

const LinkChecker = ({ onAnalysisStart, onAnalysisComplete, onReset }: LinkCheckerProps) => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanStep, setScanStep] = useState(0);

  const scanSteps = [
    "Initializing scan...",
    "Checking SSL certificate...",
    "Analyzing domain reputation...",
    "Detecting phishing patterns...",
    "Generating threat report...",
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setScanStep(0);
    onAnalysisStart?.();

    // Simulate scan steps
    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setScanStep(i);
    }
    
    const analysisResult = analyzeUrl(url);
    setResult(analysisResult);
    setIsAnalyzing(false);
    onAnalysisComplete?.(analysisResult.riskLevel);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setScanStep(0);
    onReset?.();
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Input Section - Centered when no results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`terminal-card p-6 mx-auto ${result ? 'max-w-6xl' : 'max-w-2xl'}`}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-dangerous" />
            <div className="w-2.5 h-2.5 rounded-full bg-suspicious" />
            <div className="w-2.5 h-2.5 rounded-full bg-safe" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">
            threat_scanner.exe
          </span>
        </div>

        {/* Input row */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono text-primary">
            <ChevronRight className="w-4 h-4" />
            <span>Enter target URL:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="https://suspicious-link.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 pl-10 pr-4 font-mono text-sm bg-background border-primary/20 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                disabled={isAnalyzing}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={!url.trim() || isAnalyzing}
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm uppercase tracking-wider border-0 glow-primary"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  Execute
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3 overflow-hidden"
            >
              <div className="h-1 bg-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "linear" }}
                />
              </div>
              
              <div className="font-mono text-xs space-y-1">
                {scanSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: index <= scanStep ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-2 ${
                      index <= scanStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <span className={index <= scanStep ? "text-safe" : "text-muted-foreground"}>
                      {index < scanStep ? "✓" : index === scanStep ? "▶" : "○"}
                    </span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Analysis Workspace */}
      <AnimatePresence>
        {result && (
          <AnalysisWorkspace
            result={result}
            url={url}
            onReset={handleReset}
            onUpgradeClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkChecker;