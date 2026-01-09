import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Shield } from "lucide-react";
import { useAuth, AuthProvider as AuthProviderType } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const { signInWithProvider, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<AuthProviderType | null>(null);

  const handleSignIn = async (provider: AuthProviderType) => {
    setLoadingProvider(provider);
    try {
      await signInWithProvider(provider);
      onClose();
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Sign in to continue
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Access personalized features and Pro tools
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-12 bg-secondary/50 border-primary/20 hover:bg-secondary hover:border-primary/40 transition-all"
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
          >
            {loadingProvider === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <span className="mr-3">
                <GoogleIcon />
              </span>
            )}
            <span className="font-medium">Continue with Google</span>
          </Button>

          {/* Apple Button */}
          <Button
            variant="outline"
            className="w-full h-12 bg-secondary/50 border-primary/20 hover:bg-secondary hover:border-primary/40 transition-all"
            onClick={() => handleSignIn("apple")}
            disabled={isLoading}
          >
            {loadingProvider === "apple" ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <span className="mr-3">
                <AppleIcon />
              </span>
            )}
            <span className="font-medium">Continue with Apple</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground font-mono">
              or continue as guest
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full h-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          onClick={onClose}
          disabled={isLoading}
        >
          Continue without signing in
        </Button>

        {/* Security Note */}
        <div className="mt-4 pt-4 border-t border-primary/10">
          <p className="text-xs text-muted-foreground text-center font-mono leading-relaxed">
            <Shield className="w-3 h-3 inline-block mr-1 text-primary" />
            We don't store passwords.
            <br />
            Authentication handled via trusted providers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
