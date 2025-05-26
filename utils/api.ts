import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Отримуємо URL API з змінних середовища
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';

// Створюємо екземпляр axios з базовим URL
const api = axios.create({
  baseURL: API_URL,
});

// Додаємо інтерцептор для автоматичного додавання токену до заголовків
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Експортуємо API URL для використання в інших місцях
export const apiUrl = API_URL;

// Експортуємо екземпляр axios за замовчуванням
export default api; 