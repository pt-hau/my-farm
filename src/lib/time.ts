import type { SkyKind, TimeOfDay } from '../types'

/** `minutes` là phút trong ngày, 0-1439. Ngưỡng giờ giữ nguyên bản gốc. */
export function getTimeOfDay(minutes: number): TimeOfDay {
  if (minutes >= 300 && minutes < 420) {
    return { label: 'Bình minh', emoji: '☀️', icon: '🌅', sky: 'dawn' }
  }
  if (minutes >= 420 && minutes < 660) {
    return { label: 'Sáng', emoji: '☀️', icon: '🌤️', sky: 'day' }
  }
  if (minutes >= 660 && minutes < 780) {
    return { label: 'Trưa', emoji: '☀️', icon: '☀️', sky: 'day' }
  }
  if (minutes >= 780 && minutes < 1020) {
    return { label: 'Chiều', emoji: '☀️', icon: '🌤️', sky: 'day' }
  }
  if (minutes >= 1020 && minutes < 1170) {
    return { label: 'Hoàng hôn', emoji: '🌇', icon: '🌇', sky: 'dusk' }
  }
  return { label: 'Đêm', emoji: '🌙', icon: '🌙', sky: 'night' }
}

export function skyGradient(minutes: number): string {
  const sky = getTimeOfDay(minutes).sky
  if (sky === 'dawn') {
    return 'linear-gradient(180deg, #ff9a8a 0%, #ffd6a8 38%, #ffecd2 70%, #fef9e7 100%)'
  }
  if (sky === 'dusk') {
    return 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 28%, #ffcf9a 62%, #2a2a4a 100%)'
  }
  if (sky === 'night') {
    return 'linear-gradient(180deg, #1d2a4a 0%, #0f1c3a 45%, #2a4a6a 80%, #1a2f4a 100%)'
  }
  return 'linear-gradient(180deg, #bfeaff 0%, #d6f0ff 28%, #fef9e7 68%, #e0f2c2 100%)'
}

export interface SunMoonPosition {
  x: number
  top: number
  bottom: number
  isMoon: boolean
}

/** Vị trí mặt trời/mặt trăng di chuyển theo giờ trong ngày. */
export function sunMoonPosition(minutes: number): SunMoonPosition {
  if (minutes >= 300 && minutes <= 1170) {
    const d = (minutes - 300) / 870
    return {
      x: 5 + d * 90,
      top: 24 - Math.sin(d * Math.PI) * 20,
      bottom: 6 + Math.sin(d * Math.PI) * 58,
      isMoon: false,
    }
  }
  const d = minutes >= 1170 ? (minutes - 1170) / 570 : (minutes + 270) / 570
  return {
    x: 5 + d * 90,
    top: 24 - Math.sin(d * Math.PI) * 18,
    bottom: 6 + Math.sin(d * Math.PI) * 58,
    isMoon: true,
  }
}

/** Lớp phủ màu theo buổi, đặt trên nền trời. */
export function overlayTint(sky: SkyKind, hour: number): string {
  if (sky === 'dusk') return 'rgba(255,126,95,0.15)'
  if (sky === 'dawn') return 'rgba(255,154,138,0.12)'
  if (sky === 'night') return 'rgba(12,22,52,0.30)'
  if (sky === 'day' && hour >= 11 && hour <= 13) return 'rgba(255,255,255,0.06)'
  return 'rgba(255,255,255,0)'
}

export function formatClock(minutes: number): string {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
