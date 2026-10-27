import { useState } from 'react'

export default function ProfessorPhoto({
  person,
  large = false,
  small = false,
  compact = false,
  decorative = false,
}) {
  const [failed, setFailed] = useState(false)
  const size = small
    ? 'size-8'
    : compact
      ? 'size-12 sm:size-14'
      : large
        ? 'size-28 sm:size-32'
        : 'size-14 sm:size-16'
  const shape = small ? 'rounded-full' : 'rounded-xl'

  if (!person.photo || failed) {
    const initials = person.name
      .split(' ')
      .map(word => word[0])
      .join('')

    return (
      <span
        aria-hidden="true"
        className={`${size} flex shrink-0 items-center justify-center ${shape} bg-selected font-display ${
          small ? 'text-[10px]' : compact ? 'text-base sm:text-lg' : 'text-xl'
        } text-brand dark:bg-night-selected dark:text-night-brand`}
      >
        {initials}
      </span>
    )
  }

  const dimension = small ? 32 : compact ? 56 : large ? 128 : 64

  return (
    <img
      src={person.photo}
      alt={decorative ? '' : person.name}
      width={dimension}
      height={dimension}
      loading={large ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${size} shrink-0 ${shape} border border-line object-cover object-top dark:border-night-line`}
    />
  )
}
