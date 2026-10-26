document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".launch-benefits article, .product-showcase .section-heading, .product-showcase .app-shot, .early-access-section, .roadmap-section, .coming-section, .updates-section, .contact-section"
  );

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
  );

  sections.forEach((section) => {
    section.classList.add("scroll-reveal");
    observer.observe(section);
  });
});

/* Hide navigation scrolling down; reveal scrolling up */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let previousY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const delta = currentY - previousY;

    header.classList.toggle('nav-scrolled', currentY > 40);

    if (currentY < 100 || delta < -5) {
      header.classList.remove('nav-hidden');
    } else if (delta > 5 && currentY > 150) {
      header.classList.add('nav-hidden');
    }

    previousY = currentY;
  }, { passive: true });
})();

/* Athlete / Coach story selection */
(() => {
  const choice = document.querySelector('.story-choice');
  const experiences = document.querySelectorAll('.story-experience');

  function showStory(name) {
    const selected = document.getElementById(name);
    if (!selected || !selected.classList.contains('story-experience')) return;

    choice.hidden = true;
    experiences.forEach(el => { el.hidden = el !== selected; });

    selected.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant' : 'smooth',
      block: 'start'
    });
  }

  document.querySelectorAll('[data-story]').forEach(button => {
    button.addEventListener('click', () => showStory(button.dataset.story));
  });

  document.querySelectorAll('.story-back').forEach(button => {
    button.addEventListener('click', () => {
      experiences.forEach(el => { el.hidden = true; });
      choice.hidden = false;
      choice.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('a[href="#athletes"], a[href="#coaches"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showStory(link.getAttribute('href').slice(1));
    });
  });
})();

/* Show pricing for the selected story */
(() => {
  const pricing = document.querySelector('.launch-pricing');
  const cards = [...document.querySelectorAll('.launch-price-card')];
  const choiceButtons = document.querySelectorAll('[data-story]');
  const backButtons = document.querySelectorAll('.story-back');

  if (!pricing || cards.length !== 4) return;

  const heading = pricing.querySelector('.launch-pricing-heading h2');

  function setPricing(role) {
    cards.forEach((card, index) => {
      card.hidden = role === 'athletes' ? index !== 0 : index === 0;
    });

    heading.textContent = role === 'athletes'
      ? 'Simple pricing for athletes.'
      : 'Plans built for coaches.';

    pricing.classList.toggle('pricing-athlete', role === 'athletes');
    pricing.classList.toggle('pricing-coach', role === 'coaches');
  }

  choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
      setPricing(button.dataset.story);
    });
  });

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      cards.forEach(card => { card.hidden = false; });
      heading.textContent = 'Simple, Transparent Pricing';
      pricing.classList.remove('pricing-athlete', 'pricing-coach');
    });
  });

  document.querySelectorAll('a[href="#athletes"], a[href="#coaches"]')
    .forEach(link => {
      link.addEventListener('click', () => {
        setPricing(link.getAttribute('href').slice(1));
      });
    });
})();
