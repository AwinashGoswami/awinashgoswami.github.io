// Keep glossary page markup separate from search and request behavior.
globalThis.GlossaryView = {
  renderPage() {
    return `
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
                <input id="glossary-search" type="search" class="form-control" placeholder="Search a term or definition…" autocomplete="off" aria-describedby="glossary-search-help" />
                <button type="button" class="glossary-clear-search" id="glossary-clear-search" aria-label="Clear search" hidden>
                  <i class="bi bi-x-circle-fill" aria-hidden="true"></i>
                </button>
                <div class="form-text" id="glossary-search-help">Search matches both terms and definitions as you type.</div>
              </div>
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3 glossary-toolbar">
                <div id="glossary-count" class="text-muted" role="status" aria-live="polite">Loading glossary…</div>
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
    `;
  },

  renderEmptyState() {
    return `
      <p class="text-muted">Glossary data could not be loaded right now.</p>
    `;
  },

  renderNoMatches() {
    return `
      <div class="glossary-empty-state">
        <i class="bi bi-search" aria-hidden="true"></i>
        <h3>No matching terms</h3>
        <p>Try a different keyword, or search for a related idea.</p>
        <button class="btn btn-sm btn-primary" type="button" id="glossary-empty-clear">Clear search</button>
      </div>
    `;
  },

  renderTerms(terms, formatMatch) {
    return terms
      .map(
        (item) => `
          <article class="glossary-row">
            <h3 class="glossary-term">${formatMatch(item.term)}</h3>
            <p class="glossary-definition">${formatMatch(item.definition)}</p>
          </article>
        `,
      )
      .join("");
  },
};
