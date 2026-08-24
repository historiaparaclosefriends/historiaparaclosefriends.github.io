(() => {
  const siteDataUrl = new URL('/content/site-data.json', window.location.origin).href;
  const fallbackVisuals = {
    civilizaciones: { color: '#3170E9', pale: '#96C7FA', image: 'categoria-civilizaciones.png' },
    espana: { color: '#DE7835', pale: '#F5C6A4', image: 'categoria-espana.png' },
    // Rosa claro para el fondo y rosa intenso para los elementos de acción.
    revoluciones: { color: '#EBB6C7', pale: '#F9DDF1', image: 'categoria-revoluciones.png' },
    arte: { color: '#7FCC6E', pale: '#CAEAC2', image: 'categoria-arte.png' }
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const normalize = value => String(value || '').trim().toLowerCase();
  const driveId = value => (String(value || '').match(/[-\w]{25,}/) || [])[0] || '';
  const youtubeId = value => {
    const raw = String(value || '');
    const match = raw.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/i);
    return match ? match[1] : '';
  };
  const visualFor = (category, categories = []) => {
    const id = normalize(category);
    const fromSheet = categories.find(item => normalize(item.id) === id);
    const fallback = fallbackVisuals[id] || fallbackVisuals.civilizaciones;
    // Revoluciones usa deliberadamente dos rosas: el claro en tarjetas/fondos
    // y el intenso en barras, píldoras y botones.
    const accent = id === 'revoluciones' ? fallback.color : (fromSheet?.color || fallback.color);
    return {
      color: accent,
      pale: fallback.pale,
      categoryColor: accent,
      categoryBackground: id === 'revoluciones' ? fallback.pale : '',
      filterColor: accent,
      image: fallback.image
    };
  };
  const orderBy = (items, field = 'orden') => [...(items || [])].sort((a, b) => Number(a[field] || 0) - Number(b[field] || 0));
  const ready = fetch(siteDataUrl, { cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .catch(() => null);

  window.HCFData = { ready, escapeHtml, normalize, driveId, youtubeId, visualFor, orderBy };
})();
