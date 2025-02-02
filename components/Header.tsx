import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

export default function Header({ title = 'My App' }) {
	const router = useRouter()

	return (
		<View style={styles.header}>
			<Text style={styles.title}>{title}</Text>
			<TouchableOpacity
				onPress={() => router.push('/profile')}
				style={styles.profileButton}
			>
				<MaterialIcons
					name="account-circle"
					size={28}
					color="white"
				/>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 15,
		backgroundColor: '#007AFF'
	},
	title: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold'
	},
	profileButton: {
		padding: 5
	}
})
