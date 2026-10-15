(() => {
  const PHONE = "77770957701";

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const toggleMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- WhatsApp links with prefilled text ---------- */
  const waLink = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  document.querySelectorAll(".js-wa").forEach((a) => {
    a.href = waLink("Здравствуйте! Хочу заказать обработку. Подскажите, пожалуйста, стоимость.");
  });

  /* ---------- Matrix rain ---------- */
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chars = "0123456789";
  const size = 16;
  let cols = 0, drops = [], raf, last = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(canvas.offsetWidth / size);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  };

  const draw = (t) => {
    raf = requestAnimationFrame(draw);
    if (t - last < 55) return;
    last = t;
    ctx.fillStyle = "rgba(5, 8, 5, 0.12)";
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * size;
      ctx.fillStyle = Math.random() > 0.96 ? "#c8ffd5" : "#2bd95a";
      ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, y);
      if (y > canvas.offsetHeight && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  };

  resize();
  window.addEventListener("resize", resize);
  if (reduce) {
    for (let k = 0; k < 40; k++) draw(k * 100);
    cancelAnimationFrame(raf);
  } else {
    raf = requestAnimationFrame(draw);
    // Pause when hero is off-screen
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  /* ---------- Calculator ---------- */
  const fmt = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ");
  const state = { type: "flat", rooms: 1 };
  const flatPrices = { 1: [15000, 20000], 2: [20000, 25000], 3: [25000, 30000] };

  const sumEl = document.getElementById("calcSum");
  const hintEl = document.getElementById("calcHint");
  const waEl = document.getElementById("calcWa");
  const area = document.getElementById("area");
  const sotka = document.getElementById("sotka");
  const pest = document.getElementById("pest");

  const calc = () => {
    let range, label, hint = "Окончательную цену мастер назовёт после осмотра.";
    if (state.type === "flat") {
      if (state.rooms === 4) {
        range = null;
        label = "квартира 4+ комнат";
        hint = "Для больших квартир стоимость рассчитывается индивидуально.";
      } else {
        range = flatPrices[state.rooms];
        label = `${state.rooms}-комнатная квартира`;
      }
    } else if (state.type === "house") {
      const a = +area.value;
      range = [a * 300, a * 400];
      label = `частный дом ${a} м²`;
    } else {
      const s = +sotka.value;
      range = [s * 3000, s * 5000];
      label = `участок ${s} сот.`;
    }

    const text = range ? `${fmt(range[0])} – ${fmt(range[1])} ₸` : "по запросу";
    sumEl.textContent = text;
    hintEl.textContent = hint;
    waEl.href = waLink(
      `Здравствуйте! Нужна обработка: ${pest.value.toLowerCase()}, ${label}. ` +
      `Ориентировочная цена с сайта: ${text}. Когда сможете приехать?`
    );
  };

  document.querySelectorAll(".calc__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".calc__tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      state.type = tab.dataset.type;
      document.querySelectorAll(".calc__field[data-for]").forEach((f) => {
        f.hidden = f.dataset.for !== state.type;
      });
      calc();
    });
  });

  document.querySelectorAll(".seg__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      state.rooms = +btn.dataset.rooms;
      calc();
    });
  });

  area.addEventListener("input", () => { document.getElementById("areaOut").textContent = area.value; calc(); });
  sotka.addEventListener("input", () => { document.getElementById("sotkaOut").textContent = sotka.value; calc(); });
  pest.addEventListener("change", calc);
  calc();

  document.getElementById("year").textContent = new Date().getFullYear();
})();
