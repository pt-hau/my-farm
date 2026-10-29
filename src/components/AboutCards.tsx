import { Bug, Flower2, Sprout } from 'lucide-react'

export function AboutCards({ todayEarnings }: { todayEarnings: number }) {
  const cards = [
    {
      icon: <Sprout />,
      title: 'Gieo hạt, săn đột biến',
      desc: `20 loài sen đá và xương rồng chibi. Hạt nảy mầm theo tỉ lệ riêng, đột biến thường hiếm, đột biến hiếm rất rất hiếm — bán theo đơn giá ×3, ×10. Hôm nay bạn đã kiếm +${todayEarnings} xu.`,
    },
    {
      icon: <Bug />,
      title: 'Chậu xịn, bọ có ích',
      desc: 'Chậu đồng, bạc, vàng mua bằng xu; ngọc bích và kim cương nâng cấp bằng bọ + xu, giảm tới 40% thời gian lớn. Bọ đậu lên cây đang lớn, bắt bọ để lấy bọ nâng chậu.',
    },
    {
      icon: <Flower2 />,
      title: 'Vườn treo và ươm lá',
      desc: 'Khu trưng bày dạng vườn treo chỉ để ngắm cho đẹp, cây vẫn lớn và rụng lá để ươm thành cây giống — lá từ cây đột biến nảy mầm cao hơn hạt. Ngọc tua nhanh, làm nhiệm vụ và quay vòng xoay mỗi ngày.',
    },
  ]

  return (
    <section id="about" className="relative mx-auto max-w-[1200px] px-4 md:px-8 py-10">
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-[24px] cartoon-border p-6 relative overflow-hidden card-3d card-3d-hover"
            style={{
              background:
                i === 0
                  ? 'linear-gradient(160deg, #ffffff 0%, #eafbdc 100%)'
                  : i === 1
                    ? 'linear-gradient(160deg, #ffffff 0%, #ffecdd 100%)'
                    : 'linear-gradient(160deg, #ffffff 0%, #efe4ff 100%)',
            }}
          >
            <div className="w-12 h-12 rounded-[14px] bg-[var(--bg)] cartoon-border-sm flex items-center justify-center">
              {card.icon}
            </div>
            <div className="mt-4 font-[900] text-[18px]">{card.title}</div>
            <div className="mt-2 text-[14px] leading-[1.5] opacity-70 font-[600]">{card.desc}</div>
            <div className="absolute -right-6 -bottom-6 w-[80px] h-[80px] bg-[var(--green)] rounded-full opacity-20" />
          </div>
        ))}
      </div>
    </section>
  )
}
