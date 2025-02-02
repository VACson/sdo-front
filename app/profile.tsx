import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

const ProfileScreen = () => {
	const user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		profilePic: 'https://via.placeholder.com/150' // Replace with actual image URL
	}

	const handleLogout = () => {
		// Logout logic here
	}

	return (
		<View style={styles.container}>
			<View style={styles.container_top}>
				<Image
					source={{ uri: user.profilePic }}
					style={styles.profilePic}
				/>
				<View style={styles.textContainer}>
					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.email}>{user.email}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}
			>
				<Text style={styles.logoutText}>Logout</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#F1F3F4'
	},
	container_top: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 20,
		marginBottom: 20
	},
	profilePic: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: '#ffffff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6
	},
	textContainer: {
		marginLeft: 15
	},
	name: {
		fontSize: 22,
		fontWeight: '600',
		color: '#333'
	},
	email: {
		fontSize: 16,
		color: '#777',
		marginTop: 5
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FF4C4C',
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 20,
		alignSelf: 'center'
	},
	logoutText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500'
	}
})

export default ProfileScreen
