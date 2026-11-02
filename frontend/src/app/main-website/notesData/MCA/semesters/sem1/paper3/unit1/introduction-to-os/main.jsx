import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const kernelProtectionTable = {
    caption: 'Hardware-Enforced Privilege Levels and Protection Boundary',
    headers: ['Execution Mode', 'Privilege Level', 'Permitted CPU Instructions', 'Memory Page Access', 'Failure Behavior on Violation'],
    rows: [
      [
        'User Mode (Ring 3)',
        'Unprivileged',
        'Arithmetic, logical, local jumps, user stack operations, unprivileged branch instructions.',
        'Only virtual memory pages marked with User/Supervisor flag = 1 (user space addresses).',
        'General Protection Fault (GPF, vector 13) or Page Fault (vector 14); process receives SIGSEGV.'
      ],
      [
        'Kernel Mode (Ring 0)',
        'Supervisor / Highest',
        'All instructions: CLI, STI, HLT, LIDT, MOV to/from CR0-CR4, direct I/O port IN/OUT instructions.',
        'Entire physical and virtual address space, including kernel data structures and page directories.',
        'Kernel Panic (Linux) or BugCheck / Blue Screen of Death (Windows); machine halts.'
      ]
    ]
  }

  const syscallAssemblyCode = `; Demonstration of an x86-64 Linux system call mechanism
; User space application requests write(1, message, 14)

section .data
    msg db "Hello, Kernel", 10
    len equ $ - msg

section .text
    global _start

_start:
    ; 1. Load system call number into %rax (1 = sys_write on x86-64 Linux)
    mov rax, 1

    ; 2. Marshal parameters into standard ABI registers
    mov rdi, 1          ; Arg 1 (rdi): File descriptor (1 = stdout)
    mov rsi, msg        ; Arg 2 (rsi): Memory pointer to buffer
    mov rdx, len        ; Arg 3 (rdx): Number of bytes to write

    ; 3. Execute hardware trap to switch privilege level (Ring 3 -> Ring 0)
    syscall             ; CPU saves %rip in %rcx, %rflags in %r11, jumps to MSR_LSTAR

    ; 4. System call returns here with status/byte count in %rax
    ; Request sys_exit(0)
    mov rax, 60         ; 60 = sys_exit
    xor rdi, rdi        ; Exit code 0
    syscall`

  return (
    <>
      <p>
        An Operating System is not merely another application program. It is the permanent, event-driven supervisor that controls the raw physical machinery of a computer system. For Master of Computer Applications (MCA) students, mastering operating systems requires bridging theoretical resource-management algorithms with the physical execution realities of CPU hardware, memory controllers, and peripheral buses.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>The dual identity of an OS: Resource Allocator vs Extended Machine (Abstraction Layer).</li>
        <li>The hardware-kernel dual-mode boundary: Mode bit mechanics, privileged instructions, and supervisor protection.</li>
        <li>The lifecycle and anatomy of a system call: Trap dispatch, argument marshalling, kernel stack switching, and return.</li>
        <li>Hardware safety mechanisms: Timer interrupts, memory isolation with base/limit registers, and CPU exception vectors.</li>
        <li>Academic examination blueprints and systems engineering interview questions.</li>
      </ul>

      <h2>1. Foundational Definition: Dual Perspectives</h2>
      <p>
        Textbooks and university examinations evaluate an operating system from two complementary viewpoints. A comprehensive answer must present both perspectives with clear architectural justifications:
      </p>

      <h3>A. The Top-Down View: Extended Machine and Hardware Abstraction Layer</h3>
      <p>
        Physical hardware at the silicon level is intricate, timing-dependent, and prone to transient physical errors. Without an operating system, every programmer writing an application would need to write direct code to pulse magnetic read heads on rotating hard drives, calibrate flash memory erase blocks, decode variable-voltage scan codes from USB keyboard microcontrollers, and handle complex memory-bus arbitration.
      </p>
      <p>
        The operating system abstracts this raw physical machinery into clean, logical, and uniform programming interfaces. Instead of physical sectors, cylinders, and spindle speeds, the OS exposes the concept of a <strong>file</strong>. Instead of physical peripheral registers, it exposes uniform byte streams and socket abstractions. The OS thus creates an "extended machine" that is easier to program and inherently portable.
      </p>

      <h3>B. The Bottom-Up View: Resource Manager and Arbiter</h3>
      <p>
        Modern computing environments are concurrently shared by multiple programs, multiple background services, and multiple users. When two processes simultaneously request CPU execution time, primary RAM allocation, or network transmission, conflicts arise.
      </p>
      <p>
        The OS acts as the primary resource manager. It maintains complete ownership over physical resources and arbitrates requests to achieve three non-negotiable operational goals:
      </p>
      <ul>
        <li><strong>Spatial Isolation:</strong> Preventing one program from reading, overwriting, or corrupting the private memory and data structures of another process or the kernel itself.</li>
        <li><strong>Temporal Fairness:</strong> Ensuring that compute-intensive tasks cannot starve interactive or latency-sensitive programs of CPU execution cycles.</li>
        <li><strong>System Efficiency:</strong> Maximizing aggregate throughput while keeping hardware peripherals fully utilized through asynchronous overlap.</li>
      </ul>

      <Callout type="definition" title="Operating System Core Definition">
        <p>
          An <strong>Operating System</strong> is system software that manages computer hardware and software resources, provides common abstraction services for application programs, and executes in a privileged CPU mode to enforce spatial and temporal protection across all concurrently executing entities.
        </p>
      </Callout>

      <h2>2. The Hardware-Kernel Dual-Mode Boundary</h2>
      <p>
        Software alone cannot enforce system security or process isolation. If an operating system were implemented purely in software without physical CPU support, a rogue application could easily overwrite the kernel scheduler in memory or disable the interrupt flag. True multiprogramming security requires direct hardware assistance.
      </p>

      <h3>The Hardware Mode Bit</h3>
      <p>
        Modern processors contain one or more status registers (such as the <code>EFLAGS</code> / <code>RFLAGS</code> register on Intel/AMD x86-64 processors, or the <code>CPSR</code> on ARM processors) containing a dedicated <strong>mode bit</strong>:
      </p>
      <ul>
        <li><strong>Kernel Mode (Supervisor Mode / Ring 0):</strong> The mode bit is cleared (0). The CPU can execute every instruction supported by the instruction set architecture (ISA), manipulate physical memory translation tables, configure hardware timers, and communicate directly with device controllers.</li>
        <li><strong>User Mode (Ring 3):</strong> The mode bit is set (1). The CPU cannot execute privileged instructions. Memory access is strictly confined to user-space virtual pages mapped in the current page table.</li>
      </ul>

      <ComparisonTable {...kernelProtectionTable} />

      <h3>Privileged vs Non-Privileged Instructions</h3>
      <p>
        Instructions are categorized by the hardware based on their potential to breach isolation:
      </p>
      <ul>
        <li>
          <strong>Privileged Instructions (Execute only in Ring 0):</strong>
          <ul>
            <li><code>CLI</code> / <code>STI</code>: Clear and Set Interrupt Flags. Used by the kernel to protect critical sections against asynchronous interrupt interleaving.</li>
            <li><code>MOV CR3, %RAX</code>: Reload the Page Directory Base Register. Determines which physical RAM frames map to which virtual addresses.</li>
            <li><code>LIDT</code>: Load Interrupt Descriptor Table. Establishes the memory addresses of hardware and software interrupt service routines.</li>
            <li><code>IN</code> / <code>OUT</code>: Direct port-mapped I/O instructions on architectures with isolated I/O address spaces.</li>
            <li><code>HLT</code>: Halt instruction that powers down the CPU core until the next external interrupt arrives.</li>
          </ul>
        </li>
        <li>
          <strong>Non-Privileged Instructions (Permitted in Ring 3):</strong>
          Arithmetic operations (<code>ADD</code>, <code>MUL</code>), logical bitwise operations, local unconditional and conditional branches, memory operations on valid user addresses, and the system call trap instruction itself.
        </li>
      </ul>

      <Callout type="mistake" title="Common Exam Misconception">
        <p>
          Do not claim that switching from user mode to kernel mode requires restarting the processor or executing a complete context switch. Mode switching changes the CPU privilege level within the context of the currently executing process. A context switch, by contrast, stops one process, saves its entire architectural state, and switches memory mappings to run a completely different process.
        </p>
      </Callout>

      <h2>3. Anatomy of a System Call</h2>
      <p>
        A system call is the sanctioned programmatic gateway allowing user-mode programs to request privileged kernel operations. The transition must be carefully gated to ensure user programs cannot execute arbitrary kernel memory addresses.
      </p>

      <h3>The Step-by-Step System Call Dispatch Sequence</h3>
      <ol>
        <li>
          <strong>Parameter Marshalling:</strong> The user program (or more commonly, the standard C library wrapper such as <code>glibc</code>) places the requested system call identity number into a designated CPU register (e.g. <code>%rax</code> on x86-64) and loads call arguments into ABI registers (<code>%rdi</code>, <code>%rsi</code>, <code>%rdx</code>).
        </li>
        <li>
          <strong>Privilege Elevation Trap:</strong> The user code executes an intentional software trap instruction (<code>syscall</code> on modern x86-64, or legacy <code>int 0x80</code>; <code>svc #0</code> on ARM).
        </li>
        <li>
          <strong>Hardware Mode Switch:</strong> The CPU hardware automatically:
          <ul>
            <li>Saves the current instruction pointer into a temporary register (e.g., <code>%rcx</code>) and CPU flags into <code>%r11</code>.</li>
            <li>Flips the internal hardware mode bit from 1 (User) to 0 (Kernel).</li>
            <li>Switches the stack pointer (<code>%rsp</code>) from the untrusted user stack to the dedicated per-process kernel stack.</li>
            <li>Loads the instruction pointer (<code>%rip</code>) with the address of the kernel system call entry point from a privileged Model-Specific Register (<code>MSR_LSTAR</code>).</li>
          </ul>
        </li>
        <li>
          <strong>Kernel Stack Frame Construction:</strong> The kernel entry routine pushes the user-space general-purpose registers onto the kernel stack, creating a structured snapshot (known as <code>pt_regs</code> in Linux).
        </li>
        <li>
          <strong>Table Dispatch & Validation:</strong> The kernel checks whether the syscall number in <code>%rax</code> is strictly within bounds of the <code>sys_call_table</code> array. It validates all user-space memory pointers passed as arguments to verify they reside completely within user address space and do not overlap kernel memory.
        </li>
        <li>
          <strong>Execution of Kernel Service Routine:</strong> The kernel executes the underlying subsystem handler (e.g., <code>sys_write()</code>).
        </li>
        <li>
          <strong>Return from Trap:</strong> The return value is stored in <code>%rax</code>. The kernel restores user registers from the kernel stack and executes <code>sysretq</code> (or <code>sysexit</code>). The hardware flips the mode bit back to user mode (1) and resumes user execution immediately after the trap instruction.
        </li>
      </ol>

      <h3>Low-Level System Call Assembly Tracing</h3>
      <p>
        The following assembly demonstrates how a program invokes the Linux kernel without relying on high-level library abstractions:
      </p>
      <CodeBlock language="text" code={syscallAssemblyCode} />

      <h2>4. Hardware Timers and CPU Preemption</h2>
      <p>
        In an operating system supporting multiprogramming and time sharing, the kernel must prevent any single process from seizing infinite control over the processor.
      </p>
      <p>
        The hardware solution is the <strong>programmable interval timer</strong> (PIT or local APIC timer). The OS initializes the timer counter register with a calibrated frequency value during bootstrap. The timer chip decrements this counter with every oscillator clock tick. When the counter reaches zero, the timer controller asserts an electrical signal on the CPU interrupt pin.
      </p>
      <p>
        The CPU pauses its current execution pipeline, preserves registers, and immediately vectors to the kernel timer interrupt handler. The scheduler decrements the time slice allocated to the running process. When the quantum expires, the scheduler invokes the context-switching routine to select another process from the ready queue. This makes modern preemptive multitasking deterministic and impervious to user code bugs or intentional infinite loops.
      </p>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you clearly differentiate between the top-down and bottom-up definitions of an OS in a 10-mark examination answer?</li>
        <li>Can you list at least four privileged instructions and explain the exact failure consequence if user space attempts to run them?</li>
        <li>Can you trace the step-by-step register and stack operations occurring during a <code>syscall</code> and <code>sysret</code> transition?</li>
        <li>Do you understand why hardware timers are strictly required for preemptive scheduling rather than cooperative multitasking?</li>
        <li>Can you explain the differences between an interrupt, a trap, and a fault with practical systems examples?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Definitive modern text on virtualization, concurrency, and persistence.
        </li>
        <li>
          <a href="https://www.kernel.org/doc/html/latest/">The Linux Kernel Documentation</a> - Primary technical reference for Linux kernel architecture, system call dispatch, and device drivers.
        </li>
        <li>
          <a href="https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html">Intel 64 and IA-32 Architectures Software Developer Manuals (Volume 3: System Programming Guide)</a> - Official specification for processor privilege rings, page table structures, and mode transitions.
        </li>
      </ul>
    </>
  )
}
