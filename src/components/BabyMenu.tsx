import type { Baby } from '../types'

interface BabyMenuProps {
  baby: Baby
  onClose: () => void
  onFeed: (babyId: string) => void
  onClean: (babyId: string) => void
  onHug: (babyId: string) => void
}

export function BabyMenu({ baby, onClose, onFeed, onClean, onHug }: BabyMenuProps) {
  const reward = 5 + Math.floor(baby.growth / 20)
  const size = 50 * (1 + baby.growth / 100)

  return (
    <div
      data-baby-menu
      onClick={(event) => event.stopPropagation()}
      className="absolute z-[90] animate-[popIn_0.25s_ease]"
      style={{
        left: `${Math.min(82, Math.max(12, baby.pos.x + 10))}%`,
        top: `${Math.max(5, baby.pos.y - 24)}%`,
        transform: 'translate(-50%,-100%)',
        zIndex: 90,
      }}
    >
      <div className="w-[220px] rounded-[18px] bg-white cartoon-border p-3 shadow-[5px_5px_0_#000]">
        <div className="flex items-center gap-2">
          <img
            src={baby.img}
            alt={baby.name}
            className="w-11 h-11 object-contain rounded-full border-[2px] border-black bg-[#fef9e7]"
          />
          <div>
            <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>
              {baby.name} • Lớn: {baby.growth}%
            </div>
            <div className="text-[10px] font-[700] opacity-60" style={{ color: '#5d4037' }}>
              {baby.trait} • {Math.round(size)}px • +{reward} xu/30s
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[12px]"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <div className="flex justify-between text-[10px] font-[800]">
              <span>🌱 Lớn</span>
              <span>
                {baby.growth}% • {Math.round(size)}px
              </span>
            </div>
            <div className="h-[8px] rounded-full bg-black/10 border-[1.5px] border-black overflow-hidden relative">
              <div
                className="h-full bg-[#a7d397] transition-all duration-500"
                style={{ width: `${baby.growth}%` }}
              />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  animation: 'barShine 1.5s linear infinite',
                }}
              />
            </div>
            <div className="text-[8px] font-[600] opacity-60 mt-1">
              50px → 100px • +10% mỗi lần chăm • Max 100%
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-[800]">
              <span>🍼 Đói</span>
              <span>{baby.hunger}%</span>
            </div>
            <div className="h-[6px] rounded-full bg-black/10 border-[1.5px] border-black overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${baby.hunger}%`,
                  background: baby.hunger < 30 ? '#ff6b6b' : baby.hunger < 60 ? '#ffcc4d' : '#7fbb6a',
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-[800]">
              <span>💛 Vui</span>
              <span>{baby.happy}%</span>
            </div>
            <div className="h-[6px] rounded-full bg-black/10 border-[1.5px] border-black overflow-hidden">
              <div className="h-full bg-[#ff9a8a]" style={{ width: `${baby.happy}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <button
            onClick={() => onFeed(baby.id)}
            className="h-[36px] rounded-full bg-[#fff2a8] border-[2.5px] border-black font-[800] text-[11px] flex items-center justify-center gap-1 hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            🍼 Cho ăn -10 xu +10% lớn {baby.hunger < 30 ? ' (Đói!)' : ''}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onClean(baby.id)}
              disabled={!baby.poop}
              className={`h-[34px] rounded-full border-[2.5px] border-black font-[800] text-[11px] flex items-center justify-center gap-1 ${baby.poop ? 'bg-[#c9a77a] hover:translate-y-[-1px]' : 'bg-gray-100 opacity-60'}`}
            >
              🧹 Dọn 💩 +10%
            </button>
            <button
              onClick={() => onHug(baby.id)}
              className="h-[34px] rounded-full bg-[#ffb3d9] border-[2.5px] border-black font-[800] text-[11px] flex items-center justify-center gap-1 hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              🥰 Ôm +10% {baby.crying ? ' (Khóc)' : ''}
            </button>
          </div>
        </div>

        <div className="mt-2 text-[9px] font-[600] opacity-70 text-center leading-[1.2]">
          Vui &gt;80 + Đói &gt;50 → +{reward} xu/30s • Càng lớn càng nhiều xu 💛
          <br />
          Base 5 +1 mỗi 20% lớn, max 10 xu
        </div>
      </div>
    </div>
  )
}
