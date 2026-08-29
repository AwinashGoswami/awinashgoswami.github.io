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
  if (!levels[levelKey]) {
    return;
  }

  currentLevel = levelKey;
  const levelConfig = levels[levelKey];

  if (sidebarBadge) {
    sidebarBadge.textContent = levelConfig.title;
  }

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
  if (!sidebarList) return;
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

function makePdfDataUrl(title) {
  const text = String(title || "Study Notes");
  const safeText = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const content = "BT /F1 18 Tf 72 740 Td (" + safeText + ") Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += (index + 1) + " 0 obj\n" + obj + "\nendobj\n";
  });

  const xrefOffset = pdf.length;
  pdf += "xref\n0 " + (objects.length + 1) + "\n";
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }

  pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF";

  return "data:application/pdf;base64," + btoa(unescape(encodeURIComponent(pdf)));
}

function resolveTopicPdfUrl(topic, topicData) {
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

  const pdfUrl = resolveTopicPdfUrl(currentTopic, topicData);

  if (pdfUrl) {
    const pdfTitle = topicData.title || currentTopic || "Study Notes";
    const viewerUrl = isMobileDevice() ? buildPdfViewerUrl(pdfUrl) : pdfUrl;

    topicContent.innerHTML = [
      '<div class="pdf-viewer-shell">',
      '  <div class="pdf-embed-wrap">',
      '    <iframe class="pdf-embed-frame" src="' + viewerUrl + '" title="' + escapeHtml(pdfTitle) + ' PDF" loading="lazy" allow="fullscreen"></iframe>',
      '  </div>',
      '</div>'
    ].join("");
  } else {
    const friendlyTitle = topicData.title || currentTopic || "This topic";
    topicContent.innerHTML = "<div class=\"topic-unavailable\"><h3>PDF not available yet</h3><p>" + escapeHtml(friendlyTitle) + " is currently being prepared. Please check back soon for the study notes.</p></div>";
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

if (document.getElementById("sidebar")) {
  initNotesPage();
}
