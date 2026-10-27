import { roleRoadmaps } from '../app/main-website/pages/Developers/roleRoadmapData.js'
export const publicPages = [
  ...roleRoadmaps.map(roadmap => ({ path: `/developers/${roadmap.slug}`, label: `${roadmap.title} roadmap` })),
  { path: '/careers', label: 'Career Explorer' },
  { path: '/developers', label: 'Developer Shelf' },
  { path: '/developers/nodejs-roadmap', label: 'Node.js backend roadmap' },
  { path: '/routine', label: 'BCA & MCA class routine' },
  { path: '/professors', label: 'Faculty and departmental staff' },
  { path: '/vbu', label: 'VBU student guide' },
  { path: '/about', label: 'About Study Shelf' },
  { path: '/help', label: 'Help and FAQs' },
  { path: '/contact', label: 'Contact' },
  { path: '/updates', label: 'Latest notes' },
  { path: '/content-policy', label: 'Content standards' },
  { path: '/privacy', label: 'Privacy' },
]
