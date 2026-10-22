// Keep quiz page structure separate from timer, scoring, and report behavior.
globalThis.QuizView = {
  renderUnavailableMessage() {
    return '<p class="text-danger" role="alert">Quiz questions are unavailable for this classroom.</p>';
  },

  renderPauseButton(isPaused) {
    if (isPaused) {
      return '<i class="bi bi-play-fill me-1"></i><span>Resume Quiz</span>';
    }
    return '<i class="bi bi-pause-fill me-1"></i><span>Pause Quiz</span>';
  },

  renderCompletionStatus(isStopped) {
    const icon = isStopped ? "bi-pause-circle-fill" : "bi-check-circle-fill";
    const label = isStopped ? "stopped early" : "completed";
    return `<i class="bi ${icon}"></i> Test ${label}`;
  },

  render(levelTitle, breadcrumb) {
    return `
      <div class="section-wrap">
        <div class="container">
          ${breadcrumb}
          <div class="section-header d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h2>${CSHtml.escape(levelTitle)} - Practice Quiz</h2>
              <p>One question at a time. Instant feedback. Track your score.</p>
            </div>
          </div>
          <form class="quiz-student-card" id="quiz-student-form" style="display:none;">
            <div class="quiz-student-icon"><i class="bi bi-person-hearts"></i></div>
            <p class="quiz-student-eyebrow">Your quiz adventure</p>
            <h3>Who is taking the quiz?</h3>
            <p class="quiz-student-copy">Add your details to personalize your report card.</p>
            <label for="quiz-student-name">Student name</label>
            <input class="form-control" id="quiz-student-name" name="studentName" type="text" maxlength="80" autocomplete="name" required />
            <label for="quiz-father-name">Father's name</label>
            <input class="form-control" id="quiz-father-name" name="fatherName" type="text" maxlength="80" autocomplete="off" required />
            <button class="btn-primary-custom" type="submit"><i class="bi bi-stars me-2"></i>Start Quiz</button>
          </form>
          <div id="quiz-body" style="display:none;">
            <div class="quiz-card">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="quiz-progress-label" id="quiz-q-label"></span>
                <span class="quiz-score-badge" id="quiz-score-badge">Score: 0 / 0</span>
              </div>
              <div class="quiz-timer-row mb-3">
                <div class="quiz-timer-track" role="progressbar" aria-label="Time left for this question" aria-valuemin="0" aria-valuemax="30" aria-valuenow="30">
                  <div class="quiz-timer-bar" id="quiz-timer-bar"></div>
                </div>
                <span class="quiz-timer" id="quiz-timer" aria-live="polite">30s</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <span class="quiz-page-indicator" id="quiz-page-indicator">Page 1 of 1</span>
              </div>
              <div class="quiz-progress mb-4"><div class="quiz-progress-bar" id="quiz-progress-bar" style="width:0%"></div></div>
              <p class="quiz-question" id="quiz-question"></p>
              <div id="quiz-options"></div>
              <div class="quiz-feedback" id="quiz-feedback"></div>
              <div class="quiz-action-row">
                <button class="btn-quiz-restart" id="quiz-restart" type="button"><i class="bi bi-arrow-counterclockwise"></i><span>Restart Quiz</span></button>
                <div class="quiz-action-main">
                  <button class="btn-quiz-pause" id="quiz-pause" type="button" aria-pressed="false"><i class="bi bi-pause-fill me-1"></i><span>Pause Quiz</span></button>
                  <button class="btn-quiz-stop" id="quiz-stop" type="button"><i class="bi bi-stop-circle me-1"></i>Stop Quiz</button>
                  <button class="btn-next" id="quiz-next" style="display:none;">Next Question <i class="bi bi-arrow-right ms-1"></i></button>
                </div>
              </div>
            </div>
            <div class="mt-3 text-center" id="quiz-pagination"></div>
          </div>
          <div class="quiz-report-shell" id="quiz-result" style="display:none;">
            <article class="quiz-report-card" id="quiz-report-card">
              <div class="quiz-report-confetti" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
              <div class="quiz-report-ribbon"><i class="bi bi-stars"></i> QUIZ CHAMPION <i class="bi bi-stars"></i></div>
              <div class="quiz-report-trophy" aria-hidden="true"><i class="bi bi-trophy-fill"></i></div>
              <p class="quiz-report-kicker">YOUR REPORT CARD</p>
              <h3>Brilliant effort, <span id="quiz-report-student"></span>!</h3>
              <p class="quiz-report-message" id="quiz-report-message"></p>
              <div class="quiz-report-student-line"><i class="bi bi-person-hearts"></i><span>Father: <strong id="quiz-report-father"></strong></span></div>
              <div class="quiz-report-class"><i class="bi bi-mortarboard-fill"></i><span id="quiz-report-class"></span></div>
              <div class="quiz-report-status" id="quiz-report-status"></div>
              <div class="quiz-report-score-panel">
                <span>YOUR SCORE</span>
                <strong id="quiz-result-score"></strong>
                <small id="quiz-result-pct"></small>
              </div>
              <div class="quiz-report-stats">
                <div class="quiz-report-stat"><i class="bi bi-check2-circle"></i><span>Attempted</span><strong id="quiz-report-attempted"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-skip-forward-circle"></i><span>Skipped</span><strong id="quiz-report-skipped"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-check-circle-fill"></i><span>Correct</span><strong id="quiz-report-correct"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-x-circle-fill"></i><span>Incorrect</span><strong id="quiz-report-incorrect"></strong></div>
                <div class="quiz-report-stat"><i class="bi bi-question-circle"></i><span>Total questions</span><strong id="quiz-report-total"></strong></div>
              </div>
              <div class="quiz-report-times">
                <p><i class="bi bi-play-circle-fill"></i><span>Started</span><strong id="quiz-report-start-time"></strong></p>
                <p><i class="bi bi-flag-fill"></i><span>Finished</span><strong id="quiz-report-end-time"></strong></p>
              </div>
              <div class="quiz-report-actions">
                <button class="btn-primary-custom" id="quiz-report-download" type="button"><i class="bi bi-download me-2"></i>Download report card</button>
                <button class="btn-nav" id="quiz-restart-end" type="button"><i class="bi bi-arrow-counterclockwise me-1"></i>Try Again</button>
              </div>
            </article>
          </div>
        </div>
      </div>
    `;
  },
};
