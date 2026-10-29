import type { GardenGame } from '../hooks/useGardenGame'

export function GiftcodeModal({ game }: { game: GardenGame }) {
  if (!game.giftcodeOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/30 backdrop-blur-sm"
      onClick={() => game.setGiftcodeOpen(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full chx-modal rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease]"
        style={{ maxWidth: '400px' }}
      >
        <div
          className="h-[62px] border-b-[3px] border-black flex items-center justify-between px-5"
          style={{ background: '#ffe08a' }}
        >
          <div className="font-[900]" style={{ color: '#3e2723' }}>
            🎁 Nhập Giftcode
          </div>
          <button
            onClick={() => game.setGiftcodeOpen(false)}
            style={{ color: '#fff' }}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center force-white-text"
          >
            ✕
          </button>
        </div>
        <form
          className="p-4"
          onSubmit={(event) => {
            event.preventDefault()
            game.redeemGiftcode()
          }}
        >
          <input
            value={game.giftcodeInput}
            onChange={(event) => game.setGiftcodeInput(event.target.value)}
            placeholder="Nhập mã tại đây..."
            autoFocus
            maxLength={30}
            autoComplete="off"
            className="chx-input"
          />
          <button
            type="submit"
            style={{ color: '#fff', marginTop: '12px' }}
            className="chx-act bg-[#5d4037] border-[2.5px] border-black font-[900] text-[13px] force-white-text btn-dark action-btn"
          >
            Nhận thưởng
          </button>
          <div
            className="mt-3 text-[11px] font-[600] opacity-70 text-center"
            style={{ color: '#3e2723' }}
          >
            Mỗi mã chỉ dùng được một lần.
          </div>
        </form>
      </div>
    </div>
  )
}
