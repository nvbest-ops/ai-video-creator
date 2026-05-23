import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const HTML = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NOVA — AI Video Creator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#07070f;--surface:#10101a;--card:#16161f;--card2:#1c1c28;
  --border:#252535;--border2:#2f2f45;
  --accent:#7c3aed;--accent2:#a855f7;--accent3:#c084fc;--accentglow:rgba(124,58,237,0.35);
  --text:#eeeef8;--muted:#7777aa;--muted2:#555577;
  --green:#22c55e;--red:#ef4444;--orange:#f59e0b;--blue:#3b82f6;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}

/* ── HEADER ── */
header{
  background:rgba(7,7,15,0.85);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
  padding:0 32px;height:60px;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:200;
}
.logo{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:900;letter-spacing:-0.5px;text-decoration:none;color:var(--text)}
.logo-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.logo-name{background:linear-gradient(135deg,#c084fc,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header-right{display:flex;align-items:center;gap:10px}
.badge{background:linear-gradient(135deg,rgba(124,58,237,.18),rgba(168,85,247,.18));border:1px solid rgba(168,85,247,.3);color:var(--accent3);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.new-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;border-radius:8px;padding:7px 16px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px}
.new-btn:hover{box-shadow:0 4px 20px var(--accentglow);transform:translateY(-1px)}

/* ── LAYOUT ── */
.app{display:flex;min-height:calc(100vh - 60px)}

/* ── SIDEBAR ── */
.sidebar{
  width:260px;min-width:260px;background:var(--surface);
  border-right:1px solid var(--border);
  padding:20px 12px;display:flex;flex-direction:column;gap:6px;
  overflow-y:auto;max-height:calc(100vh - 60px);position:sticky;top:60px;
}
.sidebar-title{font-size:10px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:1px;padding:4px 10px;margin-bottom:4px}
.proj-item{
  padding:10px 12px;border-radius:10px;cursor:pointer;
  border:1px solid transparent;transition:all .15s;
}
.proj-item:hover{background:var(--card);border-color:var(--border)}
.proj-item.active{background:rgba(124,58,237,.12);border-color:rgba(168,85,247,.35)}
.proj-item-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.proj-item-meta{font-size:11px;color:var(--muted);display:flex;gap:8px;align-items:center}
.dot{width:3px;height:3px;background:var(--muted2);border-radius:50%;flex-shrink:0}
.sidebar-empty{padding:16px 12px;font-size:13px;color:var(--muted);text-align:center;line-height:1.6}

/* ── MAIN ── */
.main{flex:1;padding:32px;overflow-y:auto;max-width:1000px}

/* ── VIEWS ── */
.view{display:none}.view.active{display:block}

/* ── HOME VIEW ── */
.home-hero{text-align:center;padding:40px 0 48px}
.home-hero h1{
  font-size:52px;font-weight:900;letter-spacing:-2px;line-height:1.08;margin-bottom:14px;
  background:linear-gradient(135deg,#eeeef8 0%,#c084fc 55%,#a855f7 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent
}
.home-hero p{color:var(--muted);font-size:16px;margin-bottom:36px}
.tech-pills{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:48px}
.tech-pill{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:5px}

/* ── CREATE CARD ── */
.create-card{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:28px;margin-bottom:24px}
.create-card h2{font-size:18px;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:8px}

.input-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:7px;display:block}

textarea.prompt{
  width:100%;background:var(--surface);border:1.5px solid var(--border2);
  border-radius:12px;padding:14px 18px;color:var(--text);
  font-size:15px;font-family:'Inter',sans-serif;resize:none;outline:none;
  transition:border-color .2s;min-height:90px;line-height:1.6
}
textarea.prompt:focus{border-color:var(--accent2)}
textarea.prompt::placeholder{color:var(--muted2)}

.options-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:18px}
@media(max-width:700px){.options-grid{grid-template-columns:1fr 1fr}}

select{
  width:100%;background:var(--surface);border:1.5px solid var(--border2);
  border-radius:10px;color:var(--text);padding:10px 14px;
  font-size:13px;font-family:'Inter',sans-serif;outline:none;cursor:pointer;
  transition:border-color .2s;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237777aa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;padding-right:32px
}
select:focus{border-color:var(--accent2)}

.toggles-row{display:flex;gap:20px;margin-top:18px;flex-wrap:wrap}
.toggle-label{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--muted);user-select:none}
.toggle-label input{accent-color:var(--accent2);width:15px;height:15px;cursor:pointer}
.toggle-label:hover{color:var(--text)}

