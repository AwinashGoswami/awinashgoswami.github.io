(function () {
  // Delegate markup to BlogView; this module only loads and selects posts.
  function renderList(posts) {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      BlogView.renderList(posts),
    );
  }

  function renderPost(posts, postId) {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      BlogView.renderPost(posts, postId),
    );
  }

  function init(page, postId) {
    // Show fallback content immediately while the current posts load.
    const render = (posts) => {
      if (page === "blog") renderList(posts);
      else renderPost(posts, postId);
    };
    render(FALLBACK_POSTS);

    fetch("/assets/json/posts.json?v=" + Date.now())
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Blog posts request failed with status ${response.status}.`);
        }
        return response.json();
      })
      .then((posts) => {
        if (!Array.isArray(posts)) {
          throw new Error("Blog posts data must be a JSON array.");
        }
        render(posts.length ? posts : FALLBACK_POSTS);
      })
      .catch((error) => {
        console.error("Unable to load blog posts; showing fallback posts.", error);
        render(FALLBACK_POSTS);
      });
  }

  globalThis.BlogFeature = { init, renderList, renderPost };
})();
