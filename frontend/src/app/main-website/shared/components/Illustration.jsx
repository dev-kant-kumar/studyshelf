import illustrations from '@/config/illustrations.json'
export default function Illustration({ name, className = '', sizes = '320px', priority = false, alt = '', minWidth }) {
  const asset = illustrations[name]
  const sourceSet = format => asset.widths.map(width => `/illustrations/${name}-${width}.${format} ${width}w`).join(', ')
  const media = minWidth ? `(min-width: ${minWidth}px)` : undefined
  const fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/%3E'
  return <picture className={`block ${className}`}>
    <source media={media} type="image/avif" srcSet={sourceSet('avif')} sizes={sizes} />
    {minWidth && <source media={media} type="image/webp" srcSet={sourceSet('webp')} sizes={sizes} />}
    <img src={minWidth ? fallback : `/illustrations/${name}-${asset.widths[1]}.webp`} srcSet={minWidth ? undefined : sourceSet('webp')} sizes={sizes} width={asset.width} height={asset.height} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" className="h-auto w-full object-contain" />
  </picture>
}
