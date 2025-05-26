import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native'
import CalendarCell from './CalendarCell'
import dayjs from 'dayjs'

// Імпортуємо сервіс для роботи з відпустками
import { DayOff, getDayOffs } from '@/services/dayOffService'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'

export default function Calendar() {
	const { width } = useWindowDimensions()
	const isMobile = width < 768 // Визначаємо, чи це мобільний пристрій

	const [currentDate, setCurrentDate] = useState(dayjs())
	const currentYear = currentDate.year()
	const currentMonth = currentDate.month()
	const daysInMonth = currentDate.daysInMonth()
	const firstDayOfMonth = currentDate.startOf('month').day()

	// Формуємо масив дат: порожні клітинки + дні місяця
	const calendarDays = [
		...Array(firstDayOfMonth).fill(null), // Порожні клітинки
		...Array.from(
			{ length: daysInMonth },
			(_, i) => dayjs(`${currentYear}-${currentMonth + 1}-${i + 1}`).format('YYYY-MM-DD') // Форматуємо у строку
		)
	]

	const [dayOffs, setDayoffs] = useState<DayOff[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Функція для зміни місяця
	const changeMonth = (amount: number) => {
		const newDate = currentDate.add(amount, 'month')
		setCurrentDate(newDate)
	}

	// Функція для переходу до поточного місяця
	const goToCurrentMonth = () => {
		setCurrentDate(dayjs())
	}

	const fetchDayOffs = async () => {
		try {
			setLoading(true)
			setError(null)

			// Отримуємо перший і останній день місяця для фільтрації
			const startOfMonth = currentDate.startOf('month').format('YYYY-MM-DD')
			const endOfMonth = currentDate.endOf('month').format('YYYY-MM-DD')

			// Використовуємо сервіс для отримання відпусток
			const data = await getDayOffs(startOfMonth, endOfMonth)
			setDayoffs(data)
		} catch (e) {
			setError('Не вдалося завантажити дані про відпустки. Спробуйте пізніше.')
			setDayoffs([])
		} finally {
			setLoading(false)
		}
	}

	// Оновлюємо дані при зміні місяця
	useEffect(() => {
		fetchDayOffs()
	}, [currentDate])

	// Назви днів тижня
	const weekDays = isMobile
		? ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] // Скорочені назви для мобільних
		: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'] // Повні назви для десктопу

	return (
		<Card className="w-full overflow-hidden">
			<CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
				{/* Заголовок календаря з місяцем та роком і кнопками навігації */}
				<View className={`flex-row justify-between items-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
					<View className="flex-row items-center">
						<Button
							variant="ghost"
							size="icon"
							onPress={() => changeMonth(-1)}
							className={isMobile ? 'w-8 h-8 mr-0' : 'mr-1'}
						>
							<ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
						</Button>

						<Text
							className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-foreground mx-2`}
							onPress={goToCurrentMonth}
						>
							{currentDate.format('MMMM YYYY')}
						</Text>

						<Button
							variant="ghost"
							size="icon"
							onPress={() => changeMonth(1)}
							className={isMobile ? 'w-8 h-8 ml-0' : 'ml-1'}
						>
							<ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
						</Button>
					</View>

					<Button
						variant="outline"
						size="sm"
						onPress={goToCurrentMonth}
						className={isMobile ? 'py-1 px-2 h-8' : ''}
					>
						Сьогодні
					</Button>
				</View>

				{/* Дні тижня */}
				<View className={`flex-row ${isMobile ? 'mb-1' : 'mb-2'}`}>
					{weekDays.map((day, index) => (
						<View
							key={index}
							className="w-[14.28%] items-center"
						>
							<Text
								className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground`}
							>
								{day}
							</Text>
						</View>
					))}
				</View>

				{/* Календарна сітка */}
				{loading ? (
					<View className={`items-center justify-center ${isMobile ? 'py-4' : 'py-8'}`}>
						<ActivityIndicator
							size={isMobile ? 'small' : 'large'}
							color="#0000ff"
						/>
					</View>
				) : error ? (
					<View className={`items-center justify-center ${isMobile ? 'py-4' : 'py-8'}`}>
						<Text className="text-destructive text-center">{error}</Text>
						<Button
							variant="outline"
							className="mt-2"
							size="sm"
							onPress={fetchDayOffs}
						>
							Спробувати знову
						</Button>
					</View>
				) : (
					<View className="flex-row flex-wrap">
						{calendarDays.map((date, index) => (
							<CalendarCell
								key={index}
								date={date}
								dayOffs={dayOffs}
							/>
						))}
					</View>
				)}
			</CardContent>
		</Card>
	)
}
