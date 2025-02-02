import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/uk' // Імпортуємо українську локаль
import isBetween from 'dayjs/plugin/isBetween' // Імпортуємо українську локаль
import Calendar from '@/components/Calendar'

export default function DayDetailsScreen() {
	dayjs.locale('uk')
	dayjs.extend(isBetween)

	return (
		<View style={styles.container}>
			<Calendar />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflowY: 'scroll'
	}
})
