/**
 * Утиліти для роботи з бейджами
 */

/**
 * Повертає варіант бейджа в залежності від типу відпустки
 */
export const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'VACATION':
      return 'destructive' // червоний для відпустки
    case 'SICK_LEAVE':
      return 'secondary' // використовуємо secondary для лікарняного
    case 'OTHER':
      return 'outline'
    default:
      return 'default'
  }
}

/**
 * Повертає клас кольору для бейджа в залежності від типу відпустки
 */
export const getBadgeColorClass = (type: string) => {
  switch (type) {
    case 'VACATION':
      return 'bg-red-500 hover:bg-red-600' // червоний для відпустки
    case 'SICK_LEAVE':
      return 'bg-orange-500 hover:bg-orange-600' // помаранчевий для лікарняного
    case 'OTHER':
      return 'bg-blue-500 hover:bg-blue-600'
    default:
      return 'bg-gray-500 hover:bg-gray-600'
  }
} 