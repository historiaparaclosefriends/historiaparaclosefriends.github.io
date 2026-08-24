(() => {
  const hcf = window.HCFData;
  const escape = hcf?.escapeHtml || (value => String(value || ''));
  const orderBy = hcf?.orderBy || (items => [...items]);
  const normalize = hcf?.normalize || (value => String(value || '').trim().toLowerCase());
  const driveId = hcf?.driveId || (() => '');
  const visualFor = hcf?.visualFor || (() => ({ color: '#3170E9' }));

  const render = data => {
    if (!data?.bibliography?.length) return;
    const catalog = document.querySelector('.bibliography-catalog');
    if (!catalog) return;
    const categories = data.categories || [];
    const episodes = data.episodes || [];
    catalog.innerHTML = orderBy(data.bibliography).map(item => {
      const episode = episodes.find(candidate => normalize(candidate.titulo) === normalize(item.titulo));
      const category = normalize(String(episode?.categorias || '').split(',')[0]);
      const visual = visualFor(category, categories);
      const id = driveId(item.url_pdf);
      return `<article class="bibliography-entry" style="--topic:${escape(visual.color)}"><span class="bibliography-marker"></span><div><h2>${escape(item.titulo)}</h2><p>${escape(item.subtitulo)}</p></div><div class="bibliography-actions"><button class="bibliography-action" type="button" data-pdf-open data-title="${escape(item.titulo)}" data-pdf-url="${escape(item.url_pdf)}" data-drive-id="${escape(id)}">Abrir PDF</button><a class="bibliography-action" href="${escape(id ? `https://drive.google.com/uc?export=download&id=${id}` : item.url_pdf)}" target="_blank" rel="noopener noreferrer">Descargar</a></div></article>`;
    }).join('');
  };

  const initialise = data => {
    render(data);
    const modal = document.querySelector('[data-pdf-modal]');
    const frame = modal?.querySelector('iframe');
    const title = modal?.querySelector('[data-pdf-title]');
    const download = modal?.querySelector('[data-pdf-download]');
    const close = modal?.querySelector('[data-modal-close]');
    let lastTrigger;
    const closeModal = () => {
      modal?.classList.remove('is-open');
      document.body.style.overflow = '';
      if (frame) frame.src = '';
      lastTrigger?.focus();
    };
    document.querySelectorAll('[data-pdf-open]').forEach(button => button.addEventListener('click', () => {
      if (!modal || !frame || !title || !download) return;
      lastTrigger = button;
      const id = button.dataset.driveId;
      if (!id) {
        window.open(button.dataset.pdfUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      title.textContent = button.dataset.title;
      frame.src = `https://drive.google.com/file/d/${id}/preview`;
      download.href = `https://drive.google.com/uc?export=download&id=${id}`;
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
