globalThis.CSHtml = {
  // Escape text before inserting it into an HTML string.
  escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character];
    });
  },

  // Parse a view's markup as a template, then replace the target's children.
  replaceContents(target, markup) {
    const template = document.createElement("template");
    template.innerHTML = markup;
    target.replaceChildren(template.content.cloneNode(true));
  },

  renderRouteNotice(target, message, severity, link) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-wrap";

    const container = document.createElement("div");
    container.className = "container";

    const alert = document.createElement("p");
    alert.className = `alert alert-${severity}`;
    alert.setAttribute("role", "alert");
    alert.textContent = message;
    container.appendChild(alert);

    if (link) {
      const anchor = document.createElement("a");
      anchor.className = "btn btn-primary";
      anchor.href = link.href;
      anchor.textContent = link.label;
      container.appendChild(anchor);
    }

    wrapper.appendChild(container);
    target.replaceChildren(wrapper);
  },
};
