/* ============================================================
   All'zWell — single-file JavaScript build
   Drop this into any blank HTML page like:
     <!DOCTYPE html><html><head></head><body>
     <script src="allzwell-app-full.js"><\/script>
     </body></html>
   This script injects all required CSS and markup into the page,
   then runs the full application logic.
============================================================ */
(function(){
  "use strict";
  document.title = "All'zWell";

  var viewport = document.createElement("meta");
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewport);

  var pre1 = document.createElement("link"); pre1.rel = "preconnect"; pre1.href = "https://fonts.googleapis.com";
  var pre2 = document.createElement("link"); pre2.rel = "preconnect"; pre2.href = "https://fonts.gstatic.com"; pre2.crossOrigin = "anonymous";
  var fontLink = document.createElement("link"); fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,440;9..144,560;9..144,650&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap";
  document.head.appendChild(pre1); document.head.appendChild(pre2); document.head.appendChild(fontLink);

  var styleEl = document.createElement("style");
  styleEl.textContent = "\n:root{\n  --font-sans:'Inter',system-ui,-apple-system,sans-serif;\n  --font-display:'Fraunces',Georgia,serif;\n  --font-mono:'IBM Plex Mono',Menlo,Consolas,monospace;\n\n  --bg:#F4F1F8;\n  --surface:#FFFFFF;\n  --surface-2:#FAF8FC;\n  --border:#E5E0EF;\n  --ink:#2A2438;\n  --ink-soft:#746C8C;\n  --ink-faint:#A79FBD;\n  --accent:#7C6FA8;\n  --accent-soft:#EDE9F6;\n  --danger:#C6604A;\n  --danger-soft:#F7E7E1;\n  --teal:#5E9C8F;\n  --shadow-sm:0 1px 2px rgba(42,36,56,0.05);\n  --shadow-md:0 10px 30px rgba(42,36,56,0.08);\n  --radius-lg:18px;\n  --radius-md:12px;\n  --radius-sm:8px;\n}\n:root[data-theme=\"dark\"], :root:not([data-theme=\"light\"]){\n  @media (prefers-color-scheme: dark){\n    --bg:#1B1723;\n    --surface:#231D2E;\n    --surface-2:#2A2436;\n    --border:#362F44;\n    --ink:#EDE9F5;\n    --ink-soft:#B0A8C6;\n    --ink-faint:#7C7492;\n    --accent:#A79AD6;\n    --accent-soft:#332B48;\n    --danger:#E0917B;\n    --danger-soft:#3A2A2C;\n    --teal:#7FB3A6;\n    --shadow-sm:0 1px 2px rgba(0,0,0,0.3);\n    --shadow-md:0 10px 30px rgba(0,0,0,0.35);\n  }\n}\n*{box-sizing:border-box;}\nhtml,body{margin:0;padding:0;}\nbody{\n  background:var(--bg);\n  color:var(--ink);\n  font-family:var(--font-sans);\n  font-size:14.5px;\n  line-height:1.5;\n  -webkit-font-smoothing:antialiased;\n}\nh1,h2,h3{font-family:var(--font-display);font-weight:560;margin:0;color:var(--ink);}\np{margin:0;}\nbutton{font-family:inherit;cursor:pointer;}\ninput,textarea,select{font-family:inherit;font-size:14px;color:var(--ink);}\n::selection{background:var(--accent-soft);}\n:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\n\n.icon{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}\n\n/* ---------- layout ---------- */\n.app{display:flex;min-height:100vh;}\n.sidebar{\n  width:250px;flex-shrink:0;\n  background:var(--surface);\n  border-right:1px solid var(--border);\n  display:flex;flex-direction:column;\n  padding:22px 18px;gap:22px;\n  position:sticky;top:0;height:100vh;overflow-y:auto;\n}\n.brand{display:flex;align-items:center;gap:9px;padding:0 4px;}\n.brand-mark{\n  width:30px;height:30px;border-radius:9px;flex-shrink:0;\n  background:linear-gradient(135deg,var(--accent),#5E9C8F);\n  display:flex;align-items:center;justify-content:center;color:#fff;\n}\n.brand-name{font-family:var(--font-display);font-size:18px;font-weight:600;}\n\n.nav-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;}\n.nav-item{\n  width:100%;display:flex;align-items:center;gap:11px;\n  background:none;border:none;border-radius:var(--radius-sm);\n  padding:9px 10px;color:var(--ink-soft);font-size:14px;font-weight:500;\n  transition:background .15s ease,color .15s ease;text-align:left;\n}\n.nav-item:hover{background:var(--surface-2);color:var(--ink);}\n.nav-item.active{background:var(--accent-soft);color:var(--accent);}\n.nav-item.safety{color:var(--danger);margin-top:6px;}\n.nav-item.safety:hover{background:var(--danger-soft);}\n.nav-item.safety.active{background:var(--danger-soft);color:var(--danger);}\n\n.sidebar-footer{margin-top:auto;display:flex;flex-direction:column;gap:10px;}\n.settings-btn{\n  display:flex;align-items:center;gap:9px;width:100%;\n  background:none;border:1px solid var(--border);border-radius:var(--radius-sm);\n  padding:9px 10px;color:var(--ink-soft);font-size:13.5px;font-weight:500;\n}\n.settings-btn:hover{background:var(--surface-2);color:var(--ink);}\n\n/* presence arc (used in sidebar + insights) */\n.presence-arc{\n  background:var(--surface-2);border:1px solid var(--border);\n  border-radius:var(--radius-md);padding:14px;\n}\n.pa-title{display:block;font-size:12.5px;font-weight:600;color:var(--ink);}\n.pa-sub{display:block;font-size:11.5px;color:var(--ink-faint);margin-top:1px;margin-bottom:10px;}\n.pa-bars{display:flex;align-items:flex-end;gap:2px;height:26px;}\n.pa-bar{flex:1;height:8px;border-radius:2px;background:var(--border);align-self:flex-end;}\n.pa-bar.on{height:100%;background:var(--accent);}\n\n.main{flex:1;min-width:0;padding:30px 34px 90px;max-width:900px;margin:0 auto;width:100%;}\n.mobile-topbar{display:none;}\n\n/* ---------- shared components ---------- */\n.card{\n  background:var(--surface);border:1px solid var(--border);\n  border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);\n  padding:20px 22px;\n}\n.card + .card{margin-top:14px;}\n.section-title{font-size:20px;margin-bottom:4px;}\n.section-sub{color:var(--ink-soft);font-size:13.5px;margin-bottom:18px;}\n.eyebrow{font-size:12px;font-weight:600;color:var(--ink-faint);letter-spacing:.01em;}\n\n.btn{\n  display:inline-flex;align-items:center;justify-content:center;gap:6px;\n  border:none;border-radius:999px;padding:10px 18px;font-size:13.5px;font-weight:600;\n  background:var(--accent);color:#fff;transition:opacity .15s ease;\n}\n.btn:hover{opacity:.88;}\n.btn:disabled{opacity:.4;cursor:not-allowed;}\n.btn-sm{padding:7px 14px;font-size:12.5px;}\n.btn-ghost{background:none;border:1px solid var(--border);color:var(--ink);}\n.btn-soft{background:var(--accent-soft);color:var(--accent);}\n.btn-danger-text{background:none;border:none;color:var(--danger);font-size:12.5px;font-weight:600;padding:4px 6px;}\n\n.field-label{display:block;font-size:12.5px;font-weight:600;color:var(--ink-soft);margin-bottom:6px;}\n.field{\n  width:100%;background:var(--surface-2);border:1px solid var(--border);\n  border-radius:var(--radius-sm);padding:10px 12px;color:var(--ink);resize:vertical;\n}\n.field:focus{background:var(--surface);}\n\n.chip{\n  display:inline-flex;align-items:center;border:1px solid var(--border);\n  background:var(--surface-2);border-radius:999px;padding:6px 12px;\n  font-size:12.5px;color:var(--ink-soft);margin:0 6px 6px 0;\n}\n.chip.sel{background:var(--accent);border-color:var(--accent);color:#fff;}\n.chip-row{display:flex;flex-wrap:wrap;margin-top:4px;}\n\n.empty{\n  text-align:center;color:var(--ink-faint);font-size:13.5px;\n  padding:30px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;line-height:1.5;\n}\n.empty .icon{width:26px;height:26px;color:var(--ink-faint);}\n\n.toast{\n  position:fixed;bottom:26px;left:50%;transform:translate(-50%,12px);\n  background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;\n  font-size:13px;opacity:0;pointer-events:none;transition:all .25s ease;z-index:200;\n}\n.toast.show{opacity:1;transform:translate(-50%,0);}\n\n/* ---------- HOME ---------- */\n.home-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;}\n#greetText{font-size:23px;}\n#editNameBtn{background:none;border:none;color:var(--accent);font-size:13px;font-weight:600;padding:4px 0;margin-top:2px;}\n.streak-pill{\n  display:inline-flex;align-items:center;gap:7px;background:var(--accent-soft);color:var(--accent);\n  border-radius:999px;padding:8px 14px;font-size:13px;white-space:nowrap;\n}\n.streak-pill .icon{color:var(--accent);}\n.quick-moods{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;}\n.mood-pill{\n  display:flex;align-items:center;gap:7px;background:var(--surface-2);border:1px solid var(--border);\n  border-radius:999px;padding:9px 14px;font-size:13.5px;font-weight:500;\n}\n.mood-pill:hover{border-color:currentColor;}\n.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block;}\n.home-journal-preview h3{font-size:15px;margin-bottom:6px;}\n.home-journal-preview p{color:var(--ink-soft);font-size:13.5px;line-height:1.55;}\n.quick-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;}\n.link-card{\n  display:flex;align-items:center;gap:12px;text-align:left;width:100%;\n  background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md);\n  padding:14px 15px;color:var(--ink);font-size:13.5px;font-weight:600;\n  transition:border-color .15s ease,background .15s ease;\n}\n.link-card:hover{border-color:var(--accent);background:var(--surface);}\n.link-card .icon{color:var(--accent);width:20px;height:20px;}\n.link-card small{display:block;font-weight:500;font-size:12px;color:var(--ink-soft);margin-top:2px;}\n\n/* ---------- RITUAL ---------- */\n.ritual-steps{display:flex;gap:6px;margin-bottom:16px;}\n.ritual-step-dot{flex:1;height:4px;border-radius:999px;background:var(--border);transition:background .3s ease;}\n.ritual-step-dot.on{background:var(--accent);}\n.ritual-slot{margin-top:6px;}\n.ritual-slot .card{border:none;box-shadow:none;background:transparent;padding:0;margin-top:0;}\n.ritual-body{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;}\n.ritual-body .mood-scale{width:100%;}\n.ritual-body .field{max-width:460px;text-align:center;}\n.ritual-done-mark{\n  width:46px;height:46px;border-radius:50%;background:var(--accent-soft);color:var(--accent);\n  display:flex;align-items:center;justify-content:center;\n}\n.ritual-done-mark .icon{width:22px;height:22px;}\n\n/* ---------- CHECK-IN ---------- */\n.mood-scale{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;}\n.mood-opt{\n  display:flex;flex-direction:column;align-items:center;gap:7px;flex:1;min-width:70px;\n  background:var(--surface-2);border:1.5px solid var(--border);border-radius:var(--radius-md);\n  padding:14px 8px;font-size:12.5px;font-weight:600;\n}\n.mood-opt .dot{width:14px;height:14px;}\n.mood-opt.sel{border-color:currentColor;background:var(--surface);box-shadow:var(--shadow-sm);}\n.entry-row{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:1px solid var(--border);}\n.entry-row:last-child{border-bottom:none;}\n.entry-row .dot{margin-top:6px;width:9px;height:9px;}\n.entry-main{flex:1;min-width:0;}\n.entry-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;}\n.entry-top time{font-size:12px;color:var(--ink-faint);white-space:nowrap;}\n.entry-note{font-size:13.5px;color:var(--ink-soft);margin-top:4px;line-height:1.5;}\n.entry-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}\n.entry-tags span{background:var(--surface-2);border-radius:999px;padding:3px 9px;font-size:11.5px;color:var(--ink-soft);}\n\n/* ---------- JOURNAL ---------- */\n.journal-form{display:flex;flex-direction:column;gap:12px;}\n.j-count{font-family:var(--font-mono);font-size:11.5px;color:var(--ink-faint);text-align:right;margin-top:6px;}\n.j-entry{border-bottom:1px solid var(--border);padding:16px 0;}\n.j-entry:last-child{border-bottom:none;}\n.j-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;}\n.j-head h3{font-size:15.5px;}\n.j-meta{font-size:12px;color:var(--ink-faint);white-space:nowrap;}\n.j-mood-badge{display:inline-block;border-radius:999px;padding:3px 10px;font-size:11.5px;font-weight:600;margin-top:8px;}\n.j-body{font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.6;white-space:pre-wrap;}\n.j-body.clamped{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}\n.j-tags span{background:var(--accent-soft);color:var(--accent);}\n.j-actions{display:flex;gap:14px;margin-top:10px;}\n.j-actions button{background:none;border:none;font-size:12.5px;font-weight:600;color:var(--ink-soft);padding:0;}\n.j-actions button.danger{color:var(--danger);}\n\n/* ---------- BREATHE ---------- */\n.seg-group{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;}\n.seg-btn{\n  background:var(--surface-2);border:1.5px solid var(--border);border-radius:999px;\n  padding:8px 15px;font-size:13px;font-weight:500;color:var(--ink-soft);\n}\n.seg-btn.sel{background:var(--accent);border-color:var(--accent);color:#fff;}\n.breathe-stage{display:flex;flex-direction:column;align-items:center;gap:14px;padding:34px 10px 18px;}\n.breathe-orb{\n  width:150px;height:150px;border-radius:50%;\n  background:radial-gradient(circle at 35% 30%,#9C8FCB,var(--accent));\n  transform:scale(0.72);will-change:transform;\n  box-shadow:0 20px 50px rgba(124,111,168,0.35);\n}\n#breatheLabel{font-family:var(--font-display);font-size:19px;}\n#breatheCount{color:var(--ink-soft);font-size:13px;}\n#breatheTimer{color:var(--ink-faint);font-size:12.5px;font-family:var(--font-mono);min-height:16px;}\n\n/* ---------- SOUNDS ---------- */\n.sound-card{display:flex;align-items:center;gap:14px;}\n.play-btn{\n  width:42px;height:42px;border-radius:50%;flex-shrink:0;border:none;\n  background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;\n}\n.play-btn svg{width:18px;height:18px;fill:currentColor;stroke:none;}\n.volume-row{display:flex;align-items:center;gap:8px;margin-top:8px;}\n.volume-row input[type=\"range\"]{flex:1;accent-color:var(--accent);}\n.sound-bars{display:flex;align-items:flex-end;gap:2px;height:18px;width:16px;flex-shrink:0;}\n.sound-bars span{flex:1;background:var(--border);border-radius:1px;height:30%;}\n.sound-bars.playing span{background:var(--accent);animation:sbar 1s ease-in-out infinite;}\n.sound-bars.playing span:nth-child(2){animation-delay:.15s;}\n.sound-bars.playing span:nth-child(3){animation-delay:.3s;}\n.sound-bars.playing span:nth-child(4){animation-delay:.45s;}\n@keyframes sbar{0%,100%{height:25%;}50%{height:95%;}}\n\n/* ---------- COMMUNITY ---------- */\n.circle-card{margin-bottom:0;}\n.circle-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;}\n.circle-tag{font-size:11.5px;font-weight:600;color:var(--accent);background:var(--accent-soft);border-radius:999px;padding:3px 10px;}\n.circle-pulse{margin-top:8px;color:var(--teal);}\n.circle-pulse-disclaimer{display:block;font-size:11px;color:var(--ink-faint);margin-top:2px;}\n.circle-notes{margin-top:14px;padding-top:14px;border-top:1px solid var(--border);}\n.note-row{display:flex;gap:10px;font-size:13px;color:var(--ink-soft);padding:8px 0;border-bottom:1px dashed var(--border);}\n.note-row:last-child{border-bottom:none;}\n.note-row time{color:var(--ink-faint);font-size:11.5px;white-space:nowrap;font-family:var(--font-mono);}\n\n/* ---------- INSIGHTS ---------- */\n.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}\n.stat-box{text-align:center;padding:16px 8px;}\n.stat-box .num{font-family:var(--font-mono);font-size:22px;color:var(--accent);}\n.stat-box .lbl{font-size:11.5px;color:var(--ink-soft);margin-top:4px;}\n.dist-row{display:flex;align-items:center;gap:10px;margin-bottom:9px;}\n.dist-row:last-child{margin-bottom:0;}\n.dist-label{width:76px;flex-shrink:0;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n.dist-track{flex:1;height:8px;background:var(--surface-2);border-radius:999px;overflow:hidden;}\n.dist-fill{height:100%;border-radius:999px;transition:width .4s ease;}\n.dist-count{width:28px;flex-shrink:0;text-align:right;font-family:var(--font-mono);font-size:12.5px;color:var(--ink-soft);}\n\n/* ---------- SAFETY ---------- */\n.safety-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);}\n.safety-row:last-child{border-bottom:none;}\n.who{font-size:13.5px;}\n.tel{color:var(--accent);font-weight:600;font-size:13.5px;text-decoration:none;font-family:var(--font-mono);}\n\n/* ---------- SETTINGS MODAL ---------- */\n.modal-backdrop{\n  position:fixed;inset:0;background:rgba(26,20,36,0.4);display:none;\n  align-items:center;justify-content:center;z-index:150;padding:20px;\n}\n.modal-backdrop.open{display:flex;}\n.modal{background:var(--surface);border-radius:var(--radius-lg);padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-md);}\n.modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}\n.modal-close{background:none;border:none;color:var(--ink-soft);}\n.modal-row{margin-bottom:14px;}\n.modal-actions{display:flex;gap:10px;margin-top:18px;}\n.modal-divider{border:none;border-top:1px solid var(--border);margin:18px 0;}\n.danger-zone-label{font-size:12px;color:var(--danger);font-weight:600;margin-bottom:8px;}\n\n/* ---------- CHAT WIDGET ---------- */\n#azw-launcher{\n  position:fixed;bottom:24px;right:24px;width:54px;height:54px;border-radius:50%;\n  background:var(--accent);color:#fff;border:none;display:flex;align-items:center;justify-content:center;\n  box-shadow:var(--shadow-md);z-index:120;\n}\n#azw-panel{\n  position:fixed;bottom:90px;right:24px;width:340px;max-width:calc(100vw - 32px);height:460px;max-height:calc(100vh - 120px);\n  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);\n  box-shadow:var(--shadow-md);display:none;flex-direction:column;overflow:hidden;z-index:120;\n}\n#azw-panel.open{display:flex;}\n.azw-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);}\n.azw-head b{font-family:var(--font-display);font-size:15px;}\n#azw-close{background:none;border:none;color:var(--ink-soft);}\n#azw-body{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:12px;}\n.azw-row{display:flex;gap:8px;max-width:92%;}\n.azw-row.user{align-self:flex-end;flex-direction:row-reverse;}\n.azw-bot-ic{\n  width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--accent);\n  display:flex;align-items:center;justify-content:center;flex-shrink:0;\n}\n.azw-bot-ic .icon{width:13px;height:13px;}\n.azw-bubble{background:var(--surface-2);border-radius:14px;padding:9px 13px;font-size:13px;line-height:1.5;}\n.azw-row.user .azw-bubble{background:var(--accent);color:#fff;}\n.azw-bubble.crisis{background:var(--danger-soft);}\n.azw-crisis-group{margin-top:10px;padding-top:10px;border-top:1px solid var(--border);}\n.azw-crisis-country{font-size:11px;font-weight:600;color:var(--ink-faint);margin-bottom:4px;}\n.azw-crisis-line{font-size:12.5px;color:var(--ink-soft);display:flex;justify-content:space-between;gap:8px;padding:2px 0;}\n.azw-crisis-line b{color:var(--ink);font-weight:600;}\n.azw-cta{margin-top:9px;background:var(--accent);color:#fff;border:none;border-radius:999px;padding:7px 13px;font-size:12px;font-weight:600;}\n.azw-typing{background:var(--surface-2);border-radius:14px;padding:11px 14px;display:flex;gap:4px;}\n.azw-typing span{width:6px;height:6px;border-radius:50%;background:var(--ink-faint);animation:typing 1s infinite ease-in-out;}\n.azw-typing span:nth-child(2){animation-delay:.15s;}\n.azw-typing span:nth-child(3){animation-delay:.3s;}\n@keyframes typing{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}\n.azw-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;}\n.azw-chip{background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:6px 11px;font-size:12px;color:var(--ink-soft);}\n.azw-input-row{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border);}\n#azw-input{flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:9px 14px;font-size:13px;}\n#azw-send{width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;border:none;display:flex;align-items:center;justify-content:center;flex-shrink:0;}\n\n/* ---------- VIEWS ---------- */\n.view{display:none;}\n.view.active{display:block;}\n.view > .view-head{margin-bottom:18px;}\n\n/* ---------- BOTTOM NAV (mobile) ---------- */\n.bottom-nav{display:none;}\n.bn-list{display:flex;}\n.bn-item{\n  flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;\n  background:none;border:none;color:var(--ink-faint);font-size:10.5px;padding:9px 2px 7px;\n}\n.bn-item.active{color:var(--accent);}\n.bn-item.safety.active{color:var(--danger);}\n\n@media (max-width:860px){\n  .sidebar{display:none;}\n  .mobile-topbar{\n    display:flex;align-items:center;justify-content:space-between;\n    padding:16px 18px;background:var(--surface);border-bottom:1px solid var(--border);\n    position:sticky;top:0;z-index:80;\n  }\n  .main{padding:20px 16px 90px;max-width:none;}\n  .stat-grid{grid-template-columns:repeat(2,1fr);}\n  .bottom-nav{\n    display:block;position:fixed;bottom:0;left:0;right:0;\n    background:var(--surface);border-top:1px solid var(--border);z-index:100;\n    padding-bottom:env(safe-area-inset-bottom,0);\n  }\n  #azw-launcher{bottom:76px;}\n  #azw-panel{bottom:140px;right:16px;}\n}\n\n/* ---------- MOOD TINT ---------- */\n.home-hero{background:var(--mood-tint,var(--surface));transition:background .6s ease;}\n.breathe-stage{background:var(--mood-tint,var(--surface));transition:background .6s ease;}\n";
  document.head.appendChild(styleEl);

  document.body.innerHTML = "<div class=\"app\">\n\n  <aside class=\"sidebar\">\n    <div class=\"brand\">\n      <div class=\"brand-mark\">\n        <svg class=\"icon\" viewBox=\"0 0 24 24\" style=\"stroke:#fff;\"><path d=\"M20.8 8.6c0 5.6-8.8 10.6-8.8 10.6S3.2 14.2 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z\"/></svg>\n      </div>\n      <span class=\"brand-name\">All&#8217;zWell</span>\n    </div>\n\n    <div id=\"presenceArc\" class=\"presence-arc\"></div>\n\n    <ul id=\"navList\" class=\"nav-list\"></ul>\n\n    <div class=\"sidebar-footer\">\n      <button class=\"settings-btn\" id=\"openSettings\">\n        <svg class=\"icon\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.7 7.7 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.7 7.7 0 0 0 2.6-1.5l2.4 1 2-3.4Z\"/></svg>\n        Settings\n      </button>\n    </div>\n  </aside>\n\n  <div class=\"mobile-topbar\">\n    <span class=\"brand-name\" style=\"font-size:16px;\">All&#8217;zWell</span>\n    <button class=\"settings-btn\" id=\"openSettingsMobile\" style=\"width:auto;border:none;padding:6px;\">\n      <svg class=\"icon\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.7 7.7 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.7 7.7 0 0 0 2.6-1.5l2.4 1 2-3.4Z\"/></svg>\n    </button>\n  </div>\n\n  <main class=\"main\">\n\n    <!-- HOME -->\n    <div id=\"view-home\" class=\"view active\">\n      <div class=\"card home-hero\">\n        <div>\n          <h1 id=\"greetText\">Good morning.</h1>\n          <button id=\"editNameBtn\">Add your name &rarr;</button>\n        </div>\n        <div id=\"streakPill\" class=\"streak-pill\"></div>\n      </div>\n\n      <div class=\"card\">\n        <div class=\"eyebrow\" style=\"margin-bottom:10px;\">Quick check-in</div>\n        <div id=\"quickMoods\" class=\"quick-moods\"></div>\n      </div>\n\n      <div class=\"card\">\n        <div class=\"eyebrow\" style=\"margin-bottom:10px;\">A moment for yourself</div>\n        <div class=\"quick-grid\">\n          <button class=\"link-card\" data-nav=\"ritual\">\n            <svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M20 4c0 8.6-4.9 13-9.6 13A5.4 5.4 0 0 1 5 11.6C5 7 9.1 4 20 4Z\"/><path d=\"M4 20c1.8-4.8 4.7-8 8.6-9.8\"/></svg>\n            <span>Start the 3-minute ritual<small>Breathe, check in, write one line</small></span>\n          </button>\n        </div>\n      </div>\n\n      <div class=\"card home-journal-preview\">\n        <div class=\"eyebrow\" style=\"margin-bottom:10px;\">Latest journal entry</div>\n        <h3 id=\"homeJournalTitle\">Nothing written yet</h3>\n        <p id=\"homeJournalSnippet\">Your most recent entry will show up here once you've written one.</p>\n      </div>\n    </div>\n\n    <!-- CHECK-IN -->\n    <div id=\"view-checkin\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Check in</h2>\n        <p class=\"section-sub\">A few taps is enough — add a note only if you feel like it.</p>\n      </div>\n\n      <div class=\"card\">\n        <span class=\"field-label\">How are you feeling?</span>\n        <div id=\"moodScale\" class=\"mood-scale\"></div>\n\n        <div style=\"margin-top:14px;\">\n          <details id=\"bodyAreasDetails\">\n            <summary class=\"field-label\" style=\"cursor:pointer;\">Where do you feel it? (optional)</summary>\n            <div style=\"display:flex;justify-content:center;margin-top:10px;\">\n              <svg id=\"bodyAreasSvg\" viewBox=\"0 0 140 240\" style=\"width:130px;height:auto;\">\n                <circle cx=\"70\" cy=\"26\" r=\"18\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;\"/>\n                <line x1=\"70\" y1=\"44\" x2=\"70\" y2=\"60\" style=\"stroke:var(--ink-faint);stroke-width:1.8;\"/>\n                <path d=\"M48 62 L92 62 L86 142 L54 142 Z\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;stroke-linejoin:round;\"/>\n                <path d=\"M50 66 L22 128\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;stroke-linecap:round;\"/>\n                <path d=\"M90 66 L118 128\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;stroke-linecap:round;\"/>\n                <path d=\"M62 142 L48 224\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;stroke-linecap:round;\"/>\n                <path d=\"M78 142 L92 224\" style=\"fill:none;stroke:var(--ink-faint);stroke-width:1.8;stroke-linecap:round;\"/>\n              </svg>\n            </div>\n          </details>\n        </div>\n\n        <div style=\"margin-top:16px;\">\n          <span class=\"field-label\">Anything it's tied to? (optional)</span>\n          <div id=\"moodTags\" class=\"chip-row\"></div>\n        </div>\n\n        <div style=\"margin-top:14px;\">\n          <span class=\"field-label\">Note (optional)</span>\n          <textarea id=\"moodNote\" class=\"field\" rows=\"3\" placeholder=\"What's going on?\"></textarea>\n        </div>\n\n        <button id=\"saveMoodBtn\" class=\"btn\" style=\"margin-top:16px;\" disabled>Save check-in</button>\n      </div>\n\n      <div class=\"card\">\n        <h3 style=\"font-size:15px;margin-bottom:10px;\">Recent check-ins</h3>\n        <div id=\"moodHistory\"></div>\n      </div>\n    </div>\n\n    <!-- RITUAL -->\n    <section class=\"view\" id=\"view-ritual\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Ritual</h2>\n        <p class=\"section-sub\">Three small steps, about three minutes. Breathe, notice, write one line.</p>\n      </div>\n\n      <div class=\"card\" id=\"ritualCard\">\n        <div class=\"ritual-steps\">\n          <div class=\"ritual-step-dot\"></div>\n          <div class=\"ritual-step-dot\"></div>\n          <div class=\"ritual-step-dot\"></div>\n        </div>\n\n        <div class=\"eyebrow\" id=\"ritualEyebrow\">Step 1 of 3</div>\n        <h3 id=\"ritualTitle\" style=\"font-size:17px;margin-top:4px;\">Breathe for a minute</h3>\n        <p id=\"ritualSub\" class=\"section-sub\" style=\"margin-bottom:0;\">Follow the orb — in for four, out for six.</p>\n\n        <div id=\"ritualStep1\" class=\"ritual-slot\"></div>\n\n        <div id=\"ritualStep2\" class=\"ritual-body\" style=\"display:none;margin-top:18px;\">\n          <div id=\"ritualMoodScale\" class=\"mood-scale\"></div>\n        </div>\n\n        <div id=\"ritualStep3\" class=\"ritual-body\" style=\"display:none;margin-top:18px;\">\n          <input id=\"ritualLine\" class=\"field\" placeholder=\"One line about right now\">\n          <button id=\"ritualFinishBtn\" class=\"btn\">Finish</button>\n        </div>\n\n        <div id=\"ritualDone\" class=\"ritual-body\" style=\"display:none;margin-top:18px;\">\n          <div class=\"ritual-done-mark\"><svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M5 12.5 9.5 17 19 7\"/></svg></div>\n          <p>That&#8217;s the whole ritual — breath, mood and a line, all saved. Nothing else needed today.</p>\n          <button id=\"ritualDoneBtn\" class=\"btn\">Done</button>\n        </div>\n      </div>\n    </section>\n\n    <!-- JOURNAL -->\n    <div id=\"view-journal\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Journal</h2>\n        <p class=\"section-sub\">A private space to write. Nothing here is scored or shared.</p>\n      </div>\n\n      <div class=\"card journal-form\">\n        <div id=\"jModeToggle\" class=\"seg-group\" style=\"margin-top:0;\">\n          <button class=\"seg-btn sel\" type=\"button\" data-jmode=\"full\">Full entry</button>\n          <button class=\"seg-btn\" type=\"button\" data-jmode=\"oneline\">One line</button>\n        </div>\n        <input id=\"jTitle\" class=\"field\" placeholder=\"Title (optional)\">\n        <textarea id=\"jBody\" class=\"field\" rows=\"6\" placeholder=\"Write whatever's on your mind...\"></textarea>\n        <div id=\"jOneLineWrap\" style=\"display:none;\">\n          <input id=\"jOneLine\" class=\"field\" maxlength=\"140\" placeholder=\"One line about today\">\n          <div id=\"jOneLineCount\" class=\"j-count\">0 / 140</div>\n        </div>\n        <div id=\"jMetaRow\" style=\"display:flex;gap:10px;flex-wrap:wrap;\">\n          <input id=\"jTags\" class=\"field\" style=\"flex:1;min-width:160px;\" placeholder=\"Tags, comma separated\">\n          <select id=\"jMood\" class=\"field\" style=\"flex:0 0 150px;\">\n            <option value=\"\">No mood</option>\n          </select>\n        </div>\n        <div style=\"display:flex;gap:10px;\">\n          <button id=\"saveJournalBtn\" class=\"btn\">Save entry</button>\n          <button id=\"cancelEditBtn\" class=\"btn btn-ghost\" style=\"display:none;\">Cancel edit</button>\n        </div>\n      </div>\n\n      <div class=\"card\">\n        <input id=\"journalSearch\" class=\"field\" placeholder=\"Search your entries...\" style=\"margin-bottom:14px;\">\n        <div id=\"journalList\"></div>\n      </div>\n    </div>\n\n    <!-- BREATHE -->\n    <div id=\"view-breathe\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Breathe</h2>\n        <p class=\"section-sub\">Guided patterns to help you settle, even for just a couple of minutes.</p>\n      </div>\n\n      <div class=\"card\">\n        <span class=\"field-label\">Pattern</span>\n        <div id=\"patternSelect\" class=\"seg-group\"></div>\n        <div style=\"margin-top:14px;\">\n          <span class=\"field-label\">Duration</span>\n          <div id=\"durationSelect\" class=\"seg-group\"></div>\n        </div>\n      </div>\n\n      <div class=\"card breathe-stage\">\n        <div id=\"breatheOrb\" class=\"breathe-orb\"></div>\n        <div id=\"breatheLabel\">Ready when you are</div>\n        <div id=\"breatheCount\"></div>\n        <div id=\"breatheTimer\"></div>\n        <button id=\"breatheToggle\" class=\"btn\">Start</button>\n      </div>\n    </div>\n\n    <!-- SOUNDS -->\n    <div id=\"view-sounds\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Sounds</h2>\n        <p class=\"section-sub\">Soft ambient tones to play in the background.</p>\n      </div>\n      <div id=\"soundList\" class=\"sound-list\"></div>\n    </div>\n\n    <!-- COMMUNITY -->\n    <div id=\"view-community\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Community</h2>\n        <p class=\"section-sub\">Topic circles you can join, with private notes only you can see.</p>\n      </div>\n      <div id=\"circleList\" class=\"circle-list\"></div>\n    </div>\n\n    <!-- INSIGHTS -->\n    <div id=\"view-insights\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Insights</h2>\n        <p class=\"section-sub\">Your check-ins and journal entries, turned into simple trends.</p>\n      </div>\n\n      <div id=\"presenceArcInsights\" class=\"presence-arc\" style=\"margin-bottom:14px;\"></div>\n\n      <div id=\"statGrid\" class=\"stat-grid\"></div>\n\n      <div class=\"card\" style=\"margin-top:14px;\">\n        <h3 style=\"font-size:15px;margin-bottom:12px;\">Mood over time</h3>\n        <svg id=\"moodChart\" viewBox=\"0 0 600 160\" style=\"width:100%;height:auto;\"></svg>\n      </div>\n\n      <div class=\"card\">\n        <h3 style=\"font-size:15px;margin-bottom:12px;\">Mood distribution</h3>\n        <div id=\"distList\"></div>\n      </div>\n\n      <div class=\"card\">\n        <h3 style=\"font-size:15px;margin-bottom:12px;\">What tends to go with your mood</h3>\n        <div id=\"correlationList\"></div>\n      </div>\n\n      <div class=\"card\" id=\"tagCloudCard\">\n        <h3 style=\"font-size:15px;margin-bottom:12px;\">Common tags</h3>\n        <div id=\"tagCloud\" class=\"chip-row\"></div>\n      </div>\n    </div>\n\n    <!-- SAFETY -->\n    <div id=\"view-safety\" class=\"view\">\n      <div class=\"view-head\">\n        <h2 class=\"section-title\">Safety</h2>\n        <p class=\"section-sub\">Real people to talk to, any time you need them.</p>\n      </div>\n      <div class=\"card\">\n        <div id=\"safetyList\"></div>\n      </div>\n    </div>\n\n  </main>\n\n  <nav class=\"bottom-nav\">\n    <div id=\"bottomNav\" class=\"bn-list\"></div>\n  </nav>\n</div>\n\n<!-- SETTINGS MODAL -->\n<div class=\"modal-backdrop\" id=\"settingsBackdrop\">\n  <div class=\"modal\">\n    <div class=\"modal-head\">\n      <h3 style=\"font-size:17px;\">Settings</h3>\n      <button class=\"modal-close\" id=\"closeSettings\">\n        <svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg>\n      </button>\n    </div>\n\n    <div class=\"modal-row\">\n      <span class=\"field-label\">Your name</span>\n      <input id=\"settingsName\" class=\"field\" placeholder=\"What should we call you?\">\n    </div>\n    <button id=\"saveSettings\" class=\"btn\">Save</button>\n\n    <hr class=\"modal-divider\">\n\n    <div class=\"modal-row\">\n      <span class=\"field-label\">Backup</span>\n      <div style=\"display:flex;gap:10px;flex-wrap:wrap;\">\n        <button id=\"downloadDataBtn\" class=\"btn btn-ghost btn-sm\">Download backup</button>\n        <button id=\"importDataBtn\" class=\"btn btn-ghost btn-sm\">Import backup</button>\n        <input type=\"file\" id=\"importDataFile\" accept=\"application/json\" style=\"display:none;\">\n      </div>\n    </div>\n\n    <hr class=\"modal-divider\">\n\n    <div class=\"modal-row\">\n      <div class=\"danger-zone-label\">Danger zone</div>\n      <button id=\"clearDataBtn\" class=\"btn\" style=\"background:var(--danger);\">Clear all data</button>\n    </div>\n  </div>\n</div>\n\n<!-- CHAT WIDGET -->\n<button id=\"azw-launcher\" aria-label=\"Open chat guide\">\n  <svg class=\"icon\" viewBox=\"0 0 24 24\" style=\"stroke:#fff;width:22px;height:22px;\"><path d=\"M4 4h16v12H8l-4 4Z\"/></svg>\n</button>\n<div id=\"azw-panel\">\n  <div class=\"azw-head\">\n    <b>All&#8217;zWell guide</b>\n    <button id=\"azw-close\">\n      <svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg>\n    </button>\n  </div>\n  <div id=\"azw-body\"></div>\n  <div id=\"azw-quick\" class=\"azw-quick\"></div>\n  <div class=\"azw-input-row\">\n    <input id=\"azw-input\" placeholder=\"Ask me anything...\">\n    <button id=\"azw-send\" aria-label=\"Send\">\n      <svg class=\"icon\" viewBox=\"0 0 24 24\" style=\"stroke:#fff;width:16px;height:16px;\"><path d=\"M4 12h16M14 6l6 6-6 6\"/></svg>\n    </button>\n  </div>\n</div>\n\n<div id=\"toast\" class=\"toast\"></div>";
})();

