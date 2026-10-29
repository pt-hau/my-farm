import { CHARACTERS } from '../data/characters'
import type { SaveState } from '../types'

export const SAVE_KEY = 'vuonSenDa_save_v1'
export const LEGACY_SAVE_KEY = 'nuoiPhuong_save_v1'

export function writeSave(data: SaveState): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadSave(): Partial<SaveState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    return data as Partial<SaveState>
  } catch {
    return null
  }
}

/**
 * Đọc save cũ (bản rau củ) để chuyển xu, XP, cấp, nhân vật, giftcode,
 * các bé và tùy chọn tiếng sang bản sen đá lần đầu mở game. Vườn rau cũ
 * không chuyển sang vì các loại cây cũ đã bỏ theo yêu cầu.
 */
export function loadLegacySave(): {
  coins?: number
  xp?: number
  level?: number
  soundOn?: boolean
  ownedCharacters?: string[]
  characterId?: string
  usedCodes?: string[]
  babies?: SaveState['wf']
} {
  try {
    const raw = localStorage.getItem(LEGACY_SAVE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Record<string, unknown>
    const owned = Array.isArray(data.ow)
      ? (data.ow as unknown[]).filter(
          (id): id is string =>
            typeof id === 'string' && CHARACTERS.some((c) => c.id === id),
        )
      : []
    if (!owned.includes('default')) owned.unshift('default')
    const characterId =
      typeof data.ch === 'string' && owned.includes(data.ch) ? data.ch : 'default'
    return {
      coins: typeof data.r === 'number' && Number.isFinite(data.r) ? data.r : undefined,
      xp: typeof data.H === 'number' && Number.isFinite(data.H) ? data.H : undefined,
      level: typeof data.s === 'number' && Number.isFinite(data.s) ? data.s : undefined,
      soundOn: data.v === false ? false : undefined,
      ownedCharacters: owned,
      characterId,
      usedCodes: Array.isArray(data.codes)
        ? (data.codes as unknown[]).filter((c): c is string => typeof c === 'string')
        : undefined,
      babies: Array.isArray(data.wf) ? (data.wf as SaveState['wf']) : undefined,
    }
  } catch {
    return {}
  }
}

export function savedNumber(
  saved: Partial<SaveState> | null | undefined,
  key: 'r' | 'bugs' | 'gems' | 'H' | 's' | 'ze' | 'soldTotal' | 'P',
  fallback: number,
): number {
  if (!saved) return fallback
  const value = saved[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}
