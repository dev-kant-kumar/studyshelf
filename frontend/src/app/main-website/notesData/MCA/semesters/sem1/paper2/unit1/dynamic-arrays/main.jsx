import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const allocatorComparison = {
    caption: 'Comparative Architecture of Standard C Heap Memory Allocators (&lt;stdlib.h&gt;)',
    headers: ['Function Prototype', 'Initialization State', 'Size Specification', 'Re-allocation Behavior', 'Internal Overflow Check'],
    rows: [
      [
        'void* malloc(size_t size);',
        'Uninitialized (contains arbitrary heap garbage bytes).',
        'Single byte total (size).',
        'N/A (allocates new block).',
        'No (caller must check multiplication overflow).'
      ],
      [
        'void* calloc(size_t num, size_t size);',
        'Zero-initialized (all bytes set to binary 0x00).',
        'Two arguments (element count &times; element size).',
        'N/A (allocates new block).',
        'Yes (returns NULL if num &times; size overflows size_t).'
      ],
      [
        'void* realloc(void *ptr, size_t new_size);',
        'Preserves existing data; newly appended bytes are uninitialized.',
        'Existing pointer + new total byte size.',
        'Attempts in-place expansion; if blocked, allocates new block, copies data, and frees old block.',
        'No.'
      ],
      [
        'void free(void *ptr);',
        'Releases block back to heap free-list; pointer becomes dangling.',
        'None (reads chunk size from allocator metadata header).',
        'N/A (deallocates memory).',
        'N/A (passing NULL is safe no-op).'
      ]
    ]
  }

  const growthStrategyComparison = {
    caption: 'Capacity Growth Strategies for Resizable Dynamic Arrays (Vectors)',
    headers: ['Strategy', 'Formula for New Capacity', 'Total Element Copies for N Elements', 'Amortized Push Complexity', 'Heap Memory Overhead'],
    rows: [
      [
        'Arithmetic Growth (Linear Step)',
        'capacity = capacity + C (e.g., +16 slots)',
        'O(N<sup>2</sup>) quadratic element copies',
        'O(N) linear time per insertion (unacceptable)',
        'Low memory waste (at most C unused slots).'
      ],
      [
        'Geometric Doubling (&times; 2.0)',
        'capacity = capacity &times; 2',
        'Less than 2N total copies (N - 1 copies)',
        'Amortized O(1) constant time',
        'Moderate waste (up to 50% unused capacity after resize).'
      ],
      [
        'Golden Ratio Growth (&times; 1.5)',
        'capacity = capacity + (capacity / 2)',
        'Less than 3N total copies',
        'Amortized O(1) constant time',
        'Allows allocator to reuse previously freed memory chunks.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        A dynamic array (known as a Vector in C++ or ArrayList in Java) is a resizable, contiguous sequence of elements whose capacity expands automatically as items are inserted. Because standard C arrays have fixed sizes bound at compile time or stack lifetimes bound to activation records, dynamic arrays allocate memory on the process heap via <code>&lt;stdlib.h&gt;</code>. Implementing a robust dynamic array requires mastering low-level heap allocator mechanics, defensive re-allocation patterns, geometric capacity scaling proofs, and memory leak prevention.
      </p>

      <h2>1. Memory Architecture: Stack vs Heap Allocation</h2>
      <p>
        Programs manage memory across distinct architectural segments with drastically different performance and lifetime characteristics:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Architectural Memory Segmentation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent mb-1">Stack (Automatic Storage)</div>
            <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted dark:text-night-ink-muted">
              <li>Allocation is virtually instantaneous (adjusts CPU stack pointer %rsp).</li>
              <li>Size is fixed at declaration; cannot be dynamically resized.</li>
              <li>Lifetime is strictly scoped to the enclosing function frame.</li>
              <li>Limited capacity (typically 1 MB to 8 MB); large buffers trigger stack overflow.</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent mb-1">Heap (Dynamic Storage)</div>
            <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted dark:text-night-ink-muted">
              <li>Managed via runtime system calls (brk, sbrk, mmap).</li>
              <li>Can be sized dynamically at runtime and expanded on demand.</li>
              <li>Lifetime persists until explicitly deallocated via <code>free()</code>.</li>
              <li>Spans gigabytes of physical RAM and virtual swap memory.</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>2. The Standard Allocator Family: malloc, calloc, realloc, and free</h2>
      <p>
        The ISO C runtime provides four foundational functions in <code>&lt;stdlib.h&gt;</code> to manage heap memory blocks.
      </p>

      <ComparisonTable {...allocatorComparison} />

      <h3>The Defensive realloc Idiom</h3>
      <p>
        A frequent source of critical memory bugs is assigning the result of <code>realloc()</code> directly back into the original pointer variable:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">The Memory-Leak Bug vs The Defensive Idiom</h4>
        <pre><code className="text-sm font-mono">{`// ANTI-PATTERN: Irreversible Memory Leak on Out-Of-Memory (OOM)
// If realloc fails, it returns NULL, overwriting ptr and leaking the old block!
ptr = realloc(ptr, new_capacity * sizeof(int));

// THE DEFENSIVE IDIOM:
// Always capture the return value in a temporary pointer first:
void *temp = realloc(ptr, new_capacity * sizeof(int));
if (temp == NULL) {
    // Allocation failed! The original block at 'ptr' remains completely valid and intact.
    fprintf(stderr, "Fatal: Out of memory during dynamic array expansion\\n");
    free(ptr); // Clean up original buffer before exiting or aborting
    exit(EXIT_FAILURE);
}
// Allocation succeeded: update ptr with the new (possibly relocated) base address
ptr = temp;`}</code></pre>
      </div>

      <h2>3. Amortized Analysis: The Geometric Doubling Proof</h2>
      <p>
        Why do dynamic arrays double their capacity (factor of 2.0) rather than incrementing by a fixed constant (e.g., adding 10 elements at a time)?
      </p>

      <ComparisonTable {...growthStrategyComparison} />

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        <h4 className="font-semibold uppercase tracking-wider text-accent mb-2">Mathematical Proof of Amortized O(1) Push Time</h4>
        <p className="text-xs text-ink-muted dark:text-night-ink-muted mb-2 font-sans">
          Consider inserting N elements into an initially empty array using capacity doubling (1, 2, 4, 8, ..., N):
        </p>
        <div className="p-3 bg-soft dark:bg-night-soft rounded-lg text-ink dark:text-night-ink">
          <div>Total insertions = N</div>
          <div>Total copy operations across all resizes:</div>
          <div className="mt-1">Copies = 1 + 2 + 4 + 8 + ... + (N / 4) + (N / 2)</div>
          <div className="mt-1">This is a geometric series summing to:</div>
          <div className="text-accent font-semibold mt-1">Total Copies = N - 1 &lt; N</div>
        </div>
        <p className="text-xs text-ink-muted dark:text-night-ink-muted mt-2 font-sans">
          By Aggregate Analysis, the amortized cost per push operation is:
        </p>
        <div className="p-2 bg-soft dark:bg-night-soft rounded text-ink dark:text-night-ink text-xs mt-1">
          Amortized Cost = (N insertions + (N - 1) copies) / N = (2N - 1) / N &lt; 2 operations per push = O(1)
        </div>
      </div>

      <h2>4. Complete Implementation: A Resizable Vector in C</h2>
      <p>
        Below is a complete, defensive C implementation of a resizable integer dynamic array featuring automatic geometric expansion, bounds-checked access, and clean lifecycle management.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">Production-Ready C Dynamic Array</h4>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    int *data;
    size_t size;
    size_t capacity;
} Vector;

Vector* vector_create(size_t initial_capacity) {
    Vector *vec = malloc(sizeof(Vector));
    if (!vec) return NULL;

    vec->size = 0;
    vec->capacity = (initial_capacity > 0) ? initial_capacity : 4;
    vec->data = malloc(vec->capacity * sizeof(int));
    if (!vec->data) {
        free(vec);
        return NULL;
    }
    return vec;
}

bool vector_push(Vector *vec, int value) {
    if (vec->size >= vec->capacity) {
        size_t new_cap = vec->capacity * 2;
        int *new_data = realloc(vec->data, new_cap * sizeof(int));
        if (!new_data) return false; // Allocation failed; old data intact

        vec->data = new_data;
        vec->capacity = new_cap;
    }
    vec->data[vec->size++] = value;
    return true;
}

bool vector_get(const Vector *vec, size_t index, int *out_value) {
    if (index >= vec->size) return false; // Bounds check guard
    *out_value = vec->data[index];
    return true;
}

void vector_destroy(Vector *vec) {
    if (vec) {
        free(vec->data);
        vec->data = NULL;
        free(vec);
    }
}`}</code></pre>
      </div>

      <h2>5. Dynamic Memory Anti-Patterns and Security Hazards</h2>
      <ul>
        <li><strong>Memory Leak:</strong> Allocating heap memory without calling <code>free()</code> before the last pointer goes out of scope. In long-running daemons or servers, memory leaks exhaust system RAM.</li>
        <li><strong>Dangling Pointer (Use-After-Free):</strong> Accessing memory through a pointer after <code>free(ptr)</code> has returned the chunk to the allocator. Mitigate by immediately setting <code>ptr = NULL</code>.</li>
        <li><strong>Double Free:</strong> Calling <code>free(ptr)</code> twice on the same memory block. This corrupts allocator chunk headers and free-lists, leading to severe security exploits.</li>
      </ul>

      <Callout type="tip">
        <strong>Heap Sanitization Tools:</strong> Compile and test code using GCC AddressSanitizer (<code>-fsanitize=address -g</code>) and Valgrind (<code>valgrind --leak-check=full ./program</code>) to automatically catch memory leaks, dangling pointers, and heap buffer overflows during development.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
