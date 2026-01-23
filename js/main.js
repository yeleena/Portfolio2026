(() => {
  "use strict";

  // Enable JS-only effects (reveal animations)
  document.documentElement.classList.add("js");

  /* ============================
     Helpers
  ============================ */
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ============================
     Preloader
  ============================ */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (!pre) return;
    pre.style.opacity = "0";
    pre.style.pointerEvents = "none";
    setTimeout(() => pre.remove(), 350);
  });

  /* ============================
     Year
  ============================ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================
     Sticky header shadow
  ============================ */
  const header = $(".header");
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ============================
     Mobile menu
  ============================ */
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    // Close on link click (mobile)
    $$("a", nav).forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ============================
     Reveal on scroll
  ============================ */
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============================
     Skills animation
  ============================ */
  const skillLines = $$(".skill-line");
  if (skillLines.length) {
    const ioSkills = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-animated");
        });
      },
      { threshold: 0.25 },
    );
    skillLines.forEach((el) => ioSkills.observe(el));
  }

  /* ============================
     To Top button
  ============================ */
  const toTop = $("#toTop");
  if (toTop) {
    const onScroll = () => {
      toTop.style.display = window.scrollY > 500 ? "flex" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================
     Project filters
  ============================ */
  const filterBtns = $$(".filter-btn");
  const items = $$(".netflix__item");
  if (filterBtns.length && items.length) {
    const setActive = (btn) => {
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
    };

    const apply = (filter) => {
      items.forEach((it) => {
        const tech = it.getAttribute("data-tech");
        const show = filter === "all" || tech === filter;
        it.classList.toggle("is-hidden", !show);
        it.style.display = show ? "" : "none";
      });
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        setActive(btn);
        apply(filter);
      });
    });
  }

  /* ============================
     Netflix carousel buttons
  ============================ */
  const track = $(".netflix__track");
  const prevBtn = $("[data-netflix-prev]");
  const nextBtn = $("[data-netflix-next]");
  if (track && prevBtn && nextBtn) {
    const scrollBy = () => Math.min(track.clientWidth * 0.9, 620);

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollBy(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollBy(), behavior: "smooth" });
    });
  }

  /* ============================
     Project modal (YouTube iframe lightbox)
  ============================ */
  const modal = $("#projectModal");
  const modalVideo = $("#projectModalVideo"); // iframe in the modal
  const modalTitle = $("#projectModalTitle");
  const modalDesc = $("#projectModalDesc");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // For YouTube iframe: just clear src to stop playback
    if (modalVideo) {
      modalVideo.setAttribute("src", "");
    }
  };

  if (modal && modalVideo && modalTitle && modalDesc && items.length) {
    let currentIndex = 0;

    const openAt = (index) => {
      const fig = items[index];
      if (!fig) return;

      // ✅ NOW we read the iframe inside the card (YouTube)
      const iframe = $("iframe", fig);
      const title = $(".cap__title", fig)?.textContent || "";
      const meta = $(".cap__meta", fig)?.textContent || "";

      const src = iframe?.getAttribute("src") || "";
      if (src) {
        // Add autoplay when opening in modal
        modalVideo.setAttribute(
          "src",
          src + (src.includes("?") ? "&" : "?") + "autoplay=1",
        );
      }

      modalTitle.textContent = title;
      modalDesc.textContent = meta;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const go = (dir) => {
      currentIndex = (currentIndex + dir + items.length) % items.length;
      openAt(currentIndex);
    };

    items.forEach((fig, i) => {
      fig.addEventListener("click", () => {
        currentIndex = i;
        openAt(currentIndex);
      });
    });

    // Close: X button + backdrop
    $$("[data-close]", modal).forEach((el) =>
      el.addEventListener("click", closeModal),
    );

    // Prev/Next buttons in modal (if present)
    $("[data-modal-prev]", modal)?.addEventListener("click", (e) => {
      e.stopPropagation();
      go(-1);
    });
    $("[data-modal-next]", modal)?.addEventListener("click", (e) => {
      e.stopPropagation();
      go(1);
    });

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }

  /* ============================
     Contact form (basic front validation)
  ============================ */
  const form = $("#contactForm");
  const msg = $("#formMsg");
  if (form && msg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.elements["name"]?.value?.trim();
      const email = form.elements["email"]?.value?.trim();
      const message = form.elements["message"]?.value?.trim();

      if (!name || !email || !message) {
        msg.textContent = "Please fill in all fields.";
        return;
      }

      msg.textContent =
        "Message ready to send (connect it to a backend later).";
      form.reset();
    });
  }
})();
