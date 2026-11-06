const questions = [
  {
    id: 'address-calculation-1d-array',
    level: 'easy',
    tags: ['Memory layout', 'Formulas'],
    question: "How does the C compiler calculate the physical memory address of an element A[i] in a one-dimensional array?",
    answer: "In a one-dimensional array, elements are stored contiguously in memory starting from a base address B. The address of any element at index i is computed using the formula: Address(A[i]) = B + (i * S), where B is the base memory address of the array (Address(A[0])), i is the zero-based element index, and S is the size of each array element in bytes (sizeof(T)). Because this involves a single multiplication and addition, element access in an array takes O(1) constant time."
  },
  {
    id: 'subscript-pointer-commutativity',
    level: 'medium',
    tags: ['Pointer arithmetic', 'Language syntax'],
    question: "Why is the expression 3[arr] mathematically valid in C and equivalent to arr[3]?",
    answer: "In C, array subscript notation is syntactic sugar for pointer arithmetic. By definition in the ISO C standard, the expression arr[i] is defined as *((arr) + (i)). Because binary addition is commutative (a + b == b + a), *((arr) + (i)) is identical to *((i) + (arr)). Applying the subscript notation in reverse, *((3) + (arr)) evaluates to 3[arr]. Both expressions dereference the memory location offset by three element sizes from the base address of arr."
  },
  {
    id: 'array-decay-and-sizeof-trap',
    level: 'medium',
    tags: ['Pointers', 'Function parameters'],
    question: "What is array decay in C, and why does sizeof(arr) fail to report total array size inside a function?",
    answer: "Array decay is the automatic implicit conversion of an array name into a pointer to its first element (Type*) whenever the array is passed as a function argument or evaluated in an expression (except when used as an operand to sizeof, typeof, or the address-of & operator). When an array is passed into 'void foo(int arr[])', the compiler decays the parameter to 'void foo(int *arr)'. Inside the function, sizeof(arr) evaluates to the size of a pointer variable on the host architecture (8 bytes on a 64-bit machine) rather than the total size of the array elements. Therefore, the element count must always be passed as an explicit companion parameter."
  },
  {
    id: 'lack-of-bounds-checking-hazards',
    level: 'hard',
    tags: ['Security', 'Buffer overflow'],
    question: "Why does C not perform runtime array bounds checking, and what security risks result from this omission?",
    answer: "C was designed as a systems programming language prioritizing raw hardware execution speed, minimal runtime overhead, and direct memory mapping. Implementing runtime bounds checking would require the compiler to emit extra comparison and branch instructions for every array read and write, as well as maintaining fat pointer metadata (base, length, and current offset), which degrades CPU throughput. The omission of bounds checking means that accessing an out-of-bounds index (e.g., A[15] in an array of size 10) results in reading or writing arbitrary adjacent memory, enabling stack smashing, buffer overflow vulnerabilities, and arbitrary code execution exploits."
  },
  {
    id: 'variable-length-arrays-vla-c99-c11',
    level: 'hard',
    tags: ['C Standards', 'Stack memory'],
    question: "What are Variable Length Arrays (VLAs) in C99, and why were they made optional in C11?",
    answer: "Variable Length Arrays (VLAs), introduced in ISO C99, allow an automatic array to be declared with a size determined at runtime by an expression (e.g., 'int arr[n];' where n is a runtime variable). The storage for a VLA is allocated directly on the call stack at function runtime. However, VLAs introduce severe security and stability risks: if an unvalidated or large size n is passed, the array exceeds available stack limits and triggers an unrecoverable stack overflow crash without any mechanism to report allocation failure. Due to these safety concerns and implementation complexity on embedded systems, ISO C11 demoted VLAs to an optional language feature guarded by the __STDC_NO_VLA__ macro."
  }
]

export default questions
