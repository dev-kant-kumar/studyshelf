import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const cryptoComparisonTable = {
    caption: 'Comparative Analysis: Symmetric-Key vs Asymmetric-Key Cryptography',
    headers: ['Criterion', 'Symmetric Cryptography (e.g., AES-256, ChaCha20)', 'Asymmetric Cryptography (e.g., RSA-4096, ECC P-256)'],
    rows: [
      [
        'Key Architecture',
        'Single shared secret key K used for both encryption and decryption.',
        'Mathematically linked key pair: Public Key (encrypt) and Private Key (decrypt).'
      ],
      [
        'Encryption Throughput',
        'Extremely fast (gigabytes/sec via hardware AES-NI instructions).',
        'Slow: 1,000 to 10,000 times slower due to heavy modular exponentiation.'
      ],
      [
        'Key Scaling Complexity',
        'O(N<sup>2</sup>) keys needed for N participants (N &times; (N - 1) / 2 shared keys).',
        'O(N) keys needed: each participant holds exactly one public/private key pair.'
      ],
      [
        'Key Distribution Problem',
        'Severe: requires an existing secure channel to exchange the shared secret.',
        'Trivial: Public keys are openly advertised in public X.509 certificates.'
      ],
      [
        'Primary Systems Use Case',
        'Bulk encryption of files, memory pages, and high-speed network traffic.',
        'Digital signatures, identity authentication, and symmetric session key exchange.'
      ]
    ]
  }

  const authenticationFactorsTable = {
    caption: 'The Three Foundational Authentication Factors',
    headers: ['Factor Category', 'Security Philosophy', 'Real-World Examples', 'Common Attack Vectors', 'Mitigation Strategy'],
    rows: [
      [
        'Something You Know',
        'Knowledge Factor: Secret strings memorized by the user.',
        'Passwords, PINs, security questions.',
        'Phishing, keyloggers, brute-force cracking, rainbow tables.',
        'Argon2id/bcrypt salted hashing, minimum entropy enforcement.'
      ],
      [
        'Something You Have',
        'Possession Factor: Physical or cryptographic hardware owned.',
        'Hardware tokens (YubiKey / FIDO2), smart cards, authenticator apps.',
        'Physical theft, SIM swapping, device cloning.',
        'Time-limited TOTP rotation, hardware tamper-resistant enclaves.'
      ],
      [
        'Something You Are',
        'Inherence Factor: Biological human characteristics.',
        'Fingerprints, facial recognition, iris scans, voice prints.',
        'High-resolution photo spoofing, silicone molds, replay of raw templates.',
        'Liveness detection, cryptographic on-device biometric enclaves.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Authentication and cryptography form the ultimate barrier guarding operating system assets against malicious compromise.
        This study examines the three foundational authentication factors, Multi-Factor Authentication (MFA),
        the mathematical mechanics of HOTP and TOTP One-Time Passwords, symmetric and asymmetric ciphers,
        the hybrid encryption paradigm, cryptographic digital signatures, and the complete TLS 1.3 encrypted handshake.
      </p>

      <h2>1. User Authentication and the Three Factors</h2>
      <p>
        Authentication is the gatekeeping mechanism through which an operating system establishes identity
        prior to admitting a user into a protection domain:
      </p>

      <ComparisonTable {...authenticationFactorsTable} />

      <h3>Secure Password Storage: Salts and Slow Hashes</h3>
      <p>
        Operating systems never store plain-text passwords on disk.
        Modern kernels (such as Linux <code>/etc/shadow</code>) protect credentials using cryptographic salted hashes:
      </p>
      <ul>
        <li>
          <strong>Cryptographic Salt:</strong> A unique, pseudo-random string (e.g., 16 bytes) generated per user and appended to the password
          before hashing. Salts ensure that two users with identical passwords yield radically different hashes,
          completely defeating precomputed <strong>Rainbow Table</strong> attacks.
        </li>
        <li>
          <strong>Key Stretching Hashes:</strong> General-purpose hash algorithms (MD5, SHA-1, SHA-256) are intentionally designed
          to be fast, allowing modern GPUs to calculate billions of guesses per second. Operating systems employ computationally intensive,
          memory-hard password hashing functions such as <strong>Argon2id</strong> and <strong>bcrypt</strong> with tunable work factors,
          rendering brute-force cracking economically impossible.
        </li>
      </ul>

      <h2>2. One-Time Passwords (OTP): HOTP and TOTP</h2>
      <p>
        Reusable passwords are vulnerable to network sniffing and keyloggers.
        A <strong>One-Time Password (OTP)</strong> is a dynamic passcode valid for only a single transaction:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Mathematical Formulation of HOTP and TOTP
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand font-sans">1. HMAC-Based One-Time Password (HOTP - RFC 4226)</div>
            <p className="text-ink/80 dark:text-night-ink/80 font-sans">
              Client device and server share a secret symmetric key <em>K</em> and an event counter <em>C</em>.
            </p>
            <div>Step 1: Compute Hash-based Message Authentication Code: HS = HMAC-SHA1(K, C)</div>
            <div>Step 2: Dynamic Truncation: Snum = Truncate(HS) &rarr; extracts a 31-bit unsigned integer</div>
            <div>Step 3: Generate 6-digit code: <strong>HOTP = Snum mod 10<sup>6</sup></strong></div>
            <div>Step 4: Increment event counter: C = C + 1</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success font-sans">2. Time-Based One-Time Password (TOTP - RFC 6238)</div>
            <p className="text-ink/80 dark:text-night-ink/80 font-sans">
              Replaces the event counter <em>C</em> with a time step derived from current Unix epoch time <em>T</em>:
            </p>
            <div>Time Step X = 30 seconds (standard window)</div>
            <div>Time Counter C = floor(Current Unix Epoch Time T / 30)</div>
            <div className="text-success dark:text-night-success font-bold text-sm pt-1">
              TOTP = HOTP(K, floor(T / 30))
            </div>
            <p className="text-ink/80 dark:text-night-ink/80 font-sans pt-1">
              <em>Replay Immunity:</em> An intercepted code cannot be reused: the server consumes and invalidates it immediately,
              and after 30 seconds, the time counter advances, rendering the intercepted passcode mathematically invalid.
            </p>
          </div>
        </div>
      </div>

      <h2>3. Symmetric vs Asymmetric Cryptography</h2>
      <p>
        Cryptography encrypts plaintext into unintelligible ciphertext, enforcing confidentiality across untrusted storage and networks:
      </p>

      <ComparisonTable {...cryptoComparisonTable} />

      <h3>The Hybrid Cryptosystem Solution</h3>
      <p>
        Neither symmetric nor asymmetric encryption alone meets all practical system requirements:
      </p>
      <ul>
        <li>
          <strong>The Dilemma:</strong> Symmetric ciphers (AES) are blazing fast but suffer from the key distribution problem.
          Asymmetric ciphers (RSA, ECC) solve key distribution via public keys but are far too slow for streaming multi-megabyte files.
        </li>
        <li>
          <strong>The Hybrid Solution (TLS / HTTPS):</strong> Systems combine both!
          The client uses Asymmetric Cryptography (Diffie-Hellman or RSA) during the brief initial handshake to authenticate identities
          and securely negotiate a random symmetric <strong>session key</strong>.
          Once the session key is established, both endpoints switch to high-speed Symmetric AES-256-GCM encryption for all application payloads.
        </li>
      </ul>

      <h2>4. Cryptographic Hash Functions and Digital Signatures</h2>
      <p>
        A <strong>Cryptographic Hash Function</strong> (such as SHA-256) compresses arbitrary-length input data into a fixed 256-bit digest.
        It must satisfy three properties: (1) Pre-image resistance (one-way), (2) Second pre-image resistance (tamper detection),
        and (3) Collision resistance (no two distinct inputs produce identical hashes).
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Digital Signature Lifecycle: Signing &amp; Verification
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand font-sans">Step 1: Signing (Sender Alice)</div>
            <div>1. Compute digest: h = SHA256(Document)</div>
            <div>2. Encrypt digest with Alice PRIVATE key:</div>
            <div className="text-brand dark:text-night-brand font-bold">
              Signature S = Encrypt(h, PrivateKey<sub>Alice</sub>)
            </div>
            <div>3. Transmit Document + Signature S to Bob.</div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success font-sans">Step 2: Verification (Receiver Bob)</div>
            <div>1. Decrypt signature with Alice PUBLIC key:</div>
            <div className="text-success dark:text-night-success font-bold">
              h<sub>original</sub> = Decrypt(S, PublicKey<sub>Alice</sub>)
            </div>
            <div>2. Compute hash of received document:</div>
            <div>h<sub>computed</sub> = SHA256(Document)</div>
            <div>3. Compare: If h<sub>computed</sub> == h<sub>original</sub> &rarr; <strong>VALID!</strong></div>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-sans">
          <div className="font-bold text-ink dark:text-night-ink">The Three Cryptographic Guarantees:</div>
          <ul className="list-disc pl-4 mt-1 space-y-1 text-ink/80 dark:text-night-ink/80">
            <li><strong>Integrity:</strong> If any byte of the document was altered in transit, the computed hash will not match.</li>
            <li><strong>Authentication:</strong> Only Alice possesses <code>PrivateKey<sub>Alice</sub></code>, proving the message originated from her.</li>
            <li><strong>Non-Repudiation:</strong> Alice cannot legally deny authoring the message because her private key cannot be forged.</li>
          </ul>
        </div>
      </div>

      <h2>5. The TLS 1.3 Cryptographic Handshake Pipeline</h2>
      <p>
        The <strong>Transport Layer Security (TLS 1.3 - RFC 8446)</strong> protocol establishes encrypted, tamper-proof
        communication over the public Internet in a single network round-trip (1-RTT):
      </p>
      <ol>
        <li>
          <strong>ClientHello (Client &rarr; Server):</strong> The client transmits supported cipher suites (e.g., <code>TLS_AES_256_GCM_SHA384</code>),
          a random nonce, and its ephemeral Diffie-Hellman public key share (<em>g<sup>a</sup> mod p</em>).
        </li>
        <li>
          <strong>ServerHello &amp; Key Derivation (Server &rarr; Client):</strong> The server generates its ephemeral key share (<em>g<sup>b</sup> mod p</em>),
          computes the shared master secret:
          <br />
          <code className="font-bold text-brand dark:text-night-brand">S = (g<sup>a</sup>)<sup>b</sup> mod p = g<sup>ab</sup> mod p</code>
          <br />
          The server sends its key share, its X.509 digital certificate signed by a trusted Certificate Authority (CA),
          and a digital signature verifying certificate ownership.
        </li>
        <li>
          <strong>Client Verification:</strong> The client validates the certificate chain against its local trusted CA store,
          computes the identical shared master secret:
          <br />
          <code className="font-bold text-success dark:text-night-success">S = (g<sup>b</sup>)<sup>a</sup> mod p = g<sup>ab</sup> mod p</code>
          <br />
          Both sides now possess identical symmetric keys. All subsequent application HTTP data streams with full
          <strong>Perfect Forward Secrecy (PFS)</strong>: compromising the server long-term private key in the future cannot decrypt past traffic!
        </li>
      </ol>

      <FAQ items={questions} />
    </>
  )
}
