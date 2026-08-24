(function () {
  'use strict';

  var container = document.getElementById('privacy-accordions');
  if (!container) return;

  // Solo se muestra mientras la web aún no se haya actualizado desde Sheets.
  var fallback = [
    { orden: '1', titulo: 'Responsable del tratamiento', contenido: 'La responsable de esta web es Andrea Guillén Rodríguez, titular del proyecto personal Historia para Close Friends. Puedes contactar en historiaparaclosefriends@gmail.com.', activo: 'sí' },
    { orden: '2', titulo: 'Datos que se recogen', contenido: 'La navegación normal por esta web no incluye formularios de registro, cuentas de usuario ni venta de productos. Si escribes al correo de contacto, se tratarán los datos que incluyas en tu mensaje para poder responderte.', activo: 'sí' },
    { orden: '3', titulo: 'Finalidad y base jurídica', contenido: 'Los datos enviados por correo se utilizan únicamente para atender la consulta o solicitud recibida. La base jurídica es tu consentimiento al contactar voluntariamente.', activo: 'sí' },
    { orden: '4', titulo: 'Conservación', contenido: 'Los mensajes y datos asociados se conservarán durante el tiempo necesario para atender la consulta y, cuando corresponda, durante los plazos legales aplicables.', activo: 'sí' },
    { orden: '5', titulo: 'Servicios y enlaces externos', contenido: 'La web contiene enlaces o visores de servicios externos como Spotify, YouTube y Google Drive. Al utilizar esos servicios se aplican sus propias políticas de privacidad y condiciones.', activo: 'sí' },
    { orden: '6', titulo: 'Tus derechos', contenido: 'Puedes solicitar acceso, rectificación, supresión, limitación u oposición al tratamiento de tus datos escribiendo a historiaparaclosefriends@gmail.com. Si consideras que no se han atendido correctamente tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos.', activo: 'sí' }
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
    var records = data && Array.isArray(data.privacy_policy) && data.privacy_policy.length
      ? data.privacy_policy
      : fallback;

    records = records
      .filter(isActive)
      .sort(function (a, b) {
        return Number(value(a, 'orden')) - Number(value(b, 'orden'));
      });

    container.innerHTML = records.map(function (record, index) {
      var title = value(record, 'titulo') || 'Privacidad';
      var content = value(record, 'contenido');
      return '<details class="legal-item"' + (index === 0 ? ' open' : '') + '>' +
        '<summary><span>' + escapeHtml(title) + '</span><span class="legal-toggle" aria-hidden="true"></span></summary>' +
        '<div class="legal-copy">' + formatContent(content) + '</div>' +
      '</details>';
    }).join('');
  }

  var ready = window.HCFData && window.HCFData.ready;
  (ready || Promise.resolve(null)).then(render).catch(function () {
    render(null);
  });
}());
