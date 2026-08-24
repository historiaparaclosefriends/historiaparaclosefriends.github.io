(() => {
  const filters = [...document.querySelectorAll('[data-category]')];
  const cards = [...document.querySelectorAll('[data-episode]')];
  const empty = document.querySelector('[data-empty]');
  const modal = document.querySelector('[data-video-modal]');
  const frame = modal?.querySelector('iframe');
  const close = modal?.querySelector('[data-modal-close]');
  let lastTrigger;

  const normalize = value => String(value || '').trim().toLowerCase();
  const applyFilter = rawCategory => {
    const category = normalize(rawCategory) || 'todos';
    let shown = 0;
    cards.forEach(card => {
      const visible = category === 'todos' || card.dataset.categories.split(',').includes(category);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    filters.forEach(filter => {
      const active = filter.dataset.category === category;
      filter.classList.toggle('is-active', active);
      filter.toggleAttribute('aria-current', active);
    });
    if (empty) empty.hidden = shown !== 0;
    const url = new URL(window.location);
    if (category === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', category);
    window.history.replaceState({}, '', url);
  };

  const initialCategory = new URLSearchParams(window.location.search).get('categoria') || 'todos';
  applyFilter(initialCategory);
  filters.forEach(filter => filter.addEventListener('click', event => {
    event.preventDefault();
    applyFilter(filter.dataset.category);
  }));

  const closeModal = () => {
    modal?.classList.remove('is-open');
    document.body.style.overflow = '';
    if (frame) frame.src = '';
    lastTrigger?.focus();
  };
  cards.forEach(card => card.addEventListener('click', () => {
    if (!modal || !frame) return;
    lastTrigger = card;
    frame.src = `https://www.youtube-nocookie.com/embed/${card.dataset.youtube}?rel=0`;
    modal.style.setProperty('--modal-color', card.dataset.color);
    modal.style.setProperty('--modal-pale', card.dataset.pale);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    close?.focus();
  }));
  close?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal(); });
})();
