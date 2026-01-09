import { motion } from "framer-motion";
import AnalysisSummaryBar from "./AnalysisSummaryBar";
import FreeAnalysisPanel from "./FreeAnalysisPanel";
import LinkPreviewCard from "./LinkPreviewCard";
import ExternalReputationSection from "./ExternalReputationSection";
import ProDivider from "./ProDivider";
import ProFeaturesGrid from "./ProFeaturesGrid";
import EndpointSection from "./EndpointSection";
import type { AnalysisResult } from "@/lib/urlAnalyzer";

interface AnalysisWorkspaceProps {
  result: AnalysisResult;
  url: string;
  onReset: () => void;
  onUpgradeClick: () => void;
}

const AnalysisWorkspace = ({ result, url, onReset, onUpgradeClick }: AnalysisWorkspaceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* 1. Top Summary Bar */}
      <AnalysisSummaryBar 
        riskLevel={result.riskLevel} 
        explanation={result.explanation} 
      />

      {/* 2. Main Analysis Canvas - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">
        {/* Left Column - Free Analysis */}
        <FreeAnalysisPanel result={result} onReset={onReset} />

        {/* Right Column - Visual Preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <LinkPreviewCard riskLevel={result.riskLevel} url={url} />
        </div>
      </div>

      {/* 3. External Reputation Signals */}
      <div className="mb-6">
        <ExternalReputationSection riskLevel={result.riskLevel} />
      </div>

      {/* 4. Free vs Pro Hard Divider */}
      <ProDivider />

      {/* 5. Pro Features Grid */}
      <ProFeaturesGrid result={result} onUpgradeClick={onUpgradeClick} />

      {/* 6. Endpoint Section */}
      <EndpointSection />
    </motion.div>
  );
};

export default AnalysisWorkspace;
