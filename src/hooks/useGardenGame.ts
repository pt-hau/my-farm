import { GIFT_CODES } from '../data/giftcodes'
import { BABY_TYPES } from '../data/babies'
import { CHARACTERS } from '../data/characters'
import {
  GEM_TO_BUGS,
  GEM_TO_COINS,
  NETS,
  POT_TIERS,
  SPECIES,
  SPECIES_KEYS,
  fastForwardGemCost,
  formatRemaining,
  leafDropSeconds,
  orderPriceOf,
  wholesalePriceOf,
} from '../data/species'
import { ADOPT_COST, FEED_COST, MAX_BABIES, STARTING_COINS, characterWidth } from '../lib/game'
import { loadLegacySave, loadSave, savedNumber, writeSave } from '../lib/save'
import { formatClock, getTimeOfDay, overlayTint, skyGradient, sunMoonPosition } from '../lib/time'
import type {
  AreaId,
  Baby,
  CareSlot,
  DailyState,
  DisplaySlot,
  LeafItem,
  LeafSlot,
  Mission,
  NetId,
  Order,
  PlantInstance,
  SaveState,
  SowSlot,
  Species,
  SpeciesKey,
  StorageSlot,
  VariantKind,
  VariantTrait,
} from '../types'
import { useEffect, useMemo, useRef, useState } from 'react'

const SAVED: Partial<SaveState> | null = loadSave()
const LEGACY = SAVED ? {} : loadLegacySave()

const DEFAULT_COUNTS: Record<AreaId, number> = { sow: 10, care: 8, display: 4, storage: 4, leaf: 6 }
const MAX_COUNTS: Record<AreaId, number> = { sow: 24, care: 20, display: 12, storage: 12, leaf: 12 }
const STARTING_GEMS = 20

export function makeSowSlot(id: number): SowSlot {
  return { id, seed: null, phase: 'empty', germinateAt: 0, readyAt: 0, willGerminate: false, variant: 'normal', trait: null }
}
export function makeCareSlot(id: number): CareSlot {
  return { id, plant: null, pot: 'clay' }
}
export function makeDisplaySlot(id: number): DisplaySlot {
  return { id, plant: null, leavesReady: 0, leafNextAt: 0 }
}
export function makeStorageSlot(id: number): StorageSlot {
  return { id, plant: null }
}
export function makeLeafSlot(id: number): LeafSlot {
  return { id, leaf: null, readyAt: 0, willGerminate: false, variant: 'normal', trait: null, failed: false }
}

function emptySeeds(): Record<SpeciesKey, number> {
  const seeds = {} as Record<SpeciesKey, number>
  SPECIES_KEYS.forEach((k) => {
    seeds[k] = 0
  })
  seeds.pearl = 5
  seeds.zebra = 3
  seeds.bunnyEar = 2
  return seeds
}

function freshDaily(today: string): DailyState {
  return {
    date: today,
    stats: { sown: 0, caught: 0, sold: 0 },
    claimed: [],
    spinsLeft: 1,
    mutantStockDate: today,
    mutantStock: { pearl: 1, zebra: 1, bunnyEar: 1 },
  }
}

function pickWeightedSpecies(): Species {
  const r = Math.random()
  const tierPool = r < 0.5 ? 'common' : r < 0.8 ? 'fair' : r < 0.95 ? 'rare' : 'vip'
  const pool = SPECIES_KEYS.filter((k) => SPECIES[k].tier === tierPool)
  return SPECIES[pool[Math.floor(Math.random() * pool.length)]]
}

export function makeOrder(now: number): Order {
  const species = pickWeightedSpecies()
  const r = Math.random()
  const variantReq: Order['variantReq'] = r < 0.7 ? 'any' : r < 0.9 ? 'common' : 'rare'
  const qty = variantReq === 'rare' ? 1 : variantReq === 'common' ? 1 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3)
  const unit = orderPriceOf(species, variantReq === 'any' ? 'normal' : variantReq)
  return {
    id: `order-${now}-${Math.floor(Math.random() * 1e6)}`,
    species: species.key,
    variantReq,
    qty,
    reward: Math.floor(unit * qty * 1.2),
    expiresAt: now + 30 * 60 * 1000,
  }
}

function rollVariant(species: Species): { variant: VariantKind; trait: VariantTrait | null } {
  const r = Math.random()
  const variant: VariantKind =
    r < species.mutRareRate ? 'rare' : r < species.mutRareRate + species.mutCommonRate ? 'common' : 'normal'
  const trait: VariantTrait | null =
    variant === 'normal' ? null : (['var', 'color', 'crest'] as const)[Math.floor(Math.random() * 3)]
  return { variant, trait }
}

export function expandCostFor(area: AreaId, count: number): number {
  if (area === 'sow') return 100 + 60 * Math.max(0, count - 10)
  if (area === 'care') return 200 + 120 * Math.max(0, count - 8)
  if (area === 'display') return 150 + 100 * Math.max(0, count - 4)
  if (area === 'storage') return 120 + 80 * Math.max(0, count - 4)
  return 80 + 50 * Math.max(0, count - 6)
}

