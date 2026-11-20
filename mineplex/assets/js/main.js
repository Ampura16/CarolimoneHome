/**
 * Mineplex 粉丝复刻站 · 交互脚本
 * 功能：i18n 初始化与切换 / Hero 视差 / 选项卡 / 复制 IP / 游戏弹窗 / 回到顶部
 */
(function () {
  'use strict';

  var SERVER_IP = 'play.mineplex.com';

  /* ---------------- i18n ---------------- */
  function initI18n() {
    if (!window.I18N) return;
    I18N.init();
    var toggles = document.querySelectorAll('[data-lang-toggle]');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () { I18N.toggle(); });
    });
    document.addEventListener('i18n:changed', function () {
      var titleKey = document.body.getAttribute('data-title-key');
      if (titleKey) document.title = I18N.t(titleKey);
    });
    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey) document.title = I18N.t(titleKey);
  }

  /* ---------------- 当前页导航高亮 ---------------- */
  function markActiveNav() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });
  }

  /* ---------------- 移动端菜单 ---------------- */
  function initMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  /* ---------------- Hero 视差（鼠标 + 自动漂移） ---------------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var layers = hero.querySelectorAll('.hero-layer');
    var mx = 0, tx = 0;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
    });
    hero.addEventListener('mouseleave', function () { tx = 0; });

    var start = performance.now();
    function frame(now) {
      mx += (tx - mx) * 0.06;
      var t = (now - start) / 1000;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute('data-depth') || '10');
        var drift = (t * (2 + depth * 0.25)) % 400;      // 自动缓慢漂移
        var shift = mx * depth * 2.2;                     // 鼠标视差
        layer.style.transform = 'translateX(' + (shift - drift) + 'px)';
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- 选项卡 ---------------- */
  function initTabs() {
    var btns = document.querySelectorAll('.tab-btn');
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === target);
        });
      });
    });
  }

  /* ---------------- Toast ---------------- */
  var toastTimer = null;
  function showToast(msg) {
    var toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* ---------------- 复制服务器 IP ---------------- */
  function initCopyIp() {
    document.querySelectorAll('[data-copy-ip]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var done = function () {
          showToast(window.I18N ? I18N.t('hero.ip_copied') : 'Copied!');
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(SERVER_IP).then(done, function () { fallbackCopy(done); });
        } else {
          fallbackCopy(done);
        }
      });
    });
  }
  function fallbackCopy(cb) {
    var ta = document.createElement('textarea');
    ta.value = SERVER_IP;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
    cb();
  }

  /* ---------------- 游戏详情弹窗 ---------------- */
  function initGameModal() {
    var mask = document.querySelector('.modal-mask');
    if (!mask) return;
    var img = mask.querySelector('img');
    var title = mask.querySelector('h3');
    var desc = mask.querySelector('p');

    document.querySelectorAll('.game-card[data-game]').forEach(function (card) {
      card.addEventListener('click', function () {
        var key = card.getAttribute('data-game');
        if (window.I18N) {
          title.textContent = I18N.t('games.items.' + key + '.name');
          desc.textContent = I18N.t('games.items.' + key + '.desc');
        } else {
          title.textContent = card.querySelector('span').textContent;
          desc.textContent = '';
        }
        img.src = card.querySelector('img').src;
        img.alt = title.textContent;
        mask.classList.add('open');
      });
    });

    function close() { mask.classList.remove('open'); }
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.querySelectorAll('[data-modal-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------------- 回到顶部 ---------------- */
  function initBackTop() {
    var btn = document.querySelector('.back-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- 在线人数轻微波动（展示用途） ---------------- */
  function initPlayerCount() {
    var el = document.querySelector('[data-player-count]');
    if (!el) return;
    var base = 68;
    setInterval(function () {
      el.textContent = String(base + Math.floor(Math.random() * 9 - 4));
    }, 6000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initI18n();
    markActiveNav();
    initMenu();
    initHero();
    initTabs();
    initCopyIp();
    initGameModal();
    initBackTop();
    initPlayerCount();
  });
})();
