import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const streamBufferingTable = {
    caption: 'Standard I/O Streams and Default Buffering Behaviors',
    headers: ['Stream Pointer', 'File Descriptor', 'Underlying Device', 'Default Buffering Mode', 'Flushing Trigger'],
    rows: [
      [
        'stdin',
        '0 (STDIN_FILENO)',
        'Keyboard / Terminal input or redirected pipe.',
        'Line Buffered (_IOLBF)',
        'When Enter (\\n) is pressed or internal buffer fills.'
      ],
      [
        'stdout',
        '1 (STDOUT_FILENO)',
        'Terminal display screen or redirected file.',
        'Line Buffered (terminal) / Fully Buffered (file)',
        'On newline \\n (terminal) or when 4 KB/8 KB buffer saturates.'
      ],
      [
        'stderr',
        '2 (STDERR_FILENO)',
        'Terminal error console; isolated from stdout.',
        'Unbuffered (_IONBF)',
        'Immediate write() system call for every individual byte written.'
      ]
    ]
  }

  const formatSpecifiersTable = {
    caption: 'Standard printf() and scanf() Conversion Specifiers',
    headers: ['Format Specifier', 'C Data Type', 'printf() Expected Value', 'scanf() Expected Argument Pointer'],
    rows: [
      [
        '%d or %i',
        'signed int',
        'Integer value (e.g., 42)',
        'int* (&amp;variable)'
      ],
      [
        '%u',
        'unsigned int',
        'Unsigned integer value',
        'unsigned int* (&amp;variable)'
      ],
      [
        '%f',
        'float / double',
        'Floating-point decimal (double in printf)',
        'float* (&amp;variable)'
      ],
      [
        '%lf',
        'double',
        'Double-precision float',
        'double* (&amp;variable) (Mandatory in scanf!)'
      ],
      [
        '%c',
        'char',
        'Single character byte',
        'char* (&amp;variable)'
      ],
      [
        '%s',
        'char[] (String)',
        'Null-terminated character array',
        'char* (Buffer base address; buffer size limit recommended)'
      ],
      [
        '%p',
        'void*',
        'Hexadecimal physical memory address',
        'void**'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Writing robust C programs requires a disciplined problem-solving methodology, deep familiarity with standard
        input/output streams, validation of input boundaries, and rigorous compiler-assisted static analysis.
        This comprehensive study covers the problem-solving lifecycle, algorithm formulation and flowchart design,
        the internal mechanics of formatted I/O (<code>printf</code> and <code>scanf</code>), stream buffering paradigms,
        defensive programming techniques against uninitialized memory, and modern GCC toolchain hardening flags.
      </p>

      <h2>1. The Problem-Solving Lifecycle</h2>
      <p>
        Translating a real-world requirement into reliable, production-grade C code follows a disciplined seven-stage engineering pipeline:
      </p>
      <ol>
        <li>
          <strong>Problem Formulation:</strong> Explicitly delineate inputs, expected outputs, mathematical domain constraints,
          and abnormal boundary conditions (such as handling division by zero, empty arrays, or negative values).
        </li>
        <li>
          <strong>Algorithm Specification:</strong> Draft a finite, step-by-step, deterministic sequence of instructions that transforms
          valid input states into the desired output state.
        </li>
        <li>
          <strong>Visual Flowcharting:</strong> Map the control flow graphically using standardized ANSI flowchart elements:
          ovals for terminal points, parallelograms for I/O operations, rectangles for arithmetic processing, and rhombuses for decision points.
        </li>
        <li>
          <strong>C Source Implementation:</strong> Author modular, structured C code adhering to the ISO C11/C17 baseline.
        </li>
        <li>
          <strong>Compile-Time Static Verification:</strong> Compile using strict diagnostic flags (<code>-Wall -Wextra -Werror -pedantic</code>)
          to intercept subtle logical flaws prior to execution.
        </li>
        <li>
          <strong>Dynamic Testing &amp; Boundary Analysis:</strong> Validate nominal cases, extreme limits, and invalid inputs.
        </li>
        <li>
          <strong>Profiling &amp; Memory Verification:</strong> Execute under memory sanitizers (AddressSanitizer / Valgrind) to confirm zero memory leaks.
        </li>
      </ol>

      <h2>2. Standard Formatted I/O: printf() and scanf()</h2>
      <p>
        The C standard library (<code>&lt;stdio.h&gt;</code>) manages user interaction through formatted I/O functions:
      </p>

      <ComparisonTable {...formatSpecifiersTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          The Critical scanf() Return-Value Vulnerability
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3 font-sans">
          The <code>scanf()</code> function returns the count of items successfully matched and assigned.
          If a user enters non-numeric text when an integer is expected, matching aborts without setting the variable,
          leaving the variable filled with arbitrary garbage:
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div className="text-danger dark:text-night-danger font-bold">// INSECURE CODE: Assumes scanf always succeeds</div>
          <div>int age;</div>
          <div>printf(&quot;Enter age: &quot;);</div>
          <div>scanf(&quot;%d&quot;, &amp;age); // If user enters &quot;twenty&quot;, age remains uninitialized garbage!</div>
          <div>printf(&quot;Next year you will be: %d\n&quot;, age + 1); // Undefined Behavior / Garbled Output</div>
          <div className="text-success dark:text-night-success font-bold pt-2">// SECURE DEFENSIVE CODE: Validates return value</div>
          <div>int age;</div>
          <div>printf(&quot;Enter age: &quot;);</div>
          <div>while (scanf(&quot;%d&quot;, &amp;age) != 1 || age &lt; 0 || age &gt; 130) &#123;</div>
          <div className="pl-4">printf(&quot;Invalid input! Please enter a valid integer between 0 and 130: &quot;);</div>
          <div className="pl-4">// Clear lingering non-numeric characters from the input stream</div>
          <div className="pl-4">int ch;</div>
          <div className="pl-4">while ((ch = getchar()) != &apos;\n&apos; &amp;&amp; ch != EOF);</div>
          <div>&#125;</div>
        </div>
      </div>

      <h2>3. Standard Streams and Buffering Mechanisms</h2>
      <p>
        When an operating system launches a C process, the C runtime library automatically attaches three standard streams:
      </p>

      <ComparisonTable {...streamBufferingTable} />

      <Callout type="warning" title="Undefined Behavior: Never Call fflush(stdin)">
        Novice programmers frequently attempt to clear input buffers using <code>fflush(stdin)</code>.
        The ISO C Standard explicitly specifies that <code>fflush()</code> is defined <strong>exclusively for output streams</strong>.
        Invoking <code>fflush(stdin)</code> invokes Undefined Behavior (UB): while some obsolete Windows compilers historically accepted it,
        on Linux/POSIX systems it is a no-op or causes crashes. Always flush <code>stdin</code> using a portable character-draining loop.
      </Callout>

      <h2>4. Complete Defensive C Program: Statistical Analysis</h2>
      <p>
        The following complete, production-grade C11 program calculates the arithmetic mean and sample standard deviation
        of user measurements, incorporating defensive memory allocation, input validation, and stream clearing:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Production C11 Program: Defensive Statistical Analysis
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1 overflow-x-auto">
          <div><span className="text-brand dark:text-night-brand">#include</span> &lt;stdio.h&gt;</div>
          <div><span className="text-brand dark:text-night-brand">#include</span> &lt;stdlib.h&gt;</div>
          <div><span className="text-brand dark:text-night-brand">#include</span> &lt;math.h&gt;</div>
          <div><span className="text-brand dark:text-night-brand">#include</span> &lt;stdbool.h&gt;</div>
          <div className="pt-2 text-ink/70 dark:text-night-ink/70">// Drains any residual characters remaining in stdin</div>
          <div>void flush_stdin(void) &#123;</div>
          <div className="pl-4">int c;</div>
          <div className="pl-4">while ((c = getchar()) != &apos;\n&apos; &amp;&amp; c != EOF);</div>
          <div>&#125;</div>
          <div className="pt-2">int main(void) &#123;</div>
          <div className="pl-4">int count = 0;</div>
          <div className="pl-4">printf(&quot;Enter sample size (2 to 500): &quot;);</div>
          <div className="pl-4">while (scanf(&quot;%d&quot;, &amp;count) != 1 || count &lt; 2 || count &gt; 500) &#123;</div>
          <div className="pl-8">printf(&quot;Invalid! Enter an integer between 2 and 500: &quot;);</div>
          <div className="pl-8">flush_stdin();</div>
          <div className="pl-4">&#125;</div>
          <div className="pt-2 pl-4 text-ink/70 dark:text-night-ink/70">// Allocate contiguous buffer on heap</div>
          <div className="pl-4">double *data = malloc((size_t)count * sizeof(double));</div>
          <div className="pl-4">if (data == NULL) &#123;</div>
          <div className="pl-8">fprintf(stderr, &quot;Fatal Error: Memory allocation failed.\\n&quot;);</div>
          <div className="pl-8">return EXIT_FAILURE;</div>
          <div className="pl-4">&#125;</div>
          <div className="pt-2 pl-4">double sum = 0.0;</div>
          <div className="pl-4">for (int i = 0; i &lt; count; i++) &#123;</div>
          <div className="pl-8">printf(&quot;Sample #%d: &quot;, i + 1);</div>
          <div className="pl-8">while (scanf(&quot;%lf&quot;, &amp;data[i]) != 1) &#123;</div>
          <div className="pl-12">printf(&quot;Invalid number! Re-enter sample #%d: &quot;, i + 1);</div>
          <div className="pl-12">flush_stdin();</div>
          <div className="pl-8">&#125;</div>
          <div className="pl-8">sum += data[i];</div>
          <div className="pl-4">&#125;</div>
          <div className="pt-2 pl-4">double mean = sum / count;</div>
          <div className="pl-4">double variance_sum = 0.0;</div>
          <div className="pl-4">for (int i = 0; i &lt; count; i++) &#123;</div>
          <div className="pl-8">double delta = data[i] - mean;</div>
          <div className="pl-8">variance_sum += delta * delta;</div>
          <div className="pl-4">&#125;</div>
          <div className="pl-4">double std_dev = sqrt(variance_sum / (count - 1));</div>
          <div className="pt-2 pl-4">printf(&quot;\\n=== Summary Statistics ===\\n&quot;);</div>
          <div className="pl-4">printf(&quot;Count (N)          : %d\\n&quot;, count);</div>
          <div className="pl-4">printf(&quot;Mean               : %.4f\\n&quot;, mean);</div>
          <div className="pl-4">printf(&quot;Sample Std Dev     : %.4f\\n&quot;, std_dev);</div>
          <div className="pt-2 pl-4">free(data); // Reclaim allocated heap memory</div>
          <div className="pl-4">return EXIT_SUCCESS;</div>
          <div>&#125;</div>
        </div>
      </div>

      <h2>5. Compiler Hardening Flags in GCC / Clang</h2>
      <p>
        Modern C developers rely on compiler flags to convert dangerous warnings into blocking build errors:
      </p>
      <ul>
        <li><code>-std=c11</code>: Restricts syntax strictly to the ISO/IEC 9899:2011 standard baseline.</li>
        <li><code>-Wall -Wextra</code>: Enables comprehensive diagnostics including uninitialized variables and unused parameters.</li>
        <li><code>-Werror</code>: Treats all warnings as fatal errors, guaranteeing that code compiles with zero diagnostics.</li>
        <li><code>-pedantic</code>: Flags any non-portable code extensions that violate the ISO C specification.</li>
        <li><code>-O2</code>: Enables advanced optimizations, empowering the compiler data-flow engine to identify uninitialized execution paths.</li>
        <li><code>-fsanitize=address,undefined</code>: Injects AddressSanitizer and UndefinedBehaviorSanitizer instrumentation to trap out-of-bounds array reads and pointer corruption during testing.</li>
      </ul>

      <FAQ items={questions} />
    </>
  )
}
