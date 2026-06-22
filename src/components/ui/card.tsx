import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:border-white/10',
        glass: [
          'border border-[rgba(229,9,20,0.12)] bg-[rgba(255,255,255,0.04)]',
          'backdrop-blur-xl',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.03)_inset]',
          'hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(229,9,20,0.25)]',
        ].join(' '),
        gold: [
          'border border-[#E50914]/20 bg-[rgba(229,9,20,0.05)]',
          'backdrop-blur-xl',
          'shadow-[0_0_40px_rgba(229,9,20,0.1),0_8px_32px_rgba(0,0,0,0.4)]',
          'hover:border-[#E50914]/35 hover:bg-[rgba(229,9,20,0.08)]',
          'hover:shadow-[0_0_60px_rgba(229,9,20,0.2),0_8px_32px_rgba(0,0,0,0.4)]',
        ].join(' '),
        flat: 'border border-white/5 hover:border-white/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 sm:p-8', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight text-white', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/50', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 sm:p-8 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 sm:p-8 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
