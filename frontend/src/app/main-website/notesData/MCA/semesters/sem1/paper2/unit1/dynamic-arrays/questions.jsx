const questions = [
  {
    id: 'realloc-null-pointer-overwrite-leak',
    level: 'hard',
    tags: ['Memory leak', 'Defensive programming'],
    question: "Why is the pattern 'ptr = realloc(ptr, new_size);' considered a dangerous programming anti-pattern?",
    answer: "If realloc() fails to allocate the requested memory block (e.g., due to system memory exhaustion), it returns a NULL pointer while leaving the original memory block intact and still allocated on the heap. Assigning the return value directly back into the original pointer (ptr = realloc(ptr, ...)) overwrites ptr with NULL. This permanently destroys the only reference to the original allocated buffer, making it impossible to access or free the existing memory and causing an irreversible memory leak. The safe idiom requires assigning to a temporary pointer: 'void *tmp = realloc(ptr, new_size); if (tmp) ptr = tmp; else { handle_error(); }'."
  },
  {
    id: 'geometric-doubling-amortized-proof',
    level: 'hard',
    tags: ['Amortized analysis', 'Complexity'],
    question: "Why does geometric capacity doubling achieve amortized O(1) time complexity for dynamic array insertions, while arithmetic growth degrades to O(n)?",
    answer: "When a dynamic array expands by doubling its capacity (1 -> 2 -> 4 -> 8 -> ... -> N), resizing occurs only log2(N) times. The total number of element copy operations across all resizes forms a geometric series: 1 + 2 + 4 + ... + N/2 = N - 1 copies. Dividing the total N - 1 copies by the N inserted elements yields an average (amortized) cost of less than 1 copy operation per insertion, achieving amortized O(1) time. Conversely, if capacity expands by a fixed constant c (e.g., +10 slots), inserting N elements requires N/c resizes, copying c + 2c + 3c + ... + N = O(N * N) total elements, which degrades each insertion to an unacceptable O(N) average time."
  },
  {
    id: 'malloc-vs-calloc-overflow-check',
    level: 'medium',
    tags: ['Heap allocators', 'Integer overflow'],
    question: "What is the difference between malloc() and calloc(), and when should calloc() be preferred?",
    answer: "malloc(size) takes a single total byte size and allocates contiguous heap memory without initializing its contents; the allocated memory contains whatever arbitrary garbage bytes were left by previous heap users. In contrast, calloc(num, size) takes two parameters (element count and element size), computes their product, allocates the memory, and initializes all bytes to binary zero (0x00). Furthermore, calloc() performs an internal integer multiplication overflow check, returning NULL if num * size would wrap around. calloc() should be preferred when allocating cleared structs, pointer tables (where all initial pointers must be NULL), or when defensive integer overflow checking is required."
  },
  {
    id: 'dangling-pointer-and-double-free-exploits',
    level: 'hard',
    tags: ['Security', 'Heap exploitation'],
    question: "What is a dangling pointer, what is a double free, and how do they lead to security vulnerabilities?",
    answer: "A dangling pointer is a pointer that continues to reference a memory address after the underlying storage has been deallocated via free(). If the application subsequently reads or writes through this pointer (Use-After-Free), it corrupts newly allocated objects occupying that address, leading to arbitrary code execution exploits. A double free occurs when free() is invoked multiple times on the exact same pointer address without an intervening allocation. This corrupts the internal free-list metadata of the heap allocator (such as glibc ptmalloc chunk headers), enabling attackers to manipulate allocator pointers into writing arbitrary memory (heap exploitation). Both defects are mitigated by immediately setting freed pointers to NULL: 'free(ptr); ptr = NULL;'."
  },
  {
    id: 'how-free-determines-chunk-size',
    level: 'medium',
    tags: ['Allocator internals', 'Metadata headers'],
    question: "How does free() know how many bytes to release when it only receives a void* pointer without a size argument?",
    answer: "Heap allocators (such as glibc ptmalloc, jemalloc, or Windows HeapAlloc) prepend an internal metadata header directly in front of the memory block returned to the application. When malloc(N) is called, it allocates slightly more memory (typically 8 to 16 extra bytes) to store chunk headers containing the total chunk size, allocation flags, and boundary tags. When free(ptr) is called, the allocator subtracts the header offset from the passed pointer (e.g., (char*)ptr - sizeof(Header)) to inspect the metadata header, discovering the exact byte size of the block and returning it to the appropriate free list."
  }
]

export default questions
