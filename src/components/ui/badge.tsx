import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]',
        secondary: 'border-white/10 bg-white/[0.08] text-white/70',
        destructive: 'border-red-500/20 bg-red-500/15 text-red-400',
        success: 'border-green-500/20 bg-green-500/15 text-green-400',
        warning: 'border-yellow-500/20 bg-yellow-500/15 text-yellow-400',
        outline: 'border-white/10 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
