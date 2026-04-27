import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline"
    size?: "sm" | "md" | "lg"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const Comp = "button"

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-blue-500/20 hover:shadow-blue-400/30",
            secondary: "bg-blue-50/70 dark:bg-blue-950/40 text-foreground border border-blue-200/40 dark:border-blue-800/30 hover:bg-blue-100/80 dark:hover:bg-blue-950/60 backdrop-blur-sm",
            outline: "border border-blue-200/60 dark:border-blue-800/40 bg-white/40 dark:bg-blue-950/20 backdrop-blur-sm hover:bg-blue-50/80 dark:hover:bg-blue-950/50 text-foreground transition-colors duration-200",
            ghost: "hover:bg-blue-100/50 dark:hover:bg-blue-950/40 text-foreground",
            destructive: "bg-red-500/80 text-white hover:bg-red-500/90 backdrop-blur-sm",
        }

        const sizes = {
            sm: "h-9 rounded-md px-3",
            md: "h-10 px-4 py-2",
            lg: "h-11 rounded-md px-8",
        }

        return (
            <Comp
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
