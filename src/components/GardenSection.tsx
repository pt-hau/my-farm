import { Gem, RotateCcw, Save, ShoppingBasket, TrendingUp } from 'lucide-react'
import type { GardenGame } from '../hooks/useGardenGame'
import { CharacterShopModal } from './CharacterShopModal'
import { GiftcodeModal } from './GiftcodeModal'
import { NurseryModal } from './NurseryModal'
import { MissionsPanel, OrdersPanel, WheelModal, WholesaleModal } from './Panels'
import { ResetModal } from './ResetModal'
import { ShopModal } from './ShopModal'
import { BabyStrip, CareArea, DisplayArea, LeafArea, SowArea, StorageArea, WalletChips } from './Zones'

export function GardenSection({ game }: { game: GardenGame }) {
  return (
    <section ref={game.refs.gardenSectionRef} className="relative py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-3 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2
              className="text-[30px] md:text-[40px] font-[900] leading-[0.9] tracking-tight"
              style={
                game.isDaytime
                  ? undefined
                  : { color: '#ffffff', textShadow: '2px 2px 0 #000, 0 6px 16px rgba(0,0,0,0.55)' }
              }
            >
              Vườn sen đá trên mây
            </h2>
            <p className="mt-2 font-[600] opacity-70 flex flex-wrap items-center gap-2">
              <span
                style={
                  game.isDaytime
                    ? undefined
                    : { color: '#ffffff', opacity: 1, textShadow: '1px 1px 0 #000, 0 4px 12px rgba(0,0,0,0.6)' }
                }
              >
                Gieo hạt • Chăm chậu • Treo vườn • Ươm lá • Lv.{game.level}
              </span>
              <span className="px-2 py-[2px] rounded-full bg-[#fff2a8] border-[2px] border-black text-[11px] font-[800]">
                {game.totalSlots} ô tất cả
              </span>
              <span className="px-2 py-[2px] rounded-full bg-[#c8f5a8] border-[2px] border-black text-[11px] font-[800] flex items-center gap-1">
                <TrendingUp size={12} /> Hôm nay: +{game.todayEarnings} xu
              </span>
              {game.lastSavedAt && (
                <span className="px-2 py-[2px] rounded-full bg-white border-[2px] border-black text-[11px] font-[700]">
                  Đã lưu lúc {game.lastSavedAt}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <WalletChips game={game} />
            <button
              onClick={() => game.setShopOpen(true)}
              style={{ color: '#3e2723' }}
              className="h-[40px] px-4 rounded-full bg-[var(--accent)] cartoon-border font-[800] text-[12px] flex items-center gap-2 hover:translate-y-[-1px] active:translate-y-[1px] light-card"
            >
              <ShoppingBasket size={14} /> Cửa hàng
            </button>
            <button
              onClick={() => game.setWholesaleOpen(true)}
              style={{ color: '#3e2723' }}
              className="h-[40px] px-4 rounded-full bg-[#ffd76a] cartoon-border font-[800] text-[12px] flex items-center gap-2 light-card"
            >
              💰 Bán sỉ
            </button>
            <button
              onClick={game.saveGame}
              style={{ color: '#ffffff' }}
              className="h-[40px] px-4 rounded-full bg-black text-white cartoon-border font-[800] text-[12px] flex items-center gap-2 hover:translate-y-[-1px] active:translate-y-[1px] force-white-text btn-dark action-btn"
            >
              <Save size={14} /> Lưu game
            </button>
            <button
              onClick={() => game.setCharacterShopOpen(true)}
              style={{ color: '#3e2723' }}
              className="h-[40px] px-4 rounded-full chx-purple cartoon-border font-[800] text-[12px] flex items-center gap-2 light-card"
            >
              👗 Nhân vật
            </button>
            <button
              onClick={() => game.setGiftcodeOpen(true)}
              style={{ color: '#3e2723' }}
              className="h-[40px] px-4 rounded-full chx-gold cartoon-border font-[800] text-[12px] flex items-center gap-2 light-card"
            >
              🎁 Giftcode
            </button>
            <button
              onClick={() => game.setResetConfirmOpen(true)}
              style={{ color: '#2e2e2e' }}
              className="h-[40px] px-4 rounded-full bg-white cartoon-border font-[800] text-[12px] flex items-center gap-2 light-card"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <OrdersPanel game={game} />
          <MissionsPanel game={game} />
        </div>

        <div className="space-y-4">
          <SowArea game={game} />
          <CareArea game={game} />
          <DisplayArea game={game} />
          <StorageArea game={game} />
          <LeafArea game={game} />
          <BabyStrip game={game} />
        </div>

        <div className="mt-4 rounded-[18px] bg-black/55 text-white px-4 py-3 text-[12px] font-[700] flex flex-wrap items-center gap-x-4 gap-y-1 force-white-text">
          <span>
            <Gem size={12} className="inline mr-1" /> Ngọc dùng để: nâng cấp chậu, mở rộng ô, tua nhanh thời gian, quay thêm vòng xoay.
          </span>
          <span>1 ngọc = 1.000 xu = 100 bọ khi bù thiếu.</span>
          <span>Giftcode mới: SENDA2026 (+10 ngọc).</span>
        </div>

        <ShopModal game={game} />
        <WheelModal game={game} />
        <WholesaleModal game={game} />
        <NurseryModal game={game} />
        <CharacterShopModal game={game} />
        <GiftcodeModal game={game} />
        <ResetModal game={game} />
      </div>
    </section>
  )
}
