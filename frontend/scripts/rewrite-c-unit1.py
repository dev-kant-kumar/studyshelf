"""Editorial migration to structured, documentation-style C chapters."""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / 'src/app/main-website/notesData/MCA/semesters/sem1/paper2/unit1'
def p(text): return {'type': 'paragraph', 'text': text}
def code(title, text, kind='snippet', language='c', **test): return {'type': 'code', 'title': title, 'code': text, 'kind': kind, 'language': language, **test}
def out(text, title='Expected output'): return {'type': 'output', 'title': title, 'text': text}
def table(caption, headers, rows): return {'type': 'table', 'caption': caption, 'headers': headers, 'rows': rows}
def note(title, text): return {'type': 'callout', 'title': title, 'text': text}
def steps(*items): return {'type': 'steps', 'items': list(items)}
def bullets(*items): return {'type': 'list', 'items': list(items)}
def memory(caption, values, labels=None): return {'type': 'memory', 'caption': caption, 'cells': [{'label': labels[i] if labels else f'[{i}]', 'value': v} for i,v in enumerate(values)]}
def sec(title, *blocks, rule=None, source=None):
    result={'title': title, 'blocks': list(blocks)}
    if rule: result['rule']=rule
    if source: result['source']=source
    return result
REWRITES={}
def rewrite(slug, sections, questions=None):
    REWRITES[slug]=(sections,questions)

rewrite('one-dimensional-arrays', [
sec('Array objects and declaration syntax',
    p('An array is an object containing a fixed number of consecutive elements of one element type. The declaration states both the type of each element and the bound. It allocates the entire array object, rather than creating independent names for each element.'),
    code('Declaration form', 'element_type array_name[positive_bound];', 'illustration'),
    code('Declare and use a fixed array', '''int scores[5] = {72, 81, 67, 90, 76};
scores[2] = 70;
printf("third=%d\n", scores[2]);'''.replace('third=%d\n', 'third=%d\\n'), expected='third=70\n'),
    p('The bound `5` counts elements; it is not the largest valid index. The elements are `scores[0]` through `scores[4]`. A subscript expression designates an element, so it can appear on the left of an assignment when the element is modifiable. The bound and indices have separate jobs: one constructs the type, the other selects an object.'),
    p('For a fixed bound, use an integer constant expression such as a literal, an enumeration constant, or a suitable macro. At block scope, a nonconstant bound can instead declare a variable-length array. C11 implementations may omit VLA support. A zero-length ordinary array is not standard C11.'),
    code('A named compile-time bound', 'enum { CAPACITY = 5 };\nint readings[CAPACITY] = {0};\nprintf("capacity=%zu\\n", sizeof readings / sizeof readings[0]);', expected='capacity=5\n'),
    rule='N1570 6.2.5 and 6.7.6.2'),
sec('Initialisation: explicit, inferred, partial, and designated',
    p('Initialisation happens when the object is created. The brace list associates initial values with elements. When an initialised aggregate has omitted elements, those elements receive the appropriate zero initialisation. That is different from declaring an automatic array with no initialiser.'),
    code('Four common forms', '''int exact[4] = {8, 3, 5, 1};
int inferred[] = {8, 3, 5};
int partial[5] = {8, 3};
int zeroed[5] = {0};
printf("%zu %d %d\\n", sizeof inferred / sizeof inferred[0], partial[4], zeroed[2]);''', expected='3 0 0\n'),
    memory('`partial` has five elements. Omitted initialisers do not reduce the bound.', ['8','3','0','0','0']),
    p('A designated initialiser names an index explicitly. It is useful when a small number of entries in a fixed table have nonzero values. An inferred bound includes the largest initialised index, even if earlier positions are omitted.'),
    code('Designated entries and inferred size', '''int weights[] = {[2] = 7, [5] = 9};
printf("count=%zu first=%d last=%d\\n", sizeof weights / sizeof weights[0], weights[0], weights[5]);''', expected='count=6 first=0 last=9\n'),
    table('Initialisation cases', ['Declaration', 'Result', 'Reason'], [
        ['`int a[3] = {1};`','1, 0, 0','Omitted aggregate entries are zero-initialised'],
        ['`int a[] = {1, 2};`','Two elements','Bound inferred from the list'],
        ['`int a[2] = {1, 2, 3};`','Constraint violation','More initialisers than available elements'],
        ['`int a[3];` inside a block','Indeterminate until written','No automatic zero-initialisation'],
        ['`static int a[3];`','0, 0, 0','Static storage has default zero-initialisation']]),
    note('Do not call uninitialised entries random values', 'An indeterminate value is not a dependable input. Write an element before reading it. A plausible result in a test does not justify the read.'), rule='N1570 6.7.9'),
sec('Indexing, contiguous layout, and valid bounds',
    p('Subscripting connects a logical position to storage. If an element occupies `s` bytes, the byte offset of index `i` is `i * s`. C pointer arithmetic already scales by the element type, so an expression such as `scores + i` advances by `i` elements, not `i` bytes.'),
    code('An element and its pointer form', '''int values[4] = {10, 20, 30, 40};
int *first = values;
printf("%d %d\\n", values[2], *(first + 2));''', expected='30 30\n'),
    p('The unary `*` follows a pointer to designate the referred-to object. Here, `first` points to the first int of the array, and `first + 2` points to the third. This is the limited pointer vocabulary needed for the array model; Unit 2 develops pointer declarations and operations in detail.'),
    table('Worked address calculation - hypothetical four-byte int and base 1000', ['Index','Element offset','Byte offset','Start address'], [['0','0','0','1000'],['1','1','4','1004'],['2','2','8','1008'],['3','3','12','1012']]),
    p('These numbers illustrate the formula. Actual `sizeof(int)` and addresses are implementation-dependent. Contiguity means there is no padding between array elements beyond the size already included in the element type. It does not make adjacent unrelated objects accessible as array elements.'),
    code('One-past pointer formation versus access', '''int values[4] = {10, 20, 30, 40};
int *end = values + 4;       /* valid one-past pointer */
/* int x = *end; */         /* invalid: no element exists there */
printf("last=%d distance=%td\\n", values[3], end - values);''', expected='last=40 distance=4\n'),
    note('Bounds must precede the access', 'A valid read or write requires an index in `[0, count)`. Negative indices and index `count` are outside this array. The one-past pointer is useful as a stopping marker and must not be dereferenced.'), rule='N1570 6.5.2.1 and 6.5.6'),
sec('Array-to-pointer conversion and sizeof',
    p('An array object and a pointer object are different. In most expression contexts the array expression is converted to a pointer to its initial element. This conversion does not allocate a pointer inside the array and does not change the array object into a pointer object.'),
    code('Preserve the array type for sizeof', '''int values[6] = {1, 2, 3};
int *pointer = values;
printf("elements=%zu\\n", sizeof values / sizeof values[0]);
printf("array bytes=%zu pointer bytes=%zu\\n", sizeof values, sizeof pointer);'''),
    p('The first line is always `elements=6`. The other sizes depend on the implementation. `sizeof values` sees the whole array; `sizeof pointer` sees only the pointer object. The size quotient is valid when its numerator names an actual array whose type is still available.'),
    p('Unary address-of is another important exception to array conversion. `&values` is a pointer to the whole six-element array, while the converted expression `values` is a pointer to its first int. The addresses may denote the same starting storage, but their pointed-to types and step sizes differ.'),
    code('Pointer-to-element and pointer-to-array', '''int values[6] = {0};
int *element = values;
int (*whole)[6] = &values;
printf("element bytes=%zu whole bytes=%zu\\n", sizeof *element, sizeof *whole);'''),
    note('Function parameters do not carry an array bound automatically', '`void inspect(int a[6])` has an adjusted pointer parameter, not a copied six-element array. Pass a separate count and define the valid range. The `6` spelling alone does not enforce a runtime size check.'), rule='N1570 6.3.2.1, 6.5.3.4, and 6.7.6.3'),
sec('Traversal and reduction with a loop invariant',
    p('Traversal visits each occupied element once. A reduction combines many values into one result, for example a total, maximum, or count. State the invariant at the beginning of each iteration: before index `i`, the accumulator describes exactly the processed prefix `[0, i)`.'),
    code('Sum and maximum for a known nonempty array', r'''#include <stdio.h>

int main(void) {
    int values[] = {-8, -3, -5, -1};
    size_t count = sizeof values / sizeof values[0];
    long long total = 0;
    int maximum = values[0];
    for (size_t i = 0; i < count; ++i) {
        total += values[i];
        if (values[i] > maximum) maximum = values[i];
    }
    printf("total=%lld maximum=%d\n", total, maximum);
    return 0;
}''', 'program', expected='total=-17 maximum=-1\n'),
    table('Trace after each body execution', ['Index','Element','Total','Maximum'], [['0','-8','-8','-8'],['1','-3','-11','-3'],['2','-5','-16','-3'],['3','-1','-17','-1']]),
    p('Initialising the maximum to zero would give an incorrect result for these all-negative values. Element zero is a valid initial candidate because this concrete array is nonempty. A reusable API needs an explicit empty-input result. Using a wider accumulator reduces overflow risk but does not prove safety for an arbitrarily long collection; constrain or check the sum.'),
    p('The loop maintains `0 <= i <= count`, and accesses only when `i < count`. It performs `count` body executions, giving linear time and constant auxiliary storage. The proof of the mathematical result and the proof of valid C operations are separate obligations.'), rule='N1570 6.8.5'),
sec('Linear search and explicit not-found results',
    p('Searching an unsorted array must in general inspect multiple elements. A linear search compares entries in order and stops on the first match. A not-found representation must be distinguishable from every valid position; using `length` as the sentinel works when valid positions are below it.'),
    code('Find the first matching position', '''int values[] = {20, 10, 20, 30};
size_t length = sizeof values / sizeof values[0];
int target = 20;
size_t found = length;
for (size_t i = 0; i < length; ++i) {
    if (values[i] == target) { found = i; break; }
}
if (found == length) puts("not found");
else printf("index=%zu\\n", found);''', expected='index=0\n'),
    p('For duplicate values, this algorithm returns the first position. Test a match at zero, a match at the last occupied index, an absent target, and a logical length of zero. No element access occurs for empty input. The worst case makes `length` comparisons; the best case with a first-element match makes one.'),
    note('Sentinels are interface decisions', 'Do not cast a not-found -1 to `size_t` and then accidentally treat it as an index. Return a success flag and output position, or choose and document a sentinel such as the length. Unit 3 develops the full searching algorithms.')),
sec('Logical length, capacity, and insertion',
    p('A physical array can hold more slots than a logical collection uses. Maintain the invariant `length <= capacity`, with entries only in `[0, length)`. Insertion at `position` accepts `0 <= position <= length`; a spare physical slot is required before shifting begins.'),
    code('Insert into a fixed-capacity array', r'''#include <stdio.h>

int main(void) {
    enum { CAPACITY = 6 };
    int values[CAPACITY] = {10, 20, 30};
    size_t length = 3;
    size_t position = 1;
    int incoming = 15;
    if (position > length || length == CAPACITY) return 1;
    for (size_t i = length; i > position; --i) {
        values[i] = values[i - 1];
    }
    values[position] = incoming;
    ++length;
    for (size_t i = 0; i < length; ++i) printf("%d%c", values[i], i + 1 == length ? '\n' : ' ');
    return 0;
}''', 'program', expected='10 15 20 30\n'),
    steps('Verify the insertion position and free capacity before modifying storage.', 'Copy index 2 to 3, then index 1 to 2. Work backward so each source survives until copied.', 'Store 15 at index 1. Increment length only after completing the update.'),
    memory('Occupied prefix after insertion; two remaining slots are outside the logical collection.', ['10','15','20','30','unused','unused']),
    p('Insertion at the end performs no shifts. Insertion at zero moves every occupied entry. For position `p` and length `n`, exactly `n-p` entries move. This is a linear worst-case operation even though accessing any selected slot is constant-time. A dynamically growing allocation changes the capacity strategy, not this order-preserving shifting cost.')),
sec('Deletion, reversal, and preserving invariants',
    p('Deleting an occupied position shifts all later entries left and then decreases the length. The old final slot is no longer part of the logical collection; it need not be physically removed. Order-preserving deletion and swap-with-last deletion have different observable behaviour.'),
    code('Delete an entry while preserving order', '''int values[6] = {10, 15, 20, 30};
size_t length = 4, position = 2;
if (position >= length) return 1;
for (size_t i = position; i + 1 < length; ++i) values[i] = values[i + 1];
--length;
for (size_t i = 0; i < length; ++i) printf("%d%c", values[i], i + 1 == length ? '\\n' : ' ');''', expected='10 15 30\n'),
    p('If order does not matter, replace the deleted slot with the last occupied entry before decrementing length; that avoids shifting. It is unsuitable when the sequence order is part of the contract. Reversal instead swaps symmetric entries, needing no second full-sized array.'),
    code('In-place reversal without unsigned underflow', '''int values[] = {1, 2, 3, 4, 5};
size_t length = sizeof values / sizeof values[0];
for (size_t i = 0; i < length / 2; ++i) {
    size_t opposite = length - 1 - i;
    int temporary = values[i];
    values[i] = values[opposite];
    values[opposite] = temporary;
}
for (size_t i = 0; i < length; ++i) printf("%d%c", values[i], i + 1 == length ? '\\n' : ' ');''', expected='5 4 3 2 1\n'),
    p('For zero or one occupied entry, the reversal body never executes. The potentially dangerous `length - 1` is therefore evaluated only when length is at least two. A loop that initialises an unsigned right index to `length - 1` before checking emptiness would require extra care.')),
sec('Array copying and representation limits',
    p('Arrays cannot be assigned as whole array values. An element loop copies according to the element type and lets you transform values. A byte copy is suitable for these int arrays when both objects have adequate storage and the overlap requirements are met.'),
    code('Copy elements explicitly', '''int source[] = {4, 8, 12};
int destination[3] = {0};
size_t count = sizeof source / sizeof source[0];
for (size_t i = 0; i < count; ++i) destination[i] = source[i];
printf("copied=%d\\n", destination[2]);''', expected='copied=12\n'),
    code('Whole-array assignment is invalid', 'int source[3] = {4, 8, 12};\nint destination[3];\ndestination = source; /* constraint violation: arrays are not assignable */', 'invalid'),
    p('`memcpy(destination, source, sizeof source)` is an alternative when the destination is at least that large and the regions do not overlap. `memmove` handles overlap. Neither knows a logical collection length: the byte count supplied by the caller is the contract. For arrays of pointers, copying entries copies addresses, not independent copies of the referred-to objects.'), rule='N1570 6.5.16 and 7.24.2'),
sec('Operation costs, boundary tests, and design exercise',
    table('Array operations for n occupied entries', ['Operation','Work','Condition'], [['Read/write known index','Constant','Index already validated'],['Traversal / unsorted search','Linear worst case','Search may stop earlier'],['Append','Constant','Spare capacity exists'],['Ordered insert/delete','Linear worst case','Suffix movement required'],['In-place reverse','Linear','Constant auxiliary storage']]),
    bullets('Test an empty logical collection without declaring a zero-bound array.', 'Test capacity one, full capacity, insert at both ends, and rejection of position > length.', 'Test all-negative maxima, duplicate search keys, and deleting the final entry.', 'Check that failed operations preserve both storage contents and logical length.'),
    p('Worked design exercise: implement a fixed-capacity sorted collection that permits duplicates. Find the first insertion position greater than the incoming value if duplicates must stay stable; reject full capacity before shifting; move the suffix backward; write once; update length. Justify sortedness for the prefix, inserted pair of boundaries, and shifted suffix separately. Locating the position and shifting both have linear worst-case work.'),
    note('Diagnostic check', 'Compile complete programs with warnings. When your toolchain supports them, use bounds and undefined-behaviour sanitizers for executable tests. Do not execute the deliberately incorrect examples to infer a portable output.'), rule='CERT ARR30-C', source='https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/arrays-arr/arr30-c/')
])

