// Lightweight GA4 loader without inline script. Requires data-ga-id on this script tag.
(function () {
  try {
    var scriptEl =
      document.currentScript ||
      (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      })();
    var GA_ID = scriptEl && scriptEl.getAttribute('data-ga-id');
    if (!GA_ID || GA_ID === 'GA_MEASUREMENT_ID') return; // not configured
    var s = document.createElement('script');
    s.async = true;
    s.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  } catch {
    // noop
  }
})();
