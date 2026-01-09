import { createContext, useContext, useState, ReactNode } from "react";

export type AuthProvider = "google" | "apple";

export interface UserProfile {
  userId: string;
  authProvider: AuthProvider;
  name: string;
  email: string;
  profileImage?: string;
  accountCreatedAt: string;
  displayName?: string;
  age?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, "displayName" | "age">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate mock user data based on provider
const generateMockUser = (provider: AuthProvider): UserProfile => {
  const mockUsers = {
    google: {
      name: "Alex Thompson",
      email: "alex.thompson@gmail.com",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    apple: {
      name: "Jordan Mitchell",
      email: "j.mitchell@icloud.com",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    },
  };

  const userData = mockUsers[provider];
  
  return {
    userId: `usr_${Math.random().toString(36).substring(2, 15)}`,
    authProvider: provider,
    name: userData.name,
    email: userData.email,
    profileImage: userData.profileImage,
    accountCreatedAt: new Date().toISOString(),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signInWithProvider = async (provider: AuthProvider) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockUser = generateMockUser(provider);
    setUser(mockUser);
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<Pick<UserProfile, "displayName" | "age">>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithProvider,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
