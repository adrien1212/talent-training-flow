
import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className = "",
  color = "gray"
}: {
  children: React.ReactNode;
  className?: string;
  color?: "gray" | "green" | "blue" | "red";
}) {
  const colorMap = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700"
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium inline-block",
        colorMap[color] || colorMap.gray,
        className
      )}
    >
      {children}
    </span>
  );
}
