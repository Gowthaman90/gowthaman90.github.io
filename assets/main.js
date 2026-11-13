/* Gowthaman Arumugam — profile site interactions */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- scroll-spy ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- writing pagination ---------- */
  var wList = document.querySelector(".writing-list[data-page-size]");
  var pager = document.querySelector(".writing-pager");
  if (wList && pager) {
    var items = Array.prototype.slice.call(wList.querySelectorAll(".writing-item"));
    var size = parseInt(wList.getAttribute("data-page-size"), 10) || 6;
    var pages = Math.ceil(items.length / size);
    if (pages > 1) {
      var current = 1;
      var section = document.getElementById("writing");
      var mkBtn = function (label, aria, onClick) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        if (aria) b.setAttribute("aria-label", aria);
        b.addEventListener("click", onClick);
        return b;
      };
      var render = function (page, scroll) {
        current = page;
        var start = (page - 1) * size, end = start + size;
        items.forEach(function (el, i) {
          var show = i >= start && i < end;
          el.hidden = !show;
          if (show) el.classList.add("in");
        });
        pager.innerHTML = "";
        var prev = mkBtn("← Prev", "Previous page", function () { render(current - 1, true); });
        prev.disabled = page === 1;
        pager.appendChild(prev);
        for (var p = 1; p <= pages; p++) {
          (function (n) {
            var b = mkBtn(String(n), "Page " + n, function () { render(n, true); });
            if (n === page) b.setAttribute("aria-current", "page");
            pager.appendChild(b);
          })(p);
        }
        var next = mkBtn("Next →", "Next page", function () { render(current + 1, true); });
        next.disabled = page === pages;
        pager.appendChild(next);
        var status = document.createElement("span");
        status.className = "writing-pager-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = "Showing " + (start + 1) + "–" + Math.min(end, items.length) + " of " + items.length + " articles";
        pager.appendChild(status);
        if (scroll && section && section.getBoundingClientRect().top < 0) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      pager.hidden = false;
      render(1, false);
    }
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
