# Vườn Nhà Bé — Nuôi Phương (React + TypeScript + Tailwind CSS)

> **Phiên bản hiện tại: Vườn Sen Đá Trên Mây.** Đợt cập nhật lớn chuyển game
> sang trồng sen đá, xương rồng và cây cảnh phong cách chibi (xem mục
> "Bản cập nhật sen đá / xương rồng" ở cuối). Các mục bên dưới mô tả bản
> rau củ gốc mà project này được chuyển đổi từ đó; phần lớn cấu trúc file
> đã thay đổi theo bản mới.

Bản chuyển đổi từ file HTML build sẵn (`Vuon-Nha-Be-Chuan_3__1.html`) sang
project React `.tsx` + Tailwind CSS. Giao diện và chức năng game giữ nguyên;
chỉ tách code thành component / data / hook và thay bundle minified bằng
source đọc được.

## Chạy

```bash
npm install
npm run dev     # chạy dev ở http://localhost:5173
npm run build   # build production ra dist/
npm run preview # xem bản build
```

Yêu cầu: Node.js 18+ (đã kiểm chứng build với Node 24).

## Cấu trúc

```
index.html                  # gốc Vite, title "Nuôi Phương - Vườn Nhà Bé"
src/
  main.tsx                  # createRoot + StrictMode (như bản gốc)
  App.tsx                   # bố cục: SkyScene / Header / Hero / About / Garden / Footer / Toast
  index.css                 # Tailwind v3 + toàn bộ <style> gốc (font Nunito,
                            #   biến :root, keyframes, .cartoon-border, .chx-*)
  types.ts                  # Crop, Plot, Baby, GameCharacter, SaveSnapshot, ...
  data/
    crops.ts                # 8 loại cây (giá, bán, số giai đoạn, icon)
    characters.ts           # 3 nhân vật + ảnh
    babies.ts               # 4 bé ở Nhà trẻ + ảnh
    giftcodes.ts            # PHUONG1K / PHUONGXAUXI
  lib/
    save.ts                 # SAVE_KEY "nuoiPhuong_save_v1", đọc/ghi localStorage
    game.ts                 # tạo ruộng, giá mở rộng 30 + cấp*10, hằng số game
    time.ts                 # giờ trong game, bầu trời, vị trí mặt trời/mặt trăng
  hooks/
    useGardenGame.ts        # toàn bộ state, effect và handler của game
  components/
    SkyScene.tsx            # mặt trời/mặt trăng, sao, đom đóm, mây, lớp phủ màu
    Header.tsx              # logo, đồng hồ/XP, đổi ngày-đêm, bật/tắt tiếng
    Hero.tsx                # phần giới thiệu + nhân vật chính
    AboutCards.tsx          # 3 thẻ giới thiệu
    GardenSection.tsx       # tiêu đề khu vườn + lưới vườn/sidebar + các modal
    GardenArea.tsx          # nhà, thanh mệt, mở rộng, sân vườn, chữ bay
    PlotTile.tsx            # 1 ô ruộng (đất/cây/tưới/thu hoạch)
    Player.tsx              # Phương: đi bộ, mệt/khóc/xỉu, tạt nước tỉnh
    BabySprite.tsx          # 1 bé trong vườn + bong bóng trạng thái
    BabyMenu.tsx            # menu chăm bé (cho ăn / dọn / ôm)
    Sidebar.tsx             # công cụ, chọn hạt, túi đồ, nhà trẻ, nhiệm vụ
    SeedShopModal.tsx       # Tiệm Chị Mận
    NurseryModal.tsx        # Nhà trẻ
    CharacterShopModal.tsx  # Tiệm Nhân Vật
    GiftcodeModal.tsx       # Nhập giftcode
    ResetModal.tsx          # Xác nhận reset vườn
    Footer.tsx
    Toast.tsx
  assets/images/            # 7 ảnh gốc, tách từ base64 trong bundle cũ
    phuong.png              # Phương mặc định (cũng là logo)
    phuong-hung-du.webp, phuong-xinh-dep.webp
    be-huy.png, be-trang.png, be-khoa.png, be-mi.png
```

