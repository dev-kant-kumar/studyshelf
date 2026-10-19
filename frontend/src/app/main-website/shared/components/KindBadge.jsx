export default function KindBadge({ kind, group }) {
  const label = group ?? ({foundation:'Foundation',core:'Core',sessional:'Sessional',elective:'Elective'}[kind] ?? kind)
  return <span className="inline-flex rounded-md bg-soft px-2 py-1 text-xs font-semibold text-subtle dark:bg-night-soft dark:text-night-subtle">{label}</span>
}
