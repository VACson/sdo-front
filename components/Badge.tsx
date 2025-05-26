import { cva, type VariantProps } from 'class-variance-authority'
import { View } from 'react-native'
import * as Slot from '@rn-primitives/slot'
import type { SlottableViewProps } from '@rn-primitives/types'
import { cn } from '@/lib/utils'
import { TextClassContext } from './Text'

const badgeVariants = cva(
	'web:inline-flex items-center border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary web:hover:opacity-80 active:opacity-80',
				secondary: 'border-transparent bg-secondary web:hover:opacity-80 active:opacity-80',
				destructive: 'border-transparent bg-destructive web:hover:opacity-80 active:opacity-80',
				outline: 'text-foreground'
			},
			fullWidth: {
				true: 'w-full justify-center',
				false: ''
			},
			rounded: {
				full: 'rounded-full',
				md: 'rounded-md',
				sm: 'rounded-sm',
				none: 'rounded-none',
				left: 'rounded-l-md',
				right: 'rounded-r-md'
			}
		},
		defaultVariants: {
			variant: 'default',
			fullWidth: false,
			rounded: 'full'
		}
	}
)

const badgeTextVariants = cva('web:text-xs font-semibold ', {
	variants: {
		variant: {
			default: 'text-primary-foreground',
			secondary: 'text-secondary-foreground',
			destructive: 'text-destructive-foreground',
			outline: 'text-foreground'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

type BadgeProps = SlottableViewProps &
	VariantProps<typeof badgeVariants> & {
		fullWidth?: boolean
		rounded?: 'full' | 'md' | 'sm' | 'none' | 'left' | 'right'
	}

function Badge({ className, variant, fullWidth, rounded, asChild, ...props }: BadgeProps) {
	const Component = asChild ? Slot.View : View
	return (
		<TextClassContext.Provider value={badgeTextVariants({ variant })}>
			<Component
				className={cn(badgeVariants({ variant, fullWidth, rounded }), className)}
				{...props}
			/>
		</TextClassContext.Provider>
	)
}

export { Badge, badgeTextVariants, badgeVariants }
export type { BadgeProps }
