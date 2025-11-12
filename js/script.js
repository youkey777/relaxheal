/* ========== Lazy Video Loading ========== */
document.querySelectorAll('video[preload="none"]').forEach(video => {
  video.addEventListener('pointerenter', () => {
    if (video.getAttribute('data-loaded')) return;
    video.load();
    video.setAttribute('data-loaded', '1');
  });

  video.addEventListener('play', () => {
    if (!video.getAttribute('data-loaded')) {
      video.load();
      video.setAttribute('data-loaded', '1');
    }
  });
});

/* ========== Intersection Observer for Lazy Images ========== */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src || img.getAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ========== Smooth Scroll for Internal Links ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== Details / Accordion Enhancement ========== */
document.querySelectorAll('details').forEach(detail => {
  const summary = detail.querySelector('summary');
  if (summary) {
    summary.addEventListener('click', () => {
      // Close other open details in the same container
      const container = detail.parentElement;
      if (container && detail.open === false) {
        container.querySelectorAll('details[open]').forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.parentElement === container) {
            otherDetail.open = false;
          }
        });
      }
    });
  }
});

/* ========== Page Load Analytics Hook ========== */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger pageview or analytics event here if needed
  // Example: trackPageView('relax-heal-homepage');
  console.log('[relax heal] Page loaded and initialized');
});

/* ========== Performance: LCP / CLS Monitoring ========== */
if ('PerformanceObserver' in window) {
  // Monitor Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('[LCP]', lastEntry.renderTime || lastEntry.loadTime);
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP API not fully supported
  }

  // Monitor Cumulative Layout Shift
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    });
    console.log('[CLS]', clsScore);
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // CLS API not fully supported
  }
}

/* ========== Scroll Position Restoration ========== */
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', () => {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition !== null) {
    window.scrollTo(0, parseInt(scrollPosition, 10));
  }
});

/* ========== Initialization Complete ========== */
console.log('[relax heal] JavaScript initialization complete');
