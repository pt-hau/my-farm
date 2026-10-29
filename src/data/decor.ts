import butterflyImg from '../assets/images/decor/butterfly.png'
import cloudImg from '../assets/images/decor/cloud.png'
import fenceImg from '../assets/images/decor/fence.png'
import flowersImg from '../assets/images/decor/flowers.png'
import grassImg from '../assets/images/decor/grass.png'
import rainbowImg from '../assets/images/decor/rainbow.png'
import sparkleImg from '../assets/images/decor/sparkle.png'
import wateringCanImg from '../assets/images/decor/watering-can.png'
import skyGardenImg from '../assets/images/sky-garden.jpg'

/** Ảnh nền bầu trời "vườn trên mây" dùng cho SkyScene và banner. */
export const SKY_GARDEN_IMG = skyGardenImg

/** Ảnh trang trí 3D đã tách nền (bướm, mây, hoa, cỏ, hàng rào, cầu vồng...). */
export const DECOR = {
  butterfly: butterflyImg,
  cloud: cloudImg,
  fence: fenceImg,
  flowers: flowersImg,
  /** Bụi cỏ non, dùng làm mầm cây lúc mới gieo (giai đoạn 0). */
  grass: grassImg,
  rainbow: rainbowImg,
  sparkle: sparkleImg,
  wateringCan: wateringCanImg,
} as const
