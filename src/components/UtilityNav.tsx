import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, KeyRound, Mail, Menu, X, ChevronRight, Scan, Home, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";

interface UtilityNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Main Scan", icon: Scan, isHome: true },
  { id: "qr", label: "QR Generator", icon: QrCode },
  { id: "password", label: "Password Gen", icon: KeyRound },
  { id: "tempmail", label: "Temp Mail", icon: Mail },
  { id: "pricing", label: "Upgrade", icon: Crown, isPricing: true },
];

const UtilityNav = ({ activeSection, onSectionChange }: UtilityNavProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPro } = useSubscription();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
    >
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-sm border border-primary/30 bg-card/90 backdrop-blur-sm transition-all duration-300",
          isExpanded && "border-primary/50"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-4 h-4 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Nav items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-14 flex flex-col gap-2"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isHomeItem = item.isHome;
              const isPricingItem = (item as any).isPricing;

              // Hide pricing if already Pro
              if (isPricingItem && isPro) return null;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all duration-300 min-w-[160px]",
                    isActive
                      ? "border-primary/60 bg-primary/10 glow-primary"
                      : "border-primary/20 bg-card/90 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5",
                    isHomeItem && "border-l-2 border-l-primary",
                    isPricingItem && "border-accent/40 bg-accent/5 hover:border-accent/60 hover:bg-accent/10"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-all duration-300",
                    isPricingItem ? "text-accent" : isActive ? "text-primary" : "text-primary/60 group-hover:text-primary"
                  )} />
                  <span className={cn(
                    "font-mono text-xs transition-all duration-300",
                    isPricingItem ? "text-accent font-semibold" : isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/80",
                    isHomeItem && "font-semibold"
                  )}>
                    {item.label}
                  </span>
                  {isHomeItem && (
                    <Home className="w-3 h-3 text-primary/40 ml-auto" />
                  )}
                  {isPricingItem && (
                    <Crown className="w-3 h-3 text-accent/60 ml-auto" />
                  )}
                  {!isHomeItem && !isPricingItem && (
                    <ChevronRight className={cn(
                      "w-3 h-3 ml-auto transition-all duration-300",
                      isActive 
                        ? "text-primary opacity-100 rotate-90" 
                        : "text-primary/40 opacity-0 group-hover:opacity-100"
                    )} />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UtilityNav;
