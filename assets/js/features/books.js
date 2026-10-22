(function () {
  // Build the category filters and matching book cards for the page.
  function render(category) {
    const selectedCategory = category || "All";
    const categories = ["All"].concat(BOOK_CATEGORIES);
    let books = BOOKS;
    if (selectedCategory !== "All") {
      books = BOOKS.filter((book) =>
        book.categories.includes(selectedCategory),
      );
    }
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      BooksView.render(selectedCategory, categories, books),
    );
  }

  // Event delegation keeps category buttons working after the list rerenders.
  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-book-category]");
    if (button) render(button.dataset.bookCategory);
  });

  globalThis.BooksFeature = { render };
})();