## Những điểm giữ nguyên có chủ đích

- **Save cũ vẫn đọc được.** Key `nuoiPhuong_save_v1` và tên field ngắn
  (`P`, `v`, `r`, `H`, `s`, `b`, `Y`, `E`, `j`, `M`, `N`, `wf`, `ze`, `h5`,
  `Af`, `o`, `E3`, `ch`, `ow`, `codes`) giữ nguyên, kể cả cách lưu bé
  không kèm `img` (khôi phục theo `type`).
- **Nhịp game giữ nguyên:** đồng hồ +8 phút/giây; cây lớn mỗi 4s (ban đêm
  50% bị bỏ qua); bé đi lại 1.2s, đói -1 mỗi 3s, ị/khóc ngẫu nhiên,
  đẻ xu mỗi 30s; hồi sức sau 8s nghỉ; nhiệm vụ +10 xu; lên cấp khi
  XP ≥ cấp×100.
- **Luồng chơi giữ nguyên:** click ô → Phương đi tới → mới cuốc/gieo/tưới/
  hái; mỗi lần click ô +1 mệt; xỉu ở mệt 10; tạt nước tỉnh lại.
- **Text trong game giữ nguyên**, kể cả những chỗ bản gốc viết không khớp
  công thức thật (ví dụ thẻ giới thiệu ghi giá mở rộng "100→200→400→800→1500"
  trong khi giá thật là `30 + cấp×10`, hay toast tỉnh lại nhắc "10 xu" nhưng
  code gốc không trừ xu). Không tự "sửa" những chỗ này để khỏi đổi gameplay.
- **Giftcode nằm ở phía client** như bản gốc (`PHUONG1K`, `PHUONGXAUXI`);
  ai đọc code cũng thấy mã — đó là thiết kế cũ, không phải do bản chuyển đổi.
- **Nút tiếng chỉ đổi icon.** Bản gốc lưu trạng thái tiếng nhưng không phát
  âm thanh nào; bản này cũng vậy.

## Những chỗ buộc phải suy luận / dọn dẹp nhẹ

File gốc là bundle đã build (React + Tailwind đã minify, tên biến rút gọn),
không có source. Bản chuyển đổi được khôi phục bằng cách đọc bundle đó:

- Tên biến/state được đặt lại cho dễ đọc; logic, ngưỡng số, thời gian
  timeout và class Tailwind giữ nguyên từng chỗ đã kiểm tra.
- 7 ảnh base64 trong bundle được tách ra thành file trong
  `src/assets/images/` và `import` như asset Vite — ảnh giống hệt, code
  không còn chuỗi base64 dài.
- Khối `<style>` trong JSX được chuyển nguyên văn sang `src/index.css`
  (sau các directive Tailwind để giữ đúng thứ tự cascade).
- 2 biến chết trong bản gốc (`R4`, `h4`/`V4` — chỉ gán, không dùng) đã bỏ.
- Một số side-effect trong bản gốc nằm *bên trong* updater của `setState`
  (ví dụ cộng XP trong `setPlots(...)`); bản này đưa chúng ra ngoài updater
  nhưng giữ đúng một lần tác động cho mỗi hành động — kết quả hiển thị
  giống nhau, code an toàn hơn với StrictMode.

## Bản nâng cấp giao diện 3D "vườn trên mây"

- **16 loại cây** (thêm 8 cây mới vào cuối bảng, sau Bí Ngô): Ớt Cay (25 xu),
  Cà Tím (35), Bắp Cải (50), Khoai Tây (70), Cam Vàng (90), Dứa Thơm (120),
  Hoa Hồng (180), Nấm Hương (220). Giá bán/lãi leo dần theo độ hiếm; số giai
  đoạn và thời gian lớn tương tự thang cũ. Save cũ vẫn đọc được: hạt và số
  đã thu của 8 cây mới mặc định 0, thứ tự 8 cây cũ không đổi.
