window.HELP_IMPROVE_VIDEOJS = false;

function loadCarouselItems() {
  let items = [
    "ast",
    "cat",
    "cinnamoroll",
    "duck",
    "eye",
    "headset",
    "hug",
    "keyboard",
    "kid",
    "mouse",
    "odd_eye",
    "plant",
    "rabbit",
    "sekibanki",
    "tiger",
    "timer",
  ];
  carousel = $("#colmapfree-carousel");
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let carouselItem = `
      <div class="item">
        <video poster="" autoplay muted loop playsinline height="100%">
          <source src="static/videos/colmapfree/${item}.mp4" type="video/mp4">
        </video>
      </div>
    `;
    carousel.append(carouselItem);
  }
}

$(document).ready(function() {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  loadCarouselItems();

  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  }

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('.carousel', options);

  // Loop on each carousel initialized
  for(var i = 0; i < carousels.length; i++) {
    // Add listener to  event
    carousels[i].on('before:show', state => {
      console.log(state);
    });
  }

  // Access to bulmaCarousel instance of an element
  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    // bulmaCarousel instance is available as element.bulmaCarousel
    element.bulmaCarousel.on('before-show', function(state) {
      console.log(state);
    });
  }
})
