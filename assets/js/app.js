/* ═══════════════════════════════════
   CS Study Hub — Application Logic
   Posts are fetched from posts.json and saved back via GitHub API.
   ═══════════════════════════════════ */

$(function () {

  /* ── STATE ── */
  let currentPage    = 'home';
  let currentLevel   = null;
  let loadedPosts    = null;   // populated async from posts.json
  let fcIndex = 0;
  let fcFlipped = false;
  let quizQuestions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  const ADMIN_PASS = 'awinashgoswami';

  /* ── LOAD POSTS from posts.json on startup ── */
  fetch('posts.json?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      loadedPosts = (Array.isArray(data) && data.length) ? data : FALLBACK_POSTS;
    })
    .catch(function () { loadedPosts = FALLBACK_POSTS; });

  function getPosts() { return loadedPosts || FALLBACK_POSTS; }

  /* ── ROUTING ── */
  function navigate(page, opts) {
    opts = opts || {};
    currentPage  = page;
    currentLevel = opts.level || null;
    $('[data-navpage]').removeClass('active');
    $('[data-navpage="' + page + '"]').addClass('active');
    if (page === 'home')             showHome();
    else if (page === 'cat-hub')     showCatHub(currentLevel);
    else if (page === 'cat-notes')   showCatNotes(currentLevel);
    else if (page === 'cat-fc')      showCatFlashcards(currentLevel);
    else if (page === 'cat-quiz')    showCatQuiz(currentLevel);
    else if (page === 'cat-concepts') showCatConcepts(currentLevel);
    else if (page === 'tutorial')    showTutorial();
    else if (page === 'blog')        showBlog();
    else if (page === 'blog-post')   showBlogPost(opts.postId);
    else if (page === 'blog-admin')  showBlogAdmin();
    window.scrollTo(0, 0);
  }

  /* ── NAV CLICKS ── */
  $(document).on('click', '[data-goto]', function (e) {
    e.preventDefault();
    const page   = $(this).data('goto');
    const level  = $(this).data('level');
    const postId = $(this).data('postid');
    const nc = document.getElementById('navbarNav');
    if (nc && nc.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nc).hide();
    navigate(page, { level: level, postId: postId });
  });

  /* ══════════════════════════════════
     HOME
  ═══════════════════════════════════*/
  function showHome() {
    $('#main-content').html(`
      <section class="hero">
        <div class="container">
          <span class="hero-badge">Free Study Resource</span>
          <h1>Master Computer Science<br><span>Without the Burnout</span></h1>
          <p>A free, carefully curated resource built by a passionate CS teacher. Notes, flashcards, quizzes, tutorials, and blog — everything you need to succeed.</p>
          <div class="d-flex flex-wrap gap-3 justify-content-center">
            <a href="#" class="btn-primary-custom" data-goto="cat-hub" data-level="a-level">Browse Resources</a>
            <a href="#" class="btn-outline-custom" data-goto="tutorial">Watch Tutorials</a>
          </div>
        </div>
      </section>
      <section class="feature-grid">
        <div class="container">
          <div class="row g-4">
            <div class="col-sm-6 col-lg-3">
              <div class="feature-card" data-goto="cat-hub" data-level="o-level">
                <div class="feature-icon"><i class="bi bi-mortarboard"></i></div>
                <h5>O Level</h5>
                <p>Foundational CS topics — programming basics, number systems, Boolean logic, and more.</p>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="feature-card" data-goto="cat-hub" data-level="a-level">
                <div class="feature-icon"><i class="bi bi-cpu"></i></div>
                <h5>A Level</h5>
                <p>Advanced algorithms, OOP, computer architecture, networks, and databases.</p>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="feature-card" data-goto="cat-hub" data-level="university">
                <div class="feature-icon"><i class="bi bi-building"></i></div>
                <h5>University</h5>
                <p>Degree-level content — OS, distributed systems, ML, compilers, and advanced theory.</p>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="feature-card" data-goto="tutorial">
                <div class="feature-icon"><i class="bi bi-play-circle"></i></div>
                <h5>Tutorials</h5>
                <p>Curated YouTube video lessons from top CS educators around the world.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `);
  }

  /* ══════════════════════════════════
     CATEGORY HUB
  ═══════════════════════════════════*/
  function showCatHub(level) {
    const meta = CATEGORY_META[level];
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="#" data-goto="home">Home</a><span>/</span><strong>${meta.label}</strong>
          </div>
          <div class="level-header ${meta.colorClass}">
            <div class="level-icon"><i class="bi ${meta.icon}" style="font-size:2.5rem;"></i></div>
            <div>
              <h2>${meta.label} Computer Science</h2>
              <p>${meta.desc}</p>
            </div>
          </div>
          <div class="section-btn-grid">
            <a href="#" class="section-btn" data-goto="cat-notes" data-level="${level}">
              <span class="sb-icon"><i class="bi bi-file-earmark-pdf"></i></span>
              <h4>Study Notes</h4><p>Downloadable PDF guides for every topic</p>
            </a>
            <a href="#" class="section-btn" data-goto="cat-fc" data-level="${level}">
              <span class="sb-icon"><i class="bi bi-layers"></i></span>
              <h4>Flashcards</h4><p>Interactive flip cards for quick revision</p>
            </a>
            <a href="#" class="section-btn" data-goto="cat-quiz" data-level="${level}">
              <span class="sb-icon"><i class="bi bi-patch-question"></i></span>
              <h4>Practice Quiz</h4><p>Multiple-choice questions with instant feedback</p>
            </a>
            <a href="#" class="section-btn" data-goto="cat-concepts" data-level="${level}">
              <span class="sb-icon"><i class="bi bi-book"></i></span>
              <h4>CS Concepts</h4><p>In-depth accordion glossary of key topics</p>
            </a>
          </div>
        </div>
      </div>
    `);
  }

  /* ══════════════════════════════════
     NOTES
  ═══════════════════════════════════*/
  function showCatNotes(level) {
    const meta  = CATEGORY_META[level];
    const notes = CATEGORIES[level].notes;
    let cards = notes.map(function (n) {
      return `
        <div class="col-sm-6 col-lg-4 mb-4">
          <div class="note-card">
            <span class="note-tag">${n.tag}</span>
            <h5>${n.title}</h5>
            <p>${n.desc}</p>
            <div class="note-card-actions">
              <button class="btn-download" data-file="${n.file}" data-title="${n.title}">
                <i class="bi bi-download me-1"></i>Download PDF
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          ${breadcrumb(level, 'Study Notes')}
          <div class="section-header d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h2>${meta.label} — Study Notes</h2>
              <p>Click a PDF to download it, or grab everything at once.</p>
            </div>
            <button class="btn-download-all" id="btn-download-all"
              data-files="${notes.map(n=>n.file).join('|')}"
              data-titles="${notes.map(n=>n.title).join('|')}">
              <i class="bi bi-cloud-download me-1"></i>Download All as ZIP
            </button>
          </div>
          <div class="row">${cards}</div>
        </div>
      </div>
    `);
  }

  /* Single PDF download */
  $(document).on('click', '.btn-download', function () {
    const btn   = $(this);
    const file  = btn.data('file');
    const title = btn.data('title');
    if (btn.hasClass('downloading') || btn.hasClass('done')) return;
    btn.addClass('downloading').html('<span class="spinner-border spinner-border-sm me-1"></span>Downloading…');
    fetch(file)
      .then(function (r) { return r.ok ? r.blob() : null; })
      .then(function (blob) {
        const fileName = file.split('/').pop();
        if (blob && blob.size > 0) {
          saveAs(blob, fileName);
        } else {
          saveAs(new Blob([buildPlaceholderPdf(title)], { type: 'application/pdf' }), fileName);
        }
        btn.removeClass('downloading').addClass('done').html('<i class="bi bi-check-lg me-1"></i>Downloaded');
        setTimeout(function () { btn.removeClass('done').html('<i class="bi bi-download me-1"></i>Download PDF'); }, 3000);
      })
      .catch(function () {
        saveAs(new Blob([buildPlaceholderPdf(title)], { type: 'application/pdf' }), file.split('/').pop());
        btn.removeClass('downloading').addClass('done').html('<i class="bi bi-check-lg me-1"></i>Downloaded');
        setTimeout(function () { btn.removeClass('done').html('<i class="bi bi-download me-1"></i>Download PDF'); }, 3000);
      });
  });

  /* Download All as ZIP */
  $(document).on('click', '#btn-download-all', function () {
    const btn    = $(this);
    const files  = btn.data('files').split('|');
    const titles = btn.data('titles').split('|');
    btn.html('<span class="spinner-border spinner-border-sm me-1"></span>Preparing ZIP…').prop('disabled', true);
    const zip = new JSZip();
    const fetches = files.map(function (file, i) {
      return fetch(file)
        .then(function (r) { return r.ok ? r.blob() : null; })
        .then(function (blob) {
          if (blob && blob.size > 0) {
            return blob.arrayBuffer().then(function (ab) { zip.file(file.split('/').pop(), ab); });
          } else { zip.file(file.split('/').pop(), buildPlaceholderPdf(titles[i])); }
        })
        .catch(function () { zip.file(file.split('/').pop(), buildPlaceholderPdf(titles[i])); });
    });
    Promise.all(fetches).then(function () {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        const label = currentLevel ? CATEGORY_META[currentLevel].label : 'CS';
        saveAs(content, label.replace(/\s+/g, '-').toLowerCase() + '-notes.zip');
        btn.html('<i class="bi bi-check-lg me-1"></i>Downloaded!').prop('disabled', false);
        setTimeout(function () { btn.html('<i class="bi bi-cloud-download me-1"></i>Download All as ZIP'); }, 3000);
      });
    });
  });

  function buildPlaceholderPdf(title) {
    const safe  = title.replace(/[()\\]/g, ' ');
    const stream = 'BT\n/F1 20 Tf\n72 780 Td\n(CS Study Hub) Tj\n0 -30 Td\n/F1 13 Tf\n(' + safe + ') Tj\n0 -40 Td\n/F1 10 Tf\n(Placeholder PDF - Add your content here.) Tj\nET\n';
    const slen = stream.length;
    const h = '%PDF-1.4\n';
    const o1 = '1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n';
    const o2 = '2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n';
    const o3 = '3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n/Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n';
    const o4 = '4 0 obj\n<</Length ' + slen + '>>\nstream\n' + stream + 'endstream\nendobj\n';
    const o5 = '5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n';
    let off = h.length, offsets = [];
    [o1,o2,o3,o4,o5].forEach(function(o){ offsets.push(off); off += o.length; });
    let xref = 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach(function(o){ xref += String(o).padStart(10,'0') + ' 00000 n \n'; });
    return h + o1 + o2 + o3 + o4 + o5 + xref + 'trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n' + off + '\n%%EOF\n';
  }

  /* ══════════════════════════════════
     FLASHCARDS
  ═══════════════════════════════════*/
  function showCatFlashcards(level) {
    const meta  = CATEGORY_META[level];
    fcIndex = 0; fcFlipped = false;
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container" style="max-width:640px;">
          ${breadcrumb(level, 'Flashcards')}
          <div class="section-header">
            <h2>${meta.label} — Flashcards</h2>
            <p>Click a card to flip it and reveal the answer.</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span id="fc-counter" class="card-counter"></span>
            <button id="fc-restart" class="btn-nav" style="font-size:.78rem;padding:.3rem .9rem;"><i class="bi bi-arrow-counterclockwise me-1"></i>Restart</button>
          </div>
          <div class="card-progress mb-3"><div class="card-progress-bar" id="fc-progress-bar"></div></div>
          <div class="flashcard-wrap" id="fc-wrap">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <span class="flashcard-label">Question</span>
                <p class="flashcard-text" id="fc-front-text"></p>
                <span class="flashcard-hint">Click to flip</span>
              </div>
              <div class="flashcard-back">
                <span class="flashcard-label" style="opacity:.5;">Answer</span>
                <p class="flashcard-text" id="fc-back-text"></p>
                <span class="flashcard-hint">Click to flip back</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn-nav" id="fc-prev"><i class="bi bi-chevron-left me-1"></i>Previous</button>
            <button class="btn-nav" id="fc-next">Next<i class="bi bi-chevron-right ms-1"></i></button>
          </div>
        </div>
      </div>
    `);
    renderFlashcard(CATEGORIES[level].flashcards);
  }

  function renderFlashcard(cards) {
    const c   = cards[fcIndex];
    const pct = ((fcIndex + 1) / cards.length * 100).toFixed(0);
    fcFlipped = false;
    $('#fc-wrap').removeClass('flipped');
    $('#fc-front-text').text(c.q);
    $('#fc-back-text').text(c.a);
    $('#fc-counter').text('Card ' + (fcIndex + 1) + ' of ' + cards.length);
    $('#fc-progress-bar').css('width', pct + '%');
    $('#fc-prev').prop('disabled', fcIndex === 0);
    $('#fc-next').prop('disabled', fcIndex === cards.length - 1);
  }

  $(document).on('click', '#fc-wrap', function () { fcFlipped = !fcFlipped; $(this).toggleClass('flipped', fcFlipped); });
  $(document).on('click', '#fc-prev', function () { if (fcIndex > 0) { fcIndex--; renderFlashcard(CATEGORIES[currentLevel].flashcards); } });
  $(document).on('click', '#fc-next', function () { const c = CATEGORIES[currentLevel].flashcards; if (fcIndex < c.length - 1) { fcIndex++; renderFlashcard(c); } });
  $(document).on('click', '#fc-restart', function () { fcIndex = 0; renderFlashcard(CATEGORIES[currentLevel].flashcards); });

  /* ══════════════════════════════════
     QUIZ
  ═══════════════════════════════════*/
  function showCatQuiz(level) {
    const meta = CATEGORY_META[level];
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          ${breadcrumb(level, 'Quiz')}
          <div class="section-header d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h2>${meta.label} — Practice Quiz</h2>
              <p>One question at a time. Instant feedback. Track your score.</p>
            </div>
            <button class="btn-restart" id="quiz-restart-top"><i class="bi bi-arrow-counterclockwise me-1"></i>Restart</button>
          </div>
          <div id="quiz-body">
            <div class="quiz-card">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="quiz-progress-label" id="quiz-q-label"></span>
                <span class="quiz-score-badge" id="quiz-score-badge">Score: 0 / 0</span>
              </div>
              <div class="quiz-progress mb-4"><div class="quiz-progress-bar" id="quiz-progress-bar" style="width:0%"></div></div>
              <p class="quiz-question" id="quiz-question"></p>
              <div id="quiz-options"></div>
              <div class="quiz-feedback" id="quiz-feedback"></div>
              <div class="text-end"><button class="btn-next" id="quiz-next" style="display:none;">Next Question <i class="bi bi-arrow-right ms-1"></i></button></div>
            </div>
          </div>
          <div class="quiz-card quiz-result" id="quiz-result" style="display:none;">
            <div class="score-big" id="quiz-result-score"></div>
            <h3>Quiz Complete!</h3>
            <p id="quiz-result-pct"></p>
            <button class="btn-primary-custom" id="quiz-restart-end"><i class="bi bi-arrow-counterclockwise me-1"></i>Try Again</button>
          </div>
        </div>
      </div>
    `);
    startQuiz(level);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i+1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function startQuiz(level) {
    quizQuestions = shuffle(CATEGORIES[level || currentLevel].quiz);
    quizIndex = 0; quizScore = 0; quizAnswered = false;
    $('#quiz-result').hide(); $('#quiz-body').show();
    renderQuestion();
  }

  function renderQuestion() {
    const q   = quizQuestions[quizIndex];
    quizAnswered = false;
    $('#quiz-progress-bar').css('width', (quizIndex / quizQuestions.length * 100).toFixed(0) + '%');
    $('#quiz-q-label').text('Question ' + (quizIndex + 1) + ' of ' + quizQuestions.length);
    $('#quiz-score-badge').text('Score: ' + quizScore + ' / ' + quizIndex);
    $('#quiz-question').text(q.q);
    $('#quiz-feedback').hide().removeClass('correct incorrect').text('');
    $('#quiz-next').hide();
    const wrap = $('#quiz-options').empty();
    q.opts.forEach(function (opt, i) {
      wrap.append('<button class="quiz-option" data-idx="' + i + '">' + String.fromCharCode(65+i) + '. ' + opt + '</button>');
    });
  }

  $(document).on('click', '.quiz-option', function () {
    if (quizAnswered) return;
    quizAnswered = true;
    const chosen  = parseInt($(this).data('idx'));
    const correct = quizQuestions[quizIndex].ans;
    $('.quiz-option').prop('disabled', true);
    if (chosen === correct) { quizScore++; $(this).addClass('correct'); $('#quiz-feedback').addClass('correct').text('Correct!').show(); }
    else { $(this).addClass('incorrect'); $('[data-idx="' + correct + '"]').addClass('correct'); $('#quiz-feedback').addClass('incorrect').text('Incorrect — correct answer: ' + String.fromCharCode(65+correct) + '.').show(); }
    $('#quiz-score-badge').text('Score: ' + quizScore + ' / ' + (quizIndex + 1));
    $('#quiz-next').show();
  });

  $(document).on('click', '#quiz-next', function () {
    quizIndex++;
    if (quizIndex >= quizQuestions.length) {
      const pct = Math.round(quizScore / quizQuestions.length * 100);
      const msg = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort — keep revising!' : 'Keep studying — you\'ve got this!';
      $('#quiz-result-score').text(quizScore + '/' + quizQuestions.length);
      $('#quiz-result-pct').text(pct + '% — ' + msg);
      $('#quiz-body').hide(); $('#quiz-result').show();
    } else { renderQuestion(); }
  });

  $(document).on('click', '#quiz-restart-top, #quiz-restart-end', function () { startQuiz(); });

  /* ══════════════════════════════════
     CONCEPTS
  ═══════════════════════════════════*/
  function showCatConcepts(level) {
    const meta     = CATEGORY_META[level];
    const concepts = CATEGORIES[level].concepts;
    let items = concepts.map(function (c, i) {
      const id = 'concept-' + i + '-' + level;
      return `<div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button ${i===0?'':'collapsed'}" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}">${c.title}</button>
        </h2>
        <div id="${id}" class="accordion-collapse collapse ${i===0?'show':''}">
          <div class="accordion-body">${c.body}</div>
        </div>
      </div>`;
    }).join('');
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container" style="max-width:760px;">
          ${breadcrumb(level, 'Concepts')}
          <div class="section-header">
            <h2>${meta.label} — CS Concepts</h2>
            <p>Click any heading to expand the full explanation.</p>
          </div>
          <div class="accordion">${items}</div>
        </div>
      </div>
    `);
  }

  /* ══════════════════════════════════
     TUTORIAL
  ═══════════════════════════════════*/
  function showTutorial() {
    let cards = TUTORIALS.map(function (v) {
      return `<div class="col-md-6 col-lg-4 mb-4">
        <div class="video-card">
          <div class="video-embed-wrap">
            <iframe src="https://www.youtube.com/embed/${v.videoId}" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="video-card-body">
            <span class="video-tag" style="background:${v.tagColor};color:${v.tagText}">${v.tag}</span>
            <h5>${v.title}</h5>
            <p>${v.desc}</p>
          </div>
        </div>
      </div>`;
    }).join('');
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          <div class="section-header">
            <h2>Video Tutorials</h2>
            <p>Curated YouTube lessons from top CS educators. Watch directly here or open on YouTube for full-screen.</p>
          </div>
          <div class="row">${cards}</div>
        </div>
      </div>
    `);
  }

  /* ══════════════════════════════════
     BLOG
  ═══════════════════════════════════*/
  function showBlog() {
    const posts = getPosts();
    let cards = posts.slice().reverse().map(function (p) {
      const tags    = (p.tags || '').split(',').map(t => `<span class="blog-tag">${t.trim()}</span>`).join('');
      const excerpt = p.excerpt || p.content.replace(/<[^>]+>/g,'').substring(0, 140) + '…';
      return `<div class="blog-card" data-goto="blog-post" data-postid="${p.id}">
        <div class="mb-2">${tags}</div>
        <h4>${p.title}</h4>
        <p>${excerpt}</p>
        <div class="blog-meta">
          <span><i class="bi bi-person"></i>${p.author || 'CS Teacher'}</span>
          <span><i class="bi bi-calendar3"></i>${p.date || ''}</span>
        </div>
      </div>`;
    }).join('');
    if (!cards) cards = '<p class="text-muted">No posts yet. Check back soon.</p>';
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container" style="max-width:760px;">
          <div class="section-header">
            <h2>Blog</h2>
            <p>Study tips, concept breakdowns, and teaching insights.</p>
          </div>
          ${cards}
        </div>
      </div>
    `);
  }

  function showBlogPost(postId) {
    const post = getPosts().find(p => p.id == postId);
    if (!post) { showBlog(); return; }
    const tags = (post.tags || '').split(',').map(t => `<span class="blog-tag">${t.trim()}</span>`).join('');
    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="#" data-goto="blog">Blog</a><span>/</span><strong>${post.title}</strong>
          </div>
          <div class="blog-post-content">
            <div class="mb-2">${tags}</div>
            <h1>${post.title}</h1>
            <div class="blog-meta">
              <span><i class="bi bi-person"></i>${post.author || 'CS Teacher'}</span>
              <span><i class="bi bi-calendar3"></i>${post.date || ''}</span>
            </div>
            <div class="blog-post-body">${post.content}</div>
            <div class="mt-4">
              <a href="#" class="btn-outline-custom" data-goto="blog" style="font-size:.85rem;padding:.5rem 1.1rem;">
                <i class="bi bi-arrow-left me-1"></i>Back to Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /* ══════════════════════════════════
     BLOG ADMIN
  ═══════════════════════════════════*/
  function showBlogAdmin() {
    if (sessionStorage.getItem('cs_admin') !== '1') {
      $('#main-content').html(`
        <div class="section-wrap">
          <div class="container">
            <div class="admin-login">
              <i class="bi bi-shield-lock" style="font-size:2.5rem;color:var(--primary);margin-bottom:1rem;display:block;"></i>
              <h4>Admin Login</h4>
              <p class="text-muted mb-3" style="font-size:.88rem;">Enter your password to access the blog admin panel.</p>
              <input type="password" id="admin-pass-input" class="form-control mb-3" placeholder="Password" />
              <div id="admin-pass-error" class="text-danger mb-2" style="font-size:.83rem;display:none;">Incorrect password.</div>
              <button class="btn-primary-custom w-100" id="admin-login-btn">Sign In</button>
            </div>
          </div>
        </div>
      `);
      return;
    }
    renderAdminPanel();
  }

  $(document).on('click', '#admin-login-btn', function () {
    if ($('#admin-pass-input').val() === ADMIN_PASS) {
      sessionStorage.setItem('cs_admin', '1');
      renderAdminPanel();
    } else { $('#admin-pass-error').show(); }
  });
  $(document).on('keydown', '#admin-pass-input', function (e) { if (e.key === 'Enter') $('#admin-login-btn').trigger('click'); });

  /* ── GitHub settings helpers ── */
  function ghSettings() {
    return {
      owner:  sessionStorage.getItem('gh_owner')  || '',
      repo:   sessionStorage.getItem('gh_repo')   || '',
      branch: sessionStorage.getItem('gh_branch') || 'main',
      token:  sessionStorage.getItem('gh_token')  || ''
    };
  }
  function ghConfigured() {
    const s = ghSettings();
    return s.owner && s.repo && s.token;
  }

  /* ── Publish to GitHub repo via API ── */
  async function publishToGitHub(posts, title) {
    const s = ghSettings();
    const apiUrl = 'https://api.github.com/repos/' + s.owner + '/' + s.repo + '/contents/posts.json';
    const headers = {
      'Authorization': 'Bearer ' + s.token,
      'Accept':        'application/vnd.github+json',
      'Content-Type':  'application/json'
    };

    // Get current file SHA (needed for update)
    let sha = null;
    const getResp = await fetch(apiUrl + '?ref=' + s.branch, { headers });
    if (getResp.ok) {
      const data = await getResp.json();
      sha = data.sha;
    }

    // Encode JSON as base64 (handle Unicode)
    const jsonStr  = JSON.stringify(posts, null, 2);
    const encoded  = btoa(unescape(encodeURIComponent(jsonStr)));

    const body = { message: 'Blog: ' + title, content: encoded, branch: s.branch };
    if (sha) body.sha = sha;

    const putResp = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!putResp.ok) {
      const err = await putResp.json();
      throw new Error(err.message || 'GitHub API error (' + putResp.status + ')');
    }
  }

  function renderAdminPanel() {
    const posts = getPosts();
    const cfg   = ghSettings();
    const ghConfigured = cfg.owner && cfg.repo && cfg.token;

    const postList = posts.length
      ? posts.slice().reverse().map(p =>
        `<div class="d-flex justify-content-between align-items-center py-2 border-bottom gap-2">
          <span style="font-size:.88rem;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.title}</span>
          <button class="btn btn-sm btn-outline-danger flex-shrink-0" data-deleteid="${p.id}"><i class="bi bi-trash"></i></button>
        </div>`).join('')
      : '<p class="text-muted" style="font-size:.88rem;">No posts yet.</p>';

    const ghBadge = ghConfigured
      ? `<span class="badge bg-success"><i class="bi bi-github me-1"></i>${cfg.owner}/${cfg.repo}</span>`
      : `<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle me-1"></i>GitHub not configured</span>`;

    const ghBtnLabel = ghConfigured ? 'Update GitHub Settings' : 'Connect GitHub Repo';

    $('#main-content').html(`
      <div class="section-wrap">
        <div class="container">
          <div class="breadcrumb-custom">
            <a href="#" data-goto="blog">Blog</a><span>/</span><strong>Admin Panel</strong>
          </div>

          <!-- GitHub settings card -->
          <div class="admin-card mb-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 class="mb-0"><i class="bi bi-github me-2"></i>GitHub Connection</h3>
              ${ghBadge}
            </div>
            <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1rem;">
              Posts are saved as <code>posts.json</code> in your GitHub repo so every visitor sees them.
              Enter your repo details and a <a href="https://github.com/settings/tokens/new?scopes=repo&description=CS+Study+Hub" target="_blank">Personal Access Token</a>
              (scopes: <code>repo</code>). These are stored only in this browser session — never committed to code.
            </p>
            <div class="row g-3">
              <div class="col-sm-4">
                <label class="form-label">GitHub Username</label>
                <input type="text" class="form-control" id="gh-owner" value="${cfg.owner}" placeholder="your-username" />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Repository Name</label>
                <input type="text" class="form-control" id="gh-repo" value="${cfg.repo}" placeholder="cs-study-hub" />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Branch</label>
                <input type="text" class="form-control" id="gh-branch" value="${cfg.branch}" placeholder="main" />
              </div>
              <div class="col-12">
                <label class="form-label">Personal Access Token <span style="font-weight:400;opacity:.6;">(stored in session only, never saved in code)</span></label>
                <input type="password" class="form-control" id="gh-token" value="${cfg.token}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="new-password" />
              </div>
              <div class="col-12">
                <button class="btn-primary-custom" id="btn-save-gh">${ghBtnLabel}</button>
                <span id="gh-save-msg" class="ms-3 text-success" style="font-size:.85rem;display:none;"></span>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <!-- New post -->
            <div class="col-lg-7">
              <div class="admin-card">
                <h3><i class="bi bi-pencil-square me-2"></i>New Post</h3>
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" id="post-title" placeholder="Post title…" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Excerpt <span style="font-weight:400;opacity:.6;">(short summary shown on blog list)</span></label>
                  <input type="text" class="form-control" id="post-excerpt" placeholder="One or two sentences…" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Content <span style="font-weight:400;opacity:.6;">(HTML supported: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;)</span></label>
                  <textarea class="form-control" id="post-content" rows="9" placeholder="Write your post…"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tags <span style="font-weight:400;opacity:.6;">(comma-separated)</span></label>
                  <input type="text" class="form-control" id="post-tags" placeholder="e.g. Algorithms, Study Tips" />
                </div>
                <div id="post-save-msg" class="mb-2" style="font-size:.85rem;display:none;"></div>
                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn-primary-custom" id="btn-publish-post">
                    <i class="bi bi-github me-1"></i>Publish to GitHub
                  </button>
                  <button class="btn-restart" id="btn-admin-logout"><i class="bi bi-box-arrow-right me-1"></i>Sign Out</button>
                </div>
              </div>
            </div>

            <!-- Post list -->
            <div class="col-lg-5">
              <div class="admin-card">
                <h3><i class="bi bi-list-ul me-2"></i>All Posts</h3>
                <div id="admin-post-list">${postList}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /* Save GitHub settings to sessionStorage */
  $(document).on('click', '#btn-save-gh', function () {
    sessionStorage.setItem('gh_owner',  $('#gh-owner').val().trim());
    sessionStorage.setItem('gh_repo',   $('#gh-repo').val().trim());
    sessionStorage.setItem('gh_branch', $('#gh-branch').val().trim() || 'main');
    sessionStorage.setItem('gh_token',  $('#gh-token').val().trim());
    $('#gh-save-msg').text('Settings saved for this session.').show();
    setTimeout(function () { $('#gh-save-msg').hide(); }, 3000);
  });

  /* Publish post */
  $(document).on('click', '#btn-publish-post', async function () {
    const title   = $('#post-title').val().trim();
    const excerpt = $('#post-excerpt').val().trim();
    const content = $('#post-content').val().trim();
    const tags    = $('#post-tags').val().trim();

    if (!title || !content) { alert('Please fill in at least the title and content.'); return; }

    if (!ghConfigured()) {
      alert('Please fill in and save your GitHub settings above before publishing.');
      return;
    }

    const btn = $(this);
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Publishing…');
    $('#post-save-msg').hide();

    const newPost = {
      id:      Date.now(),
      title,
      excerpt,
      content,
      tags,
      author:  'CS Teacher',
      date:    new Date().toISOString().slice(0, 10)
    };

    const posts = getPosts();
    posts.push(newPost);

    try {
      await publishToGitHub(posts, title);
      loadedPosts = posts;
      $('#post-title, #post-excerpt, #post-content, #post-tags').val('');
      $('#post-save-msg')
        .removeClass('text-danger').addClass('text-success')
        .html('<i class="bi bi-check-circle me-1"></i>Published! GitHub Pages will update in ~1 minute.')
        .show();

      // Refresh post list in panel
      const listHtml = posts.slice().reverse().map(p =>
        `<div class="d-flex justify-content-between align-items-center py-2 border-bottom gap-2">
          <span style="font-size:.88rem;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.title}</span>
          <button class="btn btn-sm btn-outline-danger flex-shrink-0" data-deleteid="${p.id}"><i class="bi bi-trash"></i></button>
        </div>`).join('');
      $('#admin-post-list').html(listHtml);

    } catch (err) {
      $('#post-save-msg')
        .removeClass('text-success').addClass('text-danger')
        .html('<i class="bi bi-x-circle me-1"></i>Error: ' + err.message)
        .show();
    }

    btn.prop('disabled', false).html('<i class="bi bi-github me-1"></i>Publish to GitHub');
  });

  /* Delete post — also commits updated posts.json to GitHub */
  $(document).on('click', '[data-deleteid]', async function () {
    const id  = $(this).data('deleteid');
    const row = $(this).closest('.d-flex');
    if (!confirm('Delete this post? This will update your GitHub repo.')) return;

    const posts = getPosts().filter(p => p.id != id);
    loadedPosts = posts;
    row.remove();

    if (ghConfigured()) {
      try { await publishToGitHub(posts, 'Delete post ' + id); }
      catch (e) { console.warn('GitHub delete sync failed:', e.message); }
    }
  });

  $(document).on('click', '#btn-admin-logout', function () {
    sessionStorage.removeItem('cs_admin');
    navigate('blog');
  });

  /* ── UTIL ── */
  function breadcrumb(level, section) {
    const meta = CATEGORY_META[level] || {};
    return `<div class="breadcrumb-custom">
      <a href="#" data-goto="home">Home</a><span>/</span>
      <a href="#" data-goto="cat-hub" data-level="${level}">${meta.label || level}</a>
      <span>/</span><strong>${section}</strong>
    </div>`;
  }

  /* ── INIT ── */
  navigate('home');

});
