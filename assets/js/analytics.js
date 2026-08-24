(function () {
  'use strict';

  var started = false;
  var startPromise = null;

  function validMeasurementId(value) {
    var id = String(value || '').trim().toUpperCase();
    return /^G-[A-Z0-9]+$/.test(id) ? id : '';
  }

  function startWithData(data) {
    if (started) return;

    var id = validMeasurementId(data && data.home && data.home.ga_measurement_id);
    if (!id) return;

    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(tag);
  }

  /*
   * Analytics usa consentimiento básico: el script de Google ni siquiera se
   * descarga hasta que la persona acepta explícitamente las cookies analíticas.
   */
  window.HCFAnalytics = {
    start: function () {
      if (startPromise) return startPromise;

      var ready = window.HCFData && window.HCFData.ready;
      startPromise = (ready || Promise.resolve(null))
        .then(startWithData)
        .catch(function () {
          /* Si falla la lectura de contenido, no iniciamos analítica. */
        });

      return startPromise;
    }
  };
}());
