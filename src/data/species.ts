import type {
  BugType,
  DecorItem,
  Net,
  PotTier,
  Species,
  SpeciesMap,
  Tier,
  WheelPrize,
} from '../types'
import astroImg from '../assets/images/species/astro.png'
import blackPrinceImg from '../assets/images/species/blackPrince.png'
import bunnyEarImg from '../assets/images/species/bunnyEar.png'
import columnarImg from '../assets/images/species/columnar.png'
import cooperiImg from '../assets/images/species/cooperi.png'
import goldenBarrelImg from '../assets/images/species/goldenBarrel.png'
import gymnoPurpleImg from '../assets/images/species/gymnoPurple.png'
import gymnoVarImg from '../assets/images/species/gymnoVar.png'
import lithopsImg from '../assets/images/species/lithops.png'
import lithopsRubraImg from '../assets/images/species/lithopsRubra.png'
import lolaImg from '../assets/images/species/lola.png'
import mammillariaImg from '../assets/images/species/mammillaria.png'
import monilariaImg from '../assets/images/species/monilaria.png'
import moonstoneImg from '../assets/images/species/moonstone.png'
import onzukaImg from '../assets/images/species/onzuka.png'
import pearlImg from '../assets/images/species/pearl.png'
import perleImg from '../assets/images/species/perle.png'
import rainbowImg from '../assets/images/species/rainbow.png'
import topsyImg from '../assets/images/species/topsy.png'
import zebraImg from '../assets/images/species/zebra.png'
import ladybugImg from '../assets/images/bugs/ladybug.png'
import mealybugImg from '../assets/images/bugs/mealybug.png'
import snailImg from '../assets/images/bugs/snail.png'
import spiderImg from '../assets/images/bugs/spider.png'

/**
 * Bảng 20 loài sen đá / xương rồng. Thứ tự key = thứ tự ô trong bảng sprite
 * chibi đã cắt, không đổi.
 *
 * Thời gian: tổng thời gian gieo + sinh trưởng của cây cùi nhất là 3 phút,
 * cây VIP nhất là 7 tiếng, tăng dần theo độ VIP, chia theo tỉ lệ
 * chờ nảy mầm / ươm / chăm sóc khoảng 10% / 20% / 70%.
 * Tỉ lệ nảy mầm giảm dần theo độ xịn; tỉ lệ đột biến hiếm giảm thêm theo
 * độ VIP (0,5% → 0,4% → 0,3% → 0,1%).
 * Giá bán theo đơn của cây thường; biến thể thường ×3, biến thể hiếm ×10,
 * bán sỉ bằng 60% giá theo đơn — để hạt vẫn có lãi kỳ vọng dù tỉ lệ
 * nảy mầm thấp (xem `expectedSeedValue`).
 */
