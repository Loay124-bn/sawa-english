/* ==========================================================================
   Sawa English — main.js
   Vanilla JS: theme toggle, nav behaviour, scroll reveals, animated counters,
   FAQ accordion, mobile menu.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "sawa-theme";

  /* ---------------------------- Theme handling ---------------------------- */

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }

    if (stored) {
      applyTheme(stored);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }

  function toggleTheme() {
    var isDark = root.classList.contains("dark");
    var next = isDark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
  }

  initTheme();

  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtns = document.querySelectorAll("[data-theme-toggle]");
    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });

    /* ------------------------------- Nav bar ------------------------------- */

    var nav = document.querySelector(".nav");
    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 12) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ------------------------------ Mobile menu ----------------------------- */

    var menuBtn = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector(".mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
      mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mobileMenu.classList.remove("open");
        });
      });
    }

    /* -------------------------- Scroll reveal effect ------------------------ */

    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }

    /* ------------------------------ FAQ accordion --------------------------- */

    var faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      var question = item.querySelector(".faq-q");
      if (!question) return;
      question.addEventListener("click", function () {
        var wasOpen = item.classList.contains("open");
        faqItems.forEach(function (i) { i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });

    /* ---------------------------- Animated counters -------------------------- */

    var counters = document.querySelectorAll("[data-count]");
    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      window.requestAnimationFrame(step);
    }

    if (counters.length) {
      if ("IntersectionObserver" in window) {
        var countIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCounter(entry.target);
                countIo.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
        counters.forEach(function (c) { countIo.observe(c); });
      } else {
        counters.forEach(animateCounter);
      }
    }

    /* --------------------------- Footer year stamp --------------------------- */

    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
