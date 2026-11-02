const questions = [
  {
    id: 'monolithic-vs-microkernel-detailed',
    level: 'medium',
    tags: ['Concept check', 'Exam practice', 'Interview practice'],
    question: 'Compare Monolithic and Microkernel architectures with diagrams and trade-offs. Why did Linux remain monolithic?',
    answer: [
      'In a Monolithic kernel (such as Linux, FreeBSD), all major operating system subsystems (scheduler, virtual memory manager, file systems, network protocol stacks, device drivers) execute in a single shared address space in kernel mode (Ring 0). Subsystems communicate via direct in-memory C function calls. This yields maximum performance but poor fault isolation: a bug in a third-party device driver can corrupt kernel data structures and crash the machine.',
      'In a Microkernel (such as MINIX 3, QNX, seL4), only the bare minimum primitives (thread scheduling, low-level address space mapping, inter-process communication) execute in Ring 0. Device drivers, file systems, and network protocols run as isolated user-space processes (Ring 3). If a file system server crashes, the OS can restart it without rebooting. However, operations require multiple user-kernel context switches and IPC message copies, introducing performance overhead.',
      'During the famous 1992 Tanenbaum-Torvalds debate, Andrew Tanenbaum argued microkernels were the future of OS design. Linus Torvalds kept Linux monolithic because monolithic architectures delivered significantly superior real-world throughput on contemporary hardware. Modern Linux mitigates modularity challenges using Loadable Kernel Modules (LKMs) and eBPF.'
    ]
  },
  {
    id: 'type1-vs-type2-hypervisors',
    level: 'easy',
    tags: ['Exam practice', 'Concept check'],
    question: 'What is the architectural difference between Type 1 (Bare-Metal) and Type 2 (Hosted) Hypervisors?',
    answer: [
      'A Type 1 Hypervisor (Bare-Metal / Native) executes directly on the physical hardware without an underlying host operating system (e.g. VMware ESXi, Xen, Microsoft Hyper-V, and KVM). The hypervisor acts as the operating system kernel, scheduling virtual CPUs and managing memory directly with minimal virtualization overhead and low latency.',
      'A Type 2 Hypervisor (Hosted) executes as an application program on top of a conventional host operating system (e.g. Oracle VirtualBox, VMware Workstation). The hypervisor relies on the host OS for device drivers, memory management, and thread scheduling, adding extra abstraction layers that introduce higher CPU and I/O latency.'
    ]
  },
  {
    id: 'hypervisors-vs-containers',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'How do Operating System Containers (Docker, LXC) differ from Virtual Machines at the kernel level?',
    answer: [
      'A Virtual Machine (VM) virtualizes the physical hardware. Each VM runs a complete guest operating system with its own private kernel, virtual CPU, virtual memory management, and device drivers, managed by a hypervisor using hardware virtualization (Intel VT-x / AMD-V). This provides strong hardware-enforced isolation at the cost of high RAM overhead (gigabytes per VM) and slow boot times (tens of seconds).',
      'A Container virtualizes the operating system user space. All containers share the single host operating system kernel. Isolation is enforced entirely via Linux kernel primitives: Namespaces (PID, Mount, Network, IPC, UTS, User) provide isolated views of system resources, while Control Groups (cgroups) enforce hard resource limits (CPU quotas, memory caps, block I/O throughput). Containers consume negligible memory overhead (megabytes) and launch instantaneously in milliseconds.'
    ]
  },
  {
    id: 'hardware-virtualization-vt-x',
    level: 'hard',
    tags: ['Interview practice'],
    question: 'Explain how Intel VT-x hardware virtualization handles sensitive instructions using VMCS, VMLAUNCH, and VMEXIT.',
    answer: [
      'Early x86 architectures could not be virtualized efficiently because certain sensitive instructions (like POPF or reading segment registers) failed silently or behaved differently in user mode without trapping to the hypervisor (the Popek-Goldberg virtualization virtualization criteria was violated).',
      'Intel VT-x introduced two new hardware processor modes: VMX Root Operation (used by the hypervisor) and VMX Non-Root Operation (used by the guest OS).',
      'The CPU state is managed by an in-memory hardware structure called the Virtual Machine Control Structure (VMCS). When the hypervisor launches a virtual machine, it executes VMLAUNCH or VMRESUME, entering VMX non-root mode. When the guest OS attempts to execute a sensitive privileged instruction (such as reloading CR3 or executing HLT), the CPU intercepts the instruction in hardware, transitions back to VMX root mode (a VMEXIT), and transfers control to the hypervisor to emulate the operation safely before resuming the guest.'
    ]
  },
  {
    id: 'layered-os-circular-dependency',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Why is Dijkstra\'s pure layered operating system architecture rarely used in general-purpose systems?',
    answer: [
      'In Dijkstra\'s pure layered architecture (THE Multiprogramming System), Layer N can only invoke operations in Layer N - 1, and cannot access Layer N + 1. While this provides clean modular verification, it creates severe circular dependency deadlocks in real-world operating systems.',
      'For example, the Virtual Memory Manager requires the backing secondary storage Disk Driver to page memory blocks in and out of swap space. However, the Disk Driver requires memory buffers allocated by the Virtual Memory Manager to store DMA data in transit. Enforcing a strict unidirectional hierarchy between memory and storage without violating layering rules is impractical.'
    ]
  }
]

export default questions
