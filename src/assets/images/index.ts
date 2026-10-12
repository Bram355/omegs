import type { ImageAsset } from '../../types'
import hero from './hero.webp'
import heroSm from './hero-sm.webp'
import homeCleaning from './home-cleaning.webp'
import homeCleaningSm from './home-cleaning-sm.webp'
import deepCleaning from './deep-cleaning.webp'
import deepCleaningSm from './deep-cleaning-sm.webp'
import officeCleaning from './office-cleaning.webp'
import officeCleaningSm from './office-cleaning-sm.webp'
import moveCleaning from './move-cleaning.webp'
import moveCleaningSm from './move-cleaning-sm.webp'
import sofaCleaning from './sofa-cleaning.webp'
import sofaCleaningSm from './sofa-cleaning-sm.webp'
import postConstruction from './post-construction.webp'
import postConstructionSm from './post-construction-sm.webp'
import aboutCleaner from './about-cleaner.webp'
import aboutCleanerSm from './about-cleaner-sm.webp'
import livingRoom from './living-room.webp'
import livingRoomSm from './living-room-sm.webp'
import authLiving from './auth-living.webp'
import authLivingSm from './auth-living-sm.webp'
import kitchen from './kitchen.webp'
import kitchenSm from './kitchen-sm.webp'
import surfaceWipe from './surface-wipe.webp'
import surfaceWipeSm from './surface-wipe-sm.webp'

// Photography: Unsplash (unsplash.com/license). Replace with Omegs' own photography before launch if preferred.
export const images = {
  hero: { src: hero, srcSm: heroSm, width: 1600, height: 900, alt: 'A cleaning professional mopping the floor of a bright, modern living room' },
  homeCleaning: { src: homeCleaning, srcSm: homeCleaningSm, width: 1600, height: 1067, alt: 'A cleaner carrying a cleaning caddy and broom up the stairs of a tidy home' },
  deepCleaning: { src: deepCleaning, srcSm: deepCleaningSm, width: 1600, height: 917, alt: 'Gloved hands scrubbing a floor with foam during a deep clean' },
  officeCleaning: { src: officeCleaning, srcSm: officeCleaningSm, width: 1600, height: 1067, alt: 'Gloved hands disinfecting an office desk with a spray bottle and cloth' },
  moveCleaning: { src: moveCleaning, srcSm: moveCleaningSm, width: 1600, height: 900, alt: 'A couple carrying moving boxes and a plant into their new home' },
  sofaCleaning: { src: sofaCleaning, srcSm: sofaCleaningSm, width: 1600, height: 1067, alt: 'A cleaner vacuuming a grey upholstered ottoman' },
  postConstruction: { src: postConstruction, srcSm: postConstructionSm, width: 1600, height: 1067, alt: 'A spacious interior with arched windows and building materials after renovation' },
  aboutCleaner: { src: aboutCleaner, srcSm: aboutCleanerSm, width: 1600, height: 900, alt: 'A cleaner in yellow gloves carefully wiping a wooden surface' },
  livingRoom: { src: livingRoom, srcSm: livingRoomSm, width: 1600, height: 1200, alt: 'A bright, spotless living room with white sofas and plants' },
  authLiving: { src: authLiving, srcSm: authLivingSm, width: 1600, height: 1067, alt: 'A calm, freshly cleaned modern living room with grey sofas' },
  kitchen: { src: kitchen, srcSm: kitchenSm, width: 1600, height: 1067, alt: 'A sparkling white kitchen with a marble island and hexagonal tiles' },
  surfaceWipe: { src: surfaceWipe, srcSm: surfaceWipeSm, width: 1600, height: 1067, alt: 'Gloved hands wiping a clean white surface' },
} satisfies Record<string, ImageAsset>

export type ImageKey = keyof typeof images
