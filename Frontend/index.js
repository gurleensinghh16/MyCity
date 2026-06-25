/* ─────────────────────────────────────────────
   MyCity — JavaScript
───────────────────────────────────────────── */

/* ░░ ISSUE DATA — rich demo set ░░ */
const ISSUES = [
  {
    id: 1,
    category: "Road & Potholes", categoryKey: "road",
    emoji: "🛣️",
    title: "Deep pothole near main roundabout causing vehicle damage",
    desc: "A large, deep pothole approximately 3 feet wide has formed near the main roundabout at Sector 3. Multiple vehicles have reported tyre damage. The issue has worsened after recent rainfall. School buses pass this route daily — posing significant risk.",
    location: "Main Roundabout, Sector 3, Rohtak",
    date: "24 Jun 2026",
    status: "reported",
    risk: "high", riskScore: 9,
    dept: "Road Department",
    locImportance: "School Zone",
    confirmations: 34,
    color: "#3B82F6",
    gradient: "linear-gradient(135deg,#1a2340,#1e3a5f)",
    timeline: [
      { label: "Reported", date: "24 Jun 2026", done: true },
      { label: "Acknowledged", date: "Pending", done: false },
      { label: "Work Started", date: "—", done: false },
      { label: "Completed", date: "—", done: false }
    ],
    hasBefore: false
  },
  {
    id: 2,
    category: "Water Supply", categoryKey: "water",
    emoji: "💧",
    title: "Water supply disrupted for 3 days in residential colony",
    desc: "Residents of Green Park Colony Block C have been without piped water supply for 3 consecutive days. Families are forced to buy expensive tanker water. The main supply line appears to have a leak near the junction. Elderly residents are particularly affected.",
    location: "Green Park Colony, Block C, Rohtak",
    date: "23 Jun 2026",
    status: "started",
    risk: "high", riskScore: 8,
    dept: "Water Department",
    locImportance: "Residential Area",
    confirmations: 21,
    color: "#06B6D4",
    gradient: "linear-gradient(135deg,#0c1f2e,#0e3344)",
    timeline: [
      { label: "Reported", date: "23 Jun 2026", done: true },
      { label: "Acknowledged", date: "23 Jun 2026", done: true },
      { label: "Work Started", date: "24 Jun 2026", done: true },
      { label: "Completed", date: "—", done: false }
    ],
    hasBefore: false
  },
  {
    id: 3,
    category: "Street Lighting", categoryKey: "streetlight",
    emoji: "💡",
    title: "6 streetlights non-functional on main market road",
    desc: "Six consecutive streetlights on Model Town Market Road have been out for 11 days. The road is heavily used by pedestrians and shoppers after dark. Two minor accidents and one robbery incident have been reported in this stretch since the lights failed.",
    location: "Model Town Market Road, Rohtak",
    date: "22 Jun 2026",
    status: "completed",
    risk: "medium", riskScore: 6,
    dept: "Electricity Department",
    locImportance: "Commercial Zone",
    confirmations: 18,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg,#1f1a0c,#332d14)",
    timeline: [
      { label: "Reported", date: "22 Jun 2026", done: true },
      { label: "Acknowledged", date: "22 Jun 2026", done: true },
      { label: "Work Started", date: "23 Jun 2026", done: true },
      { label: "Completed", date: "24 Jun 2026", done: true }
    ],
    hasBefore: true, beforeEmoji: "🔦", afterEmoji: "💡", resolvedIn: "2 Days"
  },
  {
    id: 4,
    category: "Waste Management", categoryKey: "waste",
    emoji: "🗑️",
    title: "Garbage uncollected for 9 days — severe overflow near park",
    desc: "Waste bins near Sector 14 Park Gate have not been emptied for 9 days. Garbage is overflowing onto the footpath and road. The stench is affecting nearby residents and the park is unusable. Stray animals are scattering waste across the street.",
    location: "Sector 14, Near Park Gate, Rohtak",
    date: "21 Jun 2026",
    status: "started",
    risk: "medium", riskScore: 6,
    dept: "Sanitation Department",
    locImportance: "Public Park",
    confirmations: 12,
    color: "#10B981",
    gradient: "linear-gradient(135deg,#0c1f18,#0e3326)",
    timeline: [
      { label: "Reported", date: "21 Jun 2026", done: true },
      { label: "Acknowledged", date: "22 Jun 2026", done: true },
      { label: "Work Started", date: "23 Jun 2026", done: true },
      { label: "Completed", date: "—", done: false }
    ],
    hasBefore: false
  },
  {
    id: 5,
    category: "Electricity", categoryKey: "electricity",
    emoji: "⚡",
    title: "Frequent power cuts of 4-6 hours daily in Old City",
    desc: "Old City Area Ward 7 has been experiencing repeated unscheduled power outages lasting 4 to 6 hours every day for the past 2 weeks. Small businesses are reporting severe losses. No prior notice is given. The transformer in the area appears to be overloaded.",
    location: "Old City Area, Ward 7, Rohtak",
    date: "20 Jun 2026",
    status: "reported",
    risk: "high", riskScore: 8,
    dept: "Electricity Department",
    locImportance: "Commercial + Residential",
    confirmations: 47,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg,#1f1a0c,#30250d)",
    timeline: [
      { label: "Reported", date: "20 Jun 2026", done: true },
      { label: "Acknowledged", date: "Pending", done: false },
      { label: "Work Started", date: "—", done: false },
      { label: "Completed", date: "—", done: false }
    ],
    hasBefore: false
  },
  {
    id: 6,
    category: "Drainage", categoryKey: "drainage",
    emoji: "🌊",
    title: "Clogged storm drain causing severe waterlogging near school",
    desc: "The storm drain at the entrance of Subhash Nagar is completely blocked with debris. After every rain, the area floods to knee level. Children going to school nearby are unable to walk safely. The same drain has been reported twice before without action.",
    location: "Subhash Nagar, Near Govt. School, Rohtak",
    date: "19 Jun 2026",
    status: "completed",
    risk: "low", riskScore: 4,
    dept: "Drainage Department",
    locImportance: "School Zone",
    confirmations: 9,
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg,#130f2a,#1d1540)",
    timeline: [
      { label: "Reported", date: "19 Jun 2026", done: true },
      { label: "Acknowledged", date: "19 Jun 2026", done: true },
      { label: "Work Started", date: "20 Jun 2026", done: true },
      { label: "Completed", date: "21 Jun 2026", done: true }
    ],
    hasBefore: true, beforeEmoji: "🚯", afterEmoji: "✨", resolvedIn: "2 Days"
  }
];