export const SPECIES: SpeciesMap = {
  pearl: {
    key: 'pearl', name: 'Sen đá chuỗi ngọc', latin: 'Sedum morganianum', tier: 'common',
    img: pearlImg, icon: '🌿', seedPrice: 20, seedlingPrice: 60, germRate: 0.85,
    mutCommonRate: 0.08, mutRareRate: 0.005, sellPrice: 100,
    germSeconds: 20, nurserySeconds: 30, careSeconds: 130, bug: 'ladybug',
  },
  zebra: {
    key: 'zebra', name: 'Sen đá móng rồng', latin: 'Haworthia attenuata', tier: 'common',
    img: zebraImg, icon: '🌿', seedPrice: 25, seedlingPrice: 70, germRate: 0.85,
    mutCommonRate: 0.08, mutRareRate: 0.005, sellPrice: 120,
    germSeconds: 25, nurserySeconds: 35, careSeconds: 175, bug: 'spider',
  },
  bunnyEar: {
    key: 'bunnyEar', name: 'Xương rồng tai thỏ', latin: 'Opuntia microdasys', tier: 'common',
    img: bunnyEarImg, icon: '🌵', seedPrice: 30, seedlingPrice: 80, germRate: 0.85,
    mutCommonRate: 0.08, mutRareRate: 0.005, sellPrice: 130,
    germSeconds: 30, nurserySeconds: 45, careSeconds: 230, bug: 'snail',
  },
  blackPrince: {
    key: 'blackPrince', name: 'Sen đá nâu', latin: "Echeveria 'Black Prince'", tier: 'common',
    img: blackPrinceImg, icon: '🌿', seedPrice: 30, seedlingPrice: 90, germRate: 0.85,
    mutCommonRate: 0.08, mutRareRate: 0.005, sellPrice: 140,
    germSeconds: 35, nurserySeconds: 60, careSeconds: 300, bug: 'ladybug',
  },
  columnar: {
    key: 'columnar', name: 'Xương rồng trụ xanh', latin: 'Cereus peruvianus', tier: 'common',
    img: columnarImg, icon: '🌵', seedPrice: 35, seedlingPrice: 100, germRate: 0.85,
    mutCommonRate: 0.08, mutRareRate: 0.005, sellPrice: 150,
    germSeconds: 45, nurserySeconds: 75, careSeconds: 390, bug: 'snail',
  },
  perle: {
    key: 'perle', name: 'Sen đá hồng phấn', latin: "Echeveria 'Perle von Nürnberg'", tier: 'fair',
    img: perleImg, icon: '🌸', seedPrice: 60, seedlingPrice: 180, germRate: 0.75,
    mutCommonRate: 0.06, mutRareRate: 0.004, sellPrice: 280,
    germSeconds: 60, nurserySeconds: 100, careSeconds: 505, bug: 'mealybug',
  },
  moonstone: {
    key: 'moonstone', name: 'Sen đá thạch ngọc', latin: 'Pachyphytum oviferum', tier: 'fair',
    img: moonstoneImg, icon: '🌸', seedPrice: 70, seedlingPrice: 200, germRate: 0.75,
    mutCommonRate: 0.06, mutRareRate: 0.004, sellPrice: 320,
    germSeconds: 75, nurserySeconds: 130, careSeconds: 655, bug: 'mealybug',
  },
  gymnoPurple: {
    key: 'gymnoPurple', name: 'Xương rồng Gymno tím', latin: 'Gymnocalycium mihanovichii', tier: 'fair',
    img: gymnoPurpleImg, icon: '🌵', seedPrice: 80, seedlingPrice: 240, germRate: 0.75,
    mutCommonRate: 0.06, mutRareRate: 0.004, sellPrice: 360,
    germSeconds: 100, nurserySeconds: 170, careSeconds: 845, bug: 'snail',
  },
  lola: {
    key: 'lola', name: 'Sen đá hoa hồng xanh', latin: "Echeveria 'Lola'", tier: 'fair',
    img: lolaImg, icon: '🌸', seedPrice: 90, seedlingPrice: 270, germRate: 0.75,
    mutCommonRate: 0.06, mutRareRate: 0.004, sellPrice: 400,
    germSeconds: 130, nurserySeconds: 220, careSeconds: 1100, bug: 'mealybug',
  },
  mammillaria: {
    key: 'mammillaria', name: 'Xương rồng Mammillaria', latin: 'Mammillaria hahniana', tier: 'fair',
    img: mammillariaImg, icon: '🌵', seedPrice: 100, seedlingPrice: 300, germRate: 0.75,
    mutCommonRate: 0.06, mutRareRate: 0.004, sellPrice: 450,
    germSeconds: 170, nurserySeconds: 280, careSeconds: 1430, bug: 'snail',
  },
  topsy: {
    key: 'topsy', name: 'Sen đá Phật Bà', latin: "Echeveria 'Topsy Turvy'", tier: 'rare',
    img: topsyImg, icon: '🌸', seedPrice: 150, seedlingPrice: 450, germRate: 0.6,
    mutCommonRate: 0.04, mutRareRate: 0.003, sellPrice: 750,
    germSeconds: 220, nurserySeconds: 370, careSeconds: 1850, bug: 'mealybug',
  },
  lithops: {
    key: 'lithops', name: 'Sen đá đá sống', latin: 'Lithops karasmontana', tier: 'rare',
    img: lithopsImg, icon: '🪨', seedPrice: 180, seedlingPrice: 540, germRate: 0.6,
    mutCommonRate: 0.04, mutRareRate: 0.003, sellPrice: 900,
    germSeconds: 285, nurserySeconds: 475, careSeconds: 2400, bug: 'spider',
  },
  astro: {
    key: 'astro', name: 'Xương rồng Astro', latin: 'Astrophytum asterias', tier: 'rare',
    img: astroImg, icon: '🌵', seedPrice: 200, seedlingPrice: 600, germRate: 0.6,
    mutCommonRate: 0.04, mutRareRate: 0.003, sellPrice: 1000,
    germSeconds: 370, nurserySeconds: 615, careSeconds: 3115, bug: 'snail',
  },
  monilaria: {
    key: 'monilaria', name: 'Sen đá tai thỏ trắng', latin: 'Monilaria obconica', tier: 'rare',
    img: monilariaImg, icon: '🐰', seedPrice: 220, seedlingPrice: 660, germRate: 0.6,
    mutCommonRate: 0.04, mutRareRate: 0.003, sellPrice: 1100,
    germSeconds: 480, nurserySeconds: 800, careSeconds: 4040, bug: 'spider',
  },
  goldenBarrel: {
    key: 'goldenBarrel', name: 'Xương rồng cầu vàng', latin: 'Echinocactus grusonii', tier: 'rare',
    img: goldenBarrelImg, icon: '🌵', seedPrice: 250, seedlingPrice: 750, germRate: 0.6,
    mutCommonRate: 0.04, mutRareRate: 0.003, sellPrice: 1250,
    germSeconds: 620, nurserySeconds: 1035, careSeconds: 5245, bug: 'ladybug',
  },
  rainbow: {
    key: 'rainbow', name: 'Sen đá cầu vồng', latin: "Echeveria 'Rainbow'", tier: 'vip',
    img: rainbowImg, icon: '🌈', seedPrice: 400, seedlingPrice: 1200, germRate: 0.45,
    mutCommonRate: 0.03, mutRareRate: 0.001, sellPrice: 2200,
    germSeconds: 805, nurserySeconds: 1345, careSeconds: 6800, bug: 'mealybug',
  },
  gymnoVar: {
    key: 'gymnoVar', name: 'Xương rồng Gymno var vàng', latin: 'Gymnocalycium variegata', tier: 'vip',
    img: gymnoVarImg, icon: '🌵', seedPrice: 450, seedlingPrice: 1350, germRate: 0.45,
    mutCommonRate: 0.03, mutRareRate: 0.001, sellPrice: 2500,
    germSeconds: 1045, nurserySeconds: 1740, careSeconds: 8815, bug: 'ladybug',
  },
  cooperi: {
    key: 'cooperi', name: 'Sen đá ngọc trong', latin: 'Haworthia cooperi', tier: 'vip',
    img: cooperiImg, icon: '💎', seedPrice: 500, seedlingPrice: 1500, germRate: 0.45,
    mutCommonRate: 0.03, mutRareRate: 0.001, sellPrice: 2800,
    germSeconds: 1355, nurserySeconds: 2260, careSeconds: 11435, bug: 'spider',
  },
  lithopsRubra: {
    key: 'lithopsRubra', name: 'Sen đá đá sống đỏ', latin: "Lithops optica 'Rubra'", tier: 'vip',
    img: lithopsRubraImg, icon: '🪨', seedPrice: 600, seedlingPrice: 1800, germRate: 0.45,
    mutCommonRate: 0.03, mutRareRate: 0.001, sellPrice: 3400,
    germSeconds: 1755, nurserySeconds: 2925, careSeconds: 14820, bug: 'spider',
  },
  onzuka: {
    key: 'onzuka', name: 'Xương rồng Astro Onzuka var', latin: "Astrophytum 'Onzuka'", tier: 'vip',
    img: onzukaImg, icon: '🌵', seedPrice: 800, seedlingPrice: 2400, germRate: 0.45,
    mutCommonRate: 0.03, mutRareRate: 0.001, sellPrice: 4500,
    germSeconds: 2270, nurserySeconds: 3780, careSeconds: 19150, bug: 'ladybug',
  },
}

