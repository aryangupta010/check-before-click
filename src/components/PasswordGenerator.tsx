import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KeyRound, Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import SectionWrapper from "./SectionWrapper";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const PasswordGenerator = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const chars = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let charset = "";
    if (options.uppercase) charset += chars.uppercase;
    if (options.lowercase) charset += chars.lowercase;
    if (options.numbers) charset += chars.numbers;
    if (options.symbols) charset += chars.symbols;

    if (!charset) charset = chars.lowercase;

    let result = "";
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  }, [options]);

  const getStrength = () => {
    let score = 0;
    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    if (options.length >= 12) score++;
    if (options.length >= 16) score++;
    if (options.length >= 20) score++;

    if (score <= 2) return { label: "Weak", color: "dangerous", icon: ShieldAlert };
    if (score <= 4) return { label: "Medium", color: "suspicious", icon: Shield };
    return { label: "Strong", color: "safe", icon: ShieldCheck };
  };

  const strength = getStrength();
  const StrengthIcon = strength.icon;

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof Omit<PasswordOptions, "length">) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    setPassword("");
  };

  return (
    <SectionWrapper
      title="Password Generator"
      subtitle="Create secure, randomized passwords instantly"
      icon={KeyRound}
    >
      <motion.div
        className="terminal-card p-6 max-w-lg mx-auto"
        whileHover={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.08)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm text-primary">PASSWORD_GENERATOR</h2>
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 rounded-full bg-dangerous" />
            <div className="w-2 h-2 rounded-full bg-suspicious" />
            <div className="w-2 h-2 rounded-full bg-safe" />
          </div>
        </div>

      {/* Length slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs text-muted-foreground">LENGTH</span>
          <span className="font-mono text-sm text-primary font-bold">{options.length}</span>
        </div>
        <Slider
          value={[options.length]}
          onValueChange={(value) => {
            setOptions((prev) => ({ ...prev, length: value[0] }));
            setPassword("");
          }}
          min={8}
          max={32}
          step={1}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[10px] text-muted-foreground">8</span>
          <span className="font-mono text-[10px] text-muted-foreground">32</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(["uppercase", "lowercase", "numbers", "symbols"] as const).map((key) => (
          <motion.div
            key={key}
            className={cn(
              "flex items-center justify-between p-3 rounded-sm border transition-all",
              options[key]
                ? "border-primary/40 bg-primary/5"
                : "border-primary/10 bg-secondary/30"
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-mono text-xs text-muted-foreground uppercase">
              {key === "uppercase" && "A-Z"}
              {key === "lowercase" && "a-z"}
              {key === "numbers" && "0-9"}
              {key === "symbols" && "!@#"}
            </span>
            <Switch
              checked={options[key]}
              onCheckedChange={() => toggleOption(key)}
              className="data-[state=checked]:bg-primary"
            />
          </motion.div>
        ))}
      </div>

      {/* Strength indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <StrengthIcon className={cn("w-4 h-4", `text-${strength.color}`)} />
          <span className={cn("font-mono text-xs", `text-${strength.color}`)}>
            {strength.label.toUpperCase()}
          </span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              strength.color === "safe" && "bg-safe",
              strength.color === "suspicious" && "bg-suspicious",
              strength.color === "dangerous" && "bg-dangerous"
            )}
            initial={{ width: 0 }}
            animate={{
              width:
                strength.label === "Weak"
                  ? "33%"
                  : strength.label === "Medium"
                  ? "66%"
                  : "100%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Generate button */}
      <Button onClick={generatePassword} className="w-full mb-4" variant="glow">
        <RefreshCw className="w-4 h-4 mr-2" />
        Generate Password
      </Button>

      {/* Password display */}
      {password && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div
            className="p-4 bg-secondary/50 border border-primary/30 rounded-sm font-mono text-sm break-all text-center text-foreground"
            style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.1)" }}
          >
            {password}
          </div>
          <motion.button
            onClick={handleCopy}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-sm transition-all",
              copied ? "bg-safe/20 text-safe" : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </motion.button>
        </motion.div>
      )}
      </motion.div>
    </SectionWrapper>
  );
};

export default PasswordGenerator;
