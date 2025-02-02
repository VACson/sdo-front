import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import dayjs from 'dayjs'

type Props = {
	date: string
	dayOffs: any[]
}

export default function CalendarCell({ date, dayOffs }: Props) {
	if (!date) {
		return (
			<View style={[styles.cell, styles.disabled]}>
				<Text style={styles.text}>—</Text>
			</View>
		)
	}

	const filteredDayOffs = dayOffs.filter((dayOff) => {
		const start = dayjs(dayOff.startDate)
		const end = dayjs(dayOff.endDate)
		const currentDate = dayjs(date)

		return currentDate.isBetween(start, end, 'day', '[]')
	})

	const dayOffUuids = filteredDayOffs.map((dayOff) => dayOff.user.fullName)

	return (
		<Link
			style={styles.cell}
			href={{
				pathname: '/day/[date]',
				params: { date }
			}}
		>
			<Text style={styles.text}>{dayjs(date).format('D MMMM')}</Text>
			{dayOffUuids.length > 0 && (
				<Text style={styles.dayOffText}>UUIDs: {dayOffUuids.join(', ')}</Text>
			)}
		</Link>
	)
}

const styles = StyleSheet.create({
	cell: {
		width: '14.28%',
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: '2%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	disabled: {
		backgroundColor: '#ddd',
		opacity: 0.5
	},
	dayOffText: {
		fontSize: 12,
		color: 'gray',
		marginTop: 4
	}
})
