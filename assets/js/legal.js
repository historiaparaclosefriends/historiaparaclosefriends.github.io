(function () {
  'use strict';

  var container = document.getElementById('legal-accordions');
  if (!container) return;

  var fallback = [
    {
      orden: '1',
      titulo: 'Titularidad de la web',
      contenido: 'Historia para Close Friends es un proyecto personal gestionado por Andrea Guillén Rodríguez desde Balaguer, Lleida (España). Para cualquier consulta relacionada con la web puedes escribir a historiaparaclosefriends@gmail.com.',
      activo: 'sí'
    },
    {
      orden: '2',
      titulo: 'Objeto y condiciones de uso',
      contenido: 'Esta web reúne contenidos sobre el pódcast Historia para Close Friends. Puedes navegar por ella y consultar sus episodios, referencias y enlaces. Te pedimos que hagas un uso respetuoso del contenido y que no interfieras en el funcionamiento de la web.',
      activo: 'sí'
    },
    {
      orden: '3',
      titulo: 'Propiedad intelectual',
      contenido: 'Salvo que se indique lo contrario, los textos originales, el diseño, la identidad visual y los materiales propios de Historia para Close Friends pertenecen a Andrea Guillén Rodríguez. No está permitida su reproducción, distribución o transformación sin autorización previa. Las citas, referencias y materiales de terceros se muestran con fines informativos o de divulgación y conservan los derechos de sus respectivos titulares.',
      activo: 'sí'
    },
    {
      orden: '4',
      titulo: 'Enlaces externos',
      contenido: 'La web incluye enlaces a Spotify, YouTube, Google Drive y otras plataformas externas. Historia para Close Friends no controla sus contenidos, disponibilidad ni políticas de privacidad, por lo que te recomendamos revisar sus condiciones antes de utilizar esos servicios.',
      activo: 'sí'
    },
    {
      orden: '5',
      titulo: 'Responsabilidad',
      contenido: 'Se procura que la información publicada sea correcta y esté actualizada, pero no se garantiza que esté libre de errores o interrupciones. Historia para Close Friends no se responsabiliza de los daños derivados del uso de esta web ni del contenido de los enlaces externos.',
      activo: 'sí'
    },
    {
      orden: '6',
      titulo: 'Legislación aplicable',
      contenido: 'Este aviso legal se rige por la legislación española. Para cualquier cuestión relacionada con esta web, las partes se someterán a los juzgados y tribunales que correspondan conforme a la normativa aplicable.',
      activo: 'sí'
    }
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
    var records = data && Array.isArray(data.legal_notice) && data.legal_notice.length
      ? data.legal_notice
      : fallback;

    records = records
      .filter(isActive)
      .sort(function (a, b) {
        return Number(value(a, 'orden')) - Number(value(b, 'orden'));
      });

    container.innerHTML = records.map(function (record, index) {
      var title = value(record, 'titulo') || 'Información legal';
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
