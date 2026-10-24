// Return the notes-page markup; the feature module wires up its controls.
globalThis.NotesView = {
  render(levelMeta, levelClass) {
    return `
      <div class="notes-app">
        <section class="notes-hero">
          <div class="container">
            <h1>Notes</h1>
            <div class="notes-level-cards">
              <div class="notes-level-display">
                <span class="${levelClass}"></span>
                <strong>${levelMeta.label}</strong>
              </div>
            </div>
          </div>
        </section>
        <section class="layout container">
          <aside class="sidebar" id="sidebar">
            <div class="sidebar-top">
              <div><span class="sidebar-badge" id="sidebar-level-badge">O Level</span></div>
              <button class="sidebar-close" id="sidebar-close" aria-label="Close sidebar">&times;</button>
            </div>
            <div class="sidebar-scroll" id="sidebar-list"></div>
          </aside>
          <section class="content-area">
            <div class="content-control">
              <button class="btn btn-outline-secondary mobile-toggle" id="mobile-sidebar-toggle"><i class="bi bi-list me-2"></i>Topics</button>
              <div class="content-header">
                <div><h2 id="content-title">Decimal number system</h2></div>
                <div class="content-actions">
                  <button class="btn btn-secondary" id="prev-topic"><i class="bi bi-chevron-left me-1"></i>Previous</button>
                  <button class="btn btn-primary" id="next-topic">Next<i class="bi bi-chevron-right ms-1"></i></button>
                </div>
              </div>
            </div>
            <div class="content-breadcrumb" id="notes-breadcrumb"></div>
            <article class="topic-panel"><div id="topic-content"></div></article>
          </section>
        </section>
        <div class="sidebar-overlay" id="sidebar-overlay"></div>
      </div>
    `;
  },

  renderBreadcrumb(level, levelLabel, topicLabel, status, statusDetails) {
    return `
      <div class="breadcrumb-custom">
        <a href="/">Home</a><span>/</span>
        <a href="/classroom?level=${encodeURIComponent(level)}">${CSHtml.escape(levelLabel)}</a><span>/</span>
        <strong>${CSHtml.escape(topicLabel)}</strong>
      </div>
      <div class="topic-status-summary topic-status-summary-${status}">
        <span class="topic-status-badge topic-status-badge-${status}">
          <i class="${statusDetails.icon}" aria-hidden="true"></i>
        </span>
        <span>${statusDetails.label}</span>
      </div>
    `;
  },

  renderPdfUnavailable() {
    return '<div class="topic-unavailable"><p><i class="topic-unavailable-icon" aria-hidden="true"></i>PDF not available yet, Please check back soon for the study notes.</p></div>';
  },

  renderPdfViewer(url, title) {
    return `
      <div class="pdf-viewer-shell">
        <div class="pdf-embed-wrap">
          <iframe class="pdf-embed-frame" src="${CSHtml.escape(url)}" title="${CSHtml.escape(title)} PDF" loading="lazy" allow="fullscreen"></iframe>
        </div>
      </div>
    `;
  },
};
