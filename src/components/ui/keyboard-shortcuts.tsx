// A component to display keyboard shortcuts
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Button } from "./button";
import { Kbd } from "./kbd";

const shortcuts = [
  { command: "Save File", keys: ["Cmd", "S"] },
  { command: "Run Code", keys: ["Cmd", "Enter"] },
  { command: "Command Palette", keys: ["Cmd", "K"] },
  { command: "Toggle File Tree", keys: ["Cmd", "B"] },
];

export function KeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Keyboard Shortcuts">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Boost your productivity with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.command}
              className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.command}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
