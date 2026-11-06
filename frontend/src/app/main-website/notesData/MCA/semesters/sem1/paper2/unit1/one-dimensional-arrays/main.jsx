import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const operationsComparison = {
    caption: 'Algorithmic Complexity of Fundamental 1D Array Operations',
    headers: ['Operation', 'Best Case Time', 'Worst Case Time', 'Space Overhead', 'Mechanism & Constraints'],
    rows: [
      [
        'Direct Index Access A[i]',
        'O(1)',
        'O(1)',
        'O(1)',
        'Computed via direct address offset: Base + (i &times; S).'
      ],
      [
        'Sequential Traversal',
        'O(n)',
        'O(n)',
        'O(1)',
        'Iterates through all n contiguous memory elements in linear sequence.'
      ],
      [
        'Insertion at Position k',
        'O(1) (at end)',
        'O(n) (at index 0)',
        'O(1)',
        'Requires shifting (n - k) elements to the right to create an empty slot.'
      ],
      [
        'Deletion at Position k',
        'O(1) (at end)',
        'O(n) (at index 0)',
        'O(1)',
        'Requires shifting (n - k - 1) elements to the left to close the gap.'
      ],
      [
        'Linear Search (Unsorted)',
        'O(1) (target at A[0])',
        'O(n) (target absent)',
        'O(1)',
        'Compares elements sequentially until match is found.'
      ],
      [
        'Binary Search (Sorted)',
        'O(1) (target at midpoint)',
        'O(log n)',
        'O(1)',
        'Requires sorted array; repeatedly bisects interval.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        A one-dimensional array is a homogeneous, fixed-size, contiguous sequence of elements allocated in physical memory. In C, arrays serve as the foundational data structure upon which complex abstractions (such as strings, matrices, heaps, hash tables, and buffers) are constructed. Understanding array storage layout, pointer arithmetic equivalence, function decay, and linear data movement algorithms is essential for writing efficient systems code.
      </p>

      <h2>1. Physical Memory Layout and Address Formulation</h2>
      <p>
        When an array is declared, the compiler reserves a contiguous block of virtual memory sufficient to hold the specified number of elements. All elements share identical types and byte sizes.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Mathematical Address Calculation Formula</h4>
        <div className="p-3 bg-soft dark:bg-night-soft rounded-lg font-mono text-sm text-ink dark:text-night-ink mb-3">
          Address(A[i]) = B + (i &times; S)
        </div>
        <ul className="text-sm text-ink-muted dark:text-night-ink-muted space-y-1">
          <li><strong>B:</strong> Base memory address of the array, corresponding to the address of the initial element <code>&amp;A[0]</code>.</li>
          <li><strong>i:</strong> Zero-based subscript index of the target element (<code>0 &lt;= i &lt; n</code>).</li>
          <li><strong>S:</strong> Memory scale factor, defined as the byte size of the element data type (<code>sizeof(T)</code>).</li>
        </ul>
      </div>

      <h3>Worked Memory Mapping Example</h3>
      <p>
        Consider the declaration <code>int arr[5];</code> on a standard 64-bit architecture where <code>sizeof(int) == 4</code> bytes. Assume the operating system allocates the array at base address <code>0x2000</code>:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-left text-sm border-collapse border border-line dark:border-night-line">
          <thead className="bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
            <tr>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Element</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Index (i)</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Address Formula: 0x2000 + (i &times; 4)</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Memory Span</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-night-line text-ink dark:text-night-ink font-mono text-xs">
            <tr>
              <td className="p-3 font-semibold">arr[0]</td>
              <td className="p-3">0</td>
              <td className="p-3">0x2000 + 0 = 0x2000</td>
              <td className="p-3">0x2000 - 0x2003 (4 bytes)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">arr[1]</td>
              <td className="p-3">1</td>
              <td className="p-3">0x2000 + 4 = 0x2004</td>
              <td className="p-3">0x2004 - 0x2007 (4 bytes)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">arr[2]</td>
              <td className="p-3">2</td>
              <td className="p-3">0x2000 + 8 = 0x2008</td>
              <td className="p-3">0x2008 - 0x200B (4 bytes)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">arr[3]</td>
              <td className="p-3">3</td>
              <td className="p-3">0x2000 + 12 = 0x200C</td>
              <td className="p-3">0x200C - 0x200F (4 bytes)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">arr[4]</td>
              <td className="p-3">4</td>
              <td className="p-3">0x2000 + 16 = 0x2010</td>
              <td className="p-3">0x2010 - 0x2013 (4 bytes)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>2. Array Declarations and Initialization Idioms</h2>
      <p>
        In C, arrays can be declared with static, automatic, or thread-local storage duration. Uninitialized automatic arrays contain arbitrary garbage bytes from prior stack frames.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Common Initialization Patterns</h4>
        <pre><code className="text-sm font-mono">{`// 1. Partial initialization: remaining elements automatically zero-filled
int a[5] = {10, 20}; // a[0]=10, a[1]=20, a[2]=0, a[3]=0, a[4]=0

// 2. Canonical zero-initialization idiom for all elements
int zeros[100] = {0}; // All 100 integers guaranteed to be 0

// 3. Implicit size deduction by compiler from initializer list
int primes[] = {2, 3, 5, 7, 11}; // Compiler sets length to 5

// 4. Designated initializers (ISO C99 standard)
int sparse[10] = {[0] = 1, [5] = 99, [9] = 7}; // Explicit index targeting`}</code></pre>
      </div>

      <h2>3. Array Subscripting and Pointer Equivalence</h2>
      <p>
        In the ISO C standard, the subscript operator <code>[]</code> is strictly defined as an alias for pointer arithmetic:
      </p>
      <pre><code>A[i]  &equiv;  *(A + i)</code></pre>
      <p>
        Because binary addition is commutative (<code>A + i == i + A</code>), the expression can be rewritten as:
      </p>
      <pre><code>*(A + i)  &equiv;  *(i + A)  &equiv;  i[A]</code></pre>
      <p>
        This explains why writing <code>3[arr]</code> is completely valid C syntax and evaluates identically to <code>arr[3]</code>. The compiler adds <code>3 &times; sizeof(element)</code> to the base address and dereferences the resulting pointer.
      </p>

      <h2>4. Array Decay and Function Parameter Passing</h2>
      <p>
        Whenever an array appears as a function parameter, it automatically <strong>decays</strong> into a pointer to its first element:
      </p>
      <pre><code className="language-c">{`// These three function prototypes are completely identical to the compiler:
void process(int arr[10]);
void process(int arr[]);
void process(int *arr);`}</code></pre>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">The sizeof Array Decay Trap</h4>
        <pre><code className="text-sm font-mono">{`void print_size(int arr[100]) {
    // BUG: sizeof(arr) evaluates to sizeof(int*) = 8 bytes on a 64-bit OS!
    // It does NOT evaluate to 100 * 4 = 400 bytes!
    printf("Parameter size: %zu bytes\\n", sizeof(arr));
}

int main(void) {
    int my_array[100];
    // Here, sizeof(my_array) evaluates to 400 bytes because array has not decayed:
    printf("Local array size: %zu bytes\\n", sizeof(my_array));
    print_size(my_array);
    return 0;
}`}</code></pre>
      </div>

      <Callout type="tip">
        <strong>The Golden Array Passing Rule:</strong> Because array decay discards element count metadata, always pass the array capacity or length as an explicit companion argument: <code>void process(int *arr, size_t length)</code>.
      </Callout>

      <h2>5. Core Algorithms on One-Dimensional Arrays</h2>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">Defensive Insertion and Deletion Implementation</h4>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>
#include <stdbool.h>

// Insert element at index k, shifting subsequent elements rightward (O(n))
bool array_insert(int arr[], size_t *size, size_t capacity, size_t k, int val) {
    if (*size >= capacity || k > *size) {
        return false; // Array full or index out of range
    }
    // Shift elements to the right starting from the tail
    for (size_t i = *size; i > k; i--) {
        arr[i] = arr[i - 1];
    }
    arr[k] = val;
    (*size)++;
    return true;
}

// Delete element at index k, shifting subsequent elements leftward (O(n))
bool array_delete(int arr[], size_t *size, size_t k) {
    if (k >= *size || *size == 0) {
        return false; // Index out of range or empty array
    }
    // Shift elements to the left
    for (size_t i = k; i < *size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    (*size)--;
    return true;
}`}</code></pre>
      </div>

      <h2>6. Operational Complexity Summary</h2>
      <p>
        The table below analyzes the worst-case and best-case performance characteristics of basic one-dimensional array routines.
      </p>

      <ComparisonTable {...operationsComparison} />

      <FAQ items={questions} />
    </>
  )
}
