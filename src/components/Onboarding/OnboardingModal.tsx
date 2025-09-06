/**
 * src/components/Onboarding/OnboardingModal.tsx
 *
 * A multi-step onboarding modal shown to first-time users.
 *
 * // TODO: The `localStorage` logic is implemented, but you might want
 * // to sync this preference to a user's profile in Firestore.
 */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { FolderTree, Code, Bot } from "lucide-react";

const ONBOARDING_KEY = "aethercode_onboarding_complete";

const steps = [
  {
    icon: <FolderTree className="h-12 w-12 text-primary" />,
    title: "Explore Your Files",
    description: "The file tree on the left gives you a full view of your project. Click to open, right-click for more options.",
  },
  {
    icon: <Code className="h-12 w-12 text-primary" />,
    title: "Write and Edit Code",
    description: "The central editor is where the magic happens. It supports multiple tabs and syntax highlighting for your favorite languages.",
  },
  {
    icon: <Bot className="h-12 w-12 text-primary" />,
    title: "Meet Your AI Assistant",
    description: "On the right, your AI assistant can provide code suggestions, fix bugs, and explain complex snippets.",
  },
];

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingComplete) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center flex flex-col items-center"
                >
                    {steps[step].icon}
                    <DialogTitle className="mt-4">{steps[step].title}</DialogTitle>
                    <DialogDescription className="mt-2 min-h-[40px]">
                        {steps[step].description}
                    </DialogDescription>
                </motion.div>
            </AnimatePresence>
        </DialogHeader>
        
        <div className="flex justify-center items-center gap-2 my-4">
            {steps.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full">
            <div className="flex items-center space-x-2">
                <Checkbox id="dont-show-again" checked={dontShowAgain} onCheckedChange={(checked) => setDontShowAgain(!!checked)} />
                <Label htmlFor="dont-show-again" className="text-xs text-muted-foreground">
                    Don't show this again
                </Label>
            </div>
            <Button onClick={handleNext}>
                {step === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
