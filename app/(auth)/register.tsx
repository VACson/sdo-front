import React, { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'expo-router'

// Імпортуємо сервіс для роботи з аутентифікацією
import { register as registerUser, RegisterData } from '@/services/authService'

// Імпортуємо компоненти з shadcn/ui
import { Text } from '@/components/Text'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Label } from '@/components/Label'

export default function RegisterScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm({
		mode: 'onChange' // Валідація при зміні
	})

	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [apiError, setApiError] = useState<string | null>(null)
	const [networkError, setNetworkError] = useState<boolean>(false)

	const password = watch('password')

	const onSubmit = async (data: any) => {
		setLoading(true)
		setApiError(null)
		setNetworkError(false)

		try {
			if (data.password !== data.confirmPassword) {
				throw new Error('Паролі не співпадають.')
			}

			// Використовуємо сервіс для реєстрації
			const response = await registerUser({
				email: data.email,
				password: data.password,
				fullName: data.fullName
			})

			if (response.access_token) {
				router.push('/')
			} else {
				router.push('/login')
			}
		} catch (error: any) {
			if (error.response) {
				// Помилка від сервера з відповіддю
				if (error.response.status === 409) {
					setApiError('Користувач з таким email вже існує. Спробуйте інший email або увійдіть.')
				} else if (error.response.data && error.response.data.message) {
					setApiError(error.response.data.message)
				} else {
					setApiError(`Помилка сервера (${error.response.status}). Спробуйте пізніше.`)
				}
			} else if (error.request) {
				// Запит був зроблений, але відповіді не отримано
				// setNetworkError(true)
			} else {
				// Щось пішло не так при налаштуванні запиту або це локальна помилка
				setApiError(error.message || 'Виникла неочікувана помилка. Спробуйте пізніше.')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text className="text-center mb-5 font-bold text-2xl">Реєстрація</Text>

			{networkError && (
				<View className="mb-4 p-4 bg-destructive/10 rounded-md border border-destructive">
					<Text className="font-semibold text-destructive">Помилка мережі</Text>
					<Text className="text-destructive">
						Не вдалося з'єднатися з сервером. Перевірте підключення до інтернету та спробуйте знову.
					</Text>
				</View>
			)}

			{apiError && (
				<View className="mb-4 p-4 bg-destructive/10 rounded-md border border-destructive">
					<Text className="font-semibold text-destructive">Помилка реєстрації</Text>
					<Text className="text-destructive">{apiError}</Text>
				</View>
			)}

			{/* Full Name */}
			<View className="mb-4">
				<Label
					htmlFor="fullName"
					className="mb-2"
				>
					Повне ім'я
				</Label>
				<Controller
					control={control}
					name="fullName"
					defaultValue=""
					rules={{
						required: "Ім'я обов'язкове",
						minLength: { value: 2, message: "Ім'я повинно містити щонайменше 2 символи" }
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							id="fullName"
							placeholder="Введіть ваше повне ім'я"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value || ''}
							className="bg-background"
						/>
					)}
				/>
				{errors.fullName && (
					<Text className="text-destructive mt-1 text-sm">
						{errors.fullName?.message as string}
					</Text>
				)}
			</View>

			{/* Email */}
			<View className="mb-4">
				<Label
					htmlFor="email"
					className="mb-2"
				>
					Email
				</Label>
				<Controller
					control={control}
					name="email"
					defaultValue=""
					rules={{
						required: "Email обов'язковий",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'Невірний формат email'
						}
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							id="email"
							placeholder="Введіть ваш email"
							keyboardType="email-address"
							autoCapitalize="none"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value || ''}
							className="bg-background"
						/>
					)}
				/>
				{errors.email && (
					<Text className="text-destructive mt-1 text-sm">{errors.email?.message as string}</Text>
				)}
			</View>

			{/* Password */}
			<View className="mb-4">
				<Label
					htmlFor="password"
					className="mb-2"
				>
					Пароль
				</Label>
				<Controller
					control={control}
					name="password"
					defaultValue=""
					rules={{
						required: "Пароль обов'язковий",
						minLength: { value: 6, message: 'Пароль повинен містити щонайменше 6 символів' }
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							id="password"
							placeholder="Введіть ваш пароль"
							secureTextEntry
							onBlur={onBlur}
							onChangeText={onChange}
							value={value || ''}
							className="bg-background"
						/>
					)}
				/>
				{errors.password && (
					<Text className="text-destructive mt-1 text-sm">
						{errors.password?.message as string}
					</Text>
				)}
			</View>

			{/* Confirm Password */}
			<View className="mb-4">
				<Label
					htmlFor="confirmPassword"
					className="mb-2"
				>
					Підтвердження паролю
				</Label>
				<Controller
					control={control}
					name="confirmPassword"
					defaultValue=""
					rules={{
						required: "Підтвердження паролю обов'язкове",
						validate: (value) => value === password || 'Паролі не співпадають'
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							id="confirmPassword"
							placeholder="Підтвердіть ваш пароль"
							secureTextEntry
							onBlur={onBlur}
							onChangeText={onChange}
							value={value || ''}
							className="bg-background"
						/>
					)}
				/>
				{errors.confirmPassword && (
					<Text className="text-destructive mt-1 text-sm">
						{errors.confirmPassword?.message as string}
					</Text>
				)}
			</View>

			<Button
				variant="default"
				onPress={handleSubmit(onSubmit)}
				className="mt-2 bg-primary"
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="white" />
				) : (
					<Text className="text-primary-foreground">Зареєструватися</Text>
				)}
			</Button>

			<View className="mt-4 flex-row justify-center">
				<Text className="text-muted-foreground">Вже маєте обліковий запис? </Text>
				<Text
					className="text-primary font-medium"
					onPress={() => router.push('/login')}
				>
					Увійти
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#f5f5f5'
	}
})
