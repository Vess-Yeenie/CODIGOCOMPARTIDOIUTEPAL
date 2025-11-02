// Supabase + inicialización de la app (async)

let defaultTrabajos = []; // fallback vacio; la fuente principal es Supabase

// Configuración del Cliente Supabase (reemplaza por tus credenciales si difieren)
const SUPABASE_URL = 'https://hvltuptwytwgbxhsmdis.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHR1cHR3eXR3Z2J4aHNtZGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDY1ODMsImV4cCI6MjA3NzU4MjU4M30.OtfKc6qGT0L4bzvpWSMBMbxz1-NU4trSH89koj_UIts';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM refs (script cargado al final del body, por eso podemos referenciarlos ya)
const contenedorCards = document.querySelector('.documents');
const searchInput = document.querySelector('.search-bar input');
const typeFilter = document.getElementById('typeFilter');
const yearSelect = document.getElementById('yearSelect');
const setYear = document.getElementById('setYear');
const selectedDate = document.getElementById('selectedDate');
const dateDropdown = document.getElementById('dateDropdown');
const monthYearMenu = document.getElementById('monthYearMenu');
const addTrabajoBtn = document.getElementById('addTrabajoBtn');
const addTrabajoModal = document.getElementById('addTrabajoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addTrabajoForm = document.getElementById('addTrabajoForm');
const editingIdInput = document.getElementById('editingId');
const elaborarReporteBtn = document.getElementById('elaborarReporteBtn');
const reportModal = document.getElementById('reportModal');
const reportCloseBtn = document.getElementById('reportCloseBtn');
const reportContent = document.getElementById('reportContent');
const currentPdfInfo = document.getElementById('currentPdfInfo');

let trabajos = [];
const inMemoryPdfMap = {}; // id -> objectURL

// Detectar rol
const isAdmin = (function() {
    try {
        return localStorage.getItem('admin') === 'true' || (document.referrer && document.referrer.includes('login-admin.html'));
    } catch (e) { return false; }
})();
const isGuest = (function() {
    try {
        if (isAdmin) return false;
        return localStorage.getItem('guest') === 'true' || (document.referrer && document.referrer.includes('login-guest.html'));
    } catch (e) { return false; }
})();

let selectedCarrera = null;
let selectedAno = 'todos';
let selectedTipo = 'todos';
let searchText = '';

// Obtener trabajos desde Supabase
async function obtenerTrabajosFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('Trabajos')
            // seleccionar todo y ordenar por la columna "Año" de tu tabla
            .select('*')
            .order('Año', { ascending: false });
        if (error) {
            console.error('Error Supabase:', error);
            return [];
        }
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('Error al consultar Supabase:', err);
        return [];
    }
}

// Utilidades
function saveToStorage() {
    localStorage.setItem('trabajosDeGrado', JSON.stringify(trabajos));
}
function ensureIds(arr) {
    return arr.map(item => ({ ...item, id: item.id || (Date.now().toString() + Math.random().toString(36).slice(2)) }));
}

