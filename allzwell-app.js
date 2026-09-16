/* ============================================================
   All'zWell — full application logic
   Extracted from allzwell_app.html's inline <script> block.

   This file is NOT standalone: it expects to run inside
   allzwell_app.html (or an equivalent page) that provides:
     - The DOM elements it queries (sidebar nav, all eight views,
       the settings modal, the chat widget, etc.)
     - The CSS classes referenced when building markup in JS
       (.mood-pill, .j-entry, .pa-bar, .device-badge, .chip, etc.)

   Includes every feature built so far:
     - Home, Check-in, Journal, Breathe, Sounds, Community,
       Insights, and Safety views
     - Local-only data storage (localStorage), with the
       chatbot's crisis-detection safety net
     - Data export / import backup (Settings modal)
     - The 30-day Presence Arc (sidebar + Insights)

   To use: save this as a .js file next to allzwell_app.html,
   remove the inline <script>...</script> body from that file,
   and add before </body>:
     <script src="allzwell-app.js"></script>
============================================================ */
(function(){
"use strict";

/* ============================================================
   Storage helpers (all data local to this browser only)
============================================================ */
var KEY = {
  name:"azw_name", moods:"azw_moods", journal:"azw_journal",
  joined:"azw_joined_circles", notes:"azw_circle_notes", breath:"azw_breath_stats"
};
function load(k, fallback){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function fmtDate(ts){
  var d = new Date(ts), now = new Date();
  var sameDay = d.toDateString() === now.toDateString();
  var opts = { hour:"numeric", minute:"2-digit" };
  if (sameDay) return "Today, " + d.toLocaleTimeString([], opts);
  var y = new Date(now); y.setDate(now.getDate()-1);
  if (d.toDateString() === y.toDateString()) return "Yesterday, " + d.toLocaleTimeString([], opts);
  return d.toLocaleDateString([], { month:"short", day:"numeric" }) + ", " + d.toLocaleTimeString([], opts);
}
function dayKey(ts){ var d = new Date(ts); return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); }

var toastEl = document.getElementById("toast");
var toastTimer;
function toast(msg){
  toastEl.textContent = msg; toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2200);
}

/* ============================================================
   Mood scale (shared across app)
============================================================ */
var MOODS = [
  { v:1, label:"Rough",  color:"#E2836B" },
  { v:2, label:"Low",    color:"#E0A98F" },
  { v:3, label:"Okay",   color:"#8A83A3" },
  { v:4, label:"Good",   color:"#5E9C8F" },
  { v:5, label:"Great",  color:"#7C6FA8" }
];
var MOOD_TAGS = ["sleep","work","anxious","grateful","tired","social","energised","overwhelmed"];

function moodByVal(v){ return MOODS.filter(function(m){ return m.v===v; })[0]; }

/* ============================================================
   Nav config
============================================================ */
var NAV = [
  { id:"home", label:"Home", icon:'<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/>' },
  { id:"checkin", label:"Check In", icon:'<path d="M20.8 8.6c0 5.6-8.8 10.6-8.8 10.6S3.2 14.2 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z"/>' },
  { id:"journal", label:"Journal", icon:'<path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M9 9h6M9 13h6M9 17h3"/>' },
  { id:"breathe", label:"Breathe", icon:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/>' },
  { id:"sounds", label:"Sounds", icon:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  { id:"community", label:"Community", icon:'<path d="M4 18v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><circle cx="9" cy="7" r="3"/><path d="M16 18v-2a4 4 0 0 0-2.3-3.6"/><path d="M14 4.2a3 3 0 0 1 0 5.6"/>' },
  { id:"insights", label:"Insights", icon:'<path d="M4 19V9M11 19V5M18 19v-7"/>' },
  { id:"safety", label:"Safety", icon:'<path d="M12 3 4 6.5V11c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V6.5L12 3Z"/>', safety:true }
];

var navListEl = document.getElementById("navList");
var bottomNavEl = document.getElementById("bottomNav");
NAV.forEach(function(n){
  var li = document.createElement("li");
  var btn = document.createElement("button");
  btn.className = "nav-item" + (n.safety ? " safety" : "");
  btn.dataset.nav = n.id;
  btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24">'+n.icon+'</svg><span>'+n.label+'</span>';
  li.appendChild(btn);
  navListEl.appendChild(li);

  var bn = document.createElement("button");
  bn.className = "bn-item";
  bn.dataset.nav = n.id;
  bn.innerHTML = '<svg class="icon" viewBox="0 0 24 24">'+n.icon+'</svg><span>'+n.label+'</span>';
  bottomNavEl.appendChild(bn);
});

var currentView = "home";
function goTo(id){
  currentView = id;
  document.querySelectorAll(".view").forEach(function(v){ v.classList.toggle("active", v.id === "view-"+id); });
  document.querySelectorAll(".nav-item, .bn-item").forEach(function(b){ b.classList.toggle("active", b.dataset.nav === id); });
  window.scrollTo(0,0);
  if (id === "insights") renderInsights();
  if (id === "checkin") renderMoodHistory();
}
document.addEventListener("click", function(e){
  var t = e.target.closest("[data-nav]");
  if (t){ goTo(t.dataset.nav); }
});
goTo("home");

/* ============================================================
   Settings (name + clear data)
============================================================ */
var settingsBackdrop = document.getElementById("settingsBackdrop");
var settingsName = document.getElementById("settingsName");
function openSettings(){ settingsName.value = load(KEY.name, ""); settingsBackdrop.classList.add("open"); }
document.getElementById("openSettings").addEventListener("click", openSettings);
document.getElementById("openSettingsMobile").addEventListener("click", openSettings);
document.getElementById("editNameBtn").addEventListener("click", openSettings);
document.getElementById("closeSettings").addEventListener("click", function(){ settingsBackdrop.classList.remove("open"); });
document.getElementById("saveSettings").addEventListener("click", function(){
  save(KEY.name, settingsName.value.trim());
  settingsBackdrop.classList.remove("open");
  renderGreeting();
  toast("Saved");
});
document.getElementById("downloadDataBtn").addEventListener("click", function(){
  var payload = { version:1, exportedAt: new Date().toISOString(), data:{} };
  Object.keys(KEY).forEach(function(k){ payload.data[KEY[k]] = load(KEY[k], null); });
  var blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
  var url = URL.createObjectURL(blob);
  var dateStr = new Date().toISOString().slice(0,10);
  var a = document.createElement("a");
  a.href = url; a.download = "allzwell-backup-" + dateStr + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  toast("Backup downloaded");
});

var importFileInput = document.getElementById("importDataFile");
document.getElementById("importDataBtn").addEventListener("click", function(){
  importFileInput.value = "";
  importFileInput.click();
});
importFileInput.addEventListener("change", function(){
  var file = importFileInput.files && importFileInput.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(){
    var parsed;
    try{ parsed = JSON.parse(reader.result); }
    catch(e){ toast("That file couldn't be read"); return; }
    var expectedKeys = Object.keys(KEY).map(function(k){ return KEY[k]; });
    var hasData = parsed && typeof parsed === "object" && parsed.data && typeof parsed.data === "object";
    var validKeys = hasData && expectedKeys.some(function(k){ return Object.prototype.hasOwnProperty.call(parsed.data, k); });
    if (!validKeys){ toast("That doesn't look like an All'zWell backup"); return; }
    if (!confirm("Importing this backup will overwrite the check-ins, journal, and circle notes currently stored in this browser. This can't be undone. Continue?")) return;
    expectedKeys.forEach(function(k){
      if (Object.prototype.hasOwnProperty.call(parsed.data, k)){
        var v = parsed.data[k];
        if (v === null || v === undefined) localStorage.removeItem(k);
        else save(k, v);
      }
    });
    renderGreeting(); renderStreak(); renderHomeJournal(); renderMoodHistory(); renderJournalList(); renderCircles();
    settingsBackdrop.classList.remove("open");
    toast("Backup restored");
  };
  reader.onerror = function(){ toast("That file couldn't be read"); };
  reader.readAsText(file);
});

document.getElementById("clearDataBtn").addEventListener("click", function(){
  if (confirm("This clears every check-in, journal entry, and circle note stored in this browser. This can't be undone. Continue?")){
    Object.keys(KEY).forEach(function(k){ localStorage.removeItem(KEY[k]); });
    settingsBackdrop.classList.remove("open");
    location.reload();
  }
});

function renderGreeting(){
  var name = load(KEY.name, "");
  var h = new Date().getHours();
  var part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  document.getElementById("greetText").textContent = "Good " + part + (name ? ", " + name : "") + ".";
  document.getElementById("editNameBtn").textContent = name ? "Change name →" : "Add your name →";
}

/* ============================================================
   Streak calculation (based on check-ins + journal entries)
============================================================ */
function computeStreak(){
  var moods = load(KEY.moods, []), journal = load(KEY.journal, []);
  var days = {};
  moods.concat(journal).forEach(function(e){ days[dayKey(e.ts)] = true; });
  var streak = 0, d = new Date();
  while (true){
    var k = dayKey(d.getTime());
    if (days[k]){ streak++; d.setDate(d.getDate()-1); } else break;
  }
  return streak;
}
function renderStreak(){
  var s = computeStreak();
  document.getElementById("streakPill").innerHTML =
    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2s5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-5 .3 1 1 1.5 1 1.5C9.5 6 12 2 12 2Z"/></svg><span><b>'+s+'</b> day'+(s===1?"":"s")+' streak</span>';
  renderPresenceArc();
}

/* A rolling 30-day presence view — never resets, just always shows the trailing window.
   Built from azw_moods and azw_journal timestamps (the same sources computeStreak uses).
   azw_breath_stats only stores lifetime totals, not per-day timestamps, so a completed
   breathing session can't be pinpointed to a specific calendar day here. */
function renderPresenceArc(){
  var moods = load(KEY.moods, []), journal = load(KEY.journal, []);
  var activeDays = {};
  moods.concat(journal).forEach(function(e){ activeDays[dayKey(e.ts)] = true; });
  var bars = "";
  for (var i = 29; i >= 0; i--){
    var d = new Date();
    d.setDate(d.getDate() - i);
    var on = !!activeDays[dayKey(d.getTime())];
    bars += '<div class="pa-bar' + (on ? ' on' : '') + '"></div>';
  }
  var html =
    '<span class="pa-title">The last 30 days</span>' +
    '<span class="pa-sub">Presence, not perfection.</span>' +
    '<div class="pa-bars">' + bars + '</div>';
  var sidebarEl = document.getElementById("presenceArc");
  if (sidebarEl) sidebarEl.innerHTML = html;
  var insightsEl = document.getElementById("presenceArcInsights");
  if (insightsEl) insightsEl.innerHTML = html;
}

/* ============================================================
   HOME — quick mood pills
============================================================ */
var quickMoodsEl = document.getElementById("quickMoods");
MOODS.forEach(function(m){
  var b = document.createElement("button");
  b.className = "mood-pill"; b.style.color = m.color;
  b.innerHTML = '<span class="dot" style="background:'+m.color+'"></span>'+m.label;
  b.addEventListener("click", function(){
    var moods = load(KEY.moods, []);
    moods.unshift({ id:uid(), ts:Date.now(), mood:m.v, note:"", tags:[] });
    save(KEY.moods, moods);
    toast("Logged as " + m.label + " — add a note anytime in Check In");
    renderStreak(); renderHomeJournal();
  });
  quickMoodsEl.appendChild(b);
});

function renderHomeJournal(){
  var journal = load(KEY.journal, []);
  if (journal.length){
    var last = journal[0];
    document.getElementById("homeJournalTitle").textContent = last.title || "Untitled entry";
    document.getElementById("homeJournalSnippet").textContent = (last.body || "").slice(0,120) + (last.body && last.body.length>120 ? "…" : "");
  }
}

/* ============================================================
   CHECK-IN view
============================================================ */
var selectedMood = null, selectedTags = [];
var moodScaleEl = document.getElementById("moodScale");
MOODS.forEach(function(m){
  var b = document.createElement("button");
  b.className = "mood-opt"; b.style.color = m.color;
  b.innerHTML = '<span class="dot" style="background:'+m.color+'"></span><span>'+m.label+'</span>';
  b.addEventListener("click", function(){
    selectedMood = m.v;
    document.querySelectorAll(".mood-opt").forEach(function(x){ x.classList.remove("sel"); });
    b.classList.add("sel");
    document.getElementById("saveMoodBtn").disabled = false;
  });
  moodScaleEl.appendChild(b);
});
var moodTagsEl = document.getElementById("moodTags");
MOOD_TAGS.forEach(function(t){
  var c = document.createElement("button");
  c.className = "chip"; c.type = "button"; c.textContent = t;
  c.addEventListener("click", function(){
    c.classList.toggle("sel");
    var i = selectedTags.indexOf(t);
    if (c.classList.contains("sel") && i===-1) selectedTags.push(t);
    if (!c.classList.contains("sel") && i>-1) selectedTags.splice(i,1);
  });
  moodTagsEl.appendChild(c);
});
document.getElementById("saveMoodBtn").addEventListener("click", function(){
  if (!selectedMood) return;
  var moods = load(KEY.moods, []);
  moods.unshift({ id:uid(), ts:Date.now(), mood:selectedMood, note:document.getElementById("moodNote").value.trim(), tags:selectedTags.slice() });
  save(KEY.moods, moods);
  selectedMood = null; selectedTags = [];
  document.querySelectorAll(".mood-opt").forEach(function(x){ x.classList.remove("sel"); });
  document.querySelectorAll("#moodTags .chip").forEach(function(x){ x.classList.remove("sel"); });
  document.getElementById("moodNote").value = "";
  document.getElementById("saveMoodBtn").disabled = true;
  toast("Check-in saved");
  renderMoodHistory(); renderStreak();
});

function renderMoodHistory(){
  var moods = load(KEY.moods, []);
  var wrap = document.getElementById("moodHistory");
  wrap.innerHTML = "";
  if (!moods.length){
    wrap.innerHTML = '<div class="empty"><svg class="icon" viewBox="0 0 24 24"><path d="M20.8 8.6c0 5.6-8.8 10.6-8.8 10.6S3.2 14.2 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z"/></svg>No check-ins yet — your first one takes about five seconds.</div>';
    return;
  }
  moods.slice(0,15).forEach(function(e){
    var m = moodByVal(e.mood);
    var row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML =
      '<span class="dot" style="background:'+m.color+'"></span>' +
      '<div class="entry-main">' +
        '<div class="entry-top"><b style="color:'+m.color+'">'+m.label+'</b><time>'+fmtDate(e.ts)+'</time></div>' +
        (e.note ? '<div class="entry-note">'+escapeHtml(e.note)+'</div>' : '') +
        (e.tags && e.tags.length ? '<div class="entry-tags">'+e.tags.map(function(t){return '<span>'+t+'</span>';}).join("")+'</div>' : '') +
      '</div>' +
      '<button class="btn-danger-text" data-del="'+e.id+'">Remove</button>';
    wrap.appendChild(row);
  });
  wrap.querySelectorAll("[data-del]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var moods = load(KEY.moods, []).filter(function(e){ return e.id !== btn.dataset.del; });
      save(KEY.moods, moods); renderMoodHistory(); renderStreak();
    });
  });
}
function escapeHtml(s){ var d=document.createElement("div"); d.textContent=s; return d.innerHTML; }