/* ░░ HELPER — render status label ░░ */
function statusLabel(s) {
  if (s === 'reported')  return { label: 'Reported', cls: 'reported' };
  if (s === 'started')   return { label: 'In Progress', cls: 'started' };
  if (s === 'completed') return { label: 'Completed', cls: 'completed' };
  return { label: s, cls: '' };
}
function riskLabel(r) {
  if (r === 'high')   return 'High Risk';
  if (r === 'medium') return 'Medium Risk';
  return 'Low Risk';
}

/* ░░ BUILD INLINE CARD TIMELINE ░░ */
function buildCardTimeline(issue) {
  const steps = issue.timeline || [];
  return steps.map((step, i) => {
    const isLast = i === steps.length - 1;
    let dotCls = 'ic-t-dot';
    let lineCls = 'ic-t-line';
    if (step.done && (i === steps.length - 1 || steps[i+1]?.done)) {
      dotCls += ' done-green'; lineCls += ' done-green';
    } else if (step.done) {
      dotCls += ' done'; lineCls += ' done';
    } else if (!step.done && steps[i-1]?.done) {
      dotCls += ' active-dot';
    }
    return `
      <div class="ic-t-step">
        <div class="${dotCls}"><div class="ic-t-dot-inner"></div></div>
        ${!isLast ? `<div class="${lineCls}"></div>` : '<div></div>'}
        <div class="ic-t-content">
          <div class="ic-t-label">${step.label}</div>
          <div class="ic-t-date">${step.date}</div>
        </div>
      </div>`;
  }).join('');
}

