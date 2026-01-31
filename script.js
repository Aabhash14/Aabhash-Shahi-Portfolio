const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav a[href^=\"#\"]");

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section, .card, .timeline-item, .hero-card").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const typewriterEl = document.querySelector("#typewriter");
if (typewriterEl) {
  const phrases = ["Aabhash Shahi", "an aspiring QA"];
  const typingSpeed = 95;
  const pauseAfter = 2200;
  let phraseIndex = 0;
  let charIndex = 0;

  const type = () => {
    typewriterEl.classList.add("is-typing");
    const current = phrases[phraseIndex];
    if (charIndex <= current.length) {
      typewriterEl.textContent = current.slice(0, charIndex);
      charIndex += 1;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(() => {
        charIndex = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typewriterEl.textContent = "";
        type();
      }, pauseAfter);
    }
  };

  type();
}

const feedbackForm = document.querySelector(".feedback-form");
if (feedbackForm) {
  const statusEl = feedbackForm.querySelector(".feedback-status");
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (statusEl) {
      statusEl.textContent = "Sending...";
    }
    try {
      const formData = new FormData(feedbackForm);
      await fetch(feedbackForm.action, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      if (statusEl) {
        statusEl.textContent = "Thanks! Your feedback was sent.";
      }
      feedbackForm.reset();
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = "Sorry, something went wrong. Please try again.";
      }
    }
  });
}

const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDesc = document.querySelector("#modal-desc");
const modalHighlights = document.querySelector("#modal-highlights");
const modalLearn = document.querySelector("#modal-learn");
const modalLink = document.querySelector("#modal-link");
const modalVideoLink = document.querySelector("#modal-video-link");
const modalEmbed = document.querySelector("#modal-embed");
const modalVideoSection = document.querySelector("#modal-video-section");
const modalVideo = document.querySelector("#modal-video");
const modalHighlightsSection = document.querySelector("#modal-highlights-section");
const modalLearnSection = document.querySelector("#modal-learn-section");
const modalLinkSection = document.querySelector("#modal-link-section");
let modalIframe = document.querySelector("#modal-iframe");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".link-button").forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.getAttribute("data-title");
    const desc = button.getAttribute("data-desc");
    const highlights = button.getAttribute("data-highlights");
    const learn = button.getAttribute("data-learn");
    const link = button.getAttribute("data-link");
    const embed = button.getAttribute("data-embed");
    const video = button.getAttribute("data-video");
    const simple = button.getAttribute("data-simple") === "true";

    modalTitle.textContent = title || "";
    modalDesc.textContent = desc || "";
    modalLearn.textContent = learn || "";
    modalHighlights.innerHTML = "";
    if (highlights) {
      highlights.split(";").forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.trim();
        modalHighlights.appendChild(li);
      });
    }
    modalLink.setAttribute("href", link || "#");

    if (simple) {
      if (modalDesc) modalDesc.style.display = "none";
      if (modalHighlightsSection) modalHighlightsSection.style.display = "none";
      if (modalLearnSection) modalLearnSection.style.display = "none";
      if (modalLinkSection) modalLinkSection.style.display = "none";
    } else {
      if (modalDesc) modalDesc.style.display = "";
      if (modalHighlightsSection) modalHighlightsSection.style.display = "";
      if (modalLearnSection) modalLearnSection.style.display = "";
      if (modalLinkSection) modalLinkSection.style.display = "";
    }

    if (embed && modalEmbed && modalIframe) {
      const isImage = /\.(png|jpe?g|gif|webp)$/i.test(embed);
      if (isImage) {
        if (modalIframe.tagName.toLowerCase() !== "img") {
          modalIframe.outerHTML = '<img id="modal-iframe" alt="Certificate preview" />';
          modalIframe = document.querySelector("#modal-iframe");
        }
        modalIframe.setAttribute("src", embed);
      } else {
        if (modalIframe.tagName.toLowerCase() !== "iframe") {
          modalIframe.outerHTML = '<iframe id="modal-iframe" title="Project preview" loading="lazy"></iframe>';
          modalIframe = document.querySelector("#modal-iframe");
        }
        modalIframe.setAttribute("src", embed);
      }
      modalEmbed.classList.add("is-visible");
    } else if (modalEmbed && modalIframe) {
      modalIframe.removeAttribute("src");
      modalEmbed.classList.remove("is-visible");
    }

    if (video && modalVideoSection && modalVideo && modalVideoLink) {
      modalVideo.setAttribute("src", video);
      modalVideoSection.classList.add("is-visible");
      modalVideoLink.setAttribute("href", video);
      modalVideoLink.style.display = "inline-flex";
    } else if (modalVideoSection && modalVideo && modalVideoLink) {
      modalVideo.removeAttribute("src");
      modalVideoSection.classList.remove("is-visible");
      modalVideoLink.style.display = "none";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });
});

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (modalDesc) modalDesc.style.display = "";
  if (modalHighlightsSection) modalHighlightsSection.style.display = "";
  if (modalLearnSection) modalLearnSection.style.display = "";
  if (modalLinkSection) modalLinkSection.style.display = "";
  if (modalEmbed && modalIframe) {
    modalIframe.removeAttribute("src");
    modalEmbed.classList.remove("is-visible");
  }
  if (modalVideoSection && modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideoSection.classList.remove("is-visible");
  }
  if (modalVideoLink) {
    modalVideoLink.style.display = "none";
  }
};

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}
