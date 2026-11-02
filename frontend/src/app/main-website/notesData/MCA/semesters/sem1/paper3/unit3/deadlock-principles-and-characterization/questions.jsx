const questions = [
  {
    id: 'deadlock-definition-and-model',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define Deadlock in an operating system and describe the system resource allocation model.',
    answer: [
      'A Deadlock is an operating system state in which two or more concurrent processes are permanently blocked because each process holds one or more resources while waiting to acquire other resources currently held by other processes in the set. None of the processes can execute, release their allocated resources, or make forward progress.',
      'In the formal system resource model, a computer system consists of a finite set of resources partitioned into m distinct resource types (R1, R2, ..., Rm), such as CPU cycles, memory frames, disk drives, or database locks. Each resource type Ri may contain Wi identical physical or logical instances.',
      'A process must utilize resources following a strict three-phase operational protocol: (1) Request: the process asks for an instance; if not immediately available, it blocks. (2) Use: the process operates on the acquired resource. (3) Release: the process voluntarily frees the resource back to the operating system pool.'
    ]
  },
  {
    id: 'four-coffman-conditions',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'State and explain the Four Coffman Conditions required for a deadlock to occur.',
    answer: [
      'Identified by Edward G. Coffman Jr. in 1971, a deadlock can arise if and only if all four of the following conditions hold simultaneously in a system:',
      '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode; only one process at a time can use the resource. If another process requests that resource, the requesting process must wait until it is released.',
      '2. Hold and Wait: A process must currently hold at least one resource while simultaneously waiting to acquire additional resources that are currently held by other operating processes.',
      '3. No Preemption: Resources cannot be forcibly confiscated from a process holding them; a resource can only be released voluntarily by the process after it has finished its task.',
      '4. Circular Wait: A closed chain of processes {P0, P1, ..., Pn} must exist such that P0 is waiting for a resource held by P1, P1 is waiting for a resource held by P2, ..., and Pn is waiting for a resource held by P0.'
    ]
  },
  {
    id: 'rag-cycle-necessary-vs-sufficient',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain Resource-Allocation Graphs (RAG). Why is a directed cycle a necessary and sufficient condition for single-instance resources, but only necessary for multi-instance resources?',
    answer: [
      'A Resource-Allocation Graph (RAG) is a directed graph G = (V, E) where vertices V are divided into processes P = {P1, ..., Pn} and resource types R = {R1, ..., Rm}. Edges E consist of Request Edges (Pi -> Rj, meaning process Pi is waiting for an instance of Rj) and Assignment Edges (Rj -> Pi, meaning an instance of Rj is allocated to Pi).',
      'If every resource type in the graph contains exactly one single instance, a directed cycle in the RAG is both a necessary and sufficient condition for deadlock. The existence of a cycle proves an unbreakable circular wait chain where every process in the cycle is blocked on another process in the cycle.',
      'However, if resource types contain multiple instances, a directed cycle is a necessary condition, but NOT a sufficient condition for deadlock. If a cycle exists, but one of the cycle resources is also held by an external process not participating in the cycle, that external process can complete its execution, release its instance, break the cycle, and allow the waiting processes to continue.'
    ]
  },
  {
    id: 'deadlock-vs-starvation-vs-livelock',
    level: 'medium',
    tags: ['Concept check', 'Interview practice'],
    question: 'Contrast Deadlock, Starvation, and Livelock with practical concurrency examples.',
    answer: [
      'Deadlock is a state where processes are permanently blocked in a waiting state waiting for events that only other blocked processes in the set can trigger. Processes consume zero CPU cycles while deadlocked, and the condition cannot resolve itself without external intervention (such as killing a process or preempting resources).',
      'Starvation (Indefinite Blocking) is a condition where a runnable process is perpetually denied access to a requested resource because other higher-priority processes are continuously favored by the scheduler. Unlike deadlock, the starved process is not blocked by a circular dependency; if higher-priority traffic subsides, the starved process can execute.',
      'Livelock occurs when two or more processes actively change their internal states in response to each other without making any functional forward progress (such as two polite people in a narrow hallway continuously stepping in the same direction to let the other pass). Unlike deadlock, livelocked processes are actively running on the CPU and consuming processor cycles.'
    ]
  },
  {
    id: 'methods-for-handling-deadlocks',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'What are the four primary strategies used by operating systems to handle deadlocks?',
    answer: [
      'Operating systems adopt one of four core strategies to manage deadlocks:',
      '1. Deadlock Prevention: Designing system protocols that structurally constrain resource requests so that at least one of the four Coffman conditions can never hold.',
      '2. Deadlock Avoidance: The operating system utilizes a priori knowledge of maximum resource demands (such as Banker\'s Algorithm) to dynamically inspect resource allocation states and ensure the system never enters an unsafe state.',
      '3. Deadlock Detection and Recovery: Permitting the system to enter a deadlocked state, periodically running a detection algorithm (such as Wait-For Graph cycle checking), and applying recovery procedures (aborting processes or preempting resources).',
      '4. Ignorance (The Ostrich Algorithm): Ignoring the problem entirely and assuming deadlocks will occur so infrequently that the cost of prevention, avoidance, or detection outweighs the inconvenience of occasional manual reboots (adopted by Linux, Windows, and macOS for general user processes).'
    ]
  }
]

export default questions
