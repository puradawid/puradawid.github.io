var userContent =
  '<div class="input"> '
  +'<input class="form-control" type="text" placeholder="Your Email">'
  +'</div>';

var popup = $("html").jPopup({
  // CSS class for popup parent container
  popupParent : "gee-popup",

  // top position in pixels to trigger the popup
  scrollTopPx : 1500,

  // CSS class for close button
  popupCloseButton : ".popup-close-button",

  // Custom popup content
  heading : "Get extra information about software engineering",
  paragraph : "Oh, my! You are reading my blog, thank you! Do you want to know more about being more productive and valueable software engineer? Sign up for a newsletter!",
  userContent : userContent,
  buttonText : 'Click me',
  buttonClass : "btn btn-info btn-block btn-lg"
});
