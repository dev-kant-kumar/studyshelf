const questions = [
  {
    id: 'row-major-order-formula-2d',
    level: 'easy',
    tags: ['Row-Major Order', 'Address calculation'],
    question: "What is Row-Major Order, and what is the exact formula for computing the address of element A[i][j] in C?",
    answer: "Row-Major Order (RMO) is a linear memory storage convention where all elements of row 0 are stored contiguously in memory, followed by all elements of row 1, and so forth. In C, which uses zero-based indexing and Row-Major Order exclusively, the memory address of element A[i][j] is calculated as: Address(A[i][j]) = B + ((i * C) + j) * S, where B is the base address of the array (Address(A[0][0])), C is the total number of columns per row, i is the target row index, j is the target column index, and S is the byte size of each element (sizeof(T))."
  },
  {
    id: 'mandatory-column-dimension-parameter',
    level: 'medium',
    tags: ['Function parameters', 'Strides'],
    question: "Why must the column dimension always be specified when declaring a 2D array parameter in a function?",
    answer: "When a 2D array is passed to a function, it decays into a pointer to an array of columns: int (*arr)[COLS]. The compiler requires the column dimension (COLS) at compile time to calculate the memory stride needed to advance from one row to the next. According to the Row-Major formula, advancing row i by 1 requires jumping by (C * sizeof(element)) bytes in physical memory. Without knowing C, the compiler cannot determine the row stride or compute the target memory address for arr[i][j]."
  },
  {
    id: 'cache-locality-row-vs-column-traversal',
    level: 'hard',
    tags: ['CPU cache', 'Performance optimization'],
    question: "How does row-by-row matrix traversal differ from column-by-column traversal in terms of CPU hardware cache performance?",
    answer: "Because C stores 2D arrays in Row-Major Order, traversing an array row-by-row accesses consecutive memory addresses sequentially. When the CPU loads an element into the L1 cache, it loads an entire 64-byte cache line, pulling adjacent row elements into cache simultaneously, maximizing spatial locality and minimizing cache misses. In contrast, traversing column-by-column accesses elements with a large memory stride of (C * sizeof(element)) bytes. Each access jumps across different cache lines, inducing severe cache thrashing and reducing execution speed by up to an order of magnitude on large matrices."
  },
  {
    id: 'subscript-decomposition-pointer-arithmetic',
    level: 'medium',
    tags: ['Pointers', 'Subscripts'],
    question: "How is the 2D subscript expression matrix[i][j] decomposed into pointer arithmetic by the compiler?",
    answer: "In C, the expression matrix[i][j] is evaluated in two pointer arithmetic stages. First, matrix[i] is expanded to *(matrix + i). Because matrix is an array of rows, adding i advances the pointer by i row strides (i * C * sizeof(element)), yielding a pointer to the start of row i. Second, the subscript [j] is applied to that row pointer, expanding to *(*(matrix + i) + j). This adds j element strides to reach the j-th column of row i, and the outer dereference operator reads the stored value."
  },
  {
    id: 'omitting-dimensions-in-initialization',
    level: 'easy',
    tags: ['Initialization', 'Syntax rules'],
    question: "Why does the declaration 'int matrix[][]' cause a compiler error, while 'int matrix[][4]' is valid?",
    answer: "In C, array initialization allows the outermost (first) dimension to be omitted because the compiler can deduce the total row count by dividing the total number of initializer elements by the specified column width. However, omitting the column dimension (e.g., int matrix[][]) leaves the row stride undefined; the compiler cannot determine how many elements belong to each row or where subsequent rows begin in memory, triggering a compile-time incomplete type error."
  }
]

export default questions
