// RevealItem
"use client";
import React, { createContext, useContext, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type RevealContextType = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const RevealContext = createContext<RevealContextType | undefined>(undefined);

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <RevealContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </RevealContext.Provider>
  );
}

export function RevealItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const context = useContext(RevealContext);

  if (!context) {
    throw new Error("RevealItem must be used within a RevealProvider");
  }

  if (!context.isVisible) return null;

  return <div className={cn("", className)} {...props} />;
}

export function RevealAction() {
  const context = useContext(RevealContext);
  if (!context) {
    throw new Error("RevealAction must be used within a RevealProvider");
  }

  return (
    <Button
      type="button"
      variant={context.isVisible ? "outline" : "default"}
      onClick={() => context.setIsVisible(!context.isVisible)}
    >
      {context.isVisible ? "Hide" : "Reveal"}
    </Button>
  );
}
