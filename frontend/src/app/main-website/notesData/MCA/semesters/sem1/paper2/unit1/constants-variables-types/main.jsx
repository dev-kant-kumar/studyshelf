import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const storageClassesTable = {
    caption: 'Comparative Analysis of the Four C Storage Classes',
    headers: ['Storage Class', 'Storage Location', 'Storage Duration (Lifetime)', 'Scope (Visibility)', 'Linkage', 'Default Initial Value'],
    rows: [
      [
        'auto',
        'Call Stack Segment',
        'Automatic (duration of enclosing block)',
        'Local to enclosing block',
        'None',
        'Uninitialized garbage memory'
      ],
      [
        'register',
        'CPU Registers (if available)',
        'Automatic (duration of enclosing block)',
        'Local to enclosing block',
        'None (Address &amp; is forbidden)',
        'Uninitialized garbage memory'
      ],
      [
        'static (Local)',
        'Data Segment (.data / .bss)',
        'Static (entire program execution)',
        'Local to enclosing function',
        'None',
        'Zero (0 / 0.0 / NULL)'
      ],
      [
        'static (Global)',
        'Data Segment (.data / .bss)',
        'Static (entire program execution)',
        'File Scope (entire source file)',
        'Internal Linkage (hidden from other files)',
        'Zero (0 / 0.0 / NULL)'
      ],
      [
        'extern',
        'Data Segment of another file',
        'Static (entire program execution)',
        'Global across multiple source files',
        'External Linkage',
        'Defined in external source'
      ]
    ]
  }

  const integerTypesTable = {
    caption: 'Standard Primitive Integer Data Types in Modern x86-64 C',
    headers: ['Data Type', 'Bit Width', 'Byte Size', 'Signed Range', 'Unsigned Range', 'Format Specifier'],
    rows: [
      [
        'char',
        '8 bits',
        '1 byte',
        '-128 to 127',
        '0 to 255',
        '%c / %d'
      ],
      [
        'short int',
        '16 bits',
        '2 bytes',
        '-32,768 to 32,767',
        '0 to 65,535',
        '%hd / %hu'
      ],
      [
        'int',
        '32 bits',
        '4 bytes',
        '-2,147,483,648 to 2,147,483,647',
        '0 to 4,294,967,295',
        '%d / %u'
      ],
      [
        'long int (Linux LP64)',
        '64 bits',
        '8 bytes',
        '-9.22 &times; 10<sup>18</sup> to 9.22 &times; 10<sup>18</sup>',
        '0 to 1.84 &times; 10<sup>19</sup>',
        '%ld / %lu'
      ],
      [
        'long long int',
        '64 bits',
        '8 bytes',
        '-9.22 &times; 10<sup>18</sup> to 9.22 &times; 10<sup>18</sup>',
        '0 to 1.84 &times; 10<sup>19</sup>',
        '%lld / %llu'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Variables, constants, and data types establish the foundation of data representation in C.
        Because C operates directly on physical memory words, understanding how values are stored,
        the mathematical mechanics of Two&rsquo;s Complement negative integer representation, IEEE 754 floating-point
        precision constraints, storage classes, and lvalue/rvalue semantics is mandatory for designing high-performance
        data structures.
      </p>

      <h2>1. Constants vs Variables &amp; Lvalues vs Rvalues</h2>
      <p>
        In C, every programmatic expression resolves into an entity governed by memory storage and mutability rules:
      </p>
      <ul>
        <li>
          <strong>Variable:</strong> A named, addressable physical memory location holding a value that can be read and modified
          during runtime execution. A variable possesses an identifier, a memory address (retrieved via <code>&amp;var</code>),
          and a type determining byte footprint and interpretation.
        </li>
        <li>
          <strong>Constant:</strong> An immutable data value that cannot be modified after definition. C supports literal constants
          (e.g., <code>100</code>, <code>3.14</code>, <code>&apos;X&apos;</code>), preprocessor macros (<code>#define PI 3.14159</code>),
          and <code>const</code>-qualified variables (<code>const int MAX = 100;</code>).
        </li>
        <li>
          <strong>Lvalue (Locator Value):</strong> An expression designating an object with an identifiable, persistent physical
          memory address (e.g., variable <code>x</code>, array element <code>arr[i]</code>, or pointer dereference <code>*ptr</code>).
          Only modifiable lvalues can appear on the left-hand side of an assignment operator.
        </li>
        <li>
          <strong>Rvalue (Read Value):</strong> A transient, non-addressable temporary value resulting from computation
          (e.g., literal <code>42</code>, or expression <code>x + y</code>). Rvalues can only appear on the right-hand side of assignments.
        </li>
      </ul>

      <h2>2. Primitive Data Types &amp; Two&rsquo;s Complement Representation</h2>
      <p>
        C provides primitive scalar types mapped directly to CPU hardware registers:
      </p>

      <ComparisonTable {...integerTypesTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Worked Mathematical Walkthrough: Two&rsquo;s Complement Negative Representation
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Objective:</div>
            <div>Derive the 8-bit signed binary representation of the negative integer <strong>-7</strong>:</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Step-by-Step Two&rsquo;s Complement Algorithm:</div>
            <div>
              <strong>Step 1: Write positive magnitude (+7) in 8-bit binary:</strong><br />
              +7 = <code>0 0 0 0 0 1 1 1</code>
            </div>
            <div>
              <strong>Step 2: Invert all bits (One&rsquo;s Complement - bitwise NOT):</strong><br />
              ~(+7) = <code>1 1 1 1 1 0 0 0</code>
            </div>
            <div>
              <strong>Step 3: Add 1 to the least significant bit (LSB):</strong><br />
              <code>1 1 1 1 1 0 0 0</code> + <code>1</code> = <strong><code>1 1 1 1 1 0 0 1</code></strong> (Hexadecimal: <code>0xF9</code>)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success font-sans">Verification via Place-Value Addition:</div>
            <div>(-128 &times; 1) + (64 &times; 1) + (32 &times; 1) + (16 &times; 1) + (8 &times; 1) + (4 &times; 0) + (2 &times; 0) + (1 &times; 1)</div>
            <div className="text-success dark:text-night-success font-bold text-sm pt-1">
              = -128 + 64 + 32 + 16 + 8 + 1 = -128 + 121 = <strong>-7</strong> (Confirmed!)
            </div>
          </div>
        </div>
      </div>

      <h2>3. IEEE 754 Floating-Point Precision Constraints</h2>
      <p>
        In C, <code>float</code> (32-bit single precision) and <code>double</code> (64-bit double precision) adhere to
        the <strong>IEEE 754 standard</strong>, encoding real numbers into three bitfields:
      </p>
      <ul>
        <li><strong>Sign Bit (S):</strong> 1 bit (0 for positive, 1 for negative).</li>
        <li><strong>Biased Exponent (E):</strong> 8 bits for float (Bias = 127), 11 bits for double (Bias = 1023).</li>
        <li><strong>Mantissa / Significand (M):</strong> 23 bits for float (~7 digits of precision), 52 bits for double (~15 to 17 digits).</li>
      </ul>

      <Callout type="warning" title="Why 0.1 Cannot Be Represented Exactly in C">
        In base 10, decimal <code>0.1</code> represents the exact fraction <code>1/10</code>.
        However, binary floating-point can only represent terminating fractions whose denominators are powers of 2.
        When converted to binary, <code>0.1</code> becomes an infinite repeating sequence:
        <code>0.00011001100110011...</code><br />
        Because registers have finite mantissa bits, the sequence is rounded.
        Consequently, in C, <code>(0.1 + 0.2 == 0.3)</code> evaluates to <strong>FALSE</strong> because <code>0.1 + 0.2</code> equals
        <code>0.3000000000000000444...</code>! Always compare floats using an epsilon: <code>fabs(a - b) &lt; 1e-9</code>.
      </Callout>

      <h2>4. The Four C Storage Classes</h2>
      <p>
        Storage classes dictate the storage duration (lifetime), lexical scope (visibility), and linkage of C variables:
      </p>

      <ComparisonTable {...storageClassesTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Static Local Variables: State Persistence Across Calls
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>void counter(void) &#123;</div>
          <div className="pl-4 text-brand dark:text-night-brand font-bold">static int count = 0; // Allocated in .data segment; initialized ONCE at program start</div>
          <div className="pl-4">count++;</div>
          <div className="pl-4">printf(&quot;Count = %d\n&quot;, count);</div>
          <div>&#125;</div>
          <div className="pt-2 text-ink/70 dark:text-night-ink/70">// Calling counter() three times outputs:</div>
          <div className="text-success dark:text-night-success font-bold">Call 1 &rarr; Count = 1 | Call 2 &rarr; Count = 2 | Call 3 &rarr; Count = 3</div>
        </div>
      </div>

      <h2>5. Fixed-Width Integer Types (&lt;stdint.h&gt;)</h2>
      <p>
        Because standard C integer types have implementation-defined widths (e.g., <code>long</code> is 4 bytes on Windows but 8 bytes on Linux),
        robust systems programming and data structure algorithms rely on the explicit fixed-width types introduced in C99:
      </p>
      <ul>
        <li><code>int8_t</code> / <code>uint8_t</code>: Guaranteed exactly 8 bits (1 byte).</li>
        <li><code>int16_t</code> / <code>uint16_t</code>: Guaranteed exactly 16 bits (2 bytes).</li>
        <li><code>int32_t</code> / <code>uint32_t</code>: Guaranteed exactly 32 bits (4 bytes).</li>
        <li><code>int64_t</code> / <code>uint64_t</code>: Guaranteed exactly 64 bits (8 bytes).</li>
        <li><code>size_t</code>: Unsigned integer type returned by <code>sizeof</code>, guaranteed capable of storing the byte size of any object in memory.</li>
      </ul>

      <FAQ items={questions} />
    </>
  )
}