rewrite('two-dimensional-arrays', [
sec('Declaration and the array-of-rows model',
    p('A two-dimensional array is an array whose elements are themselves arrays. In `int grid[2][3]`, the outer array has two elements; each outer element is a three-int row. This nesting explains indexing, memory stride, initialisation, and function parameter types. It is more precise than describing the object as a collection of pointers.'),
    code('Declare a rectangular matrix', '''int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
printf("rows=%zu columns=%zu\\n", sizeof grid / sizeof grid[0], sizeof grid[0] / sizeof grid[0][0]);
printf("selected=%d\\n", grid[1][2]);''', expected='rows=2 columns=3\nselected=6\n'),
    p('Read the declaration outward from `grid`: array of 2, whose elements are arrays of 3, whose elements are int. `grid[1]` designates a whole row, and `grid[1][2]` designates one int in that row. You can assign to the int but cannot assign a whole row with an array assignment.'),
    code('Shape-aware syntax', 'element_type name[row_count][column_count];\nname[row_index][column_index] = new_value;', 'illustration'),
    note('Each dimension has its own bound', 'For a 2-by-3 matrix, row 2 and column 3 are invalid. An apparently accessible flattened address does not make an out-of-range inner subscript legal.'), rule='N1570 6.7.6.2 and 6.5.2.1'),
sec('Initialisers, omitted elements, and inferred dimensions',
    p('Braces reveal the hierarchy. Each inner list initialises one row. When a row list omits entries, the rest of that row is zero-initialised; it does not take the next row\'s first value. The first dimension can be inferred from row initialisers, but the inner width determines the row type and cannot simply be omitted.'),
    code('Partial and inferred initialisation', '''int partial[2][3] = {{1}, {4, 5}};
int inferred[][3] = {{7, 8, 9}, {10, 11, 12}};
printf("partial=%d,%d,%d;%d,%d,%d\\n", partial[0][0], partial[0][1], partial[0][2], partial[1][0], partial[1][1], partial[1][2]);
printf("rows=%zu\\n", sizeof inferred / sizeof inferred[0]);''', expected='partial=1,0,0;4,5,0\nrows=2\n'),
    code('Designate a particular row and column', '''int lookup[3][4] = {[1][2] = 9};
printf("chosen=%d omitted=%d\\n", lookup[1][2], lookup[2][3]);''', expected='chosen=9 omitted=0\n'),
    p('A flat initialiser can fill elements successively in row-major order, but nested braces make shape mistakes easier to review. Avoid relying on missing-braces warnings as your primary way of communicating the intended matrix. An automatic matrix with no initialiser must have each accessed element written before being read.'), rule='N1570 6.7.9'),
sec('Row-major storage and address derivation',
    p('All elements of row zero precede all elements of row one. For R rows and C columns, row `i` begins after `i*C` elements; column `j` then adds `j`. The resulting element offset is `i*C+j`, and the byte offset multiplies by the element size.'),
    memory('Physical order of the 2-by-3 matrix, with coordinate labels.', ['1','2','3','4','5','6'], ['[0][0]','[0][1]','[0][2]','[1][0]','[1][1]','[1][2]']),
    table('Hypothetical base 2000 and four-byte int', ['Coordinate','Offset in elements','Offset in bytes','Start address'], [['[0][2]','0*3+2 = 2','8','2008'],['[1][0]','1*3+0 = 3','12','2012'],['[1][2]','1*3+2 = 5','20','2020']]),
    p('The stride of the row is `sizeof grid[0]`, not `sizeof(int*)`. In most expressions `grid` converts to a pointer to its first row. Advancing that pointer by one skips three ints. `grid[0]` instead converts to a pointer to the first int in row zero, whose increment skips one int.'),
    code('Expose the row type explicitly', '''int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
int (*row_pointer)[3] = grid;
printf("next row first=%d row bytes=%zu\\n", row_pointer[1][0], sizeof *row_pointer);'''),
    note('Do not cast to int **', 'An `int **` points to an int-pointer object. This matrix contains ints grouped into rows and has no stored row pointers. A cast does not manufacture the missing pointer objects or repair the layout.'), rule='N1570 6.3.2.1 and 6.5.6'),
sec('Traversal, row totals, and locality',
    p('A row-outer, column-inner loop follows consecutive elements. Each inner-loop invariant states that the row total describes columns `[0, col)` in the current row. Reset the total inside the outer loop to prevent carrying a previous row\'s result into the next.'),
    code('Compute totals of individual rows', r'''#include <stdio.h>
int main(void) {
    int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
    for (size_t row = 0; row < 2; ++row) {
        int total = 0;
        for (size_t col = 0; col < 3; ++col) total += grid[row][col];
        printf("row %zu total=%d\n", row, total);
    }
    return 0;
}''', 'program', expected='row 0 total=6\nrow 1 total=15\n'),
    p('Both row-first and column-first traversals can be correct if their bounds are correct. Row-first typically has better locality for row-major storage because successive accesses are near each other. This is a performance expectation, not a guarantee of timing; hardware caches, compiler transformations, and problem size affect measurements.'),
    p('An R-by-C traversal performs R*C visits. Fixed examples use small values whose sums fit int. General row totals require a wider or checked accumulator. Test non-square matrices because a mistaken swapped bound can remain hidden on square input.')),
sec('Matrix addition and transpose',
    p('Addition requires equal row and column dimensions; every result coordinate depends on exactly two corresponding input elements. Transposition changes the shape: an R-by-C input requires a C-by-R result. A rectangular transpose therefore cannot use the original dimensions unchanged.'),
    code('Transpose a rectangular matrix', r'''#include <stdio.h>
int main(void) {
    int source[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int transposed[3][2] = {0};
    for (size_t row = 0; row < 2; ++row)
        for (size_t col = 0; col < 3; ++col)
            transposed[col][row] = source[row][col];
    for (size_t row = 0; row < 3; ++row)
        printf("%d %d\n", transposed[row][0], transposed[row][1]);
    return 0;
}''', 'program', expected='1 4\n2 5\n3 6\n'),
    steps('Map input [0][0] to output [0][0], and input [0][1] to output [1][0].', 'Map input [1][0] to output [0][1]; observe why the destination row count must be three.', 'After all six assignments, output rows contain the original columns.'),
    p('A square in-place transpose can swap pairs above and below the diagonal. Swapping every coordinate would undo earlier swaps, so visit only `col > row`. The rectangular case generally needs a different algorithm or a separate destination.'),
    code('One addition expression with its required shape', '''int a[2][2] = {{1, 2}, {3, 4}}, b[2][2] = {{4, 3}, {2, 1}};
int sum[2][2] = {0};
for (size_t row = 0; row < 2; ++row)
    for (size_t col = 0; col < 2; ++col) sum[row][col] = a[row][col] + b[row][col];
printf("%d %d\\n%d %d\\n", sum[0][0], sum[0][1], sum[1][0], sum[1][1]);''', expected='5 5\n5 5\n')),
sec('Matrix multiplication: dimensions, trace, and cost',
    p('For A with shape R-by-K and B with shape K-by-C, their product has shape R-by-C. Output `[i][j]` is a dot product: sum over `k` of `A[i][k]*B[k][j]`. The common inner dimension is essential; multiplying corresponding elements is not matrix multiplication.'),
    code('Multiply two small matrices', r'''#include <stdio.h>
int main(void) {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int b[3][2] = {{7, 8}, {9, 10}, {11, 12}};
    int product[2][2] = {0};
    for (size_t i = 0; i < 2; ++i)
        for (size_t j = 0; j < 2; ++j)
            for (size_t k = 0; k < 3; ++k)
                product[i][j] += a[i][k] * b[k][j];
    printf("%d %d\n%d %d\n", product[0][0], product[0][1], product[1][0], product[1][1]);
    return 0;
}''', 'program', expected='58 64\n139 154\n'),
    table('Trace for output [0][0]', ['k','Product','Accumulator'], [['0','1*7 = 7','7'],['1','2*9 = 18','25'],['2','3*11 = 33','58']]),
    p('The straightforward method uses R*K*C multiplications and comparable accumulation work. Larger examples must check both multiplication and addition ranges. Loop reordering and blocked algorithms can improve locality, but preserve the arithmetic and dimension contract. Floating-point reordering can also change rounding, so exact real-number algebra alone does not justify every numerical transformation.')),
sec('Interfaces and test cases',
    p('A fixed-width parameter such as `void show(size_t rows, const int a[][3])` adjusts to a pointer to a row of three ints. The function needs the row count separately. Omitting the column width loses the row stride needed by ordinary double indexing. If your chosen C implementation supports VLA parameters, later interfaces can express runtime widths; this unit\'s complete examples avoid requiring that optional feature.'),
    table('Boundary checks for matrix operations', ['Case','Check'], [['1-by-1','Smallest nonempty matrix'],['2-by-3 transpose','Destination is 3-by-2'],['Incompatible multiply','Reject when inner dimensions differ'],['All zeros / identity','Check known algebraic results'],['Large element magnitudes','Check products and totals before arithmetic']]),
    p('Worked exercise: describe the contract for multiplying a 3-by-2 matrix by a 2-by-4 matrix. The output has 12 entries; each entry combines two products, so the basic algorithm performs 24 multiplications. A 2-by-4 second matrix is valid, while a 3-by-4 second matrix is not. Explain these facts before writing loop bounds.'))
])