/* ============================================================
   JOURNAL view
============================================================ */
var jMoodSelect = document.getElementById("jMood");
MOODS.forEach(function(m){
  var o = document.createElement("option"); o.value = m.v; o.textContent = m.label;
  jMoodSelect.appendChild(o);
});
var editingId = null;
document.getElementById("saveJournalBtn").addEventListener("click", function(){
  var body = document.getElementById("jBody").value.trim();
  if (!body){ toast("Write something first"); return; }
  var journal = load(KEY.journal, []);
  var tags = document.getElementById("jTags").value.split(",").map(function(t){return t.trim();}).filter(Boolean);
  var entry = {
    id: editingId || uid(), ts: editingId ? (journal.filter(function(e){return e.id===editingId;})[0]||{}).ts || Date.now() : Date.now(),
    title: document.getElementById("jTitle").value.trim(), body: body,
    mood: jMoodSelect.value ? Number(jMoodSelect.value) : null, tags: tags
  };
  if (editingId){
    journal = journal.map(function(e){ return e.id === editingId ? entry : e; });
    editingId = null;
    document.getElementById("cancelEditBtn").style.display = "none";
    document.getElementById("saveJournalBtn").textContent = "Save entry";
  } else {
    journal.unshift(entry);
  }
  save(KEY.journal, journal);
  document.getElementById("jTitle").value = ""; document.getElementById("jBody").value = "";
  document.getElementById("jTags").value = ""; jMoodSelect.value = "";
  toast("Entry saved");
  renderJournalList(); renderHomeJournal(); renderStreak();
});
document.getElementById("cancelEditBtn").addEventListener("click", function(){
  editingId = null;
  document.getElementById("jTitle").value = ""; document.getElementById("jBody").value = "";
  document.getElementById("jTags").value = ""; jMoodSelect.value = "";
  document.getElementById("cancelEditBtn").style.display = "none";
  document.getElementById("saveJournalBtn").textContent = "Save entry";
});
document.getElementById("journalSearch").addEventListener("input", renderJournalList);

