import { motion } from "framer-motion";
import { Camera, ExternalLink, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { RiskLevel } from "@/lib/urlAnalyzer";
import { cn } from "@/lib/utils";

interface LinkPreviewCardProps {
  riskLevel: RiskLevel;
  url: string;
}

const getPreviewImage = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "safe":
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";
    case "suspicious":
      return "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop";
    case "dangerous":
      return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop";
  }
};

const getRiskConfig = (level: RiskLevel) => {
  switch (level) {
    case "safe":
      return {
        icon: ShieldCheck,
        borderColor: "border-safe/30",
        textColor: "text-safe",
        bgGlow: "bg-safe/5",
      };
    case "suspicious":
      return {
        icon: ShieldAlert,
        borderColor: "border-suspicious/30",
        textColor: "text-suspicious",
        bgGlow: "bg-suspicious/5",
      };
    case "dangerous":
      return {
        icon: ShieldX,
        borderColor: "border-dangerous/30",
        textColor: "text-dangerous",
        bgGlow: "bg-dangerous/5",
      };
  }
};

const LinkPreviewCard = ({ riskLevel, url }: LinkPreviewCardProps) => {
  const config = getRiskConfig(riskLevel);
  const StatusIcon = config.icon;
  const previewImage = getPreviewImage(riskLevel);
  
  // Extract domain from URL for display
  let displayUrl = url;
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    displayUrl = urlObj.hostname + urlObj.pathname;
  } catch {
    displayUrl = url;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "terminal-card border-2 h-fit",
        config.borderColor
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-primary/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-dangerous" />
          <div className="w-2.5 h-2.5 rounded-full bg-suspicious" />
          <div className="w-2.5 h-2.5 rounded-full bg-safe" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">
          visual_preview.png
        </span>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        {/* Preview Image Container */}
        <div className="relative aspect-video bg-secondary rounded-sm overflow-hidden mb-4 group">
          <img 
            src={previewImage} 
            alt="Website preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with safety indicator */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent"
          )}>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("w-4 h-4", config.textColor)} />
              <span className={cn("font-mono text-xs", config.textColor)}>
                {riskLevel.toUpperCase()} PREVIEW
              </span>
            </div>
          </div>

          {/* Camera icon overlay */}
          <div className="absolute top-3 right-3">
            <div className="p-2 bg-background/80 backdrop-blur-sm rounded-sm border border-primary/20">
              <Camera className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* URL Display */}
        <div className="p-3 bg-secondary/50 border border-primary/20 rounded-sm mb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Target:</span>
            <span className={cn("truncate", config.textColor)}>{displayUrl}</span>
          </div>
        </div>

        {/* Safety Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "p-3 rounded-sm border text-center",
            config.borderColor,
            config.bgGlow
          )}
        >
          <p className="text-xs font-mono text-muted-foreground">
            <span className={config.textColor}>✓</span> Visual preview generated safely
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            Link not opened on your device
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LinkPreviewCard;
