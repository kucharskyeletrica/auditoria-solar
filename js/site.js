// Animações do site (entrada ao rolar, contadores e cabeçalho).
// Fica em arquivo separado porque a política de segurança do site não permite scripts dentro do HTML.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Contador: anima de 0 até o valor de data-count quando aparece na tela
  function contar(el) {
    var alvo = parseInt(el.getAttribute('data-count'), 10);
    if (reduz || !alvo) return;
    var inicio = null, dur = 1100;
    function passo(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / dur, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    }
    el.textContent = '0';
    requestAnimationFrame(passo);
  }

  var itens = document.querySelectorAll('.reveal, .circle-reveal');
  if (!('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(contar);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Revelação circular: o navegador considera um elemento recortado como "invisível",
  // então aqui a posição é conferida na rolagem em vez de usar o observador.
  var circulos = Array.prototype.slice.call(document.querySelectorAll('.circle-reveal'));
  function confereCirculos() {
    circulos = circulos.filter(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.8) { el.classList.add('in'); return false; }
      return true;
    });
  }

  // Cabeçalho ganha uma linha fina depois que a página rola
  var nav = document.querySelector('.nav');
  function rolou() { nav.classList.toggle('scrolled', window.scrollY > 8); if (circulos.length) confereCirculos(); }
  window.addEventListener('scroll', rolou, { passive: true });
  rolou();
});
