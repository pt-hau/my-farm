import { Save } from 'lucide-react'

interface FooterProps {
  logoImg: string
  totalSlots: number
  todayEarnings: number
  lastSavedAt: string | null
  onSave: () => void
}

export function Footer({ logoImg, totalSlots, todayEarnings, lastSavedAt, onSave }: FooterProps) {
  return (
    <footer className="mt-10 border-t-[3px] border-black bg-white">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center overflow-visible p-0"
            style={{ background: 'transparent', backgroundColor: 'transparent', border: '0' }}
          >
            <img
              src={logoImg}
              alt="Footer logo Nuôi Phương"
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
          <div>
            <div className="font-[900]" style={{ color: '#2e2e2e' }}>
              Nuôi Phương — Vườn Sen Đá
            </div>
            <div className="text-[12px] font-[600] opacity-60" style={{ color: '#3e2723' }}>
              Làm với 💛 • Cozy farming chibi • {totalSlots} ô • Hôm nay +{todayEarnings} xu • Tự động lưu
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-[700] flex-wrap">
          <button
            onClick={onSave}
            style={{ color: '#ffffff' }}
            className="px-3 py-1 rounded-full bg-black text-white border-[2px] border-black flex items-center gap-1 force-white-text btn-dark"
          >
            <Save size={12} /> 💾 Đã lưu {lastSavedAt || ''}
          </button>
          <span
            className="px-3 py-1 rounded-full bg-black text-white force-white-text"
            style={{ color: '#ffffff' }}
          >
            Nuôi Phương 🌵
          </span>
        </div>
      </div>
    </footer>
  )
}
