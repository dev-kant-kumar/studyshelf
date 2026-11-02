import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const architecturesTable = {
    caption: 'Comparative Analysis of Operating System Architectural Paradigms',
    headers: ['Architecture Model', 'Kernel Space (Ring 0) Scope', 'User Space (Ring 3) Scope', 'Communication Overhead', 'Fault Isolation & Resilience', 'Representative Systems'],
    rows: [
      [
        'Monolithic Kernel',
        'Entire OS: Scheduler, VFS, Memory Manager, Network Stack, Device Drivers.',
        'Only user applications, shared libraries, and shell utilities.',
        'Extremely low; direct in-memory C function calls and shared pointers.',
        'Poor; any null-pointer dereference in a driver crashes entire OS (Kernel Panic).',
        'Linux, FreeBSD, OpenBSD, Solaris, traditional Unix.'
      ],
      [
        'Microkernel',
        'Bare minimum: Thread scheduling, low-level memory maps, and IPC.',
        'Device drivers, file systems, network protocol daemons run as servers.',
        'High; requires multiple user-kernel-user context switches and IPC copies.',
        'Exceptional; crashed driver or file system server can be restarted without reboot.',
        'MINIX 3, QNX Neutrino, seL4, Mach 3.0, Google Fuchsia (Zircon).'
      ],
      [
        'Layered System',
        'Arranged in N concentric hierarchical layers; Layer M calls Layer M - 1.',
        'Layer N (top layer) hosts user-facing utilities.',
        'Moderate; traverses intermediate functional layers sequentially.',
        'Good for debugging; rigid hierarchy suffers from circular subsystem dependencies.',
        'Dijkstra THE Multiprogramming System, early OS/2.'
      ],
      [
        'Hybrid Kernel',
        'Microkernel core plus performance-critical servers (graphics, network, VFS).',
        'User applications, services, and subsystems (Win32, POSIX, Cocoa).',
        'Low to moderate; eliminates IPC bottlenecks for high-throughput subsystems.',
        'Moderate; driver bugs in kernel space still cause system crashes (BSOD).',
        'Windows NT kernel, Apple macOS XNU kernel.'
      ]
    ]
  }

  const virtualizationTable = {
    caption: 'Architectural Comparison: Type 1 Hypervisor vs Type 2 Hypervisor vs Containers',
    headers: ['Virtualization Paradigm', 'Host Environment', 'Kernel Sharing', 'Memory Overhead', 'Startup Latency', 'Representative Technologies'],
    rows: [
      [
        'Type 1 (Bare-Metal Hypervisor)',
        'Runs directly on physical server hardware in VMX Root mode.',
        'No kernel sharing; each VM boots its own dedicated guest kernel.',
        'High; each VM allocates full virtual RAM, kernel page tables, and buffers.',
        'Tens of seconds (full operating system bootstrap).',
        'VMware ESXi, Xen, Microsoft Hyper-V, Linux KVM.'
      ],
      [
        'Type 2 (Hosted Hypervisor)',
        'Runs as an application inside a conventional host operating system.',
        'No kernel sharing; guest kernel runs virtualized inside host user process.',
        'Highest; double virtualization of memory, scheduler, and storage caches.',
        'Tens of seconds (full operating system bootstrap).',
        'Oracle VirtualBox, VMware Workstation, Parallels Desktop.'
      ],
      [
        'OS Containers (Namespaces/cgroups)',
        'Runs directly on the host operating system kernel.',
        'Full kernel sharing; all containers execute on the single host kernel.',
        'Negligible; shares host memory, libraries, and kernel buffer cache.',
        'Milliseconds (instantaneous fork/exec of isolated process).',
        'Docker, containerd, Linux Containers (LXC), Kubernetes (CRI-O).'
      ]
    ]
  }

  const lkmExampleCode = `// Linux Kernel Module (LKM) Demonstration: Dynamic Runtime Linking
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Master of Computer Applications Systems Lab");
MODULE_DESCRIPTION("Demonstration of dynamic kernel module initialization without reboot");

// Executed when module is loaded into Ring 0 via insmod
static int __init demo_module_init(void) {
    pr_info("LKM: Module loaded into kernel space at privilege Ring 0\\n");
    // Register character device, hook interrupt, or add filesystem handler...
    return 0; // 0 indicates successful initialization
}

// Executed when module is unloaded from Ring 0 via rmmod
static void __exit demo_module_exit(void) {
    pr_info("LKM: Cleaning up resources and unlinking from kernel space\\n");
    // Unregister devices, free allocated kernel memory, remove hooks...
}

module_init(demo_module_init);
module_exit(demo_module_exit);`

  return (
    <>
      <p>
        An operating system is among the largest and most complex software systems ever constructed, containing tens of millions of lines of low-level C and assembly code. To manage this immense engineering complexity, operating systems are structured according to specific architectural paradigms that govern how kernel subsystems interact, where execution privilege boundaries are placed, and how hardware resources are virtualized. For MCA students, mastering operating system structure requires analyzing the fundamental trade-offs between performance, modularity, security, and virtualization.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>Operating system architectural models: Monolithic kernels, Microkernels, Layered architectures, and Hybrid designs.</li>
        <li>The historic Tanenbaum-Torvalds debate: Modularity vs performance in operating system evolution.</li>
        <li>Loadable Kernel Modules (LKMs): Extending monolithic kernels dynamically at runtime without recompilation.</li>
        <li>Virtual machine foundations: The Popek-Goldberg virtualization requirements and hardware virtualization extensions (Intel VT-x / AMD-V).</li>
        <li>Type 1 (Bare-Metal) vs Type 2 (Hosted) Hypervisors vs Operating System Containers (Namespaces and cgroups).</li>
        <li>Execution path tracing: Monolithic direct function calls vs Microkernel Inter-Process Communication (IPC) message hops.</li>
      </ul>

      <h2>1. Operating System Architectural Models</h2>

      <h3>1. Monolithic Kernel Architecture</h3>
      <p>
        In a <strong>Monolithic Architecture</strong>, the entire operating system executes as a single, massive program in a single address space within the most privileged CPU mode (Ring 0). All major kernel subsystems:
      </p>
      <ul>
        <li>CPU Process Scheduler</li>
        <li>Virtual Memory Manager and Paging Subsystem</li>
        <li>Virtual File System (VFS) and Physical File Systems (ext4, XFS, Btrfs)</li>
        <li>Networking Stack (TCP/UDP/IP sockets)</li>
        <li>Hardware Device Drivers</li>
      </ul>
      <p>
        are compiled and linked together into a single unified kernel image (e.g., <code>vmlinuz</code> in Linux). Subsystems communicate via direct in-memory C function calls, shared pointers, and global kernel data structures.
      </p>

      <Callout type="key" title="The Monolithic Engineering Trade-off">
        <p>
          <strong>Advantage:</strong> Unmatched raw performance. A system call requesting a file read invokes the VFS, checks page caches, and talks to the disk driver through direct CPU function calls without changing memory address spaces or executing IPC context switches.
        </p>
        <p>
          <strong>Disadvantage:</strong> Zero spatial isolation within Ring 0. Because all subsystems share the same address space without memory protection boundaries, a single null-pointer dereference, buffer overflow, or wild pointer in any third-party device driver corrupts kernel memory and causes a catastrophic <strong>Kernel Panic</strong> or Blue Screen of Death.
        </p>
      </Callout>

      <h3>Loadable Kernel Modules (LKMs)</h3>
      <p>
        Early monolithic kernels required manual recompilation and a complete system reboot whenever a new device driver or file system was added. Modern monolithic operating systems (such as Linux) overcome this rigidity using <strong>Loadable Kernel Modules (LKMs)</strong>.
      </p>
      <p>
        An LKM is an object file containing code that can be dynamically linked into the running kernel on demand (using tools like <code>insmod</code> or <code>modprobe</code>) and unlinked when no longer needed (using <code>rmmod</code>). Although LKMs provide modularity at development time, once loaded, they execute directly in Ring 0 inside the monolithic kernel address space:
      </p>

      <CodeBlock language="text" code={lkmExampleCode} />

      <h3>2. Microkernel Architecture</h3>
      <p>
        The <strong>Microkernel Architecture</strong> was designed to maximize system security, fault isolation, and modular reliability. It strips the kernel of all non-essential components, moving everything that can possibly run in user space out of Ring 0.
      </p>
      <p>
        Only the absolute minimum primitives remain in the microkernel (Ring 0):
      </p>
      <ul>
        <li>Low-level thread creation and CPU scheduling</li>
        <li>Low-level virtual-to-physical address space mapping hooks</li>
        <li>Inter-Process Communication (IPC) message passing mechanisms</li>
      </ul>
      <p>
        All other traditional operating system services: device drivers, physical file systems, network protocol stacks, and window managers: execute as unprivileged, isolated user-space processes (called <strong>servers</strong> or daemons) in Ring 3.
      </p>

      <h3>Tracing an I/O Request: Monolithic vs Microkernel</h3>
      <p>
        To understand why microkernels incur higher latency, trace what happens when an application requests a 4 KB block from a file:
      </p>

      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>A. Monolithic Kernel Execution Path (e.g., Linux):</strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>1. User App calls read() &rarr; Hardware trap (Ring 3 to Ring 0 mode switch).</p>
            <p>2. VFS calls ext4_read() via direct in-memory function call.</p>
            <p>3. ext4 calls nvme_submit_io() via direct in-memory function call.</p>
            <p>4. Driver writes DMA registers; returns data to user buffer.</p>
            <p>5. sysretq executes &rarr; Returns to User App (Ring 0 to Ring 3 mode switch).</p>
          </div>
          <p className="text-sm opacity-80 font-semibold text-brand dark:text-night-brand">
            Total Overhead: Exactly 1 mode switch round-trip, 0 address space context switches, 0 IPC copies.
          </p>
        </li>

        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>B. Microkernel Execution Path (e.g., MINIX / Mach):</strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>1. User App sends IPC message requesting read() &rarr; Trap to Microkernel (Ring 0).</p>
            <p>2. Microkernel context-switches to File System Server process in Ring 3.</p>
            <p>3. File System Server parses inode, sends IPC message to Disk Driver Server &rarr; Trap to Microkernel (Ring 0).</p>
            <p>4. Microkernel context-switches to Disk Driver Server process in Ring 3.</p>
            <p>5. Disk Driver initiates hardware transfer, sends completion IPC to FS Server &rarr; Trap to Microkernel (Ring 0).</p>
            <p>6. Microkernel context-switches back to FS Server in Ring 3.</p>
            <p>7. FS Server sends data IPC back to User App &rarr; Trap to Microkernel (Ring 0).</p>
            <p>8. Microkernel context-switches back to User App in Ring 3.</p>
          </div>
          <p className="text-sm opacity-80 font-semibold text-red-600 dark:text-red-400">
            Total Overhead: 4 full process context switches, 8 privilege mode transitions, and multiple in-memory IPC message buffer copies.
          </p>
        </li>
      </ul>

      <Callout type="example" title="The Tanenbaum-Torvalds Debate (1992)">
        <p>
          In 1992, Professor Andrew Tanenbaum (creator of MINIX) posted to the comp.os.minix newsgroup declaring that Linux was obsolete because it used a monolithic architecture instead of a modern microkernel. Linus Torvalds defended Linux, arguing that while microkernels were theoretically elegant, their real-world IPC overhead resulted in unacceptable performance degradation on standard x86 hardware. Decades later, Linux remains the dominant enterprise and cloud operating system due to its monolithic performance advantages, while microkernels dominate safety-critical embedded systems (e.g. QNX in automotive dashboards, seL4 in aerospace defense).
        </p>
      </Callout>

      <h3>3. Layered Operating System Architecture</h3>
      <p>
        In Dijkstra's <strong>Layered Architecture</strong> (first implemented in the THE Multiprogramming System in 1968), the operating system is partitioned into $N$ distinct concentric layers:
      </p>
      <ul>
        <li><strong>Layer 0:</strong> Direct physical hardware interface and CPU scheduling.</li>
        <li><strong>Layer 1:</strong> Memory management and paging allocation.</li>
        <li><strong>Layer 2:</strong> Operator communication and process console.</li>
        <li><strong>Layer 3:</strong> I/O management and peripheral buffering.</li>
        <li><strong>Layer 4:</strong> User application programs and compilers.</li>
      </ul>
      <p>
        The governing design rule is strict unidirectional invocation: functions in Layer $M$ can only invoke functions in Layer $M - 1$. While this simplified modular verification, pure layering suffers from <strong>circular dependency deadlocks</strong> in general-purpose systems (e.g. the paging subsystem needs the backing disk driver for swap, but the disk driver needs memory allocation buffers from the paging subsystem).
      </p>

      <h3>4. Hybrid Kernels</h3>
      <p>
        Commercial general-purpose operating systems frequently employ a <strong>Hybrid Architecture</strong> that blends microkernel modularity with monolithic execution performance:
      </p>
      <ul>
        <li>
          <strong>Windows NT Executive:</strong> Architecturally designed with microkernel abstractions (objects, security descriptors, message-passing LPC). However, to eliminate IPC bottlenecks, performance-critical subsystems: the Virtual Memory Manager, Object Manager, File Systems (NTFS), and graphics display drivers (<code>win32k.sys</code>): execute directly inside the kernel address space in Ring 0.
        </li>
        <li>
          <strong>macOS XNU Kernel:</strong> Combines the Mach 3.0 microkernel core (providing thread scheduling, tasks, and IPC ports) with FreeBSD kernel subsystems (providing POSIX APIs, BSD process models, VFS, and networking) executing concurrently in a single Ring 0 address space.
        </li>
      </ul>

      <ComparisonTable {...architecturesTable} />

      <h2>2. Virtual Machines and Hypervisor Architectures</h2>
      <p>
        Virtualization abstracts the physical hardware of a single physical machine into multiple virtual execution environments, each running an independent operating system.
      </p>

      <h3>The Popek-Goldberg Virtualization Theorem</h3>
      <p>
        In 1974, Gerald Popek and Robert Goldberg formulated the mathematical criteria for efficient virtualization:
      </p>
      <Callout type="definition" title="Popek-Goldberg Theorem">
        <p>
          A computer architecture is fully virtualizable if and only if all <strong>sensitive instructions</strong> (instructions that alter hardware configurations or behave differently depending on the execution mode) are a strict subset of <strong>privileged instructions</strong> (instructions that trap when executed in user mode).
        </p>
      </Callout>
      <p>
        Legacy 32-bit x86 processors violated this theorem because 17 sensitive instructions (such as <code>POPF</code>, which alters the interrupt flag, and <code>SMSW</code>) failed silently or returned incorrect values in user mode without generating a hardware trap. Early virtualization engines had to use complex, high-overhead <strong>Binary Translation</strong> (rewriting sensitive guest instructions on the fly).
      </p>

      <h3>Hardware Virtualization: Intel VT-x and AMD-V</h3>
      <p>
        To solve the x86 virtualization hole, CPU manufacturers introduced silicon-level virtualization extensions (Intel VT-x and AMD-V):
      </p>
      <ul>
        <li>
          <strong>VMX Root Operation:</strong> The execution mode used by the hypervisor. All standard privilege rings (Ring 0 to Ring 3) exist inside VMX root mode.
        </li>
        <li>
          <strong>VMX Non-Root Operation:</strong> The execution mode used by the guest virtual machine. Even though the guest kernel thinks it is executing in Ring 0, sensitive instructions automatically trigger a hardware trap called a <strong>VMEXIT</strong>, transferring control unconditionally back to the hypervisor in VMX root mode.
        </li>
        <li>
          <strong>Virtual Machine Control Structure (VMCS):</strong> A dedicated 4 KB physical memory page configured by the hypervisor that controls virtual CPU execution, guest state, host state, and specifies exactly which guest events trigger a VMEXIT.
        </li>
      </ul>

      <div className="my-6 p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
        <p className="font-bold text-base mb-2 font-sans">Intel VT-x Execution Lifecycle:</p>
        <div className="font-mono text-sm space-y-1">
          <p>1. Hypervisor configures VMCS &rarr; Executes VMLAUNCH or VMRESUME.</p>
          <p>2. CPU hardware switches mode: VMX Root &rarr; VMX Non-Root (Guest OS runs).</p>
          <p>3. Guest OS attempts privileged operation (e.g. reloads CR3 page table or halts CPU).</p>
          <p>4. Hardware intercepts operation &rarr; Generates VMEXIT (Mode switch: Non-Root &rarr; Root).</p>
          <p>5. Hypervisor inspects VMCS exit reason &rarr; Emulates hardware operation safely.</p>
          <p>6. Hypervisor executes VMRESUME &rarr; Resumes Guest OS execution.</p>
        </div>
      </div>

      <h2>3. Hypervisors vs Operating System Containers</h2>
      <p>
        Modern cloud infrastructure relies on two distinct virtualization paradigms:
      </p>

      <ComparisonTable {...virtualizationTable} />

      <h3>The Mechanics of Linux Containers</h3>
      <p>
        Unlike a virtual machine, a container does not run a hypervisor and does not boot a guest kernel. A container is simply a standard Linux process isolated using two core kernel subsystems:
      </p>
      <ul>
        <li>
          <strong>Linux Namespaces (Spatial Isolation):</strong> Provide a private, isolated virtualized view of global system resources:
          <ul>
            <li><code>PID Namespace:</code> Isolates process IDs. The container entrypoint process sees itself as PID 1, while on the host it has a standard high PID (e.g., 48291).</li>
            <li><code>Mount Namespace:</code> Provides an independent file system mount hierarchy (using rootfs images).</li>
            <li><code>Network Namespace:</code> Provides dedicated virtual network interfaces, routing tables, and firewall rules.</li>
            <li><code>UTS, IPC, User Namespaces:</code> Isolate hostnames, shared memory segments, and user/group ID mappings.</li>
          </ul>
        </li>
        <li>
          <strong>Control Groups (cgroups - Resource Enforcement):</strong> Allocate and restrict hardware resources per container, preventing any single container from exhausting the host CPU, physical RAM, swap space, or block I/O throughput.
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you contrast Monolithic, Microkernel, Layered, and Hybrid architectures across performance, fault isolation, and IPC overhead?</li>
        <li>Can you trace the exact execution path of a file read through a monolithic kernel versus a microkernel?</li>
        <li>Can you explain how Loadable Kernel Modules (LKMs) provide modularity to monolithic kernels without sacrificing Ring 0 performance?</li>
        <li>What is the Popek-Goldberg virtualization theorem, and how did Intel VT-x hardware extensions solve x86 virtualization limitations?</li>
        <li>Can you explain the architectural difference between a Virtual Machine (Type 1/Type 2 hypervisors) and an OS Container (Namespaces and cgroups)?</li>
      </ul>

      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Arpaci-Dusseau)</a> - Chapters on Operating System Organization and Virtualization.
        </li>
        <li>
          <a href="https://www.oreilly.com/library/view/linux-kernel-development/9780764549083/">Linux Kernel Development (Robert Love)</a> - Authoritative reference on monolithic kernel design, modules, and process management.
        </li>
        <li>
          <a href="https://sel4.systems/About/seL4-whitepaper.pdf">The seL4 Microkernel Architecture (Data61 / CSIRO)</a> - Formal verification and security architecture of verified microkernels.
        </li>
      </ul>
    </>
  )
}
