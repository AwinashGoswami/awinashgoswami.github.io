const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { after, before, test } = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
let server;
let baseUrl;

before(async () => {
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const filePath = path.resolve(root, "." + pathname);
    const relativePath = path.relative(root, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200);
      response.end(content);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

function loadDataModules(files) {
  const context = vm.createContext({});
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInContext(source, context, { filename: file });
  }
  return context;
}

test("course data contains notes only; quizzes and books are separate modules", () => {
  const context = loadDataModules([
    "assets/js/data/site-data.js",
    "assets/js/data/quizzes.js",
    "assets/js/data/books.js",
  ]);

  assert.equal(Object.keys(context.CATEGORIES).length, 11);
  for (const category of Object.values(context.CATEGORIES)) {
    assert.deepEqual(Object.keys(category), ["notes"]);
    assert.ok(Array.isArray(category.notes));
  }
  assert.equal(Object.keys(context.QUIZZES).length, 11);
  assert.ok(Array.isArray(context.BOOKS));
  assert.ok(context.BOOKS.length > 0);

  const legacyDataFile = path.join(root, "assets/js/data.js");
  assert.equal(fs.existsSync(legacyDataFile), false);
  const siteDataSource = fs.readFileSync(
    path.join(root, "assets/js/data/site-data.js"),
    "utf8",
  );
  assert.doesNotMatch(siteDataSource, /\bflashcards\b|\bconcepts\s*:/i);
});

test("every quiz question has four valid choices and a valid answer index", () => {
  const { QUIZZES } = loadDataModules(["assets/js/data/quizzes.js"]);
  const expectedCounts = {
    "o-level": 10,
    "a-level": 10,
    university: 10,
    "9th-sindh-board": 139,
    "10th-sindh-board": 149,
    "11th-sindh-board": 10,
    "12th-sindh-board": 10,
    "9th-federal-board": 162,
    "10th-federal-board": 170,
    "11th-federal-board": 10,
    "12th-federal-board": 10,
  };
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(QUIZZES).map(([level, questions]) => [
        level,
        questions.length,
      ]),
    ),
    expectedCounts,
  );

  for (const [level, questions] of Object.entries(QUIZZES)) {
    assert.ok(questions.length > 0, `${level} should have questions`);
    for (const [index, question] of questions.entries()) {
      assert.equal(typeof question.q, "string", `${level} question ${index + 1}`);
      assert.equal(question.opts.length, 4, `${level} question ${index + 1}`);
      assert.ok(
        Number.isInteger(question.ans) &&
          question.ans >= 0 &&
          question.ans < question.opts.length,
        `${level} question ${index + 1} has an invalid answer index`,
      );
    }
  }
});

test("Federal 9th step-count answer keys remain C: 4 and B: 6", () => {
  const { QUIZZES } = loadDataModules(["assets/js/data/quizzes.js"]);
  const questions = QUIZZES["9th-federal-board"];
  const simple = questions.find(
    (question) => question.q === "How many steps are there for simple problems?",
  );
  const complex = questions.find(
    (question) => question.q === "How many steps are there for complex problems?",
  );

  assert.ok(simple);
  assert.ok(complex);
  assert.equal(simple.ans, 2);
  assert.equal(simple.opts[simple.ans], "4");
  assert.equal(complex.ans, 1);
  assert.equal(complex.opts[complex.ans], "6");
});

