(() => {
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
    title.textContent = button.dataset.title;
    frame.src = `https://drive.google.com/file/d/${button.dataset.driveId}/preview`;
    download.href = `https://drive.google.com/uc?export=download&id=${button.dataset.driveId}`;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    close?.focus();
  }));
  close?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal(); });
})();
