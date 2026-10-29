import { Coins } from 'lucide-react'
import { CHARACTERS } from '../data/characters'
import type { GardenGame } from '../hooks/useGardenGame'

export function CharacterShopModal({ game }: { game: GardenGame }) {
  if (!game.characterShopOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 bg-black/30 backdrop-blur-sm"
      onClick={() => game.setCharacterShopOpen(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full chx-modal rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease] max-h-[90vh] overflow-y-auto"
      >
        <div className="h-[62px] chx-purple border-b-[3px] border-black flex items-center justify-between px-5 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white cartoon-border-sm flex items-center justify-center text-[20px]">
              👗
            </div>
            <div>
              <div className="font-[900] leading-none" style={{ color: '#3e2723' }}>
                Tiệm Nhân Vật
              </div>
              <div className="text-[11px] font-[700] opacity-70" style={{ color: '#3e2723' }}>
                • {game.coins} xu • Đã mở {game.ownedCharacters.length}/{CHARACTERS.length}
              </div>
            </div>
          </div>
          <button
            onClick={() => game.setCharacterShopOpen(false)}
            style={{ color: '#fff' }}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center force-white-text"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="chx-grid">
            {CHARACTERS.map((character) => {
              const owned = game.ownedCharacters.includes(character.id)
              const selected = game.characterId === character.id
              const canAfford = game.coins >= character.price
              return (
                <div
                  key={character.id}
                  data-char={character.id}
                  className={`rounded-[20px] border-[3px] border-black p-3 flex flex-col items-center gap-2 ${selected ? 'bg-[#c8f5a8]' : owned ? 'bg-[#fff8e1]' : 'bg-[#fef9e7]'}`}
                >
                  <div className="chx-pic">
                    <img
                      src={character.img}
                      alt={character.name}
                      style={{
                        maxHeight: '190px',
                        maxWidth: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: owned
                          ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))'
                          : 'drop-shadow(0 4px 6px rgba(0,0,0,0.25)) grayscale(0.7) opacity(0.75)',
                      }}
                    />
                    {!owned && (
                      <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white border-[2.5px] border-black flex items-center justify-center text-[15px]">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-[900] text-[14px] leading-tight" style={{ color: '#2e2e2e' }}>
                      {character.name}
                    </div>
                    <div
                      className="text-[11px] font-[800] px-2 py-[2px] rounded-full bg-white border-[2px] border-black inline-block mt-1"
                      style={{ color: '#5d4037' }}
                    >
                      {character.tag}
                    </div>
                    <div
                      className="text-[10px] font-[600] opacity-70 mt-1 leading-[1.3]"
                      style={{ color: '#3e2723' }}
                    >
                      {character.desc}
                    </div>
                  </div>
                  <div className="chx-wrap">
                    {selected ? (
                      <div
                        className="chx-act bg-black text-white border-[2.5px] border-black font-[800] text-[12px] flex items-center justify-center force-white-text"
                        style={{ color: '#fff' }}
                      >
                        Đang dùng ✓
                      </div>
                    ) : owned ? (
                      <button
                        onClick={() => game.selectCharacter(character)}
                        style={{ color: '#3e2723' }}
                        className="chx-act bg-[var(--accent)] border-[2.5px] border-black font-[900] text-[12px] hover:translate-y-[-1px] active:translate-y-[1px] light-card"
                      >
                        Chọn nhân vật
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => game.buyCharacter(character)}
                        style={{ color: canAfford ? '#ffffff' : '#2e2e2e' }}
                        className={`chx-act border-[2.5px] border-black font-[900] text-[12px] flex flex-col items-center justify-center leading-[1.05] ${canAfford ? 'bg-[#5d4037] hover:translate-y-[-1px] active:translate-y-[1px] force-white-text btn-dark action-btn' : 'bg-gray-200 opacity-80 light-card'}`}
                      >
                        <span>
                          {canAfford ? `Mở khóa • ${character.price} xu` : `${character.price} xu`}
                        </span>
                        {!canAfford && (
                          <span className="text-[9px] opacity-80">Thiếu {character.price - game.coins} xu</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="mt-4 rounded-[14px] bg-black text-white p-3 text-[12px] font-[700] flex items-center gap-2 force-white-text"
            style={{ color: '#fff' }}
          >
            <Coins size={14} /> Bạn có {game.coins} xu • Cày ruộng, thu hoạch, nuôi bé để kiếm xu mở
            khóa nhân vật mới
          </div>
          <div
            className="mt-3 rounded-[12px] bg-[#fff8e1] border-[2.5px] border-dashed border-black p-3 text-[11px] font-[600] leading-[1.4]"
            style={{ color: '#3e2723' }}
          >
            💡 Nhân vật đã mở khóa được giữ vĩnh viễn (kể cả khi Reset vườn) và tự lưu trên trình
            duyệt này.
          </div>
        </div>
      </div>
    </div>
  )
}
