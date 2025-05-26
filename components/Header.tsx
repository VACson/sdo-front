import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { Text } from '@/components/Text'
import { useColorScheme } from 'nativewind'

interface HeaderProps {
	title?: string
}

export default function Header({ title = '' }: HeaderProps) {
	const router = useRouter()
	const pathname = usePathname()
	const { colorScheme } = useColorScheme()
	const isDark = colorScheme === 'dark'

	const isMainPage = pathname === '/' || pathname === '/index'

	const handleTitlePress = () => {
		if (!isMainPage) {
			router.push('/')
		}
	}

	return (
		<View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
			<TouchableOpacity
				onPress={handleTitlePress}
				disabled={isMainPage}
				activeOpacity={isMainPage ? 1 : 0.7}
			>
				<Text className={`text-xl font-bold text-foreground ${!isMainPage ? 'underline' : ''}`}>
					{title}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => router.push('/profile')}
				className="p-1 rounded-full"
			>
				<MaterialIcons
					name="account-circle"
					size={28}
					color={isDark ? 'white' : 'black'}
				/>
			</TouchableOpacity>
		</View>
	)
}
