import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const stringFunctionsComparison = {
    caption: 'Standard &lt;string.h&gt; Routines and Safety Characteristics',
    headers: ['Function Prototype', 'Operational Purpose', 'Time Complexity', 'Bounds Safety & Constraints'],
    rows: [
      [
        'size_t strlen(const char *s);',
        'Computes number of characters preceding the null terminator.',
        'O(n) linear scan',
        'Requires valid null-terminated string; segfaults on NULL or un-terminated arrays.'
      ],
      [
        'char* strcpy(char *dest, const char *src);',
        'Copies characters from src to dest including \'\\0\'.',
        'O(n)',
        'Unsafe; no capacity checking. Can cause severe stack/heap buffer overflows.'
      ],
      [
        'char* strncpy(char *dest, const char *src, size_t n);',
        'Copies up to n characters from src to dest.',
        'O(n)',
        'Does NOT guarantee null-termination if strlen(src) &gt;= n. Zero-pads unused buffer.'
      ],
      [
        'char* strcat(char *dest, const char *src);',
        'Appends src string to the end of dest string.',
        'O(m + n)',
        'Unsafe; assumes dest buffer has adequate capacity for combined length.'
      ],
      [
        'char* strncat(char *dest, const char *src, size_t n);',
        'Appends up to n characters from src, then appends \'\\0\'.',
        'O(m + n)',
        'Guarantees null-termination; dest must have space for current_len + n + 1 bytes.'
      ],
      [
        'int strcmp(const char *s1, const char *s2);',
        'Lexicographically compares two null-terminated strings.',
        'O(min(m, n))',
        'Returns &lt; 0 (s1 &lt; s2), 0 (s1 == s2), or &gt; 0 (s1 &gt; s2).'
      ],
      [
        'char* strstr(const char *haystack, const char *needle);',
        'Locates first occurrence of substring needle inside haystack.',
        'O(m &times; n)',
        'Returns pointer to matching character inside haystack, or NULL if absent.'
      ],
      [
        'char* strtok(char *str, const char *delim);',
        'Extracts sequential tokens separated by delimiter bytes.',
        'O(n)',
        'Modifies string in-place with \'\\0\'. Uses static internal state; thread-unsafe.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        In the C programming language, strings are not distinct primitive types. Instead, a string is conventionally represented as a contiguous array of characters terminated by a null sentinel byte (<code>'\0'</code>, ASCII code <code>0</code>). Because the runtime depends entirely on this sentinel byte to detect string boundaries without maintaining explicit length headers, string manipulation in C requires rigorous boundary validation to prevent buffer overflows and memory corruption vulnerabilities.
      </p>

      <h2>1. Physical Memory Representation: The Null Sentinel</h2>
      <p>
        Every C string requires one additional byte of physical storage beyond its visible character count to accommodate the terminating null character <code>'\0'</code>.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-night-ink-muted mb-2">Memory Layout of "MCA" in RAM</h4>
        <div className="grid grid-cols-4 gap-2 text-center font-mono text-sm max-w-md">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent text-lg">'M'</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">ASCII 77</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">Offset 0</div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent text-lg">'C'</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">ASCII 67</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">Offset 1</div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-accent text-lg">'A'</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">ASCII 65</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">Offset 2</div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-semibold text-red-500 text-lg">'\0'</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">ASCII 0</div>
            <div className="text-xs text-ink-muted dark:text-night-ink-muted mt-1">Offset 3</div>
          </div>
        </div>
        <p className="text-xs text-ink-muted dark:text-night-ink-muted mt-3">
          Total string length: <code>strlen("MCA") == 3</code> characters. Total allocated memory: <code>sizeof("MCA") == 4</code> bytes.
        </p>
      </div>

      <h2>2. String Literals vs Character Arrays</h2>
      <p>
        A fundamental distinction exists between initializing a character pointer with a string literal and declaring a character array:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">String Literal Pointer (Read-Only)</h4>
          <pre><code className="text-xs font-mono">{`// Stored in .rodata (read-only data segment)
char *ptr = "Hello";

// RUNTIME CRASH (Segmentation Fault):
// Attempting to modify read-only page triggers SIGSEGV!
ptr[0] = 'h';`}</code></pre>
        </div>

        <div className="p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface">
          <h4 className="font-semibold text-accent mb-2">Character Array (Mutable Stack Storage)</h4>
          <pre><code className="text-xs font-mono">{`// Allocates 6 mutable bytes on local stack frame
char arr[] = "Hello";

// SAFE MUTATION:
// Modifies local stack memory safely
arr[0] = 'h'; // arr now contains "hello"`}</code></pre>
        </div>
      </div>

      <h2>3. Standard String Library: &lt;string.h&gt;</h2>
      <p>
        The ISO C standard library supplies specialized routines for string inspection, duplication, concatenation, and search.
      </p>

      <ComparisonTable {...stringFunctionsComparison} />

      <h2>4. Custom Manual Implementation of Standard String Functions</h2>
      <p>
        In university examinations and technical systems interviews, candidates are frequently evaluated on their ability to implement standard string functions from scratch using raw pointer arithmetic.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">Manual Pointer-Based String Algorithms</h4>
        <pre><code className="text-sm font-mono">{`#include <stdio.h>

// 1. Custom string length (O(n))
size_t my_strlen(const char *s) {
    const char *p = s;
    while (*p != '\\0') {
        p++;
    }
    return (size_t)(p - s);
}

// 2. Canonical Ritchie (K&R) string copy
char* my_strcpy(char *dest, const char *src) {
    char *orig = dest;
    // Copies byte, advances pointers, tests if copied byte was non-zero:
    while ((*dest++ = *src++))
        ;
    return orig;
}

// 3. Custom lexicographical string comparison
int my_strcmp(const char *s1, const char *s2) {
    while (*s1 && (*s1 == *s2)) {
        s1++;
        s2++;
    }
    // Return arithmetic difference of differing characters as unsigned char
    return (int)((unsigned char)*s1 - (unsigned char)*s2);
}

// 4. Custom string concatenation
char* my_strcat(char *dest, const char *src) {
    char *orig = dest;
    // Step 1: Advance dest pointer to the existing null terminator
    while (*dest) {
        dest++;
    }
    // Step 2: Copy src bytes over and past the null terminator
    while ((*dest++ = *src++))
        ;
    return orig;
}`}</code></pre>
      </div>

      <h2>5. Security Hazards and Defensive String Processing</h2>
      <p>
        Because string functions blindly write to memory until finding null terminators, improper string handling is the historical root cause of the vast majority of memory corruption vulnerabilities.
      </p>

      <div className="overflow-x-auto p-4 rounded-xl border border-line dark:border-night-line bg-surface dark:bg-night-surface my-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Buffer Overflow Vulnerabilities: gets() vs fgets()</h4>
        <pre><code className="text-sm font-mono">{`char buffer[64];

// FATAL SECURITY FLAW: gets() has no length limit!
// Entering 80 bytes overwrites caller return address -> Arbitrary Code Execution
// gets(buffer); // REMOVED FROM ISO C11

// DEFENSIVE INDUSTRY REPLACEMENT:
// fgets strictly respects buffer capacity and guarantees boundary containment
if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
    // Strip trailing newline character if present
    size_t len = strlen(buffer);
    if (len > 0 && buffer[len - 1] == '\\n') {
        buffer[len - 1] = '\\0';
    }
}`}</code></pre>
      </div>

      <Callout type="tip">
        <strong>The snprintf Standard:</strong> Modern production systems replace hazardous combinations of <code>strcpy</code> and <code>strcat</code> with <code>snprintf</code>:
        <pre className="mt-2 font-mono text-xs"><code>snprintf(dest, sizeof(dest), "%s/%s", base_path, filename);</code></pre>
        <code>snprintf</code> guarantees null-termination, calculates formatted string lengths defensively, and completely eliminates buffer overflow hazards.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
