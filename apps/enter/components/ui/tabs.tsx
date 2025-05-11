import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-row border-b border-gray-200",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all",
        active 
          ? "border-b-2 border-primary-600 text-primary-600" 
          : "text-gray-500 hover:text-gray-700",
        className
      )}
      {...props}
    />
  )
)
TabTrigger.displayName = "TabTrigger"

const TabContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2",
      className
    )}
    {...props}
  />
))
TabContent.displayName = "TabContent"

export { Tabs, TabsList, TabTrigger, TabContent }