/* ░░ RENDER ISSUES GRID ░░ */
function renderIssues(filterVal = 'all', filterType = 'status') {
  const grid = document.getElementById('issuesGrid');
  if (!grid) return;

  let filtered;
  if (filterVal === 'all') {
    filtered = ISSUES;
  } else if (filterType === 'status') {
    filtered = ISSUES.filter(i => i.status === filterVal);
  } else if (filterType === 'risk') {
    filtered = ISSUES.filter(i => i.risk === filterVal);
  } else if (filterType === 'category') {
    filtered = ISSUES.filter(i => i.categoryKey === filterVal);
  } else {
    filtered = ISSUES;
  }

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">No issues found for this filter.</div>`;
    return;
  }

  filtered.forEach((issue, idx) => {
    const s = statusLabel(issue.status);
    const scoreNum = issue.riskScore || (issue.risk === 'high' ? 8 : issue.risk === 'medium' ? 5 : 3);
    const rsbCls   = `rsb-${issue.risk}`;

    const card = document.createElement('div');
    card.className = 'issue-card';
    card.style.animationDelay = `${idx * 60}ms`;
    card.dataset.id = issue.id;

    card.innerHTML = `
      <div class="issue-card-img-placeholder" style="background:${issue.gradient};">
        <span style="font-size:3.5rem;">${issue.emoji}</span>
      </div>
      <div class="issue-card-body">
        <div class="issue-card-meta">
          <span class="issue-category-tag">${issue.emoji} ${issue.category}</span>
          <span class="risk-badge risk-${issue.risk}">${riskLabel(issue.risk)}</span>
        </div>
        <div class="issue-card-title">${issue.title}</div>
        <div class="issue-card-loc">📍 ${issue.location}</div>

        <!-- Risk score badge -->
        <div class="risk-score-badge ${rsbCls}" style="margin-bottom:8px;">
          <span class="rsb-dot"></span>
          Risk Score: ${scoreNum}/10 &nbsp;·&nbsp; Priority: ${issue.risk.charAt(0).toUpperCase()+issue.risk.slice(1)}
        </div>

        <!-- Inline mini-timeline -->
        <div class="ic-timeline">${buildCardTimeline(issue)}</div>

        <!-- Community confirm row -->
        <div class="ic-confirm-row">
          <button class="ic-confirm-btn" data-id="${issue.id}" onclick="handleConfirm(event,${issue.id})">
            ✔ Confirm Issue
          </button>
          <span class="ic-confirm-count" id="confirm-count-${issue.id}">
            Confirmed by <strong>${issue.confirmations}</strong> citizens
          </span>
        </div>

        <div class="issue-card-footer" style="margin-top:10px;">
          <div class="status-dot-wrap">
            <div class="status-dot ${s.cls}"></div>
            <span class="status-text status-${s.cls}">${s.label}</span>
          </div>
          <span class="issue-card-date">${issue.date}</span>
        </div>
      </div>
    `;

    // Click anywhere except the confirm button → open detail modal
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ic-confirm-btn')) return;
      openIssueModal(issue.id);
    });

    grid.appendChild(card);
  });
}

/* ░░ FILTER PILLS ░░ */
function initFilterTabs() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderIssues(pill.dataset.filter, pill.dataset.type);
    });
  });
}

/* ░░ NAVBAR SCROLL BEHAVIOR ░░ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active nav highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  }, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translateY(7px)' : '';
    spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translateY(-7px)' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* ░░ COUNTER ANIMATION ░░ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

/* ░░ INTERSECTION OBSERVERS ░░ */
function initObservers() {
  // Stat cards animation
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.dataset.delay || 0);
        setTimeout(() => card.classList.add('visible'), delay);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stat-card').forEach(c => cardObserver.observe(c));

  // Counter elements
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // Hero stat counters
  const heroCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.h-stat-num').forEach(el => animateCounter(el));
        heroCounterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroCounterObserver.observe(heroStats);

  // Stat bars
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-grid').forEach(g => barObserver.observe(g));

  // Analytics bars
  const cbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cb-bar-fill').forEach(bar => {
          const pct = bar.dataset.width;
          setTimeout(() => { bar.style.width = pct + '%'; }, 100);
        });
        cbObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.category-breakdown').forEach(el => cbObserver.observe(el));
}

