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
    $("#main-content").html(
      '<div class="section-wrap"><div class="container"><p class="alert alert-warning" role="alert">Choose a classroom from the home page to continue.</p><a class="btn btn-primary" href="home.html">Go to Home</a></div></div>',
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
        $("#main-content").html(
          '<div class="section-wrap"><div class="container"><p class="alert alert-danger" role="alert">This page is not available.</p></div></div>',
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
