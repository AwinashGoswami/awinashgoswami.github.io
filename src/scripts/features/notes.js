(() => {
// Notes-page state stays private to this feature module.
let currentLevel = "o-level";
let currentTopic = "";
let currentNotes = {};
let currentTopicList = [];

let sidebar;
let sidebarList;
let sidebarBadge;
let sidebarDownloadAll;
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
  sidebarDownloadAll = document.getElementById("sidebar-download-all");
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

  if (sidebarDownloadAll) {
    sidebarDownloadAll.addEventListener("click", downloadAllSidebarPdfs);
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
    const fetchPath = path.startsWith("/") || path.startsWith("http") ? path : "/" + path;
    const response = await fetch(fetchPath);
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

async function downloadAllSidebarPdfs() {
  const downloads = [];
  const seen = new Set();
  currentTopicList.forEach((topic) => {
    const topicData = currentNotes[topic] || {};
    const pdfUrl = resolveTopicPdfUrl(topicData);
    if (!pdfUrl) return;
    const absoluteUrl = toAbsolutePdfUrl(pdfUrl);
    if (!absoluteUrl || seen.has(absoluteUrl)) return;
    seen.add(absoluteUrl);
    downloads.push({
      url: absoluteUrl,
      name: getDownloadFileName(absoluteUrl, topicData.title || topic),
    });
  });

  if (!downloads.length) return;

  const usedNames = new Set();
  downloads.forEach((item) => {
    let name = item.name;
    if (usedNames.has(name)) {
      const base = name.replace(/\.pdf$/i, "");
      let index = 2;
      while (usedNames.has(`${base} (${index}).pdf`)) {
        index += 1;
      }
      name = `${base} (${index}).pdf`;
    }
    usedNames.add(name);
    item.name = name;
  });

  const files = [];
  for (const item of downloads) {
    try {
      const response = await fetch(item.url, { cache: "no-store" });
      if (!response.ok) continue;
      const buffer = await response.arrayBuffer();
      files.push({ name: item.name, data: buffer });
    } catch (error) {
      console.error("Failed to fetch PDF for zip:", item.url, error);
    }
  }

  if (!files.length) return;

  const zipBlob = createZipArchive(files);
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(zipBlob);
  link.href = objectUrl;
  link.download = getZipFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function getDownloadFileName(url, fallbackTitle) {
  let fileName = "";
  try {
    const parsedUrl = new URL(url);
    fileName = decodeURIComponent(parsedUrl.pathname.split("/").pop() || "");
  } catch (error) {
    fileName = (url || "").split("/").pop() || "";
  }
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    fileName = `${(fallbackTitle || "note").replace(/[^a-z0-9]+/gi, "-")}.pdf`;
  }
  return fileName || "note.pdf";
}

function getZipFileName() {
  const label = sidebarBadge ? sidebarBadge.textContent.trim() : "notes";
  const safeLabel = label.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${safeLabel || "notes"}-all.zip`;
}

function createZipArchive(files) {
  const encoder = new TextEncoder();
  const fileEntries = [];
  let offset = 0;
  const localParts = [];

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = new Uint8Array(file.data);
    const crc = crc32(dataBytes);
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);

    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, dataBytes.length, true);
    view.setUint32(22, dataBytes.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(nameBytes, 30);

    localParts.push(header, dataBytes);
    fileEntries.push({
      nameBytes,
      crc,
      size: dataBytes.length,
      offset,
    });
    offset += header.length + dataBytes.length;
  });

  const centralParts = [];
  let centralSize = 0;
  fileEntries.forEach((entry) => {
    const header = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.size, true);
    view.setUint32(24, entry.size, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    header.set(entry.nameBytes, 46);
    centralParts.push(header);
    centralSize += header.length;
  });

  const endHeader = new Uint8Array(22);
  const endView = new DataView(endHeader.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  const totalSize =
    localParts.reduce((sum, part) => sum + part.length, 0) +
    centralParts.reduce((sum, part) => sum + part.length, 0) +
    endHeader.length;
  const output = new Uint8Array(totalSize);
  let cursor = 0;
  localParts.forEach((part) => {
    output.set(part, cursor);
    cursor += part.length;
  });
  centralParts.forEach((part) => {
    output.set(part, cursor);
    cursor += part.length;
  });
  output.set(endHeader, cursor);

  return new Blob([output], { type: "application/zip" });
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
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
    const rootPdf = pdfUrl.startsWith("/") || pdfUrl.startsWith("http") ? pdfUrl : "/" + pdfUrl; return new URL(rootPdf, window.location.origin).href;
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
    const rootPdf = pdfUrl.startsWith("/") || pdfUrl.startsWith("http") ? pdfUrl : "/" + pdfUrl; const headResponse = await fetch(rootPdf, {
      method: "HEAD",
      cache: "no-store",
    });
    if (headResponse.ok) {
      return true;
    }

    if (headResponse.status === 405 || headResponse.status === 403) {
      const getResponse = await fetch(rootPdf, {
        method: "GET",
        cache: "no-store",
      });
      return getResponse.ok;
    }

    return false;
  } catch (error) {
    try {
      const getResponse = await fetch(rootPdf, {
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
      let viewerUrl = pdfUrl.startsWith("/") || pdfUrl.startsWith("http") ? pdfUrl : "/" + pdfUrl;
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


