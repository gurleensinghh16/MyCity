/* ─────────────────────────────────────────────
   MyCity — JavaScript
───────────────────────────────────────────── */

/* ░░ SAMPLE ISSUE DATA ░░ */
const ISSUES = [
  {
    id: 1,
    category: "Road & Potholes",
    emoji: "🛣️",
    title: "Deep pothole near main roundabout causing vehicle damage",
    location: "Main Roundabout, Sector 3",
    date: "24 Jun 2026",
    status: "reported",
    risk: "high",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg,#1a2340,#1e3a5f)"
  },
  {
    id: 2,
    category: "Water Supply",
    emoji: "💧",
    title: "Water supply disrupted for 3 days in residential colony",
    location: "Green Park Colony, Block C",
    date: "23 Jun 2026",
    status: "started",
    risk: "high",
    color: "#06B6D4",
    gradient: "linear-gradient(135deg,#0c1f2e,#0e3344)"
  },
  {
    id: 3,
    category: "Street Lighting",
    emoji: "💡",
    title: "Multiple streetlights non-functional on market road",
    location: "Model Town Market Road",
    date: "22 Jun 2026",
    status: "completed",
    risk: "medium",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg,#1f1a0c,#332d14)"
  },
  {
    id: 4,
    category: "Waste Management",
    emoji: "🗑️",
    title: "Garbage not collected for over a week — overflow on streets",
    location: "Sector 14, Near Park Gate",
    date: "21 Jun 2026",
    status: "started",
    risk: "medium",
    color: "#10B981",
    gradient: "linear-gradient(135deg,#0c1f18,#0e3326)"
  },
  {
    id: 5,
    category: "Electricity",
    emoji: "⚡",
    title: "Frequent power cuts lasting 4-6 hours daily",
    location: "Old City Area, Ward 7",
    date: "20 Jun 2026",
    status: "reported",
    risk: "high",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg,#1f1a0c,#30250d)"
  },
  {
    id: 6,
    category: "Drainage",
    emoji: "🌊",
    title: "Clogged drain causing waterlogging after rain",
    location: "Subhash Nagar, Near School",
    date: "19 Jun 2026",
    status: "completed",
    risk: "low",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg,#130f2a,#1d1540)"
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

/* ░░ RENDER ISSUES GRID ░░ */
function renderIssues(filter = 'all') {
  const grid = document.getElementById('issuesGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? ISSUES : ISSUES.filter(i => i.status === filter);
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">No issues found in this category.</div>`;
    return;
  }
  filtered.forEach((issue, idx) => {
    const s = statusLabel(issue.status);
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.style.animationDelay = `${idx * 60}ms`;
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
        <div class="issue-card-footer">
          <div class="status-dot-wrap">
            <div class="status-dot ${s.cls}"></div>
            <span class="status-text status-${s.cls}">${s.label}</span>
          </div>
          <span class="issue-card-date">${issue.date}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ░░ FILTER TABS ░░ */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderIssues(tab.dataset.filter);
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
    const btn   = document.getElementById('submitBtn');
    const label = document.getElementById('submitLabel');
    const loader = document.getElementById('submitLoader');
    btn.disabled = true;
    label.classList.add('hidden');
    loader.classList.remove('hidden');

    setTimeout(() => {
      btn.disabled = false;
      label.classList.remove('hidden');
      loader.classList.add('hidden');
      showToast();
      form.reset();
      const preview = document.getElementById('previewImg');
      const inner   = document.getElementById('uploadInner');
      if (preview) { preview.src = ''; preview.classList.add('hidden'); }
      if (inner)   { inner.classList.remove('hidden'); }
      const charCount = document.getElementById('charCount');
      if (charCount) charCount.textContent = '0';
      updateRisk();

      // Add the new issue to the top of the grid
      const newIssue = {
        id: Date.now(),
        category: category?.options[category.selectedIndex]?.text || 'Other',
        emoji: '📍',
        title: document.getElementById('issueDesc')?.value.slice(0,80) || 'New civic issue reported',
        location: document.getElementById('addressInput')?.value || 'Rohtak, Haryana',
        date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
        status: 'reported',
        risk: 'medium',
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg,#1a2340,#1e3a5f)'
      };
      ISSUES.unshift(newIssue);
      renderIssues('all');
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === 'all');
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

/* ░░ INIT ░░ */
document.addEventListener('DOMContentLoaded', () => {
  renderIssues('all');
  initFilterTabs();
  initNavbar();
  initObservers();
  initGeolocation();
  initImageUpload();
  initReportForm();
  initLoginModal();
  initSmoothScroll();
});