function renderJournalList(){
  var journal = load(KEY.journal, []);
  var q = document.getElementById("journalSearch").value.trim().toLowerCase();
  var wrap = document.getElementById("journalList");
  wrap.innerHTML = "";
  var filtered = journal.filter(function(e){
    if (!q) return true;
    return (e.title||"").toLowerCase().indexOf(q)>-1 || (e.body||"").toLowerCase().indexOf(q)>-1 || (e.tags||[]).join(" ").toLowerCase().indexOf(q)>-1;
  });
  if (!filtered.length){
    wrap.innerHTML = '<div class="empty"><svg class="icon" viewBox="0 0 24 24"><path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/></svg>'+(q ? "No entries match that search." : "Nothing written yet — start whenever you're ready.")+'</div>';
    return;
  }
  filtered.forEach(function(e){
    var m = e.mood ? moodByVal(e.mood) : null;
    var el = document.createElement("div");
    el.className = "j-entry";
    el.innerHTML =
      '<div class="j-head"><h3>'+escapeHtml(e.title || "Untitled entry")+'</h3><span class="j-meta">'+fmtDate(e.ts)+'</span></div>' +
      (m ? '<span class="j-mood-badge" style="background:'+m.color+'22;color:'+m.color+'">'+m.label+'</span>' : '') +
      '<div class="j-body clamped">'+escapeHtml(e.body)+'</div>' +
      (e.tags && e.tags.length ? '<div class="entry-tags j-tags">'+e.tags.map(function(t){return '<span>#'+escapeHtml(t)+'</span>';}).join("")+'</div>' : '') +
      '<div class="j-actions"><button data-expand>Read more</button><button data-edit>Edit</button><button class="danger" data-del>Delete</button></div>';
    var bodyEl = el.querySelector(".j-body");
    el.querySelector("[data-expand]").addEventListener("click", function(ev){
      ev.stopPropagation();
      bodyEl.classList.toggle("clamped");
      ev.target.textContent = bodyEl.classList.contains("clamped") ? "Read more" : "Show less";
    });
    el.querySelector("[data-edit]").addEventListener("click", function(ev){
      ev.stopPropagation();
      editingId = e.id;
      document.getElementById("jTitle").value = e.title || "";
      document.getElementById("jBody").value = e.body || "";
      document.getElementById("jTags").value = (e.tags||[]).join(", ");
      jMoodSelect.value = e.mood || "";
      document.getElementById("cancelEditBtn").style.display = "inline-flex";
      document.getElementById("saveJournalBtn").textContent = "Update entry";
      document.querySelector(".journal-form").scrollIntoView({ behavior:"smooth", block:"start" });
    });
    el.querySelector("[data-del]").addEventListener("click", function(ev){
      ev.stopPropagation();
      if (!confirm("Delete this entry? This can't be undone.")) return;
      save(KEY.journal, load(KEY.journal, []).filter(function(x){ return x.id !== e.id; }));
      renderJournalList(); renderHomeJournal();
    });
    wrap.appendChild(el);
  });
}

