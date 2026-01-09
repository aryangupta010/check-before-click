import { createContext, useContext, useState, ReactNode } from "react";

export type PlanType = "basic" | "pro";

interface SubscriptionContextType {
  plan: PlanType;
  isPro: boolean;
  upgradeToPro: () => void;
  downgradeToBasic: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<PlanType>("basic");

  const upgradeToPro = () => {
    setPlan("pro");
  };

  const downgradeToBasic = () => {
    setPlan("basic");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        isPro: plan === "pro",
        upgradeToPro,
        downgradeToBasic,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
