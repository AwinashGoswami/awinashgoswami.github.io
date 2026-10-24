import '../data/site-data.js';

(function () {
  const queryParams = new URLSearchParams(window.location.search);
  const currentLevel = queryParams.get('level');
  const target = document.getElementById('classroom-content');

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>\"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getBoardLabel(level) {
    const meta = window.CATEGORY_META && window.CATEGORY_META[level];
    if (!meta) return '';
    let board = '';
    if (level.endsWith('-federal-board')) board = 'Federal Board';
    else if (level.endsWith('-sindh-board')) board = 'Sindh Board';
    return board ? board + ' ' + meta.label : meta.label;
  }

  if (
    !currentLevel ||
    !window.CATEGORY_META ||
    !Object.prototype.hasOwnProperty.call(window.CATEGORY_META, currentLevel)
  ) {
    target.innerHTML = `
      <div class="section-wrap">
        <div class="container">
          <p class="alert alert-warning" role="alert">Choose a classroom from the home page to continue.</p>
          <a class="btn btn-primary" href="/portal">Go to Home</a>
        </div>
      </div>
    `;
  } else {
    const meta = window.CATEGORY_META[currentLevel];
    const label = getBoardLabel(currentLevel);
    target.innerHTML = `
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="/portal">Home</a><span>/</span><strong>${escapeHtml(label)}</strong>
          </div>
          <div class="level-header ${escapeHtml(meta.colorClass || 'o-level')}">
            <div class="level-icon"><i class="bi ${escapeHtml(meta.icon)}" style="font-size:2.5rem;"></i></div>
            <div>
              <h2>${escapeHtml(meta.label)} Computer Science</h2>
              <p>${escapeHtml(meta.desc)}</p>
            </div>
          </div>
          <div class="section-btn-grid">
            <a href="/notes?level=${encodeURIComponent(currentLevel)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-file-earmark-pdf"></i></span>
              <h4>Study Notes</h4><p>Downloadable PDF guides for every topic</p>
            </a>
            <a href="/quiz?level=${encodeURIComponent(currentLevel)}" class="section-btn">
              <span class="sb-icon"><i class="bi bi-patch-question"></i></span>
              <h4>Practice Quiz</h4><p>Multiple-choice questions with instant feedback</p>
            </a>
          </div>
        </div>
      </div>
    `;
  }
})();