/* ============================================================
   Application logic (runs immediately after the markup above
   has been injected into document.body)
============================================================ */
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
   remove the inline <script>...<\/script> body from that file,
   and add before </body>:
     <script src="allzwell-app.js"><\/script>
============================================================ */
(function(){
"use strict";

/* ============================================================
   Storage helpers (all data local to this browser only)
============================================================ */
var KEY = {
  name:"azw_name", moods:"azw_moods", journal:"azw_journal",
  joined:"azw_joined_circles", notes:"azw_circle_notes", breath:"azw_breath_stats",
  /* 2.0 additions */
  dismissedInsights:"azw_dismissed_insights", stepFeedback:"azw_step_feedback",
  campus:"azw_campus_name", campusChecks:"azw_campus_checkins",
  mutedCircles:"azw_muted_circles", reports:"azw_reports",
  aiConsent:"azw_ai_consent", trackingOff:"azw_tracking_off",
  supportConsent:"azw_support_consent", campusContact:"azw_campus_contact"
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
   Mood tint — a gentle, bounded color shift on a couple of
   already-existing accent surfaces (Home's hero card, Breathe's
   orb stage), driven by the average of the last 10 check-ins.

   This build's palette doesn't define --coral-pale / --teal-pale /
   --bg-alt tokens the way the original design spec described them —
   it uses --danger-soft, --teal, and --surface-2 instead. Those are
   used here as the closest equivalents: --danger-soft is already the
   app's pale warm tone, --surface-2 is already its neutral pale tone,
   and a pale teal is synthesized at the exact same blend ratio
   --danger-soft already uses against --surface, so all three stops
   land at the same gentle intensity the app already uses elsewhere —
   never anything more saturated, so text contrast is never at risk.
   Reading the tokens live (via getComputedStyle) also means this
   keeps working correctly in this build's dark theme.
============================================================ */
function hexToRgb(hex){
  hex = (hex || "").trim();
  if (hex.charAt(0) === "#") hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split("").map(function(c){ return c + c; }).join("");
  var num = parseInt(hex, 16) || 0;
  return { r:(num >> 16) & 255, g:(num >> 8) & 255, b:num & 255 };
}
function mixRgb(a, b, t){
  t = Math.max(0, Math.min(1, t));
  return { r:a.r + (b.r - a.r) * t, g:a.g + (b.g - a.g) * t, b:a.b + (b.b - a.b) * t };
}
function rgbToCss(rgb){ return "rgb(" + Math.round(rgb.r) + "," + Math.round(rgb.g) + "," + Math.round(rgb.b) + ")"; }

function applyMoodTint(){
  var recent = load(KEY.moods, []).slice(0, 10);
  var recentAvg = recent.length >= 3
    ? recent.reduce(function(sum, e){ return sum + e.mood; }, 0) / recent.length
    : 3;
  recentAvg = Math.max(1, Math.min(5, recentAvg));

  var cs = getComputedStyle(document.documentElement);
  var surfaceRgb    = hexToRgb(cs.getPropertyValue("--surface")     || "#FFFFFF");
  var warmPaleRgb   = hexToRgb(cs.getPropertyValue("--danger-soft") || "#F7E7E1");
  var neutralRgb    = hexToRgb(cs.getPropertyValue("--surface-2")   || "#FAF8FC");
  var tealRgb       = hexToRgb(cs.getPropertyValue("--teal")        || "#5E9C8F");
  var coolPaleRgb   = mixRgb(surfaceRgb, tealRgb, 0.15); // same 15% blend ratio as --danger-soft

  var tint;
  if (recentAvg <= 3){
    tint = mixRgb(warmPaleRgb, neutralRgb, (recentAvg - 1) / 2); // avg 1 -> 3
  } else {
    tint = mixRgb(neutralRgb, coolPaleRgb, (recentAvg - 3) / 2); // avg 3 -> 5
  }
  document.documentElement.style.setProperty("--mood-tint", rgbToCss(tint));
}

/* ============================================================
   Nav config
============================================================ */
var NAV = [
  { id:"home", label:"Home", icon:'<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/>' },
  { id:"checkin", label:"Check In", icon:'<path d="M20.8 8.6c0 5.6-8.8 10.6-8.8 10.6S3.2 14.2 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z"/>' },
  { id:"ritual", label:"Ritual", icon:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/>' },
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
  if (id === "ritual") startRitual(); else leaveRitual();
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
    applyMoodTint();
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
var selectedBodyAreas = [];
var BODY_AREA_POINTS = [
  { name:"head", cx:70, cy:26, r:14 },
  { name:"throat", cx:70, cy:50, r:9 },
  { name:"shoulders", cx:70, cy:66, r:11 },
  { name:"chest", cx:70, cy:96, r:15 },
  { name:"stomach", cx:70, cy:126, r:15 }
];
var bodyAreasSvgEl = document.getElementById("bodyAreasSvg");
if (bodyAreasSvgEl){
  var SVG_NS = "http://www.w3.org/2000/svg";
  BODY_AREA_POINTS.forEach(function(p){
    var h = document.createElementNS(SVG_NS, "circle");
    h.setAttribute("cx", p.cx); h.setAttribute("cy", p.cy); h.setAttribute("r", p.r);
    h.setAttribute("class", "body-hotspot");
    h.setAttribute("data-area", p.name);
    h.setAttribute("fill", "var(--accent)");
    h.setAttribute("fill-opacity", "0");
    h.setAttribute("stroke", "none");
    h.style.cursor = "pointer";
    h.addEventListener("click", function(){
      var i = selectedBodyAreas.indexOf(p.name);
      if (i === -1){
        selectedBodyAreas.push(p.name);
        h.classList.add("sel");
        h.setAttribute("fill-opacity", "0.3");
      } else {
        selectedBodyAreas.splice(i,1);
        h.classList.remove("sel");
        h.setAttribute("fill-opacity", "0");
      }
    });
    bodyAreasSvgEl.appendChild(h);
  });
}
document.getElementById("saveMoodBtn").addEventListener("click", function(){
  if (!selectedMood) return;
  var moods = load(KEY.moods, []);
  moods.unshift({ id:uid(), ts:Date.now(), mood:selectedMood, note:document.getElementById("moodNote").value.trim(), tags:selectedTags.slice(), bodyAreas:selectedBodyAreas.slice() });
  save(KEY.moods, moods);
  applyMoodTint();
  selectedMood = null; selectedTags = []; selectedBodyAreas = [];
  document.querySelectorAll(".mood-opt").forEach(function(x){ x.classList.remove("sel"); });
  document.querySelectorAll("#moodTags .chip").forEach(function(x){ x.classList.remove("sel"); });
  if (bodyAreasSvgEl){
    bodyAreasSvgEl.querySelectorAll(".body-hotspot").forEach(function(x){ x.classList.remove("sel"); x.setAttribute("fill-opacity","0"); });
  }
  var bodyAreasDetailsEl = document.getElementById("bodyAreasDetails");
  if (bodyAreasDetailsEl) bodyAreasDetailsEl.removeAttribute("open");
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
        (e.bodyAreas && e.bodyAreas.length ? '<div class="entry-tags">Felt in: '+escapeHtml(e.bodyAreas.join(", "))+'</div>' : '') +
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
/* ---- entry mode: full entry vs one line (creation only) ---- */
var J_MAX = 140;
var jMode = "full";
var jTitleEl        = document.getElementById("jTitle");
var jBodyEl         = document.getElementById("jBody");
var jModeToggleEl   = document.getElementById("jModeToggle");
var jMetaRowEl      = document.getElementById("jMetaRow");
var jOneLineWrapEl  = document.getElementById("jOneLineWrap");
var jOneLineEl      = document.getElementById("jOneLine");
var jOneLineCountEl = document.getElementById("jOneLineCount");

function renderJCount(){ jOneLineCountEl.textContent = jOneLineEl.value.length + " / " + J_MAX; }

/* carry=true moves whatever is already typed across, when it fits */
function setJournalMode(mode, carry){
  jMode = (mode === "oneline") ? "oneline" : "full";
  if (carry){
    if (jMode === "oneline"){
      var t = jBodyEl.value;
      if (t && !jOneLineEl.value && t.length <= J_MAX && t.indexOf("\n") === -1) jOneLineEl.value = t;
    } else if (jOneLineEl.value && !jBodyEl.value){
      jBodyEl.value = jOneLineEl.value;
    }
  }
  var one = jMode === "oneline";
  jTitleEl.style.display       = one ? "none" : "";
  jBodyEl.style.display        = one ? "none" : "";
  jMetaRowEl.style.display     = one ? "none" : "flex";
  jOneLineWrapEl.style.display = one ? "block" : "none";
  jModeToggleEl.querySelectorAll(".seg-btn").forEach(function(b){
    b.classList.toggle("sel", b.dataset.jmode === jMode);
  });
  renderJCount();
}
jModeToggleEl.querySelectorAll(".seg-btn").forEach(function(b){
  b.addEventListener("click", function(){ setJournalMode(b.dataset.jmode, true); });
});
jOneLineEl.addEventListener("input", renderJCount);
jOneLineEl.addEventListener("keydown", function(e){
  if (e.key === "Enter") document.getElementById("saveJournalBtn").click();
});
setJournalMode("full", false);

var editingId = null;
document.getElementById("saveJournalBtn").addEventListener("click", function(){
  var oneLine = jMode === "oneline";
  var body = (oneLine ? jOneLineEl.value : jBodyEl.value).trim();
  if (!body){ toast("Write something first"); return; }
  var journal = load(KEY.journal, []);
  /* One-line entries skip the mood and tag inputs entirely — same schema,
     same body field, so the journal list renders them exactly as before. */
  var tags = oneLine ? [] : document.getElementById("jTags").value.split(",").map(function(t){return t.trim();}).filter(Boolean);
  var entry = {
    id: editingId || uid(), ts: editingId ? (journal.filter(function(e){return e.id===editingId;})[0]||{}).ts || Date.now() : Date.now(),
    title: oneLine ? null : document.getElementById("jTitle").value.trim(), body: body,
    mood: oneLine ? null : (jMoodSelect.value ? Number(jMoodSelect.value) : null), tags: tags
  };
  var wasEditing = !!editingId;
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
  jOneLineEl.value = "";
  setJournalMode(wasEditing ? "full" : jMode, false);
  toast("Entry saved");
  renderJournalList(); renderHomeJournal(); renderStreak();
});
document.getElementById("cancelEditBtn").addEventListener("click", function(){
  editingId = null;
  document.getElementById("jTitle").value = ""; document.getElementById("jBody").value = "";
  document.getElementById("jTags").value = ""; jMoodSelect.value = "";
  jOneLineEl.value = ""; setJournalMode("full", false);
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
      /* An untitled entry that still fits on one line opens in one-line mode. */
      var body = e.body || "";
      if (!e.title && body.length <= J_MAX && body.indexOf("\n") === -1){
        jOneLineEl.value = body;
        setJournalMode("oneline", false);
      } else {
        jOneLineEl.value = "";
        setJournalMode("full", false);
      }
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
function finishBreathing(completed, onComplete){
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
  /* Optional callback: only ever fires while the ritual is running, so the
     standalone Breathe view behaves exactly as before. */
  var cb = (typeof onComplete === "function") ? onComplete : ritualBreathCallback;
  if (ritualActive && completed && typeof cb === "function"){
    ritualBreathCallback = null;
    cb();
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
  { id:"academic", tag:"Academic pressure", title:"The Workload Isn't the Whole Story", desc:"For exam stress, deadlines, and the fear-of-failure spiral." },
  { id:"hostel", tag:"Hostel life", title:"Finding Your Footing", desc:"Adjusting to hostel or dorm life, homesickness, and new routines." },
  { id:"lowmood", tag:"Low mood", title:"Small Steps Circle", desc:"For the days getting out of bed is the whole win." },
  { id:"communication", tag:"Communication confidence", title:"Saying the Thing", desc:"For anyone building confidence in conversations, big or small." }
];
// Deterministic string hash (djb2-ish) — no crypto needed, just needs to be stable per input.
function hashSeed(str){
  var h = 0;
  for (var i = 0; i < str.length; i++){
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0; // keep it a 32-bit int
  }
  return Math.abs(h);
}

// Simulated, client-only "community pulse" for a circle. Deterministic per circle+day
// (same input always produces the same label within a given day, changes the next day).
// This is NOT real aggregate data — there is no backend and no other users — it exists
// purely to make the circle feel a little more alive, and is always paired with a
// disclaimer wherever it's shown (see renderCircles).
function getSimulatedPulse(circleId){
  var today = new Date();
  var dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
  var seed = hashSeed(String(circleId) + dateStr);
  var n = seed % 100;
  // Weighted toward the middle of the scale (Okay/Good) rather than the extremes.
  var weighted = [
    { label:"Rough", weight:10 },
    { label:"Low",   weight:15 },
    { label:"Okay",  weight:30 },
    { label:"Good",  weight:30 },
    { label:"Great", weight:15 }
  ];
  var acc = 0;
  for (var i = 0; i < weighted.length; i++){
    acc += weighted[i].weight;
    if (n < acc) return weighted[i].label;
  }
  return "Okay";
}

var CIRCLE_PROMPTS = {
  anxiety:"What's one thought that's been on repeat today? You don't have to solve it here — just name it.",
  recovery:"What's one small habit win from this week, however small?",
  academic:"What's the single next step on your workload — not the whole list, just the next one?",
  hostel:"What's one thing that's started to feel familiar about where you're staying now?",
  lowmood:"If today had a weather forecast, what would it be?",
  communication:"Think of one conversation this week that went better than you expected. What helped?"
};
function renderCircles(){
  var joined = load(KEY.joined, []);
  var notesAll = load(KEY.notes, {});
  var muted = load(KEY.mutedCircles, []);
  var wrap = document.getElementById("circleList");
  wrap.innerHTML =
    '<div class="card" style="margin-bottom:14px;">' +
      '<h3 style="font-size:15px;margin-bottom:8px;">Community guidelines</h3>' +
      '<p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Be kind and assume good intent. This isn\'t a place for medical advice or diagnoses. No shaming, no judgment, no sharing others\u2019 words elsewhere. If something feels urgent or unsafe, use the <button data-nav="safety" style="background:none;border:none;color:var(--accent);font-weight:600;padding:0;cursor:pointer;">Safety page</button>, not a circle.</p>' +
      '<p style="font-size:12px;color:var(--ink-faint);margin-top:8px;">Circles in this build are a local, single-user prototype — your notes are private to this device. There is no live backend yet, so nothing you write here is seen by anyone else. The pulse label on each circle is a simulated daily signal for demo purposes, not real activity from other people.</p>' +
    '</div>';
  CIRCLES.forEach(function(c){
    var isJoined = joined.indexOf(c.id) > -1;
    var isMuted = muted.indexOf(c.id) > -1;
    var el = document.createElement("div");
    el.className = "card circle-card";
    var notes = notesAll[c.id] || [];
    var pulseLabel = getSimulatedPulse(c.id);
    var prompt = CIRCLE_PROMPTS[c.id] || "What's on your mind about this today?";
    el.innerHTML =
      '<div class="circle-top"><div><span class="circle-tag">'+c.tag+'</span><h3 style="font-size:16px;margin-top:6px;">'+c.title+'</h3><p style="font-size:13.5px;color:var(--ink-soft);margin-top:6px;line-height:1.55;">'+c.desc+'</p>' +
      (isMuted ? '' : '<div class="eyebrow circle-pulse">Right now, most people here are logging &#8216;'+pulseLabel+'&#8217;<span class="circle-pulse-disclaimer">A simulated illustrative signal, not live data from real people.</span></div>') +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">' +
      '<button class="btn btn-sm '+(isJoined?"btn-ghost":"btn-soft")+'" data-join="'+c.id+'">'+(isJoined?"Joined ✓":"Join")+'</button>' +
      (isJoined ? '<button class="btn-danger-text" data-mute="'+c.id+'">'+(isMuted?"Unmute":"Mute")+'</button>' : '') +
      '</div></div>' +
      (isJoined ? (
        '<div class="circle-notes">' +
          '<div class="eyebrow" style="margin-bottom:6px;">Discussion prompt</div>' +
          '<p style="font-size:13px;color:var(--ink-soft);margin-bottom:10px;">'+prompt+'</p>' +
          '<label class="field-label">Your private notes for this circle</label>' +
          '<textarea class="field" rows="2" placeholder="What resonates today?" data-note-input="'+c.id+'"></textarea>' +
          '<div style="display:flex;gap:10px;margin-top:8px;">' +
            '<button class="btn btn-ghost btn-sm" data-note-save="'+c.id+'">Add note</button>' +
            '<button class="btn-danger-text" data-report="'+c.id+'">Report a concern</button>' +
          '</div>' +
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
  wrap.querySelectorAll("[data-mute]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.dataset.mute;
      var muted = load(KEY.mutedCircles, []);
      var i = muted.indexOf(id);
      if (i>-1) muted.splice(i,1); else muted.push(id);
      save(KEY.mutedCircles, muted);
      toast(i>-1 ? "Circle unmuted" : "Circle muted — you won't see its pulse signal");
      renderCircles();
    });
  });
  wrap.querySelectorAll("[data-report]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.dataset.report;
      var reports = load(KEY.reports, []);
      reports.unshift({ id:uid(), ts:Date.now(), circle:id });
      save(KEY.reports, reports);
      toast("Thanks — this is logged locally. There's no live moderation team in this prototype yet.");
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

  // Mood correlations (which tags tend to go with which mood)
  renderCorrelations(moods, journal);

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

  renderPatterns(moods, journal, breath);
}

/* ============================================================
   "My Emotional Patterns" — explainable, rule-based insights.
   Every insight here is a plain observation about counts/averages
   in the user's own data, shown with the numbers behind it. This
   is NOT machine learning, NOT a diagnosis, and NOT a prediction —
   it never claims causation, never infers anything the user didn't
   log, and always says so.
============================================================ */
function tagAverages(moods, journal){
  var tagMood = {};
  [moods, journal].forEach(function(list){
    list.forEach(function(e){
      if (typeof e.mood !== "number") return;
      (e.tags||[]).forEach(function(t){
        if (!tagMood[t]) tagMood[t] = { sum:0, count:0 };
        tagMood[t].sum += e.mood; tagMood[t].count += 1;
      });
    });
  });
  return tagMood;
}
function buildPatternInsights(moods, journal, breath){
  var insights = [];
  var overallAvg = moods.length ? moods.reduce(function(s,e){return s+e.mood;},0)/moods.length : null;
  var tagMood = tagAverages(moods, journal);

  // 1) Tag associated with lower mood than the user's own average
  if (overallAvg !== null){
    Object.keys(tagMood).forEach(function(t){
      var d = tagMood[t];
      if (d.count < 3) return;
      var avg = d.sum / d.count;
      if (avg <= overallAvg - 0.6){
        insights.push({
          id:"low-"+t,
          text:"Your check-ins tagged \u201c"+t+"\u201d average "+avg.toFixed(1)+"/5, compared with "+overallAvg.toFixed(1)+"/5 across all your check-ins.",
          why:"This compares the average mood score on entries tagged \u201c"+t+"\u201d ("+d.count+" entries) with your overall average across "+moods.length+" check-ins. It's a pattern in what you logged, not a cause-and-effect claim — plenty of other things happened on those days too.",
          data:d.count+" tagged entries, "+moods.length+" total check-ins"
        });
      }
    });
  }
  // 2) Tag associated with higher mood
  if (overallAvg !== null){
    Object.keys(tagMood).forEach(function(t){
      var d = tagMood[t];
      if (d.count < 3) return;
      var avg = d.sum / d.count;
      if (avg >= overallAvg + 0.6){
        insights.push({
          id:"high-"+t,
          text:"You tend to log higher moods on entries tagged \u201c"+t+"\u201d — averaging "+avg.toFixed(1)+"/5.",
          why:"Based on "+d.count+" of your check-ins tagged \u201c"+t+"\u201d, compared to your "+overallAvg.toFixed(1)+"/5 overall average. This is an observation about your own logged data, not a guarantee it will hold in future.",
          data:d.count+" tagged entries"
        });
      }
    });
  }
  // 3) Breathing sessions vs mood — simple co-occurrence, explicitly non-causal
  if (breath.sessions >= 3 && moods.length >= 5){
    insights.push({
      id:"breathing",
      text:"You've completed "+breath.sessions+" breathing session"+(breath.sessions===1?"":"s")+" ("+breath.minutes+" minute"+(breath.minutes===1?"":"s")+" total). Many people find a short session helps them settle before a check-in.",
      why:"This is a summary of your own breathing activity, not a measured effect on your mood — All'zWell doesn't claim breathing \"improved\" any specific score.",
      data:breath.sessions+" sessions logged"
    });
  }
  // 4) Consistency, framed as engagement not obligation
  var last7 = moods.filter(function(e){ return Date.now() - e.ts < 7*24*3600*1000; });
  if (last7.length >= 4){
    insights.push({
      id:"consistency",
      text:"You've checked in "+last7.length+" times in the last 7 days. That reflects engagement — not a requirement to keep it up.",
      why:"Counted from check-in timestamps in the last 7 days. There's no streak pressure here; skipping days doesn't undo this.",
      data:last7.length+" check-ins in 7 days"
    });
  }
  // 5) Mixed / insufficient signal fallback
  if (!insights.length && moods.length >= 3){
    insights.push({
      id:"mixed",
      text:"Your mood pattern looks mixed right now — no single tag or activity stands out yet. Consider reflecting on what affected you today in your journal.",
      why:"No tag reached the minimum of 3 tagged check-ins with a mood clearly above or below your average, so no specific pattern is being highlighted.",
      data:moods.length+" check-ins so far"
    });
  }
  return insights;
}
function renderPatterns(moods, journal, breath){
  var card = document.getElementById("patternsCard");
  if (!card) return;
  var dismissed = load(KEY.dismissedInsights, []);
  if (moods.length < 3){
    card.innerHTML = '<h3 style="font-size:15px;margin-bottom:8px;">My Emotional Patterns</h3>' +
      '<div class="empty"><span>Log a few more check-ins (3 or more) and patterns will start showing up here — always with the numbers behind them.</span></div>';
    return;
  }
  var insights = buildPatternInsights(moods, journal, breath).filter(function(i){ return dismissed.indexOf(i.id) === -1; });
  if (!insights.length){
    card.innerHTML = '<h3 style="font-size:15px;margin-bottom:8px;">My Emotional Patterns</h3>' +
      '<div class="empty"><span>Nothing new to point out right now — that\u2019s okay. Check back after a few more entries.</span></div>';
    return;
  }
  card.innerHTML = '<h3 style="font-size:15px;margin-bottom:4px;">My Emotional Patterns</h3>' +
    '<p class="section-sub" style="margin-bottom:14px;">Observations from your own data — not facts, not diagnoses.</p>' +
    insights.map(function(i){
      return '<div class="pattern-row" data-pid="'+i.id+'">' +
        '<p class="pattern-text">'+i.text+'</p>' +
        '<div class="pattern-foot">' +
          '<details><summary>Why am I seeing this?</summary><p>'+i.why+'</p><p class="pattern-data">Based on: '+i.data+'</p></details>' +
          '<button class="btn-danger-text" data-dismiss-insight="'+i.id+'">Dismiss</button>' +
        '</div>' +
      '</div>';
    }).join("");
  card.querySelectorAll("[data-dismiss-insight]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var d = load(KEY.dismissedInsights, []);
      d.push(btn.dataset.dismissInsight);
      save(KEY.dismissedInsights, d);
      renderInsights();
    });
  });
}

// What tends to go with your mood: average mood per tag, for tags with 3+
// mood-bearing occurrences across check-ins and journal entries.
function renderCorrelations(moods, journal){
  var tagMood = {};
  function tally(entries){
    entries.forEach(function(e){
      if (typeof e.mood !== "number") return;
      (e.tags||[]).forEach(function(t){
        if (!tagMood[t]) tagMood[t] = { sum:0, count:0 };
        tagMood[t].sum += e.mood;
        tagMood[t].count += 1;
      });
    });
  }
  tally(moods);
  tally(journal);

  var rows = Object.keys(tagMood)
    .filter(function(t){ return tagMood[t].count >= 3; })
    .map(function(t){ return { tag:t, avg: tagMood[t].sum / tagMood[t].count }; })
    .sort(function(a,b){ return a.avg - b.avg; });

  var el = document.getElementById("correlationList");
  if (rows.length < 2){
    el.innerHTML = '<div class="empty">Once you\'ve tagged a few more check-ins or entries, patterns will show up here.</div>';
    return;
  }
  el.innerHTML = rows.map(function(r){
    var nearest = Math.max(1, Math.min(5, Math.round(r.avg)));
    var m = moodByVal(nearest);
    var pct = ((r.avg-1)/4)*100;
    return '<div class="dist-row"><span class="dist-label">'+escapeHtml(r.tag)+'</span><div class="dist-track"><div class="dist-fill" style="width:'+pct+'%;background:'+m.color+';"></div></div><span class="dist-count" style="font-family:var(--font-mono);">'+r.avg.toFixed(1)+'</span></div>';
  }).join("");
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
var CRISIS_TEXT = "I'm really glad you told me. I'm just an app guide, not a therapist or crisis counsellor, so I can't help with this myself — but please reach out to someone who can right now. You don't have to handle this alone. If you're in immediate danger, please contact local emergency services right away.";
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
    reply:"Here are ways to reach real support right now — this page is always available.", route:"safety", cta:"View safety resources" },
  { id:"nextstep", keywords:["small step","next step","what should i do","suggestion","recommend","overwhelmed","lonely"],
    reply:"Your Next Small Step gives you one realistic, low-pressure suggestion based on how you're feeling right now.", route:"nextstep", cta:"See a small step" },
  { id:"campus", keywords:["campus","college","exam","hostel","homesick","academic","classes","university"],
    reply:"Campus Life has check-ins and coping tools built around student situations like exams, hostel life, and homesickness.", route:"campus", cta:"Open Campus Life" },
  { id:"support", keywords:["counsellor","counselor","therapist","professional help","find support","emergency support"],
    reply:"Find the Right Support lays out self-help, peer support, professional counselling, and crisis options side by side.", route:"support", cta:"Find the right support" },
  { id:"patterns", keywords:["patterns","why am i seeing","explain my mood","emotional patterns"],
    reply:"My Emotional Patterns turns your own check-ins into plain-language observations, with the numbers behind each one.", route:"insights", cta:"View my patterns" }
];
var GREETING = "Hi, I'm here to help you find your way around All'zWell. I'm an app guide, not a therapist — I can't diagnose or give clinical advice, but I can point you to the right tool or resource. Try asking \u201cwhere's the journal\u201d or \u201chow do I breathe through this\u201d.";
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
    var emCta = document.createElement("button"); emCta.className = "azw-cta"; emCta.style.background = "var(--danger)"; emCta.textContent = "If you're in immediate danger, view all safety resources";
    emCta.addEventListener("click", function(){ goTo("safety"); panel.classList.remove("open"); });
    bubble.appendChild(emCta);
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
   RITUAL view — breathe, check in, write: one continuous flow
   Borrows the Breathe view's orb and the Check-in view's mood
   picker pattern without touching either one's own state.
============================================================ */
var ritualActive = false;          /* read by finishBreathing */
var ritualBreathCallback = null;   /* read by finishBreathing */
var ritualMood = null;
var ritualPrevPattern = null, ritualPrevDuration = null;

var ritualCardEl     = document.getElementById("ritualCard");
var ritualEyebrowEl  = document.getElementById("ritualEyebrow");
var ritualTitleEl    = document.getElementById("ritualTitle");
var ritualSubEl      = document.getElementById("ritualSub");
var ritualSlot1El    = document.getElementById("ritualStep1");
var ritualStep2El    = document.getElementById("ritualStep2");
var ritualStep3El    = document.getElementById("ritualStep3");
var ritualDoneEl     = document.getElementById("ritualDone");
var ritualLineEl     = document.getElementById("ritualLine");
var ritualMoodScaleEl= document.getElementById("ritualMoodScale");
var breatheViewEl    = document.getElementById("view-breathe");
var breatheStageEl   = breatheViewEl.querySelector(".breathe-stage");

var RITUAL_COPY = {
  1: ["Step 1 of 3", "Breathe for a minute", "Follow the orb — in for four, out for six."],
  2: ["Step 2 of 3", "How are you feeling?", "Pick the closest one. It saves the moment you tap."],
  3: ["Step 3 of 3", "One line", "Whatever's true right now. It goes straight to your journal."],
  4: ["Finished", "That's the ritual", ""]
};

/* Separate mood picker instance — its own selection state, so the
   Check-in view's selectedMood / Save button are never touched. */
MOODS.forEach(function(m){
  var b = document.createElement("button");
  b.className = "mood-opt"; b.type = "button"; b.style.color = m.color;
  b.innerHTML = '<span class="dot" style="background:'+m.color+'"></span><span>'+m.label+'</span>';
  b.addEventListener("click", function(){
    if (ritualMood !== null) return;
    ritualMood = m.v;
    ritualMoodScaleEl.querySelectorAll(".mood-opt").forEach(function(x){ x.classList.remove("sel"); });
    b.classList.add("sel");
    var moods = load(KEY.moods, []);
    moods.unshift({ id:uid(), ts:Date.now(), mood:m.v, note:"", tags:[] });
    save(KEY.moods, moods);
    applyMoodTint();
    renderStreak(); renderMoodHistory(); renderHomeJournal();
    setTimeout(function(){ if (ritualActive) ritualShowStep(3); }, 500);
  });
  ritualMoodScaleEl.appendChild(b);
});

/* Give the breathing stage back to the Breathe view and restore the
   pattern / duration that view had selected before the ritual. */
function ritualReleaseBreathing(){
  ritualBreathCallback = null;
  if (breatheRunning) finishBreathing(false);
  if (ritualPrevPattern){ chosenPattern = ritualPrevPattern; ritualPrevPattern = null; }
  if (ritualPrevDuration){ chosenDuration = ritualPrevDuration; ritualPrevDuration = null; }
  if (breatheStageEl && breatheStageEl.parentNode !== breatheViewEl) breatheViewEl.appendChild(breatheStageEl);
}

function ritualShowStep(n){
  if (n > 1) ritualReleaseBreathing();
  ritualSlot1El.style.display = n === 1 ? "block" : "none";
  ritualStep2El.style.display = n === 2 ? "flex"  : "none";
  ritualStep3El.style.display = n === 3 ? "flex"  : "none";
  ritualDoneEl.style.display  = n === 4 ? "flex"  : "none";
  ritualCardEl.querySelectorAll(".ritual-step-dot").forEach(function(d, i){
    d.classList.toggle("on", i < Math.min(n, 3));
  });
  var copy = RITUAL_COPY[n];
  ritualEyebrowEl.textContent = copy[0];
  ritualTitleEl.textContent   = copy[1];
  ritualSubEl.textContent     = copy[2];
  ritualSubEl.style.display   = copy[2] ? "" : "none";
  if (n === 3) setTimeout(function(){ ritualLineEl.focus(); }, 60);
}

function startRitual(){
  if (ritualActive) return;
  ritualActive = true;
  ritualMood = null;
  ritualLineEl.value = "";
  ritualMoodScaleEl.querySelectorAll(".mood-opt").forEach(function(x){ x.classList.remove("sel"); });

  if (breatheRunning) finishBreathing(false);
  ritualSlot1El.appendChild(breatheStageEl);

  ritualPrevPattern = chosenPattern; ritualPrevDuration = chosenDuration;
  var calm = PATTERNS.filter(function(p){ return p.id === "calm"; })[0];
  if (calm) chosenPattern = calm;
  chosenDuration = 1;

  ritualShowStep(1);
  ritualBreathCallback = function(){ ritualShowStep(2); };
  startBreathing();
}

function leaveRitual(){
  if (!ritualActive) return;
  ritualActive = false;
  ritualReleaseBreathing();
}

document.getElementById("ritualFinishBtn").addEventListener("click", function(){
  var line = ritualLineEl.value.trim();
  if (!line){ toast("One line is enough — anything at all"); ritualLineEl.focus(); return; }
  var journal = load(KEY.journal, []);
  journal.unshift({ id:uid(), ts:Date.now(), title:null, body:line, mood:ritualMood, tags:[] });
  save(KEY.journal, journal);
  renderJournalList(); renderHomeJournal(); renderStreak();
  ritualShowStep(4);
});
ritualLineEl.addEventListener("keydown", function(e){
  if (e.key === "Enter") document.getElementById("ritualFinishBtn").click();
});
document.getElementById("ritualDoneBtn").addEventListener("click", function(){ goTo("home"); });


/* ============================================================
   ALL'ZWELL 2.0 — additions
   Everything below is appended rather than woven into the
   original markup string, to avoid touching the fragile
   hand-escaped HTML literal near the top of the file. It reuses
   the same storage helpers, MOODS data, goTo() router, toast(),
   escapeHtml() and CSS tokens already defined above.
============================================================ */

/* ---- extra styles ---- */
var azwStyle2 = document.createElement("style");
azwStyle2.textContent = "\n"+
".pattern-row{padding:12px 0;border-bottom:1px solid var(--border);}\n"+
".pattern-row:last-child{border-bottom:none;}\n"+
".pattern-text{font-size:13.5px;color:var(--ink);line-height:1.55;}\n"+
".pattern-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px;}\n"+
".pattern-foot details{font-size:12px;color:var(--ink-soft);flex:1;}\n"+
".pattern-foot summary{cursor:pointer;font-weight:600;color:var(--accent);list-style:none;}\n"+
".pattern-foot summary::-webkit-details-marker{display:none;}\n"+
".pattern-foot details p{margin-top:6px;line-height:1.5;}\n"+
".pattern-data{color:var(--ink-faint) !important;font-family:var(--font-mono);font-size:11px !important;}\n"+
".step-card{text-align:center;padding:26px 20px;}\n"+
".step-eyebrow{font-size:12px;font-weight:600;color:var(--ink-faint);}\n"+
".step-text{font-family:var(--font-display);font-size:19px;margin:10px 0 4px;}\n"+
".step-sub{color:var(--ink-soft);font-size:13px;margin-bottom:18px;}\n"+
".step-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}\n"+
".context-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;}\n"+
".accordion{border-bottom:1px solid var(--border);padding:12px 0;}\n"+
".accordion:last-child{border-bottom:none;}\n"+
".accordion summary{cursor:pointer;font-weight:600;font-size:14px;color:var(--ink);list-style:none;display:flex;align-items:center;justify-content:space-between;}\n"+
".accordion summary::-webkit-details-marker{display:none;}\n"+
".accordion summary::after{content:'+';color:var(--accent);font-size:16px;}\n"+
".accordion[open] summary::after{content:'\\2212';}\n"+
".accordion-body{margin-top:10px;font-size:13px;color:var(--ink-soft);line-height:1.6;}\n"+
".accordion-body ul{margin:8px 0;padding-left:18px;}\n"+
".accordion-body li{margin-bottom:4px;}\n"+
".support-tier{padding:14px 0;border-bottom:1px solid var(--border);}\n"+
".support-tier:last-child{border-bottom:none;}\n"+
".support-tier-head{display:flex;align-items:center;gap:8px;margin-bottom:6px;}\n"+
".support-tier-num{width:22px;height:22px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}\n"+
".directory-card{border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px;margin-top:10px;}\n"+
".directory-name{font-weight:600;font-size:13.5px;}\n"+
".directory-meta{font-size:12px;color:var(--ink-soft);margin-top:2px;}\n"+
".label-note{font-size:11.5px;color:var(--ink-faint);background:var(--surface-2);border-radius:8px;padding:6px 10px;margin-top:2px;display:inline-block;}\n"+
".prompt-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;}\n"+
".prompt-chip{background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:6px 12px;font-size:12px;color:var(--ink-soft);}\n"+
".prompt-chip:hover{border-color:var(--accent);color:var(--accent);}\n"+
".toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;}\n"+
".toggle-row .field-label{margin-bottom:2px;}\n"+
".toggle-row p{font-size:11.5px;color:var(--ink-faint);margin-top:2px;}\n"+
".switch{position:relative;width:38px;height:22px;flex-shrink:0;}\n"+
".switch input{opacity:0;width:100%;height:100%;margin:0;position:absolute;cursor:pointer;}\n"+
".switch-track{position:absolute;inset:0;background:var(--border);border-radius:999px;transition:background .15s ease;pointer-events:none;}\n"+
".switch-track::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease;box-shadow:0 1px 2px rgba(0,0,0,0.2);}\n"+
".switch input:checked + .switch-track{background:var(--accent);}\n"+
".switch input:checked + .switch-track::after{transform:translateX(16px);}\n"+
".diff-list{display:flex;flex-direction:column;gap:10px;}\n"+
".diff-item{display:flex;gap:10px;align-items:flex-start;}\n"+
".diff-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);margin-top:6px;flex-shrink:0;}\n"+
"body.azw-no-tracking .streak-pill, body.azw-no-tracking .presence-arc{display:none !important;}\n";
document.head.appendChild(azwStyle2);

/* ---- extra nav items (desktop sidebar only — mobile bottom nav
   stays lean; these views are reachable via Home cards and the
   chat guide on small screens) ---- */
var NAV2 = [
  { id:"nextstep", label:"Next Step", icon:'<path d="M5 12h14M13 6l6 6-6 6"/>' },
  { id:"campus", label:"Campus Life", icon:'<path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/>' },
  { id:"support", label:"Find Support", icon:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>' }
];
var safetyLi = navListEl.querySelector('[data-nav="safety"]').closest("li");
NAV2.forEach(function(n){
  var li = document.createElement("li");
  var btn = document.createElement("button");
  btn.className = "nav-item";
  btn.dataset.nav = n.id;
  btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24">'+n.icon+'</svg><span>'+n.label+'</span>';
  li.appendChild(btn);
  navListEl.insertBefore(li, safetyLi);
});

/* ---- new views: inject into <main> ---- */
var mainEl = document.querySelector(".main");
mainEl.insertAdjacentHTML("beforeend",
  '<div id="view-nextstep" class="view">' +
    '<div class="view-head"><h2 class="section-title">Your Next Small Step</h2>' +
    '<p class="section-sub">One realistic, low-pressure suggestion — never a prescription.</p></div>' +
    '<div class="card">' +
      '<span class="field-label">How does right now feel?</span>' +
      '<div id="stepContext" class="context-row"></div>' +
    '</div>' +
    '<div class="card step-card" id="stepCard"></div>' +
  '</div>' +

  '<div id="view-campus" class="view">' +
    '<div class="view-head"><h2 class="section-title">Campus Life</h2>' +
    '<p class="section-sub">Support built around common student situations — exams, hostel life, homesickness, and more.</p></div>' +
    '<div class="card">' +
      '<span class="field-label">Your college (optional, stored only on this device)</span>' +
      '<div style="display:flex;gap:10px;">' +
        '<input id="campusNameInput" class="field" placeholder="e.g. VIT Vellore">' +
        '<button id="campusNameSave" class="btn btn-ghost btn-sm" style="flex-shrink:0;">Save</button>' +
      '</div>' +
    '</div>' +
    '<div class="card"><div id="campusSituations"></div></div>' +
    '<div class="card">' +
      '<h3 style="font-size:15px;margin-bottom:8px;">Counselling &amp; resource directory</h3>' +
      '<p class="label-note">Example entry only — verify details with your institution before treating them as active. Not a verified partnership.</p>' +
      '<div class="directory-card"><div class="directory-name">Student Counselling Cell (example — VIT-style institutions)</div><div class="directory-meta">Typical hours: weekdays during term. Confirm your campus\u2019s actual desk, email and walk-in policy.</div></div>' +
      '<div style="margin-top:12px;">' +
        '<span class="field-label">Add your own campus contact (private, local only)</span>' +
        '<textarea id="campusContactInput" class="field" rows="2" placeholder="e.g. Counselling cell, Block A, ext. 4021, mon-fri 10-4"></textarea>' +
        '<button id="campusContactSave" class="btn btn-ghost btn-sm" style="margin-top:8px;">Save contact</button>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div id="view-support" class="view">' +
    '<div class="view-head"><h2 class="section-title">Find the Right Support</h2>' +
    '<p class="section-sub">Self-help, peer support, professional care and crisis support are different things — here\u2019s where each one lives.</p></div>' +
    '<div class="card" id="supportTiers"></div>' +
    '<div class="card">' +
      '<h3 style="font-size:15px;margin-bottom:8px;">Optional summary for a professional</h3>' +
      '<p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">If you\u2019d like, All\u2019zWell can put together a short, plain-text summary from your own check-ins to bring to a counsellor. This is generated entirely on your device — nothing is sent anywhere automatically, and it only happens if you consent below.</p>' +
      '<div class="toggle-row"><div><span class="field-label" style="margin-bottom:0;">I consent to generating this summary locally</span></div>' +
        '<label class="switch"><input type="checkbox" id="supportConsentToggle"><span class="switch-track"></span></label></div>' +
      '<button id="genSummaryBtn" class="btn btn-soft btn-sm" style="display:none;">Generate summary</button>' +
      '<textarea id="summaryOutput" class="field" rows="6" style="display:none;margin-top:10px;" readonly></textarea>' +
    '</div>' +
    '<div class="card">' +
      '<h3 style="font-size:15px;margin-bottom:10px;">What makes All\u2019zWell different?</h3>' +
      '<div class="diff-list">' +
        '<div class="diff-item"><span class="diff-dot"></span><span>Explainable emotional patterns — every insight shows the numbers behind it, never a black-box score.</span></div>' +
        '<div class="diff-item"><span class="diff-dot"></span><span>Adaptive small steps that adjust to how you say you feel, right now.</span></div>' +
        '<div class="diff-item"><span class="diff-dot"></span><span>Campus-focused support for the situations students actually run into.</span></div>' +
        '<div class="diff-item"><span class="diff-dot"></span><span>Privacy-first by default — local storage, no hidden data sharing, clear controls.</span></div>' +
        '<div class="diff-item"><span class="diff-dot"></span><span>Progress without pressure — no streak-shaming, no competitive scores.</span></div>' +
      '</div>' +
      '<p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px;">This isn\u2019t a claim that other apps lack these things — just what All\u2019zWell 2.0 was built to prioritize.</p>' +
    '</div>' +
  '</div>'
);
NAV2.forEach(function(n){
  var b = document.querySelector('.nav-item[data-nav="'+n.id+'"]');
  if (b) return; // already inserted above; placeholder to keep intent obvious
});


/* ---- inject the My Emotional Patterns card into Insights, above the tag cloud ---- */
var tagCloudCardEl = document.getElementById("tagCloudCard");
if (tagCloudCardEl){
  var patternsCardEl = document.createElement("div");
  patternsCardEl.className = "card";
  patternsCardEl.id = "patternsCard";
  tagCloudCardEl.parentNode.insertBefore(patternsCardEl, tagCloudCardEl);
}

/* ---- journal guided-reflection prompts ---- */
var jBodyPromptsEl = document.getElementById("jBody");
if (jBodyPromptsEl){
  var promptRow = document.createElement("div");
  promptRow.className = "prompt-row";
  var JOURNAL_PROMPTS = ["What happened?", "What did I feel?", "What might I need?", "What's one small step I can take?"];
  JOURNAL_PROMPTS.forEach(function(q){
    var chip = document.createElement("button");
    chip.type = "button"; chip.className = "prompt-chip"; chip.textContent = q;
    chip.addEventListener("click", function(){
      var cur = jBodyPromptsEl.value;
      jBodyPromptsEl.value = cur + (cur && !/\n$/.test(cur) ? "\n\n" : "") + q + " ";
      jBodyPromptsEl.focus();
    });
    promptRow.appendChild(chip);
  });
  var aiNote = document.createElement("p");
  aiNote.className = "label-note";
  aiNote.style.display = "block"; aiNote.style.marginBottom = "10px";
  aiNote.textContent = "These prompts are static and built into the app — nothing you write is sent to any external AI service. All'zWell doesn't yet connect an AI service for journaling; if that changes, it will be optional and off by default.";
  jBodyPromptsEl.parentNode.insertBefore(aiNote, jBodyPromptsEl);
  jBodyPromptsEl.parentNode.insertBefore(promptRow, aiNote);
}

/* ---- Your Next Small Step: recommendation engine ---- */
var STEP_CONTEXTS = [
  { id:"overwhelmed", label:"Overwhelmed" },
  { id:"lonely", label:"Lonely" },
  { id:"anxious", label:"Anxious" },
  { id:"good", label:"Feeling good" },
  { id:"unsure", label:"Not sure" }
];
var STEP_LIBRARY = {
  overwhelmed:[
    { text:"Try a 2-minute breathing exercise", route:"breathe", cta:"Open Breathe" },
    { text:"Break your task into one small step — just the next one, not the whole list", route:"journal", cta:"Write it down" },
    { text:"Try a short grounding pause: notice 5 things you can see right now", route:null, cta:null }
  ],
  lonely:[
    { text:"Write a few lines about how today feels", route:"journal", cta:"Open Journal" },
    { text:"Explore a moderated peer-support circle", route:"community", cta:"Browse circles" },
    { text:"Think of one trusted person you could message today — no pressure to yet", route:null, cta:null }
  ],
  anxious:[
    { text:"A guided breathing pattern, even for 2 minutes", route:"breathe", cta:"Start breathing" },
    { text:"Try 5-4-3-2-1 grounding: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste", route:null, cta:null },
    { text:"Play a calming ambient sound while you take a short break", route:"sounds", cta:"Browse sounds" }
  ],
  good:[
    { text:"Note what helped today, so it's easy to find again later", route:"journal", cta:"Open Journal" },
    { text:"If a routine has been working, there's no pressure to change it", route:null, cta:null },
    { text:"However today goes next, that's okay too — this isn't a streak to protect", route:null, cta:null }
  ],
  unsure:[
    { text:"A two-minute breather can be a nice reset, any time", route:"breathe", cta:"Open Breathe" },
    { text:"Jot a quick line in your journal about right now", route:"journal", cta:"Open Journal" },
    { text:"Browse the community circles if you'd like a bit of company", route:"community", cta:"Browse circles" }
  ]
};
function guessStepContext(){
  var moods = load(KEY.moods, []);
  if (!moods.length) return "unsure";
  var latest = moods[0];
  if ((latest.tags||[]).indexOf("overwhelmed") > -1) return "overwhelmed";
  if ((latest.tags||[]).indexOf("anxious") > -1) return "anxious";
  if (latest.mood >= 4) return "good";
  if (latest.mood <= 2) return "overwhelmed";
  return "unsure";
}
var currentStepContext = null, currentStepIndex = 0;
function renderStepContexts(){
  var wrap = document.getElementById("stepContext");
  if (!wrap) return;
  if (currentStepContext === null) currentStepContext = guessStepContext();
  wrap.innerHTML = STEP_CONTEXTS.map(function(c){
    return '<button class="chip'+(c.id===currentStepContext?" sel":"")+'" data-ctx="'+c.id+'" type="button" style="cursor:pointer;">'+c.label+'</button>';
  }).join("");
  wrap.querySelectorAll("[data-ctx]").forEach(function(btn){
    btn.addEventListener("click", function(){
      currentStepContext = btn.dataset.ctx; currentStepIndex = 0;
      renderStepContexts(); renderStepCard();
    });
  });
}
function renderStepCard(target){
  var card = target || document.getElementById("stepCard");
  if (!card) return;
  if (currentStepContext === null) currentStepContext = guessStepContext();
  var list = STEP_LIBRARY[currentStepContext] || STEP_LIBRARY.unsure;
  var step = list[currentStepIndex % list.length];
  card.innerHTML =
    '<div class="step-eyebrow">Suggested for feeling ' + (STEP_CONTEXTS.filter(function(c){return c.id===currentStepContext;})[0]||{label:"unsure"}).label.toLowerCase() + '</div>' +
    '<div class="step-text">' + step.text + '</div>' +
    '<div class="step-sub">A suggestion, not an instruction — skip it if it\u2019s not right for you. This isn\u2019t medical advice.</div>' +
    '<div class="step-actions">' +
      (step.route ? '<button class="btn btn-sm" data-step-go="'+step.route+'">'+step.cta+'</button>' : '') +
      '<button class="btn btn-ghost btn-sm" data-step-next="1">Show another suggestion</button>' +
      '<button class="btn-danger-text" data-step-skip="1">Not useful right now</button>' +
    '</div>';
  var goBtn = card.querySelector("[data-step-go]");
  if (goBtn) goBtn.addEventListener("click", function(){ goTo(goBtn.dataset.stepGo); });
  card.querySelector("[data-step-next]").addEventListener("click", function(){
    currentStepIndex = (currentStepIndex + 1) % list.length;
    renderStepCard(card);
  });
  card.querySelector("[data-step-skip]").addEventListener("click", function(){
    var fb = load(KEY.stepFeedback, []);
    fb.unshift({ ts:Date.now(), context:currentStepContext, text:step.text, useful:false });
    save(KEY.stepFeedback, fb.slice(0,200));
    currentStepIndex = (currentStepIndex + 1) % list.length;
    toast("Got it — showing something else");
    renderStepCard(card);
  });
}
renderStepContexts();
renderStepCard();

/* Home preview widget for Next Small Step */
var homeHero = document.getElementById("view-home").querySelector(".home-hero");
if (homeHero){
  var stepPreview = document.createElement("div");
  stepPreview.className = "card step-card";
  stepPreview.id = "homeStepPreview";
  homeHero.parentNode.insertBefore(stepPreview, homeHero.nextSibling);
  renderStepCard(stepPreview);
}
/* Add Campus Life + Find Support quick links on Home */
var homeQuickGrid = document.querySelector("#view-home .quick-grid");
if (homeQuickGrid){
  homeQuickGrid.insertAdjacentHTML("beforeend",
    '<button class="link-card" data-nav="campus"><svg class="icon" viewBox="0 0 24 24"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/></svg><span>Campus Life<small>Exam stress, hostel life, homesickness</small></span></button>' +
    '<button class="link-card" data-nav="support"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/></svg><span>Find the right support<small>Self-help, peers, professionals, crisis</small></span></button>'
  );
}


/* ---- Campus Life ---- */
var CAMPUS_SITUATIONS = [
  { id:"academic", title:"Academic pressure", blurb:"Coursework piling up can make everything feel urgent at once.", actions:["Pick the single next task, not the whole list","Try a 2-minute breather before you start"], route:"breathe" },
  { id:"exam", title:"Examination stress", blurb:"Exam periods bring a specific kind of pressure — it's common, not a personal failing.", actions:["Break revision into short, timed blocks with real breaks","Write down what's worrying you, then what's actually in your control"], route:"journal" },
  { id:"hostel", title:"Hostel adjustment", blurb:"New routines, new people, new rules — adjusting takes time.", actions:["Give yourself a few weeks before judging how it's going","Note one small thing that's started to feel familiar"], route:"journal" },
  { id:"homesick", title:"Homesickness", blurb:"Missing home is a sign of attachment, not a problem to fix quickly.", actions:["Schedule a regular call with someone from home","Write about what you miss — it often loses some of its weight on the page"], route:"journal" },
  { id:"lonely", title:"Loneliness", blurb:"Loneliness on a busy campus is more common than it looks from outside.", actions:["Explore a moderated peer-support circle","Say yes to one small social thing this week"], route:"community" },
  { id:"socialanxiety", title:"Social anxiety", blurb:"Group settings can feel high-stakes even when nobody else is judging as hard as it feels.", actions:["Try 5-4-3-2-1 grounding before a group setting","Set one small, low-stakes goal — like one comment in a session"], route:"breathe" },
  { id:"routine", title:"Difficulty maintaining routines", blurb:"Routines slip — that's normal, not a streak you've broken.", actions:["Pick one anchor habit instead of rebuilding everything at once","Log it with a check-in when you do it, no pressure if you miss a day"], route:"checkin" },
  { id:"failure", title:"Fear of failure", blurb:"Fear of failure often says more about how much you care than about your actual odds.", actions:["Write down the worst realistic outcome, and what you'd do next","Separate the fear from the task — you can feel it and still start"], route:"journal" },
  { id:"balance", title:"Balancing projects, clubs, and academics", blurb:"Juggling everything at once is exhausting even when you're doing it well.", actions:["List commitments and mark which ones can flex this week","Protect one small block of unscheduled time"], route:"journal" },
  { id:"communication", title:"Communication confidence", blurb:"Confidence in conversation is a skill that builds with small reps, not a fixed trait.", actions:["Prepare one line to open a conversation you've been avoiding","Reflect afterward on what went better than expected"], route:"community" }
];
function renderCampusSituations(){
  var wrap = document.getElementById("campusSituations");
  if (!wrap) return;
  wrap.innerHTML = CAMPUS_SITUATIONS.map(function(s){
    return '<details class="accordion" data-sit="'+s.id+'">' +
      '<summary>'+s.title+'</summary>' +
      '<div class="accordion-body">' +
        '<p>'+s.blurb+'</p>' +
        '<ul>' + s.actions.map(function(a){ return '<li>'+a+'</li>'; }).join("") + '</ul>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">' +
          '<button class="btn btn-sm" data-campus-go="'+s.route+'">Open the right tool</button>' +
          '<div class="quick-moods" style="margin-top:0;">' + MOODS.map(function(m){
            return '<button class="mood-pill" style="color:'+m.color+';padding:6px 10px;font-size:12px;" data-campus-mood="'+s.id+':'+m.v+'"><span class="dot" style="background:'+m.color+'"></span>'+m.label+'</button>';
          }).join("") + '</div>' +
        '</div>' +
      '</div>' +
    '</details>';
  }).join("");
  wrap.querySelectorAll("[data-campus-go]").forEach(function(btn){
    btn.addEventListener("click", function(e){ e.preventDefault(); goTo(btn.dataset.campusGo); });
  });
  wrap.querySelectorAll("[data-campus-mood]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.preventDefault();
      var parts = btn.dataset.campusMood.split(":");
      var sitId = parts[0], val = parseInt(parts[1], 10);
      var moods = load(KEY.moods, []);
      moods.unshift({ id:uid(), ts:Date.now(), mood:val, note:"", tags:["campus", sitId] });
      save(KEY.moods, moods);
      var checks = load(KEY.campusChecks, []);
      checks.unshift({ id:uid(), ts:Date.now(), situation:sitId, mood:val });
      save(KEY.campusChecks, checks);
      applyMoodTint(); renderStreak();
      toast("Logged — thanks for checking in");
    });
  });
}
var campusNameInputEl = document.getElementById("campusNameInput");
if (campusNameInputEl){
  campusNameInputEl.value = load(KEY.campus, "");
  document.getElementById("campusNameSave").addEventListener("click", function(){
    save(KEY.campus, campusNameInputEl.value.trim());
    toast("Saved — stored only on this device");
  });
}
var campusContactInputEl = document.getElementById("campusContactInput");
if (campusContactInputEl){
  campusContactInputEl.value = load(KEY.campusContact, "");
  document.getElementById("campusContactSave").addEventListener("click", function(){
    save(KEY.campusContact, campusContactInputEl.value.trim());
    toast("Saved locally — never sent anywhere");
  });
}
renderCampusSituations();

/* ---- Find the Right Support ---- */
var COUNSELLOR_DIRECTORY = [
  { name:"Example Counsellor A", meta:"Generalist • English, Hindi • Illustrative profile" },
  { name:"Example Counsellor B", meta:"Anxiety & academic stress • English, Tamil • Illustrative profile" },
  { name:"Example Counsellor C", meta:"Student wellbeing • English • Illustrative profile" }
];
function renderSupportTiers(){
  var wrap = document.getElementById("supportTiers");
  if (!wrap) return;
  wrap.innerHTML =
    '<div class="support-tier"><div class="support-tier-head"><span class="support-tier-num">1</span><h3 style="font-size:14.5px;">Self-guided wellness tools</h3></div>' +
      '<p style="font-size:13px;color:var(--ink-soft);">Breathing, journaling and sounds — for day-to-day support you can use any time.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;"><button class="btn btn-ghost btn-sm" data-nav="breathe">Breathe</button><button class="btn btn-ghost btn-sm" data-nav="journal">Journal</button><button class="btn btn-ghost btn-sm" data-nav="sounds">Sounds</button></div>' +
    '</div>' +
    '<div class="support-tier"><div class="support-tier-head"><span class="support-tier-num">2</span><h3 style="font-size:14.5px;">Peer support</h3></div>' +
      '<p style="font-size:13px;color:var(--ink-soft);">Moderated topic circles — for feeling less alone in what you\u2019re going through.</p>' +
      '<button class="btn btn-ghost btn-sm" data-nav="community" style="margin-top:8px;">Browse circles</button>' +
    '</div>' +
    '<div class="support-tier"><div class="support-tier-head"><span class="support-tier-num">3</span><h3 style="font-size:14.5px;">Professional counselling</h3></div>' +
      '<p class="label-note">Prototype directory — illustrative profiles, not real counsellors, and no real appointment availability.</p>' +
      COUNSELLOR_DIRECTORY.map(function(c){
        return '<div class="directory-card"><div class="directory-name">'+c.name+'</div><div class="directory-meta">'+c.meta+'</div>' +
          '<button class="btn btn-ghost btn-sm" style="margin-top:8px;" data-request-appt="1">Request appointment (prototype)</button></div>';
      }).join("") +
    '</div>' +
    '<div class="support-tier" style="border-bottom:none;"><div class="support-tier-head"><span class="support-tier-num" style="background:var(--danger-soft);color:var(--danger);">4</span><h3 style="font-size:14.5px;color:var(--danger);">Crisis support</h3></div>' +
      '<p style="font-size:13px;color:var(--ink-soft);">If you\u2019re in crisis or in danger, this is always available — no consent or setup needed.</p>' +
      '<button class="btn btn-sm" style="background:var(--danger);margin-top:8px;" data-nav="safety">View crisis resources</button>' +
    '</div>';
  wrap.querySelectorAll("[data-request-appt]").forEach(function(btn){
    btn.addEventListener("click", function(){
      toast("This is a prototype — no real appointment was booked. A live scheduling connection would be a next production step.");
    });
  });
}
renderSupportTiers();

var supportConsentToggleEl = document.getElementById("supportConsentToggle");
var genSummaryBtnEl = document.getElementById("genSummaryBtn");
var summaryOutputEl = document.getElementById("summaryOutput");
if (supportConsentToggleEl){
  supportConsentToggleEl.checked = !!load(KEY.supportConsent, false);
  genSummaryBtnEl.style.display = supportConsentToggleEl.checked ? "" : "none";
  supportConsentToggleEl.addEventListener("change", function(){
    save(KEY.supportConsent, supportConsentToggleEl.checked);
    genSummaryBtnEl.style.display = supportConsentToggleEl.checked ? "" : "none";
    if (!supportConsentToggleEl.checked) summaryOutputEl.style.display = "none";
  });
  genSummaryBtnEl.addEventListener("click", function(){
    var moods = load(KEY.moods, []);
    var journal = load(KEY.journal, []);
    var last30 = moods.filter(function(e){ return Date.now() - e.ts < 30*24*3600*1000; });
    var avg = last30.length ? (last30.reduce(function(s,e){return s+e.mood;},0)/last30.length).toFixed(1) : "n/a";
    var tagCounts = {};
    last30.forEach(function(e){ (e.tags||[]).forEach(function(t){ tagCounts[t]=(tagCounts[t]||0)+1; }); });
    var topTags = Object.keys(tagCounts).sort(function(a,b){return tagCounts[b]-tagCounts[a];}).slice(0,5);
    var text = "All'zWell self-summary (generated locally on " + new Date().toLocaleDateString() + ")\n\n" +
      "Check-ins in last 30 days: " + last30.length + "\n" +
      "Average mood (1-5 scale): " + avg + "\n" +
      "Journal entries (all time): " + journal.length + "\n" +
      "Frequently tagged in the last 30 days: " + (topTags.length ? topTags.join(", ") : "none yet") + "\n\n" +
      "This is a plain summary of self-reported check-ins, not a clinical assessment. Nothing here was diagnosed or predicted by the app.";
    summaryOutputEl.value = text;
    summaryOutputEl.style.display = "";
    toast("Summary generated locally — nothing was sent anywhere");
  });
}


/* ---- Privacy Control Center — extends the existing Settings modal ---- */
var settingsModalEl = document.querySelector("#settingsBackdrop .modal");
if (settingsModalEl){
  var privacyBlock = document.createElement("div");
  privacyBlock.innerHTML =
    '<hr class="modal-divider">' +
    '<div class="modal-row"><span class="field-label">Privacy &amp; data</span>' +
      '<p style="font-size:12px;color:var(--ink-soft);line-height:1.6;">All\u2019zWell 2.0 has no backend and no analytics — everything below lives only in this browser\u2019s local storage. It is <b>not encrypted</b>; treat it like any other file on this device, and avoid using All\u2019zWell on a shared or public computer if you want this to stay private.</p>' +
      '<p id="dataStoredSummary" style="font-size:12px;color:var(--ink-faint);margin-top:8px;"></p>' +
    '</div>' +
    '<div class="modal-row">' +
      '<div class="toggle-row"><div><span class="field-label" style="margin-bottom:0;">Track presence &amp; streaks</span><p>Turns off the streak pill and the 30-day presence view. Your check-ins still save either way.</p></div>' +
        '<label class="switch"><input type="checkbox" id="trackingToggle"><span class="switch-track"></span></label></div>' +
    '</div>' +
    '<div class="modal-row">' +
      '<span class="field-label">AI features</span>' +
      '<p style="font-size:12px;color:var(--ink-soft);line-height:1.6;">This build does not send journal or check-in content to any external AI service. Journal prompts are static and built in. If AI-assisted features are added later, they will be optional and off until you explicitly turn them on here.</p>' +
    '</div>' +
    '<div class="modal-row">' +
      '<span class="field-label">Community</span>' +
      '<p style="font-size:12px;color:var(--ink-soft);">Circle notes are private to this device. <span id="mutedCirclesSummary"></span></p>' +
    '</div>' +
    '<div class="modal-row">' +
      '<span class="field-label">Delete specific data</span>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button id="deleteJournalBtn" class="btn btn-ghost btn-sm">Delete journal entries</button>' +
        '<button id="resetProfileBtn" class="btn btn-ghost btn-sm">Reset profile name</button>' +
      '</div>' +
    '</div>';
  var dangerRow = settingsModalEl.querySelector(".danger-zone-label").closest(".modal-row");
  settingsModalEl.insertBefore(privacyBlock, dangerRow);

  function refreshPrivacySummary(){
    var moods = load(KEY.moods, []), journal = load(KEY.journal, []), notesAll = load(KEY.notes, {});
    var noteCount = 0; Object.keys(notesAll).forEach(function(k){ noteCount += notesAll[k].length; });
    document.getElementById("dataStoredSummary").textContent =
      "Stored locally: " + moods.length + " check-ins, " + journal.length + " journal entries, " + noteCount + " circle notes.";
    var muted = load(KEY.mutedCircles, []);
    document.getElementById("mutedCirclesSummary").textContent =
      muted.length ? (muted.length + " circle(s) muted.") : "No circles muted.";
  }
  refreshPrivacySummary();
  document.getElementById("openSettings").addEventListener("click", refreshPrivacySummary);
  document.getElementById("openSettingsMobile").addEventListener("click", refreshPrivacySummary);

  var trackingToggleEl = document.getElementById("trackingToggle");
  trackingToggleEl.checked = !load(KEY.trackingOff, false);
  document.body.classList.toggle("azw-no-tracking", !trackingToggleEl.checked);
  trackingToggleEl.addEventListener("change", function(){
    save(KEY.trackingOff, !trackingToggleEl.checked);
    document.body.classList.toggle("azw-no-tracking", !trackingToggleEl.checked);
  });

  document.getElementById("deleteJournalBtn").addEventListener("click", function(){
    if (!confirm("Delete all journal entries? This can't be undone.")) return;
    save(KEY.journal, []);
    renderJournalList(); renderHomeJournal();
    refreshPrivacySummary();
    toast("Journal entries deleted");
  });
  document.getElementById("resetProfileBtn").addEventListener("click", function(){
    save(KEY.name, "");
    settingsName.value = "";
    renderGreeting();
    toast("Profile name reset");
  });
}

/* ---- init calls for the new 2.0 views ---- */
renderInsights();


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
applyMoodTint();

})();

