(() => {
  const fallbackEpisodes = [
    { fecha: '2025-06-12', titulo: 'Los sumerios', subtitulo: 'Cuando empezamos a apuntar las cosas', categorias: 'civilizaciones', periodo: '4000 a. C.', url_audio: 'https://open.spotify.com/episode/36iQ0MnV1ErNXGcHwtnQJB?si=sDeidyCbREKJJA_oWn39VQ' },
    { fecha: '2025-06-26', titulo: 'La Revolución Rusa', subtitulo: 'Cuando ya se cantaba Ra Ra Rasputín', categorias: 'revoluciones', periodo: '1917', url_audio: 'https://open.spotify.com/episode/7fluqNDASvkp8TzBmSIO6t?si=VdCs88b4ScWyR0alE_IUyA' },
    { fecha: '2025-07-10', titulo: 'La Guerra de Sucesión Castellana', subtitulo: 'Cuando un chisme cambió la historia', categorias: 'espana, revoluciones', periodo: '1475', url_audio: 'https://open.spotify.com/episode/1epIcgFguvluEEgpZjQtOz?si=p-bO8TI3Qs-KTj0jT1DJ_Q' },
    { fecha: '2025-07-24', titulo: 'La Polinesia', subtitulo: 'Cuando tu continente es el océano', categorias: 'civilizaciones', periodo: '1000 a. C.', url_audio: 'https://open.spotify.com/episode/1q4ULG5SOAWNvBuM3qY1Zv?si=C1--dmCXR6WhQMPNRmQcew' },
    { fecha: '2025-08-14', titulo: 'Las Guerras del Opio', subtitulo: 'Cuando Reino Unido fue el mayor narcoestado', categorias: 'revoluciones', periodo: '1839', url_audio: 'https://open.spotify.com/episode/5ItjINBfWh4BMj1CPFTyOH?si=cNojufWdTguf79rXkCC-0w' },
    { fecha: '2025-08-28', titulo: 'Los Médici', subtitulo: 'Cuando el arte era la mejor campaña electoral', categorias: 'arte', periodo: 's. XVI', url_audio: 'https://open.spotify.com/episode/6S7gpveTMYnoyaGd8kxKnS?si=YWPWDUM5SoCkTArfy4Qxqg' },
    { fecha: '2025-09-11', titulo: 'El Imperio Inca', subtitulo: 'Cuando todos los caminos llevaban al Cusco', categorias: 'civilizaciones', periodo: 's. XV', url_audio: 'https://open.spotify.com/episode/5DkbyPupJmuXKtk9vSD0R6?si=wF7uPBuUTeCz4tcjP2odVQ' },
    { fecha: '2025-10-02', titulo: 'La Segunda República', subtitulo: 'Cuando España quiso ser una moderna', categorias: 'espana, revoluciones', periodo: '1931', url_audio: 'https://open.spotify.com/episode/4NCBP64QAcpdjQfnzOR5N7?si=_kTQNOcyS-2eYOPuRGy_GA' }
  ];

  const hcf = window.HCFData;
  const escape = hcf?.escapeHtml || (value => String(value || ''));
  const orderBy = hcf?.orderBy || (items => [...items]);
  const normalize = hcf?.normalize || (value => String(value || '').trim().toLowerCase());
  const visualFor = hcf?.visualFor || (() => ({ color: '#3170E9', pale: '#96C7FA', image: 'categoria-civilizaciones.png' }));
  const setText = (selector, text) => { const node = document.querySelector(selector); if (node && text) node.textContent = text; };
  const removeLeadingEmoji = text => String(text || '').replace(/^[\p{Extended_Pictographic}\p{Emoji_Component}\s]+/u, '').trim();
  const setHeading = (selector, text) => setText(selector, removeLeadingEmoji(text));
  const episodeDate = episode => new Date(`${episode.fecha || '1970-01-01'}T00:00:00`).getTime() || 0;

  const applyHomeCopy = (home, episodes) => {
    if (!home) return;
    const titleLines = document.querySelectorAll('.hero-title span');
    if (home.hero_titulo_linea_1) titleLines[0].textContent = home.hero_titulo_linea_1;
    if (home.hero_titulo_linea_2) titleLines[1].textContent = home.hero_titulo_linea_2;
    setText('.hero-speech', home.hero_bocadillo);
    setText('.hero-description', home.hero_descripcion);
    setText('.hero-actions .button-primary', home.hero_cta_principal);
    setText('.hero-actions .button-secondary', home.hero_cta_secundario);
    const primary = document.querySelector('.hero-actions .button-primary');
    if (primary && home.hero_url_principal) primary.href = home.hero_url_principal;
    setHeading('.latest-heading .heading-copy', home.latest_heading);
    setText('.episodes-more h3', home.previous_heading);
    setText('.episodes-more p', home.previous_description);
    setText('.episodes-more a', home.previous_link_label);
    setHeading('.categories-title-text', home.categories_heading);
    setText('.random-title', home.random_heading);
    setText('[data-random-episode]', home.random_button_label);
    setHeading('.timeline-section-title .heading-copy', home.timeline_heading);
    setText('.timeline-section-subtitle', home.timeline_subtitle);
    setHeading('.bibliography-note h2 .heading-copy', home.resources_heading);
    setText('.bibliography-note p', home.resources_description);
    setText('.bibliography-note a', home.resources_link_label);
    setHeading('#listen-heading .heading-copy', home.listen_heading);
    setText('.listen-section > p', home.listen_description);

    const latest = [...episodes].sort((a, b) => episodeDate(b) - episodeDate(a))[0];
    if (latest) {
      setText('.episode-card h3', latest.titulo);
      setText('.episode-card p', latest.subtitulo);
      const latestLink = document.querySelector('.episode-card .button');
      if (latestLink) latestLink.href = latest.url_audio || '#';
    }
  };

  const renderCategories = categories => {
    if (!categories?.length) return;
    const grid = document.querySelector('.category-grid');
    if (!grid) return;
    grid.innerHTML = orderBy(categories).map(category => {
      const id = normalize(category.id);
      const visual = visualFor(id, categories);
      const background = visual.categoryBackground ? `;--category-background:${escape(visual.categoryBackground)}` : '';
      return `<a class="category-card" href="episodios/?categoria=${encodeURIComponent(id)}" style="--category-color:${escape(visual.categoryColor || visual.color)}${background}" aria-label="Explorar ${escape(category.nombre)}"><span class="category-art"><img src="assets/images/${escape(visual.image)}" alt=""></span><span class="category-name">${escape(category.nombre)}</span></a>`;
    }).join('');
  };

  const timelineNumber = period => {
    const value = normalize(period);
    if (value.includes('a. c')) return -Number(value.match(/\d+/)?.[0] || 0);
    const roman = value.match(/s\.\s*([xiv]+)/i)?.[1]?.toUpperCase();
    if (roman) {
      const map = { I: 1, V: 5, X: 10 };
      return [...roman].reduce((sum, digit, index, array) => sum + (map[digit] < map[array[index + 1]] ? -map[digit] : map[digit]), 0) * 100;
    }
    return Number(value.match(/\d+/)?.[0] || 0);
  };

  const renderTimeline = (episodes, categories, home) => {
    const root = document.querySelector('[data-timeline]');
    const rail = root?.querySelector('[data-timeline-rail]');
    const card = root?.querySelector('[data-timeline-card]');
    if (!rail || !card || !episodes.length) return;
    const chronological = [...episodes].sort((a, b) => timelineNumber(a.periodo) - timelineNumber(b.periodo));
    const positions = chronological.map((_, index) => chronological.length === 1 ? 50 : 8 + (88 * index / (chronological.length - 1)));
    // El año 0 se inserta entre la última fecha a. C. y la primera d. C.
    const firstPositiveIndex = chronological.findIndex(episode => timelineNumber(episode.periodo) >= 0);
    const zeroAfterIndex = firstPositiveIndex > 0 ? firstPositiveIndex - 1 : -1;
    const zeroLeft = zeroAfterIndex >= 0 && positions[firstPositiveIndex] !== undefined
      ? (positions[zeroAfterIndex] + positions[firstPositiveIndex]) / 2
      : 50;
  const zeroMarkup = `<span class="timeline-zero" style="left:${zeroLeft}%" aria-hidden="true"></span><span class="timeline-zero-label" style="left:${zeroLeft}%">0</span>`;
    rail.innerHTML = chronological.map((episode, index) => {
      const left = positions[index];
      const category = normalize(String(episode.categorias).split(',')[0]);
      const visual = visualFor(category, categories);
      return `<button class="timeline-dot${index === 0 ? ' is-active' : ''}" type="button" data-title="${escape(episode.titulo)}" data-subtitle="${escape(episode.subtitulo)}" data-audio="${escape(episode.url_audio)}" data-color="${escape(visual.color)}" data-pale="${escape(visual.pale)}" style="left:${left}%" aria-label="${escape(episode.periodo)} · ${escape(episode.titulo)}"></button><span class="timeline-date" style="left:${left}%">${escape(episode.periodo)}</span>${index === zeroAfterIndex ? zeroMarkup : ''}`;
    }).join('');
    const dots = [...rail.querySelectorAll('.timeline-dot')];
    const title = card.querySelector('[data-timeline-title]');
    const subtitle = card.querySelector('[data-timeline-subtitle]');
    const link = card.querySelector('[data-timeline-link]');
    const select = (dot, index) => {
      dots.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex <= index));
      rail.style.setProperty('--progress', `${dot.offsetLeft + dot.offsetWidth / 2}px`);
      card.style.setProperty('--timeline-color', dot.dataset.color);
      card.style.setProperty('--timeline-pale', dot.dataset.pale);
      title.textContent = dot.dataset.title;
      subtitle.textContent = dot.dataset.subtitle;
      link.href = dot.dataset.audio || '#';
      link.textContent = home?.timeline_button_label || 'Escuchar episodio →';
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => select(dot, index)));
    if (dots[0]) select(dots[0], 0);
  };

  const renderPlatforms = platforms => {
    if (!platforms?.length) return;
    const list = document.querySelector('.platform-list');
    if (!list) return;
    list.innerHTML = orderBy(platforms).map(platform => `<a class="platform-button" href="${escape(platform.url)}" target="_blank" rel="noopener noreferrer">${escape(platform.nombre)}</a>`).join('');
  };

  const initialise = data => {
    const episodes = data?.episodes?.length ? data.episodes : fallbackEpisodes;
    const categories = data?.categories || [];
    applyHomeCopy(data?.home, episodes);
    renderCategories(categories);
    renderTimeline(episodes, categories, data?.home);
    renderPlatforms(data?.platforms);
    const randomButton = document.querySelector('[data-random-episode]');
    randomButton?.addEventListener('click', event => {
      event.preventDefault();
      const episode = episodes[Math.floor(Math.random() * episodes.length)];
      if (episode?.url_audio) window.open(episode.url_audio, '_blank', 'noopener,noreferrer');
    });
  };

  (hcf?.ready || Promise.resolve(null)).then(initialise);
})();
