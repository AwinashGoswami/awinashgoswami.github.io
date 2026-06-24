const levels = {
  'o-level': {
    title: 'O Level',
    json: 'o_level.json',
    sections: [
      {
        title: 'Core Topics',
        topics: [
          { title: 'Data Representation', children: ['Decimal number system', 'Binary number system'] },
          { title: 'Algorithms', children: ['Pseudocode', 'Flowchart symbols'] }
        ]
      },
      {
        title: 'Exam Support',
        topics: []
      }
    ]
  },
  'a-level': {
    title: 'A Level',
    json: 'a_level.json',
    sections: [
      {
        title: 'Advanced Concepts',
        topics: [
          { title: 'Data Representation', children: ['Decimal number system', 'Binary number system'] },
          { title: 'Algorithms', children: ['Pseudocode', 'Flowchart symbols'] }
        ]
      },
      {
        title: 'Revision Tools',
        topics: []
      }
    ]
  }
};

let currentLevel = 'o-level';
let currentTopic = '';
let currentNotes = {};
let currentTopicList = [];

let sidebar;
let sidebarList;
let sidebarBadge;
let contentTitle;
let topicContent;
let prevButton;
let nextButton;
let mobileToggle;
let closeSidebar;
let overlay;

function initNotesPage(level) {
  sidebar = document.getElementById('sidebar');
  sidebarList = document.getElementById('sidebar-list');
  sidebarBadge = document.getElementById('sidebar-level-badge');
  contentTitle = document.getElementById('content-title');
  topicContent = document.getElementById('topic-content');
  prevButton = document.getElementById('prev-topic');
  nextButton = document.getElementById('next-topic');
  mobileToggle = document.getElementById('mobile-sidebar-toggle');
  closeSidebar = document.getElementById('sidebar-close');
  overlay = document.getElementById('sidebar-overlay');

  attachNavListeners();
  attachLevelCardListeners();
  attachSidebarControls();
  attachTopicNavigation();
  setLevel(level || currentLevel || 'o-level');
}

function attachNavListeners() {
  document.querySelectorAll('[data-level]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const level = link.dataset.level;
      if (level && levels[level]) {
        setLevel(level);
      }
      hideMobileSidebar();
    });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', event => {
      // only prevent default for placeholder links (href="#") when not a level selector
      const href = link.getAttribute('href');
      if (href === '#' && !link.dataset.level) {
        event.preventDefault();
      }
    });
  });
}

function attachLevelCardListeners() {
  document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
      const level = card.dataset.level;
      if (level && levels[level]) {
        setLevel(level);
      }
    });
  });
}

function attachSidebarControls() {
  mobileToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  });

  closeSidebar.addEventListener('click', () => {
    hideMobileSidebar();
  });

  overlay.addEventListener('click', () => {
    hideMobileSidebar();
  });
}

function hideMobileSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

function attachTopicNavigation() {
  prevButton.addEventListener('click', () => {
    navigateTopic(-1);
  });

  nextButton.addEventListener('click', () => {
    navigateTopic(1);
  });
}

function setLevel(levelKey) {
  if (!levels[levelKey]) {
    return;
  }

  currentLevel = levelKey;
  const levelConfig = levels[levelKey];

  sidebarBadge.textContent = levelConfig.title;
  highlightLevelNav(levelKey);
  highlightLevelCard(levelKey);
  buildSidebar(levelConfig.sections);
  fetchNotes(levelConfig.json).then(() => {
    if (!currentTopic || !currentTopicList.includes(currentTopic)) {
      currentTopic = currentTopicList[0] || '';
    }
    renderTopic();
  });
}

function highlightLevelCard(levelKey) {
  document.querySelectorAll('.level-card').forEach(card => {
    card.classList.toggle('active', card.dataset.level === levelKey);
  });
}

