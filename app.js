/* Los gurús del trading · Grupo 8 · comportamiento de la web */

// Encuesta: 60 respuestas (Google Forms, 12 al 19 de noviembre de 2026).
// Cifras transcritas de los gráficos de Google Forms; destacar = índices de las filas que se resaltan.
const N = 60;
const ENCUESTA = {
  1: { pregunta: "¿Sueles encontrar videos de gurús o creadores de contenido relacionados con el trading en tus redes sociales?", tipo: "Una respuesta",
       filas: [["Sí, frecuentemente", 16], ["Sí, algunas veces", 29], ["Casi nunca", 12], ["Nunca", 3]], destacar: [0, 1] },
  2: { pregunta: "¿En qué redes sociales has visto principalmente este tipo de contenido?", tipo: "Varias respuestas",
       filas: [["TikTok", 41], ["Instagram", 40], ["YouTube", 18], ["Facebook", 7], ["No he visto este contenido", 6], ["X (Twitter)", 4], ["Otras (LinkedIn y otra)", 2]], destacar: [0, 1] },
  3: { pregunta: "¿Con qué frecuencia te aparecen videos relacionados con trading, inversiones o educación financiera?", tipo: "Una respuesta",
       filas: [["Todos los días", 6], ["Varias veces por semana", 21], ["Una vez por semana", 12], ["Rara vez", 17], ["Nunca", 4]], destacar: [0, 1] },
  4: { pregunta: "¿Qué aspectos se repiten más en los videos de estos creadores?", tipo: "Varias respuestas",
       filas: [["Estilos de vida lujosos (autos, viajes, casas)", 42], ["Promesas de ganar mucho dinero", 39], ["Consejos para alcanzar la libertad financiera", 34], ["Historias de éxito personal", 28], ["Clases o explicaciones sobre trading", 21], ["Promociones de cursos o mentorías", 20]], destacar: [0, 1] },
  5: { pregunta: "¿Qué es lo que más llama tu atención de este tipo de contenido?", tipo: "Varias respuestas",
       filas: [["La posibilidad de ganar dinero", 30], ["El estilo de vida que muestran", 24], ["Los consejos financieros", 23], ["No me llama la atención", 20], ["La curiosidad por aprender algo nuevo", 12], ["La personalidad del creador", 7]], destacar: [0, 1] },
  6: { pregunta: "¿Qué tan creíbles te parecen los resultados económicos que muestran estos creadores?", tipo: "Una respuesta",
       filas: [["Muy creíbles", 4], ["Algo creíbles", 15], ["Poco creíbles", 21], ["Nada creíbles", 10], ["No sabría decirlo", 10]], destacar: [0, 1] },
  7: { pregunta: "¿Has sentido curiosidad o interés por aprender trading después de ver este tipo de videos?", tipo: "Una respuesta",
       filas: [["Sí, bastante", 9], ["Sí, un poco", 24], ["Muy pocas veces", 19], ["Nunca", 8]], destacar: [0, 1] },
  8: { pregunta: "¿Qué recurso crees que utilizan más estos creadores para convencer a los jóvenes?", tipo: "Varias respuestas",
       filas: [["Mostrar lujos y bienes materiales", 44], ["Prometer independencia económica", 39], ["Presentar testimonios de personas exitosas", 26], ["Mostrar supuestas ganancias en poco tiempo", 24], ["Ofrecer cursos gratuitos o de pago", 20], ["Utilizar frases motivacionales", 18]], destacar: [0, 1] },
  9: { pregunta: "¿Alguna vez has considerado comprar un curso, mentoría o membresía ofrecida por un gurú del trading?", tipo: "Una respuesta",
       filas: [["Sí", 2], ["Lo he considerado, pero no lo hice", 21], ["No", 32], ["No conozco ese tipo de ofertas", 5]], destacar: [0, 1] },
};

