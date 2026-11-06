import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const layoutComparison = {
    caption: 'Comparative Architecture: Row-Major Order (C) vs Column-Major Order (Fortran/MATLAB)',
    headers: ['Criterion', 'Row-Major Order (RMO)', 'Column-Major Order (CMO)'],
    rows: [
      [
        'Languages Adopting Standard',
        'C, C++, Python (NumPy default), Java, Pascal',
        'Fortran, MATLAB, R, Julia'
      ],
      [
        'Contiguous Linear Sequence',
        'Row elements stored consecutively: Row 0, then Row 1, Row 2...',
        'Column elements stored consecutively: Col 0, then Col 1, Col 2...'
      ],
      [
        'Zero-Based Address Formula',
        'Address(A[i][j]) = B + ((i &times; C) + j) &times; S',
        'Address(A[i][j]) = B + ((j &times; R) + i) &times; S'
      ],
      [
        'Optimal Loop Nesting Order',
        'Outer loop over rows i; inner loop over columns j (i then j)',
        'Outer loop over columns j; inner loop over rows i (j then i)'
      ],
      [
        'Cache Line Utilization',
        'Optimal spatial locality when iterating across adjacent columns',
        'Optimal spatial locality when iterating down adjacent rows'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        A two-dimensional array represents a grid of homogeneous elements organized logically into rows and columns. Because physical computer RAM is a linear one-dimensional sequence of byte addresses, multidimensional arrays must be serialized into a flat memory layout. In C, this serialization follows strict Row-Major Order. Understanding row-stride address calculations, pointer decompositions, and hardware cache spatial locality is crucial for developing high-performance numerical and matrix algorithms.
      </p>

      <h2>1. Physical Memory Layout: Row-Major Order (RMO)</h2>
      <p>
        In C, multidimensional arrays are formally defined as "arrays of arrays". A two-dimensional array declared as <code>T matrix[R][C]</code> is an array containing <code>R</code> elements, where each element is an independent array containing <code>C</code> elements of type <code>T</code>.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Row-Major Order Address Calculation Formula</h4>
        <div className="p-3 bg-soft dark:bg-night-soft rounded-lg font-mono text-sm text-ink dark:text-night-ink mb-3">
          Address(A[i][j]) = B + ((i &times; C) + j) &times; S
        </div>
        <ul className="text-sm text-ink-muted dark:text-night-ink-muted space-y-1">
          <li><strong>B:</strong> Base address of the matrix in memory, corresponding to <code>&amp;A[0][0]</code>.</li>
          <li><strong>i:</strong> Zero-based row index (<code>0 &lt;= i &lt; R</code>).</li>
          <li><strong>j:</strong> Zero-based column index (<code>0 &lt;= j &lt; C</code>).</li>
          <li><strong>C:</strong> Total number of columns per row (the row width).</li>
          <li><strong>S:</strong> Byte size of each element (<code>sizeof(T)</code>).</li>
        </ul>
      </div>

      <h3>General Formula for 1-Based Indexing</h3>
      <p>
        In university examinations where arrays are specified using 1-based indexing (with rows spanning <code>1 ... R</code> and columns spanning <code>1 ... C</code>), the indices must be offset by 1:
      </p>
      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        Address(A[i][j]) = B + (((i - 1) &times; C) + (j - 1)) &times; S
      </div>

      <h3>Worked Example: Memory Serialization Trace</h3>
      <p>
        Consider a matrix <code>int mat[2][3]</code> declared on a 64-bit platform where <code>sizeof(int) == 4</code> and base address <code>B = 1000</code>:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-left text-sm border-collapse border border-line dark:border-night-line">
          <thead className="bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
            <tr>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Row Index (i)</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Col Index (j)</th>
              <th className="p-3 border border-line dark:border-line font-semibold">Element</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Calculation: 1000 + ((i &times; 3) + j) &times; 4</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Byte Address Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-night-line text-ink dark:text-night-ink font-mono text-xs">
            <tr>
              <td className="p-3">Row 0</td>
              <td className="p-3">0</td>
              <td className="p-3 font-semibold">mat[0][0]</td>
              <td className="p-3">1000 + (0 + 0) &times; 4</td>
              <td className="p-3">1000 - 1003</td>
            </tr>
            <tr>
              <td className="p-3">Row 0</td>
              <td className="p-3">1</td>
              <td className="p-3 font-semibold">mat[0][1]</td>
              <td className="p-3">1000 + (0 + 1) &times; 4</td>
              <td className="p-3">1004 - 1007</td>
            </tr>
            <tr>
              <td className="p-3">Row 0</td>
              <td className="p-3">2</td>
              <td className="p-3 font-semibold">mat[0][2]</td>
              <td className="p-3">1000 + (0 + 2) &times; 4</td>
              <td className="p-3">1008 - 1011</td>
            </tr>
            <tr>
              <td className="p-3">Row 1</td>
              <td className="p-3">0</td>
              <td className="p-3 font-semibold">mat[1][0]</td>
              <td className="p-3">1000 + (3 + 0) &times; 4</td>
              <td className="p-3">1012 - 1015</td>
            </tr>
            <tr>
              <td className="p-3">Row 1</td>
              <td className="p-3">1</td>
              <td className="p-3 font-semibold">mat[1][1]</td>
              <td className="p-3">1000 + (3 + 1) &times; 4</td>
              <td className="p-3">1016 - 1019</td>
            </tr>
            <tr>
              <td className="p-3">Row 1</td>
              <td className="p-3">2</td>
              <td className="p-3 font-semibold">mat[1][2]</td>
              <td className="p-3">1000 + (3 + 2) &times; 4</td>
              <td className="p-3">1020 - 1023</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>2. Array Declarations and Initialization</h2>
      <p>
        In ISO C, 2D arrays can be initialized using nested inner braces or a flat sequence of values. If an initialization list has fewer elements than total capacity, all remaining slots are initialized to zero.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Canonical Initialization Forms</h4>
        <pre><code className="text-sm font-mono">{`// 1. Explicit row grouping (preferred for clarity)
int matrix[2][3] = {
    {10, 20, 30},
    {40, 50, 60}
};

// 2. Flat sequential initialization (compiler fills rows sequentially)
int flat[2][3] = {10, 20, 30, 40, 50, 60};

// 3. Omitting the row dimension: ALLOWED (deduced as 2 rows)
int deduced[][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

// 4. Omitting the column dimension: SYNTAX ERROR!
// int invalid[][] = {{1, 2}, {3, 4}}; // Compiler cannot calculate row stride!`}</code></pre>
      </div>

      <Callout type="warning">
        <strong>Why the Column Size is Mandatory:</strong> The compiler must know the row stride (<code>C &times; sizeof(element)</code>) to calculate memory offsets. Without the column count <code>C</code>, the compiler cannot evaluate <code>matrix[i][j]</code>.
      </Callout>

      <h2>3. Pointer Equivalence for Two-Dimensional Arrays</h2>
      <p>
        When evaluating the expression <code>matrix[i][j]</code>, the compiler performs two sequential pointer additions and dereferences:
      </p>
      <pre><code>matrix[i][j]  &equiv;  *(*(matrix + i) + j)</code></pre>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-ink dark:text-night-ink my-3">
        <li><strong>Step 1: Row Pointer Offset:</strong> <code>matrix</code> has type "pointer to an array of C elements" (<code>int (*)[C]</code>). Evaluating <code>(matrix + i)</code> increments the pointer by <code>i &times; C &times; sizeof(int)</code> bytes.</li>
        <li><strong>Step 2: Row Dereference:</strong> <code>*(matrix + i)</code> yields a pointer to the first element of row <code>i</code> (<code>int*</code>).</li>
        <li><strong>Step 3: Column Offset:</strong> Adding <code>j</code> advances the pointer by <code>j &times; sizeof(int)</code> bytes to point directly to column <code>j</code>.</li>
        <li><strong>Step 4: Value Dereference:</strong> The outer <code>*</code> dereferences the final address, reading the stored value.</li>
      </ol>

      <h2>4. Hardware Cache Locality: The Stride Penalty</h2>
      <p>
        Modern CPUs load data into cache in 64-byte blocks known as <strong>cache lines</strong>. Because C arrays reside in Row-Major Order, traversing an array along its rows accesses consecutive bytes sequentially, achieving near-perfect cache hits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-accent mb-2">Cache-Friendly (Row Traversal)</h4>
          <p className="text-xs text-ink-muted dark:text-night-ink-muted mb-2">
            Consecutive iterations access contiguous memory words inside the same loaded 64-byte cache line.
          </p>
          <pre><code className="text-xs font-mono">{`// FAST: Spatial locality preserved
for (int i = 0; i < ROWS; i++) {
    for (int j = 0; j < COLS; j++) {
        sum += mat[i][j];
    }
}`}</code></pre>
        </div>

        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Cache-Thrashing (Column Traversal)</h4>
          <p className="text-xs text-ink-muted dark:text-night-ink-muted mb-2">
            Each inner iteration jumps by COLS * 4 bytes, missing the cache and evicting previous lines.
          </p>
          <pre><code className="text-xs font-mono">{`// SLOW: Severe cache misses on large matrices
for (int j = 0; j < COLS; j++) {
    for (int i = 0; i < ROWS; i++) {
        sum += mat[i][j];
    }
}`}</code></pre>
        </div>
      </div>

      <h2>5. Core Matrix Algorithms in C</h2>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">Standard Matrix Multiplication Implementation</h4>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>

#define N 3

// Multiplies matrix A (N x N) and matrix B (N x N), storing result in C (O(N * N * N))
void matrix_multiply(const int A[N][N], const int B[N][N], int C[N][N]) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            C[i][j] = 0;
            for (int k = 0; k < N; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}`}</code></pre>
      </div>

      <h2>6. Architecture Comparison</h2>
      <p>
        The table below highlights the architectural differences between Row-Major and Column-Major memory representations across computing systems.
      </p>

      <ComparisonTable {...layoutComparison} />

      <FAQ items={questions} />
    </>
  )
}
