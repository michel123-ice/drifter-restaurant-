/* Drifters Kitchen Bar — interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var head = document.querySelector("[data-head]");
  var burger = document.querySelector("[data-burger]");
  var sheet = document.querySelector("[data-sheet]");
  var dock = document.querySelector(".dock");
  var modal = document.getElementById("menuModal");

  /* ---------- Header state + dock reveal ---------- */

  var hero = document.querySelector(".hero");
  var lastY = window.scrollY;
  var ticking = false;
  var navHidden = false;

  function onScroll() {
    var y = window.scrollY;
    var headLimit = 24;

    if (head) {
      head.classList.toggle("is-stuck", y > headLimit);
    }

    if (dock) {
      var heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 80 : 320;
      var pastHero = y > heroBottom;
      var down = y > lastY + 4;
      var up = y < lastY - 4;

      if (!pastHero) {
        navHidden = false;
      } else if (down) {
        navHidden = true;
      } else if (up) {
        navHidden = false;
      }

      dock.classList.toggle("is-shown", pastHero && !navHidden);
      document.documentElement.style.setProperty("--dock-h", pastHero && !navHidden ? "1px" : "0px");
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* ---------- Mobile nav ---------- */

  function closeSheet() {
    if (!sheet || !burger) return;
    sheet.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    window.setTimeout(function () {
      if (!sheet.classList.contains("is-open")) sheet.hidden = true;
    }, 320);
  }

  function openSheet() {
    if (!sheet || !burger) return;
    sheet.hidden = false;
    document.body.classList.add("is-locked");
    // force reflow so the opacity transition runs
    void sheet.offsetWidth;
    sheet.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    var first = sheet.querySelector("a");
    if (first) first.focus({ preventScroll: true });
  }

  if (burger && sheet) {
    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") closeSheet();
      else openSheet();
    });

    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeSheet();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closeSheet();
        burger.focus();
      }
    });

    window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
      if (e.matches) closeSheet();
    });
  }

  /* ---------- Scroll reveal ---------- */

  var revealItems = document.querySelectorAll("[data-reveal]");

  function showNow(el) {
    el.classList.add("is-in");
    el.style.transitionDelay = "0ms";
  }

  if (revealItems.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    document.documentElement.classList.add("reveal-on");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showNow(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    function seed() {
      revealItems.forEach(function (el) {
        var r = el.getBoundingClientRect();
        // Already on screen (including deep links + back/forward restores)
        if (r.top < window.innerHeight * 0.92 && r.bottom > -window.innerHeight * 0.5) {
          showNow(el);
        } else if (!el.classList.contains("is-in")) {
          io.observe(el);
        }
      });
    }

    seed();
    window.addEventListener("hashchange", function () {
      window.setTimeout(seed, 60);
    });
    window.addEventListener("load", seed);

    // Safety net: nothing stays invisible longer than a moment after it is reached
    window.setTimeout(function () {
      revealItems.forEach(showNow);
    }, 4000);
  } else {
    revealItems.forEach(showNow);
  }

  /* ---------- Hero parallax ---------- */

  var parallax = document.querySelector("[data-parallax]");
  var canParallax = parallax && !reduceMotion.matches && window.matchMedia("(min-width: 760px)").matches;

  if (canParallax) {
    var pTick = false;
    window.addEventListener("scroll", function () {
      if (pTick) return;
      pTick = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          parallax.style.transform = "translate3d(0," + (y * 0.16).toFixed(2) + "px,0)";
        }
        pTick = false;
      });
    }, { passive: true });
  }

  /* ---------- Menu modal ---------- */

  var menuCopy = {
    "Breakfast": "The Breakfast menu is served at Drifters each morning. It isn't on the site just yet — call us and we'll happily talk you through it.",
    "Lunch & Dinner": "The Lunch & Dinner menu covers the main menu, served from midday into the evening. It isn't on the site just yet — call us for the current menu.",
    "Kids' Menu": "There's a Kids' Menu with smaller plates for younger guests. It isn't on the site just yet — call us and we'll tell you what's on it."
  };

  function openModal(name) {
    if (!modal || typeof modal.showModal !== "function") return;
    var title = modal.querySelector("[data-modal-title]");
    var copy = modal.querySelector("[data-modal-copy]");
    if (title) title.textContent = name;
    if (copy) {
      copy.innerHTML = (menuCopy[name] || "").replace(
        /(01243 673584)/,
        '<a href="tel:+441243673584">$1</a>'
      );
    }
    modal.showModal();
    document.body.classList.add("is-locked");
  }

  function closeModal() {
    if (!modal) return;
    modal.close();
    document.body.classList.remove("is-locked");
  }

  document.querySelectorAll("[data-menu]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-menu"));
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) closeModal();
    });
    modal.addEventListener("close", function () {
      document.body.classList.remove("is-locked");
    });
  }

  /* ---------- Smooth anchor scrolling (respect reduced motion) ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
})();
