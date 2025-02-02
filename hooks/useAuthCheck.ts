import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useAuthCheck() {
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = await AsyncStorage.getItem('auth_token')

				if (token) {
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

					if (usePathname() === '/login') {
						router.push('/')
					}
				} else {
					if (usePathname() !== '/login') {
						router.push('/login')
					}
				}
			} catch (error) {
				console.error('Error checking token:', error)
				router.push('/login')
			} finally {
				setLoading(false)
			}
		}

		checkToken()
	}, [router])

	return loading
}
