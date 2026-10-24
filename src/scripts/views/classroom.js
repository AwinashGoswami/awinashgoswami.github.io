// Classroom pages share their breadcrumb and layout markup.
globalThis.ClassroomView = {
  label(level) {
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
  },

  breadcrumb(level, title) {
    return `<div class="breadcrumb-custom">
      <a href="/">Home</a><span>/</span>
      <a href="/classroom?level=${encodeURIComponent(level)}">${CSHtml.escape(this.label(level))}</a><span>/</span>
      <strong>${CSHtml.escape(title)}</strong>
    </div>`;
  },

  render(level) {
    const meta = CATEGORY_META[level];
    return `
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="/">Home</a><span>/</span><strong>${CSHtml.escape(this.label(level))}</strong>
          </div>
          <div class="level-header ${CSHtml.escape(meta.colorClass)}">
            <div class="level-icon"><i class="bi ${CSHtml.escape(meta.icon)}" style="font-size:2.5rem;"></i></div>
            <div>
              <h2>${CSHtml.escape(meta.label)} Computer Science</h2>
              <p>${CSHtml.escape(meta.desc)}</p>
            </div>
          </div>
          <div class="section-btn-grid">
            <a href="/notes?level=${encodeURIComponent(level)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-file-earmark-pdf"></i></span>
              <h4>Study Notes</h4><p>Downloadable PDF guides for every topic</p>
            </a>
            <a href="/quiz?level=${encodeURIComponent(level)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-patch-question"></i></span>
              <h4>Practice Quiz</h4><p>Multiple-choice questions with instant feedback</p>
            </a>
          </div>
        </div>
      </div>
    `;
  },
};
