import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from '../introduction/questions'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'

export default function Chapter() {
  return <>
    <p>A fast system is useful only if it delivers the required result under the relevant conditions. Read Introduction to computers first for data and computation; The computer system explains the execution machinery behind the performance models.</p>
    <h2>What you will learn</h2>
    <p>Explain each characteristic with its limits; distinguish correctness, reliability, and security; derive CPU time and Amdahl speedup; compare latency, throughput, and algorithmic growth.</p>
    <h2>1. Characteristics: strengths with conditions</h2>
    <ComparisonTable caption="Common textbook characteristics, interpreted carefully" headers={['Characteristic', 'Useful meaning', 'Important limit']} rows={[
      ['Speed', 'Can execute many operations quickly', 'A slow algorithm or input/output bottleneck can dominate'],
      ['Accuracy', 'Follows defined operations consistently', 'Bad data, bugs, overflow and rounding can give wrong results'],
      ['Automation', 'Can carry out a programmed sequence with limited intervention', 'Requires correct setup and handling of exceptional cases'],
      ['Diligence', 'Does not experience human boredom or fatigue', 'Hardware can fail and software can leak resources'],
      ['Storage', 'Can retain and retrieve large amounts of data', 'Capacity is finite; durability needs backups and sound design'],
      ['Versatility', 'Can perform many tasks by running different software', 'Hardware and software still constrain what is practical'],
    ]} />
    <p>A computer does not automatically understand the intention behind an input. Even an AI application depends on representations, algorithms, training or rules, and an execution environment. Fluent output is not evidence that an answer is correct.</p>

    <h2>2. Deeper understanding expected at MCA level</h2>
    <h3>Abstraction and layers</h3>
    <p>An abstraction exposes useful behaviour while hiding some details. A file interface lets you read and write data without manually controlling the storage device. A function lets a caller request a result without copying its implementation. Good abstractions reduce complexity, but they have contracts and costs.</p>
    <p>When a file write fails, you may need to inspect permissions, free space, or the storage device. The lesson is not to memorise every implementation detail; it is to understand enough of the layer below to diagnose failures and make informed choices.</p>
    <h3>Latency, throughput, and bottlenecks</h3>
    <p><strong>Latency</strong> is the time taken for a particular operation or request. <strong>Throughput</strong> is the amount of work completed per unit time. A server can increase throughput by handling more requests concurrently without reducing each request's latency.</p>
    <p>Suppose one task spends 2 seconds computing and 8 seconds waiting for storage. Halving computation time reduces the total from 10 to 9 seconds: only a 10% reduction. The overall speedup is 10/9, approximately 1.11 times. Improving the fastest-looking component is not always the useful improvement.</p>
    <p>Clock frequency counts cycles per second, not completed instructions or useful answers per second. Compare complete workloads, including memory behaviour, instruction mix, available parallelism, storage, and software. A clock-rate comparison alone is insufficient across different processors.</p>
    <h3>Calculate CPU time instead of guessing from GHz</h3>
    <p>For a simplified CPU execution model, total cycles equal instruction count multiplied by average cycles per instruction (CPI). Time equals cycles divided by clock frequency. Keep units consistent: 2 GHz is 2 billion cycles per second, not 2 billion completed useful tasks per second.</p>
    <CodeBlock language="Performance model" code={`CPU time = instruction count × average CPI / clock frequency

Example A: 1,000,000 × 2 / 2,000,000,000 = 0.001 s
Example B: 1,000,000 × 3 / 3,000,000,000 = 0.001 s`} />
    <p>These examples have equal modelled CPU times even though the clock rates differ. Across different architectures or compiler outputs, instruction counts can differ too. Real elapsed time can include waiting and other system effects. The formula organises reasoning; it is not a replacement for measuring a workload.</p>
    <h3>Derive the limit on improving only part of a task</h3>
    <p>Normalise the original execution time to 1. If fraction p is improved by factor s, that part now takes p/s; the unchanged part still takes 1 − p. New time is (1 − p) + p/s. Overall speedup is its reciprocal. This is Amdahl’s law for the stated fixed-workload assumptions.</p>
    <p>When p = 0.8 and s = 4, new time is 0.2 + 0.2 = 0.4 and speedup is 2.5. Even if the improved part took no time, the remaining 0.2 would limit the speedup to 5. Communication overhead or a changed workload can invalidate the simple assumptions, so state them when using the model.</p>
    <h3>Algorithmic growth versus a constant-factor improvement</h3>
    <p>Suppose a simplified method performs n squared comparisons and another performs n comparisons. At n = 1000 their counts are 1,000,000 and 1000. Doubling the input multiplies the first count by four and the second by two. A ten-times faster processor cannot universally compensate for that difference as input grows.</p>
    <p>This does not mean that an asymptotically better method always wins for every small input. Constants, memory access, preprocessing, and input properties matter. First check that both methods solve the same problem; then analyse growth and measure representative cases. Complexity is about resource growth, not a promise of a particular number of seconds.</p>
    <h3>Measure the right workload</h3>
    <p>Define the task, input size, output requirements, and environment. Separate startup from steady-state behaviour when that distinction matters. Record elapsed time, memory use, and relevant failure rates rather than one unexplained “speed” number. Repeat measurements enough to detect unstable results.</p>
    <p>A benchmark that reads already-cached data may answer a different question from a first read after startup. An average response time can hide long tail delays. A faster answer is useless if the implementation silently drops required work or produces incorrect output.</p>
    <h3>Correctness, reliability, and security are different</h3>
    <p>A marks calculation can be arithmetically correct but unreliable if the result disappears after a crash. It can be reliable at storing records yet insecure if anyone can modify another student's marks. Ask separately whether the computation is correct, whether the service remains dependable, and whether access and data are protected.</p>

    <FAQ items={questions.filter(item => ['clock-performance', 'amdahl', 'latency-throughput', 'algorithm-scale', 'parallel-limit', 'universal'].includes(item.id))} />
    <h2>Revision checkpoints</h2>
    <p>Explain the main mechanisms in your own words, reproduce the worked examples without looking, and answer the tagged questions before expanding their solutions. When an answer depends on assumptions, state them explicitly.</p>
    <h2>References and further reading</h2>
    <p>The supplied MCA syllabus defines the topic placement (Fundamentals of Computers, PDF page 9). The chapter explains its prerequisites and worked examples directly; the references support verification and optional further study. The explanations, examples, diagrams, and practice questions here are original teaching material.</p>
    <ul><li><a href="https://cs50.harvard.edu/x/notes/0/">Harvard CS50, Lecture 0</a>: introductory problem solving and binary representations.</li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf">Operating Systems: Three Easy Pieces, Introduction to Operating Systems</a>, by Remzi and Andrea Arpaci-Dusseau: processes, resource management, and persistence.</li><li><a href="https://docs.python.org/3/tutorial/floatingpoint.html">Python documentation: floating-point limitations</a>: representation error and numeric comparisons.</li><li><a href="https://www.unicode.org/faq/utf_bom.html">Unicode Consortium: UTF encodings</a>: bytes, code points, and encodings.</li><li><a href="https://www.cs.cornell.edu/courses/cs314/2004fa/l10.pdf">Cornell computer architecture lecture: performance</a>: performance metrics and Amdahl’s law.</li><li><a href="https://pages.cs.wisc.edu/~remzi/Classes/537/Fall2022/Book/file-devices.pdf">OSTEP: I/O devices</a>: polling, interrupts, and DMA.</li><li><a href="https://courses.csail.mit.edu/6.045/spring07/materials.html">MIT: automata, computability, and complexity</a>: the boundaries of algorithmic computation.</li></ul>
  </>
}
