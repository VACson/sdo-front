import React from 'react'
import { View } from 'react-native'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'

// Імпортуємо утиліти для бейджів
import { getBadgeVariant, getBadgeColorClass } from '@/utils/badgeUtils'

interface LeaveRequest {
	uuid: string
	startDate: string
	endDate: string
	reason: string
	isApproved: boolean
	type: string
	user: { fullName: string }
}

const LeaveRequestCard = ({ leaveRequest }: { leaveRequest: LeaveRequest }) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	// Отримуємо клас кольору для бейджа статусу
	const getStatusBadgeClass = (isApproved: boolean) => {
		return isApproved
			? 'bg-green-500 hover:bg-green-600 text-white'
			: 'bg-orange-500 hover:bg-orange-600 text-white'
	}

	return (
		<Card className="w-full mb-4">
			<CardContent className="p-4">
				{/* Заголовок з ім'ям користувача */}
				<View className="flex-row justify-between items-center mb-3">
					<Text className="text-lg font-semibold text-foreground">
						{leaveRequest.user.fullName}
					</Text>
					<Badge
						variant={leaveRequest.isApproved ? 'default' : 'outline'}
						className={getStatusBadgeClass(leaveRequest.isApproved)}
					>
						<Text className="text-white">{leaveRequest.isApproved ? 'Approved' : 'Pending'}</Text>
					</Badge>
				</View>

				{/* Тип відпустки */}
				<View className="mb-3 flex-row">
					<Badge
						variant={getBadgeVariant(leaveRequest.type)}
						className={`mb-1 ${getBadgeColorClass(leaveRequest.type)}`}
					>
						<Text
							className="text-white"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{leaveRequest.type}
						</Text>
					</Badge>
				</View>

				{/* Дати */}
				<View className="mb-3">
					<Text className="text-sm font-medium text-muted-foreground mb-1">Dates</Text>
					<Text className="text-foreground">
						{formatDate(leaveRequest.startDate)} - {formatDate(leaveRequest.endDate)}
					</Text>
				</View>

				{/* Причина */}
				{leaveRequest.reason && (
					<View>
						<Text className="text-sm font-medium text-muted-foreground mb-1">Reason</Text>
						<Text className="text-foreground">{leaveRequest.reason}</Text>
					</View>
				)}
			</CardContent>
		</Card>
	)
}

export default LeaveRequestCard
