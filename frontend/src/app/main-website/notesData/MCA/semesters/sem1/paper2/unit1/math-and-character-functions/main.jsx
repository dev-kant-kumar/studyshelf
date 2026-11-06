import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const libraryComparison = {
    caption: 'Comparative Architecture of Standard Mathematical and Character Libraries',
    headers: ['Library Header', 'Domain Focus', 'Primary Data Types', 'Error Handling Mechanism', 'Linker Requirements'],
    rows: [
      [
        '&lt;math.h&gt;',
        'Floating-point transcendental, algebraic, and trigonometric operations.',
        'double, float, long double',
        'errno set to EDOM or ERANGE, returns HUGE_VAL or NaN.',
        'Explicit -lm flag required on POSIX / GCC toolchains.'
      ],
      [
        '&lt;stdlib.h&gt;',
        'Integer arithmetic, random number generation, pseudo-random sequences.',
        'int, long, long long, div_t, ldiv_t',
        'Undefined behavior on overflow (INT_MIN abs), no errno setting.',
        'Automatically bundled in default libc runtime.'
      ],
      [
        '&lt;ctype.h&gt;',
        'Character classification, category testing, and ASCII case conversion.',
        'int (accepts unsigned char values 0-255 or EOF)',
        'Returns non-zero (true) or zero (false); UB on negative signed char.',
        'Automatically bundled in default libc runtime.'
      ]
    ]
  }

  const ctypeClassificationTable = {
    caption: 'Standard &lt;ctype.h&gt; Classification Functions and Character Sets',
    headers: ['Function Prototype', 'Test Condition', 'Valid ASCII Ranges', 'Example Positive Matches'],
    rows: [
      [
        'int isalpha(int c);',
        'Alphabetic letter (uppercase or lowercase)',
        '65-90 (\'A\'-\'Z\'), 97-122 (\'a\'-\'z\')',
        '\'A\', \'m\', \'Z\''
      ],
      [
        'int isdigit(int c);',
        'Decimal digit',
        '48-57 (\'0\'-\'9\')',
        '\'0\', \'5\', \'9\''
      ],
      [
        'int isalnum(int c);',
        'Alphanumeric character (alphabetic or digit)',
        '48-57, 65-90, 97-122',
        '\'7\', \'K\', \'w\''
      ],
      [
        'int isspace(int c);',
        'Standard whitespace characters',
        '32 (space), 9 (\\t), 10 (\\n), 11 (\\v), 12 (\\f), 13 (\\r)',
        '\' \', \'\\t\', \'\\n\''
      ],
      [
        'int isupper(int c);',
        'Uppercase alphabetic character',
        '65-90 (\'A\'-\'Z\')',
        '\'B\', \'R\', \'X\''
      ],
      [
        'int islower(int c);',
        'Lowercase alphabetic character',
        '97-122 (\'a\'-\'z\')',
        '\'b\', \'r\', \'x\''
      ],
      [
        'int ispunct(int c);',
        'Punctuation and non-alphanumeric printing symbols',
        '33-47, 58-64, 91-96, 123-126',
        '\'!\', \'@\', \';\', \'{\''
      ],
      [
        'int iscntrl(int c);',
        'Control characters (non-printable)',
        '0-31 (NUL to US), 127 (DEL)',
        '\'\\0\', \'\\a\', \'\\b\', \'\\e\''
      ],
      [
        'int isxdigit(int c);',
        'Hexadecimal digit character',
        '48-57 (\'0\'-\'9\'), 65-70 (\'A\'-\'F\'), 97-102 (\'a\'-\'f\')',
        '\'3\', \'A\', \'f\''
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Standard mathematical and character libraries in C bridge the gap between low-level hardware representations and high-level algorithmic computation. While modern compilers provide extensive headers like <code>&lt;math.h&gt;</code> and <code>&lt;ctype.h&gt;</code>, using them safely requires understanding function domain constraints, floating-point IEEE 754 precision boundaries, linker behavior on POSIX systems, and the signed integer contracts governing character handling.
      </p>

      <h2>1. The Architecture of Mathematical Functions (&lt;math.h&gt;)</h2>
      <p>
        The C standard library isolates floating-point computation within the <code>&lt;math.h&gt;</code> header. Unlike primitive operators (such as addition or multiplication) which emit single assembly instructions, mathematical functions compute transcendental, exponential, logarithmic, and trigonometric equations via Taylor series approximations, polynomial evaluation schemes, and dedicated floating-point unit (FPU) microcode.
      </p>

      <h3>The -lm Linker Requirement on POSIX Toolchains</h3>
      <p>
        On UNIX and Linux systems using GCC or Clang, running <code>gcc program.c</code> without additional arguments frequently fails with unresolved symbol linker errors such as:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        <div className="text-red-600 dark:text-red-400 font-semibold mb-2">Linker Error Output:</div>
        <div className="text-ink dark:text-night-ink">/usr/bin/ld: /tmp/ccABC.o: in function 'main':</div>
        <div className="text-ink dark:text-night-ink">program.c:(.text+0x24): undefined reference to 'sqrt'</div>
        <div className="text-ink dark:text-night-ink">program.c:(.text+0x48): undefined reference to 'pow'</div>
        <div className="text-ink-muted dark:text-night-ink-muted mt-2">collect2: error: ld returned 1 exit status</div>
      </div>

      <p>
        This occurs because the standard C runtime is split into two shared objects:
      </p>
      <ul>
        <li><strong>libc.so:</strong> The foundational runtime containing general utilities, memory managers, formatted I/O, and string manipulation. It is linked automatically by the GCC compiler driver.</li>
        <li><strong>libm.so:</strong> The dedicated mathematical runtime containing floating-point algorithms. It is physically separated to prevent binary bloat and linking overhead for applications that perform no mathematical calculation.</li>
      </ul>
      <p>
        To instruct the linker to inspect <code>libm.so</code> during symbol resolution, the flag <code>-lm</code> must be supplied at the end of the invocation command:
      </p>
      <pre><code>gcc -Wall -Wextra -O2 program.c -lm -o program</code></pre>

      <Callout type="warning">
        <strong>Flag Ordering Matters:</strong> In modern GCC toolchains, the linker processes arguments strictly from left to right. Placing <code>-lm</code> before the source file (e.g., <code>gcc -lm program.c</code>) may still fail because the linker will discard the library symbols before discovering the unresolved references in <code>program.c</code>.
      </Callout>

      <h2>2. Core Mathematical Functions and Domain Contracts</h2>
      <p>
        Mathematical functions in ISO C operate on <code>double</code> precision numbers by default. ISO C99 introduced single-precision (with suffix <code>f</code>) and extended-precision (with suffix <code>l</code>) variants to maximize hardware efficiency.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm border-collapse border border-line dark:border-night-line">
          <thead className="bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
            <tr>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Function Family</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Prototypes (double / float / long double)</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Mathematical Definition</th>
              <th className="p-3 border border-line dark:border-night-line font-semibold">Domain &amp; Range Constraints</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-night-line text-ink dark:text-night-ink">
            <tr>
              <td className="p-3 font-mono font-semibold">sqrt</td>
              <td className="p-3 font-mono text-xs">sqrt(x), sqrtf(x), sqrtl(x)</td>
              <td className="p-3">Square root: &radic;x</td>
              <td className="p-3">Domain: x &gt;= 0.0. Negative x triggers EDOM.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">pow</td>
              <td className="p-3 font-mono text-xs">pow(x, y), powf(x, y), powl(x, y)</td>
              <td className="p-3">Power: x<sup>y</sup></td>
              <td className="p-3">If x &lt; 0 and y is non-integer: EDOM. If x == 0 and y &lt;= 0: EDOM or ERANGE.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">fabs</td>
              <td className="p-3 font-mono text-xs">fabs(x), fabsf(x), fabsl(x)</td>
              <td className="p-3">Absolute value: |x|</td>
              <td className="p-3">Domain: &minus;&infin; to +&infin;. Never triggers EDOM.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">ceil / floor</td>
              <td className="p-3 font-mono text-xs">ceil(x), floor(x)</td>
              <td className="p-3">Smallest integer &gt;= x / Largest integer &lt;= x</td>
              <td className="p-3">Returns floating-point representation of the whole integer value.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">round / trunc</td>
              <td className="p-3 font-mono text-xs">round(x), trunc(x)</td>
              <td className="p-3">Nearest integer (halfway away from zero) / Truncates fractional part toward zero</td>
              <td className="p-3">Added in C99. Preserves sign on zero (-0.0 vs +0.0).</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">log / log10</td>
              <td className="p-3 font-mono text-xs">log(x), log10(x)</td>
              <td className="p-3">Natural logarithm ln(x) / Base-10 logarithm log<sub>10</sub>(x)</td>
              <td className="p-3">Domain: x &gt; 0.0. If x == 0: pole error (ERANGE). If x &lt; 0: EDOM.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-semibold">sin / cos / tan</td>
              <td className="p-3 font-mono text-xs">sin(x), cos(x), tan(x)</td>
              <td className="p-3">Trigonometric ratios (x in radians, NOT degrees)</td>
              <td className="p-3">Arguments must be supplied in radians: rad = deg &times; (&pi; / 180).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Domain Errors (EDOM) vs Range Errors (ERANGE)</h3>
      <p>
        The runtime informs calling programs of mathematical faults via the global <code>errno</code> variable declared in <code>&lt;errno.h&gt;</code> and IEEE 754 floating-point status flags:
      </p>
      <ul>
        <li><strong>Domain Error (<code>EDOM</code>):</strong> Occurs when the input argument lies outside the mathematically valid function domain. For instance, evaluating <code>sqrt(-1.0)</code> or <code>log(-5.0)</code> sets <code>errno = EDOM</code> and returns <strong>NaN</strong> (Not-a-Number).</li>
        <li><strong>Range Error (<code>ERANGE</code>):</strong> Occurs when the mathematical result cannot be stored within the finite dynamic range of the target type.
          <ul>
            <li><em>Overflow:</em> The magnitude exceeds the largest representable finite number (e.g., <code>pow(10.0, 500.0)</code>). The function sets <code>errno = ERANGE</code> and returns <code>HUGE_VAL</code> (which represents positive or negative infinity).</li>
            <li><em>Underflow:</em> The result is non-zero but so close to zero that precision is lost. The function returns zero or a subnormal floating-point value.</li>
          </ul>
        </li>
      </ul>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Defensive Mathematical Error Handling in C11</h4>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>
#include <math.h>
#include <errno.h>

double safe_square_root(double val) {
    if (val < 0.0) {
        fprintf(stderr, "Domain error: negative input %f is undefined for real sqrt\\n", val);
        return NAN;
    }
    errno = 0; // Clear global error number prior to library invocation
    double result = sqrt(val);
    if (errno == EDOM) {
        perror("Math domain error detected");
        return NAN;
    }
    return result;
}`}</code></pre>
      </div>

      <h2>3. Character Classification and Conversion (&lt;ctype.h&gt;)</h2>
      <p>
        Text processing in C fundamentally involves inspecting and transforming individual byte values. The <code>&lt;ctype.h&gt;</code> standard library provides classification routines that evaluate characters based on standard ASCII categories.
      </p>

      <ComparisonTable {...ctypeClassificationTable} />

      <h3>The Signed Char Security Hazard and the int Contract</h3>
      <p>
        All functions in <code>&lt;ctype.h&gt;</code> share the exact same signature pattern:
      </p>
      <pre><code>int isalpha(int c);</code></pre>
      <p>
        A frequent question among systems programmers is: <em>Why does a character function take an <code>int</code> instead of a <code>char</code>?</em>
      </p>
      <p>
        The contract requires the function to be able to accept every valid value representable as an <code>unsigned char</code> (values 0 through 255) as well as the special negative integer macro <code>EOF</code> (typically defined as -1) returned by stream functions like <code>getchar()</code> and <code>fgetc()</code>.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">The Hidden Undefined Behavior Bug</h4>
        <p className="text-sm text-ink-muted dark:text-night-ink-muted mb-3">
          On x86 and ARM platforms where <code>char</code> defaults to signed (values -128 to +127), passing an accented character, extended ASCII byte, or binary file byte directly to <code>isalpha()</code> passes a negative integer that is NOT equal to -1 (EOF):
        </p>
        <pre><code className="text-sm font-mono">{`char ch = 0xE9; // Signed char holding -23 in two's complement

// UNDEFINED BEHAVIOR:
// Standard libraries implement ctype functions via internal lookup arrays:
// return (_ctype_table[c + 1] & _ISALPHA);
// Passing -23 evaluates to _ctype_table[-22], reading random out-of-bounds memory!
int result = isalpha(ch);

// THE SAFE DEFENSIVE IDIOM:
// Explicitly cast to unsigned char before passing to any <ctype.h> function:
int safe_result = isalpha((unsigned char)ch);`}</code></pre>
      </div>

      <h2>4. ASCII Architecture and Arithmetic Manipulations</h2>
      <p>
        Understanding the internal structure of the ASCII table enables systems programmers to perform high-performance text transformations without library function call overhead.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">ASCII Character Offsets and Bit Patterns</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent mb-1">Uppercase 'A' through 'Z'</div>
            <div>Dec: 65 to 90</div>
            <div>Hex: 0x41 to 0x5A</div>
            <div>Bin ('A'): 0100 0001</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-2">Bit 5 is CLEAR (0)</div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent mb-1">Lowercase 'a' through 'z'</div>
            <div>Dec: 97 to 122</div>
            <div>Hex: 0x61 to 0x7A</div>
            <div>Bin ('a'): 0110 0001</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-2">Bit 5 is SET (1)</div>
          </div>
        </div>
      </div>

      <h3>Direct Bitwise and Arithmetic Manipulation Idioms</h3>
      <ul>
        <li><strong>ASCII Offset Difference:</strong> The numerical difference between any lowercase character and its uppercase equivalent is strictly 32:
          <pre><code>'a' - 'A' = 97 - 65 = 32 (which is exactly 2<sup>5</sup>)</code></pre>
        </li>
        <li><strong>Fast Lowercase Conversion:</strong> Setting bit 5 transforms any uppercase letter into lowercase without branching:
          <pre><code>char to_lower_fast(char c) &#123; return (c &gt;= 'A' &amp;&amp; c &lt;= 'Z') ? (c | 32) : c; &#125;</code></pre>
        </li>
        <li><strong>Fast Uppercase Conversion:</strong> Clearing bit 5 transforms any lowercase letter into uppercase:
          <pre><code>char to_upper_fast(char c) &#123; return (c &gt;= 'a' &amp;&amp; c &lt;= 'z') ? (c &amp; ~32) : c; &#125;</code></pre>
        </li>
        <li><strong>Digit to Integer Parsing:</strong> The characters <code>'0'</code> through <code>'9'</code> occupy consecutive decimal codes 48 through 57. Subtracting the ASCII character literal <code>'0'</code> converts a character directly into its corresponding numerical integer value:
          <pre><code>char c = '7';
int val = c - '0'; // 55 - 48 = 7</code></pre>
        </li>
      </ul>

      <h2>5. Comparative Library Summary</h2>
      <p>
        The table below summarizes the operational trade-offs and runtime characteristics across the standard C math and character facilities.
      </p>

      <ComparisonTable {...libraryComparison} />

      <FAQ items={questions} />
    </>
  )
}
