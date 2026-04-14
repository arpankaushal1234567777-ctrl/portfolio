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

          if (entry.target.classList.contains("reveal-stagger")) {
            const children = Array.from(entry.target.children);
            children.forEach((child, index) => {
              child.style.transitionDelay = `${index * 80}ms`;
            });
          }

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


/* ---------- Section Depth Parallax ---------- */

const parallaxTargets = [];
const parallaxMedia = window.matchMedia("(max-width: 768px)");
const coarsePointer = window.matchMedia("(pointer: coarse)");

function registerParallax(el, speed) {
  if (!el) return;
  el.classList.add("parallax-layer");
  parallaxTargets.push({ el, speed });
}

registerParallax(document.getElementById("particle-canvas"), 0.035);
registerParallax(document.querySelector(".hero .hero-content"), 0.06);
registerParallax(document.querySelector(".floating-icons"), 0.12);
// Avoid translating whole section containers; it pushed the contact block into the footer on scroll.
// Keep parallax limited to ambient layers so layout spacing remains stable.

let latestScroll = window.scrollY;
let parallaxRaf = null;

function updateParallax() {
  parallaxRaf = null;
  const reduce = parallaxMedia.matches || coarsePointer.matches;
  const factor = reduce ? 0 : 1;

  for (let i = 0; i < parallaxTargets.length; i += 1) {
    const target = parallaxTargets[i];
    const offset = latestScroll * target.speed * factor;
    target.el.style.setProperty("--parallax-y", `${offset}px`);
  }
}

function requestParallaxUpdate() {
  if (parallaxRaf) return;
  parallaxRaf = requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", () => {
  latestScroll = window.scrollY;
  requestParallaxUpdate();
});

window.addEventListener("resize", () => {
  latestScroll = window.scrollY;
  requestParallaxUpdate();
});

updateParallax();


/* ---------- Particle Galaxy Background ---------- */

const particleCanvas = document.getElementById("particle-canvas");

if (particleCanvas) {

  const ctx = particleCanvas.getContext("2d");
  const particles = [];
  const mouse = { x: 0, y: 0 };

  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const baseCount = isCoarse ? 40 : 90;
  let targetCount = baseCount;
  let adaptiveScale = 1;
  let lastTime = performance.now();
  let fpsSamples = [];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = window.innerWidth * dpr;
    particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < targetCount; i += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: 1 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.6
      });
    }
  }

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX - window.innerWidth / 2) * 0.03;
    mouse.y = (event.clientY - window.innerHeight / 2) * 0.03;
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  function animateParticles() {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    const fps = 1000 / Math.max(delta, 16.7);
    fpsSamples.push(fps);
    if (fpsSamples.length > 20) fpsSamples.shift();

    if (fpsSamples.length === 20) {
      const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
      if (avg < 52 && adaptiveScale > 0.6) {
        adaptiveScale = Math.max(0.6, adaptiveScale - 0.1);
        targetCount = Math.round(baseCount * adaptiveScale);
        createParticles();
      } else if (avg > 58 && adaptiveScale < 1) {
        adaptiveScale = Math.min(1, adaptiveScale + 0.1);
        targetCount = Math.round(baseCount * adaptiveScale);
        createParticles();
      }
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      p.x += p.vx + p.z * 0.1;
      p.y += p.vy + p.z * 0.1;

      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;

      const px = p.x + mouse.x * (0.3 + p.z);
      const py = p.y + mouse.y * (0.3 + p.z);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 8;
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  createParticles();
  animateParticles();

}


/* ---------- Premium Cursor Follower ---------- */

const cursorOuter = document.querySelector(".cursor-outer");
const cursorInner = document.querySelector(".cursor-inner");

if (cursorOuter && cursorInner && !window.matchMedia("(pointer: coarse)").matches) {

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ballX = mouseX;
  let ballY = mouseY;
  let innerX = mouseX;
  let innerY = mouseY;

  let outerScale = 1;
  let innerScale = 1;
  let targetOuterScale = 1;
  let targetInnerScale = 1;
  let isHovering = false;
  let isDown = false;
  let magneticX = 0;
  let magneticY = 0;
  let magneticStrength = 0.22;

  let isVisible = false;

  const showCursor = () => {
    if (isVisible) return;
    isVisible = true;
    cursorOuter.classList.add("is-visible");
    cursorInner.classList.add("is-visible");
  };

  const hideCursor = () => {
    isVisible = false;
    cursorOuter.classList.remove("is-visible");
    cursorInner.classList.remove("is-visible");
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  });

  window.addEventListener("mousedown", () => {
    isDown = true;
    targetOuterScale = 0.7;
    targetInnerScale = 0.6;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    targetOuterScale = isHovering ? 1.35 : 1;
    targetInnerScale = isHovering ? 1.1 : 1;
  });

  window.addEventListener("blur", hideCursor);
  document.addEventListener("mouseleave", hideCursor);
  document.addEventListener("mouseenter", showCursor);

  const hoverTargets = document.querySelectorAll(
    "a, button, .btn-primary, .btn-secondary, input, textarea, select, [role='button']"
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      isHovering = true;
      if (!isDown) {
        targetOuterScale = 1.4;
        targetInnerScale = 1.12;
      }
    });

    el.addEventListener("mouseleave", () => {
      isHovering = false;
      magneticX = 0;
      magneticY = 0;
      if (!isDown) {
        targetOuterScale = 1;
        targetInnerScale = 1;
      }
    });

    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (event.clientX - centerX) / (rect.width / 2);
      const offsetY = (event.clientY - centerY) / (rect.height / 2);

      magneticX = offsetX * 10;
      magneticY = offsetY * 10;
    });
  });

  function animateCursor() {

    ballX += (mouseX - ballX) * 0.1;
    ballY += (mouseY - ballY) * 0.1;

    innerX += (mouseX - innerX) * 0.35;
    innerY += (mouseY - innerY) * 0.35;

    const outerEase = isDown ? 0.35 : isHovering ? 0.22 : 0.16;
    const innerEase = isDown ? 0.38 : isHovering ? 0.26 : 0.2;

    outerScale += (targetOuterScale - outerScale) * outerEase;
    innerScale += (targetInnerScale - innerScale) * innerEase;

    magneticX += (0 - magneticX) * (isHovering ? 0.04 : 0.12);
    magneticY += (0 - magneticY) * (isHovering ? 0.04 : 0.12);

    cursorOuter.style.transform =
      `translate3d(${ballX - 18 + magneticX}px, ${ballY - 18 + magneticY}px, 0) scale(${outerScale})`;

    cursorInner.style.transform =
      `translate3d(${innerX - 4}px, ${innerY - 4}px, 0) scale(${innerScale})`;

    requestAnimationFrame(animateCursor);

  }

  animateCursor();

}


