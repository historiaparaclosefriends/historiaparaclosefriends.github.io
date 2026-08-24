(function () {
  'use strict';

  var STORAGE_KEY = 'hcf_cookie_preferences_v1';
  var banner;

  function readPreferences() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function savePreferences(analytics) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        analytics: Boolean(analytics),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      /* Si el navegador bloquea almacenamiento, la elección se aplica ahora. */
    }
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function applyChoice(analytics) {
    savePreferences(analytics);
    hideBanner();

    if (analytics && window.HCFAnalytics) {
      window.HCFAnalytics.start();
    }
  }

  function textValue(home, key, fallback) {
    var value = home && home[key];
    return String(value || '').trim() || fallback;
  }

  function updateBannerCopy(data) {
    if (!banner) return;

    var home = data && data.home ? data.home : {};
    banner.querySelector('[data-cookie-title]').textContent = textValue(home, 'cookie_banner_title', '🍪 Tus preferencias');
    banner.querySelector('[data-cookie-copy]').textContent = textValue(home, 'cookie_banner_copy', 'Usamos el almacenamiento necesario para recordar tu decisión. Solo activaremos Google Analytics si aceptas las cookies analíticas.');
    banner.querySelector('[data-cookie-reject]').textContent = textValue(home, 'cookie_reject_label', 'Rechazar analítica');
    banner.querySelector('[data-cookie-accept]').textContent = textValue(home, 'cookie_accept_label', 'Aceptar analítica');
  }

  function createBanner() {
    banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML =
      '<h2 class="cookie-banner-title" data-cookie-title>🍪 Tus preferencias</h2>' +
      '<p class="cookie-banner-copy" data-cookie-copy>Usamos el almacenamiento necesario para recordar tu decisión. Solo activaremos Google Analytics si aceptas las cookies analíticas.</p>' +
      '<div class="cookie-banner-links"><a href="/cookies/">Política de cookies</a><a href="/privacidad/">Privacidad</a></div>' +
      '<div class="cookie-banner-actions">' +
        '<button class="cookie-button cookie-button-reject" type="button" data-cookie-reject>Rechazar analítica</button>' +
        '<button class="cookie-button cookie-button-accept" type="button" data-cookie-accept>Aceptar analítica</button>' +
      '</div>';

    document.body.appendChild(banner);

    banner.querySelector('[data-cookie-reject]').addEventListener('click', function () {
      applyChoice(false);
    });
    banner.querySelector('[data-cookie-accept]').addEventListener('click', function () {
      applyChoice(true);
    });

    var ready = window.HCFData && window.HCFData.ready;
    if (ready) ready.then(updateBannerCopy).catch(function () { /* se usa el texto de reserva */ });
  }

  function initialise() {
    createBanner();

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-open-cookie-settings]');
      if (!trigger) return;
      event.preventDefault();
      showBanner();
    });

    var preferences = readPreferences();
    if (!preferences) return;

    hideBanner();
    if (preferences.analytics && window.HCFAnalytics) {
      window.HCFAnalytics.start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
  } else {
    initialise();
  }
}());
