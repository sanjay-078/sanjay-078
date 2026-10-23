/**
 * SANJAY SYSTEMS V2 — NEXUS-01 OPERATING SYSTEM
 * Pure Vanilla JavaScript Client Engine
 *
 * Features:
 * - Choreographed OS Startup Sequence (Staged 0.0s - 1.95s with Esc bypass)
 * - Persistent Dual Theme Engine (Apple Silver Light vs Deep Graphite Dark)
 * - NEXUS-01 Robot Kinematics & Morphing States (Ready, Wave, Scan, Think, Sleep)
 * - Pointer 3D Parallax & Keyboard Navigation
 * - Developer Command Console with Command History & Deterministic Outputs
 * - System Architecture Inspector Modal
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM REFERENCES & APPLICATION STATE
  // --------------------------------------------------------------------------
  const DOM = {
    html: document.documentElement,
    metaTheme: document.querySelector('meta[name="theme-color"]'),
    // Boot Sequence
    bootOverlay: document.querySelector('#boot-overlay'),
    bootSignalLine: document.querySelector('#boot-signal-line'),
    bootMod1: document.querySelector('#boot-mod-1'),
    bootMod2: document.querySelector('#boot-mod-2'),
    bootMod3: document.querySelector('#boot-mod-3'),
    bootIdentity: document.querySelector('#boot-identity'),
    bootReadyBadge: document.querySelector('#boot-ready-badge'),
    bootSkipBtn: document.querySelector('#boot-skip-btn'),
    rebootBtn: document.querySelector('#reboot-btn'),
    // Themes
    themeBtns: document.querySelectorAll('.theme-btn'),
    // Robot Elements
    robotViewport: document.querySelector('#robot-stage-viewport'),
    robotCanvasWrapper: document.querySelector('#robot-canvas-wrapper'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    activeStateLabel: document.querySelector('#active-state-label'),
    coreStateText: document.querySelector('#core-state-text'),
    neuralLoadText: document.querySelector('#neural-load-text'),
    sensorHzText: document.querySelector('#sensor-hz-text'),
    motorStatus: document.querySelector('#motor-status'),
    energyFill: document.querySelector('#energy-fill'),
    energyPercentage: document.querySelector('#energy-percentage'),
    // Terminal Elements
    terminalLog: document.querySelector('#terminal-log'),
    terminalForm: document.querySelector('#terminal-form'),
    terminalInput: document.querySelector('#terminal-input'),
    clearLogBtn: document.querySelector('#clear-log-btn'),
    quickChips: document.querySelectorAll('.chip-btn'),
    // Modal Elements
    archModal: document.querySelector('#arch-modal'),
    modalBackdrop: document.querySelector('#modal-backdrop'),
    modalCloseBtn: document.querySelector('#modal-close-btn'),
    modalDoneBtn: document.querySelector('#modal-done-btn'),
    modalTag: document.querySelector('#modal-tag'),
    modalTitle: document.querySelector('#modal-title'),
    modalObjective: document.querySelector('#modal-objective'),
    modalPipeline: document.querySelector('#modal-pipeline'),
    modalScale: document.querySelector('#modal-scale'),
    modalStack: document.querySelector('#modal-stack'),
    modalCaseLink: document.querySelector('#modal-case-link'),
    modalDiagramArt: document.querySelector('#modal-diagram-art'),
    inspectBtns: document.querySelectorAll('[data-inspect]')
  };

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 2. SIGNATURE BOOT-UP SEQUENCE ENGINE
  // --------------------------------------------------------------------------
  const BootEngine = {
    timers: [],

    init: function () {
      const urlParams = new URLSearchParams(window.location.search);
      const forceBoot = urlParams.get('boot') === 'true';
      const hasBooted = sessionStorage.getItem('nexus_boot_v2_done');

      // If already booted in this session and not forced, or reduced motion requested, complete immediately
      if ((hasBooted && !forceBoot) || isReducedMotion) {
        this.dismiss(true);
        return;
      }

      this.startChoreography();

      // Event listener for Skip button
      if (DOM.bootSkipBtn) {
        DOM.bootSkipBtn.addEventListener('click', () => this.dismiss(false));
      }

      // Event listener for Reboot button
      if (DOM.rebootBtn) {
        DOM.rebootBtn.addEventListener('click', () => this.reboot());
      }
    },

    startChoreography: function () {
      this.clearTimers();
      DOM.bootOverlay.classList.remove('boot-completed');
      DOM.bootSignalLine.style.width = '0%';
      [DOM.bootMod1, DOM.bootMod2, DOM.bootMod3].forEach(el => el.classList.remove('active'));
      DOM.bootIdentity.classList.remove('visible');
      DOM.bootReadyBadge.classList.remove('visible');

      // Stage 02: 0.35s - Signal line activation
      this.timers.push(setTimeout(() => {
        DOM.bootSignalLine.style.width = '100%';
      }, 350));

      // Stage 03: 0.70s - 1.15s - System modules verification
      this.timers.push(setTimeout(() => {
        DOM.bootMod1.classList.add('active');
        DOM.bootMod1.querySelector('.boot-mod-status').textContent = 'CALIBRATED';
      }, 700));

      this.timers.push(setTimeout(() => {
        DOM.bootMod2.classList.add('active');
        DOM.bootMod2.querySelector('.boot-mod-status').textContent = 'VERIFIED';
      }, 920));

      this.timers.push(setTimeout(() => {
        DOM.bootMod3.classList.add('active');
        DOM.bootMod3.querySelector('.boot-mod-status').textContent = 'READY';
      }, 1150));

      // Stage 04: 1.25s - Identity Reveal
      this.timers.push(setTimeout(() => {
        DOM.bootIdentity.classList.add('visible');
      }, 1250));

      // Stage 05: 1.65s - Ready Badge Reveal
      this.timers.push(setTimeout(() => {
        DOM.bootReadyBadge.classList.add('visible');
      }, 1650));

      // Stage 06: 1.95s - Completion and entrance to workspace
      this.timers.push(setTimeout(() => {
        this.dismiss(false);
      }, 1950));
    },

    dismiss: function (immediate) {
      this.clearTimers();
      sessionStorage.setItem('nexus_boot_v2_done', 'true');
      if (immediate) {
        DOM.bootOverlay.style.transition = 'none';
        DOM.bootOverlay.classList.add('boot-completed');
        setTimeout(() => { DOM.bootOverlay.style.transition = ''; }, 50);
      } else {
        DOM.bootOverlay.classList.add('boot-completed');
      }
    },

    reboot: function () {
      sessionStorage.removeItem('nexus_boot_v2_done');
      this.startChoreography();
    },

    clearTimers: function () {
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
    }
  };

  // --------------------------------------------------------------------------
  // 3. PERSISTENT DUAL-THEME ENGINE
  // --------------------------------------------------------------------------
  const ThemeEngine = {
    init: function () {
      const stored = localStorage.getItem('nexus_theme');
      const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const initialTheme = stored || (systemPrefersLight ? 'light' : 'dark');
      this.applyTheme(initialTheme);

      DOM.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTheme = btn.dataset.themeVal;
          this.applyTheme(targetTheme);
          localStorage.setItem('nexus_theme', targetTheme);
        });
      });

      // Listen for system theme changes if user has not manually set a preference
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!localStorage.getItem('nexus_theme')) {
          this.applyTheme(e.matches ? 'light' : 'dark');
        }
      });
    },

    applyTheme: function (theme) {
      DOM.html.setAttribute('data-theme', theme);
      if (DOM.metaTheme) {
        DOM.metaTheme.setAttribute('content', theme === 'light' ? '#F8FAFC' : '#080B11');
      }
      DOM.themeBtns.forEach(btn => {
        const isMatch = btn.dataset.themeVal === theme;
        btn.setAttribute('aria-checked', String(isMatch));
      });
    }
  };

  // --------------------------------------------------------------------------
  // 4. NEXUS-01 ROBOT HARDWARE CONTROLLER
  // --------------------------------------------------------------------------
  const RobotController = {
    currentMode: 'ready',

    states: {
      ready: {
        label: 'STANDBY / READY',
        core: 'NOMINAL',
        neural: '14%',
        hz: '240 Hz',
        energy: 98,
        motor: 'NOMINAL · 6 AXIS'
      },
      wave: {
        label: 'GESTURE / WAVING',
        core: 'ENGAGED',
        neural: '38%',
        hz: '480 Hz',
        energy: 91,
        motor: 'ACTIVE · DUAL JOINT'
      },
      scan: {
        label: 'DIAGNOSTIC / SCAN',
        core: 'SPECTRAL',
        neural: '64%',
        hz: '960 Hz',
        energy: 82,
        motor: 'SWEEP · 360 OPTIC'
      },
      think: {
        label: 'INFERENCE / THINK',
        core: 'SYNTHESIS',
        neural: '89%',
        hz: '1200 Hz',
        energy: 74,
        motor: 'COGNITIVE · GEMINI CORE'
      },
      sleep: {
        label: 'STANDBY / SLEEP',
        core: 'LOW POWER',
        neural: '2%',
        hz: '30 Hz',
        energy: 25,
        motor: 'HIBERNATE · 0 AXIS'
      }
    },

    init: function () {
      // Check URL query parameters for mode
      const urlParams = new URLSearchParams(window.location.search);
      const paramMode = urlParams.get('mode');
      const startMode = this.states[paramMode] ? paramMode : 'ready';

      this.setMode(startMode);

      // Bind Mode Click Buttons
      DOM.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.setMode(btn.dataset.mode);
        });
      });

      // Pointer Parallax Tracking (Fine pointer only)
      if (!isReducedMotion && window.matchMedia('(pointer: fine)').matches && DOM.robotViewport) {
        let frameId = 0;
        DOM.robotViewport.addEventListener('pointermove', (e) => {
          if (frameId) return;
          const rect = DOM.robotViewport.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          frameId = requestAnimationFrame(() => {
            const tiltX = (-normY * 4).toFixed(2);
            const tiltY = (normX * 5).toFixed(2);
            DOM.robotCanvasWrapper.querySelector('svg').style.setProperty('--tiltX', `${tiltX}deg`);
            DOM.robotCanvasWrapper.querySelector('svg').style.setProperty('--tiltY', `${tiltY}deg`);
            frameId = 0;
          });
        });

        DOM.robotViewport.addEventListener('pointerleave', () => {
          DOM.robotCanvasWrapper.querySelector('svg').style.setProperty('--tiltX', '0deg');
          DOM.robotCanvasWrapper.querySelector('svg').style.setProperty('--tiltY', '0deg');
        });
      }
    },

    setMode: function (mode) {
      if (!this.states[mode]) return;
      this.currentMode = mode;
      const data = this.states[mode];

      // Update Canvas wrapper class
      DOM.robotCanvasWrapper.className = `robot-canvas-wrapper mode-${mode}`;

      // Update telemetry labels
      if (DOM.activeStateLabel) DOM.activeStateLabel.textContent = data.label;
      if (DOM.coreStateText) DOM.coreStateText.textContent = data.core;
      if (DOM.neuralLoadText) DOM.neuralLoadText.textContent = data.neural;
      if (DOM.sensorHzText) DOM.sensorHzText.textContent = data.hz;
      if (DOM.motorStatus) DOM.motorStatus.textContent = data.motor;
      if (DOM.energyFill) DOM.energyFill.style.width = `${data.energy}%`;
      if (DOM.energyPercentage) DOM.energyPercentage.textContent = `${data.energy}%`;

      // Update Button Active States
      DOM.modeBtns.forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    }
  };

  // --------------------------------------------------------------------------
  // 5. PROFESSIONAL DEVELOPER COMMAND CONSOLE
  // --------------------------------------------------------------------------
  const ConsoleEngine = {
    history: [],
    historyIndex: -1,

    commands: {
      '/help': {
        desc: 'List all available console commands',
        run: function () {
          return `Available Commands:
  • /projects   - Summarize all 4 production systems
  • /fireblade  - Field telemetry & call intelligence
  • /hyperspeed - Document extraction & email pipeline
  • /stratos    - Grounded Generative AI assistant
  • /decibel    - Operations & CRM routing workflows
  • /stack      - Full engineering tooling matrix
  • whoami      - Sanjay S executive background
  • /portfolio  - External case studies
  • /wave       - Remote trigger: Wave gesture
  • /scan       - Remote trigger: Diagnostic scan
  • /think      - Remote trigger: Inference thinking
  • /sleep      - Remote trigger: Low-power sleep
  • /ready      - Remote trigger: Wake / Standby
  • clear       - Wipe console buffer`;
        }
      },
      '/projects': {
        desc: 'Overview of 4 engineering systems',
        run: function () {
          return `Sanjay Systems Verified Production Deployments:
[01] FIREBLADE  - Mobile-to-web telemetry · 20 employee phones daily
[02] HYPERSPEED - Gmail & catalog extraction · ~200K emails · ~70K SKUs
[03] STRATOS    - Source-grounded AI · 69,070 catalogue products
[04] DECIBEL    - Multi-department CRM engine · 3 departments · 19 E2E checks
Type /[system-name] for architectural deep-dives.`;
        }
      },
      '/fireblade': {
        desc: 'Deep-dive on FIREBLADE system',
        run: function () {
          return `FIREBLADE // Mobile Telemetry & Call Intelligence
• Problem: Manual enquiry tracking resulted in lost leads and missed callbacks.
• Solution: Android telemetry service capturing business call events, ingesting via FastAPI into normalized database records with automated web dashboards.
• Verified Scale: 20 employee phones in daily business use across commercial staff.
• Case Study: https://sanjay-fde.vercel.app/work/fireblade`;
        }
      },
      '/hyperspeed': {
        desc: 'Deep-dive on HYPERSPEED system',
        run: function () {
          return `HYPERSPEED // Ingestion & Extraction Automation
• Problem: Tens of thousands of supplier quotes arrived in unstructured email formats.
• Solution: Multi-lane document parsing architecture combining Gmail API, OCR extraction, and schema validation pipelines.
• Verified Scale: ~200,000 emails processed · ~70,000 product records extracted.
• Case Study: https://sanjay-fde.vercel.app/work/hyperspeed`;
        }
      },
      '/stratos': {
        desc: 'Deep-dive on STRATOS system',
        run: function () {
          return `STRATOS // Source-Grounded Generative AI
• Problem: Off-the-shelf LLMs hallucinated non-existent product specifications and prices.
• Solution: Retrieval-grounded assistant with strict citation verification over private catalogue embeddings.
• Verified Scale: 69,070 catalogue products indexed and grounded.
• Case Study: https://sanjay-fde.vercel.app/work/stratos`;
        }
      },
      '/decibel': {
        desc: 'Deep-dive on DECIBEL system',
        run: function () {
          return `DECIBEL // Operations & CRM Routing Engine
• Problem: Departmental siloing between sales, technical dispatch, and client servicing.
• Solution: Permission-aware queueing platform synchronizing customer journeys across 3 departments with strict audit trails.
• Verified Scale: 3 business departments · 19 passing end-to-end regression tests.
• Case Study: https://sanjay-fde.vercel.app/work/decibel`;
        }
      },
      '/stack': {
        desc: 'Engineering stack matrix',
        run: function () {
          return `SANJAY SYSTEMS // CORE STACK MATRIX:
• AI & Data: Gemini API, LLM Application Architecture, RAG / Vector Grounding, OCR, Python
• Backend: FastAPI, Python, PostgreSQL, SQLite, Supabase, REST APIs
• Frontend & Mobile: React, Next.js, TypeScript, Android / Kotlin, Modern CSS
• Delivery & QA: Automated End-to-End Testing (Playwright/Jest), Git, Vercel`;
        }
      },
      'whoami': {
        desc: 'Sanjay S background',
        run: function () {
          return `Sanjay S is a Forward Deployed Engineer and Generative AI Engineer.
He specializes in taking advanced models and modern architectures and making them survive messy real-world deployment.
Portfolio: https://sanjay-fde.vercel.app
GitHub: https://github.com/sanjay-078
LinkedIn: https://www.linkedin.com/in/sanxay/`;
        }
      },
      '/portfolio': {
        desc: 'Direct link to portfolio',
        run: function () {
          return `Explore complete case studies with architectural diagrams and code breakdowns:
👉 https://sanjay-fde.vercel.app`;
        }
      }
    },

    init: function () {
      if (!DOM.terminalForm) return;

      DOM.terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = DOM.terminalInput.value.trim();
        if (!raw) return;

        this.history.push(raw);
        this.historyIndex = this.history.length;
        this.execute(raw);
        DOM.terminalInput.value = '';
      });

      // Terminal Clear Button
      if (DOM.clearLogBtn) {
        DOM.clearLogBtn.addEventListener('click', () => {
          DOM.terminalLog.innerHTML = '';
          this.logMessage('sys', 'Console buffer cleared. NEXUS-01 Engine online.');
        });
      }

      // Quick Chips Click
      DOM.quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const cmd = chip.dataset.cmd;
          this.execute(cmd);
          DOM.terminalInput.focus();
        });
      });

      // Command History Navigation (Arrow Up / Down)
      DOM.terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.historyIndex > 0) {
            this.historyIndex--;
            DOM.terminalInput.value = this.history[this.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            DOM.terminalInput.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            DOM.terminalInput.value = '';
          }
        }
      });
    },

    execute: function (rawInput) {
      this.logMessage('user', rawInput);

      const trimmed = rawInput.trim();
      const lower = trimmed.toLowerCase();

      // Check remote mode triggers
      const modeTriggers = {
        '/wave': 'wave',
        '/scan': 'scan',
        '/think': 'think',
        '/sleep': 'sleep',
        '/ready': 'ready',
        'wave': 'wave',
        'scan': 'scan',
        'think': 'think',
        'sleep': 'sleep',
        'wake': 'ready'
      };

      if (modeTriggers[lower]) {
        const nextMode = modeTriggers[lower];
        RobotController.setMode(nextMode);
        this.logMessage('nx', `Remote trigger executed: NEXUS-01 transitioned to [${nextMode.toUpperCase()}] mode.`);
        return;
      }

      if (lower === 'clear') {
        DOM.terminalLog.innerHTML = '';
        this.logMessage('sys', 'Console buffer cleared.');
        return;
      }

      // Check standard command table
      if (this.commands[lower]) {
        const result = this.commands[lower].run();
        this.logMessage('nx', result);
        return;
      }

      // Direct keyword search heuristics
      if (lower.includes('sanjay') || lower.includes('engineer') || lower.includes('about')) {
        this.logMessage('nx', this.commands['whoami'].run());
        return;
      }
      if (lower.includes('project') || lower.includes('system')) {
        this.logMessage('nx', this.commands['/projects'].run());
        return;
      }
      if (lower.includes('stack') || lower.includes('skill') || lower.includes('tool')) {
        this.logMessage('nx', this.commands['/stack'].run());
        return;
      }
      if (lower.includes('fireblade')) {
        this.logMessage('nx', this.commands['/fireblade'].run());
        return;
      }
      if (lower.includes('hyperspeed')) {
        this.logMessage('nx', this.commands['/hyperspeed'].run());
        return;
      }
      if (lower.includes('stratos')) {
        this.logMessage('nx', this.commands['/stratos'].run());
        return;
      }
      if (lower.includes('decibel')) {
        this.logMessage('nx', this.commands['/decibel'].run());
        return;
      }

      // Default deterministic guidance
      this.logMessage('nx', `Command not recognized: "${rawInput}".
Type \`/help\` to inspect all available commands, or ask about FIREBLADE, HYPERSPEED, STRATOS, DECIBEL, or Sanjay's engineering stack.`);
    },

    logMessage: function (type, text) {
      const row = document.createElement('div');
      row.className = `term-row ${type}`;

      const badge = document.createElement('span');
      badge.className = 'term-badge';
      badge.textContent = type === 'user' ? 'YOU' : type === 'nx' ? 'NX-01' : 'SYSTEM';

      const msg = document.createElement('span');
      msg.className = 'term-msg';
      // Format line breaks cleanly
      msg.innerHTML = text.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code>$1</code>');

      row.appendChild(badge);
      row.appendChild(msg);
      DOM.terminalLog.appendChild(row);

      // Auto-scroll to bottom
      DOM.terminalLog.scrollTop = DOM.terminalLog.scrollHeight;
    }
  };

  // --------------------------------------------------------------------------
  // 6. SYSTEM ARCHITECTURE INSPECTOR MODAL
  // --------------------------------------------------------------------------
  const ModalInspector = {
    data: {
      fireblade: {
        tag: 'FIELD SYSTEMS // TELEMETRY',
        title: 'FIREBLADE — Business Call Intelligence',
        objective: 'Eliminate lost enquiries and maintain an auditable trail of business telephone calls conducted across mobile employee handsets.',
        pipeline: 'Android Telephony Listener → Batch Metadata Serialization → Encrypted Ingestion API (FastAPI) → PostgreSQL Database → Real-time Enquiry Dashboard & Callback Workflows.',
        scale: '20 employee phones in daily business use · Automated callback tracking · Zero reported handset battery degradation.',
        stack: ['Kotlin', 'Android Background Service', 'FastAPI', 'PostgreSQL', 'Tailwind / React'],
        caseUrl: 'https://sanjay-fde.vercel.app/work/fireblade',
        diagram: `[Android Handsets (20 Devices)]
       │
       ▼ (Encrypted HTTPS Telemetry)
[FastAPI Ingestion Endpoint]
       │
       ▼ (Normalization & Validation)
[PostgreSQL Relational DB]
       │
       ▼ (Real-time Sync)
[Web Intelligence & Callback Dashboard]`
      },
      hyperspeed: {
        tag: 'AUTOMATION & EXTRACTION // HIGH THROUGHPUT',
        title: 'HYPERSPEED — Email & Catalog Extraction',
        objective: 'Convert messy, unstructured supplier quotations into clean, machine-actionable product listings and price matrices.',
        pipeline: 'Authenticated Gmail Watchers → Document Router → PDF/Image OCR Engine → Field Parser & Schema Normalization → Deduplication & Database Sync.',
        scale: '~200,000 supplier emails ingested · ~70,000 product records extracted with verified pricing and SKU attributes.',
        stack: ['Python', 'Gmail API', 'Tesseract OCR / PDFPlumber', 'SQLite', 'Pandas'],
        caseUrl: 'https://sanjay-fde.vercel.app/work/hyperspeed',
        diagram: `[Supplier Email Stream (~200K)]
       │
       ▼ (IMAP / Gmail API Ingest)
[Document Routing Engine]
       │
       ▼ (PDF / Image OCR Extraction)
[Schema Normalization & Entity Matcher]
       │
       ▼ (Structured Export)
[Product & Pricing Catalog (~70K SKUs)]`
      },
      stratos: {
        tag: 'GENERATIVE AI // SOURCE-GROUNDED',
        title: 'STRATOS — Source-Grounded Assistant',
        objective: 'Deliver an conversational customer-facing assistant capable of answering complex inventory questions without hallucinating fictional specs or false prices.',
        pipeline: 'Catalogue Ingestion (69,070 Items) → Vector Embedding Generation → Hybrid Retrieval Engine → Context-Constrained Prompt Construction → Gemini API → Attributed Response with Source Citations.',
        scale: '69,070 catalogue products indexed · 100% of answers cite specific verified catalogue records.',
        stack: ['Gemini API', 'Vector Embeddings', 'TypeScript', 'Next.js', 'PostgreSQL / pgvector'],
        caseUrl: 'https://sanjay-fde.vercel.app/work/stratos',
        diagram: `[User Query / Specification Request]
       │
       ▼ (Embedding & Keyword Hybrid Search)
[Catalogue Database (69,070 Products)]
       │
       ▼ (Verified Retrieved Records)
[Context-Constrained Prompt Generator]
       │
       ▼ (Gemini Model Inference)
[Traceable Answer + Exact Source Citations]`
      },
      decibel: {
        tag: 'ENTERPRISE CRM // CROSS-DEPARTMENT',
        title: 'DECIBEL — Departmental Operations Engine',
        objective: 'Coordinate multi-stage sales, servicing, and logistics tasks across multiple business departments with zero missed transitions.',
        pipeline: 'Central Enquiry Inbound → Permission-Aware Department Dispatch → Multi-Stage Task Kanban → Automated SLA Escalations → Supabase Persistent Storage.',
        scale: '3 business departments unified · 19 passing end-to-end regression tests validating cross-department data integrity.',
        stack: ['React', 'FastAPI', 'Supabase', 'Playwright E2E Tests', 'PostgreSQL'],
        caseUrl: 'https://sanjay-fde.vercel.app/work/decibel',
        diagram: `[Inbound Customer Enquiry]
       │
       ▼ (Departmental Dispatch Router)
┌──────────────┬──────────────┬──────────────┐
▼              ▼              ▼
[Sales Queue]  [Service Desk] [Dispatch Team]
└──────────────┴──────────────┴──────────────┘
       │ (19 E2E Passing Test Checks)
       ▼
[Persistent Audit Log & Supabase Sync]`
      }
    },

    init: function () {
      DOM.inspectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sysId = btn.dataset.inspect;
          this.open(sysId);
        });
      });

      if (DOM.modalCloseBtn) {
        DOM.modalCloseBtn.addEventListener('click', () => this.close());
      }
      if (DOM.modalDoneBtn) {
        DOM.modalDoneBtn.addEventListener('click', () => this.close());
      }
      if (DOM.modalBackdrop) {
        DOM.modalBackdrop.addEventListener('click', () => this.close());
      }
    },

    open: function (id) {
      const item = this.data[id];
      if (!item) return;

      DOM.modalTag.textContent = item.tag;
      DOM.modalTitle.textContent = item.title;
      DOM.modalObjective.textContent = item.objective;
      DOM.modalPipeline.textContent = item.pipeline;
      DOM.modalScale.textContent = item.scale;
      DOM.modalCaseLink.href = item.caseUrl;

      // Render tags
      DOM.modalStack.innerHTML = '';
      item.stack.forEach(tech => {
        const span = document.createElement('span');
        span.textContent = tech;
        DOM.modalStack.appendChild(span);
      });

      // Render ASCII Diagram
      DOM.modalDiagramArt.innerHTML = `<pre style="margin:0;font-family:inherit;font-size:inherit;">${item.diagram}</pre>`;

      DOM.archModal.hidden = false;
      document.body.style.overflow = 'hidden';
      DOM.modalCloseBtn.focus();
    },

    close: function () {
      DOM.archModal.hidden = true;
      document.body.style.overflow = '';
    }
  };

  // --------------------------------------------------------------------------
  // 7. KEYBOARD SHORTCUTS & GLOBAL LISTENER
  // --------------------------------------------------------------------------
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Escape closes modal or skips boot
      if (e.key === 'Escape') {
        if (!DOM.archModal.hidden) {
          ModalInspector.close();
          return;
        }
        if (!DOM.bootOverlay.classList.contains('boot-completed')) {
          BootEngine.dismiss(false);
          return;
        }
      }

      // Ignore numbers / shortcuts when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }

      // Keys 1..5 for mode switching
      const keyMap = {
        '1': 'ready',
        '2': 'wave',
        '3': 'scan',
        '4': 'think',
        '5': 'sleep'
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        RobotController.setMode(keyMap[e.key]);
        return;
      }

      // '/' focuses terminal input
      if (e.key === '/') {
        e.preventDefault();
        DOM.terminalInput.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. INITIALIZATION LIFECYCLE
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    ThemeEngine.init();
    BootEngine.init();
    RobotController.init();
    ConsoleEngine.init();
    ModalInspector.init();
    initKeyboardShortcuts();
  });

})();
