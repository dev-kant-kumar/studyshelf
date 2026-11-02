const questions = [
  {
    id: 'deadlock-prevention-havender-ordering',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'How does Havender\'s resource ordering prevent Circular Wait? Provide the formal proof.',
    answer: [
      'Havender\'s method prevents Circular Wait by defining a one-to-one indexing function F: R -> N that maps every resource type in the system to a unique natural number (for example, F(Disk) = 1, F(Printer) = 2, F(Tape) = 3).',
      'The protocol enforces a strict rule: a process can request an instance of resource Rj if and only if F(Rj) > F(Ri), where Ri is the highest-numbered resource currently held by that process. Alternatively, if a process requires a lower-numbered resource, it must first release all resources with index >= F(Rj).',
      'Proof of Circular Wait Impossibility (By Contradiction): Suppose a circular wait chain exists: P0 -> P1 -> P2 -> ... -> Pn -> P0, where Pi is waiting for a resource held by P(i+1), and Pn is waiting for a resource held by P0. Let held(Pi) be the highest resource index held by Pi. For Pi to wait for P(i+1), Pi must be requesting a resource with index > held(Pi). Under the ascending order rule, this implies held(P0) < held(P1) < held(P2) < ... < held(Pn) < held(P0). This inequality requires held(P0) < held(P0), which is a mathematical impossibility. Therefore, a cycle cannot form, and circular wait is completely prevented.'
    ]
  },
  {
    id: 'safe-state-vs-deadlock-state',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Distinguish between a Safe State, an Unsafe State, and a Deadlock State.',
    answer: [
      'A Safe State is a system state where there exists at least one Safe Sequence <P1, P2, ..., Pn> of processes such that, for each Pi, the resources that Pi can still request can be satisfied by the currently available system resources plus the resources already held by all preceding processes Pj (where j < i). A safe state guarantees that deadlock can never occur.',
      'An Unsafe State is a state that is NOT safe; there is no guarantee that all processes will be able to complete execution without deadlock. However, an unsafe state is NOT necessarily deadlocked: if processes do not request their declared maximum resource claims simultaneously, all processes may still terminate safely.',
      'A Deadlock State is a specific subset of unsafe states in which two or more processes are already trapped in an unbreakable circular wait and cannot proceed. In summary: Safe State is a subset of all states, Unsafe State is the complement of Safe State, and Deadlock State is a proper subset of Unsafe State.'
    ]
  },
  {
    id: 'bankers-algorithm-data-structures',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Detail the four core data structures utilized by the Banker\'s Algorithm for deadlock avoidance.',
    answer: [
      'For a system with n processes and m resource types, the Banker\'s Algorithm maintains four central vectors and matrices:',
      '1. Available[m]: A 1D vector of length m. If Available[j] = k, there are k instances of resource type Rj currently unallocated and free in the system.',
      '2. Max[n][m]: A 2D matrix of size n x m. If Max[i][j] = k, process Pi may request at most k instances of resource type Rj during its entire execution lifetime.',
      '3. Allocation[n][m]: A 2D matrix of size n x m. If Allocation[i][j] = k, process Pi is currently holding k instances of resource type Rj.',
      '4. Need[n][m]: A 2D matrix of size n x m specifying the remaining resources process Pi may request to finish execution. Derived directly using the formula: Need[i][j] = Max[i][j] - Allocation[i][j].'
    ]
  },
  {
    id: 'deadlock-recovery-strategies',
    level: 'hard',
    tags: ['Interview practice', 'Exam practice'],
    question: 'Once a deadlock is detected, how can an operating system recover? Compare process termination with resource preemption.',
    answer: [
      'Operating systems recover from deadlocks via two primary strategies:',
      '1. Process Termination: The OS can either abort all deadlocked processes simultaneously (guaranteed to break the deadlock, but wastes substantial CPU computation time), or abort processes one at a time and re-run the detection algorithm until the deadlock cycle is eliminated. Selection of victim processes is based on process priority, CPU time consumed, remaining time to completion, and held resources.',
      '2. Resource Preemption: The OS successively preempts resources from processes and allocates them to other blocked processes until the deadlock cycle is broken. This involves three complex engineering requirements: (a) Selecting a victim with minimum preemption cost, (b) Rollback: restoring the victim process state to a safe checkpoint or aborting it completely, and (c) Preventing Starvation: ensuring the same unfortunate process is not perpetually chosen as the victim by incorporating the number of previous preemptions into the cost evaluation function.'
    ]
  }
]

export default questions
