(function () {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    CSHtml.replaceContents(header, SiteShellView.renderHeader());
  }

  if (footer) {
    CSHtml.replaceContents(footer, SiteShellView.renderFooter());
  }
})();
