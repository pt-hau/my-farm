export const STARTING_COINS = 500
export const ADOPT_COST = 200
export const MAX_BABIES = 2
export const FEED_COST = 10

/** Chiều rộng hiển thị của nhân vật, giữ đúng tỉ lệ ảnh so với nhân vật mặc định. */
export function characterWidth(baseWidth: number, ar: number): number {
  return Math.round((baseWidth * ar) / 0.4964)
}
