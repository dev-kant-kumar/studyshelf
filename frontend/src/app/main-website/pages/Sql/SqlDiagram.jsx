import { useId } from 'react'

const graphs = {
  request: { nodes: [['Browser', 'HTTP request; no DB credentials', 20, 100], ['API + driver', 'Authenticate; bind; pool', 320, 100], ['PostgreSQL', 'Parse -> plan -> execute', 620, 100]], edges: [[0,1,'request'],[1,2,'bound SQL']] },
  schema: { nodes: [['users', 'PK id | name | email', 20, 30], ['orders', 'PK id | FK user_id | status', 320, 30], ['order_items', 'PK (order_id, product_id)', 620, 30], ['products', 'PK id | price | stock', 620, 240]], edges: [[0,1,'1 -> many'],[1,2,'1 -> many'],[3,2,'1 -> many']] },
  pipeline: { nodes: [['FROM / JOIN', 'Construct related input rows',20,30],['WHERE', 'Keep rows where TRUE',320,30],['GROUP / HAVING', 'Aggregate; filter groups',620,30],['WINDOW / SELECT', 'Compute output expressions',20,240],['DISTINCT / ORDER', 'Deduplicate; define order',320,240],['LIMIT', 'Bound the returned rows',620,240]], edges: [[0,1,'rows'],[1,2,'rows'],[2,3,'groups / rows'],[3,4,'output'],[4,5,'ordered rows']] },
  join: { nodes: [['Customer input', 'Asha | Ravi | Mira | Neha',20,30],['Eligible paid orders', 'Asha: 101 | Ravi: 103,105',320,30],['LEFT JOIN result', 'Asha 101; Ravi 103,105',620,30],['Preserved unmatched rows', 'Mira NULL | Neha NULL',620,240]], edges: [[0,2,'preserve left'],[1,2,'match pairs'],[2,3,'add unmatched']] },
  recursion: { nodes: [['Equipment', 'id 1 | depth 0 | path [1]',320,30],['Input devices', 'id 2 | depth 1 | path [1,2]',20,240],['Displays', 'id 4 | depth 1 | path [1,4]',620,240],['Keyboards', 'id 3 | depth 2 | path [1,2,3]',20,450]], edges: [[0,1,'parent 1'],[0,2,'parent 1'],[1,3,'parent 2']] },
  migration: { nodes: [['Expand', 'Add compatible schema',20,30],['Migrate', 'Compatible writes + backfill',320,30],['Validate / switch', 'Verify data; move readers',620,30],['Contract later', 'Remove old representation',620,240]], edges: [[0,1,'deploy'],[1,2,'verify'],[2,3,'compatibility window']] },
  transaction: { nodes: [['One checked-out client', 'BEGIN + guarded reservation',20,30],['Related writes', 'Order + line + outbox',320,30],['COMMIT', 'Return persisted outcome',620,30],['ROLLBACK', 'Any failed step',320,240],['Release client', 'Both paths; discard if broken',620,240]], edges: [[0,1,'success'],[1,2,'success'],[1,3,'error'],[2,4,'finally'],[3,4,'finally']] },
  deadlock: { nodes: [['Transaction A', 'Holds product 1',20,30],['Product 2', 'Held by B',620,30],['Transaction B', 'Holds product 2',620,240],['Product 1', 'Held by A',20,240]], edges: [[0,1,'A waits'],[1,2,'B owns'],[2,3,'B waits'],[3,0,'A owns']] },
  plan: { nodes: [['Limit', 'Stop after 10 output rows',320,30],['Index scan or Sort', 'Requested created_at order',320,240],['Filtered source', 'user_id = 42; inspect rows',320,450]], edges: [[2,1,'child rows'],[1,0,'ordered rows']] },
}
export default function SqlDiagram({ kind, caption }) {
  const marker = useId().replaceAll(':','')
  const graph = graphs[kind]
  if (!graph) return null
  const height = Math.max(...graph.nodes.map(node => node[3])) + 145
  return <figure className="my-8"><div className="overflow-x-auto rounded-xl border border-line bg-surface p-3 dark:border-night-line dark:bg-night-surface" tabIndex={0} role="region" aria-label={`${caption} - scrollable diagram`}>
    <svg viewBox={`0 0 930 ${height}`} className="mx-auto w-full min-w-[700px] text-subtle dark:text-night-subtle" role="img" aria-labelledby={`${marker}-title ${marker}-desc`}>
      <title id={`${marker}-title`}>{caption}</title><desc id={`${marker}-desc`}>{graph.nodes.map(node => `${node[0]}: ${node[1]}`).join('. ')}. {graph.edges.map(([a,b,label]) => `${graph.nodes[a][0]} to ${graph.nodes[b][0]}: ${label}`).join('. ')}</desc>
      <defs><marker id={marker} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
      {graph.edges.map(([a,b,label],i) => {
        const from = graph.nodes[a], to = graph.nodes[b]
        const vertical = from[2] === to[2]
        const x1 = from[2] + (vertical ? 135 : from[2] < to[2] ? 270 : 0)
        const x2 = to[2] + (vertical ? 135 : from[2] < to[2] ? 0 : 270)
        const y1 = from[3] + (vertical ? from[3] < to[3] ? 100 : 0 : 50)
        const y2 = to[3] + (vertical ? from[3] < to[3] ? 0 : 100 : 50)
        return <g key={i}><path d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd={`url(#${marker})`} /><text x={(x1+x2)/2} y={(y1+y2)/2 - 12} textAnchor="middle" fontSize="13" fill="currentColor">{label}</text></g>
      })}
      {graph.nodes.map(([name,detail,x,y]) => <g key={name}><rect x={x} y={y} width="270" height="100" rx="8" className="fill-soft stroke-line dark:fill-night-soft dark:stroke-night-line" /><text x={x+16} y={y+35} fontSize="18" fontWeight="600" className="fill-ink dark:fill-night-ink">{name}</text><text x={x+16} y={y+66} fontSize="13" fill="currentColor">{detail}</text></g>)}
    </svg>
  </div><figcaption className="mt-3 text-sm text-subtle dark:text-night-subtle">{caption}</figcaption></figure>
}
