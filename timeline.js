/* CycleWise AU - pregnancy timeline motion (Step 3).
   - The week slider's track fills with colour up to the current week.
     It grows the first time you scroll to it, then follows every week change.
   - The baby-size picture pops a little when the week changes.
   - The 40 week buttons wave in the first time they appear.
   Cosmetic only: without GSAP the slider simply shows its normal look. */
(function(){
  "use strict";
  var slider = document.getElementById("week-slider");
  var badge = document.getElementById("wk-badge");
  if (!slider || !badge) return;

  var hasGsap = !!window.gsap;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = hasGsap && !reduce;

  var fill = { f: 0 };
  var target = 0;
  var introDone = false;

  function paint(){ slider.style.setProperty("--f", fill.f.toFixed(4)); }
  function currentWeek(){
    var n = parseInt((badge.textContent || "").replace(/\D/g, ""), 10);
    return isNaN(n) ? (parseInt(slider.value, 10) || 1) : Math.max(1, Math.min(40, n));
  }
  function goTo(f){
    target = f;
    if (!introDone) return;                 // wait until the slider is on screen
    if (!animate) { fill.f = f; paint(); return; }
    gsap.to(fill, { f: f, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: paint });
  }

  // Follow every week change, whether from the slider, a week button or the calendar.
  var lastWeek = currentWeek();
  target = (lastWeek - 1) / 39;
  new MutationObserver(function(){
    var w = currentWeek();
    if (w === lastWeek) return;
    lastWeek = w;
    goTo((w - 1) / 39);
    var blob = document.querySelector("#wk-blob svg");
    if (animate && blob) {
      gsap.fromTo(blob, { scale: 0.8, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.5, ease: "back.out(2)", clearProps: "transform" });
    }
  }).observe(badge, { childList: true, characterData: true, subtree: true });

  // First time the slider is visible: grow the fill from empty up to this week.
  new IntersectionObserver(function(entries, obs){
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    introDone = true;
    if (!animate) { fill.f = target; paint(); return; }
    gsap.to(fill, { f: target, duration: 1.2, ease: "power2.out", onUpdate: paint });
  }).observe(slider);

  // First time the week buttons are visible: wave them in.
  var strip = document.getElementById("week-filmstrip");
  if (strip && animate) {
    new IntersectionObserver(function(entries, obs){
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      gsap.from(strip.querySelectorAll(".film-item"), {
        opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.02, ease: "power2.out", clearProps: "all"
      });
    }).observe(strip);
  }
})();
