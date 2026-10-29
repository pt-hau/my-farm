export function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
      style={{ animation: 'toastIn .35s ease' }}
    >
      <div
        className="px-5 py-3 rounded-full bg-black text-white border-[3px] border-white shadow-[4px_4px_0_#000] font-[800] text-[13px] flex items-center gap-2 force-white-text"
        style={{ color: '#ffffff' }}
      >
        <span style={{ color: '#ffffff' }}>{message}</span>
      </div>
    </div>
  )
}
