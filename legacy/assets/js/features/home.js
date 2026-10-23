(function () {
  function render() {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      HomeView.render(),
    );
  }

  globalThis.HomeFeature = { render };
})();
