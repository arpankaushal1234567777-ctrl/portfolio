document.body.classList.add("js");


/* ---------- Header Scroll Effect ---------- */

const header = document.querySelector(".site-header");

function updateHeader() {

  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

}

updateHeader();
window.addEventListener("scroll", updateHeader);



/* ---------- Mobile Navigation Toggle ---------- */

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {

  navToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

  });

}



/* ---------- Close Menu When Link Clicked ---------- */

if (navLinks) {

  const links = navLinks.querySelectorAll("a");

  links.forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("open");

      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }

    });

  });

}



/* ---------- Reveal Animation ---------- */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {

  const revealObserver = new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.15
    }

  );

  revealElements.forEach(el => revealObserver.observe(el));

}



/* ---------- Active Section Highlight ---------- */

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

function updateIndicatorToActive(){
  const active = document.querySelector(".nav-link.active");
  if(active){
    moveIndicator(active);
  }
}

if (sections.length > 0 && navItems.length > 0) {

  const sectionObserver = new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          const id = entry.target.getAttribute("id");

          navItems.forEach(link => {

            const href = link.getAttribute("href");

            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }

          });

          updateIndicatorToActive();

        }

      });

    },

    {
      rootMargin: "-40% 0px -40% 0px"
    }

  );

  sections.forEach(section => sectionObserver.observe(section));

}



/* ---------- Scroll Progress Indicator ---------- */

const progressBar = document.querySelector(".scroll-progress");

function updateScrollProgress() {

  if (!progressBar) return;

  const scrollTop = window.scrollY;

  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = progress + "%";

}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();



/* ---------- Moving Navbar Box ---------- */

const indicator = document.querySelector(".nav-indicator");
const navLinkElements = document.querySelectorAll(".nav-link");

function moveIndicator(link){

  if(!indicator || !link) return;

  const linkRect = link.getBoundingClientRect();
  const navRect = link.closest(".nav-links").getBoundingClientRect();

  indicator.style.width = linkRect.width + "px";
  indicator.style.left = (linkRect.left - navRect.left) + "px";

}


/* Hover animation */

navLinkElements.forEach(link => {

  link.addEventListener("mouseenter", () => {
    moveIndicator(link);
  });

});


/* Reset to active when leaving navbar */

const navContainer = document.querySelector(".nav-links");

if(navContainer){

  navContainer.addEventListener("mouseleave", () => {
    updateIndicatorToActive();
  });

}


/* Initial position */

window.addEventListener("load", updateIndicatorToActive);