/** Giftcode và phần thưởng. Giữ nguyên 2 mã gốc (xu), thêm mã bản sen đá tặng ngọc. */
export const GIFT_CODES: Record<string, { coins: number; gems: number }> = {
  PHUONG1K: { coins: 1000, gems: 0 },
  PHUONGXAUXI: { coins: 5000, gems: 0 },
  SENDA2026: { coins: 0, gems: 10 },
}
