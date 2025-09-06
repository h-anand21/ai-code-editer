/**
 * src/components/Presence/PresenceBar.tsx
 *
 * Displays a stack of collaborator avatars with real-time presence indicators.
 *
 * // TODO: Wire up to a real-time presence system (e.g., Firestore).
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PresenceUser } from "@/types/ui";
import { cn } from "@/lib/utils";

interface PresenceBarProps {
  users: PresenceUser[];
}

const statusColorMap = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  offline: "bg-gray-400",
};

export const PresenceBar: React.FC<PresenceBarProps> = ({ users }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-card hover:z-10 transition-transform hover:scale-110">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.status === "active" ? "Active now" : `Last active: ${user.lastActive}`}
                </p>
              </TooltipContent>
            </Tooltip>
            <span
              className={cn(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-card",
                statusColorMap[user.status]
              )}
              aria-label={`${user.name} is ${user.status}`}
            />
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
};
