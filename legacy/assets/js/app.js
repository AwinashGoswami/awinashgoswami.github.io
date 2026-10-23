/* 
   CS Study Hub application controller
*/

$(function () {
  // Each HTML page declares its route with a data-page attribute.
  const currentPage = document.body.dataset.page || "home";
  const queryParams = new URLSearchParams(window.location.search);
  const currentLevel = queryParams.get("level");

  // Only classroom, notes, and quiz pages require a valid classroom query.
  const requestedPage = currentPage;
  const requiredLevelPages = ["cat-hub", "notes", "cat-quiz"];
  if (
    requiredLevelPages.includes(requestedPage) &&
    !Object.prototype.hasOwnProperty.call(CATEGORY_META, currentLevel)
  ) {
    CSHtml.renderRouteNotice(
      document.getElementById("main-content"),
      "Choose a classroom from the home page to continue.",
      "warning",
      { href: "home.html", label: "Go to Home" },
    );
  } else {
    switch (requestedPage) {
      case "home":
        HomeFeature.render();
        break;
      case "cat-hub":
        ClassroomFeature.render(currentLevel);
        break;
      case "notes":
        NotesFeature.render(currentLevel);
        break;
      case "cat-quiz":
        QuizFeature.render(currentLevel);
        break;
      case "tutorial":
        TutorialsFeature.render();
        break;
      case "blog":
        BlogFeature.init("blog");
        break;
      case "blog-post":
        BlogFeature.init("blog-post", queryParams.get("id"));
        break;
      case "glossary":
        GlossaryFeature.render();
        break;
      case "books":
        BooksFeature.render(queryParams.get("category"));
        break;
      default:
        console.error("Unknown page configured in document:", requestedPage);
        CSHtml.renderRouteNotice(
          document.getElementById("main-content"),
          "This page is not available.",
          "danger",
        );
    }
  }

  // A blog article belongs to the Blog navigation section.
  const navPage = requestedPage === "blog-post" ? "blog" : requestedPage;
  $('[data-navpage="' + navPage + '"]').addClass("active");

  window.addEventListener("pagehide", function () {
    if (currentPage === "cat-quiz") QuizFeature.persistOnPageHide();
  });
});
