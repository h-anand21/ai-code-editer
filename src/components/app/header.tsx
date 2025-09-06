"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AetherCodeLogo } from "@/components/icons";
import { Share2, LogOut, User, Settings } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

type AppHeaderProps = {
  projectName: string;
};

export function AppHeader({ projectName }: AppHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 shrink-0">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="lg:hidden" />
         <AetherCodeLogo className="h-6 w-6 text-primary" />
         <span className="font-semibold text-lg hidden md:inline">AetherCode</span>
      </div>

      <div className="flex-1">
        <div className="w-full">
            <span className="text-sm text-muted-foreground hidden md:inline">Project:</span>
            <span className="ml-2 font-medium">{projectName}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/32" alt="@user" data-ai-hint="profile avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
