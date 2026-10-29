import { DECOR, SKY_GARDEN_IMG } from '../data/decor'
import type { TimeOfDay } from '../types'
import type { SunMoonPosition } from '../lib/time'

interface SkySceneProps {
  sunMoon: SunMoonPosition
  timeOfDay: TimeOfDay
  tint: string
}

/**
 * Bầu trời "vườn trên mây": ảnh nền đảo bay + mây/bướm 3D trôi,
 * mặt trời/mặt trăng di chuyển, sao + đom đóm ban đêm.
 * Ban đêm ảnh nền mờ đi để lộ bầu trời sao; lớp phủ màu giữ nguyên.
 */
export function SkyScene({ sunMoon, timeOfDay, tint }: SkySceneProps) {
  const isNight = timeOfDay.sky === 'night'
  const skyOpacity = isNight ? 0.22 : timeOfDay.sky === 'dusk' ? 0.55 : 0.85

  return (
    <>
      {/* Ảnh nền vườn trên mây */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <img
          src={SKY_GARDEN_IMG}
          alt=""
          aria-hidden
          draggable={false}
          className="w-full h-full object-cover object-center"
          style={{ opacity: skyOpacity, transition: 'opacity 2s ease' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, rgba(10,18,44,0.55), rgba(10,18,44,0.25) 60%, transparent)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 45%, rgba(255,255,255,0.12))',
            transition: 'background 2s ease',
          }}
        />
      </div>

      <div
        className="fixed pointer-events-none"
        style={{
          left: `${sunMoon.x}%`,
          top: `${sunMoon.top}%`,
          transform: 'translate(-50%,-50%)',
          zIndex: 3,
          transition: 'left 1s linear, top 1s linear',
        }}
      >
        {sunMoon.isMoon ? (
          <div
            className="relative w-[50px] h-[50px] rounded-full bg-[#fef9d0] border-[3px] border-black flex items-center justify-center shadow-[0_0_18px_rgba(255,255,255,0.6)]"
            style={{ animation: 'moonGlow 2.5s ease-in-out infinite' }}
          >
            <div className="flex flex-col items-center">
              <div className="flex gap-[6px]">
                <span className="w-[4px] h-[4px] bg-black rounded-full inline-block" />
                <span className="w-[4px] h-[4px] bg-black rounded-full inline-block" />
              </div>
              <div className="mt-[3px] w-[12px] h-[6px] border-b-[2px] border-black rounded-b-full" />
            </div>
            <div className="absolute -top-1 -right-1 text-[12px]">✨</div>
            <div className="absolute text-[8px] top-[10px] left-[10px] opacity-40">• •</div>
          </div>
        ) : (
          <div className="relative w-[50px] h-[50px]">
            <div
              className="absolute inset-0"
              style={{ animation: 'sunRays 10s linear infinite' }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[3px] h-[14px] bg-[#ffeb3b] border-[1.5px] border-black rounded-full"
                  style={{
                    left: '50%',
                    top: '-8px',
                    transformOrigin: '50% 33px',
                    transform: `translateX(-50%) rotate(${i * 36}deg)`,
                  }}
                />
              ))}
            </div>
            <div
              className="absolute inset-0 rounded-full bg-[#ffdd4a] border-[3px] border-black flex flex-col items-center justify-center"
              style={{ animation: 'sunPulse 2.2s ease-in-out infinite' }}
            >
              <div className="flex gap-[5px]">
                <div className="w-[5px] h-[5px] bg-black rounded-full" />
                <div className="w-[5px] h-[5px] bg-black rounded-full" />
              </div>
              <div className="w-[14px] h-[7px] border-b-[2.5px] border-black rounded-b-full mt-[2px]" />
            </div>
          </div>
        )}
      </div>

      {isNight && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${(i * 13 + ((i * 7) % 20)) % 100}%`,
                top: `${(i * 7 + (i % 11)) % 60}%`,
                width: `${1.5 + (i % 3)}px`,
                height: `${1.5 + (i % 3)}px`,
                animation: `starTwinkle ${1.2 + (i % 2.5)}s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
                boxShadow: i % 7 === 0 ? '0 0 6px rgba(255,255,255,0.8)' : undefined,
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`shoot-${i}`}
              className="absolute w-[2px] h-[2px] bg-[#dfff8a] rounded-full shadow-[0_0_8px_#dfff8a]"
              style={{
                left: `${15 + i * 14}%`,
                top: `${18 + i * 9}%`,
                animation: `firefly ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {!isNight && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
          {/* Mây 3D trôi ngang bầu trời */}
          <img
            src={DECOR.cloud}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-[6%] w-[130px] opacity-95"
            style={{ animation: 'driftAcross 46s linear infinite', filter: 'drop-shadow(0 10px 12px rgba(70,110,160,0.25))' }}
          />
          <img
            src={DECOR.cloud}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-[16%] w-[86px] opacity-80"
            style={{ animation: 'driftAcross 64s linear infinite', animationDelay: '-28s', filter: 'drop-shadow(0 8px 10px rgba(70,110,160,0.22))' }}
          />
          <img
            src={DECOR.cloud}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-[2%] w-[64px] opacity-70"
            style={{ animation: 'driftAcross 80s linear infinite', animationDelay: '-52s' }}
          />
          {/* Bướm bay lượn */}
          <img
            src={DECOR.butterfly}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-[30%] left-[8%] w-[46px]"
            style={{ animation: 'butterflyFly 7s ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.18))' }}
          />
          <img
            src={DECOR.butterfly}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-[22%] right-[10%] w-[34px] opacity-90"
            style={{ animation: 'butterflyFly 9s ease-in-out infinite', animationDelay: '1.6s', filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.15))' }}
          />
        </div>
      )}

      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, background: tint, transition: 'background 2s ease' }}
      />
    </>
  )
}