function highlightLevelNav(levelKey) {
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.level === levelKey) {
      link.classList.add('active');
    } else if (link.dataset.navpage && link.dataset.navpage === levelKey) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function buildSidebar(sections) {
  sidebarList.innerHTML = '';
  currentTopicList = [];

  sections.forEach(section => {
    const group = document.createElement('div');
    group.className = 'group open';

    // Do not show section.title - render topics directly for a cleaner hierarchy
    const topicList = document.createElement('nav');
    topicList.className = 'topic-list';

    section.topics.forEach(topic => {
      // support two formats: string or { title, children: [] }
      if (typeof topic === 'string') {
        currentTopicList.push(topic);
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'topic-item';
        item.innerHTML = topic;
        item.dataset.topic = topic;
        item.addEventListener('click', () => {
          currentTopic = topic;
          renderTopic();
          if (window.innerWidth < 900) hideMobileSidebar();
        });
        topicList.appendChild(item);
      } else if (typeof topic === 'object' && topic.title) {
        // render as W3Schools-like anchor + overview block
        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.className = 'topic-anchor';
        anchor.innerHTML = `<span class="topic-title"><strong>${topic.title}</strong></span><span class="w3s-accordion"><i class="bi bi-chevron-down"></i></span>`;

        const overview = document.createElement('div');
        overview.className = 'tut_overview overview_body';
        overview.style.display = 'none';

        (topic.children || []).forEach(child => {
          currentTopicList.push(child);
          const link = document.createElement('a');
          link.href = '#';
          link.className = 'sub-link';
          link.innerText = child;
          link.dataset.topic = child;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            currentTopic = child;
            renderTopic();
            if (window.innerWidth < 900) hideMobileSidebar();
          });
          overview.appendChild(link);
        });

        // toggle overview display when anchor clicked
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          // collapse all other overviews first
          document.querySelectorAll('.tut_overview').forEach(ov => {
            if (ov !== overview) {
              ov.style.display = 'none';
              const a = ov.previousElementSibling;
              if (a && a.classList) a.classList.remove('active');
              const ic = a && a.querySelector && a.querySelector('.w3s-accordion i');
              if (ic) ic.style.transform = '';
            }
          });

          const open = anchor.classList.toggle('active');
          if (open) {
            overview.style.display = 'block';
            const ic = anchor.querySelector('.w3s-accordion i');
            if (ic) ic.style.transform = 'rotate(180deg)';
          } else {
            overview.style.display = 'none';
            const ic = anchor.querySelector('.w3s-accordion i');
            if (ic) ic.style.transform = '';
          }
        });

        topicList.appendChild(anchor);
        topicList.appendChild(overview);
      }
    });

    group.appendChild(topicList);
    sidebarList.appendChild(group);
  });
}

async function fetchNotes(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error('Unable to fetch notes data');
    }
    currentNotes = await response.json();
  } catch (error) {
    currentNotes = {};
    console.warn('Notes data could not be loaded:', error);
  }
}

function renderTopic() {
  if (!currentTopicList.length) {
    return;
  }

  if (!currentTopic) {
    currentTopic = currentTopicList[0];
  }

  const itemNodes = document.querySelectorAll('.topic-item');
  itemNodes.forEach(item => {
    item.classList.toggle('active', item.dataset.topic === currentTopic);
  });

  // handle sub-link active state and auto-expand parent overview
  document.querySelectorAll('.tut_overview').forEach(overview => {
    const links = overview.querySelectorAll('.sub-link');
    let found = false;
    links.forEach(link => {
      const isActive = link.dataset.topic === currentTopic;
      link.classList.toggle('active', isActive);
      if (isActive) found = true;
    });
    const anchor = overview.previousElementSibling; // the anchor before overview
    if (found) {
      overview.style.display = 'block';
      if (anchor && anchor.classList) anchor.classList.add('active');
      const ic = anchor && anchor.querySelector && anchor.querySelector('.w3s-accordion i');
      if (ic) ic.style.transform = 'rotate(180deg)';
    } else {
      overview.style.display = 'none';
      if (anchor && anchor.classList) anchor.classList.remove('active');
      const ic = anchor && anchor.querySelector && anchor.querySelector('.w3s-accordion i');
      if (ic) ic.style.transform = '';
    }
  });

  const topicData = currentNotes[currentTopic] || {
    title: currentTopic,
    content: '<p>Content is being prepared for this topic. Check back soon for fresh notes and exam tips.</p>'
  };

  contentTitle.textContent = topicData.title;
  topicContent.innerHTML = topicData.content;
  updateNavigationButtons();
}

function navigateTopic(direction) {
  if (!currentTopicList.length) {
    return;
  }

  const currentIndex = currentTopicList.indexOf(currentTopic);
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < currentTopicList.length) {
    currentTopic = currentTopicList[nextIndex];
    renderTopic();
  }
}

function updateNavigationButtons() {
  const index = currentTopicList.indexOf(currentTopic);
  prevButton.disabled = index <= 0;
  nextButton.disabled = index >= currentTopicList.length - 1;
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) {
    hideMobileSidebar();
  }
});

if (document.getElementById('sidebar')) {
  initNotesPage();
}