/* ░░ GEOLOCATION ░░ */
function initGeolocation() {
  const locText   = document.getElementById('locText');
  const addrInput = document.getElementById('addressInput');
  const refresh   = document.getElementById('locRefresh');

  function detect() {
    if (!locText) return;
    locText.textContent = 'Detecting location...';
    // Simulate location (real app would call browser geo + reverse geocode)
    setTimeout(() => {
      const fakeLocation = 'Sector 3, Rohtak, Haryana 124001';
      locText.textContent = fakeLocation;
      if (addrInput && !addrInput.value) addrInput.value = fakeLocation;
    }, 1200);
  }

  detect();
  if (refresh) refresh.addEventListener('click', detect);
}

/* ░░ IMAGE UPLOAD ░░ */
function initImageUpload() {
  const zone      = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const inner     = document.getElementById('uploadInner');
  const preview   = document.getElementById('previewImg');
  if (!zone) return;

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      inner.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  zone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });
}

/* ░░ RISK ASSESSMENT (AI-simulated) ░░ */
function updateRisk() {
  const desc     = document.getElementById('issueDesc')?.value || '';
  const category = document.getElementById('issueCategory')?.value || '';
  const riskBar  = document.getElementById('riskBar');
  const riskTag  = document.getElementById('riskTag');
  if (!riskBar || !riskTag) return;

  const len = desc.length + (category ? 20 : 0);
  let level = 'none', pct = 0, color = 'var(--text-muted)';

  const highKeywords = ['damage','danger','severe','emergency','flood','broken','no water','outage','collapse','pothole','deep'];
  const medKeywords  = ['weeks','old','persistent','long','multiple'];

  const text = (desc + ' ' + category).toLowerCase();
  const isHigh = highKeywords.some(k => text.includes(k));
  const isMed  = medKeywords.some(k => text.includes(k));

  if (len < 15) {
    pct = 0; level = 'Awaiting input...'; color = 'var(--text-muted)';
  } else if (isHigh || len > 150) {
    pct = 85; level = '🔴 High Risk'; color = '#EF4444';
    riskTag.style.background = 'rgba(239,68,68,0.12)';
    riskTag.style.color = '#EF4444';
  } else if (isMed || len > 60) {
    pct = 52; level = '🟠 Medium Risk'; color = '#F59E0B';
    riskTag.style.background = 'rgba(245,158,11,0.12)';
    riskTag.style.color = '#F59E0B';
  } else {
    pct = 22; level = '🟢 Low Risk'; color = '#10B981';
    riskTag.style.background = 'rgba(16,185,129,0.12)';
    riskTag.style.color = '#10B981';
  }

  riskBar.style.width = pct + '%';
  riskBar.style.background = pct === 0 ? 'var(--text-muted)' : color;
  riskTag.textContent = level;
}

/* ░░ REPORT FORM ░░ */
function initReportForm() {
  const form      = document.getElementById('reportForm');
  const desc      = document.getElementById('issueDesc');
  const charCount = document.getElementById('charCount');
  const category  = document.getElementById('issueCategory');
  if (!form) return;

  desc?.addEventListener('input', () => {
    const len = Math.min(desc.value.length, 500);
    if (desc.value.length > 500) desc.value = desc.value.slice(0, 500);
    if (charCount) charCount.textContent = len;
    updateRisk();
  });
  category?.addEventListener('change', updateRisk);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn    = document.getElementById('submitBtn');
    const label  = document.getElementById('submitLabel');
    const loader = document.getElementById('submitLoader');
    btn.disabled = true;
    label.classList.add('hidden');
    loader.classList.remove('hidden');

    // Capture values before reset
    const descVal  = desc?.value || '';
    const catVal   = category?.options[category.selectedIndex]?.text || 'Other';
    const catKey   = category?.value || 'other';
    const addrVal  = document.getElementById('addressInput')?.value || 'Rohtak, Haryana';

    setTimeout(() => {
      btn.disabled = false;
      label.classList.remove('hidden');
      loader.classList.add('hidden');
      showToast();

      // Compute risk from current bar state
      const riskBarEl = document.getElementById('riskBar');
      const riskW = parseFloat(riskBarEl?.style.width || '0');
      const computedRisk = riskW >= 70 ? 'high' : riskW >= 40 ? 'medium' : 'low';
      const computedScore = riskW >= 70 ? 9 : riskW >= 40 ? 6 : 3;

      // Show AI analysis panel
      showAIPanel({
        title: descVal.slice(0, 100) || 'New civic issue reported',
        category: catVal, catKey,
        risk: computedRisk, riskScore: computedScore,
        location: addrVal,
        desc: descVal
      });

      // Reset form
      form.reset();
      const preview = document.getElementById('previewImg');
      const inner   = document.getElementById('uploadInner');
      if (preview) { preview.src = ''; preview.classList.add('hidden'); }
      if (inner)   { inner.classList.remove('hidden'); }
      if (charCount) charCount.textContent = '0';
      updateRisk();

      // Add new issue to grid
      const newIssue = {
        id: Date.now(),
        category: catVal, categoryKey: catKey,
        emoji: '📍',
        title: descVal.slice(0, 80) || 'New civic issue reported',
        desc: descVal,
        location: addrVal,
        date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
        status: 'reported',
        risk: computedRisk, riskScore: computedScore,
        dept: deptForCategory(catKey),
        locImportance: 'Civic Area',
        confirmations: 0,
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg,#1a2340,#1e3a5f)',
        timeline: [
          { label: 'Reported', date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }), done: true },
          { label: 'Acknowledged', date: 'Pending', done: false },
          { label: 'Work Started', date: '—', done: false },
          { label: 'Completed', date: '—', done: false }
        ],
        hasBefore: false
      };
      ISSUES.unshift(newIssue);
      renderIssues('all', 'status');
      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.filter === 'all');
      });
    }, 1600);
  });
}

