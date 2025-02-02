import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function DayDetailsScreen() {
	const { date } = useLocalSearchParams() // Отримуємо параметр з URL

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Деталі дня</Text>
			<Text style={styles.text}>{date}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10
	},
	text: {
		fontSize: 18,
		color: '#333'
	}
})
