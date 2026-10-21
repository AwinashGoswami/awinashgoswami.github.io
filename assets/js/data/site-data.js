globalThis.CATEGORY_META = {
  "o-level": {
    "label": "O Level",
    "subtitle": "Foundational Computer Science",
    "icon": "bi-mortarboard",
    "colorClass": "o-level",
    "desc": "Essential CS concepts for O Level students — from programming basics to number systems."
  },
  "9th-sindh-board": {
    "label": "9th Grade",
    "subtitle": "Foundational Computer Science",
    "icon": "bi-book-half",
    "colorClass": "o-level",
    "desc": "Foundational CS concepts for 9th grade Sindh Board students."
  },
  "10th-sindh-board": {
    "label": "10th Grade",
    "subtitle": "Foundational Computer Science",
    "icon": "bi-book-half",
    "colorClass": "o-level",
    "desc": "Computer science fundamentals for 10th grade Sindh Board students."
  },
  "11th-sindh-board": {
    "label": "11th Grade",
    "subtitle": "Intermediate Computer Science",
    "icon": "bi-book-half",
    "colorClass": "o-level",
    "desc": "Intermediate-level computer science support for 11th grade Sindh Board students."
  },
  "12th-sindh-board": {
    "label": "12th Grade",
    "subtitle": "Advanced Intermediate Computer Science",
    "icon": "bi-book-half",
    "colorClass": "o-level",
    "desc": "Senior-level computer science notes and revision support for 12th grade Sindh Board students."
  },
  "9th-federal-board": {
    "label": "9th Grade",
    "subtitle": "Pre-College Computer Science",
    "icon": "bi-journal-text",
    "colorClass": "a-level",
    "desc": "Core theory and practical foundations for 9th grade Federal Board students."
  },
  "10th-federal-board": {
    "label": "10th Grade",
    "subtitle": "Advanced Computer Science",
    "icon": "bi-journal-text",
    "colorClass": "a-level",
    "desc": "Advanced preparation for 10th grade Federal Board students with revision-focused content."
  },
  "11th-federal-board": {
    "label": "11th Grade",
    "subtitle": "Intermediate Computer Science",
    "icon": "bi-journal-text",
    "colorClass": "a-level",
    "desc": "Intermediate-level concept notes and revision support for 11th grade Federal Board students."
  },
  "12th-federal-board": {
    "label": "12th Grade",
    "subtitle": "Senior Computer Science",
    "icon": "bi-journal-text",
    "colorClass": "a-level",
    "desc": "Senior-level board preparation for 12th grade Federal Board students."
  },
  "a-level": {
    "label": "A Level",
    "subtitle": "Advanced Computer Science",
    "icon": "bi-cpu",
    "colorClass": "a-level",
    "desc": "Advanced topics for A Level students — algorithms, architecture, databases, and more."
  },
  "university": {
    "label": "University",
    "subtitle": "Degree-Level Computer Science",
    "icon": "bi-building",
    "colorClass": "university",
    "desc": "Degree-level content covering advanced algorithms, OS, distributed systems, and ML."
  }
};

globalThis.BOARD_LEVELS = [
  "9th-sindh-board",
  "10th-sindh-board",
  "11th-sindh-board",
  "12th-sindh-board",
  "9th-federal-board",
  "10th-federal-board",
  "11th-federal-board",
  "12th-federal-board"
];

