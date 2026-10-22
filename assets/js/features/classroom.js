(function () {
  // Board names are part of the classroom label on breadcrumbs.
  function label(level) {
    const meta = CATEGORY_META[level];
    let board = "";

    if (level.endsWith("-federal-board")) {
      board = "Federal Board";
    } else if (level.endsWith("-sindh-board")) {
      board = "Sindh Board";
    }

    if (!board) {
      return meta.label;
    }

    return board + " " + meta.label;
  }

  // Shared breadcrumb for the classroom and its quiz page.
  function breadcrumb(level, title) {
    return `<div class="breadcrumb-custom">
      <a href="home.html">Home</a><span>/</span>
      <a href="classroom.html?level=${encodeURIComponent(level)}">${label(level)}</a><span>/</span>
      <strong>${title}</strong>
    </div>`;
  }

  // Render the selected classroom's links to notes and quizzes.
  function render(level) {
    const meta = CATEGORY_META[level];
    document.getElementById("main-content").innerHTML = `
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="home.html">Home</a><span>/</span><strong>${label(level)}</strong>
          </div>
          <div class="level-header ${meta.colorClass}">
            <div class="level-icon"><i class="bi ${meta.icon}" style="font-size:2.5rem;"></i></div>
            <div>
              <h2>${meta.label} Computer Science</h2>
              <p>${meta.desc}</p>
            </div>
          </div>
          <div class="section-btn-grid">
            <a href="notes.html?level=${encodeURIComponent(level)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-file-earmark-pdf"></i></span>
              <h4>Study Notes</h4><p>Downloadable PDF guides for every topic</p>
            </a>
            <a href="quiz.html?level=${encodeURIComponent(level)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-patch-question"></i></span>
              <h4>Practice Quiz</h4><p>Multiple-choice questions with instant feedback</p>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  globalThis.ClassroomFeature = { breadcrumb, render };
})();
