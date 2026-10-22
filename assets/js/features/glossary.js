(function () {
  // Keep debounce and cancellation state local to the glossary search.
  let searchTimer = null;
  let searchController = null;
  let requestId = 0;

  function render() {
    document.getElementById("main-content").innerHTML = `
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
    if (!Array.isArray(GLOSSARY_TERMS) || !GLOSSARY_TERMS.length) {
      $("#glossary-count").text("No glossary entries available.");
      $("#glossary-results").html(
        '<p class="text-muted">Glossary data could not be loaded right now.</p>',
      );
      return;
    }
    renderResults("");
  }

  function renderResults(query) {
    const normalized = String(query || "").trim().toLowerCase();
    const formatMatch = function (value) {
      const text = String(value);
      if (!normalized) return CSHtml.escape(text);
      const escapedQuery = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matcher = new RegExp(`(${escapedQuery})`, "gi");
      return text
        .split(matcher)
        .map((part) =>
          part.toLowerCase() === normalized
            ? `<mark>${CSHtml.escape(part)}</mark>`
            : CSHtml.escape(part),
        )
        .join("");
    };
    const filtered = GLOSSARY_TERMS.filter((item) =>
      item.term.toLowerCase().includes(normalized) ||
      item.definition.toLowerCase().includes(normalized),
    );
    let countText = filtered.length + " total term";
    if (filtered.length !== 1) {
      countText += "s";
    }
    if (normalized) {
      countText =
        filtered.length +
        " term" +
        (filtered.length === 1 ? "" : "s") +
        ' matching "' +
        query +
        '"';
    }
    $("#glossary-count").text(countText);
    $("#glossary-clear-search").prop("hidden", !normalized);
    if (!filtered.length) {
      $("#glossary-results").html(`
        <div class="glossary-empty-state">
          <i class="bi bi-search" aria-hidden="true"></i>
          <h3>No matching terms</h3>
          <p>Try a different keyword, or search for a related idea.</p>
          <button class="btn btn-sm btn-primary" type="button" id="glossary-empty-clear">Clear search</button>
        </div>
      `);
      return;
    }
    $("#glossary-results").html(filtered.map((item) => `
      <article class="glossary-row">
        <h3 class="glossary-term">${formatMatch(item.term)}</h3>
        <p class="glossary-definition">${formatMatch(item.definition)}</p>
      </article>
    `).join(""));
  }

  function searchExternal(query) {
    const searchTerm = String(query || "").trim();
    const $section = $("#glossary-external-section");
    // Abort older requests and ignore their results if they finish late.
    const currentRequest = ++requestId;
    if (searchController) {
      searchController.abort();
      searchController = null;
    }
    clearTimeout(searchTimer);

    if (searchTerm.length < 3) {
      $section.prop("hidden", true);
      return;
    }

    $section.prop("hidden", false);
    $("#glossary-external-status").text("Searching Wikipedia…");
    $("#glossary-external-results").empty();
    searchTimer = setTimeout(function () {
      searchController = new AbortController();
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
        signal: searchController.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Wikipedia search failed with status ${response.status}.`);
          }
          return response.json();
        })
        .then((data) => {
          if (currentRequest !== requestId) return;
          if (data.error) {
            throw new Error(data.error.info || "Wikipedia returned a search error.");
          }
          const queryPages = data.query && data.query.pages
            ? data.query.pages
            : {};
          const pages = Object.values(queryPages).sort(
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
          results.forEach((page) => {
            const $link = $("<a>")
              .attr({
                href: page.fullurl,
                target: "_blank",
                rel: "noopener noreferrer",
              })
              .text(page.title);
            const $article = $("<article>").addClass("glossary-external-result");
            $("<h4>").append($link).appendTo($article);
            $("<p>").text(page.extract.trim()).appendTo($article);
            $results.append($article);
          });
          $("#glossary-external-status").text(
            `${results.length} related article${results.length === 1 ? "" : "s"} found.`,
          );
        })
        .catch((error) => {
          if (error.name === "AbortError" || currentRequest !== requestId) return;
          console.error("Wikipedia glossary search failed:", error);
          $("#glossary-external-status").text(
            "Wikipedia search is unavailable right now. Your curated glossary is still available.",
          );
        });
    }, 400);
  }

  $(document).on("input", "#glossary-search", function () {
    const query = $(this).val();
    renderResults(query);
    searchExternal(query);
  });
  $(document).on(
    "click",
    "#glossary-clear-search, #glossary-empty-clear",
    function () {
      $("#glossary-search").val("").trigger("input").trigger("focus");
    },
  );
  $(document).on("click", "#glossary-show-all", function () {
    $("#glossary-search").val("").trigger("input");
  });

  globalThis.GlossaryFeature = { render };
})();
