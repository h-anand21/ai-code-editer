/**
 * src/components/TopBar/TopBar.tsx
 *
 * Top application bar with project title, branch selector, run/share buttons,
 * and user profile actions.
 *
 * // TODO: Implement branch selection logic.
 * // TODO: Wire up editable project title to Firestore.
 */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Share2,
  GitBranch,
  Save,
  Check,
  ChevronsUpDown,
  LogOut,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import type { Project } from "@/types/ui";
import { cn } from "@/lib/utils";
import { PresenceBar } from "../Presence/PresenceBar";
import { useTheme } from "next-themes";
import { KeyboardShortcuts } from "../ui/keyboard-shortcuts";
import { AetherCodeLogo } from "../icons";

type TopBarProps = {
  project: Project;
};

const AutosaveIndicator: React.FC = () => {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  // TODO: This should be driven by props from the editor state.
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {status === "saving" && <Save className="w-3 h-3 animate-spin" />}
      {status === "saved" && <Check className="w-3 h-3 text-green-500" />}
      <span>
        {status === "saving"
          ? "Saving..."
          : status === "saved"
          ? "Saved"
          : "Error"}
      </span>
    </div>
  );
};

const BranchSelector: React.FC<{ currentBranch: string }> = ({ currentBranch }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(currentBranch);
    const branches = [
        { value: 'main', label: 'main' },
        { value: 'feat/new-ui', label: 'feat/new-ui' },
        { value: 'fix/auth-bug', label: 'fix/auth-bug' },
    ];

  return (
     <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-sm"
        >
            <GitBranch className="w-4 h-4 mr-2" />
            <span className="truncate">{value}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandEmpty>No branch found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
                {branches.map((branch) => (
                <CommandItem
                    key={branch.value}
                    value={branch.value}
                    onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === branch.value ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {branch.label}
                </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ThemeToggle = () => {
    const { setTheme, theme } = useTheme();
    return (
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export const TopBar: React.FC<TopBarProps> = ({ project }) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 shrink-0">
      <div className="flex items-center gap-2 mr-auto">
         <AetherCodeLogo className="h-6 w-6 text-primary" />
         <span className="font-semibold text-lg hidden md:inline">AetherCode</span>
      </div>

      <div className="flex items-center gap-2">
        <BranchSelector currentBranch={project.branch} />
        <AutosaveIndicator />
        <PresenceBar users={project.collaborators} />
        <Button variant="secondary" size="sm">
          <Play className="w-4 h-4 mr-2" /> Run
        </Button>
        <Button variant="default" size="sm">
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
        <KeyboardShortcuts />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.collaborators[0].avatarUrl} alt={project.collaborators[0].name} />
                <AvatarFallback>{project.collaborators[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
            <DropdownMenuItem><LogOut className="w-4 h-4 mr-2" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
