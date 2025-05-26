import React, { useState } from 'react'
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

// Імпортуємо сервіс для роботи з відпустками
import { CreateDayOffData, createDayOff, DayOffType } from '@/services/dayOffService'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Label } from '@/components/Label'
import { Textarea } from '@/components/Textarea'
import { Card, CardContent } from '@/components/Card'

const CreateDayOffScreen = () => {
	const [formData, setFormData] = useState<CreateDayOffData>({
		startDate: dayjs().format('YYYY-MM-DD'),
		endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
		reason: '',
		type: DayOffType.VACATION
	})

	const router = useRouter()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleInputChange = (field: keyof CreateDayOffData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async () => {
		if (!validateForm()) return

		try {
			setLoading(true)
			const token = await AsyncStorage.getItem('auth_token')
			if (!token) {
				throw new Error('Authentication token not found.')
			}

			// Використовуємо сервіс для створення відпустки
			const response = await createDayOff(formData)

			Alert.alert('Success', 'Day off created successfully!')
			console.log(response)
			router.push('/')
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to create day off.'
			setError(typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred.')
			Alert.alert(
				'Error',
				typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred.'
			)
		} finally {
			setLoading(false)
		}
	}

	const validateForm = (): boolean => {
		const { startDate, endDate, type } = formData

		if (!startDate || !endDate || !type) {
			setError('All fields are required.')
			return false
		}

		if (new Date(startDate) > new Date(endDate)) {
			setError('Start date must be before or equal to end date.')
			return false
		}

		setError(null)
		return true
	}

	return (
		<View style={styles.container}>
			<Text className="text-2xl font-bold text-center mb-6">Create Day Off</Text>

			{error && typeof error === 'string' && (
				<Text className="text-destructive mb-4 text-center">{error}</Text>
			)}

			<View className="mb-4">
				<Label
					htmlFor="startDate"
					className="mb-2"
				>
					Start Date
				</Label>
				<Input
					id="startDate"
					value={formData.startDate}
					onChangeText={(value) => handleInputChange('startDate', value)}
					keyboardType="default"
					className="bg-background"
					placeholder="YYYY-MM-DD"
				/>
			</View>

			<View className="mb-4">
				<Label
					htmlFor="endDate"
					className="mb-2"
				>
					End Date
				</Label>
				<Input
					id="endDate"
					value={formData.endDate}
					onChangeText={(value) => handleInputChange('endDate', value)}
					keyboardType="default"
					className="bg-background"
					placeholder="YYYY-MM-DD"
				/>
			</View>

			<View className="mb-4">
				<Label
					htmlFor="type"
					className="mb-2"
				>
					Type of Leave
				</Label>
				<View className="flex-row border border-border rounded-md overflow-hidden">
					<TouchableOpacity
						className={`flex-1 p-3 items-center ${
							formData.type === DayOffType.VACATION ? 'bg-primary' : 'bg-background'
						}`}
						onPress={() => handleInputChange('type', DayOffType.VACATION)}
					>
						<Text
							className={`${
								formData.type === DayOffType.VACATION
									? 'text-primary-foreground font-semibold'
									: 'text-foreground'
							}`}
						>
							Vacation
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`flex-1 p-3 items-center ${
							formData.type === DayOffType.SICK_LEAVE ? 'bg-destructive' : 'bg-background'
						}`}
						onPress={() => handleInputChange('type', DayOffType.SICK_LEAVE)}
					>
						<Text
							className={`${
								formData.type === DayOffType.SICK_LEAVE
									? 'text-destructive-foreground font-semibold'
									: 'text-foreground'
							}`}
						>
							Sick Leave
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View className="mb-4">
				<Label
					htmlFor="reason"
					className="mb-2"
				>
					Reason (Optional)
				</Label>
				<Textarea
					id="reason"
					value={formData.reason}
					onChangeText={(value) => handleInputChange('reason', value)}
					className="bg-background"
					placeholder="Enter your reason here"
				/>
			</View>

			<Button
				variant="default"
				onPress={handleSubmit}
				className="mt-6 bg-primary"
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="white" />
				) : (
					<Text className="text-primary-foreground">Submit</Text>
				)}
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		backgroundColor: '#f5f5f5'
	}
})

export default CreateDayOffScreen
