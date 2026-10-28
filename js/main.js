/* «МОЙ ЗУБНОЙ» — логика сайта */
(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s, c){ return (c || document).querySelector(s); }
function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

/* Тень шапки при прокрутке */
var hdr = $('#hdr');
if(hdr){
  addEventListener('scroll', function(){ hdr.classList.toggle('scrolled', scrollY > 10); }, {passive:true});
}

/* Бургер-меню */
var burger = $('#burger'), nav = $('#nav');
if(burger && nav){
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('a', nav).forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); });
  });
}

/* Плавное появление блоков */
var rvs = $$('.rv');
if(reduce || !('IntersectionObserver' in window)){
  rvs.forEach(function(el){ el.classList.add('on'); });
}else{
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  rvs.forEach(function(el){ io.observe(el); });
}

/* Анимация цифр */
var counts = $$('.count');
function runCount(el){
  var to = +el.dataset.to || 0, t0 = null;
  function step(t){
    if(!t0) t0 = t;
    var p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if(counts.length){
  if(reduce || !('IntersectionObserver' in window)){
    counts.forEach(function(el){ el.textContent = el.dataset.to; });
  }else{
    var io2 = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ runCount(e.target); io2.unobserve(e.target); }
      });
    }, {threshold:.5});
    counts.forEach(function(el){ io2.observe(el); });
  }
}

/* Вопросы-ответы */
$$('.faq-q').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.closest('.faq-item'),
        a = item.querySelector('.faq-a'),
        open = item.classList.contains('open');
    $$('.faq-item.open').forEach(function(i){
      i.classList.remove('open');
      var fa = i.querySelector('.faq-a'); if(fa) fa.style.maxHeight = null;
      var q = i.querySelector('.faq-q'); if(q) q.setAttribute('aria-expanded','false');
    });
    if(!open){
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
      btn.setAttribute('aria-expanded','true');
    }
  });
});

/* ======= ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ ======= */
var htmlEl = document.documentElement,
    a11yBtn = $('#a11yBtn'),
    a11yCtrl = $('#a11yCtrl');
function store(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
function read(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
var savedStep = read('mbA11yStep') || '0';

function applyA11y(on, step){
  htmlEl.classList.toggle('a11y', !!on);
  htmlEl.classList.remove('a11y-sm', 'a11y-lg');
  if(on && step === '-1') htmlEl.classList.add('a11y-sm');
  if(on && step === '1')  htmlEl.classList.add('a11y-lg');
  if(a11yCtrl) a11yCtrl.hidden = !on;
  if(a11yBtn){
    a11yBtn.textContent = on ? 'Обычная версия' : '👁 Версия для слабовидящих';
    a11yBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  store('mbA11y', on ? '1' : '0');
  store('mbA11yStep', step || '0');
}
if(a11yBtn){
  applyA11y(read('mbA11y') === '1', savedStep);
  a11yBtn.addEventListener('click', function(){
    var on = htmlEl.classList.contains('a11y');
    applyA11y(!on, savedStep);
  });
  if(a11yCtrl){
    $$('button', a11yCtrl).forEach(function(b){
      b.addEventListener('click', function(){
        savedStep = b.dataset.step;
        applyA11y(true, savedStep);
      });
    });
  }
}

/* Cookie-баннер */
var cookie = $('#cookie');
if(cookie){
  if(read('mbCookie') !== '1'){
    setTimeout(function(){ cookie.classList.add('show'); }, 1000);
  }
  var ok = $('#cookieOk');
  if(ok){
    ok.addEventListener('click', function(){
      store('mbCookie','1');
      cookie.classList.remove('show');
    });
  }
}

/* Текущий год в подвале */
$$('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();