/* ═══════════════════════════════════════
   CS Study Hub — All Content Data
   ═══════════════════════════════════════ */

/* ── CATEGORY META ── */
const CATEGORY_META = {
  'o-level': {
    label: 'O Level',
    subtitle: 'Foundational Computer Science',
    icon: 'bi-mortarboard',
    colorClass: 'o-level',
    desc: 'Essential CS concepts for O Level students — from programming basics to number systems.'
  },
  'a-level': {
    label: 'A Level',
    subtitle: 'Advanced Computer Science',
    icon: 'bi-cpu',
    colorClass: 'a-level',
    desc: 'Advanced topics for A Level students — algorithms, architecture, databases, and more.'
  },
  'university': {
    label: 'University',
    subtitle: 'Degree-Level Computer Science',
    icon: 'bi-building',
    colorClass: 'university',
    desc: 'Degree-level content covering advanced algorithms, OS, distributed systems, and ML.'
  }
};

/* ══════════════════════════════════
   O LEVEL
═══════════════════════════════════*/
const CATEGORIES = {

  'o-level': {
    notes: [
      { title: 'Introduction to Programming', tag: 'Programming', desc: 'Variables, data types, control flow, loops, and basic program design with worked examples.', file: 'pdfs/o-level/intro-to-programming.pdf' },
      { title: 'Number Systems', tag: 'Theory', desc: 'Binary, denary, hexadecimal — conversion methods, addition, and two\'s complement.', file: 'pdfs/o-level/number-systems.pdf' },
      { title: 'Boolean Logic', tag: 'Theory', desc: 'Logic gates, truth tables, Boolean algebra, and combinational circuits.', file: 'pdfs/o-level/boolean-logic.pdf' },
      { title: 'Data Types and Variables', tag: 'Programming', desc: 'Integer, real, boolean, character, and string types with practical code examples.', file: 'pdfs/o-level/data-types.pdf' },
      { title: 'Input and Output Operations', tag: 'Programming', desc: 'Reading user input, displaying output, file handling basics, and validation techniques.', file: 'pdfs/o-level/input-output.pdf' },
      { title: 'Program Design and Flowcharts', tag: 'Design', desc: 'Pseudocode, flowchart symbols, structured design, and decomposition principles.', file: 'pdfs/o-level/program-design.pdf' }
    ],
    flashcards: [
      { q: 'What is a variable?', a: 'A named location in memory that stores a value which can change during program execution. Declared with a name and data type.' },
      { q: 'What is binary?', a: 'A base-2 number system using only 0 and 1. Computers use binary because electronic circuits have two states: on (1) and off (0).' },
      { q: 'What is an algorithm?', a: 'A step-by-step set of instructions to solve a problem or complete a task. Must be clear, finite, and produce a result.' },
      { q: 'What is a loop?', a: 'A control structure that repeats a block of code. Types: FOR (counted), WHILE (condition before), REPEAT-UNTIL (condition after).' },
      { q: 'What is a boolean?', a: 'A data type with only two possible values: TRUE or FALSE. Used in conditions and logical operations (AND, OR, NOT).' },
      { q: 'What is pseudocode?', a: 'An informal way of describing an algorithm using plain English mixed with programming constructs. Not actual code — used for planning.' }
    ],
    quiz: [
      { q: 'What is the decimal value of the binary number 1010?', opts: ['8','10','12','14'], ans: 1 },
      { q: 'Which symbol represents the AND gate in Boolean logic?', opts: ['+','·','!','XOR'], ans: 1 },
      { q: 'What does a WHILE loop check?', opts: ['After the loop body','Before the loop body','During the loop body','Never'], ans: 1 },
      { q: 'How many bits are in one byte?', opts: ['4','6','8','16'], ans: 2 },
      { q: 'What is the hexadecimal equivalent of decimal 255?', opts: ['EE','FE','FF','EF'], ans: 2 },
      { q: 'Which data type stores TRUE or FALSE?', opts: ['Integer','String','Boolean','Real'], ans: 2 },
      { q: 'What is decomposition in programming?', opts: ['Breaking a problem into smaller parts','Deleting code','Compiling code','Looping through data'], ans: 0 },
      { q: 'What does CPU stand for?', opts: ['Central Processing Unit','Core Processing Unit','Computer Power Unit','Control Program Utility'], ans: 0 },
      { q: 'Which operator is used for integer division in most languages?', opts: ['%','//','&&','||'], ans: 1 },
      { q: 'What is the output of: 7 MOD 3?', opts: ['2','3','1','4'], ans: 2 }
    ],
    concepts: [
      { title: 'Number Systems', body: '<strong>Binary (Base-2):</strong> Uses digits 0 and 1. Each position is a power of 2 (1, 2, 4, 8, 16...).<br><br><strong>Hexadecimal (Base-16):</strong> Uses 0–9 then A–F. One hex digit represents 4 bits (a nibble). Used in memory addressing and colour codes (#FF5733).<br><br><strong>Two\'s Complement:</strong> Method for representing negative numbers in binary. Invert all bits then add 1. Allows subtraction using addition circuits.' },
      { title: 'Boolean Logic', body: '<strong>AND gate:</strong> Output is 1 only when BOTH inputs are 1.<br><strong>OR gate:</strong> Output is 1 when at least ONE input is 1.<br><strong>NOT gate:</strong> Inverts the input (0→1, 1→0).<br><strong>NAND, NOR, XOR:</strong> Combinations of basic gates.<br><br><strong>Truth Tables:</strong> A table showing all possible inputs and outputs for a logic expression. Essential for verifying circuit behaviour.' },
      { title: 'Programming Fundamentals', body: '<strong>Sequence:</strong> Instructions executed one after another in order.<br><strong>Selection:</strong> IF/ELSE statements — choose a path based on a condition.<br><strong>Iteration:</strong> FOR, WHILE, REPEAT-UNTIL loops — repeat code blocks.<br><br><strong>Subprograms:</strong> Procedures (no return value) and functions (return a value) — break large programs into manageable, reusable parts.<br><br><strong>Variables vs Constants:</strong> Variables can change; constants are fixed throughout the program.' },
      { title: 'Data Representation', body: '<strong>Characters:</strong> Represented using ASCII (7-bit, 128 characters) or Unicode (supports thousands of characters worldwide).<br><br><strong>Images:</strong> Stored as pixels. Each pixel has a colour value. Resolution = width × height pixels. Colour depth = bits per pixel.<br><br><strong>Sound:</strong> Analogue signal sampled at regular intervals (sample rate). Higher sample rate and bit depth = better quality but larger file size.' }
    ]
  },

  /* ══════════════════════════════════
     A LEVEL
  ═══════════════════════════════════*/
  'a-level': {
    notes: [
      { title: 'Algorithms and Data Structures', tag: 'Core', desc: 'Sorting, searching, recursion, stacks, queues, trees, and Big-O complexity analysis.', file: 'pdfs/a-level/algorithms-data-structures.pdf' },
      { title: 'Programming Paradigms', tag: 'Programming', desc: 'Procedural, OOP, functional, and declarative paradigms with comparative examples.', file: 'pdfs/a-level/programming-paradigms.pdf' },
      { title: 'Computer Organisation and Architecture', tag: 'Hardware', desc: 'CPU design, fetch-execute cycle, registers, cache, instruction sets, and pipelining.', file: 'pdfs/a-level/computer-organisation.pdf' },
      { title: 'Networking Fundamentals', tag: 'Networks', desc: 'OSI model, TCP/IP, protocols, IP addressing, subnetting, and network security.', file: 'pdfs/a-level/networking-fundamentals.pdf' },
      { title: 'Database Systems', tag: 'Databases', desc: 'Entity-relationship diagrams, normalisation (1NF–3NF), SQL, and transactions.', file: 'pdfs/a-level/database-systems.pdf' },
      { title: 'Software Development', tag: 'Engineering', desc: 'SDLC models, testing strategies, design patterns, version control, and documentation.', file: 'pdfs/a-level/software-development.pdf' }
    ],
    flashcards: [
      { q: 'What is Big-O notation?', a: 'A mathematical notation describing the upper bound on algorithm time complexity. O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic, O(2ⁿ) exponential.' },
      { q: 'What is recursion?', a: 'A function or procedure that calls itself. Requires a base case to prevent infinite recursion. Used in tree traversal, divide-and-conquer, and Fibonacci.' },
      { q: 'What is polymorphism?', a: 'The ability of different objects to respond to the same method call differently. Compile-time: overloading. Runtime: overriding (virtual/abstract methods).' },
      { q: 'What is normalisation?', a: 'Organising a database to reduce redundancy and dependency. 1NF: atomic values; 2NF: no partial dependency; 3NF: no transitive dependency.' },
      { q: 'What is the fetch-execute cycle?', a: 'The CPU repeatedly: Fetches an instruction from memory (PC→MAR→MDR), Decodes it (CIR), Executes it (ALU), then increments the Program Counter.' },
      { q: 'What is a binary search tree?', a: 'A tree where left child < parent < right child. Allows O(log n) search when balanced. Insertion and deletion maintain this property.' }
    ],
    quiz: [
      { q: 'What is the time complexity of binary search on a sorted array?', opts: ['O(n)','O(n²)','O(log n)','O(1)'], ans: 2 },
      { q: 'Which normal form eliminates transitive dependencies?', opts: ['1NF','2NF','3NF','BCNF'], ans: 2 },
      { q: 'What does the Program Counter (PC) store?', opts: ['The current instruction','The address of the next instruction','The result of a calculation','The stack pointer'], ans: 1 },
      { q: 'Which sorting algorithm uses divide-and-conquer?', opts: ['Bubble Sort','Insertion Sort','Merge Sort','Selection Sort'], ans: 2 },
      { q: 'What is encapsulation in OOP?', opts: ['Inheriting from a parent class','Hiding internal implementation details','Running multiple methods','Creating multiple objects'], ans: 1 },
      { q: 'What layer of the OSI model handles end-to-end communication?', opts: ['Network','Data Link','Transport','Session'], ans: 2 },
      { q: 'What is a foreign key?', opts: ['A key that is not primary','A key linking one table to another','An encrypted key','A unique index'], ans: 1 },
      { q: 'What does inheritance allow in OOP?', opts: ['A class to call itself','A class to reuse another class\'s attributes and methods','A class to destroy itself','Two classes to run simultaneously'], ans: 1 },
      { q: 'What is the stack data structure\'s access method?', opts: ['FIFO','LIFO','Random Access','LILO'], ans: 1 },
      { q: 'What is a compiler?', opts: ['Translates code line by line at runtime','Translates entire source code to machine code before running','Stores program data','Executes pseudocode'], ans: 1 }
    ],
    concepts: [
      { title: 'Algorithm Complexity', body: '<strong>Time Complexity:</strong> How runtime grows with input size n. Expressed in Big-O.<br>&bull; O(1): Array index lookup<br>&bull; O(log n): Binary search<br>&bull; O(n): Linear scan<br>&bull; O(n log n): Merge sort<br>&bull; O(n²): Bubble sort<br><br><strong>Space Complexity:</strong> Memory used by the algorithm. Recursion uses O(n) stack space for n recursive calls.' },
      { title: 'Object-Oriented Programming', body: '<strong>Encapsulation:</strong> Bundling data and methods; hide internal state with private/public access modifiers.<br><br><strong>Inheritance:</strong> Child class inherits parent\'s attributes and methods. Supports "is-a" relationships. Enables code reuse.<br><br><strong>Polymorphism:</strong> Same method name, different implementations. Method overriding (runtime) and overloading (compile-time).<br><br><strong>Abstraction:</strong> Abstract classes and interfaces define contracts without implementation details.' },
      { title: 'Computer Architecture', body: '<strong>Fetch-Execute Cycle:</strong> PC → MAR → memory → MDR → CIR → decode → ALU → result → registers.<br><br><strong>Registers:</strong> PC (Program Counter), MAR (Memory Address Register), MDR (Memory Data Register), CIR (Current Instruction Register), Accumulator.<br><br><strong>Pipelining:</strong> Overlapping fetch/decode/execute stages for multiple instructions simultaneously, improving throughput.<br><br><strong>Cache:</strong> L1 (fastest, ~4KB–64KB), L2 (~256KB–4MB), L3 (shared, up to 32MB). Reduces average memory access time.' },
      { title: 'Database Design', body: '<strong>ER Diagrams:</strong> Entities (rectangles), Attributes (ellipses), Relationships (diamonds). One-to-one, one-to-many, many-to-many.<br><br><strong>Normalisation:</strong> Removes redundancy. 1NF: atomic values, unique rows. 2NF: no partial dependency. 3NF: no transitive dependency.<br><br><strong>SQL essentials:</strong> SELECT, FROM, WHERE, JOIN (INNER, LEFT, RIGHT), GROUP BY, HAVING, ORDER BY, INSERT, UPDATE, DELETE.<br><br><strong>Transactions (ACID):</strong> Atomicity, Consistency, Isolation, Durability — guarantee reliable database operations.' },
      { title: 'Computer Networks', body: '<strong>OSI Model (top→bottom):</strong> Application, Presentation, Session, Transport, Network, Data Link, Physical.<br><br><strong>TCP vs UDP:</strong> TCP: reliable, ordered, handshake (SYN/SYN-ACK/ACK). UDP: fast, no guarantee — used for video/gaming.<br><br><strong>IP Addressing:</strong> IPv4: 32-bit (e.g. 192.168.1.1). IPv6: 128-bit. Subnetting divides networks for efficient address use.<br><br><strong>Security:</strong> Firewalls filter packets. SSL/TLS encrypts data. Symmetric vs asymmetric encryption. Public/private key pairs.' }
    ]
  },

  /* ══════════════════════════════════
     UNIVERSITY
  ═══════════════════════════════════*/
  'university': {
    notes: [
      { title: 'Advanced Algorithms and Complexity', tag: 'Theory', desc: 'P vs NP, dynamic programming, graph algorithms, greedy methods, and amortised analysis.', file: 'pdfs/university/advanced-algorithms.pdf' },
      { title: 'Operating Systems', tag: 'Systems', desc: 'Process scheduling, memory management (paging, segmentation), file systems, and synchronisation.', file: 'pdfs/university/operating-systems.pdf' },
      { title: 'Distributed Systems', tag: 'Systems', desc: 'CAP theorem, consensus algorithms, replication, fault tolerance, and microservices architecture.', file: 'pdfs/university/distributed-systems.pdf' },
      { title: 'Machine Learning Fundamentals', tag: 'AI/ML', desc: 'Supervised/unsupervised learning, gradient descent, neural networks, and evaluation metrics.', file: 'pdfs/university/machine-learning.pdf' },
      { title: 'Advanced Computer Architecture', tag: 'Hardware', desc: 'RISC vs CISC, branch prediction, cache coherence, multi-core design, and GPU architecture.', file: 'pdfs/university/computer-architecture.pdf' },
      { title: 'Compiler Design and Languages', tag: 'Theory', desc: 'Lexical analysis, parsing, semantic analysis, intermediate code generation, and optimisation.', file: 'pdfs/university/compiler-design.pdf' }
    ],
    flashcards: [
      { q: 'What is the CAP theorem?', a: 'A distributed system can guarantee at most two of three: Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (works despite network splits).' },
      { q: 'What is dynamic programming?', a: 'An optimisation technique that solves complex problems by breaking them into overlapping subproblems, solving each once and storing results (memoisation/tabulation). Examples: Fibonacci, knapsack, shortest paths.' },
      { q: 'What is a race condition?', a: 'When two or more threads access shared data concurrently and the outcome depends on execution order. Prevented using mutexes, semaphores, or atomic operations.' },
      { q: 'What is gradient descent?', a: 'An iterative optimisation algorithm to minimise a function by moving in the direction of steepest descent (negative gradient). Used to train ML models by minimising loss.' },
      { q: 'What is the difference between process and thread?', a: 'A process is an independent program with its own memory space. A thread is a lightweight unit within a process, sharing the same memory. Threads are faster to create and communicate but harder to synchronise.' },
      { q: 'What is NP-completeness?', a: 'A problem is NP-complete if it is in NP (solution verifiable in polynomial time) and every NP problem reduces to it in polynomial time. Examples: Travelling Salesman, SAT, graph colouring.' }
    ],
    quiz: [
      { q: 'Which page replacement algorithm has the lowest page fault rate theoretically?', opts: ['LRU','FIFO','Optimal (OPT)','Clock'], ans: 2 },
      { q: 'What does the CAP theorem state?', opts: ['A system can have all three: C, A, P','A system can guarantee at most two of C, A, P','Consistency is always sacrificed','Availability is optional'], ans: 1 },
      { q: 'Which ML approach uses labelled training data?', opts: ['Unsupervised learning','Reinforcement learning','Supervised learning','Transfer learning'], ans: 2 },
      { q: 'What is the time complexity of Dijkstra\'s algorithm with a min-heap?', opts: ['O(V²)','O(E log V)','O(V log E)','O(VE)'], ans: 1 },
      { q: 'What is a mutex?', opts: ['A memory type','A mutual exclusion lock for shared resources','A network protocol','A type of cache'], ans: 1 },
      { q: 'What does RISC stand for?', opts: ['Reduced Instruction Set Computer','Rapid Instruction Set Computer','Reduced Internal System Cache','Reliable Instruction Set Core'], ans: 0 },
      { q: 'What is memoisation?', opts: ['Writing comments in code','Storing results of expensive function calls to reuse later','A memory management technique','Caching web pages'], ans: 1 },
      { q: 'Which phase of a compiler converts tokens to a parse tree?', opts: ['Lexical analysis','Semantic analysis','Parsing (Syntax analysis)','Code generation'], ans: 2 },
      { q: 'What is eventual consistency?', opts: ['Data is always consistent','Data will become consistent over time if no new updates occur','Data is never consistent','Consistency guaranteed within 1 second'], ans: 1 },
      { q: 'What is the kernel of an operating system?', opts: ['The user interface','The core of the OS that manages hardware directly','The file system driver','The network stack'], ans: 1 }
    ],
    concepts: [
      { title: 'Advanced Algorithm Design', body: '<strong>Dynamic Programming:</strong> Overlapping subproblems + optimal substructure. Bottom-up (tabulation) vs top-down (memoisation). Examples: LCS, matrix chain multiplication, 0/1 knapsack.<br><br><strong>Greedy Algorithms:</strong> Make locally optimal choice at each step. Works for: Huffman coding, Kruskal\'s MST, activity selection. Does not always give global optimum.<br><br><strong>P vs NP:</strong> P = solvable in polynomial time. NP = verifiable in polynomial time. NP-complete: hardest in NP. Open question: is P = NP?' },
      { title: 'Operating Systems', body: '<strong>Scheduling:</strong> FCFS (simple, convoy effect), SJF (optimal average wait, requires knowing burst time), Round Robin (preemptive, fair), Priority (risk of starvation).<br><br><strong>Deadlock:</strong> Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Prevention: deny one condition. Detection: resource allocation graphs. Recovery: preemption or rollback.<br><br><strong>Virtual Memory:</strong> Paging maps virtual pages to physical frames. Page faults trigger disk access. TLB caches page table entries. Working set model manages thrashing.' },
      { title: 'Distributed Systems', body: '<strong>CAP Theorem:</strong> Choose two: Consistency, Availability, Partition Tolerance. CA: traditional RDBMS. CP: HBase, ZooKeeper. AP: Cassandra, DynamoDB.<br><br><strong>Consensus:</strong> Paxos and Raft algorithms allow distributed nodes to agree on a single value despite failures. Raft uses leader election and log replication.<br><br><strong>Replication:</strong> Master-slave (read scaling), multi-master (write conflicts). Eventual consistency allows temporary divergence. Conflict resolution: last-write-wins, vector clocks.' },
      { title: 'Machine Learning', body: '<strong>Supervised Learning:</strong> Regression (continuous output), Classification (discrete classes). Training data has labels. Algorithms: Linear Regression, Decision Trees, SVM, Neural Networks.<br><br><strong>Gradient Descent:</strong> Minimise loss function by iteratively adjusting weights in the direction of steepest descent. Learning rate controls step size. Batch, mini-batch, stochastic variants.<br><br><strong>Overfitting:</strong> Model memorises training data, fails to generalise. Solutions: regularisation (L1/L2), dropout, cross-validation, more training data.' },
      { title: 'Compiler Design', body: '<strong>Phases:</strong> 1. Lexical Analysis (tokeniser) → 2. Parsing (syntax tree) → 3. Semantic Analysis (type checking) → 4. Intermediate Code Generation → 5. Optimisation → 6. Code Generation.<br><br><strong>Context-Free Grammars:</strong> Formal rules for language syntax. Parsing methods: LL(1) top-down, LR(1) bottom-up. Ambiguous grammars produce multiple parse trees.<br><br><strong>Optimisations:</strong> Constant folding, dead code elimination, loop invariant code motion, inlining, register allocation (graph colouring).' }
    ]
  }
};

