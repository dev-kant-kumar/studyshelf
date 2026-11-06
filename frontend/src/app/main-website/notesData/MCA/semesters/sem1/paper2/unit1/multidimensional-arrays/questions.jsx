const questions = [
  {
    id: 'address-calculation-3d-array',
    level: 'medium',
    tags: ['3D Arrays', 'Address formula'],
    question: "What is the exact mathematical address formula for an element A[i][j][k] in a three-dimensional array in C?",
    answer: "In a 3D array declared as T A[D1][D2][D3], C uses zero-based Row-Major Order to serialize the elements contiguously. The physical memory address of element A[i][j][k] is computed as: Address(A[i][j][k]) = B + (((i * D2) + j) * D3 + k) * S, where B is the base memory address of the array (Address(A[0][0][0])), D2 is the number of rows per slice/page, D3 is the number of columns per row, i is the slice index (0 <= i < D1), j is the row index (0 <= j < D2), k is the column index (0 <= k < D3), and S is the byte size of each element (sizeof(T))."
  },
  {
    id: 'horners-rule-nd-address-generalization',
    level: 'hard',
    tags: ['Horner Rule', 'N-D Arrays'],
    question: "How does Horner's rule generalize address calculation to an arbitrary N-dimensional array?",
    answer: "For an N-dimensional array declared with dimensions D1, D2, ..., Dn and target indices i1, i2, ..., in, the relative element offset can be nested recursively using Horner's rule: Offset = (...((i1 * D2 + i2) * D3 + i3)...) * Dn + in. This nested polynomial expansion allows the compiler to compute the memory address using a sequence of N - 1 multiplications and additions without calculating product factors from scratch, producing the final address: Base + (Offset * sizeof(T))."
  },
  {
    id: 'contiguous-vs-pointer-of-pointers-array',
    level: 'hard',
    tags: ['Memory architecture', 'Cache locality'],
    question: "What is the architectural difference between a contiguous 3D array (int arr[X][Y][Z]) and a pointer-based array (int ***arr)?",
    answer: "A contiguous 3D array (int arr[X][Y][Z]) is allocated as a single unified memory block of X * Y * Z * sizeof(int) bytes. It incurs zero memory overhead for pointers, requires zero intermediate pointer dereferences (the compiler resolves access via pure arithmetic), and offers optimal hardware cache line locality. In contrast, an allocated pointer array (int ***arr) consists of an array of pointers to pointers, which point to arrays of pointers, which finally point to rows. It introduces substantial memory overhead for storing pointer tables, suffers from heap fragmentation, requires three sequential pointer dereferences per element access, and degrades cache locality due to scattered heap addresses."
  },
  {
    id: 'multidimensional-parameter-stride-rules',
    level: 'medium',
    tags: ['Function parameters', 'Strides'],
    question: "Why must all dimensions except the first be explicitly specified when passing a multidimensional array to a function?",
    answer: "When a multidimensional array is passed to a function in C, it decays into a pointer to an array of its sub-dimensions. For example, 'int arr[2][3][4]' decays into 'int (*arr)[3][4]'. To perform address calculation and index scaling, the compiler must know the precise stride of each higher-level block (e.g., 3 * 4 * sizeof(int) bytes to advance one 2D slice). Omitting any dimension other than the outermost one leaves the sub-array sizes undefined, making it impossible for the compiler to calculate memory offsets."
  },
  {
    id: 'c99-vla-parameter-notation-multidimensional',
    level: 'medium',
    tags: ['C99', 'VLAs'],
    question: "How can multidimensional arrays be accessed dynamically in C99 using Variable Length Array (VLA) parameter notation?",
    answer: "In ISO C99, function parameter lists can declare runtime dimension sizes prior to declaring the array parameter itself: 'void process_3d(size_t d1, size_t d2, size_t d3, int arr[d1][d2][d3])'. In this prototype, the compiler uses the runtime integer values of d2 and d3 to automatically perform the necessary multiplication and stride arithmetic when arr[i][j][k] is evaluated within the function, providing the convenience of multidimensional subscripting on dynamically sized buffers without requiring manual 1D index flattening."
  }
]

export default questions
