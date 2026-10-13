// Single source of truth for this course. Content lives in semesters/ folders.
export default {
  id: "mca",
  name: "MCA",
  description: "Master of Computer Applications",
  university: "Vinoba Bhave University, Hazaribag",
  session: "2026–28",
  version: "CBCS, introduced for session 2020–22",
  versionNote:
    "Check your university’s syllabus for the topics covered in your exams.",
  source: {
    file: "docs/syllabus/MCASyllabus.pdf",
    pages: 32,
  },
  semesters: [
    {
      id: "sem1",
      number: 1,
      title: "Semester 1",
      credits: 30,
      papers: [
        {
          id: "paper1",
          code: "MCA C1001",
          title: "Fundamentals of Computers",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 9,
          detailTitle: "FUNDAMENTALS OF COMPUTERS (MCA C1001)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Computers and Computer Network",
              syllabusText:
                "Introduction, Characteristics of Computers, Evolution of Computers, Evolution of Computers, Generations Of Computers, Classification of Computers, The Computer System, Application of Computers, Introduction, Data Communication, Transmission Media, Multiple xing, Switching, Computer Network, Network Topologies, Communication Protocols, Network Devices. [Q-2]",
              sourcePage: 9,
              topics: [
                { id: "introduction", title: "Introduction to computers" },
                { id: "characteristics", title: "Characteristics of computers" },
                { id: "evolution", title: "Evolution of computers" },
                { id: "generations", title: "Generations of computers" },
                { id: "classification", title: "Classification of computers" },
                { id: "computer-system", title: "The computer system" },
                { id: "applications", title: "Applications of computers" },
                { id: "data-communication", title: "Data communication" },
                { id: "transmission-media", title: "Transmission media" },
                { id: "multiplexing", title: "Multiplexing" },
                { id: "switching", title: "Switching" },
                { id: "computer-networks", title: "Introduction to computer networks" },
                { id: "topologies", title: "Network topologies" },
                { id: "protocols", title: "Communication protocols" },
                { id: "network-devices", title: "Network devices" },
              ],
              notes: [
                {
                  "id": "introduction",
                  "title": "Introduction to computers: data and computation",
                  "summary": "Build the foundations: programmable systems, input and output, data representation, encoding, and numerical correctness.",
                  "status": "published",
                  "order": 1,
                  "coveredTopics": [
                    "introduction"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "introduction"
                  ]
                },
                {
                  "id": "characteristics",
                  "title": "Characteristics of computers: accuracy, performance, and limits",
                  "summary": "Understand strengths and limitations; calculate CPU time and speedup, identify bottlenecks, and benchmark meaningful workloads.",
                  "status": "published",
                  "order": 2,
                  "coveredTopics": [
                    "characteristics"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "characteristics"
                  ]
                },
                {
                  "id": "evolution",
                  "title": "Evolution of computers: from calculation to connected systems",
                  "summary": "Follow mechanical, electronic, stored-program, personal, and distributed computing through the capabilities and trade-offs they introduced.",
                  "status": "published",
                  "order": 3,
                  "coveredTopics": [
                    "evolution"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "evolution"
                  ]
                },
                {
                  "id": "generations",
                  "title": "Generations of computers: technology and its consequences",
                  "summary": "Compare valves, transistors, integrated circuits, microprocessors, and AI-oriented developments without misleading historical boundaries.",
                  "status": "published",
                  "order": 4,
                  "coveredTopics": [
                    "generations"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "generations"
                  ]
                },
                {
                  "id": "classification",
                  "title": "Classification of computers: representation, purpose, and scale",
                  "summary": "Compare analog, digital, embedded, real-time, mainframe, high-performance, and distributed systems through requirements.",
                  "status": "published",
                  "order": 5,
                  "coveredTopics": [
                    "classification"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "classification"
                  ]
                },
                {
                  "id": "computer-system",
                  "title": "The computer system: components, software, and execution",
                  "summary": "Explore CPU and memory organisation, operating-system boundaries, program execution, processes, threads, interrupts, and DMA.",
                  "status": "published",
                  "order": 6,
                  "coveredTopics": [
                    "computer-system"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "computer system"
                  ]
                },
                {
                  "id": "applications",
                  "title": "Applications of computers: requirements and complete worked cases",
                  "summary": "Connect application domains to correctness, security, reliability, and a complete marks-report design with practice and investigations.",
                  "status": "published",
                  "order": 7,
                  "coveredTopics": [
                    "applications"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "computers",
                    "applications"
                  ]
                },
                {
                  "id": "computer-networks",
                  "title": "Computer networks: foundations and end-to-end communication",
                  "summary": "Understand network scope, service roles, layers, addresses, packet journeys, performance, and independent failure stages.",
                  "status": "published",
                  "order": 8,
                  "coveredTopics": [
                    "computer-networks"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "computer networks"
                  ]
                },
                {
                  "id": "data-communication",
                  "title": "Data communication: signals, timing, capacity, and errors",
                  "summary": "Learn transmission modes, encoding and modulation, delay calculations, capacity bounds, and error, flow, and congestion control.",
                  "status": "published",
                  "order": 9,
                  "coveredTopics": [
                    "data-communication"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "data communication"
                  ]
                },
                {
                  "id": "transmission-media",
                  "title": "Transmission media: copper, fibre, radio, and link budgets",
                  "summary": "Compare guided and wireless media; reason about interference, distance, optical power, satellite delay, and practical selection.",
                  "status": "published",
                  "order": 10,
                  "coveredTopics": [
                    "transmission-media"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "transmission media"
                  ]
                },
                {
                  "id": "multiplexing",
                  "title": "Multiplexing: sharing frequency, time, wavelength, and codes",
                  "summary": "Compare FDM, TDM, statistical sharing, WDM, code division, and OFDM with resource and overhead calculations.",
                  "status": "published",
                  "order": 11,
                  "coveredTopics": [
                    "multiplexing"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "multiplexing"
                  ]
                },
                {
                  "id": "switching",
                  "title": "Switching: circuits, messages, packets, and forwarding",
                  "summary": "Compare resource reservation, datagrams, virtual circuits, route selection, queueing, and store-and-forward pipelining.",
                  "status": "published",
                  "order": 12,
                  "coveredTopics": [
                    "switching"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "switching"
                  ]
                },
                {
                  "id": "topologies",
                  "title": "Network topologies: structure, capacity, and failure",
                  "summary": "Draw and compare bus, star, ring, mesh, tree, and hybrid networks; calculate links and oversubscription and reason about recovery.",
                  "status": "published",
                  "order": 13,
                  "coveredTopics": [
                    "topologies"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "topologies"
                  ]
                },
                {
                  "id": "protocols",
                  "title": "Communication protocols: layers, addressing, transport, and security",
                  "summary": "Trace communication through IP, TCP, UDP, ARP, DHCP, DNS, TLS, and applications; distinguish each responsibility and diagnose failures.",
                  "status": "published",
                  "order": 14,
                  "coveredTopics": [
                    "protocols"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "protocols"
                  ]
                },
                {
                  "id": "network-devices",
                  "title": "Network devices: interfaces, switches, routers, and policy",
                  "summary": "Trace switch learning, router forwarding, VLANs, wireless access, NAT, gateways, and firewall roles with practical diagnostics.",
                  "status": "published",
                  "order": 15,
                  "coveredTopics": [
                    "network-devices"
                  ],
                  "updatedAt": "2026-10-13",
                  "tags": [
                    "fundamentals",
                    "networking",
                    "network devices"
                  ]
                }
              ],
            },
            {
              id: "unit2",
              number: 2,
              title: "Number Systems, Logic Gates and Computer Architecture",
              syllabusText:
                "Introduction, Number Systems, Conversion between Number Bases, Arithmetic System, Conce pt of Overflow, Binary Coding, Logic Gates, Boolean algebra, Combination of Logic Gates. Central Processing Unit, Memory, Communication between Various Units of a Computer System, Processor Speed, Multiprocessor Systems. [Q-2]",
              sourcePage: 9,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Primary Memory, Secondary Memory and Operating System",
              syllabusText:
                "Introduction, Memory Hierarchy, Random Access Memory (RAM), Types Of RAM, Read Only Memory (ROM), Types Of ROM, Classification of Secondary Storage Devices, Magnetic Tape, Magnetic Disk, Optical Disk Operating System , Evolution of Operating System, Types of Operating System, Functions of an Operating System, Modern Operating Systems. [Q-2]",
              sourcePage: 9,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Computer Languages & Computer Software",
              syllabusText:
                "Introduction, Evolution of Programming Languages, Classification of Programming Languages, Generations of Programming Languages, Features of a Good Programming Language, Selection of a Programming Language, Software: Definition, Relationship between Software and Hardware, Software Categories, System Software, Application Software, Software Terminology. [Q-1]",
              sourcePage: 9,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Internet Basics",
              syllabusText:
                "Introduction, Evolution of Internet, Basic Internet Terms, Getting Connected To Internet, Internet Applications, Electronic Mail - An Introduction, How Email Works, Search Engines, Languages of Internet, Internet and viruses. [Q-1]",
              sourcePage: 9,
              notes: [],
            },
          ],
        },
        {
          id: "paper2",
          code: "MCA C1002",
          title: "Data Structures  through C",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 10,
          detailTitle: "DATA STRUCTURE THROUGH C (MCA C1002)",
          units: [
            {
              id: "unit1",
              number: 1,
              title:
                "Introduction, Operators, Decision Making& Branching, Array and String",
              syllabusText:
                "History and Importance of C, Sample programming, Basic Structure and execution of C programs, Constants, Variables, and Data Types and various type of declarations, Different type operators and Expressions, Operator Precedence and Associability, Mathematical and Character Functi ons., Decision Making and Branching, Looping. One – dimensional Arrays and their declaration and Initializations, Two-dimensional Arrays and their initializations, Multidimensional Arrays, Dynamic Arrays, String handling functions. [Q-1]",
              sourcePage: 10,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Function, Structure, Union and Pointer",
              syllabusText:
                "Need and Elements for user –defined Functions, Definition of Functions, Return values and their types, Function calls and Declaration, Arguments and corresponding return values, Functions that return multiple values, Nesting of functions, Recursion, Defining Structure, Declaring Structure Variable and Accessing Structure Members, Initialization of Structure, Comparing Structure Variables, Arrays of Structures, and Structures within structures, Unions, Understanding Poi nters, Accessing the Address of a Variable, Declaration and Initialization of Pointer Variables, Accessing a Variable through its Poin ter, File Management in C. [Q-2]",
              sourcePage: 10,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Introduction to Data Structure, Lists, Stacks and Queues",
              syllabusText:
                "Need of Data Structure, Algorithm, Complexity, Asymptotic Notations, Introduction to linked lists; Linked list types, operations on linked list; Introduction and primitive operations on stack; Stack application; Infix, postfix, prefix expressions; Evaluation of postfix expressio n; Conversion between prefix, infix and postfix, introduction and primitive operation on queues. [Q-2]",
              sourcePage: 10,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Trees, m –Way Trees and Graphs",
              syllabusText:
                "Introduction, Tree terminology; Traversal of binary trees; Recursive algorithms for tree operations such as traversal, insertion, deletion; Binary Search Tree. The invention of B -Tree; Example for creating a B - Tree, B+ Tree, AVL tree. Graph Definition and Terminology, Directed and Undirected graph with adjacency Matrix; Weighted Graph, Graph Linked representation, DFS and BFS. [Q-2]",
              sourcePage: 10,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Sorting & Searching Techniques",
              syllabusText:
                "Sorting : Insertion sort, Selection sort, Merge sort, Bubble sort, Heap Sort Searching Techniques: Linear search & Binary search [Q-1]",
              sourcePage: 10,
              notes: [],
            },
          ],
        },
        {
          id: "paper3",
          code: "MCA C1003",
          title: "Operating System Concepts",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 11,
          detailTitle: "OPERATING SYSTEM CONCEPTS (MCA C1003)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction",
              syllabusText:
                "Introduction to OS Operating system functions, evaluation of O.S., Different types of O.S. batch, mu lti- programmed, time-sharing, real-time, distributed, parallel. System Structure Computer system operation, I/O structure, storage structure, storage hierarchy, different types of protections, operating syste m structure (simple, layered, virtual machine), O/S services, system calls. [Q-1]",
              sourcePage: 11,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Processes",
              syllabusText:
                "Concept of processes, proce ss scheduling, operations on processes, operating processes, inter -process communication. Process Synchronization: background, critical section problem, critical region, synchronization hardware, classical problems of synchronization, semaphores. Threads: overview, benefits of threads, user and kernel threads.CPU scheduling ]: scheduling criteria, preemptive & non - preemptive scheduling, scheduling algorithms,, multi-processor scheduling. [Q- 2]",
              sourcePage: 11,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Deadlocks",
              syllabusText:
                "System model, deadlock characterization, methods for handling deadlocks, deadlock prevention, deadlock avoidance, deadlock detection, recovery from deadlock. Memory Management: background, logical vs. physical address space, swapping, contiguous memory allocation, paging, segmentation, segmentation with paging. Virtual Memory ]: background, demand paging, performance, page replacement, page replacement algorithms, allocation of frames, thrashing. [Q-2]",
              sourcePage: 11,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "File Systems",
              syllabusText:
                "File concept, access methods, directory structure, file system structur e, allocation methods (contiguous, linked, indexed), free -space management (bit vector, linked list, grouping), directory implementation (linear list, hash table), efficiency & performance .I/O Management: I/O hardware, polling, interrup ts, DMA, applicatio n I/O interface (block and character devices, network devices, clocks and timers, blocking and non -blocking I/O), kernel I/O subsystem (scheduling, buffering, caching, spooling and device reservation, error handling), performance. [Q-2]",
              sourcePage: 11,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Disk Management",
              syllabusText:
                "Disk structure, disk scheduling, disk reliability, disk formatting, boot block, bad blocks. Protecti on & Security: Protection & Security Goals of protection, domain of protection, security problem, authentication, one time password, program threats, system threats, threat monitoring, encryption.[Q-1]",
              sourcePage: 11,
              notes: [],
            },
          ],
        },
        {
          id: "paper4",
          code: "MCA C1004",
          title: "Database Management System",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 12,
          detailTitle: "DATABASE MANAGEMENT SYSTEMS (MCA C1004)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction",
              syllabusText:
                "File systems versus Database systems, Advantages of DBMS, DBMS classification/types, DBMS structure, three schema DBMS architecture, Data Models, Data Independence, Data abstraction, Database Users, Database Schemas and Database Instances, Views and its advantages, Data dictionary, DBA and its functions, RDBMS, Difference between DBMS and RDBMS. [Q-2]",
              sourcePage: 12,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "E-R-Model & Relational Model",
              syllabusText:
                "Entities and Entity Sets, Relationships and R elationship Sets, Mapping Cardinality, ER Diagram, Reducing ER Diagram to tables, Specialization, Generalization and Aggregation. Codd’s rule, RDBMS Concepts, Types of Keys, Constraints Types, Relational database Scheme, Procedural & Non Procedural Languages, Relational Algebra, Relational Calculus. [Q-2]",
              sourcePage: 12,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "SQL/PLSQL",
              syllabusText:
                "Basic Concepts, Basic SQL, Advance SQL, Database languages, Set operations, Aggregate Functions, Null Values, views, Sub-queries, Integrity Constraints(Entity integrity, Referential integrity and Domain constraint), SQL Constraints Types , Indexing , Cursors, Stored procedures and triggers. [Q-1]",
              sourcePage: 12,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Database Design",
              syllabusText:
                "Pitfalls in relational database design, Normalization using functional dependency, Multivalu ed and join dependencies, Atomic values, Full and Partial Functional Dependency, 1NF, 2NF, 3NF, BCNF, 4NF, 5NF. [Q-2]",
              sourcePage: 12,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Transaction Processing and Concurrency Control",
              syllabusText:
                "DBMS Transaction, ACID Properties, States of Transaction, Serializability, DBMS Concurrency control, DBMS deadlock, Deadlock avoidance, Deadlock detection, Deadlock Prevention, , Schedules and Recovery, Locking and Timestamp Ordering for concurrency control. [Q-1]",
              sourcePage: 12,
              notes: [],
            },
          ],
        },
        {
          id: "paper5",
          code: "MCA C1005",
          title: "Computer Organization & Architecture",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 13,
          detailTitle: "COMPUTER ORGANIZATION AND ARCHITECTURE (MCA C1005)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Fundamentals of Digital Logic Design",
              syllabusText:
                "Axioms and laws of Boolean algebra, Reduction of Boolean expressions, Logic gates, Conversion between canonical forms, Karnaugh map (4 variable), Combinati onal Circuits: Half Adder, Full adder, Decoder, Encoder, Multiplexer, Sequential Circuits: Flip-flop, SR, JK, T, D-Latch, Master slave. [Q-2]",
              sourcePage: 13,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Computer System",
              syllabusText:
                "Comparison of Computer Organization & Architecture, Von-Neumann concept, Computer Components and Functions, Interconnection Structures. Bus Interconnections, Input / Output: I/O Module, Programmed I/O, Interrupt Driven I/O, Direct Memory Access. [Q-2]",
              sourcePage: 13,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Memory Organization",
              syllabusText:
                "Classification and design parameters, Memory Hierarchy, RAM, SRAM and DRAM, Associative Memory. Cache Memory: Design Principles, Cache Memory mappings, Cache performance, Cache Coherence. [Q-1]",
              sourcePage: 13,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Processor Organization",
              syllabusText:
                "Instruction Formats, Instruction Sets, Addressing Modes, Addressing Modes Examples with Assembly Language[8085/8086 CPU] , Processor Organization, Structure and Function. Register Organization, Instruction Cycle, Multiplication algorithm (Booth’s), Divide algorithms (Restoring & Non -Restoring), Floating point representation. Control Unit: Micro-Operations, Functional Requirements, Processor Control, Hardwired Implementation, Micro-programmed Control. [Q-2]",
              sourcePage: 13,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Pipelining",
              syllabusText:
                "Instruction Pipelining, Pipel ining Hazards, Pipeline Performance Evaluation, RISC and CISC Architecture, Flynn’s classification –SISD,SIMD, MISD, MIMD. [Q-1]",
              sourcePage: 13,
              notes: [],
            },
          ],
        },
        {
          id: "paper6",
          code: "MCA C1006",
          title: "Management Information System",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 14,
          detailTitle: "MANAGEMENT INFORMATION SYSTEM (MCA C1006)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to MIS",
              syllabusText:
                "Systems, data, Information and knowledge, importance of MIS in competitive business environment Introduction to information technology: Database management system, Networking, System and application software. [Q-2]",
              sourcePage: 14,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Types of information systems",
              syllabusText:
                "Management information systems, Transaction processing systems, decision support systems, expert systems, Office automation systems and knowledge-based systems. [Q-1]",
              sourcePage: 14,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Decision Making",
              syllabusText:
                "Structured decision making, Unstructured decision making and semi structured decision making. [Q-1]",
              sourcePage: 14,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Functional information system",
              syllabusText:
                "Marketing, Finance, HR, Production / Operations information systems [Q-2]",
              sourcePage: 14,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Enterprise Resource Planning",
              syllabusText:
                "Process Mapping, Implementation management, ERP System, Information systems Value and Effectiveness [Q-2]",
              sourcePage: 14,
              notes: [],
            },
          ],
        },
        {
          id: "paper7",
          code: "MCA P1007",
          title: "Fundamentals of Computers Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper8",
          code: "MCA P1008",
          title: "Data Structures Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper9",
          code: "MCA P1009",
          title: "Database Management System Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
      ],
    },
    {
      id: "sem2",
      number: 2,
      title: "Semester 2",
      credits: 30,
      papers: [
        {
          id: "paper1",
          code: "MCA C2001",
          title: "Advance Java Programming",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 15,
          detailTitle: "ADVANCE JAVA PROGRAMMING  (MCA C2001)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Principles of Object-oriented Programming",
              syllabusText:
                "Object-oriented Programming, Paradigm, Basic Concepts of Object -oriented Programming, Benefits of OOPs, Application of OOP, Data Types , Operators , Control Structure and looping Classes and Objects : Defining a Class, Adding Variables and Methods, Creating Objects, Accessing Class Members, Constructors, Methods Overloading, Static Members, Nesting of Methods, Arrays within a Class, Memory Allocation for Objects, Static Data Member, Static Member Functions, Arrays of Objects, Objects as Function Arguments. [Q-2]",
              sourcePage: 15,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Inheritances",
              syllabusText:
                "Inheritance: Extending a Class, Overriding Methods, Final Variables and Methods, Final Classes, Finalize Methods, Abstract methods and Classes, Visibility Control. Interface & Packages : One - Dimensional & two Dimensional Array, Strings, Vectors, wrapper Classes, Defining Interface, Extending Interface, Implementing Interface, Accessing Interface, System Packages, Using System Package, Adding a Class to a Package, Hiding Classes. [Q-2]",
              sourcePage: 15,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Threads",
              syllabusText:
                "Creating Threads. Extending the Threads Class, Stopping and Blocking a Thread, Life-Cycle of a Thread, Using Thread Methods, Thread Exceptions, Thread Priority, Synchronization, Implementing the Runnable Interface. [Q-1]",
              sourcePage: 15,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title:
                "Components and Facilities or Rich Graphical User Interfaces",
              syllabusText:
                "Programming with the JFC, Swing API Components, component Class, Windows, Dialog Boxes, and Panels, Labels, Buttons, and Check Boxes, Menus, Toolbars, and Actions, Sliders, Spinners, Progress Bars, and Scrollbars, Lists and Combo Boxes, Text -Entry Components, Color and File Choosers, Tables and Trees, Printing with the 2D API, Java Print Service API. [Q-1]",
              sourcePage: 15,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Using Relational Database",
              syllabusText:
                "Introduction, Best Practices for Programming for Databases, JDBC Drivers for RDBM Systems, SQL to Java Type Mappings, Understanding the Database used in this chapter, Using the java.sql API, Coding Transactions, Working with Sockets. [Q-1]",
              sourcePage: 15,
              notes: [],
            },
            {
              id: "unit6",
              number: 6,
              title: "Building Web Applications",
              syllabusText:
                "Introduction, The Technology of the Web, J2EE Web Application Packaging, Servlets, The Servlet API, The User Experience, Building a Web App with Continuity, Java Server Pages, JSP Tags and API, How the Server Processes JSPs, Java Coding in JSPs, Frameworks for Building Web Applications, Building Robust,WebApps. [Q-1]",
              sourcePage: 15,
              notes: [],
            },
          ],
        },
        {
          id: "paper2",
          code: "MCA C2002",
          title: "Design and Analysis of Algorithms",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 16,
          detailTitle: "DESIGN AND ANALYSIS OF COMPUTER ALGORITHMS (MCA C2002)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction",
              syllabusText:
                "Algorithms and structured programming, analysing algorithms, asymptotic behaviour of an algorithm, Order notati ons, time and space complexities (polynomial, logrithmic and exponential), average and worst case analysis, lower and upper bounds. [Q-1]",
              sourcePage: 16,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Advanced data structures",
              syllabusText:
                "Threaded trees, B -trees, Heaps and heapsort, sets and relations, Graphs, Hashing. Ba sic search & Traversal Techniques (Breadth first and Depth first traversals of Graphs). [Q-2]",
              sourcePage: 16,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Algorithm design strategies",
              syllabusText:
                "Divide and conquer (Mergesort, Quicksort, matrix multiplication). Greedy method: General method, knapsack problem, job sequencing with deadlines, minimum cost spanning trees). Dynamic programming (0/1 knapsack, travelling salesman problem). [Q-2]",
              sourcePage: 16,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Backtracking",
              syllabusText:
                "8 - Queens problem, Sum of Subsets, Graph coloring, 0/1 Knapsack. Branch & Bound (0/1 knapsack, Travelling salesman). [Q-2]",
              sourcePage: 16,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Approximation algorithms",
              syllabusText:
                "Polynomial Time Approximation Schemes. Complexity: - NP-Hard and NP-complete Problems - Cook's theorem, NP completeness reductions. [Q-1]",
              sourcePage: 16,
              notes: [],
            },
          ],
        },
        {
          id: "paper3",
          code: "MCA C2003",
          title: "Data Communication & Computer Networks",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 17,
          detailTitle: "DATA COMMUNICATIONS AND COMPUTER NETWORKS (MCA C2003)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Data Communication basics",
              syllabusText:
                "Introduction: Definition and Uses of Computer Network, Criteria for a Data Communication Network, Classification of Computer network, Network Architecture, OSI Reference Model. Data communication: Data Communication, Transmission Impairments, Transmission Medium. Data Encoding: Line Encoding, Types of Line Coding, Analog -to-Digital Conversion- Pulse code modulation (PCM), Delta modulation (DM); Transmission Modes. [Q-2]",
              sourcePage: 17,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Data Link Layer",
              syllabusText:
                "Data Link Layer Basics. Error Detection and Correction - One and two dimensional parity checks, Hamming code, Cyclic redundancy check (CRC); Framing - Character stuffing, Bit stuffing; Flow and Error Control Protocols: Stop-and-wait ARQ, Go back N ARQ, Selective repeat ARQ. MAC and LLC Sub-layers-Channel Allocation Problem, Pure ALOHA and Slotted ALOHA, Persistent and non - persistent CSMA. Ethernet and Wired LANs: IEEE 802 Standards, Standard Ethernet, Changes in the Standard, Fast Ethernet, Gigabit Ethernet. [Q-2]",
              sourcePage: 17,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Network Layer",
              syllabusText:
                "IP Addressing Scheme, Subnet Addressing, Subnet Masks, IPV4 Addressing, IPV6 Addressing, Address Resolution Protocol (ARP), Reverse Address Resolution Protocol (RARP). Unicast Routing: Routing Characteristics, Routing Algorithms, Routing Table, Comparison of Routing Algorithms. [Q-1]",
              sourcePage: 17,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Transport Layer",
              syllabusText:
                "Services of Transport Layer, Connection Establishment, Connection Release, Transport Layer Protocols - TCP protocol, UDP protocol. [Q-1]",
              sourcePage: 17,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Traffic Engineering Principles",
              syllabusText:
                "Congestion Control Algorithms - General principles of congestion control, Congestion prevention policies; Quality of Service - Traffic shaping, Leaky bucket algorithm, Token bucket algorithm; Integrated Services. [Q-1]",
              sourcePage: 17,
              notes: [],
            },
            {
              id: "unit6",
              number: 6,
              title: "Application Layer",
              syllabusText:
                "Client-Server Model: Socket Interface, Domain Name System (DNS), Electronic Mail (SMTP), and File Transfer (FTP), HTTP and WWW, Multimedia. [Q-1]",
              sourcePage: 17,
              notes: [],
            },
          ],
        },
        {
          id: "paper4",
          code: "MCA C2004",
          title: "Discrete Mathematics",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 18,
          detailTitle: "DISCRETE MATHEMATICS (MCA C2004)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Logic & Counting",
              syllabusText:
                "Propositions and Logical Operations, Conditional State ments, Mathematical Induction. Permutation, Combination, Pigeonhole Principle, Elements of Probability. [Q2]",
              sourcePage: 18,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Relations and Digraphs",
              syllabusText:
                "Relations and partition , Graph, Relations and Digraphs, Paths in a Digraph, Matrix Representation of Relations and Digraphs, Operations on Relations, Transitive Closure, Euler’s graph, Hamiltonian graph, Planar graph. [Q2]",
              sourcePage: 18,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Lattice and Boolean Algebra",
              syllabusText:
                "Partial Ordered Sets, External Elements of Partially Ordered Sets, Lattices, Finite Boolean Algebra, Circuit Design. [Q2]",
              sourcePage: 18,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Trees",
              syllabusText:
                "Trees, Labelled Trees, Tree Searching, Minimum Spanning Trees Prim’s and Kruskal’s algorithms. [Q1]",
              sourcePage: 18,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Semigroups and Groups",
              syllabusText:
                "Binary Operations, Semigroups, Products and Quotients of Semigroups, Groups, Products and Quo tients of Groups. [Q1]",
              sourcePage: 18,
              notes: [],
            },
          ],
        },
        {
          id: "paper5",
          code: "MCA C2005",
          title: "Software Engineering",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 7,
          detailPage: 19,
          detailTitle: "SOFTWARE ENGINEERING (MCA C2005)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Software Engineering",
              syllabusText:
                "Software Engineering – A layered Technology, Software Characteristics, Software Application, Software Engineering Process and SDLC Model, Waterfall Model, Pro totype Model, Incremental Process Models, V Model, RAD Model, Spiral Model, Agile Process Model. [Q-2]",
              sourcePage: 19,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Requirement & Design Engineering",
              syllabusText:
                "Requirement Analysis and Software Requirement Specifications, Requirements Gathering Methods, Data Flow Diagrams, Data Dictionaries, Entity -Relationship Diagram, Software Design Introduction, Coupling and Cohesion, Function Oriented Design and Object Oriented Design. [Q-1]",
              sourcePage: 19,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Testing Strategies and Testing Tactics",
              syllabusText:
                "Strategic Approach to software Testi ng, Verification and Validation Testing, White Box Testing, Basic Path Testing, Control Structure Testing, Black Box Testing, Unit Testing, Integration Testing, Bottom-up and Top -down Testing, System Testing, Function Testing, Performance Testing, Acceptan ce Testing, Installation Testing, Test Case Generation. [Q-2]",
              sourcePage: 19,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Software Metrics and Project Management",
              syllabusText:
                "Issues in Project Management, Management Functions, Software Project Management Plan, Software Management Structure, Software Project Complexity, Software Metrics – Basic Consideration, Size Oriented metrics and Function Point Oriented metrics; Software Cost Estimation Techniques, The COCOMO Model, Project Scheduling, Software Project Planning.[Q-2]",
              sourcePage: 19,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Software Quality and Configuration Management",
              syllabusText:
                "Software Quality Concepts, Software Quality Assurance and Quality Control, Software Reliability, Software Configuration Management, SCM Repository, and SCM Process. [Q-1]",
              sourcePage: 19,
              notes: [],
            },
          ],
        },
        {
          id: "paper6",
          code: "MCA P2006",
          title: "Advance Java Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper7",
          code: "MCA P2007",
          title: "Algorithms Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper8",
          code: "MCA P2008",
          title: "Computer Networks Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 7,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper9",
          code: "MCA E2009",
          title: "Cyber Security",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 27,
          detailTitle: "CYBER SECURITY (MCA E2009)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Cyber Security",
              syllabusText:
                "Overview of Cyber Security, Internet Governance – Challenges and Constraints, Cyber Threats: - Cyber Warfare-Cyber Crime -Cyber terrorism -Cyber Espionage, Need for a Comprehensive Cyber Security Policy, Need for a Nodal Authority, Need for an International convention on Cyberspace. [Q-1]",
              sourcePage: 27,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title:
                "Cyber Security Vulnerabilities and Cyber Security Safeguards",
              syllabusText:
                "Cyber Security Vulnerabilities -Overview, vulnerabilities in software, System administration, Complex Network Architectures, Open Access to Organizational Data, Weak Authentication, Unprotected Broadband communications, Poor Cyber Security Awareness . Cyber Security Safeguards - Overview, Access control, Audit, Authentication, Biometrics, Cryptography, Deception, Denial of Service Filter s, Ethical Hacking, Firewalls, Intrusion Detection Systems, Response, Scanning, Security policy, Threat Management. [Q-2]",
              sourcePage: 27,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Securing Web Application, Services and Servers",
              syllabusText:
                "Introduction, Basic security for HTTP Applications and Services, Basic Security for SOAP Services, Identity Management and Web Services, Authorization Patterns, Security Considerations, Challeng es. [Q-1]",
              sourcePage: 27,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Intrusion Detection and Prevention",
              syllabusText:
                "Intrusion, Physical Theft, Abuse of Privileges, Unauthorized Access by Outsider, Malware infection, Intrusion detection and Prevention Techniques, Anti -Malware software, Network based Intrusion detection Systems, Network based Intrusion Prevention Systems, Host based Intrusion prevention Systems, Security Information Management, Network Session Analysis, System Integrity Validation . [Q-1]",
              sourcePage: 27,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Cryptography and Network Security",
              syllabusText:
                "Introduction to Cryptography, Symmetric key Cryptography, Asymmetric key Cryptography, Message Authentication, Digital Signatures, Applications of Cryptography. Overview of Firewalls - Types of Firewalls, User Management, VPN Security Security Protocols: - security at the Application Layer- PGP and S/MIME, Security at Transport Layer- SSL and TLS, Security at Network Layer-IPSec. [Q-2]",
              sourcePage: 27,
              notes: [],
            },
            {
              id: "unit6",
              number: 6,
              title: "Cyberspace and the Law",
              syllabusText:
                "Introduction, Cyber Security Regulations, Roles of International Law, the state and Privat e Sector in Cyberspace, Cyber Security Standards. The INDIAN Cyberspace, National Cyber Security Policy 2013. [Q-1]",
              sourcePage: 27,
              notes: [],
            },
          ],
          electiveGroup: "Elective I",
        },
        {
          id: "paper10",
          code: "MCA E2010",
          title: "Artificial Intelligence",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 28,
          detailTitle: "ARTIFICIAL INTELLIGENCE (MCA E2010)",
          units: [
            {
              id: "unit1",
              number: 1,
              title:
                "Introduction, Intelligent Agents and Problem Solving Space",
              syllabusText:
                "Introduction: Overview of Artificial Intelligence - Problems of AI, AI Technique, Tic-Tac-Toe Problem. Intelligent Agents: Agents & Environment, Nature Of Environment, Structure Of Agents, Goal Based Agents, Utility Based Agents, Learning Agents. Problem Solving: Problems, Problem Space & Search: Defining The Problem As State Space Search, Production System, Problem Characteristics, Issues In The Design Of Search Programs. [Q-2]",
              sourcePage: 28,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Search Techniques",
              syllabusText:
                "Solving Problems By Searching, Problem Solving Agents, Searching For Solutions; Uniform Search Strategies: Breadth First Search, Depth First Search, Depth Limited Search, Bi -directional Search, Comparing Uniform Search Strategies. Heuristic Search Strategies: Greedy Best-First Search, A* Search, Memory Bounded Heuristic Search: Local Search Algorithms & Optimization Problems : Hill Climbing Search, Simulated Annealing Search, Local Beam Search, Genetic Algorithms; Constraint Satisfaction Problems, Local Search For Constraint Satisfaction Problems. Adversarial Search: Games, Optimal Decisions & Strategies in Games, The Mini Max Search Procedure, Alpha-Beta Pruning, Additional Refinements, Iterative Deepening. [Q-2]",
              sourcePage: 28,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Knowledge & Reasoning",
              syllabusText:
                "Knowledge Representation Issues, Representation & Mapping, Approaches to Knowledge Representation, Issues in Knowledge Representation. Using Predicate Logic: Representing Simple Fact in Logic, Representing Instant & ISA Relationship, Computable Functions & Predicates, Resolution, and Natural Deduction. Representing Knowledge Using Rules: Procedural Verses Declarative Knowledge, Logic Programming, Forward Verses Backward Reasoning, Matching, Control Knowledge. [Q-2]",
              sourcePage: 28,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Probabilistic Reasoning",
              syllabusText:
                "Representing Knowledge in an Uncertain Domain, Bayesian Networks, Dempster -Shafer Theory. Planning: Overview, Components of A Planning System, Goal Stack Planning, Hierarchical Planning. Learning: Forms Of Learning, Inductive Learning, Explanation Based Learning, Neural Net Learning & Genetic Learning. [Q-1] Module 5: Natural Language Processing and Robotics: Brief introduction to Syntactic Processing, Semantic Analysis, Discourse & Pragmatic Processing. Robotics: Introduction, Robot hardware, robotic perception, planning to move, planning uncertain movements, robotic software architecture, application domains. [Q-1]",
              sourcePage: 28,
              notes: [],
            },
          ],
          electiveGroup: "Elective I",
        },
        {
          id: "paper11",
          code: "MCA E2011",
          title: "Cloud Computing",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 29,
          detailTitle: "CLOUD COMPUTING (MCA E2011)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Cloud Computing Fundamentals",
              syllabusText:
                "Cloud Computing definition, Types of cloud, Cloud services: Benefits and challenges of cloud computing, Evolution of Cloud Computing , Applications cloud computing, Business models around Cloud – Major Players in Cloud Computing - Issues in Cloud - Eucalyptus - Nimbus - Open Nebula, CloudSim. [Q-1]",
              sourcePage: 29,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Cloud Computing Models",
              syllabusText:
                "Cluster Computing, Grid Computing, Grid Computing Versus Cloud Computing, Key Characteristics of Cloud Computing. Cloud Models: Benefits of Cloud Models, Public Cloud, Private Cloud, Hybrid Cloud, Community Cloud, Shared Private Cloud, Dedicated Private Cloud, and Dynamic Private Cloud. [Q-2]",
              sourcePage: 29,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Cloud Services and File System",
              syllabusText:
                "Types of Cloud services: Software as a Service - Platform as a Service – Infrastructure as a Service - Database as a Service- Monitoring as a Service – Communication as services. Service providers - Google App Engine, Amazon EC2, Microsoft Azure, Sales force. [Q-2]",
              sourcePage: 29,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Virtualization",
              syllabusText:
                "Basics of Virtualization - Types of Virtualization - Implementation Levels of Virtualization - Virtualization Structures - Tools and Mechanisms - Virtualization of CPU, Memory, I/O Devices - Virtual Clusters and Resource management – Virtualization for Data-center Automation. Introduction to MapReduce, GFS, HDFS, Hadoop Framework. [Q-2]",
              sourcePage: 29,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Security in the Cloud",
              syllabusText:
                "Security Overview – Cloud Security Challenges and Risks – Software-as-a-Service Security – Security Monitoring – Security Architecture Design – Data Security – Application Security – Virtual Machine Security - Identity Management and Access Control – Autonomic Security. [Q-1]",
              sourcePage: 29,
              notes: [],
            },
          ],
          electiveGroup: "Elective I",
        },
      ],
    },
    {
      id: "sem3",
      number: 3,
      title: "Semester 3",
      credits: 30,
      papers: [
        {
          id: "paper1",
          code: "MCA C3001",
          title: "Data Warehousing & Data Mining",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 20,
          detailTitle: "DATA WAREHOUSING & DATA MINING (MCA C3001)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction",
              syllabusText:
                "Fundamentals of data mining, Data Mining Functionalities, Classification of Data Mining systems, Maj or issues in Data Mining, Data Warehouse and OLAP Technology for Data Mining Data Warehouse, Multidimensional Data Model, Data Warehouse Architecture, Data Warehouse Implementation, Further Development of Data Cube Technology, From Data Warehousing to Data Mining . [Q-1]",
              sourcePage: 20,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Data Preprocessing",
              syllabusText:
                "Needs Preprocessing the Data, Data Cleaning, Data Integration and Transformation, Data Reduction, Discretization and Concept Hierarchy Generation, Online Data Storage.Data Mining Primitives, Languages, and System Architectures: Data Mining Primitives, Data Mining Query Languages, Designing Graphical User Interfaces Based on a Data Mining Query Language Architectures of Data Mining Systems. [Q-2]",
              sourcePage: 20,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Concepts Description",
              syllabusText:
                "Characterization and Comparison: Data Generalization and Summarization -Based Characterization, Analytical Characterization: Analysis of Attribute Relevance, Mining Class Comparisons: Discriminating between Different Classes, Mining Descriptive Statistical Measures in Large Databases. [Q-1]",
              sourcePage: 20,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Mining Association Rules in Large Databases",
              syllabusText:
                "Association Rule Mining, Mining Single -Dimensional Boolean Association Rules from Transactional Databases. Mining Multilevel Association Rules from Transaction Databases, Mining Multidimensional Association Rules from Relational Databases and Data Warehouses, From Association Mining to Correlation Analysis, Constraint - Based Association Mining. [Q-2]",
              sourcePage: 20,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Classification and Prediction",
              syllabusText:
                "Issues Regarding Classification and Prediction, Classification by Decision Tree Induction, Bayesian Classification, Classification by Back propagation, Classification Based on Concepts from Associatio n Rule Mining, Other Classification Methods, Prediction, Classifier Accuracy. Cluster Analysis Introduction: Types of Data in Cluster Analysis, A Categorization of Major Clustering Methods, Partitioning Methods, Density -Based Methods, Grid -Based Methods, Model -Based Clustering Methods, Outlier Analysis. [Q-2]",
              sourcePage: 20,
              notes: [],
            },
          ],
        },
        {
          id: "paper2",
          code: "MCA C3002",
          title: "Compiler Design",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 21,
          detailTitle: "COMPILER DESIGN (MCA C3002)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Compiler",
              syllabusText:
                "Compilers, Analysis of the source program, The phases of the compiler, Major data structures in a Compiler, Issues in a Compiler Structure, Bootstrapping and Porting Scanning : Scanning Process.[Q-1]",
              sourcePage: 21,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Regular Expressions and Finite Automata",
              syllabusText:
                "Regular languages and Regular Expressions, Memory required to recognize a language, Fin ite Automata, Deterministic Finite Automata , Non -Deterministic Finite Automata, NFA with e -moves, regular sets, Equivalence of DFA and NDFA, Regular and Non -regular languages: Criterion for Regularity, Minimal Finite Automata, Context Free Grammars: Introduction, definition, Regular Grammar, Derivation trees, Ambiguity, Simplified forms and Normal Forms. [Q-2]",
              sourcePage: 21,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Parsing",
              syllabusText:
                "Top-down Parsing: Top down Parsing by Recursive Descent, LL(1), First and Follow sets, Recursive Descent Parser for a Tiny language, Error Recovery in Top-down Parser. Bottom-up Parsing : Overview of Bottom -up Parsing, LR(0) items and LR( 0 ) Parsing, SLR(1), General LR(1) and LALR(1) Parsing, YACC , Error Recovery in Bottom-up Parser. [Q-2]",
              sourcePage: 21,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Semantic Analysis",
              syllabusText:
                "Attributes and Attributes Grammars, Algorithms for Attribute Computation, Symbol Table, Data types and Data type Checking, Semantic Analyzer for Tiny language. Run-time Environments: Memory organization during program execution, Fully static run-time environment, S tack-based run -time environments, Dynamic memory, Parameter passing mechanism, Run -time environment for Tiny language. [Q-2]",
              sourcePage: 21,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Code Generation",
              syllabusText:
                "Intermediate code and data structures for code generation, Basic code generation techniques, Code generation of Control statements and Logical expressions. [Q-1]",
              sourcePage: 21,
              notes: [],
            },
          ],
        },
        {
          id: "paper3",
          code: "MCA C3003",
          title: "Programming in Python",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 22,
          detailTitle: "PROGRAMMING IN PYTHON (MCA C3003)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Python Programming Language",
              syllabusText:
                "Programming Language, History and Origin of Python Language, Features of Python, Limitations, Major Applications of Python, Getting, Installing Python, Setting up Path and Environment Variables, Running Python, First Python Program, Python Interactive Help Feature, Python di fferences from other languages. [Q-1]",
              sourcePage: 22,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Python Data Types & Input/Output",
              syllabusText:
                "Keywords, Identifiers, Python Statement, Indentation, Documentation, Variables, Multiple Assignment, Understanding Data Type, Data Type Conversion, Python Input and Output Functions, Import command. Operators and Expressions: O perators in Python, Expressions, Precedence, Associativity of Operators, Non Associative Operators. Control Structures: Decision making statements, Python loops, Python control statements. [Q-1]",
              sourcePage: 22,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Python Native Data Types",
              syllabusText:
                "Numbers, Lists, Tuples, S ets, Dictionary, Functions & Methods of Dictionary, Strings (in detail with their methods and operations). Python Functions: Functions, Advantages of Functions, Built -in Functions, User defined functions, Anonymous functions, Pass by value Vs. Pass by Refe rence, Recursion, Scope and Lifetime of Variables. [Q-2]",
              sourcePage: 22,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Python Modules",
              syllabusText:
                "Module definition, Need of modules, Creating a module, Importing module, Path Searching of a Module, Module Reloading, Standard Modules, Python Packages. Exception Handling: Exceptions, Built -in exceptions, Exception handling, User defined exceptions in Python. [Q-2]",
              sourcePage: 22,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "File Management in Python",
              syllabusText:
                "Operations on files (opening, modes, attributes, encoding, closing), read() & write() methods, tell( ) & seek() methods, renaming & deleting files in Python, directories in Python. Classes and Objects: The concept of OOPS in Python, Designing classes, Creating objects, Accessing attributes, Editing class attributes, Built-in class attributes, Garbage collection, Destroying objects. [Q-2]",
              sourcePage: 22,
              notes: [],
            },
          ],
        },
        {
          id: "paper4",
          code: "MCA C3004",
          title: "Soft Computing",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 23,
          detailTitle: "SOFT COMPUTING (MCA C3004)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Artificial Intelligence",
              syllabusText:
                "Role of AI in engineering, AI in daily life, Intelligence and Artificial Intelligence, Different tas k domains of AI, Programming methods, Limitations of AI Intelligent Agent: Agent, Performance Evaluation, task environment of agent, Agent classification, Agent architecture. [Q-1]",
              sourcePage: 23,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Concepts of Soft Computing",
              syllabusText:
                "Hard computing Vs Soft Computing, Soft computing constituents – ANN, Fuzzy Logic, GA Applications of Soft Computing. [Q-2]",
              sourcePage: 23,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Neural Network",
              syllabusText:
                "Artificial Neural Network - Introduction, Fundamental Concept, Artificial Neural Network, Brain vs. Computer - Comparison Between Biological Neuron and Artificial Neuron, Basic Models of Artificial Neural Network Supervised Learning Network -Linear Separability, Perceptron Networks, Adaptive Linear Neuron (Adaline), Multiple Adaptive Linear Neurons, Back -Propagation Network. Unsupervised Learning Networks- MaxNet. [Q-2]",
              sourcePage: 23,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Fuzzy Logic",
              syllabusText:
                "Introduction to Fuzzy Logic, Classical Sets and Fuzzy Sets: Introduction to Fuzzy Logic, Class ical Sets (Crisp Sets),Fuzzy Sets Classical Relations and Fuzzy Relations: Introduction, Cartesian Product of Relation, Classical Relation, Fuzzy Relations Membership Functions: Introduction, Features of the Membership Functions, Fuzzification, Methods of Membership Value Assignments Defuzzification: Introduction, Lambda -Cuts for Fuzzy Sets (Alpha -Cuts), Lambda -Cuts for Fuzzy Relations, Defuzzification Method. [Q-2]",
              sourcePage: 23,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Genetic Algorithm",
              syllabusText:
                "Genetic Algorithm: Basic concepts, Difference between genetic algorithm and traditional methods, Simple genetic algorithm, Working principle, Procedures of GA, Genetic operators : R eproduction, Mutation, crossover. [Q-1]",
              sourcePage: 23,
              notes: [],
            },
          ],
        },
        {
          id: "paper5",
          code: "MCA C3005",
          title: "Financial Accounting",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 24,
          detailTitle: "COMPUTERIZED FINANCIAL ACCOUNTING (MCA C3005)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction",
              syllabusText:
                "Origin, People Interested in Accounts, Accounting Standards, Book -Keeping, Double Entry System, Classification of Business Accounts, “Golden Rules”, Journal, Subsidiary Books, Ledger Posting & Balancing, Concept of Trial Balance, Errors and Omission, Final Accounts with Adjustments, Inventories and its types, Introduction to Financial Accounting,(Tally 7.2), Creating Company Master, Modification & Deletion.[Q-3]",
              sourcePage: 24,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Financial Accounting",
              syllabusText:
                "Definition, Aims, Traditional vs. Innovative Management Accounting Practices, Development of Throughput Accounting, An Alternative view of Management Accounting, Lean Accounting(Accounting for Lean), Fund Flow and Cash Flow Statement, C -V-P Analysis, MIS in Report Preparation, System Flow Chart and Data Flow Diagram.[Q-2]",
              sourcePage: 24,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Voucher Entry& Invoice",
              syllabusText:
                "Payments Voucher, Receipt Voucher, Journal Voucher, Supporting voucher, Contra Voucher, Preparation of Invoice, Items included in the invoice, Difference between an invoice and a voucher, Tax Implication-CENVAT. [Q-1]",
              sourcePage: 24,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Report Generation",
              syllabusText:
                "Ledger, Posting, Trial Balance, Trading and Profit & loss account, Balance Sheet, Subsid iary books and cash books. [Q-2]",
              sourcePage: 24,
              notes: [],
            },
          ],
        },
        {
          id: "paper6",
          code: "MCA P3006",
          title: "Python Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper7",
          code: "MCA P3007",
          title: "Tally Lab",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper8",
          code: "MCA P3008",
          title: "Mini Project/ Practical Training",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper9",
          code: "MCA E3009",
          title: "Big Data Analytics",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 30,
          detailTitle: "BIG DATA ANALYTICS (MCA E3009)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to big data",
              syllabusText:
                "Introduction to Big Data Platform – Challenges of Conventional Systems - Intelligent data analysis – Nature of Data - Analytic Processes and Tools - Analysis vs Reporting. [Q-2]",
              sourcePage: 30,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Mining data streams",
              syllabusText:
                "Introduction To Streams Concepts – Stream Data Model and Architecture - Stream Computing - Sampling Data in a Stream – Filtering Streams – Counting Distinct Elements in a Stream – Estimating Moments – Counting Oneness in a Window – Decaying Window - Real time Analytics Platform(RTAP) Applications. [Q-2]",
              sourcePage: 30,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Case Studies",
              syllabusText:
                "Real Time Sentiment Analysis- Stock Market Predictions. [Q-1]",
              sourcePage: 30,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Hadoop",
              syllabusText:
                "History of Hadoop - the Hadoop Distributed File System – Components of Hadoop Analysing the Data with Hadoop- Scaling Out- Hadoop Streaming. [Q-2]",
              sourcePage: 30,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Design of HDFS-Java interfaces to HDFS Basics",
              syllabusText:
                "Developing a Map Reduce Application -How Map Reduce Works -Anatomy of a Map Reduce Job run - Failures-Job Scheduling -Shuffle and Sort – Task execution - Map R educe Types and Formats - Map Reduce Features Hadoop environment. [Q-1]",
              sourcePage: 30,
              notes: [],
            },
          ],
          electiveGroup: "Elective II",
        },
        {
          id: "paper10",
          code: "MCA E3010",
          title: "Software Testing",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 31,
          detailTitle: "TESTING METHODOLOGIES (MCA E3010)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Fundamentals of Testing",
              syllabusText:
                "Definition of Software Testing, Objectives of software Testing, Problem due to lack of testing, Tes t Environment, Responsibilities of Tester, Characteristics of tester, Test team hierarchy , Scope of Tester, Defect, Fault, Failure and Bug, Basic concept of verification and validation, criteria for completio n of testing , Independent Testing , Quality Assurance versus Quality Control, Software Quality Factors, How Quality is Defined, Testing Levels: Unit Testing, Integration Testing, System Testing. [Q-2]",
              sourcePage: 31,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Role of Testing in SDLC",
              syllabusText:
                "SDLC Overview, Phases in SDLC, Popular SDLC Models (Waterfall Models, Spiral Model, RAD Model, V Model, Incremental Model, Prototype Model), Agile Methodology (Scrum and Its U s e s, Structural versus Functional Testing, Mutation Testing, Object-oriented testing. [Q2]",
              sourcePage: 31,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Test Case design",
              syllabusText:
                "Test Case (Characteristics Of Good Test Case, Tes t Case Template, Examples On Writing Test Cases), Test Case Design Techniques (Equivalence Partitioning, Boundary Value Analysis, Cause and Effect graph and Decision Table), Test Factors, Life Cycle of Testing and its Phases, Bug Life Cycle, Preparing bug report Template, Defect Tracking Tool- Bugzilla. [Q-1]",
              sourcePage: 31,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Approaches to Testing",
              syllabusText:
                "Approaches to Testing – I Static Testing: Formal review, Informal Review, Technical Review, Types of Reviews, Walkthrough, Inspection. Approaches to Testing - II Dynamic Testing: Structural, Functional and Non -Functional Testing, White Box Testing: Basic Path Testing (Flow graph and Cyclomatic Complexity), Statement and Branch Coverage Testing, Control Structure Testing, Data Flow graph Testing, Loop Testing, Glass Box Testing, Black Box Testing: Build Verification Testing (BVT), Smoke Testing, Sanity Testing, Integration Testing, Retesting, Regressio n Testing, Acceptance Testing, System Testing, Ad -hoc Testing, Grey Box Testing. Non-Functional Testing: Performance Testing (Load, Stress and Volume Testing), Security Testing, Compatibility Testing, Recovery Testing, Usability Testing.[Q-2]",
              sourcePage: 31,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Test Management & Strategies",
              syllabusText:
                "Test management Process, Test Plan, Test Design, Test Execution, Exit Criteria , Test Reporting, Test Plan Components, Test Reporting Template, Entry and Exit Criteria, Test Monitoring and Control, Configuration Management.[Q-1]",
              sourcePage: 31,
              notes: [],
            },
          ],
          electiveGroup: "Elective II",
        },
        {
          id: "paper11",
          code: "MCA E3011",
          title: "Machine Learning",
          kind: "elective",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 32,
          detailTitle: "MACHINE LEARNING (MCA E3011)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Machine learning",
              syllabusText:
                "Machine Learning – what and why? Basics of Linear Algebra and Statistics, Overview of target function representations; Linear Regression. [Q-1]",
              sourcePage: 32,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Supervised Learning",
              syllabusText:
                "Basics of Feature Selection and Evaluation, Decision Tree, Overfitting and Pruning, Logistic regression, Support Vector Machine and Kernel; Noise, bias-variance trade-off, under-fitting and over-fitting concepts. [Q-2]",
              sourcePage: 32,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Neural Networks",
              syllabusText:
                "Perceptions: representational limitation and gradient descent training. Multilayer networks and back propagation. Hidden layers and constructing intermediate, distributed representations. Overfitting, learning network structure, recurrent networks. [Q-2]",
              sourcePage: 32,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Unsupervised and Semi Supervised Learning",
              syllabusText:
                "Learning from unclassified data. Clustering. Hierarchical Agglomerative Clustering. K-means partitional clustering. Expectation maximization (EM) for soft clustering. Semi-supervised learning with EM using labelled and unlabeled data. [Q-2]",
              sourcePage: 32,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Ensemble",
              syllabusText:
                "Committees of multiple hypotheses, bagging, boosting, active learning with ensembles. [Q-1]",
              sourcePage: 32,
              notes: [],
            },
          ],
          electiveGroup: "Elective II",
        },
      ],
    },
    {
      id: "sem4",
      number: 4,
      title: "Semester 4",
      credits: 30,
      papers: [
        {
          id: "paper1",
          code: "MCA C4001",
          title: "Computer Graphics",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 25,
          detailTitle: "COMPUTER GRAPHICS (MCA C4001)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Introduction to Computer Graphics",
              syllabusText:
                "What is Computer Graphics?, Application of Computer Graphics, Presentation Graphics Painting and Drawing,. Input and Output Devices, Touch Pane, Light Pens, Graphic Tablets, Plotters, Film Recorder s, Display Devices, Refreshing Display Devices, Raster -Scan, Random -Scan, Plasm a Panel and LCD panels. [Q-2]",
              sourcePage: 25,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Graphics Primitives and 2-D & 3-D Graphics",
              syllabusText:
                "Points and Lines, Line -drawing Algorithms, DDA algorithm, Bresenham's line Algorithm, Circle - generating algorithm, Properties of Circles, Midpoint Circle of Algorithm, Pol ygon Filling Algorithm: Scan-Line. Point Clipping, Line Clipping, Cohen -Sutherland Line Clippings, Polygon Clipping: Sutherland Hodgman Algorithm, Basic Transformations, Translation, Rotation, Scaling, Shear, Composite Transformations, Rotations about a p oint, Reflection about a line, Homogeneous Coordinate Systems, 3-D Transformations, Viewing Transformation. [Q-2]",
              sourcePage: 25,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Projections and Modeling & Rendering Curves and Surfaces",
              syllabusText:
                "Parallel Projection, Orthographic & Oblique Projections Isometric Projectio ns, Perspective Projections. Polygon Representation Methods, Polygon Surfaces, Polygon Tables, Plane Equations, Polygon Meshes, Bezier Curves and Surfaces, Bezier Curves, Properties of Bezier Curves, Bezier Surfaces, Surface of Revolution, Visible - Surface Detection, Depth Buffer Method, Scan -Line Method, Area - Subdivision Method. [Q-2]",
              sourcePage: 25,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Multimedia and Animation",
              syllabusText:
                "Basic of Animation, Types of Animation, Simulating Acceleration, Computer Animation Tools, Applications, Multimedia Concepts and Appli cations, Concepts of Hypertext/Hypermedia, Multimedia Applications, Education, Video Conferencing, Training, Entertainment, Electronic Encyclopedia. [Q-2]",
              sourcePage: 25,
              notes: [],
            },
          ],
        },
        {
          id: "paper2",
          code: "MCA C4002",
          title: "Operations Research",
          kind: "core",
          credits: 4.0,
          marks: 100,
          sourcePage: 8,
          detailPage: 26,
          detailTitle: "OPERATION RESEARCH (MCA C4002)",
          units: [
            {
              id: "unit1",
              number: 1,
              title: "Operation Research",
              syllabusText:
                "An overview, Organ and Development of OR, Nature and Features of OR, Modeling in OR, General Solution Methods for OR models, Scientific method in OR, Methodology of OR, Applica tion, Opportunities and Shortcomings of OR. Linear Programming Problem : Introduction, Mathematical Formulation of the Problem, Graphical Solution Method, Some Exceptional Cases, General LPP, Canonical and Standard forms of LPP, Simplex Method: Introduction, Fundamental properties of solutions, the Computational Procedure, Use of Artificial variables, Solution to simulation Linear Equations, Investing a Matrix using Simplex Meth od. [Q-2]",
              sourcePage: 26,
              notes: [],
            },
            {
              id: "unit2",
              number: 2,
              title: "Duality in LPP",
              syllabusText:
                "Introduction, General Primal – Dual pair, formulating a Dual Problem, Primal Dual pair in Matrix form, Duality theorems, Dual simplex method, Post optical Analysis, Introduction: Variation in cost vector, Requirement Vector, Coefficient Matrix, Structural Variation. [Q-2]",
              sourcePage: 26,
              notes: [],
            },
            {
              id: "unit3",
              number: 3,
              title: "Integer Programming",
              syllabusText:
                "Introduction, Gomory Method, Construction of Gomory’s constraints, Fractional Cut Method: All Integer & Mixed Integer, Revised Simplex Method. [Q-1]",
              sourcePage: 26,
              notes: [],
            },
            {
              id: "unit4",
              number: 4,
              title: "Dynamic Programming & Introduction",
              syllabusText:
                "Characteristic of Dynamic Programming, Dynamic Programming Algorithm, Solution of LPP by Dynamic Programming. [Q-1]",
              sourcePage: 26,
              notes: [],
            },
            {
              id: "unit5",
              number: 5,
              title: "Transportation Problem",
              syllabusText:
                "Introduction, Mathematical Model of Transportation Problem, The Transportation Algorithm, Methods for Finding Initial Solution. Assignment Problem: Introduction, Mathematical Model of Statement Assignment Problem, Solution Methods of Assignment Problem [Q-2]",
              sourcePage: 26,
              notes: [],
            },
          ],
        },
        {
          id: "paper3",
          code: "MCA P4003",
          title: "Personality Development",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper4",
          code: "MCA P4004",
          title: "Android Application Development",
          kind: "sessional",
          credits: 2.0,
          marks: 50,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
        {
          id: "paper5",
          code: "MCA P4005",
          title: "Major Project",
          kind: "sessional",
          credits: 18.0,
          marks: 450,
          sourcePage: 8,
          detailPage: null,
          detailTitle: null,
          units: [],
        },
      ],
    },
  ],
};