test("books only expose download links and contain no sourceUrl property", () => {
  const { BOOKS } = loadDataModules(["assets/js/data/books.js"]);

  assert.equal(BOOKS.length, 5);
  assert.ok(BOOKS.some((book) => book.title === "Data Science from Scratch"));
  for (const book of BOOKS) {
    assert.match(book.actionUrl, /^https:\/\//);
    assert.equal(Object.hasOwn(book, "sourceUrl"), false);
  }
});

test("notes markup is rendered by its view module for the selected classroom", () => {
  const context = loadDataModules(["assets/js/views/notes.js"]);
  const html = context.NotesView.render({ label: "9th Grade" }, "level-o");

  assert.match(html, /class="level-o"/);
  assert.match(html, /<strong>9th Grade<\/strong>/);
  assert.match(html, /id="sidebar-list"/);
  assert.match(html, /id="topic-content"/);
});

test("shared HTML escaping and page feature modules render their content", () => {
  const output = { html: "" };
  const contentTarget = {
    replaceChildren(fragment) {
      output.html = fragment.html;
    },
  };
  const context = vm.createContext({
    document: {
      addEventListener() {},
      getElementById() {
        return contentTarget;
      },
      createElement() {
        let markup = "";
        return {
          content: {
            cloneNode() {
              return { html: markup };
            },
          },
          set innerHTML(value) {
            markup = value;
          },
        };
      },
    },
  });
  for (const file of [
    "assets/js/shared/html.js",
    "assets/js/data/books.js",
    "assets/js/data/tutorials.js",
    "assets/js/data/fallback-posts.js",
    "assets/js/views/books.js",
    "assets/js/views/tutorials.js",
    "assets/js/views/blog.js",
    "assets/js/features/books.js",
    "assets/js/features/tutorials.js",
    "assets/js/features/blog.js",
  ]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, {
      filename: file,
    });
  }

  assert.equal(context.CSHtml.escape("<script>"), "&lt;script&gt;");
  context.BooksFeature.render();
  assert.match(output.html, /Computer Science Books/);
  context.TutorialsFeature.render();
  assert.match(output.html, /Video Tutorials/);
  context.BlogFeature.renderList(context.FALLBACK_POSTS);
  assert.match(output.html, /Welcome to CS Study Hub/);
  context.BlogFeature.renderPost(context.FALLBACK_POSTS, 1);
  assert.match(output.html, /Welcome to CS Study Hub/);
});

