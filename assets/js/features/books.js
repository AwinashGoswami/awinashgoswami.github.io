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
    const categoryButtons = categories
      .map(
        (item) => `<button
          class="book-filter${item === selectedCategory ? " active" : ""}"
          type="button"
          data-book-category="${CSHtml.escape(item)}"
          aria-pressed="${item === selectedCategory}"
        >${CSHtml.escape(item)}</button>`,
      )
      .join("");
    const bookCards = books
      .map(function (book) {
        const categoriesHtml = book.categories
          .map(
            (item) =>
              `<span class="book-category-tag">${CSHtml.escape(item)}</span>`,
          )
          .join("");
        return `<article class="book-card">
          <div class="book-cover book-cover--${CSHtml.escape(book.coverTheme)}" role="img" aria-label="Illustrated cover for ${CSHtml.escape(book.title)}">
            <span class="book-cover-mark" aria-hidden="true"><i class="bi bi-book-half"></i></span>
            <span class="book-cover-label">${CSHtml.escape(book.coverLabel)}</span>
            <span class="book-cover-title">${CSHtml.escape(book.title)}</span>
            <span class="book-cover-author">${CSHtml.escape(book.author)}</span>
          </div>
          <div class="book-card-body">
            <div class="book-category-tags">${categoriesHtml}</div>
            <h3>${CSHtml.escape(book.title)}</h3>
            <p class="book-author">${CSHtml.escape(book.author)}</p>
            <p class="book-description">${CSHtml.escape(book.description)}</p>
            ${renderLicense(book.license)}
            <div class="book-card-actions">
              <a class="btn btn-primary book-action" href="${CSHtml.escape(book.actionUrl)}" target="_blank" rel="noopener noreferrer">
                <i class="bi ${getActionIcon(book.actionLabel)}" aria-hidden="true"></i>
                ${CSHtml.escape(book.actionLabel)}
              </a>
            </div>
          </div>
        </article>`;
      })
      .join("");

    document.getElementById("main-content").innerHTML = `
      <div class="section-wrap books-page">
        <div class="container">
          <div class="section-header">
            <span class="books-eyebrow"><i class="bi bi-book-half" aria-hidden="true"></i> Open learning library</span>
            <h2>Computer Science Books</h2>
            <p>Browse computer science books with free PDF access from their authors or publishers.</p>
          </div>
          <div class="book-filters" role="group" aria-label="Filter books by category">${categoryButtons}</div>
          <div class="books-results-count" role="status" aria-live="polite">${getResultsMessage(books.length, selectedCategory)}</div>
          ${
            bookCards
              ? `<div class="books-grid">${bookCards}</div>`
              : `<div class="books-empty-state"><i class="bi bi-journal-x" aria-hidden="true"></i><p>No books in this category yet.</p></div>`
          }
          <p class="books-license-note"><i class="bi bi-info-circle" aria-hidden="true"></i> Books remain the property of their authors. Availability and license terms vary; check each official source before reusing or redistributing a book.</p>
        </div>
      </div>
    `;
  }

  function renderLicense(license) {
    if (!license) {
      return "";
    }
    return `<p class="book-license"><i class="bi bi-unlock" aria-hidden="true"></i> ${CSHtml.escape(license)}</p>`;
  }

  function getActionIcon(actionLabel) {
    if (actionLabel.includes("PDF")) {
      return "bi-file-earmark-pdf";
    }
    return "bi-book";
  }

  function getResultsMessage(count, category) {
    const noun = count === 1 ? "book" : "books";
    let message = "Showing " + count + " " + noun;

    if (category !== "All") {
      message += " in " + CSHtml.escape(category);
    }
    return message;
  }

  // Event delegation keeps category buttons working after the list rerenders.
  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-book-category]");
    if (button) render(button.dataset.bookCategory);
  });

  globalThis.BooksFeature = { render };
})();