/* ░░ TOAST ░░ */
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ░░ LOGIN MODAL ░░ */
const DEMO_ACCOUNTS = {
  'road@mycity.com':     { pass: '123456', dept: 'Road Department' },
  'water@mycity.com':    { pass: '123456', dept: 'Water Department' },
  'electric@mycity.com': { pass: '123456', dept: 'Electricity Department' }
};

function initLoginModal() {
  const modal      = document.getElementById('loginModal');
  const loginBtn   = document.getElementById('loginBtn');
  const closeBtn   = document.getElementById('modalClose');
  const loginForm  = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passInput  = document.getElementById('loginPass');
  const errorEl    = document.getElementById('loginError');
  const pwToggle   = document.getElementById('pwToggle');
  const submitBtn  = document.getElementById('loginSubmitBtn');
  const loginLabel = document.getElementById('loginLabel');
  if (!modal) return;

  const open  = () => { modal.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; errorEl?.classList.add('hidden'); };

  loginBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Demo account chips
  document.querySelectorAll('.demo-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (emailInput) emailInput.value = chip.dataset.email;
      if (passInput)  passInput.value  = chip.dataset.pass;
      errorEl?.classList.add('hidden');
    });
  });

  // Password toggle
  pwToggle?.addEventListener('click', () => {
    const isPassword = passInput.type === 'password';
    passInput.type = isPassword ? 'text' : 'password';
    pwToggle.textContent = isPassword ? '🙈' : '👁';
  });

  // Login submit
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim().toLowerCase();
    const pass  = passInput?.value.trim();
    errorEl?.classList.add('hidden');

    submitBtn.disabled = true;
    loginLabel.textContent = 'Verifying...';

    setTimeout(() => {
      const account = DEMO_ACCOUNTS[email];
      if (account && account.pass === pass) {
        loginLabel.textContent = `✓ Welcome, ${account.dept}`;
        setTimeout(() => {
          close();
          submitBtn.disabled = false;
          loginLabel.textContent = 'Login to Dashboard';
          // Show welcome toast
          const toast = document.getElementById('toast');
          const toastTitle = toast?.querySelector('.toast-title');
          const toastSub   = toast?.querySelector('.toast-sub');
          const toastIcon  = toast?.querySelector('.toast-icon');
          if (toastTitle) toastTitle.textContent = `Welcome, ${account.dept}`;
          if (toastSub)   toastSub.textContent   = 'Authority dashboard coming soon. Stay tuned!';
          if (toastIcon) { toastIcon.textContent = '⬡'; toastIcon.style.color = 'var(--blue)'; toast.style.borderColor = 'rgba(59,130,246,0.3)'; }
          showToast();
          setTimeout(() => {
            if (toastTitle) toastTitle.textContent = 'Report Submitted!';
            if (toastSub)   toastSub.textContent   = 'Your issue has been filed and routed to the relevant department.';
            if (toastIcon) { toastIcon.textContent = '✓'; toastIcon.style.color = 'var(--green)'; if (toast) toast.style.borderColor = 'rgba(16,185,129,0.3)'; }
          }, 4500);
        }, 800);
      } else {
        submitBtn.disabled = false;
        loginLabel.textContent = 'Login to Dashboard';
        errorEl?.classList.remove('hidden');
      }
    }, 900);
  });
}