test("learning features have direct static pages with route-specific data", () => {
  const pageRoutes = {
    "home.html": "home",
    "classroom.html": "cat-hub",
    "notes.html": "notes",
    "quiz.html": "cat-quiz",
    "tutorials.html": "tutorial",
    "blog.html": "blog",
    "blog-post.html": "blog-post",
    "glossary.html": "glossary",
    "books.html": "books",
  };

  for (const [file, route] of Object.entries(pageRoutes)) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(html, new RegExp(`<body[^>]*data-page="${route}"`), file);
    assert.match(html, /assets\/js\/app\.js/, file);
    assert.match(html, /<main id="main-content"><\/main>/, file);
  }

  const quizPage = fs.readFileSync(path.join(root, "quiz.html"), "utf8");
  const quizSource = fs.readFileSync(
    path.join(root, "assets/js/features/quiz.js"),
    "utf8",
  );
  const notesPage = fs.readFileSync(path.join(root, "notes.html"), "utf8");
  const homePage = fs.readFileSync(path.join(root, "home.html"), "utf8");
  const bookPage = fs.readFileSync(path.join(root, "books.html"), "utf8");
  const blogPage = fs.readFileSync(path.join(root, "blog.html"), "utf8");
  const blogPostPage = fs.readFileSync(path.join(root, "blog-post.html"), "utf8");
  const glossaryPage = fs.readFileSync(path.join(root, "glossary.html"), "utf8");
  const classroomPage = fs.readFileSync(path.join(root, "classroom.html"), "utf8");
  const tutorialsPage = fs.readFileSync(path.join(root, "tutorials.html"), "utf8");
  const appSource = fs.readFileSync(
    path.join(root, "assets/js/app.js"),
    "utf8",
  );
  assert.match(quizPage, /assets\/js\/data\/quizzes\.js/);
  assert.match(quizPage, /assets\/js\/features\/quiz\.js/);
  assert.match(quizSource, /const QUIZ_SECONDS_PER_QUESTION = 30/);
  assert.match(quizSource, /globalThis\.QuizFeature/);
  assert.doesNotMatch(bookPage, /assets\/js\/data\/quizzes\.js/);
  assert.match(bookPage, /assets\/js\/data\/books\.js/);
  assert.match(notesPage, /assets\/js\/data\/classrooms\.js/);
  assert.match(notesPage, /assets\/js\/views\/notes\.js/);
  assert.match(notesPage, /assets\/js\/features\/notes\.js/);
  assert.match(notesPage, /assets\/js\/shared\/html\.js/);
  assert.match(notesPage, /assets\/css\/notes\.css/);
  assert.match(homePage, /assets\/js\/features\/home\.js/);
  assert.match(bookPage, /assets\/js\/shared\/html\.js/);
  assert.match(bookPage, /assets\/js\/features\/books\.js/);
  assert.match(bookPage, /assets\/js\/views\/books\.js/);
  assert.match(blogPage, /assets\/js\/features\/blog\.js/);
  assert.match(blogPage, /assets\/js\/views\/blog\.js/);
  assert.match(blogPostPage, /assets\/js\/features\/blog\.js/);
  assert.match(blogPostPage, /assets\/js\/views\/blog\.js/);
  assert.match(glossaryPage, /assets\/js\/shared\/html\.js/);
  assert.match(glossaryPage, /assets\/js\/features\/glossary\.js/);
  assert.match(glossaryPage, /assets\/js\/views\/glossary\.js/);
  assert.match(classroomPage, /assets\/js\/features\/classroom\.js/);
  assert.match(classroomPage, /assets\/js\/views\/classroom\.js/);
  assert.match(tutorialsPage, /assets\/js\/features\/tutorials\.js/);
  assert.match(tutorialsPage, /assets\/js\/views\/tutorials\.js/);
  assert.match(homePage, /assets\/js\/views\/home\.js/);
  assert.match(quizPage, /assets\/js\/views\/quiz\.js/);
  assert.doesNotMatch(appSource, /function showNotesPage|function loadNotesCss/);
  assert.doesNotMatch(
    appSource,
    /function showHome|function showCatQuiz|function showCatHub/,
  );
  assert.doesNotMatch(
    appSource,
    /function showBooks|function showTutorial|function showBlog\(|function showBlogPost|function showGlossary/,
  );
  const quizView = fs.readFileSync(
    path.join(root, "assets/js/views/quiz.js"),
    "utf8",
  );
  assert.match(quizView, /\$\{CSHtml\.escape\(levelTitle\)\} - Practice Quiz/);
  assert.doesNotMatch(quizView, /â€” Practice Quiz/);
  const reportGenerator = quizSource.slice(
    quizSource.indexOf("function downloadQuizReport"),
    quizSource.indexOf("function restartQuizForStudent"),
  );
  assert.doesNotMatch(reportGenerator, /ðŸ|â˜|â€|â—|âœ/);
  assert.match(reportGenerator, /QUIZ CHAMPION/);
  assert.match(reportGenerator, /YOUR REPORT CARD/);
  assert.match(quizView, /bi-trophy-fill/);
  assert.doesNotMatch(appSource, /data-goto|function navigate|history\.pushState/);
  assert.doesNotMatch(appSource, /ADMIN_PASS|showBlogAdmin|publishToGitHub|btn-admin/);
  assert.equal(fs.existsSync(path.join(root, "admin.html")), false);

  const shell = fs.readFileSync(
    path.join(root, "assets/js/views/site-shell.js"),
    "utf8",
  );
  const navItems = [...shell.matchAll(/data-navpage="(home|books|blog|glossary)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(navItems, ["home", "books", "blog", "glossary"]);

  const classroomData = loadDataModules(["assets/js/data/classrooms.js"]);
  assert.equal(Object.keys(classroomData.CLASSROOM_NOTES).length, 10);
});

test("static pages and all locally referenced scripts are served successfully", async () => {
  const pages = [
    "home.html",
    "classroom.html?level=9th-federal-board",
    "notes.html?level=9th-federal-board",
    "quiz.html?level=9th-federal-board",
    "tutorials.html",
    "blog.html",
    "blog-post.html?id=1",
    "glossary.html",
    "books.html",
  ];

  for (const page of pages) {
    const response = await fetch(`${baseUrl}/${page}`);
    assert.equal(response.status, 200, page);
    const html = await response.text();
    const assets = [
      ...html.matchAll(/<script src="([^"]+)"/g),
      ...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g),
    ]
      .map((match) => match[1])
      .filter((source) => !/^https?:\/\//i.test(source));

    for (const asset of assets) {
      const assetResponse = await fetch(new URL(asset, `${baseUrl}/${page}`));
      assert.equal(assetResponse.status, 200, `${page} -> ${asset}`);
    }
  }
});
