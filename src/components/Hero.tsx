import { Save, Sprout } from 'lucide-react'
import type { RefObject } from 'react'
import chibiImg from '../assets/images/phuong-chibi.png'
import { DECOR } from '../data/decor'
import type { GameCharacter } from '../types'

interface HeroProps {
  totalSlots: number
  todayEarnings: number
  level: number
  xp: number
  started: boolean
  isDaytime: boolean
  currentCharacter: GameCharacter
  currentCharacterImg: string
  characterWidthFor: (baseWidth: number) => number
  gardenSectionRef: RefObject<HTMLElement | null>
  onToggleStarted: () => void
  onSave: () => void
  onOpenCharacterShop: () => void
  onOpenGiftcode: () => void
}

export function Hero({
  totalSlots,
  todayEarnings,
  level,
  xp,
  started,
  isDaytime,
  currentCharacter,
  currentCharacterImg,
  characterWidthFor,
  gardenSectionRef,
  onToggleStarted,
  onSave,
  onOpenCharacterShop,
  onOpenGiftcode,
}: HeroProps) {
  return (
    <section className="relative overflow-x-clip bg-transparent">
      <div className="absolute inset-0 pointer-events-none bg-transparent" style={{ zIndex: 0 }} />
      {/* Cầu vồng vườn trên mây phía sau đồi */}
      <img
        src={DECOR.rainbow}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute top-[4%] right-[3%] w-[280px] md:w-[360px] opacity-80 pointer-events-none select-none"
        style={{ zIndex: 1, animation: 'floatY 6s ease-in-out infinite', filter: 'drop-shadow(0 10px 14px rgba(70,110,160,0.25))' }}
      />
      <div className="absolute bottom-0 left-0 w-full h-[42%] pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute bottom-0 left-[-10%] w-[60%] h-[88%] bg-[#a7d397] hill cartoon-border border-b-0"
          style={{ transformOrigin: 'bottom' }}
        />
        <div className="absolute bottom-0 right-[-8%] w-[65%] h-[76%] bg-[#8fcf7a] hill cartoon-border border-b-0" />
        <div className="absolute bottom-0 left-[22%] w-[58%] h-[58%] bg-[#b7e3a5] hill cartoon-border border-b-0" />
      </div>

      <div
        className="relative mx-auto max-w-[1200px] px-4 md:px-8 py-10 md:py-16 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center"
        style={{ zIndex: 2 }}
      >
        <div className="pt-6 md:pt-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white cartoon-border-sm text-[12px] font-[800] tracking-widest light-card"
            style={{ color: '#2e2e2e' }}
          >
            NEW SEASON • VƯỜN SEN ĐÁ TRÊN MÂY 🌵 • {totalSlots} ô • Hôm nay: +{todayEarnings} xu
          </div>

          <h1 className="title-3d mt-4 text-[48px] md:text-[68px] font-[900] leading-[0.9] tracking-tight">
            <span className="inline-block text-stroke text-white" style={{ textShadow: '4px 4px 0 #000' }}>
              Nuôi
            </span>
            <br />
            <span className="inline-flex items-center gap-3">
              <span className="text-[var(--accent)] text-stroke" style={{ WebkitTextStroke: '3px #000' }}>
                Phương
              </span>
              <span className="text-[36px] md:text-[54px] animate-[wiggle_2s_ease-in-out_infinite]">🌿</span>
            </span>
          </h1>

          <p
            className="mt-4 text-[18px] md:text-[20px] font-[700] leading-[1.3] max-w-[520px]"
            style={
              isDaytime
                ? undefined
                : { color: '#ffffff', textShadow: '0 2px 14px rgba(0,0,0,0.65)' }
            }
          >
            Cùng Phương trồng sen đá, xương rồng chibi, săn cây đột biến hiếm.
            <br />
            <span className="opacity-70 font-[600]">
              Gieo hạt, ươm lá, nâng chậu, bắt bọ, treo vườn lên mây. Cây cùi nhất lớn trong 3 phút,
              cây VIP nhất mất 7 tiếng — cây vẫn lớn cả khi bạn tắt game, dùng ngọc để tua nhanh.
              Game tự động lưu trên trình duyệt này, tải lại không mất dữ liệu.
            </span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => {
                onToggleStarted()
                gardenSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{ color: '#3e2723' }}
              className="h-[52px] px-7 rounded-full bg-[var(--accent)] cartoon-border font-[900] text-[16px] flex items-center gap-2 hover:translate-y-[-2px] active:translate-y-[1px] transition-transform light-card action-btn btn-3d"
            >
              <span>{started ? 'Xuống vườn nào ↓' : 'Bắt đầu trồng'}</span> <Sprout size={20} />
            </button>
            <button
              onClick={() => {
                onToggleStarted()
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{ color: '#2e2e2e' }}
              className="h-[52px] px-6 rounded-full bg-white cartoon-border font-[800] text-[15px] light-card btn-3d"
            >
              {started ? 'Đã khám phá ✓' : 'Khám phá'}
            </button>
            <button
              onClick={onSave}
              style={{ color: '#ffffff' }}
              className="h-[52px] px-6 rounded-full bg-black text-white cartoon-border font-[800] text-[15px] flex items-center gap-2 force-white-text action-btn btn-dark btn-3d"
            >
              <Save size={16} /> 💾 Lưu game
            </button>
            <button
              onClick={onOpenCharacterShop}
              style={{ color: '#3e2723' }}
              className="h-[52px] px-6 rounded-full chx-purple cartoon-border font-[800] text-[15px] flex items-center gap-2 light-card btn-3d"
            >
              👗 Nhân vật
            </button>
            <button
              onClick={onOpenGiftcode}
              style={{ color: '#3e2723' }}
              className="h-[52px] px-6 rounded-full chx-gold cartoon-border font-[800] text-[15px] flex items-center gap-2 light-card btn-3d"
            >
              🎁 Giftcode
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-[460px]">
            {[
              {k: `${totalSlots} ô`, l: 'Vườn hiện tại'},
              { k: `+${todayEarnings} xu`, l: 'Hôm nay' },
              { k: `Lv.${level}`, l: `Cấp ${xp} XP` },
            ].map((stat) => (
              <div
                key={stat.k + stat.l}
                className="rounded-[16px] bg-white cartoon-border p-3 light-card card-3d"
                style={{ color: '#2e2e2e' }}
              >
                <div className="font-[900] text-[18px] leading-none" style={{ color: '#2e2e2e' }}>
                  {stat.k}
                </div>
                <div
                  className="text-[11px] font-[700] opacity-60 uppercase tracking-widest mt-1"
                  style={{ color: '#5d4037' }}
                >
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative h-[420px] md:h-[520px] flex items-end justify-center"
          style={{ background: 'transparent', backgroundColor: 'transparent', isolation: 'isolate' }}
        >
          <div
            className="absolute left-[6%] bottom-[24%] origin-bottom animate-[sway_3s_ease-in-out_infinite]"
            style={{ zIndex: 2 }}
          >
            <div className="w-[18px] h-[68px] bg-[var(--wood)] cartoon-border-sm mx-auto rounded-[8px]" />
            <div className="w-[84px] h-[84px] bg-[var(--green-dark)] rounded-full cartoon-border -mt-8 -ml-8 flex items-center justify-center">
              <div className="w-[54px] h-[54px] bg-[var(--green)] rounded-full border-[2px] border-black" />
            </div>
          </div>
          <div
            className="absolute right-[4%] bottom-[28%] origin-bottom animate-[sway_3.6s_ease-in-out_infinite]"
            style={{ animationDelay: '0.4s', zIndex: 2 }}
          >
            <div className="w-[16px] h-[56px] bg-[var(--wood)] cartoon-border-sm mx-auto rounded-[8px]" />
            <div className="w-[72px] h-[72px] bg-[#7ab86a] rounded-full cartoon-border -mt-6 -ml-6" />
          </div>

          <div
            className="relative"
            style={{
              zIndex: 10,
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              isolation: 'isolate',
            }}
          >
            {/* Đảo bay dưới chân nhân vật */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-16px] w-[250px] pointer-events-none"
              style={{ zIndex: 1, animation: 'islandFloat 4.5s ease-in-out infinite' }}
            >
              <div
                className="h-[30px] rounded-[50%] border-[3px] border-black"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 70% at 50% 30%, #b9e79b 0%, #8fcf7a 55%, #6db356 100%)',
                  boxShadow: '0 10px 18px rgba(46,30,10,0.3)',
                }}
              />
              <div
                className="mx-auto -mt-[10px] w-[62%] h-[44px] border-[3px] border-t-0 border-black"
                style={{
                  background: 'linear-gradient(180deg, #8a5a35 0%, #6e4526 55%, #4a2c15 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 82% 62%, 50% 100%, 18% 62%)',
                }}
              />
              <img
                src={DECOR.flowers}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute -left-2 -top-3 w-12 select-none"
                style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))' }}
              />
              <img
                src={DECOR.grass}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute -right-3 -top-2 w-11 select-none"
                style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))' }}
              />
            </div>
            <img
              src={DECOR.butterfly}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute top-[8%] left-[2%] w-11 pointer-events-none select-none"
              style={{ zIndex: 3, animation: 'butterflyFly 6.5s ease-in-out infinite' }}
            />
            <div
              className="relative animate-[bounceSoft_2.2s_ease-in-out_infinite] flex flex-col items-center"
              style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                isolation: 'isolate',
              }}
            >
              <img
                src={currentCharacter.id === 'default' ? chibiImg : currentCharacterImg}
                alt={`${currentCharacter.name} - nhân vật chính`}
                className="select-none pointer-events-none"
                style={{
                  width: `${currentCharacter.id === 'default' ? 240 : characterWidthFor(220)}px`,
                  height: 'auto',
                  backgroundColor: 'transparent',
                  background: 'transparent',
                  objectFit: 'contain',
                  imageRendering: 'auto',
                  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.35))',
                  display: 'block',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  mixBlendMode: 'normal',
                  isolation: 'isolate',
                }}
              />
              <div
                className="mt-2 px-3 py-1 rounded-full bg-[var(--accent)] border-[2px] border-black text-[11px] font-[900] light-card"
                style={{ color: '#3e2723' }}
              >
                {currentCharacter.id === 'default' ? 'Nuôi Phương' : currentCharacter.name}
              </div>
            </div>
            <div className="absolute -top-3 -right-2 w-9 h-9 rounded-full bg-[#ffd36a] border-[3px] border-black flex items-center justify-center text-[16px] animate-[wiggle_1.8s_ease-in-out_infinite]">
              ✨
            </div>
          </div>

          <div
            className="absolute top-[12%] right-[18%] text-[22px] animate-[floatSlow_3s_ease-in-out_infinite]"
            style={{ zIndex: 3 }}
          >
            ✨
          </div>
          <div
            className="absolute top-[26%] left-[26%] text-[18px] animate-[floatSlow_2.6s_ease-in-out_infinite]"
            style={{ zIndex: 3 }}
          >
            🌼
          </div>
        </div>
      </div>
    </section>
  )
}
