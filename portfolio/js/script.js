/**
 * Diksha Shukla — Personal Portfolio Interaction Controller
 * Samsung Innovation Campus Exercise • Version 1.0
 * Lightweight, Accessible, Dependency-Free Vanilla JavaScript
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM REFERENCES & CACHED SELECTORS
  // --------------------------------------------------------------------------
  const rootHtml = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('reading-progress');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // --------------------------------------------------------------------------
  // 2. THEME CONTROLLER (Dark / Light Theme with localStorage)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'diksha_portfolio_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default dark
    applyTheme(initialTheme);
  }

  function applyTheme(theme) {
    rootHtml.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleIcon(theme);
  }

  function updateThemeToggleIcon(theme) {
    if (!themeToggleBtn) return;
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeToggleBtn.innerHTML = isDark
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Switched to Dark Theme' : 'Switched to Light Theme');
    });
  }

  // --------------------------------------------------------------------------
  // 3. READING PROGRESS & SCROLL ACTIONS
  // --------------------------------------------------------------------------
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollEffects();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateScrollEffects() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress bar width
    if (progressBar && scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = progressPercent + '%';
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Scroll Spy
    updateScrollSpy(scrollTop);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION TOGGLE (ARIA & Accessible)
  // --------------------------------------------------------------------------
  if (mobileNavToggle && navLinksList) {
    mobileNavToggle.addEventListener('click', function () {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      setMobileNav(!isExpanded);
    });

    // Close on navigation link click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMobileNav(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!mobileNavToggle.contains(e.target) && !navLinksList.contains(e.target)) {
        setMobileNav(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setMobileNav(false);
      }
    });
  }

  function setMobileNav(open) {
    if (!mobileNavToggle || !navLinksList) return;
    mobileNavToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      navLinksList.classList.add('open');
    } else {
      navLinksList.classList.remove('open');
    }
  }

  // --------------------------------------------------------------------------
  // 5. SCROLL SPY (Highlight Active Navigation Link)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateScrollSpy(scrollPos) {
    const offset = 120;
    sections.forEach(function (section) {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. INTERSECTION OBSERVER (Smooth Scroll Reveal)
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 7. PROJECT FILTER TABS
  // --------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      projectFilterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(function (card) {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(function () {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. SKILL CATEGORY TABS
  // --------------------------------------------------------------------------
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      skillTabBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-skill-filter') || 'all';

      skillCards.forEach(function (card) {
        const cat = card.getAttribute('data-skill-cat') || '';
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. COPY TO CLIPBOARD WITH FLOATING TOAST
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('[data-copy-text]');

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const textToCopy = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(function () {
            showToast(`Copied ${label} to clipboard!`);
          })
          .catch(function () {
            fallbackCopy(textToCopy, label);
          });
      } else {
        fallbackCopy(textToCopy, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${label} to clipboard!`);
    } catch (err) {
      showToast(`Could not copy automatically. Value: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastNotification.classList.remove('active');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 10. RECRUITER CONTACT FORM HANDLER (Validation & Direct Mailto Fallback)
  // --------------------------------------------------------------------------
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('message-subject');
      const messageInput = document.getElementById('sender-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Recruiter Opportunity for Diksha Shukla';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email || !message) {
        formStatus.className = 'form-status-msg error';
        formStatus.textContent = 'Please fill out all required fields (Name, Email, and Message).';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.className = 'form-status-msg error';
        formStatus.textContent = 'Please provide a valid email address.';
        return;
      }

      // Success feedback
      formStatus.className = 'form-status-msg success';
      formStatus.innerHTML = `<strong>Thank you, ${escapeHtml(name)}!</strong> Opening your email client to connect directly with Diksha Shukla...`;

      // Compose mailto
      const mailtoUrl = `mailto:dikshashukla728@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `Hi Diksha,\n\nMy name is ${name} (${email}).\n\nMessage:\n${message}\n\nLooking forward to speaking with you!`
      )}`;

      setTimeout(function () {
        window.location.href = mailtoUrl;
      }, 800);

      contactForm.reset();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 11. INITIALIZATION ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initScrollReveal();
    updateScrollEffects();
  });
})();