rewrite('multidimensional-arrays', [
sec('Shape, nesting, and declaration',
    p('An array can have arrays as elements repeatedly. A declaration with three dimensions describes planes containing rows containing scalar elements. Each dimension is part of the nested type, and the rightmost index varies fastest in physical storage.'),
    code('Three-dimensional declaration', '''int readings[2][3][4] = {0};
readings[1][2][3] = 42;
printf("elements=%zu selected=%d\\n", sizeof readings / sizeof readings[0][0][0], readings[1][2][3]);''', expected='elements=24 selected=42\n'),
    p('The shape 2-by-3-by-4 means two planes, three rows per plane, and four entries per row. It does not mean a runtime-resizable collection. The total element count is the product of the dimensions, but bounds remain independent: a valid plane index cannot compensate for an invalid row index.'),
    code('Initialise by plane and row', '''int data[2][2][3] = {
    {{1, 2, 3}, {4, 5, 6}},
    {{7, 8, 9}, {10, 11, 12}}
};
printf("first=%d final=%d\\n", data[0][0][0], data[1][1][2]);''', expected='first=1 final=12\n'),
    rule='N1570 6.7.6.2 and 6.7.9'),
sec('Strides derived from the shape',
    p('For shape A-by-B-by-C, one plane contains B*C elements and one row contains C elements. The element offset of `[i][j][k]` is `i*(B*C)+j*C+k`, equivalently `((i*B)+j)*C+k`. Derive the expression from how many complete subarrays precede the coordinate rather than memorising it without a model.'),
    table('Shape [2][3][4]: offset components', ['Coordinate','Planes','Rows','Columns','Total'], [['[0][1][2]','0*12','1*4','2','6'],['[1][0][0]','1*12','0*4','0','12'],['[1][2][3]','1*12','2*4','3','23']]),
    p('Multiply an element offset by `sizeof(element)` for a byte offset. In a hypothetical four-byte int layout, offset 23 corresponds to byte offset 92. The last element ends at total storage size 96. These are arithmetic teaching assumptions, not hard-coded facts about all C implementations.'),
    code('A flattened-offset calculation', '''size_t b = 3, c = 4, i = 1, j = 2, k = 3;
size_t offset = (i * b + j) * c + k;
printf("offset=%zu\\n", offset);''', expected='offset=23\n'),
    note('Nested arrays retain subarray boundaries', 'Do not obtain a pointer to the first int of one row and then treat it as a pointer into an unlimited flat array spanning all rows. Use valid nested indices, or deliberately create one flat allocated buffer with an explicit shape contract.'), rule='N1570 6.5.6'),
sec('Traversal and per-plane reductions',
    p('Use one loop per dimension when every coordinate needs processing. Each loop index belongs to one dimension and must remain within that dimension\'s bound. A reduction can cover a row, plane, or the entire object; where the accumulator is initialised determines its intended scope.'),
    code('Per-plane totals', r'''#include <stdio.h>
int main(void) {
    int data[2][2][3] = {{{1, 2, 3}, {4, 5, 6}}, {{7, 8, 9}, {10, 11, 12}}};
    for (size_t plane = 0; plane < 2; ++plane) {
        int sum = 0;
        for (size_t row = 0; row < 2; ++row)
            for (size_t col = 0; col < 3; ++col)
                sum += data[plane][row][col];
        printf("plane %zu: %d\n", plane, sum);
    }
    return 0;
}''', 'program', expected='plane 0: 21\nplane 1: 57\n'),
    p('For plane zero, after row zero the total is 6 and after row one it is 21. A fresh sum begins for plane one; its row totals are 24 and 33, giving 57. Placing the sum outside the plane loop would instead produce a cumulative second result of 78. Trace the accumulator scope as carefully as the indices.'),
    p('A full traversal of A-by-B-by-C makes A*B*C element visits. Loop order influences locality even though the visit count stays the same. Visiting the rightmost dimension inside usually follows adjacent elements for the declared storage order.')),
sec('Flat storage with explicit dimensions',
    p('A deliberately flat array can represent a multidimensional application domain. In that representation the C object is one-dimensional, and the shape is metadata used to compute indices. This is useful for runtime-selected shapes and interfacing with libraries expecting contiguous buffers.'),
    code('A 2-by-2-by-3 logical shape in a flat array', '''enum { PLANES = 2, ROWS = 2, COLS = 3 };
int flat[PLANES * ROWS * COLS] = {0};
size_t plane = 1, row = 0, col = 2;
size_t offset = (plane * ROWS + row) * COLS + col;
flat[offset] = 17;
printf("offset=%zu value=%d\\n", offset, flat[offset]);''', expected='offset=8 value=17\n'),
    p('A runtime version must validate each coordinate and check products before calculating storage. If dimensions are positive and the complete shape product fits size_t, valid coordinate offsets are below that product. This gives a convenient proof for bounds, but the proof requires the overflow checks before forming the product.'),
    p('The shape is not recoverable from a raw pointer. Keep it with the allocation in a documented interface. Reinterpreting shape without moving values can change the logical meaning of the same physical order, which is useful but must be intentional.')),
sec('Dense storage, sparse alternatives, and resource planning',
    table('Storage calculation for a hypothetical four-byte element', ['Shape','Entries','Bytes'], [['10*10*10','1,000','4,000'],['100*100*100','1,000,000','4,000,000'],['1000*1000*1000','1,000,000,000','4,000,000,000']]),
    p('Increasing every dimension by ten multiplies a three-dimensional array\'s entries by a thousand. That growth explains why a compact declaration can request an impractical amount of storage. Large automatic objects can exceed environment resources; C does not prescribe that all such objects live on a particular machine stack.'),
    p('Dense storage reserves every coordinate. A sparse representation instead stores selected coordinates and values. It saves unused slots when occupancy is low, while adding coordinate storage, lookup cost, and more complex update rules. The best choice depends on the access pattern, not solely on the number of dimensions.'),
    note('Runtime allocation can fail', 'Even a nonoverflowing size request is not a promise of available memory. Allocation failure and resource limits belong in the representation design, not only in a late error handler.')),
sec('Worked design exercise and boundary cases',
    p('Design a daily reading archive with 7 days, 24 hours per day, and 4 sensors per hour. The shape contains 672 readings. Coordinate day=2, hour=5, sensor=3 has element offset `(2*24+5)*4+3 = 215`. The following coordinate is sensor=0 at hour=6, offset 216; it is not sensor=4 in the earlier hour.'),
    code('Compute the archive offset', '''size_t day = 2, hour = 5, sensor = 3;
if (day >= 7 || hour >= 24 || sensor >= 4) return 1;
size_t offset = (day * 24 + hour) * 4 + sensor;
printf("offset=%zu\\n", offset);''', expected='offset=215\n'),
    bullets('Check the first coordinate and the final valid coordinate.', 'Reject one excessive coordinate even if the other coordinates are zero.', 'Test a singleton dimension to expose mistaken loop bounds.', 'Check that a per-plane reduction resets at the correct nesting level.', 'For runtime shapes, define whether zero-sized dimensions represent an empty domain or invalid input.'))
])

