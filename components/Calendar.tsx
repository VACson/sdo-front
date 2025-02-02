import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import CalendarCell from './CalendarCell'
import dayjs from 'dayjs'
import axios from 'axios'

export default function Calendar() {
	const currentYear = dayjs().year()
	const currentMonth = dayjs().month()
	const daysInMonth = dayjs().daysInMonth()
	const firstDayOfMonth = dayjs().startOf('month').day()

	// Формуємо масив дат: порожні клітинки + дні місяця
	const calendarDays = [
		...Array(firstDayOfMonth).fill(null), // Порожні клітинки
		...Array.from(
			{ length: daysInMonth },
			(_, i) => dayjs(`${currentYear}-${currentMonth + 1}-${i + 1}`).format('YYYY-MM-DD') // Форматуємо у строку
		)
	]

	const [dayOffs, setDayoffs] = useState([])
	const getDayOffs = async () => {
		try {
			const { data } = await axios.get('http://localhost:8000/day-offs')
			setDayoffs(data)
		} catch (e) {
			setDayoffs([])
		}
	}

	useEffect(() => {
		getDayOffs()
	}, [])

	return (
		<View style={styles.calendar}>
			{calendarDays.map((date, index) => (
				<CalendarCell
					key={index}
					date={date}
					dayOffs={dayOffs}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	calendar: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%'
	}
})
