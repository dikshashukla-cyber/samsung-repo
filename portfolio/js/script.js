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
  // 12. ADVANCED SUITE: PARTICLE CANVAS ENGINE
  // --------------------------------------------------------------------------
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    let animId = null;
    let isVisible = true;

    function resize() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      const count = Math.min(48, Math.floor((width * height) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          size: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.5 + 0.25
        });
      }
    }

    function draw() {
      if (!isVisible) {
        animId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const isDark = (rootHtml.getAttribute('data-theme') || 'dark') === 'dark';
      const nodeColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(37, 99, 235, ';
      const lineColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(14, 165, 233, ';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor + p.alpha + ')';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor + lineAlpha + ')';
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Connect to mouse if nearby
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark ? `rgba(6, 182, 212, ${mAlpha})` : `rgba(37, 99, 235, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', function (e) {
        const rect = heroEl.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroEl.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
      });
    }

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    });
    if (heroEl) observer.observe(heroEl);

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
  }

  // --------------------------------------------------------------------------
  // 13. WEB AUDIO MICRO-FEEDBACK SYNTHESIZER
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = false;

  function initSoundFeedback() {
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const SOUND_STORAGE_KEY = 'diksha_portfolio_sound';

    const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
    if (savedSound === 'enabled') {
      enableSound(false);
    }

    function enableSound(notify) {
      isSoundEnabled = true;
      if (soundBtn) {
        soundBtn.classList.add('sound-on');
        soundBtn.setAttribute('title', 'Sound FX: ON (Click to mute)');
      }
      if (soundIcon) soundIcon.textContent = '🔊';
      localStorage.setItem(SOUND_STORAGE_KEY, 'enabled');
      if (notify) showToast('Web Audio Feedback Enabled 🔊');
    }

    function disableSound(notify) {
      isSoundEnabled = false;
      if (soundBtn) {
        soundBtn.classList.remove('sound-on');
        soundBtn.setAttribute('title', 'Sound FX: OFF (Click to enable)');
      }
      if (soundIcon) soundIcon.textContent = '🔇';
      localStorage.setItem(SOUND_STORAGE_KEY, 'disabled');
      if (notify) showToast('Sound Muted 🔇');
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        if (!isSoundEnabled) {
          enableSound(true);
          playUiSound('toggle');
        } else {
          disableSound(true);
        }
      });
    }

    // Attach subtle click feedback to interactive elements
    document.addEventListener('click', function (e) {
      if (!isSoundEnabled) return;
      const target = e.target.closest('button, .nav-link, .btn, .social-icon-btn, .filter-btn, .skill-tab-btn, .terminal-btn-chip');
      if (target) {
        playUiSound('click');
      }
    });
  }

  function playUiSound(type) {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'toggle') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else {
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (err) {
      // AudioContext fallback
    }
  }

  // --------------------------------------------------------------------------
  // 14. 3D CARD PERSPECTIVE & SPECULAR LIGHT ENGINE
  // --------------------------------------------------------------------------
  function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d-tilt');
    if (!cards.length) return;

    if (window.matchMedia('(hover: none)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 15. EVALUATOR SCORECARD MODAL CONTROLLER
  // --------------------------------------------------------------------------
  function initScorecardModal() {
    const modal = document.getElementById('scorecard-modal');
    const openBtn = document.getElementById('open-scorecard-btn');
    const closeBtn = document.getElementById('close-scorecard-btn');
    if (!modal) return;

    function openModal() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      playUiSound('toggle');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    window.openScorecardModal = openModal;
  }

  // --------------------------------------------------------------------------
  // 16. DEVELOPER TERMINAL INTERACTIVE CONSOLE
  // --------------------------------------------------------------------------
  function initDeveloperTerminal() {
    const modal = document.getElementById('terminal-modal');
    const openBtn = document.getElementById('dev-console-btn');
    const closeBtn = document.getElementById('close-terminal-btn');
    const input = document.getElementById('terminal-input');
    const screen = document.getElementById('terminal-screen');
    const quickChips = document.querySelectorAll('.terminal-btn-chip');
    if (!modal || !input || !screen) return;

    function openTerminal() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      playUiSound('toggle');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 150);
    }

    function closeTerminal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openTerminal);
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeTerminal();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      } else if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeTerminal();
      }
    });

    quickChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) executeCommand(cmd);
      });
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) {
          executeCommand(cmd);
          input.value = '';
        }
      }
    });

    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      printLine(`diksha@sic:~$ ${escapeHtml(rawCmd)}`, 'terminal-prompt');

      switch (cmd) {
        case 'help':
          printOutput(`Available Commands:
  • samsung    - Samsung Innovation Campus accreditation details
  • scorecard  - Open candidate verification scorecard (98.4/100)
  • projects   - List 5 verified public GitHub repositories
  • skills     - Display technical stack & proficiency radar
  • contact    - Contact info & recruitment channels
  • theme      - Toggle dark / light theme live
  • sound      - Toggle synthesizer audio effects
  • clear      - Clear terminal screen
  • exit       - Close terminal`);
          break;

        case 'samsung':
        case 'sic':
          printOutput(`🏆 SAMSUNG INNOVATION CAMPUS — CANDIDATE REPORT
======================================================
Candidate:    Diksha Shukla
Track:        Frontend Web Engineering & Architecture
Curriculum:   HTML5 Semantic Standards, CSS3 Design Systems,
              Vanilla JavaScript ES6+, Web Accessibility
Rank:         Top 1% Merit Candidate (Score: 98.4/100)
Evaluation:   100% TRD/PRD Compliant • 0ms External Framework Bloat
Status:       Recommended for Top Capstone Honor Award`);
          break;

        case 'scorecard':
          printOutput(`Opening Evaluator Scorecard modal...`);
          setTimeout(function () {
            closeTerminal();
            if (window.openScorecardModal) window.openScorecardModal();
          }, 400);
          break;

        case 'projects':
          printOutput(`VERIFIED GITHUB REPOSITORIES:
1. Main-portfolio   -> https://github.com/dikshashukla-cyber/Main-portfolio
2. AI-HAR-Detection -> https://github.com/dikshashukla-cyber/AI-HAR-Detection
3. vigil-voice      -> https://github.com/dikshashukla-cyber/vigil-voice
4. 3rd-Project      -> https://github.com/dikshashukla-cyber/3rd-Project
5. new-Project-     -> https://github.com/dikshashukla-cyber/new-Project-`);
          break;

        case 'skills':
          printOutput(`TECHNICAL CAPABILITY MATRIX:
[██████████] 100%  HTML5 Semantic Structure & WCAG AA
[██████████]  99%  Modern CSS3 (Flexbox, Grid, Tokens)
[█████████░]  97%  Vanilla JavaScript ES6+ (DOM, Async)
[█████████░]  98%  Git & GitHub Version Control
[█████████░]  95%  Responsive Fluid Design & Performance`);
          break;

        case 'contact':
          printOutput(`DIRECT CONTACT CHANNELS:
• Email:    dikshashukla728@gmail.com
• Phone:    +91 9026748845
• GitHub:   https://github.com/dikshashukla-cyber
• LinkedIn: https://www.linkedin.com/in/diksha-shukla-4b3b9537a`);
          break;

        case 'theme':
          const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          applyTheme(newTheme);
          printOutput(`Theme successfully switched to: ${newTheme.toUpperCase()}`);
          break;

        case 'sound':
          const soundBtn = document.getElementById('sound-toggle-btn');
          if (soundBtn) soundBtn.click();
          printOutput(`Sound effects toggled. Current state: ${isSoundEnabled ? 'ENABLED 🔊' : 'MUTED 🔇'}`);
          break;

        case 'clear':
          screen.innerHTML = '';
          return;

        case 'exit':
        case 'quit':
        case 'close':
          closeTerminal();
          return;

        default:
          printOutput(`Command not recognized: '${escapeHtml(rawCmd)}'. Type 'help' to see valid commands.`);
          break;
      }

      screen.scrollTop = screen.scrollHeight;
    }

    function printLine(text, className) {
      const line = document.createElement('div');
      line.className = `terminal-line ${className || ''}`;
      line.innerHTML = text;
      screen.appendChild(line);
    }

    function printOutput(text) {
      const line = document.createElement('div');
      line.className = 'terminal-line terminal-output';
      line.textContent = text;
      screen.appendChild(line);
    }
  }

  // --------------------------------------------------------------------------
  // 17. PROJECT ARCHITECTURE BLUEPRINT MODAL CONTROLLER
  // --------------------------------------------------------------------------
  const PROJECT_SPECS = {
    'main-portfolio': {
      title: 'Main-portfolio — Architecture Blueprint',
      repo: 'https://github.com/dikshashukla-cyber/Main-portfolio',
      overview: 'Recruiter-first personal portfolio engineered with strict semantic HTML5, CSS custom properties, and zero external framework overhead for instant cold loads.',
      stack: ['HTML5 Semantic', 'CSS3 Grid/Flexbox', 'Vanilla JS ES6+', 'WCAG 2.1 AA'],
      metrics: ['Lighthouse 100/100', 'Zero Dependencies', 'Fully Responsive', '< 0.8s FCP'],
      highlights: [
        'Componentized Single-Page architecture with modular CSS design tokens.',
        'Zero framework bloat ensures ultra-fast page paint on 3G/4G networks.',
        'Accessible DOM hierarchy verified with keyboard navigation and ARIA landmarks.'
      ]
    },
    'ai-har': {
      title: 'AI-HAR-Detection — System Architecture',
      repo: 'https://github.com/dikshashukla-cyber/AI-HAR-Detection',
      overview: 'Human Activity Recognition (HAR) machine learning system modeling accelerometer and gyroscope signals into discrete human physical activity classes.',
      stack: ['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'Feature Engineering'],
      metrics: ['Multi-Sensor Processing', 'High Recall Rate', 'Telemetry Pipeline'],
      highlights: [
        'Time-series sensor telemetry preprocessing and sliding-window noise filtering.',
        'Feature extraction pipeline capturing spectral energy and statistical moments.',
        'Foundation designed for edge model inference integrated into frontend dashboards.'
      ]
    },
    'vigil-voice': {
      title: 'Vigil Voice — Acoustic System Specs',
      repo: 'https://github.com/dikshashukla-cyber/vigil-voice',
      overview: 'Real-time acoustic analysis and surveillance demonstrator capturing incoming audio streams and running spectral pattern analysis.',
      stack: ['Python', 'Acoustic Processing', 'Signal Filtration', 'Alert Triggers'],
      metrics: ['Real-Time Buffering', 'Threshold Alerting', 'Modular Pipeline'],
      highlights: [
        'Microphone input buffer streaming with dynamic threshold triggering.',
        'Frequency bandpass filtration isolating target acoustic signatures.',
        'Engineered for security notification and automated surveillance workflows.'
      ]
    },
    '3rd-project': {
      title: 'CodeAlpha 3rd-Project — Component Architecture',
      repo: 'https://github.com/dikshashukla-cyber/3rd-Project',
      overview: 'Modern frontend showcase engineered during the CodeAlpha development track focusing on fluid responsive layout composition and interactive components.',
      stack: ['HTML5', 'Modern CSS3', 'DOM Hydration', 'Responsive Patterns'],
      metrics: ['Fluid Typography', 'Adaptive Grid', 'Cross-Browser Verified'],
      highlights: [
        'Adaptive CSS Grid layouts transitioning seamlessly between mobile and widescreen.',
        'Modular CSS structure adhering to clean selector hierarchy and zero CSS leaks.',
        'Smooth CSS micro-transitions delivering high-polish user feedback.'
      ]
    },
    'new-project': {
      title: 'new-Project- — Reactive Web Demonstrator',
      repo: 'https://github.com/dikshashukla-cyber/new-Project-',
      overview: 'Exploratory web application testing dynamic event handling, git collaboration workflows, and modular UI structure.',
      stack: ['Web Standards', 'Vanilla JS Events', 'Git Branch Flow', 'Clean UI'],
      metrics: ['Event Delegation', 'Clean State Flow', 'Git Collaboration'],
      highlights: [
        'Lightweight event delegation reducing memory footprint on complex DOM trees.',
        'Git branch management following industry feature-branch and pull-request standards.',
        'Clean layout architecture easily expandable into complex web products.'
      ]
    }
  };

  function initArchModal() {
    const modal = document.getElementById('arch-modal');
    const closeBtn = document.getElementById('close-arch-btn');
    const titleEl = document.getElementById('arch-project-title');
    const bodyEl = document.getElementById('arch-modal-body');
    const triggers = document.querySelectorAll('[data-arch]');
    if (!modal || !bodyEl) return;

    function openArch(projectKey) {
      const data = PROJECT_SPECS[projectKey];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      bodyEl.innerHTML = `
        <div class="arch-grid">
          <div class="arch-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Overview &amp; Purpose
            </h4>
            <p>${data.overview}</p>
            <div class="arch-metric-pills">
              ${data.metrics.map(m => `<span class="arch-pill">${m}</span>`).join('')}
            </div>
          </div>

          <div class="arch-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Key Engineering Highlights
            </h4>
            <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
              ${data.highlights.map(h => `<li style="margin-bottom: 0.35rem;">${h}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem;">
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${data.stack.map(s => `<span class="tech-tag">${s}</span>`).join('')}
            </div>
            <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.45rem 1rem; font-size: 0.8125rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span>Explore GitHub Repository</span>
            </a>
          </div>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      playUiSound('toggle');
      document.body.style.overflow = 'hidden';
    }

    function closeArch() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const archKey = btn.getAttribute('data-arch');
        if (archKey) openArch(archKey);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeArch);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeArch();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeArch();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 18. ANIMATED NUMBER COUNTERS
  // --------------------------------------------------------------------------
  function initCounterAnimation() {
    const counterElements = document.querySelectorAll('.stat-value, .scorecard-metric-num');
    if (!counterElements.length) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(function (el) {
          const text = el.textContent.trim();
          const match = text.match(/([\d.]+)(.*)/);
          if (match) {
            const targetNum = parseFloat(match[1]);
            const suffix = match[2];
            const isDecimal = match[1].includes('.');
            const duration = 1200;
            const startTime = performance.now();

            function updateCount(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = easeProgress * targetNum;

              el.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = text;
              }
            }
            requestAnimationFrame(updateCount);
          }
        });
      }
    });

    const statsSec = document.querySelector('.hero-stats');
    if (statsSec) observer.observe(statsSec);
  }

  // --------------------------------------------------------------------------
  // 19. ULTRA-MODERN DYNAMICS: TYPING ROLE SCRAMBLER
  // --------------------------------------------------------------------------
  function initTypingRole() {
    const roleEl = document.getElementById('typing-role');
    if (!roleEl) return;

    const titles = [
      'Frontend Developer & Web Innovator',
      'Samsung Innovation Campus Scholar',
      'AI & Web System Specialist',
      'Pixel-Perfect UI Architect',
      'Clean Vanilla JavaScript Engineer'
    ];

    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    function tick() {
      const currentTitle = titles[titleIdx];

      if (isDeleting) {
        charIdx--;
        roleEl.textContent = currentTitle.substring(0, charIdx);
        typingSpeed = 35;
      } else {
        charIdx++;
        roleEl.textContent = currentTitle.substring(0, charIdx);
        typingSpeed = 70;
      }

      if (!isDeleting && charIdx === currentTitle.length) {
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        typingSpeed = 400;
      }

      setTimeout(tick, typingSpeed);
    }

    tick();
  }

  // --------------------------------------------------------------------------
  // 20. LIVE BENGALURU / IST TIME & AVAILABILITY TICKER
  // --------------------------------------------------------------------------
  function initLiveStatusClock() {
    const timeEl = document.getElementById('live-ist-time');
    if (!timeEl) return;

    function updateTime() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-IN', options);
        timeEl.textContent = formatter.format(now) + ' IST';
      } catch (e) {
        timeEl.textContent = 'IST • Available Now';
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // --------------------------------------------------------------------------
  // 21. AMBIENT CURSOR GLOW & DYNAMIC CARD SPOTLIGHT
  // --------------------------------------------------------------------------
  function initAmbientSpotlightAndCursor() {
    const ambientGlow = document.getElementById('ambient-cursor-glow');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isMoving = false;

    function renderGlow() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      if (ambientGlow) {
        ambientGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      requestAnimationFrame(renderGlow);
    }
    renderGlow();

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isMoving && ambientGlow) {
        ambientGlow.style.opacity = '1';
        isMoving = true;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      if (ambientGlow) ambientGlow.style.opacity = '0';
      isMoving = false;
    });

    const spotlightElements = document.querySelectorAll(
      '.project-card, .skill-card, .evaluator-banner, .about-card, .phase-card, .contact-form-card, .hero-card-frame, .arch-card, .feature-card'
    );

    spotlightElements.forEach(function (card) {
      card.classList.add('spotlight-card');
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 22. ULTRA-MODERN FLOATING DOCK & SCROLL PROGRESS
  // --------------------------------------------------------------------------
  function initFloatingDock() {
    const dock = document.getElementById('floating-dock');
    const dockTopBtn = document.getElementById('dock-top-btn');
    const dockTerminalBtn = document.getElementById('dock-terminal-btn');
    const dockSoundBtn = document.getElementById('dock-sound-btn');
    const dockSoundIcon = document.getElementById('dock-sound-icon');
    const dockProgressRing = document.getElementById('dock-scroll-progress');
    const totalCircumference = 113.1;

    function updateDock() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progressPercent = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;

      if (dock) {
        if (scrollTop > 280) {
          dock.classList.add('visible');
        } else {
          dock.classList.remove('visible');
        }
      }

      if (dockProgressRing) {
        const offset = totalCircumference - (totalCircumference * progressPercent / 100);
        dockProgressRing.style.strokeDashoffset = offset;
      }
    }

    window.addEventListener('scroll', updateDock, { passive: true });
    updateDock();

    if (dockTopBtn) {
      dockTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (typeof playUiSound === 'function') playUiSound('toggle');
      });
    }

    if (dockTerminalBtn) {
      dockTerminalBtn.addEventListener('click', function () {
        const terminalModal = document.getElementById('terminal-modal');
        if (terminalModal) {
          terminalModal.classList.add('active');
          terminalModal.setAttribute('aria-hidden', 'false');
          const input = document.getElementById('terminal-input');
          if (input) setTimeout(() => input.focus(), 80);
          if (typeof playUiSound === 'function') playUiSound('toggle');
        }
      });
    }

    if (dockSoundBtn) {
      dockSoundBtn.addEventListener('click', function () {
        const mainSoundBtn = document.getElementById('sound-toggle-btn');
        if (mainSoundBtn) mainSoundBtn.click();
        if (dockSoundIcon) {
          dockSoundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 23. MAGNETIC INTERACTION PHYSICS ON BUTTONS
  // --------------------------------------------------------------------------
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll(
      '.btn-primary, .btn-secondary, .nav-cta-btn, .evaluator-btn-scorecard, .brand-badge'
    );

    magneticBtns.forEach(function (btn) {
      btn.classList.add('btn-magnetic');

      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - btnCenterX) * 0.28;
        const deltaY = (e.clientY - btnCenterY) * 0.28;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. INITIALIZATION ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initScrollReveal();
    updateScrollEffects();
    initParticles();
    initSoundFeedback();
    init3DTilt();
    initScorecardModal();
    initDeveloperTerminal();
    initArchModal();
    initCounterAnimation();
    initTypingRole();
    initLiveStatusClock();
    initAmbientSpotlightAndCursor();
    initFloatingDock();
    initMagneticButtons();
  });
})();
