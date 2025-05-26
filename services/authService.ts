import api from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResponse {
  access_token: string;
  user: {
    uuid: string;
    email: string;
    fullName?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

/**
 * Авторизація користувача
 */
export const login = async (loginData: LoginData) => {
  const { data } = await api.post<AuthResponse>('/auth/login', loginData);

  // Зберігаємо токен в AsyncStorage
  if (data.access_token) {
    await AsyncStorage.setItem('auth_token', data.access_token);
    // Встановлюємо токен для всіх наступних запитів
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
  }

  return data;
};

/**
 * Реєстрація нового користувача
 */
export const register = async (registerData: RegisterData) => {
  const { data } = await api.post<AuthResponse>('/auth/register', registerData);

  // Зберігаємо токен в AsyncStorage, якщо він повертається при реєстрації
  if (data.access_token) {
    await AsyncStorage.setItem('auth_token', data.access_token);
    // Встановлюємо токен для всіх наступних запитів
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
  }

  return data;
};

/**
 * Вихід користувача
 */
export const logout = async () => {
  // Видаляємо токен з AsyncStorage
  await AsyncStorage.removeItem('auth_token');
  // Видаляємо токен з заголовків запитів
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Перевірка, чи авторизований користувач
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('auth_token');
  return !!token;
};

/**
 * Отримання токену авторизації
 */
export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

/**
 * Встановлення токену авторизації для API запитів
 */
export const setupAuthToken = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  return false;
};
