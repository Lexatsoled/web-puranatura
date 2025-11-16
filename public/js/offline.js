(function () {
  function ping() {
    fetch('/', { method: 'HEAD', cache: 'no-cache' })
      .then(function () {
        location.reload();
      })
      .catch(function () {});
  }
  setInterval(ping, 5000);
  window.addEventListener('online', function () {
    location.reload();
  });
})();
