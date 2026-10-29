import type { BabyType } from '../types'
import beHuyImg from '../assets/images/be-huy.png'
import beTrangImg from '../assets/images/be-trang.png'
import beKhoaImg from '../assets/images/be-khoa.png'
import beMiImg from '../assets/images/be-mi.png'

/** Các bé có thể nhận nuôi ở Nhà trẻ. */
export const BABY_TYPES: BabyType[] = [
  {
    type: 'beHuy',
    name: 'Bé Huy',
    trait: 'Hiếu động',
    img: beHuyImg,
    desc: 'Be Huy Hieu dong boy black suit short hair',
  },
  {
    type: 'beTrang',
    name: 'Bé Trang',
    trait: 'Ngoan ngoãn',
    img: beTrangImg,
    desc: 'Be Trang Ngoan ngoan girl glasses black suit long hair',
  },
  {
    type: 'beKhoa',
    name: 'Bé Khoa',
    trait: 'Háu ăn',
    img: beKhoaImg,
    desc: 'Be Khoa Hau an boy navy suit arms crossed',
  },
  {
    type: 'beMi',
    name: 'Bé Mi',
    trait: 'Dễ khóc',
    img: beMiImg,
    desc: 'Be Mi De khoc girl blue sweater heart',
  },
]
