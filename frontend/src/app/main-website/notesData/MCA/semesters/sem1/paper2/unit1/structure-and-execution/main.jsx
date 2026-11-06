import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const compilationStagesTable = {
    caption: 'The Four Sequential Stages of C Program Compilation',
    headers: ['Compilation Stage', 'Underlying Tool', 'Input File Type', 'Output File Type', 'Primary Operation Performed'],
    rows: [
      [
        '1. Preprocessing',
        'C Preprocessor (cpp)',
        'source.c (Raw C Source)',
        'source.i (Preprocessed Source)',
        'Expands headers (#include), replaces macros (#define), removes comments.'
      ],
      [
        '2. Compilation',
        'Core Compiler (cc1)',
        'source.i',
        'source.s (Assembly Code)',
        'Lexical/syntax analysis, AST generation, machine optimization, assembly translation.'
      ],
      [
        '3. Assembly',
        'Assembler (as)',
        'source.s',
        'source.o (Object Code)',
        'Translates assembly mnemonics into relocatable machine opcodes.'
      ],
      [
        '4. Linking',
        'Linker (ld)',
        'source.o + libc.a / libc.so',
        'Executable Binary (ELF / PE)',
        'Resolves external symbols, merges object sections, computes absolute memory offsets.'
      ]
    ]
  }

  const memorySegmentsTable = {
    caption: 'Virtual Memory Layout of a Running C Process',
    headers: ['Memory Segment', 'Access Permissions', 'Growth Direction', 'Lifecycle & Persistence', 'Typical Contents'],
    rows: [
      [
        'Call Stack',
        'Read / Write (rw-)',
        'Downwards (High &rarr; Low addresses)',
        'Automatic: created on function call, popped on return.',
        'Stack frames, local automatic variables, return addresses, saved registers.'
      ],
      [
        'Heap',
        'Read / Write (rw-)',
        'Upwards (Low &rarr; High addresses)',
        'Dynamic: allocated via malloc(), persists until explicit free().',
        'Dynamically allocated runtime arrays, linked nodes, large buffers.'
      ],
      [
        'BSS Segment',
        'Read / Write (rw-)',
        'Fixed size at process launch',
        'Global lifetime: initialized to zero by kernel at process load time.',
        'Uninitialized global variables and static variables.'
      ],
      [
        'Initialized Data (.data)',
        'Read / Write (rw-)',
        'Fixed size at process launch',
        'Global lifetime: loaded directly from the executable binary file.',
        'Global and static variables with explicit non-zero initialization values.'
      ],
      [
        'Text / Code Segment',
        'Read / Execute (r-x)',
        'Fixed size at compile time',
        'Global lifetime: write-protected by MMU page permissions.',
        'Compiled machine code instructions, constant string literals.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Executing a C program involves a deep transformation from symbolic source text into physical processor instructions
        executing inside a structured virtual address space. This comprehensive study examines the modular structure of C programs,
        the four sequential stages of compilation (Preprocessing, Compilation, Assembly, Linking), the five canonical virtual memory
        segments (Text, Data, BSS, Heap, Stack), the mechanics of Position-Independent Code and dynamic linking via PLT/GOT,
        and the exact system-level lifecycle of process termination.
      </p>

      <h2>1. The Modular Structure of a C Program</h2>
      <p>
        A well-architected C program consists of six standardized structural sections designed to ensure clean separation of concerns:
      </p>
      <ol>
        <li>
          <strong>Documentation Section:</strong> Introductory block comments documenting program purpose, author, version,
          and interface contracts.
        </li>
        <li>
          <strong>Link Section (Preprocessor Directives):</strong> Header inclusion directives (e.g., <code>#include &lt;stdio.h&gt;</code>)
          instructing the preprocessor to pull in external function prototypes and type definitions.
        </li>
        <li>
          <strong>Definition Section:</strong> Symbolic constants and functional macros (e.g., <code>#define BUFFER_SIZE 4096</code>).
        </li>
        <li>
          <strong>Global Declaration Section:</strong> Declarations of variables, user-defined types (<code>typedef struct</code>),
          and function prototypes visible across all functions in the file.
        </li>
        <li>
          <strong>main() Function:</strong> The mandatory execution entry point of every C program. The ISO C standard mandates:
          <br />
          <code className="text-brand dark:text-night-brand font-bold">int main(void)</code> or <code className="text-brand dark:text-night-brand font-bold">int main(int argc, char *argv[])</code>.
        </li>
        <li>
          <strong>Subprogram Section:</strong> Implementations of auxiliary user-defined functions declared in the global section.
        </li>
      </ol>

      <h2>2. The Four Stages of C Compilation</h2>
      <p>
        When you invoke <code>gcc program.c -o program</code>, the compiler driver orchestrates four separate system tools in sequence:
      </p>

      <ComparisonTable {...compilationStagesTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          GCC Toolchain Intermediate Stage Commands
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2 overflow-x-auto">
          <div><span className="text-ink/70 dark:text-night-ink/70">// 1. Generate Preprocessed File (.i)</span><br />gcc -E program.c -o program.i</div>
          <div><span className="text-ink/70 dark:text-night-ink/70">// 2. Generate Assembly File (.s)</span><br />gcc -S program.i -o program.s</div>
          <div><span className="text-ink/70 dark:text-night-ink/70">// 3. Generate Relocatable Object File (.o)</span><br />gcc -c program.s -o program.o</div>
          <div><span className="text-ink/70 dark:text-night-ink/70">// 4. Link into Final ELF Executable Binary</span><br />gcc program.o -o program</div>
        </div>
      </div>

      <h2>3. Virtual Memory Layout of a Running C Process</h2>
      <p>
        When an operating system executes a compiled C binary, the kernel creates an isolated virtual address space
        divided into five canonical memory segments:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The 5 Virtual Memory Segments of a C Process
        </h4>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-brand dark:text-night-brand">High Memory (0x7FFFFFFFFFFF)</span>
            <span className="text-ink/70 dark:text-night-ink/70">Command-line arguments &amp; Environment variables</span>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-danger dark:text-night-danger">Call Stack Segment (&darr; Grows Downward)</span>
            <span className="text-ink/70 dark:text-night-ink/70">Stack frames, local automatic variables, return pointers</span>
          </div>
          <div className="p-3 rounded-lg bg-surface dark:bg-night-surface border border-dashed border-line dark:border-night-line text-center text-ink/50 dark:text-night-ink/50 py-2">
            &uarr; Unallocated Virtual Address Space Gap &darr;
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-success dark:text-night-success">Heap Segment (&uarr; Grows Upward)</span>
            <span className="text-ink/70 dark:text-night-ink/70">malloc(), calloc(), realloc() dynamic memory allocations</span>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-accent dark:text-night-accent">BSS Segment (.bss)</span>
            <span className="text-ink/70 dark:text-night-ink/70">Uninitialized global and static variables (zero-initialized)</span>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-ink dark:text-night-ink">Initialized Data Segment (.data)</span>
            <span className="text-ink/70 dark:text-night-ink/70">Explicitly initialized global and static variables</span>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line flex justify-between">
            <span className="font-bold text-brand dark:text-night-brand">Text Segment (.text) (Low Memory: 0x00400000)</span>
            <span className="text-ink/70 dark:text-night-ink/70">Read-only compiled machine code instructions &amp; string literals</span>
          </div>
        </div>
      </div>

      <ComparisonTable {...memorySegmentsTable} />

      <h2>4. Dynamic Linking and the PLT / GOT Mechanism</h2>
      <p>
        In modern operating systems, programs rely on <strong>Dynamic Linking</strong> to share library code (such as <code>libc.so</code>)
        in physical RAM across multiple running processes. Because Address Space Layout Randomization (ASLR) randomizes
        where libraries are mapped, shared library calls use <strong>Position-Independent Code (PIC)</strong> via two tables:
      </p>
      <ul>
        <li>
          <strong>Procedure Linkage Table (PLT):</strong> A read-only lookup table containing small trampolines that jump
          to external library functions through entries in the GOT.
        </li>
        <li>
          <strong>Global Offset Table (GOT):</strong> A read-write table located in the data segment containing the actual
          resolved virtual memory addresses of external functions.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Deep Dive: Lazy Binding Walkthrough (Calling printf)
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>Step 1: Application executes call to printf@plt.</div>
          <div>Step 2: printf@plt executes an indirect jump: jmp *GOT[printf].</div>
          <div>Step 3: On first call, GOT[printf] points back to the PLT stub, which invokes the dynamic linker (ld.so).</div>
          <div className="text-accent dark:text-night-accent font-bold">
            Step 4: ld.so searches libc.so in memory, resolves the true physical address of printf, and overwrites GOT[printf] with that address.
          </div>
          <div className="text-success dark:text-night-success font-bold">
            Step 5: On all future calls, jmp *GOT[printf] jumps straight to printf in libc with zero linker overhead!
          </div>
        </div>
      </div>

      <h2>5. Process Termination Lifecycle: return vs exit vs _exit</h2>
      <p>
        Terminating a C program involves critical user-space and kernel boundary transitions:
      </p>
      <ul>
        <li>
          <strong>return 0 in main():</strong> Exits <code>main()</code> and returns execution to the C runtime startup code (<code>crt1.o</code>),
          which immediately calls <code>exit(0)</code>.
        </li>
        <li>
          <strong>exit(int status):</strong> Standard library function in <code>&lt;stdlib.h&gt;</code>.
          Executes all exit handlers registered via <code>atexit()</code> in reverse order (LIFO), flushes all open output stream buffers
          (<code>fflush</code>), closes all open files, and transfers control to the kernel.
        </li>
        <li>
          <strong>_exit(int status):</strong> Direct operating system system call.
          Terminates the process immediately in the kernel <strong>without running atexit() handlers and without flushing stdio buffers</strong>.
          Buffered data waiting in <code>stdout</code> is permanently lost!
        </li>
      </ul>

      <Callout type="info" title="The atexit() Cleanup Handler">
        C allows registering up to 32 cleanup functions using <code>int atexit(void (*func)(void));</code>.
        Registered handlers are guaranteed to execute upon normal program termination (via <code>exit()</code> or returning from <code>main()</code>),
        ensuring temporary files, database connections, and locks are released reliably.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