rewrite('dynamic-arrays', [
sec('Pointer vocabulary and the allocation model',
    p('Runtime-selected storage separates three things: the pointer object that holds an address, the allocation to which it refers, and metadata describing occupied length and available capacity. The pointer itself does not remember the number of entries. An owner is the part of the program responsible for eventually releasing the allocation.'),
    code('Pointer and allocation are different objects', '''size_t count = 3;
int *items = malloc(count * sizeof *items);
if (items == NULL) return 1;
items[0] = 10; items[1] = 20; items[2] = 30;
printf("third=%d pointer bytes=%zu\\n", items[2], sizeof items);
free(items);'''),
    p('`int *items` declares a pointer to int. `items[i]` designates an int reached through that pointer when the region and index are valid. `sizeof *items` uses the int type; in this non-VLA case it does not read the allocation. `sizeof items` reports pointer storage, so it cannot calculate the allocated element count.'),
    p('The fixed count in this focused example is small and safe. A general input count needs the size checks shown below. Automatic lifetime of the local pointer does not automatically free the allocation when its block ends. Losing the owner without releasing storage produces a leak.'),
    note('The word dynamic is not one single C construct', 'A VLA has a runtime-selected bound and block-related lifetime but cannot be resized. A malloc-managed region has explicit allocated lifetime. A growable array is a data-structure policy implemented on top of allocation. These concepts must not be collapsed into one definition.'), rule='N1570 6.2.4 and 7.22.3'),
sec('Allocation functions: interfaces and initial values',
    code('Library interfaces from <stdlib.h>', 'void *malloc(size_t size);\nvoid *calloc(size_t count, size_t size);\nvoid *realloc(void *pointer, size_t size);\nvoid free(void *pointer);', 'illustration'),
    table('Allocation contracts', ['Function','Request','Initial contents / failure'], [['`malloc`','One byte count','Indeterminate bytes; NULL on failure'],['`calloc`','Element count and element size','Zero bytes; NULL on failure'],['`realloc`','New byte count for an existing region','Preserves the common prefix; nonzero failure preserves old region'],['`free`','Original allocation pointer or NULL','Ends allocation lifetime; returns no value']]),
    p('In C, the returned `void *` converts to an object-pointer type without an explicit cast. Include the header so the interface is declared. The cast does not make a missing declaration acceptable. Prefer a size based on the destination type, such as `sizeof *items`, so changing the pointer type does not silently retain the old element size.'),
    code('calloc for integer entries', '''size_t count = 4;
int *items = calloc(count, sizeof *items);
if (items == NULL) return 1;
printf("first=%d last=%d\\n", items[0], items[count - 1]);
free(items);''', expected='first=0 last=0\n'),
    p('Zeroed bytes represent zero for ordinary integer entries here. Do not generalise this to every possible floating-point or pointer representation. Explicit object initialisation is a different guarantee from byte clearing. Zero-size allocation behaviour also needs a separate policy; this chapter keeps an empty growable array as a NULL owner with zero capacity.'), rule='N1570 7.22.3.1-7.22.3.4'),
sec('Check size arithmetic before making the request',
    p('Allocation sizes use size_t, an unsigned integer type. Unsigned arithmetic wraps, so an excessive multiplication can become a small byte count. malloc cannot know that the wrapped request was supposed to hold more elements. Check the count before computing the product.'),
    code('Checked nonzero allocation', '''size_t count = 5;
int *items = NULL;
if (count == 0 || count > SIZE_MAX / sizeof *items) return 1;
items = malloc(count * sizeof *items);
if (items == NULL) return 1;
for (size_t i = 0; i < count; ++i) items[i] = (int)i;
printf("last=%d\\n", items[count - 1]);
free(items);''', expected='last=4\n'),
    p('`SIZE_MAX / sizeof *items` is the largest safe element count for this multiplication. Division happens before the comparison and before multiplication. An alternative check performed after a wrapped product is too late. This arithmetic guard establishes representability, not availability; a valid request can still fail.'),
    steps('Validate the domain policy for count, including zero.', 'Ensure the byte product fits size_t.', 'Request storage and check the returned pointer.', 'Write values before reading malloc-provided entries.', 'Release the allocation on every path that owns it.'), rule='CERT MEM35-C', source='https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/memory-management-mem/mem35-c/'),
sec('Resizing without losing the owner',
    p('A successful nonzero realloc request provides a new allocation of the requested size, preserving the old byte prefix up to the smaller size. It may move the allocation. Added storage is not initialised. On failure, the old allocation remains valid, so retain its pointer until success is established.'),
    code('Safe resizing sequence', '''size_t length = 3, capacity = 3;
int *items = malloc(capacity * sizeof *items);
if (items == NULL) return 1;
items[0] = 10; items[1] = 20; items[2] = 30;
size_t wanted = 6;
if (wanted > SIZE_MAX / sizeof *items) { free(items); return 1; }
int *replacement = realloc(items, wanted * sizeof *items);
if (replacement == NULL) { free(items); return 1; }
items = replacement;
capacity = wanted;
items[length++] = 40;
printf("length=%zu capacity=%zu last=%d\\n", length, capacity, items[length - 1]);
free(items);''', expected='length=4 capacity=6 last=40\n'),
    code('Losing the sole owner on failure', 'items = realloc(items, new_bytes);\n/* If the request fails, items becomes NULL and the old allocation is lost. */', 'invalid'),
    p('The example chooses to free and exit on failure; a reusable reserve operation may instead return failure while leaving the original data structure unchanged. Update capacity only after success. Shrinking must also consider logical length: do not preserve a length greater than the new capacity.'),
    note('Aliases do not survive a successful realloc', 'Any pointer into the old allocation becomes invalid after successful realloc, even when the returned numeric address appears unchanged. Save an index if needed, then derive a fresh pointer from the returned owner. Never compare or reuse a stale alias as an ownership test.'), rule='N1570 7.22.3.5'),
sec('Growing an array: a complete append example',
    p('Maintain `length <= capacity`, with initialised entries in `[0, length)`. Append first reserves a slot when full, then writes the new value, then increments length. Capacity growth and byte-size multiplication require separate guards. This complete program uses geometric growth and an empty initial state.'),
    code('Geometric growth for ten values', r'''#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
int main(void) {
    int *items = NULL;
    size_t length = 0, capacity = 0;
    for (int value = 1; value <= 10; ++value) {
        if (length == capacity) {
            if (capacity > SIZE_MAX / 2) { free(items); return 1; }
            size_t next = capacity == 0 ? 4 : capacity * 2;
            if (next > SIZE_MAX / sizeof *items) { free(items); return 1; }
            int *replacement = realloc(items, next * sizeof *items);
            if (replacement == NULL) { free(items); return 1; }
            items = replacement;
            capacity = next;
        }
        items[length] = value;
        ++length;
    }
    printf("length=%zu capacity=%zu\n", length, capacity);
    for (size_t i = 0; i < length; ++i) printf("%d%c", items[i], i + 1 == length ? '\n' : ' ');
    free(items);
    return 0;
}''', 'program', expected='length=10 capacity=16\n1 2 3 4 5 6 7 8 9 10\n'),
    table('Capacity transitions', ['Before append','Reason for reserve','New capacity'], [['length 0, capacity 0','First slot needed','4'],['length 4, capacity 4','Fifth value','8'],['length 8, capacity 8','Ninth value','16']]),
    p('Not every spare slot is an occupied entry. The final six spare slots must not be traversed as values. The program stores only its small loop values, so converting them is safe. A library implementation would package owner, length, and capacity into a structure and move allocation logic into a function; Unit 2 supplies those constructs.')),
sec('Amortised cost and growth trade-offs',
    p('An ordinary append with spare capacity writes one element, giving constant work. A resizing append can require copying the occupied prefix, giving linear work in its current length. Doubling avoids that copy on every insertion. Capacities form a geometric progression, so total moved elements over many appends are bounded by a constant multiple of the final length.'),
    p('For illustrative capacities 1, 2, 4, 8, 16, moving old contents totals 1+2+4+8 = 15 by the time capacity becomes 16. This explains amortised constant append work under a model that charges for possible copying. It does not promise that each append has constant latency or that realloc always physically copies.'),
    table('Growth policies', ['Policy','Effect'], [['Grow by one slot','Can cause quadratic total copying'],['Double capacity','Linear total copying, extra unused slots'],['Reserve a known final count','Avoids intermediate growth when the count is trustworthy'],['Small fixed increment','Lower spare capacity, more frequent relocation']]),
    p('A memory-constrained system may choose a smaller growth factor or a maximum capacity. A latency-constrained system may reserve ahead or choose another representation. Performance analysis must include allocation failures and address invalidation, not only the number of successful element writes.')),
sec('Release, dangling pointers, and test strategy',
    code('Release and clear the local owner', '''int *items = malloc(3 * sizeof *items);
if (items == NULL) return 1;
items[0] = 7;
free(items);
items = NULL;
free(items); /* free(NULL) is allowed */
puts("released");''', expected='released\n'),
    p('Setting the owner to NULL prevents accidental access through that variable, but any other saved pointer still needs to be discarded. A pointer into the middle of an allocation is not a valid argument to free. Neither is an automatic array. Releasing the original allocation twice or reading after release has undefined behaviour.'),
    bullets('Test the empty initial state and the first append.', 'Test exactly-full capacity and the next append that triggers growth.', 'Test shrink rejection when length would exceed the new capacity.', 'Inject allocation failure through an explicit allocator seam to test cleanup deterministically.', 'Check that every failure path preserves or releases ownership according to its documented contract.'),
    p('Requesting an enormous block is not a dependable failure-injection test: virtual-memory policies vary, and success can occur without committing every page immediately. A test allocator that fails on a selected request provides a reproducible check. Later reusable functions should expose a narrow allocation seam rather than making the whole algorithm depend on test-specific global state.'), rule='N1570 7.22.3.3')
])

