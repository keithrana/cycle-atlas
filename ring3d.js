/* CycleWise AU - 3D cycle ring (Step 2).
   Draws the same four phase arcs as the flat SVG ring, in 3D.
   The page code sends the numbers via the "cycle:ring" event.
   If WebGL is missing or anything fails, the flat ring stays visible. */
(function(){
  "use strict";
  try {
    if (!window.THREE) return;
    var art = document.getElementById("phase-arc-menstrual");
    art = art && art.closest(".hero-art");
    if (!art) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var svg = art.querySelector("svg");
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "ring3d";

    var renderer;
    try { renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true}); }
    catch(e){ return; }   // no WebGL: keep the flat ring

    var R = 1, TUBE = 0.085;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.set(0, 0, 5.2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    var sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(2, 3, 4);
    scene.add(sun);

    var group = new THREE.Group();
    scene.add(group);

    function cssColor(name){
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return new THREE.Color(v || "#888888");
    }
    function point(deg, r){
      var a = deg * Math.PI / 180;           // 0 deg = top, clockwise
      return new THREE.Vector3(Math.sin(a) * r, Math.cos(a) * r, 0);
    }
    class ArcCurve extends THREE.Curve {
      constructor(a0, a1){ super(); this.a0 = a0; this.a1 = a1; }
      getPoint(t, target){
        return (target || new THREE.Vector3()).copy(point(this.a0 + (this.a1 - this.a0) * t, R));
      }
    }

    var data = window.cycleRingData || null;
    var meshes = [];

    function clear(){
      meshes.forEach(function(m){
        group.remove(m); m.geometry.dispose(); m.material.dispose();
      });
      meshes = [];
    }
    function add(mesh){ group.add(mesh); meshes.push(mesh); }
    function mat(c){ return new THREE.MeshStandardMaterial({color: c, roughness: 0.45, metalness: 0.05}); }

    function build(){
      clear();
      if (!data) return;
      var cols = {
        menstrual: cssColor("--period"),
        follicular: cssColor("--ovulation-soft"),
        fertile: cssColor("--fertile"),
        luteal: cssColor("--pregnancy-soft"),
        ink: cssColor("--ink")
      };
      var arcs = [
        [0, data.perEnd, cols.menstrual],
        [data.perEnd, data.fertStart, cols.follicular],
        [data.fertStart, data.fertEnd, cols.fertile],
        [data.lutStart, 360, cols.luteal]
      ];
      arcs.forEach(function(a){
        var end = Math.max(a[1], a[0] + 0.5);
        var tube = new THREE.Mesh(new THREE.TubeGeometry(new ArcCurve(a[0], end), 48, TUBE, 16, false), mat(a[2]));
        add(tube);
        [a[0], end].forEach(function(deg){        // round end caps
          var cap = new THREE.Mesh(new THREE.SphereGeometry(TUBE, 16, 12), mat(a[2]));
          cap.position.copy(point(deg, R));
          add(cap);
        });
      });
      var marker = new THREE.Mesh(new THREE.SphereGeometry(TUBE * 1.9, 24, 16), mat(cols.ink));
      marker.position.copy(point(data.todayAngle, R));
      marker.position.z = TUBE * 0.6;
      add(marker);
    }

    function resize(){
      var w = svg.getBoundingClientRect().width || 220;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, w, false);
      canvas.style.width = canvas.style.height = w + "px";
    }

    var visible = false, raf = 0;
    function frame(t){
      raf = 0;
      var s = t / 1000;
      group.rotation.x = -0.55 + (reduce ? 0 : Math.sin(s * 0.6) * 0.12);
      group.rotation.y = reduce ? 0.25 : Math.sin(s * 0.4) * 0.45;
      renderer.render(scene, camera);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    function kick(){ if (!raf) raf = requestAnimationFrame(frame); }

    // Show the 3D ring; hide the flat arcs but keep the "CYCLE DAY" text.
    art.classList.add("has-3d");
    art.insertBefore(canvas, svg);
    resize();
    build();
    kick();

    window.addEventListener("cycle:ring", function(e){ data = e.detail; build(); kick(); });
    window.addEventListener("resize", function(){ resize(); kick(); });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(){ build(); kick(); });

    // Only animate while the ring is actually on screen (saves battery).
    new IntersectionObserver(function(entries){
      visible = entries[0].isIntersecting;
      if (visible) { resize(); kick(); }
    }).observe(canvas);
  } catch(err) {
    // Anything went wrong: leave the flat ring alone.
    var c = document.querySelector(".ring3d"); if (c) c.remove();
    var h = document.querySelector(".hero-art.has-3d"); if (h) h.classList.remove("has-3d");
    if (window.console) console.warn("3D ring disabled:", err && err.message);
  }
})();