// Renderizado
function renderCards() {
    contenedorCards.innerHTML = '';
    const now = new Date();
    let items = trabajos.filter(item => {
        const carreraMatch = selectedCarrera ? (item.carrera || '').toUpperCase() === selectedCarrera : true;
        const anoMatch = (selectedAno === 'todos') ? true : String(item.año) === String(selectedAno);
        const tipoMatch = (selectedTipo === 'todos') ? true : (item.tipo || 'trabajo') === selectedTipo;
        const searchMatch = searchText ? ((item.nombre || '').toLowerCase().includes(searchText) || (item.carrera || '').toLowerCase().includes(searchText)) : true;
        return carreraMatch && anoMatch && tipoMatch && searchMatch;
    });

    if (!selectedCarrera) items.sort((a,b) => (b.año||0) - (a.año||0));

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.dataset.id = item.id;
        card.dataset.pdfUrl = item.pdf || '';
        card.dataset.carrera = (item.carrera || '').toUpperCase();
        card.dataset.ano = item.año;
        card.dataset.tipo = item.tipo || 'trabajo';

        const xDiv = document.createElement('div');
        xDiv.className = 'doc-x';
        xDiv.innerHTML = '&#10006;';
        xDiv.style.display = (new Date().getFullYear() - (item.año || 0) > 5) ? 'block' : 'none';
        card.appendChild(xDiv);

        const iconDiv = document.createElement('div');
        iconDiv.className = 'doc-icon';
        card.appendChild(iconDiv);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'doc-info';
        const carreraDisplay = item.carrera ? (item.carrera.charAt(0).toUpperCase() + item.carrera.slice(1).toLowerCase().replace('_',' ')) : '';
        infoDiv.textContent = `${item.nombre || 'Sin título'}, ${carreraDisplay}, ${item.año || ''}`;
        card.appendChild(infoDiv);

        const actions = document.createElement('div');
        actions.className = 'card-actions';
        if (isGuest) {
            actions.innerHTML = `<button class="download-btn" title="Descargar" data-id="${item.id}">⬇</button>`;
        } else {
            actions.innerHTML = `
                <button class="edit-btn" title="Editar" data-id="${item.id}">✎</button>
                <button class="download-btn" title="Descargar" data-id="${item.id}">⬇</button>
                <button class="delete-btn" title="Eliminar" data-id="${item.id}">🗑</button>
            `;
        }
        card.appendChild(actions);
        contenedorCards.appendChild(card);
    });

    // ocultar botones fijos si guest
    if (isGuest) {
        if (addTrabajoBtn) addTrabajoBtn.style.display = 'none';
        if (elaborarReporteBtn) elaborarReporteBtn.style.display = 'none';
    } else {
        if (addTrabajoBtn) addTrabajoBtn.style.display = '';
        if (elaborarReporteBtn) elaborarReporteBtn.style.display = '';
    }
}

// Operaciones CRUD en memoria + localStorage
function deleteItem(id) {
    trabajos = trabajos.filter(t => t.id !== id);
    if (inMemoryPdfMap[id]) {
        try { URL.revokeObjectURL(inMemoryPdfMap[id]); } catch(e){}
        delete inMemoryPdfMap[id];
    }
    saveToStorage();
    renderCards();
}

function openEditModal(id) {
    const item = trabajos.find(t => t.id === id);
    if (!item) return alert('Documento no encontrado');
    editingIdInput.value = id;
    document.getElementById('trabajoNombre').value = item.nombre || '';
    document.getElementById('trabajoCarrera').value = item.carrera || '';
    document.getElementById('trabajoAno').value = item.año || '';
    document.getElementById('trabajoTipo').value = item.tipo || '';
    if (currentPdfInfo) {
        currentPdfInfo.style.display = 'block';
        currentPdfInfo.textContent = item.pdf ? `Archivo actual: ${item.pdf} (sube uno para reemplazar)` : (inMemoryPdfMap[id] ? 'Archivo cargado en sesión' : 'Sin archivo');
    }
    addTrabajoModal.style.display = 'flex';
}