rewrite('string-handling', [
sec('A string is a terminated sequence, not just a char array',
    p('A C string consists of characters up to and including its first zero terminator. The string length excludes that terminator, while storage capacity includes all available slots. These three facts - capacity, content length, and termination - must stay consistent whenever text is changed.'),
    code('Writable string and character buffer', '''char word[] = "cat";
char bytes[3] = {'c', 'a', 't'};
printf("length=%zu capacity=%zu raw bytes=%zu\\n", strlen(word), sizeof word, sizeof bytes);''', expected='length=3 capacity=4 raw bytes=3\n'),
    memory('`word` includes a zero terminator. The byte after t is part of its storage.', ['c','a','t','\\0']),
    p('`bytes` is a valid character array but is not a terminated string. Passing it to strlen or an unbounded `%s` conversion can read outside the object. You cannot safely discover whether an arbitrary buffer is terminated by first calling strlen on it.'),
    code('Literal storage versus an editable array', '''const char *label = "cat";
char editable[] = "cat";
editable[0] = 'b';
printf("literal=%s editable=%s\\n", label, editable);''', expected='literal=cat editable=bat\n'),
    p('A string literal has array storage, but attempting to modify it is undefined behaviour. A char array initialised from the literal is a separate writable object. In C11, a char array exactly as large as the visible letters may be initialised from a literal without room for the terminator, so bound choices still matter.'),
    note('Bytes are not necessarily user-visible characters', '`strlen` counts bytes. A UTF-8 character can occupy multiple bytes, and embedded zero ends a C string. Use explicit lengths for binary data and an appropriate text library for Unicode character operations.'), rule='N1570 6.4.5, 6.7.9, and 7.1.1'),
sec('The string library: interfaces and work performed',
    code('Common <string.h> interfaces', 'size_t strlen(const char *s);\nchar *strcpy(char *destination, const char *source);\nchar *strcat(char *destination, const char *source);\nint strcmp(const char *left, const char *right);\nchar *strchr(const char *s, int character);\nchar *strstr(const char *s, const char *substring);', 'illustration'),
    table('Operation contracts', ['Operation','Required condition','Result'], [['`strlen`','Valid terminated source','Count before zero'],['`strcpy`','Capacity >= source length+1; no overlap','Copies source including zero'],['`strcat`','Terminated destination with enough remaining room; no overlap','Appends including new terminator'],['`strcmp`','Two valid strings','Negative, zero, or positive ordering'],['`strchr` / `strstr`','Valid source strings','Pointer to match or NULL']]),
    p('None of these interfaces receives a destination capacity argument. The caller establishes that requirement. A string operation has no way to infer the physical capacity from an ordinary char pointer. Keep capacity in the surrounding object or API rather than assuming it is encoded in the pointer.'),
    p('A scan to the terminator takes work proportional to the bytes scanned. Computing strlen inside every loop condition can repeat that work. When the string is unchanged, cache the length once; when you mutate it, make sure the cached length still describes the string.'), rule='N1570 7.24'),
sec('Copying with an explicit capacity proof',
    p('Copy only after establishing that the entire source, including its terminator, fits. For a known valid source with length n and nonzero destination capacity c, `n < c` is the required inequality. This avoids forming `n+1` in the check when n could be near SIZE_MAX.'),
    code('Reject rather than truncate a copy', '''const char *source = "Data";
char destination[8];
size_t length = strlen(source);
if (length >= sizeof destination) return 1;
strcpy(destination, source);
printf("copied=%s length=%zu\\n", destination, strlen(destination));''', expected='copied=Data length=4\n'),
    p('The source is a literal and therefore already terminated. The destination has eight slots; four letters plus zero require five. For a seven-letter source, eight slots are an exact fit. For an eight-letter source, the operation must reject or explicitly choose truncation.'),
    code('Why strncpy is not automatic safe string copying', 'char destination[3];\nstrncpy(destination, "cat", sizeof destination);\n/* All three slots hold letters; no terminator was appended. */\n/* printf("%s", destination); would therefore be invalid. */', 'invalid'),
    p('strncpy copies at most its specified character count and zero-pads when the source is shorter. When the source reaches that count, no zero is necessarily written. That contract can be useful for certain fixed-width fields, but it is not the same contract as always producing a valid terminated string.'), rule='N1570 7.24.2.3-7.24.2.4'),
sec('Concatenation: remaining space and state transitions',
    p('Appending requires an already-valid destination and a valid source. Let used be the current destination length and extra the source length. First establish `used < capacity`. Then require `extra < capacity-used`, leaving a slot for the new terminator. Do not subtract before establishing that invariant.'),
    code('Append a suffix after checking room', '''char message[16] = "Data";
const char *suffix = " through C";
size_t used = strlen(message), extra = strlen(suffix);
if (used >= sizeof message || extra >= sizeof message - used) return 1;
strcat(message, suffix);
printf("%s (%zu bytes)\\n", message, strlen(message));''', expected='Data through C (14 bytes)\n'),
    steps('Before append: length 4, capacity 16, terminator at index 4.', 'Suffix length is 10. Remaining capacity is 12, so ten letters plus one terminator fit.', 'The suffix overwrites the old terminator and writes a new terminator at index 14.', 'The final logical length is 14 and one unused slot remains.'),
    p('Repeated strcat calls search for the existing terminator repeatedly. When constructing a large string, track the write position and remaining capacity instead of rescanning the prefix after every fragment. An interface can return a success flag and updated length to make its contract explicit.'), rule='N1570 7.24.3.1'),
sec('Comparison and searching operate on contents',
    p('Pointer equality checks whether pointer values compare equal; it does not compare character sequences. Use strcmp for string contents. Only the sign of its result is specified for ordering - not a particular negative or positive numeric value.'),
    code('Contents, ordering, and search result', '''char first[] = "cat", second[] = "cat";
printf("contents equal=%d pointer equal=%d\\n", strcmp(first, second) == 0, first == second);
const char *text = "Data through C";
const char *match = strstr(text, "through");
if (match != NULL) printf("suffix=%s\\n", match);
const char *missing = strchr(text, '!');
printf("missing=%d\\n", missing == NULL);''', expected='contents equal=1 pointer equal=0\nsuffix=through C\nmissing=1\n'),
    p('The two arrays are distinct objects, so their first-element pointers compare unequal even though their letters match. The substring match points into the original source, not to an independent copied string. Its lifetime therefore depends on the source\'s lifetime.'),
    p('A pointer returned by strchr can designate the terminator if the searched character is zero. Check for NULL before dereferencing a result. Do not modify a match in literal storage; search functions returning char pointers do not grant permission to mutate read-only storage.'), rule='N1570 7.24.4 and 7.24.5'),
sec('Byte copying and overlap',
    p('memcpy and memmove copy a specified byte count without interpreting zero termination. memcpy requires nonoverlapping regions. memmove supports overlap, conceptually preserving the source bytes while carrying out the copy. To preserve a string, include its terminator in the required movement.'),
    code('Shift a string left by one character', '''char word[] = "abcde";
size_t length = strlen(word);
memmove(word, word + 1, length);
printf("shifted=%s\\n", word);''', expected='shifted=bcde\n'),
    memory('The five copied source bytes are b, c, d, e, and zero. The final stale slot is outside the new string.', ['b','c','d','e','\\0','old \\0']),
    p('The original length is five, and copying from index one for five bytes includes the original terminator at index five. Omitting that last byte would leave the terminator too far to the right and could expose stale content. Substituting memcpy for this overlapping move violates its contract.'),
    code('Copying bytes without a string contract', '''char source[3] = {'a', 'b', 'c'};
char destination[3];
memcpy(destination, source, sizeof source);
printf("last byte=%c\\n", destination[2]);''', expected='last byte=c\n'),
    p('This byte-array copy is valid, but the destination is still not a string. `%c` displays a selected character; `%s` would require termination. A byte count and a string length describe related but different representations.'), rule='N1570 7.24.2.1-7.24.2.2'),
sec('Bounded line input, exact fits, and rejection',
    p('fgets reads at most capacity-1 bytes and writes a terminator on success. It can include the newline. A missing newline alone does not prove truncation: the line may have ended at EOF, or it may contain exactly capacity-1 bytes before the newline. Probe and consume the rest deliberately when a complete line is required.'),
    code('Read one short text line or reject excess input', r'''#include <stdio.h>
#include <string.h>
int main(void) {
    char line[8];
    if (fgets(line, sizeof line, stdin) == NULL) {
        puts("No line read");
        return 1;
    }
    char *newline = strchr(line, '\n');
    if (newline != NULL) {
        *newline = '\0';
    } else {
        int next = getchar();
        if (next != '\n' && next != EOF) {
            do { next = getchar(); } while (next != '\n' && next != EOF);
            puts("Line too long");
            return 1;
        }
        if (ferror(stdin)) return 1;
    }
    printf("text=[%s] length=%zu\n", line, strlen(line));
    return 0;
}''', 'program', stdin='cat\n', expected='text=[cat] length=3\n', cases=[{'stdin':'\n','stdout':'text=[] length=0\n','exit':0},{'stdin':'1234567\n','stdout':'text=[1234567] length=7\n','exit':0},{'stdin':'12345678\n','stdout':'Line too long\n','exit':1}]),
    p('This teaching parser assumes text input without embedded zero bytes. It accepts up to seven data bytes, removes or consumes the line ending, and rejects longer lines after draining the remainder. It uses int for getchar so EOF remains distinguishable from byte values. A general binary input API must instead track explicit counts and cannot use strlen to detect consumed bytes.'),
    note('Choose the input grammar', 'Unbounded `%s` can overflow. A width such as `%7s` bounds an eight-byte destination but reads one whitespace-delimited token, not a whole line. gets has no size argument and is not part of C11.'), rule='N1570 7.21.6 and 7.21.7.2'),
sec('Formatted construction with snprintf',
    p('snprintf lets a program format into a bounded destination. For a positive capacity, successful formatting terminates the output within that limit. Its returned length describes the number of characters that would have been produced, excluding zero, so a result at least the capacity signals truncation.'),
    code('Detect a formatted result that does not fit', '''char label[8];
int needed = snprintf(label, sizeof label, "item-%d", 1234);
if (needed < 0) return 1;
printf("stored=%s truncated=%d\\n", label, (size_t)needed >= sizeof label);''', expected='stored=item-12 truncated=1\n'),
    p('The complete intended text is item-1234, requiring nine visible bytes plus a terminator. The eight-byte buffer can store only seven visible bytes, so the result is item-12. Negative return values must be handled before converting to size_t. A well-terminated truncated string can still be semantically wrong for an identifier, filename, or protocol field; decide whether to reject it.'), rule='N1570 7.21.6.5'),
sec('Worked exercise and a string-state checklist',
    p('Implement append-if-fits for a valid terminated destination and source, rejecting truncation. Document that source and destination do not overlap. Prove that failure leaves the original destination unchanged and success writes a terminator within capacity. The check should use remaining space rather than computing a potentially overflowing combined size first.'),
    bullets('Empty strings require one slot for zero.', 'An exact-fit copy includes its terminator; test one byte less capacity.', 'Search failure returns NULL; do not read through it.', 'An overlapping move must preserve termination and use memmove.', 'A byte limit does not by itself establish complete-line input or a valid Unicode boundary.'),
    p('For performance, count every scan as well as every copy. A repeated append scheme can rescan an ever-growing prefix and create quadratic work. Maintaining a length removes those scans but introduces a state invariant that every write operation must maintain. Correctness and performance meet in that representation choice.'))
])

