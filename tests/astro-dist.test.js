const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

test("Astro static build outputs all required pages and assets", () => {
  assert.ok(fs.existsSync(dist), "dist directory should exist");

  const expectedRoutes = [
    "index.html",
    "classroom/index.html",
    "notes/index.html",
    "quiz/index.html",
    "tutorials/index.html",
    "blog/index.html",
    "blog-post/index.html",
    "glossary/index.html",
    "books/index.html",
    "resume/index.html",
  ];

  for (const route of expectedRoutes) {
    const filePath = path.join(dist, route);
    assert.ok(fs.existsSync(filePath), `dist/${route} should exist`);
    const content = fs.readFileSync(filePath, "utf8");
    assert.ok(content.length > 0, `dist/${route} should not be empty`);
  }
});

test("Astro generated pages use root-relative links and correct metadata", () => {
  const homeHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  assert.match(homeHtml, /<body[^>]*data-page="home"/);
  assert.match(homeHtml, /href="\/assets\/css\/home\.css"/);
  assert.match(homeHtml, /href="\/classroom\?level=9th-federal-board"/);
  assert.doesNotMatch(homeHtml, /href="\/awinashgoswami\.github\.io\//);

  const notesHtml = fs.readFileSync(path.join(dist, "notes/index.html"), "utf8");
  assert.match(notesHtml, /<body[^>]*data-page="notes"/);
  assert.match(notesHtml, /href="\/assets\/css\/notes\.css"/);

  const quizHtml = fs.readFileSync(path.join(dist, "quiz/index.html"), "utf8");
  assert.match(quizHtml, /<body[^>]*data-page="cat-quiz"/);

  const booksHtml = fs.readFileSync(path.join(dist, "books/index.html"), "utf8");
  assert.match(booksHtml, /<body[^>]*data-page="books"/);

  const blogHtml = fs.readFileSync(path.join(dist, "blog/index.html"), "utf8");
  assert.match(blogHtml, /<body[^>]*data-page="blog"/);

  const glossaryHtml = fs.readFileSync(path.join(dist, "glossary/index.html"), "utf8");
  assert.match(glossaryHtml, /<body[^>]*data-page="glossary"/);

  const tutorialsHtml = fs.readFileSync(path.join(dist, "tutorials/index.html"), "utf8");
  assert.match(tutorialsHtml, /<body[^>]*data-page="tutorial"/);
});

test("Astro assets directory is copied to dist root and PDFs exist", () => {
  assert.ok(fs.existsSync(path.join(dist, "assets/css/home.css")));
  assert.ok(fs.existsSync(path.join(dist, "assets/css/notes.css")));
  assert.ok(fs.existsSync(path.join(dist, "assets/json/posts.json")));
  assert.ok(fs.existsSync(path.join(dist, "assets/json/cambridge/o_level.json")));
  assert.ok(fs.existsSync(path.join(dist, "assets/pdfs/federal-board/9th/unit_2.pdf")));
  assert.ok(fs.existsSync(path.join(dist, "assets/pdfs/sindh-board/9th/unit_1.pdf")));
});

