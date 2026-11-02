const questions = [
  {
    id: 'protection-vs-security-and-polp',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Differentiate between Protection and Security in operating systems. State the Principle of Least Privilege (PoLP) and explain its significance.',
    answer: [
      '1. Protection vs Security:',
      'Protection refers to the internal mechanisms and policies controlling the access of processes, programs, and users to the resources defined by a computer system (such as CPU cycles, memory pages, files, and I/O devices). Protection is an internal enforcement mechanism.',
      'Security is a broader measure of the system overall defense against external and internal threats, unauthorized access, data destruction, and physical tampering. Security encompasses authentication, network firewalls, physical security, cryptography, and intrusion detection.',
      'Protection is the internal mechanism through which security policies are enforced within the operating system kernel.',
      '2. Principle of Least Privilege (PoLP):',
      'Articulated by Saltzer and Schroeder (1975), the Principle of Least Privilege dictates that every program, process, and user must be granted only the minimum set of privileges and resources strictly necessary to complete its legitimate operational function, and for only the shortest duration necessary.',
      'Significance: PoLP dramatically limits the "blast radius" of software bugs and cyber attacks. If a web server process running with least privilege is exploited via a buffer overflow, the attacker gains only restricted user privileges rather than full root/administrator control of the operating system.'
    ]
  },
  {
    id: 'protection-domains-and-transitions',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Define a Protection Domain. Explain how operating systems transition execution between domains using rings of privilege and the UNIX setuid mechanism.',
    answer: [
      'A Protection Domain defines a set of (resource, access-right) pairs. At any given instant, a process executes within a specific protection domain, which determines exactly which system objects (files, memory regions, devices) it can access and what operations (read, write, execute) it is permitted to perform.',
      '1. Hardware Privilege Rings (x86 Architecture): Modern processors enforce hierarchical protection rings in hardware: Ring 0 (Kernel Mode / Supervisor), Rings 1 & 2 (Device Drivers / OS Services), and Ring 3 (User Mode / Applications). An application running in Ring 3 cannot execute privileged CPU instructions (such as cli, hlt, or modifying CR3 page table registers). Attempting to do so triggers a hardware trap (General Protection Fault #GP). Transitions from Ring 3 to Ring 0 occur strictly through gate descriptors via system calls (syscall / sysenter).',
      '2. Process Domain Transitions in UNIX:',
      'In UNIX, a process domain is primarily defined by its User ID (UID) and Group ID (GID). Normally, a process inherits the UID of the user who launched it.',
      'Domain Switching via setuid (Set User ID): Certain system utilities need temporary elevated privileges. For example, changing a password requires modifying /etc/shadow (owned exclusively by root). When a user runs /usr/bin/passwd, the setuid bit (octal 4000) on the binary causes the kernel to switch the process effective UID from the user UID to root (UID 0) for the duration of execution, enabling controlled privilege escalation.'
    ]
  },
  {
    id: 'access-matrix-model-and-decompositions',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain the Access Matrix model of protection. Describe how the abstract matrix is decomposed in practice into Access Control Lists (ACLs) and Capability Lists (C-Lists).',
    answer: [
      '1. The Access Matrix Model (Lampson 1971): An abstract two-dimensional table where:',
      'Rows represent Protection Domains (Users, Processes, or Roles): D1, D2, ..., Dm.',
      'Columns represent System Objects (Files, Devices, Memory Regions, Semaphores): O1, O2, ..., On.',
      'Each cell Access(Di, Oj) contains the set of access rights that domain Di possesses over object Oj (e.g., {read, write, execute}).',
      'Because real operating systems contain thousands of domains and millions of files, a complete 2D matrix would be sparse, consuming gigabytes of mostly empty table space. Operating systems implement the matrix through two practical decompositions:',
      '2. Column Slicing: Access Control Lists (ACLs): Each object Oj is assigned an ACL containing pairs of (Domain, Access Rights). For example, File 1: { (Alice: read, write), (Bob: read), (Group-Dev: read) }. When a process in domain D requests access to object O, the kernel traverses the object ACL to verify permission.',
      '3. Row Slicing: Capability Lists (C-Lists): Each domain Di is assigned a list of objects and the operations permitted on them. A capability is an unforgeable ticket or token referencing an object. Possessing the capability grants immediate access, just as possessing a physical key unlocks a door. C-Lists are stored in protected kernel memory to prevent tampering.'
    ]
  },
  {
    id: 'acls-vs-capabilities-and-revocation',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Access Control Lists (ACLs) with Capability Lists across lookup performance, distributed systems suitability, and the Revocation of Access Rights.',
    answer: [
      '1. ACLs vs Capabilities Comparison:',
      '(a) Object-Centric vs Subject-Centric: ACLs associate rights with the object (who can access this file?). Capabilities associate rights with the subject (what can this process access?).',
      '(b) Lookup Overhead: In ACLs, opening a file requires searching the object list of authorized users. In capability systems, presenting a valid capability grants immediate access without list traversal.',
      '(c) Suitability for Distributed Systems: Capabilities can be cryptographically signed (e.g., JSON Web Tokens / Kerberos tickets), making them ideal for distributed networks and microservices without central directory queries.',
      '2. The Revocation of Access Rights Dilemma:',
      'Revocation in ACLs is trivial: to revoke Alice access to File 1, the administrator simply deletes (Alice) from the ACL of File 1. The next time Alice calls open(), access is denied immediately.',
      'Revocation in Capability Systems is notoriously difficult: capabilities are distributed among multiple processes. A process may have copied its capability or passed it to child threads. Finding and invalidating every copy of a capability scattered across memory is complex.',
      'Capability Revocation Mechanisms: (1) Reacquisition / Expiration: Capabilities have short time-to-live (TTL) timestamps and must be refreshed. (2) Indirection / Back-pointers: Capabilities point to an intermediate global table entry; invalidating the table entry revokes all capabilities pointing to it. (3) Generation Numbers / Nonces: Object stores a generation number; when access is revoked, the object increments its generation, invalidating older capability tokens.'
    ]
  },
  {
    id: 'dac-vs-mac-and-bell-lapadula',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Discretionary Access Control (DAC), Mandatory Access Control (MAC), and Role-Based Access Control (RBAC). Explain the Bell-LaPadula multi-level security model (Simple Security Property and *-Property).',
    answer: [
      '1. Access Control Paradigms:',
      'Discretionary Access Control (DAC): The owner of an object has complete discretion to grant or revoke access permissions to other users (e.g., standard UNIX chmod). Weakness: Vulnerable to Trojan horses; a user can inadvertently grant world-readable permissions to confidential data.',
      'Mandatory Access Control (MAC): The operating system enforces central, non-negotiable security rules based on security labels assigned to subjects (users/processes) and objects (files). Individual users cannot override policies (implemented in SELinux, AppArmor).',
      'Role-Based Access Control (RBAC): Permissions are assigned to organizational Roles (e.g., Doctor, Nurse, Billing Clerk) rather than individual users. Users are assigned to roles, vastly simplifying enterprise security administration.',
      '2. The Bell-LaPadula Confidentiality Model (Multi-Level Security):',
      'Developed by David Bell and Leonard LaPadula (1973) for government and military multi-level security. System entities are classified into hierarchical sensitivity levels: Top Secret > Secret > Confidential > Unclassified.',
      'The model enforces two mandatory mathematical rules to prevent unauthorized information leakage:',
      'Rule 1: Simple Security Property (No Read Up): A subject at security level S can read object O if and only if SecurityLevel(S) >= SecurityLevel(O). A user with "Secret" clearance cannot read "Top Secret" documents.',
      'Rule 2: *-Property / Star-Property (No Write Down): A subject at security level S can write to object O if and only if SecurityLevel(S) <= SecurityLevel(O). A process running at "Top Secret" level CANNOT write data to a "Confidential" or "Unclassified" file.',
      'Why the *-Property is vital: It prevents malicious Trojan horses or compromised high-clearance processes from copying sensitive "Top Secret" intelligence down into publicly readable files, guaranteeing absolute mathematical confidentiality.'
    ]
  }
]

export default questions
