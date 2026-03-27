/* =========================================
   Sentient News — main.js
   ========================================= */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const navMenu   = document.querySelector('.navbar__nav');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (!input || !input.value.trim()) return;

      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      }, 3500);
    });
  });

  /* ---------- Reading progress bar ---------- */
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Animate cards on scroll ---------- */
  const animateOnScroll = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };

  const observer = new IntersectionObserver(animateOnScroll, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.article-card, .featured-card, .stat-card').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
