import * as React from"react"
import { cn} from"@/src/lib/utils"

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?:"default" |"destructive" |"outline" |"secondary" |"ghost" |"link"
 size?:"default" |"sm" |"lg" |"icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant ="default", size ="default", ...props}, ref) => {
 return (
 <button
 ref={ref}
 className={cn(
"inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold uppercase tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
 {
            "bg-[#CC0000] text-white border-2 border-black hover:bg-red-700": variant === "default",
            "bg-red-500 text-white border-2 border-black hover:bg-red-600": variant === "destructive",
            "border-2 border-black bg-white text-black hover:bg-gray-100": variant === "outline",
            "bg-black text-white border-2 border-black hover:bg-gray-800": variant === "secondary",
"hover:bg-gray-100 text-black border-2 border-transparent hover:border-black": variant ==="ghost",
"text-[#CC0000] underline-offset-4 hover:underline": variant ==="link",
"h-10 px-4 py-2": size ==="default",
"h-9 px-3": size ==="sm",
"h-11 px-8": size ==="lg",
"h-10 w-10": size ==="icon",
},
 className
 )}
 {...props}
 />
 )
}
)
Button.displayName ="Button"

export { Button}
