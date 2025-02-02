import Header from '@/components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

export default function Layout() {
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const pathname = usePathname()
	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = await AsyncStorage.getItem('auth_token')

				if (token) {
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
					if (pathname === '/login') {
						router.push('/')
					}
				} else {
					router.push('/login')
				}
			} catch (error) {
				router.push('/login')
			} finally {
				setLoading(false)
			}
		}

		checkToken()
	}, [])

	return (
		<Stack
			screenOptions={{
				header: () => <Header title="My App" /> // Додаємо хедер
			}}
		>
			<Stack.Screen
				name="(auth)/login"
				options={{ title: 'Login' }}
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
				name="profile"
				options={{ title: 'Профіль' }}
			/>
		</Stack>
	)
}
