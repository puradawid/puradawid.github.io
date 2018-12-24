(function ($) {

  function hasNotSubsribedYet() {
    return !(localStorage.getItem("newsletter"));
  }

  function subscribed() {
    localStorage.setItem("newsletter", 1);
  }

  function closed() {
    localStorage.setItem("newsletter", 0);
  }

  var hasPopuped = false;

  $(window).on('scroll', function(event) {
    var scrollValue = $(window).scrollTop();
    if (scrollValue >= 500) {
      if (!hasPopuped) {
        hasPopuped = true;
        if (gtag) {
          gtag('event', 'scrolled_down', { event_category: "reading" });
        }
      }
    }
  });
}(jQuery));
