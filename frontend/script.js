// =======================
// Hero Carousel Auto Play
// =======================
document.addEventListener("DOMContentLoaded", function () {
    let carouselElement = document.querySelector("#heroCarousel");
    if (carouselElement) {
      let carousel = new bootstrap.Carousel(carouselElement, {
        interval: 4000, // 4 seconds
        ride: "carousel"
      });
    }
  
    // =======================
    // Smooth Scroll
    // =======================
    const navLinks = document.querySelectorAll("a.nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", function (e) {
        if (this.hash !== "") {
          e.preventDefault();
          const hash = this.hash;
          document.querySelector(hash).scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    });
  
    // =======================
    // Fade-in Animation on Scroll
    // =======================
    const faders = document.querySelectorAll(".fade-in");
    const appearOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    };
  
    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      });
    }, appearOptions);
  
    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  });
  
