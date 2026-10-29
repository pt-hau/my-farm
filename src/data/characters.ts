import type { GameCharacter } from '../types'
import phuongImg from '../assets/images/phuong.png'
import phuongHungDuImg from '../assets/images/phuong-hung-du.webp'
import phuongXinhDepImg from '../assets/images/phuong-xinh-dep.webp'

/**
 * Danh sách nhân vật. Ảnh được tách ra khỏi code (bản HTML gốc nhúng base64
 * trực tiếp trong bundle); đây là đúng 3 ảnh gốc đó, chỉ đổi chỗ chứa.
 */
export const CHARACTERS: GameCharacter[] = [
  {
    id: 'default',
    name: 'Phương',
    tag: 'Mặc định',
    desc: 'Cô chủ vườn quen thuộc của chúng ta.',
    price: 0,
    img: phuongImg,
    ar: 0.4964,
  },
  {
    id: 'fierce',
    name: 'Chị Phương Hung Dữ',
    tag: 'Hung dữ',
    desc: 'Đừng hòng ai dám lười biếng trong vườn này! 😤',
    price: 1000,
    img: phuongHungDuImg,
    ar: 0.3303,
  },
  {
    id: 'pretty',
    name: 'Chị Phương Xinh Đẹp',
    tag: 'Xinh đẹp',
    desc: 'Thanh lịch, sang chảnh, cày ruộng vẫn đẹp. ✨',
    price: 5000,
    img: phuongXinhDepImg,
    ar: 0.5553,
  },
]

export const DEFAULT_CHARACTER_IMG = phuongImg
