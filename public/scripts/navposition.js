var mn = $("#menu");
  
$(window).scroll(function() {
  
    if ($(this).scrollTop() > 100) {
        mn.addClass("nav-scrolled");
    }
    else {
        mn.removeClass("nav-scrolled");
    }
  
});