export const SPECIES_KEYS = Object.keys(SPECIES) as Species['key'][]

export const TIER_LABEL: Record<Tier, string> = {
  common: 'Phổ thông',
  fair: 'Khá',
  rare: 'Xịn',
  vip: 'VIP',
}

export const TIER_COLOR: Record<Tier, string> = {
  common: '#7fbb6a',
  fair: '#4da3ff',
  rare: '#b478e8',
  vip: '#ff9f1c',
}

/** Bốn loại bọ, mỗi loài cây chỉ có đúng một loại bọ đậu riêng. */
export const BUG_TYPES: Record<BugType, { name: string; img: string; baseReward: number; desc: string }> = {
  mealybug: { name: 'Rệp sáp trắng', img: mealybugImg, baseReward: 1, desc: 'Chậm chạp, hay đậu sen đá lá có phấn.' },
  spider: { name: 'Nhện đỏ tí hon', img: spiderImg, baseReward: 2, desc: 'Nhỏ và chạy nhanh, đậu sen đá mọng trong.' },
  ladybug: { name: 'Bọ rùa đỏ', img: ladybugImg, baseReward: 2, desc: 'Tròn vo chậm rãi, đậu sen đá dây rủ và cầu vàng.' },
  snail: { name: 'Ốc sên lá', img: snailImg, baseReward: 4, desc: 'Chậm nhất nhưng hiếm gặp, đậu xương rồng gai.' },
}

