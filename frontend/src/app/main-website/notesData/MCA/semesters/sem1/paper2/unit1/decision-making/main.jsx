import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const branchingComparison = {
    caption: 'Comparative Analysis of Conditional Control Flow Constructs in C',
    headers: ['Construct', 'Evaluation Type', 'Underlying Dispatch Mechanism', 'Typical Complexity', 'Optimal Use Case'],
    rows: [
      [
        'if-else Statement',
        'Boolean conditions (truthy != 0, falsy == 0)',
        'Conditional branch assembly instructions (cmp, jne, je)',
        'O(1) for single branch, O(n) for n chained conditions',
        'Binary choices, complex ranges, floating-point comparisons, pointer validation.'
      ],
      [
        'else-if Ladder',
        'Sequential multi-condition testing',
        'Cascading series of comparison and conditional jump instructions',
        'O(n) worst-case evaluations in sequential order',
        'Mutually exclusive non-uniform range checks or non-integral conditions.'
      ],
      [
        'switch Statement',
        'Compile-time integer constant expressions',
        'Indirect jump table array dispatch or binary search decision tree',
        'O(1) with jump tables; O(log n) with binary search trees',
        'Multi-way branching over discrete integer or enumeration states.'
      ],
      [
        'Ternary Operator (?:)',
        'Expression yielding a evaluated value',
        'Conditional move (cmov) or short-circuit conditional branch',
        'O(1)',
        'Inline conditional assignment, macro definitions, return statements.'
      ],
      [
        'goto Statement',
        'Unconditional jump to labeled statement',
        'Direct unconditional jump instruction (jmp)',
        'O(1)',
        'Multi-level loop breakout, Linux kernel resource cleanup and error unwinding.'
      ]
    ]
  }

  const dispatchMechanicsTable = {
    caption: 'Compiler Switch Optimization Strategies based on Case Distribution',
    headers: ['Strategy', 'Distribution Condition', 'Assembly Generation Technique', 'Runtime Time Complexity'],
    rows: [
      [
        'Jump Table (Indirect Branch)',
        'Dense integer cases (e.g., cases 1, 2, 3, 4, 5 with few holes)',
        'Stores an array of target code addresses in .rodata. Computes index offset and jumps indirectly via jmp *table[index].',
        'O(1) constant time, independent of case count.'
      ],
      [
        'Binary Search Tree',
        'Sparse integer cases spread over a large range (e.g., cases 10, 500, 20000, 999999)',
        'Generates a balanced binary comparison tree of cmp and jg/jl instructions to bisect the search space.',
        'O(log n) logarithmic comparisons.'
      ],
      [
        'Linear Chain',
        'Very small number of cases (typically fewer than 4 or 5)',
        'Emits sequential cmp and je test blocks, identical to an else-if ladder.',
        'O(n) linear sequential checks.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Decision making and branching constructs govern the dynamic flow of execution in a C program. By evaluating boolean expressions, inspecting integral state machines, or performing direct jump dispatches, compilers translate high-level conditional logic into low-level machine branch instructions. Understanding how the compiler optimizes these structures is essential for writing fast, predictable, and maintainable systems software.
      </p>

      <h2>1. Foundational Conditional Branching: The if Family</h2>
      <p>
        In C, decision making is fundamentally predicated on integer truth values. The language does not require a native boolean type for control statements: any expression evaluating to zero (<code>0</code>, <code>0.0</code>, or <code>NULL</code>) is treated as <strong>false</strong>, and any non-zero value is treated as <strong>true</strong>.
      </p>

      <h3>The if and if-else Statements</h3>
      <p>
        The <code>if</code> statement evaluates a controlling expression. If true, the subsequent statement or block executes. The optional <code>else</code> branch executes if and only if the expression evaluates to zero.
      </p>

      <pre><code className="language-c">{`if (buffer_len > MAX_CAPACITY) {
    expand_buffer();
} else {
    append_data();
}`}</code></pre>

      <h3>The Dangling Else Ambiguity and Resolution</h3>
      <p>
        A classic syntactic ambiguity arises in nested conditional structures when the number of <code>if</code> keywords exceeds the number of <code>else</code> keywords without explicit braces:
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">The Ambiguous Dangling Else Snippet</h4>
        <pre><code className="text-sm font-mono">{`// Visual indentation suggests the else belongs to the outer if:
if (connection_alive)
    if (packet_ready)
        process_packet();
else
    reconnect_socket(); // TO WHICH IF DOES THIS BELONG?`}</code></pre>
      </div>

      <p>
        <strong>Grammar Resolution Rule in ISO C:</strong> An <code>else</code> clause is syntactically bound to the <em>closest preceding unmatched <code>if</code> statement</em> within the same scope. Therefore, in the snippet above, the compiler associates <code>else</code> with <code>if (packet_ready)</code>. If <code>connection_alive</code> is false, <code>reconnect_socket()</code> is never called.
      </p>

      <Callout type="tip">
        <strong>Defensive Style Rule:</strong> Always enclose the bodies of all <code>if</code> and <code>else</code> clauses within curly braces <code>&#123;&#125;</code>, even for single statements. This completely eliminates dangling-else ambiguities and prevents security defects during future refactoring.
      </Callout>

      <h2>2. The Multi-Way switch Statement Architecture</h2>
      <p>
        When an algorithm must branch based on the discrete state of an integer variable, an <code>else-if</code> ladder forces the CPU to evaluate conditions sequentially, yielding $O(n)$ worst-case time complexity. The <code>switch</code> statement provides a high-performance alternative designed specifically for discrete multi-way selection.
      </p>

      <h3>Strict ISO C Constraints on switch</h3>
      <ul>
        <li><strong>Integral Types Only:</strong> The controlling expression must evaluate to an integer type (such as <code>int</code>, <code>char</code>, <code>short</code>, <code>long</code>, or <code>enum</code>). Floating-point values (<code>float</code>, <code>double</code>) and strings (<code>char*</code>) are strictly prohibited.</li>
        <li><strong>Compile-Time Constant Labels:</strong> Each <code>case</code> label must be an integer constant expression (e.g., <code>case 5:</code> or <code>case 'A':</code>). Variables or runtime values cannot be used as case targets.</li>
        <li><strong>Unique Labels:</strong> Duplicate case values within the same switch block trigger a compile-time error.</li>
      </ul>

      <h3>The Fallthrough Mechanism and the break Statement</h3>
      <p>
        In C, case labels function as assembly entry jump targets rather than isolated blocks. When a matching case is encountered, execution enters at that point and proceeds sequentially through all subsequent statements across following cases until a <code>break</code> or <code>return</code> is reached.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Intentional Fallthrough vs Buggy Omission</h4>
        <pre><code className="text-sm font-mono">{`switch (status_code) {
    // Deliberate fallthrough: multiple cases sharing identical logic
    case 200:
    case 201:
    case 204:
        log_success();
        break; // Stops execution and exits the switch block

    case 404:
        handle_not_found();
        // DANGEROUS FALLTHROUGH: missing break causes unintentional execution of 500!
        /* [[fallthrough]]; */ // C23 attribute to make intent explicit to the compiler
    case 500:
        handle_server_error();
        break;

    default:
        handle_unknown_code();
        break;
}`}</code></pre>
      </div>

      <h2>3. Under the Hood: How Compilers Optimize switch</h2>
      <p>
        Unlike interpreted languages that evaluate switch cases sequentially, modern C optimizing compilers (GCC, Clang) analyze the mathematical distribution of case labels to generate optimal assembly.
      </p>

      <ComparisonTable {...dispatchMechanicsTable} />

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Assembly Mechanics of a Jump Table Dispatch</h4>
        <p className="text-sm text-ink-muted dark:text-night-ink-muted mb-3">
          For cases spanning 0 to 3, the compiler emits an indirect jump via a lookup table stored in read-only memory:
        </p>
        <pre><code className="text-sm font-mono">{`// Pseudocode Assembly:
// Assume %eax holds the switch expression variable
cmpl    $3, %eax               ; Check if index exceeds upper bound (3)
ja      .L_default             ; If unsigned greater, jump to default label
jmp     *.L_jump_table(,%rax,8); Jump indirectly to target address: Table + (index * 8)

.section .rodata
.L_jump_table:
    .quad   .L_case_0          ; Address of case 0 handler
    .quad   .L_case_1          ; Address of case 1 handler
    .quad   .L_case_2          ; Address of case 2 handler
    .quad   .L_case_3          ; Address of case 3 handler`}</code></pre>
      </div>

      <h2>4. The Conditional Ternary Operator (? :)</h2>
      <p>
        The conditional operator <code>condition ? expr_true : expr_false</code> is C's only ternary operator. Unlike an <code>if-else</code> construct, which is a <em>statement</em> that controls execution flow without producing a value, the ternary operator is an <em>expression</em> that produces a concrete result.
      </p>
      <ul>
        <li><strong>Short-Circuit Evaluation:</strong> Exactly one of the two sub-expressions is evaluated. The unused alternative expression is never executed, preventing accidental side effects.</li>
        <li><strong>Common Type Balancing:</strong> The expressions in both arms undergo standard arithmetic conversions so that the overall ternary expression has a single well-defined type.</li>
      </ul>
      <pre><code className="language-c">{`// Concise min/max calculation without statement branching:
int min_val = (a < b) ? a : b;

// Defensive pointer dereference guard:
const char *name = (user != NULL) ? user->name : "Anonymous";`}</code></pre>

      <h2>5. Unconditional Branching: goto and Systems Cleanup</h2>
      <p>
        The <code>goto</code> statement performs an unconditional transfer of control to a named label within the current function. A label has function scope and cannot be jumped to from outside its defining function.
      </p>

      <h3>Dijkstra's Critique and Structured Programming</h3>
      <p>
        In 1968, Edsger Dijkstra published his seminal paper <em>"Go To Statement Considered Harmful"</em>, demonstrating that unrestricted backward and forward jumps destroy code locality, break formal verification invariants, and lead to unmaintainable "spaghetti code". In modern application programming, structured loops (<code>while</code>, <code>for</code>) and branches completely replace arbitrary <code>goto</code> statements.
      </p>

      <h3>The Kernel Idiom: Centralized Error Unwinding</h3>
      <p>
        In low-level systems programming (e.g., Linux kernel drivers and file systems), a single function frequently acquires multiple hardware resources in sequence. If an allocation fails midway, all previously allocated resources must be freed in <em>strict reverse order of acquisition</em>. Using nested <code>if-else</code> ladders causes excessive indentation (the "pyramid of doom") and duplicated error cleanup logic.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">The Canonical Linux Kernel Error Unwinding Pattern</h4>
        <pre><code className="text-sm font-mono">{`int initialize_device_subsystem(void) {
    int ret = 0;

    // Step 1: Allocate memory buffer
    char *buf = malloc(PAGE_SIZE);
    if (!buf) {
        ret = -ENOMEM;
        goto err_buf; // Exit immediately; nothing to free
    }

    // Step 2: Acquire hardware mutex lock
    if (pthread_mutex_lock(&dev_lock) != 0) {
        ret = -EBUSY;
        goto err_mutex; // Must release buf before exiting
    }

    // Step 3: Open hardware device descriptor
    int fd = open("/dev/hw0", O_RDWR);
    if (fd < 0) {
        ret = -EIO;
        goto err_fd; // Must release mutex and buf
    }

    // Normal processing path
    configure_device(fd, buf);
    return 0; // Success

// Centralized error unwinding in reverse acquisition order:
err_fd:
    pthread_mutex_unlock(&dev_lock);
err_mutex:
    free(buf);
err_buf:
    return ret; // Single error exit point
}`}</code></pre>
      </div>

      <h2>6. Comprehensive Comparison Summary</h2>
      <p>
        Choosing the right branching structure requires balancing algorithmic complexity, code readability, and compiler dispatch efficiency.
      </p>

      <ComparisonTable {...branchingComparison} />

      <FAQ items={questions} />
    </>
  )
}
