//Navigation snaps to top - jQuery
var mn = $("#navigation");
var nl =$("#nav-logo");
var menuClicked = true;
  
$(window).scroll(function() {
  
    if ($(this).scrollTop() > 150) {
        mn.addClass("nav-scrolled");
        nl.addClass("scrolled");
    }
    else {
        mn.removeClass("nav-scrolled");
        nl.removeClass("scrolled");
    }
  
});

//Makes navigation responsive
function ResponsiveFunction() {
    if(menuClicked) {
    mn.addClass("responsive");
    menuClicked = false;
    } else {
    mn.removeClass("responsive");
    menuClicked = true;
    }
}

//Login modal
// Get the modal
var modal = document.getElementById('modalId');
var nav = document.getElementById('linkId');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display='none';
    }
// Close navigation if open
    if (event.target !== nav && !menuClicked) {
        ResponsiveFunction();
    }
}