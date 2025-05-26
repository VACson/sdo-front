import api from '@/utils/api';

export enum DayOffType {
  VACATION = 'VACATION',
  SICK_LEAVE = 'SICK_LEAVE'
}

export interface DayOff {
  uuid: string;
  startDate: string;
  endDate: string;
  reason: string;
  isApproved: boolean;
  type: DayOffType;
  user: { fullName: string };
}

export interface CreateDayOffData {
  startDate: string;
  endDate: string;
  reason: string;
  type: DayOffType;
}

/**
 * Отримує список відпусток за вказаний період
 */
export const getDayOffs = async (startDate?: string, endDate?: string) => {
  const params: Record<string, string> = {};

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data } = await api.get<DayOff[]>('/day-offs', { params });
  return data;
};

/**
 * Отримує список відпусток для конкретної дати
 */
export const getDayOffsByDate = async (targetDate: string) => {
  const { data } = await api.get<DayOff[]>('/day-offs', {
    params: { targetDate }
  });
  return data;
};

/**
 * Створює нову відпустку
 */
export const createDayOff = async (dayOffData: CreateDayOffData) => {
  const { data } = await api.post<DayOff>('/day-offs', dayOffData);
  return data;
};

/**
 * Оновлює існуючу відпустку
 */
export const updateDayOff = async (uuid: string, dayOffData: Partial<CreateDayOffData>) => {
  const { data } = await api.patch<DayOff>(`/day-offs/${uuid}`, dayOffData);
  return data;
};

/**
 * Видаляє відпустку
 */
export const deleteDayOff = async (uuid: string) => {
  await api.delete(`/day-offs/${uuid}`);
}; 