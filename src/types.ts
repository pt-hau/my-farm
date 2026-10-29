import type { ReactNode } from 'react'

/* ================= Sen đá / xương rồng ================= */

export type SpeciesKey =
  | 'pearl'
  | 'zebra'
  | 'bunnyEar'
  | 'blackPrince'
  | 'columnar'
  | 'perle'
  | 'moonstone'
  | 'gymnoPurple'
  | 'lola'
  | 'mammillaria'
  | 'topsy'
  | 'lithops'
  | 'astro'
  | 'monilaria'
  | 'goldenBarrel'
  | 'rainbow'
  | 'gymnoVar'
  | 'cooperi'
  | 'lithopsRubra'
  | 'onzuka'

export type Tier = 'common' | 'fair' | 'rare' | 'vip'

export type BugType = 'mealybug' | 'spider' | 'ladybug' | 'snail'

/** Biến thể của một cây: thường, đột biến thường (hiếm), đột biến hiếm (rất rất hiếm). */
export type VariantKind = 'normal' | 'common' | 'rare'

/** Kiểu biến thể: var lá, màu lá, crest (mào) ở đỉnh. */
export type VariantTrait = 'var' | 'color' | 'crest'

export interface Species {
  key: SpeciesKey
  name: string
  latin: string
  tier: Tier
  img: string
  icon: string
  /** Giá 1 hạt giống (xu). */
  seedPrice: number
  /** Giá 1 cây giống thường (xu). */
  seedlingPrice: number
  /** Tỉ lệ nảy mầm của hạt (0-1). */
  germRate: number
  /** Tỉ lệ đột biến thường khi nảy mầm thành công (0-1). */
  mutCommonRate: number
  /** Tỉ lệ đột biến hiếm khi nảy mầm thành công (0-1). */
  mutRareRate: number
  /** Giá bán theo đơn của cây thường trưởng thành (xu). */
  sellPrice: number
  /** Thời gian chờ nảy mầm (giây). */
  germSeconds: number
  /** Thời gian ươm thành cây con sau khi nảy mầm (giây). */
  nurserySeconds: number
  /** Thời gian chăm sóc tới trưởng thành (giây). */
  careSeconds: number
  /** Loại bọ đậu riêng của loài này. */
  bug: BugType
}

export type SpeciesMap = Record<SpeciesKey, Species>

/** Một cây đang sống trong vườn (chăm sóc / trưng bày / bảo quản). */
export interface PlantInstance {
  id: string
  species: SpeciesKey
  variant: VariantKind
  trait: VariantTrait | null
  /** Đã trưởng thành chưa. */
  mature: boolean
  /** Mốc giờ thực (ms) khi cây trưởng thành. Chỉ có nghĩa khi chưa trưởng thành. */
  readyAt: number
  /** Tổng thời gian chăm sóc (ms) đã tính chiết khấu chậu lúc trồng. */
  totalMs: number
  /** Thời gian còn lại (ms) lúc bị bọ đậu làm ngừng lớn. */
  remainingMs: number
  /** Bọ đang đậu (nếu có) thì cây ngừng lớn. */
  bug: BugType | null
  /** Mốc giờ thực (ms) lần bọ tiếp theo có thể xuất hiện. */
  nextBugAt: number
  /** Nguồn gốc cây: gieo hạt, mua cây giống, ươm lá. */
  source: 'seed' | 'seedling' | 'leaf'
}

export interface SowSlot {
  id: number
  seed: SpeciesKey | null
  phase: 'empty' | 'germinating' | 'sprouted' | 'failed'
  /** Mốc nảy mầm (ms). */
  germinateAt: number
  /** Mốc cây con sẵn sàng chuyển (ms). */
  readyAt: number
  /** Kết quả đã quay lúc gieo, chỉ lộ khi tới mốc tương ứng. */
  willGerminate: boolean
  variant: VariantKind
  trait: VariantTrait | null
}

export type PotTierId = 'clay' | 'copper' | 'silver' | 'gold' | 'jade' | 'diamond'

export interface PotTier {
  id: PotTierId
  name: string
  /** Tỉ lệ giảm thời gian chăm sóc (0-0.4). */
  bonus: number
  /** Giá nâng cấp lên bậc này từ bậc trước (xu + bọ). Chậu Đất mặc định miễn phí. */
  coins: number
  bugs: number
  /** Màu chậu (gradient CSS). */
  colors: [string, string]
}

