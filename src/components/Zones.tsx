import { Coins, Gem, Leaf, Sprout } from 'lucide-react'
import type { ReactNode } from 'react'
import { BUG_TYPES, DECOR_ITEMS, POT_TIERS, SPECIES, SPECIES_KEYS, TIER_LABEL, fastForwardGemCost, formatRemaining, orderPriceOf, wholesalePriceOf } from '../data/species'
import { expandCostFor, type GardenGame } from '../hooks/useGardenGame'
import type { AreaId, PlantInstance, SpeciesKey } from '../types'
import { BabyMenu } from './BabyMenu'
import { BabySprite } from './BabySprite'
import { BugBadge, PotView, ProgressBar, SpeciesImg, VariantTag, growthProgress } from './SpeciesImg'

void TIER_LABEL

const BTN = 'h-[30px] px-2.5 rounded-full border-[2px] border-black font-[800] text-[11px] flex items-center justify-center gap-1 hover:translate-y-[-1px] active:translate-y-[1px] whitespace-nowrap'

function MiniBtn({
  children,
  onClick,
  className = 'bg-white',
  disabled,
  title,
}: {
  children: ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
  title?: string
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${BTN} ${className} ${disabled ? 'opacity-50' : ''}`}>
      {children}
    </button>
  )
}

function AreaShell({
  icon,
  title,
  hint,
  countLabel,
  area,
  game,
  extra,
  children,
}: {
  icon: string
  title: string
  hint: string
  countLabel: string
  area: AreaId
  game: GardenGame
  extra?: ReactNode
  children: ReactNode
}) {
  const cost = expandCostFor(area, game.counts[area])
  const maxed = game.counts[area] >= 24 && area === 'sow'
  return (
    <div className="rounded-[24px] cartoon-border bg-white/85 backdrop-blur-sm p-4 md:p-5 card-3d">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[22px]">{icon}</div>
        <div>
          <div className="font-[900] text-[17px] leading-none" style={{ color: '#2e2e2e' }}>{title}</div>
          <div className="text-[11px] font-[600] opacity-60 mt-1">{hint}</div>
        </div>
        <span className="ml-auto px-2 py-[2px] rounded-full bg-[#fef9e7] border-[2px] border-black text-[11px] font-[800]">{countLabel}</span>
        {extra}
        <MiniBtn
          onClick={() => game.expandArea(area)}
          className="bg-[var(--accent)]"
          title="Mở rộng thêm 1 ô (thiếu xu có thể bù bằng ngọc)"
        >
          ＋ Mở rộng • {cost} xu
        </MiniBtn>
        {maxed && <span className="text-[10px] font-[800]">Tối đa</span>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function PlantStatus({ plant, now }: { plant: PlantInstance; now: number }) {
  const species = SPECIES[plant.species]
  if (plant.bug) {
    return (
      <span className="text-[10px] font-[800] text-[#b3261e]">
        🐛 {BUG_TYPES[plant.bug].name} đang đậu — cây ngừng lớn!
      </span>
    )
  }
  if (plant.mature) return <span className="text-[10px] font-[800] text-[#2e7d32]">✅ Trưởng thành — bán được rồi!</span>
  return (
    <span className="text-[10px] font-[700] opacity-70">
      Còn {formatRemaining(plant.readyAt - now)} • {species.name}
    </span>
  )
}

function FastForwardBtn({ area, slotId, game, remainingMs }: { area: AreaId; slotId: number; game: GardenGame; remainingMs: number }) {
  if (remainingMs <= 0) return null
  const cost = fastForwardGemCost(remainingMs)
  return (
    <MiniBtn onClick={() => game.fastForward(area, slotId)} className="bg-[#e3f2ff]" title="Tua nhanh tới trưởng thành bằng ngọc">
      <Gem size={11} /> ⏩ {cost} ngọc
    </MiniBtn>
  )
}

/* ================= Khu gieo hạt (trên mặt đất) ================= */

export function SowArea({ game }: { game: GardenGame }) {
  const { now } = game
  return (
    <AreaShell
      icon="🌱"
      title="Khu gieo hạt"
      hint="Mỗi ô gieo 1 hạt. Hạt có tỉ lệ nảy mầm riêng, càng xịn càng thấp nhưng vẫn có lãi kỳ vọng nhờ cây đột biến. Cây nảy mầm xong thì ươm thành cây con rồi chuyển sang chăm sóc."
      countLabel={`${game.sowSlots.length} ô • ${game.sowSlots.filter((s) => s.phase !== 'empty').length} đang gieo`}
      area="sow"
      game={game}
      extra={
        <MiniBtn onClick={game.transferAllSprouts} className="bg-[#c8f5a8]">
          Chuyển tất cả cây con →
        </MiniBtn>
      }
    >
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SPECIES_KEYS.map((key) => {
          const count = game.seeds[key] ?? 0
          const species = SPECIES[key]
          const selected = game.selectedSeed === key
          return (
            <button
              key={key}
              onClick={() => game.setSelectedSeed(key)}
              title={`${species.name} • Nảy mầm ${Math.round(species.germRate * 100)}% • Đột biến thường ${species.mutCommonRate * 100}% • Đột biến hiếm ${species.mutRareRate * 100}%`}
              className={`shrink-0 flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border-[2px] border-black text-[11px] font-[800] ${selected ? 'bg-[#ffd76a]' : 'bg-white'} ${count === 0 ? 'opacity-50' : ''}`}
            >
              <img src={species.img} alt={species.name} className="w-7 h-7 object-contain" draggable={false} />
              {species.name}
              <span className="px-1 rounded-full bg-black text-white text-[9px]">×{count}</span>
            </button>
          )
        })}
      </div>
      <p className="text-[11px] font-[600] opacity-60 mb-3">
        Chọn loại hạt ở trên, rồi bấm vào ô trống để gieo. Hạt đã chọn:{' '}
        <b>{game.selectedSeed ? SPECIES[game.selectedSeed].name : 'chưa chọn'}</b>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {game.sowSlots.map((slot) => {
          const species = slot.seed ? SPECIES[slot.seed] : null
          return (
            <div
              key={slot.id}
              className="rounded-[18px] border-[2.5px] border-black bg-[#f7e8c8] p-2.5 min-h-[128px] flex flex-col items-center justify-center gap-1.5 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #fdf6e3 0%, #f0d9a8 100%)' }}
            >
              {slot.phase === 'empty' && (
                <>
                  <button
                    onClick={() => game.sowSeed(slot.id)}
                    className="w-10 h-10 rounded-full bg-[#a7d397] border-[2.5px] border-black text-[20px] font-[900] hover:scale-110 transition"
                    title="Gieo hạt đã chọn"
                  >
                    ＋
                  </button>
                  <div className="text-[10px] font-[800] opacity-70">Ô trống — bấm để gieo</div>
                </>
              )}
              {slot.phase === 'germinating' && species && (
                <>
                  <div className="text-[26px] animate-[bounceSoft_2s_ease-in-out_infinite]">🌰</div>
                  <div className="font-[900] text-[12px]" style={{ color: '#2e2e2e' }}>{species.name}</div>
                  <div className="text-[10px] font-[700] opacity-70">Đang chờ nảy mầm… {formatRemaining(slot.germinateAt - now)}</div>
                  <FastForwardBtn area="sow" slotId={slot.id} game={game} remainingMs={slot.readyAt - now} />
                </>
              )}
              {slot.phase === 'sprouted' && species && slot.seed && (
                <>
                  <SpeciesImg speciesKey={slot.seed} variant={slot.variant} trait={slot.trait} size={52} progress={0.7} />
                  <div className="font-[900] text-[12px] leading-tight" style={{ color: '#2e2e2e' }}>{species.name}</div>
                  <VariantTag variant={slot.variant} trait={slot.trait} />
                  {now >= slot.readyAt ? (
                    <>
                      <div className="text-[10px] font-[800] text-[#2e7d32]">🌱 Cây con sẵn sàng!</div>
                      <div className="flex gap-1 flex-wrap justify-center">
                        <MiniBtn onClick={() => game.transferSprout(slot.id)} className="bg-[#c8f5a8]">Chuyển → chăm sóc</MiniBtn>
                        <MiniBtn onClick={() => game.clearSowSlot(slot.id)} className="bg-[#ffd0d0]">Tiêu hủy</MiniBtn>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[10px] font-[700] opacity-70">Đang ươm… {formatRemaining(slot.readyAt - now)}</div>
                      <FastForwardBtn area="sow" slotId={slot.id} game={game} remainingMs={slot.readyAt - now} />
                    </>
                  )}
                </>
              )}
              {slot.phase === 'failed' && species && (
                <>
                  <div className="text-[26px]">🥀</div>
                  <div className="font-[900] text-[12px]" style={{ color: '#2e2e2e' }}>Hạt {species.name} hỏng rồi</div>
                  <div className="text-[10px] font-[600] opacity-60">Không nảy mầm, gieo hạt khác nhé</div>
                  <MiniBtn onClick={() => game.clearSowSlot(slot.id)} className="bg-white">Dọn ô</MiniBtn>
                </>
              )}
            </div>
          )
        })}
      </div>
    </AreaShell>
  )
}

/* ================= Khu chăm sóc (mặt đất + kệ) ================= */

function CareCard({ slotId, game }: { slotId: number; game: GardenGame }) {
  const slot = game.careSlots.find((s) => s.id === slotId)
  if (!slot) return null
  const plant = slot.plant
  const potIdx = POT_TIERS.findIndex((p) => p.id === slot.pot)
  const nextPot = POT_TIERS[potIdx + 1]
  const progress = plant ? growthProgress(plant, game.now) : 0
  return (
    <div className="rounded-[18px] border-[2.5px] border-black bg-white p-2.5 min-h-[218px] flex flex-col items-center gap-1.5 text-center relative">
      {plant?.bug && (
        <div className="absolute top-2 right-2 z-20">
          <BugBadge bug={plant.bug} onCatch={() => game.catchBug('care', slot.id)} label={SPECIES[plant.species].name} />
        </div>
      )}
      {plant ? (
        <>
          <SpeciesImg speciesKey={plant.species} variant={plant.variant} trait={plant.trait} size={64} progress={progress} />
          <div className="font-[900] text-[12px] leading-tight" style={{ color: '#2e2e2e' }}>{SPECIES[plant.species].name}</div>
          <VariantTag variant={plant.variant} trait={plant.trait} />
          <div className="w-full px-1">
            <ProgressBar progress={progress} color={plant.mature ? '#ffb300' : '#7fbb6a'} />
          </div>
          <PlantStatus plant={plant} now={game.now} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 opacity-60">
          <div className="text-[24px]">🪴</div>
          <div className="text-[10px] font-[800]">Chậu trống</div>
        </div>
      )}
      <PotView pot={slot.pot} width={64} />
      <div className="flex gap-1 flex-wrap justify-center">
        {nextPot ? (
          <MiniBtn
            onClick={() => game.upgradePot(slot.id)}
            className="bg-[#ffe08a]"
            title={`Nâng lên ${nextPot.name}: ${nextPot.coins} xu${nextPot.bugs ? ` + ${nextPot.bugs} bọ` : ''}, thiếu bù bằng ngọc. Giảm ${Math.round(nextPot.bonus * 100)}% thời gian.`}
          >
            ⬆️ {nextPot.name} • {nextPot.coins} xu{nextPot.bugs ? ` +${nextPot.bugs}🐞` : ''}
          </MiniBtn>
        ) : (
          <span className="text-[10px] font-[900] text-[#4da3ff]">💎 Chậu tối đa</span>
        )}
      </div>
      {plant && (
        <div className="flex gap-1 flex-wrap justify-center">
          <MiniBtn onClick={() => game.moveCareToDisplay(slot.id)} className="bg-[#ffe4f1]">🌸 Trưng bày</MiniBtn>
          <MiniBtn onClick={() => game.moveToStorage('care', slot.id)} className="bg-[#e3f2ff]" disabled={!plant.mature} title="Chỉ cây trưởng thành mới vào bảo quản">📦 Bảo quản</MiniBtn>
          {plant.mature && (
            <MiniBtn onClick={() => game.sellPlant('care', slot.id)} className="bg-[#ffd76a]">
              💰 Bán sỉ {wholesalePriceOf(SPECIES[plant.species], plant.variant)} xu
            </MiniBtn>
          )}
          {!plant.mature && (
            <FastForwardBtn area="care" slotId={slot.id} game={game} remainingMs={plant.bug ? plant.remainingMs : Math.max(0, plant.readyAt - game.now)} />
          )}
          <MiniBtn onClick={() => game.destroyPlant('care', slot.id)} className="bg-[#ffd0d0]">🗑️</MiniBtn>
        </div>
      )}
    </div>
  )
}

export function CareArea({ game }: { game: GardenGame }) {
  const ground = game.careSlots.slice(0, 4)
  const shelves = game.careSlots.slice(4)
  const shelfRows: typeof shelves[] = []
  for (let i = 0; i < shelves.length; i += 4) shelfRows.push(shelves.slice(i, i + 4))
  return (
    <AreaShell
      icon="🪴"
      title="Khu chăm sóc"
      hint="Chậu càng xịn cây càng lớn nhanh. Bọ sẽ đậu lên cây đang lớn và làm cây ngừng lớn — bấm vào bọ để bắt, bọ dùng để nâng cấp chậu. Cây trưởng thành thì bán, trưng bày hoặc cất vào bảo quản."
      countLabel={`${game.careSlots.length} chậu • ${game.careSlots.filter((s) => s.plant).length} đang trồng`}
      area="care"
      game={game}
    >
      <div className="rounded-[18px] p-3" style={{ background: 'linear-gradient(180deg, #c8ecb0 0%, #9ed68a 100%)' }}>
        <div className="text-[11px] font-[900] mb-2" style={{ color: '#2e5a1e' }}>🌍 HÀNG DƯỚI ĐẤT</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ground.map((s) => (
            <CareCard key={s.id} slotId={s.id} game={game} />
          ))}
        </div>
      </div>
      {shelfRows.map((row, ri) => (
        <div key={ri} className="mt-4 rounded-[18px] p-3 pb-4" style={{ background: 'linear-gradient(180deg, #b07a4e 0%, #8a5a35 100%)' }}>
          <div className="text-[11px] font-[900] mb-2 text-white" style={{ textShadow: '1px 1px 0 #000' }}>🪵 KỆ {ri + 1}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {row.map((s) => (
              <CareCard key={s.id} slotId={s.id} game={game} />
            ))}
          </div>
          <div className="h-[10px] mt-3 rounded-full bg-[#5d3a1e] border-[2px] border-black/60" />
        </div>
      ))}
      {shelves.length === 0 && (
        <p className="text-[11px] font-[600] opacity-60 mt-2">Mở rộng thêm chậu để mở kệ gỗ phía trên nhé!</p>
      )}
    </AreaShell>
  )
}

/* ================= Khu trưng bày (vườn treo) ================= */

export function DisplayArea({ game }: { game: GardenGame }) {
  const { now } = game
  const decor = game.decorOwned
  return (
    <AreaShell
      icon="🌸"
      title="Khu trưng bày — Vườn treo"
      hint="Chỉ để ngắm cho đẹp, cây vẫn lớn bình thường và rụng lá để ươm. Cây trưởng thành rụng 1 lá mỗi đợt (tùy độ VIP), thu lá đem ươm thành cây giống. Đồ trang trí mua ở cửa hàng sẽ hiện lên giàn treo."
      countLabel={`${game.displaySlots.length} chỗ treo • ${game.displaySlots.filter((s) => s.plant).length} đang treo`}
      area="display"
      game={game}
    >
      <div className="rounded-[18px] p-3 pt-1 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #bfeaff 0%, #e8f9d8 55%, #c8ecb0 100%)' }}>
        <div className="h-[12px] rounded-full bg-[#8a5a35] border-[2.5px] border-black mx-2" />
        <div className="flex justify-between px-3 text-[20px] -mt-1">
          <span>{decor.includes('curtain') ? '🎀' : '🌿'}</span>
          <span>{decor.includes('lantern') ? '🏮' : '✨'}</span>
          <span>{decor.includes('vine') ? '🌿🌿' : '🌸'}</span>
          <span>{decor.includes('hangingPot') ? '🪴' : '✨'}</span>
          <span>{decor.includes('hook') ? '🪝' : '🌿'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {game.displaySlots.map((slot, i) => {
            const plant = slot.plant
            const species = plant ? SPECIES[plant.species] : null
            const progress = plant ? growthProgress(plant, now) : 0
            return (
              <div key={slot.id} className="flex flex-col items-center">
                <div className="flex gap-6">
                  <div className="w-[3px] h-[18px] bg-[#8a5a35] rounded" />
                  <div className="w-[3px] h-[18px] bg-[#8a5a35] rounded" />
                </div>
                <div
                  className="rounded-[18px] border-[2.5px] border-black bg-white/95 p-2.5 w-full min-h-[196px] flex flex-col items-center gap-1.5 text-center relative origin-top"
                  style={{ animation: `sway ${3.2 + (i % 3) * 0.5}s ease-in-out infinite` }}
                >
                  {plant?.bug && (
                    <div className="absolute top-2 right-2 z-20">
                      <BugBadge bug={plant.bug} onCatch={() => game.catchBug('display', slot.id)} label={species?.name ?? ''} />
                    </div>
                  )}
                  {plant && species ? (
                    <>
                      <SpeciesImg speciesKey={plant.species} variant={plant.variant} trait={plant.trait} size={62} progress={progress} />
                      <div className="font-[900] text-[12px] leading-tight" style={{ color: '#2e2e2e' }}>{species.name}</div>
                      <VariantTag variant={plant.variant} trait={plant.trait} />
                      <div className="w-full px-1">
                        <ProgressBar progress={progress} color={plant.mature ? '#ff9ecb' : '#7fbb6a'} />
                      </div>
                      <PlantStatus plant={plant} now={now} />
                      {plant.mature && (
                        <div className="text-[10px] font-[700] opacity-70">
                          🍃 Rụng lá sau {formatRemaining(Math.max(0, slot.leafNextAt - now))} • Đang chờ thu: {slot.leavesReady}/3
                        </div>
                      )}
                      {slot.leavesReady > 0 && (
                        <MiniBtn onClick={() => game.collectLeaves(slot.id)} className="bg-[#c8f5a8]">
                          <Leaf size={11} /> Thu {slot.leavesReady} lá
                        </MiniBtn>
                      )}
                      <div className="flex gap-1 flex-wrap justify-center">
                        <MiniBtn onClick={() => game.moveDisplayToCare(slot.id)} className="bg-[#e3f2ff]">🪴 Về chăm sóc</MiniBtn>
                        <MiniBtn onClick={() => game.moveToStorage('display', slot.id)} className="bg-[#fff2a8]" disabled={!plant.mature}>📦 Bảo quản</MiniBtn>
                        {plant.mature && (
                          <MiniBtn onClick={() => game.sellPlant('display', slot.id)} className="bg-[#ffd76a]">
                            💰 Bán sỉ {wholesalePriceOf(species, plant.variant)} xu
                          </MiniBtn>
                        )}
                        {!plant.mature && (
                          <FastForwardBtn area="display" slotId={slot.id} game={game} remainingMs={plant.bug ? plant.remainingMs : Math.max(0, plant.readyAt - now)} />
                        )}
                        <MiniBtn onClick={() => game.destroyPlant('display', slot.id)} className="bg-[#ffd0d0]">🗑️</MiniBtn>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-1 opacity-60">
                      <div className="text-[26px]">{decor.includes('hook') ? '🪝' : '🪴'}</div>
                      <div className="text-[10px] font-[800]">Chỗ treo trống</div>
                      <div className="text-[9px] font-[600]">Đưa cây từ khu chăm sóc lên</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-[700] opacity-70">
          <span>Đồ trang trí đã có: {decor.length === 0 ? 'chưa có — mua ở cửa hàng nhé!' : DECOR_ITEMS.filter((d) => decor.includes(d.id)).map((d) => `${d.icon} ${d.name}`).join(' • ')}</span>
        </div>
      </div>
    </AreaShell>
  )
}

/* ================= Khu bảo quản (kệ) ================= */

export function StorageArea({ game }: { game: GardenGame }) {
  return (
    <AreaShell
      icon="📦"
      title="Khu bảo quản"
      hint="Chừa cây trưởng thành cho đơn hàng: cây trong này không lớn thêm và không bị bán sỉ nhầm. Đơn hàng giao cây sẽ lấy cây ở đây trước."
      countLabel={`${game.storageSlots.length} ngăn • ${game.storageSlots.filter((s) => s.plant).length} đang cất`}
      area="storage"
      game={game}
    >
      <div className="rounded-[18px] p-3" style={{ background: 'linear-gradient(180deg, #c9a06a 0%, #a97a48 100%)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {game.storageSlots.map((slot) => {
            const plant = slot.plant
            return (
              <div key={slot.id} className="rounded-[18px] border-[2.5px] border-black bg-white p-2.5 min-h-[168px] flex flex-col items-center gap-1.5 text-center">
                {plant ? (
                  <>
                    <SpeciesImg speciesKey={plant.species} variant={plant.variant} trait={plant.trait} size={60} />
                    <div className="font-[900] text-[12px] leading-tight" style={{ color: '#2e2e2e' }}>{SPECIES[plant.species].name}</div>
                    <VariantTag variant={plant.variant} trait={plant.trait} />
                    <span className="px-2 py-[1px] rounded-full bg-[#fff2a8] border-[2px] border-black text-[9px] font-[900]">CHỜ GIAO ĐƠN • {orderPriceOf(SPECIES[plant.species], plant.variant)} xu/đơn</span>
                    <div className="flex gap-1 flex-wrap justify-center">
                      <MiniBtn onClick={() => game.moveFromStorage(slot.id, 'care')} className="bg-[#e3f2ff]">🪴 Ra chăm sóc</MiniBtn>
                      <MiniBtn onClick={() => game.moveFromStorage(slot.id, 'display')} className="bg-[#ffe4f1]">🌸 Ra trưng bày</MiniBtn>
                      <MiniBtn onClick={() => game.sellPlant('storage', slot.id)} className="bg-[#ffd76a]">💰 Bán sỉ</MiniBtn>
                      <MiniBtn onClick={() => game.destroyPlant('storage', slot.id)} className="bg-[#ffd0d0]">🗑️</MiniBtn>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-1 opacity-60">
                    <div className="text-[24px]">📦</div>
                    <div className="text-[10px] font-[800]">Ngăn trống</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="h-[10px] mt-3 rounded-full bg-[#5d3a1e] border-[2px] border-black/60" />
      </div>
    </AreaShell>
  )
}

/* ================= Khu ươm lá ================= */

export function LeafArea({ game }: { game: GardenGame }) {
  const { now } = game
  const groups = new Map<string, { speciesKey: SpeciesKey; variant: PlantInstance['variant']; trait: PlantInstance['trait']; ids: string[] }>()
  game.leaves.forEach((leaf) => {
    const key = `${leaf.species}-${leaf.variant}-${leaf.trait ?? ''}`
    const g = groups.get(key) ?? { speciesKey: leaf.species, variant: leaf.variant, trait: leaf.trait, ids: [] }
    g.ids.push(leaf.id)
    groups.set(key, g)
  })
  return (
    <AreaShell
      icon="🍃"
      title="Khu ươm lá"
      hint="Lá rụng từ cây trưng bày đem ươm thành cây giống, tỉ lệ nảy mầm cao hơn hạt 20%. Lá từ cây đột biến giữ lại biến thể với tỉ lệ cao. Chọn lá trong kho rồi bấm ô trống để ươm."
      countLabel={`${game.leafSlots.length} ô ươm • ${game.leaves.length} lá trong kho`}
      area="leaf"
      game={game}
    >
      <div className="flex gap-2 overflow-x-auto pb-2">
        {groups.size === 0 && <span className="text-[11px] font-[600] opacity-60">Chưa có lá nào — cây trưởng thành ở vườn treo sẽ rụng lá theo thời gian.</span>}
        {[...groups.values()].map((g) => {
          const species = SPECIES[g.speciesKey]
          const selected = g.ids.includes(game.selectedLeafId ?? '')
          return (
            <button
              key={g.ids[0]}
              onClick={() => game.setSelectedLeafId(g.ids[0])}
              className={`shrink-0 flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border-[2px] border-black text-[11px] font-[800] ${selected ? 'bg-[#c8f5a8]' : 'bg-white'}`}
              title={`Lá ${species.name} • Nảy mầm ${Math.round(Math.min(0.95, species.germRate + 0.2) * 100)}%`}
            >
              <span className="text-[16px]">🍃</span>
              {species.name}
              <VariantTag variant={g.variant} trait={g.trait} />
              <span className="px-1 rounded-full bg-black text-white text-[9px]">×{g.ids.length}</span>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {game.leafSlots.map((slot) => {
          const species = slot.leaf ? SPECIES[slot.leaf.species] : null
          return (
            <div key={slot.id} className="rounded-[18px] border-[2.5px] border-black bg-[#eef7e6] p-2.5 min-h-[138px] flex flex-col items-center justify-center gap-1.5 text-center">
              {!slot.leaf && !slot.failed && (
                <>
                  <button
                    onClick={() => game.plantLeaf(slot.id)}
                    disabled={!game.selectedLeafId}
                    className="w-10 h-10 rounded-full bg-[#c8f5a8] border-[2.5px] border-black text-[18px] font-[900] hover:scale-110 transition disabled:opacity-40"
                    title="Ươm lá đã chọn"
                  >
                    🍃
                  </button>
                  <div className="text-[10px] font-[800] opacity-70">Ô trống — chọn lá rồi bấm để ươm</div>
                </>
              )}
              {slot.failed && (
                <>
                  <div className="text-[26px]">🥀</div>
                  <div className="text-[10px] font-[800]">Lá ươm hỏng</div>
                  <MiniBtn onClick={() => game.clearLeafSlot(slot.id)} className="bg-white">Dọn ô</MiniBtn>
                </>
              )}
              {slot.leaf && species && !slot.failed && (
                <>
                  {now >= slot.readyAt && slot.willGerminate ? (
                    <>
                      <SpeciesImg speciesKey={slot.leaf.species} variant={slot.variant} trait={slot.trait} size={52} progress={0.8} />
                      <div className="font-[900] text-[12px] leading-tight" style={{ color: '#2e2e2e' }}>{species.name}</div>
                      <VariantTag variant={slot.variant} trait={slot.trait} />
                      <div className="text-[10px] font-[800] text-[#2e7d32]">🌱 Thành cây giống!</div>
                      <MiniBtn onClick={() => game.transferLeafSeedling(slot.id)} className="bg-[#c8f5a8]">Chuyển → chăm sóc</MiniBtn>
                    </>
                  ) : (
                    <>
                      <div className="text-[26px] animate-[leafWiggle_2s_ease-in-out_infinite]">🍃</div>
                      <div className="font-[900] text-[12px]" style={{ color: '#2e2e2e' }}>Lá {species.name}</div>
                      <div className="text-[10px] font-[700] opacity-70">Đang ươm… {formatRemaining(slot.readyAt - now)}</div>
                      <FastForwardBtn area="leaf" slotId={slot.id} game={game} remainingMs={slot.readyAt - now} />
                    </>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[11px] font-[600] opacity-60 mt-2">
        Thời gian rụng 1 lá: phổ thông 15 phút • khá 30 phút • xịn 1 tiếng • VIP 2 tiếng. Mỗi cây tối đa 3 lá chờ thu.
      </p>
    </AreaShell>
  )
}

/* ================= Góc nhà trẻ ================= */

export function BabyStrip({ game }: { game: GardenGame }) {
  return (
    <div className="rounded-[24px] cartoon-border bg-white/85 backdrop-blur-sm p-4 md:p-5 card-3d">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[22px]">👶</div>
        <div>
          <div className="font-[900] text-[17px] leading-none" style={{ color: '#2e2e2e' }}>Góc nhà trẻ</div>
          <div className="text-[11px] font-[600] opacity-60 mt-1">Các bé tự đi lại, vui và no thì đẻ xu mỗi 30 giây. Bấm vào bé để chăm.</div>
        </div>
        <MiniBtn onClick={() => game.setNurseryOpen(true)} className="ml-auto bg-[#ffb3d9]">👶 Mở nhà trẻ • {game.babies.length}/2 bé</MiniBtn>
      </div>
      <div className="relative h-[230px] mt-3 rounded-[18px] border-[2.5px] border-black overflow-hidden" style={{ background: 'linear-gradient(180deg, #d8f3c0 0%, #a7d397 70%, #8fcf7a 100%)' }}>
        <div className="absolute bottom-0 left-0 right-0 h-[26px] bg-[#8a5a35] border-t-[2.5px] border-black opacity-80" />
        {game.babies.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
            <div className="text-[30px]">🧸</div>
            <div className="text-[12px] font-[800] opacity-70">Chưa có bé nào — mở nhà trẻ nhận nuôi nhé!</div>
          </div>
        )}
        {game.babies.map((baby) => (
          <BabySprite key={baby.id} baby={baby} onOpenMenu={game.openBabyMenu} />
        ))}
        {game.babyMenu &&
          game.babies
            .filter((b) => b.id === game.babyMenu?.babyId)
            .map((baby) => (
              <BabyMenu
                key={baby.id}
                baby={baby}
                onClose={() => game.setBabyMenu(null)}
                onFeed={game.feedBaby}
                onClean={game.cleanBaby}
                onHug={game.hugBaby}
              />
            ))}
      </div>
    </div>
  )
}

export function WalletChips({ game }: { game: GardenGame }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white cartoon-border-sm font-[800] text-[12px] ${game.walletBump ? 'animate-[walletBump_0.5s_ease]' : ''}`}>
        <Coins size={14} /> {game.coins} xu
      </span>
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white cartoon-border-sm font-[800] text-[12px]">
        🐞 {game.bugs} bọ
      </span>
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white cartoon-border-sm font-[800] text-[12px]">
        <Gem size={14} /> {game.gems} ngọc
      </span>
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white cartoon-border-sm font-[800] text-[12px]">
        <Sprout size={14} /> Hôm nay: +{game.todayEarnings} xu
      </span>
    </div>
  )
}
