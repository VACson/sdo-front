import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import dayjs from 'dayjs'
import 'dayjs/locale/uk' // Імпортуємо українську локаль
import isBetween from 'dayjs/plugin/isBetween' // Імпортуємо українську локаль
import Calendar from '@/components/Calendar'
import { Button } from '@/components/Button'
import { Plus } from 'lucide-react-native'

export default function DayDetailsScreen() {
	dayjs.locale('uk')
	dayjs.extend(isBetween)

	return (
		<View className="flex-1">
			<View className="flex-1 overflow-y-auto">
				<Calendar />
			</View>

			{/* Плаваюча кнопка (FAB), фіксована при прокрутці */}
			<View
				style={StyleSheet.absoluteFillObject}
				pointerEvents="box-none"
			>
				<View className="absolute bottom-6 right-6">
					<Link
						href="/create"
						asChild
					>
						<Button
							className="rounded-full w-14 h-14 bg-primary shadow-lg"
							size="icon"
						>
							<Plus className="h-6 w-6 text-white" />
						</Button>
					</Link>
				</View>
			</View>
		</View>
	)
}
