$(function () {
  "use strict";
  $(window).scroll(function () {
    var navbar = $(".navbar ");
    $(window).scrollTop() >= navbar.height()
      ? navbar.addClass("scrolled ")
      : navbar.removeClass("scrolled");
  });
  $(".tab-switch li").click(function () {
    $(this).addClass("selected").siblings().removeClass("selected");
    $(".tab-content div").hide();
    $(".tab-content div").eq($(this).index()).show();
  });
});
