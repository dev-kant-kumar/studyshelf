import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from '../introduction/questions'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'

export default function Chapter() {
  return <>
    <p>Use the earlier computer-foundation chapters when following this integrated case. The goal is to explain what an application must do, how its components cooperate, and what evidence establishes useful and dependable behaviour.</p>
    <h2>What you will learn</h2>
    <p>Connect domains to requirements; design and validate a complete marks-report task; reason about persistence, security, performance, and failures; test boundary and invalid inputs.</p>
    <h2>1. Applications: connect the task to the system</h2>
    <p>In education, computers organise learning material and assessment records. In scientific work, they process measurements and run models. In business, they manage transactions and reports. In embedded control, they read sensors and influence devices. In communication, they exchange information over networks.</p>
    <p>For an exam answer, give a concrete task rather than just listing sectors. For deeper understanding, identify the input, processing, output, retained state, and failure conditions. A scientific model can produce a precise numerical result while relying on an inaccurate assumption; computation does not remove the need to evaluate the model.</p>

    <h3>A complete case study: design a marks-report task</h3>
    <p><strong>Requirement:</strong> calculate an aggregate percentage for supplied subject records and explain invalid inputs. Each subject has obtained marks and its own maximum. The intended aggregate is total obtained marks divided by total maximum marks. This is different from an unweighted average of individual percentages.</p>
    <p>Take two subjects: 45 out of 50 and 60 out of 100. Total marks are 105 out of 150, giving 70%. The average of the separate percentages is (90% + 60%)/2 = 75%. Both calculations are arithmetically valid, but only one matches this stated aggregate requirement. A real institution’s assessment rules determine which calculation is appropriate.</p>
    <CodeBlock language="Language-independent pseudocode" code={`if no subject records exist:
    report "At least one subject is required"
    stop

total_obtained = 0
total_maximum = 0
for each subject:
    require numeric obtained and maximum
    require maximum > 0
    require 0 <= obtained <= maximum
    total_obtained += obtained
    total_maximum += maximum

percentage = 100 * total_obtained / total_maximum
display percentage rounded for presentation`} />
    <p><strong>Invariant:</strong> after each iteration, the running totals equal the sums for the records already processed. Initially both are zero, which is correct for zero processed records. Adding the next valid record preserves that statement. At termination, the totals cover all records. Validation ensures the denominator is positive and the obtained total cannot exceed it.</p>
    <p>An invariant is a statement maintained across a sequence of steps. It connects the implementation to the required result. Testing examples checks selected executions; an invariant argument explains why the loop’s accumulation is correct under its assumptions.</p>
    <ComparisonTable caption="Representative tests for the aggregate-percentage contract" headers={['Input', 'Expected result', 'Purpose']} rows={[
      ['45/50 and 60/100', '70%', 'Different maxima and aggregate interpretation'],
      ['0/100 and 0/100', '0%', 'Valid lower boundary'],
      ['50/50 and 100/100', '100%', 'Valid upper boundary'],
      ['101/100', 'Reject', 'Out-of-range obtained marks'],
      ['0/0', 'Reject', 'Invalid maximum and division safety'],
      ['No records', 'Reject', 'Empty-input contract'],
    ]} />
    <p>Storage and privacy requirements are separate decisions. A calculation-only tool need not collect a student’s identity. If results are retained, define who can read or modify them, what “saved” promises, and how failures are reported. Collecting unnecessary identifying data creates responsibilities without improving the arithmetic.</p>
    <h2>2. Integrated practice: apply the earlier foundations</h2>
    <p>These are original practice questions, not previous-year questions. Use them to practise short explanations, structured answers, viva responses, and practical reasoning.</p>
    <ol>
      <li><strong>Short answer:</strong> define a computer and explain why programmability matters.</li>
      <li><strong>Short answer:</strong> distinguish data and information using the value 75.</li>
      <li><strong>Explain with a diagram:</strong> describe the processor, main memory, and input/output in a marks-report application.</li>
      <li><strong>Reasoning:</strong> why can a computer calculate accurately and still return an incorrect percentage?</li>
      <li><strong>Trace:</strong> find the successive totals and final percentage in the pseudocode above.</li>
      <li><strong>Performance:</strong> a task spends 6 seconds computing and 4 seconds waiting. If computation becomes twice as fast, find the new time and speedup.</li>
      <li><strong>Viva:</strong> explain why a touchscreen is both input and output, and why firmware is software.</li>
      <li><strong>Practical:</strong> inspect your device's CPU, RAM, and storage using system settings. Record capacities separately from processor clock information; do not change settings.</li>
    </ol>
    <FAQ title="Practice answer checkpoints" showGuide={false} items={[{
      id: 'practice-checkpoints', question: 'How should I answer the eight practice questions above?',
      level: 'medium', tags: ['Exam practice', 'Practical'],
      answer: <ol><li>A programmable system processes representations according to instructions; software changes the task.</li><li>75 becomes meaningful when a context and unit are supplied, such as marks out of 100.</li><li>Inputs must be validated; memory holds working state, the CPU executes operations, output shows results, and storage retains records.</li><li>Check data, maximum marks, the formula, and numeric representation. Correct arithmetic does not repair a wrong assumption.</li><li>Totals: 72, 153, 220. Percentage: approximately 73.33%.</li><li>New time: 3 + 4 = 7 seconds. Speedup: 10/7, approximately 1.43 times. The time reduction is 30%.</li><li>Touch sensing supplies input; display supplies output. Firmware consists of instructions, even when kept on a physical chip.</li><li>Describe what each specification measures. A device inspection does not establish performance for every workload.</li></ol>,
    }]} />
    <h3>Use a systematic troubleshooting exercise</h3>
    <p>A report is correct on screen but absent after restarting the application. Write three hypotheses and describe evidence that distinguishes them: the application never saved, it saved to a different location, or saving failed. Avoid jumping straight to “the CPU is broken”. A master's student should be able to move from symptoms to testable explanations.</p>

    <h3>Worked reasoning exercise: a slow import</h3>
    <p>A task spends 12 seconds parsing input, 3 seconds calculating, and 5 seconds saving. Total elapsed time is 20 seconds. A four-times faster calculation takes 0.75 seconds, reducing total time to 17.75 seconds. Speedup is 20/17.75, approximately 1.13; the time reduction is 11.25%.</p>
    <p>Now halve parsing time instead. New total is 6 + 3 + 5 = 14 seconds: approximately 1.43 times speedup and 30% less time. The important lesson is to identify the dominant cost. These stages are assumed sequential; if stages overlap, build a model of the actual overlap rather than adding durations blindly.</p>
    <h3>Three practical investigations</h3>
    <ol><li><strong>Observe state:</strong> create a disposable text file, save one change, make a second unsaved change, and compare the reopened file. Use a test file, not valuable work. Explain which state lived in memory and which was retained.</li><li><strong>Distinguish quantities:</strong> record your device’s RAM and storage capacities. Explain why neither number states how many instructions a program completes per second.</li><li><strong>Trace independently:</strong> change the toy-machine inputs to 9 and 4. Produce the PC, ACC, and result-memory trace before checking your answer. The stored result should be 13.</li></ol>
    <p>For each investigation, write what you observed, what it supports, and what it does not establish. One correctly reopened file does not prove durability under every possible crash. One fast task does not prove a machine is faster for every workload.</p>
    <h2>3. Revision checklist and next steps</h2>
    <ul><li>Define a computer without claiming it is infallible or human-like.</li><li>Trace a real task through input, processing, output, memory, and storage.</li><li>Explain how representations acquire meaning through encodings and context.</li><li>Distinguish hardware, software, firmware, programs, and processes.</li><li>Describe conceptual instruction execution without presenting it as a modern processor timing trace.</li><li>Distinguish latency from throughput and calculate a bottleneck example.</li><li>Support each characteristic with an example and a limitation.</li></ul>
    <p>Continue with Computer networks: foundations and end-to-end communication, then the remaining networking chapters. Binary arithmetic, logic gates, and detailed architecture belong to Unit 2; memory hierarchies and operating-system details follow in Unit 3.</p>
    <FAQ items={questions.filter(item => ['correct-secure', 'save-durability', 'ai-correctness', 'testing-boundary', 'troubleshoot', 'exam-answer'].includes(item.id))} />
    <h2>Revision checkpoints</h2>
    <p>Explain the main mechanisms in your own words, reproduce the worked examples without looking, and answer the tagged questions before expanding their solutions. When an answer depends on assumptions, state them explicitly.</p>
    <h2>References and further reading</h2>
    <p>The supplied MCA syllabus defines the topic placement (Fundamentals of Computers, PDF page 9). The chapter explains its prerequisites and worked examples directly; the references support verification and optional further study. The explanations, examples, diagrams, and practice questions here are original teaching material.</p>
    <ul><li><a href="https://cs50.harvard.edu/x/notes/0/">Harvard CS50, Lecture 0</a>: introductory problem solving and binary representations.</li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf">Operating Systems: Three Easy Pieces, Introduction to Operating Systems</a>, by Remzi and Andrea Arpaci-Dusseau: processes, resource management, and persistence.</li><li><a href="https://docs.python.org/3/tutorial/floatingpoint.html">Python documentation: floating-point limitations</a>: representation error and numeric comparisons.</li><li><a href="https://www.unicode.org/faq/utf_bom.html">Unicode Consortium: UTF encodings</a>: bytes, code points, and encodings.</li><li><a href="https://www.cs.cornell.edu/courses/cs314/2004fa/l10.pdf">Cornell computer architecture lecture: performance</a>: performance metrics and Amdahl’s law.</li><li><a href="https://pages.cs.wisc.edu/~remzi/Classes/537/Fall2022/Book/file-devices.pdf">OSTEP: I/O devices</a>: polling, interrupts, and DMA.</li><li><a href="https://courses.csail.mit.edu/6.045/spring07/materials.html">MIT: automata, computability, and complexity</a>: the boundaries of algorithmic computation.</li></ul>
  </>
}
