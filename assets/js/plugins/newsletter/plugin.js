/*
  @author: Ilyas karim <ilyas.datoo@gmail.com>
  @date: 5/may/2016

*/
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

  setInterval(function(){
    if (window.visualViewport && window.visualViewport.width) {
      $(".navbar-brand").html($(document).width());
     } else {
      $(".navbar-brand").html($(document).width());
    }
  },10)
  $.fn.jPopup = function (options) {
    var settings = $.extend({
      popupParent : "gee-popup",
      scrollTopPx : 100,
      popupCloseButton : ".popup-close-button",
      heading : "heading - You can change",
      paragraph : "You can change paragraph from options. You can also change the input into your own template",
      buttonClass : "btn btn-info btn-block btn-lg",
      // openPopup : "asd",
      initThrough : function () {
        if (hasNotSubsribedYet()) {
          $(window).on('scroll', function(event) {
            var scrollValue = $(window).scrollTop();
            if (scrollValue == settings.scrollTopPx || scrollValue > settings.scrollTopPx) {
              // call the popup
              if (hasPopuped == false) {
                if (gtag) gtag('send', 'event', 'newsletter', 'open');
                $.fn.jPopup.openPopup();
              }
            }
          });
        }
      },
      openPopup : function () { }
    }, options);
    var hasPopuped = false;
    var scrollValue = $(window).scrollTop();
    settings.initThrough();
    $(".gee-popup .popup-title").html(settings.heading);
    $(".gee-popup .paragraph").html(settings.paragraph);
    $(".gee-popup .btn").addClass(settings.buttonClass);
    $(".popup-close-button").click(function() {
      closed();
      if (gtag) gtag('send', 'event', 'newsletter', 'closed');
      $('html').toggleClass('active-poup');
      hasPopuped = true;
    });
    $("form").on("submit", function() {
      subscribed();
      if (gtag) gtag('send', 'event', 'newsletter', 'subscribed');
      $.ajax({
        url: "/signup",
        method: "POST",
        dataType: "text",
        headers: { "Accept": "*/*" },
        data: { email: $('.gee-popup .email').val() }
      });
      $('html').toggleClass('active-poup');
      hasPopuped = true;
      return false;
    });
  }
  $.fn.jPopup.openPopup = function () {
    if (window.visualViewport && window.visualViewport.width) {
      $("html").addClass('active-poup');
      $(".gee-popup").width(window.visualViewport.width);
    } else {
      $("html").addClass('active-poup');
    }
  }
}(jQuery))
