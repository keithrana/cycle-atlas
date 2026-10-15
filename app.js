(function(){
  "use strict";

  /* ---------------- date helpers ---------------- */
  function toDate(y,m,d){ return new Date(y,m,d); }
  function fromInput(str){
    if(!str) return null;
    var p = str.split("-");
    return new Date(+p[0], +p[1]-1, +p[2]);
  }
  function toInputVal(d){
    return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  }
  function addDays(d,n){ var r=new Date(d); r.setDate(r.getDate()+n); return r; }
  function daysBetween(a,b){ // b - a, in whole days, ignoring time
    var A = new Date(a.getFullYear(),a.getMonth(),a.getDate());
    var B = new Date(b.getFullYear(),b.getMonth(),b.getDate());
    return Math.round((B-A)/86400000);
  }
  function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function mod(n,m){ return ((n % m) + m) % m; }
  var MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var today = new Date(); today.setHours(0,0,0,0);

  function loadLS(key, fallback){
    try{ var v = localStorage.getItem(key); return v===null ? fallback : v; }catch(e){ return fallback; }
  }
  function saveLS(key, val){ try{ localStorage.setItem(key,val); }catch(e){} }

  /* ---------------- mode switching ---------------- */
  var modeBtns = document.querySelectorAll(".mode-btn");
  var panels = { period: document.getElementById("mode-period"), ovulation: document.getElementById("mode-ovulation"), pregnancy: document.getElementById("mode-pregnancy") };
  modeBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      modeBtns.forEach(function(b){ b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected","true");
      Object.keys(panels).forEach(function(k){ panels[k].classList.remove("active"); });
      panels[btn.dataset.mode].classList.add("active");
      saveLS("ca-mode", btn.dataset.mode);
    });
  });
  var savedMode = loadLS("ca-mode", null);
  if(savedMode && panels[savedMode]){
    modeBtns.forEach(function(b){ b.classList.toggle("active", b.dataset.mode===savedMode); b.setAttribute("aria-selected", b.dataset.mode===savedMode ? "true":"false"); });
    Object.keys(panels).forEach(function(k){ panels[k].classList.toggle("active", k===savedMode); });
  }

  /* ================================================================
     PHASE + OVULATION REFERENCE DATA
  ================================================================ */
  var PHASES = {
    menstrual: {
      title:"Menstrual", color:"var(--period)", soft:"var(--period-soft)",
      window:"Cycle day 1 through the end of bleeding",
      desc:"The uterine lining sheds because no pregnancy occurred last cycle. Estrogen and progesterone are both at their lowest point of the month.",
      hormone:"Estrogen & progesterone: low", energy:"Energy: lowest",
      symptoms:"Cramping, fatigue, lower back ache, mood dips",
      tip:"Iron-rich food, gentle movement, and heat on the lower abdomen ease cramping better than rest alone."
    },
    follicular: {
      title:"Follicular", color:"var(--ovulation)", soft:"var(--ovulation-soft)",
      window:"Cycle day 1 through ovulation (overlaps menstrual)",
      desc:"The pituitary releases FSH, prompting several ovarian follicles to mature. Estrogen climbs steadily as one dominant follicle takes the lead.",
      hormone:"Estrogen: rising", energy:"Energy: climbing",
      symptoms:"Clearer skin, sharper focus, rising motivation",
      tip:"This is the physiologically best window for starting new training blocks or demanding projects."
    },
    ovulatory: {
      title:"Ovulatory", color:"var(--ovulation-strong)", soft:"var(--ovulation-soft)",
      window:"Roughly one day, mid-cycle",
      desc:"A surge in luteinizing hormone (LH) triggers the dominant follicle to release its egg. This is the single most fertile day of the cycle.",
      hormone:"LH: sharp surge", energy:"Energy & libido: peak",
      symptoms:"Egg-white cervical mucus, one-sided pelvic twinge (mittelschmerz)",
      tip:"Ovulation predictor kits detect the LH surge roughly 24–36 hours before the egg is released."
    },
    luteal: {
      title:"Luteal", color:"var(--pregnancy)", soft:"var(--pregnancy-soft)",
      window:"Ovulation through the day before your next period",
      desc:"The ruptured follicle becomes the corpus luteum and secretes progesterone to prepare the uterine lining. If no implantation occurs, hormone levels fall and the cycle restarts.",
      hormone:"Progesterone: rises then falls", energy:"Energy: gradually declining",
      symptoms:"Bloating, breast tenderness, irritability, food cravings (PMS)",
      tip:"Basal body temperature stays elevated ~0.3–0.5°C through this phase — a useful way to confirm ovulation already happened."
    }
  };

  // offset relative to ovulation day (0 = ovulation)
  var OVULATION_DAYS = {
    "-5": {fert:"Low", fertClass:"fert-low", bbt:"Baseline (pre-shift)", mucus:"Dry to sticky", note:"Sperm can survive up to 5 days, so conception is technically possible starting here."},
    "-4": {fert:"Low–moderate", fertClass:"fert-low", bbt:"Baseline", mucus:"Sticky, cloudy", note:"Fertility begins climbing as estrogen rises toward its pre-ovulation peak."},
    "-3": {fert:"Moderate", fertClass:"fert-mid", bbt:"Baseline", mucus:"Creamy, increasing in volume", note:"Cervical mucus is becoming more hospitable to sperm."},
    "-2": {fert:"High", fertClass:"fert-high", bbt:"Baseline", mucus:"Thin, stretchy, egg-white-like", note:"One of the two most fertile days of the entire cycle."},
    "-1": {fert:"Peak", fertClass:"fert-peak", bbt:"Baseline (often the day of the LH surge)", mucus:"Clear, slippery, maximum stretch", note:"Statistically the single highest-probability day for conception."},
    "0": {fert:"Peak", fertClass:"fert-peak", bbt:"Still baseline — the rise hasn't happened yet", mucus:"Egg-white, abundant", note:"The egg is released and is viable for roughly 12–24 hours. Some feel a one-sided twinge (mittelschmerz)."},
    "1": {fert:"Dropping fast", fertClass:"fert-mid", bbt:"Beginning to rise ~0.3–0.5°C", mucus:"Becoming tacky again", note:"The egg's fertile window is closing; BBT starts its post-ovulation climb."},
    "2": {fert:"Very low", fertClass:"fert-low", bbt:"Elevated, holding", mucus:"Dry or minimal", note:"Progesterone from the corpus luteum keeps temperature elevated through the luteal phase."},
    "3": {fert:"Essentially none", fertClass:"fert-low", bbt:"Elevated, holding", mucus:"Dry", note:"If fertilization happened, the embryo is traveling toward the uterus."},
    "4": {fert:"Essentially none", fertClass:"fert-low", bbt:"Elevated, holding", mucus:"Dry", note:"Too late in the cycle for a new ovulation; luteal phase symptoms may start appearing."},
    "5": {fert:"Essentially none", fertClass:"fert-low", bbt:"Elevated, holding", mucus:"Dry", note:"Implantation, if it happens this cycle, typically occurs around days 6–10 after ovulation."}
  };
  var FERT_COLOR = {"fert-low":"var(--ink-soft)","fert-mid":"var(--fertile)","fert-high":"var(--fertile-strong)","fert-peak":"var(--ovulation-strong)"};

  function phaseForDayInCycle(dic, periodLen, ovulationDic){
    if(dic < periodLen) return "menstrual";
    if(dic < ovulationDic) return "follicular";
    if(dic === ovulationDic) return "ovulatory";
    return "luteal";
  }
  function isFertile(dic, ovulationDic){
    return dic >= ovulationDic - 5 && dic <= ovulationDic;
  }

  /* ================================================================
     PREGNANCY WEEK DATA (1–40)
  ================================================================ */
  var WEEKS = [
    {c:"a poppy seed (not yet fertilized)", m:"n/a", dev:"Pregnancy is dated from the first day of this period, before conception happens — your body is shedding last cycle's lining and preparing a fresh egg.", body:"This week looks and feels like an ordinary period.", tip:"If you're trying to conceive, this is a good week to start a prenatal vitamin with folic acid."},
    {c:"an egg cell", m:"~0.1 mm", dev:"Rising estrogen prompts an egg to mature; ovulation typically occurs near the end of this week, roughly two weeks before a missed period.", body:"Cervical mucus becomes clear and stretchy around ovulation — a natural fertility sign.", tip:"This is the fertile window if you're trying to conceive — see the Ovulation tab for day-by-day detail."},
    {c:"a grain of sand", m:"~0.1–0.2 mm", dev:"If sperm meets egg this week, fertilization occurs in the fallopian tube and the resulting cell begins dividing as it travels toward the uterus.", body:"No symptoms are detectable yet — even a sensitive test won't turn positive for another week or two.", tip:"Implantation, if it happens, usually occurs 6–10 days after ovulation."},
    {c:"a poppy seed", m:"~0.1 mm", dev:"The fertilized egg implants in the uterine lining and begins producing hCG, the hormone home pregnancy tests detect.", body:"Most people notice no symptoms yet; a sensitive test may already turn positive near the end of this week.", tip:"A missed period is usually the first sign — testing a few days after that gives the most reliable result."},
    {c:"a sesame seed", m:"~2 mm", dev:"The neural tube — the earliest structure of the brain and spinal cord — begins to form, along with the first blood vessels.", body:"A missed period is usually the first clear sign; fatigue and tender breasts may begin.", tip:"Avoid alcohol and confirm any medications with a clinician — this window is critical for early development."},
    {c:"a lentil", m:"~4 mm", dev:"A primitive heart tube starts beating, and the beginnings of the face, arms, and legs appear as small buds.", body:"Morning sickness and smell sensitivity often begin here, though timing varies widely.", tip:"Small, frequent, bland meals tend to sit better than three large ones if nausea has started."},
    {c:"a blueberry", m:"~1.3 cm", dev:"The brain is dividing into distinct sections, and the arm and leg buds are elongating into recognizable limbs.", body:"Bloating and mild cramping are common as the uterus makes room to grow.", tip:"This is when most people schedule their first prenatal appointment — dating scans are most accurate now."},
    {c:"a raspberry", m:"~1.6 cm", dev:"Fingers and toes are forming, still webbed; the heart now has four distinct chambers.", body:"Fatigue often peaks around this point as progesterone rises sharply.", tip:"Rest when you can — first-trimester exhaustion is real and temporary, not a sign anything is wrong."},
    {c:"a grape", m:"~2.3 cm · 4 g", dev:"The embryo is officially called a fetus starting around now; essential organs are all present in early form and the tail has disappeared.", body:"Nausea, food aversions, and a heightened sense of smell are often at their strongest.", tip:"Ginger tea, vitamin B6, and staying hydrated are commonly recommended first-line options for nausea."},
    {c:"a kumquat", m:"~3 cm · 7 g", dev:"Vital organs — kidneys, liver, brain — are functioning in a basic form, and tiny fingernail beds are forming.", body:"A visible baby bump is still unlikely, though clothes may feel tighter.", tip:"Ask your provider about first-trimester screening options available in this window."},
    {c:"a fig", m:"~4.1 cm · 10 g", dev:"The fetus can now bend its arms and legs, and tooth buds are forming beneath the gums.", body:"Round ligament twinges may start as the uterus stretches.", tip:"Gentle stretching and changing positions slowly can ease early ligament discomfort."},
    {c:"a lime", m:"~5.4 cm · 14 g", dev:"Reflexes are developing — fingers can curl, and toes can wiggle, though it can't be felt yet.", body:"The end of the first trimester is near, and miscarriage risk drops meaningfully from here.", tip:"Many people choose to share their pregnancy news around now, though the choice is entirely personal."},
    {c:"a plum", m:"~6.7 cm · 23 g", dev:"Vocal cords are forming, and unique fingerprints are being etched onto tiny fingertips.", body:"Some early nausea may start easing as the placenta takes over hormone production.", tip:"The nuchal translucency scan, if chosen, is typically done between now and week 13."},
    {c:"a passion fruit", m:"~10 cm · 45 g", dev:"Baby can open and close fists and may even suck a thumb; genitals are differentiating, though not yet visible on ultrasound.", body:"For many, first-trimester nausea and fatigue begin to lift.", tip:"Second-trimester energy often supports resuming or starting light-to-moderate exercise — check in with your provider first."},
    {c:"a peach", m:"~11.6 cm · 58 g", dev:"Vocal cords are complete and the intestines, which developed in the umbilical cord, move into the abdomen.", body:"Welcome to the second trimester — often called the most comfortable stretch of pregnancy.", tip:"An anatomy scan is usually scheduled in the coming weeks; ask your clinic when it's booked."},
    {c:"a lemon", m:"~13 cm · 70 g", dev:"Fine, downy hair called lanugo begins covering the body, and the kidneys are producing urine into the amniotic fluid.", body:"A small bump may finally become visible; appetite often improves noticeably.", tip:"Iron needs rise sharply now — leafy greens, legumes, and lean meat help meet increased demand."},
    {c:"an apple", m:"~14.2 cm · 95 g", dev:"The skeleton continues hardening and baby can sense light through closed eyelids.", body:"Skin changes like a faint linea nigra or darkened areolas may appear as pigment increases.", tip:"Daily SPF helps limit pregnancy-related skin pigmentation (melasma) from sun exposure."},
    {c:"an avocado", m:"~16 cm · 135 g", dev:"The placenta is now fully formed and functioning as baby's life-support system.", body:"First flutters of movement ('quickening') may be felt any time from now through week 20.", tip:"Movement timing varies a lot — first pregnancies and anterior placentas often mean feeling it later."},
    {c:"a pomegranate", m:"~17.7 cm · 160 g", dev:"The skeleton is converting from cartilage to true bone, and fat stores are just beginning to accumulate.", body:"The uterus is now roughly at the level of the belly button.", tip:"A pregnancy support pillow can meaningfully improve sleep as side-sleeping becomes more comfortable."},
    {c:"a bell pepper", m:"~19 cm · 190 g", dev:"Ears have reached their final position and baby may begin startling at loud external sounds.", body:"Quickening is commonly felt by now — often described as bubbles or light taps.", tip:"Try narrating your day out loud — hearing is developing and familiar voices become recognizable over time."},
    {c:"a mango", m:"~20.3 cm · 240 g", dev:"A waxy coating called vernix caseosa begins protecting the skin, and taste buds are forming.", body:"Backaches can start as posture shifts to balance the growing bump.", tip:"A supportive, flatter shoe and a pillow between the knees at night both help low back strain."},
    {c:"a banana", m:"~25.6 cm · 300 g", dev:"The detailed anatomy ultrasound is often done around now if it hasn't happened already, and sex can typically be identified on it.", body:"Movements are stronger and more frequent; the uterus is now level with the belly button.", tip:"If you want to know the sex and haven't had the anatomy scan yet, ask your clinic to schedule it soon — it's usually done weeks 18–22."},
    {c:"a carrot", m:"~27 cm · 360 g", dev:"Baby is swallowing small amounts of amniotic fluid, giving the digestive system practice.", body:"Stretch marks may start appearing on the belly, hips, or chest as skin stretches.", tip:"Moisturizing won't prevent stretch marks, but it can ease the itchiness that comes with stretching skin."},
    {c:"a papaya", m:"~28.9 cm · 430 g", dev:"Eyebrows and eyelids are fully formed, and the sense of touch is developing rapidly.", body:"Braxton Hicks — brief, painless practice contractions — may be felt occasionally from here on.", tip:"Braxton Hicks usually ease with a change of position or a glass of water; true labor contractions don't."},
    {c:"an ear of corn", m:"~32.2 cm · 600 g", dev:"The lungs begin producing surfactant, a substance essential for breathing air after birth — a key viability milestone.", body:"The linea nigra (a dark vertical line on the belly) may become more visible.", tip:"This week is often cited as the threshold of viability with intensive neonatal care, should birth happen very early."},
    {c:"a cauliflower head", m:"~33.7 cm · 660 g", dev:"Baby can now respond to your voice, and hand grip strength is developing.", body:"The glucose screening test for gestational diabetes is typically scheduled around now.", tip:"If asked to fast beforehand, follow your clinic's instructions closely for an accurate glucose result."},
    {c:"a head of lettuce", m:"~35.6 cm · 760 g", dev:"Eyes begin to open after being fused shut since early development, and hair may be visibly growing.", body:"Round ligament pain and rib discomfort can increase as space gets tighter.", tip:"A maternity support band can ease rib and ligament pressure during long periods of standing or walking."},
    {c:"a bunch of scallions", m:"~36.6 cm · 875 g", dev:"Brain tissue is developing rapidly, and baby is developing regular hiccups you may be able to feel.", body:"Third trimester begins soon — appointments typically become more frequent from here.", tip:"Hiccup-like twitches are completely normal and are the diaphragm practicing its rhythm."},
    {c:"an eggplant", m:"~37.6 cm · 1.1 kg", dev:"Eyes can blink now, and baby may cycle through active REM sleep.", body:"Welcome to the third trimester — the home stretch begins.", tip:"This is a common time to start planning a hospital bag and reviewing birth preferences."},
    {c:"a butternut squash", m:"~38.6 cm · 1.2 kg", dev:"Bones are fully formed but still soft and flexible, ready to move through the birth canal.", body:"Frequent urination often returns as the head engages lower in the pelvis.", tip:"Kick counts become a useful daily check-in — note baby's typical pattern of movement."},
    {c:"a large cabbage", m:"~39.9 cm · 1.3 kg", dev:"The brain is developing at its fastest rate yet, adding folds and surface area.", body:"Sleep can become harder to find as the bump limits comfortable positions.", tip:"A full-body pregnancy pillow supports the belly, back, and knees simultaneously."},
    {c:"a coconut", m:"~41.1 cm · 1.5 kg", dev:"All five senses are now functioning, and baby is gaining roughly half a pound a week.", body:"Colostrum, the first form of breast milk, may begin to leak slightly.", tip:"A few nursing pads in your bag can help if colostrum leaking becomes noticeable."},
    {c:"a jicama", m:"~42.4 cm · 1.7 kg", dev:"Baby is practicing breathing movements against a closed airway, strengthening the lungs.", body:"Swelling and mild carpal tunnel tingling in the hands can appear from fluid retention.", tip:"Report sudden or severe swelling to your provider promptly — it can occasionally signal preeclampsia."},
    {c:"a pineapple", m:"~43.7 cm · 1.9 kg", dev:"Bones are hardening overall, though the skull stays deliberately soft and flexible for delivery.", body:"Pelvic pressure increases as baby continues descending.", tip:"Prenatal massage or a warm bath can ease the deep pelvic ache many feel this week."},
    {c:"a cantaloupe", m:"~45 cm · 2.1 kg", dev:"The central nervous system is maturing quickly, and baby's grip is now quite strong.", body:"Braxton Hicks contractions often become more noticeable and frequent.", tip:"Time any contractions that feel different — regular, intensifying, closer together warrants a call to your provider."},
    {c:"a honeydew melon", m:"~46.2 cm · 2.4 kg", dev:"The kidneys are fully developed, and the liver is processing waste products on its own.", body:"You may feel baby 'drop' lower as it settles into position for birth.", tip:"Lightening (the baby dropping) can ease heartburn but often increases bathroom trips."},
    {c:"a head of romaine", m:"~47.4 cm · 2.6 kg", dev:"Most physical development is complete; the focus now is steady weight gain.", body:"You've just reached 'early term' — babies born from here on tend to do very well.", tip:"Pack your hospital bag if you haven't yet — early-term babies can arrive with little warning."},
    {c:"a leek", m:"~49.8 cm · 3.1 kg", dev:"Baby continues laying down fat for temperature regulation after birth, and the brain is still rapidly developing.", body:"Nesting instinct and a burst of energy are common right before labor.", tip:"Balance nesting energy with rest — labor's timing is unpredictable."},
    {c:"a mini watermelon", m:"~50.7 cm · 3.3 kg", dev:"Full term. The lungs are completing final maturation in preparation for that first breath.", body:"Increased pelvic pressure and more frequent, intense Braxton Hicks are common.", tip:"Watch for your labor signs: regular contractions, water breaking, or a bloody show."},
    {c:"a small pumpkin", m:"~51.2 cm · 3.5 kg", dev:"Baby is fully developed and simply continuing to grow, ready to meet you.", body:"If labor hasn't started, your provider will discuss monitoring or induction options.", tip:"Most babies arrive within two weeks of their due date in either direction — both are entirely normal."}
  ];

  /* ================================================================
     SVG helpers
  ================================================================ */
  function polarToXY(cx,cy,r,angleDeg){
    var rad = (angleDeg-90) * Math.PI/180;
    return [cx + r*Math.cos(rad), cy + r*Math.sin(rad)];
  }
  function arcPath(cx,cy,r,startDeg,endDeg){
    if(endDeg <= startDeg) endDeg = startDeg + 0.01;
    var s = polarToXY(cx,cy,r,startDeg), e = polarToXY(cx,cy,r,endDeg);
    var large = (endDeg-startDeg) > 180 ? 1 : 0;
    return "M "+s[0].toFixed(2)+" "+s[1].toFixed(2)+" A "+r+" "+r+" 0 "+large+" 1 "+e[0].toFixed(2)+" "+e[1].toFixed(2);
  }

  /* ================================================================
     SHARED STATE: period start / cycle length / period length
  ================================================================ */
  var exampleStart = addDays(today, -10);
  var startInput = document.getElementById("p-start");
  var cycleLenInput = document.getElementById("p-cyclelen");
  var periodLenInput = document.getElementById("p-periodlen");

  var savedStart = loadLS("ca-start", null);
  var savedCycleLen = loadLS("ca-cyclelen", null);
  var savedPeriodLen = loadLS("ca-periodlen", null);
  var usingExample = !savedStart;

  startInput.value = savedStart || toInputVal(exampleStart);
  cycleLenInput.value = savedCycleLen || 28;
  periodLenInput.value = savedPeriodLen || 5;

  function getCycleState(){
    return {
      start: fromInput(startInput.value) || exampleStart,
      cycleLen: Math.max(21, Math.min(35, parseInt(cycleLenInput.value,10) || 28)),
      periodLen: Math.max(2, Math.min(10, parseInt(periodLenInput.value,10) || 5))
    };
  }

  var pCalMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var oCalMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var pSelectedDate = new Date(today);
  var oSelectedDate = new Date(today);

  [startInput,cycleLenInput,periodLenInput].forEach(function(inp){
    inp.addEventListener("input", function(){
      saveLS("ca-start", startInput.value);
      saveLS("ca-cyclelen", cycleLenInput.value);
      saveLS("ca-periodlen", periodLenInput.value);
      usingExample = false;
      document.getElementById("p-example-note").style.display = "none";
      document.getElementById("pr-example-note").style.display = "none";
      renderAll();
    });
  });
  if(!usingExample) document.getElementById("p-example-note").style.display = "none";

  /* ================================================================
     CALENDAR RENDERING (shared builder)
  ================================================================ */
  function buildCalendar(gridEl, weekdayHeaderIgnored, monthDate, dayClassifier, onSelect, selectedDate){
    gridEl.innerHTML = "";
    var year = monthDate.getFullYear(), month = monthDate.getMonth();
    var firstDow = new Date(year,month,1).getDay();
    var daysInMonth = new Date(year,month+1,0).getDate();
    var totalCells = Math.ceil((firstDow+daysInMonth)/7)*7;
    for(var i=0;i<totalCells;i++){
      var dayNum = i - firstDow + 1;
      var cell = document.createElement("button");
      cell.className = "day-cell";
      if(dayNum < 1 || dayNum > daysInMonth){
        cell.classList.add("pad");
        gridEl.appendChild(cell);
        continue;
      }
      var d = new Date(year,month,dayNum);
      var info = dayClassifier(d);
      cell.innerHTML = "<span>"+dayNum+"</span>";
      if(info.period) cell.classList.add("is-period");
      if(info.fertile) cell.classList.add("is-fertile");
      if(info.ovulation) cell.classList.add("is-ovulation");
      if(sameDay(d,today)) cell.classList.add("today");
      if(selectedDate && sameDay(d,selectedDate)) cell.classList.add("selected");
      cell.setAttribute("aria-label", d.toDateString());
      cell.addEventListener("click", function(dd){ return function(){ onSelect(dd); }; }(d));
      gridEl.appendChild(cell);
    }
  }

  function classifyForCycle(d, state){
    var dic = mod(daysBetween(state.start, d), state.cycleLen);
    var ovDic = mod(state.cycleLen - 14, state.cycleLen);
    return {
      period: dic < state.periodLen,
      fertile: isFertile(dic, ovDic),
      ovulation: dic === ovDic,
      dic: dic, ovDic: ovDic
    };
  }

  /* ---------------- PERIOD tab render ---------------- */
  function renderPeriodCalendar(){
    var state = getCycleState();
    document.getElementById("p-cal-title").textContent = MONTH_NAMES[pCalMonth.getMonth()] + " " + pCalMonth.getFullYear();
    buildCalendar(document.getElementById("p-daygrid"), null, pCalMonth,
      function(d){ return classifyForCycle(d, state); },
      function(d){ pSelectedDate = d; renderPeriodDetail(); renderPeriodCalendar(); },
      pSelectedDate
    );
  }

  function renderPeriodDetail(){
    var state = getCycleState();
    var info = classifyForCycle(pSelectedDate, state);
    var phaseKey = phaseForDayInCycle(info.dic, state.periodLen, info.ovDic);
    var phase = PHASES[phaseKey];
    var el = document.getElementById("p-detail");
    el.innerHTML =
      '<span class="d-date">'+pSelectedDate.toDateString()+'</span>'+
      '<span class="pill" style="background:'+phase.soft+';color:'+phase.color+'">'+phase.title+' phase'+(info.fertile?' · fertile window':'')+'</span>'+
      '<div class="d-phase">Cycle day '+(info.dic+1)+'</div>'+
      '<p class="d-desc">'+phase.desc+'</p>'+
      '<div class="d-grid">'+
        '<div class="d-mini"><div class="k">Hormones</div><div class="v">'+phase.hormone+'</div></div>'+
        '<div class="d-mini"><div class="k">Typical symptoms</div><div class="v" style="font-weight:500;font-size:0.82rem;">'+phase.symptoms+'</div></div>'+
      '</div>'+
      '<p class="d-desc"><strong style="color:var(--ink)">Care note — </strong>'+phase.tip+'</p>';
  }

  function renderPeriodStats(){
    var state = getCycleState();
    var dic = mod(daysBetween(state.start, today), state.cycleLen);
    var ovDic = mod(state.cycleLen - 14, state.cycleLen);
    var daysToNextPeriod = mod(state.cycleLen - dic, state.cycleLen);
    if(daysToNextPeriod === 0 && dic !== 0) daysToNextPeriod = state.cycleLen;
    var daysToOvulation = mod(ovDic - dic, state.cycleLen);
    var phaseKey = phaseForDayInCycle(dic, state.periodLen, ovDic);
    document.getElementById("period-stats").innerHTML =
      statTile(dic+1, "Cycle day today") +
      statTile(PHASES[phaseKey].title, "Current phase") +
      statTile(dic===0 ? "Today" : (daysToNextPeriod+"d"), "Until next period") +
      statTile(dic===ovDic ? "Today" : (daysToOvulation+"d"), "Until ovulation");

    // hero ring
    var cx=100, cy=100, r=88;
    var perStart=0, perEnd = state.periodLen/state.cycleLen*360;
    var follEnd = ovDic/state.cycleLen*360;
    var fertStart = Math.max(0,(ovDic-5))/state.cycleLen*360;
    var lutStart = (ovDic+1)/state.cycleLen*360;
    document.getElementById("phase-arc-menstrual").setAttribute("d", arcPath(cx,cy,r,perStart,perEnd));
    document.getElementById("phase-arc-follicular").setAttribute("d", arcPath(cx,cy,r,perEnd,fertStart));
    document.getElementById("phase-arc-fertile").setAttribute("d", arcPath(cx,cy,r,fertStart,follEnd+ (360/state.cycleLen)));
    document.getElementById("phase-arc-luteal").setAttribute("d", arcPath(cx,cy,r,lutStart,360));
    var todayAngle = dic/state.cycleLen*360;
    var tp = polarToXY(cx,cy,r,todayAngle);
    document.getElementById("today-marker").setAttribute("cx", tp[0]);
    document.getElementById("today-marker").setAttribute("cy", tp[1]);
    document.getElementById("cycle-day-big").textContent = dic+1;
    // hand the same numbers to the optional 3D ring (ring3d.js)
    window.cycleRingData = {perEnd:perEnd, fertStart:fertStart, fertEnd:follEnd+(360/state.cycleLen),
      lutStart:lutStart, todayAngle:todayAngle};
    window.dispatchEvent(new CustomEvent("cycle:ring", {detail: window.cycleRingData}));
  }

  function statTile(num,label){
    return '<div class="stat-tile"><div class="num">'+num+'</div><div class="lbl">'+label+'</div></div>';
  }

  document.getElementById("p-prev").addEventListener("click", function(){ pCalMonth.setMonth(pCalMonth.getMonth()-1); renderPeriodCalendar(); });
  document.getElementById("p-next").addEventListener("click", function(){ pCalMonth.setMonth(pCalMonth.getMonth()+1); renderPeriodCalendar(); });

  function renderPhaseRefGrid(){
    var order = ["menstrual","follicular","ovulatory","luteal"];
    document.getElementById("phase-ref-grid").innerHTML = order.map(function(key,i){
      var p = PHASES[key];
      return '<div class="ref-card"><span class="r-num">0'+(i+1)+'</span><h4 style="color:'+p.color+'">'+p.title+'</h4>'+
        '<p>'+p.desc+'</p>'+
        '<div class="tag-row"><span class="tagchip">'+p.window+'</span></div></div>';
    }).join("");
  }

  /* ---------------- OVULATION tab render ---------------- */
  var ovSelectedOffset = 0;
  function renderOvTimeline(){
    var wrap = document.getElementById("ov-timeline");
    wrap.innerHTML = "";
    for(var off=-5; off<=5; off++){
      var d = OVULATION_DAYS[String(off)];
      var btn = document.createElement("button");
      btn.className = "tl-btn" + (off===ovSelectedOffset ? " active":"");
      btn.innerHTML = '<div class="tl-day">'+(off===0?"OVUL.":(off>0?"+":"")+off)+'</div>'+
        '<div class="tl-fert" style="background:'+FERT_COLOR[d.fertClass]+'"></div>';
      btn.addEventListener("click", function(o){ return function(){ ovSelectedOffset=o; renderOvTimeline(); renderOvDetailFromOffset(); }; }(off));
      wrap.appendChild(btn);
    }
  }
  function renderOvDetailFromOffset(){
    var d = OVULATION_DAYS[String(ovSelectedOffset)];
    var el = document.getElementById("o-detail");
    var label = ovSelectedOffset===0 ? "Ovulation day" : (ovSelectedOffset>0 ? ovSelectedOffset+" day"+(ovSelectedOffset>1?"s":"")+" after ovulation" : Math.abs(ovSelectedOffset)+" day"+(ovSelectedOffset<-1?"s":"")+" before ovulation");
    el.innerHTML =
      '<span class="d-date">'+label+'</span>'+
      '<span class="pill" style="background:var(--ovulation-soft);color:'+FERT_COLOR[d.fertClass]+'">Fertility: '+d.fert+'</span>'+
      '<div class="d-phase">'+(ovSelectedOffset===0?"Egg release":(ovSelectedOffset<0?"Building fertility":"Fertility fading"))+'</div>'+
      '<div class="d-grid">'+
        '<div class="d-mini"><div class="k">Basal body temp</div><div class="v" style="font-size:0.82rem;">'+d.bbt+'</div></div>'+
        '<div class="d-mini"><div class="k">Cervical mucus</div><div class="v" style="font-size:0.82rem;">'+d.mucus+'</div></div>'+
      '</div>'+
      '<p class="d-desc">'+d.note+'</p>';
  }

  function renderOvulationCalendar(){
    var state = getCycleState();
    document.getElementById("o-cal-title").textContent = MONTH_NAMES[oCalMonth.getMonth()] + " " + oCalMonth.getFullYear();
    buildCalendar(document.getElementById("o-daygrid"), null, oCalMonth,
      function(d){ return classifyForCycle(d, state); },
      function(d){
        oSelectedDate = d;
        var info = classifyForCycle(d, state);
        var offset = info.dic - info.ovDic;
        if(offset < -5) offset = -5; if(offset > 5) offset = 5;
        ovSelectedOffset = offset;
        renderOvTimeline(); renderOvDetailFromOffset(); renderOvulationCalendar();
      },
      oSelectedDate
    );
  }

  function renderOvulationStats(){
    var state = getCycleState();
    var dic = mod(daysBetween(state.start, today), state.cycleLen);
    var ovDic = mod(state.cycleLen - 14, state.cycleLen);
    var daysToOvulation = mod(ovDic - dic, state.cycleLen);
    var fertileStartDic = mod(ovDic-5, state.cycleLen);
    var inFertile = isFertile(dic, ovDic);
    var daysToFertile = inFertile ? 0 : mod(fertileStartDic - dic, state.cycleLen);
    document.getElementById("ovulation-stats").innerHTML =
      statTile(inFertile ? "Yes" : "No", "In fertile window") +
      statTile(dic===ovDic ? "Today" : daysToOvulation+"d", "Until ovulation") +
      statTile(inFertile ? "Now" : daysToFertile+"d", "Fertile window") +
      statTile("6 days", "Window length");
  }

  document.getElementById("o-prev").addEventListener("click", function(){ oCalMonth.setMonth(oCalMonth.getMonth()-1); renderOvulationCalendar(); });
  document.getElementById("o-next").addEventListener("click", function(){ oCalMonth.setMonth(oCalMonth.getMonth()+1); renderOvulationCalendar(); });

  /* ================================================================
     PREGNANCY tab
  ================================================================ */
  var lmpInput = document.getElementById("pr-lmp");
  var exampleLMP = addDays(today, -20*7 - 3);
  var savedLMP = loadLS("ca-lmp", null);
  lmpInput.value = savedLMP || toInputVal(exampleLMP);
  if(savedLMP) document.getElementById("pr-example-note").style.display = "none";

  var slider = document.getElementById("week-slider");
  var prCalMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  lmpInput.addEventListener("input", function(){
    saveLS("ca-lmp", lmpInput.value);
    document.getElementById("pr-example-note").style.display = "none";
    document.getElementById("p-example-note").style.display = "none";
    syncSliderToLMP();
    renderPregnancy();
  });

  function getLMP(){ return fromInput(lmpInput.value) || exampleLMP; }
  function currentGestWeek(){
    var lmp = getLMP();
    var w = Math.floor(daysBetween(lmp,today)/7) + 1;
    return Math.max(1, Math.min(40, w));
  }
  function syncSliderToLMP(){ slider.value = currentGestWeek(); }
  syncSliderToLMP();

  function renderPregnancyStats(){
    var lmp = getLMP();
    var due = addDays(lmp, 280);
    var week = currentGestWeek();
    var daysLeft = Math.max(0, daysBetween(today, due));
    document.getElementById("pregnancy-stats").innerHTML =
      statTile(week, "Weeks along") +
      statTile(Math.floor((week-1)/13)+1 <= 3 ? ["First","Second","Third"][Math.min(2,Math.floor((week-1)/13))] : "Third", "Trimester") +
      statTile(daysLeft, "Days to due date") +
      statTile(due.toLocaleDateString(undefined,{month:"short",day:"numeric"}), "Estimated due date");

    var pct = (week-1)/39;
    var pathLen = 230;
    var offset = pathLen - pct*pathLen;
    var path = document.getElementById("pregnancy-progress-path");
    path.setAttribute("stroke-dashoffset", offset.toFixed(1));
    try{
      var totalLen = path.getTotalLength ? path.getTotalLength() : pathLen;
      var pt = path.getPointAtLength ? path.getPointAtLength(pct*totalLen) : null;
      if(pt) { document.getElementById("pregnancy-progress-dot").setAttribute("cx",pt.x); document.getElementById("pregnancy-progress-dot").setAttribute("cy",pt.y); }
    }catch(e){}
  }

  function renderWeekPanel(week){
    var w = WEEKS[week-1];
    document.getElementById("wk-badge").textContent = "WEEK " + week;
    document.getElementById("wk-compare").textContent = "size of " + w.c;
    document.getElementById("wk-metric").textContent = w.m === "n/a" ? "not yet fertilized" : "≈ " + w.m;
    document.getElementById("wk-dev").textContent = w.dev;
    document.getElementById("wk-body").textContent = w.body;
    document.getElementById("wk-tip").textContent = w.tip;
    var tri = week<=13?1:(week<=27?2:3);
    var triColor = "var(--pregnancy)";
    document.getElementById("wk-blob").innerHTML =
      '<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="'+(14+week*0.9)+'" fill="'+ (tri===1?"var(--pregnancy-soft)":tri===2?"var(--pregnancy)":"var(--pregnancy-strong)") +'" opacity="0.85"/></svg>';
    document.querySelectorAll(".film-item").forEach(function(f){ f.classList.toggle("active", +f.dataset.week===week); });
    var active = document.querySelector('.film-item[data-week="'+week+'"]');
    if(active) active.scrollIntoView({inline:"center", block:"nearest", behavior:"smooth"});
  }

  slider.addEventListener("input", function(){ renderWeekPanel(+slider.value); });

  function buildFilmstrip(){
    var wrap = document.getElementById("week-filmstrip");
    wrap.innerHTML = "";
    for(var w=1; w<=40; w++){
      var item = document.createElement("button");
      item.className = "film-item";
      item.dataset.week = w;
      item.innerHTML = '<div class="fw">WK</div><div class="fn">'+w+'</div>';
      item.addEventListener("click", function(ww){ return function(){ slider.value=ww; renderWeekPanel(ww); }; }(w));
      wrap.appendChild(item);
    }
  }

  function renderPregnancyCalendar(){
    var lmp = getLMP();
    document.getElementById("pr-cal-title").textContent = MONTH_NAMES[prCalMonth.getMonth()] + " " + prCalMonth.getFullYear();
    var grid = document.getElementById("pr-daygrid");
    grid.innerHTML = "";
    var year = prCalMonth.getFullYear(), month = prCalMonth.getMonth();
    var firstDow = new Date(year,month,1).getDay();
    var daysInMonth = new Date(year,month+1,0).getDate();
    var totalCells = Math.ceil((firstDow+daysInMonth)/7)*7;
    for(var i=0;i<totalCells;i++){
      var dayNum = i - firstDow + 1;
      var cell = document.createElement("button");
      cell.className = "day-cell";
      if(dayNum<1 || dayNum>daysInMonth){ cell.classList.add("pad"); grid.appendChild(cell); continue; }
      var d = new Date(year,month,dayNum);
      var wk = Math.floor(daysBetween(lmp,d)/7)+1;
      var inRange = wk>=1 && wk<=42;
      cell.innerHTML = "<span>"+dayNum+"</span>" + (inRange ? '<span class="dot-row" style="position:static;margin-top:2px;font-size:0.55rem;color:var(--pregnancy-strong)">W'+wk+'</span>' : "");
      if(inRange && wk<=40) cell.classList.add("is-fertile");
      if(sameDay(d,today)) cell.classList.add("today");
      cell.addEventListener("click", function(ww){ return function(){ if(ww>=1&&ww<=40){ slider.value=ww; renderWeekPanel(ww); } }; }(wk));
      grid.appendChild(cell);
    }
  }
  document.getElementById("pr-prev").addEventListener("click", function(){ prCalMonth.setMonth(prCalMonth.getMonth()-1); renderPregnancyCalendar(); });
  document.getElementById("pr-next").addEventListener("click", function(){ prCalMonth.setMonth(prCalMonth.getMonth()+1); renderPregnancyCalendar(); });

  function renderPregnancy(){
    renderPregnancyStats();
    renderWeekPanel(currentGestWeek());
    renderPregnancyCalendar();
  }

  /* ================================================================
     INIT
  ================================================================ */
  function renderAll(){
    renderPeriodStats();
    renderPeriodCalendar();
    renderPeriodDetail();
    renderOvulationStats();
    renderOvTimeline();
    renderOvDetailFromOffset();
    renderOvulationCalendar();
    renderPregnancy();
  }

  renderPhaseRefGrid();
  buildFilmstrip();
  slider.value = currentGestWeek();
  renderAll();
})();
