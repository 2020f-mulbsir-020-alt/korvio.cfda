/**
 * KORVIO — Kingdom of Forgotten Maps
 * Interactive atlas experience
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     COMPASS NAVIGATION
     ============================================ */
  function initCompassNav() {
    const trigger = document.querySelector('.compass-trigger');
    const wheel = document.querySelector('.compass-wheel');
    if (!trigger || !wheel) return;

    trigger.addEventListener('click', () => {
      const isOpen = wheel.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen);
      wheel.hidden = !isOpen;
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.compass-nav') && wheel.classList.contains('is-open')) {
        wheel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        wheel.hidden = true;
      }
    });

    wheel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        wheel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        wheel.hidden = true;
      });
    });
  }

  /* ============================================
     SECTION 1 — ISLAND EMERGENCE ON SCROLL
     ============================================ */
  function initSeaEmergence() {
    const section = document.getElementById('sea-of-lost-directions');
    const islands = document.querySelectorAll('.island-group');
    if (!section || !islands.length) return;

    function updateEmergence() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));

      islands.forEach((island) => {
        const threshold = parseFloat(island.dataset.emerge) || 0.2;
        if (progress >= threshold) {
          island.classList.add('emerged');
        }
      });
    }

    window.addEventListener('scroll', updateEmergence, { passive: true });
    updateEmergence();
  }

  /* ============================================
     SECTION 4 — ROUTE JOURNALS
     ============================================ */
  function initRouteJournals() {
    const buttons = document.querySelectorAll('.route-btn');
    const journals = document.querySelectorAll('.journal-content');
    const paths = document.querySelectorAll('.route-path');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const route = btn.dataset.route;

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        journals.forEach((j) => {
          j.classList.toggle('active', j.dataset.journal === route);
        });

        paths.forEach((p) => {
          p.classList.toggle('highlight', p.dataset.route === route);
        });
      });
    });

    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              paths.forEach((path) => {
                path.style.strokeDashoffset = '0';
                path.classList.add('animated');
              });
            }
          });
        },
        { threshold: 0.3 }
      );

      const routesSection = document.getElementById('routes-of-explorers');
      if (routesSection) observer.observe(routesSection);
    }
  }

  /* ============================================
     SECTION 6 — COMPASS DIRECTION PANELS
     ============================================ */
  function initCompassChamber() {
    const panels = document.querySelectorAll('.direction-panel');
    const directions = ['north', 'east', 'south', 'west'];
    let currentIndex = 0;

    if (panels.length === 0 || prefersReducedMotion) {
      panels[0]?.classList.add('active');
      return;
    }

    function showDirection(index) {
      panels.forEach((p, i) => {
        p.classList.toggle('active', i === index);
      });
    }

    showDirection(0);

    setInterval(() => {
      currentIndex = (currentIndex + 1) % directions.length;
      showDirection(currentIndex);
    }, 4000);
  }

  /* ============================================
     SECTION 7 — UNDERGROUND CHAMBERS
     ============================================ */
  function initUndergroundChambers() {
    const chambers = document.querySelectorAll('.chamber');
    const details = document.querySelectorAll('.chamber-detail');

    chambers.forEach((chamber, index) => {
      chamber.addEventListener('click', () => {
        const num = index + 1;
        details.forEach((d) => {
          d.classList.toggle('active', d.dataset.chamber === String(num));
        });
      });

      chamber.setAttribute('role', 'button');
      chamber.setAttribute('tabindex', '0');
      chamber.setAttribute('aria-label', `Explore chamber ${index + 1}`);

      chamber.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chamber.click();
        }
      });
    });

    details[0]?.classList.add('active');
  }

  /* ============================================
     SECTION 8 — CONSTELLATIONS
     ============================================ */
  function initConstellations() {
    const constellations = document.querySelectorAll('.constellation');
    const stories = document.querySelectorAll('.star-story');

    constellations.forEach((constellation) => {
      constellation.addEventListener('click', () => {
        const name = constellation.dataset.constellation;

        constellations.forEach((c) => c.classList.remove('connected'));
        constellation.classList.add('connected');

        stories.forEach((s) => {
          s.classList.toggle('active', s.dataset.constellation === name);
        });
      });

      constellation.style.cursor = 'pointer';
    });

    if (constellations.length) {
      constellations[0].classList.add('connected');
      stories[0]?.classList.add('active');
    }

    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll('.star-line').forEach((line, i) => {
                setTimeout(() => {
                  line.style.opacity = '0.6';
                }, i * 300);
              });
            }
          });
        },
        { threshold: 0.5 }
      );

      constellations.forEach((c) => observer.observe(c));
    }
  }

  /* ============================================
     SECTION 10 — FOG CLEARING FINALE
     ============================================ */
  function initFinaleFog() {
    const section = document.getElementById('last-uncharted-land');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('fog-cleared');
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
  }

  /* ============================================
     SCROLL REVEAL FOR SECTIONS
     ============================================ */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll(
      '.continent, .harbor-vessel, .direction-panel, .orbit-map'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });
  }

  /* ============================================
     COASTLINE DRAW ANIMATION (SVG)
     ============================================ */
  function initCoastlineDraw() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.coastline-draw').forEach((path) => {
        path.style.strokeDashoffset = '0';
        path.style.fillOpacity = '0.3';
      });
      document.querySelectorAll('.island-group').forEach((g) => {
        g.classList.add('emerged');
      });
      return;
    }

    document.querySelectorAll('.coastline-draw').forEach((path) => {
      const length = path.getTotalLength?.() || 500;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });
  }

  /* ============================================
     SMOOTH ANCHOR SCROLLING WITH OFFSET
     ============================================ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  /* ============================================
     INIT
     ============================================ */
  function init() {
    initCompassNav();
    initSeaEmergence();
    initRouteJournals();
    initCompassChamber();
    initUndergroundChambers();
    initConstellations();
    initFinaleFog();
    initScrollReveal();
    initCoastlineDraw();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
