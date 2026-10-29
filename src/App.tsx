import { AboutCards } from './components/AboutCards'
import { Footer } from './components/Footer'
import { GardenSection } from './components/GardenSection'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SkyScene } from './components/SkyScene'
import { Toast } from './components/Toast'
import { DEFAULT_CHARACTER_IMG } from './data/characters'
import { useGardenGame } from './hooks/useGardenGame'

export default function App() {
  const game = useGardenGame()

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--accent)]">
      <div
        className="w-full min-h-screen overflow-x-clip relative"
        style={{
          paddingTop: 'var(--safe-area-inset-top)',
          boxSizing: 'border-box',
          background: game.sky,
          transition: 'background 3s ease',
        }}
      >
        <SkyScene sunMoon={game.sunMoon} timeOfDay={game.timeOfDay} tint={game.tint} />

        <Header
          logoImg={DEFAULT_CHARACTER_IMG}
          level={game.level}
          totalSlots={game.totalSlots}
          coins={game.coins}
          bugs={game.bugs}
          gems={game.gems}
          xp={game.xp}
          clockLabel={game.clockLabel}
          timeMinutes={game.timeMinutes}
          timeOfDay={game.timeOfDay}
          isDaytime={game.isDaytime}
          soundOn={game.soundOn}
          started={game.started}
          gardenSectionRef={game.refs.gardenSectionRef}
          onToggleDayNight={game.toggleDayNight}
          onToggleSound={() => game.setSoundOn((v) => !v)}
          onToggleStarted={game.toggleStarted}
        />

        <Hero
          totalSlots={game.totalSlots}
          todayEarnings={game.todayEarnings}
          level={game.level}
          xp={game.xp}
          started={game.started}
          isDaytime={game.isDaytime}
          currentCharacter={game.currentCharacter}
          currentCharacterImg={game.currentCharacterImg}
          characterWidthFor={game.characterWidthFor}
          gardenSectionRef={game.refs.gardenSectionRef}
          onToggleStarted={game.toggleStarted}
          onSave={game.saveGame}
          onOpenCharacterShop={() => game.setCharacterShopOpen(true)}
          onOpenGiftcode={() => game.setGiftcodeOpen(true)}
        />

        <AboutCards todayEarnings={game.todayEarnings} />

        <GardenSection game={game} />

        <Footer
          logoImg={DEFAULT_CHARACTER_IMG}
          totalSlots={game.totalSlots}
          todayEarnings={game.todayEarnings}
          lastSavedAt={game.lastSavedAt}
          onSave={game.saveGame}
        />

        <Toast message={game.toast} />
      </div>
    </div>
  )
}
