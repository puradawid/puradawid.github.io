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
