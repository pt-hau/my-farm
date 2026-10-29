import type { Baby } from '../types'

interface BabySpriteProps {
  baby: Baby
  onOpenMenu: (baby: Baby, event: React.MouseEvent) => void
}

export function BabySprite({ baby, onOpenMenu }: BabySpriteProps) {
  const isHungry = baby.hunger < 30
  const size = 50 * (1 + baby.growth / 100)

  return (
    <div
      data-baby={baby.id}
      onClick={(event) => onOpenMenu(baby, event)}
      className="absolute cursor-pointer select-none group pointer-events-auto"
      style={{
        left: `${baby.pos.x}%`,
        top: `${baby.pos.y}%`,
        transform: `translate(-50%,-50%) scaleX(${baby.dir})`,
        zIndex: 80,
        transition: 'left 1.2s ease, top 1.2s ease',
        pointerEvents: 'auto',
        animation: 'bounceSoft 2.2s ease-in-out infinite',
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[82] pointer-events-none flex flex-col items-center gap-1"
        style={{ top: '-38px', transform: `translateX(-50%) scaleX(${baby.dir})` }}
      >
        <div className="flex items-center gap-1">
          {isHungry && (
            <div className="w-6 h-6 rounded-full bg-[#fff2a8] border-[2px] border-black flex items-center justify-center text-[12px] shadow-[2px_2px_0_#000] animate-[popIn_0.3s_ease]">
              🍼
            </div>
          )}
          {baby.poop && (
            <div className="w-6 h-6 rounded-full bg-[#c9a77a] border-[2px] border-black flex items-center justify-center text-[12px] shadow-[2px_2px_0_#000] animate-[shakeX_0.8s_ease]">
              💩
            </div>
          )}
          {baby.crying && (
            <div className="w-6 h-6 rounded-full bg-[#a7d8ff] border-[2px] border-black flex items-center justify-center text-[12px] shadow-[2px_2px_0_#000] animate-[babyCry_0.6s_ease_infinite]">
              😭
            </div>
          )}
          {baby.growth >= 100 && (
            <div className="w-6 h-6 rounded-full bg-[#ffd36a] border-[2px] border-black flex items-center justify-center text-[12px] shadow-[2px_2px_0_#000]">
              👑
            </div>
          )}
        </div>
        {isHungry && (
          <div className="px-2 py-[2px] rounded-full bg-white border-[2px] border-black text-[9px] font-[900] shadow-[2px_2px_0_#000] whitespace-nowrap animate-[popIn_0.3s_ease]">
            Đói quá!
          </div>
        )}
        {baby.poop && !isHungry && (
          <div className="px-2 py-[2px] rounded-full bg-[#fff2a8] border-[2px] border-black text-[9px] font-[900] shadow-[2px_2px_0_#000] whitespace-nowrap">
            Hôi quá!
          </div>
        )}
        {baby.crying && !isHungry && !baby.poop && (
          <div className="px-2 py-[2px] rounded-full bg-[#a7d8ff] border-[2px] border-black text-[9px] font-[900] shadow-[2px_2px_0_#000] whitespace-nowrap">
            Hu hu...
          </div>
        )}
      </div>

      <div
        className="relative flex flex-col items-center"
        style={{ background: 'transparent', isolation: 'isolate', zIndex: 81 }}
      >
        <div
          className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[30px] h-[8px] bg-black/15 rounded-full blur-[1px]"
          style={{ width: `${24 + size * 0.3}px` }}
        />
        <img
          src={baby.img}
          alt={baby.name}
          className={`select-none pointer-events-none ${baby.crying ? 'animate-[babyCry_0.5s_ease_infinite]' : 'animate-[babyBounce_2s_ease-in-out_infinite]'}`}
          style={{
            width: `${size}px`,
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            display: 'block',
            background: 'transparent',
            zIndex: 81,
            position: 'relative',
            pointerEvents: 'auto',
            transition: 'width 0.6s ease',
          }}
        />
        <div
          className="mt-1 px-2 py-[1px] rounded-full bg-white border-[2px] border-black text-[8px] font-[900] shadow-[1px_1px_0_#000] flex items-center gap-1"
          style={{ transform: `scaleX(${baby.dir})`, color: '#3e2723' }}
        >
          <span>{baby.name}</span>
          <span className="text-[7px] bg-[#a7d397] border border-black px-[2px] rounded-full">
            {baby.growth}%
          </span>
        </div>
        {baby.crying && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[4px] h-[6px] bg-[#6bb7ff] rounded-full border border-black/20"
                style={{
                  left: `${30 + i * 12}%`,
                  top: '12%',
                  animation: `tearFall 0.8s ease-in ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
