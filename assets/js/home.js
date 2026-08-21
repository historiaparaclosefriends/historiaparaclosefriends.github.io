(() => {
  const spotifyShowUrl = 'https://open.spotify.com/show/4cjYSY9JofzA4vvLkDBrxP';
  const randomButton = document.querySelector('[data-random-episode]');
  if (randomButton) {
    randomButton.addEventListener('click', event => {
      event.preventDefault();
      window.open(spotifyShowUrl, '_blank', 'noopener,noreferrer');
    });
  }

  const root = document.querySelector('[data-timeline]');
  if (root) {
    const rail = root.querySelector('[data-timeline-rail]');
    const dots = [...root.querySelectorAll('.timeline-dot')];
    const title = root.querySelector('[data-timeline-title]');
    const subtitle = root.querySelector('[data-timeline-subtitle]');
    const link = root.querySelector('[data-timeline-link]');
    const card = root.querySelector('[data-timeline-card]');

    const selectDot = (dot, index) => {
      dots.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex <= index));
      rail.style.setProperty('--progress', `${dot.offsetLeft + dot.offsetWidth / 2}px`);
      card.style.setProperty('--timeline-color', dot.dataset.color || '#DE7835');
      card.style.setProperty('--timeline-pale', dot.dataset.pale || '#F9DDF1');
      title.textContent = dot.dataset.title || '';
      subtitle.textContent = dot.dataset.subtitle || '';
      link.href = dot.dataset.audio || '#';
    };

    dots.forEach((dot, index) => dot.addEventListener('click', () => selectDot(dot, index)));
    if (dots.length) selectDot(dots[0], 0);
    window.addEventListener('resize', () => {
      const selected = dots.find(dot => dot.classList.contains('is-active')) || dots[0];
      selectDot(selected, dots.indexOf(selected));
    });
  }

  const sections = [...document.querySelectorAll('.latest-band, .categories-band, .random-band, .timeline-band, .bibliography-band, .listen-band, .site-footer')];
  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('is-visible'));
    return;
  }
  sections.forEach((section, index) => {
    section.classList.add('reveal-on-scroll');
    section.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  sections.forEach(section => observer.observe(section));
})();
