import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Copy, Check, Link2, Mail, Wifi, Type } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SectionWrapper from "./SectionWrapper";

type QRType = "url" | "text" | "email" | "wifi";

const qrTypes: { id: QRType; label: string; icon: typeof Link2; placeholder: string }[] = [
  { id: "url", label: "URL", icon: Link2, placeholder: "https://example.com" },
  { id: "text", label: "Text", icon: Type, placeholder: "Enter your text here..." },
  { id: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
  { id: "wifi", label: "Wi-Fi", icon: Wifi, placeholder: "Network name" },
];

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState<QRType>("url");
  const [inputValue, setInputValue] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const getQRValue = () => {
    if (!inputValue) return "";
    switch (qrType) {
      case "url":
        return inputValue.startsWith("http") ? inputValue : `https://${inputValue}`;
      case "email":
        return `mailto:${inputValue}`;
      case "wifi":
        return `WIFI:T:WPA;S:${inputValue};P:${wifiPassword};;`;
      default:
        return inputValue;
    }
  };

  const handleGenerate = () => {
    if (inputValue.trim()) {
      setGenerated(true);
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = 256;
        canvas.height = 256;
        ctx?.drawImage(img, 0, 0, 256, 256);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "qrcode.png";
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getQRValue());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionWrapper
      title="QR Generator"
      subtitle="Create scannable QR codes for URLs, text, or Wi-Fi"
      icon={QrCode}
      focusSelector="input"
    >
      <motion.div
        className="terminal-card p-6 max-w-lg mx-auto"
        whileHover={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.08)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
          <QrCode className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm text-primary">QR_CODE_GENERATOR</h2>
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 rounded-full bg-dangerous" />
            <div className="w-2 h-2 rounded-full bg-suspicious" />
            <div className="w-2 h-2 rounded-full bg-safe" />
          </div>
        </div>

      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {qrTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              onClick={() => {
                setQrType(type.id);
                setGenerated(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-xs transition-all",
                qrType === type.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-primary/80"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-3 h-3" />
              {type.label}
            </motion.button>
          );
        })}
      </div>

      {/* Input */}
      <div className="space-y-3 mb-4">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setGenerated(false);
          }}
          placeholder={qrTypes.find((t) => t.id === qrType)?.placeholder}
          className="bg-secondary/50 border-primary/20 font-mono text-sm focus:border-primary/50"
        />
        {qrType === "wifi" && (
          <Input
            value={wifiPassword}
            onChange={(e) => {
              setWifiPassword(e.target.value);
              setGenerated(false);
            }}
            type="password"
            placeholder="Wi-Fi password"
            className="bg-secondary/50 border-primary/20 font-mono text-sm focus:border-primary/50"
          />
        )}
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={!inputValue.trim()}
        className="w-full mb-6"
        variant="glow"
      >
        <QrCode className="w-4 h-4 mr-2" />
        Generate QR Code
      </Button>

      {/* QR Preview */}
      {generated && inputValue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div
            ref={qrRef}
            className="p-4 bg-foreground rounded-sm relative overflow-hidden"
            style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
          >
            <QRCodeSVG
              value={getQRValue()}
              size={180}
              bgColor="hsl(120, 60%, 95%)"
              fgColor="hsl(0, 0%, 4%)"
              level="H"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("png")}
              className="font-mono text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("svg")}
              className="font-mono text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              SVG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="font-mono text-xs"
            >
              {copied ? (
                <Check className="w-3 h-3 mr-1 text-safe" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </motion.div>
      )}
      </motion.div>
    </SectionWrapper>
  );
};

export default QRCodeGenerator;
