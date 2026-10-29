import { Coins } from 'lucide-react'
import { BABY_TYPES } from '../data/babies'
import type { GardenGame } from '../hooks/useGardenGame'

export function NurseryModal({ game }: { game: GardenGame }) {
  if (!game.nurseryOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 bg-black/30 backdrop-blur-sm"
      onClick={() => game.setNurseryOpen(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[520px] rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease] max-h-[90vh] overflow-y-auto"
      >
        <div className="h-[62px] bg-[#ffb3d9] border-b-[3px] border-black flex items-center justify-between px-5 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white cartoon-border-sm flex items-center justify-center text-[20px]">
              👶
            </div>
            <div>
              <div className="font-[900] leading-none" style={{ color: '#3e2723' }}>
                Nhà trẻ • Nuôi Bé
              </div>
              <div className="text-[11px] font-[700] opacity-70" style={{ color: '#3e2723' }}>
                • {game.coins} xu • Đang nuôi {game.babies.length}/2 bé • 200 xu/bé
              </div>
            </div>
          </div>
          <button
            onClick={() => game.setNurseryOpen(false)}
            style={{ color: '#fff' }}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center force-white-text"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {BABY_TYPES.map((babyType) => {
              const adopted = game.babies.some((b) => b.type === babyType.type)
              const canAdopt = game.coins >= 200 && game.babies.length < 2 && !adopted
              return (
                <div
                  key={babyType.type}
                  className={`rounded-[20px] border-[3px] border-black p-3 flex flex-col items-center gap-2 ${adopted ? 'bg-[#c8f5a8]' : 'bg-[#fef9e7]'}`}
                >
                  <img
                    src={babyType.img}
                    alt={babyType.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
                    }}
                  />
                  <div className="text-center">
                    <div className="font-[900] text-[14px]" style={{ color: '#2e2e2e' }}>
                      {babyType.name}
                    </div>
                    <div
                      className="text-[11px] font-[800] px-2 py-[2px] rounded-full bg-white border-[2px] border-black inline-block mt-1"
                      style={{ color: '#5d4037' }}
                    >
                      {babyType.trait}
                    </div>
                    <div className="text-[10px] font-[600] opacity-60 mt-1">{babyType.desc}</div>
                  </div>
                  <div className="w-full mt-1">
                    {adopted ? (
                      <div className="h-[36px] rounded-full bg-black text-white border-[2.5px] border-black font-[800] text-[11px] flex items-center justify-center gap-1 force-white-text">
                        Đã nhận nuôi ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => game.adoptBaby(babyType)}
                        disabled={!canAdopt}
                        className={`w-full h-[36px] rounded-full border-[2.5px] border-black font-[900] text-[11px] flex flex-col items-center justify-center leading-[1.0] ${canAdopt ? 'bg-[#ff9a8a] text-white hover:translate-y-[-1px] active:translate-y-[1px] force-white-text' : 'bg-gray-200 opacity-70'}`}
                        style={{ color: canAdopt ? '#fff' : '#2e2e2e' }}
                      >
                        <span>Nhận nuôi</span>
                        <span className="text-[9px]">200 xu</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="mt-4 rounded-[14px] bg-[#fff0f7] border-[2.5px] border-dashed border-black p-3 text-[11px] font-[600] leading-[1.4]"
            style={{ color: '#3e2723' }}
          >
            <div className="font-[900] text-[12px] mb-1">👶 Cách chăm bé thú cưng:</div>
            <div>• Bé xuất hiện trong vườn như thú cưng, tự đi lại 20-80% x 55-92% mỗi 1.2s</div>
            <div>• 🍼 Đói: giảm 1 mỗi 3s, &lt;30 hiện "Đói quá!"</div>
            <div>• 💩 ị bậy: ngẫu nhiên 30-45s</div>
            <div>• 😭 khóc: ngẫu nhiên 25-40s, cần ôm</div>
            <div>• Click bé để mở menu chăm: Cho ăn -10 xu, Dọn 💩, Ôm 🥰</div>
            <div>• Vui &gt;80 + No &gt;50 → +5 xu mỗi 30s/bé 💛</div>
            <div className="mt-2 text-[10px] opacity-70">
              Tối đa 2 bé, giá 200 xu/bé. Bé 50px, drop-shadow như mascot cũ.
            </div>
          </div>

          <div
            className="mt-3 rounded-[14px] bg-black text-white p-3 text-[12px] font-[700] flex items-center gap-2 force-white-text"
            style={{ color: '#fff' }}
          >
            <Coins size={14} /> Bạn có {game.coins} xu • {game.babies.length}/2 bé • Vườn{' '}
            {game.totalSlots} ô
          </div>
        </div>
      </div>
    </div>
  )
}