- **Ảnh cây 3D thật hơn:** mỗi cây có một ảnh render 3D đã tách nền
  (`src/assets/images/crops/*.png`), hiển thị trong ô đất, túi đồ, ô chọn
  hạt và tiệm hạt. Trong ô đất, cây lớn dần theo giai đoạn (mới gieo là mầm
  cỏ, gần chín thì to dần, chín thì phát sáng + tia lấp lánh); đất được vẽ
  dạng khối 3D có mặt trên, luống và bóng đổ; lưới ruộng hơi nghiêng phối
  cảnh. Ảnh cây là ảnh tạo bằng AI theo phong cách game 3D dễ thương, cắt
  từ một bảng sprite 4×4 và tách nền trắng bằng flood-fill.
- **Bầu trời vườn trên mây:** ảnh nền đảo bay, cối xay gió, cầu vồng và mây
  (`src/assets/images/sky-garden.jpg`) phủ toàn trang, mờ dần khi sang đêm
  để lộ sao và đom đóm; mây và bướm 3D trôi/bay trên nền trời ban ngày;
  nhân vật đứng trên một đảo bay nhỏ ở Hero. Chữ tiêu đề khu vườn và đoạn
  giới thiệu tự đổi sang trắng có viền khi trời tối để vẫn đọc được.
- **Hiệu ứng 3D chung:** thẻ `.card-3d` (bóng đổ tầng), nút `.btn-3d`
  (nổi/lún khi bấm), tiêu đề `.title-3d`, ảnh `.img-3d`, ô đất `.plot-3d`.
- Gameplay, nhịp game, giá mở rộng, giftcode, nhiệm vụ và key lưu game
  không đổi.

## Bản cập nhật sen đá / xương rồng (phiên bản hiện tại)

Thay toàn bộ 16 loại rau củ cũ bằng **20 loài sen đá / xương rồng chibi**
(`src/data/species.ts`, ảnh trong `src/assets/images/species/*.png`, cắt từ
một bảng sprite 5×4 và tách nền trắng bằng flood-fill; thứ tự key = thứ tự ô
trong bảng). Nhân vật chính mặc định dùng ảnh chibi mới
(`src/assets/images/phuong-chibi.png`); 2 nhân vật còn lại và 4 bé giữ ảnh cũ.

### Các khu

- **Khu gieo hạt** (mặc định 10 ô, mỗi ô 1 hạt, nằm trên mặt đất): hạt có tỉ
  lệ nảy mầm riêng theo loài, càng xịn càng thấp; gieo xong chờ nảy mầm rồi
  ươm thành cây con, chuyển tất cả / tùy chọn sang chăm sóc, hoặc tiêu hủy.
  Hạt hỏng thì ô báo hỏng, cần dọn.
- **Khu chăm sóc** (mặc định 8 chậu, ô to hơn, mở rộng đắt hơn): hàng dưới
  đất + các kệ gỗ phía trên. Chậu có thang Đất → Đồng → Bạc → Vàng →
  Ngọc Bích → Kim Cương, giảm 0/10/18/25/32/40% thời gian chăm sóc; nâng cấp
  từng chậu bằng xu + bọ, thiếu có thể bù bằng ngọc (1 ngọc = 1.000 xu =
  100 bọ).
- **Khu trưng bày** (mặc định 4 chỗ, dạng vườn treo): chỉ để ngắm, cây vẫn
  lớn bình thường và rụng 1 lá mỗi đợt (phổ thông 15 phút, khá 30 phút,
  xịn 1 tiếng, VIP 2 tiếng; tối đa 3 lá chờ thu). Trang trí rèm, móc treo,
  đèn lồng, dây leo mua ở cửa hàng hiện lên giàn treo.
- **Khu bảo quản** (mặc định 4 ngăn, dạng kệ): chỉ cây trưởng thành, để chừa
  cho đơn hàng; đơn hàng giao cây ở đây trước. Cây trong này không lớn thêm.
