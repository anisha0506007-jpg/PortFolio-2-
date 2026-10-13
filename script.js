const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const resumeModal = document.getElementById("resumeModal");
const reviewResume = document.getElementById("reviewResume");
const closeResume = document.getElementById("closeResume");
const printResume = document.getElementById("printResume");

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitContact = document.getElementById("submitContact");

document.getElementById("year").textContent =
  new Date().getFullYear();



menuBtn.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(opened));
  menuBtn.setAttribute(
    "aria-label",
    opened ? "Close navigation" : "Open navigation"
  );

  menuBtn.textContent = opened ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
    menuBtn.textContent = "☰";
  });
});



function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  const isLight = theme === "light";

  themeIcon.textContent = isLight ? "☾" : "☀";
  themeLabel.textContent = isLight ? "Dark" : "Light";

  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
}

function getSavedTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
}

const savedTheme = getSavedTheme();

setTheme(
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : "dark"
);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  setTheme(nextTheme);
  saveTheme(nextTheme);
});


function openResume() {
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
  closeResume.focus();
}

reviewResume.addEventListener("click", openResume);


function closeResumeWindow() {
  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
  reviewResume.focus();
}

closeResume.addEventListener("click", closeResumeWindow);

resumeModal.addEventListener("click", (event) => {
  if (event.target === resumeModal) {
    closeResumeWindow();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    resumeModal.classList.contains("open")
  ) {
    closeResumeWindow();
  }
});



function saveResumeAsPDF() {
  const resume = document.getElementById("resumePaper");

  if (!resume) {
    alert("Resume content could not be found.");
    return;
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=750"
  );

  if (!printWindow) {
    alert(
      "The print window was blocked. Allow pop-ups " +
      "for this website and try again."
    );
    return;
  }

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

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

printResume.addEventListener("click", saveResumeAsPDF);



contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.className = "form-status";

  const formEndpoint = contactForm.action;

  submitContact.disabled = true;
  submitContact.textContent = "Sending message...";

  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      formStatus.textContent =
        "Message submitted successfully! Please check your email or Formspree inbox for confirmation.";
      formStatus.classList.add("success");

      contactForm.reset();
    } else {
      const details = Array.isArray(result.errors)
        ? result.errors.map((item) => item.message).join(" ")
        : "";

      formStatus.textContent =
        details ||
        `Message could not be sent (HTTP ${response.status}). Check your Formspree form settings.`;

      formStatus.classList.add("error");
      console.error("Formspree error:", result);
    }
  } catch (error) {
    formStatus.textContent =
      "Network error. Check your internet connection and try again.";

    formStatus.classList.add("error");
    console.error("Contact form error:", error);
  } finally {
    submitContact.disabled = false;
    submitContact.textContent = "Send Message ↗";
  }
});
