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

  root.classList.add("theme-anim");
  setTimeout(() => root.classList.remove("theme-anim"), 600);

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

const fieldMessages = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  message: "Please write a short message."
};

function checkField(input) {
  const field = input.closest(".field");
  const err = field?.querySelector(".err");
  const ok = input.value.trim() !== "" && input.checkValidity();
  field?.classList.toggle("invalid", !ok);
  field?.classList.toggle("valid", ok);
  input.setAttribute("aria-invalid", String(!ok));
  if (err) err.textContent = ok ? "" : fieldMessages[input.name] || "This field is required.";
  return ok;
}

function validateForm() {
  const inputs = [...contactForm.querySelectorAll("input, textarea")];
  const results = inputs.map(checkField);
  const firstBad = inputs[results.indexOf(false)];
  firstBad?.focus();
  return !firstBad;
}

contactForm?.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("blur", () => input.value && checkField(input));
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("invalid")) checkField(input);
  });
});
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

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
    contactForm.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
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


/* ---------- Added in redesign ---------- */

// Floating nav: blur/shadow once scrolled
const siteHeader = document.getElementById("header");
const onScrollHeader = () => siteHeader?.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

// Active section highlighting
const sectionLinks = [...document.querySelectorAll(".nav-links a")];
const sectionMap = new Map(
  sectionLinks.map((a) => [document.querySelector(a.getAttribute("href")), a])
);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((a) => {
          a.classList.remove("active");
          a.removeAttribute("aria-current");
        });
        const link = sectionMap.get(entry.target);
        link?.classList.add("active");
        link?.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sectionMap.forEach((_, section) => section && spy.observe(section));
}

// Footer back-to-top reuses the floating button's behaviour
document.getElementById("footerTop")?.addEventListener("click", () => backToTop?.click());

// Keep keyboard focus inside the resume modal while it is open
document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !resumeModal?.classList.contains("open")) return;
  const focusable = resumeModal.querySelectorAll("a[href], button:not([disabled]), iframe");
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

// Pointer-only enhancements (skipped for touch and reduced motion)
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (finePointer && !calm) {
  // Spotlight on cards
  document.querySelectorAll(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Magnetic buttons
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });

  // Cursor ring that follows the pointer; native cursor stays visible
  const ring = document.getElementById("cursor");
  let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
  const follow = () => {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    ring.style.transform = `translate(${cx}px, ${cy}px)`;
    if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) requestAnimationFrame(follow);
    else running = false;
  };
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    ring?.classList.add("on");
    if (!running) { running = true; requestAnimationFrame(follow); }
  });
  document.documentElement.addEventListener("pointerleave", () => ring?.classList.remove("on"));
  document.querySelectorAll("a, button, .tech li").forEach((el) => {
    el.addEventListener("pointerenter", () => ring?.classList.add("big"));
    el.addEventListener("pointerleave", () => ring?.classList.remove("big"));
  });
}