import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Copy, Check, RefreshCw, Inbox, Clock, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionWrapper from "./SectionWrapper";

interface MailMessage {
  id: number;
  from: string;
  subject: string;
  date: string;
}

interface FullMessage extends MailMessage {
  body?: string;
  textBody?: string;
  htmlBody?: string;
}

const TempEmailGenerator = () => {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FullMessage | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (email && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [email, timeLeft]);

  // Auto-refresh inbox if open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (email && showInbox) {
      interval = setInterval(() => {
        checkInbox(true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [email, showInbox]);

  const generateRandomEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setEmail(data[0]);
        setMessages([]);
        setSelectedMessage(null);
        setTimeLeft(600);
        setShowInbox(false);
      }
    } catch (error) {
      console.error("Failed to generate email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkInbox = async (background = false) => {
    if (!email) return;

    if (!background) setIsRefreshing(true);

    const [login, domain] = email.split("@");
    try {
      const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to check inbox:", error);
    } finally {
      if (!background) setIsRefreshing(false);
    }
  };

  const fetchMessageContent = async (id: number) => {
    if (!email) return;
    setIsRefreshing(true);
    const [login, domain] = email.split("@");
    try {
      const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
      const data = await response.json();
      setSelectedMessage(data);
    } catch (error) {
      console.error("Failed to fetch message content:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SectionWrapper
      title="Temporary Mail"
      subtitle="Generate a disposable email for privacy"
      icon={Mail}
    >
      <motion.div
        className="terminal-card p-6 max-w-lg mx-auto"
        whileHover={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.08)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm text-primary">TEMP_MAIL_GENERATOR</h2>
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 rounded-full bg-dangerous" />
            <div className="w-2 h-2 rounded-full bg-suspicious" />
            <div className="w-2 h-2 rounded-full bg-safe" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-suspicious/10 border border-suspicious/30 rounded-sm mb-4">
          <AlertTriangle className="w-4 h-4 text-suspicious shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-suspicious/90 leading-relaxed">
            Temporary emails expire automatically. Do not use for important accounts.
          </p>
        </div>

        {/* Generate button */}
        <Button
          onClick={generateRandomEmail}
          className="w-full mb-4"
          variant="glow"
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Generate Temp Email
            </>
          )}
        </Button>

        {/* Email display */}
        <AnimatePresence mode="wait">
          {email && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className="relative p-4 bg-secondary/50 border border-primary/30 rounded-sm mb-4"
                style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-3 h-3 text-primary/60" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    YOUR TEMP EMAIL
                  </span>
                </div>
                <div className="font-mono text-sm text-foreground pr-10 break-all">
                  {email}
                </div>
                <motion.button
                  onClick={handleCopy}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-sm transition-all",
                    copied
                      ? "bg-safe/20 text-safe"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Timer info */}
              <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono text-[10px]">Expires in {formatTime(timeLeft)}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowInbox(!showInbox);
                    if (!showInbox) checkInbox();
                  }}
                  className="flex-1 font-mono text-xs"
                >
                  <Inbox className="w-3 h-3 mr-1" />
                  {showInbox ? "Hide" : "Show"} Inbox
                  {messages.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full">
                      {messages.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => checkInbox()}
                  disabled={isRefreshing}
                  className="font-mono text-xs"
                >
                  <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail("");
                    setMessages([]);
                  }}
                  className="font-mono text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Inbox preview */}
              <AnimatePresence>
                {showInbox && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-primary/20 rounded-sm overflow-hidden"
                  >
                    <div className="px-3 py-2 bg-primary/5 border-b border-primary/20 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-primary">INBOX</span>
                      {isRefreshing && <Loader2 className="w-3 h-3 animate-spin text-primary/50" />}
                    </div>

                    {selectedMessage ? (
                      <div className="p-4 bg-background">
                        <div className="mb-4 pb-4 border-b border-border/40">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMessage(null)}
                            className="mb-2 h-6 px-2 -ml-2 text-xs text-muted-foreground hover:text-primary"
                          >
                            ← Back to inbox
                          </Button>
                          <h3 className="font-bold text-sm mb-1">{selectedMessage.subject}</h3>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{selectedMessage.from}</span>
                            <span>{selectedMessage.date}</span>
                          </div>
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-xs"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody || selectedMessage.body || "" }}
                        />
                      </div>
                    ) : (
                      <div className="divide-y divide-primary/10 max-h-[300px] overflow-y-auto">
                        {messages.length > 0 ? (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              className="p-3 hover:bg-primary/5 transition-colors cursor-pointer group"
                              onClick={() => fetchMessageContent(msg.id)}
                              whileHover={{ x: 4 }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs text-foreground truncate max-w-[180px]">
                                  {msg.from}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground shrink-0 ml-2">
                                  {msg.date.split(' ')[1]}
                                </span>
                              </div>
                              <p className="font-mono text-xs text-primary/80 truncate group-hover:text-primary transition-colors">
                                {msg.subject}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="font-mono text-xs text-muted-foreground">No emails yet</p>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => checkInbox()}
                              className="mt-2 text-[10px] h-auto p-0 text-primary"
                            >
                              Refresh Inbox
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
};

export default TempEmailGenerator;
