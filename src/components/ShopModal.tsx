import { useState } from 'react'
import { DECOR_ITEMS, NETS, POT_TIERS, SHOP_MUTANT_KEYS, SPECIES, SPECIES_KEYS, TIER_COLOR, TIER_LABEL, expectedSeedValue, formatDuration, totalSeconds } from '../data/species'
import type { GardenGame } from '../hooks/useGardenGame'
import type { VariantTrait } from '../types'
import { SpeciesImg, VariantTag } from './SpeciesImg'

type Tab = 'seeds' | 'seedlings' | 'pots' | 'decor'

function rollTrait(): VariantTrait {
  return (['var', 'color', 'crest'] as const)[Math.floor(Math.random() * 3)]
}

export function ShopModal({ game }: { game: GardenGame }) {
  const [tab, setTab] = useState<Tab>('seeds')
  if (!game.shopOpen) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'seeds', label: '🌱 Hạt giống' },
    { id: 'seedlings', label: '🪴 Cây giống' },
    { id: 'pots', label: '🪴 Chậu & vợt' },
    { id: 'decor', label: '🎀 Trang trí' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 bg-black/30 backdrop-blur-sm" onClick={() => game.setShopOpen(false)}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[880px] rounded-[28px] bg-white cartoon-border overflow-hidden animate-[popIn_0.4s_ease] max-h-[90vh] overflow-y-auto"
      >
        <div className="h-[62px] bg-[#a7d397] border-b-[3px] border-black flex items-center justify-between px-5 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white cartoon-border-sm flex items-center justify-center text-[20px]">🏪</div>
            <div>
              <div className="font-[900] leading-none" style={{ color: '#3e2723' }}>Cửa hàng vườn sen đá</div>
              <div className="text-[11px] font-[700] opacity-70" style={{ color: '#3e2723' }}>
                {game.coins} xu • {game.bugs} bọ • {game.gems} ngọc • Hạt vẫn có lãi kỳ vọng dù nảy mầm thấp
              </div>
            </div>
          </div>
          <button onClick={() => game.setShopOpen(false)} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">✕</button>
        </div>

        <div className="flex gap-2 px-4 pt-4 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`h-[36px] px-4 rounded-full border-[2.5px] border-black font-[800] text-[12px] ${tab === t.id ? 'bg-[#ffd76a]' : 'bg-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'seeds' && (
            <>
              <p className="text-[11px] font-[600] opacity-60 mb-3">
                Cây càng xịn thì tỉ lệ nảy mầm càng thấp, nhưng giá bán và tỉ lệ đột biến bù lại. Mua 5 hạt giảm 10%.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SPECIES_KEYS.map((key) => {
                  const s = SPECIES[key]
                  return (
                    <div key={key} className="rounded-[20px] border-[2.5px] border-black p-3 flex gap-3 bg-[#fef9e7]">
                      <SpeciesImg speciesKey={key} size={64} showBadge={false} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{s.name}</span>
                          <span className="px-1.5 py-[1px] rounded-full text-[9px] font-[900] text-white" style={{ background: TIER_COLOR[s.tier] }}>{TIER_LABEL[s.tier]}</span>
                        </div>
                        <div className="text-[10px] font-[600] opacity-60 italic">{s.latin}</div>
                        <div className="text-[10px] font-[700] mt-1 leading-[1.5]">
                          🌱 Nảy mầm {Math.round(s.germRate * 100)}% • 🌟 ĐB thường {s.mutCommonRate * 100}% • ✨ ĐB hiếm {s.mutRareRate * 100}%
                          <br />
                          ⏱️ Tổng {formatDuration(totalSeconds(s))} • 💰 Lãi kỳ vọng ~{expectedSeedValue(s)} xu/hạt
                        </div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          <button onClick={() => game.buySeeds(key, 1)} className="h-[32px] px-3 rounded-full bg-[#a7d397] border-[2px] border-black font-[900] text-[11px]">Mua 1 • {s.seedPrice} xu</button>
                          <button onClick={() => game.buySeeds(key, 5)} className="h-[32px] px-3 rounded-full bg-[#ffd76a] border-[2px] border-black font-[900] text-[11px]">Mua 5 • {Math.floor(s.seedPrice * 5 * 0.9)} xu</button>
                          <span className="h-[32px] px-2 rounded-full bg-white border-[2px] border-black font-[800] text-[11px] flex items-center">Đang có ×{game.seeds[key] ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'seedlings' && (
            <>
              <div className="rounded-[14px] bg-[#fff8e1] border-[2.5px] border-dashed border-black p-3 text-[11px] font-[600] leading-[1.5] mb-3" style={{ color: '#3e2723' }}>
                🌟 <b>Chỉ bán vài loại cây đột biến thường</b> để giữ độ hiếm: 3 loài dưới đây, mỗi loài 1 cây/ngày, giá gấp 3 cây giống thường. <b>Biến thể hiếm không bán</b>, chỉ có được nhờ đột biến khi gieo hạt hoặc ươm lá từ cây đột biến. Cây giống mua xong được trồng ngay vào chậu trống trong khu chăm sóc.
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                {SHOP_MUTANT_KEYS.map((key) => {
                  const s = SPECIES[key]
                  const stock = game.daily.mutantStock[key] ?? 0
                  return (
                    <div key={key} className="rounded-[20px] border-[3px] border-black p-3 flex flex-col items-center gap-1.5 text-center" style={{ background: 'linear-gradient(160deg, #fff8e1, #ffe9a8)' }}>
                      <SpeciesImg speciesKey={key} variant="common" trait="var" size={72} />
                      <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{s.name}</div>
                      <VariantTag variant="common" trait="var" />
                      <div className="text-[10px] font-[600] opacity-60">Biến thể ngẫu nhiên: Var lá / Màu lá / Crest đỉnh</div>
                      <button
                        onClick={() => game.buySeedling(key, 'common', rollTrait())}
                        disabled={stock <= 0}
                        className={`h-[34px] px-4 rounded-full border-[2.5px] border-black font-[900] text-[11px] ${stock > 0 ? 'bg-[#ffd76a] hover:translate-y-[-1px]' : 'bg-gray-200 opacity-60'}`}
                      >
                        {stock > 0 ? `Mua • ${s.seedlingPrice * 3} xu (còn ${stock})` : 'Hết hàng hôm nay'}
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="font-[900] text-[14px] mb-2" style={{ color: '#2e2e2e' }}>Cây giống thường — tất cả 20 loài</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {SPECIES_KEYS.map((key) => {
                  const s = SPECIES[key]
                  return (
                    <div key={key} className="rounded-[20px] border-[2.5px] border-black p-3 flex gap-3 bg-white">
                      <SpeciesImg speciesKey={key} size={54} showBadge={false} />
                      <div className="flex-1 min-w-0">
                        <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{s.name}</div>
                        <div className="text-[10px] font-[700] opacity-70">Bán theo đơn khi trưởng thành: {s.sellPrice} xu • Tổng thời gian {formatDuration(totalSeconds(s))}</div>
                        <button onClick={() => game.buySeedling(key, 'normal', null)} className="mt-2 h-[32px] px-3 rounded-full bg-[#a7d397] border-[2px] border-black font-[900] text-[11px]">
                          Mua & trồng • {s.seedlingPrice} xu
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'pots' && (
            <>
              <div className="rounded-[14px] bg-[#eef7e6] border-[2.5px] border-dashed border-black p-3 text-[11px] font-[600] leading-[1.5] mb-3" style={{ color: '#3e2723' }}>
                🪴 <b>Thang chậu:</b> chậu nâng cấp giúp cây lớn nhanh hơn. Nâng cấp từng chậu ngay trong khu chăm sóc (nút ⬆️ dưới mỗi chậu). Đồng/bạc/vàng mua bằng xu; ngọc bích/kim cương cần thêm bọ — thiếu xu/bọ có thể bù bằng ngọc (1 ngọc = 1.000 xu = 100 bọ).
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {POT_TIERS.map((pot) => (
                  <div key={pot.id} className="rounded-[20px] border-[2.5px] border-black p-3 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-[38px] h-[26px] rounded-[6px] border-[2px] border-black" style={{ background: `linear-gradient(180deg, ${pot.colors[0]}, ${pot.colors[1]})` }} />
                      <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{pot.name}</div>
                    </div>
                    <div className="text-[11px] font-[700] mt-2">Giảm {Math.round(pot.bonus * 100)}% thời gian chăm sóc</div>
                    <div className="text-[11px] font-[600] opacity-60">Nâng cấp: {pot.coins === 0 ? 'Chậu mặc định' : `${pot.coins} xu${pot.bugs ? ` + ${pot.bugs} bọ` : ''}`}</div>
                  </div>
                ))}
              </div>
              <div className="font-[900] text-[14px] mb-2" style={{ color: '#2e2e2e' }}>Vợt bắt bọ — vợt càng tốt, bắt bọ càng được nhiều bọ</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {NETS.map((net) => {
                  const owned = game.netsOwned.includes(net.id)
                  const isBest = game.bestNet.id === net.id
                  return (
                    <div key={net.id} className={`rounded-[20px] border-[2.5px] border-black p-3 ${owned ? 'bg-[#c8f5a8]' : 'bg-white'}`}>
                      <div className="text-[24px]">🥅</div>
                      <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{net.name}</div>
                      <div className="text-[11px] font-[700]">Bắt bọ ×{net.mult} bọ thưởng{isBest ? ' • Đang dùng' : ''}</div>
                      {owned ? (
                        <div className="mt-2 h-[32px] rounded-full bg-black text-white font-[800] text-[11px] flex items-center justify-center">Đã sở hữu ✓</div>
                      ) : (
                        <button onClick={() => game.buyNet(net.id)} className="mt-2 h-[32px] px-3 rounded-full bg-[#ffd76a] border-[2px] border-black font-[900] text-[11px]">Mua • {net.price} xu</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'decor' && (
            <>
              <p className="text-[11px] font-[600] opacity-60 mb-3">Chỉ để trang trí khu trưng bày cho đẹp — rèm, móc treo, đèn lồng, dây leo… không ảnh hưởng chỉ số cây.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DECOR_ITEMS.map((item) => {
                  const owned = game.decorOwned.includes(item.id)
                  return (
                    <div key={item.id} className={`rounded-[20px] border-[2.5px] border-black p-3 ${owned ? 'bg-[#c8f5a8]' : 'bg-white'}`}>
                      <div className="text-[30px]">{item.icon}</div>
                      <div className="font-[900] text-[13px]" style={{ color: '#2e2e2e' }}>{item.name}</div>
                      <div className="text-[11px] font-[600] opacity-70">{item.desc}</div>
                      {owned ? (
                        <div className="mt-2 h-[32px] rounded-full bg-black text-white font-[800] text-[11px] flex items-center justify-center">Đã mua ✓ Đang trưng bày</div>
                      ) : (
                        <button onClick={() => game.buyDecor(item.id, item.price)} className="mt-2 h-[32px] px-3 rounded-full bg-[#ffd76a] border-[2px] border-black font-[900] text-[11px]">Mua • {item.price} xu</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
