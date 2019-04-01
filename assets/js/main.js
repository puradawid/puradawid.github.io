// GTAG events
$('.site-nav a.menu-icon').on('click', function () {
  if (gtag) {
    gtag('event', 'opened_mobile_menu', { event_category: "navigation" });
  }
});

(function ($) {
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

// REGISTERING NEWSLETTER
$("form.newsletter").on("submit", function() {
  if (gtag) gtag('event', 'subscribed_newsletter', { event_category: "newsletter" });
  $.ajax({
    url: "/signup",
    method: "POST",
    dataType: "text",
    headers: { "Accept": "*/*" },
    data: { email: $('form.newsletter input[type=email]').val() }
  });
  $('form').toggleClass('done');
  return false;
});

$(".linkedin,.email,.bio").on("click", function (e) {
  if (gtag) gtag('event', 'contact', { event_category: e.target.className });
});
