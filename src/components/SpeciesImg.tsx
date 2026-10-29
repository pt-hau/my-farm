import { BUG_TYPES, POT_TIERS } from '../data/species'
import { traitLabel, variantLabel } from '../hooks/useGardenGame'
import type { BugType, PlantInstance, PotTierId, SpeciesKey, VariantKind } from '../types'
import { SPECIES } from '../data/species'

export function variantFilter(variant: VariantKind): string {
  if (variant === 'common') {
    return 'saturate(1.35) brightness(1.05) drop-shadow(0 0 10px rgba(255,215,106,0.9))'
  }
  if (variant === 'rare') {
    return 'saturate(1.6) hue-rotate(-12deg) drop-shadow(0 0 14px rgba(180,120,232,0.95))'
  }
  return 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))'
}

interface SpeciesImgProps {
  speciesKey: SpeciesKey
  variant?: VariantKind
  trait?: PlantInstance['trait']
  size?: number
  /** 0-1: cây đang lớn thì nhỏ dần lên. */
  progress?: number
  showBadge?: boolean
}

export function SpeciesImg({ speciesKey, variant = 'normal', trait = null, size = 72, progress, showBadge = true }: SpeciesImgProps) {
  const species = SPECIES[speciesKey]
  const scale = progress === undefined ? 1 : 0.55 + 0.45 * Math.min(1, Math.max(0, progress))
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <img
        src={species.img}
        alt={species.name}
        draggable={false}
        className="select-none"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          transform: `scale(${scale})`,
          transition: 'transform 0.6s ease',
          filter: variantFilter(variant),
        }}
      />
      {showBadge && variant !== 'normal' && (
        <span
          className="absolute -top-1 -right-2 z-10 px-1.5 py-[1px] rounded-full border-[2px] border-black text-[8px] font-[900] whitespace-nowrap"
          style={{ background: variant === 'rare' ? '#c9a7ff' : '#ffd76a', color: '#3e2723' }}
        >
          {variant === 'rare' ? '✨ Hiếm' : '🌟 ĐB'}
          {trait ? ` • ${traitLabel(trait)}` : ''}
        </span>
      )}
      {showBadge && variant === 'rare' && (
        <span className="absolute -left-1 top-0 text-[13px] animate-[wiggle_1.8s_ease-in-out_infinite]">✨</span>
      )}
    </div>
  )
}

export function VariantTag({ variant, trait }: { variant: VariantKind; trait?: PlantInstance['trait'] }) {
  if (variant === 'normal') return null
  return (
    <span
      className="px-1.5 py-[1px] rounded-full border-[2px] border-black text-[9px] font-[900]"
      style={{ background: variant === 'rare' ? '#c9a7ff' : '#ffd76a', color: '#3e2723' }}
    >
      {variantLabel(variant)}
      {trait ? ` • ${traitLabel(trait)}` : ''}
    </span>
  )
}

export function PotView({ pot, width = 76 }: { pot: PotTierId; width?: number }) {
  const tier = POT_TIERS.find((p) => p.id === pot) ?? POT_TIERS[0]
  return (
    <div className="relative flex flex-col items-center" style={{ width }}>
      <div
        className="w-full h-[10px] rounded-[8px] border-[2.5px] border-black z-10"
        style={{ background: `linear-gradient(180deg, ${tier.colors[0]}, ${tier.colors[1]})` }}
      />
      <div
        className="w-[82%] h-[34px] border-[2.5px] border-t-0 border-black"
        style={{
          background: `linear-gradient(180deg, ${tier.colors[1]}, ${tier.colors[0]} 30%, ${tier.colors[1]})`,
          clipPath: 'polygon(0 0, 100% 0, 82% 100%, 18% 100%)',
        }}
      />
      <div className="text-[9px] font-[900] mt-1 text-center leading-none" style={{ color: '#5d4037' }}>
        {tier.name}
      </div>
    </div>
  )
}

export function BugBadge({ bug, onCatch, label }: { bug: BugType; onCatch: () => void; label: string }) {
  const info = BUG_TYPES[bug]
  return (
    <button
      onClick={onCatch}
      title={`${label}: ${info.name} đang đậu, cây ngừng lớn. Bấm để bắt!`}
      className="relative w-[42px] h-[42px] rounded-full bg-[#f4f4f4] border-[2.5px] border-black shadow-[2px_2px_0_#000] overflow-hidden hover:scale-110 transition"
    >
      <img
        src={info.img}
        alt={info.name}
        className="w-full h-full object-cover scale-110 animate-[wiggle_1.8s_ease-in-out_infinite]"
        draggable={false}
      />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 px-1 rounded-full bg-black text-white text-[7px] font-[900]">
        BẮT!
      </span>
    </button>
  )
}

export function ProgressBar({ progress, color = '#7fbb6a' }: { progress: number; color?: string }) {
  return (
    <div className="h-[8px] rounded-full bg-black/10 border-[1.5px] border-black overflow-hidden">
      <div className="h-full transition-all duration-700" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`, background: color }} />
    </div>
  )
}

export function growthProgress(plant: PlantInstance, now: number): number {
  if (plant.mature) return 1
  if (plant.bug) {
    const elapsed = Math.max(0, plant.totalMs - plant.remainingMs)
    return plant.totalMs > 0 ? elapsed / plant.totalMs : 0
  }
  const elapsed = Math.max(0, plant.totalMs - Math.max(0, plant.readyAt - now))
  return plant.totalMs > 0 ? elapsed / plant.totalMs : 0
}
