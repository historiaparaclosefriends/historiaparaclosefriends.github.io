(() => {
  const episodes = [
    { title: 'Los sumerios', youtube: 'dgxzEh_vRuQ', color: '#3170E9', pale: '#96C7FA' },
    { title: 'La Revolución Rusa', youtube: 'uCS-tKrvb50', color: '#EBB6C7', pale: '#FCECF7' },
    { title: 'La Guerra de Sucesión Castellana', youtube: '5ieak59s9sQ', color: '#DE7835', pale: '#F5C6A4' },
    { title: 'La Polinesia', youtube: '9jisNVQeTAw', color: '#3170E9', pale: '#96C7FA' },
    { title: 'Las Guerras del Opio', youtube: 'fLsaO9FSR9I', color: '#EBB6C7', pale: '#FCECF7' },
    { title: 'Los Médici', youtube: 'EZzhiihy4yo', color: '#7FCC6E', pale: '#CAEAC2' },
    { title: 'El Imperio Inca', youtube: 'fRmm9deh9Fs', color: '#3170E9', pale: '#96C7FA' },
    { title: 'La Segunda República', youtube: 'tJ8IA46eXoE', color: '#DE7835', pale: '#F5C6A4' }
  ];
  const modal = document.querySelector('[data-home-video-modal]');
  const frame = modal?.querySelector('iframe');
  const modalTitle = modal?.querySelector('[data-home-video-title]');
  const close = modal?.querySelector('[data-home-video-close]');
  let lastTrigger;

  const openVideo = (episode, trigger) => {
    if (!modal || !frame || !episode?.youtube) return;
    lastTrigger = trigger;
    modalTitle.textContent = episode.title;
    frame.src = `https://www.youtube-nocookie.com/embed/${episode.youtube}?rel=0`;
    modal.style.setProperty('--modal-color', episode.color || '#3170E9');
    modal.style.setProperty('--modal-pale', episode.pale || '#96C7FA');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    close?.focus();
  };
  const closeVideo = () => {
    modal?.classList.remove('is-open');
    if (frame) frame.src = '';
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };
  close?.addEventListener('click', closeVideo);
  modal?.addEventListener('click', event => { if (event.target === modal) closeVideo(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeVideo(); });

  document.querySelectorAll('[data-open-video]').forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    openVideo({ title: trigger.dataset.title, youtube: trigger.dataset.youtube, color: trigger.dataset.color, pale: trigger.dataset.pale }, trigger);
  }));
  const randomButton = document.querySelector('[data-random-episode]');
  randomButton?.addEventListener('click', event => {
    event.preventDefault();
    openVideo(episodes[Math.floor(Math.random() * episodes.length)], randomButton);
  });
  const latestLink = document.querySelector('.episode-card .button');
  latestLink?.addEventListener('click', event => {
    event.preventDefault();
    openVideo(episodes.find(episode => episode.title === document.querySelector('.episode-card h3')?.textContent.trim()), latestLink);
  });

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
      const episode = episodes.find(item => item.title === dot.dataset.title);
      Object.assign(link.dataset, {
        title: dot.dataset.title,
        youtube: episode?.youtube || '',
        color: dot.dataset.color,
        pale: dot.dataset.pale
      });
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => selectDot(dot, index)));
    link?.addEventListener('click', event => { event.preventDefault(); openVideo(link.dataset, link); });
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
