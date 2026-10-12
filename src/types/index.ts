import type { LucideIcon } from 'lucide-react'

export interface ImageAsset {
  src: string
  srcSm: string
  width: number
  height: number
  alt: string
}

export type ServiceCategory = 'residential' | 'commercial' | 'specialty'

export interface FaqItem {
  question: string
  answer: string
}

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export interface ServicePricing {
  /** Display string such as "From $120". Leave undefined until prices are confirmed. */
  startingAt?: string
  note: string
}

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  icon: LucideIcon
  image: ImageAsset
  tagline: string
  shortDescription: string
  description: string[]
  idealFor: string[]
  benefits: { title: string; description: string }[]
  included: string[]
  pricing: ServicePricing
  faqs: FaqItem[]
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
}

export interface SignInInput {
  email: string
  password: string
  remember: boolean
}

export interface SignUpInput {
  fullName: string
  email: string
  phone: string
  password: string
}

export type PropertyType = 'apartment' | 'house' | 'office' | 'other'

export interface BookingInput {
  serviceId: string
  date: string
  timeSlot: string
  propertyType: PropertyType
  address: string
  phone: string
  notes: string
}

export type BookingStatus = 'requested' | 'cancelled'

export interface Booking extends BookingInput {
  id: string
  userId: string
  status: BookingStatus
  createdAt: string
}

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}
