import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import RequestCell from '../../components/day_offs/RequestCell'

// Імпортуємо сервіс для роботи з відпустками
import { DayOff, getDayOffsByDate } from '@/services/dayOffService'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Card, CardContent } from '@/components/Card'

export default function DayDetailsScreen() {
	const { date } = useLocalSearchParams()
	const formattedDate =
		typeof date === 'string'
			? new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
			  })
			: 'Unknown Date'

	const [dayOffs, setDayoffs] = useState<DayOff[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchDayOffs = async () => {
		try {
			setLoading(true)
			setError(null)
			if (typeof date === 'string') {
				const data = await getDayOffsByDate(date)
				setDayoffs(data)
			}
		} catch (e) {
			setError('Failed to load day offs. Please try again later.')
			setDayoffs([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchDayOffs()
	}, [date])

	return (
		<View className="flex-1 p-4 bg-background">
			<Text className="text-2xl font-bold mb-2 text-foreground">{formattedDate}</Text>
			<Text className="text-lg mb-4 text-muted-foreground">Day Details</Text>

			{loading ? (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator
						size="large"
						color="#0000ff"
					/>
				</View>
			) : error ? (
				<Card className="w-full">
					<CardContent className="p-4">
						<Text className="text-destructive text-center">{error}</Text>
					</CardContent>
				</Card>
			) : dayOffs.length === 0 ? (
				<Card className="w-full">
					<CardContent className="p-4">
						<Text className="text-center text-muted-foreground">
							No day offs found for this date.
						</Text>
					</CardContent>
				</Card>
			) : (
				<FlatList
					data={dayOffs}
					keyExtractor={(item) => item.uuid}
					renderItem={({ item }) => <RequestCell leaveRequest={item} />}
					contentContainerStyle={{ paddingBottom: 16 }}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	)
}