/* ---------- Magnetic Buttons ---------- */

const magneticButtons = document.querySelectorAll(".btn-primary, .btn-secondary, button");

magneticButtons.forEach((button) => {
  let rafId = null;

  const move = (event) => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const rect = button.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      const strength = 12;

      button.style.setProperty("--magnetic-x", `${relX * strength}px`);
      button.style.setProperty("--magnetic-y", `${relY * strength}px`);
    });
  };

  const reset = () => {
    if (rafId) cancelAnimationFrame(rafId);
    button.style.setProperty("--magnetic-x", "0px");
    button.style.setProperty("--magnetic-y", "0px");
  };

  button.addEventListener("mousemove", move);
  button.addEventListener("mouseleave", reset);
});


/* ---------- Project Card 3D Effects ---------- */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  let rect = null;
  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;
  let isActive = false;

  const updateRect = () => {
    rect = card.getBoundingClientRect();
  };

  const onMove = (event) => {
    if (!rect) updateRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX = (x / rect.width) * 2 - 1;
    mouseY = (y / rect.height) * 2 - 1;

    if (!isActive) {
      isActive = true;
      card.style.setProperty("--card-scale", "1.02");
      card.style.setProperty("--card-y", "-6px");
    }

    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  };

  const onLeave = () => {
    isActive = false;
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
    card.style.setProperty("--card-scale", "1");
    card.style.setProperty("--card-x", "0px");
    card.style.setProperty("--card-y", "0px");
    card.style.setProperty("--light-x", "50%");
    card.style.setProperty("--light-y", "50%");
    card.style.setProperty("--card-shadow", "none");
    card.style.setProperty("--layer-title-x", "0px");
    card.style.setProperty("--layer-title-y", "0px");
    card.style.setProperty("--layer-body-x", "0px");
    card.style.setProperty("--layer-body-y", "0px");
    card.style.setProperty("--layer-btn-x", "0px");
    card.style.setProperty("--layer-btn-y", "0px");
    mouseX = 0;
    mouseY = 0;
  };

  const render = () => {
    rafId = null;
    if (!rect) updateRect();

    const rotateX = (-mouseY * 8).toFixed(2);
    const rotateY = (mouseX * 10).toFixed(2);
    const shadowX = (-mouseX * 14).toFixed(2);
    const shadowY = (-mouseY * 14).toFixed(2);

    card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    card.style.setProperty("--card-x", `${mouseX * 2}px`);

    card.style.setProperty(
      "--card-shadow",
      `${shadowX}px ${shadowY}px 28px rgba(0,0,0,0.45)`
    );

    const lightX = `${((mouseX + 1) / 2) * 100}%`;
    const lightY = `${((mouseY + 1) / 2) * 100}%`;
    card.style.setProperty("--light-x", lightX);
    card.style.setProperty("--light-y", lightY);

    card.style.setProperty("--layer-title-x", `${mouseX * 4}px`);
    card.style.setProperty("--layer-title-y", `${mouseY * 4}px`);
    card.style.setProperty("--layer-body-x", `${mouseX * 6}px`);
    card.style.setProperty("--layer-body-y", `${mouseY * 6}px`);
    card.style.setProperty("--layer-btn-x", `${mouseX * 8}px`);
    card.style.setProperty("--layer-btn-y", `${mouseY * 8}px`);
  };

  card.addEventListener("mouseenter", updateRect);
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
  window.addEventListener("resize", updateRect);
});
