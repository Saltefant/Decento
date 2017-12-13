//Using JQuery UI
$(document).ready(function () {
  var delay = 10000;
  var banners = $('.banner');
  var len = banners.length;
  var i = 0;
  setInterval(cycle, delay);

  function cycle() {
      $(banners[i % len]).hide("slide", {
          direction: "left",
          duration: 3000
      });
      $(banners[++i % len]).show("slide", {
          direction: "right",
          duration: 3000
      });
  }
});