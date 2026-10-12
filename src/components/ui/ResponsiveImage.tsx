import type { ImgHTMLAttributes } from 'react'
import type { ImageAsset } from '../../types'

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  image: ImageAsset
  priority?: boolean
  /** Use an empty string to mark the image as decorative. */
  alt?: string
}

export function ResponsiveImage({ image, priority, sizes = '(min-width: 1024px) 50vw, 100vw', alt, ...props }: ResponsiveImageProps) {
  return (
    <img
      src={image.src}
      srcSet={`${image.srcSm} 720w, ${image.src} 1600w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      {...props}
    />
  )
}
