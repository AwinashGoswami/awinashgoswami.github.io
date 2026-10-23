(function () {
  // Keep debounce and cancellation state local to the glossary search.
  let searchTimer = null;
  let searchController = null;
  let requestId = 0;

  function render() {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      GlossaryView.renderPage(),
    );
    if (!Array.isArray(GLOSSARY_TERMS) || !GLOSSARY_TERMS.length) {
      $("#glossary-count").text("No glossary entries available.");
      CSHtml.replaceContents(
        document.getElementById("glossary-results"),
        GlossaryView.renderEmptyState(),
      );
      return;
    }
    renderResults("");
  }

  function renderResults(query) {
    const normalized = String(query || "")
      .trim()
      .toLowerCase();
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
    const filtered = GLOSSARY_TERMS.filter(
      (item) =>
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
      CSHtml.replaceContents(
        document.getElementById("glossary-results"),
        GlossaryView.renderNoMatches(),
      );
      return;
    }
    CSHtml.replaceContents(
      document.getElementById("glossary-results"),
      GlossaryView.renderTerms(filtered, formatMatch),
    );
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
            throw new Error(
              `Wikipedia search failed with status ${response.status}.`,
            );
          }
          return response.json();
        })
        .then((data) => {
          if (currentRequest !== requestId) return;
          if (data.error) {
            throw new Error(
              data.error.info || "Wikipedia returned a search error.",
            );
          }
          const queryPages =
            data.query && data.query.pages ? data.query.pages : {};
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
        .catch((error) => {
          if (error.name === "AbortError" || currentRequest !== requestId)
            return;
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
