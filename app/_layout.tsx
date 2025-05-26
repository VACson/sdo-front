import Header from '@/components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import '../global.css'
import { setupAuthToken } from '@/services/authService'

export default function Layout() {
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const pathname = usePathname()

	const checkToken = async () => {
		try {
			const isAuthenticated = await setupAuthToken()
			setLoading(false)

			if (isAuthenticated) {
				if (pathname === '/login') {
					router.push('/')
				}
			} else {
				if (pathname !== '/login' && pathname !== '/register') {
					router.push('/login')
				}
			}
		} catch (error) {
			setLoading(false)
			console.error('Error during token check:', error)
			if (pathname !== '/login') {
				router.push('/login')
			}
		}
	}

	useEffect(() => {
		checkToken()
	}, [])

	if (loading) {
		return (
			<View>
				<ActivityIndicator
					size="large"
					color="#0000ff"
				/>
			</View>
		)
	}

	return (
		<Stack
			screenOptions={{
				header: () => <Header title="SDO" />
			}}
		>
			<Stack.Screen
				name="(auth)/login"
				options={{ title: 'Login' }}
			/>
			<Stack.Screen
				name="(auth)/register"
				options={{ title: 'Register' }}
			/>
			<Stack.Screen
				name="(tabs)/index"
				options={{ title: 'Home' }}
			/>

			<Stack.Screen
				name="day/[uuid]"
				options={{ title: 'Деталі дня' }}
			/>

			<Stack.Screen
				name="create"
				options={{ title: 'Створення нового реквесту' }}
			/>

			<Stack.Screen
				name="profile"
				options={{ title: 'Профіль' }}
			/>
		</Stack>
	)
}
