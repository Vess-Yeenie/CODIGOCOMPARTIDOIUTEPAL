const defaultTrabajos = [
  {
    id: 't1',
    nombre: "ESTRATEGIAS PARA EL MEJORAMIENTO EN EL PROCESO DE CALCULO, PAGO Y RETENCION DEL IMPUESTO AL VALOR AGREGADO (I.V.A.) EN LA EMPRESA RECTIFICADORA DE MOTORESJ&D C.A. DE MORÓN ESTADO CARABOBO",
    año: 2018,
    carrera: "ADMINISTRACION",
    tipo: "trabajo",
    pdf: "STRUCTURE/PDFs/TRABAJO DE GRADO MIXARI Y YOSMERY (1).pdf"
  },
  {
    id: 't2',
    nombre: "Diseño de un Sistema automatizado que registre y controle la matrícula de los alumnos de la Escuela Básica Nacional “Taborda”, ubicada en Puerto Cabello, Estado Carabobo.",
    año: 2018,
    carrera: "INFORMATICA",
    tipo: "trabajo",
    pdf: "STRUCTURE/PDFs/TRABAJO DE GRADO INFORMATICA.pdf"
  },
  {
    id: 't3',
    nombre: "ESTRATEGIAS MOTIVACIONALES PARA LA MEJORA DE LA SATISFACCIÓN LABORAL DE LOS EMPLEADOS EN LA EMPRESA MARTÍNEZ REYES ADUANA S.R.L.",
    año: 2021,
    carrera: "ADMINISTRACION",
    tipo: "presentacion",
    pdf: "STRUCTURE/PDFs/TG IUTEPAL EDUARDO BASTIDAS.pdf"
  },
  {
    id: 't4',
    nombre: "Sistema de Gestión de Mantenimiento Preventivo y Correctivo a las máquinas de ensacado de Urea del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.",
    año: 2024,
    carrera: "PRODUCCION",
    tipo: "resumen",
    pdf: "STRUCTURE/PDFs/TEG_Marbelis_Pérez PRODUCCION INDUSTRIAL.pdf"
  }
];

let trabajos = JSON.parse(localStorage.getItem('trabajosDeGrado')) || defaultTrabajos.slice();
// Asegurar ids únicos
trabajos = trabajos.map(item => ({ ...item, id: item.id || (Date.now().toString() + Math.random().toString(36).slice(2)) }));
localStorage.setItem('trabajosDeGrado', JSON.stringify(trabajos));

// Map para URLs creadas en sesión (no persisten al recargar)
const inMemoryPdfMap = {}; // id -> objectURL

