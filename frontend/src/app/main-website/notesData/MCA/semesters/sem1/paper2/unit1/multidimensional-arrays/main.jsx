import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const layoutComparison = {
    caption: 'Architectural Comparison: Contiguous N-D Array vs Ragged Pointer Tree',
    headers: ['Design Criterion', 'Contiguous N-D Array (e.g., int arr[X][Y][Z])', 'Pointer-of-Pointers Tree (e.g., int ***arr)'],
    rows: [
      [
        'Memory Layout',
        'Single contiguous buffer of (X &times; Y &times; Z &times; S) bytes.',
        'Dispersed heap blocks: top-level pointer array pointing to pointer arrays, pointing to data buffers.'
      ],
      [
        'Pointer Storage Overhead',
        '0 bytes (zero auxiliary pointer storage).',
        '(X &times; sizeof(ptr)) + (X &times; Y &times; sizeof(ptr)) auxiliary bytes.'
      ],
      [
        'Access Latency',
        'O(1) direct address arithmetic; 0 pointer dereference hops.',
        'O(1) theoretical, but requires N sequential pointer dereferences (cache misses).'
      ],
      [
        'Cache Performance',
        'Optimal spatial locality; hardware stream prefetcher friendly.',
        'Poor cache locality; scattered heap pointers induce cache line thrashing.'
      ],
      [
        'Flexibility',
        'Rigid uniform rectangular/cubical grid; all slices share identical dimensions.',
        'Ragged/Jagged arrays supported; each sub-row can have a distinct independent length.'
      ],
      [
        'Allocation / Deallocation',
        'Single malloc() and single free() call.',
        'Nested loops requiring X &times; Y + X + 1 individual malloc() and free() calls.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Multidimensional arrays extend the concept of contiguous linear storage to three or more dimensions. In systems programming, multidimensional arrays model spatial coordinate systems, 3D medical voxel volumes, physics simulation grids, and machine learning tensors. Understanding higher-order memory serialization, generalized address calculation via Horner's rule, and the architectural differences between contiguous arrays and ragged pointer graphs is vital for writing performant systems software.
      </p>

      <h2>1. Three-Dimensional (3D) Array Architecture</h2>
      <p>
        In C, a three-dimensional array declared as <code>T arr[D1][D2][D3]</code> is conceptually organized as a collection of <strong>D1 2D matrices</strong> (often called slices, pages, or blocks), each containing <strong>D2 rows</strong> and <strong>D3 columns</strong>.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">3D Row-Major Address Calculation Formula</h4>
        <div className="p-3 bg-soft dark:bg-night-soft rounded-lg font-mono text-sm text-ink dark:text-night-ink mb-3">
          Address(A[i][j][k]) = B + (((i &times; D2) + j) &times; D3 + k) &times; S
        </div>
        <ul className="text-sm text-ink-muted dark:text-night-ink-muted space-y-1">
          <li><strong>B:</strong> Base memory address of the array (<code>&amp;A[0][0][0]</code>).</li>
          <li><strong>i:</strong> Block / Page / Slice index (<code>0 &lt;= i &lt; D1</code>). Advancing <code>i</code> by 1 skips an entire 2D matrix of <code>D2 &times; D3</code> elements.</li>
          <li><strong>j:</strong> Row index within the current slice (<code>0 &lt;= j &lt; D2</code>). Advancing <code>j</code> by 1 skips a row of <code>D3</code> elements.</li>
          <li><strong>k:</strong> Column index within the current row (<code>0 &lt;= k &lt; D3</code>).</li>
          <li><strong>S:</strong> Byte size of each element (<code>sizeof(T)</code>).</li>
        </ul>
      </div>

      <h3>Worked Calculation: 3D Memory Mapping</h3>
      <p>
        Suppose an array is declared as <code>int volume[3][4][5];</code> where <code>sizeof(int) == 4</code> bytes and base address <code>B = 2000</code>. Let us calculate the physical memory address of <code>volume[2][1][3]</code>:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        <div className="text-ink dark:text-night-ink">D1 = 3, D2 = 4, D3 = 5, S = 4 bytes, Base = 2000</div>
        <div className="text-ink dark:text-night-ink mt-2">Target indices: i = 2, j = 1, k = 3</div>
        <div className="text-ink-muted dark:text-night-ink-muted mt-2">1. Number of rows in full preceding slices = i &times; D2 = 2 &times; 4 = 8 rows</div>
        <div className="text-ink-muted dark:text-night-ink-muted">2. Add row index within target slice = 8 + j = 8 + 1 = 9 rows</div>
        <div className="text-ink-muted dark:text-night-ink-muted">3. Multiply by column width and add column index = (9 &times; 5) + 3 = 45 + 3 = 48 elements</div>
        <div className="text-accent font-semibold mt-2">Address = 2000 + (48 &times; 4) = 2000 + 192 = 2192 (0x890)</div>
      </div>

      <h2>2. Generalized N-Dimensional Address Calculation via Horner's Rule</h2>
      <p>
        For an arbitrary N-dimensional array declared with dimensions D<sub>1</sub>, D<sub>2</sub>, ..., D<sub>n</sub> and target indices i<sub>1</sub>, i<sub>2</sub>, ..., i<sub>n</sub>, computing each product factor from scratch would require O(n<sup>2</sup>) arithmetic operations. Modern optimizing compilers serialize N-dimensional coordinates into a linear offset using <strong>Horner's rule</strong> in O(n) operations:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        <div className="text-ink dark:text-night-ink font-semibold mb-2">Horner's Rule Nested Offset Formulation:</div>
        <div className="p-3 bg-soft dark:bg-night-soft rounded-lg text-ink dark:text-night-ink">
          Offset = (...((i<sub>1</sub> &times; D<sub>2</sub> + i<sub>2</sub>) &times; D<sub>3</sub> + i<sub>3</sub>)...) &times; D<sub>n</sub> + i<sub>n</sub>
        </div>
        <div className="text-accent font-semibold mt-3">
          Address = Base + (Offset &times; sizeof(Element))
        </div>
      </div>

      <h2>3. Contiguous Arrays vs Ragged Pointer Graphs</h2>
      <p>
        In C, developers frequently confuse true multidimensional arrays (which are single contiguous allocations) with arrays of pointers (which form hierarchical pointer trees).
      </p>

      <ComparisonTable {...layoutComparison} />

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">Simulating Dynamic Contiguous Multidimensional Arrays</h4>
        <p className="text-sm text-ink-muted dark:text-night-ink-muted mb-3">
          To achieve both dynamic heap allocation and contiguous cache locality for a 3D grid, allocate a single flat buffer and index it manually or using an inline stride macro:
        </p>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>
#include <stdlib.h>

// Macro to compute linear 3D offset:
#define INDEX_3D(i, j, k, D2, D3) (((i) * (D2) + (j)) * (D3) + (k))

int main(void) {
    size_t D1 = 10, D2 = 20, D3 = 30;
    
    // Allocate single contiguous heap buffer:
    int *grid = malloc(D1 * D2 * D3 * sizeof(int));
    if (!grid) return 1;

    // Cache-friendly sequential traversal:
    for (size_t i = 0; i < D1; i++) {
        for (size_t j = 0; j < D2; j++) {
            for (size_t k = 0; k < D3; k++) {
                grid[INDEX_3D(i, j, k, D2, D3)] = (int)(i + j + k);
            }
        }
    }

    free(grid);
    return 0;
}`}</code></pre>
      </div>

      <h2>4. Passing Multidimensional Arrays to Functions</h2>
      <p>
        In C, when an $N$-dimensional array is passed to a function, only the outermost (first) dimension can be left unsized. All inner dimensions (from 2 to $N$) must be fixed compile-time constants:
      </p>

      <pre><code className="language-c">{`// VALID: Compiler knows D2 = 4 and D3 = 5 to calculate strides
void process_cube(int arr[][4][5], size_t d1);

// INVALID SYNTAX: Compiler cannot calculate row or slice strides
// void process_cube(int arr[][][], size_t d1, size_t d2, size_t d3);`}</code></pre>

      <Callout type="tip">
        <strong>The C99 Variable Length Array (VLA) Function Parameter Solution:</strong> In ISO C99, if dimension variables appear earlier in the parameter list, they can be used to dimension subsequent array parameters dynamically:
        <pre className="mt-2 font-mono text-xs"><code>void process_vla(size_t d1, size_t d2, size_t d3, int arr[d1][d2][d3]);</code></pre>
        Inside the function, the compiler automatically generates runtime multiplications for <code>arr[i][j][k]</code> using <code>d2</code> and <code>d3</code>.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
