import '../shared/html.js';
import '../data/site-data.js';
import '../data/quizzes.js';
import '../views/classroom.js';
import '../features/classroom.js';
import '../views/quiz.js';
import '../features/quiz.js';

(function () {
  const queryParams = new URLSearchParams(window.location.search);
  const currentLevel = queryParams.get('level');
  const target = document.getElementById('main-content');

  if (
    !currentLevel ||
    !Object.prototype.hasOwnProperty.call(window.CATEGORY_META || {}, currentLevel)
  ) {
    window.CSHtml.renderRouteNotice(
      target,
      'Choose a classroom from the home page to continue.',
      'warning',
      { href: '/portal', label: 'Go to Home' },
    );
  } else {
    window.QuizFeature.render(currentLevel);
  }

  window.addEventListener('pagehide', function () {
    if (window.QuizFeature && window.QuizFeature.persistOnPageHide) {
      window.QuizFeature.persistOnPageHide();
    }
  });
})();
