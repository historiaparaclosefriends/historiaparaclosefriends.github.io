(function () {
  'use strict';

  var container = document.getElementById('cookies-accordions');
  if (!container) return;

  var fallback = [
    { orden: '1', titulo: 'Qué utilizamos', contenido: 'Esta web utiliza almacenamiento local estrictamente necesario para recordar tu elección sobre las cookies. No se utiliza para elaborar perfiles ni para publicidad.\n\nGoogle Analytics solo se carga si pulsas Aceptar analítica en el aviso de cookies.', activo: 'sí' },
    { orden: '2', titulo: 'Cookies analíticas', contenido: 'Si aceptas la analítica, Google Analytics puede instalar cookies como _ga y _ga_<ID> para medir de forma agregada las visitas y el uso de la web. Su duración puede variar según la configuración de Google y puede llegar a dos años.\n\nNo activamos funciones publicitarias ni señales de Google desde esta web.', activo: 'sí' },
    { orden: '3', titulo: 'Servicios de terceros', contenido: 'Los enlaces y visores de Spotify, YouTube y Google Drive pertenecen a servicios externos. Cuando decides abrirlos, esos servicios pueden utilizar sus propias cookies o tecnologías; consulta sus políticas directamente.', activo: 'sí' },
    { orden: '4', titulo: 'Cómo cambiar tu decisión', contenido: 'Puedes aceptar, rechazar o volver a decidir sobre la analítica en cualquier momento mediante el enlace Configurar cookies que encontrarás al pie de todas las páginas.', activo: 'sí' }
  ];

  function value(record, key) {
    return String((record && record[key]) || '').trim();
  }

  function isActive(record) {
    var state = value(record, 'activo').toLowerCase();
    return state !== 'no' && state !== 'false' && state !== '0';
  }

  function escapeHtml(text) {
    if (window.HCFData && window.HCFData.escapeHtml) return window.HCFData.escapeHtml(text);
    return String(text || '').replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character];
    });
  }

  function formatContent(text) {
    return escapeHtml(text)
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map(function (paragraph) {
        return '<p>' + paragraph.replace(/\n/g, '<br>') + '</p>';
      })
      .join('');
  }

  function render(data) {
    var records = data && Array.isArray(data.cookies_policy) && data.cookies_policy.length
      ? data.cookies_policy
      : fallback;

    records = records.filter(isActive).sort(function (a, b) {
      return Number(value(a, 'orden')) - Number(value(b, 'orden'));
    });

    container.innerHTML = records.map(function (record, index) {
      return '<details class="legal-item"' + (index === 0 ? ' open' : '') + '>' +
        '<summary><span>' + escapeHtml(value(record, 'titulo') || 'Cookies') + '</span><span class="legal-toggle" aria-hidden="true"></span></summary>' +
        '<div class="legal-copy">' + formatContent(value(record, 'contenido')) + '</div>' +
      '</details>';
    }).join('');
  }

  var ready = window.HCFData && window.HCFData.ready;
  (ready || Promise.resolve(null)).then(render).catch(function () { render(null); });
}());
