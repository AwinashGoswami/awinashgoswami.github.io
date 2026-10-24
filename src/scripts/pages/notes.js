import '../shared/html.js';
import '../data/classrooms.js';
import '../data/site-data.js';
import '../views/notes.js';
import '../features/notes.js';

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
    window.NotesFeature.render(currentLevel);
  }
})();
