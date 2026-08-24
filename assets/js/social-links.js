(() => {
  const destinations = {
    Instagram: 'https://www.instagram.com/historiaparaclosefriends/',
    TikTok: 'https://www.tiktok.com/@historiaparaclosefriends',
    YouTube: 'https://www.youtube.com/@HistoriaparaCloseFriends'
  };
  document.querySelectorAll('.social-link[aria-label]').forEach(link => {
    const destination = destinations[link.getAttribute('aria-label')];
    if (!destination || link.tagName === 'A') return;
    link.setAttribute('role', 'link');
    link.tabIndex = 0;
    link.addEventListener('click', () => window.open(destination, '_blank', 'noopener,noreferrer'));
    link.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        link.click();
      }
    });
  });
})();
