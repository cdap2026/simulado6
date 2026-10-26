/**
 * Simulador Interactivo: Métodos de Separación de Mezclas
 * Diseñado para 6° Grado de Educación Básica Secundaria
 */

// 1. Base de datos de mezclas pedagógicas
const mixtures = [
  {
    id: "arena-hierro",
    name: "Arena y Limaduras de Hierro",
    type: "Mezcla Heterogénea (Sólido - Sólido)",
    icon: "🔩",
    correctMethod: "imantacion",
    property: "Propiedad aprovechada: Ferromagnetismo del hierro.",
    explanation: "¡Correcto! El imán atrae el hierro gracias a sus propiedades magnéticas, dejando la arena intacta en el recipiente.",
    failMessage: "Inténtalo de nuevo. Piensa: uno de los dos materiales es atraído por campos magnéticos."
  },
  {
    id: "agua-aceite",
    name: "Agua y Aceite",
    type: "Mezcla Heterogénea (Líquido - Líquido)",
    icon: "🛢️",
    correctMethod: "decantacion",
    property: "Propiedad aprovechada: Diferencia de densidades e inmiscibilidad.",
    explanation: "¡Muy bien! Como el aceite es menos denso que el agua y no se disuelve en ella, flota. Usamos un embudo de decantación para extraer el agua por la llave inferior.",
    failMessage: "No funcionaría. Recuerda que son dos líquidos que no se mezclan y tienen diferente densidad."
  },
  {
    id: "agua-arena",
    name: "Agua y Arena",
    type: "Mezcla Heterogénea (Sólido insoluble en Líquido)",
    icon: "🏖️",
    correctMethod: "filtracion",
    property: "Propiedad aprovechada: Tamaño de partículas (sólido insoluble).",
    explanation: "¡Excelente! El papel de filtro retiene las partículas gruesas de arena y permite el paso del agua limpia hacia el matraz.",
    failMessage: "Prueba otra técnica. Tienes un sólido que no se disuelve suspendido en agua."
  },
  {
    id: "agua-sal",
    name: "Agua con Sal",
    type: "Mezcla Homogénea (Solución Líquido - Sólido soluble)",
    icon: "🧂",
    correctMethod: "evaporacion",
    property: "Propiedad aprovechada: Diferencia en el punto de ebullición.",
    explanation: "¡Perfecto! Al calentar con el mechero, el agua se evapora a 100 °C y los cristales de sal quedan en el fondo del recipiente.",
    failMessage: "Ten cuidado: la sal está completamente disuelta en el agua; un filtro no la retendría."
  },
  {
    id: "harina-arroz",
    name: "Harina y Granos de Arroz",
    type: "Mezcla Heterogénea (Sólido - Sólido de diferente tamaño)",
    icon: "🌾",
    correctMethod: "tamizado",
    property: "Propiedad aprovechada: Diferencia en el tamaño de las partículas.",
    explanation: "¡Gran trabajo! El tamiz (colador) tiene una malla que retiene los granos grandes de arroz y deja caer la harina fina.",
    failMessage: "Revisa bien: ninguno de los sólidos es magnético ni se disuelve; difieren principalmente en su tamaño."
  }
];

// 2. Métodos de separación disponibles
const methods = [
  { id: "filtracion", name: "Filtración", icon: "☕", desc: "Embudo y papel de filtro" },
  { id: "decantacion", name: "Decantación", icon: "🧪", desc: "Embudo de separación por densidad" },
  { id: "imantacion", name: "Imantación", icon: "🧲", desc: "Separación por atracción magnética" },
  { id: "evaporacion", name: "Evaporación", icon: "🔥", desc: "Calentamiento con mechero Bunsen" },
  { id: "tamizado", name: "Tamizado", icon: "🕸️", desc: "Malla o colador según tamaño de grano" }
];

// Estado global
let currentMixture = null;
let score = 0;
const solvedMixtures = new Set();

// Elementos DOM
const mixtureListEl = document.getElementById("mixture-list");
const toolsGridEl = document.getElementById("tools-grid");
const workbenchStatusEl = document.getElementById("workbench-status");
const apparatusContainerEl = document.getElementById("apparatus-container");
const feedbackCardEl = document.getElementById("feedback-card");
const feedbackIconEl = document.getElementById("feedback-icon");
const feedbackTitleEl = document.getElementById("feedback-title");
const feedbackTextEl = document.getElementById("feedback-text");
const propertyTagEl = document.getElementById("property-tag");
const scoreEl = document.getElementById("score");
const completedCountEl = document.getElementById("completed-count");
const btnReset = document.getElementById("btn-reset");

