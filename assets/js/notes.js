const levels = {
  "o-level": {
    title: "O Level",
    json: "assets/json/o_level.json",
    sections: [
      {
        topics: [
          "Data Representation",
          "Data Transmission",
          "Hardware",
          "Software",
          "The Internet and It's Use",
          "Automated and Emerging Technologies",
          "Algorithms Design and Problem Solving",
          "Programming",
          "Databases",
          "Boolean Logic",
        ],
      },
    ],
  },
  "a-level": {
    title: "A Level",
    json: "assets/json/a_level.json",
    sections: [
      {
        topics: ["Data Representation", "Algorithms"],
      },
    ],
  },
};

let currentLevel = "o-level";
let currentTopic = "";
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
let notesBreadcrumb;

function initNotesPage(level) {
  sidebar = document.getElementById("sidebar");
  sidebarList = document.getElementById("sidebar-list");
  sidebarBadge = document.getElementById("sidebar-level-badge");
  contentTitle = document.getElementById("content-title");
  topicContent = document.getElementById("topic-content");
  prevButton = document.getElementById("prev-topic");
  nextButton = document.getElementById("next-topic");
  mobileToggle = document.getElementById("mobile-sidebar-toggle");
  closeSidebar = document.getElementById("sidebar-close");
  overlay = document.getElementById("sidebar-overlay");
  notesBreadcrumb = document.getElementById("notes-breadcrumb");

  attachNavListeners();
  attachLevelCardListeners();
  attachSidebarControls();
  attachTopicNavigation();
  setLevel(level || currentLevel || "o-level");
}

function attachNavListeners() {
  document.querySelectorAll("[data-level]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const level = link.dataset.level;
      if (level && levels[level]) {
        setLevel(level);
      }
      hideMobileSidebar();
    });
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      // only prevent default for placeholder links (href="#") when not a level selector
      const href = link.getAttribute("href");
      if (href === "#" && !link.dataset.level) {
        event.preventDefault();
      }
    });
  });
}

function attachLevelCardListeners() {
  document.querySelectorAll(".level-card").forEach((card) => {
    card.addEventListener("click", () => {
      const level = card.dataset.level;
      if (level && levels[level]) {
        setLevel(level);
      }
    });
  });
}

function attachSidebarControls() {
  mobileToggle.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  });

  closeSidebar.addEventListener("click", () => {
    hideMobileSidebar();
  });

  overlay.addEventListener("click", () => {
    hideMobileSidebar();
  });
}

function hideMobileSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
}

function attachTopicNavigation() {
  prevButton.addEventListener("click", () => {
    navigateTopic(-1);
  });

  nextButton.addEventListener("click", () => {
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
      currentTopic = currentTopicList[0] || "";
    }
    renderTopic();
  });
}

function highlightLevelCard(levelKey) {
  document.querySelectorAll(".level-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.level === levelKey);
  });
}

function highlightLevelNav(levelKey) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.level === levelKey) {
      link.classList.add("active");
    } else if (link.dataset.navpage && link.dataset.navpage === levelKey) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function buildSidebar(sections) {
  sidebarList.innerHTML = "";
  currentTopicList = [];

  sections.forEach((section) => {
    if (!section.topics || !section.topics.length) {
      return;
    }

    const group = document.createElement("div");
    group.className = "group";

    if (section.title) {
      const sectionHeading = document.createElement("div");
      sectionHeading.className = "sidebar-section-title";
      sectionHeading.textContent = section.title;
      group.appendChild(sectionHeading);
    }

    section.topics.forEach((topic) => {
      if (typeof topic === "string") {
        addTopicItem(topic, group);
      } else if (typeof topic === "object" && topic.title) {
        const heading = document.createElement("div");
        heading.className = "sidebar-section-title";
        heading.textContent = topic.title;
        group.appendChild(heading);

        (topic.children || []).forEach((child) => {
          addTopicItem(child, group);
        });
      }
    });

    sidebarList.appendChild(group);
  });
}

function addTopicItem(topic, container) {
  currentTopicList.push(topic);
  const item = document.createElement("button");
  item.type = "button";
  item.className = "topic-item";
  item.textContent = topic;
  item.dataset.topic = topic;
  item.addEventListener("click", () => {
    currentTopic = topic;
    renderTopic();
    if (window.innerWidth < 900) hideMobileSidebar();
  });
  container.appendChild(item);
}

async function fetchNotes(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("Unable to fetch notes data");
    }
    currentNotes = await response.json();
  } catch (error) {
    currentNotes = {};
    console.warn("Notes data could not be loaded:", error);
  }
}

function updateBreadcrumb() {
  if (!notesBreadcrumb) return;
  const levelLabel =
    levels[currentLevel] && levels[currentLevel].title
      ? levels[currentLevel].title
      : currentLevel;
  const topicLabel = currentTopic || "";
  notesBreadcrumb.innerHTML =
    '<div class="breadcrumb-custom">' +
    '<a href="#" data-goto="home">Home</a><span>/</span>' +
    '<a href="#" data-goto="cat-hub" data-level="' +
    currentLevel +
    '">' +
    levelLabel +
    "</a><span>/</span>" +
    "<strong>" +
    topicLabel +
    "</strong>" +
    "</div>";
}

function renderTopic() {
  updateBreadcrumb();
  if (!currentTopicList.length) {
    return;
  }

  if (!currentTopic) {
    currentTopic = currentTopicList[0];
  }

  const itemNodes = document.querySelectorAll(".topic-item");
  itemNodes.forEach((item) => {
    item.classList.toggle("active", item.dataset.topic === currentTopic);
  });

  const topicData = currentNotes[currentTopic] || {
    title: currentTopic,
    sections: [],
  };

  contentTitle.textContent = topicData.title;

  if (Array.isArray(topicData.sections) && topicData.sections.length) {
    topicContent.innerHTML = topicData.sections
      .map((section) => `<h3>${section.title}</h3><p>${section.content}</p>`)
      .join("");
  } else if (topicData.content) {
    topicContent.innerHTML = topicData.content;
  } else {
    topicContent.innerHTML =
      "<p>Content is being prepared for this topic. Check back soon for fresh notes.</p>";
  }
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

window.addEventListener("resize", () => {
  if (window.innerWidth >= 900) {
    hideMobileSidebar();
  }
});

if (document.getElementById("sidebar")) {
  initNotesPage();
}