// Referencias DOM
const contenedorCards = document.querySelector('.documents');
const searchInput = document.querySelector('.search-bar input');
const typeFilter = document.getElementById('typeFilter');
const yearSelect = document.getElementById('yearSelect');
const setYear = document.getElementById('setYear');
const selectedDate = document.getElementById('selectedDate');
// Nuevo: referencias para el dropdown de fecha
const dateDropdown = document.getElementById('dateDropdown');
const monthYearMenu = document.getElementById('monthYearMenu');
const addTrabajoBtn = document.getElementById('addTrabajoBtn');
const addTrabajoModal = document.getElementById('addTrabajoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addTrabajoForm = document.getElementById('addTrabajoForm');
const editingIdInput = document.getElementById('editingId');
// currentPdfInfo puede no existir en el DOM; guardamos la referencia y comprobamos antes de usar
const currentPdfInfo = document.getElementById('currentPdfInfo');

let selectedCarrera = null;
let selectedAno = 'todos';
let selectedTipo = 'todos';
let searchText = '';

// --- Renderizado de tarjetas desde arreglo ---
function renderCards() {
    contenedorCards.innerHTML = '';
    const now = new Date();
    // aplicar filtros sobre array antes de crear DOM
    let items = trabajos.filter(item => {
        const carreraMatch = selectedCarrera ? item.carrera.toUpperCase() === selectedCarrera : true;
        const anoMatch = (selectedAno === 'todos') ? true : String(item.año) === String(selectedAno);
        const tipoMatch = (selectedTipo === 'todos') ? true : item.tipo === selectedTipo;
        const searchMatch = searchText ? item.nombre.toLowerCase().includes(searchText) || (item.carrera && item.carrera.toLowerCase().includes(searchText)) : true;
        return carreraMatch && anoMatch && tipoMatch && searchMatch;
    });

    // si no hay carrera seleccionada, ordenar por año descendente
    if (!selectedCarrera) {
        items.sort((a, b) => b.año - a.año);
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.dataset.id = item.id;
        card.dataset.pdfUrl = item.pdf || '';
        card.dataset.carrera = item.carrera.toUpperCase();
        card.dataset.ano = item.año;
        card.dataset.tipo = item.tipo || 'trabajo';

        const xDiv = document.createElement('div');
        xDiv.className = 'doc-x';
        xDiv.innerHTML = '&#10006;';
        xDiv.style.display = (new Date().getFullYear() - item.año > 5) ? 'block' : 'none';
        card.appendChild(xDiv);

        const iconDiv = document.createElement('div');
        iconDiv.className = 'doc-icon';
        card.appendChild(iconDiv);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'doc-info';
        infoDiv.textContent = `${item.nombre}, ${item.carrera.charAt(0).toUpperCase() + item.carrera.slice(1).toLowerCase().replace('_', ' ')}, ${item.año}`;
        card.appendChild(infoDiv);

        // acciones: editar / eliminar
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        actions.innerHTML = `
            <button class="edit-btn" title="Editar" data-id="${item.id}">✎</button>
            <button class="delete-btn" title="Eliminar" data-id="${item.id}">🗑</button>
        `;
        card.appendChild(actions);

        contenedorCards.appendChild(card);
    });
}

// --- Utilidades ---
function saveToStorage() {
    localStorage.setItem('trabajosDeGrado', JSON.stringify(trabajos));
}

// --- Manejo de clicks delegados en sección de documentos ---
contenedorCards.addEventListener('click', (e) => {
    const btnEdit = e.target.closest('.edit-btn');
    const btnDelete = e.target.closest('.delete-btn');
    const card = e.target.closest('.doc-card');
    if (btnEdit) {
        const id = btnEdit.dataset.id;
        openEditModal(id);
        return;
    }
    if (btnDelete) {
        const id = btnDelete.dataset.id;
        if (confirm('¿Eliminar este documento?')) {
            deleteItem(id);
        }
        return;
    }
    if (card) {
        const id = card.dataset.id;
        // abrir PDF: preferir objectURL en memoria si existe
        const url = inMemoryPdfMap[id] || card.dataset.pdfurl || card.dataset.pdfUrl;
        if (url) window.open(url, '_blank');
        else console.error('PDF no disponible para este documento.');
    }
});

// --- Abrir modal para crear nuevo ---
addTrabajoBtn.addEventListener('click', () => {
    editingIdInput.value = '';
    addTrabajoForm.reset();
    if (currentPdfInfo) {
        currentPdfInfo.textContent = '';
        currentPdfInfo.style.display = 'none';
    }
    addTrabajoModal.style.display = 'flex';
});

// --- Abrir modal para editar ---
function openEditModal(id) {
    const item = trabajos.find(t => t.id === id);
    if (!item) return;
    editingIdInput.value = id;
    document.getElementById('trabajoNombre').value = item.nombre || '';
    document.getElementById('trabajoCarrera').value = item.carrera || '';
    document.getElementById('trabajoAno').value = item.año || '';
    document.getElementById('trabajoTipo').value = item.tipo || '';
    if (currentPdfInfo) {
        currentPdfInfo.style.display = 'block';
        currentPdfInfo.textContent = item.pdf ? `Archivo actual: ${item.pdf} (sube uno para reemplazar)` : (inMemoryPdfMap[id] ? 'Archivo cargado en sesión (se reemplazará si subes uno nuevo)' : 'Sin archivo');
    }
    addTrabajoModal.style.display = 'flex';
}

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
    addTrabajoModal.style.display = 'none';
});

// Evitar cerrar al clickear contenido
addTrabajoModal.addEventListener('click', (e) => {
    if (e.target === addTrabajoModal) addTrabajoModal.style.display = 'none';
});

