export const facultySource = { url: 'https://www.vbu.ac.in/mca', label: 'VBU MCA department', retrievedOn: '2026-10-27' }

export const professors = [
  {
    "id": "santosh-kumar-srivastava",
    "photo": "/college-icons/professors/Santosh%20Kumar%20Srivastava.jpg",
    "name": "Santosh Kumar Srivastava",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "P.G. (Maths), MCA, M.Phil; PhD pursuing (as listed)",
    "specialization": "Wireless Sensor Network",
    "reportedExperienceYears": 9,
    "phones": [
      "9431530609"
    ],
    "emails": [
      "srivastava_santosh2@rediffmail.com"
    ]
  },
  {
    "id": "ashutosh-kumar-singh",
    "photo": "/college-icons/professors/Ashutosh%20Kumar%20Singh.jpg",
    "name": "Ashutosh Kumar Singh",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "B.E. (CSE), MBA",
    "specialization": "Distributed Systems",
    "reportedExperienceYears": 6,
    "phones": [
      "7762951467",
      "9534205613"
    ],
    "emails": [
      "Profashutosh82@gmail.com",
      "ashu187@rediffmail.com"
    ]
  },
  {
    "id": "manish-kumar",
    "photo": "/college-icons/professors/Manish%20Kumar.png",
    "name": "Manish Kumar",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "B.Tech (CSE), M.Tech (CSE)",
    "specialization": "Software Engineering",
    "reportedExperienceYears": 6,
    "phones": [
      "7004873127",
      "9709269852"
    ],
    "emails": [
      "manish14.kk@gmail.com"
    ]
  },
  {
    "id": "santosh-kumar-singh",
    "photo": "/college-icons/professors/Santosh%20Kumar%20Singh.jpg",
    "name": "Santosh Kumar Singh",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "MCA, M.Phil (CS)",
    "specialization": "Data Mining and Warehousing",
    "reportedExperienceYears": 7,
    "phones": [
      "8340542570",
      "9431155277"
    ],
    "emails": [
      "Sksbol1@gmail.com"
    ]
  },
  {
    "id": "rahul-prasad",
    "photo": "/college-icons/professors/Rahul%20Prasad.jpg",
    "name": "Rahul Prasad",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "MCA, M.Tech (IT)",
    "specialization": "Object Oriented Programming",
    "reportedExperienceYears": 9,
    "phones": [
      "9835556580"
    ],
    "emails": [
      "gdrahul31@rediffmail.com"
    ]
  },
  {
    "id": "manisha-baxla",
    "photo": "/college-icons/professors/manishabaxla.jpeg",
    "name": "Manisha Baxla",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "B.E. (CSE)",
    "specialization": "Digital Electronics",
    "reportedExperienceYears": 4,
    "phones": [
      "7739073223",
      "9852732668"
    ],
    "emails": [
      "manishabaxla07@gmail.com"
    ]
  },
  {
    "id": "prabhat-kumar",
    "photo": "/college-icons/professors/Prabhat%20Kumar.jpg",
    "name": "Prabhat Kumar",
    "designation": "Assistant Professor",
    "courses": ["bca", "mca"],
    "qualification": "MCA",
    "specialization": "Compiler Design",
    "reportedExperienceYears": 4,
    "phones": [
      "8102083232"
    ],
    "emails": [
      "praansu@gmail.com"
    ]
  }
]

export const departmentStaff = [
  { id: 'abhishek-kumar', name: 'Abhishek Kumar', designation: 'Departmental staff', category: 'staff', sourceName: 'abhishek Kumar' },
  { id: 'arshad-alam', name: 'Arshad Alam', designation: 'Departmental staff', category: 'staff', sourceName: 'arsad alam' },
  { id: 'suman-m-horo', name: 'Suman M. Horo', designation: 'Departmental staff', category: 'staff', sourceName: 'suman m horo' },
  { id: 'nishat-ahmad', name: 'Nishat Ahmad', designation: 'Departmental staff', category: 'staff', sourceName: 'nishat ahmad' },
].map(person => ({ ...person, phones: [], emails: [] }))
export const departmentPeople = [...professors, ...departmentStaff]

export const professorHref = id => `/professors/${id}`
export const getProfessor = id => departmentPeople.find(professor => professor.id === id)
export function filterProfessors(query = '') {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return departmentPeople.filter(person => terms.every(term => `${person.name} ${person.designation} ${person.qualification ?? ''} ${person.specialization ?? ''}`.toLowerCase().includes(term)))
}
