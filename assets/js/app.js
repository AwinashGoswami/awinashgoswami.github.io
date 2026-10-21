/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CS Study Hub application controller
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

$(function () {
  /* â”€â”€ STATE â”€â”€ */
  let currentPage = document.body.dataset.page || "home";
  let currentLevel = null;
  let loadedPosts = null; // populated async from posts.json
  let loadedGlossary = null; // populated async from glossary.json
  let glossarySearchTimer = null;
  let glossarySearchController = null;
  let glossarySearchRequestId = 0;
  let quizQuestions = [];
  let quizIndex = 0;
  let quizPage = 0;
  let quizScore = 0;
  let quizResponses = [];
  let quizAnswered = false;
  let quizSelectedIndex = null;
  let quizLevel = null;
  let quizStudentName = "";
  let quizFatherName = "";
  let quizStartedAt = null;
  let quizCompletionStatus = "completed";
  let quizTimerId = null;
  let quizTimeRemaining = 0;
  let quizPaused = false;
  let quizAudioCtx = null;
  let quizAudioCompressor = null;
  const QUIZ_PAGE_SIZE = 10;
  const QUIZ_SECONDS_PER_QUESTION = 30;
  const QUIZ_ORDER_VERSION = 2;

  /* â”€â”€ LOAD POSTS from assets/json/posts.json on startup â”€â”€ */
  fetch("assets/json/posts.json?v=" + Date.now())
    .then(function (r) {
      if (!r.ok) {
        throw new Error("Blog posts request failed with status " + r.status);
      }
      return r.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) {
        throw new Error("Blog posts data must be a JSON array.");
      }
      loadedPosts = data.length ? data : FALLBACK_POSTS;
      refreshPostPage();
    })
    .catch(function (error) {
      console.error("Unable to load blog posts; showing fallback posts.", error);
      loadedPosts = FALLBACK_POSTS;
      refreshPostPage();
    });

  function refreshPostPage() {
    if (currentPage === "blog") showBlog();
    else if (currentPage === "blog-post") {
      showBlogPost(new URLSearchParams(window.location.search).get("id"));
    }
  }

  function getPosts() {
    return loadedPosts || FALLBACK_POSTS;
  }
  function getGlossary() {
    return loadedGlossary || GLOSSARY_TERMS;
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     HOME
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  function showHome() {
    $("#main-content").html(`
      <section class="hero">
        <div class="container">
          <h1>Master Computer Science<br><span>Without the Burnout</span></h1>
          <p>A free, carefully curated resource built by a passionate CS teacher. Notes, quizzes, tutorials, books, and blog â€” everything you need to succeed.</p>

        </div>
      </section>
      <section class="feature-grid">
        <div class="container">
          <div class="mb-4 mt-4 text-center">
            <div class="d-inline-block px-5 py-3 rounded-pill shadow-sm border" style="background:linear-gradient(135deg, #eef4ff, #eafaf5); border-color:#d7e8ff; min-width:240px;">
              <h2 class="fw-bold text-dark mb-0" style="font-size:2rem; letter-spacing:.04em; text-transform:uppercase;">Academia</h2>
            </div>
          </div>

          <div class="mb-4 mt-2">
            <h3 class="fw-bold text-dark mb-3">Sindh Board</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=9th-sindh-board" aria-label="Open 9th Grade">
                  <div class="feature-icon"><i class="bi bi-book-half"></i></div>
                  <div class="feature-card-content"><h5>9th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=10th-sindh-board" aria-label="Open 10th Grade">
                  <div class="feature-icon"><i class="bi bi-book-half"></i></div>
                  <div class="feature-card-content"><h5>10th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=11th-sindh-board" aria-label="Open 11th Grade">
                  <div class="feature-icon"><i class="bi bi-book-half"></i></div>
                  <div class="feature-card-content"><h5>11th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=12th-sindh-board" aria-label="Open 12th Grade">
                  <div class="feature-icon"><i class="bi bi-book-half"></i></div>
                  <div class="feature-card-content"><h5>12th Grade</h5></div>
                </a>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="fw-bold text-dark mb-3">Federal Board</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=9th-federal-board" aria-label="Open 9th Grade">
                  <div class="feature-icon"><i class="bi bi-journal-text"></i></div>
                  <div class="feature-card-content"><h5>9th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=10th-federal-board" aria-label="Open 10th Grade">
                  <div class="feature-icon"><i class="bi bi-journal-text"></i></div>
                  <div class="feature-card-content"><h5>10th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=11th-federal-board" aria-label="Open 11th Grade">
                  <div class="feature-icon"><i class="bi bi-journal-text"></i></div>
                  <div class="feature-card-content"><h5>11th Grade</h5></div>
                </a>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <a class="feature-card feature-card-available" href="classroom.html?level=12th-federal-board" aria-label="Open 12th Grade">
                  <div class="feature-icon"><i class="bi bi-journal-text"></i></div>
                  <div class="feature-card-content"><h5>12th Grade</h5></div>
                </a>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="fw-bold text-dark mb-3">Cambridge</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-mortarboard"></i></div>
                  <div class="feature-card-content"><h5>O Level</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-cpu"></i></div>
                  <div class="feature-card-content"><h5>A Level</h5></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="fw-bold text-dark mb-3">University</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-building"></i></div>
                  <div class="feature-card-content"><h5>University</h5></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4 mt-5 text-center">
            <div class="d-inline-block px-5 py-3 rounded-pill shadow-sm border" style="background:linear-gradient(135deg, #f5f1ff, #fff5eb); border-color:#e7dcff; min-width:240px;">
              <h2 class="fw-bold text-dark mb-0" style="font-size:2rem; letter-spacing:.04em; text-transform:uppercase;">Skills</h2>
            </div>
          </div>

          <div class="mb-4 mt-4">
            <h3 class="fw-bold text-dark mb-3">Programming</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-code-slash"></i></div>
                  <div class="feature-card-content"><h5>C++</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-file-earmark-code"></i></div>
                  <div class="feature-card-content"><h5>Python</h5></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4 mt-4">
            <h3 class="fw-bold text-dark mb-3">Web-Technologies</h3>
            <div class="row g-4">
              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-filetype-html"></i></div>
                  <div class="feature-card-content"><h5>HTML</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-filetype-css"></i></div>
                  <div class="feature-card-content"><h5>CSS</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-filetype-css"></i></div>
                  <div class="feature-card-content"><h5>Bootstrap</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-filetype-js"></i></div>
                  <div class="feature-card-content"><h5>JS</h5></div>
                </div>
              </div>

                            <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-database-check"></i></div>
                  <div class="feature-card-content"><h5>Django</h5></div>
                </div>
              </div>

                            <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-hdd-rack"></i></div>
                  <div class="feature-card-content"><h5>DRF</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-node-plus"></i></div>
                  <div class="feature-card-content"><h5>Node.js</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-filetype-php"></i></div>
                  <div class="feature-card-content"><h5>PHP</h5></div>
                </div>
              </div>

                            <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-table"></i></div>
                  <div class="feature-card-content"><h5>MySQL</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-server"></i></div>
                  <div class="feature-card-content"><h5>MongoDB</h5></div>
                </div>
              </div>

              <div class="col-sm-6 col-md-12 col-lg-3">
                <div class="feature-card">
                  <div class="feature-icon"><i class="bi bi-git"></i></div>
                  <div class="feature-card-content"><h5>Git</h5></div>
                </div>
              </div>
            </div>
          </div>

      </div>
      </section>
    `);
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     CATEGORY HUB
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  function getCategoryBreadcrumbLabel(level) {
    const meta = CATEGORY_META[level];
    const board = level.endsWith("-federal-board")
      ? "Federal Board"
      : level.endsWith("-sindh-board")
        ? "Sindh Board"
        : "";

    return board ? `${board} ${meta.label}` : meta.label;
  }

  function breadcrumb(level, label) {
    return `<div class="breadcrumb-custom">
      <a href="home.html">Home</a><span>/</span>
      <a href="classroom.html?level=${encodeURIComponent(level)}">${getCategoryBreadcrumbLabel(level)}</a><span>/</span>
      <strong>${label}</strong>
    </div>`;
  }

  function showCatHub(level) {
    const meta = CATEGORY_META[level];
    $("#main-content").html(`
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="home.html">Home</a><span>/</span><strong>${getCategoryBreadcrumbLabel(level)}</strong>
          </div>
          <div class="level-header ${meta.colorClass}">
            <div class="level-icon"><i class="bi ${meta.icon}" style="font-size:2.5rem;"></i></div>
            <div>
              <h2>${meta.label} Computer Science</h2>
              <p>${meta.desc}</p>
            </div>
          </div>
          <div class="section-btn-grid">


           
          <a href="notes.html?level=${level}" class="section-btn">
            <span class="sb-icon"><i class="bi bi-file-earmark-pdf"></i></span>
            <h4>Study Notes</h4><p>Downloadable PDF guides for every topic</p>
          </a>
          <a href="quiz.html?level=${level}" class="section-btn">
            <span class="sb-icon"><i class="bi bi-patch-question"></i></span>
            <h4>Practice Quiz</h4><p>Multiple-choice questions with instant feedback</p>
          </a>

          </div>

        </div>
      </div>
    `);
  }


  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     NOTES
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  /* Download All as ZIP */
  $(document).on("click", "#btn-download-all", function () {
    const btn = $(this);
    const files = btn.data("files").split("|");
    const titles = btn.data("titles").split("|");
    btn
      .html(
        '<span class="spinner-border spinner-border-sm me-1"></span>Preparing ZIPâ€¦',
      )
      .prop("disabled", true);
    const zip = new JSZip();
    const fetches = files.map(function (file, i) {
      return fetch(file)
        .then(function (r) {
          return r.ok ? r.blob() : null;
        })
        .then(function (blob) {
          if (blob && blob.size > 0) {
            return blob.arrayBuffer().then(function (ab) {
              zip.file(file.split("/").pop(), ab);
            });
          } else {
            zip.file(file.split("/").pop(), buildPlaceholderPdf(titles[i]));
          }
        })
        .catch(function () {
          zip.file(file.split("/").pop(), buildPlaceholderPdf(titles[i]));
        });
    });
    Promise.all(fetches).then(function () {
      zip.generateAsync({ type: "blob" }).then(function (content) {
        const label = currentLevel ? CATEGORY_META[currentLevel].label : "CS";
        saveAs(
          content,
          label.replace(/\s+/g, "-").toLowerCase() + "-notes.zip",
        );
        btn
          .html('<i class="bi bi-check-lg me-1"></i>Downloaded!')
          .prop("disabled", false);
        setTimeout(function () {
          btn.html(
            '<i class="bi bi-cloud-download me-1"></i>Download All as ZIP',
          );
        }, 3000);
      });
    });
  });

  function buildPlaceholderPdf(title) {
    const safe = title.replace(/[()\\]/g, " ");
    const stream =
      "BT\n/F1 20 Tf\n72 780 Td\n(CS Study Hub) Tj\n0 -30 Td\n/F1 13 Tf\n(" +
      safe +
      ") Tj\n0 -40 Td\n/F1 10 Tf\n(Placeholder PDF - Add your content here.) Tj\nET\n";
    const slen = stream.length;
    const h = "%PDF-1.4\n";
    const o1 = "1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n";
    const o2 = "2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n";
    const o3 =
      "3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n/Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n";
    const o4 =
      "4 0 obj\n<</Length " +
      slen +
      ">>\nstream\n" +
      stream +
      "endstream\nendobj\n";
    const o5 =
      "5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n";
    let off = h.length,
      offsets = [];
    [o1, o2, o3, o4, o5].forEach(function (o) {
      offsets.push(off);
      off += o.length;
    });
    let xref = "xref\n0 6\n0000000000 65535 f \n";
    offsets.forEach(function (o) {
      xref += String(o).padStart(10, "0") + " 00000 n \n";
    });
    return (
      h +
      o1 +
      o2 +
      o3 +
      o4 +
      o5 +
      xref +
      "trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n" +
      off +
      "\n%%EOF\n"
    );
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     QUIZ
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  function showCatQuiz(level) {
    const meta = CATEGORY_META[level];
    $("#main-content").html(`
      <div class="section-wrap">
        <div class="container">
          ${breadcrumb(level, "Quiz")}
          <div class="section-header d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h2>${meta.label} - Practice Quiz</h2>
              <p>One question at a time. Instant feedback. Track your score.</p>
            </div>
          </div>
          <form class="quiz-student-card" id="quiz-student-form" style="display:none;">
            <div class="quiz-student-icon"><i class="bi bi-person-hearts"></i></div>
            <p class="quiz-student-eyebrow">Your quiz adventure</p>
            <h3>Who is taking the quiz?</h3>
            <p class="quiz-student-copy">Add your details to personalize your report card.</p>
            <label for="quiz-student-name">Student name</label>
            <input class="form-control" id="quiz-student-name" name="studentName" type="text" maxlength="80" autocomplete="name" required />
            <label for="quiz-father-name">Father's name</label>
            <input class="form-control" id="quiz-father-name" name="fatherName" type="text" maxlength="80" autocomplete="off" required />
            <button class="btn-primary-custom" type="submit"><i class="bi bi-stars me-2"></i>Start Quiz</button>
          </form>
          <div id="quiz-body" style="display:none;">
            <div class="quiz-card">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="quiz-progress-label" id="quiz-q-label"></span>
                <span class="quiz-score-badge" id="quiz-score-badge">Score: 0 / 0</span>
              </div>
              <div class="quiz-timer-row mb-3">
                <div class="quiz-timer-track" role="progressbar" aria-label="Time left for this question" aria-valuemin="0" aria-valuemax="30" aria-valuenow="30">
                  <div class="quiz-timer-bar" id="quiz-timer-bar"></div>
                </div>
                <span class="quiz-timer" id="quiz-timer" aria-live="polite">30s</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <span class="quiz-page-indicator" id="quiz-page-indicator">Page 1 of 1</span>
              </div>
              <div class="quiz-progress mb-4"><div class="quiz-progress-bar" id="quiz-progress-bar" style="width:0%"></div></div>
              <p class="quiz-question" id="quiz-question"></p>
              <div id="quiz-options"></div>
              <div class="quiz-feedback" id="quiz-feedback"></div>
              <div class="quiz-action-row">
                <button class="btn-quiz-restart" id="quiz-restart" type="button"><i class="bi bi-arrow-counterclockwise"></i><span>Restart Quiz</span></button>
                <div class="quiz-action-main">
                  <button class="btn-quiz-pause" id="quiz-pause" type="button" aria-pressed="false"><i class="bi bi-pause-fill me-1"></i><span>Pause Quiz</span></button>
                  <button class="btn-quiz-stop" id="quiz-stop" type="button"><i class="bi bi-stop-circle me-1"></i>Stop Quiz</button>
                  <button class="btn-next" id="quiz-next" style="display:none;">Next Question <i class="bi bi-arrow-right ms-1"></i></button>
                </div>
              </div>
            </div>
            <div class="mt-3 text-center" id="quiz-pagination"></div>
          </div>
          <div class="quiz-report-shell" id="quiz-result" style="display:none;">
            <article class="quiz-report-card" id="quiz-report-card">
              <div class="quiz-report-confetti" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
              <div class="quiz-report-ribbon"><i class="bi bi-stars"></i> QUIZ CHAMPION <i class="bi bi-stars"></i></div>
              <div class="quiz-report-trophy" aria-hidden="true"><i class="bi bi-trophy-fill"></i></div>
              <p class="quiz-report-kicker">YOUR REPORT CARD</p>
              <h3>Brilliant effort, <span id="quiz-report-student"></span>!</h3>
              <p class="quiz-report-message" id="quiz-report-message"></p>
              <div class="quiz-report-student-line"><i class="bi bi-person-hearts"></i><span>Father: <strong id="quiz-report-father"></strong></span></div>
              <div class="quiz-report-class"><i class="bi bi-mortarboard-fill"></i><span id="quiz-report-class"></span></div>
              <div class="quiz-report-status" id="quiz-report-status"></div>
              <div class="quiz-report-score-panel">
                <span>YOUR SCORE</span>
                <strong id="quiz-result-score"></strong>
                <small id="quiz-result-pct"></small>
              </div>
              <div class="quiz-report-stats">
                <div class="quiz-report-stat"><i class="bi bi-check2-circle"></i><span>Attempted</span><strong id="quiz-report-attempted"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-skip-forward-circle"></i><span>Skipped</span><strong id="quiz-report-skipped"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-check-circle-fill"></i><span>Correct</span><strong id="quiz-report-correct"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-x-circle-fill"></i><span>Incorrect</span><strong id="quiz-report-incorrect"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-question-circle"></i><span>Total questions</span><strong id="quiz-report-total"></strong></div>
              </div>
              <div class="quiz-report-times">
                <p><i class="bi bi-play-circle-fill"></i><span>Started</span><strong id="quiz-report-start-time"></strong></p>
                <p><i class="bi bi-flag-fill"></i><span>Finished</span><strong id="quiz-report-end-time"></strong></p>
              </div>
              <div class="quiz-report-actions">
                <button class="btn-primary-custom" id="quiz-report-download" type="button"><i class="bi bi-download me-2"></i>Download report card</button>
                <button class="btn-nav" id="quiz-restart-end" type="button"><i class="bi bi-arrow-counterclockwise me-1"></i>Try Again</button>
              </div>
            </article>
          </div>
        </div>
      </div>
    `);
    startQuiz(level);
  }

  function startQuiz(level) {
    clearInterval(quizTimerId);
    quizLevel = level || currentLevel;
    const sourceQuestions = QUIZZES[quizLevel] || [];
    if (!sourceQuestions.length) {
      $("#quiz-student-form").html(
        '<p class="text-danger" role="alert">Quiz questions are unavailable for this classroom.</p>',
      ).show();
      return;
    }
    const storageKey = getQuizStorageKey(quizLevel);
    let savedSession = null;
    try {
      savedSession = JSON.parse(localStorage.getItem(storageKey));
    } catch (error) {
      localStorage.removeItem(storageKey);
    }

    const validOrder =
      savedSession &&
      savedSession.orderVersion === QUIZ_ORDER_VERSION &&
      Array.isArray(savedSession.order) &&
      savedSession.order.length === sourceQuestions.length &&
      savedSession.order.every(function (index, position) {
        return index === position;
      }) &&
      new Set(savedSession.order).size === sourceQuestions.length;
    const validResponses =
      validOrder &&
      Array.isArray(savedSession.responses) &&
      savedSession.responses.length === sourceQuestions.length &&
      savedSession.responses.every(function (response, index) {
        const sourceQuestion = sourceQuestions[savedSession.order[index]];
        return response === null ||
          (Number.isInteger(response) && response >= 0 && response < sourceQuestion.opts.length);
      });

    if (
      validOrder &&
      validResponses &&
      typeof savedSession.studentName === "string" &&
      savedSession.studentName.trim() &&
      typeof savedSession.fatherName === "string" &&
      savedSession.fatherName.trim() &&
      typeof savedSession.startedAt === "string" &&
      !Number.isNaN(Date.parse(savedSession.startedAt)) &&
      Number.isInteger(savedSession.index) &&
      savedSession.index >= 0 &&
      savedSession.index < sourceQuestions.length &&
      Number.isInteger(savedSession.timeRemaining) &&
      savedSession.timeRemaining > 0 &&
      savedSession.timeRemaining <= QUIZ_SECONDS_PER_QUESTION
    ) {
      quizQuestions = savedSession.order.map(function (index) {
        return sourceQuestions[index];
      });
      quizIndex = savedSession.index;
      quizResponses = savedSession.responses;
      quizScore = countCorrectAnswers();
      quizTimeRemaining = savedSession.timeRemaining;
      quizStudentName = savedSession.studentName;
      quizFatherName = savedSession.fatherName;
      quizStartedAt = savedSession.startedAt;
      quizPaused = savedSession.paused === true;
      quizAnswered = Number.isInteger(quizResponses[quizIndex]);
      quizSelectedIndex = quizAnswered ? quizResponses[quizIndex] : null;
      showActiveQuiz();
    } else {
      localStorage.removeItem(storageKey);
      quizQuestions = [];
      quizIndex = 0;
      quizScore = 0;
      quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
      quizResponses = [];
      quizStudentName = "";
      quizFatherName = "";
      quizStartedAt = null;
      quizPaused = false;
      quizAnswered = false;
      quizSelectedIndex = null;
      $("#quiz-student-form").show();
      $("#quiz-body, #quiz-result").hide();
    }
  }

  function showActiveQuiz() {
    quizPage = Math.floor(quizIndex / QUIZ_PAGE_SIZE);
    $("#quiz-student-form, #quiz-result").hide();
    $("#quiz-body").show();
    renderQuestion();
    updateQuizTimer();
    updateQuizPauseButton();
    startQuizTimer();
  }

  function startQuizTimer() {
    clearInterval(quizTimerId);
    quizTimerId = null;
    if (quizPaused || Number.isInteger(quizResponses[quizIndex])) return;
    quizTimerId = setInterval(function () {
      quizTimeRemaining--;
      if (quizTimeRemaining <= 9 && quizTimeRemaining >= 0) {
        playCountdownTickSound();
      }
      updateQuizTimer();
      persistQuizSession();
      if (quizTimeRemaining <= 0) {
        if (!Number.isInteger(quizResponses[quizIndex])) {
          playSkipSound();
        }
        triggerQuestionTransitionAnimation();
        advanceQuizQuestion();
      }
    }, 1000);
  }

  $(document).on("submit", "#quiz-student-form", function (event) {
    event.preventDefault();
    quizStudentName = $("#quiz-student-name").val().trim();
    quizFatherName = $("#quiz-father-name").val().trim();
    if (!quizStudentName || !quizFatherName) return;
    quizQuestions = QUIZZES[quizLevel].slice();
    quizResponses = Array(quizQuestions.length).fill(null);
    quizIndex = 0;
    quizPage = 0;
    quizScore = 0;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    quizAnswered = false;
    quizSelectedIndex = null;
    quizStartedAt = new Date().toISOString();
    quizCompletionStatus = "completed";
    showActiveQuiz();
    persistQuizSession();
  });

  function getQuizStorageKey(level) {
    return "cs-study-quiz:" + level;
  }

  function persistQuizSession() {
    if (!quizLevel || !quizQuestions.length || !quizQuestions[quizIndex]) return;
    const sourceQuestions = QUIZZES[quizLevel];
    const order = quizQuestions.map(function (question) {
      return sourceQuestions.indexOf(question);
    });
    try {
      localStorage.setItem(
        getQuizStorageKey(quizLevel),
        JSON.stringify({
          orderVersion: QUIZ_ORDER_VERSION,
          order,
          index: quizIndex,
          score: quizScore,
          responses: quizResponses,
          timeRemaining: quizTimeRemaining,
          paused: quizPaused,
          studentName: quizStudentName,
          fatherName: quizFatherName,
          startedAt: quizStartedAt,
        }),
      );
    } catch (error) {
      // Keep the quiz usable when browser storage is unavailable.
    }
  }

  function ensureQuizAudioContext() {
    if (!window.AudioContext && !window.webkitAudioContext) return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!quizAudioCtx) quizAudioCtx = new AudioCtor();
    if (!quizAudioCompressor && quizAudioCtx.createDynamicsCompressor) {
      quizAudioCompressor = quizAudioCtx.createDynamicsCompressor();
      quizAudioCompressor.threshold.value = -1;
      quizAudioCompressor.knee.value = 0;
      quizAudioCompressor.ratio.value = 20;
      quizAudioCompressor.attack.value = 0.003;
      quizAudioCompressor.release.value = 0.15;
      quizAudioCompressor.connect(quizAudioCtx.destination);
    }
    if (quizAudioCtx.state === "suspended") {
      quizAudioCtx.resume();
    }
    return quizAudioCtx;
  }

  function playQuizTone({ frequency, duration, type, volume, delay, sweepTo }) {
    const context = ensureQuizAudioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const startAt = context.currentTime + (delay || 0);
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (sweepTo) {
      oscillator.frequency.exponentialRampToValueAtTime(sweepTo, startAt + duration);
    }
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume || 0.04, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gainNode);
    gainNode.connect(quizAudioCompressor || context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
  }

  function playQuizNoiseBurst({ duration, volume, delay, highPass }) {
    const context = ensureQuizAudioContext();
    if (!context) return;
    const buffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * duration)), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const envelope = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    const startAt = context.currentTime + (delay || 0);
    source.buffer = buffer;
    filter.type = highPass ? "highpass" : "lowpass";
    filter.frequency.value = highPass || 9000;
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume || 0.12, startAt + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(quizAudioCompressor || context.destination);
    source.start(startAt);
    source.stop(startAt + duration + 0.02);
  }

  function playCountdownTickSound() {
    playQuizTone({ frequency: 870, duration: 0.06, type: "triangle", volume: 1, sweepTo: 620 });
  }

  function playCorrectAnswerSound() {
    playQuizTone({ frequency: 620, duration: 0.12, type: "triangle", volume: 1, sweepTo: 860 });
    playQuizTone({ frequency: 840, duration: 0.14, type: "triangle", volume: 1, delay: 0.08, sweepTo: 1060 });
    playQuizTone({ frequency: 1090, duration: 0.18, type: "triangle", volume: 1, delay: 0.16, sweepTo: 1360 });
  }

  function playWrongAnswerSound() {
    playQuizTone({ frequency: 420, duration: 0.16, type: "sawtooth", volume: 1, sweepTo: 180 });
    playQuizTone({ frequency: 260, duration: 0.22, type: "square", volume: 1, delay: 0.1, sweepTo: 120 });
  }

  function playSkipSound() {
    playQuizTone({ frequency: 490, duration: 0.08, type: "sine", volume: 1, sweepTo: 360 });
    playQuizTone({ frequency: 360, duration: 0.12, type: "sine", volume: 1, delay: 0.07, sweepTo: 240 });
  }

  function playResultSound() {
    playQuizTone({ frequency: 620, duration: 0.2, type: "triangle", volume: 1, sweepTo: 760 });
    playQuizTone({ frequency: 780, duration: 0.2, type: "triangle", volume: 1, delay: 0.16, sweepTo: 980 });
    playQuizTone({ frequency: 980, duration: 0.3, type: "triangle", volume: 1, delay: 0.32, sweepTo: 1170 });
    [0, 0.13, 0.27, 0.41, 0.56, 0.72, 0.89, 1.08].forEach(function (delay) {
      playQuizNoiseBurst({ duration: 0.1, volume: 1, delay, highPass: 1100 });
    });
  }

  function triggerQuestionTransitionAnimation() {
    const card = document.querySelector(".quiz-card");
    if (!card) return;
    card.classList.remove("question-flash", "question-slide-up");
    void card.offsetWidth;
    card.classList.add("question-flash");
    window.setTimeout(function () {
      card.classList.remove("question-flash");
      card.classList.add("question-slide-up");
      window.setTimeout(function () {
        card.classList.remove("question-slide-up");
      }, 450);
    }, 120);
  }

  function updateQuizTimer() {
    const seconds = Math.max(quizTimeRemaining, 0);
    const timer = $("#quiz-timer");
    timer
      .removeClass("timer-warning timer-danger")
      .toggleClass("timer-warning", seconds <= 10 && seconds > 5)
      .toggleClass("timer-danger", seconds <= 5);
    timer.text(seconds + "s");
    $("#quiz-timer-bar")
      .css("width", ((seconds / QUIZ_SECONDS_PER_QUESTION) * 100).toFixed(0) + "%")
      .toggleClass("timer-warning", seconds <= 10 && seconds > 5)
      .toggleClass("timer-danger", seconds <= 5)
      .parent()
      .attr("aria-valuenow", seconds);
  }

  function getQuizPageInfo() {
    const pageStart = quizPage * QUIZ_PAGE_SIZE;
    const pageEnd = Math.min(pageStart + QUIZ_PAGE_SIZE, quizQuestions.length);
    const questionsInPage = pageEnd - pageStart;
    const pageNumber = Math.floor(quizIndex / QUIZ_PAGE_SIZE) + 1;
    return {
      pageStart,
      pageEnd,
      questionsInPage,
      pageNumber,
      totalPages: Math.max(1, Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE)),
    };
  }

  function renderPaginationButtons() {
    const totalPages = Math.max(1, Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE));
    const pageWrap = $("#quiz-pagination").empty();
    const startPage = Math.max(0, Math.min(quizPage - 4, totalPages - 10));
    const endPage = Math.min(totalPages, startPage + 10);

    const prevBtn = $(
      '<button type="button" class="btn btn-sm btn-outline-secondary me-2 mb-2 quiz-page-nav" data-nav="prev" aria-label="Previous page"><i class="bi bi-arrow-left"></i></button>',
    );
    pageWrap.append(prevBtn);

    for (let p = startPage; p < endPage; p++) {
      const pageButton = $(
        '<button type="button" class="btn btn-sm me-2 mb-2 ' +
          (p === quizPage ? "btn-primary-custom" : "btn-outline-secondary") +
          ' quiz-page-btn">' +
          (p + 1) +
          "</button>",
      );
      pageButton.data("page", p);
      pageWrap.append(pageButton);
    }

    const nextBtn = $(
      '<button type="button" class="btn btn-sm btn-outline-secondary ms-1 mb-2 quiz-page-nav" data-nav="next" aria-label="Next page"><i class="bi bi-arrow-right"></i></button>',
    );
    pageWrap.append(nextBtn);
  }

  function renderQuestion() {
    const q = quizQuestions[quizIndex];
    if (!q) return;
    quizSelectedIndex = quizResponses[quizIndex];
    quizAnswered = Number.isInteger(quizSelectedIndex);
    const pageInfo = getQuizPageInfo();
    $("#quiz-progress-bar").css(
      "width",
      ((quizIndex / quizQuestions.length) * 100).toFixed(0) + "%",
    );
    $("#quiz-q-label").text(
      "Question " + (quizIndex + 1) + " of " + quizQuestions.length,
    );
    $("#quiz-page-indicator").text(
      "Page " + pageInfo.pageNumber + " of " + pageInfo.totalPages,
    );
    $("#quiz-score-badge").text("Score: " + quizScore + " / " + countAttemptedQuestions());
    $("#quiz-question").text(q.q);
    $("#quiz-feedback").hide().removeClass("correct incorrect").text("");
    $("#quiz-next").hide();
    renderPaginationButtons();
    const wrap = $("#quiz-options").empty();
    q.opts.forEach(function (opt, i) {
      const option = $("<button>", {
        class: "quiz-option",
        "data-idx": i,
      }).text(String.fromCharCode(65 + i) + ". " + opt);
      wrap.append(option);
    });
    if (quizAnswered && quizSelectedIndex !== null) {
      const correct = q.ans;
      $(".quiz-option").prop("disabled", true);
      $('[data-idx="' + correct + '"]').addClass("correct");
      if (quizSelectedIndex !== correct) {
        $('[data-idx="' + quizSelectedIndex + '"]').addClass("incorrect");
      }
      $("#quiz-feedback")
        .addClass(quizSelectedIndex === correct ? "correct" : "incorrect")
        .text(quizSelectedIndex === correct ? "Correct!" : "Incorrect â€” correct answer: " + String.fromCharCode(65 + correct) + ".")
        .show();
      $("#quiz-next").show();
    }
    updateQuizTimer();
    persistQuizSession();
  }

  $(document).on("click", ".quiz-option", function () {
    if (quizPaused || quizAnswered) return;
    clearInterval(quizTimerId);
    quizTimerId = null;
    quizAnswered = true;
    const chosen = parseInt($(this).data("idx"));
    quizSelectedIndex = chosen;
    const correct = quizQuestions[quizIndex].ans;
    $(".quiz-option").prop("disabled", true);
    if (chosen === correct) {
      $(this).addClass("correct");
      $("#quiz-feedback").addClass("correct").text("Correct!").show();
      playCorrectAnswerSound();
    } else {
      $(this).addClass("incorrect");
      $('[data-idx="' + correct + '"]').addClass("correct");
      $("#quiz-feedback")
        .addClass("incorrect")
        .text(
          "Incorrect â€” correct answer: " +
            String.fromCharCode(65 + correct) +
            ".",
        )
        .show();
      playWrongAnswerSound();
    }
    quizResponses[quizIndex] = chosen;
    quizScore = countCorrectAnswers();
    $("#quiz-score-badge").text(
      "Score: " + quizScore + " / " + countAttemptedQuestions(),
    );
    $("#quiz-next").show();
    persistQuizSession();
  });

  $(document).on("click", ".quiz-page-btn", function () {
    if (quizPaused) return;
    const targetPage = parseInt($(this).data("page"), 10);
    if (Number.isNaN(targetPage)) return;
    quizPage = targetPage;
    quizIndex = quizPage * QUIZ_PAGE_SIZE;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  });

  $(document).on("click", ".quiz-page-nav", function () {
    if (quizPaused) return;
    const direction = $(this).data("nav");
    const totalPages = Math.max(1, Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE));
    if (direction === "prev") {
      quizPage = Math.max(0, quizPage - 1);
    } else {
      quizPage = Math.min(totalPages - 1, quizPage + 1);
    }
    quizIndex = quizPage * QUIZ_PAGE_SIZE;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  });

  function advanceQuizQuestion() {
    const pageInfo = getQuizPageInfo();
    const questionsInPage = Math.min(
      QUIZ_PAGE_SIZE,
      quizQuestions.length - pageInfo.pageStart,
    );
    const localIndex = quizIndex - pageInfo.pageStart;

    if (!Number.isInteger(quizResponses[quizIndex])) {
      playSkipSound();
    }

    if (quizIndex >= quizQuestions.length - 1) {
      finishQuiz();
      return;
    }
    if (localIndex >= questionsInPage - 1) quizPage++;
    triggerQuestionTransitionAnimation();
    quizIndex++;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  }

  $(document).on("click", "#quiz-next", function () {
    if (quizPaused) return;
    advanceQuizQuestion();
  });

  function updateQuizPauseButton() {
    const button = $("#quiz-pause");
    button.attr("aria-pressed", quizPaused ? "true" : "false");
    button.html(
      quizPaused
        ? '<i class="bi bi-play-fill me-1"></i><span>Resume Quiz</span>'
        : '<i class="bi bi-pause-fill me-1"></i><span>Pause Quiz</span>',
    );
  }

  $(document).on("click", "#quiz-pause", function () {
    quizPaused = !quizPaused;
    if (quizPaused) {
      clearInterval(quizTimerId);
      quizTimerId = null;
    } else {
      startQuizTimer();
    }
    updateQuizPauseButton();
    persistQuizSession();
  });

  $(document).on("click", "#quiz-stop", function () {
    finishQuiz("stopped");
  });

  $(document).on("click", "#quiz-restart", restartQuizForStudent);

  function finishQuiz(status) {
    if ($("#quiz-result").is(":visible")) return;
    clearInterval(quizTimerId);
    quizPaused = false;
    quizCompletionStatus = status === "stopped" ? "stopped" : "completed";
    if (quizLevel) localStorage.removeItem(getQuizStorageKey(quizLevel));
    const attempted = countAttemptedQuestions();
    const skipped = quizQuestions.length - attempted;
    const pct = quizQuestions.length ? Math.round((quizScore / quizQuestions.length) * 100) : 0;
    const endTime = new Date();
    const message = getQuizPerformanceMessage(pct);
    playResultSound();
    $("#quiz-result-score").text(quizScore + "/" + quizQuestions.length);
    $("#quiz-result-pct").text(pct + "% correct");
    $("#quiz-report-student").text(quizStudentName);
    $("#quiz-report-father").text(quizFatherName);
    $("#quiz-report-class").text(getQuizClassLabel());
    $("#quiz-report-status")
      .toggleClass("is-stopped", quizCompletionStatus === "stopped")
      .html(
        '<i class="bi ' +
          (quizCompletionStatus === "stopped" ? "bi-pause-circle-fill" : "bi-check-circle-fill") +
          '"></i> Test ' +
          (quizCompletionStatus === "stopped" ? "stopped early" : "completed"),
      );
    $("#quiz-report-message").text(message);
    $("#quiz-report-attempted").text(attempted);
    $("#quiz-report-skipped").text(skipped);
    $("#quiz-report-correct").text(quizScore);
    $("#quiz-report-incorrect").text(attempted - quizScore);
    $("#quiz-report-total").text(quizQuestions.length);
    $("#quiz-report-start-time").text(formatQuizLocalTime(quizStartedAt));
    $("#quiz-report-end-time").text(formatQuizLocalTime(endTime.toISOString()));
    $("#quiz-body").hide();
    $("#quiz-result").show();
  }

  function countAttemptedQuestions() {
    return quizResponses.filter(Number.isInteger).length;
  }

  function countCorrectAnswers() {
    return quizResponses.reduce(function (score, response, index) {
      return score + (Number.isInteger(response) && response === quizQuestions[index].ans ? 1 : 0);
    }, 0);
  }

  function getQuizPerformanceMessage(percentage) {
    if (percentage >= 90) return "Outstanding work! You're a quiz superstar!";
    if (percentage >= 75) return "Fantastic effort! Keep that curiosity shining.";
    if (percentage >= 50) return "Great practice! Every question helps you grow.";
    return "Nice try! Keep learning and you'll level up.";
  }

  function getQuizClassLabel() {
    const board = quizLevel.indexOf("federal-board") !== -1
      ? "Federal Board"
      : quizLevel.indexOf("sindh-board") !== -1
        ? "Sindh Board"
        : "";
    return board ? CATEGORY_META[quizLevel].label + " - " + board : CATEGORY_META[quizLevel].label;
  }

  function formatQuizLocalTime(isoTime) {
    return new Date(isoTime).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function escapeQuizSvgText(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function downloadQuizReport() {
    const attempted = countAttemptedQuestions();
    const skipped = quizQuestions.length - attempted;
    const percentage = quizQuestions.length
      ? Math.round((quizScore / quizQuestions.length) * 100)
      : 0;
    const report = {
      student: escapeQuizSvgText(quizStudentName),
      father: escapeQuizSvgText(quizFatherName),
      className: escapeQuizSvgText(getQuizClassLabel()),
      status: quizCompletionStatus === "stopped" ? "Stopped early" : "Completed",
      score: quizScore + " / " + quizQuestions.length,
      percentage: percentage + "% correct",
      attempted: attempted,
      skipped: skipped,
      correct: quizScore,
      incorrect: attempted - quizScore,
      start: escapeQuizSvgText(formatQuizLocalTime(quizStartedAt)),
      end: escapeQuizSvgText($("#quiz-report-end-time").text()),
      message: escapeQuizSvgText(getQuizPerformanceMessage(percentage)),
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1120" viewBox="0 0 900 1120">
      <defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff7cc"/><stop offset="1" stop-color="#dff7ff"/></linearGradient><linearGradient id="score" x2="1" y2="1"><stop stop-color="#ffe47a"/><stop offset="1" stop-color="#ffc85a"/></linearGradient></defs>
      <rect width="900" height="1120" rx="42" fill="url(#paper)"/><circle cx="90" cy="100" r="30" fill="#ff9d76"/><circle cx="810" cy="120" r="22" fill="#78d8c8"/><path d="M90 930l18 36 40 6-29 28 7 40-36-19-36 19 7-40-29-28 40-6z" fill="#f7bf45"/><path d="M790 900l13 26 29 4-21 20 5 29-26-14-26 14 5-29-21-20 29-4z" fill="#fd9476"/>
      <rect x="105" y="72" width="690" height="976" rx="36" fill="#ffffff" stroke="#e4e8eb" stroke-width="3"/>
      <rect x="260" y="105" width="380" height="54" rx="27" fill="#dcf7ed"/><text x="450" y="141" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#237d67">QUIZ CHAMPION</text>
      <path d="M420 180h60v20c0 20-12 34-30 34s-30-14-30-34v-20m0 8h-15v10c0 12 7 20 20 22m55-32h15v10c0 12-7 20-20 22m-18 14v14h-12v9h36v-9h-12v-14z" fill="none" stroke="#d99b24" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><text x="450" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="#798490">YOUR REPORT CARD</text>
      <text x="450" y="334" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#243447">Brilliant effort, ${report.student}!</text><text x="450" y="376" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#526274">${report.message}</text>
      <text x="450" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#334155">Father: ${report.father}</text><text x="450" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#334155">${report.className}</text>
      <rect x="320" y="488" width="260" height="38" rx="19" fill="${quizCompletionStatus === "stopped" ? "#fff0e9" : "#e3f6e9"}"/><text x="450" y="513" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="${quizCompletionStatus === "stopped" ? "#b45309" : "#237d67"}">Test ${report.status}</text>
      <rect x="185" y="540" width="530" height="190" rx="28" fill="url(#score)"/><text x="450" y="584" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="2" fill="#735311">YOUR SCORE</text><text x="450" y="655" text-anchor="middle" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#342b18">${report.score}</text><text x="450" y="695" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#735311">${report.percentage}</text>
      <text x="450" y="782" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#344256">QUIZ STATS</text>
      <text x="165" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Attempted</text><text x="165" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#237d67">${report.attempted}</text>
      <text x="310" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Skipped</text><text x="310" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#d97706">${report.skipped}</text>
      <text x="450" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Correct</text><text x="450" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#237d67">${report.correct}</text>
      <text x="590" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Incorrect</text><text x="590" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#b45309">${report.incorrect}</text>
      <text x="735" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Total</text><text x="735" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#3d6f9b">${quizQuestions.length}</text>
      <path d="M170 910h560" stroke="#e7ebef" stroke-width="2"/><text x="190" y="956" font-family="Arial,sans-serif" font-size="17" fill="#526274">Started: ${report.start}</text><text x="190" y="994" font-family="Arial,sans-serif" font-size="17" fill="#526274">Finished: ${report.end}</text>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = quizStudentName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
    link.href = url;
    link.download = filename + "-quiz-report.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  $(document).on("click", "#quiz-report-download", downloadQuizReport);

  function restartQuizForStudent() {
    clearInterval(quizTimerId);
    if (quizLevel) localStorage.removeItem(getQuizStorageKey(quizLevel));
    quizQuestions = [];
    quizResponses = [];
    quizIndex = 0;
    quizPage = 0;
    quizScore = 0;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    quizPaused = false;
    quizAnswered = false;
    quizSelectedIndex = null;
    quizStudentName = "";
    quizFatherName = "";
    quizStartedAt = null;
    quizCompletionStatus = "completed";
    $("#quiz-student-form")[0].reset();
    $("#quiz-result, #quiz-body").hide();
    $("#quiz-student-form").show();
    $("#quiz-student-name").trigger("focus");
  }

  $(document).on("click", "#quiz-restart-end", restartQuizForStudent);


  function showGlossary() {
    $("#main-content").html(`
      <div class="section-wrap">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-lg-10 col-xl-9">
              <div class="section-header">
                <h2>CS Glossary</h2>
                <p>Quickly search key computer science terms and definitions.</p>
              </div>
              <div class="search-panel glossary-search-panel mb-4" role="search">
                <label class="visually-hidden" for="glossary-search">Search glossary</label>
                <i class="bi bi-search glossary-search-icon" aria-hidden="true"></i>
                <input id="glossary-search" type="search" class="form-control" placeholder="Search a term or definitionâ€¦" autocomplete="off" aria-describedby="glossary-search-help" />
                <button type="button" class="glossary-clear-search" id="glossary-clear-search" aria-label="Clear search" hidden>
                  <i class="bi bi-x-circle-fill" aria-hidden="true"></i>
                </button>
                <div class="form-text" id="glossary-search-help">Search matches both terms and definitions as you type.</div>
              </div>
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3 glossary-toolbar">
                <div id="glossary-count" class="text-muted" role="status" aria-live="polite">Loading glossaryâ€¦</div>
                <button class="btn btn-sm btn-outline-secondary" id="glossary-show-all" type="button">Show all terms</button>
              </div>
              <div id="glossary-results"></div>
              <section id="glossary-external-section" class="glossary-external-section" aria-labelledby="glossary-external-heading" hidden>
                <div class="glossary-external-heading">
                  <div>
                    <h3 id="glossary-external-heading">Related computer science articles</h3>
                    <p>Supplementary results from Wikipedia. Your curated glossary remains the primary source.</p>
                  </div>
                  <span class="glossary-source-badge"><i class="bi bi-globe2" aria-hidden="true"></i> Wikipedia</span>
                </div>
                <div id="glossary-external-status" class="glossary-external-status" role="status" aria-live="polite"></div>
                <div id="glossary-external-results"></div>
                <p class="glossary-attribution">Wikipedia text is by its contributors and available under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution-ShareAlike 4.0 License</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    `);
    const terms = getGlossary();
    if (!terms || !terms.length) {
      $("#glossary-count").text("No glossary entries available.");
      $("#glossary-results").html(
        '<p class="text-muted">Glossary data could not be loaded right now.</p>',
      );
      return;
    }
    renderGlossaryResults(terms, "");
  }

  function renderGlossaryResults(allTerms, query) {
    const normalized = String(query || "")
      .trim()
      .toLowerCase();
    const escapeHtml = function (value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[character];
      });
    };
    const formatMatch = function (value) {
      if (!normalized) return escapeHtml(value);
      const escapedQuery = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matcher = new RegExp(`(${escapedQuery})`, "gi");
      return String(value)
        .split(matcher)
        .map(function (part) {
          return part.toLowerCase() === normalized
            ? `<mark>${escapeHtml(part)}</mark>`
            : escapeHtml(part);
        })
        .join("");
    };
    const filtered = allTerms.filter(function (item) {
      return (
        item.term.toLowerCase().includes(normalized) ||
        item.definition.toLowerCase().includes(normalized)
      );
    });
    const countText = normalized
      ? `${filtered.length} term${filtered.length === 1 ? "" : "s"} matching "${query}"`
      : `${filtered.length} total term${filtered.length === 1 ? "" : "s"}`;
    $("#glossary-count").text(countText);
    $("#glossary-clear-search").prop("hidden", !normalized);
    if (!filtered.length) {
      $("#glossary-results").html(
        `<div class="glossary-empty-state">
          <i class="bi bi-search" aria-hidden="true"></i>
          <h3>No matching terms</h3>
          <p>Try a different keyword, or search for a related idea.</p>
          <button class="btn btn-sm btn-primary" type="button" id="glossary-empty-clear">Clear search</button>
        </div>`,
      );
      return;
    }
    const items = filtered
      .map(function (item) {
        return `<article class="glossary-row">
        <h3 class="glossary-term">${formatMatch(item.term)}</h3>
        <p class="glossary-definition">${formatMatch(item.definition)}</p>
      </article>`;
      })
      .join("");
    $("#glossary-results").html(items);
  }

  function searchExternalGlossary(query) {
    const searchTerm = String(query || "").trim();
    const $section = $("#glossary-external-section");
    const requestId = ++glossarySearchRequestId;
    if (glossarySearchController) {
      glossarySearchController.abort();
      glossarySearchController = null;
    }
    clearTimeout(glossarySearchTimer);

    if (searchTerm.length < 3) {
      $section.prop("hidden", true);
      return;
    }

    $section.prop("hidden", false);
    $("#glossary-external-status").text("Searching Wikipediaâ€¦");
    $("#glossary-external-results").empty();
    glossarySearchTimer = setTimeout(function () {
      const controller = new AbortController();
      glossarySearchController = controller;
      const params = new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: searchTerm,
        gsrlimit: "5",
        prop: "extracts|info",
        exintro: "1",
        explaintext: "1",
        exchars: "700",
        inprop: "url",
        format: "json",
        origin: "*",
      });

      fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
        signal: controller.signal,
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error(`Wikipedia search failed with status ${response.status}.`);
          }
          return response.json();
        })
        .then(function (data) {
          if (requestId !== glossarySearchRequestId) return;
          if (data.error) {
            throw new Error(data.error.info || "Wikipedia returned a search error.");
          }
          const pages = Object.values(data.query?.pages || {}).sort(
            (first, second) => first.index - second.index,
          );
          const results = pages.filter(
            (page) => page.title && page.extract && page.fullurl,
          );
          if (!results.length) {
            $("#glossary-external-status").text(
              "No related Wikipedia articles found for this search.",
            );
            return;
          }

          const $results = $("#glossary-external-results").empty();
          results.forEach(function (page) {
            const $link = $("<a>")
              .attr({
                href: page.fullurl,
                target: "_blank",
                rel: "noopener noreferrer",
              })
              .text(page.title);
            const $article = $("<article>").addClass(
              "glossary-external-result",
            );
            $("<h4>").append($link).appendTo($article);
            $("<p>").text(page.extract.trim()).appendTo($article);
            $results.append($article);
          });
          $("#glossary-external-status").text(
            `${results.length} related article${results.length === 1 ? "" : "s"} found.`,
          );
        })
        .catch(function (error) {
          if (error.name === "AbortError" || requestId !== glossarySearchRequestId) {
            return;
          }
          console.error("Wikipedia glossary search failed:", error);
          $("#glossary-external-status").text(
            "Wikipedia search is unavailable right now. Your curated glossary is still available.",
          );
        });
    }, 400);
  }

  $(document).on("input", "#glossary-search", function () {
    const query = $(this).val();
    renderGlossaryResults(getGlossary(), query);
    searchExternalGlossary(query);
  });

  $(document).on("click", "#glossary-clear-search, #glossary-empty-clear", function () {
    $("#glossary-search").val("").trigger("input").trigger("focus");
  });

  $(document).on("click", "#glossary-show-all", function () {
    $("#glossary-search").val("").trigger("input");
  });

  function showBooks(category) {
    const selectedCategory = category || "All";
    const categories = ["All"].concat(BOOK_CATEGORIES);
    const books =
      selectedCategory === "All"
        ? BOOKS
        : BOOKS.filter((book) => book.categories.includes(selectedCategory));
    const escapeHtml = function (value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[character];
      });
    };
    const categoryButtons = categories
      .map(
        (item) => `<button
          class="book-filter${item === selectedCategory ? " active" : ""}"
          type="button"
          data-book-category="${escapeHtml(item)}"
          aria-pressed="${item === selectedCategory}"
        >${escapeHtml(item)}</button>`,
      )
      .join("");
    const bookCards = books
      .map(function (book) {
        const categoriesHtml = book.categories
          .map(
            (item) =>
              `<span class="book-category-tag">${escapeHtml(item)}</span>`,
          )
          .join("");
        return `<article class="book-card">
          <div class="book-cover book-cover--${escapeHtml(book.coverTheme)}" role="img" aria-label="Illustrated cover for ${escapeHtml(book.title)}">
            <span class="book-cover-mark" aria-hidden="true"><i class="bi bi-book-half"></i></span>
            <span class="book-cover-label">${escapeHtml(book.coverLabel)}</span>
            <span class="book-cover-title">${escapeHtml(book.title)}</span>
            <span class="book-cover-author">${escapeHtml(book.author)}</span>
          </div>
          <div class="book-card-body">
            <div class="book-category-tags">${categoriesHtml}</div>
            <h3>${escapeHtml(book.title)}</h3>
            <p class="book-author">${escapeHtml(book.author)}</p>
            <p class="book-description">${escapeHtml(book.description)}</p>
            ${book.license ? `<p class="book-license"><i class="bi bi-unlock" aria-hidden="true"></i> ${escapeHtml(book.license)}</p>` : ""}
            <div class="book-card-actions">
              <a class="btn btn-primary book-action" href="${escapeHtml(book.actionUrl)}" target="_blank" rel="noopener noreferrer">
                <i class="bi ${book.actionLabel.includes("PDF") ? "bi-file-earmark-pdf" : "bi-book"}" aria-hidden="true"></i>
                ${escapeHtml(book.actionLabel)}
              </a>
            </div>
          </div>
        </article>`;
      })
      .join("");

    $("#main-content").html(`
      <div class="section-wrap books-page">
        <div class="container">
          <div class="section-header">
            <span class="books-eyebrow"><i class="bi bi-book-half" aria-hidden="true"></i> Open learning library</span>
            <h2>Computer Science Books</h2>
            <p>Browse computer science books with free PDF access from their authors or publishers.</p>
          </div>
          <div class="book-filters" role="group" aria-label="Filter books by category">${categoryButtons}</div>
          <div class="books-results-count" role="status" aria-live="polite">
            Showing ${books.length} ${books.length === 1 ? "book" : "books"}${selectedCategory !== "All" ? ` in ${escapeHtml(selectedCategory)}` : ""}
          </div>
          ${
            bookCards
              ? `<div class="books-grid">${bookCards}</div>`
              : `<div class="books-empty-state"><i class="bi bi-journal-x" aria-hidden="true"></i><p>No books in this category yet.</p></div>`
          }
          <p class="books-license-note"><i class="bi bi-info-circle" aria-hidden="true"></i> Books remain the property of their authors. Availability and license terms vary; check each official source before reusing or redistributing a book.</p>
        </div>
      </div>
    `);
  }

  $(document).on("click", "[data-book-category]", function () {
    showBooks($(this).attr("data-book-category"));
  });

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     TUTORIAL
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  function showTutorial() {
    let cards = TUTORIALS.map(function (v) {
      return `<div class="col-md-6 col-lg-4 mb-4">
        <div class="video-card">
          <div class="video-embed-wrap">
            <iframe src="https://www.youtube.com/embed/${v.videoId}" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="video-card-body">
            <span class="video-tag" style="background:${v.tagColor};color:${v.tagText}">${v.tag}</span>
            <h5>${v.title}</h5>
            <p>${v.desc}</p>
          </div>
        </div>
      </div>`;
    }).join("");
    $("#main-content").html(`
      <div class="section-wrap">
        <div class="container">
          <div class="section-header">
            <h2>Video Tutorials</h2>
            <p>Curated YouTube lessons from top CS educators. Watch directly here or open on YouTube for full-screen.</p>
          </div>
          <div class="row">${cards}</div>
        </div>
      </div>
    `);
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     BLOG
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•*/
  function showBlog() {
    const posts = getPosts();
    const escapeHtml = function (value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[character];
      });
    };
    const safeImageUrl = function (value) {
      const imageUrl = String(value || "").trim();
      return /^(https?:\/\/|\/assets\/)/i.test(imageUrl)
        ? escapeHtml(imageUrl)
        : "";
    };
    let cards = posts
      .slice()
      .reverse()
      .map(function (post, index) {
        const tags = String(post.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 3)
          .map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`)
          .join("");
        const excerpt =
          post.excerpt ||
          String(post.content || "")
            .replace(/<[^>]+>/g, "")
            .substring(0, 140) + "â€¦";
        const imageUrl = safeImageUrl(post.imageUrl);
        const image = imageUrl
          ? `<img src="${imageUrl}" alt="" loading="lazy" />`
          : `<span class="blog-cover-placeholder-icon" aria-hidden="true"><i class="bi bi-journal-richtext"></i></span>`;
        const postDate = post.date
          ? new Date(`${post.date}T00:00:00`).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";
        return `<a class="blog-card blog-card--theme-${index % 4}" href="blog-post.html?id=${encodeURIComponent(post.id)}" aria-label="Read ${escapeHtml(post.title)}">
          <div class="blog-card-cover">
            ${image}
            ${tags ? `<div class="blog-card-tags">${tags}</div>` : ""}
          </div>
          <div class="blog-card-body">
            <h3>${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escapeHtml(excerpt)}</p>
            <div class="blog-card-footer">
              <span class="blog-card-author"><i class="bi bi-person-circle" aria-hidden="true"></i>${escapeHtml(post.author || "CS Teacher")}</span>
              ${postDate ? `<time datetime="${escapeHtml(post.date)}">${escapeHtml(postDate)}</time>` : ""}
            </div>
            <span class="blog-read-more">Read article <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
          </div>
        </a>`;
      })
      .join("");
    if (!cards)
      cards = '<div class="blog-empty-state"><i class="bi bi-journal-x" aria-hidden="true"></i><h3>No posts yet</h3><p>Check back soon for new articles and study tips.</p></div>';
    $("#main-content").html(`
      <div class="section-wrap blog-page">
        <div class="container">
          <div class="section-header">
            <span class="blog-eyebrow"><i class="bi bi-journal-richtext" aria-hidden="true"></i> Ideas, guides &amp; insights</span>
            <h2>Blog</h2>
            <p>Study tips, concept breakdowns, and teaching insights.</p>
          </div>
          ${posts.length ? `<div class="blog-results-count">${posts.length} ${posts.length === 1 ? "article" : "articles"}</div><div class="blog-grid">${cards}</div>` : cards}
        </div>
      </div>
    `);
  }

  function showBlogPost(postId) {
    const post = getPosts().find((p) => p.id == postId);
    if (!post) {
      showBlog();
      return;
    }
    const tags = (post.tags || "")
      .split(",")
      .map((t) => `<span class="blog-tag">${t.trim()}</span>`)
      .join("");
    const postImageUrl = /^(https?:\/\/|\/assets\/)/i.test(
      String(post.imageUrl || "").trim(),
    )
      ? String(post.imageUrl).trim()
      : "";
    const escapedPostImageUrl = postImageUrl.replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character];
    });
    $("#main-content").html(`
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="blog.html">Blog</a><span>/</span><strong>${post.title}</strong>
          </div>
          <div class="blog-post-content">
            ${postImageUrl ? `<img class="blog-post-hero" src="${escapedPostImageUrl}" alt="" />` : ""}
            <div class="mb-2">${tags}</div>
            <h1>${post.title}</h1>
            <div class="blog-meta">
              <span><i class="bi bi-person"></i>${post.author || "CS Teacher"}</span>
              <span><i class="bi bi-calendar3"></i>${post.date || ""}</span>
            </div>
            <div class="blog-post-body">${post.content}</div>
            <div class="mt-4">
              <a href="blog.html" class="btn-outline-custom" style="font-size:.85rem;padding:.5rem 1.1rem;">
                <i class="bi bi-arrow-left me-1"></i>Back to Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /* â”€â”€ INIT â”€â”€ */
  const queryParams = new URLSearchParams(window.location.search);
  currentLevel = queryParams.get("level");
  const requestedPage = currentPage;
  const requiredLevelPages = ["cat-hub", "notes", "cat-quiz"];
  if (
    requiredLevelPages.includes(requestedPage) &&
    !Object.prototype.hasOwnProperty.call(CATEGORY_META, currentLevel)
  ) {
    $("#main-content").html(
      '<div class="section-wrap"><div class="container"><p class="alert alert-warning" role="alert">Choose a classroom from the home page to continue.</p><a class="btn btn-primary" href="home.html">Go to Home</a></div></div>',
    );
  } else if (requestedPage === "home") showHome();
  else if (requestedPage === "cat-hub") showCatHub(currentLevel);
  else if (requestedPage === "notes") window.showNotesPage(currentLevel);
  else if (requestedPage === "cat-quiz") showCatQuiz(currentLevel);
  else if (requestedPage === "tutorial") showTutorial();
  else if (requestedPage === "blog") showBlog();
  else if (requestedPage === "blog-post") showBlogPost(queryParams.get("id"));
  else if (requestedPage === "glossary") showGlossary();
  else if (requestedPage === "books") showBooks(queryParams.get("category"));
  else {
    console.error("Unknown page configured in document:", requestedPage);
    $("#main-content").html(
      '<div class="section-wrap"><div class="container"><p class="alert alert-danger" role="alert">This page is not available.</p></div></div>',
    );
  }

  const navPage =
    requestedPage === "blog-post" ? "blog" : requestedPage;
  $('[data-navpage="' + navPage + '"]').addClass("active");

  window.addEventListener("pagehide", function () {
    if (currentPage === "cat-quiz") {
      clearInterval(quizTimerId);
      persistQuizSession();
    }
  });
});
