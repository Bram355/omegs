import type { ImageSourcePropType } from 'react-native'
import catalogue from './services.json'

export type Service = (typeof catalogue)[number] & { image: ImageSourcePropType }

const images: Record<string, ImageSourcePropType> = {
  'home-cleaning': require('../../assets/services/home-cleaning.webp'),
  'deep-cleaning': require('../../assets/services/deep-cleaning.webp'),
  'office-cleaning': require('../../assets/services/office-cleaning.webp'),
  'move-in-move-out': require('../../assets/services/move-cleaning.webp'),
  'sofa-upholstery': require('../../assets/services/sofa-cleaning.webp'),
  'post-construction': require('../../assets/services/post-construction.webp'),
}

export const heroImage: ImageSourcePropType = require('../../assets/services/hero.webp')

export const services: Service[] = catalogue.map((s) => ({ ...s, image: images[s.id] }))
export const getService = (id?: string | string[]) => services.find((s) => s.id === id)

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'specialty', label: 'Specialty' },
] as const
