// Old WordPress addresses that may still be bookmarked or linked from elsewhere.
// GitHub Pages cannot send real redirects, so the 404 page forwards these few.
(function () {
  var legacyPaths = {
    '/pricing/': '/licence-and-trial/',
    '/support/': '/support-help-faq/',
    '/contacts/': '/contact/',
    '/blog/': '/'
  };
  var path = window.location.pathname.replace(/\/?$/, '/');
  if (legacyPaths[path]) {
    window.location.replace(legacyPaths[path] + window.location.search + window.location.hash);
  }
})();