/* ░░ SMOOTH SCROLL for nav links ░░ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ░░ DEPT LOOKUP ░░ */
function deptForCategory(key) {
  const map = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', waste:'Sanitation Department', drainage:'Drainage Department', streetlight:'Electricity Department', other:'Municipal Department' };
  return map[key] || 'Municipal Department';
}

/* ░░ COMMUNITY CONFIRM ░░ */
function handleConfirm(e, id) {
  e.stopPropagation();
  const issue = ISSUES.find(i => i.id === id);
  if (!issue) return;
  const btn = document.querySelector(`.ic-confirm-btn[data-id="${id}"]`);
  if (btn?.classList.contains('confirmed')) return;

  issue.confirmations++;
  // Bump risk score slightly with more confirmations
  if (issue.confirmations > 20 && issue.riskScore < 10) issue.riskScore = Math.min(10, issue.riskScore + 1);

  const countEl = document.getElementById(`confirm-count-${id}`);
  if (countEl) countEl.innerHTML = `Confirmed by <strong>${issue.confirmations}</strong> citizens`;
  if (btn) { btn.classList.add('confirmed'); btn.textContent = '✔ Confirmed'; }
}
// Expose globally for inline onclick
window.handleConfirm = handleConfirm;

/* ░░ AI ANALYSIS PANEL ░░ */
function deptSummary(catKey, risk, loc, title) {
  const summaries = {
    road: `Road damage detected near ${loc}. ${risk === 'high' ? 'Severe structural hazard — may cause vehicle damage and injuries.' : 'Moderate road deterioration requiring scheduled repair.'}`,
    water: `Water supply disruption in ${loc}. ${risk === 'high' ? 'Critical — residents are without water access. Immediate pipeline inspection needed.' : 'Supply irregularity reported. Maintenance team to investigate.'}`,
    electricity: `Power outage issue in ${loc}. ${risk === 'high' ? 'Widespread unscheduled cuts affecting residents and businesses. Transformer inspection warranted.' : 'Localised electrical fault. Scheduled for maintenance.'}`,
    waste: `Sanitation issue in ${loc}. Accumulated waste posing health risk. ${risk === 'high' ? 'Immediate clearance required.' : 'Scheduled pickup missed — to be resolved within 48 hours.'}`,
    streetlight: `Street lighting failure in ${loc}. ${risk === 'high' ? 'Multiple lights out — safety risk for pedestrians and vehicles after dark.' : 'Single or partial lighting fault. Scheduled for repair.'}`,
    drainage: `Drainage blockage in ${loc}. ${risk === 'high' ? 'Severe waterlogging risk — affecting pedestrian and vehicular movement.' : 'Minor drainage issue. Scheduled desilting recommended.'}`,
  };
  return summaries[catKey] || `Civic issue detected at ${loc}. Routed to the relevant department for action.`;
}

function showAIPanel(data) {
  const section = document.getElementById('aiAnalysisSection');
  if (!section) return;
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('aiIssueTitle').textContent = data.title;
  document.getElementById('aiCategory').textContent   = data.category;

  const sev = data.risk === 'high' ? '🔴 High' : data.risk === 'medium' ? '🟠 Medium' : '🟢 Low';
  document.getElementById('aiSeverity').textContent   = sev;
  document.getElementById('aiDept').textContent       = deptForCategory(data.catKey);
  document.getElementById('aiLocImp').textContent     = 'Civic Zone';
  document.getElementById('aiConfirm').textContent    = '0';
  document.getElementById('aiRiskScore').textContent  = `${data.riskScore}/10`;
  document.getElementById('aiSummaryText').textContent = deptSummary(data.catKey, data.risk, data.location, data.title);

  // Animate risk ring
  const fill = document.getElementById('riskRingFill');
  const ringScore = document.getElementById('ringScore');
  if (fill && ringScore) {
    const circumference = 201;
    const offset = circumference - (data.riskScore / 10) * circumference;
    const ringColor = data.risk === 'high' ? '#EF4444' : data.risk === 'medium' ? '#F59E0B' : '#10B981';
    fill.style.stroke = ringColor;
    setTimeout(() => { fill.style.strokeDashoffset = offset; }, 100);
    // Count up ring number
    let n = 0;
    const timer = setInterval(() => {
      n++;
      ringScore.textContent = n;
      if (n >= data.riskScore) clearInterval(timer);
    }, 120);
  }
}