.error-msg{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#fca5a5;padding:11px 16px;border-radius:10px;font-size:13px;margin-top:16px;display:none}

.gen-btn{
  width:100%;margin-top:20px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#fff;border:none;border-radius:13px;
  padding:15px 28px;font-size:16px;font-weight:800;
  cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:9px;
  letter-spacing:-.3px
}
.gen-btn:hover:not(:disabled){box-shadow:0 8px 32px var(--accentglow);transform:translateY(-2px)}
.gen-btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* ── PROGRESS ── */
.progress-wrap{background:var(--card);border:1px solid rgba(168,85,247,.3);border-radius:20px;padding:24px;margin-bottom:24px;display:none}
.progress-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.progress-label{font-size:15px;font-weight:700;display:flex;align-items:center;gap:9px}
.pct{font-size:14px;color:var(--muted);font-weight:600;font-variant-numeric:tabular-nums}
.progress-track{background:var(--surface);border-radius:10px;height:7px;overflow:hidden;margin-bottom:16px}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));border-radius:10px;transition:width .5s ease;width:0%}
.steps{display:flex;gap:8px;flex-wrap:wrap}
.step{padding:4px 13px;border-radius:20px;font-size:12px;font-weight:700;background:var(--surface);border:1px solid var(--border);color:var(--muted2);transition:all .3s}
.step.on{background:rgba(168,85,247,.14);border-color:rgba(168,85,247,.4);color:var(--accent3)}
.step.done{background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.4);color:var(--green)}

/* ── SPINNER ── */
.spin{width:16px;height:16px;border:2px solid rgba(168,85,247,.3);border-top-color:var(--accent2);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── PROJECT VIEW ── */
.project-view-header{margin-bottom:28px}
.project-view-title{font-size:30px;font-weight:900;letter-spacing:-1px;margin-bottom:8px}
.project-view-meta{color:var(--muted);font-size:13px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.meta-tag{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:3px 10px;font-size:12px;font-weight:600;color:var(--muted);text-transform:capitalize}
.status-tag{padding:3px 10px;border-radius:8px;font-size:12px;font-weight:700}
.s-draft{background:rgba(100,100,140,.18);color:var(--muted)}
.s-generating{background:rgba(168,85,247,.15);color:var(--accent3)}
.s-ready{background:rgba(34,197,94,.12);color:var(--green)}
.s-failed{background:rgba(239,68,68,.12);color:var(--red)}

/* ── SCRIPT BOX ── */
.script-box{background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:20px 24px;margin-bottom:24px}
.section-head{font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;color:var(--muted)}
.script-text{font-size:15px;line-height:1.85;color:var(--text);font-style:italic}

/* ── ACTION BAR ── */
.action-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px}
.btn{padding:9px 18px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-outline{background:transparent;border:1.5px solid var(--border2);color:var(--text)}
.btn-outline:hover{border-color:var(--accent2);color:var(--accent3)}
.btn-danger{background:transparent;border:1.5px solid rgba(239,68,68,.3);color:#fca5a5}
.btn-danger:hover{background:rgba(239,68,68,.1)}
.btn:disabled{opacity:.4;cursor:not-allowed}

/* ── SCENES GRID ── */
.scenes-label{font-size:14px;font-weight:700;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.scenes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:40px}

.scene-card{background:var(--card);border:1px solid var(--border);border-radius:15px;overflow:hidden;transition:all .2s}
.scene-card:hover{border-color:rgba(168,85,247,.35);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}

.scene-img-wrap{position:relative;width:100%;background:var(--surface);overflow:hidden}
.scene-img-wrap.r169{aspect-ratio:16/9}
.scene-img-wrap.r916{aspect-ratio:9/16;max-height:220px}
.scene-img-wrap.r11{aspect-ratio:1/1}

.scene-img{width:100%;height:100%;object-fit:cover;display:none;transition:opacity .4s}
.scene-img.loaded{display:block}

.scene-placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--muted2);font-size:12px}
.scene-placeholder svg{opacity:.4}

.scene-gen-overlay{position:absolute;inset:0;background:rgba(7,7,15,.75);display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:var(--accent3);font-size:12px;font-weight:600}
.scene-gen-overlay.show{display:flex}

.scene-body{padding:13px 15px}
.scene-num-badge{font-size:10px;font-weight:800;color:var(--accent3);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px}
.scene-desc{font-size:12px;color:var(--muted);line-height:1.55;margin-bottom:10px}
.scene-narration{font-size:13px;font-weight:500;color:var(--text);line-height:1.6;padding:9px 12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent2);font-style:italic;margin-bottom:10px}
.scene-footer{display:flex;align-items:center;justify-content:space-between}
.scene-dur{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:4px}
.scene-status{font-size:10px;font-weight:800;padding:3px 8px;border-radius:8px;text-transform:uppercase;letter-spacing:.5px}
.ss-pending{background:rgba(100,100,130,.18);color:var(--muted)}
.ss-generating{background:rgba(168,85,247,.15);color:var(--accent3)}
.ss-ready{background:rgba(34,197,94,.12);color:var(--green)}
.ss-failed{background:rgba(239,68,68,.12);color:var(--red)}

