import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const aclVsCapabilitiesTable = {
    caption: 'Comparative Analysis: Access Control Lists (ACLs) vs Capability Lists (C-Lists)',
    headers: ['Evaluation Parameter', 'Access Control Lists (ACLs - Column Slicing)', 'Capability Lists (C-Lists - Row Slicing)'],
    rows: [
      [
        'Architectural Orientation',
        'Object-centric: rights stored with the resource (e.g., file inode).',
        'Subject-centric: tickets stored with the process / domain.'
      ],
      [
        'Core Question Answered',
        '&ldquo;Who is authorized to access this resource?&rdquo;',
        '&ldquo;What resources is this subject permitted to touch?&rdquo;'
      ],
      [
        'Verification Overhead',
        'Moderate: kernel must search the list of principals during open().',
        'Instantaneous: presenting a valid, unforgeable capability grants access.'
      ],
      [
        'Revocation Complexity',
        'Trivial: remove the subject entry from the object ACL.',
        'Extremely complex: capabilities are dispersed across process spaces.'
      ],
      [
        'Distributed Systems Fit',
        'Requires querying centralized directory services (LDAP/AD).',
        'Natural fit: capabilities can be cryptographically signed (JWT, Kerberos).'
      ]
    ]
  }

  const accessModelsTable = {
    caption: 'Access Control Paradigms: DAC vs MAC vs RBAC',
    headers: ['Model', 'Authority Over Permissions', 'Policy Flexibility', 'Primary Use Case', 'Vulnerability Profile'],
    rows: [
      [
        'Discretionary Access Control (DAC)',
        'Resource Owner (creator of the file determines permissions).',
        'High: users can grant read/write permissions at will.',
        'Standard desktop & consumer operating systems (UNIX chmod, Windows).',
        'Vulnerable to Trojan horses leaking confidential data to world.'
      ],
      [
        'Mandatory Access Control (MAC)',
        'Central Operating System Kernel (enforces security clearance labels).',
        'Strict & non-negotiable: users cannot override rules.',
        'Military, intelligence, defense, and high-assurance systems (SELinux).',
        'Rigid configuration complexity; prevents covert data leakage.'
      ],
      [
        'Role-Based Access Control (RBAC)',
        'Organizational Administrator (assigns privileges to defined roles).',
        'Moderate: users inherit permissions dynamically based on active job role.',
        'Enterprise applications, medical systems, financial banking servers.',
        'Role explosion if enterprise job roles are defined too granularly.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Operating system protection establishes the internal architectural boundaries that prevent processes from
        interfering with each other, corrupting kernel structures, or accessing unauthorized resources.
        This study covers the Principle of Least Privilege, protection domains, x86 hardware privilege rings,
        the abstract Access Matrix model, practical decompositions into ACLs and Capability Lists, revocation protocols,
        and multi-level mandatory security models including Bell-LaPadula.
      </p>

      <h2>1. Protection vs Security &amp; Core Principles</h2>
      <p>
        Operating system literature maintains a strict distinction between protection and security:
      </p>
      <ul>
        <li>
          <strong>Protection:</strong> The internal kernel mechanisms and policies that control how processes and users access system resources
          (CPU, memory, files, hardware devices). Protection is an internal enforcement framework.
        </li>
        <li>
          <strong>Security:</strong> The overarching system defense protecting against external and internal attacks, physical theft,
          eavesdropping, and data destruction. Security encompasses authentication, network firewalls, and cryptography.
        </li>
      </ul>

      <Callout type="info" title="The Principle of Least Privilege (PoLP)">
        Articulated by Jerome Saltzer and Michael Schroeder (1975), the <strong>Principle of Least Privilege</strong> dictates
        that every process, program, and user must operate using the minimum set of privileges necessary to accomplish its legitimate task,
        and for only the shortest duration needed. PoLP drastically bounds the damage caused by compromised processes or software vulnerabilities.
      </Callout>

      <h2>2. Protection Domains and Hardware Privilege Rings</h2>
      <p>
        A <strong>Protection Domain</strong> defines a set of <code>(resource, access-right)</code> associations.
        A process executes within a specific domain at any instant, which governs the complete boundary of operations it can execute:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Hardware Privilege Rings (x86-64 Architecture)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-danger dark:text-night-danger">Ring 0: Kernel Mode</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Complete hardware execution rights. Executes core scheduler, memory management, and I/O bus controllers.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent">Ring 1: Device Drivers</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Intended for specialized hardware drivers (rarely used in monolithic OS designs like Linux).
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">Ring 2: OS Services</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Reserved for subsystem extensions and user-interface servers in microkernel systems.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">Ring 3: User Mode</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Standard application execution space. Privileged opcodes (e.g., <code>cli</code>, <code>hlt</code>) trap to Ring 0 via system calls.
            </p>
          </div>
        </div>
      </div>

      <h2>3. The Access Matrix Model</h2>
      <p>
        Formulated by Butler Lampson (1971), the <strong>Access Matrix</strong> is an abstract mathematical framework
        representing system-wide authorization policies:
      </p>
      <ul>
        <li>
          <strong>Rows:</strong> Represent <em>Protection Domains</em> (Users, Processes, Roles: <em>D<sub>1</sub>, D<sub>2</sub>, ..., D<sub>m</sub></em>).
        </li>
        <li>
          <strong>Columns:</strong> Represent <em>System Objects</em> (Files, Memory Frames, Devices: <em>O<sub>1</sub>, O<sub>2</sub>, ..., O<sub>n</sub></em>).
        </li>
        <li>
          <strong>Cell Access(D<sub>i</sub>, O<sub>j</sub>):</strong> The set of authorized access rights (e.g., <code>&#123;read, write, execute&#125;</code>)
          that domain <em>D<sub>i</sub></em> holds over object <em>O<sub>j</sub></em>.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Access Matrix Implementations: ACLs vs Capability Lists
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3">
          Because real systems feature thousands of domains and millions of files, storing a 2-D matrix directly is infeasible.
          Operating systems decompose the matrix along two dimensions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand font-sans">1. Column Slicing: Access Control Lists (ACLs)</div>
            <div className="text-ink/80 dark:text-night-ink/80">
              Stored directly with Object O<sub>j</sub>:<br />
              File 1 &rarr; [ (User Alice: read, write), (User Bob: read) ]<br />
              File 2 &rarr; [ (User Alice: read), (Group Devs: execute) ]
            </div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success font-sans">2. Row Slicing: Capability Lists (C-Lists)</div>
            <div className="text-ink/80 dark:text-night-ink/80">
              Stored directly with Domain D<sub>i</sub>:<br />
              Domain Alice &rarr; [ (File 1: read, write), (File 2: read) ]<br />
              Domain Bob &rarr; [ (File 1: read), (Printer: print) ]
            </div>
          </div>
        </div>
      </div>

      <ComparisonTable {...aclVsCapabilitiesTable} />

      <h2>4. The Revocation of Access Rights</h2>
      <p>
        When an authorized user leaves an organization or changes projects, the operating system must revoke access rights promptly:
      </p>
      <ul>
        <li>
          <strong>Revocation in ACL Systems:</strong> Straightforward. The administrator removes the user identity from the target object ACL.
          On the subsequent <code>open()</code> system call, permission is immediately denied.
        </li>
        <li>
          <strong>Revocation in Capability Systems:</strong> Inherently complex. Capabilities are unforgeable tokens held inside process memory spaces.
          Finding and confiscating all distributed capability copies is difficult. Systems employ three engineering mechanisms:
          <ol className="list-decimal pl-4 mt-2 space-y-1">
            <li><strong>Reacquisition &amp; Expiration:</strong> Capabilities carry short Time-To-Live (TTL) timestamps and must be periodically revalidated.</li>
            <li><strong>Indirection Tables (Back-pointers):</strong> Capabilities do not point directly to the object; they point to an intermediate global table entry. Deleting the table entry revokes access for all capability holders simultaneously.</li>
            <li><strong>Generation Numbers:</strong> The object stores a numeric generation counter. When rights are revoked, the counter is incremented, immediately invalidating all capability tokens carrying older generation numbers.</li>
          </ol>
        </li>
      </ul>

      <h2>5. Mandatory Multi-Level Security: The Bell-LaPadula Model</h2>
      <p>
        Commercial operating systems predominantly use Discretionary Access Control (DAC), but military and high-assurance
        systems require <strong>Mandatory Access Control (MAC)</strong> to prevent covert data leakage:
      </p>

      <ComparisonTable {...accessModelsTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The Bell-LaPadula Confidentiality Model (David Bell &amp; Leonard LaPadula, 1973)
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3 font-sans">
          Enforces multi-level security where entities are classified into hierarchical clearance tiers:
          <strong>Top Secret &gt; Secret &gt; Confidential &gt; Unclassified</strong>.
        </p>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">1. Simple Security Property (&ldquo;No Read Up&rdquo;)</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              A subject at security clearance <em>S</em> is granted read access to object <em>O</em> if and only if:
              <br />
              <code className="font-bold text-brand dark:text-night-brand">Clearance(S) &ge; Classification(O)</code>
              <br />
              A user with &ldquo;Secret&rdquo; clearance can read Secret and Confidential files, but CANNOT read &ldquo;Top Secret&rdquo; files.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">2. *-Property / Star-Property (&ldquo;No Write Down&rdquo;)</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              A subject at security clearance <em>S</em> is granted write access to object <em>O</em> if and only if:
              <br />
              <code className="font-bold text-success dark:text-night-success">Clearance(S) &le; Classification(O)</code>
              <br />
              A process running at &ldquo;Top Secret&rdquo; clearance CANNOT write to an &ldquo;Unclassified&rdquo; or &ldquo;Confidential&rdquo; file!
            </p>
            <div className="text-xs text-ink/70 dark:text-night-ink/70 mt-1">
              <em>Critical Defense:</em> Prevents Trojan horses from exfiltrating Top Secret data into lower-classification files.
            </div>
          </div>
        </div>
      </div>

      <FAQ items={questions} />
    </>
  )
}