rewrite('constants-variables-types', [
sec('Declarations describe objects and interfaces',
    p('A declaration introduces a name and describes its type. An object is a region of storage that can hold a value. A definition supplies the object or function body. A variable is a named object whose value may change, while initialisation supplies its first value at creation. Read a declaration as a contract about operations, not merely a way to reserve a familiar byte count.'),
    code('Object declarations and initialisation', '''int count = 3;
double mean = 72.5;
char initial = 'D';
const int maximum = 100;
printf("count=%d mean=%.1f initial=%c max=%d\\n", count, mean, initial, maximum);''', expected='count=3 mean=72.5 initial=D max=100\n'),
    p('Initialisation differs from later assignment. A declaration such as `int count;` inside an ordinary block creates an automatic object without a usable initial value until assigned. A later `count = 3;` writes that object. An object declared const-qualified must not be modified through that qualified interface.'),
    code('One declaration can hide different declarators', '''int *pointer = NULL, value = 3;
pointer = &value;
printf("pointed value=%d\\n", *pointer);''', expected='pointed value=3\n'),
    p('Only pointer has pointer type in this declaration; value is int. The star belongs to its declarator, not to every name in the declaration. Prefer one object declaration per statement when types differ or readability suffers.'), rule='N1570 6.7'),
sec('Integer and floating types: ranges before sizes',
    table('Type families', ['Family','Examples','Use and limits'], [['Character','`char`, `signed char`, `unsigned char`','Byte-oriented representation; plain char signedness varies'],['Signed integers','`short`, `int`, `long`, `long long`','Whole numbers in a documented finite range'],['Unsigned integers','`unsigned int`, `size_t`','Nonnegative values; arithmetic wraps modulo range'],['Floating','`float`, `double`, `long double`','Approximate real-number computations'],['Boolean','`_Bool`, C11 `bool` from <stdbool.h>','Stored truth values 0 and 1'],['No value','`void`','No return value or no parameters in the stated context']]),
    p('The language gives minimum capabilities and relationships, not one universal desktop type-size chart. `sizeof(char)` is one C byte. `CHAR_BIT` tells how many bits that byte contains, and limits macros describe the range of each integer type. Wider-looking type names do not justify unchecked conversion or overflow.'),
    code('Inspect the implementation explicitly', r'''#include <stdio.h>
#include <limits.h>
#include <float.h>
int main(void) {
    printf("int bytes=%zu CHAR_BIT=%d\n", sizeof(int), CHAR_BIT);
    printf("int min=%d max=%d\n", INT_MIN, INT_MAX);
    printf("unsigned max=%u\n", UINT_MAX);
    printf("double decimal precision=%d\n", DBL_DIG);
    return 0;
}''', 'program'),
    p('Output sizes and limits vary, so this program has no fixed expected output across implementations. A C byte is at least eight bits, and plain char is a distinct type from signed char and unsigned char. Exact-width typedefs such as uint32_t exist only when an implementation supports the corresponding exact type; do not silently assume every optional typedef exists.'), rule='N1570 5.2.4.2, 6.2.5, and 7.20'),
sec('Literal constants, named constants, and aliases',
    code('Kinds of constant and named limit', '''enum { CAPACITY = 8 };
#define TAX_RATE 0.05
const int limit = 10;
unsigned int mask = 7u;
long long population = 1000000LL;
float fraction = 0.5f;
printf("%d %d %u %lld %.1f %.2f\\n", CAPACITY, limit, mask, population, fraction, TAX_RATE);''', expected='8 10 7 1000000 0.5 0.05\n'),
    p('Suffixes affect literal types: U requests an unsigned integer choice, LL a long-long choice, and f a float constant. An ordinary floating constant such as 0.5 has type double. An ordinary character constant such as `\'A\'` has type int in C, whereas `"A"` is a character array including a terminator.'),
    p('A macro is preprocessing replacement; a const declaration creates a qualified object; an enumeration constant supplies an integer constant expression. These are different mechanisms. A block-scope `const int n = 8` does not automatically make n a C integer constant expression, so `int a[n]` can be a VLA rather than a fixed-bound array.'),
    code('typedef aliases an existing type', '''typedef unsigned long Counter;
Counter visits = 12;
printf("visits=%lu\\n", visits);''', expected='visits=12\n'),
    p('typedef introduces a type alias, not a new object and not generally a new incompatible type. Choose clear identifiers and avoid reserved names. Names are case-sensitive, so count and Count are different identifiers even when they are an unfortunate readability pair.'), rule='N1570 6.4.4, 6.7.2.2, and 6.7.8'),
sec('Conversions happen within expressions before assignment',
    code('Integer division and a conversion before division', '''int a = 5, b = 2;
double first = a / b;
double second = (double)a / b;
printf("after=%.1f before=%.1f\\n", first, second);''', expected='after=2.0 before=2.5\n'),
    p('The first expression divides two ints and produces int 2; assignment then converts it to double 2.0. The second converts one operand first, so usual arithmetic conversions produce floating division. A cast applied after `a/b` has the same loss as the first version.'),
    p('Small integer types often undergo integer promotion before arithmetic. The usual arithmetic conversions then select a common operand type for many binary operations. This can affect signed/unsigned comparisons: a negative int converted to unsigned becomes a large nonnegative value, not a negative unsigned number.'),
    code('Signed and unsigned values need an explicit domain check', '''int signed_value = -1;
unsigned int bound = 5;
int valid = signed_value >= 0 && (unsigned int)signed_value < bound;
printf("valid=%d\\n", valid);''', expected='valid=0\n'),
    p('This test establishes nonnegativity before conversion. Do not cast blindly to suppress a warning; establish that the conversion preserves the intended value. Floating-to-integer conversion truncates toward zero and requires the truncated result to be representable. Floating-point arithmetic also cannot exactly represent every decimal fraction.'), rule='N1570 6.3.1'),
sec('Finite ranges and checked arithmetic',
    p('Signed overflow is undefined behaviour. Unsigned arithmetic wraps in its type\'s range, but that defined wrap can still be an algorithm error. Check before the operation, because assigning an overflowing int expression to a wider object cannot repair the original computation.'),
    code('Check nonnegative int addition', '''int a = 200, b = 300;
if (a < 0 || b < 0 || a > INT_MAX - b) return 1;
int total = a + b;
printf("total=%d\\n", total);''', expected='total=500\n'),
    p('After establishing a and b are nonnegative, `INT_MAX-b` is representable. The guard ensures the addition result does not exceed INT_MAX. A fully general signed addition guard also handles negative operands, using `INT_MIN-b` for negative b. Both guards must be reasoned about before evaluating the sum.'),
    code('Widen operands before multiplication when the range allows it', '''int a = 20000, b = 20000;
long long product = (long long)a * b;
printf("product=%lld\\n", product);''', expected='product=400000000\n'),
    note('A wider type still has a finite range', 'The selected example safely fits long long. For arbitrary data, check that wider range too. Type selection is part of the proof, not a universal replacement for validation.'), rule='N1570 6.5 and 6.3.1.3'),
sec('Scope, linkage, and storage duration are separate properties',
    table('Object properties', ['Property','Question it answers','Example'], [['Scope','Where can the name be used?','A block-local name is visible inside its block'],['Storage duration','How long does the object exist?','A static local persists across calls'],['Linkage','Which declarations denote the same entity?','extern can refer to an external definition']]),
    code('Block scope and persistent local storage', r'''#include <stdio.h>
static void visit(void) {
    static int calls = 0;
    ++calls;
    printf("calls=%d\n", calls);
}
int main(void) {
    visit();
    visit();
    return 0;
}''', 'program', expected='calls=1\ncalls=2\n'),
    p('calls has block scope but static storage duration, so both visits use the same object. Its initialiser is applied once, not each call. An ordinary automatic local initialised to zero on every call would restart the count. File-scope static also controls internal linkage, illustrating that one keyword has context-dependent effects.'),
    p('extern commonly declares an object or function defined elsewhere. register is a storage-class specifier that does not guarantee a CPU-register placement. C11 also has thread storage duration; full concurrency semantics are outside this unit. Unit 2 studies reusable functions and their local state.'), rule='N1570 6.2.1-6.2.4 and 6.7.1'),
sec('Declaration mistakes and worked design exercise',
    code('Invalid write through a const-qualified name', 'const int limit = 10;\nlimit = 12; /* constraint violation */', 'invalid'),
    p('Design counters for an array-processing tool. Use size_t for element counts and object sizes, int for each small signed measurement, and a justified accumulator for the total. A count is nonnegative, but a difference between positions may be signed. Do not let an unsigned subtraction silently represent a negative difference as a huge count.'),
    bullets('Match printf formats to argument types: %d for int, %u for unsigned int, %lld for long long, and %zu for size_t.', 'For scanf, double requires %lf while float requires %f; printf receives promoted floating arguments.', 'Initialise automatic objects before reading them.', 'Document input ranges and check conversions before narrowing.', 'Do not assume identical int and pointer sizes across platforms.'))
])

