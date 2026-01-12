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
      { threshold: 0.15 }
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
      { threshold: 0.25 }
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
     Project modal (video lightbox)
  ============================ */
  const modal = $("#projectModal");
  const modalVideo = $("#projectModalVideo");
  const modalTitle = $("#projectModalTitle");
  const modalDesc = $("#projectModalDesc");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.load();
    }
  };

  if (modal && modalVideo && modalTitle && modalDesc && items.length) {
    items.forEach((fig) => {
      fig.addEventListener("click", () => {
        const video = $("video", fig);
        const title = $(".cap__title", fig)?.textContent || "";
        const meta = $(".cap__meta", fig)?.textContent || "";

        if (video?.getAttribute("src")) {
          modalVideo.setAttribute("src", video.getAttribute("src"));
        }

        modalTitle.textContent = title;
        modalDesc.textContent = meta;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        modalVideo.play().catch(() => {});
      });
    });

    $$("[data-close]", modal).forEach((el) =>
      el.addEventListener("click", closeModal)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
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