/* ============================================================
   BREATHE view
============================================================ */
var PATTERNS = [
  { id:"box", label:"Box breathing", phases:[["Breathe in",4],["Hold",4],["Breathe out",4],["Hold",4]] },
  { id:"478", label:"4-7-8 grounding", phases:[["Breathe in",4],["Hold",7],["Breathe out",8]] },
  { id:"calm", label:"Calm 4-6", phases:[["Breathe in",4],["Breathe out",6]] }
];
var DURATIONS = [2,5,10];
var chosenPattern = PATTERNS[0], chosenDuration = 2;
var breatheTimerHandle = null, phaseTimeoutHandle = null, breatheRunning = false, sessionSecondsLeft = 0;

var patternSelectEl = document.getElementById("patternSelect");
PATTERNS.forEach(function(p, i){
  var b = document.createElement("button");
  b.className = "seg-btn" + (i===0 ? " sel" : "");
  b.textContent = p.label;
  b.addEventListener("click", function(){
    if (breatheRunning) return;
    chosenPattern = p;
    patternSelectEl.querySelectorAll(".seg-btn").forEach(function(x){x.classList.remove("sel");});
    b.classList.add("sel");
  });
  patternSelectEl.appendChild(b);
});
var durationSelectEl = document.getElementById("durationSelect");
DURATIONS.forEach(function(d,i){
  var b = document.createElement("button");
  b.className = "seg-btn" + (i===0?" sel":"");
  b.textContent = d + " min";
  b.addEventListener("click", function(){
    if (breatheRunning) return;
    chosenDuration = d;
    durationSelectEl.querySelectorAll(".seg-btn").forEach(function(x){x.classList.remove("sel");});
    b.classList.add("sel");
  });
  durationSelectEl.appendChild(b);
});

var orbEl = document.getElementById("breatheOrb"), labelEl = document.getElementById("breatheLabel"), countEl = document.getElementById("breatheCount");
var breatheTimerEl = document.getElementById("breatheTimer"), toggleBtn = document.getElementById("breatheToggle");
var cycleCount = 0;

