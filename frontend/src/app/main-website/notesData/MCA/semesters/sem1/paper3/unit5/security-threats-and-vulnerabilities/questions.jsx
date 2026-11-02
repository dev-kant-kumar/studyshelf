const questions = [
  {
    id: 'cia-triad-and-security-problem',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define the Security Problem in operating systems. Explain the CIA Triad (Confidentiality, Integrity, and Availability) with practical examples.',
    answer: [
      'The Security Problem addresses how an operating system protects its hardware, files, user accounts, and running processes against intentional malicious attacks and accidental corruption from untrusted agents.',
      'The foundational core of computer security is the CIA Triad:',
      '1. Confidentiality: Guarantees that system assets and data are accessible only to authorized principals. Violations include unauthorized reading of /etc/shadow, sniffing cleartext network packets, or memory dumping process state.',
      '2. Integrity: Guarantees that data and system programs can be modified only by authorized entities through approved operations. Violations include unauthorized database modification, trojanized binary replacement, or malware modifying kernel page tables.',
      '3. Availability: Guarantees that system resources (CPU, network bandwidth, storage arrays, web servers) are accessible to legitimate users when needed. Violations include Distributed Denial of Service (DDoS) flood attacks, disk exhaustion, or fork bombs starving the process table.'
    ]
  },
  {
    id: 'buffer-overflow-and-mitigations',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain the mechanics of a Classic Stack Buffer Overflow (Stack Smashing). How does it allow arbitrary code execution, and what modern operating system defenses counter it?',
    answer: [
      '1. Stack Buffer Overflow Mechanics:',
      'In C/C++, local variables are allocated sequentially on the call stack next to control registers. When a function executes, the stack frame holds: (1) Local array buffer, (2) Saved Frame Pointer (EBP/RBP), and (3) Saved Return Instruction Pointer (EIP/RIP) specifying where CPU execution resumes after the function returns.',
      'Vulnerability: Unbounded memory copying functions (such as strcpy, gets, or sprintf) do not verify input boundaries. If an attacker inputs more bytes than the array buffer capacity, the input overflows the buffer boundary, overwrites adjacent local variables, overwrites the saved frame pointer, and overwrites the saved return instruction pointer.',
      'Arbitrary Code Execution: The attacker overwrites the return pointer with the address of malicious executable machine code (shellcode) injected into the buffer or an environment variable. When the function executes the ret instruction, the CPU pops the attacker address into the Program Counter, executing the shellcode with the full privileges of the victim process.',
      '2. Modern Operating System Defenses:',
      '(a) Stack Canaries (StackGuard / GCC -fstack-protector): The compiler places a randomized integer (canary) immediately before the return pointer. Before ret executes, the CPU checks whether the canary value was altered; if changed, the kernel terminates the process immediately (SIGSEGV/abort).',
      '(b) Non-Executable Stack / DEP / NX Bit (Data Execution Prevention): Hardware MMU page table flag that marks stack and heap memory pages as Non-Executable (NX). Attempting to execute code on the stack triggers a hardware CPU trap (#GP).',
      '(c) Address Space Layout Randomization (ASLR): The OS loader randomizes the memory base addresses of the stack, heap, and shared libraries on every execution, preventing attackers from predicting fixed return addresses.'
    ]
  },
  {
    id: 'viruses-vs-worms-vs-trojans',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Viruses, Worms, and Trojan Horses. Trace the self-propagating execution model of a network worm.',
    answer: [
      'Operating systems categorize malicious software (malware) based on host dependency and propagation methods:',
      '1. Trojan Horse: A program that presents a benign, useful facade (e.g., a utility, game, or converter) while concealing malicious hidden functionality (e.g., keylogging, exfiltrating credentials, or opening a backdoor port). Unlike viruses and worms, Trojans do not replicate autonomously; they rely on social engineering to trick users into running them.',
      '2. Virus: A parasitic fragment of code that embeds itself inside legitimate host binary files (e.g., appending shellcode to ELF or PE executables). Host Dependency: High - a virus cannot execute or spread independently; it requires a human user or system process to launch the infected host executable.',
      '3. Worm: A standalone, self-replicating process that spreads automatically across computer networks without human intervention or host file dependency.',
      'The Network Worm Lifecycle:',
      'Phase 1: Target Discovery: Scans network IP ranges for open listening ports (e.g., port 445 SMB, port 80 HTTP, port 22 SSH).',
      'Phase 2: Weaponized Exploitation: Sends a crafted network packet exploiting an unpatched zero-day vulnerability (such as a buffer overflow or remote code execution flaw) on the target service.',
      'Phase 3: Payload Delivery & Spawning: The target service executes the payload, which downloads the worm binary and launches it as an autonomous background daemon.',
      'Phase 4: Propagation Amplification: The newly infected victim immediately begins scanning adjacent network subnets, producing exponential propagation waves across the Internet (exemplified by the Morris Worm, Code Red, and WannaCry).'
    ]
  },
  {
    id: 'system-threats-dos-and-mitm',
    level: 'hard',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Analyze System and Network Threats: Denial of Service (DoS/DDoS) and Man-in-the-Middle (MitM) attacks. Detail SYN Flood attacks and OS kernel mitigations (SYN Cookies).',
    answer: [
      '1. Denial of Service (DoS / DDoS): Attacks aimed at exhausting system resources (CPU, RAM, file descriptors, network bandwidth) to deny service to legitimate clients.',
      'SYN Flood Attack Mechanics: In the TCP 3-way handshake, a client sends SYN, the server responds with SYN-ACK and allocates a Transmission Control Block (TCB) in its kernel backlog queue, waiting for the final ACK. In a SYN flood, the attacker transmits tens of thousands of spoofed SYN packets per second and deliberately NEVER sends the final ACK. The server half-open connection table fills completely, causing the kernel to drop all subsequent incoming connection requests from legitimate users.',
      'Operating System Defense (SYN Cookies): When the SYN backlog queue fills, the Linux kernel stops allocating memory for half-open connections. Instead, it encodes the connection state cryptographically into the 32-bit Initial Sequence Number (ISN) of the SYN-ACK packet (the "SYN Cookie"). When the client responds with the final ACK, the server reconstructs the connection parameters purely from the ACK sequence number without having stored any state in kernel memory during the wait phase, completely thwarting the attack.',
      '2. Man-in-the-Middle (MitM) Attacks: An attacker intercepts and relays communication between two parties who believe they are communicating directly. Common vectors include ARP Cache Poisoning on local LANs and DNS Spoofing. Mitigated by cryptographic end-to-end mutual authentication protocols (TLS with signed X.509 certificates and IPsec).'
    ]
  },
  {
    id: 'threat-monitoring-ids-and-ebpf',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Compare Signature-Based vs Anomaly-Based Intrusion Detection Systems (IDS). How do modern operating systems use system call tracing (auditd and eBPF) and Honeypots for proactive threat monitoring?',
    answer: [
      '1. Intrusion Detection Systems (IDS) Classification:',
      'Signature-Based IDS: Inspects network packets and system logs for known attack byte patterns (signatures) listed in a database (e.g., Snort). Advantage: Extremely fast with virtually zero false positives for known exploits. Disadvantage: Completely blind to novel zero-day attacks or polymorphic malware.',
      'Anomaly-Based IDS: Uses statistical baselines or machine learning to model "normal" system behavior (average CPU load, typical network ports, standard process parentage). Any significant statistical deviation triggers an alert. Advantage: Detects previously unseen zero-day attacks. Disadvantage: Higher false-positive rates when legitimate user workloads fluctuate.',
      '2. Modern Kernel-Level System Call Tracing (auditd & eBPF):',
      'Because all application operations (reading files, executing binaries, creating network sockets) must invoke operating system system calls, system call auditing provides an unbypassable monitoring surface.',
      'Linux auditd logs security events based on defined rules (e.g., logging any write to /etc/passwd or use of ptrace).',
      'Extended Berkeley Packet Filter (eBPF): Allows running sandboxed, verifier-checked byte code inside the Linux kernel at runtime without modifying kernel source or loading unstable kernel modules. eBPF hooks into tracepoints, kprobes, and LSM (Linux Security Modules) hooks, monitoring execve, socket connect, and file open calls with sub-microsecond latency and zero context-switch overhead.',
      '3. Honeypots: Intentionally vulnerable, isolated decoy servers or processes configured to attract attackers. Because honeypots serve zero legitimate production traffic, ANY activity detected on a honeypot represents an active intruder or automated scanning bot, providing early warning intelligence.'
    ]
  }
]

export default questions
