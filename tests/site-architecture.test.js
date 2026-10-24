const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { after, before, test } = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
let server;
let baseUrl;

before(async () => {
  server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) {
      pathname += "index.html";
    }

    let filePath = path.resolve(dist, "." + pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const relativePath = path.relative(dist, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found: " + pathname);
        return;
      }
      const ext = path.extname(filePath);
      const types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".pdf": "application/pdf",
      };
      response.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
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
    "src/scripts/data/site-data.js",
    "src/scripts/data/quizzes.js",
    "src/scripts/data/books.js",
  ]);

  assert.equal(Object.keys(context.CATEGORIES).length, 11);
  for (const category of Object.values(context.CATEGORIES)) {
    assert.deepEqual(Object.keys(category), ["notes"]);
    assert.ok(Array.isArray(category.notes));
  }
  assert.equal(Object.keys(context.QUIZZES).length, 11);
  assert.ok(Array.isArray(context.BOOKS));
  assert.ok(context.BOOKS.length > 0);

  const siteDataSource = fs.readFileSync(
    path.join(root, "src/scripts/data/site-data.js"),
    "utf8",
  );
  assert.doesNotMatch(siteDataSource, /\bflashcards\b|\bconcepts\s*:/i);
});

test("every quiz question has four valid choices and a valid answer index", () => {
  const { QUIZZES } = loadDataModules(["src/scripts/data/quizzes.js"]);
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
  const { QUIZZES } = loadDataModules(["src/scripts/data/quizzes.js"]);
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
  const { BOOKS } = loadDataModules(["src/scripts/data/books.js"]);

  assert.equal(BOOKS.length, 5);
  assert.ok(BOOKS.some((book) => book.title === "Data Science from Scratch"));
  for (const book of BOOKS) {
    assert.match(book.actionUrl, /^https:\/\//);
    assert.equal(Object.hasOwn(book, "sourceUrl"), false);
  }
});

test("classroom configuration has 10 defined classroom notes", () => {
  const classroomData = loadDataModules(["src/scripts/data/classrooms.js"]);
  assert.equal(Object.keys(classroomData.CLASSROOM_NOTES).length, 10);
});

test("Astro learning features have direct static pages with route-specific data in dist", () => {
  const pageRoutes = {
    "portal/index.html": "home",
    "classroom/index.html": "cat-hub",
    "notes/index.html": "notes",
    "quiz/index.html": "cat-quiz",
    "tutorials/index.html": "tutorial",
    "blog/index.html": "blog",
    "blog-post/index.html": "blog-post",
    "glossary/index.html": "glossary",
    "books/index.html": "books",
  };

  for (const [file, route] of Object.entries(pageRoutes)) {
    const html = fs.readFileSync(path.join(dist, file), "utf8");
    assert.match(html, new RegExp(`<body[^>]*data-page="${route}"`), file);
    assert.match(html, /<main id="main-content">/, file);
  }

  const quizPage = fs.readFileSync(path.join(dist, "quiz/index.html"), "utf8");

  const notesPage = fs.readFileSync(path.join(dist, "notes/index.html"), "utf8");
  assert.match(notesPage, /\/assets\/css\/notes\.css/);

  const homePage = fs.readFileSync(path.join(dist, "portal/index.html"), "utf8");
  assert.match(homePage, /href="\/classroom\?level=9th-federal-board"/);

  const bookPage = fs.readFileSync(path.join(dist, "books/index.html"), "utf8");
  assert.match(bookPage, /Computer Science Books/);
  assert.match(bookPage, /Think C\+\+/);

  const blogPage = fs.readFileSync(path.join(dist, "blog/index.html"), "utf8");
  assert.match(blogPage, /How to Ace Your Computer Science Exam/);

  const glossaryPage = fs.readFileSync(path.join(dist, "glossary/index.html"), "utf8");
  assert.match(glossaryPage, /CS Glossary/);
  assert.match(glossaryPage, /Binary Number System/);

  const tutorialsPage = fs.readFileSync(path.join(dist, "tutorials/index.html"), "utf8");
  assert.match(tutorialsPage, /Video Tutorials/);
  assert.match(tutorialsPage, /O Level CS Course/);
});

test("Astro static site shell renders brand and navigation items", () => {
  const homeHtml = fs.readFileSync(path.join(dist, "portal/index.html"), "utf8");
  const navItems = [...homeHtml.matchAll(/data-navpage="(home|books|blog|glossary)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(navItems, ["home", "books", "blog", "glossary"]);
  assert.doesNotMatch(homeHtml, /ADMIN_PASS|showBlogAdmin|publishToGitHub|btn-admin/);
  assert.equal(fs.existsSync(path.join(dist, "admin.html")), false);
});

test("all static pages and local assets in dist are served successfully over HTTP", async () => {
  const pages = [
    "portal/",
    "",
    "home/",
    "classroom/?level=9th-federal-board",
    "notes/?level=9th-federal-board",
    "quiz/?level=9th-federal-board",
    "tutorials/",
    "blog/",
    "blog-post/?id=1",
    "glossary/",
    "books/",
    "resume/",
    "cv/",
  ];

  for (const page of pages) {
    const response = await fetch(`${baseUrl}/${page}`);
    assert.equal(response.status, 200, page);
    const html = await response.text();
    const assets = [
      ...html.matchAll(/<script[^>]*src="([^"]+)"/g),
      ...html.matchAll(/<link[^>]*href="([^"]+)"/g),
    ]
      .map((match) => match[1])
      .filter((source) => !/^https?:\/\//i.test(source));

    for (const asset of assets) {
      const assetResponse = await fetch(new URL(asset, `${baseUrl}/${page}`));
      assert.equal(assetResponse.status, 200, `${page} -> ${asset}`);
    }
  }
});