function runPhaseLoop(){
  if (!breatheRunning) return;
  var phaseIdx = 0;
  function step(){
    if (!breatheRunning) return;
    var phase = chosenPattern.phases[phaseIdx];
    labelEl.textContent = phase[0];
    orbEl.style.transition = "transform " + phase[1] + "s ease-in-out";
    orbEl.style.transform = phase[0].indexOf("in") > -1 ? "scale(1)" : (phase[0]==="Hold" ? orbEl.style.transform : "scale(0.72)");
    if (phaseIdx === 0) cycleCount++;
    countEl.textContent = "Cycle " + cycleCount;
    phaseTimeoutHandle = setTimeout(function(){
      phaseIdx = (phaseIdx + 1) % chosenPattern.phases.length;
      step();
    }, phase[1]*1000);
  }
  step();
}

function startBreathing(){
  breatheRunning = true; cycleCount = 0;
  sessionSecondsLeft = chosenDuration * 60;
  toggleBtn.textContent = "Stop";
  patternSelectEl.style.pointerEvents = "none"; patternSelectEl.style.opacity = ".5";
  durationSelectEl.style.pointerEvents = "none"; durationSelectEl.style.opacity = ".5";
  runPhaseLoop();
  breatheTimerHandle = setInterval(function(){
    sessionSecondsLeft--;
    var m = Math.floor(sessionSecondsLeft/60), s = sessionSecondsLeft%60;
    breatheTimerEl.textContent = m + ":" + (s<10?"0":"")+s + " remaining";
    if (sessionSecondsLeft <= 0) finishBreathing(true);
  }, 1000);
}
function finishBreathing(completed){
  breatheRunning = false;
  clearInterval(breatheTimerHandle); clearTimeout(phaseTimeoutHandle);
  toggleBtn.textContent = "Start";
  orbEl.style.transition = "transform 1.2s ease"; orbEl.style.transform = "scale(0.72)";
  labelEl.textContent = completed ? "Nicely done" : "Ready when you are";
  countEl.textContent = completed ? cycleCount + " cycles complete" : "";
  breatheTimerEl.textContent = "";
  patternSelectEl.style.pointerEvents = ""; patternSelectEl.style.opacity = "";
  durationSelectEl.style.pointerEvents = ""; durationSelectEl.style.opacity = "";
  if (completed){
    var stats = load(KEY.breath, { sessions:0, minutes:0 });
    stats.sessions++; stats.minutes += chosenDuration;
    save(KEY.breath, stats);
    toast("Session complete — " + cycleCount + " cycles");
  }
}
toggleBtn.addEventListener("click", function(){
  if (breatheRunning) finishBreathing(false); else startBreathing();
});

/* ============================================================
   SOUNDS view — generative ambient audio (Web Audio API)
============================================================ */
var SOUND_DEFS = [
  { id:"focus", name:"Calm focus beats", desc:"Two low, gently detuned tones — quiet company for working or reading.", freq:"432 hz" },
  { id:"ground", name:"Grounding breath", desc:"A slow-swelling pad, matched loosely to a resting breath rate.", freq:"4-7-8 method" },
  { id:"rest", name:"Deep rest", desc:"Soft filtered noise, like distant rain — good for winding down.", freq:"body scan" }
];
var audioCtx = null, activeSoundId = null, activeNodes = null;
function ensureCtx(){ if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }

function startSound(id, gainNode){
  var ctx = ensureCtx();
  var out = ctx.createGain(); out.gain.value = 0;
  out.connect(ctx.destination);
  out.gain.linearRampToValueAtTime(gainNode, ctx.currentTime + 1.2);
  var nodes = { out:out, extra:[] };

  if (id === "focus"){
    [220, 226].forEach(function(f){
      var osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = f;
      var g = ctx.createGain(); g.gain.value = 0.5;
      osc.connect(g); g.connect(out); osc.start();
      nodes.extra.push(osc);
    });
  } else if (id === "ground"){
    var osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 130;
    var lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.12;
    var lfoGain = ctx.createGain(); lfoGain.gain.value = 0.4;
    var g = ctx.createGain(); g.gain.value = 0.5;
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    osc.connect(g); g.connect(out); osc.start(); lfo.start();
    nodes.extra.push(osc, lfo);
  } else if (id === "rest"){
    var bufSize = 2 * ctx.sampleRate;
    var buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i=0;i<bufSize;i++) data[i] = (Math.random()*2-1) * 0.5;
    var noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    var filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 500;
    noise.connect(filter); filter.connect(out); noise.start();
    nodes.extra.push(noise);
  }
  return nodes;
}
function stopSound(nodes){
  if (!nodes) return;
  var ctx = ensureCtx();
  nodes.out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  setTimeout(function(){ nodes.extra.forEach(function(n){ try{ n.stop(); }catch(e){} }); }, 700);
}