audio.scene-audio{width:100%;height:28px;margin-top:8px;display:none}
audio.scene-audio.show{display:block}

/* ── EMPTY STATE ── */
.empty-state{text-align:center;padding:60px 20px;color:var(--muted)}
.empty-state-icon{font-size:56px;margin-bottom:16px;opacity:.6}
.empty-state h3{font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text)}
.empty-state p{font-size:14px;line-height:1.6}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px}

/* ── MOBILE ── */
@media(max-width:768px){
  .sidebar{display:none}
  .main{padding:20px 16px}
  .home-hero h1{font-size:34px}
  header{padding:0 16px}
}
</style>
</head>
<body>

<header>
  <a class="logo" href="#" onclick="showView('home');return false">
    <div class="logo-icon">🎬</div>
    <span class="logo-name">NOVA</span>
  </a>
  <div class="header-right">
    <div class="badge">AI Video Creator</div>
    <button class="new-btn" onclick="showView('home')">＋ New Video</button>
  </div>
</header>

<div class="app">

  <!-- SIDEBAR -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-title">Recent Projects</div>
    <div id="sidebarList">
      <div class="sidebar-empty">Your projects will appear here once you create your first video.</div>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main">

    <!-- ══ HOME VIEW ══ -->
    <div class="view active" id="view-home">
      <div class="home-hero">
        <h1>Turn any idea into<br>a 60-second video</h1>
        <p>Powered by NOVA — your AI Video Content Director</p>
        <div class="tech-pills">
          <div class="tech-pill">🧠 GPT-4o Script</div>
          <div class="tech-pill">🖼 DALL-E Images</div>
          <div class="tech-pill">🎙 ElevenLabs Voice</div>
          <div class="tech-pill">🎬 8 Scenes · 60s</div>
        </div>
      </div>

      <div class="create-card">
        <h2>🚀 Create Your Video</h2>

        <label class="input-label">Your video idea</label>
        <textarea class="prompt" id="promptInput" rows="3"
          placeholder="e.g. 'Why everyone should start investing in their 20s' · 'A luxury skincare brand launch' · 'The future of AI in healthcare'"></textarea>

        <div class="options-grid">
          <div>
            <label class="input-label">Style</label>
            <select id="styleSelect">
              <option value="cinematic">🎥 Cinematic</option>
              <option value="social" selected>📱 Social Media</option>
              <option value="commercial">💼 Commercial</option>
              <option value="documentary">🎞 Documentary</option>
              <option value="animated">✨ Animated</option>
              <option value="explainer">📚 Explainer</option>
            </select>
          </div>
          <div>
            <label class="input-label">Aspect Ratio</label>
            <select id="aspectSelect">
              <option value="9:16" selected>📱 9:16 Vertical</option>
              <option value="16:9">📺 16:9 Landscape</option>
              <option value="1:1">⬜ 1:1 Square</option>
            </select>
          </div>
          <div>
            <label class="input-label">Voice</label>
            <select id="voiceSelect">
              <option value="21m00Tcm4TlvDq8ikWAM">Rachel — Natural</option>
              <option value="AZnzlk1XvdvUeBnXmlld">Domi — Energetic</option>
              <option value="EXAVITQu4vr4xnSDxMaL">Bella — Warm</option>
              <option value="ErXwobaYiN019PkySvjV">Antoni — Deep</option>
              <option value="VR6AewLTigWG4xSOukaG">Arnold — Powerful</option>
            </select>
          </div>
        </div>

        <div class="toggles-row">
          <label class="toggle-label"><input type="checkbox" id="voiceCheck" checked> 🎙 AI Voiceover</label>
          <label class="toggle-label"><input type="checkbox" id="imgCheck" checked> 🖼 Scene Images</label>
        </div>

        <div class="error-msg" id="errMsg"></div>

        <button class="gen-btn" id="genBtn" onclick="startGeneration()">
          <span>⚡</span> Generate 60-Second Video
        </button>
      </div>

      <!-- PROGRESS (shows here during generation) -->
      <div class="progress-wrap" id="progressWrap">
        <div class="progress-top">
          <div class="progress-label"><div class="spin"></div><span id="progressLabel">Starting...</span></div>
          <div class="pct" id="progressPct">0%</div>
        </div>
        <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
        <div class="steps">
          <div class="step" id="st-script">✍️ Script</div>
          <div class="step" id="st-images">🖼 Images</div>
          <div class="step" id="st-voice">🎙 Voiceover</div>
          <div class="step" id="st-done">✅ Done</div>
        </div>
      </div>
    </div>

    <!-- ══ PROJECT VIEW ══ -->
    <div class="view" id="view-project">
      <div class="project-view-header">
        <div class="project-view-title" id="pvTitle">Untitled Project</div>
        <div class="project-view-meta" id="pvMeta"></div>
      </div>

      <div class="script-box" id="pvScriptBox" style="display:none">
        <div class="section-head">📝 Full Script</div>
        <div class="script-text" id="pvScript"></div>
      </div>

      <div class="action-bar" id="pvActions" style="display:none">
        <button class="btn btn-outline" id="reImgBtn" onclick="regenImages()">🖼 Regenerate Images</button>
        <button class="btn btn-outline" id="reVoiceBtn" onclick="regenVoice()">🎙 Regenerate Voiceover</button>
        <button class="btn btn-danger" onclick="deleteProject()">🗑 Delete</button>
      </div>

      <div class="scenes-label" id="pvScenesLabel" style="display:none">🎬 Scenes <span style="color:var(--muted2);font-weight:400;font-size:13px;">(8 scenes · 60 seconds)</span></div>
      <div class="scenes-grid" id="pvScenesGrid"></div>
    </div>

  </main>
