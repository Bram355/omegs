import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Headset,
  ListChecks,
  MousePointerClick,
  ReceiptText,
  Smartphone,
  UsersRound,
  BellRing,
  FileSearch,
  CalendarRange,
} from 'lucide-react'
import type { FaqItem, Feature } from '../types'

/** Brand promises — written as commitments, not verified claims. */
export const brandPromises: Feature[] = [
  {
    icon: MousePointerClick,
    title: 'Easy booking',
    description: 'Request a cleaning in a few simple steps on the web or in the Omegs mobile app.',
  },
  {
    icon: UsersRound,
    title: 'Professional cleaning teams',
    description: 'We are committed to working with trained, respectful teams who take pride in the details.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent pricing',
    description: 'Clear quotes before your clean, with no hidden extras added after the fact.',
  },
  {
    icon: CalendarClock,
    title: 'Flexible scheduling',
    description: 'Choose the date and time window that works for you, and adjust when plans change.',
  },
  {
    icon: Smartphone,
    title: 'Convenient service management',
    description: 'View, reschedule, and manage your bookings from one place in the Omegs app.',
  },
  {
    icon: Headset,
    title: 'Customer-focused support',
    description: 'A support team that listens and helps resolve questions quickly and courteously.',
  },
]

export const howItWorksSteps: Feature[] = [
  {
    icon: ListChecks,
    title: 'Choose your cleaning service',
    description: 'Browse our services and pick the one that fits your home or workspace.',
  },
  {
    icon: CalendarCheck,
    title: 'Select your preferred date and details',
    description: 'Pick a date and time window, then tell us about your space and any priorities.',
  },
  {
    icon: ClipboardList,
    title: 'Confirm and manage your booking',
    description: 'Review your request, confirm it, and keep track of it from your account or the app.',
  },
]

export const appFeatures: Feature[] = [
  {
    icon: CalendarRange,
    title: 'Book in seconds',
    description: 'Choose a service, date, and time window from your phone.',
  },
  {
    icon: BellRing,
    title: 'Manage appointments',
    description: 'Reschedule or cancel upcoming bookings and get timely reminders.',
  },
  {
    icon: FileSearch,
    title: 'View service details',
    description: "See what's included in every service before you book.",
  },
]

/**
 * SAMPLE testimonials for layout purposes only. They are not real customer reviews.
 * Replace with genuine, consented customer feedback before launch.
 */
export const sampleTestimonials = [
  {
    quote:
      'Booking was straightforward and the team paid attention to the details I asked for. Coming home to a fresh space made my whole week easier.',
    name: 'Sample customer',
    context: 'Home Cleaning',
  },
  {
    quote:
      'We needed our office cleaned outside working hours. The scheduling options made that simple, and the space was ready for Monday morning.',
    name: 'Sample customer',
    context: 'Office Cleaning',
  },
  {
    quote:
      'Moving out is stressful, so having one less thing to worry about helped a lot. The apartment was ready for handover on time.',
    name: 'Sample customer',
    context: 'Move-Out Cleaning',
  },
]

export const generalFaqs: FaqItem[] = [
  {
    question: 'What services does Omegs offer?',
    answer:
      'Omegs offers home cleaning, deep cleaning, office cleaning, move-in and move-out cleaning, sofa and upholstery cleaning, and post-construction cleaning. Visit our Services page for full details of each.',
  },
  {
    question: 'How do I book a cleaning?',
    answer:
      'Choose a service, select your preferred date and time window, add details about your space, and confirm your request. You can book on this website after signing in, and through the Omegs mobile app once it launches.',
  },
  {
    question: 'Can I reschedule a booking?',
    answer:
      'Yes. Plans change, and we aim to make rescheduling simple. You will be able to manage upcoming bookings from your account and the Omegs app, or by contacting our support team.',
  },
  {
    question: 'How do I download the mobile app?',
    answer:
      'The Omegs app is being prepared for iOS and Android. Visit our Download page for the latest availability — App Store and Google Play links will be added there as soon as the listings are live.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'Use the form on our Contact page or reach us by email or phone. Our contact details are listed on the Contact page and in the footer of every page.',
  },
]
