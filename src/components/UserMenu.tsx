import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Crown, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  onSignInClick: () => void;
}

const UserMenu = ({ onSignInClick }: UserMenuProps) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isPro } = useSubscription();

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onSignInClick}
        className="h-9 px-4 bg-secondary/50 border-primary/20 hover:bg-secondary hover:border-primary/40 transition-all font-mono text-xs"
      >
        <User className="w-3.5 h-3.5 mr-2" />
        <span className="hidden sm:inline">Sign in</span>
      </Button>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-2 hover:bg-secondary/50 transition-all gap-2"
        >
          <Avatar className="h-7 w-7 border border-primary/30">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-mono">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[100px] truncate">
            {user.displayName || user.name.split(" ")[0]}
          </span>
          {isPro && (
            <Crown className="w-3.5 h-3.5 text-accent" />
          )}
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border-primary/20"
      >
        {/* User Info Header */}
        <div className="px-3 py-2.5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-primary/30">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-mono">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName || user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate font-mono">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="px-3 py-2 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              Subscription
            </span>
            {isPro ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-accent">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            ) : (
              <span className="text-xs font-mono text-muted-foreground">
                Basic
              </span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem className="cursor-pointer hover:bg-secondary/50 focus:bg-secondary/50">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-sm">View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer hover:bg-secondary/50 focus:bg-secondary/50">
            <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-primary/10" />

        {/* Sign Out */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={signOut}
            className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm">Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