globalThis.CATEGORIES = {
  "o-level": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "a-level": {
    "notes": [
      {
        "title": "Algorithms and Data Structures",
        "tag": "Core",
        "desc": "Sorting, searching, recursion, stacks, queues, trees, and Big-O complexity analysis.",
        "file": "pdfs/a-level/algorithms-data-structures.pdf"
      },
      {
        "title": "Programming Paradigms",
        "tag": "Programming",
        "desc": "Procedural, OOP, functional, and declarative paradigms with comparative examples.",
        "file": "pdfs/a-level/programming-paradigms.pdf"
      },
      {
        "title": "Computer Organisation and Architecture",
        "tag": "Hardware",
        "desc": "CPU design, fetch-execute cycle, registers, cache, instruction sets, and pipelining.",
        "file": "pdfs/a-level/computer-organisation.pdf"
      },
      {
        "title": "Networking Fundamentals",
        "tag": "Networks",
        "desc": "OSI model, TCP/IP, protocols, IP addressing, subnetting, and network security.",
        "file": "pdfs/a-level/networking-fundamentals.pdf"
      },
      {
        "title": "Database Systems",
        "tag": "Databases",
        "desc": "Entity-relationship diagrams, normalisation (1NF–3NF), SQL, and transactions.",
        "file": "pdfs/a-level/database-systems.pdf"
      },
      {
        "title": "Software Development",
        "tag": "Engineering",
        "desc": "SDLC models, testing strategies, design patterns, version control, and documentation.",
        "file": "pdfs/a-level/software-development.pdf"
      }
    ]
  },
  "university": {
    "notes": [
      {
        "title": "Advanced Algorithms and Complexity",
        "tag": "Theory",
        "desc": "P vs NP, dynamic programming, graph algorithms, greedy methods, and amortised analysis.",
        "file": "pdfs/university/advanced-algorithms.pdf"
      },
      {
        "title": "Operating Systems",
        "tag": "Systems",
        "desc": "Process scheduling, memory management (paging, segmentation), file systems, and synchronisation.",
        "file": "pdfs/university/operating-systems.pdf"
      },
      {
        "title": "Distributed Systems",
        "tag": "Systems",
        "desc": "CAP theorem, consensus algorithms, replication, fault tolerance, and microservices architecture.",
        "file": "pdfs/university/distributed-systems.pdf"
      },
      {
        "title": "Machine Learning Fundamentals",
        "tag": "AI/ML",
        "desc": "Supervised/unsupervised learning, gradient descent, neural networks, and evaluation metrics.",
        "file": "pdfs/university/machine-learning.pdf"
      },
      {
        "title": "Advanced Computer Architecture",
        "tag": "Hardware",
        "desc": "RISC vs CISC, branch prediction, cache coherence, multi-core design, and GPU architecture.",
        "file": "pdfs/university/computer-architecture.pdf"
      },
      {
        "title": "Compiler Design and Languages",
        "tag": "Theory",
        "desc": "Lexical analysis, parsing, semantic analysis, intermediate code generation, and optimisation.",
        "file": "pdfs/university/compiler-design.pdf"
      }
    ]
  },
  "9th-sindh-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "10th-sindh-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "11th-sindh-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "12th-sindh-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "9th-federal-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "10th-federal-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "11th-federal-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  },
  "12th-federal-board": {
    "notes": [
      {
        "title": "Introduction to Programming",
        "tag": "Programming",
        "desc": "Variables, data types, control flow, loops, and basic program design with worked examples.",
        "file": "pdfs/o-level/intro-to-programming.pdf"
      },
      {
        "title": "Number Systems",
        "tag": "Theory",
        "desc": "Binary, denary, hexadecimal — conversion methods, addition, and two's complement.",
        "file": "pdfs/o-level/number-systems.pdf"
      },
      {
        "title": "Boolean Logic",
        "tag": "Theory",
        "desc": "Logic gates, truth tables, Boolean algebra, and combinational circuits.",
        "file": "pdfs/o-level/boolean-logic.pdf"
      },
      {
        "title": "Data Types and Variables",
        "tag": "Programming",
        "desc": "Integer, real, boolean, character, and string types with practical code examples.",
        "file": "pdfs/o-level/data-types.pdf"
      },
      {
        "title": "Input and Output Operations",
        "tag": "Programming",
        "desc": "Reading user input, displaying output, file handling basics, and validation techniques.",
        "file": "pdfs/o-level/input-output.pdf"
      },
      {
        "title": "Program Design and Flowcharts",
        "tag": "Design",
        "desc": "Pseudocode, flowchart symbols, structured design, and decomposition principles.",
        "file": "pdfs/o-level/program-design.pdf"
      }
    ]
  }
};