// Inicialización de la interfaz
function init() {
  renderMixtures();
  renderTools();
  btnReset.addEventListener("click", resetAll);
}

// Renderizar lista de mezclas
function renderMixtures() {
  mixtureListEl.innerHTML = "";
  mixtures.forEach(mix => {
    const card = document.createElement("div");
    card.className = `mixture-card ${currentMixture?.id === mix.id ? "active" : ""} ${solvedMixtures.has(mix.id) ? "solved" : ""}`;
    card.innerHTML = `
      <div class="mixture-icon">${mix.icon}</div>
      <div class="mixture-info">
        <h4>${mix.name}</h4>
        <p>${mix.type}</p>
      </div>
    `;
    card.onclick = () => selectMixture(mix);
    mixtureListEl.appendChild(card);
  });
}

// Renderizar métodos
function renderTools() {
  toolsGridEl.innerHTML = "";
  methods.forEach(tool => {
    const card = document.createElement("div");
    card.className = "tool-card";
    card.innerHTML = `
      <div class="tool-icon">${tool.icon}</div>
      <div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.desc}</div>
      </div>
    `;
    card.onclick = () => attemptSeparation(tool.id);
    toolsGridEl.appendChild(card);
  });
}

// Selección de mezcla
function selectMixture(mix) {
  currentMixture = mix;
  feedbackCardEl.style.display = "none";
  renderMixtures();

  workbenchStatusEl.innerHTML = `
    <p>🧪 <strong>Muestra en mesa:</strong> ${mix.name} (${mix.type}).</p>
    <small>Selecciona a la derecha el método que deseas aplicar.</small>
  `;

  apparatusContainerEl.innerHTML = `
    <div class="stage-anim">
      <div class="apparatus-illustration">${mix.icon}</div>
      <p style="font-weight:700; color: #334155;">Muestra lista para procesar</p>
    </div>
  `;
}

// Validación de la hipótesis / intento
function attemptSeparation(methodId) {
  if (!currentMixture) {
    alert("Primero selecciona una mezcla en el panel izquierdo.");
    return;
  }

  const isCorrect = currentMixture.correctMethod === methodId;
  feedbackCardEl.style.display = "block";

  if (isCorrect) {
    if (!solvedMixtures.has(currentMixture.id)) {
      solvedMixtures.add(currentMixture.id);
      score += 20; // 5 mezclas = 100 puntos
      updateScoreboard();
    }

    feedbackCardEl.className = "feedback-card correct";
    feedbackIconEl.textContent = "✅";
    feedbackTitleEl.textContent = "¡Separación Exitosa!";
    feedbackTextEl.textContent = currentMixture.explanation;
    propertyTagEl.textContent = currentMixture.property;

    apparatusContainerEl.innerHTML = `
      <div class="stage-anim">
        <div class="apparatus-illustration">🎉</div>
        <p style="font-weight:800; color:#16a34a;">¡Componentes separados con éxito!</p>
      </div>
    `;
  } else {
    feedbackCardEl.className = "feedback-card incorrect";
    feedbackIconEl.textContent = "❌";
    feedbackTitleEl.textContent = "Método Incompatible";
    feedbackTextEl.textContent = currentMixture.failMessage;
    propertyTagEl.textContent = "Pista: Analiza las propiedades físicas de ambos componentes.";

    apparatusContainerEl.innerHTML = `
      <div class="stage-anim">
        <div class="apparatus-illustration">⚠️</div>
        <p style="font-weight:700; color:#dc2626;">La mezcla no se pudo separar con este método.</p>
      </div>
    `;
  }

  renderMixtures();
}

// Actualizar marcadores
function updateScoreboard() {
  scoreEl.textContent = `${score} pts`;
  completedCountEl.textContent = `${solvedMixtures.size} / ${mixtures.length}`;
}

// Reiniciar laboratorio
function resetAll() {
  currentMixture = null;
  score = 0;
  solvedMixtures.clear();
  updateScoreboard();
  renderMixtures();
  feedbackCardEl.style.display = "none";
  workbenchStatusEl.innerHTML = `<p>🧪 Selecciona una mezcla de la izquierda para comenzar el experimento.</p>`;
  apparatusContainerEl.innerHTML = `
    <div class="placeholder-beaker">
      <span class="beaker-icon">⚗️</span>
      <p>Mesa de trabajo limpia</p>
    </div>
  `;
}

// Iniciar aplicación
document.addEventListener("DOMContentLoaded", init);
