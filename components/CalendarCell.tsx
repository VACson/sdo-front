import React from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Link } from 'expo-router'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Badge } from '@/components/Badge'

// Імпортуємо типи з сервісу
import { DayOffType } from '@/services/dayOffService'
import { getBadgeColorClass } from '@/utils/badgeUtils'

// Розширюємо dayjs плагіном isBetween
dayjs.extend(isBetween)

interface DayOff {
	uuid: string
	startDate: string
	endDate: string
	reason: string
	isApproved: boolean
	type: DayOffType
	user: { fullName: string }
}

type Props = {
	date: string
	dayOffs: DayOff[]
}

export default function CalendarCell({ date, dayOffs }: Props) {
	const { width } = useWindowDimensions()
	const isMobile = width < 768 // Визначаємо, чи це мобільний пристрій

	// Якщо дата не вказана (порожня клітинка)
	if (!date) {
		return (
			<View
				className={`w-[14.28%] border border-border bg-muted/30 items-center justify-center h-32`}
			>
				<Text className="text-muted-foreground">—</Text>
			</View>
		)
	}

	// Фільтруємо відпустки, які включають поточну дату
	const filteredDayOffs = dayOffs.filter((dayOff) => {
		const start = dayjs(dayOff.startDate)
		const end = dayjs(dayOff.endDate)
		const currentDate = dayjs(date)
		return currentDate.isBetween(start, end, 'day', '[]')
	})

	// Групуємо відпустки за типом
	const dayOffsByType = filteredDayOffs.reduce((acc, dayOff) => {
		const type = dayOff.type
		if (!acc[type]) {
			acc[type] = []
		}
		acc[type].push(dayOff)
		return acc
	}, {} as Record<string, DayOff[]>)

	// Визначаємо, чи є поточна дата сьогоднішньою
	const isToday = dayjs(date).isSame(dayjs(), 'day')

	// Визначаємо, чи є поточна дата вихідним днем (субота або неділя)
	const isWeekend = [0, 6].includes(dayjs(date).day())

	// Отримуємо день місяця та місяць
	const day = dayjs(date).date()
	const month = dayjs(date).format('MMM')

	// Визначаємо колір фону для клітинки календаря
	const getBgColorClass = () => {
		if (isToday) return 'bg-primary/5'
		if (isWeekend) return 'bg-muted/50'
		return ''
	}

	// Визначаємо варіант бейджа в залежності від типу відпустки
	const getBadgeVariant = (type: DayOffType) => {
		switch (type) {
			case DayOffType.VACATION:
				return 'default'
			case DayOffType.SICK_LEAVE:
				return 'destructive'
			default:
				return 'outline'
		}
	}

	// Визначаємо, чи відпустка починається в поточний день
	const isStartingToday = (dayOff: DayOff) => {
		const start = dayjs(dayOff.startDate)
		const currentDate = dayjs(date)
		return start.isSame(currentDate, 'day')
	}

	// Визначаємо, чи відпустка закінчується в поточний день
	const isEndingToday = (dayOff: DayOff) => {
		const end = dayjs(dayOff.endDate)
		const currentDate = dayjs(date)
		return end.isSame(currentDate, 'day')
	}

	// Визначаємо тип заокруглення для бейджа в залежності від початку/кінця відпустки
	const getBadgeRounding = (dayOff: DayOff) => {
		const isStarting = isStartingToday(dayOff)
		const isEnding = isEndingToday(dayOff)

		if (isStarting && isEnding) return 'full' // Якщо відпустка починається і закінчується в цей день
		if (isStarting) return 'left' // Якщо відпустка починається в цей день - заокруглюємо ліву сторону
		if (isEnding) return 'right' // Якщо відпустка закінчується в цей день - заокруглюємо праву сторону
		return 'none' // Якщо день в середині відпустки - без заокруглення
	}

	return (
		<Link
			href={{
				pathname: '/day/[date]',
				params: { date }
			}}
			asChild
		>
			<TouchableOpacity
				className={`w-[14.28%] border border-border p-1 ${getBgColorClass()} ${
					isToday ? 'border-primary border-2' : ''
				} h-32`}
				activeOpacity={0.7}
			>
				<View className="flex-1">
					{/* Верхня частина з датою */}
					<View className="items-center">
						<Text
							className={`${isMobile ? 'text-xs' : 'text-xs'} ${
								isToday ? 'text-primary font-bold' : 'text-muted-foreground'
							}`}
						>
							{month}
						</Text>
						<Text
							className={`${isMobile ? 'text-lg' : 'text-base'} font-semibold ${
								isToday ? 'text-primary' : 'text-foreground'
							}`}
						>
							{day}
						</Text>
					</View>

					{/* Нижня частина з інформацією про відпустки */}
					<View className="mt-1 items-start">
						{filteredDayOffs.length > 0 &&
							(isMobile ? (
								// Для мобільних пристроїв показуємо кількість відпусток за типом
								<View className="flex-row flex-wrap">
									{Object.entries(dayOffsByType).map(([type, dayOffs], index) => (
										<Badge
											key={index}
											variant={getBadgeVariant(type as DayOffType)}
											className={`mr-1 mb-1 ${getBadgeColorClass(type as DayOffType)}`}
											rounded="md"
											fullWidth={false}
										>
											<Text className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-white`}>
												{dayOffs.length}
											</Text>
										</Badge>
									))}
								</View>
							) : (
								// Для десктопу показуємо всі відпустки (до 4-х)
								<View className="flex-col w-full">
									{filteredDayOffs.slice(0, 4).map((dayOff, index) => {
										const isStarting = isStartingToday(dayOff)
										const isEnding = isEndingToday(dayOff)
										const isOneDay = isStarting && isEnding

										return (
											<Badge
												key={index}
												variant={getBadgeVariant(dayOff.type as DayOffType)}
												className={`mb-1 ${getBadgeColorClass(dayOff.type as DayOffType)}`}
												fullWidth={!isOneDay}
												rounded={getBadgeRounding(dayOff)}
											>
												<Text
													className="text-[10px] text-white"
													numberOfLines={1}
													ellipsizeMode="tail"
												>
													{dayOff.user?.fullName}
												</Text>
											</Badge>
										)
									})}
									{filteredDayOffs.length > 4 && (
										<Badge
											variant="outline"
											className="mb-1"
											fullWidth={true}
											rounded="md"
										>
											<Text
												className="text-[10px] text-muted-foreground"
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												+{filteredDayOffs.length - 4} more
											</Text>
										</Badge>
									)}
								</View>
							))}
					</View>
				</View>
			</TouchableOpacity>
		</Link>
	)
}