var soundListEl = document.getElementById("soundList");
SOUND_DEFS.forEach(function(s){
  var card = document.createElement("div");
  card.className = "card sound-card";
  card.innerHTML =
    '<button class="play-btn" data-play="'+s.id+'"><svg class="icon" viewBox="0 0 24 24" id="ic-'+s.id+'"><path d="M7 5v14l11-7Z"/></svg></button>' +
    '<div style="flex:1;"><h3 style="font-size:15px;">'+s.name+'</h3><p style="font-size:13px;color:var(--ink-soft);margin-top:4px;">'+s.desc+'</p>' +
    '<div class="volume-row"><svg class="icon" viewBox="0 0 24 24" style="width:14px;height:14px;color:var(--ink-faint);"><path d="M9 18V5l12-2v13"/></svg><input type="range" min="0" max="1" step="0.05" value="0.5" data-vol="'+s.id+'" disabled></div></div>' +
    '<span class="eyebrow" style="color:var(--ink-faint);">'+s.freq+'</span>' +
    '<div class="sound-bars" id="bars-'+s.id+'"><span></span><span></span><span></span><span></span></div>';
  soundListEl.appendChild(card);
});
soundListEl.querySelectorAll("[data-play]").forEach(function(btn){
  btn.addEventListener("click", function(){
    var id = btn.dataset.play;
    var vol = soundListEl.querySelector('[data-vol="'+id+'"]');
    if (activeSoundId === id){
      stopSound(activeNodes); activeSoundId = null; activeNodes = null;
      btn.querySelector("svg").innerHTML = '<path d="M7 5v14l11-7Z"/>';
      document.getElementById("bars-"+id).classList.remove("playing");
      vol.disabled = true;
      return;
    }
    if (activeSoundId){
      stopSound(activeNodes);
      soundListEl.querySelectorAll("[data-play]").forEach(function(b){ b.querySelector("svg").innerHTML = '<path d="M7 5v14l11-7Z"/>'; });
      soundListEl.querySelectorAll(".sound-bars").forEach(function(b){ b.classList.remove("playing"); });
      soundListEl.querySelectorAll("[data-vol]").forEach(function(v){ v.disabled = true; });
    }
    activeSoundId = id;
    activeNodes = startSound(id, Number(vol.value));
    vol.disabled = false;
    btn.querySelector("svg").innerHTML = '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>';
    document.getElementById("bars-"+id).classList.add("playing");
  });
});
soundListEl.querySelectorAll("[data-vol]").forEach(function(v){
  v.addEventListener("input", function(){
    if (activeSoundId === v.dataset.vol && activeNodes) activeNodes.out.gain.value = Number(v.value);
  });
});

/* ============================================================
   COMMUNITY view (local-only circles + private notes)
============================================================ */
var CIRCLES = [
  { id:"anxiety", tag:"Anxiety & overthinking", title:"Racing Thoughts, Slower Days", desc:"For sitting with uncertainty instead of trying to solve it away." },
  { id:"recovery", tag:"Recovery & habits", title:"One Day, Then the Next", desc:"A steady, low-pressure space for anyone working on a habit or recovery." },
  { id:"lowmood", tag:"Low mood", title:"Small Steps Circle", desc:"For the days getting out of bed is the whole win." }
];
function renderCircles(){
  var joined = load(KEY.joined, []);
  var notesAll = load(KEY.notes, {});
  var wrap = document.getElementById("circleList");
  wrap.innerHTML = "";
  CIRCLES.forEach(function(c){
    var isJoined = joined.indexOf(c.id) > -1;
    var el = document.createElement("div");
    el.className = "card circle-card";
    var notes = notesAll[c.id] || [];
    el.innerHTML =
      '<div class="circle-top"><div><span class="circle-tag">'+c.tag+'</span><h3 style="font-size:16px;margin-top:6px;">'+c.title+'</h3><p style="font-size:13.5px;color:var(--ink-soft);margin-top:6px;line-height:1.55;">'+c.desc+'</p></div>' +
      '<button class="btn btn-sm '+(isJoined?"btn-ghost":"btn-soft")+'" data-join="'+c.id+'">'+(isJoined?"Joined ✓":"Join")+'</button></div>' +
      (isJoined ? (
        '<div class="circle-notes">' +
          '<label class="field-label">Your private notes for this circle</label>' +
          '<textarea class="field" rows="2" placeholder="What resonates today?" data-note-input="'+c.id+'"></textarea>' +
          '<button class="btn btn-ghost btn-sm" style="margin-top:8px;" data-note-save="'+c.id+'">Add note</button>' +
          '<div style="margin-top:10px;">' + notes.map(function(n){
            return '<div class="note-row"><time>'+fmtDate(n.ts)+'</time>'+escapeHtml(n.text)+'</div>';
          }).join("") + '</div>' +
        '</div>'
      ) : '');
    wrap.appendChild(el);
  });
  wrap.querySelectorAll("[data-join]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.dataset.join;
      var joined = load(KEY.joined, []);
      var i = joined.indexOf(id);
      if (i>-1) joined.splice(i,1); else joined.push(id);
      save(KEY.joined, joined);
      renderCircles();
    });
  });
  wrap.querySelectorAll("[data-note-save]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.dataset.noteSave;
      var input = wrap.querySelector('[data-note-input="'+id+'"]');
      var text = input.value.trim();
      if (!text) return;
      var notesAll = load(KEY.notes, {});
      notesAll[id] = notesAll[id] || [];
      notesAll[id].unshift({ id:uid(), ts:Date.now(), text:text });
      save(KEY.notes, notesAll);
      renderCircles();
    });
  });
}

