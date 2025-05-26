import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import axios from 'axios'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { useColorScheme } from 'nativewind'

const ProfileScreen = () => {
	const user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		profilePic: 'https://via.placeholder.com/150' // Замінити на реальний URL зображення
	}

	const router = useRouter()
	const { colorScheme } = useColorScheme()
	const isDark = colorScheme === 'dark'

	const handleLogout = async () => {
		try {
			// Видаляємо токен з AsyncStorage
			await AsyncStorage.removeItem('auth_token')

			// Видаляємо заголовок Authorization з axios (якщо він був доданий)
			delete axios.defaults.headers['Authorization']

			// Навігація до сторінки входу
			router.push('/login')
		} catch (error) {
			console.error('Error during logout:', error)
			alert('Failed to log out. Please try again.')
		}
	}

	return (
		<View className="flex-1 p-4 bg-background">
			<Card className="mb-6">
				<CardContent className="p-4">
					<View className="flex-row items-center">
						<Image
							source={{ uri: user.profilePic }}
							className="w-20 h-20 rounded-full border-2 border-border"
						/>
						<View className="ml-4">
							<Text className="text-xl font-semibold text-foreground">{user.name}</Text>
							<Text className="text-sm text-muted-foreground mt-1">{user.email}</Text>
						</View>
					</View>
				</CardContent>
			</Card>

			<Card className="mb-6">
				<CardContent className="p-4">
					<Text className="text-lg font-medium text-foreground mb-2">Account Settings</Text>

					<TouchableOpacity className="py-3 border-b border-border">
						<Text className="text-foreground">Edit Profile</Text>
					</TouchableOpacity>

					<TouchableOpacity className="py-3 border-b border-border">
						<Text className="text-foreground">Change Password</Text>
					</TouchableOpacity>

					<TouchableOpacity className="py-3">
						<Text className="text-foreground">Notifications</Text>
					</TouchableOpacity>
				</CardContent>
			</Card>

			<View className="flex-1 justify-end mb-6">
				<Button
					variant="destructive"
					onPress={handleLogout}
					className="w-full"
				>
					<Text className="text-destructive-foreground font-medium">Logout</Text>
				</Button>
			</View>
		</View>
	)
}

export default ProfileScreen