/** Thang chậu: đồng/bạc/vàng mua bằng xu; ngọc bích/kim cương nâng cấp bằng bọ + xu. */
export const POT_TIERS: PotTier[] = [
  { id: 'clay', name: 'Chậu Đất', bonus: 0, coins: 0, bugs: 0, colors: ['#c98d5e', '#8a5a35'] },
  { id: 'copper', name: 'Chậu Đồng', bonus: 0.1, coins: 300, bugs: 0, colors: ['#e09a5a', '#9a5a2a'] },
  { id: 'silver', name: 'Chậu Bạc', bonus: 0.18, coins: 800, bugs: 0, colors: ['#e8e8ee', '#9aa0ad'] },
  { id: 'gold', name: 'Chậu Vàng', bonus: 0.25, coins: 2000, bugs: 0, colors: ['#ffd76a', '#c98f1b'] },
  { id: 'jade', name: 'Chậu Ngọc Bích', bonus: 0.32, coins: 1500, bugs: 30, colors: ['#7fd8a4', '#2e8b62'] },
  { id: 'diamond', name: 'Chậu Kim Cương', bonus: 0.4, coins: 4000, bugs: 80, colors: ['#a8e6ff', '#4da3ff'] },
]

export const NETS: Net[] = [
  { id: 'tre', name: 'Vợt tre', price: 200, mult: 1 },
  { id: 'bac', name: 'Vợt bạc', price: 600, mult: 2 },
  { id: 'vang', name: 'Vợt vàng', price: 1500, mult: 3 },
]

export const DECOR_ITEMS: DecorItem[] = [
  { id: 'curtain', name: 'Rèm hoa', icon: '🎀', price: 300, desc: 'Rèm hoa treo trước giàn trưng bày.' },
  { id: 'hook', name: 'Móc treo', icon: '🪝', price: 200, desc: 'Móc treo chậu lủng lẳng xinh xắn.' },
  { id: 'lantern', name: 'Đèn lồng', icon: '🏮', price: 400, desc: 'Đèn lồng ấm áp cho vườn treo ban đêm.' },
  { id: 'vine', name: 'Dây leo', icon: '🌿', price: 250, desc: 'Dây leo xanh phủ quanh giàn treo.' },
  { id: 'hangingPot', name: 'Chậu treo hoa', icon: '🪴', price: 350, desc: 'Chậu hoa treo trang trí, chỉ để đẹp.' },
]

/** Cây đột biến thường bán trong cửa hàng: chỉ 3 loài, mỗi loài 1 cây/ngày. */
export const SHOP_MUTANT_KEYS: Species['key'][] = ['pearl', 'zebra', 'bunnyEar']

