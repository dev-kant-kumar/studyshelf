import { useState } from 'react'

export default function ProfessorPhoto({ person, large = false, small = false, decorative = false }) {
  const [failed, setFailed] = useState(false)
  const size = small ? 'size-8' : large ? 'size-28 sm:size-32' : 'size-16'
  const shape = small ? 'rounded-full' : 'rounded-xl'
  if (!person.photo || failed) return <span aria-hidden="true" className={`${size} flex shrink-0 items-center justify-center ${shape} bg-selected font-display ${small ? 'text-[10px]' : 'text-xl'} text-brand dark:bg-night-selected dark:text-night-brand`}>{person.name.split(' ').map(word => word[0]).join('')}</span>
  return <img src={person.photo} alt={decorative ? '' : person.name} width={small ? 32 : large ? 128 : 64} height={small ? 32 : large ? 128 : 64} loading={large ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={`${size} shrink-0 ${shape} border border-line object-cover object-top dark:border-night-line`} />
}
