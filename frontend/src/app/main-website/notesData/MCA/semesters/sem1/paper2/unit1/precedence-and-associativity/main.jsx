import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const precedenceTable = {
    caption: 'The Complete 15-Level ISO C Operator Precedence and Associativity Table',
    headers: ['Level (Rank)', 'Category / Operator Class', 'Operators', 'Associativity Direction', 'Binding Behavior'],
    rows: [
      [
        'Level 1 (Highest)',
        'Postfix Operators',
        '() [] -&gt; . ++ --',
        'Left-to-Right',
        'Function calls, array indexing, member selection, postfix mutations.'
      ],
      [
        'Level 2',
        'Unary Operators',
        '++ -- + - ! ~ (type) * &amp; sizeof',
        'Right-to-Left',
        'Prefix mutations, logical NOT, bitwise NOT, casts, dereferencing.'
      ],
      [
        'Level 3',
        'Multiplicative',
        '* / %',
        'Left-to-Right',
        'Multiplication, division, and integer modulo remainder.'
      ],
      [
        'Level 4',
        'Additive',
        '+ -',
        'Left-to-Right',
        'Binary addition, binary subtraction, and pointer offset arithmetic.'
      ],
      [
        'Level 5',
        'Bitwise Shifts',
        '&lt;&lt; &gt;&gt;',
        'Left-to-Right',
        'Left shift (multiply by 2<sup>n</sup>), right shift (divide by 2<sup>n</sup>).'
      ],
      [
        'Level 6',
        'Relational Comparison',
        '&lt; &lt;= &gt; &gt;=',
        'Left-to-Right',
        'Numerical magnitude comparison; yields boolean integer 1 or 0.'
      ],
      [
        'Level 7',
        'Equality Comparison',
        '== !=',
        'Left-to-Right',
        'Equivalence and non-equivalence checks; yields 1 or 0.'
      ],
      [
        'Level 8',
        'Bitwise AND',
        '&amp;',
        'Left-to-Right',
        'Bitwise conjunction; extracts matching set bits.'
      ],
      [
        'Level 9',
        'Bitwise XOR',
        '^',
        'Left-to-Right',
        'Bitwise exclusive-OR; detects bit differences (odd parity).'
      ],
      [
        'Level 10',
        'Bitwise OR',
        '|',
        'Left-to-Right',
        'Bitwise disjunction; combines set bits.'
      ],
      [
        'Level 11',
        'Logical AND',
        '&amp;&amp;',
        'Left-to-Right',
        'Short-circuit boolean conjunction; sequence point guaranteed.'
      ],
      [
        'Level 12',
        'Logical OR',
        '||',
        'Left-to-Right',
        'Short-circuit boolean disjunction; sequence point guaranteed.'
      ],
      [
        'Level 13',
        'Conditional / Ternary',
        '?:',
        'Right-to-Left',
        'Evaluates condition first; yields second or third expression.'
      ],
      [
        'Level 14',
        'Assignment Operators',
        '= += -= *= /= %= &amp;= ^= |= &lt;&lt;= &gt;&gt;=',
        'Right-to-Left',
        'Stores evaluated right-hand rvalue into left-hand lvalue.'
      ],
      [
        'Level 15 (Lowest)',
        'Comma Operator',
        ',',
        'Left-to-Right',
        'Discards left value; yields rightmost value. Sequence point.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Operator precedence and associativity define the formal grammar rules that resolve ambiguity in complex C expressions.
        While precedence dictates how operators bind to operands in the compiler syntax tree, associativity resolves binding
        direction among operators sharing identical precedence. This study analyzes the full 15-level precedence hierarchy,
        demystifies the critical distinction between precedence and evaluation order, examines sequence points and unsequenced
        evaluations in C11, and provides step-by-step reduction traces for standard university examination problems.
      </p>

      <h2>1. Precedence vs Associativity: The Core Distinction</h2>
      <p>
        When a compiler parses a compound C expression, it uses two distinct syntactic principles to construct
        an unambiguous <strong>Abstract Syntax Tree (AST)</strong>:
      </p>
      <ul>
        <li>
          <strong>Precedence:</strong> Governs grouping when an expression contains operators of <em>differing priority levels</em>.
          Operators with higher precedence bind more tightly to adjacent operands. For example, in <code>4 + 3 * 5</code>,
          multiplication has higher precedence than addition, binding as <code>4 + (3 * 5) = 19</code>.
        </li>
        <li>
          <strong>Associativity:</strong> Governs grouping when an expression contains two or more operators of the <em>exact same priority level</em>.
          Associativity dictates whether the expression is grouped from <strong>Left-to-Right</strong> or from <strong>Right-to-Left</strong>.
        </li>
      </ul>

      <h2>2. The Complete 15-Level Precedence Hierarchy</h2>
      <p>
        The ISO C specification defines 15 strict hierarchical precedence ranks:
      </p>

      <ComparisonTable {...precedenceTable} />

      <Callout type="info" title="The Three Right-to-Left Associativity Groups">
        Notice that almost all binary operators in C associate from Left to Right.
        There are only <strong>three specific operator groups</strong> that associate from <strong>Right to Left</strong>:
        <ol className="list-decimal pl-4 mt-2 space-y-1">
          <li><strong>Unary Operators (Level 2):</strong> <code>++</code>, <code>--</code>, <code>!</code>, <code>~</code>, <code>*</code>, <code>&amp;</code>, <code>sizeof</code>, type casts. (e.g., <code>*p++</code> groups as <code>*(p++)</code>).</li>
          <li><strong>Conditional Ternary Operator (Level 13):</strong> <code>?:</code> (e.g., <code>a ? b : c ? d : e</code> groups as <code>a ? b : (c ? d : e)</code>).</li>
          <li><strong>Assignment Operators (Level 14):</strong> <code>=</code>, <code>+=</code>, <code>-=</code>, etc. (e.g., <code>a = b = c = 10</code> groups as <code>a = (b = (c = 10))</code>).</li>
        </ol>
      </Callout>

      <h2>3. Precedence vs Order of Evaluation: The Common Trap</h2>
      <p>
        A widespread misconception among computer science students is believing that an operator with higher precedence
        is executed chronologically first by the CPU. In C, <strong>precedence governs syntactic grouping, NOT temporal execution order</strong>!
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          The Order of Evaluation Misconception
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div>int result = f() + g() * h();</div>
          <div className="text-ink/80 dark:text-night-ink/80 font-sans">
            <strong>Syntactic Binding:</strong> Because <code>*</code> has higher precedence than <code>+</code>,
            the tree groups as: <code>f() + (g() * h())</code>.
          </div>
          <div className="text-danger dark:text-night-danger font-bold font-sans">
            Temporal Reality: The CPU is legally free to execute f() FIRST!
          </div>
          <p className="text-ink/80 dark:text-night-ink/80 font-sans">
            The C standard imposes zero ordering on the evaluation of operands in arithmetic operations.
            The compiler may call <code>f()</code> first, or <code>h()</code> first, or <code>g()</code> first.
            If any of these functions produce mutating side effects on shared global variables, the program behavior
            is non-deterministic!
          </p>
        </div>
      </div>

      <h2>4. Worked Examination Traces</h2>
      <p>
        The following step-by-step reduction trace demonstrates how precedence and associativity rules are applied
        during university examinations:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Step-by-Step Expression Reduction Trace
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Initial Values:</div>
            <div>int a = 6, b = 4, c = 2, d = 3;</div>
            <div className="text-brand dark:text-night-brand font-bold pt-1">
              Expression: x = a + b * c / d - b % c + (a &gt; b &amp;&amp; c &lt; d);
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Reduction Sequence:</div>
            <div>
              <strong>Step 1: Evaluate Parentheses (Level 1):</strong><br />
              Subexpression: <code>(a &gt; b &amp;&amp; c &lt; d)</code><br />
              Relational &gt; has higher precedence than &amp;&amp;: <code>6 &gt; 4</code> evaluates to <code>1 (true)</code>.<br />
              Relational &lt; evaluates: <code>2 &lt; 3</code> evaluates to <code>1 (true)</code>.<br />
              Logical AND: <code>1 &amp;&amp; 1</code> evaluates to <strong><code>1</code></strong>.<br />
              Expression becomes: <code>x = 6 + 4 * 2 / 3 - 4 % 2 + 1;</code>
            </div>
            <div>
              <strong>Step 2: Multiplicative Operators (*, /, %) Left-to-Right (Level 3):</strong><br />
              <code>4 * 2</code> &rarr; <code>8</code><br />
              <code>8 / 3</code> &rarr; <code>2</code> (integer truncation)<br />
              <code>4 % 2</code> &rarr; <code>0</code> (remainder of 4 / 2 is 0)<br />
              Expression becomes: <code>x = 6 + 2 - 0 + 1;</code>
            </div>
            <div>
              <strong>Step 3: Additive Operators (+, -) Left-to-Right (Level 4):</strong><br />
              <code>6 + 2</code> &rarr; <code>8</code><br />
              <code>8 - 0</code> &rarr; <code>8</code><br />
              <code>8 + 1</code> &rarr; <strong><code>9</code></strong>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success font-sans">Final Result:</div>
            <div className="text-success dark:text-night-success font-bold text-sm">
              x = 9
            </div>
          </div>
        </div>
      </div>

      <h2>5. Sequence Points &amp; C11 Ordering Relations</h2>
      <p>
        In modern C (C11 and C17), execution order is governed by the <strong>Sequenced-Before</strong> relation:
      </p>
      <ul>
        <li>
          <strong>Sequenced-Before:</strong> A strict partial ordering relationship between evaluations.
          If evaluation <em>A</em> is sequenced-before <em>B</em>, then <em>A</em> is guaranteed to finish completely before <em>B</em> starts.
        </li>
        <li>
          <strong>The Sequence Point Operators:</strong> Only four operators in C guarantee sequenced-before relationships:
          <code>&amp;&amp;</code>, <code>||</code>, <code>?:</code>, and the comma operator (<code>,</code>).
        </li>
        <li>
          <strong>Unsequenced Evaluations:</strong> When two evaluations are unsequenced relative to each other,
          the compiler is permitted to interleave machine instructions arbitrarily.
          Attempting to modify the same scalar variable in unsequenced operations (e.g., <code>x = x++</code>) is <strong>Undefined Behavior</strong>!
        </li>
      </ul>

      <FAQ items={questions} />
    </>
  )
}
