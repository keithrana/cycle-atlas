/* CycleWise AU - scroll animations (Step 1).
   Purely cosmetic: if GSAP fails to load or the visitor prefers reduced
   motion, this file does nothing and the page looks exactly as before. */
(function(){
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var done = new WeakSet();

  function reveal(panel){
    if (!panel || done.has(panel)) return;
    done.add(panel);

    // Top of the tab: hero text and picture fade up one after another.
    gsap.from(panel.querySelectorAll(".hero > *"), {
      opacity: 0, y: 24, duration: 0.7, stagger: 0.12, ease: "power2.out",
      clearProps: "all"
    });

    // Everything below: fade up when it scrolls into view.
    panel.querySelectorAll(
      ".ref-heading, .ref-grid, .timeline, .week-panel, .filmstrip, .cal-card, .detail-card"
    ).forEach(function(el){
      gsap.from(el, {
        opacity: 0, y: 32, duration: 0.7, ease: "power2.out",
        clearProps: "all",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  function activePanel(){ return document.querySelector(".mode-panel.active"); }

  reveal(activePanel());

  document.querySelectorAll(".mode-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      // Wait one tick so the page's own code switches the tab first.
      setTimeout(function(){ reveal(activePanel()); ScrollTrigger.refresh(); }, 0);
    });
  });
})();
