//Navigation snaps to top - jQuery
var mn = $("#navigation");
var menuClicked = true;
  
$(window).scroll(function() {
  
    if ($(this).scrollTop() > 150) {
        mn.addClass("nav-scrolled");
    }
    else {
        mn.removeClass("nav-scrolled");
    }
  
});

//Makes navigation responsive
function ResponsiveFunction() {

        /*var x = document.getElementById("navigation");
        if (x.className === "navigation") {
            x.classList.add("responsive");
        } else {
            x.classList.remove("responsive");
        }*/
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
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display='none';
    }
}