// --- Guardar formulario (crear o editar) ---
addTrabajoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('trabajoNombre').value.trim();
    const carrera = document.getElementById('trabajoCarrera').value;
    const ano = parseInt(document.getElementById('trabajoAno').value, 10);
    const tipo = document.getElementById('trabajoTipo').value;
    const pdfInput = document.getElementById('trabajoPdf');
    const pdfFile = pdfInput.files[0];
    const editingId = editingIdInput.value;

    if (!nombre || !carrera || !ano || !tipo) return;

    if (editingId) {
        // editar existente
        const idx = trabajos.findIndex(t => t.id === editingId);
        if (idx === -1) return;
        trabajos[idx].nombre = nombre;
        trabajos[idx].carrera = carrera;
        trabajos[idx].año = ano;
        trabajos[idx].tipo = tipo;
        if (pdfFile) {
            // crear objectURL en sesión y guardar nombre en metadata
            const url = URL.createObjectURL(pdfFile);
            inMemoryPdfMap[editingId] = url;
            trabajos[idx].pdf = pdfFile.name;
        }
    } else {
        // nuevo
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        const newItem = {
            id,
            nombre,
            año: ano,
            carrera,
            tipo,
            pdf: pdfFile ? pdfFile.name : ''
        };
        if (pdfFile) inMemoryPdfMap[id] = URL.createObjectURL(pdfFile);
        trabajos.push(newItem);
    }

    saveToStorage();
    addTrabajoModal.style.display = 'none';
    addTrabajoForm.reset();
    editingIdInput.value = '';
    if (currentPdfInfo) {
        currentPdfInfo.textContent = '';
        currentPdfInfo.style.display = 'none';
    }
    renderCards();
});

// --- Eliminar item ---
function deleteItem(id) {
    trabajos = trabajos.filter(t => t.id !== id);
    if (inMemoryPdfMap[id]) {
        try { URL.revokeObjectURL(inMemoryPdfMap[id]); } catch (e) {}
        delete inMemoryPdfMap[id];
    }
    saveToStorage();
    renderCards();
}

// --- Filtros y búsqueda ---
searchInput.addEventListener('input', function() {
    searchText = this.value.trim().toLowerCase();
    renderCards();
});

typeFilter.addEventListener('change', function() {
    selectedTipo = this.value;
    renderCards();
});

setYear.addEventListener('click', function() {
    selectedAno = yearSelect.value;
    selectedDate.textContent = selectedAno === 'todos' ? 'Todos' : selectedAno;
    document.getElementById('monthYearMenu').style.display = 'none';
    renderCards();
});

// sidebar carrera filter
const sidebarButtons = document.querySelectorAll('.sidebar button');
sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'addTrabajoBtn') return; // botón modal
        const isSelected = btn.classList.contains('selected');
        sidebarButtons.forEach(b => b.classList.remove('selected'));
        if (isSelected) {
            selectedCarrera = null;
        } else {
            btn.classList.add('selected');
            selectedCarrera = btn.getAttribute('data-carrera');
        }
        renderCards();
    });
});
document.querySelector('.sidebar-title').addEventListener('click', () => {
    selectedCarrera = null;
    sidebarButtons.forEach(b => b.classList.remove('selected'));
    renderCards();
});

// Inicializar selects de año si es necesario (mantener min/max)
(function initYearSelect() {
    let minYear = Infinity;
    trabajos.forEach(t => { if (t.año && t.año < minYear) minYear = t.año; });
    if (!isFinite(minYear)) minYear = 2000;
    yearSelect.innerHTML = '<option value="todos" selected>Todos</option>';
    for (let y = minYear; y <= 2025; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
    selectedDate.textContent = 'Todos';
})();

// Mostrar/ocultar el menú de años al hacer clic en el dropdown
if (dateDropdown && monthYearMenu) {
    dateDropdown.addEventListener('click', (e) => {
        // Si se hace clic dentro del propio menu no toggleamos aquí
        if (!monthYearMenu.contains(e.target)) {
            monthYearMenu.style.display = monthYearMenu.style.display === 'block' ? 'none' : 'block';
        }
    });
    // Prevenir que un clic dentro del menú cierre el dropdown
    monthYearMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Render inicial
renderCards();