// Reporte: agrupa logs por usuario
function openReportModal() {
    const rawLogs = JSON.parse(localStorage.getItem('logs')) || [];
    const usersMap = {};
    rawLogs.forEach(entry => {
        if (!entry) return;
        if (typeof entry === 'string') {
            usersMap['Sin usuario'] = usersMap['Sin usuario'] || new Set();
            usersMap['Sin usuario'].add(entry);
            return;
        }
        const user = entry.user || entry.username || entry.email || 'Sin usuario';
        if (Array.isArray(entry.reviewed)) {
            usersMap[user] = usersMap[user] || new Set();
            entry.reviewed.forEach(d => usersMap[user].add(d));
            return;
        }
        const possibleDoc = entry.doc || entry.document || entry.docId || entry.pdf || entry.title || entry.file || entry.documentName;
        if (possibleDoc) {
            usersMap[user] = usersMap[user] || new Set();
            usersMap[user].add(possibleDoc);
            return;
        }
        if (entry.action && (entry.id || entry.itemId || entry.documentId)) {
            const docId = entry.id || entry.itemId || entry.documentId;
            usersMap[user] = usersMap[user] || new Set();
            usersMap[user].add(docId);
            return;
        }
        usersMap[user] = usersMap[user] || new Set();
        usersMap[user].add(JSON.stringify(entry));
    });

    const idToName = {};
    trabajos.forEach(t => { if (t.id) idToName[t.id] = t.nombre || ''; });

    if (Object.keys(usersMap).length === 0) {
        reportContent.innerHTML = '<p>No hay registros de usuarios.</p>';
    } else {
        let html = '<div class="report-list">';
        for (const [user, docSet] of Object.entries(usersMap)) {
            html += `<div class="report-user"><strong>${user}</strong><ul>`;
            Array.from(docSet).forEach(doc => {
                const resolved = idToName[doc] || doc;
                html += `<li>${resolved}</li>`;
            });
            html += '</ul></div>';
        }
        html += '</div>';
        reportContent.innerHTML = html;
    }
    if (reportModal) reportModal.style.display = 'flex';
}

// Inicialización de selects de año
function initYearSelect() {
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
}