rewrite('operators-and-expressions', [
sec('Values, object designators, and side effects',
    p('An expression may compute a value, designate an object, perform a side effect, or combine those roles. An assignment changes stored state and also yields a value. For reliable tracing, separate the expression\'s type, its resulting value, and its modifications to objects.'),
    code('A value and an update', '''int count = 3;
int result = (count += 2);
printf("count=%d result=%d\\n", count, result);''', expected='count=5 result=5\n'),
    p('count designates a modifiable int object. `count += 2` adds using the relevant operand rules, converts back to the left object\'s type as required, and stores the result. The resulting value is 5. Unlike a separate assignment spelling, compound assignment evaluates its left operand only once.'),
    table('Operator families', ['Family','Operators','Typical purpose'], [['Arithmetic','`+ - * / %`','Numeric computation'],['Relational/equality','`< <= > >= == !=`','Produce int truth values'],['Logical','`&& || !`','Conditions with truth interpretation'],['Bitwise','`& | ^ ~ << >>`','Manipulate integer bit patterns'],['Assignment','`= += -= *= /= %= ...`','Update objects'],['Selection / measurement','`?: sizeof`','Choose a value / obtain storage size']]), rule='N1570 6.5'),
sec('Arithmetic, integer division, and remainder',
    code('Signed integer division truncates toward zero', '''int a = -7, b = 3;
printf("quotient=%d remainder=%d recomposed=%d\\n", a / b, a % b, (a / b) * b + a % b);
printf("floating=%.3f\\n", (double)a / b);''', expected='quotient=-2 remainder=-1 recomposed=-7\nfloating=-2.333\n'),
    p('The integer quotient is -2, not floor(-7/3)=-3. When the operations are representable, quotient times divisor plus remainder reconstructs the dividend. Remainder uses integer operands; it is not a general floating modulus operator. The mathematical library provides fmod for a different floating contract.'),
    p('Zero divisors are invalid for integer / and %. The most negative int divided by -1 is also invalid if its positive magnitude cannot be represented. Check arithmetic range as well as the divisor. Operator precedence does not make overflow safe.'),
    code('Guard integer division', '''int numerator = 20, denominator = 4;
if (denominator == 0 || (numerator == INT_MIN && denominator == -1)) return 1;
printf("quotient=%d\\n", numerator / denominator);''', expected='quotient=5\n'), rule='N1570 6.5.5'),
sec('Comparison and logical truth',
    p('Relational and equality operators produce int 0 or 1. C conditions interpret any nonzero scalar value as true. Logical operators combine truth, whereas bitwise operators combine individual bits. Assignment `=` must not be confused with equality `==`.'),
    code('An inclusive range and a short-circuit guard', '''int value = 7;
int denominator = 0;
int in_range = 0 <= value && value <= 10;
int usable = denominator != 0 && value / denominator > 2;
printf("range=%d usable=%d\\n", in_range, usable);''', expected='range=1 usable=0\n'),
    p('For &&, the right side executes only if the left side is true. For ||, it executes only if the left side is false. This makes validation order observable: check the condition needed for a safe operation before evaluating that operation. A division guard still needs to exclude other unrepresentable division cases if they are in the input domain.'),
    code('A chained mathematical inequality is wrong C', 'int value = -5;\nint wrong = 0 <= value <= 10;\n/* Groups as (0 <= value) <= 10; both 0 and 1 are <= 10. */', 'invalid'),
    p('The code above is syntactically valid but has an incorrect range-test meaning. It is marked incorrect for that reason, not because every incorrect program is a grammar error. Use two comparisons joined by logical AND.'), rule='N1570 6.5.8-6.5.14'),
sec('Bit masks and shifts',
    p('Use unsigned operands to make the intended bit representation and shift rules easier to reason about. A mask selects bits: AND tests or clears, OR sets, XOR toggles, and complement inverts. A bit position k is represented by `1u << k` only when k is within the promoted operand width.'),
    code('Set, test, toggle, and clear a flag', '''unsigned int flags = 0u;
unsigned int ready = 1u << 2;
flags |= ready;
printf("set=%u present=%d\\n", flags, (flags & ready) != 0);
flags ^= ready;
printf("toggled=%u\\n", flags);
flags |= ready;
flags &= ~ready;
printf("cleared=%u\\n", flags);''', expected='set=4 present=1\ntoggled=0\ncleared=0\n'),
    table('5u and 2u in a three-bit display', ['Operation','Bits','Result'], [['AND','101 & 010 = 000','0'],['OR','101 | 010 = 111','7'],['XOR','101 ^ 010 = 111','7'],['Logical AND','Both values nonzero','1']]),
    p('The three-bit display is illustrative; the actual unsigned int has more bits. A shift count must be nonnegative and less than the promoted left operand\'s width. Signed left shifts and right shifts of negative values have additional restrictions or implementation-defined behaviour; unsigned operations avoid those particular signed cases. `^` is never exponentiation in C.'), rule='N1570 6.5.7 and 6.5.10-6.5.12'),
sec('Increment, sequencing, and undefined expressions',
    code('Prefix and postfix in separate statements', '''int count = 3;
int old = count++;
int current = ++count;
printf("old=%d current=%d stored=%d\\n", old, current, count);''', expected='old=3 current=5 stored=5\n'),
    p('Postfix yields the previous value and schedules the increment as part of that expression. Prefix increments and yields the updated value. The statement boundaries here give an explicit sequence, so the trace is dependable. Both updates still require representable results.'),
    code('Do not invent output for unsequenced updates', 'int i = 0;\nint result = i++ + i++; /* undefined behaviour */\nprintf("%d", result);', 'invalid'),
    p('Two unsequenced modifications of the same scalar object violate the C11 rule. Parentheses do not repair that. Another unsafe pattern modifies an object and reads its value in an unsequenced sibling expression. Use separate statements when sequencing is part of the intended algorithm.'), rule='N1570 6.5 paragraph 2 and 6.5.2.4'),
sec('Conditional selection, comma, and sizeof',
    code('Only the selected conditional branch executes', '''int a = 8, b = 3;
int maximum = a > b ? a : b;
int sequence = (a = 2, a + 5);
printf("maximum=%d sequence=%d a=%d\\n", maximum, sequence, a);''', expected='maximum=8 sequence=7 a=2\n'),
    p('The conditional operator evaluates its condition before the selected arm; the unselected arm does not execute. The comma operator sequences its left expression before its right expression and yields the right result. Commas separating function arguments or initialiser entries are not the comma operator.'),
    code('sizeof an ordinary operand does not perform its side effect', '''int i = 2;
size_t bytes = sizeof(i++);
printf("i=%d bytes=%zu\\n", i, bytes);'''),
    p('i remains 2 because its operand type is not a variable-length-array type. sizeof yields a size_t count of bytes. VLA-related cases have different evaluation rules, so do not generalise the ordinary example to every imaginable sizeof operand.'), rule='N1570 6.5.3.4, 6.5.15, and 6.5.17'),
sec('Expression review and worked exercise',
    steps('Determine operand types and promotions.', 'Add grouping parentheses using precedence rules.', 'Identify which branches or operands can be skipped.', 'List side effects and required sequencing.', 'Check bounds, zero divisors, shift counts, and representable results.', 'Only then compute the value and final state.'),
    p('Worked exercise: a buffer has length 3 and capacity 4. Evaluate `length < capacity && incoming >= 0` with incoming=-2. The first comparison is true, the second is false, and the result is 0. No append should occur. Reversing the logical checks has the same truth result in this pure example, but checks that guard an unsafe access must stay before that access.'),
    note('Correct expressions need a valid domain', 'A formula can be mathematically correct yet undefined for its C types. Document the accepted domain and keep state-changing expressions simple enough to review.'))
])