export interface CareSlot {
  id: number
  plant: PlantInstance | null
  pot: PotTierId
}

export interface DisplaySlot {
  id: number
  plant: PlantInstance | null
  /** Số lá đã rụng chờ thu (tối đa 3). */
  leavesReady: number
  /** Mốc rụng lá tiếp theo (ms), chỉ chạy khi cây đã trưởng thành. */
  leafNextAt: number
}

export interface StorageSlot {
  id: number
  /** Chỉ cây trưởng thành mới được đưa vào bảo quản. */
  plant: PlantInstance | null
}

/** Một chiếc lá đã thu, chờ đem ươm. */
export interface LeafItem {
  id: string
  species: SpeciesKey
  variant: VariantKind
  trait: VariantTrait | null
}

export interface LeafSlot {
  id: number
  leaf: LeafItem | null
  /** Mốc cây giống sẵn sàng (ms). */
  readyAt: number
  willGerminate: boolean
  variant: VariantKind
  trait: VariantTrait | null
  /** Lá ươm hỏng (hết thời gian mà không nảy mầm). */
  failed: boolean
}

export type AreaId = 'sow' | 'care' | 'display' | 'storage' | 'leaf'

export type NetId = 'tre' | 'bac' | 'vang'

export interface Net {
  id: NetId
  name: string
  price: number
  /** Hệ số bọ thưởng khi bắt. */
  mult: number
}

export interface DecorItem {
  id: string
  name: string
  icon: string
  price: number
  desc: string
}

export type OrderVariantReq = 'any' | 'common' | 'rare'

export interface Order {
  id: string
  species: SpeciesKey
  variantReq: OrderVariantReq
  qty: number
  /** Tổng xu thưởng khi giao đủ (đã gồm 20% thưởng đơn). */
  reward: number
  /** Mốc hết hạn (ms). */
  expiresAt: number
}

export interface DailyStats {
  sown: number
  caught: number
  sold: number
}

export interface DailyState {
  /** Ngày (toDateString) của bộ số liệu này. */
  date: string
  stats: DailyStats
  /** Id nhiệm vụ đã nhận thưởng trong ngày. */
  claimed: number[]
  /** Số lượt quay miễn phí còn lại hôm nay. */
  spinsLeft: number
  /** Ngày đã nạp lại kho cây đột biến thường trong cửa hàng. */
  mutantStockDate: string
  /** Số lượng còn lại của 3 cây đột biến thường trong cửa hàng, theo key loài. */
  mutantStock: Record<string, number>
}

export interface WheelPrize {
  id: string
  label: string
  emoji: string
  weight: number
  color: string
}

/* ================= Hệ cũ giữ lại: bé, nhân vật, giftcode ================= */

export interface BabyType {
  type: string
  name: string
  trait: string
  img: string
  desc: string
}

export interface Baby {
  id: string
  type: string
  name: string
  trait: string
  img: string
  pos: { x: number; y: number }
  dir: 1 | -1
  hunger: number
  happy: number
  poop: boolean
  crying: boolean
  growth: number
}

export type BabySave = Omit<Baby, 'img'>

export interface GameCharacter {
  id: string
  name: string
  tag: string
  desc: string
  price: number
  img: string
  ar: number
}

export interface Mission {
  id: number
  text: string
  done: boolean
  claimed: boolean
  progressLabel: string
  rewardLabel: string
}

export type SkyKind = 'dawn' | 'day' | 'dusk' | 'night'

export interface TimeOfDay {
  label: string
  emoji: string
  icon: string
  sky: SkyKind
}

export interface FloatingText {
  id: number
  x: number
  y: number
  text: string
}

/** Toàn bộ state lưu xuống localStorage (key mới của bản sen đá). */
export interface SaveState {
  ver: number
  date: string
  P: number
  v: boolean
  r: number
  bugs: number
  gems: number
  H: number
  s: number
  seeds: Record<SpeciesKey, number>
  sow: SowSlot[]
  care: CareSlot[]
  display: DisplaySlot[]
  storage: StorageSlot[]
  leafSlots: LeafSlot[]
  leaves: LeafItem[]
  decor: string[]
  nets: NetId[]
  orders: Order[]
  daily: DailyState
  counts: Record<AreaId, number>
  wf: BabySave[]
  ze: number
  E3: string | null
  ch: string
  ow: string[]
  codes: string[]
  soldTotal: number
  mutantSeen: boolean
}

export type { ReactNode }