// Registrar listeners (llamar sólo después de cargar datos)
function registerListeners() {
    // click delegado en cards
    contenedorCards.addEventListener('click', (e) => {
        const btnEdit = e.target.closest('.edit-btn');
        const btnDownload = e.target.closest('.download-btn');
        const btnDelete = e.target.closest('.delete-btn');
        const card = e.target.closest('.doc-card');

        if (btnEdit) { e.stopPropagation(); openEditModal(btnEdit.dataset.id); return; }
        if (btnDownload) {
            e.stopPropagation();
            const id = btnDownload.dataset.id;
            const item = trabajos.find(t => t.id === id);
            const url = inMemoryPdfMap[id] || (item && item.pdf) || (card && (card.dataset.pdfurl || card.dataset.pdfUrl));
            if (!url) { alert('Archivo no disponible para descargar.'); return; }
            const filename = (typeof url === 'string' && url.split('/').pop()) || (item && item.pdf) || 'document.pdf';
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }
        if (btnDelete) {
            e.stopPropagation();
            const id = btnDelete.dataset.id;
            if (confirm('¿Eliminar este documento?')) deleteItem(id);
            return;
        }
        if (card) {
            const id = card.dataset.id;
            const url = inMemoryPdfMap[id] || card.dataset.pdfurl || card.dataset.pdfUrl;
            if (url) window.open(url, '_blank');
            else console.error('PDF no disponible para este documento.');
        }
    });

    // modal add/edit
    addTrabajoBtn && addTrabajoBtn.addEventListener('click', () => {
        editingIdInput.value = '';
        addTrabajoForm.reset();
        if (currentPdfInfo) { currentPdfInfo.textContent = ''; currentPdfInfo.style.display = 'none'; }
        addTrabajoModal.style.display = 'flex';
    });
    closeModalBtn && closeModalBtn.addEventListener('click', () => addTrabajoModal.style.display = 'none');
    addTrabajoModal && addTrabajoModal.addEventListener('click', (e) => { if (e.target === addTrabajoModal) addTrabajoModal.style.display = 'none'; });

    addTrabajoForm && addTrabajoForm.addEventListener('submit', function(e) {
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
            const idx = trabajos.findIndex(t => t.id === editingId);
            if (idx === -1) return;
            trabajos[idx].nombre = nombre;
            trabajos[idx].carrera = carrera;
            trabajos[idx].año = ano;
            trabajos[idx].tipo = tipo;
            if (pdfFile) {
                const url = URL.createObjectURL(pdfFile);
                inMemoryPdfMap[editingId] = url;
                trabajos[idx].pdf = pdfFile.name;
            }
        } else {
            const id = Date.now().toString() + Math.random().toString(36).slice(2);
            const newItem = { id, nombre, año: ano, carrera, tipo, pdf: pdfFile ? pdfFile.name : '' };
            if (pdfFile) inMemoryPdfMap[id] = URL.createObjectURL(pdfFile);
            trabajos.push(newItem);
        }
        saveToStorage();
        addTrabajoModal.style.display = 'none';
        addTrabajoForm.reset();
        editingIdInput.value = '';
        if (currentPdfInfo) { currentPdfInfo.textContent = ''; currentPdfInfo.style.display = 'none'; }
        renderCards();
    });

    // filtros y búsqueda
    searchInput && searchInput.addEventListener('input', function(){ searchText = this.value.trim().toLowerCase(); renderCards(); });
    typeFilter && typeFilter.addEventListener('change', function(){ selectedTipo = this.value; renderCards(); });
    setYear && setYear.addEventListener('click', function(){ selectedAno = yearSelect.value; selectedDate.textContent = selectedAno === 'todos' ? 'Todos' : selectedAno; monthYearMenu.style.display = 'none'; renderCards(); });
    if (dateDropdown && monthYearMenu) {
        dateDropdown.addEventListener('click', (e) => { if (!monthYearMenu.contains(e.target)) monthYearMenu.style.display = monthYearMenu.style.display === 'block' ? 'none' : 'block'; });
        monthYearMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    // sidebar carreras
    const sidebarButtons = document.querySelectorAll('.sidebar button');
    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'addTrabajoBtn' || btn.id === 'elaborarReporteBtn') return;
            const isSelected = btn.classList.contains('selected');
            sidebarButtons.forEach(b => b.classList.remove('selected'));
            if (isSelected) selectedCarrera = null;
            else { btn.classList.add('selected'); selectedCarrera = btn.getAttribute('data-carrera'); }
            renderCards();
        });
    });
    document.querySelector('.sidebar-title') && document.querySelector('.sidebar-title').addEventListener('click', () => { selectedCarrera = null; sidebarButtons.forEach(b => b.classList.remove('selected')); renderCards(); });

    // reporte modal
    elaborarReporteBtn && elaborarReporteBtn.addEventListener('click', openReportModal);
    reportCloseBtn && reportCloseBtn.addEventListener('click', () => { if (reportModal) reportModal.style.display = 'none'; });
    reportModal && reportModal.addEventListener('click', (e) => { if (e.target === reportModal) reportModal.style.display = 'none'; });
}

// MAIN: cargar datos y arrancar UI
(async function main() {
    // 1) intentar obtener desde Supabase
    const supaData = await obtenerTrabajosFromSupabase();
    if (supaData && supaData.length) {
        // Mapear campos usando los nombres reales de tu tabla:
        //   Nombre, Tipo, Carrera, URL_doc, Año
        trabajos = supaData.map(t => ({
            id: t.id || (Date.now().toString() + Math.random().toString(36).slice(2)),
            nombre: t.Nombre || t.nombre || t.title || t.name || '',
            año: (t['Año'] !== undefined ? t['Año'] : (t.año || t.anio || t.year || '')) ,
            carrera: t.Carrera || t.carrera || '',
            tipo: t.Tipo || t.tipo || 'trabajo',
            // URL_doc puede contener ruta relativa o URL pública; se usa tal cual para abrir/descargar
            pdf: t.URL_doc || t.url_doc || t.pdf || t.file || ''
        }));
    } else {
        // fallback: localStorage o default vacío
        const fromStorage = JSON.parse(localStorage.getItem('trabajosDeGrado')) || defaultTrabajos || [];
        trabajos = fromStorage.slice();
    }

    trabajos = ensureIds(trabajos);
    saveToStorage();
    initYearSelect();
    registerListeners();
    renderCards();
})();

