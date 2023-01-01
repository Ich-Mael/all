document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('.pre-w');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }
})



window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  const logo = document.querySelector(".logo-navbar");
  const afro = document.querySelector(".afro");
  const topLink = document.querySelector(".top-link");
  const hk = document.querySelector(".hk");
  const user = document.querySelector("#user");

  logo.classList.toggle("logo-display", window.scrollY > 0);
  nav.classList.toggle("navbar-top", window.scrollY > 0);
  nav.classList.toggle("nav-display", window.scrollY > 10);
  nav.classList.toggle("bg-light", window.scrollY > 0);
  // nav.classList.toggle('navbar-dark', window.scrollY >= 0);
  // nav.classList.toggle('navbar-light', window.scrollY === 0);
  // nav.classList.toggle('bg-light', window.scrollY === 0);

  topLink.classList.toggle("top-btn-display", window.scrollY > 200);

  afro.classList.toggle("afro-shadow", window.scrollY > 0);
  hk.classList.toggle("hk-shadow", window.scrollY > 0);
  user.classList.toggle("user-shadow", window.scrollY > 0);
});


/**
 * Clients Slider
 */

new Swiper('.clients-slider', {
  speed: 400,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  slidesPerView: '',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    320: {
      slidesPerView: 2,
      spaceBetween: 40
    },
    480: {
      slidesPerView: 3,
      spaceBetween: 60
    },
    640: {
      slidesPerView: 4,
      spaceBetween: 80
    },
    992: {
      slidesPerView: 6,
      spaceBetween: 120
    }
  }
});


new Swiper('.swiper', {
  // Optional parameters
  speed: 400,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },

  slidesPerView: 'auto',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 60
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 80
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 120
    }
  }

});