/** Thời gian rụng 1 lá ở khu trưng bày (giây), theo độ VIP của cây. */
export function leafDropSeconds(tier: Tier): number {
  if (tier === 'vip') return 7200
  if (tier === 'rare') return 3600
  if (tier === 'fair') return 1800
  return 900
}

/** Hệ số giá bán theo biến thể. */
export function variantMult(variant: 'normal' | 'common' | 'rare'): number {
  return variant === 'rare' ? 10 : variant === 'common' ? 3 : 1
}

/** Giá bán theo đơn = giá gốc × hệ số biến thể. */
export function orderPriceOf(species: Species, variant: 'normal' | 'common' | 'rare'): number {
  return species.sellPrice * variantMult(variant)
}

/** Giá bán sỉ = 60% giá theo đơn. */
export function wholesalePriceOf(species: Species, variant: 'normal' | 'common' | 'rare'): number {
  return Math.floor(orderPriceOf(species, variant) * 0.6)
}

/** Giá trị kỳ vọng của 1 hạt gieo (để kiểm tra hạt vẫn có lãi dù tỉ lệ nảy mầm thấp). */
export function expectedSeedValue(species: Species): number {
  const avgMult =
    1 * (1 - species.mutCommonRate - species.mutRareRate) +
    3 * species.mutCommonRate +
    10 * species.mutRareRate
  return Math.round(species.germRate * species.sellPrice * avgMult)
}

/** Tổng thời gian gieo + sinh trưởng (giây). */
export function totalSeconds(species: Species): number {
  return species.germSeconds + species.nurserySeconds + species.careSeconds
}

/** Viết gọn thời lượng giây: "45s", "3 phút", "1 giờ 8 phút", "7 giờ". */
export function formatDuration(totalSecondsValue: number): string {
  const s = Math.max(0, Math.round(totalSecondsValue))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  if (m < 60) return rem === 0 ? `${m} phút` : `${m} phút ${rem}s`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm === 0 ? `${h} giờ` : `${h} giờ ${mm} phút`
}

/** Đếm ngược còn lại tới một mốc ms: "2 phút 10s", "1 giờ 5 phút", "6 giờ 59 phút". */
export function formatRemaining(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  if (m < 60) return rem === 0 ? `${m} phút` : `${m} phút ${rem}s`
  const h = Math.floor(m / 60)
  const mm = m % 60
  if (h < 24) return mm === 0 ? `${h} giờ` : `${h} giờ ${mm} phút`
  const d = Math.floor(h / 24)
  return `${d} ngày ${h % 24} giờ`
}

/** Tỉ lệ quy đổi ngọc: 1 ngọc = 1.000 xu = 100 bọ. */
export const GEM_TO_COINS = 1000
export const GEM_TO_BUGS = 100

/** Tua nhanh: 1 ngọc cho mỗi 30 phút còn lại, tối thiểu 1 ngọc. */
export function fastForwardGemCost(remainingMs: number): number {
  return Math.max(1, Math.ceil(remainingMs / (30 * 60 * 1000)))
}

export const WHEEL_PRIZES: WheelPrize[] = [
  { id: 'coins50', label: '50 xu', emoji: '🪙', weight: 22, color: '#ffd76a' },
  { id: 'coins150', label: '150 xu', emoji: '💰', weight: 16, color: '#ffb3d9' },
  { id: 'bugs5', label: '5 bọ', emoji: '🐞', weight: 18, color: '#a7d397' },
  { id: 'bugs15', label: '15 bọ', emoji: '🐛', weight: 10, color: '#7fd8a4' },
  { id: 'gems3', label: '3 ngọc', emoji: '💎', weight: 8, color: '#a8e6ff' },
  { id: 'seed', label: '1 hạt giống', emoji: '🌱', weight: 14, color: '#ffcf9a' },
  { id: 'seedling', label: '1 cây giống', emoji: '🪴', weight: 7, color: '#c9a7ff' },
  { id: 'empty', label: 'Chúc may mắn lần sau', emoji: '🍀', weight: 5, color: '#e8e8ee' },
]
