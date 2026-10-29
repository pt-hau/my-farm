import { Gem, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import type { RefObject } from 'react'
import type { TimeOfDay } from '../types'

interface HeaderProps {
  logoImg: string
  level: number
  totalSlots: number
  coins: number
  bugs: number
  gems: number
  xp: number
  clockLabel: string
  timeMinutes: number
  timeOfDay: TimeOfDay
  isDaytime: boolean
  soundOn: boolean
  started: boolean
  gardenSectionRef: RefObject<HTMLElement | null>
  onToggleDayNight: () => void
  onToggleSound: () => void
  onToggleStarted: () => void
}

export function Header({
  logoImg,
  level,
  totalSlots,
  coins,
  bugs,
  gems,
  xp,
  clockLabel,
  timeMinutes,
  timeOfDay,
  isDaytime,
  soundOn,
  started,
  gardenSectionRef,
  onToggleDayNight,
  onToggleSound,
  onToggleStarted,
}: HeaderProps) {
  const hour = Math.floor(timeMinutes / 60)
  const minute = timeMinutes % 60

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 border-b-[3px] border-black"
      style={{ top: 'var(--safe-area-inset-top)' }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center overflow-visible p-0"
            style={{ background: 'transparent', backgroundColor: 'transparent', border: '0' }}
          >
            <img
              src={logoImg}
              alt="Logo Nuôi Phương"
              className="w-full h-full object-contain"
              style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                mixBlendMode: 'normal',
                isolation: 'isolate',
              }}
            />
          </div>
          <div className="leading-[0.9]">
            <div className="font-[900] tracking-tight text-[18px]">Nuôi Phương — Vườn Sen Đá</div>
            <div className="text-[11px] font-bold opacity-60 tracking-widest uppercase">
              Lv.{level} • {totalSlots} ô • {coins} xu • {bugs} bọ • {gems} ngọc
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-9 rounded-full bg-white cartoon-border-sm font-[800] text-[12px] shadow-sm">
            <span>🪙 {coins}</span>
            <span>🐞 {bugs}</span>
            <span className="flex items-center gap-0.5">
              <Gem size={12} /> {gems}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 h-9 rounded-full bg-white cartoon-border-sm font-[800] text-[12px] md:text-[13px] shadow-sm">
            <span className="hidden md:inline">{clockLabel}</span>
            <span className="md:hidden">
              {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </span>
            <span className="text-[16px]">{timeOfDay.icon}</span>
            <span className="hidden md:inline">{timeOfDay.label}</span>
            <div className="w-[36px] h-[6px] rounded-full bg-black/10 overflow-hidden hidden md:block">
              <div
                className="h-full bg-[#ffd54f]"
                style={{
                  width: `${(timeMinutes / 1440) * 100}%`,
                  background:
                    timeOfDay.sky === 'night'
                      ? '#6b7cff'
                      : timeOfDay.sky === 'dusk'
                        ? '#ff7e5f'
                        : timeOfDay.sky === 'dawn'
                          ? '#ff9a8a'
                          : '#7fbb6a',
                }}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-full bg-white cartoon-border-sm text-[11px] font-[800]">
            <span>
              XP {xp}/{level * 100}
            </span>
            <div className="w-[48px] h-[6px] rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-[var(--green-dark)]"
                style={{ width: `${Math.min(100, (xp / (level * 100)) * 100)}%` }}
              />
            </div>
          </div>

          <button
            aria-label={isDaytime ? 'Chế độ ngày' : 'Chế độ đêm'}
            onClick={onToggleDayNight}
            style={{ color: isDaytime ? '#2e2e2e' : '#ffffff' }}
            className={`w-10 h-10 rounded-full cartoon-border flex items-center justify-center hover:translate-y-[-1px] active:translate-y-[1px] transition force-dark-text ${isDaytime ? 'bg-white light-card' : 'bg-[#2a334d] force-white-text'}`}
          >
            {isDaytime ? <Sun size={18} color="#2e2e2e" /> : <Moon size={18} color="#ffffff" />}
          </button>

          <button
            aria-label={soundOn ? 'Tắt tiếng' : 'Bật tiếng'}
            onClick={onToggleSound}
            style={{ color: '#2e2e2e' }}
            className={`w-10 h-10 rounded-full cartoon-border flex items-center justify-center transition-colors light-card ${soundOn ? 'bg-white' : 'bg-[#ffd8d0]'}`}
          >
            {soundOn ? <Volume2 size={18} color="#2e2e2e" /> : <VolumeX size={18} color="#2e2e2e" />}
          </button>

          <button
            onClick={() => {
              onToggleStarted()
              gardenSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{ color: '#3e2723' }}
            className="hidden md:flex h-10 px-5 rounded-full bg-[var(--accent)] cartoon-border font-[800] text-[14px] hover:brightness-105 active:translate-y-[1px] light-card"
          >
            {started ? 'Đang chơi ↓' : 'Chơi ngay'}
          </button>
        </div>
      </div>
    </header>
  )
}