- **Khu ươm lá** (mặc định 6 ô): lá rụng đem ươm thành cây giống, tỉ lệ nảy
  mầm = tỉ lệ hạt + 20 điểm phần trăm (tối đa 95%); lá từ cây đột biến giữ
  biến thể với tỉ lệ 85%.

### Biến thể, bọ, tiền tệ

- **Biến thể:** khi nảy mầm có tỉ lệ đột biến thường (hiếm) và đột biến hiếm
  (rất rất hiếm), tỉ lệ hiếm giảm thêm theo độ VIP (0,5% → 0,4% → 0,3% →
  0,1%). Ba kiểu biến thể: Var lá, Màu lá, Crest đỉnh. Giá bán: thường ×1,
  đột biến thường ×3, đột biến hiếm ×10. Biến thể hiếm không bán trong cửa
  hàng; cửa hàng chỉ bán 3 loại cây đột biến thường, mỗi loại 1 cây/ngày.
- **Bọ:** đúng 4 loại, mỗi loài cây có đúng 1 loại bọ đậu riêng (Rệp sáp
  trắng, Nhện đỏ, Bọ rùa đỏ, Ốc sên lá — ảnh `src/assets/images/bugs/`).
  Bọ đậu lên cây đang lớn và làm cây ngừng lớn; bấm vào bọ để bắt, được bọ
  làm tiền tệ nâng cấp chậu. Vợt tre/bạc/vàng nhân bọ thưởng ×1/×2/×3.
- **Tiền tệ:** xu, bọ, ngọc. Ngọc là tiền tệ VIP nhất: nâng cấp, mở rộng,
  tua nhanh thời gian (1 ngọc / 30 phút còn lại, tối thiểu 1 ngọc), quay
  thêm vòng xoay. Nhiệm vụ hằng ngày (5 nhiệm vụ, làm mới mỗi ngày) và vòng
  xoay may mắn (1 lượt miễn phí/ngày, quay thêm 5 ngọc).
- **Bán:** bán sỉ = 60% giá theo đơn (chọn nhiều cây, có xác nhận riêng khi
  có cây đột biến hiếm); bán theo đơn qua 3 đơn hàng luân phiên (hết hạn
  30 phút, thưởng gồm 20% phụ trội, ưu tiên cây trong khu bảo quản).

### Thời gian và lưu game

- Tổng thời gian gieo + sinh trưởng: cây cùi nhất 3 phút, cây VIP nhất 7
  tiếng, tăng dần theo độ VIP, chia chờ nảy mầm / ươm / chăm sóc khoảng
  10% / 20% / 70%. Thời gian tính theo giờ thực (mốc `readyAt` trong save)
  nên cây vẫn lớn khi tắt game; mở lại game sẽ thấy cây đã lớn/trưởng thành.
- Save key mới: `vuonSenDa_save_v1` (ver 2). Lần đầu mở bản mới, xu, XP,
  cấp, nhân vật đã mở, giftcode đã dùng, các bé và tùy chọn tiếng được
  chuyển từ save cũ `nuoiPhuong_save_v1`; vườn rau cũ không chuyển sang vì
  các loại cây cũ đã bỏ. Reset vườn giữ nhân vật và giftcode như trước.
- Giftcode: giữ `PHUONG1K`, `PHUONGXAUXI`; thêm `SENDA2026` (+10 ngọc).
  Mã nằm ở phía client như bản gốc.
- Hệ đi bộ/mệt/xỉu và công cụ cuốc/tưới đã bỏ (không còn ô ruộng để đi tới);
  các bé vẫn giữ nguyên nhịp đi lại, đói, ị, khóc và đẻ xu, hiện ở Góc nhà
  trẻ dưới cùng khu vườn. Bầu trời ngày/đêm, nút tiếng (chỉ đổi icon), cấp
  độ và tự lưu liên tục giữ nguyên.
