import type { GardenGame } from '../hooks/useGardenGame'

export function ResetModal({ game }: { game: GardenGame }) {
  if (!game.resetConfirmOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[360px] rounded-[24px] bg-white cartoon-border p-6 animate-[popIn_0.3s_ease]">
        <div className="w-12 h-12 rounded-full bg-[#ffd0d0] cartoon-border-sm flex items-center justify-center mx-auto text-[22px]">
          ⚠️
        </div>
        <div className="mt-4 text-center">
          <div className="font-[900] text-[18px]" style={{ color: '#2e2e2e' }}>
            Reset vườn?
          </div>
          <div
            className="mt-2 text-[13px] font-[600] opacity-70 leading-[1.4]"
            style={{ color: '#3e2723' }}
          >
            Tất cả tiến trình đã lưu, {game.coins} xu, {game.totalHarvested} cây đã bán, vườn{' '}
            {game.totalSlots} ô, cấp {game.level} sẽ mất (nhân vật đã mở khóa và giftcode đã dùng
            được giữ lại). Không thể hoàn tác.
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => game.setResetConfirmOpen(false)}
            style={{ color: '#2e2e2e' }}
            className="h-11 rounded-full bg-white cartoon-border font-[800] text-[13px] light-card"
          >
            Hủy
          </button>
          <button
            onClick={game.resetGarden}
            style={{ color: '#ffffff' }}
            className="h-11 rounded-full bg-[#ff6b6b] text-white cartoon-border font-[800] text-[13px] force-white-text btn-dark action-btn"
          >
            🔄 Reset vườn
          </button>
        </div>
      </div>
    </div>
  )
}