/* ============================================================
   INSIGHTS view
============================================================ */
function renderInsights(){
  var moods = load(KEY.moods, []).slice().reverse(); // chronological
  var journal = load(KEY.journal, []);
  var breath = load(KEY.breath, { sessions:0, minutes:0 });

  document.getElementById("statGrid").innerHTML = [
    { n: moods.length, l:"Check-ins" },
    { n: journal.length, l:"Journal entries" },
    { n: computeStreak(), l:"Day streak" },
    { n: breath.minutes, l:"Minutes breathing" }
  ].map(function(s){ return '<div class="card stat-box"><div class="num">'+s.n+'</div><div class="lbl">'+s.l+'</div></div>'; }).join("");

  // Chart
  var svg = document.getElementById("moodChart");
  var recent = moods.slice(-20);
  if (recent.length < 2){
    svg.innerHTML = '<text x="300" y="80" text-anchor="middle" fill="#8A83A3" font-size="13" font-family="Inter">Log a few more check-ins to see a trend.</text>';
  } else {
    var w = 600, h = 160, pad = 20;
    var pts = recent.map(function(e,i){
      var x = pad + (i/(recent.length-1)) * (w-2*pad);
      var y = h - pad - ((e.mood-1)/4) * (h-2*pad);
      return x+","+y;
    });
    var path = pts.map(function(p,i){ return (i===0?"M":"L")+p; }).join(" ");
    var dots = recent.map(function(e,i){
      var m = moodByVal(e.mood); var xy = pts[i].split(",");
      return '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="3.5" fill="'+m.color+'"></circle>';
    }).join("");
    svg.innerHTML = '<path d="'+path+'" fill="none" stroke="#7C6FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"></path>' + dots;
  }

  // Distribution
  var counts = {1:0,2:0,3:0,4:0,5:0};
  moods.forEach(function(e){ counts[e.mood] = (counts[e.mood]||0)+1; });
  var max = Math.max.apply(null, Object.values(counts).concat([1]));
  document.getElementById("distList").innerHTML = MOODS.map(function(m){
    var c = counts[m.v] || 0;
    return '<div class="dist-row"><span class="dist-label">'+m.label+'</span><div class="dist-track"><div class="dist-fill" style="width:'+(c/max*100)+'%;background:'+m.color+';"></div></div><span class="dist-count">'+c+'</span></div>';
  }).join("");

  // Tag cloud
  var tagCounts = {};
  moods.forEach(function(e){ (e.tags||[]).forEach(function(t){ tagCounts[t]=(tagCounts[t]||0)+1; }); });
  journal.forEach(function(e){ (e.tags||[]).forEach(function(t){ tagCounts[t]=(tagCounts[t]||0)+1; }); });
  var tagArr = Object.keys(tagCounts).map(function(t){ return {t:t,c:tagCounts[t]}; }).sort(function(a,b){return b.c-a.c;}).slice(0,10);
  var tagCloudCard = document.getElementById("tagCloudCard");
  if (!tagArr.length){
    tagCloudCard.style.display = "none";
  } else {
    tagCloudCard.style.display = "";
    document.getElementById("tagCloud").innerHTML = tagArr.map(function(x){ return '<span class="chip" style="cursor:default;">'+x.t+' · '+x.c+'</span>'; }).join("");
  }
}

/* ============================================================
   SAFETY view
============================================================ */
var CRISIS_RESOURCES = [
  { country:"India", lines:[
    { label:"KIRAN Mental Health Helpline (Govt. of India)", value:"1800-599-0019", tel:"1800-599-0019" },
    { label:"Vandrevala Foundation", value:"1860-266-2345", tel:"1860-266-2345" },
    { label:"Sneha Foundation (Chennai)", value:"044-2464-0050", tel:"044-2464-0050" },
    { label:"iCall (TISS)", value:"9152-987-821", tel:"9152-987-821" }
  ]},
  { country:"United States", lines:[{ label:"988 Suicide & Crisis Lifeline", value:"Call or text 988", tel:"988" }]},
  { country:"United Kingdom & Ireland", lines:[{ label:"Samaritans", value:"116 123", tel:"116123" }]},
  { country:"Canada", lines:[{ label:"Talk Suicide Canada", value:"Call or text 988", tel:"988" }]},
  { country:"Australia", lines:[{ label:"Lifeline Australia", value:"13 11 14", tel:"131114" }]},
  { country:"Other countries", lines:[
    { label:"Find A Helpline (global directory)", value:"findahelpline.com", url:"https://findahelpline.com" },
    { label:"International Association for Suicide Prevention", value:"Find a centre near you", url:"https://www.iasp.info/resources/Crisis_Centres/" }
  ]}
];
function renderSafety(){
  document.getElementById("safetyList").innerHTML = CRISIS_RESOURCES.map(function(g){
    return '<div style="margin-bottom:18px;"><div class="eyebrow" style="margin-bottom:8px;">'+g.country+'</div>' +
      g.lines.map(function(l){
        return '<div class="safety-row"><span class="who">'+l.label+'</span>' +
          (l.tel ? '<a class="tel" href="tel:'+l.tel.replace(/[^0-9+]/g,"")+'">'+l.value+'</a>' : '<a class="tel" href="'+l.url+'" target="_blank" rel="noreferrer">'+l.value+'</a>') +
          '</div>';
      }).join("") + '</div>';
  }).join("");
}