/* ░░ ISSUE DETAIL MODAL ░░ */
function openIssueModal(id) {
  const issue = ISSUES.find(i => i.id === id);
  if (!issue) return;
  const modal = document.getElementById('issueModal');
  const body  = document.getElementById('issueModalBody');
  if (!modal || !body) return;

  const s = statusLabel(issue.status);
  const statusColor = issue.status === 'completed' ? '#10B981' : issue.status === 'started' ? '#F59E0B' : '#3B82F6';
  const rsbCls = `rsb-${issue.risk}`;

  // Build full modal timeline
  const timelineHTML = (issue.timeline || []).map((step, i) => {
    const isLast = i === issue.timeline.length - 1;
    let dotCls = 'ic-t-dot', lineCls = 'ic-t-line';
    if (step.done && (isLast || issue.timeline[i+1]?.done)) { dotCls += ' done-green'; lineCls += ' done-green'; }
    else if (step.done) { dotCls += ' done'; lineCls += ' done'; }
    else if (!step.done && issue.timeline[i-1]?.done) dotCls += ' active-dot';
    return `
      <div class="ic-t-step">
        <div class="${dotCls}"><div class="ic-t-dot-inner"></div></div>
        ${!isLast ? `<div class="${lineCls}"></div>` : '<div></div>'}
        <div class="ic-t-content">
          <div class="ic-t-label">${step.label}</div>
          <div class="ic-t-date">${step.date}</div>
        </div>
      </div>`;
  }).join('');

  // Before/after
  const baHTML = issue.hasBefore ? `
    <div>
      <div class="im-section-title">Before &amp; After</div>
      <div class="im-ba-row">
        <div class="im-ba-box" style="background:linear-gradient(135deg,#1a100a,#2a180c);">
          <span>${issue.beforeEmoji || '🔴'}</span>
          <span class="im-ba-label" style="color:#EF4444;">Before</span>
        </div>
        <div class="im-ba-box" style="background:linear-gradient(135deg,#0f2820,#122014);">
          <span>${issue.afterEmoji || '✅'}</span>
          <span class="im-ba-label" style="color:#10B981;">After</span>
        </div>
      </div>
      <div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted);">Resolved in ${issue.resolvedIn || 'N/A'}</div>
    </div>` : '';

  body.innerHTML = `
    <div class="im-hero" style="background:${issue.gradient};">
      <span style="font-size:5rem;">${issue.emoji}</span>
      <div class="im-status-pill" style="background:rgba(0,0,0,0.5);color:${statusColor};border:1px solid ${statusColor}40;">
        ${s.label}
      </div>
    </div>
    <div class="im-content">
      <div class="im-title">${issue.title}</div>
      <div class="im-meta-row">
        <span class="issue-category-tag">${issue.emoji} ${issue.category}</span>
        <span class="risk-badge risk-${issue.risk}">${riskLabel(issue.risk)}</span>
        <span class="risk-score-badge ${rsbCls}"><span class="rsb-dot"></span>Risk ${issue.riskScore}/10</span>
      </div>
      <p class="im-desc">📍 ${issue.location} &nbsp;·&nbsp; ${issue.date}</p>
      <p class="im-desc">${issue.desc || 'No description provided.'}</p>

      <!-- AI Analysis -->
      <div>
        <div class="im-section-title">AI Analysis</div>
        <div class="im-ai-grid">
          <div class="im-ai-cell"><div class="im-ai-cell-label">Department</div><div class="im-ai-cell-val">${issue.dept}</div></div>
          <div class="im-ai-cell"><div class="im-ai-cell-label">Severity</div><div class="im-ai-cell-val">${issue.risk.charAt(0).toUpperCase()+issue.risk.slice(1)}</div></div>
          <div class="im-ai-cell"><div class="im-ai-cell-label">Risk Score</div><div class="im-ai-cell-val">${issue.riskScore}/10</div></div>
          <div class="im-ai-cell"><div class="im-ai-cell-label">Location Type</div><div class="im-ai-cell-val">${issue.locImportance}</div></div>
        </div>
      </div>

      <!-- Timeline -->
      <div>
        <div class="im-section-title">Resolution Timeline</div>
        <div class="im-timeline">${timelineHTML}</div>
      </div>

      ${baHTML}

      <!-- Community confirmations -->
      <div class="im-confirm-section">
        <div>
          <div class="im-section-title">Community Confirmations</div>
          <div class="im-confirm-big" id="modal-confirm-num-${issue.id}">${issue.confirmations}</div>
          <div class="im-confirm-sub">citizens have confirmed this issue</div>
        </div>
        <button class="im-confirm-btn-big ${issue._modalConfirmed ? 'confirmed' : ''}" id="modal-confirm-btn-${issue.id}"
          onclick="handleModalConfirm(${issue.id})">
          ${issue._modalConfirmed ? '✔ Confirmed' : '✔ Confirm This Issue'}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.handleModalConfirm = function(id) {
  const issue = ISSUES.find(i => i.id === id);
  if (!issue || issue._modalConfirmed) return;
  issue._modalConfirmed = true;
  issue.confirmations++;
  if (issue.confirmations > 20 && issue.riskScore < 10) issue.riskScore = Math.min(10, issue.riskScore + 1);
  document.getElementById(`modal-confirm-num-${id}`).textContent = issue.confirmations;
  const btn = document.getElementById(`modal-confirm-btn-${id}`);
  if (btn) { btn.textContent = '✔ Confirmed'; btn.classList.add('confirmed'); }
  // Also sync card
  const cardCountEl = document.getElementById(`confirm-count-${id}`);
  if (cardCountEl) cardCountEl.innerHTML = `Confirmed by <strong>${issue.confirmations}</strong> citizens`;
  const cardBtn = document.querySelector(`.ic-confirm-btn[data-id="${id}"]`);
  if (cardBtn) { cardBtn.classList.add('confirmed'); cardBtn.textContent = '✔ Confirmed'; }
};

function initIssueModal() {
  const modal    = document.getElementById('issueModal');
  const closeBtn = document.getElementById('issueModalClose');
  if (!modal) return;
  closeBtn?.addEventListener('click', () => { modal.classList.remove('active'); document.body.style.overflow = ''; });
  modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { modal.classList.remove('active'); document.body.style.overflow = ''; } });
}

/* ░░ AUTHORITY DASHBOARD HOOKS — future use ░░ */
function initAuthorityHooks() {
  const root = document.getElementById('authorityDashboardRoot');
  if (!root) return;
  // Will be activated on successful authority login
  // root.dataset.dept = dept;
  // root.dataset.token = token;
  // root.classList.remove('hidden');
  // Expose API surface for future dashboard module
  window.MyCityAuthority = {
    setDept: (dept) => { if (root) root.dataset.dept = dept; },
    getAssignedIssues: (dept) => ISSUES.filter(i => i.dept === dept),
    updateStatus: (id, status) => {
      const issue = ISSUES.find(i => i.id === id);
      if (issue) { issue.status = status; renderIssues('all', 'status'); }
    },
    markCompleted: (id) => {
      const issue = ISSUES.find(i => i.id === id);
      if (issue) {
        issue.status = 'completed';
        issue.timeline = issue.timeline.map(s => ({ ...s, done: true }));
        renderIssues('all', 'status');
      }
    }
  };
}

/* ░░ INIT ░░ */
document.addEventListener('DOMContentLoaded', () => {
  renderIssues('all', 'status');
  initFilterTabs();
  initNavbar();
  initObservers();
  initGeolocation();
  initImageUpload();
  initReportForm();
  initLoginModal();
  initIssueModal();
  initSmoothScroll();
  initAuthorityHooks();
});