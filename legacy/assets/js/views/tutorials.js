// Keep tutorial-card markup separate from the catalog and page behavior.
globalThis.TutorialsView = {
  render(tutorials) {
    const cards = tutorials
      .map(
        (tutorial) => `<div class="col-md-6 col-lg-4 mb-4">
          <div class="video-card">
            <div class="video-embed-wrap">
              <iframe src="https://www.youtube.com/embed/${tutorial.videoId}" allowfullscreen loading="lazy"></iframe>
            </div>
            <div class="video-card-body">
              <span class="video-tag" style="background:${tutorial.tagColor};color:${tutorial.tagText}">${tutorial.tag}</span>
              <h5>${tutorial.title}</h5>
              <p>${tutorial.desc}</p>
            </div>
          </div>
        </div>`,
      )
      .join("");

    return `
      <div class="section-wrap">
        <div class="container">
          <div class="section-header">
            <h2>Video Tutorials</h2>
            <p>Curated YouTube lessons from top CS educators. Watch directly here or open on YouTube for full-screen.</p>
          </div>
          <div class="row">${cards}</div>
        </div>
      </div>
    `;
  },
};
