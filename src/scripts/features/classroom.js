(function () {
  function render(level) {
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      ClassroomView.render(level),
    );
  }

  globalThis.ClassroomFeature = {
    breadcrumb: ClassroomView.breadcrumb.bind(ClassroomView),
    render,
  };
})();
