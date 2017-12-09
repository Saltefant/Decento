//Using JQuery UI
$(document).ready(function () {
  var delay = 7000,
      fade = 17000;
  var banners = $('.banner');
  var len = banners.length;
  var i = 0;
  setInterval(cycle, delay);

  function cycle() {
      $(banners[i % len]).hide("slide", {
          direction: "left",
          duration: 2500
      });
      $(banners[++i % len]).show("slide", {
          direction: "right",
          duration: 2500
      });
  }
});