/* ── TUTORIALS ── */
const TUTORIALS = [
  { videoId: 'dMH0bHeiRNg', title: 'CS50: Introduction to Computer Science', desc: 'Harvard\'s world-famous intro to CS — algorithms, abstraction, data structures and more.', tag: 'Fundamentals', tagColor: '#dbeafe', tagText: '#1d4ed8' },
  { videoId: 'rfscVS0vtbw', title: 'Python for Beginners — Full Course', desc: 'Complete Python tutorial covering variables, loops, functions, OOP, and file handling.', tag: 'Programming', tagColor: '#dcfce7', tagText: '#15803d' },
  { videoId: 'RBSGKlAvoiM', title: 'Data Structures — Easy to Advanced', desc: 'Comprehensive guide to arrays, linked lists, trees, graphs, heaps, and hash tables.', tag: 'Data Structures', tagColor: '#fef3c7', tagText: '#b45309' },
  { videoId: 'PFDu9oVAE-g', title: 'Object Oriented Programming — Full Course', desc: 'Master OOP concepts: encapsulation, inheritance, polymorphism, and abstraction with examples.', tag: 'OOP', tagColor: '#ede9fe', tagText: '#6d28d9' },
  { videoId: 'HXV3zeQKqGY', title: 'SQL and Databases — Full Course', desc: 'Learn SQL from scratch: queries, joins, subqueries, indexes, and database design.', tag: 'Databases', tagColor: '#fee2e2', tagText: '#b91c1c' },
  { videoId: 'zOjov-2OZ0E', title: 'Computer Networking Full Course', desc: 'OSI model, TCP/IP, DNS, HTTP, subnetting, firewalls, and network security explained.', tag: 'Networking', tagColor: '#ecfdf5', tagText: '#065f46' },
  { videoId: 'vRE4b60VN7w', title: 'Operating Systems — Full Course', desc: 'Processes, threads, scheduling, memory management, file systems, and synchronisation.', tag: 'Systems', tagColor: '#fff7ed', tagText: '#c2410c' },
  { videoId: 'VfRyb134Arc', title: 'Algorithms — Sorting and Searching', desc: 'Bubble, insertion, selection, merge, quick sort — with animations and complexity analysis.', tag: 'Algorithms', tagColor: '#f0fdf4', tagText: '#166534' }
];

/* ── FALLBACK POSTS (shown only if posts.json cannot be fetched) ── */
const FALLBACK_POSTS = [
  { id: 1, title: 'Welcome to CS Study Hub', excerpt: 'Posts are loaded from posts.json — add your own via the Admin panel.', content: '<p>Welcome! Use the Admin panel to publish posts. They will be committed to your GitHub repo and visible to all visitors.</p>', tags: 'General', author: 'CS Teacher', date: '2025-05-01' }
];
