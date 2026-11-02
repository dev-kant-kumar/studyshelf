import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const threatTaxonomyTable = {
    caption: 'Taxonomy of Operating System Threats: Program vs System/Network',
    headers: ['Threat Category', 'Specific Threat Name', 'Underlying Exploitation Mechanism', 'Primary System Impact', 'Key Mitigation Strategy'],
    rows: [
      [
        'Program Threat',
        'Stack Buffer Overflow',
        'Unbounded string copying (strcpy) overwriting saved return pointer.',
        'Arbitrary shellcode execution with host process privileges.',
        'Stack Canaries, Non-Executable Stack (DEP/NX), ASLR.'
      ],
      [
        'Program Threat',
        'Trojan Horse',
        'Disguised malicious payload inside a seemingly benign application.',
        'Credential exfiltration, remote backdoor installation.',
        'Digital code signing, least privilege execution, sandboxing.'
      ],
      [
        'Program Threat',
        'Network Worm',
        'Standalone process exploiting unpatched network daemon vulnerabilities.',
        'Autonomous self-propagation, network saturation, data destruction.',
        'Network firewalls, prompt security patching, memory-safe languages.'
      ],
      [
        'System Threat',
        'TCP SYN Flood (DoS)',
        'Spoofed TCP SYN packets exhausting half-open connection queues.',
        'Server crashes or drops legitimate user connections.',
        'Linux SYN Cookies, connection rate limiting, anycast scrubbing.'
      ],
      [
        'System Threat',
        'Man-in-the-Middle (MitM)',
        'ARP cache poisoning or DNS spoofing on unauthenticated channels.',
        'Passive eavesdropping, active session hijacking, credential theft.',
        'End-to-end mutual authentication via TLS 1.3, IPsec, DNSSEC.'
      ]
    ]
  }

  const idsComparisonTable = {
    caption: 'Intrusion Detection Paradigms: Signature-Based vs Anomaly-Based IDS',
    headers: ['Evaluation Parameter', 'Signature-Based IDS (e.g., Snort, Suricata)', 'Anomaly-Based IDS (Heuristic / ML)'],
    rows: [
      [
        'Detection Mechanism',
        'Compares packet bytes and logs against a database of known exploit signatures.',
        'Builds a statistical baseline of normal behavior; flags significant deviations.'
      ],
      [
        'Zero-Day Vulnerabilities',
        'Completely ineffective: unknown attack patterns produce zero matches.',
        'Highly effective: novel attack patterns trigger anomalous behavior alerts.'
      ],
      [
        'False Positive Rate',
        'Extremely low: alerts fire only on precise, verified pattern matches.',
        'Moderate to high: legitimate bursty user activity may trigger false alarms.'
      ],
      [
        'Computational Overhead',
        'Low: linear string and regular expression pattern matching in memory.',
        'High: requires continuous statistical modeling and metric aggregation.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Operating system security protects hardware assets, memory boundaries, and user data against malicious exploitation.
        This technical guide examines the CIA Triad, the anatomy of program threats including stack smashing buffer overflows
        and their modern compiler/hardware mitigations, self-propagating network worms, kernel defenses against TCP SYN floods,
        and proactive threat monitoring architectures utilizing eBPF and intrusion detection systems.
      </p>

      <h2>1. The Security Problem and the CIA Triad</h2>
      <p>
        The security posture of an operating system rests upon three foundational guarantees known as the <strong>CIA Triad</strong>:
      </p>
      <ul>
        <li>
          <strong>Confidentiality:</strong> Restricts resource access strictly to authorized principals.
          Violations occur when unauthorized processes read sensitive memory, inspect passwords in <code>/etc/shadow</code>,
          or intercept cleartext network packets.
        </li>
        <li>
          <strong>Integrity:</strong> Ensures that data and programs can only be modified by authorized identities through approved actions.
          Violations include trojanized system binary replacements, unauthorized database row modifications, or memory corruption.
        </li>
        <li>
          <strong>Availability:</strong> Guarantees that computing services (CPU cores, RAM, network interfaces, disk arrays)
          remain continuously accessible to legitimate users upon request.
        </li>
      </ul>

      <ComparisonTable {...threatTaxonomyTable} />

      <h2>2. Deep-Dive: The Stack Buffer Overflow Vulnerability</h2>
      <p>
        The classic buffer overflow (first brought to prominence by the 1988 Morris Internet Worm) exploits
        unsafe memory management in compiled C and C++ programs:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          Anatomy of a Stack Smashing Attack
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3 font-sans">
          When a C function is invoked, the compiler allocates an activation frame on the thread call stack:
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div className="text-ink/70 dark:text-night-ink/70">// High Memory Addresses (Top of Stack Frame)</div>
          <div className="p-2 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line">
            <strong>Saved Return Instruction Pointer ($rip / $eip)</strong> &rarr; Where CPU execution returns after ret.
          </div>
          <div className="p-2 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line">
            <strong>Saved Base / Frame Pointer ($rbp / $ebp)</strong> &rarr; Caller stack frame base.
          </div>
          <div className="p-2 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line text-danger dark:text-night-danger">
            <strong>Local Buffer: char input[64]</strong> &rarr; Buffer allocated on stack.
          </div>
          <div className="text-ink/70 dark:text-night-ink/70">// Low Memory Addresses (Stack grows downward towards zero)</div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-sans">
          <div className="font-bold text-danger dark:text-night-danger">The Exploit Mechanism:</div>
          <p className="text-ink/80 dark:text-night-ink/80 mt-1">
            Functions like <code>strcpy(input, user_str)</code> copy data without boundary verification.
            An attacker supplies an input payload of 80 bytes: the first 64 bytes fill the buffer, the next 8 bytes overwrite
            <code>$rbp</code>, and the final 8 bytes overwrite the <strong>Saved Return Address ($rip)</strong> with the address of
            injected shellcode. When the function executes <code>ret</code>, the CPU jumps directly to the attacker shellcode!
          </p>
        </div>
      </div>

      <h3>Modern Operating System Mitigations</h3>
      <p>
        Modern operating systems and compilers deploy a multi-layered defense to neutralize stack smashing attacks:
      </p>
      <ul>
        <li>
          <strong>Stack Canaries (StackGuard / GCC <code>-fstack-protector</code>):</strong> The compiler inserts a randomized
          secret 64-bit integer (the canary) directly between local buffers and the saved return pointer.
          Before the <code>ret</code> instruction executes, the function verifies that the canary value remains untampered.
          If an overflow overwrote the canary, the kernel terminates the process immediately (<code>SIGSEGV / abort</code>).
        </li>
        <li>
          <strong>Data Execution Prevention (DEP) / NX Bit:</strong> Hardware-enforced protection in the CPU Memory Management Unit.
          Pages in the stack and heap are marked with the <strong>No-Execute (NX)</strong> bit in their page table entries.
          If the CPU instruction pointer ever attempts to fetch instructions from stack memory, the hardware fires a trap, preventing shellcode execution.
        </li>
        <li>
          <strong>Address Space Layout Randomization (ASLR):</strong> The operating system kernel loader randomizes the virtual memory
          base addresses of the stack, heap, shared libraries (<code>libc</code>), and executable binary on every launch,
          preventing attackers from reliably guessing jump targets.
        </li>
      </ul>

      <h2>3. Program Threats: Viruses vs Worms</h2>
      <p>
        Malicious software is classified by its dependency on a host program and its propagation vector:
      </p>
      <ul>
        <li>
          <strong>Viruses:</strong> Parasitic code fragments that append or inject themselves into legitimate executable host files.
          A virus cannot execute or spread independently: it requires a user or scheduled system task to execute the infected host program.
        </li>
        <li>
          <strong>Worms:</strong> Standalone, autonomous processes that replicate across computer networks without human intervention.
          A worm actively scans target subnets for vulnerable network ports, transmits an exploit payload, spawns a new instance of itself
          on the victim machine, and immediately begins scanning for further targets, creating exponential infection waves.
        </li>
      </ul>

      <h2>4. System &amp; Network Threats: DoS and SYN Floods</h2>
      <p>
        Denial of Service (DoS) attacks seek to exhaust finite operating system resources rather than steal credentials.
        The most notorious network-layer attack is the <strong>TCP SYN Flood</strong>:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          The SYN Flood Attack &amp; Kernel SYN Cookie Defense
        </h4>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-danger dark:text-night-danger font-sans">1. The Attack Vulnerability</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80 font-sans">
              During the TCP 3-way handshake, a client sends a <code>SYN</code> packet. The server allocates a Transmission Control Block (TCB)
              in its half-open connection backlog queue in kernel RAM, replies with <code>SYN-ACK</code>, and waits for the final <code>ACK</code>.
              The attacker sends tens of thousands of spoofed <code>SYN</code> packets per second and intentionally never replies with the <code>ACK</code>.
              The kernel backlog queue saturates completely, forcing the server to reject all incoming legitimate client connections.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success font-sans">2. The Linux SYN Cookie Solution</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80 font-sans">
              When the backlog queue fills, the kernel activates <strong>SYN Cookies</strong>: it stops allocating memory in RAM for half-open connections.
              Instead, it encodes the client IP, port, and a cryptographic timestamp into the 32-bit Initial Sequence Number (ISN) of the <code>SYN-ACK</code> packet.
              When a genuine client returns the final <code>ACK</code>, the server extracts and validates the sequence number mathematically,
              instantiating the connection without having wasted any kernel memory during the wait phase!
            </p>
          </div>
        </div>
      </div>

      <h2>5. Threat Monitoring: IDS and Kernel eBPF</h2>
      <p>
        Operating systems actively detect intrusions using complementary monitoring strategies:
      </p>

      <ComparisonTable {...idsComparisonTable} />

      <Callout type="tip" title="Modern Threat Monitoring: eBPF in Linux">
        Traditional audit systems (like <code>auditd</code>) incur substantial context-switch overhead when tracing thousands of system calls per second.
        Modern Linux security engines (like Cilium Tetragon and Falco) leverage <strong>Extended Berkeley Packet Filter (eBPF)</strong>.
        eBPF executes sandboxed bytecode programs directly inside the Linux kernel at the point of system call execution (<code>execve</code>, <code>connect</code>, <code>openat</code>).
        It inspects process arguments in real time with sub-microsecond latency, allowing the kernel to kill malicious processes before damage occurs.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
