(() => {
  const hcf = window.HCFData;
  const escape = hcf?.escapeHtml || (value => String(value || ''));
  const normalize = hcf?.normalize || (value => String(value || '').trim().toLowerCase());
  const orderBy = hcf?.orderBy || (items => [...items]);
  const visualFor = hcf?.visualFor || (() => ({ color: '#3170E9', pale: '#96C7FA' }));
  const youtubeId = hcf?.youtubeId || (() => '');

  const render = data => {
    if (!data?.episodes?.length) return;
    const categories = orderBy(data.categories || []);
    const filterContainer = document.querySelector('.episode-filters');
    const grid = document.querySelector('.episode-grid');
    if (!filterContainer || !grid) return;
    filterContainer.innerHTML = `<a class="episode-filter" href="./" data-category="todos">Todos</a>${categories.map(category => {
      const visual = visualFor(category.id, categories);
      return `<a class="episode-filter" href="?categoria=${encodeURIComponent(category.id)}" data-category="${escape(normalize(category.id))}" style="--filter-color:${escape(visual.filterColor || visual.color)};--filter-pale:${escape(visual.pale)}">${escape(category.nombre)}</a>`;
    }).join('')}`;
    grid.innerHTML = [...data.episodes].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).map(episode => {
      const category = normalize(String(episode.categorias).split(',')[0]);
      const visual = visualFor(category, categories);
      return `<button class="episode-tile" type="button" data-episode data-categories="${escape(String(episode.categorias).split(',').map(normalize).join(','))}" data-youtube="${escape(youtubeId(episode.url_youtube))}" data-audio="${escape(episode.url_audio)}" data-color="${escape(visual.color)}" data-pale="${escape(visual.pale)}" style="--topic:${escape(visual.color)};--topic-pale:${escape(visual.pale)}"><span class="episode-tile-bar"></span><div><h2>${escape(episode.titulo)}</h2><p>${escape(episode.subtitulo)}</p></div><span class="episode-tile-arrow">→</span></button>`;
    }).join('');
  };

  const initialise = data => {
    render(data);
    const filters = [...document.querySelectorAll('[data-category]')];
    const cards = [...document.querySelectorAll('[data-episode]')];
    const empty = document.querySelector('[data-empty]');
    const modal = document.querySelector('[data-video-modal]');
    const frame = modal?.querySelector('iframe');
    const close = modal?.querySelector('[data-modal-close]');
    let lastTrigger;
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
    applyFilter(new URLSearchParams(window.location.search).get('categoria') || 'todos');
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
      if (!card.dataset.youtube) {
        if (card.dataset.audio) window.open(card.dataset.audio, '_blank', 'noopener,noreferrer');
        return;
      }
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
  };

  (hcf?.ready || Promise.resolve(null)).then(initialise);
})();
