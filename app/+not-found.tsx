import { Link, Stack } from 'expo-router'
import { View } from 'react-native'

import { Text } from '@/components/Text'

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View className="flex-1 items-center justify-center p-5 bg-background">
				<Text className="text-3xl font-bold">This screen doesn't exist.</Text>
				<Link
					href="/"
					className="mt-4 py-4"
				>
					<Text className="text-primary text-base">Go to home screen!</Text>
				</Link>
			</View>
		</>
	)
}
