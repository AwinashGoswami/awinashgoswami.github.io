(function () {
  // Quiz state is kept in this module so other pages cannot change it.
  let quizQuestions = [];
  let quizIndex = 0;
  let quizPage = 0;
  let quizScore = 0;
  let quizResponses = [];
  let quizAnswered = false;
  let quizSelectedIndex = null;
  let quizLevel = null;
  let quizStudentName = "";
  let quizFatherName = "";
  let quizStartedAt = null;
  let quizCompletionStatus = "completed";
  let quizTimerId = null;
  let quizTimeRemaining = 0;
  let quizPaused = false;
  let quizAudioCtx = null;
  let quizAudioCompressor = null;
  const QUIZ_PAGE_SIZE = 10;
  const QUIZ_SECONDS_PER_QUESTION = 30;
  const QUIZ_ORDER_VERSION = 2;

  // Create the quiz form, question area, and report-card containers.
  function render(level) {
    const meta = CATEGORY_META[level];
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      QuizView.render(
        meta.label,
        ClassroomFeature.breadcrumb(level, "Quiz"),
      ),
    );
    startQuiz(level);
  }

  function startQuiz(level) {
    clearInterval(quizTimerId);
    quizLevel = level || quizLevel;
    const sourceQuestions = QUIZZES[quizLevel] || [];
    if (!sourceQuestions.length) {
      CSHtml.replaceContents(
        document.getElementById("quiz-student-form"),
        QuizView.renderUnavailableMessage(),
      );
      $("#quiz-student-form").show();
      return;
    }
    const storageKey = getQuizStorageKey(quizLevel);
    let savedSession = null;
    try {
      savedSession = JSON.parse(localStorage.getItem(storageKey));
    } catch (error) {
      localStorage.removeItem(storageKey);
    }

    // Resume only sessions that still match the current question data.
    const validOrder =
      savedSession &&
      savedSession.orderVersion === QUIZ_ORDER_VERSION &&
      Array.isArray(savedSession.order) &&
      savedSession.order.length === sourceQuestions.length &&
      savedSession.order.every(function (index, position) {
        return index === position;
      }) &&
      new Set(savedSession.order).size === sourceQuestions.length;
    const validResponses =
      validOrder &&
      Array.isArray(savedSession.responses) &&
      savedSession.responses.length === sourceQuestions.length &&
      savedSession.responses.every(function (response, index) {
        const sourceQuestion = sourceQuestions[savedSession.order[index]];
        return (
          response === null ||
          (Number.isInteger(response) &&
            response >= 0 &&
            response < sourceQuestion.opts.length)
        );
      });

    if (
      validOrder &&
      validResponses &&
      typeof savedSession.studentName === "string" &&
      savedSession.studentName.trim() &&
      typeof savedSession.fatherName === "string" &&
      savedSession.fatherName.trim() &&
      typeof savedSession.startedAt === "string" &&
      !Number.isNaN(Date.parse(savedSession.startedAt)) &&
      Number.isInteger(savedSession.index) &&
      savedSession.index >= 0 &&
      savedSession.index < sourceQuestions.length &&
      Number.isInteger(savedSession.timeRemaining) &&
      savedSession.timeRemaining > 0 &&
      savedSession.timeRemaining <= QUIZ_SECONDS_PER_QUESTION
    ) {
      quizQuestions = savedSession.order.map(function (index) {
        return sourceQuestions[index];
      });
      quizIndex = savedSession.index;
      quizResponses = savedSession.responses;
      quizScore = countCorrectAnswers();
      quizTimeRemaining = savedSession.timeRemaining;
      quizStudentName = savedSession.studentName;
      quizFatherName = savedSession.fatherName;
      quizStartedAt = savedSession.startedAt;
      quizPaused = savedSession.paused === true;
      quizAnswered = Number.isInteger(quizResponses[quizIndex]);
      quizSelectedIndex = quizAnswered ? quizResponses[quizIndex] : null;
      showActiveQuiz();
    } else {
      localStorage.removeItem(storageKey);
      quizQuestions = [];
      quizIndex = 0;
      quizScore = 0;
      quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
      quizResponses = [];
      quizStudentName = "";
      quizFatherName = "";
      quizStartedAt = null;
      quizPaused = false;
      quizAnswered = false;
      quizSelectedIndex = null;
      $("#quiz-student-form").show();
      $("#quiz-body, #quiz-result").hide();
    }
  }

  function showActiveQuiz() {
    quizPage = Math.floor(quizIndex / QUIZ_PAGE_SIZE);
    $("#quiz-student-form, #quiz-result").hide();
    $("#quiz-body").show();
    renderQuestion();
    updateQuizTimer();
    updateQuizPauseButton();
    startQuizTimer();
  }

  // Count down once per second, pausing after an answer or when requested.
  function startQuizTimer() {
    clearInterval(quizTimerId);
    quizTimerId = null;
    if (quizPaused || Number.isInteger(quizResponses[quizIndex])) return;
    quizTimerId = setInterval(function () {
      quizTimeRemaining--;
      if (quizTimeRemaining <= 9 && quizTimeRemaining >= 0) {
        playCountdownTickSound();
      }
      updateQuizTimer();
      persistQuizSession();
      if (quizTimeRemaining <= 0) {
        if (!Number.isInteger(quizResponses[quizIndex])) {
          playSkipSound();
        }
        triggerQuestionTransitionAnimation();
        advanceQuizQuestion();
      }
    }, 1000);
  }

  $(document).on("submit", "#quiz-student-form", function (event) {
    event.preventDefault();
    quizStudentName = $("#quiz-student-name").val().trim();
    quizFatherName = $("#quiz-father-name").val().trim();
    if (!quizStudentName || !quizFatherName) return;
    quizQuestions = QUIZZES[quizLevel].slice();
    quizResponses = Array(quizQuestions.length).fill(null);
    quizIndex = 0;
    quizPage = 0;
    quizScore = 0;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    quizAnswered = false;
    quizSelectedIndex = null;
    quizStartedAt = new Date().toISOString();
    quizCompletionStatus = "completed";
    showActiveQuiz();
    persistQuizSession();
  });

  function getQuizStorageKey(level) {
    return "cs-study-quiz:" + level;
  }

  function persistQuizSession() {
    if (!quizLevel || !quizQuestions.length || !quizQuestions[quizIndex])
      return;
    const sourceQuestions = QUIZZES[quizLevel];
    const order = quizQuestions.map(function (question) {
      return sourceQuestions.indexOf(question);
    });
    try {
      localStorage.setItem(
        getQuizStorageKey(quizLevel),
        JSON.stringify({
          orderVersion: QUIZ_ORDER_VERSION,
          order,
          index: quizIndex,
          score: quizScore,
          responses: quizResponses,
          timeRemaining: quizTimeRemaining,
          paused: quizPaused,
          studentName: quizStudentName,
          fatherName: quizFatherName,
          startedAt: quizStartedAt,
        }),
      );
    } catch (error) {
      // Storage may be disabled or full; the in-memory quiz still works.
    }
  }

  // Optional audio feedback. Reuse one context for all quiz sounds.
  function ensureQuizAudioContext() {
    if (!window.AudioContext && !window.webkitAudioContext) return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!quizAudioCtx) quizAudioCtx = new AudioCtor();
    if (!quizAudioCompressor && quizAudioCtx.createDynamicsCompressor) {
      quizAudioCompressor = quizAudioCtx.createDynamicsCompressor();
      quizAudioCompressor.threshold.value = -1;
      quizAudioCompressor.knee.value = 0;
      quizAudioCompressor.ratio.value = 20;
      quizAudioCompressor.attack.value = 0.003;
      quizAudioCompressor.release.value = 0.15;
      quizAudioCompressor.connect(quizAudioCtx.destination);
    }
    if (quizAudioCtx.state === "suspended") {
      quizAudioCtx.resume();
    }
    return quizAudioCtx;
  }

  function playQuizTone({ frequency, duration, type, volume, delay, sweepTo }) {
    const context = ensureQuizAudioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const startAt = context.currentTime + (delay || 0);
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (sweepTo) {
      oscillator.frequency.exponentialRampToValueAtTime(
        sweepTo,
        startAt + duration,
      );
    }
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume || 0.04, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gainNode);
    gainNode.connect(quizAudioCompressor || context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
  }

  function playQuizNoiseBurst({ duration, volume, delay, highPass }) {
    const context = ensureQuizAudioContext();
    if (!context) return;
    const buffer = context.createBuffer(
      1,
      Math.max(1, Math.floor(context.sampleRate * duration)),
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const envelope = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    const startAt = context.currentTime + (delay || 0);
    source.buffer = buffer;
    filter.type = highPass ? "highpass" : "lowpass";
    filter.frequency.value = highPass || 9000;
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume || 0.12, startAt + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(quizAudioCompressor || context.destination);
    source.start(startAt);
    source.stop(startAt + duration + 0.02);
  }

  function playCountdownTickSound() {
    playQuizTone({
      frequency: 870,
      duration: 0.06,
      type: "triangle",
      volume: 1,
      sweepTo: 620,
    });
  }

  function playCorrectAnswerSound() {
    playQuizTone({
      frequency: 620,
      duration: 0.12,
      type: "triangle",
      volume: 1,
      sweepTo: 860,
    });
    playQuizTone({
      frequency: 840,
      duration: 0.14,
      type: "triangle",
      volume: 1,
      delay: 0.08,
      sweepTo: 1060,
    });
    playQuizTone({
      frequency: 1090,
      duration: 0.18,
      type: "triangle",
      volume: 1,
      delay: 0.16,
      sweepTo: 1360,
    });
  }

  function playWrongAnswerSound() {
    playQuizTone({
      frequency: 420,
      duration: 0.16,
      type: "sawtooth",
      volume: 1,
      sweepTo: 180,
    });
    playQuizTone({
      frequency: 260,
      duration: 0.22,
      type: "square",
      volume: 1,
      delay: 0.1,
      sweepTo: 120,
    });
  }

  function playSkipSound() {
    playQuizTone({
      frequency: 490,
      duration: 0.08,
      type: "sine",
      volume: 1,
      sweepTo: 360,
    });
    playQuizTone({
      frequency: 360,
      duration: 0.12,
      type: "sine",
      volume: 1,
      delay: 0.07,
      sweepTo: 240,
    });
  }

  function playResultSound() {
    playQuizTone({
      frequency: 620,
      duration: 0.2,
      type: "triangle",
      volume: 1,
      sweepTo: 760,
    });
    playQuizTone({
      frequency: 780,
      duration: 0.2,
      type: "triangle",
      volume: 1,
      delay: 0.16,
      sweepTo: 980,
    });
    playQuizTone({
      frequency: 980,
      duration: 0.3,
      type: "triangle",
      volume: 1,
      delay: 0.32,
      sweepTo: 1170,
    });
    [0, 0.13, 0.27, 0.41, 0.56, 0.72, 0.89, 1.08].forEach(function (delay) {
      playQuizNoiseBurst({ duration: 0.1, volume: 1, delay, highPass: 1100 });
    });
  }

  function triggerQuestionTransitionAnimation() {
    const card = document.querySelector(".quiz-card");
    if (!card) return;
    card.classList.remove("question-flash", "question-slide-up");
    void card.offsetWidth;
    card.classList.add("question-flash");
    window.setTimeout(function () {
      card.classList.remove("question-flash");
      card.classList.add("question-slide-up");
      window.setTimeout(function () {
        card.classList.remove("question-slide-up");
      }, 450);
    }, 120);
  }

  // Keep question progress and pagination in sync with the current index.
  function updateQuizTimer() {
    const seconds = Math.max(quizTimeRemaining, 0);
    const timer = $("#quiz-timer");
    timer
      .removeClass("timer-warning timer-danger")
      .toggleClass("timer-warning", seconds <= 10 && seconds > 5)
      .toggleClass("timer-danger", seconds <= 5);
    timer.text(seconds + "s");
    $("#quiz-timer-bar")
      .css(
        "width",
        ((seconds / QUIZ_SECONDS_PER_QUESTION) * 100).toFixed(0) + "%",
      )
      .toggleClass("timer-warning", seconds <= 10 && seconds > 5)
      .toggleClass("timer-danger", seconds <= 5)
      .parent()
      .attr("aria-valuenow", seconds);
  }

  function getQuizPageInfo() {
    const pageStart = quizPage * QUIZ_PAGE_SIZE;
    const pageEnd = Math.min(pageStart + QUIZ_PAGE_SIZE, quizQuestions.length);
    const questionsInPage = pageEnd - pageStart;
    const pageNumber = Math.floor(quizIndex / QUIZ_PAGE_SIZE) + 1;
    return {
      pageStart,
      pageEnd,
      questionsInPage,
      pageNumber,
      totalPages: Math.max(1, Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE)),
    };
  }

  function renderPaginationButtons() {
    const totalPages = Math.max(
      1,
      Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE),
    );
    const pageWrap = $("#quiz-pagination").empty();
    const startPage = Math.max(0, Math.min(quizPage - 4, totalPages - 10));
    const endPage = Math.min(totalPages, startPage + 10);

    const prevBtn = $(
      '<button type="button" class="btn btn-sm btn-outline-secondary me-2 mb-2 quiz-page-nav" data-nav="prev" aria-label="Previous page"><i class="bi bi-arrow-left"></i></button>',
    );
    pageWrap.append(prevBtn);

    for (let p = startPage; p < endPage; p++) {
      const pageButton = $(
        '<button type="button" class="btn btn-sm me-2 mb-2 ' +
          (p === quizPage ? "btn-primary-custom" : "btn-outline-secondary") +
          ' quiz-page-btn">' +
          (p + 1) +
          "</button>",
      );
      pageButton.data("page", p);
      pageWrap.append(pageButton);
    }

    const nextBtn = $(
      '<button type="button" class="btn btn-sm btn-outline-secondary ms-1 mb-2 quiz-page-nav" data-nav="next" aria-label="Next page"><i class="bi bi-arrow-right"></i></button>',
    );
    pageWrap.append(nextBtn);
  }

  function renderQuestion() {
    const q = quizQuestions[quizIndex];
    if (!q) return;
    quizSelectedIndex = quizResponses[quizIndex];
    quizAnswered = Number.isInteger(quizSelectedIndex);
    const pageInfo = getQuizPageInfo();
    $("#quiz-progress-bar").css(
      "width",
      ((quizIndex / quizQuestions.length) * 100).toFixed(0) + "%",
    );
    $("#quiz-q-label").text(
      "Question " + (quizIndex + 1) + " of " + quizQuestions.length,
    );
    $("#quiz-page-indicator").text(
      "Page " + pageInfo.pageNumber + " of " + pageInfo.totalPages,
    );
    $("#quiz-score-badge").text(
      "Score: " + quizScore + " / " + countAttemptedQuestions(),
    );
    $("#quiz-question").text(q.q);
    $("#quiz-feedback").hide().removeClass("correct incorrect").text("");
    $("#quiz-next").hide();
    renderPaginationButtons();
    const wrap = $("#quiz-options").empty();
    q.opts.forEach(function (opt, i) {
      const option = $("<button>", {
        class: "quiz-option",
        "data-idx": i,
      }).text(String.fromCharCode(65 + i) + ". " + opt);
      wrap.append(option);
    });
    if (quizAnswered && quizSelectedIndex !== null) {
      const correct = q.ans;
      $(".quiz-option").prop("disabled", true);
      $('[data-idx="' + correct + '"]').addClass("correct");
      if (quizSelectedIndex !== correct) {
        $('[data-idx="' + quizSelectedIndex + '"]').addClass("incorrect");
      }
      $("#quiz-feedback")
        .addClass(quizSelectedIndex === correct ? "correct" : "incorrect")
        .text(
          quizSelectedIndex === correct
            ? "Correct!"
            : "Incorrect â€” correct answer: " +
                String.fromCharCode(65 + correct) +
                ".",
        )
        .show();
      $("#quiz-next").show();
    }
    updateQuizTimer();
    persistQuizSession();
  }

  $(document).on("click", ".quiz-option", function () {
    if (quizPaused || quizAnswered) return;
    clearInterval(quizTimerId);
    quizTimerId = null;
    quizAnswered = true;
    const chosen = parseInt($(this).data("idx"));
    quizSelectedIndex = chosen;
    const correct = quizQuestions[quizIndex].ans;
    $(".quiz-option").prop("disabled", true);
    if (chosen === correct) {
      $(this).addClass("correct");
      $("#quiz-feedback").addClass("correct").text("Correct!").show();
      playCorrectAnswerSound();
    } else {
      $(this).addClass("incorrect");
      $('[data-idx="' + correct + '"]').addClass("correct");
      $("#quiz-feedback")
        .addClass("incorrect")
        .text(
          "Incorrect â€” correct answer: " +
            String.fromCharCode(65 + correct) +
            ".",
        )
        .show();
      playWrongAnswerSound();
    }
    quizResponses[quizIndex] = chosen;
    quizScore = countCorrectAnswers();
    $("#quiz-score-badge").text(
      "Score: " + quizScore + " / " + countAttemptedQuestions(),
    );
    $("#quiz-next").show();
    persistQuizSession();
  });

  $(document).on("click", ".quiz-page-btn", function () {
    if (quizPaused) return;
    const targetPage = parseInt($(this).data("page"), 10);
    if (Number.isNaN(targetPage)) return;
    quizPage = targetPage;
    quizIndex = quizPage * QUIZ_PAGE_SIZE;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  });

  $(document).on("click", ".quiz-page-nav", function () {
    if (quizPaused) return;
    const direction = $(this).data("nav");
    const totalPages = Math.max(
      1,
      Math.ceil(quizQuestions.length / QUIZ_PAGE_SIZE),
    );
    if (direction === "prev") {
      quizPage = Math.max(0, quizPage - 1);
    } else {
      quizPage = Math.min(totalPages - 1, quizPage + 1);
    }
    quizIndex = quizPage * QUIZ_PAGE_SIZE;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  });

  function advanceQuizQuestion() {
    const pageInfo = getQuizPageInfo();
    const questionsInPage = Math.min(
      QUIZ_PAGE_SIZE,
      quizQuestions.length - pageInfo.pageStart,
    );
    const localIndex = quizIndex - pageInfo.pageStart;

    if (!Number.isInteger(quizResponses[quizIndex])) {
      playSkipSound();
    }

    if (quizIndex >= quizQuestions.length - 1) {
      finishQuiz();
      return;
    }
    if (localIndex >= questionsInPage - 1) quizPage++;
    triggerQuestionTransitionAnimation();
    quizIndex++;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    renderQuestion();
    startQuizTimer();
  }

  $(document).on("click", "#quiz-next", function () {
    if (quizPaused) return;
    advanceQuizQuestion();
  });

  function updateQuizPauseButton() {
    const button = $("#quiz-pause");
    button.attr("aria-pressed", quizPaused ? "true" : "false");
    CSHtml.replaceContents(
      button[0],
      QuizView.renderPauseButton(quizPaused),
    );
  }

  $(document).on("click", "#quiz-pause", function () {
    quizPaused = !quizPaused;
    if (quizPaused) {
      clearInterval(quizTimerId);
      quizTimerId = null;
    } else {
      startQuizTimer();
    }
    updateQuizPauseButton();
    persistQuizSession();
  });

  $(document).on("click", "#quiz-stop", function () {
    finishQuiz("stopped");
  });

  $(document).on("click", "#quiz-restart", restartQuizForStudent);

  function finishQuiz(status) {
    if ($("#quiz-result").is(":visible")) return;
    clearInterval(quizTimerId);
    quizPaused = false;
    quizCompletionStatus = status === "stopped" ? "stopped" : "completed";
    if (quizLevel) localStorage.removeItem(getQuizStorageKey(quizLevel));
    const attempted = countAttemptedQuestions();
    const skipped = quizQuestions.length - attempted;
    const pct = quizQuestions.length
      ? Math.round((quizScore / quizQuestions.length) * 100)
      : 0;
    const endTime = new Date();
    const message = getQuizPerformanceMessage(pct);
    playResultSound();
    $("#quiz-result-score").text(quizScore + "/" + quizQuestions.length);
    $("#quiz-result-pct").text(pct + "% correct");
    $("#quiz-report-student").text(quizStudentName);
    $("#quiz-report-father").text(quizFatherName);
    $("#quiz-report-class").text(getQuizClassLabel());
    const reportStatus = $("#quiz-report-status");
    reportStatus.toggleClass(
      "is-stopped",
      quizCompletionStatus === "stopped",
    );
    CSHtml.replaceContents(
      reportStatus[0],
      QuizView.renderCompletionStatus(quizCompletionStatus === "stopped"),
    );
    $("#quiz-report-message").text(message);
    $("#quiz-report-attempted").text(attempted);
    $("#quiz-report-skipped").text(skipped);
    $("#quiz-report-correct").text(quizScore);
    $("#quiz-report-incorrect").text(attempted - quizScore);
    $("#quiz-report-total").text(quizQuestions.length);
    $("#quiz-report-start-time").text(formatQuizLocalTime(quizStartedAt));
    $("#quiz-report-end-time").text(formatQuizLocalTime(endTime.toISOString()));
    $("#quiz-body").hide();
    $("#quiz-result").show();
  }

  function countAttemptedQuestions() {
    return quizResponses.filter(Number.isInteger).length;
  }

  function countCorrectAnswers() {
    return quizResponses.reduce(function (score, response, index) {
      return (
        score +
        (Number.isInteger(response) && response === quizQuestions[index].ans
          ? 1
          : 0)
      );
    }, 0);
  }

  function getQuizPerformanceMessage(percentage) {
    if (percentage >= 90) return "Outstanding work! You're a quiz superstar!";
    if (percentage >= 75)
      return "Fantastic effort! Keep that curiosity shining.";
    if (percentage >= 50)
      return "Great practice! Every question helps you grow.";
    return "Nice try! Keep learning and you'll level up.";
  }

  function getQuizClassLabel() {
    const board =
      quizLevel.indexOf("federal-board") !== -1
        ? "Federal Board"
        : quizLevel.indexOf("sindh-board") !== -1
          ? "Sindh Board"
          : "";
    return board
      ? CATEGORY_META[quizLevel].label + " - " + board
      : CATEGORY_META[quizLevel].label;
  }

  function formatQuizLocalTime(isoTime) {
    return new Date(isoTime).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function escapeQuizSvgText(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // Download the report as a self-contained SVG image.
  function downloadQuizReport() {
    const attempted = countAttemptedQuestions();
    const skipped = quizQuestions.length - attempted;
    const percentage = quizQuestions.length
      ? Math.round((quizScore / quizQuestions.length) * 100)
      : 0;
    // Escape student-provided text before interpolating it into the SVG file.
    const report = {
      student: escapeQuizSvgText(quizStudentName),
      father: escapeQuizSvgText(quizFatherName),
      className: escapeQuizSvgText(getQuizClassLabel()),
      status:
        quizCompletionStatus === "stopped" ? "Stopped early" : "Completed",
      score: quizScore + " / " + quizQuestions.length,
      percentage: percentage + "% correct",
      attempted: attempted,
      skipped: skipped,
      correct: quizScore,
      incorrect: attempted - quizScore,
      start: escapeQuizSvgText(formatQuizLocalTime(quizStartedAt)),
      end: escapeQuizSvgText($("#quiz-report-end-time").text()),
      message: escapeQuizSvgText(getQuizPerformanceMessage(percentage)),
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1120" viewBox="0 0 900 1120">
    <defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff7cc"/><stop offset="1" stop-color="#dff7ff"/></linearGradient><linearGradient id="score" x2="1" y2="1"><stop stop-color="#ffe47a"/><stop offset="1" stop-color="#ffc85a"/></linearGradient></defs>
    <rect width="900" height="1120" rx="42" fill="url(#paper)"/><circle cx="90" cy="100" r="30" fill="#ff9d76"/><circle cx="810" cy="120" r="22" fill="#78d8c8"/><path d="M90 930l18 36 40 6-29 28 7 40-36-19-36 19 7-40-29-28 40-6z" fill="#f7bf45"/><path d="M790 900l13 26 29 4-21 20 5 29-26-14-26 14 5-29-21-20 29-4z" fill="#fd9476"/>
    <rect x="105" y="72" width="690" height="976" rx="36" fill="#ffffff" stroke="#e4e8eb" stroke-width="3"/>
    <rect x="260" y="105" width="380" height="54" rx="27" fill="#dcf7ed"/><text x="450" y="141" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#237d67">QUIZ CHAMPION</text>
    <path d="M420 180h60v20c0 20-12 34-30 34s-30-14-30-34v-20m0 8h-15v10c0 12 7 20 20 22m55-32h15v10c0 12-7 20-20 22m-18 14v14h-12v9h36v-9h-12v-14z" fill="none" stroke="#d99b24" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><text x="450" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="#798490">YOUR REPORT CARD</text>
    <text x="450" y="334" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#243447">Brilliant effort, ${report.student}!</text><text x="450" y="376" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#526274">${report.message}</text>
    <text x="450" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#334155">Father: ${report.father}</text><text x="450" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#334155">${report.className}</text>
    <rect x="320" y="488" width="260" height="38" rx="19" fill="${quizCompletionStatus === "stopped" ? "#fff0e9" : "#e3f6e9"}"/><text x="450" y="513" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="${quizCompletionStatus === "stopped" ? "#b45309" : "#237d67"}">Test ${report.status}</text>
    <rect x="185" y="540" width="530" height="190" rx="28" fill="url(#score)"/><text x="450" y="584" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="2" fill="#735311">YOUR SCORE</text><text x="450" y="655" text-anchor="middle" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#342b18">${report.score}</text><text x="450" y="695" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#735311">${report.percentage}</text>
    <text x="450" y="782" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#344256">QUIZ STATS</text>
    <text x="165" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Attempted</text><text x="165" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#237d67">${report.attempted}</text>
    <text x="310" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Skipped</text><text x="310" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#d97706">${report.skipped}</text>
    <text x="450" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Correct</text><text x="450" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#237d67">${report.correct}</text>
    <text x="590" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Incorrect</text><text x="590" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#b45309">${report.incorrect}</text>
    <text x="735" y="830" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#526274">Total</text><text x="735" y="870" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#3d6f9b">${quizQuestions.length}</text>
    <path d="M170 910h560" stroke="#e7ebef" stroke-width="2"/><text x="190" y="956" font-family="Arial,sans-serif" font-size="17" fill="#526274">Started: ${report.start}</text><text x="190" y="994" font-family="Arial,sans-serif" font-size="17" fill="#526274">Finished: ${report.end}</text>
  </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename =
      quizStudentName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "student";
    link.href = url;
    link.download = filename + "-quiz-report.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  $(document).on("click", "#quiz-report-download", downloadQuizReport);

  function restartQuizForStudent() {
    clearInterval(quizTimerId);
    if (quizLevel) localStorage.removeItem(getQuizStorageKey(quizLevel));
    quizQuestions = [];
    quizResponses = [];
    quizIndex = 0;
    quizPage = 0;
    quizScore = 0;
    quizTimeRemaining = QUIZ_SECONDS_PER_QUESTION;
    quizPaused = false;
    quizAnswered = false;
    quizSelectedIndex = null;
    quizStudentName = "";
    quizFatherName = "";
    quizStartedAt = null;
    quizCompletionStatus = "completed";
    $("#quiz-student-form")[0].reset();
    $("#quiz-result, #quiz-body").hide();
    $("#quiz-student-form").show();
    $("#quiz-student-name").trigger("focus");
  }

  $(document).on("click", "#quiz-restart-end", restartQuizForStudent);

  /*  TUTORIAL  BLOG  */

  globalThis.QuizFeature = {
    render,
    persistOnPageHide() {
      clearInterval(quizTimerId);
      quizTimerId = null;
      persistQuizSession();
    },
  };
})();