/* ============================================================
   Chat assistant — navigation guide, with crisis check first
============================================================ */
var CRISIS_PATTERNS = [
  /\bsuicid/i, /\bkill myself\b/i, /\bend my life\b/i, /\bwant to die\b/i,
  /\bself[\s-]?harm/i, /\bhurt(ing)? myself\b/i, /\bno reason to live\b/i, /\bcan'?t go on\b/i
];
var CRISIS_TEXT = "I'm really glad you told me. I'm not able to help with this myself, but please reach out to someone who can right now — you don't have to handle this alone.";
var INTENTS = [
  { id:"mood", keywords:["mood","track my mood","how i feel","feelings log","mood tracker","check in","check-in"],
    reply:"The Check In tab lets you log how you're feeling in a few taps and add a note if you want.", route:"checkin", cta:"Open check-in" },
  { id:"journal", keywords:["journal","diary","write","notes","entry"],
    reply:"The Journal tab is a private space to write — nothing is scored or shared.", route:"journal", cta:"Open journal" },
  { id:"breathing", keywords:["breathing","meditat","calm down","relax","anxious","panic","exercise","grounding","breathe"],
    reply:"There are a few guided breathing patterns under Breathe — some sessions are just two minutes.", route:"breathe", cta:"Start breathing" },
  { id:"sounds", keywords:["sound","music","beats","ambient","noise","binaural"],
    reply:"Sounds has three soft ambient tones you can play in the background.", route:"sounds", cta:"Browse sounds" },
  { id:"community", keywords:["community","support group","circle","others","people like me"],
    reply:"Community has topic circles you can join and keep private notes on.", route:"community", cta:"Explore circles" },
  { id:"progress", keywords:["progress","history","insights","stats","trends","pattern"],
    reply:"Insights turns your check-ins and journal entries into simple trends over time.", route:"insights", cta:"View insights" },
  { id:"settings", keywords:["settings","privacy","data","name","clear data"],
    reply:"Your name and a way to clear your data both live in Settings — everything stays only on this device.", route:null, cta:null },
  { id:"safety", keywords:["crisis","helpline","emergency","in danger","suicide hotline"],
    reply:"Here are ways to reach real support right now — this page is always available.", route:"safety", cta:"View safety resources" }
];
var GREETING = "Hi, I'm here to help you find your way around All'zWell. Try asking \u201cwhere's the journal\u201d or \u201chow do I breathe through this\u201d.";
var FALLBACK = "I'm just the app guide, so I'm not sure how to point you to that. If you want to talk something through, the Community circles or Safety page might help.";
var QUICK_REPLIES = ["Where's the journal?", "How do I track my mood?", "I need to calm down"];

function matchIntent(message){
  var lower = message.toLowerCase(), best = null, bestScore = 0;
  INTENTS.forEach(function(intent){
    var score = 0;
    intent.keywords.forEach(function(kw){ if (lower.indexOf(kw) !== -1) score += kw.split(" ").length; });
    if (score > bestScore){ bestScore = score; best = intent; }
  });
  return bestScore > 0 ? best : null;
}
function isCrisisMessage(message){ return CRISIS_PATTERNS.some(function(p){ return p.test(message); }); }
function getBotResponse(message){
  if (isCrisisMessage(message)) return { text: CRISIS_TEXT, crisis:true };
  var intent = matchIntent(message);
  if (intent) return { text: intent.reply, route: intent.route, cta: intent.cta };
  return { text: FALLBACK, route:"safety", cta:"View support options" };
}

var launcher = document.getElementById("azw-launcher"), panel = document.getElementById("azw-panel");
var closeBtn = document.getElementById("azw-close"), chatBody = document.getElementById("azw-body");
var quickWrap = document.getElementById("azw-quick"), chatInput = document.getElementById("azw-input"), sendBtn = document.getElementById("azw-send");

function scrollChat(){ chatBody.scrollTop = chatBody.scrollHeight; }
function botIcon(){ var d = document.createElement("div"); d.className="azw-bot-ic"; d.innerHTML='<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3Z"/></svg>'; return d; }

function addMessage(from, payload){
  var row = document.createElement("div"); row.className = "azw-row " + from;
  if (from === "bot") row.appendChild(botIcon());
  var bubble = document.createElement("div"); bubble.className = "azw-bubble" + (payload.crisis ? " crisis" : "");
  var p = document.createElement("p"); p.style.margin="0"; p.textContent = payload.text; bubble.appendChild(p);
  if (payload.crisis){
    CRISIS_RESOURCES.forEach(function(group){
      var g = document.createElement("div"); g.className = "azw-crisis-group";
      var h = document.createElement("div"); h.className = "azw-crisis-country"; h.textContent = group.country; g.appendChild(h);
      group.lines.forEach(function(line){
        var r = document.createElement("div"); r.className = "azw-crisis-line";
        r.innerHTML = '<b>'+line.label+'</b>'+line.value;
        g.appendChild(r);
      });
      bubble.appendChild(g);
    });
  } else if (payload.route){
    var a = document.createElement("button"); a.className = "azw-cta"; a.textContent = payload.cta;
    a.addEventListener("click", function(){ goTo(payload.route); });
    bubble.appendChild(a);
  }
  row.appendChild(bubble); chatBody.appendChild(row); scrollChat();
}
function showTyping(){
  var row = document.createElement("div"); row.className="azw-row bot"; row.id="azw-typing-row";
  row.appendChild(botIcon());
  var t = document.createElement("div"); t.className="azw-typing"; t.innerHTML="<span></span><span></span><span></span>";
  row.appendChild(t); chatBody.appendChild(row); scrollChat();
}
function hideTyping(){ var r = document.getElementById("azw-typing-row"); if (r) r.remove(); }
function sendMessage(text){
  text = (text || chatInput.value).trim(); if (!text) return;
  addMessage("user", { text:text }); chatInput.value = ""; showTyping();
  setTimeout(function(){ hideTyping(); addMessage("bot", getBotResponse(text)); }, 450);
}
function initChat(){
  addMessage("bot", { text: GREETING });
  QUICK_REPLIES.forEach(function(q){
    var chip = document.createElement("button"); chip.className="azw-chip"; chip.type="button"; chip.textContent=q;
    chip.addEventListener("click", function(){ sendMessage(q); });
    quickWrap.appendChild(chip);
  });
}
launcher.addEventListener("click", function(){ panel.classList.add("open"); if (!chatBody.childElementCount) initChat(); chatInput.focus(); });
closeBtn.addEventListener("click", function(){ panel.classList.remove("open"); });
sendBtn.addEventListener("click", function(){ sendMessage(); });
chatInput.addEventListener("keydown", function(e){ if (e.key === "Enter") sendMessage(); });

/* ============================================================
   Init
============================================================ */
renderGreeting();
renderStreak();
renderHomeJournal();
renderMoodHistory();
renderJournalList();
renderCircles();
renderSafety();

})();
