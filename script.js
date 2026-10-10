// ========================================
// 1. SELECT HTML ELEMENTS
// ========================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const resumeModal = document.getElementById("resumeModal");
const reviewResume = document.getElementById("reviewResume");
const closeResume = document.getElementById("closeResume");
const downloadResume = document.getElementById("downloadResume");
const printResume = document.getElementById("printResume");

// Automatically update the footer year.
document.getElementById("year").textContent =
  new Date().getFullYear();


// ========================================
// 2. MOBILE NAVIGATION
// ========================================

menuBtn.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(opened));

  menuBtn.setAttribute(
    "aria-label",
    opened ? "Close navigation" : "Open navigation"
  );

  menuBtn.textContent = opened ? "✕" : "☰";
});

// Close the mobile menu after selecting a link.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");

    menuBtn.textContent = "☰";
  });
});


// ========================================
// 3. LIGHT MODE AND DARK MODE
// ========================================

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  const isLight = theme === "light";

  themeIcon.textContent = isLight ? "☾" : "☀";
  themeLabel.textContent = isLight ? "Dark" : "Light";

  themeToggle.setAttribute(
    "aria-label",
    isLight
      ? "Switch to dark mode"
      : "Switch to light mode"
  );
}

// Read the previously saved theme.
function getSavedTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch (error) {
    return null;
  }
}

// Save the selected theme safely.
function saveTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
}

// Use the saved theme, or default to dark mode.
const savedTheme = getSavedTheme();

setTheme(
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : "dark"
);

// Switch themes when the button is clicked.
themeToggle.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.dataset.theme;

  const nextTheme =
    currentTheme === "light" ? "dark" : "light";

  setTheme(nextTheme);
  saveTheme(nextTheme);
});


// ========================================
// 4. OPEN THE RESUME PREVIEW
// ========================================

function openResume() {
  resumeModal.classList.add("open");

  resumeModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  closeResume.focus();
}

// Open the resume using either button.
reviewResume.addEventListener("click", openResume);


// ========================================
// 5. CLOSE THE RESUME PREVIEW
// ========================================

function closeResumeWindow() {
  resumeModal.classList.remove("open");

  resumeModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  reviewResume.focus();
}

closeResume.addEventListener(
  "click",
  closeResumeWindow
);

// Close when the user clicks the dark overlay.
resumeModal.addEventListener("click", (event) => {
  if (event.target === resumeModal) {
    closeResumeWindow();
  }
});

// Close the resume when Escape is pressed.
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    resumeModal.classList.contains("open")
  ) {
    closeResumeWindow();
  }
});


// ========================================
// 6. DOWNLOAD RESUME AS PDF
// ========================================

function saveResumeAsPDF() {
  const resume = document.getElementById("resumePaper");

  if (!resume) {
    alert("Resume content could not be found.");
    return;
  }

  // Open a separate window containing only the resume.
  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=750"
  );

  // The browser may block pop-up windows.
  if (!printWindow) {
    alert(
      "The print window was blocked. Allow pop-ups " +
      "for this website and try again."
    );
    return;
  }

  // Dedicated A4 styling for the printed resume.
  const printStyles = `
    <style>
      @page {
        size: A4;
        margin: 14mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #ffffff;
        color: #222222;
        font: 10pt/1.4 Arial, sans-serif;
      }

      h1 {
        font-size: 23pt;
        text-align: center;
        margin: 0 0 3px;
      }

      h2 {
        font-size: 11.5pt;
        color: #34306c;
        border-bottom: 1px solid #aaaaaa;
        margin: 13px 0 6px;
        padding-bottom: 3px;
        break-after: avoid;
      }

      p {
        margin: 4px 0;
        overflow-wrap: anywhere;
      }

      .resume-subtitle,
      .resume-contact {
        text-align: center;
        font-size: 9.5pt;
      }

      ul {
        padding-left: 18px;
        margin: 4px 0;
      }

      .resume-project {
        margin: 7px 0;
        break-inside: avoid;
      }

      .resume-small {
        color: #555555;
        font-size: 8.5pt;
        overflow-wrap: anywhere;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `;

  // Print the resume only, without the portfolio navigation.
  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
        <title>Anisha Parmar - Resume</title>
        ${printStyles}
      </head>
      <body>
        ${resume.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait until the new document has loaded before printing.
  printWindow.addEventListener(
    "load",
    () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    },
    { once: true }
  );
}

// Main Download Resume button.
downloadResume.addEventListener(
  "click",
  saveResumeAsPDF
);

// Save as PDF button inside the resume preview.
printResume.addEventListener(
  "click",
  saveResumeAsPDF
);