// Observación: codificación de los 18 comentarios de seguidores (Llados, El Sensei y Rayan Lewiis).
const OBSERVACION = {
  comentarios: { total: 18, unidad: "comentarios",
    filas: [["Piden entrar o más información", 10], ["Admiración o identificación", 6], ["Testimonio", 1], ["Ambiguo", 1]], destacar: [0] },
};

const pct = (v, total) => (v / total * 100).toFixed(1).replace(/\.0$/, "").replace(".", ",");

function dibujarFilas(contenedor, datos, total, unidad) {
  const max = Math.max(...datos.filas.map(f => f[1]));
  const ul = document.createElement("ul");
  ul.className = "filas";
  datos.filas.forEach(([etiqueta, valor], i) => {
    const li = document.createElement("li");
    li.className = "fila" + (datos.destacar.includes(i) ? " fila--destacada" : "");
    li.tabIndex = 0;
    const p = pct(valor, total);
    li.dataset.globo = `${etiqueta}: ${valor} de ${total} ${unidad} · ${p} %`;
    li.setAttribute("aria-label", li.dataset.globo);
    li.innerHTML = `
      <span class="fila__etiqueta">${etiqueta}</span>
      <span class="fila__pista" aria-hidden="true"><span class="fila__barra" data-ancho="${(valor / max * 100).toFixed(2)}"></span></span>
      <span class="fila__valor">${valor} · ${p} %</span>`;
    ul.appendChild(li);
  });
  contenedor.appendChild(ul);
}

document.querySelectorAll("[data-pregunta]").forEach(el => {
  const n = el.dataset.pregunta;
  const d = ENCUESTA[n];
  if (!d) return;
  const zona = el.querySelector(".zona-filas");
  dibujarFilas(zona, d, N, "encuestados");
});
document.querySelectorAll("[data-observacion]").forEach(el => {
  const d = OBSERVACION[el.dataset.observacion];
  if (d) dibujarFilas(el.querySelector(".zona-filas"), d, d.total, d.unidad);
});

// Las barras crecen cuando el gráfico entra en pantalla
const crecer = (raiz) => raiz.querySelectorAll(".fila__barra").forEach(b => { b.style.width = b.dataset.ancho + "%"; });
const vigia = "IntersectionObserver" in window ? new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visto");
    crecer(e.target);
    vigia.unobserve(e.target);
  });
}, { threshold: 0.18 }) : null;
document.querySelectorAll(".aparece, .grafico").forEach(el => vigia ? vigia.observe(el) : (el.classList.add("visto"), crecer(el)));

// Globo de lectura al pasar el cursor o enfocar una barra
const globo = document.createElement("div");
globo.className = "globo";
globo.setAttribute("role", "status");
document.body.appendChild(globo);
function mostrar(texto, x, y) {
  globo.textContent = texto;
  globo.classList.add("visible");
  const r = globo.getBoundingClientRect();
  globo.style.left = Math.min(x + 14, innerWidth - r.width - 8) + "px";
  globo.style.top = Math.max(y - r.height - 12, 8) + "px";
}
document.addEventListener("pointermove", e => {
  const f = e.target.closest && e.target.closest("[data-globo]");
  if (f) mostrar(f.dataset.globo, e.clientX, e.clientY); else globo.classList.remove("visible");
});
document.addEventListener("focusin", e => {
  const f = e.target.closest && e.target.closest("[data-globo]");
  if (f) { const r = f.getBoundingClientRect(); mostrar(f.dataset.globo, r.left + r.width * .5, r.top); }
});
document.addEventListener("focusout", () => globo.classList.remove("visible"));

// Cinta de cotizaciones: se duplica para que el desplazamiento sea continuo
const pista = document.querySelector(".cinta__pista");
if (pista) pista.innerHTML += pista.innerHTML;

// Menú en celular
const boton = document.querySelector(".boton-menu");
const menu = document.querySelector(".menu");
if (boton && menu) boton.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  boton.setAttribute("aria-expanded", abierto);
});
