import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const standardsTable = {
    caption: 'Historical Evolution of ANSI / ISO C Standards',
    headers: ['Standard', 'Year Released', 'Key Language Innovations', 'Primary Architectural Objective'],
    rows: [
      [
        'K&R C',
        '1978',
        'Informal standard defined by Brian Kernighan & Dennis Ritchie seminal book.',
        'Documented early Bell Labs UNIX implementation conventions.'
      ],
      [
        'ANSI C / C89 (C90)',
        '1989 / 1990',
        'Function prototypes, void*, const/volatile qualifiers, standard I/O library.',
        'Established formal language contract eliminating vendor dialect divergence.'
      ],
      [
        'C99',
        '1999',
        'Variable-length arrays (VLAs), inline functions, designated initializers, stdbool.h, stdint.h.',
        'Modernized numeric computing, embedded systems support, and syntax flexibility.'
      ],
      [
        'C11',
        '2011',
        'Atomic operations (_Atomic), multithreading (threads.h), static asserts, anonymous structs/unions.',
        'Direct hardware concurrency and compiler-enforced static safety guarantees.'
      ],
      [
        'C17 / C18',
        '2018',
        'Defect corrections, compiler clarification errata; zero new syntactic features.',
        'Stabilized C11 implementations across major compiler vendors.'
      ],
      [
        'C23',
        '2024',
        'Native bool, true/false, nullptr keyword, typeof operator, [[nodiscard]] attributes.',
        'Harmonizes modern C with C++ compatibility and enhanced compile-time verification.'
      ]
    ]
  }

  const memoryModelTable = {
    caption: 'Explicit Memory Management (C) vs Managed Runtimes (Java / Python)',
    headers: ['Evaluation Metric', 'C Programming Language', 'Managed Languages (Java, Python, C#)'],
    rows: [
      [
        'Allocation Paradigm',
        'Explicit manual allocation via malloc() / calloc() / realloc().',
        'Automatic runtime object allocation via new or literal instantiation.'
      ],
      [
        'Deallocation Mechanism',
        'Manual invocation of free(); zero automated reclamation.',
        'Automatic Garbage Collection (GC) via reference tracing / mark-sweep.'
      ],
      [
        'Execution Latency',
        'Deterministic nanosecond latency; zero garbage collection pause spikes.',
        'Non-deterministic: prone to periodic "Stop-The-World" GC latency spikes.'
      ],
      [
        'Memory Footprint',
        'Minimal: raw contiguous bytes without hidden object headers.',
        'High: 16 to 24 bytes of object header and GC metadata per primitive.'
      ],
      [
        'Cache Spatial Locality',
        'Optimal: structs and array blocks reside contiguously in memory.',
        'Degraded: objects scattered across the heap require multiple pointer dereferences.'
      ],
      [
        'Safety Profile',
        'Programmer is fully responsible: vulnerable to leaks and dangling pointers.',
        'Memory safe: prevents dangling pointers and double frees automatically.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        The C programming language forms the bedrock of modern computing infrastructure and data structure design.
        Conceived at Bell Labs by Dennis Ritchie, C bridges high-level algorithmic abstractions with direct, low-level
        hardware control. This study explores the history and standardization of C, its classification as a middle-level
        language, its indispensable role in systems software and data structures, the mechanics of explicit memory management,
        and the ISO behavioral taxonomy distinguishing implementation-defined, unspecified, and undefined behaviors.
      </p>

      <h2>1. The Chronological Evolution of C</h2>
      <p>
        In the late 1960s, operating systems were authored almost entirely in hardware-specific assembly language.
        While assembly granted complete control over processor registers and memory, it tied operating systems
        irrevocably to a single computer architecture: transferring software to a different machine required rewriting
        the entire codebase from scratch.
      </p>
      <p>
        Between 1969 and 1973 at Bell Laboratories (AT&amp;T), <strong>Dennis Ritchie</strong> and <strong>Ken Thompson</strong> set
        out to build a portable, multi-user operating system: <strong>UNIX</strong>. Thompson initially adapted Martin Richards&rsquo;
        <strong>BCPL</strong> into the <strong>B language</strong> for the DEC PDP-7. However, B was an untyped language that treated
        every memory address as a single machine word, making character handling and byte-level memory operations awkward.
      </p>
      <p>
        Ritchie overhauled B by introducing a formal <strong>data type system</strong>, structured control flow, and explicit
        byte addressing, creating <strong>C</strong>. In 1973, UNIX was rewritten in C: a watershed moment that proved an entire
        production operating system kernel could achieve high performance and complete cross-platform hardware portability.
      </p>

      <ComparisonTable {...standardsTable} />

      <h2>2. C as a Middle-Level Language</h2>
      <p>
        Computer science literature classifies C as a <strong>middle-level language</strong> because it synthesizes the
        structural clarity of high-level languages with the raw architectural power of low-level assembly:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The Dual Architectural Nature of C
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand font-sans">High-Level Abstractions</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li><strong>Structured Control Flow:</strong> Rich iterative and conditional constructs (<code>if-else</code>, <code>switch</code>, <code>while</code>, <code>for</code>).</li>
              <li><strong>Procedural Modularity:</strong> Functions with localized lexical scope and structured parameter passing.</li>
              <li><strong>Composite Types:</strong> User-defined structures (<code>struct</code>), unions, and enumerations.</li>
              <li><strong>Hardware Independence:</strong> Algorithms compile across x86, ARM, RISC-V, and MIPS without rewriting logic.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success font-sans">Low-Level Hardware Control</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li><strong>Direct Memory Addressing:</strong> Pointers allow unrestricted physical memory inspection and arithmetic.</li>
              <li><strong>Bitwise Operators:</strong> Direct bit manipulation (<code>&amp;</code>, <code>|</code>, <code>XOR</code>, <code>~</code>, <code>&lt;&lt;</code>, <code>&gt;&gt;</code>) mapping to single CPU opcodes.</li>
              <li><strong>Zero Runtime Overhead:</strong> No hidden garbage collectors, runtime type tags, or virtual machine interpreters.</li>
              <li><strong>Inline Assembly:</strong> Direct execution of raw processor opcodes within C functions.</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>3. Why C is Foundational for Data Structures</h2>
      <p>
        In managed languages (such as Java or Python), physical memory representation is abstracted away. An array of objects
        is implemented as an array of heap references pointing to scattered objects, each carrying metadata headers and garbage collection tags.
      </p>
      <p>
        In C, data structures correspond exactly to physical memory layout:
      </p>
      <ul>
        <li>
          <strong>Contiguous Storage:</strong> An array of integers in C is guaranteed to be a strictly contiguous block of physical RAM.
          A developer directly observes the mathematical relationship linking the logical index <em>i</em> to its physical memory address:
          <br />
          <code className="text-brand dark:text-night-brand font-bold">Address(A[i]) = Base_Address + (i &times; sizeof(int))</code>
        </li>
        <li>
          <strong>Explicit Pointer Linking:</strong> Building dynamic data structures (linked lists, binary search trees, B-trees, graphs)
          requires declaring explicit pointer fields (<code>struct Node *next</code>, <code>struct Node *left</code>) and managing their
          lifetimes manually, cultivating deep mechanical sympathy for pointer indirection and hardware cache hierarchies.
        </li>
        <li>
          <strong>Systems Infrastructure Dominance:</strong> Operating system kernels (Linux, Windows, macOS), database engines
          (PostgreSQL, SQLite, MySQL), embedded firmware, and compiler runtimes (CPython, V8) are implemented in C.
        </li>
      </ul>

      <h2>4. Memory Management: Explicit vs Managed Runtimes</h2>
      <p>
        Understanding data structures requires evaluating how operating system memory is allocated, utilized, and released:
      </p>

      <ComparisonTable {...memoryModelTable} />

      <Callout type="warning" title="The Three Golden Hazards of Manual Memory Management">
        Because C trusts the programmer completely, manual memory management introduces three critical vulnerability vectors:
        <ul className="list-disc pl-4 mt-2 space-y-1">
          <li><strong>Memory Leak:</strong> Allocating heap storage via <code>malloc()</code> but losing all pointer references without calling <code>free()</code>, causing the process memory consumption to monotonically grow until starvation.</li>
          <li><strong>Dangling Pointer (Use-After-Free):</strong> Retaining and dereferencing a pointer after its target storage has been released via <code>free()</code>, corrupting unrelated memory.</li>
          <li><strong>Double Free:</strong> Calling <code>free()</code> twice on the exact same pointer address, corrupting the internal metadata structures of the heap allocator and opening remote code execution vectors.</li>
        </ul>
      </Callout>

      <h2>5. The ISO C Behavioral Taxonomy</h2>
      <p>
        The ISO C specification balances compiler optimization freedom across diverse hardware microarchitectures
        by categorizing runtime behaviors into three strict classes:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The Three Classes of C Standard Behavior
        </h4>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand font-sans">1. Implementation-Defined Behavior</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80 font-sans">
              Behavior where multiple choices are permitted by the ISO standard, and the compiler vendor <strong>must explicitly document</strong>
              how the implementation behaves.
            </p>
            <div className="font-mono text-ink/90 dark:text-night-ink/90 mt-1">
              Examples: Size of <code>int</code> (16, 32, or 64 bits); whether plain <code>char</code> is signed or unsigned; propagation of sign bit during right-shifting signed integers.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent font-sans">2. Unspecified Behavior</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80 font-sans">
              Behavior where the ISO standard offers two or more possibilities, but the compiler implementation <strong>is NOT required to document</strong>
              which choice it selects.
            </p>
            <div className="font-mono text-ink/90 dark:text-night-ink/90 mt-1">
              Examples: Order of evaluation of function arguments in <code>printf(&quot;%d %d&quot;, f(), g())</code> (whether <code>f()</code> or <code>g()</code> runs first is unspecified).
            </div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-danger dark:text-night-danger font-sans">3. Undefined Behavior (UB)</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80 font-sans">
              Behavior for which the ISO standard imposes <strong>absolutely no requirements</strong>.
              The program is invalid: the compiler is legally permitted to generate broken code, crash, execute arbitrary instructions, or silently produce nonsense results.
            </p>
            <div className="font-mono text-ink/90 dark:text-night-ink/90 mt-1">
              Examples: Dereferencing a NULL pointer (<code>*p</code>); reading beyond array bounds; signed integer overflow (<code>INT_MAX + 1</code>); modifying a variable twice across sequence points (<code>i = i++</code>).
            </div>
          </div>
        </div>
      </div>

      <FAQ items={questions} />
    </>
  )
}
