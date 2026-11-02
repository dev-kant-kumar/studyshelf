const questions = [
  {
    id: 'authentication-factors-and-passwords',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define User Authentication in operating systems. Explain the three fundamental authentication factors and Multi-Factor Authentication (MFA).',
    answer: [
      'Authentication is the process by which an operating system verifies that an entity requesting access is indeed the principal it claims to be, prior to granting access to system resources.',
      'Authentication relies on three fundamental factors:',
      '1. Something You Know (Knowledge Factor): Secret information known only to the user. Examples: alphanumeric passwords, PIN codes, cryptographic passphrases, and security challenge questions.',
      '2. Something You Have (Possession Factor): A physical or cryptographic device owned exclusively by the user. Examples: hardware smart cards, cryptographic USB tokens (YubiKey / FIDO2), SIM cards, or software authenticator apps generating time-based codes.',
      '3. Something You Are (Inherence Factor): Biological or behavioral biometric characteristics unique to the human user. Examples: fingerprint scans, retina/iris scans, facial recognition, or keystroke dynamics.',
      'Multi-Factor Authentication (MFA): Combines two or more independent factors from distinct categories (e.g., entering a password [Knowledge] plus tapping a hardware security key [Possession]). Compromising one factor (such as a phished password) is insufficient to breach the system.'
    ]
  },
  {
    id: 'one-time-passwords-hotp-vs-totp',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain the working of One-Time Passwords (OTP). Compare HMAC-Based (HOTP - RFC 4226) and Time-Based (TOTP - RFC 6238) algorithms. Why are OTPs immune to replay attacks?',
    answer: [
      '1. The Need for One-Time Passwords:',
      'Standard reusable passwords are fundamentally vulnerable to eavesdropping (network packet sniffing), keyloggers, and replay attacks: an intercepted password can be reused indefinitely by an adversary. A One-Time Password (OTP) is a dynamic passcode valid for exactly one login session or a very narrow time window.',
      '2. HOTP (HMAC-Based One-Time Password - RFC 4226):',
      'Both the client token and authentication server share a secret symmetric key K and an event counter C. When the user requests a code: (a) The token computes the Hash-based Message Authentication Code: HMAC-SHA1(K, C). (b) Dynamic Truncation extracts a 4-byte dynamic binary code and applies modulo 1,000,000 to generate a 6-digit numeric passcode. (c) Both client and server increment counter C. Limitation: If the user presses the token button without logging in, the counters desynchronize, requiring lookahead synchronization windows on the server.',
      '3. TOTP (Time-Based One-Time Password - RFC 6238):',
      'Replaces the event counter C with a time counter derived from current Unix epoch time T: Counter C = floor(Current Unix Time / Time Step X), where X is typically 30 seconds. (a) Every 30 seconds, a fresh 6-digit passcode is computed automatically: TOTP = HOTP(K, floor(T / 30)). (b) Because time advances synchronously on both the user phone and server (synchronized via NTP), no manual counter tracking is needed.',
      'Why OTPs are Immune to Replay Attacks: Even if an attacker intercepts the OTP via network sniffing, the code cannot be reused. By the time the attacker attempts to replay it, either the server has already consumed and invalidated the single-use token, or the 30-second validity window has expired, rendering the intercepted code useless.'
    ]
  },
  {
    id: 'symmetric-vs-asymmetric-encryption',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Symmetric-Key Encryption (AES, DES) with Asymmetric (Public-Key) Cryptography (RSA, ECC). Explain the key distribution problem and how Hybrid Encryption resolves it.',
    answer: [
      '1. Symmetric-Key Cryptography (Secret-Key Encryption):',
      'Uses the exact same secret key K for both encryption and decryption: Ciphertext = Encrypt(Plaintext, K); Plaintext = Decrypt(Ciphertext, K). Examples: AES (Advanced Encryption Standard), ChaCha20, 3DES.',
      'Advantages: Extremely fast; hardware-accelerated instructions (Intel AES-NI) encrypt data at gigabytes per second with minimal CPU load.',
      'Disadvantage (The Key Distribution Problem): The sender and receiver must securely exchange the shared secret key K beforehand. If they can securely communicate to exchange the key, they would not need encryption in the first place! Furthermore, in a network of N users, each pair requires a unique key, resulting in N*(N-1)/2 keys, which fails to scale.',
      '2. Asymmetric Cryptography (Public-Key Encryption):',
      'Uses mathematically linked key pairs: a Public Key (distributed openly to the world) and a Private Key (kept strictly confidential by the owner). Message encrypted with Public Key can only be decrypted by the corresponding Private Key: Ciphertext = Encrypt(Plaintext, PublicKey); Plaintext = Decrypt(Ciphertext, PrivateKey). Examples: RSA, Elliptic Curve Cryptography (ECC).',
      'Disadvantage: Computationally intensive; modular exponentiation is 1,000 to 10,000 times slower than symmetric AES.',
      '3. The Solution: Hybrid Cryptosystems (TLS / HTTPS):',
      'Modern security combines both: (1) Asymmetric cryptography (RSA or Diffie-Hellman) is used briefly during the initial handshake to authenticate identities and securely exchange a random symmetric session key. (2) Once exchanged, both parties switch to high-speed symmetric AES encryption for streaming all bulk application data.'
    ]
  },
  {
    id: 'hashes-and-digital-signatures',
    level: 'hard',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Explain Cryptographic Hash Functions (SHA-256) and Digital Signatures. Trace the mathematical verification steps that guarantee Integrity, Authentication, and Non-Repudiation.',
    answer: [
      '1. Cryptographic Hash Functions (e.g., SHA-256):',
      'A one-way mathematical function that compresses an arbitrary-length message M into a fixed-length digest h = H(M) (256 bits). Must satisfy three security properties: (a) Pre-image resistance (one-way: impossible to find M given h), (b) Second pre-image resistance (impossible to find M2 != M1 such that H(M2) = H(M1)), and (c) Collision resistance (impossible to find any two distinct messages with identical hashes).',
      '2. Digital Signature Generation and Verification:',
      'A digital signature is the electronic analog of a physical handwritten signature, providing three guarantees: Integrity, Authentication, and Non-Repudiation (the signer cannot deny having signed the message).',
      'Step 1: Signing (Executed by Sender Alice):',
      'Alice takes document M and computes its 256-bit cryptographic digest: h = SHA256(M).',
      'Alice encrypts the digest h using her private, secret signing key: Signature S = Encrypt(h, PrivateKey_Alice).',
      'Alice transmits both the document M and the digital signature S to Bob.',
      'Step 2: Verification (Executed by Receiver Bob):',
      'Bob receives document M and signature S. Bob fetches Alice authentic Public Key.',
      'Bob decrypts the signature using Alice Public Key to reveal the original digest: h_original = Decrypt(S, PublicKey_Alice).',
      'Bob independently computes the hash of the received document: h_computed = SHA256(M).',
      'Bob compares: If h_computed == h_original, the signature is VALID!',
      'Proof: If any bit of document M had been altered in transit, h_computed would differ completely (avalanche effect). Furthermore, because only Alice possesses PrivateKey_Alice, only Alice could have produced signature S, proving origin and non-repudiation.'
    ]
  },
  {
    id: 'tls-handshake-protocol',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Trace the complete TLS 1.3 Cryptographic Handshake. How do client and server achieve confidential communication over an untrusted network in a single round-trip (1-RTT)?',
    answer: [
      'TLS 1.3 (Transport Layer Security - RFC 8446) establishes an encrypted session in a single round trip (1-RTT) using Ephemeral Diffie-Hellman key exchange and X.509 digital certificates:',
      'Message 1: ClientHello (Client -> Server):',
      'The client transmits: (1) Supported TLS version (TLS 1.3), (2) Supported symmetric cipher suites (e.g., TLS_AES_256_GCM_SHA384), (3) Client Random nonce, and (4) "Key Share": the client ephemeral Diffie-Hellman public key parameter (g to the power of a mod p).',
      'Message 2: ServerHello + Certificate + Handshake Finished (Server -> Client):',
      'The server selects the cipher suite, generates its own ephemeral Diffie-Hellman key pair (g to the power of b mod p), and combines the client key share with its own private parameter b to compute the shared Master Secret: S = (g to the power of a) to the power of b mod p = g to the power of ab mod p.',
      'The server immediately derives the symmetric encryption keys from S. The server transmits: (1) Server Random nonce and server key share (g to the power of b mod p), (2) Server X.509 Digital Certificate (signed by a trusted Certificate Authority / CA), (3) Digital Signature proving possession of the certificate private key, and (4) Server Finished verification HMAC.',
      'Client Key Derivation & Verification:',
      'The client validates the server X.509 certificate against its local trusted CA root store, verifies the server digital signature, and computes the shared Master Secret: S = (g to the power of b) to the power of a mod p = g to the power of ab mod p.',
      'Both parties now possess identical, unintercepted symmetric session keys. All subsequent application HTTP traffic is encrypted using AES-GCM or ChaCha20-Poly1305 with Perfect Forward Secrecy (PFS): compromising the server long-term certificate private key in the future cannot decrypt past recorded sessions because ephemeral keys a and b were wiped from RAM.'
    ]
  }
]

export default questions
