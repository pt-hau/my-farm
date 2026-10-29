import { useState } from 'react'
import { Gem } from 'lucide-react'
import { SPECIES, WHEEL_PRIZES, formatRemaining, orderPriceOf, wholesalePriceOf } from '../data/species'
import type { GardenGame } from '../hooks/useGardenGame'
import { SpeciesImg, VariantTag } from './SpeciesImg'

export function OrdersPanel({ game }: { game: GardenGame }) {
  return (
    <div className="rounded-[24px] cartoon-border bg-white/85 backdrop-blur-sm p-4 md:p-5 card-3d h-full">
      <div className="flex items-center gap-2">
        <div className="text-[22px]">📦</div>
        <div>
          <div className="font-[900] text-[17px] leading-none" style={{ color: '#2e2e2e' }}>Đơn hàng</div>
          <div className="text-[11px] font-[600] opacity-60 mt-1">Bán theo đơn giá cao hơn bán sỉ (đã gồm 20% thưởng). Cây trong khu bảo quản được giao trước.</div>
        </div>
      </div>
      <div className="mt-3 space-y-3">
        {game.orders.map((order) => {
          const species = SPECIES[order.species]
          return (
            <div key={order.id} className="rounded-[18px] border-[2.5px] border-black bg-[#fef9e7] p-3 flex gap-3 items-center">
              <SpeciesImg speciesKey={order.species} size={52} showBadge={false} />
              <div className="flex-1 min-w-0">
                <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>
                  {species.name} ×{order.qty}
                </div>
                <div className="text-[11px] font-[700] opacity-70">
                  {order.variantReq === 'any' ? 'Cây thường hoặc đột biến đều được' : order.variantReq === 'common' ? 'Cần cây đột biến thường' : 'Cần cây đột biến hiếm'}
                  {' • '}Hết hạn sau {formatRemaining(order.expiresAt - game.now)}
                </div>
                <div className="text-[11px] font-[800] text-[#2e7d32]">Thưởng: {order.reward} xu</div>
              </div>
              <button
                onClick={() => game.fulfillOrder(order.id)}
                className="shrink-0 h-[36px] px-4 rounded-full bg-[#a7d397] border-[2.5px] border-black font-[900] text-[12px] hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Giao đơn
              </button>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] font-[600] opacity-60 mt-3">
        Mẹo: đưa cây trưởng thành vào khu bảo quản để chừa cho đơn, tránh bán sỉ nhầm. Đơn hết hạn sẽ tự thay bằng đơn mới.
      </p>
    </div>
  )
}

export function MissionsPanel({ game }: { game: GardenGame }) {
  return (
    <div className="rounded-[24px] cartoon-border bg-white/85 backdrop-blur-sm p-4 md:p-5 card-3d h-full">
      <div className="flex items-center gap-2">
        <div className="text-[22px]">📜</div>
        <div>
          <div className="font-[900] text-[17px] leading-none" style={{ color: '#2e2e2e' }}>Nhiệm vụ hằng ngày</div>
          <div className="text-[11px] font-[600] opacity-60 mt-1">Làm mới mỗi ngày. Ngọc là tiền tệ VIP nhất, dùng để nâng cấp, mở rộng và tua nhanh.</div>
        </div>
        <button
          onClick={() => game.setWheelOpen(true)}
          className="ml-auto h-[36px] px-4 rounded-full bg-[#e3c8ff] border-[2.5px] border-black font-[900] text-[12px] hover:translate-y-[-1px] active:translate-y-[1px] whitespace-nowrap"
        >
          🎡 Vòng xoay {game.daily.spinsLeft > 0 ? `(${game.daily.spinsLeft} lượt miễn phí)` : '(5 ngọc/lượt)'}
        </button>
      </div>
      <div className="mt-3 space-y-2.5">
        {game.missions.map((mission) => (
          <div key={mission.id} className="rounded-[16px] border-[2px] border-black bg-white p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-[800] text-[13px]" style={{ color: '#2e2e2e' }}>{mission.text}</div>
              <div className="text-[11px] font-[700] opacity-60">
                {mission.progressLabel} • Thưởng: {mission.rewardLabel}
              </div>
            </div>
            {mission.claimed ? (
              <span className="px-3 py-1 rounded-full bg-[#c8f5a8] border-[2px] border-black text-[11px] font-[900]">Đã nhận ✓</span>
            ) : mission.done ? (
              <button
                onClick={() => game.claimMission(mission.id)}
                className="h-[32px] px-3 rounded-full bg-[#ffd76a] border-[2px] border-black font-[900] text-[11px] hover:translate-y-[-1px]"
              >
                Nhận thưởng
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-gray-100 border-[2px] border-black text-[11px] font-[800] opacity-70">Chưa xong</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function WheelModal({ game }: { game: GardenGame }) {
  if (!game.wheelOpen) return null
  const gradient = `conic-gradient(${WHEEL_PRIZES.map((p, i) => `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/30 backdrop-blur-sm" onClick={() => game.setWheelOpen(false)}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease] p-5"
      >
        <div className="flex items-center justify-between">
          <div className="font-[900] text-[17px]" style={{ color: '#2e2e2e' }}>🎡 Vòng xoay may mắn</div>
          <button onClick={() => game.setWheelOpen(false)} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">✕</button>
        </div>
        <p className="text-[11px] font-[600] opacity-60 mt-1">
          Mỗi ngày 1 lượt miễn phí, quay thêm tốn 5 ngọc. Còn {game.daily.spinsLeft} lượt miễn phí • Bạn có {game.gems} ngọc.
        </p>
        <div className="relative w-[280px] h-[280px] mx-auto my-4">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 text-[28px]">🔻</div>
          <div
            className="w-full h-full rounded-full border-[4px] border-black overflow-hidden relative"
            style={{
              background: gradient,
              transform: `rotate(${game.wheelDeg}deg)`,
              transition: game.wheelSpinning ? 'transform 2.8s cubic-bezier(0.15, 0.9, 0.25, 1)' : undefined,
            }}
          >
            {WHEEL_PRIZES.map((prize, i) => (
              <div
                key={prize.id}
                className="absolute left-1/2 top-1/2 flex flex-col items-center"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg) translateY(-96px)` }}
              >
                <span className="text-[20px] leading-none">{prize.emoji}</span>
                <span className="text-[8px] font-[900] text-center leading-tight mt-0.5 max-w-[52px]" style={{ color: '#3e2723' }}>{prize.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-full bg-white border-[3px] border-black flex items-center justify-center text-[26px] z-10">🎡</div>
        </div>
        {game.wheelPrize && (
          <div className="text-center font-[900] text-[15px] mb-3 animate-[popIn_0.4s_ease]" style={{ color: '#2e7d32' }}>{game.wheelPrize}</div>
        )}
        <button
          onClick={game.spinWheel}
          disabled={game.wheelSpinning}
          className="w-full h-[46px] rounded-full bg-[#ffd76a] border-[2.5px] border-black font-[900] text-[14px] hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {game.wheelSpinning ? 'Đang quay…' : game.daily.spinsLeft > 0 ? '🎡 Quay miễn phí' : (
            <>
              <Gem size={15} /> Quay thêm • 5 ngọc
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function WholesaleModal({ game }: { game: GardenGame }) {
  const [confirmRare, setConfirmRare] = useState(false)
  if (!game.wholesaleOpen) return null
  const mature = game.allPlants.filter((p) => p.plant.mature)
  const selected = mature.filter((p) => game.wholesaleSelected.has(`${p.area}:${p.slotId}`))
  const total = selected.reduce((sum, p) => sum + wholesalePriceOf(SPECIES[p.plant.species], p.plant.variant), 0)
  const hasRare = selected.some((p) => p.plant.variant === 'rare')
  const orderTotal = selected.reduce((sum, p) => sum + orderPriceOf(SPECIES[p.plant.species], p.plant.variant), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 bg-black/30 backdrop-blur-sm" onClick={() => game.setWholesaleOpen(false)}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[560px] rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease] max-h-[90vh] overflow-y-auto"
      >
        <div className="h-[62px] bg-[#ffd76a] border-b-[3px] border-black flex items-center justify-between px-5 sticky top-0 z-10">
          <div className="font-[900] leading-none" style={{ color: '#3e2723' }}>
            💰 Bán sỉ hàng loạt
            <div className="text-[11px] font-[700] opacity-70 mt-1">Bán sỉ = 60% giá theo đơn. Cây đột biến bán theo đơn sẽ lời hơn nhiều!</div>
          </div>
          <button onClick={() => game.setWholesaleOpen(false)} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">✕</button>
        </div>
        <div className="p-4">
          {mature.length === 0 && <p className="text-[12px] font-[600] opacity-60">Chưa có cây trưởng thành nào. Cây lớn xong sẽ hiện ở đây để chọn bán sỉ.</p>}
          <div className="space-y-2">
            {mature.map(({ area, slotId, plant }) => {
              const key = `${area}:${slotId}`
              const checked = game.wholesaleSelected.has(key)
              const species = SPECIES[plant.species]
              return (
                <label key={key} className={`flex items-center gap-3 rounded-[16px] border-[2px] border-black p-2 cursor-pointer ${checked ? 'bg-[#fff2a8]' : 'bg-white'}`}>
                  <input type="checkbox" checked={checked} onChange={() => game.toggleWholesale(key)} className="w-5 h-5 accent-[#2e7d32]" />
                  <SpeciesImg speciesKey={plant.species} variant={plant.variant} trait={plant.trait} size={44} showBadge={false} />
                  <div className="flex-1 min-w-0">
                    <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{species.name}</div>
                    <div className="flex gap-1 flex-wrap items-center">
                      <VariantTag variant={plant.variant} trait={plant.trait} />
                      <span className="text-[10px] font-[700] opacity-60">{area === 'care' ? 'Khu chăm sóc' : area === 'display' ? 'Vườn treo' : 'Bảo quản'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-[900] text-[13px] text-[#2e7d32]">{wholesalePriceOf(species, plant.variant)} xu</div>
                    <div className="text-[10px] font-[600] opacity-50 line-through">{orderPriceOf(species, plant.variant)} xu/đơn</div>
                  </div>
                </label>
              )
            })}
          </div>
          {selected.length > 0 && (
            <div className="mt-4 rounded-[16px] bg-[#fef9e7] border-[2.5px] border-black p-3">
              <div className="flex justify-between font-[900] text-[14px]" style={{ color: '#2e2e2e' }}>
                <span>Đã chọn {selected.length} cây</span>
                <span className="text-[#2e7d32]">+{total} xu</span>
              </div>
              <div className="text-[11px] font-[600] opacity-60 mt-1">Bán theo đơn sẽ được {orderTotal} xu — chênh {orderTotal - total} xu.{hasRare ? ' Bạn đã chọn cây đột biến hiếm, hãy chắc chắn nhé!' : ''}</div>
              {hasRare && !confirmRare ? (
                <button
                  onClick={() => setConfirmRare(true)}
                  className="mt-3 w-full h-[42px] rounded-full bg-[#ff9a8a] border-[2.5px] border-black font-[900] text-[13px]"
                >
                  ⚠️ Có cây đột biến hiếm — bấm lại để xác nhận bán sỉ
                </button>
              ) : (
                <button
                  onClick={() => {
                    game.sellWholesaleSelected()
                    setConfirmRare(false)
                  }}
                  className="mt-3 w-full h-[42px] rounded-full bg-[#a7d397] border-[2.5px] border-black font-[900] text-[13px]"
                >
                  💰 Bán sỉ {selected.length} cây • +{total} xu
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
