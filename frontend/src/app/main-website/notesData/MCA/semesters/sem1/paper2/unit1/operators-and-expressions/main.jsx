import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const operatorsTable = {
    caption: 'Comprehensive Taxonomy of C Operators and Evaluation Semantics',
    headers: ['Category', 'Operators Included', 'Arity', 'Evaluation Behavior', 'Practical Use Cases'],
    rows: [
      [
        'Arithmetic',
        '+, -, *, /, %',
        'Binary',
        'Standard mathematical operations; % requires integer operands.',
        'Array stride calculations, hash table bucket hashing (hash % capacity).'
      ],
      [
        'Relational',
        '==, !=, &lt;, &lt;=, &gt;, &gt;=',
        'Binary',
        'Evaluates to integer 1 (true) or 0 (false).',
        'Loop termination conditions, binary search comparisons.'
      ],
      [
        'Logical',
        '&amp;&amp;, ||, !',
        'Binary / Unary',
        'Short-circuit evaluation guaranteed; strict left-to-right order.',
        'Compound boolean conditions, defensive null-pointer guarding.'
      ],
      [
        'Bitwise',
        '&amp;, |, ^, ~, &lt;&lt;, &gt;&gt;',
        'Binary / Unary',
        'Operates directly on individual bits in hardware CPU registers.',
        'Flag masks, hardware device registers, data compression, cryptographic hashes.'
      ],
      [
        'Assignment',
        '=, +=, -=, *=, /=, %=, &amp;=, |=, ^=, &lt;&lt;=, &gt;&gt;=',
        'Binary',
        'Stores evaluated right-hand rvalue into left-hand lvalue location.',
        'Variable mutation, accumulator loops.'
      ],
      [
        'Increment / Decrement',
        '++x, x++, --x, x--',
        'Unary',
        'Prefix alters and yields new value; postfix yields old value then alters.',
        'Loop index iteration, pointer advancing.'
      ],
      [
        'Conditional',
        '?:',
        'Ternary',
        'Evaluates condition; yields either second or third expression.',
        'Compact inline branch selection: max = (a &gt; b) ? a : b.'
      ]
    ]
  }

  const bitmaskTable = {
    caption: 'Standard Bitmask Manipulation Idioms for Bit k',
    headers: ['Operation', 'Bitwise Formula', 'C Implementation', 'Effect on Bit k', 'Effect on Other Bits'],
    rows: [
      [
        'Set Bit k to 1',
        'value OR (1 &lt;&lt; k)',
        'value |= (1U &lt;&lt; k);',
        'Forces bit k to 1 regardless of prior state.',
        'All other bits remain completely unchanged.'
      ],
      [
        'Clear Bit k to 0',
        'value AND NOT (1 &lt;&lt; k)',
        'value &amp;= ~(1U &lt;&lt; k);',
        'Forces bit k to 0 regardless of prior state.',
        'All other bits remain completely unchanged.'
      ],
      [
        'Toggle Bit k',
        'value XOR (1 &lt;&lt; k)',
        'value ^= (1U &lt;&lt; k);',
        'Inverts bit k (0 becomes 1, 1 becomes 0).',
        'All other bits remain completely unchanged.'
      ],
      [
        'Test Bit k',
        '(value AND (1 &lt;&lt; k)) != 0',
        'bool set = (value &amp; (1U &lt;&lt; k)) != 0;',
        'Returns true if bit k is 1, false if 0.',
        'Read-only inspection; value is unmodified.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Operators and expressions govern algorithmic computation, logical decision flows, and direct bit manipulations in C.
        Because C compiles directly to bare-metal processor instructions, mastering short-circuit evaluation,
        bitwise masking idioms, sequence points, and type conversion hierarchies is essential for authoring robust,
        safe, and high-performance data structures.
      </p>

      <h2>1. Operator Classification and Functional Semantics</h2>
      <p>
        C organizes its rich set of operators into distinct categories based on their mathematical arity and operational semantics:
      </p>

      <ComparisonTable {...operatorsTable} />

      <h2>2. Short-Circuit Evaluation and Defensive Pointer Guards</h2>
      <p>
        In C, the logical operators <code>&amp;&amp;</code> (AND) and <code>||</code> (OR) enforce strict left-to-right evaluation
        and introduce a guaranteed <strong>sequence point</strong> between operands:
      </p>
      <ul>
        <li>
          <strong>Logical AND (<code>expr1 &amp;&amp; expr2</code>):</strong> If <code>expr1</code> evaluates to false (0),
          the compound expression can never be true. The compiler short-circuits: <code>expr2</code> is <strong>never evaluated</strong>!
        </li>
        <li>
          <strong>Logical OR (<code>expr1 || expr2</code>):</strong> If <code>expr1</code> evaluates to true (non-zero),
          the compound expression is guaranteed to be true. The compiler short-circuits: <code>expr2</code> is <strong>never evaluated</strong>!
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          The Defensive Pointer Guard Idiom
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div className="text-success dark:text-night-success font-bold">// SECURE: Short-circuit protects against NULL dereference</div>
          <div>if (node != NULL &amp;&amp; node-&gt;key == search_val) &#123;</div>
          <div className="pl-4">// Safe! If node is NULL, the second condition is NEVER evaluated.</div>
          <div>&#125;</div>
          <div className="text-danger dark:text-night-danger font-bold pt-2">// FATAL BUG: Reversed order triggers Segmentation Fault!</div>
          <div>if (node-&gt;key == search_val &amp;&amp; node != NULL) &#123;</div>
          <div className="pl-4">// CRASH! When node is NULL, node-&gt;key dereferences address 0x0 immediately!</div>
          <div>&#125;</div>
        </div>
      </div>

      <h2>3. Bitwise Operators and Bitmasking Idioms</h2>
      <p>
        Bitwise operators allow C to interact directly with hardware registers, implement compact boolean flag sets,
        and perform ultra-fast arithmetic:
      </p>

      <ComparisonTable {...bitmaskTable} />

      <h2>4. Increment / Decrement Hazards &amp; Sequence Points</h2>
      <p>
        The unary increment (<code>++</code>) and decrement (<code>--</code>) operators modify an lvalue by 1:
      </p>
      <ul>
        <li><strong>Prefix (<code>++x</code>):</strong> Increments <code>x</code> first, then yields the updated value.</li>
        <li><strong>Postfix (<code>x++</code>):</strong> Yields the original value of <code>x</code> for the expression, then commits the increment.</li>
      </ul>

      <Callout type="danger" title="Undefined Behavior: i = i++ and Unsequenced Modifications">
        In ISO C (C11 section 6.5 paragraph 2), modifying an object more than once between two consecutive sequence points
        yields <strong>Undefined Behavior (UB)</strong>:
        <br />
        <code className="text-danger dark:text-night-danger font-bold">i = i++; // UNDEFINED BEHAVIOR!</code><br />
        <code className="text-danger dark:text-night-danger font-bold">arr[i] = i++; // UNDEFINED BEHAVIOR!</code><br />
        In both cases, <code>i</code> is modified multiple times or read and modified without an intervening sequence point.
        The compiler is legally free to produce arbitrary machine code, corrupt registers, or produce inconsistent results.
        Never combine multiple mutating side-effects on the same variable in a single expression!
      </Callout>

      <h2>5. Type Conversions: The Silent Unsigned Trap</h2>
      <p>
        When evaluating expressions containing mixed types, C applies two automatic promotion rules:
      </p>
      <ol>
        <li>
          <strong>Integer Promotion:</strong> Types smaller than <code>int</code> (<code>char</code>, <code>short</code>)
          are automatically promoted to <code>int</code> before arithmetic is performed.
        </li>
        <li>
          <strong>Usual Arithmetic Conversions:</strong> The operand with the lower ranking type is converted to the type
          of the higher ranking operand along the strict conversion hierarchy:
          <br />
          <code className="text-brand dark:text-night-brand font-bold">
            long double &gt; double &gt; float &gt; unsigned long long &gt; long long &gt; unsigned long &gt; long &gt; unsigned int &gt; int
          </code>
        </li>
      </ol>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          The Silent Unsigned Comparison Trap: if (-1 &lt; sizeof(int))
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>int x = -1;</div>
          <div>if (x &lt; sizeof(int)) &#123;</div>
          <div className="pl-4">printf(&quot;True\\n&quot;);</div>
          <div>&#125; else &#123;</div>
          <div className="pl-4 text-danger dark:text-night-danger font-bold">printf(&quot;False\\n&quot;); // THIS LINE EXECUTES!</div>
          <div>&#125;</div>
          <div className="pt-2 text-ink/80 dark:text-night-ink/80 font-sans">
            <strong>Why it prints &ldquo;False&rdquo;:</strong> The <code>sizeof</code> operator returns <code>size_t</code> (an unsigned integer).
            By the Usual Arithmetic Conversions, signed <code>int x (-1)</code> is implicitly cast to an unsigned integer.
            Under Two&rsquo;s Complement, <code>-1</code> cast to <code>uint64_t</code> equals <code>18,446,744,073,709,551,615</code>,
            which is vastly greater than 4! This silent trap is a frequent source of critical memory bugs.
          </div>
        </div>
      </div>

      <FAQ items={questions} />
    </>
  )
}
