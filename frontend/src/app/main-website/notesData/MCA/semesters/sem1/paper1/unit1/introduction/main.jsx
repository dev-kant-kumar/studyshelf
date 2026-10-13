import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'
import Callout from '@/app/main-website/shared/components/Callout'
import Figure from '@/app/main-website/shared/components/Figure'
import diagram from './system.svg'

export default function Chapter() {
  return <>
    <h2>Before you begin: the foundations you need</h2>
    <p>This chapter assumes no prior programming experience. You need basic arithmetic and a willingness to trace a sequence of steps. This chapter explains bits, instructions, state, encodings, and data contracts. Processor organisation and performance have their own linked chapters. Read the worked examples rather than memorising definitions in isolation.</p>
    <p>The ideas apply to computer-science and computing students internationally. The course and unit labels locate the chapter in this library; they do not change the underlying technical explanations. History and networking are separate chapters within the same unit, not topics you should infer from this introduction.</p>
    <h3>Four questions to carry through the chapter</h3>
    <ol><li><strong>Representation:</strong> how is a real-world quantity encoded?</li><li><strong>Transformation:</strong> which operations change that representation?</li><li><strong>State:</strong> what must the system remember between operations?</li><li><strong>Evidence:</strong> how can you tell whether the result is correct and the design is suitable?</li></ol>
    <p>A calculation is a small example. Suppose you must calculate a percentage. Marks and maximum marks are inputs. Addition and division are transformations. A running total is state. Boundary examples, valid ranges, and an independently calculated result provide evidence. The same questions scale to databases, networks, and distributed applications.</p>
    <h2>1. What is a computer?</h2>
    <p>A computer is a programmable system that represents and processes data according to instructions. Most computers we use are electronic and digital: they operate on discrete representations, usually binary values. They can receive inputs, perform arithmetic and logical operations, maintain state, and produce outputs.</p>
    <p>The word <em>programmable</em> matters. The same laptop can calculate a result, edit an image, or run a database because its instructions can change. A device that performs one fixed electronic function is not automatically a general-purpose computer. Embedded computers may serve a narrow purpose while still executing software.</p>
    <Callout type="definition"><p><strong>Computation</strong> is the execution of well-defined operations on representations. <strong>State</strong> is the information retained at a particular moment, such as a variable value, an open file position, or a device setting.</p></Callout>
    <p>A definition is only the starting point. At MCA level, ask: What is being represented? Which instructions operate on it? Where is the state stored? What assumptions make the result meaningful?</p>

    <h2>2. Input, processing, output, and storage</h2>
    <p>The input–process–output model describes a task from the user's perspective. Storage allows information to be retained for later use. It is a useful model, not a claim that every computation has exactly four separate physical boxes or follows a single straight path.</p>
    <Figure src={diagram} alt="Input reaches a processor containing control logic, an ALU and registers. The processor exchanges instructions and working data with main memory and produces output." caption="A simplified functional view. Persistent storage and device controllers are omitted; real systems have more complex interconnections." width={900} height={300} />
    <h3>Worked example: a marks report</h3>
    <ol>
      <li><strong>Input:</strong> a student's identifier and marks, obtained from a form or a file.</li>
      <li><strong>Validation:</strong> check that marks are numbers within the permitted range and that all required subjects are present.</li>
      <li><strong>Processing:</strong> calculate the total and percentage using the actual assessment rules.</li>
      <li><strong>Output:</strong> display a report. A printer or another application could also receive it.</li>
      <li><strong>Storage:</strong> save a record so it can be retrieved. A displayed result is not necessarily a saved result.</li>
    </ol>
    <p>Input is not limited to keyboards, and output is not limited to screens. A sensor supplies input; an actuator receives output. A network interface can both receive and transmit data. A disk operation may read data into a program or write results back to storage.</p>
    <Callout type="mistake"><p>Do not classify a device without specifying its role. A touchscreen provides output through its display and input through touch sensing. A network interface is not only an output device because one example happens to send data.</p></Callout>

    <h2>3. Data, information, and representation</h2>
    <p><strong>Data</strong> is a representation that a system records or processes. <strong>Information</strong> is the meaning a person or another system obtains by interpreting that data in context. The distinction depends on use: the output of one process can become the input data of another.</p>
    <p>The value <code>75</code> is ambiguous without context. It might mean a mark, a temperature, or a percentage. Knowing that it is 75 marks out of 100 changes what can be inferred. Units, valid ranges, field names, and data types are part of the interpretation.</p>
    <h3>Bits do not carry their own meaning</h3>
    <p>A bit has two possible values. An eight-bit pattern has 256 possible combinations. The pattern <code>01000001</code> can denote unsigned integer 65 or, under ASCII, the character A. An encoding or type tells the system how to interpret the pattern. Text, images, and instructions use different interpretation rules.</p>
    <p>A byte is eight bits in modern systems. More bits allow more distinct patterns, but do not automatically make the data accurate or useful. A number format may have a limited range or precision. Number systems and overflow are studied in detail in Unit 2.</p>
    <h3>Accuracy starts before calculation</h3>
    <p>If a marks program accepts 750 instead of 75, arithmetic may be performed exactly and the report may still be wrong. Check data validity, algorithm correctness, numerical representation, and the rules used to interpret the result. This is the practical meaning of garbage in, garbage out.</p>

    <h3>Derive the number of representable values</h3>
    <p>For each bit there are two choices. With two independent bits there are 2 × 2 = 4 patterns: 00, 01, 10, 11. With n bits there are 2 raised to n patterns. If all patterns encode non-negative integers starting at zero, the largest is 2 raised to n minus 1. Eight bits therefore represent unsigned values from 0 through 255.</p>
    <p>This is a count of patterns, not a universal rule for every data type. A signed representation allocates patterns differently. A character encoding assigns patterns to symbols or sequences. A floating-point format divides bits into fields with its own interpretation. Never derive a type’s range from the word “byte” alone.</p>
    <h3>Worked example: interpret one byte</h3>
    <p>In 01000001, the set bits have place values 64 and 1. The unsigned integer is therefore 65. Under ASCII it represents A. Add one to the integer and you get 66; concatenate the character A with another character and you create a string. Operations depend on meaning, not just on the physical pattern.</p>
    <h3>Data quality and a usable contract</h3>
    <p>A contract specifies valid inputs, expected outputs, and behaviour on errors. For a marks calculator, say whether absent marks are allowed, whether fractional marks are valid, whether different subjects have different maxima, and whether rounding occurs only for display. Missing data and zero are not interchangeable.</p>
    <p>Check completeness, range, type, consistency, and origin where relevant. A field can be syntactically valid yet wrong: 75 is a permitted mark but may belong to a different student. Validation catches specified invalid cases; it does not establish that every accepted fact is true.</p>
    <h3>Numerical accuracy and representation limits</h3>
    <p>Many decimal fractions have no exact finite binary fractional representation. Common floating-point operations therefore use nearby representable values. Rounding the displayed result does not make the stored value exact. A suitable representation and comparison rule depend on the problem.</p>
    <p>Do not use approximate arithmetic where the specification requires exact equality without considering alternatives. Integer minor units, decimal arithmetic, and rational arithmetic each have costs and limits. This distinction is part of system correctness, not merely a formatting issue.</p>
    <FAQ items={questions.filter(item => ['computer-vs-device', 'data-context', 'binary-why', 'encoding', 'unicode-length', 'float'].includes(item.id))} />
    <h2>Revision checkpoints</h2>
    <p>Explain the main mechanisms in your own words, reproduce the worked examples without looking, and answer the tagged questions before expanding their solutions. When an answer depends on assumptions, state them explicitly.</p>
    <h2>References and further reading</h2>
    <p>The supplied MCA syllabus defines the topic placement (Fundamentals of Computers, PDF page 9). The chapter explains its prerequisites and worked examples directly; the references support verification and optional further study. The explanations, examples, diagrams, and practice questions here are original teaching material.</p>
    <ul><li><a href="https://cs50.harvard.edu/x/notes/0/">Harvard CS50, Lecture 0</a>: introductory problem solving and binary representations.</li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf">Operating Systems: Three Easy Pieces, Introduction to Operating Systems</a>, by Remzi and Andrea Arpaci-Dusseau: processes, resource management, and persistence.</li><li><a href="https://docs.python.org/3/tutorial/floatingpoint.html">Python documentation: floating-point limitations</a>: representation error and numeric comparisons.</li><li><a href="https://www.unicode.org/faq/utf_bom.html">Unicode Consortium: UTF encodings</a>: bytes, code points, and encodings.</li><li><a href="https://www.cs.cornell.edu/courses/cs314/2004fa/l10.pdf">Cornell computer architecture lecture: performance</a>: performance metrics and Amdahl’s law.</li><li><a href="https://pages.cs.wisc.edu/~remzi/Classes/537/Fall2022/Book/file-devices.pdf">OSTEP: I/O devices</a>: polling, interrupts, and DMA.</li><li><a href="https://courses.csail.mit.edu/6.045/spring07/materials.html">MIT: automata, computability, and complexity</a>: the boundaries of algorithmic computation.</li></ul>
  </>
}
