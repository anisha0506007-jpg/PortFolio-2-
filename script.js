const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(opened));
  menuBtn.setAttribute(
    "aria-label",
    opened ? "Close navigation" : "Open navigation"
  );
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (
    navLinks?.classList.contains("open") &&
    !navLinks.contains(event.target) &&
    !menuBtn?.contains(event.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  const dark = theme === "dark";

  if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
  if (themeLabel) themeLabel.textContent = dark ? "Light mode" : "Dark mode";

  themeToggle?.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode"
  );
}

let savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch {
}

applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  applyTheme(next);

  try {
    localStorage.setItem("portfolio-theme", next);
  } catch {
  }
});

const resumeModal = document.getElementById("resumeModal");
const reviewResume = document.getElementById("reviewResume");
const closeResume = document.getElementById("closeResume");
const modalBackdrop = document.getElementById("modalBackdrop");

let previousFocus = null;

function openResume() {
  if (!resumeModal) return;

  previousFocus = document.activeElement;
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeResume?.focus();
}

function hideResume() {
  if (!resumeModal) return;

  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

reviewResume?.addEventListener("click", openResume);
closeResume?.addEventListener("click", hideResume);
modalBackdrop?.addEventListener("click", hideResume);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    resumeModal?.classList.contains("open")
  ) {
    hideResume();
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -25px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
  backToTop?.classList.toggle("visible", window.scrollY > 400);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener("click", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: reducedMotion ? "auto" : "smooth"
  });
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const originalButton = submitBtn?.innerHTML;

  if (formStatus) {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Unable to send the message.");
    }

    if (formStatus) {
      formStatus.textContent =
        "Thanks for reaching out! Your message was sent successfully.";
      formStatus.classList.add("success");
    }

    contactForm.reset();
  } catch (error) {
    if (formStatus) {
      formStatus.textContent =
        "Message could not be sent. Please try again or email me directly.";
      formStatus.classList.add("error");
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        originalButton || 'Send message <span>↗</span>';
    }
  }
});

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