</div>

<script>
const BASE = window.location.origin + '/api/functions';
let pid = null; // current project id
let curAspect = '9:16';

// ── helpers ──────────────────────────────────────────────
async function api(fn, body={}) {
  const r = await fetch(BASE+'/'+fn, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r.json();
}

function setProgress(pct, label) {
  document.getElementById('progressFill').style.width = pct+'%';
  document.getElementById('progressPct').textContent = pct+'%';
  document.getElementById('progressLabel').textContent = label;
}

function stepOn(id){ document.getElementById('st-'+id).className='step on'; }
function stepDone(id){ document.getElementById('st-'+id).className='step done'; }

function showErr(msg){ const e=document.getElementById('errMsg'); e.textContent='⚠️ '+msg; e.style.display='block'; }
function hideErr(){ document.getElementById('errMsg').style.display='none'; }

function showView(v) {
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
}

function aspectClass(ar) {
  if(ar==='9:16') return 'r916';
  if(ar==='1:1') return 'r11';
  return 'r169';
}

// ── LOAD SIDEBAR ─────────────────────────────────────────
async function loadSidebar() {
  const r = await api('videoApi', {_action:'listProjects'});
  const list = document.getElementById('sidebarList');
  if(!r.projects || r.projects.length===0) {
    list.innerHTML = '<div class="sidebar-empty">Your projects will appear here.</div>';
    return;
  }
  list.innerHTML = r.projects.map(p => {
    const sc = p.status==='ready'?'s-ready':p.status==='generating'?'s-generating':p.status==='failed'?'s-failed':'s-draft';
    return '<div class="proj-item" id="si-'+p.id+'" onclick="openProject(\''+p.id+'\')">'
      +'<div class="proj-item-title">'+(p.title||'Untitled')+'</div>'
      +'<div class="proj-item-meta">'
      +'<span class="status-tag '+sc+'">'+(p.status||'draft')+'</span>'
      +'<span class="dot"></span>'
      +'<span>'+(p.style||'cinematic')+'</span>'
      +'</div></div>';
  }).join('');
}

// ── OPEN PROJECT ─────────────────────────────────────────
async function openProject(id) {
  pid = id;
  document.querySelectorAll('.proj-item').forEach(el=>el.classList.remove('active'));
  const si = document.getElementById('si-'+id);
  if(si) si.classList.add('active');

  const r = await api('videoApi', {_action:'getProject', project_id:id});
  if(!r.project) return;
  const p = r.project;
  curAspect = p.aspect_ratio||'9:16';

  document.getElementById('pvTitle').textContent = p.title||'Untitled Project';

  const sc = p.status==='ready'?'s-ready':p.status==='generating'?'s-generating':p.status==='failed'?'s-failed':'s-draft';
  document.getElementById('pvMeta').innerHTML =
    '<span class="meta-tag">'+( p.style||'cinematic')+'</span>'
    +'<span class="meta-tag">'+(p.aspect_ratio||'9:16')+'</span>'
    +'<span class="meta-tag">60 seconds</span>'
    +'<span class="status-tag '+sc+'">'+(p.status||'draft')+'</span>';

  if(p.script){ document.getElementById('pvScript').textContent=p.script; document.getElementById('pvScriptBox').style.display='block'; }
  document.getElementById('pvActions').style.display='flex';
  document.getElementById('pvScenesLabel').style.display='flex';

  showView('project');

  // Load scenes
  const sr = await api('videoApi', {_action:'getScenes', project_id:id});
  const scenes = (sr.scenes||[]).sort((a,b)=>a.scene_number-b.scene_number);
  renderScenes(scenes, curAspect);
}

function renderScenes(scenes, ar) {
  const grid = document.getElementById('pvScenesGrid');
  const ac = aspectClass(ar);
  grid.innerHTML = scenes.map((s,i)=>{
    const ssClass = 'ss-'+(s.status||'pending');
    return '<div class="scene-card" id="sc-'+i+'">'
      +'<div class="scene-img-wrap '+ac+'">'
        +'<div class="scene-placeholder" id="sp-'+i+'">'
          +'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'
          +'<span>Scene '+s.scene_number+'</span>'
        +'</div>'
        +(s.image_url?'<img class="scene-img loaded" id="si-'+i+'" src="'+s.image_url+'" alt="">'
          :'<img class="scene-img" id="si-'+i+'" src="" alt="" onload="this.classList.add(\'loaded\');document.getElementById(\'sp-'+i+'\').style.display=\'none\'">')
        +'<div class="scene-gen-overlay" id="sg-'+i+'"><div class="spin"></div><span>Generating…</span></div>'
      +'</div>'
      +'<div class="scene-body">'
        +'<div class="scene-num-badge">Scene '+s.scene_number+' · '+(s.duration_seconds||7)+'s</div>'
        +'<div class="scene-desc">'+(s.description||'')+'</div>'
        +'<div class="scene-narration">"'+(s.narration||'')+'"</div>'
        +'<div class="scene-footer">'
          +'<div class="scene-dur">⏱ '+(s.duration_seconds||7)+'s</div>'
          +'<div class="scene-status '+ssClass+'" id="ss-'+i+'">'+(s.status||'pending')+'</div>'
        +'</div>'
        +'<audio class="scene-audio'+(s.audio_url?' show':'')+'\" id="sa-'+i+'" controls'+(s.audio_url?' src="'+s.audio_url+'"':'')+'></audio>'
      +'</div>'
    +'</div>';
  }).join('');
}

function updateSceneImg(i, url, status) {
  const img = document.getElementById('si-'+i);
  const ph = document.getElementById('sp-'+i);
  const gen = document.getElementById('sg-'+i);
  const st = document.getElementById('ss-'+i);
  if(gen) gen.className='scene-gen-overlay'+(status==='generating'?' show':'');
  if(st){ st.className='scene-status ss-'+status; st.textContent=status; }
  if(url && img){ img.src=url; img.classList.add('loaded'); if(ph) ph.style.display='none'; }
}

function updateSceneAudio(i, url) {
  const a = document.getElementById('sa-'+i);
  if(a){ a.src=url; a.classList.add('show'); }
}

// ── GENERATE ─────────────────────────────────────────────
async function startGeneration() {
  const prompt = document.getElementById('promptInput').value.trim();
  if(!prompt){ showErr('Please enter a video prompt!'); return; }
  hideErr();

  const style   = document.getElementById('styleSelect').value;
  const aspect  = document.getElementById('aspectSelect').value;
  const voice   = document.getElementById('voiceSelect').value;
  const doVoice = document.getElementById('voiceCheck').checked;
  const doImgs  = document.getElementById('imgCheck').checked;
  curAspect = aspect;

  document.getElementById('genBtn').disabled=true;
  document.getElementById('progressWrap').style.display='block';
  setProgress(3,'Creating project…');
  stepOn('script');

  // 1. Create project
  const cr = await api('videoApi', {_action:'createProject', prompt, style, aspect_ratio:aspect, voiceover_enabled:doVoice, voice_id:voice});
  if(!cr.success){ showErr(cr.error||'Failed to create project'); document.getElementById('genBtn').disabled=false; return; }
  pid = cr.id;

  setProgress(8,'NOVA is writing your script…');

  // 2. Generate script
  const sr = await api('generateVideoScript', {prompt, style, aspect_ratio:aspect, project_id:pid});
  if(!sr.success){ showErr(sr.error||'Script generation failed'); document.getElementById('genBtn').disabled=false; return; }

  stepDone('script'); stepOn('images');
  setProgress(28,'Script ready! Building scenes…');

  const script = sr.script;

  // Transition to project view with placeholder scenes
  document.getElementById('pvTitle').textContent = script.title;
  document.getElementById('pvMeta').innerHTML =
    '<span class="meta-tag">'+style+'</span>'
    +'<span class="meta-tag">'+aspect+'</span>'
    +'<span class="meta-tag">60 seconds</span>'
    +'<span class="status-tag s-generating">generating</span>';
  document.getElementById('pvScript').textContent = script.full_script;
  document.getElementById('pvScriptBox').style.display='block';
  document.getElementById('pvActions').style.display='flex';
  document.getElementById('pvScenesLabel').style.display='flex';
  showView('project');

  // Render placeholders
  const placeholderScenes = script.scenes.map(s=>({...s, image_url:null, audio_url:null, status:'pending'}));
  renderScenes(placeholderScenes, aspect);

  // 3. Fetch saved scene IDs
  await new Promise(r=>setTimeout(r,800));
  const scr = await api('videoApi', {_action:'getScenes', project_id:pid});
  const sceneRecords = (scr.scenes||[]).sort((a,b)=>a.scene_number-b.scene_number);

  if(doImgs) {
    setProgress(30,'Generating scene images…');
    const imgPromises = sceneRecords.map((rec,i)=>{
      updateSceneImg(i,null,'generating');
      return api('generateSceneImage',{
        scene_id:rec.id,
        visual_prompt:script.scenes[i]?.visual_prompt||rec.visual_prompt,
        style, aspect_ratio:aspect
      }).then(res=>{
        if(res.success && res.image_url){ updateSceneImg(i,res.image_url,'ready'); }
        else { updateSceneImg(i,null,'failed'); }
        const done = document.querySelectorAll('.scene-status.ss-ready').length;
        setProgress(30+Math.round((done/8)*40),'Generating images… ('+done+'/8)');
      });
    });
    await Promise.all(imgPromises);
    stepDone('images');
  } else {
    stepDone('images');
  }

  setProgress(72,'Images done!');

  if(doVoice) {
    stepOn('voice');
    setProgress(73,'Generating AI voiceover…');
    for(let i=0;i<sceneRecords.length;i++){
      const rec = sceneRecords[i];
      const res = await api('generateVoiceover',{
        scene_id:rec.id,
        narration:script.scenes[i]?.narration||rec.narration,
        voice_id:voice
      });
      if(res.success && res.audio_url) updateSceneAudio(i,res.audio_url);
      setProgress(73+Math.round(((i+1)/8)*23),'Voiceover '+(i+1)+'/8…');
    }
    stepDone('voice');
  } else {
    stepDone('voice');
  }

  stepDone('done');
  setProgress(100,'🎉 Your video is ready!');
  document.getElementById('genBtn').disabled=false;
  document.getElementById('progressWrap').style.display='none';

  // Update status + meta
  await api('videoApi',{_action:'updateProjectStatus',project_id:pid,status:'ready'});
  document.getElementById('pvMeta').innerHTML =
    '<span class="meta-tag">'+style+'</span>'
    +'<span class="meta-tag">'+aspect+'</span>'
    +'<span class="meta-tag">60 seconds</span>'
    +'<span class="status-tag s-ready">ready</span>';

  loadSidebar();
}

// ── REGEN ─────────────────────────────────────────────────
async function regenImages(){
  if(!pid) return;
  document.getElementById('reImgBtn').disabled=true;
  const style = document.getElementById('styleSelect').value;
  const sr = await api('videoApi',{_action:'getScenes',project_id:pid});
  const scenes = (sr.scenes||[]).sort((a,b)=>a.scene_number-b.scene_number);
  for(let i=0;i<scenes.length;i++){
    updateSceneImg(i,null,'generating');
    const res = await api('generateSceneImage',{scene_id:scenes[i].id,visual_prompt:scenes[i].visual_prompt,style,aspect_ratio:curAspect});
    if(res.success && res.image_url) updateSceneImg(i,res.image_url,'ready');
    else updateSceneImg(i,null,'failed');
  }
  document.getElementById('reImgBtn').disabled=false;
}

async function regenVoice(){
  if(!pid) return;
  document.getElementById('reVoiceBtn').disabled=true;
  const voice = document.getElementById('voiceSelect').value;
  const sr = await api('videoApi',{_action:'getScenes',project_id:pid});
  const scenes = (sr.scenes||[]).sort((a,b)=>a.scene_number-b.scene_number);
  for(let i=0;i<scenes.length;i++){
    const res = await api('generateVoiceover',{scene_id:scenes[i].id,narration:scenes[i].narration,voice_id:voice});
    if(res.success && res.audio_url) updateSceneAudio(i,res.audio_url);
  }
  document.getElementById('reVoiceBtn').disabled=false;
}

async function deleteProject(){
  if(!pid||!confirm('Delete this project?')) return;
  await api('videoApi',{_action:'deleteProject',project_id:pid});
  pid=null;
  showView('home');
  loadSidebar();
}

// ── INIT ─────────────────────────────────────────────────
loadSidebar();
</script>
</body>
</html>`;

Deno.serve(async (req) => {
  // Serve HTML for GET or root
  if (req.method === 'GET') {
    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  // For POST, just return the HTML too (base44 wraps functions)
  return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
});
