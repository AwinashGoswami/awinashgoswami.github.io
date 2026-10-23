(() => {
// Notes-page state stays private to this feature module.
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

const NotesFeature = {
  render(level) {
    const requestedLevel = new URLSearchParams(window.location.search).get("level");
    currentLevel = level || requestedLevel || "o-level";
    const levelMeta = CATEGORY_META[currentLevel] || { label: "O Level" };
    let levelClass = "level-o";
    if (currentLevel === "a-level") {
      levelClass = "level-a";
    }
    CSHtml.replaceContents(
      document.getElementById("main-content"),
      NotesView.render(levelMeta, levelClass),
    );
    initNotesPage(currentLevel);
  },
};
globalThis.NotesFeature = NotesFeature;

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

  attachSidebarControls();
  attachTopicNavigation();
  setLevel(level || currentLevel || "o-level");
}

function attachSidebarControls() {
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.add("open");
      overlay.classList.add("active");
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      hideMobileSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      hideMobileSidebar();
    });
  }
}

function hideMobileSidebar() {
  if (!sidebar || !overlay) return;
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
}

function attachTopicNavigation() {
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      navigateTopic(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      navigateTopic(1);
    });
  }
}

function setLevel(levelKey) {
  if (!CLASSROOM_NOTES[levelKey]) {
    return;
  }

  currentLevel = levelKey;
  const levelConfig = CLASSROOM_NOTES[levelKey];

  if (sidebarBadge) {
    sidebarBadge.textContent = levelConfig.title;
  }

  // Load the topic data before building the sidebar and selecting a topic.
  fetchNotes(levelConfig.json).then(() => {
    buildSidebar(levelConfig.sections);
    if (!currentTopic || !currentTopicList.includes(currentTopic)) {
      currentTopic = currentTopicList[0] || "";
    }
    renderTopic();
  });
}

function buildSidebar(sections) {
  if (!sidebarList) return;
  sidebarList.replaceChildren();
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
  item.dataset.topic = topic;

  const label = document.createElement("span");
  label.textContent = topic;

  const status = currentNotes[topic]?.topicStatus || "to-upload";
  const statusDetails = getStatusDetails(status);
  const statusBadge = document.createElement("span");
  statusBadge.className = `topic-status-badge topic-status-badge-${status}`;
  const icon = document.createElement("i");
  icon.className = statusDetails.icon;
  icon.setAttribute("aria-hidden", "true");
  statusBadge.appendChild(icon);
  item.append(label, statusBadge);

  item.addEventListener("click", () => {
    currentTopic = topic;
    renderTopic();
    if (window.innerWidth < 900) hideMobileSidebar();
  });
  container.appendChild(item);
}

function getStatusDetails(status) {
  const statusDetails = {
    completed: { label: "Completed", icon: "bi bi-check-circle-fill text-success" },
    processing: { label: "Processing", icon: "bi bi-exclamation-triangle-fill text-warning" },
    "to-upload": { label: "To upload", icon: "bi bi-x-circle-fill text-danger" },
  };

  if (statusDetails[status]) {
    return statusDetails[status];
  }

  return {
    label: "To upload",
    icon: "bi bi-x-circle-fill text-danger",
  };
}

// Failed note-data requests are logged and leave the topic list usable.
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
  const levelConfig = CLASSROOM_NOTES[currentLevel];
  const levelTitle = levelConfig ? levelConfig.title : currentLevel;
  let levelPrefix = "";

  if (currentLevel.endsWith("-sindh-board")) {
    levelPrefix = "Sindh ";
  } else if (currentLevel.endsWith("-federal-board")) {
    levelPrefix = "Federal ";
  } else if (currentLevel === "o-level" || currentLevel === "a-level") {
    levelPrefix = "Cambridge ";
  }

  const levelLabel = levelPrefix + levelTitle;
  const topicLabel = currentTopic || "";
  const topicStatus = currentNotes[currentTopic]
    ? currentNotes[currentTopic].topicStatus
    : "to-upload";
  const status = topicStatus || "to-upload";
  const statusDetails = getStatusDetails(status);

  CSHtml.replaceContents(
    notesBreadcrumb,
    NotesView.renderBreadcrumb(
      currentLevel,
      levelLabel,
      topicLabel,
      status,
      statusDetails,
    ),
  );
}

function resolveTopicPdfUrl(topicData) {
  // Note data files use several names for the PDF field.
  const candidates = [
    topicData && topicData.pdf,
    topicData && topicData.pdfUrl,
    topicData && topicData.file,
    topicData && topicData.filePath,
    topicData && topicData.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.toLowerCase().endsWith(".pdf")) {
      return candidate;
    }
  }

  return "";
}

function isMobileDevice() {
  const mobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return mobileUserAgent || window.matchMedia("(pointer: coarse)").matches;
}

function toAbsolutePdfUrl(pdfUrl) {
  if (!pdfUrl) {
    return "";
  }

  try {
    return new URL(pdfUrl, window.location.href).href;
  } catch (error) {
    return pdfUrl;
  }
}

function buildPdfViewerUrl(pdfUrl) {
  const absolutePdfUrl = toAbsolutePdfUrl(pdfUrl);
  if (!absolutePdfUrl) {
    return "";
  }

  return "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(absolutePdfUrl);
}

async function isPdfResourceAvailable(pdfUrl) {
  if (!pdfUrl) {
    return false;
  }

  if (pdfUrl.startsWith("data:")) {
    return true;
  }

  try {
    const headResponse = await fetch(pdfUrl, {
      method: "HEAD",
      cache: "no-store",
    });
    if (headResponse.ok) {
      return true;
    }

    if (headResponse.status === 405 || headResponse.status === 403) {
      const getResponse = await fetch(pdfUrl, {
        method: "GET",
        cache: "no-store",
      });
      return getResponse.ok;
    }

    return false;
  } catch (error) {
    try {
      const getResponse = await fetch(pdfUrl, {
        method: "GET",
        cache: "no-store",
      });
      return getResponse.ok;
    } catch (secondError) {
      return false;
    }
  }
}

function showPdfUnavailableMessage() {
  if (!topicContent) {
    return;
  }
  CSHtml.replaceContents(topicContent, NotesView.renderPdfUnavailable());
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

  if (contentTitle) {
    contentTitle.textContent = topicData.title || currentTopic;
  }

  const pdfUrl = resolveTopicPdfUrl(topicData);

  if (pdfUrl) {
    isPdfResourceAvailable(pdfUrl).then((available) => {
      if (!available) {
        showPdfUnavailableMessage();
        return;
      }

      const pdfTitle = topicData.title || currentTopic || "Study Notes";
      let viewerUrl = pdfUrl;
      if (isMobileDevice()) {
        viewerUrl = buildPdfViewerUrl(pdfUrl);
      }

      CSHtml.replaceContents(
        topicContent,
        NotesView.renderPdfViewer(viewerUrl, pdfTitle),
      );
    }).catch(() => {
      showPdfUnavailableMessage();
    });
  } else {
    showPdfUnavailableMessage();
  }

  if (prevButton && nextButton) {
    const index = currentTopicList.indexOf(currentTopic);
    prevButton.disabled = index <= 0;
    nextButton.disabled = index >= currentTopicList.length - 1;
  }
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

window.addEventListener("resize", () => {
  if (window.innerWidth >= 900) {
    hideMobileSidebar();
  }
});
})();