rewrite('precedence-and-associativity', [
sec('Three different questions about an expression',
    p('Precedence determines which operators bind more strongly. Associativity determines grouping among operators at the same precedence. Sequencing determines which evaluations must happen before others. These questions are related, but answering one does not automatically answer the others.'),
    code('Grouping changes a result', '''printf("default=%d explicit=%d\\n", 2 + 3 * 4, (2 + 3) * 4);
printf("left=%d right=%d\\n", 18 - 6 - 3, 18 - (6 - 3));''', expected='default=14 explicit=20\nleft=9 right=15\n'),
    p('The default first expression groups multiplication before addition. The subtraction chain groups left to right. These are parse decisions: they describe the structure of the expression. They do not give a general left-to-right execution schedule for function calls hidden inside operands.'), rule='N1570 6.5'),
sec('Precedence reference from strongest to weakest',
    table('C11 grouping reference', ['Group','Operators / forms','Associativity'], [['Postfix','calls, subscripts, member access, postfix ++ --','Left'],['Unary / cast','prefix ++ --, unary + - ! ~ * &, sizeof, casts','Right'],['Multiplicative','* / %','Left'],['Additive','+ -','Left'],['Shift','<< >>','Left'],['Relational','< <= > >=','Left'],['Equality','== !=','Left'],['Bitwise AND','&','Left'],['Bitwise XOR','^','Left'],['Bitwise OR','|','Left'],['Logical AND','&&','Left'],['Logical OR','||','Left'],['Conditional','?:','Right'],['Assignment','= and compound assignments','Right'],['Comma',',','Left']]),
    p('The grammar establishes these relationships; the table is a study aid. The middle operand of ?: is parsed as an expression, so it behaves as though grouped. Declarator syntax uses some of the same symbols but is not evaluated as an ordinary expression.'),
    code('Apply three different groups', '''int a = 2, b = 3, c = 4;
int value = a + b * c > 10 && c != 0;
printf("value=%d\\n", value);''', expected='value=1\n'),
    steps('Group b*c, giving 12.', 'Group a+(b*c), giving 14.', 'Compare 14>10, giving 1, and evaluate c!=0, giving 1.', 'Logical AND yields 1.'), rule='N1570 6.5.2-6.5.17'),
sec('Associativity and assignment chains',
    code('Left arithmetic, right assignment', '''int a = 0, b = 0;
a = b = 4;
printf("arithmetic=%d a=%d b=%d\\n", 20 / 5 * 2, a, b);''', expected='arithmetic=8 a=4 b=4\n'),
    p('`20/5*2` groups as `(20/5)*2`, not `20/(5*2)`. `a=b=4` groups as `a=(b=4)`. The assignment to b yields a value used by the assignment to a. If the objects had different types, the intermediate assignment conversion could change the final value.'),
    p('Grouping should not be confused with an instruction order. A+b+c groups leftward, but if A, B, and C are function calls, their execution order is governed by sequencing rules, not a reading of the table. For nonassociative floating arithmetic, different groupings can also produce different rounded results.'), rule='N1570 6.5.16'),
sec('Bit-test and range-test pitfalls',
    code('Parenthesise the result of a bitwise test', '''unsigned int flags = 4u, mask = 2u;
int absent = (flags & mask) == 0;
printf("absent=%d\\n", absent);''', expected='absent=1\n'),
    p('Without parentheses, `flags & mask == 0` means `flags & (mask == 0)` because equality binds more strongly than bitwise AND. For mask=2, the inner comparison is false, and AND with zero discards the intended mask entirely.'),
    code('Express two comparisons explicitly', '''int x = 7;
int valid = 0 <= x && x <= 10;
printf("valid=%d\\n", valid);''', expected='valid=1\n'),
    p('`0<=x<=10` groups as `(0<=x)<=10` and therefore compares a truth value with 10. Parentheses around the whole wrong expression do not fix its meaning. Replace the mathematical shorthand with two comparisons joined by &&.'),
    note('Use parentheses for meaning, not decoration', 'Bit masks mixed with comparisons deserve explicit grouping. Too many redundant parentheses can hide the underlying expression just as much as too few. Aim to make the intended logical units visible.')),
sec('Grouping does not repair unsequenced effects',
    code('Still undefined despite parentheses', 'int i = 0;\nint sum = (i++) + (i++); /* undefined behaviour */', 'invalid'),
    code('Explicit statement sequence', '''int i = 0;
int first = i++;
int second = i++;
int sum = first + second;
printf("sum=%d i=%d\\n", sum, i);''', expected='sum=1 i=2\n'),
    p('The fixed small values stay in range. Parentheses control grouping only; separate full expressions impose a boundary for the updates. For two independent function calls whose order matters, store each result in a separate statement and then combine them.'),
    p('Function argument order is not generally fixed in C11. `f(i++, i++)` has unsequenced modifications and is undefined. By contrast, some separately executing function-call bodies can run in an unspecified permitted order without themselves causing the same unsequenced-expression violation. Describe the actual rule rather than marking every unspecified order as undefined.'), rule='N1570 6.5 paragraph 2 and 6.5.2.2'),
sec('Short-circuiting and the selected conditional arm',
    code('A guarded access', '''int values[3] = {10, 20, 30};
size_t index = 3, count = 3;
int match = index < count && values[index] == 20;
int fallback = index < count ? values[index] : -1;
printf("match=%d fallback=%d\\n", match, fallback);''', expected='match=0 fallback=-1\n'),
    p('Both constructs test index<count before any evaluated element access. The invalid index 3 is therefore not used as a subscript. Substituting bitwise & for && would evaluate the access and break this safety argument. Short-circuiting is a semantic execution rule, not an incidental precedence effect.'), rule='N1570 6.5.13-6.5.15'),
sec('Worked parsing exercise',
    p('Parse `a+b*2==c || d && e`. Multiplication groups inside addition; addition groups inside equality; && groups before ||. The result is `((a+(b*2))==c) || (d&&e)`. Now determine whether the right logical group executes based on the left comparison, and then whether e executes based on d.'),
    code('Check the parsed expression with concrete values', '''int a = 1, b = 3, c = 7, d = 0, e = 1;
int result = a + b * 2 == c || d && e;
printf("result=%d\\n", result);''', expected='result=1\n'),
    p('The left comparison is true because 1+3*2 is 7. OR skips the complete right side. A correct worked answer identifies both the result and the skipped evaluations. If values are replaced by state-changing calls, recalculate the sequencing obligations before predicting output.'))
])

def write():
    for slug, (sections, questions) in REWRITES.items():
        path=BASE / slug / 'chapter.json'
        chapter=json.loads(path.read_text(encoding='utf-8'))
        chapter['sections']=sections
        if questions: chapter['questions']=questions
        path.write_text(json.dumps(chapter,indent=2,ensure_ascii=True)+'\n',encoding='utf-8')

if __name__ == '__main__': write()
