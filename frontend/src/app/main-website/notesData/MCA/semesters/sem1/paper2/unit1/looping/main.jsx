import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const loopComparisonTable = {
    caption: 'Comparative Architecture of Iteration Constructs in ISO C',
    headers: ['Construct', 'Control Classification', 'Minimum Execution Count', 'Evaluation Timing', 'Typical Use Case'],
    rows: [
      [
        'while Loop',
        'Entry-controlled (Pre-test)',
        '0 iterations',
        'Condition evaluated before entering loop body.',
        'Indefinite iteration where repetition count is unknown beforehand (e.g., stream reading until EOF).'
      ],
      [
        'for Loop',
        'Entry-controlled (Pre-test)',
        '0 iterations',
        'Condition evaluated before body; update expression executed after body.',
        'Definite counting loops, array index traversal, linear search with known boundaries.'
      ],
      [
        'do-while Loop',
        'Exit-controlled (Post-test)',
        '1 iteration (guaranteed)',
        'Body executes unconditionally once; condition evaluated at bottom.',
        'Interactive menu prompts, user input validation loops, hardware retry polling.'
      ]
    ]
  }

  const loopComplexityTable = {
    caption: 'Algorithmic Complexity Patterns for Iterative Loop Topologies',
    headers: ['Loop Topology', 'Step Progression', 'Iteration Formula', 'Asymptotic Time Complexity'],
    rows: [
      [
        'Single Linear Iteration',
        'i increments by constant c (e.g., i += 1)',
        'n / c steps',
        'O(n) Linear Time'
      ],
      [
        'Double Nested Loop',
        'Outer loop runs n times; inner loop runs m times',
        'n &times; m steps',
        'O(n &times; m) or O(n<sup>2</sup>) if n == m'
      ],
      [
        'Triangular Nested Loop',
        'Inner loop runs from i to n (or 0 to i)',
        'n &times; (n + 1) / 2 steps',
        'O(n<sup>2</sup>) Quadratic Time'
      ],
      [
        'Logarithmic Progression',
        'Index multiplies or divides by factor k (e.g., i *= 2 or i /= 2)',
        'log<sub>k</sub>(n) steps',
        'O(log n) Logarithmic Time'
      ],
      [
        'Linearithmic Progression',
        'Outer loop runs n times; inner index multiplies/divides',
        'n &times; log(n) steps',
        'O(n log n) Linearithmic Time'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Looping constructs enable repetitive execution of computational statements until a specified terminal predicate is satisfied. In systems programming, loops drive algorithm efficiency, hardware polling routines, and memory stream parsing. Mastering loop control flow requires understanding the distinction between entry-controlled and exit-controlled mechanics, formal loop invariant correctness, and low-level loop optimization techniques.
      </p>

      <h2>1. Iterative Control Architecture: Entry vs Exit Control</h2>
      <p>
        The C language classifies loops into two operational categories based on when the controlling conditional expression is evaluated relative to the execution of the loop body.
      </p>

      <ComparisonTable {...loopComparisonTable} />

      <h3>The while Statement: Pure Entry Control</h3>
      <p>
        The <code>while</code> loop tests its controlling predicate before executing any statements inside the body. If the condition initially evaluates to zero (false), the body is bypassed entirely:
      </p>

      <pre><code className="language-c">{`// Read stream until End-of-File marker:
int ch;
while ((ch = getchar()) != EOF) {
    process_char((char)ch);
}`}</code></pre>

      <h3>The do-while Statement: Guaranteed Post-Test Execution</h3>
      <p>
        In contrast, a <code>do-while</code> loop executes its body unconditionally on the first pass before evaluating the controlling condition at the closing parenthesis. The closing parenthesis must be terminated with a semicolon:
      </p>

      <pre><code className="language-c">{`int choice;
do {
    display_menu();
    printf("Enter choice [1-4]: ");
    if (scanf("%d", &choice) != 1) {
        clear_input_buffer();
        choice = -1;
    }
} while (choice < 1 || choice > 4); // Loop repeats until valid input is supplied`}</code></pre>

      <h2>2. Anatomy and Expressiveness of the for Loop</h2>
      <p>
        The <code>for</code> loop consolidates the three lifecycle components of a loop (initialization, condition testing, and state iteration) into a single concise header:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4 font-mono text-sm">
        <div className="text-ink dark:text-night-ink font-semibold">for ( clause-1 ; clause-2 ; clause-3 ) &#123; body; &#125;</div>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink-muted dark:text-night-ink-muted">
          <li><strong>clause-1 (Initialization):</strong> Evaluated exactly once before the loop begins. In C99 and later, variables can be declared directly here with block scope.</li>
          <li><strong>clause-2 (Controlling Condition):</strong> Evaluated before every iteration. If non-zero, body executes. If omitted, it defaults implicitly to non-zero (permanently true).</li>
          <li><strong>clause-3 (Iteration / Step):</strong> Evaluated at the end of each iteration, immediately after the loop body completes and before clause-2 is re-tested.</li>
        </ul>
      </div>

      <h3>Multiple Expressions and the Comma Operator</h3>
      <p>
        By utilizing the comma operator, multiple variables can be initialized and mutated simultaneously within the header clauses:
      </p>

      <pre><code className="language-c">{`// Reversing an array in-place using two converging pointers:
for (int left = 0, right = length - 1; left < right; left++, right--) {
    int temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
}`}</code></pre>

      <h3>Idiomatic Infinite Loops: for(;;) vs while(1)</h3>
      <p>
        Omitting all three clauses creates the canonical C infinite loop: <code>for (;;)</code>. Compilers treat <code>for (;;)</code> and <code>while (1)</code> identically, generating an unconditional jump (<code>jmp</code>) without testing any conditional register.
      </p>

      <h2>3. Jump Control within Loops: break vs continue</h2>
      <p>
        The <code>break</code> and <code>continue</code> statements allow fine-grained interruption of loop execution flow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-accent mb-2">break Statement</h4>
          <p className="text-sm text-ink-muted dark:text-night-ink-muted mb-2">
            Immediately terminates the innermost enclosing loop or switch construct. Control passes to the statement directly following the loop block.
          </p>
          <pre><code className="text-xs font-mono">{`for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
        found_index = i;
        break; // Early exit on search match
    }
}`}</code></pre>
        </div>

        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-accent mb-2">continue Statement</h4>
          <p className="text-sm text-ink-muted dark:text-night-ink-muted mb-2">
            Skips the remainder of the current loop body and advances immediately to the next iteration.
          </p>
          <pre><code className="text-xs font-mono">{`for (int i = 0; i < n; i++) {
    if (arr[i] % 2 != 0) {
        continue; // Skip odd numbers
    }
    process_even(arr[i]);
}`}</code></pre>
        </div>
      </div>

      <Callout type="warning">
        <strong>The continue Hazard in while Loops:</strong> In a <code>for</code> loop, <code>continue</code> jumps directly to the update clause (e.g., <code>i++</code>). In a <code>while</code> loop, however, <code>continue</code> jumps directly to the condition test! If the counter increment was positioned below the <code>continue</code> call, the counter will never advance, causing an unintended infinite loop.
      </Callout>

      <h2>4. Loop Invariants and Formal Correctness</h2>
      <p>
        In computer science, a <strong>loop invariant</strong> is a formal mathematical predicate that holds true prior to entering the loop and remains invariant (true) after every iteration. Proving loop correctness relies on Hoare logic via three inductive steps:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Mathematical Induction Framework for Loops</h4>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-ink dark:text-night-ink">
          <li><strong>Initialization (Base Case):</strong> The invariant is true prior to the first iteration of the loop.</li>
          <li><strong>Maintenance (Inductive Step):</strong> If the invariant is true before an iteration and the loop guard condition is satisfied, the invariant remains true after the body executes.</li>
          <li><strong>Termination:</strong> The loop terminates when the guard condition becomes false. The invariant at termination, combined with the termination condition, proves that the algorithm computed the desired output.</li>
        </ol>
      </div>

      <h3>Worked Example: Array Summation Invariant</h3>
      <pre><code className="language-c">{`int sum = 0;
for (int i = 0; i < n; i++) {
    // Invariant: sum == sum(arr[0 ... i - 1])
    sum += arr[i];
    // Invariant holds: sum == sum(arr[0 ... i])
}
// At termination: i == n, therefore sum == sum(arr[0 ... n - 1])`}</code></pre>

      <h2>5. Common Looping Pitfalls and Anti-Patterns</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Unsigned Counter Underflow</h4>
          <p className="text-xs text-ink-muted dark:text-night-ink-muted mb-2">
            Unsigned integers cannot become negative. Decrementing past zero wraps around to UINT_MAX.
          </p>
          <pre><code className="text-xs font-mono">{`// INFINITE LOOP:
// When i == 0, i-- wraps to UINT_MAX (4294967295)
// UINT_MAX is still >= 0!
for (unsigned int i = 10; i >= 0; i--) {
    printf("%u\\n", i);
}`}</code></pre>
        </div>

        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Floating-Point Exact Equality</h4>
          <p className="text-xs text-ink-muted dark:text-night-ink-muted mb-2">
            Binary floating-point fractions cannot represent decimal 0.1 exactly, skipping equality.
          </p>
          <pre><code className="text-xs font-mono">{`// INFINITE LOOP:
// 0.1 accumulates rounding error:
// 0.8999999999999999 -> 1.0000000000000002
// x != 1.0 is never false!
for (double x = 0.0; x != 1.0; x += 0.1) {
    printf("%f\\n", x);
}`}</code></pre>
        </div>
      </div>

      <h2>6. Algorithmic Complexity of Nested Loops</h2>
      <p>
        The structure of a loop directly determines its computational time complexity. Nested loops multiply the iteration counts of their components.
      </p>

      <ComparisonTable {...loopComplexityTable} />

      <FAQ items={questions} />
    </>
  )
}
