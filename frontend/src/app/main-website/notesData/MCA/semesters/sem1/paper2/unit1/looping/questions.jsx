const questions = [
  {
    id: 'entry-vs-exit-controlled-loops',
    level: 'easy',
    tags: ['Control flow', 'Conceptual'],
    question: "What is the structural and semantic difference between entry-controlled and exit-controlled loops?",
    answer: "In an entry-controlled loop (such as while or for), the controlling condition is evaluated prior to executing the loop body. If the condition is initially false, the loop body executes zero times. In an exit-controlled loop (such as do-while), the loop body executes unconditionally once before the controlling condition is evaluated at the end of the iteration. Therefore, an exit-controlled loop guarantees that the body executes at least once, making it ideal for interactive menus, input validation prompts, and retry sequences."
  },
  {
    id: 'continue-in-for-vs-while',
    level: 'medium',
    tags: ['Control flow', 'Pitfalls'],
    question: "How does the continue statement behave differently in a for loop compared to a while loop?",
    answer: "In a while loop, executing a continue statement immediately skips all remaining statements in the loop body and transfers control directly to the conditional test expression. If the variable increment step was located below the continue statement, skipping it can cause an accidental infinite loop. In a for loop, executing a continue statement skips the remaining body but transfers control directly to the iteration/update expression (e.g., i++) before re-evaluating the test condition, ensuring progress toward loop termination."
  },
  {
    id: 'unsigned-counter-underflow-infinite-loop',
    level: 'medium',
    tags: ['Integer overflow', 'Bugs'],
    question: "Why does the loop 'for (unsigned int i = 10; i >= 0; i--)' result in an infinite loop?",
    answer: "The variable i is declared as an unsigned integer, which cannot represent negative values. When i reaches 0 and decrements by 1 (i--), it does not become -1; instead, it undergoes modular unsigned integer wrap-around to UINT_MAX (4,294,967,295 on 32-bit systems). Because every unsigned integer value is mathematically greater than or equal to 0, the condition i >= 0 is permanently true, creating an infinite loop. To iterate downward safely, either use a signed integer or structure the test condition as 'for (unsigned int i = 10; i > 0; i--)' and index using i - 1."
  },
  {
    id: 'loop-invariants-formal-correctness',
    level: 'hard',
    tags: ['Formal methods', 'Algorithms'],
    question: "What is a loop invariant, and what three properties must be proven to establish formal loop correctness?",
    answer: "A loop invariant is a formal logical assertion about program state that remains true before and after every iteration of a loop. To prove that an iterative algorithm is correct using Hoare logic, three mathematical properties must be proven: 1. Initialization (the invariant holds true prior to the first iteration of the loop); 2. Maintenance (if the invariant is true before an iteration and the loop test holds, the invariant remains true after the iteration completes); and 3. Termination (the loop terminates after a finite number of steps, and at termination, the invariant combined with the failure of the loop condition proves the algorithmic post-condition)."
  },
  {
    id: 'float-equality-hazard-in-loops',
    level: 'hard',
    tags: ['Floating point', 'IEEE 754'],
    question: "Why is testing floating-point variables for exact equality (e.g., x != 1.0) hazardous in loop termination conditions?",
    answer: "Floating-point numbers in C are encoded using IEEE 754 binary fractions. Decimal fractions such as 0.1 have no exact finite binary representation and produce recurring rounding errors (e.g., 0.0001100110011...). Accumulating 0.1 repeatedly does not produce exactly 1.0; instead, the accumulator evaluates to values like 0.9999999999999999 and then 1.0000000000000002, skipping 1.0 entirely. Consequently, an exact inequality check such as while (x != 1.0) never becomes false, triggering an infinite loop. Floating-point loop conditions must always use relative threshold bounds or epsilon checks: fabs(x - 1.0) > 1e-6."
  }
]

export default questions
