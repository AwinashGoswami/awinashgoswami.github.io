(function () {
  // Render tutorial cards from the catalog in data/tutorials.js.
  function render() {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      TutorialsView.render(TUTORIALS),
    );
  }

  globalThis.TutorialsFeature = { render };
})();
