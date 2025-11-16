document.addEventListener('DOMContentLoaded', function () {
  try {
    document.documentElement.classList.remove('js-loading');
  } catch (e) { console.error(e); }
});