export function useGardenGame() {
  const gardenSectionRef = useRef<HTMLElement | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const todayStr = new Date().toDateString()

  /* ---------- Đồng hồ + tiền tệ + cấp ---------- */
  const [timeMinutes, setTimeMinutes] = useState(() => savedNumber(SAVED, 'P', 360))
  const [soundOn, setSoundOn] = useState(() => (SAVED ? SAVED.v !== false : LEGACY.soundOn !== false))
  const [coins, setCoins] = useState(() =>
    Math.max(0, SAVED ? savedNumber(SAVED, 'r', STARTING_COINS) : (LEGACY.coins ?? STARTING_COINS)),
  )
  const [bugs, setBugs] = useState(() => Math.max(0, savedNumber(SAVED, 'bugs', 0)))
  const [gems, setGems] = useState(() => Math.max(0, savedNumber(SAVED, 'gems', STARTING_GEMS)))
  const [xp, setXp] = useState(() => savedNumber(SAVED, 'H', LEGACY.xp ?? 0))
  const [level, setLevel] = useState(() => Math.max(1, savedNumber(SAVED, 's', LEGACY.level ?? 1)))
  const [todayEarnings, setTodayEarnings] = useState(() =>
    SAVED?.date === todayStr ? savedNumber(SAVED, 'ze', 0) : 0,
  )
  const [soldTotal, setSoldTotal] = useState(() => savedNumber(SAVED, 'soldTotal', 0))
  const [started, setStarted] = useState(false)
  const [walletBump, setWalletBump] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() =>
    typeof SAVED?.E3 === 'string' ? SAVED.E3 : null,
  )

  /* ---------- Vườn ---------- */
  const [seeds, setSeeds] = useState<Record<SpeciesKey, number>>(() => {
    const base = emptySeeds()
    if (SAVED?.seeds && typeof SAVED.seeds === 'object') {
      SPECIES_KEYS.forEach((k) => {
        const v = (SAVED.seeds as Record<string, unknown>)[k]
        if (typeof v === 'number' && Number.isFinite(v)) base[k] = Math.max(0, Math.floor(v))
      })
    }
    return base
  })
  const [counts, setCounts] = useState<Record<AreaId, number>>(() => ({
    ...DEFAULT_COUNTS,
    ...(SAVED?.counts && typeof SAVED.counts === 'object' ? SAVED.counts : {}),
  }))
  const [sowSlots, setSowSlots] = useState<SowSlot[]>(() => {
    const loaded = Array.isArray(SAVED?.sow) ? (SAVED.sow as SowSlot[]) : []
    const count = counts.sow
    return Array.from({ length: count }, (_, i) => {
      const s = loaded[i]
      return s && typeof s.id === 'number' ? { ...makeSowSlot(i), ...s, id: i } : makeSowSlot(i)
    })
  })
  const [careSlots, setCareSlots] = useState<CareSlot[]>(() => {
    const loaded = Array.isArray(SAVED?.care) ? (SAVED.care as CareSlot[]) : []
    return Array.from({ length: counts.care }, (_, i) => {
      const s = loaded[i]
      return s && typeof s.id === 'number' ? { ...makeCareSlot(i), ...s, id: i } : makeCareSlot(i)
    })
  })
  const [displaySlots, setDisplaySlots] = useState<DisplaySlot[]>(() => {
    const loaded = Array.isArray(SAVED?.display) ? (SAVED.display as DisplaySlot[]) : []
    return Array.from({ length: counts.display }, (_, i) => {
      const s = loaded[i]
      return s && typeof s.id === 'number' ? { ...makeDisplaySlot(i), ...s, id: i } : makeDisplaySlot(i)
    })
  })
  const [storageSlots, setStorageSlots] = useState<StorageSlot[]>(() => {
    const loaded = Array.isArray(SAVED?.storage) ? (SAVED.storage as StorageSlot[]) : []
    return Array.from({ length: counts.storage }, (_, i) => {
      const s = loaded[i]
      return s && typeof s.id === 'number' ? { ...makeStorageSlot(i), ...s, id: i } : makeStorageSlot(i)
    })
  })
  const [leafSlots, setLeafSlots] = useState<LeafSlot[]>(() => {
    const loaded = Array.isArray(SAVED?.leafSlots) ? (SAVED.leafSlots as LeafSlot[]) : []
    return Array.from({ length: counts.leaf }, (_, i) => {
      const s = loaded[i]
      return s && typeof s.id === 'number' ? { ...makeLeafSlot(i), ...s, id: i } : makeLeafSlot(i)
    })
  })
  const [leaves, setLeaves] = useState<LeafItem[]>(() =>
    Array.isArray(SAVED?.leaves) ? (SAVED.leaves as LeafItem[]) : [],
  )
  const [decorOwned, setDecorOwned] = useState<string[]>(() =>
    Array.isArray(SAVED?.decor) ? (SAVED.decor as string[]) : [],
  )
  const [netsOwned, setNetsOwned] = useState<NetId[]>(() =>
    Array.isArray(SAVED?.nets) ? (SAVED.nets as NetId[]) : ['tre'],
  )
  const [orders, setOrders] = useState<Order[]>(() => {
    if (Array.isArray(SAVED?.orders) && SAVED.orders.length > 0) return SAVED.orders as Order[]
    const t = Date.now()
    return [makeOrder(t), makeOrder(t + 1), makeOrder(t + 2)]
  })
  const [daily, setDaily] = useState<DailyState>(() => {
    if (SAVED?.daily && SAVED.daily.date === todayStr) return SAVED.daily
    return freshDaily(todayStr)
  })

  /* ---------- Chọn lựa trong giao diện ---------- */
  const [selectedSeed, setSelectedSeed] = useState<SpeciesKey | null>('pearl')
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null)
  const [wholesaleSelected, setWholesaleSelected] = useState<Set<string>>(new Set())
  const [shopOpen, setShopOpen] = useState(false)
  const [wheelOpen, setWheelOpen] = useState(false)
  const [wholesaleOpen, setWholesaleOpen] = useState(false)
  const [nurseryOpen, setNurseryOpen] = useState(false)
  const [characterShopOpen, setCharacterShopOpen] = useState(false)
  const [giftcodeOpen, setGiftcodeOpen] = useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [giftcodeInput, setGiftcodeInput] = useState('')
  const [wheelSpinning, setWheelSpinning] = useState(false)
  const [wheelDeg, setWheelDeg] = useState(0)
  const [wheelPrize, setWheelPrize] = useState<string | null>(null)

  /* ---------- Bé, nhân vật, giftcode ---------- */
  const [babies, setBabies] = useState<Baby[]>(() => {
    const list = SAVED?.wf ?? LEGACY.babies ?? []
    return list
      .filter((q) => q && BABY_TYPES.some((k) => k.type === q.type))
      .slice(0, MAX_BABIES)
      .map((q) => ({ ...q, img: BABY_TYPES.find((k) => k.type === q.type)?.img ?? '' }))
  })
  const [babyMenu, setBabyMenu] = useState<{ babyId: string } | null>(null)
  const [characterId, setCharacterId] = useState(() => SAVED?.ch || LEGACY.characterId || 'default')
  const [ownedCharacters, setOwnedCharacters] = useState<string[]>(() => SAVED?.ow || LEGACY.ownedCharacters || ['default'])
  const [usedCodes, setUsedCodes] = useState<string[]>(() =>
    Array.isArray(SAVED?.codes) ? SAVED.codes.filter((k) => typeof k === 'string') : (LEGACY.usedCodes ?? []),
  )

  const saveWarnRef = useRef(false)
  const snapshotRef = useRef<SaveState | null>(null)

  const showToast = (message: string, durationMs: number) => {
    setToast(message)
    setTimeout(() => setToast(null), durationMs)
  }

  /* ---------- Giá trị suy ra ---------- */
  const hour = Math.floor(timeMinutes / 60)
  const clockLabel = formatClock(timeMinutes)
  const timeOfDay = getTimeOfDay(timeMinutes)
  const isDaytime = timeMinutes >= 300 && timeMinutes < 1170
  const clockWithLabel = `${clockLabel} ${timeOfDay.emoji} ${timeOfDay.label}`
  const sky = skyGradient(timeMinutes)
  const sunMoon = sunMoonPosition(timeMinutes)
  const tint = overlayTint(timeOfDay.sky, hour)
  const currentCharacter = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0]
  const currentCharacterImg = currentCharacter.img
  const characterWidthFor = (baseWidth: number) => characterWidth(baseWidth, currentCharacter.ar)
  const totalSlots = counts.sow + counts.care + counts.display + counts.storage + counts.leaf
  const totalHarvested = soldTotal

  const allPlants = useMemo(() => {
    const list: { area: AreaId; slotId: number; plant: PlantInstance }[] = []
    careSlots.forEach((s) => s.plant && list.push({ area: 'care', slotId: s.id, plant: s.plant }))
    displaySlots.forEach((s) => s.plant && list.push({ area: 'display', slotId: s.id, plant: s.plant }))
    storageSlots.forEach((s) => s.plant && list.push({ area: 'storage', slotId: s.id, plant: s.plant }))
    return list
  }, [careSlots, displaySlots, storageSlots])
  const mutantCount = allPlants.filter((p) => p.plant.variant !== 'normal').length
  const displayCount = displaySlots.filter((s) => s.plant).length
  const matureCount = allPlants.filter((p) => p.plant.mature).length
  const bestNet = useMemo(
    () => NETS.filter((n) => netsOwned.includes(n.id)).sort((a, b) => b.mult - a.mult)[0] ?? NETS[0],
    [netsOwned],
  )

  const missions: Mission[] = useMemo(() => {
    const defs = [
      { id: 1, text: 'Gieo 3 hạt giống', done: daily.stats.sown >= 3, progress: `${Math.min(3, daily.stats.sown)}/3`, reward: '+100 xu' },
      { id: 2, text: 'Bắt 3 con bọ', done: daily.stats.caught >= 3, progress: `${Math.min(3, daily.stats.caught)}/3`, reward: '+5 bọ' },
      { id: 3, text: 'Bán 2 cây', done: daily.stats.sold >= 2, progress: `${Math.min(2, daily.stats.sold)}/2`, reward: '+200 xu' },
      { id: 4, text: 'Sở hữu 1 cây đột biến', done: mutantCount >= 1, progress: `${Math.min(1, mutantCount)}/1`, reward: '+5 ngọc' },
      { id: 5, text: 'Trưng bày 2 cây', done: displayCount >= 2, progress: `${Math.min(2, displayCount)}/2`, reward: '+100 xu, +3 ngọc' },
    ]
    return defs.map((d) => ({ ...d, claimed: daily.claimed.includes(d.id), progressLabel: d.progress, rewardLabel: d.reward }))
  }, [daily, mutantCount, displayCount])

  /** Trả xu/bọ bằng ngọc bù phần thiếu theo tỉ lệ 1 ngọc = 1.000 xu = 100 bọ. */
  const payMixed = (coinCost: number, bugCost: number, allowGem: boolean): boolean => {
    const coinShort = Math.max(0, coinCost - coins)
    const bugShort = Math.max(0, bugCost - bugs)
    const gemNeeded = allowGem
      ? Math.ceil(coinShort / GEM_TO_COINS) + Math.ceil(bugShort / GEM_TO_BUGS)
      : 0
    if (coinShort > 0 && !allowGem) return false
    if (bugShort > 0 && !allowGem) return false
    if (gemNeeded > gems) return false
    setCoins((v) => Math.max(0, v - coinCost))
    setBugs((v) => Math.max(0, v - bugCost))
    if (gemNeeded > 0) setGems((v) => v - gemNeeded)
    return true
  }

  const makePlant = (
    speciesKey: SpeciesKey,
    variant: VariantKind,
    trait: VariantTrait | null,
    source: PlantInstance['source'],
    potBonus: number,
    at: number,
  ): PlantInstance => {
    const species = SPECIES[speciesKey]
    const totalMs = Math.round(species.careSeconds * 1000 * (1 - potBonus))
    return {
      id: `plant-${at}-${Math.floor(Math.random() * 1e6)}`,
      species: speciesKey,
      variant,
      trait,
      mature: false,
      readyAt: at + totalMs,
      totalMs,
      remainingMs: totalMs,
      bug: null,
      nextBugAt: at + 30000 + Math.random() * 30000,
      source,
    }
  }


  /* ================= Hành động: gieo / chuyển / ươm lá ================= */

  const sowSeed = (slotId: number) => {
    const speciesKey = selectedSeed
    if (!speciesKey) {
      showToast('Chọn một loại hạt trong khay hạt trước nhé 🌱', 1800)
      return
    }
    const slot = sowSlots.find((s) => s.id === slotId)
    if (!slot || slot.phase !== 'empty') return
    if ((seeds[speciesKey] ?? 0) <= 0) {
      showToast(`Hết hạt ${SPECIES[speciesKey].name} rồi, mua thêm ở cửa hàng nhé!`, 2000)
      return
    }
    const species = SPECIES[speciesKey]
    const at = Date.now()
    const { variant, trait } = rollVariant(species)
    setSeeds((prev) => ({ ...prev, [speciesKey]: prev[speciesKey] - 1 }))
    setSowSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              seed: speciesKey,
              phase: 'germinating' as const,
              germinateAt: at + species.germSeconds * 1000,
              readyAt: at + (species.germSeconds + species.nurserySeconds) * 1000,
              willGerminate: Math.random() < species.germRate,
              variant,
              trait,
            }
          : s,
      ),
    )
    setDaily((prev) => ({ ...prev, stats: { ...prev.stats, sown: prev.stats.sown + 1 } }))
    setXp((v) => v + 8)
    showToast(`Đã gieo hạt ${species.name} 🌱 Chờ nảy mầm ${formatRemaining(species.germSeconds * 1000)}`, 2200)
  }

  const clearSowSlot = (slotId: number) => {
    setSowSlots((prev) => prev.map((s) => (s.id === slotId ? makeSowSlot(s.id) : s)))
  }

  const transferSprout = (slotId: number) => {
    const slot = sowSlots.find((s) => s.id === slotId)
    if (!slot || !slot.seed || slot.phase !== 'sprouted' || now < slot.readyAt) return
    const free = careSlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu chăm sóc hết chậu trống rồi, mở rộng thêm hoặc bán bớt nhé!', 2200)
      return
    }
    const potBonus = POT_TIERS.find((p) => p.id === free.pot)?.bonus ?? 0
    const plant = makePlant(slot.seed, slot.variant, slot.trait, 'seed', potBonus, Date.now())
    setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    clearSowSlot(slotId)
    const species = SPECIES[slot.seed]
    setXp((v) => v + 10)
    if (slot.variant === 'rare') showToast(`✨ ĐỘT BIẾN HIẾM! ${species.name} ${traitLabel(slot.trait)} — hiếm vô cùng!`, 3200)
    else if (slot.variant === 'common') showToast(`🌟 Đột biến thường! ${species.name} ${traitLabel(slot.trait)}`, 2800)
    else showToast(`Đã chuyển ${species.name} sang khu chăm sóc 🪴`, 2000)
  }

  const transferAllSprouts = () => {
    const ready = sowSlots.filter((s) => s.seed && s.phase === 'sprouted' && now >= s.readyAt)
    const freeSlots = careSlots.filter((s) => !s.plant)
    if (ready.length === 0) {
      showToast('Chưa có cây con nào sẵn sàng chuyển 🌱', 1800)
      return
    }
    if (freeSlots.length === 0) {
      showToast('Khu chăm sóc hết chậu trống rồi!', 2000)
      return
    }
    const at = Date.now()
    const moved = ready.slice(0, freeSlots.length).map((slot, i) => {
      const target = freeSlots[i]
      const potBonus = POT_TIERS.find((p) => p.id === target.pot)?.bonus ?? 0
      return {
        targetId: target.id,
        slotId: slot.id,
        plant: makePlant(slot.seed as SpeciesKey, slot.variant, slot.trait, 'seed', potBonus, at),
      }
    })
    const movedIds = new Set(moved.map((m) => m.slotId))
    setCareSlots((prev) =>
      prev.map((s) => {
        const m = moved.find((x) => x.targetId === s.id)
        return m ? { ...s, plant: m.plant } : s
      }),
    )
    setSowSlots((prev) => prev.map((s) => (movedIds.has(s.id) ? makeSowSlot(s.id) : s)))
    setXp((v) => v + 10 * moved.length)
    showToast(`Đã chuyển tất cả ${moved.length} cây con sang khu chăm sóc 🪴`, 2400)
  }

  /* ================= Hành động: di chuyển cây giữa các khu ================= */

  const moveCareToDisplay = (careId: number) => {
    const slot = careSlots.find((s) => s.id === careId)
    if (!slot?.plant) return
    const free = displaySlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu trưng bày hết chỗ trống rồi!', 2000)
      return
    }
    const plant = slot.plant
    const species = SPECIES[plant.species]
    setCareSlots((prev) => prev.map((s) => (s.id === careId ? { ...s, plant: null } : s)))
    setDisplaySlots((prev) =>
      prev.map((s) =>
        s.id === free.id
          ? { ...s, plant, leavesReady: 0, leafNextAt: plant.mature ? Date.now() + leafDropSeconds(species.tier) * 1000 : 0 }
          : s,
      ),
    )
    showToast(`Đã đưa ${species.name} lên vườn treo 🌸`, 2000)
  }

  const moveDisplayToCare = (displayId: number) => {
    const slot = displaySlots.find((s) => s.id === displayId)
    if (!slot?.plant) return
    const free = careSlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu chăm sóc hết chậu trống rồi!', 2000)
      return
    }
    const plant = slot.plant
    setDisplaySlots((prev) => prev.map((s) => (s.id === displayId ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)))
    setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    showToast(`Đã đưa ${SPECIES[plant.species].name} về khu chăm sóc 🪴`, 2000)
  }

  const moveToStorage = (area: 'care' | 'display', slotId: number) => {
    const plant =
      area === 'care'
        ? careSlots.find((s) => s.id === slotId)?.plant
        : displaySlots.find((s) => s.id === slotId)?.plant
    if (!plant) return
    if (!plant.mature) {
      showToast('Chỉ cây trưởng thành mới đưa vào khu bảo quản để chừa cho đơn hàng nhé!', 2200)
      return
    }
    const free = storageSlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu bảo quản hết chỗ trống rồi!', 2000)
      return
    }
    if (area === 'care') setCareSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null } : s)))
    else setDisplaySlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)))
    setStorageSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    showToast(`Đã cất ${SPECIES[plant.species].name} vào khu bảo quản 📦`, 2000)
  }

  const moveFromStorage = (storageId: number, target: 'care' | 'display') => {
    const slot = storageSlots.find((s) => s.id === storageId)
    if (!slot?.plant) return
    const plant = slot.plant
    const species = SPECIES[plant.species]
    if (target === 'care') {
      const free = careSlots.find((s) => !s.plant)
      if (!free) {
        showToast('Khu chăm sóc hết chậu trống rồi!', 2000)
        return
      }
      setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    } else {
      const free = displaySlots.find((s) => !s.plant)
      if (!free) {
        showToast('Khu trưng bày hết chỗ trống rồi!', 2000)
        return
      }
      setDisplaySlots((prev) =>
        prev.map((s) =>
          s.id === free.id
            ? { ...s, plant, leavesReady: 0, leafNextAt: Date.now() + leafDropSeconds(species.tier) * 1000 }
            : s,
        ),
      )
    }
    setStorageSlots((prev) => prev.map((s) => (s.id === storageId ? { ...s, plant: null } : s)))
    showToast(`Đã lấy ${species.name} ra khỏi khu bảo quản`, 2000)
  }

  const destroyPlant = (area: AreaId, slotId: number) => {
    const plant =
      area === 'care'
        ? careSlots.find((s) => s.id === slotId)?.plant
        : area === 'display'
          ? displaySlots.find((s) => s.id === slotId)?.plant
          : area === 'storage'
            ? storageSlots.find((s) => s.id === slotId)?.plant
            : null
    if (!plant) return
    if (plant.variant === 'rare' && !window.confirm(`Tiêu hủy cây ĐỘT BIẾN HIẾM ${SPECIES[plant.species].name}? Không thể hoàn tác!`)) {
      return
    }
    if (area === 'care') setCareSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null } : s)))
    if (area === 'display') setDisplaySlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)))
    if (area === 'storage') setStorageSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null } : s)))
    showToast(`Đã tiêu hủy ${SPECIES[plant.species].name} 🗑️`, 1800)
  }

  /* ================= Bán cây ================= */

  const sellPlant = (area: AreaId, slotId: number) => {
    const plant =
      area === 'care'
        ? careSlots.find((s) => s.id === slotId)?.plant
        : area === 'display'
          ? displaySlots.find((s) => s.id === slotId)?.plant
          : area === 'storage'
            ? storageSlots.find((s) => s.id === slotId)?.plant
            : null
    if (!plant || !plant.mature) return
    const price = wholesalePriceOf(SPECIES[plant.species], plant.variant)
    if (area === 'care') setCareSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null } : s)))
    if (area === 'display') setDisplaySlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)))
    if (area === 'storage') setStorageSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, plant: null } : s)))
    setCoins((v) => v + price)
    setTodayEarnings((v) => v + price)
    setSoldTotal((v) => v + 1)
    setDaily((prev) => ({ ...prev, stats: { ...prev.stats, sold: prev.stats.sold + 1 } }))
    setXp((v) => v + 15)
    setWholesaleSelected((prev) => {
      const next = new Set(prev)
      next.delete(`${area}:${slotId}`)
      return next
    })
    showToast(`Bán sỉ ${SPECIES[plant.species].name} +${price} xu 💰`, 2200)
  }

  const sellWholesaleSelected = () => {
    const ids = [...wholesaleSelected]
    if (ids.length === 0) return
    const removeKeys = new Set(ids)
    let total = 0
    let count = 0
    const priceOf = (p: PlantInstance) => wholesalePriceOf(SPECIES[p.species], p.variant)
    careSlots.forEach((s) => {
      if (s.plant?.mature && removeKeys.has(`care:${s.id}`)) {
        total += priceOf(s.plant)
        count++
      }
    })
    displaySlots.forEach((s) => {
      if (s.plant?.mature && removeKeys.has(`display:${s.id}`)) {
        total += priceOf(s.plant)
        count++
      }
    })
    storageSlots.forEach((s) => {
      if (s.plant?.mature && removeKeys.has(`storage:${s.id}`)) {
        total += priceOf(s.plant)
        count++
      }
    })
    if (count === 0) {
      showToast('Chưa chọn cây trưởng thành nào để bán sỉ', 1800)
      return
    }
    setCareSlots((prev) => prev.map((s) => (s.plant?.mature && removeKeys.has(`care:${s.id}`) ? { ...s, plant: null } : s)))
    setDisplaySlots((prev) =>
      prev.map((s) => (s.plant?.mature && removeKeys.has(`display:${s.id}`) ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)),
    )
    setStorageSlots((prev) => prev.map((s) => (s.plant?.mature && removeKeys.has(`storage:${s.id}`) ? { ...s, plant: null } : s)))
    setCoins((v) => v + total)
    setTodayEarnings((v) => v + total)
    setSoldTotal((v) => v + count)
    setDaily((prev) => ({ ...prev, stats: { ...prev.stats, sold: prev.stats.sold + count } }))
    setXp((v) => v + 15 * count)
    setWholesaleSelected(new Set())
    setWholesaleOpen(false)
    showToast(`Bán sỉ ${count} cây +${total} xu 💰💰`, 2600)
  }

  const fulfillOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    const matches = (p: PlantInstance) =>
      p.mature && p.species === order.species && (order.variantReq === 'any' || p.variant === order.variantReq)
    const candidates: { area: AreaId; slotId: number; plant: PlantInstance }[] = []
    storageSlots.forEach((s) => s.plant && matches(s.plant) && candidates.push({ area: 'storage', slotId: s.id, plant: s.plant as PlantInstance }))
    careSlots.forEach((s) => s.plant && matches(s.plant) && candidates.push({ area: 'care', slotId: s.id, plant: s.plant as PlantInstance }))
    displaySlots.forEach((s) => s.plant && matches(s.plant) && candidates.push({ area: 'display', slotId: s.id, plant: s.plant as PlantInstance }))
    if (candidates.length < order.qty) {
      const species = SPECIES[order.species]
      showToast(
        `Chưa đủ cây cho đơn này: cần ${order.qty} cây ${species.name}${order.variantReq === 'any' ? '' : order.variantReq === 'common' ? ' đột biến thường' : ' đột biến hiếm'} trưởng thành (đang có ${candidates.length}). Cây chừa trong khu bảo quản được ưu tiên giao trước!`,
        3200,
      )
      return
    }
    const taken = candidates.slice(0, order.qty)
    const takenKeys = new Set(taken.map((t) => `${t.area}:${t.slotId}`))
    setStorageSlots((prev) => prev.map((s) => (takenKeys.has(`storage:${s.id}`) ? { ...s, plant: null } : s)))
    setCareSlots((prev) => prev.map((s) => (takenKeys.has(`care:${s.id}`) ? { ...s, plant: null } : s)))
    setDisplaySlots((prev) =>
      prev.map((s) => (takenKeys.has(`display:${s.id}`) ? { ...s, plant: null, leavesReady: 0, leafNextAt: 0 } : s)),
    )
    setCoins((v) => v + order.reward)
    setTodayEarnings((v) => v + order.reward)
    setSoldTotal((v) => v + order.qty)
    setDaily((prev) => ({ ...prev, stats: { ...prev.stats, sold: prev.stats.sold + order.qty } }))
    setXp((v) => v + 20 * order.qty)
    setOrders((prev) => prev.map((o) => (o.id === orderId ? makeOrder(Date.now()) : o)))
    showToast(`Giao đơn thành công! +${order.reward} xu 📦✨`, 2800)
  }

  /* ================= Bọ ================= */

  const catchBug = (area: 'care' | 'display', slotId: number) => {
    const plant =
      area === 'care'
        ? careSlots.find((s) => s.id === slotId)?.plant
        : displaySlots.find((s) => s.id === slotId)?.plant
    if (!plant?.bug) return
    const reward = Math.max(1, Math.round(1 * bestNet.mult * (1 + SPECIES[plant.species].tier === 'vip' ? 1 : 0)))
    const baseReward =
      (area === 'care' || area === 'display') && plant.bug
        ? Math.round(
            (plant.bug === 'snail' ? 4 : plant.bug === 'mealybug' ? 1 : 2) * bestNet.mult,
          )
        : 1
    const gained = Math.max(reward, baseReward)
    const at = Date.now()
    const resume = (p: PlantInstance): PlantInstance => ({
      ...p,
      bug: null,
      readyAt: p.mature ? p.readyAt : at + Math.max(0, p.remainingMs),
      nextBugAt: at + 40000 + Math.random() * 40000,
    })
    if (area === 'care') {
      setCareSlots((prev) => prev.map((s) => (s.id === slotId && s.plant ? { ...s, plant: resume(s.plant) } : s)))
    } else {
      setDisplaySlots((prev) => prev.map((s) => (s.id === slotId && s.plant ? { ...s, plant: resume(s.plant) } : s)))
    }
    setBugs((v) => v + gained)
    setDaily((prev) => ({ ...prev, stats: { ...prev.stats, caught: prev.stats.caught + 1 } }))
    setXp((v) => v + 5)
    showToast(`Bắt được bọ! +${gained} bọ 🐞 (vợt ${bestNet.name})`, 2000)
  }

  /* ================= Chậu, mở rộng, tua nhanh ================= */

  const upgradePot = (slotId: number) => {
    const slot = careSlots.find((s) => s.id === slotId)
    if (!slot) return
    const idx = POT_TIERS.findIndex((p) => p.id === slot.pot)
    const next = POT_TIERS[idx + 1]
    if (!next) {
      showToast('Chậu đã đạt bậc cao nhất rồi! 💎', 1800)
      return
    }
    if (!payMixed(next.coins, next.bugs, true)) {
      showToast(`Chưa đủ xu/bọ/ngọc để nâng lên ${next.name} (cần ${next.coins} xu${next.bugs ? ` + ${next.bugs} bọ` : ''}, thiếu có thể bù bằng ngọc)`, 2600)
      return
    }
    const at = Date.now()
    setCareSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s
        let plant = s.plant
        if (plant && !plant.mature) {
          const species = SPECIES[plant.species]
          const newTotal = Math.round(species.careSeconds * 1000 * (1 - next.bonus))
          const ratio = newTotal / Math.max(1, plant.totalMs)
          if (plant.bug) {
            plant = { ...plant, totalMs: newTotal, remainingMs: Math.round(plant.remainingMs * ratio) }
          } else {
            const remaining = Math.max(0, plant.readyAt - at)
            plant = { ...plant, totalMs: newTotal, readyAt: at + Math.round(remaining * ratio) }
          }
        }
        return { ...s, pot: next.id, plant }
      }),
    )
    setXp((v) => v + 20)
    showToast(`Đã nâng chậu lên ${next.name}! Giảm ${Math.round(next.bonus * 100)}% thời gian chăm sóc ✨`, 2400)
  }

  const expandArea = (area: AreaId) => {
    if (counts[area] >= MAX_COUNTS[area]) {
      showToast('Khu này đã mở rộng tối đa rồi!', 1800)
      return
    }
    const cost = expandCostFor(area, counts[area])
    if (!payMixed(cost, 0, true)) {
      showToast(`Thiếu ${cost - coins} xu để mở rộng (có thể bù bằng ngọc: 1 ngọc = 1.000 xu)`, 2400)
      return
    }
    const nextCount = counts[area] + 1
    setCounts((prev) => ({ ...prev, [area]: nextCount }))
    if (area === 'sow') setSowSlots((prev) => [...prev, makeSowSlot(prev.length)])
    if (area === 'care') setCareSlots((prev) => [...prev, makeCareSlot(prev.length)])
    if (area === 'display') setDisplaySlots((prev) => [...prev, makeDisplaySlot(prev.length)])
    if (area === 'storage') setStorageSlots((prev) => [...prev, makeStorageSlot(prev.length)])
    if (area === 'leaf') setLeafSlots((prev) => [...prev, makeLeafSlot(prev.length)])
    setXp((v) => v + 15)
    showToast(`Mở rộng +1 ô! Khu này giờ có ${nextCount} ô 🎉`, 2400)
  }

  const fastForward = (area: AreaId, slotId: number) => {
    const at = Date.now()
    let remaining = 0
    if (area === 'sow') {
      const s = sowSlots.find((x) => x.id === slotId)
      if (!s || s.phase === 'empty' || s.phase === 'failed') return
      remaining = Math.max(0, s.readyAt - at)
    } else if (area === 'leaf') {
      const s = leafSlots.find((x) => x.id === slotId)
      if (!s?.leaf || s.failed) return
      remaining = Math.max(0, s.readyAt - at)
    } else {
      const plant =
        area === 'care'
          ? careSlots.find((x) => x.id === slotId)?.plant
          : displaySlots.find((x) => x.id === slotId)?.plant
      if (!plant || plant.mature) return
      remaining = plant.bug ? plant.remainingMs : Math.max(0, plant.readyAt - at)
    }
    if (remaining <= 0) return
    const cost = fastForwardGemCost(remaining)
    if (gems < cost) {
      showToast(`Cần ${cost} ngọc để tua nhanh (còn ${formatRemaining(remaining)}), bạn có ${gems} ngọc 💎`, 2400)
      return
    }
    setGems((v) => v - cost)
    if (area === 'sow') {
      setSowSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? s.phase === 'germinating'
              ? { ...s, germinateAt: at, readyAt: at, phase: s.willGerminate ? ('sprouted' as const) : ('failed' as const) }
              : { ...s, readyAt: at }
            : s,
        ),
      )
    } else if (area === 'leaf') {
      setLeafSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, readyAt: at } : s)))
    } else if (area === 'care') {
      setCareSlots((prev) =>
        prev.map((s) =>
          s.id === slotId && s.plant ? { ...s, plant: { ...s.plant, bug: null, readyAt: at, remainingMs: 0 } } : s,
        ),
      )
    } else {
      setDisplaySlots((prev) =>
        prev.map((s) =>
          s.id === slotId && s.plant ? { ...s, plant: { ...s.plant, bug: null, readyAt: at, remainingMs: 0 } } : s,
        ),
      )
    }
    showToast(`Tua nhanh -${cost} ngọc ⏩✨`, 2000)
  }

  /* ================= Lá rụng / ươm lá ================= */

  const collectLeaves = (displayId: number) => {
    const slot = displaySlots.find((s) => s.id === displayId)
    if (!slot?.plant || slot.leavesReady === 0) return
    const species = SPECIES[slot.plant.species]
    const count = slot.leavesReady
    const at = Date.now()
    const newLeaves: LeafItem[] = Array.from({ length: count }, () => ({
      id: `leaf-${at}-${Math.floor(Math.random() * 1e6)}`,
      species: slot.plant?.species as SpeciesKey,
      variant: slot.plant?.variant ?? 'normal',
      trait: slot.plant?.trait ?? null,
    }))
    setLeaves((prev) => [...prev, ...newLeaves])
    setDisplaySlots((prev) =>
      prev.map((s) =>
        s.id === displayId
          ? { ...s, leavesReady: 0, leafNextAt: at + leafDropSeconds(species.tier) * 1000 }
          : s,
      ),
    )
    showToast(`Thu được ${count} lá ${species.name} 🍃 Đem ươm ở khu ươm lá nhé!`, 2400)
  }

  const plantLeaf = (slotId: number) => {
    const leaf = leaves.find((l) => l.id === selectedLeafId)
    if (!leaf) {
      showToast('Chọn một chiếc lá trong kho lá trước nhé 🍃', 1800)
      return
    }
    const slot = leafSlots.find((s) => s.id === slotId)
    if (!slot || slot.leaf || slot.failed) return
    const species = SPECIES[leaf.species]
    const at = Date.now()
    const keepVariant = leaf.variant !== 'normal' && Math.random() < 0.85
    const variant: VariantKind = keepVariant ? leaf.variant : 'normal'
    const trait = keepVariant ? leaf.trait : null
    const willGerminate = Math.random() < Math.min(0.95, species.germRate + 0.2)
    const growMs = Math.round((species.germSeconds + species.nurserySeconds) * 0.8 * 1000)
    setLeaves((prev) => prev.filter((l) => l.id !== leaf.id))
    setLeafSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, leaf, readyAt: at + growMs, willGerminate, variant, trait, failed: false }
          : s,
      ),
    )
    setSelectedLeafId(null)
    setXp((v) => v + 8)
    showToast(`Đã ươm lá ${species.name} 🍃 Tỉ lệ nảy mầm cao hơn gieo hạt!`, 2200)
  }

  const transferLeafSeedling = (slotId: number) => {
    const slot = leafSlots.find((s) => s.id === slotId)
    if (!slot?.leaf || slot.failed || now < slot.readyAt || !slot.willGerminate) return
    const free = careSlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu chăm sóc hết chậu trống rồi!', 2000)
      return
    }
    const potBonus = POT_TIERS.find((p) => p.id === free.pot)?.bonus ?? 0
    const plant = makePlant(slot.leaf.species, slot.variant, slot.trait, 'leaf', potBonus, Date.now())
    setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    setLeafSlots((prev) => prev.map((s) => (s.id === slotId ? makeLeafSlot(s.id) : s)))
    setXp((v) => v + 10)
    showToast(`Lá đã thành cây giống ${SPECIES[slot.leaf.species].name}! Đã chuyển sang khu chăm sóc 🌱`, 2600)
  }

  const clearLeafSlot = (slotId: number) => {
    setLeafSlots((prev) => prev.map((s) => (s.id === slotId ? makeLeafSlot(s.id) : s)))
  }

  /* ================= Cửa hàng ================= */

  const buySeeds = (speciesKey: SpeciesKey, quantity: 1 | 5) => {
    const unit = SPECIES[speciesKey].seedPrice
    const price = quantity === 1 ? unit : Math.floor(unit * 5 * 0.9)
    if (coins < price) {
      showToast(`Thiếu ${price - coins} xu 😢`, 1800)
      return
    }
    setCoins((v) => v - price)
    setSeeds((prev) => ({ ...prev, [speciesKey]: prev[speciesKey] + quantity }))
    showToast(`Đã mua ${quantity} hạt ${SPECIES[speciesKey].name} 🌱${quantity > 1 ? ' (giảm 10%)' : ''}`, 2000)
  }

  const buySeedling = (speciesKey: SpeciesKey, variant: VariantKind, trait: VariantTrait | null) => {
    const species = SPECIES[speciesKey]
    const isShopMutant = variant === 'common'
    const price = isShopMutant ? species.seedlingPrice * 3 : species.seedlingPrice
    if (isShopMutant) {
      if ((daily.mutantStock[speciesKey] ?? 0) <= 0) {
        showToast('Cây đột biến thường này đã hết hàng hôm nay, mai quay lại nhé!', 2200)
        return
      }
    }
    if (coins < price) {
      showToast(`Thiếu ${price - coins} xu 😢`, 1800)
      return
    }
    const free = careSlots.find((s) => !s.plant)
    if (!free) {
      showToast('Khu chăm sóc hết chậu trống rồi, mở rộng thêm hoặc bán bớt nhé!', 2200)
      return
    }
    const potBonus = POT_TIERS.find((p) => p.id === free.pot)?.bonus ?? 0
    const plant = makePlant(speciesKey, variant, trait, 'seedling', potBonus, Date.now())
    setCoins((v) => v - price)
    setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
    if (isShopMutant) {
      setDaily((prev) => ({
        ...prev,
        mutantStock: { ...prev.mutantStock, [speciesKey]: Math.max(0, (prev.mutantStock[speciesKey] ?? 0) - 1) },
      }))
    }
    setXp((v) => v + 10)
    showToast(`Đã mua cây giống ${species.name}${variant !== 'normal' ? ` ${traitLabel(trait)}` : ''} và trồng vào chậu trống 🪴`, 2400)
  }

  const buyNet = (netId: NetId) => {
    const net = NETS.find((n) => n.id === netId)
    if (!net || netsOwned.includes(netId)) return
    if (coins < net.price) {
      showToast(`Thiếu ${net.price - coins} xu để mua ${net.name} 😢`, 1800)
      return
    }
    setCoins((v) => v - net.price)
    setNetsOwned((prev) => [...prev, netId])
    showToast(`Đã mua ${net.name}! Bắt bọ được ×${net.mult} bọ 🐞`, 2200)
  }

  const buyDecor = (decorId: string, price: number) => {
    if (decorOwned.includes(decorId)) return
    if (coins < price) {
      showToast(`Thiếu ${price - coins} xu 😢`, 1800)
      return
    }
    setCoins((v) => v - price)
    setDecorOwned((prev) => [...prev, decorId])
    showToast('Đã mua đồ trang trí! Khu trưng bày đẹp hơn rồi 🌸', 2200)
  }

  /* ================= Nhiệm vụ + vòng xoay ================= */

  const claimMission = (id: number) => {
    const mission = missions.find((m) => m.id === id)
    if (!mission || !mission.done || mission.claimed) return
    if (id === 1) setCoins((v) => v + 100)
    if (id === 2) setBugs((v) => v + 5)
    if (id === 3) setCoins((v) => v + 200)
    if (id === 4) setGems((v) => v + 5)
    if (id === 5) {
      setCoins((v) => v + 100)
      setGems((v) => v + 3)
    }
    setDaily((prev) => ({ ...prev, claimed: [...prev.claimed, id] }))
    setXp((v) => v + 20)
    showToast(`Nhận thưởng nhiệm vụ: ${mission.rewardLabel} 🎉`, 2400)
  }

  const spinWheel = () => {
    if (wheelSpinning) return
    let paid = false
    if (daily.spinsLeft > 0) {
      setDaily((prev) => ({ ...prev, spinsLeft: prev.spinsLeft - 1 }))
      paid = true
    } else if (gems >= 5) {
      setGems((v) => v - 5)
      paid = true
    }
    if (!paid) {
      showToast('Hết lượt quay miễn phí! Quay thêm tốn 5 ngọc, bạn chưa đủ ngọc 💎', 2400)
      return
    }
    const totalWeight = [22, 16, 18, 10, 8, 14, 7, 5].reduce((a, b) => a + b, 0)
    let roll = Math.random() * totalWeight
    let prizeIndex = 0
    const weights = [22, 16, 18, 10, 8, 14, 7, 5]
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i]
      if (roll <= 0) {
        prizeIndex = i
        break
      }
    }
    const prizeId = ['coins50', 'coins150', 'bugs5', 'bugs15', 'gems3', 'seed', 'seedling', 'empty'][prizeIndex]
    const segmentDeg = 360 / 8
    const targetDeg = 360 * 6 + (360 - prizeIndex * segmentDeg - segmentDeg / 2)
    setWheelDeg((prev) => prev + (targetDeg - (prev % 360) + 360) % 360 + 360 * 2)
    setWheelSpinning(true)
    setWheelPrize(null)
    setTimeout(() => {
      setWheelSpinning(false)
      if (prizeId === 'coins50') {
        setCoins((v) => v + 50)
        setWheelPrize('🪙 +50 xu!')
      } else if (prizeId === 'coins150') {
        setCoins((v) => v + 150)
        setWheelPrize('💰 +150 xu!')
      } else if (prizeId === 'bugs5') {
        setBugs((v) => v + 5)
        setWheelPrize('🐞 +5 bọ!')
      } else if (prizeId === 'bugs15') {
        setBugs((v) => v + 15)
        setWheelPrize('🐛 +15 bọ!')
      } else if (prizeId === 'gems3') {
        setGems((v) => v + 3)
        setWheelPrize('💎 +3 ngọc!')
      } else if (prizeId === 'seed') {
        const species = pickWeightedSpecies()
        setSeeds((prev) => ({ ...prev, [species.key]: prev[species.key] + 1 }))
        setWheelPrize(`🌱 +1 hạt ${species.name}!`)
      } else if (prizeId === 'seedling') {
        const species = pickWeightedSpecies()
        const free = careSlots.find((s) => !s.plant)
        if (free) {
          const potBonus = POT_TIERS.find((p) => p.id === free.pot)?.bonus ?? 0
          const plant = makePlant(species.key, 'normal', null, 'seedling', potBonus, Date.now())
          setCareSlots((prev) => prev.map((s) => (s.id === free.id ? { ...s, plant } : s)))
          setWheelPrize(`🪴 +1 cây giống ${species.name} đã trồng vào chậu trống!`)
        } else {
          setSeeds((prev) => ({ ...prev, [species.key]: prev[species.key] + 3 }))
          setWheelPrize(`🪴 Hết chậu trống, đổi thành +3 hạt ${species.name}!`)
        }
      } else {
        setWheelPrize('🍀 Chúc may mắn lần sau!')
      }
    }, 2800)
  }

  /* ================= Bé, nhân vật, giftcode, hệ thống ================= */

  const adoptBaby = (babyType: (typeof BABY_TYPES)[number]) => {
    if (babies.length >= MAX_BABIES) {
      showToast('Chỉ nuôi tối đa 2 bé thôi! 👶👶', 2000)
      return
    }
    if (coins < ADOPT_COST) {
      showToast(`Thiếu ${ADOPT_COST - coins} xu để nhận nuôi 😢`, 2000)
      return
    }
    if (babies.some((b) => b.type === babyType.type)) {
      showToast(`${babyType.name} đã ở trong vườn rồi!`, 1800)
      return
    }
    setCoins((v) => v - ADOPT_COST)
    const baby: Baby = {
      id: `${babyType.type}-${Date.now()}`,
      type: babyType.type,
      name: babyType.name,
      trait: babyType.trait,
      img: babyType.img,
      pos: { x: 20 + Math.random() * 60, y: 55 + Math.random() * 37 },
      dir: Math.random() > 0.5 ? 1 : -1,
      hunger: 100,
      happy: 85,
      poop: false,
      crying: false,
      growth: 0,
    }
    setBabies((prev) => [...prev, baby])
    setXp((v) => v + 30)
    showToast(`Đã nhận nuôi ${babyType.name}! 👶💛`, 2500)
  }

  const openBabyMenu = (baby: Baby, event: React.MouseEvent) => {
    event.stopPropagation()
    setBabyMenu({ babyId: baby.id })
  }

  const feedBaby = (babyId: string) => {
    if (coins < FEED_COST) {
      showToast('Thiếu 10 xu để cho ăn 🍼', 1800)
      return
    }
    setCoins((v) => v - FEED_COST)
    setBabies((prev) =>
      prev.map((b) =>
        b.id !== babyId ? b : { ...b, hunger: 100, happy: Math.min(100, b.happy + 20), crying: false, growth: Math.min(100, b.growth + 10) },
      ),
    )
    showToast('Bé no rồi! 😋🍼 +10% lớn lên!', 1800)
    setBabyMenu(null)
  }

  const cleanBaby = (babyId: string) => {
    setBabies((prev) =>
      prev.map((b) => (b.id !== babyId ? b : { ...b, poop: false, happy: Math.min(100, b.happy + 10), growth: Math.min(100, b.growth + 10) })),
    )
    showToast('Sạch sẽ thơm tho! 🧹✨ +10% lớn!', 1800)
    setBabyMenu(null)
  }

  const hugBaby = (babyId: string) => {
    setBabies((prev) =>
      prev.map((b) =>
        b.id !== babyId ? b : { ...b, crying: false, happy: Math.min(100, b.happy + 15), hunger: Math.max(0, b.hunger - 2), growth: Math.min(100, b.growth + 10) },
      ),
    )
    showToast('Ôm bé yêu! 🥰💛 +10% lớn lên!', 1800)
    setBabyMenu(null)
  }

  const buyCharacter = (character: (typeof CHARACTERS)[number]) => {
    if (ownedCharacters.includes(character.id)) return
    if (coins < character.price) {
      showToast(`Thiếu ${character.price - coins} xu để mở khóa ${character.name} 😢`, 2000)
      return
    }
    setCoins((v) => v - character.price)
    setOwnedCharacters((prev) => (prev.includes(character.id) ? prev : [...prev, character.id]))
    setCharacterId(character.id)
    showToast(`Đã mở khóa ${character.name}! 🎉`, 2600)
  }

  const selectCharacter = (character: (typeof CHARACTERS)[number]) => {
    if (!ownedCharacters.includes(character.id)) return
    setCharacterId(character.id)
    showToast(`Đã đổi sang ${character.name} ✨`, 1800)
  }

  const redeemGiftcode = () => {
    const code = giftcodeInput.trim().toUpperCase()
    if (!code) {
      showToast('Nhập giftcode trước nhé 🎁', 1800)
      return
    }
    if (!Object.prototype.hasOwnProperty.call(GIFT_CODES, code)) {
      showToast('Giftcode không hợp lệ 😢', 2000)
      return
    }
    if (usedCodes.includes(code)) {
      showToast('Giftcode này đã dùng rồi 🙈', 2000)
      return
    }
    const reward = GIFT_CODES[code]
    if (reward.coins) setCoins((v) => v + reward.coins)
    if (reward.gems) setGems((v) => v + reward.gems)
    setUsedCodes((prev) => [...prev, code])
    setGiftcodeInput('')
    setGiftcodeOpen(false)
    showToast(`🎁 Nhập mã thành công! +${reward.coins ? `${reward.coins} xu` : ''}${reward.gems ? ` +${reward.gems} ngọc` : ''}`, 2600)
  }

  const toggleDayNight = () => {
    if (isDaytime) setTimeMinutes(1260)
    else setTimeMinutes(720)
  }

  const toggleStarted = () => setStarted((v) => !v)

  const saveGame = () => {
    const ok = snapshotRef.current ? writeSave(snapshotRef.current) : false
    setLastSavedAt(new Date().toLocaleTimeString('vi-VN'))
    showToast(ok ? 'Đã lưu game 💾 (game cũng tự lưu liên tục 🌿)' : '⚠️ Trình duyệt chặn lưu dữ liệu', 2200)
  }

  const resetGarden = () => {
    const at = Date.now()
    setSowSlots(Array.from({ length: DEFAULT_COUNTS.sow }, (_, i) => makeSowSlot(i)))
    setCareSlots(Array.from({ length: DEFAULT_COUNTS.care }, (_, i) => makeCareSlot(i)))
    setDisplaySlots(Array.from({ length: DEFAULT_COUNTS.display }, (_, i) => makeDisplaySlot(i)))
    setStorageSlots(Array.from({ length: DEFAULT_COUNTS.storage }, (_, i) => makeStorageSlot(i)))
    setLeafSlots(Array.from({ length: DEFAULT_COUNTS.leaf }, (_, i) => makeLeafSlot(i)))
    setCounts({ ...DEFAULT_COUNTS })
    setSeeds(emptySeeds())
    setLeaves([])
    setDecorOwned([])
    setNetsOwned(['tre'])
    setOrders([makeOrder(at), makeOrder(at + 1), makeOrder(at + 2)])
    setDaily(freshDaily(new Date().toDateString()))
    setCoins(STARTING_COINS)
    setBugs(0)
    setGems(STARTING_GEMS)
    setXp(0)
    setLevel(1)
    setTodayEarnings(0)
    setSoldTotal(0)
    setBabies([])
    setBabyMenu(null)
    setWholesaleSelected(new Set())
    setResetConfirmOpen(false)
    setLastSavedAt(null)
    showToast('Đã reset vườn mới 🌱 500 xu + 20 ngọc', 2200)
  }

  const toggleWholesale = (key: string) => {
    setWholesaleSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  /* ================= Nhịp thời gian + chuyển trạng thái theo giờ thực ================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
      setTimeMinutes((v) => (v + 8) % 1440)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const at = now
    const today = new Date().toDateString()
    if (daily.date !== today) {
      setDaily(freshDaily(today))
      return
    }

    let sowToast: string | null = null
    let sowChanged = false
    const nextSow = sowSlots.map((s) => {
      if (s.phase === 'germinating' && s.seed && at >= s.germinateAt) {
        sowChanged = true
        if (s.willGerminate) {
          sowToast = `🌱 ${SPECIES[s.seed].name} đã nảy mầm! Chờ ươm thành cây con rồi chuyển sang chăm sóc nhé`
          return { ...s, phase: 'sprouted' as const }
        }
        return { ...s, phase: 'failed' as const }
      }
      return s
    })
    if (sowChanged) {
      setSowSlots(nextSow)
      if (sowToast) showToast(sowToast, 2600)
    }

    const maturedNames: string[] = []
    let careChanged = false
    const nextCare = careSlots.map((slot) => {
      const p = slot.plant
      if (!p) return slot
      if (!p.mature && !p.bug && at >= p.readyAt) {
        careChanged = true
        maturedNames.push(SPECIES[p.species].name)
        return { ...slot, plant: { ...p, mature: true } }
      }
      if (!p.mature && !p.bug && at >= p.nextBugAt) {
        careChanged = true
        return {
          ...slot,
          plant: { ...p, bug: SPECIES[p.species].bug, remainingMs: Math.max(0, p.readyAt - at) },
        }
      }
      return slot
    })
    if (careChanged) setCareSlots(nextCare)

    let displayChanged = false
    const nextDisplay = displaySlots.map((slot) => {
      const p = slot.plant
      if (!p) return slot
      const species = SPECIES[p.species]
      if (!p.mature && !p.bug && at >= p.readyAt) {
        displayChanged = true
        maturedNames.push(species.name)
        return {
          ...slot,
          plant: { ...p, mature: true },
          leafNextAt: at + leafDropSeconds(species.tier) * 1000,
        }
      }
      if (!p.mature && !p.bug && at >= p.nextBugAt) {
        displayChanged = true
        return {
          ...slot,
          plant: { ...p, bug: species.bug, remainingMs: Math.max(0, p.readyAt - at) },
        }
      }
      if (p.mature && slot.leafNextAt > 0 && at >= slot.leafNextAt) {
        displayChanged = true
        if (slot.leavesReady < 3) {
          return { ...slot, leavesReady: slot.leavesReady + 1, leafNextAt: slot.leafNextAt + leafDropSeconds(species.tier) * 1000 }
        }
        return { ...slot, leafNextAt: at + leafDropSeconds(species.tier) * 1000 }
      }
      return slot
    })
    if (displayChanged) setDisplaySlots(nextDisplay)
    if (maturedNames.length > 0) {
      showToast(`🎉 ${maturedNames[0]} đã trưởng thành! Bán, trưng bày hoặc chừa cho đơn hàng nhé`, 2800)
    }

    let leafToast: string | null = null
    let leafChanged = false
    const nextLeaf = leafSlots.map((s) => {
      if (s.leaf && !s.failed && at >= s.readyAt && !s.willGerminate) {
        leafChanged = true
        leafToast = `🍂 Lá ${SPECIES[s.leaf.species].name} ươm không thành cây giống, dọn ô để ươm lá khác nhé`
        return { ...s, failed: true }
      }
      return s
    })
    if (leafChanged) {
      setLeafSlots(nextLeaf)
      if (leafToast) showToast(leafToast, 2600)
    }

    const expired = orders.filter((o) => at > o.expiresAt)
    if (expired.length > 0) {
      setOrders((prev) => prev.map((o) => (at > o.expiresAt ? makeOrder(Date.now()) : o)))
      showToast('Một đơn hàng đã hết hạn, đơn mới đã về! 📦', 2200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  /* ---------- Lưu game ---------- */

  useEffect(() => {
    const snapshot: SaveState = {
      ver: 2,
      date: new Date().toDateString(),
      P: timeMinutes,
      v: soundOn,
      r: coins,
      bugs,
      gems,
      H: xp,
      s: level,
      seeds,
      sow: sowSlots,
      care: careSlots,
      display: displaySlots,
      storage: storageSlots,
      leafSlots,
      leaves,
      decor: decorOwned,
      nets: netsOwned,
      orders,
      daily,
      counts,
      wf: babies.map(({ img: _img, ...rest }) => rest),
      ze: todayEarnings,
      E3: lastSavedAt,
      ch: characterId,
      ow: ownedCharacters,
      codes: usedCodes,
      soldTotal,
      mutantSeen: mutantCount > 0,
    }
    snapshotRef.current = snapshot
    if (!writeSave(snapshot) && !saveWarnRef.current) {
      saveWarnRef.current = true
      showToast('⚠️ Trình duyệt đang chặn lưu dữ liệu, tải lại sẽ mất tiến trình', 4000)
    }
  }, [
    timeMinutes, soundOn, coins, bugs, gems, xp, level, seeds, sowSlots, careSlots,
    displaySlots, storageSlots, leafSlots, leaves, decorOwned, netsOwned, orders, daily,
    counts, babies, todayEarnings, lastSavedAt, characterId, ownedCharacters, usedCodes,
    soldTotal, mutantCount,
  ])

  useEffect(() => {
    const flush = () => {
      if (snapshotRef.current) writeSave(snapshotRef.current)
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', flush)
    }
  }, [])

  /* ---------- Nền trang đổi theo bầu trời ---------- */

  useEffect(() => {
    document.documentElement.style.background = sky
    document.body.style.background = sky
    document.body.style.transition = 'background 3s ease'
    document.documentElement.style.transition = 'background 3s ease'
  }, [sky])

  /* ---------- Các bé tự đi lại / đói / ị / khóc / đẻ xu ---------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setBabies((prev) =>
        prev.map((baby) => {
          const x = baby.pos.x + (Math.random() - 0.5) * 12
          const y = baby.pos.y + (Math.random() - 0.5) * 8
          const dir: 1 | -1 = x > baby.pos.x ? 1 : x < baby.pos.x ? -1 : baby.dir
          return {
            ...baby,
            pos: { x: Math.max(20, Math.min(80, x)), y: Math.max(55, Math.min(92, y)) },
            dir,
          }
        }),
      )
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setBabies((prev) =>
        prev.map((baby) => ({
          ...baby,
          hunger: Math.max(0, baby.hunger - 1),
          happy: baby.hunger < 20 ? Math.max(0, baby.happy - 1) : baby.happy,
        })),
      )
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let timer = 0
    const schedule = () => {
      const delay = 30000 + Math.random() * 15000
      timer = window.setTimeout(() => {
        setBabies((prev) =>
          prev.map((baby) =>
            Math.random() < 0.55 ? { ...baby, poop: true, happy: Math.max(0, baby.happy - 5) } : baby,
          ),
        )
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let timer = 0
    const schedule = () => {
      const delay = 25000 + Math.random() * 15000
      timer = window.setTimeout(() => {
        setBabies((prev) =>
          prev.map((baby) =>
            Math.random() < 0.5 ? { ...baby, crying: true, happy: Math.max(0, baby.happy - 8) } : baby,
          ),
        )
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const happyBabies = babies.filter((b) => b.happy > 80 && b.hunger > 50)
      if (happyBabies.length === 0) return
      let total = 0
      happyBabies.forEach((baby) => {
        total += 5 + Math.floor(baby.growth / 20)
      })
      setCoins((v) => v + total)
      setTodayEarnings((v) => v + total)
      showToast(`Các bé vui quá! +${total} xu 💛`, 2200)
    }, 30000)
    return () => clearInterval(timer)
  }, [babies])

  /* ---------- Ví nảy khi nhận xu ---------- */

  const prevCoinsRef = useRef(coins)
  useEffect(() => {
    if (coins > prevCoinsRef.current) {
      setWalletBump(true)
      setTimeout(() => setWalletBump(false), 600)
    }
    prevCoinsRef.current = coins
  }, [coins])

  /* ---------- Lên cấp ---------- */

  useEffect(() => {
    if (xp >= level * 100) {
      setLevel((v) => v + 1)
      setXp(0)
      showToast(`Lên cấp ${level + 1}! 🎉`, 2000)
    }
  }, [xp, level])

  return {
    refs: { gardenSectionRef },
    now,
    timeMinutes,
    clockLabel,
    hour,
    timeOfDay,
    isDaytime,
    clockWithLabel,
    sky,
    sunMoon,
    tint,
    soundOn,
    setSoundOn,
    coins,
    bugs,
    gems,
    xp,
    level,
    seeds,
    counts,
    sowSlots,
    careSlots,
    displaySlots,
    storageSlots,
    leafSlots,
    leaves,
    decorOwned,
    netsOwned,
    bestNet,
    orders,
    daily,
    missions,
    selectedSeed,
    setSelectedSeed,
    selectedLeafId,
    setSelectedLeafId,
    wholesaleSelected,
    toggleWholesale,
    shopOpen,
    setShopOpen,
    wheelOpen,
    setWheelOpen,
    wholesaleOpen,
    setWholesaleOpen,
    nurseryOpen,
    setNurseryOpen,
    characterShopOpen,
    setCharacterShopOpen,
    giftcodeOpen,
    setGiftcodeOpen,
    resetConfirmOpen,
    setResetConfirmOpen,
    giftcodeInput,
    setGiftcodeInput,
    wheelSpinning,
    wheelDeg,
    wheelPrize,
    babies,
    babyMenu,
    setBabyMenu,
    started,
    toggleStarted,
    todayEarnings,
    walletBump,
    toast,
    lastSavedAt,
    currentCharacter,
    currentCharacterImg,
    characterWidthFor,
    characterId,
    ownedCharacters,
    usedCodes,
    totalSlots,
    totalHarvested,
    allPlants,
    mutantCount,
    displayCount,
    matureCount,
    toggleDayNight,
    sowSeed,
    clearSowSlot,
    transferSprout,
    transferAllSprouts,
    moveCareToDisplay,
    moveDisplayToCare,
    moveToStorage,
    moveFromStorage,
    destroyPlant,
    sellPlant,
    sellWholesaleSelected,
    fulfillOrder,
    catchBug,
    upgradePot,
    expandArea,
    fastForward,
    collectLeaves,
    plantLeaf,
    transferLeafSeedling,
    clearLeafSlot,
    buySeeds,
    buySeedling,
    buyNet,
    buyDecor,
    claimMission,
    spinWheel,
    adoptBaby,
    openBabyMenu,
    feedBaby,
    cleanBaby,
    hugBaby,
    buyCharacter,
    selectCharacter,
    redeemGiftcode,
    saveGame,
    resetGarden,
  }
}

export type GardenGame = ReturnType<typeof useGardenGame>

export function traitLabel(trait: VariantTrait | null): string {
  if (trait === 'var') return 'Var lá'
  if (trait === 'color') return 'Màu lá'
  if (trait === 'crest') return 'Crest đỉnh'
  return ''
}

export function variantLabel(variant: VariantKind): string {
  if (variant === 'rare') return 'Đột biến hiếm'
  if (variant === 'common') return 'Đột biến thường'
  return 'Thường'
}
