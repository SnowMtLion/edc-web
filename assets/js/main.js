/* 梅斯医学官网 · 交互脚本 */
(function () {
  'use strict';

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }

  /* ---------- 滚动揭示动画 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字滚动 ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var unit = el.querySelector('.u');
    var unitHTML = unit ? unit.outerHTML : '';
    var dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.innerHTML = val + unitHTML;
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = target + unitHTML;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.num[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { animateCount(el); });
  }

  /* ---------- FAQ 折叠 ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var a = item.querySelector('.faq-a');
      var isOpen = item.classList.toggle('open');
      a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- 通用提交反馈（联系表单 / 需求调研表） ---------- */
  function bindIntake(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var ok = true;
      required.forEach(function (f) {
        if (!f.value.trim()) { ok = false; f.style.borderColor = '#d9534f'; }
        else { f.style.borderColor = ''; }
      });
      var email = form.querySelector('#email');
      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        ok = false; email.style.borderColor = '#d9534f';
      }
      if (!ok) return;
      var success = form.querySelector('.form-success') || document.getElementById('formSuccess');
      if (success) success.classList.add('show');
      form.reset();
      success && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  bindIntake('contactForm');
  bindIntake('assessmentForm');

  /* ---------- 打印 / 保存为 PDF ---------- */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }
})();
