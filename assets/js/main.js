$('.site-nav a.menu-icon').on('click', function () {
  if (gtag) {
    gtag('event', 'opened_mobile_menu', { event_category: "navigation" });
  }
});
