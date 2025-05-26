import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { cn } from '@/lib/utils'
import { Text } from './Text'

interface AlertProps {
	variant?: 'default' | 'destructive'
	className?: string
	children: ReactNode
}

export function Alert({ variant = 'default', className, children }: AlertProps) {
	return (
		<View
			className={cn(
				'p-4 rounded-md border',
				variant === 'default' && 'bg-primary/10 border-primary',
				variant === 'destructive' && 'bg-destructive/10 border-destructive',
				className
			)}
		>
			{children}
		</View>
	)
}

interface AlertTitleProps {
	className?: string
	children: ReactNode
}

export function AlertTitle({ className, children }: AlertTitleProps) {
	return <Text className={cn('font-semibold', className)}>{children}</Text>
}

interface AlertDescriptionProps {
	className?: string
	children: ReactNode
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
	return <Text className={cn('text-sm', className)}>{children}</Text>
}
