(() => {
  const fallbackUrls = {
    instagram: 'https://www.instagram.com/historiaparaclosefriends/',
    tiktok: 'https://www.tiktok.com/@historiaparaclosefriends',
    youtube: 'https://www.youtube.com/@HistoriaparaCloseFriends'
  };
  const normalize = value => String(value || '').trim().toLowerCase();

  const apply = social => {
    const urls = { ...fallbackUrls };
    (social || []).forEach(item => {
      const name = normalize(item.nombre);
      if (name && item.url) urls[name] = item.url;
    });
    document.querySelectorAll('.social-link[aria-label]').forEach(link => {
      const url = urls[normalize(link.getAttribute('aria-label'))];
      if (!url) return;
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      const open = () => window.open(url, '_blank', 'noopener,noreferrer');
      link.onclick = open;
      link.onkeydown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      };
    });
  };

  window.HCFData?.ready.then(data => apply(data?.social));
})();
