import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm()
	const router = useRouter()

	const onSubmit = async (data: any) => {
		try {
			const response = await axios.post('http://localhost:8000/auth/login', {
				email: data.email,
				password: data.password
			})

			const token = response.data.access_token

			if (token) {
				await AsyncStorage.setItem('auth_token', token)

				axios.defaults.headers['Authorization'] = `Bearer ${token}`
				router.push('/')
			}
		} catch (error) {
			// TODO
		}
	}

	return (
		<View style={styles.container}>
			<Text
				variant="headlineMedium"
				style={styles.title}
			>
				Login
			</Text>

			<Controller
				control={control}
				name="email"
				defaultValue=""
				rules={{ required: 'Email is required' }}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						label="Email"
						keyboardType="email-address"
						autoCapitalize="none"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value || ''}
						style={styles.input}
					/>
				)}
			/>
			{errors.email && (
				<Text style={styles.error}>
					{errors.email?.message && (
						<Text style={styles.error}>{String(errors.email.message)}</Text>
					)}
				</Text>
			)}

			<Controller
				control={control}
				name="password"
				defaultValue=""
				rules={{ required: 'Password is required' }}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						label="Password"
						secureTextEntry
						onBlur={onBlur}
						onChangeText={onChange}
						value={value || ''}
						style={styles.input}
					/>
				)}
			/>
			{errors.password && (
				<Text style={styles.error}>
					{errors.password?.message && (
						<Text style={styles.error}>{String(errors.password.message)}</Text>
					)}
				</Text>
			)}

			<Button
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				style={styles.button}
			>
				Login
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 20 },
	title: { textAlign: 'center', marginBottom: 20 },
	input: { marginBottom: 10 },
	button: { marginTop: 10 },
	error: { color: 'red', marginBottom: 10 }
})
