// Keep blog card and article markup separate from post loading behavior.
globalThis.BlogView = {
  safeImageUrl(value) {
    const imageUrl = String(value || "").trim();
    return /^(https?:\/\/|\/assets\/)/i.test(imageUrl)
      ? CSHtml.escape(imageUrl)
      : "";
  },

  renderList(posts) {
    const cards = posts
      .slice()
      .reverse()
      .map((post, index) => {
        const tags = String(post.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 3)
          .map((tag) => `<span class="blog-tag">${CSHtml.escape(tag)}</span>`)
          .join("");
        const excerpt =
          post.excerpt ||
          String(post.content || "")
            .replace(/<[^>]+>/g, "")
            .substring(0, 140) + "…";
        const imageUrl = this.safeImageUrl(post.imageUrl);
        let image = '<span class="blog-cover-placeholder-icon" aria-hidden="true"><i class="bi bi-journal-richtext"></i></span>';
        if (imageUrl) {
          image = `<img src="${imageUrl}" alt="" loading="lazy" />`;
        }
        const postDate = post.date
          ? new Date(`${post.date}T00:00:00`).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";
        const postUrl = "blog-post.html?id=" + encodeURIComponent(post.id);
        const title = CSHtml.escape(post.title);

        return `<a class="blog-card blog-card--theme-${index % 4}" href="${postUrl}" aria-label="Read ${title}">
          <div class="blog-card-cover">
            ${image}
            ${tags ? `<div class="blog-card-tags">${tags}</div>` : ""}
          </div>
          <div class="blog-card-body">
            <h3>${CSHtml.escape(post.title)}</h3>
            <p class="blog-card-excerpt">${CSHtml.escape(excerpt)}</p>
            <div class="blog-card-footer">
              <span class="blog-card-author"><i class="bi bi-person-circle" aria-hidden="true"></i>${CSHtml.escape(post.author || "CS Teacher")}</span>
              ${postDate ? `<time datetime="${CSHtml.escape(post.date)}">${CSHtml.escape(postDate)}</time>` : ""}
            </div>
            <span class="blog-read-more">Read article <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
          </div>
        </a>`;
      })
      .join("");
    const content = cards ||
      '<div class="blog-empty-state"><i class="bi bi-journal-x" aria-hidden="true"></i><h3>No posts yet</h3><p>Check back soon for new articles and study tips.</p></div>';

    return `
      <div class="section-wrap blog-page">
        <div class="container">
          <div class="section-header">
            <span class="blog-eyebrow"><i class="bi bi-journal-richtext" aria-hidden="true"></i> Ideas, guides &amp; insights</span>
            <h2>Blog</h2>
            <p>Study tips, concept breakdowns, and teaching insights.</p>
          </div>
          ${posts.length ? `<div class="blog-results-count">${posts.length} ${posts.length === 1 ? "article" : "articles"}</div><div class="blog-grid">${content}</div>` : content}
        </div>
      </div>
    `;
  },

  renderPost(posts, postId) {
    // Unknown IDs keep the existing fallback to the blog listing.
    const post = posts.find((item) => String(item.id) === String(postId));
    if (!post) {
      return this.renderList(posts);
    }

    const tags = String(post.tags || "")
      .split(",")
      .map((tag) => `<span class="blog-tag">${CSHtml.escape(tag.trim())}</span>`)
      .join("");
    const imageUrl = this.safeImageUrl(post.imageUrl);

    return `
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="blog.html">Blog</a><span>/</span><strong>${CSHtml.escape(post.title)}</strong>
          </div>
          <div class="blog-post-content">
            ${imageUrl ? `<img class="blog-post-hero" src="${imageUrl}" alt="" />` : ""}
            <div class="mb-2">${tags}</div>
            <h1>${CSHtml.escape(post.title)}</h1>
            <div class="blog-meta">
              <span><i class="bi bi-person"></i>${CSHtml.escape(post.author || "CS Teacher")}</span>
              <span><i class="bi bi-calendar3"></i>${CSHtml.escape(post.date || "")}</span>
            </div>
            <div class="blog-post-body">${post.content || ""}</div>
            <div class="mt-4">
              <a href="blog.html" class="btn-outline-custom" style="font-size:.85rem;padding:.5rem 1.1rem;">
                <i class="bi bi-arrow-left me-1"></i>Back to Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
