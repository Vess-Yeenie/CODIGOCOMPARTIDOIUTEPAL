/**
 * @file menu.js
 * @description Controlador principal de la vista de catálogo y panel de administración (`menu.html`).
 * Gestiona:
 * - Carga asíncrona y reactiva del catálogo de Trabajos Especiales de Grado (TEG), Hojas de Resumen y Presentaciones.
 * - Restricciones de acceso y visibilidad por roles (Administrador, Estudiante Iutepalista, Visitante).
 * - Motor de filtrado multicriterio en memoria (por carrera, año de publicación, tipo de documento y búsqueda en texto).
 * - Renderizado dinámico de tarjetas (`doc-card`) con animaciones escalonadas y badges institucionales.
 * - Subida de documentos con barra de progreso en tiempo real (`XMLHttpRequest` + `upload.progress`).
 * - Acciones de auditoría (registro de visualizaciones y descargas en tiempo real vía `/log-action`).
 * - Gestión de modales: Creación/Edición de Trabajos, Visualizador de Líneas de Investigación, Reporte de Auditoría y Cambio de Contraseña.
 * 
 * @module Client/Menu
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

/**
 * Catálogo en memoria de todos los trabajos recuperados de la base de datos.
 * @type {Array<Object>}
 */
let trabajos = []; // Se inicializa vía loadTrabajos()

/**
 * Catálogo en memoria de todas las carreras recuperadas de la base de datos.
 * @type {Array<Object>}
 */
let carreras = []; // Se inicializa vía loadCarreras()

/**
 * Consulta la API `/carreras` y renderiza los botones en la barra lateral y selectores.
 * @async
 * @returns {Promise<void>}
 */
async function loadCarreras() {
    try {
        const response = await fetch('/carreras');
        if (response.ok) {
            carreras = await response.json();
        } else {
            console.warn('Error al cargar carreras desde BD');
            carreras = [];
        }
    } catch (e) {
        console.warn('Error leyendo carreras desde BD:', e);
        carreras = [];
    }
    renderCarreraButtons();
    populateCarreraSelect();
    if (typeof populateCarreraActionSelect === 'function') {
        populateCarreraActionSelect();
    }
}

/**
 * Genera dinámicamente los botones de filtrado por carrera en la barra lateral (#carreraButtonsContainer).
 */
function renderCarreraButtons() {
    const container = document.getElementById('carreraButtonsContainer');
    if (!container) return;
    container.innerHTML = '';

    const isUserAdmin = localStorage.getItem('admin') === 'true';
    const isUserGuest = localStorage.getItem('guest') === 'true';

    carreras.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'carrera-btn';
        btn.dataset.carrera = c.codigo;
        btn.title = (isUserAdmin && !isUserGuest)
            ? `${c.nombre} (Clic: filtrar • Clic derecho: editar)`
            : c.nombre;
        btn.style.color = c.color || '#00bcd4';

        if (selectedCarrera && normalizeCarrera(selectedCarrera) === normalizeCarrera(c.codigo)) {
            btn.classList.add('selected');
        }

        const img = document.createElement('img');
        const iconSrc = c.icono || 'STRUCTURE/IMG/coco.png';
        img.src = iconSrc.includes('?') ? iconSrc : `${iconSrc}?v=2`;
        img.alt = c.nombre;
        btn.appendChild(img);

        btn.addEventListener('click', () => {
            const carreraValue = normalizeCarrera(c.codigo);
            selectedCarrera = (selectedCarrera === carreraValue) ? null : carreraValue;
            currentPage = 1;
            renderCards();
        });

        if (isUserAdmin && !isUserGuest) {
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (typeof window.openCarreraModal === 'function') {
                    window.openCarreraModal(c.id);
                }
            });
        }

        container.appendChild(btn);
    });
}

/**
 * Llena el selector desplegable de carreras en el modal de añadir/editar trabajo.
 * @param {string} [selectedVal] - Código de carrera a preseleccionar opcionalmente.
 */
function populateCarreraSelect(selectedVal) {
    const select = document.getElementById('trabajoCarrera');
    if (!select) return;
    select.innerHTML = '';
    
    if (carreras.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No hay carreras registradas';
        select.appendChild(opt);
        return;
    }

    carreras.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.codigo;
        opt.textContent = `${c.nombre} (${c.codigo})`;
        if (selectedVal && normalizeCarrera(selectedVal) === normalizeCarrera(c.codigo)) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
}

/**
 * Consulta la API `/trabajos` y almacena la lista de documentos en memoria.
 * En caso de fallo de red, inicializa la colección como un array vacío.
 * @async
 * @returns {Promise<void>}
 */
async function loadTrabajos() {
    try {
        const response = await fetch('/trabajos');
        if (response.ok) {
            trabajos = await response.json();
        } else {
            console.warn('Error al cargar trabajos desde BD');
            trabajos = [];
        }
    } catch (e) {
        console.warn('Error leyendo trabajos desde BD:', e);
        trabajos = [];
    }
}

// =========================================================================
// BANDERAS DE IDENTIFICACIÓN Y ESTADOS DE SESIÓN (LOCALSTORAGE)
// =========================================================================

/** @type {boolean} Indica si el usuario actual posee rol de Administrador */
const isAdmin = (function() {
    try { return localStorage.getItem('admin') === 'true'; } catch (e) { return false; }
})();

/** @type {boolean} Indica si el usuario tiene perfil de visitante o invitado sin privilegios de edición */
const isGuest = (function() {
    try { return !isAdmin && localStorage.getItem('guest') === 'true'; } catch (e) { return false; }
})();

/** @type {boolean} Indica si el estudiante autenticado pertenece a la institución IUTEPAL */
const isIutepalista = (function() {
    try { return localStorage.getItem('iutepalistaStatus') === 'true'; } catch (e) { return false; }
})();

// Sincronizar clase de control en body inmediatamente
if (typeof document !== 'undefined' && document.body) {
    if (isAdmin) {
        document.body.classList.add('is-admin');
    } else {
        document.body.classList.remove('is-admin');
    }
}

// Inicialización automática al cargar el script
(async () => {
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('is-admin', isAdmin);
    }
    await loadCarreras();
    await loadTrabajos();
    initYearSelect();
    renderCards();
    showHeaderButtons();
})();

// --- Funciones de Utilidad ---

/**
 * Función de utilidad auxiliar para la subida simple de archivos mediante FormData.
 * @async
 */
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const carreraInput = document.getElementById('carreraInput');
    const anoInput = document.getElementById('anoInput');
    
    if (!fileInput.files[0]) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append('documento', fileInput.files[0]);
    
    // Asignar valores por defecto para evitar campos 'undefined' en el backend
    formData.append('carrera', carreraInput ? carreraInput.value : 'INFORMATICA'); 
    formData.append('ano', anoInput ? anoInput.value : new Date().getFullYear());

    try {
        const res = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.url) {
            await alert("Subido con éxito");
            location.reload(); 
        }
    } catch (err) {
        console.error("Error al subir:", err);
    }
}

/**
 * Obtiene el nombre del usuario autenticado almacenado en `localStorage`.
 * @returns {string} Nombre del usuario o cadena vacía si no existe.
 */
function getCurrentUserName() {
    try { return localStorage.getItem('currentUserName') || ''; } catch (e) { return ''; }
}

/**
 * Despacha un evento de trazabilidad a la bitácora de auditoría en el backend (`/log-action`).
 * @param {'view'|'download'} action - Tipo de acción ejecutada por el usuario.
 * @param {string} docId - Identificador único del trabajo consultado o descargado.
 * @param {string} docName - Título o nombre descriptivo del documento.
const recentClientActions = new Set();

/**
 * Despacha un evento de trazabilidad a la bitácora de auditoría en el backend (`/log-action`).
 * Incluye debounce en cliente para prevenir llamadas duplicadas en ráfaga.
 * @param {'view'|'download'} action - Tipo de acción ejecutada por el usuario.
 * @param {string} docId - Identificador único del trabajo consultado o descargado.
 * @param {string} docName - Título o nombre descriptivo del documento.
 */
function logUserAction(action, docId, docName) {
    try {
        const usuario_id = localStorage.getItem('currentUserId');
        if (!usuario_id) return;
        const key = `${usuario_id}_${action}_${docId}`;
        if (recentClientActions.has(key)) return;
        recentClientActions.add(key);
        setTimeout(() => recentClientActions.delete(key), 3000);

        const fecha = new Date().toISOString();
        fetch('/log-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, action, doc_id: docId, fecha })
        }).catch(e => console.warn('Error logging action:', e));
    } catch (e) { console.warn('No se pudo registrar la acción', e); }
}

// =========================================================================
// REFERENCIAS DOM Y ESTADO GLOBAL
// =========================================================================

// --- Referencias DOM ---
const contenedorCards = document.querySelector('.documents');
const searchInput = document.getElementById('searchInput') || document.querySelector('.search-bar input');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const setYear = document.getElementById('setYear');
const selectedDate = document.getElementById('selectedDate');
const dateDropdown = document.getElementById('dateDropdown');
const monthYearMenu = document.getElementById('monthYearMenu');
const yearSelect = document.getElementById('yearSelect');
const addTrabajoBtn = document.getElementById('addTrabajoBtn');
const addTrabajoModal = document.getElementById('addTrabajoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addTrabajoForm = document.getElementById('addTrabajoForm');
const editingIdInput = document.getElementById('editingId');
const trabajoTipoSelect = document.getElementById('trabajoTipo');
const trabajoPdfInput = document.getElementById('trabajoPdf');
const trabajoAnoInput = document.getElementById('trabajoAno');
const fileTypeHint = document.getElementById('fileTypeHint');
const fileFormatHelp = document.getElementById('fileFormatHelp');
const paginationContainer = document.getElementById('paginationContainer');
const fileLabel = document.getElementById('fileLabel');
const elaborarReporteBtn = document.getElementById('elaborarReporteBtn');
const reportModal = document.getElementById('reportModal');
const reportCloseBtn = document.getElementById('reportCloseBtn');
const reportContent = document.getElementById('reportContent');
const currentPdfInfo = document.getElementById('currentPdfInfo');
const openLineasModalBtn = document.getElementById('openLineasModalBtn');
const lineasModal = document.getElementById('lineasModal');
const closeLineasModalBtn = document.getElementById('closeLineasModalBtn');
const lineasPdfViewer = document.getElementById('lineasPdfViewer');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAboutBtn = document.getElementById('closeAboutBtn');
const typeButtonsContainer = document.getElementById('typeButtons');
const typeButtons = typeButtonsContainer ? Array.from(typeButtonsContainer.querySelectorAll('.type-btn')) : [];

const LINEAS_PDF_PATH = "STRUCTURE/PDFs/LINEAS DE INVESTIGACION  3  2025, 1 2026, 2 2026.pdf";

let selectedCarrera = null;
let selectedAno = 'todos';
let selectedTipo = 'todos';
let searchText = '';

// Variables de estado para paginación
const ITEMS_PER_PAGE = 20; // Límite de 20 documentos por página
let currentPage = 1;

/**
 * Normaliza la denominación de una carrera para comparaciones estrictas sin distinción de mayúsculas/minúsculas.
 * @param {string} value - Nombre de la especialidad o carrera.
 * @returns {string} Texto normalizado en mayúsculas y sin espacios residuales.
 */
function normalizeCarrera(value) {
    return String(value || '').trim().toUpperCase();
}

/**
 * Restricción en tiempo real del input de año:
 * Solo permite exactamente números y un límite máximo de 4 dígitos.
 */
if (trabajoAnoInput) {
    trabajoAnoInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
    trabajoAnoInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        e.target.value = text.replace(/\D/g, '').slice(0, 4);
    });
}

/**
 * Actualiza dinámicamente el atributo 'accept' y el mensaje de ayuda del input de archivo
 * según el tipo de documento seleccionado:
 * - Trabajo de Grado o Resumen: Estrictamente PDF (.pdf)
 * - Presentación: Video (.mp4, .mov, etc.) o PDF (.pdf)
 */
function updateFileTypeUI() {
    if (!trabajoTipoSelect || !trabajoPdfInput) return;
    const tipo = trabajoTipoSelect.value;
    
    if (tipo === 'trabajo' || tipo === 'resumen') {
        trabajoPdfInput.accept = '.pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
        if (fileTypeHint) fileTypeHint.textContent = '(PDF o Word)';
        if (fileFormatHelp) fileFormatHelp.textContent = 'Formatos permitidos: Documentos PDF (.pdf) o Word (.docx, .doc). El sistema los protegerá automáticamente contra copias y modificaciones.';
    } else if (tipo === 'presentacion') {
        trabajoPdfInput.accept = '.pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,video/*,.mp4,.mov,.avi,.webm';
        if (fileTypeHint) fileTypeHint.textContent = '(PDF, Word o Video)';
        if (fileFormatHelp) fileFormatHelp.textContent = 'Formatos permitidos: Documentos PDF (.pdf), Word (.docx, .doc) o Videos (.mp4, .mov, .avi, .webm)';
    }
}

if (trabajoTipoSelect) {
    trabajoTipoSelect.addEventListener('change', updateFileTypeUI);
    // Configuración inicial según el valor por defecto
    updateFileTypeUI();
}

/**
 * Renderiza los controles visuales de paginación interactiva (20 documentos por página)
 * @param {number} totalPages - Total de páginas calculadas.
 * @param {number} totalItems - Cantidad total de documentos que coinciden con los filtros.
 */
function renderPagination(totalPages, totalItems) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    if (totalItems === 0) return;

    const controls = document.createElement('div');
    controls.className = 'pagination-controls';

    const scrollToTopCatalog = () => {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (paginationContainer) {
            paginationContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (contenedorCards) {
            contenedorCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Botón Anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '&laquo; Anterior';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderCards();
            scrollToTopCatalog();
        }
    };
    controls.appendChild(prevBtn);

    // Generar botones numéricos con rango inteligente
    let pagesToShow = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
    } else {
        pagesToShow.push(1);
        if (currentPage > 3) pagesToShow.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pagesToShow.push(i);
        if (currentPage < totalPages - 2) pagesToShow.push('...');
        pagesToShow.push(totalPages);
    }

    pagesToShow.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.className = 'pagination-ellipsis';
            span.textContent = '...';
            controls.appendChild(span);
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn' + (p === currentPage ? ' active' : '');
            pageBtn.textContent = p;
            pageBtn.onclick = () => {
                if (currentPage !== p) {
                    currentPage = p;
                    renderCards();
                    scrollToTopCatalog();
                }
            };
            controls.appendChild(pageBtn);
        }
    });

    // Botón Siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Siguiente &raquo;';
    nextBtn.disabled = (currentPage === totalPages);
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderCards();
            scrollToTopCatalog();
        }
    };
    controls.appendChild(nextBtn);

    paginationContainer.appendChild(controls);

    // Texto informativo de paginación
    const startCount = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endCount = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    const info = document.createElement('div');
    info.className = 'pagination-info';
    info.innerHTML = `Mostrando <b>${startCount}</b> a <b>${endCount}</b> de <b>${totalItems}</b> documentos (Página ${currentPage} de ${totalPages})`;
    paginationContainer.appendChild(info);
}

/**
 * Limpia y reinicia todos los filtros aplicados en el sistema (búsqueda, carrera, año y tipo).
 */
function resetAllFilters() {
    selectedCarrera = null;
    selectedAno = 'todos';
    selectedTipo = 'todos';
    searchText = '';
    currentPage = 1;

    if (searchInput) searchInput.value = '';
    if (yearSelect) yearSelect.value = 'todos';
    if (selectedDate) selectedDate.textContent = 'Todos';

    document.querySelectorAll('.carrera-btn').forEach(btn => btn.classList.remove('selected'));
    typeButtons.forEach(btn => btn.classList.remove('selected'));

    if (clearSearchBtn) clearSearchBtn.style.display = 'none';

    renderCards();
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetAllFilters();
    });
}

/**
 * Renderiza el catálogo de tarjetas documentales en el contenedor principal `#documents` con paginación.
 * Algoritmo:
 * 1. Sincroniza la clase visual `.selected` en los botones de carreras y tipos.
 * 2. Aplica reglas de visibilidad por rol:
 *    - Administrador: Acceso a todos los tipos (trabajos, presentaciones, resúmenes).
 *    - Estudiante IUTEPALISTA: Acceso exclusivo a Hojas de Resumen.
 *    - Visitante/General: Acceso a Trabajos Especiales de Grado completos y Presentaciones.
 * 3. Evalúa filtros combinados en memoria: carrera, año de grado, tipo de trabajo y texto de búsqueda.
 * 4. Aplica paginación limitando a 20 documentos por página.
 * 5. Genera nodos DOM con delegación de eventos para visualización protegida, edición y descarga.
 * 6. Muestra un estado vacío si no hay coincidencias y actualiza el botón de limpiar filtros.
 */
function renderCards() {
    const carreraButtonsLocal = document.querySelectorAll('.carrera-btn');
    carreraButtonsLocal.forEach(b => {
        b.classList.toggle('selected', selectedCarrera && normalizeCarrera(b.dataset.carrera) === selectedCarrera);
    });

    typeButtons.forEach(btn => {
        const type = btn.dataset.type;
        if (isAdmin) btn.style.display = '';
        else if (isIutepalista) btn.style.display = (type === 'resumen') ? '' : 'none';
        else btn.style.display = (type === 'trabajo' || type === 'presentacion') ? '' : 'none';
    });

    // 1. Filtrado completo en memoria
    let items = trabajos.filter(item => {
        const carreraMatch = selectedCarrera ? normalizeCarrera(item.carrera) === selectedCarrera : true;
        const anoMatch = (selectedAno === 'todos') ? true : String(item.ano) === String(selectedAno);
        const searchMatch = searchText ? 
            ((item.nombre && item.nombre.toLowerCase().includes(searchText)) || 
             (item.carrera && item.carrera.toLowerCase().includes(searchText))) : true;
        
        let typeRestriction;
        if (isAdmin) typeRestriction = true;
        else if (isIutepalista) typeRestriction = item.tipo === 'resumen';
        else typeRestriction = item.tipo === 'trabajo' || item.tipo === 'presentacion';

        const tipoMatch = (selectedTipo === 'todos') ? true : item.tipo === selectedTipo;
        return typeRestriction && carreraMatch && anoMatch && tipoMatch && searchMatch;
    });

    // Ordenar cronológicamente descendente
    if (!selectedCarrera) items.sort((a, b) => b.ano - a.ano);

    // 2. Control del botón de limpiar filtros en la barra de búsqueda
    const hasActiveFilters = Boolean(
        (searchText && searchText.trim() !== '') ||
        selectedCarrera !== null ||
        selectedAno !== 'todos' ||
        selectedTipo !== 'todos'
    );
    if (clearSearchBtn) {
        clearSearchBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
    }

    // 3. Paginación: cálculo de páginas e índice de slice (20 por página)
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    contenedorCards.innerHTML = '';

    paginatedItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.style.animationDelay = `${index * 0.05}s`; // Efecto de entrada escalonada suave

        const carreraObj = carreras.find(c => normalizeCarrera(c.codigo) === normalizeCarrera(item.carrera));
        const carreraColor = carreraObj ? carreraObj.color : '';
        const carreraDisplayName = carreraObj ? carreraObj.nombre : (item.carrera || 'SIN CARRERA');

        card.innerHTML = `
            <div class="tipo-icon tipo-${(item.tipo || 'trabajo').toLowerCase()}"></div>
            <div class="doc-icon"></div>
            <div class="doc-title" title="${item.nombre}">${item.nombre}</div>
            <div class="tag-container">
                <span class="tag carrera-tag" data-carrera-color="${(item.carrera ? item.carrera.toUpperCase() : 'SIN CARRERA')}" ${carreraColor ? `style="background-color: ${carreraColor};"` : ''}>
                    ${carreraDisplayName}
                </span>
                <span class="tag ano-tag">${item.ano}</span>
            </div>
            <div class="card-actions">
                ${isAdmin ? `<button class="edit-btn doc-btn" title="Editar trabajo" onclick="openEditModal(event, '${item.id}')"><img src="STRUCTURE/IMG/edit.svg" class="btn-icon" alt="Editar"></button>` : ''}
                <button class="download-btn doc-btn" title="Descargar archivo" data-id="${item.id}" onclick="downloadItem(event, '${item.id}')"><img src="STRUCTURE/IMG/download.svg" class="btn-icon" alt="Descargar"></button>
                ${isAdmin ? `<button class="delete-btn doc-btn" title="Eliminar trabajo" onclick="deleteItem(event, '${item.id}')"><img src="STRUCTURE/IMG/trash.svg" class="btn-icon" alt="Eliminar"></button>` : ''}
            </div>
        `;
        // Al hacer clic en la tarjeta, abre el documento mediante la ruta de visualización segura
        // La ruta /view/:id registra automáticamente la auditoría una sola vez
        card.onclick = () => {
            const userId = localStorage.getItem('currentUserId') || (isAdmin ? '0' : '');
            const viewUrl = `/view/${encodeURIComponent(item.id)}?userId=${encodeURIComponent(userId)}`;
            window.open(viewUrl, '_blank'); 
        };
        contenedorCards.appendChild(card);
    });

    // Retroalimentación visual si no hay resultados tras aplicar los filtros
    if (items.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.innerHTML = `
            <div class="no-results-content">
                <div class="no-results-icon">🔍</div>
                <h3>Ningún elemento coincide</h3>
                <p>Intenta ajustar tus filtros de búsqueda o presiona el botón de limpiar filtros para restablecer el catálogo.</p>
                <button type="button" class="pagination-btn" style="margin-top: 15px;" onclick="resetAllFilters()">Limpiar Filtros</button>
            </div>
        `;
        contenedorCards.appendChild(noResultsMessage);
        if (paginationContainer) paginationContainer.innerHTML = '';
    } else {
        // Renderizar controles de paginación
        renderPagination(totalPages, items.length);
    }

    // Los botones de acciones administrativas (Añadir Trabajo, Reporte y Gestión de Carrera) son exclusivos de Administrador
    const canManage = (typeof isAdmin !== 'undefined') ? isAdmin : (localStorage.getItem('admin') === 'true');
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('is-admin', Boolean(canManage));
    }
    if (addTrabajoBtn) addTrabajoBtn.style.display = canManage ? 'inline-flex' : 'none';
    if (elaborarReporteBtn) elaborarReporteBtn.style.display = canManage ? 'inline-flex' : 'none';
    const addCarreraBtn = document.getElementById('addCarreraBtn');
    if (addCarreraBtn) addCarreraBtn.style.display = canManage ? 'inline-flex' : 'none';
}

/**
 * Consulta los registros de auditoría (`/report`), procesa estadísticas agregadas
 * (Top 8 usuarios con mayor interacción y Top 8 documentos más consultados)
 * y despliega el modal de reporte con diseño profesional y métricas ejecutivas.
 * @async
 */
async function openReportModal() {
    try {
        const response = await fetch('/report');
        const rawLogs = await response.json(); 

        if (!Array.isArray(rawLogs)) {
            console.error('El servidor no envió una lista:', rawLogs);
            alert('El servidor tiene un problema con la consulta de reportes.');
            return;
        }

        const escapeHtml = (str) => {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        // Filtrar y excluir registros generados por el administrador institucional (id 0 o nombre/correo que contenga admin)
        const nonAdminLogs = rawLogs.filter(log => {
            const uid = log.usuario_id !== undefined && log.usuario_id !== null ? String(log.usuario_id).trim() : '';
            const uName = (log.nombre && log.nombre.trim()) ? log.nombre.trim().toLowerCase() : '';
            const uEmail = (log.email && log.email.trim()) ? log.email.trim().toLowerCase() : '';

            const isUserAdmin = uid === '0' || uid === 'admin' || uName === 'admin' || uName.includes('admin') || uEmail === 'admin' || uEmail.includes('admin');
            return !isUserAdmin;
        });

        if (nonAdminLogs.length === 0) {
            if (reportContent) {
                reportContent.innerHTML = `
                    <div style="text-align:center; padding:50px 20px; color:#64748b;">
                        <div style="font-size:48px; margin-bottom:12px;">📊</div>
                        <h3 style="color:#1e293b; margin:0 0 8px 0; font-size:1.2em;">No hay registros de usuarios/estudiantes todavía</h3>
                        <p style="font-size:0.9em; margin:0; color:#64748b;">Las interacciones de administración están excluidas de esta métrica. A medida que los estudiantes o visitantes consulten y descarguen documentos, las estadísticas se reflejarán automáticamente aquí.</p>
                    </div>
                `;
            }
            if (reportModal) reportModal.style.display = 'flex';
            return;
        }

        const usersMap = {};
        const docCounts = {};
        let totalInteractions = 0;

        nonAdminLogs.forEach(log => {
            totalInteractions++;
            const userName = (log.nombre && log.nombre.trim()) ? log.nombre.trim() : 'Usuario anónimo';
            
            if (!usersMap[userName]) {
                const isIutepalista = log.esIutepalista === 1 || log.esIutepalista === true;
                usersMap[userName] = {
                    name: userName,
                    docs: new Set(),
                    actions: 0,
                    views: 0,
                    downloads: 0,
                    isAdmin: false,
                    isIutepalista: isIutepalista
                };
            }
            usersMap[userName].actions++;
            if (log.action === 'view') usersMap[userName].views++;
            if (log.action === 'download') usersMap[userName].downloads++;
            if (log.doc_name && log.doc_name.trim()) {
                usersMap[userName].docs.add(log.doc_name.trim());
            }

            // Agregación de documentos reales (ignorar logs sin doc_name o eventos de sólo acceso)
            if (log.doc_name && log.doc_name.trim()) {
                const docKey = log.doc_name.trim();
                const matchedTrabajo = trabajos.find(t => (t.id && (String(t.id) === String(log.doc_id) || String(t.id) === String(log.trabajo_id))) || (t.nombre && t.nombre.trim().toLowerCase() === docKey.toLowerCase()));
                const docId = log.doc_id || log.trabajo_id || (matchedTrabajo ? matchedTrabajo.id : '');

                if (!docCounts[docKey]) {
                    docCounts[docKey] = {
                        id: docId,
                        title: docKey,
                        total: 0,
                        views: 0,
                        downloads: 0
                    };
                } else if (!docCounts[docKey].id && docId) {
                    docCounts[docKey].id = docId;
                }

                docCounts[docKey].total++;
                if (log.action === 'download') {
                    docCounts[docKey].downloads++;
                } else {
                    docCounts[docKey].views++;
                }
            }
        });

        // Filtrar y ordenar: Top 8 usuarios con mayor interacción
        const topUsers = Object.values(usersMap)
            .sort((a, b) => b.actions - a.actions)
            .slice(0, 8);

        // Filtrar y ordenar: Top 8 documentos más consultados/vistos
        const topDocs = Object.values(docCounts)
            .sort((a, b) => b.total - a.total)
            .slice(0, 8);

        const totalUsuarios = Object.keys(usersMap).length;
        const totalDocsDistintos = Object.keys(docCounts).length;
        const maxUserActions = topUsers.length > 0 ? topUsers[0].actions : 1;
        const maxDocTotal = topDocs.length > 0 ? topDocs[0].total : 1;

        const getRankBadge = (index) => {
            if (index === 0) return '<div class="rank-badge rank-1" title="Primer Puesto">🥇</div>';
            if (index === 1) return '<div class="rank-badge rank-2" title="Segundo Puesto">🥈</div>';
            if (index === 2) return '<div class="rank-badge rank-3" title="Tercer Puesto">🥉</div>';
            return `<div class="rank-badge rank-other">#${index + 1}</div>`;
        };

        let html = `
            <div class="report-content-wrapper">
                <!-- Tarjetas KPI Resumen -->
                <div class="report-kpi-grid">
                    <div class="report-kpi-card">
                        <div class="report-kpi-icon yellow">⚡</div>
                        <div class="report-kpi-info">
                            <span class="report-kpi-value">${totalInteractions.toLocaleString()}</span>
                            <span class="report-kpi-label">Interacciones Totales</span>
                        </div>
                    </div>
                    <div class="report-kpi-card">
                        <div class="report-kpi-icon blue">👥</div>
                        <div class="report-kpi-info">
                            <span class="report-kpi-value">${totalUsuarios.toLocaleString()}</span>
                            <span class="report-kpi-label">Usuarios Activos</span>
                        </div>
                    </div>
                    <div class="report-kpi-card">
                        <div class="report-kpi-icon green">📄</div>
                        <div class="report-kpi-info">
                            <span class="report-kpi-value">${totalDocsDistintos.toLocaleString()}</span>
                            <span class="report-kpi-label">Documentos Consultados</span>
                        </div>
                    </div>
                </div>

                <!-- Columnas de Ranking: Top 8 Usuarios y Top 8 Documentos -->
                <div class="report-columns-grid">
                    <!-- Columna Top 8 Usuarios con Mayor Interacción -->
                    <div class="report-column">
                        <div class="report-column-header">
                            <h4 class="report-column-title">
                                <span>🏆</span> Top 8 Usuarios con Mayor Interacción
                            </h4>
                            <span class="report-count-badge">${topUsers.length} de ${totalUsuarios}</span>
                        </div>
                        <div class="report-list-scroll">`;

        if (topUsers.length === 0) {
            html += `<p style="color:#94a3b8; font-size:0.85em; text-align:center; padding:20px 0;">No se registraron interacciones de usuarios.</p>`;
        } else {
            topUsers.forEach((u, index) => {
                const pct = Math.max(12, Math.round((u.actions / maxUserActions) * 100));
                const initial = (u.name.charAt(0) || 'U').toUpperCase();
                let roleClass = 'visitante';
                let roleText = 'VISITANTE';
                if (u.isAdmin) {
                    roleClass = 'admin';
                    roleText = 'ADMIN';
                } else if (u.isIutepalista) {
                    roleClass = 'iutepalista';
                    roleText = 'IUTEPALISTA';
                }

                html += `
                    <div class="report-item-card">
                        <div class="report-item-top">
                            ${getRankBadge(index)}
                            <div class="report-user-avatar">${escapeHtml(initial)}</div>
                            <div class="report-user-details">
                                <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                                    <h5 class="report-user-name" title="${escapeHtml(u.name)}">${escapeHtml(u.name)}</h5>
                                    <span class="report-role-pill ${roleClass}">${roleText}</span>
                                </div>
                            </div>
                        </div>
                        <div class="report-stats-row">
                            <span class="report-stats-pill">⚡ <b>${u.actions}</b> interacción${u.actions === 1 ? '' : 'es'}</span>
                            <span class="report-stats-pill">📚 <b>${u.docs.size}</b> doc${u.docs.size === 1 ? '' : 's'} visto${u.docs.size === 1 ? '' : 's'}</span>
                        </div>
                        <div class="report-bar-bg" title="${pct}% de actividad relativa">
                            <div class="report-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>`;
            });
        }

        html += `
                        </div>
                    </div>

                    <!-- Columna Top 8 Documentos Más Vistos -->
                    <div class="report-column">
                        <div class="report-column-header">
                            <h4 class="report-column-title">
                                <span>🔥</span> Top 8 Documentos Más Vistos
                            </h4>
                            <span class="report-count-badge">${topDocs.length} de ${totalDocsDistintos}</span>
                        </div>
                        <div class="report-list-scroll">`;

        if (topDocs.length === 0) {
            html += `<p style="color:#94a3b8; font-size:0.85em; text-align:center; padding:20px 0;">No se registraron consultas de documentos.</p>`;
        } else {
            topDocs.forEach((d, index) => {
                const pct = Math.max(12, Math.round((d.total / maxDocTotal) * 100));
                const safeId = escapeHtml(d.id || '');
                const safeTitle = escapeHtml(d.title || '');
                html += `
                    <div class="report-item-card report-item-doc-clickable" 
                         data-doc-id="${safeId}" 
                         data-doc-title="${safeTitle}" 
                         onclick="openDocumentFromReport('${safeId}', '${safeTitle}', event)"
                         title="Clic para abrir y ver este documento en una nueva pestaña">
                        <div class="report-item-top">
                            ${getRankBadge(index)}
                            <div class="report-doc-icon">PDF</div>
                            <div class="report-user-details" style="flex: 1; min-width: 0;">
                                <h5 class="report-doc-title" title="${safeTitle}">${safeTitle}</h5>
                            </div>
                            <span class="report-open-doc-hint" title="Ver documento">↗️</span>
                        </div>
                        <div class="report-stats-row">
                            <span class="report-stats-pill">Total: <b>${d.total}</b> consulta${d.total === 1 ? '' : 's'}</span>
                            <span class="report-stats-pill">👁️ <b>${d.views}</b> vistas · 📥 <b>${d.downloads}</b> descargas</span>
                        </div>
                        <div class="report-bar-bg" title="${pct}% de popularidad relativa">
                            <div class="report-bar-fill blue" style="width: ${pct}%;"></div>
                        </div>
                    </div>`;
            });
        }

        html += `
                        </div>
                    </div>
                </div>
            </div>`;
        
        if (reportContent) reportContent.innerHTML = html;
        if (reportModal) reportModal.style.display = 'flex';

    } catch (error) {
        console.error('Error al generar el reporte:', error);
        alert('No se pudo cargar el reporte.');
    }
}

/**
 * Abre el documento correspondiente desde el panel de reportes al hacer clic en un item más visto.
 * @param {string} docId - ID del documento.
 * @param {string} docTitle - Título del documento como alternativa de búsqueda.
 * @param {Event} event - Evento del clic.
 */
function openDocumentFromReport(docId, docTitle, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let targetId = docId;
    if (!targetId && docTitle) {
        const found = trabajos.find(t => t.nombre && t.nombre.trim().toLowerCase() === docTitle.trim().toLowerCase());
        if (found) targetId = found.id;
    }
    if (!targetId) {
        alert('No se pudo localizar el archivo correspondiente a este trabajo.');
        return;
    }
    const userId = localStorage.getItem('currentUserId') || (localStorage.getItem('admin') === 'true' ? '0' : '');
    const viewUrl = `/view/${encodeURIComponent(targetId)}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`;
    window.open(viewUrl, '_blank');
}
// --- Eventos de Botones y Filtros ---

if (addTrabajoBtn) addTrabajoBtn.addEventListener('click', () => {
    addTrabajoForm.reset();
    editingIdInput.value = '';
    populateCarreraSelect();
    updateFileTypeUI();
    document.getElementById('modalTitle').textContent = "Añadir Nuevo Trabajo";
    addTrabajoModal.style.display = 'flex';
});

if (closeModalBtn) closeModalBtn.addEventListener('click', () => addTrabajoModal.style.display = 'none');

if (elaborarReporteBtn) elaborarReporteBtn.addEventListener('click', openReportModal);
if (reportCloseBtn) reportCloseBtn.addEventListener('click', () => reportModal.style.display = 'none');

if (openLineasModalBtn) {
    openLineasModalBtn.addEventListener('click', () => {
        // Quitar todos los filtros y reiniciar página
        resetAllFilters();

        // Abrir el modal de líneas
        lineasPdfViewer.src = LINEAS_PDF_PATH;
        lineasModal.style.display = 'flex';
    });
}
if (closeLineasModalBtn) {
    closeLineasModalBtn.addEventListener('click', () => {
        lineasModal.style.display = 'none';
        lineasPdfViewer.src = '';
    });
}

if (aboutBtn) aboutBtn.addEventListener('click', () => aboutModal.style.display = 'flex');
if (closeAboutBtn) closeAboutBtn.addEventListener('click', () => aboutModal.style.display = 'none');

// --- MANEJO DEL FORMULARIO DE AÑADIR/EDITAR TRABAJO ---
const uploadStatus = document.getElementById('uploadStatus');

addTrabajoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Verificación de seguridad para el input de archivo
    if (!trabajoPdfInput) {
        alert("Error crítico: No se encontró el campo de archivo en el HTML.");
        return;
    }

    const file = trabajoPdfInput.files[0];
    const isEditing = editingIdInput.value !== "";
    const selectedTipo = trabajoTipoSelect.value;
    let urlFinal = "";

    // 2. Validación estricta del campo Año: Debe contener exactamente 4 dígitos numéricos
    const anoValue = (trabajoAnoInput ? trabajoAnoInput.value : '').trim();
    if (!/^\d{4}$/.test(anoValue)) {
        alert("El campo Año es obligatorio y debe contener exactamente 4 dígitos numéricos (ejemplo: 2024).");
        if (trabajoAnoInput) trabajoAnoInput.focus();
        return;
    }

    // 3. Validación de tipo de archivo según el registro
    if (file) {
        const fileName = file.name.toLowerCase();
        const fileExt = fileName.substring(fileName.lastIndexOf('.'));
        const fileMime = (file.type || '').toLowerCase();

        const isPdf = fileExt === '.pdf' || fileMime === 'application/pdf';
        const isWord = ['.docx', '.doc'].includes(fileExt) || fileMime.includes('word') || fileMime.includes('officedocument');
        const isVideo = ['.mp4', '.mov', '.avi', '.webm', '.mkv'].includes(fileExt) || fileMime.startsWith('video/');

        if (selectedTipo === 'trabajo' || selectedTipo === 'resumen') {
            if (!isPdf && !isWord) {
                alert("Validación de archivo: Para " + (selectedTipo === 'trabajo' ? "Trabajos de Grado" : "Hojas de Resumen") + ", el archivo debe ser un documento en formato PDF (.pdf) o Word (.docx, .doc).");
                trabajoPdfInput.value = '';
                return;
            }
        } else if (selectedTipo === 'presentacion') {
            if (!isPdf && !isWord && !isVideo) {
                alert("Validación de archivo: Para Presentaciones, el archivo debe ser un documento PDF (.pdf), Word (.docx, .doc) o un archivo de video (.mp4, .mov, .avi, etc.).");
                trabajoPdfInput.value = '';
                return;
            }
        }
    }

    // Si no estamos editando, el archivo es obligatorio
    if (!file && !isEditing) {
        alert("Por favor, selecciona un archivo válido para continuar.");
        return;
    }

    try {
        if (file) {
            const fileName = file.name.toLowerCase();
            const fileExt = fileName.substring(fileName.lastIndexOf('.'));
            if (['.docx', '.doc'].includes(fileExt)) {
                uploadStatus.textContent = "Convirtiendo Word a PDF y aplicando protección anti-plagio...";
            } else if (fileExt === '.pdf') {
                uploadStatus.textContent = "Aplicando protección criptográfica y subiendo...";
            } else {
                uploadStatus.textContent = "Subiendo archivo...";
            }
        } else {
            uploadStatus.textContent = "Guardando cambios...";
        }
        
        // 4. Si hay un archivo nuevo, subirlo al servidor o almacenamiento configurado
        if (file) {
            const formData = new FormData();
            formData.append('documento', file);
            formData.append('tipo', selectedTipo);

            // Mostrar barra de progreso
            const progressBar = document.getElementById('uploadProgress');
            const progressFill = document.getElementById('progressFill');
            progressBar.style.display = 'block';
            progressFill.style.width = '0%';

            urlFinal = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressFill.style.width = percentComplete + '%';
                        uploadStatus.textContent = `Subiendo... ${Math.round(percentComplete)}%`;
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data.url);
                    } else {
                        let errMsg = 'Fallo en la subida del archivo';
                        try {
                            const errData = JSON.parse(xhr.responseText);
                            if (errData.error) errMsg = errData.error;
                        } catch(e){}
                        reject(new Error(errMsg));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Error de red al conectar con el servidor'));
                });

                xhr.open('POST', '/upload');
                xhr.send(formData);
            });
        }

        // 5. Preparar datos para el servidor
        const trabajoData = {
            id: isEditing ? editingIdInput.value : null,
            nombre: document.getElementById('trabajoNombre').value.trim(),
            carrera: document.getElementById('trabajoCarrera').value,
            ano: parseInt(anoValue, 10),
            tipo: selectedTipo, // Mantener el tipo seleccionado estrictamente
            pdf_url: urlFinal
        };

        const endpoint = isEditing ? '/updateTrabajo' : '/addTrabajo';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trabajoData)
        });

        const respData = await response.json();

        if (response.ok && respData.success) {
            alert(isEditing ? "¡Trabajo actualizado con éxito!" : "¡Trabajo guardado con éxito!");
            closeModal();
            // Restablecer filtros si es un nuevo trabajo para asegurar que aparezca
            if (!isEditing) {
                resetAllFilters();
            }
            await loadTrabajos(); // Recarga las tarjetas desde la base de datos
            renderCards(); // Actualiza la UI
        } else {
            throw new Error(respData.error || respData.message || "Error al guardar en la base de datos");
        }

    } catch (error) {
        console.error(error);
        alert("Hubo un error: " + error.message);
    } finally {
        uploadStatus.textContent = "";
        const progressBar = document.getElementById('uploadProgress');
        if (progressBar) progressBar.style.display = 'none';
    }
});

// Función para cerrar modal y limpiar datos
function closeModal() {
    document.getElementById('addTrabajoModal').style.display = 'none';
    addTrabajoForm.reset();
    editingIdInput.value = "";
    document.getElementById('modalTitle').textContent = "Añadir Nuevo Trabajo";
}
// Búsqueda y Filtros
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchText = e.target.value.toLowerCase().trim();
        currentPage = 1; // Reiniciar a la primera página al buscar
        renderCards();
    });
} else {
    console.log('Search input not found');
}

// Eventos de botones de carrera gestionados dinámicamente en renderCarreraButtons()

typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Si el botón ya está seleccionado, quitar el filtro (volver a 'todos')
        if (selectedTipo === btn.dataset.type) {
            selectedTipo = 'todos';
        } else {
            selectedTipo = btn.dataset.type;
        }

        typeButtons.forEach(b => {
            const shouldBeSelected = b.dataset.type === selectedTipo;
            b.classList.toggle('selected', shouldBeSelected);
        });
        currentPage = 1; // Reiniciar a la primera página
        renderCards();
    });
});

// Inicializar Select de Años con orden descendente
function initYearSelect() {
    if (!yearSelect) return;
    yearSelect.innerHTML = '<option value="todos">Todos</option>';
    for (let y = 2026; y >= 2018; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (selectedAno && String(selectedAno) === String(y)) {
            opt.selected = true;
        }
        yearSelect.appendChild(opt);
    }
}

// Filtro directo por año: cambio reactivo inmediato sin ventana emergente
if (yearSelect) {
    yearSelect.addEventListener('change', () => {
        selectedAno = yearSelect.value;
        currentPage = 1; // Reiniciar a la primera página
        renderCards();
    });
}

// Cerrar sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

function showHeaderButtons() {
    const userId = localStorage.getItem('currentUserId');
    const isAdminUser = localStorage.getItem('admin') === 'true';

    const logoutBtn = document.getElementById('logoutBtn');
    const changePassBtn = document.getElementById('changePasswordBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');

    const addTrabajoBtn = document.getElementById('addTrabajoBtn');
    const elaborarReporteBtn = document.getElementById('elaborarReporteBtn');
    const addCarreraBtn = document.getElementById('addCarreraBtn');

    // Sincronizar clase de control en body
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('is-admin', Boolean(isAdminUser));
    }

    // Botones de la barra lateral: solo visibles para el Administrador
    if (addTrabajoBtn) addTrabajoBtn.style.display = isAdminUser ? 'inline-flex' : 'none';
    if (elaborarReporteBtn) elaborarReporteBtn.style.display = isAdminUser ? 'inline-flex' : 'none';
    if (addCarreraBtn) addCarreraBtn.style.display = isAdminUser ? 'inline-flex' : 'none';

    if (userId) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (changePassBtn) changePassBtn.style.display = 'block';
        if (adminPanelBtn) adminPanelBtn.style.display = isAdminUser ? 'block' : 'none';
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (changePassBtn) changePassBtn.style.display = 'none';
        if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    }
}

// =========================================================================
// MINI MODAL DE CONFIRMACIÓN PARA ELIMINAR DOCUMENTO
// =========================================================================

const deleteDocModal = document.getElementById('deleteDocModal');
const closeDeleteDocBtn = document.getElementById('closeDeleteDocBtn');
const cancelDeleteDocBtn = document.getElementById('cancelDeleteDocBtn');
const confirmDeleteDocBtn = document.getElementById('confirmDeleteDocBtn');
const deleteDocTitle = document.getElementById('deleteDocTitle');
const deleteDocMeta = document.getElementById('deleteDocMeta');

let pendingDeleteDocId = null;

/**
 * Retorna la etiqueta legible del tipo de documento académico.
 * @param {string} tipo - Tipo de archivo ('trabajo', 'presentacion', 'resumen').
 * @returns {string} Nombre legible.
 */
function getDocumentTypeLabel(tipo) {
    const t = String(tipo || '').toLowerCase();
    if (t === 'trabajo') return 'Trabajo de Grado';
    if (t === 'presentacion') return 'Presentación';
    if (t === 'resumen') return 'Hoja de Resumen';
    return tipo || 'Documento';
}

/**
 * Abre el mini modal de confirmación con los datos del documento seleccionado.
 * @param {string} id - Identificador del documento a eliminar.
 */
function openDeleteDocModal(id) {
    pendingDeleteDocId = id;
    const item = trabajos.find(t => String(t.id) === String(id));

    if (item) {
        if (deleteDocTitle) deleteDocTitle.textContent = item.nombre || 'Documento sin título';
        if (deleteDocMeta) {
            const carreraObj = carreras.find(c => normalizeCarrera(c.codigo) === normalizeCarrera(item.carrera));
            const carreraName = carreraObj ? carreraObj.nombre : (item.carrera || 'General');
            deleteDocMeta.textContent = `${carreraName} • Año ${item.ano || 'N/A'} • ${getDocumentTypeLabel(item.tipo)}`;
        }
    } else {
        if (deleteDocTitle) deleteDocTitle.textContent = `Documento #${id}`;
        if (deleteDocMeta) deleteDocMeta.textContent = '';
    }

    if (deleteDocModal) {
        deleteDocModal.style.display = 'flex';
    }
}

/**
 * Cierra el mini modal de confirmación de documento.
 */
function closeDeleteDocModal() {
    pendingDeleteDocId = null;
    if (deleteDocModal) {
        deleteDocModal.style.display = 'none';
    }
}

if (closeDeleteDocBtn) closeDeleteDocBtn.addEventListener('click', closeDeleteDocModal);
if (cancelDeleteDocBtn) cancelDeleteDocBtn.addEventListener('click', closeDeleteDocModal);

if (deleteDocModal) {
    deleteDocModal.addEventListener('click', (e) => {
        if (e.target === deleteDocModal) {
            closeDeleteDocModal();
        }
    });
}

if (confirmDeleteDocBtn) {
    confirmDeleteDocBtn.addEventListener('click', async () => {
        if (!pendingDeleteDocId) return;
        const idToDelete = pendingDeleteDocId;
        closeDeleteDocModal();

        try {
            const response = await fetch(`/deleteTrabajo/${encodeURIComponent(idToDelete)}`, { method: 'DELETE' });
            if (response.ok) {
                await loadTrabajos();
                renderCards();
                alert('Documento eliminado exitosamente del repositorio.');
            } else {
                const errData = await response.json().catch(() => ({}));
                alert('Error al eliminar documento: ' + (errData.error || errData.message || 'No se pudo completar la operación.'));
            }
        } catch (error) {
            console.error("Error al borrar documento:", error);
            alert('Error de conexión con el servidor al intentar eliminar el documento.');
        }
    });
}

/**
 * Elimina un trabajo académico de la base de datos y su archivo asociado en el servidor.
 * Despliega un mini modal de confirmación institucional y actualiza la vista reactivamente.
 * @param {Event} event - Evento del clic para detener la propagación hacia la tarjeta.
 * @param {string} id - Identificador único del trabajo a eliminar.
 */
function deleteItem(event, id) {
    if (event) {
        event.preventDefault();
        event.stopPropagation(); // Evita abrir el visor de documento
    }
    openDeleteDocModal(id);
}

/**
 * Descarga garantizada y sin fallos del archivo del trabajo.
 * Invoca el endpoint seguro `/download/:id` que configura las cabeceras Content-Disposition: attachment
 * con el nombre y extensión adecuada (.pdf / .mp4), superando restricciones de CORS y orígenes cruzados.
 * 
 * @param {Event} event - Evento del clic para detener propagación.
 * @param {string} id - Identificador del trabajo a descargar.
 */
function downloadItem(event, id) {
    if (event) {
        event.preventDefault();
        event.stopPropagation(); // Evita abrir el visor en pestaña nueva
    }

    const item = trabajos.find(t => t.id === id);
    if (!item) return;

    const userId = localStorage.getItem('currentUserId') || (isAdmin ? '0' : '');
    // Endpoint seguro del servidor que fuerza la descarga y registra la auditoría una sola vez
    const downloadUrl = `/download/${encodeURIComponent(id)}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', '');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        if (document.body.contains(a)) {
            document.body.removeChild(a);
        }
    }, 1000);
}

/**
 * Abre el modal de edición precargando en los campos del formulario los metadatos del trabajo seleccionado.
 * @param {Event} event - Evento del clic.
 * @param {string} id - Identificador del trabajo a editar.
 */
function openEditModal(event, id) {
    if (event) event.stopPropagation();
    
    const item = trabajos.find(t => t.id === id);
    if (!item) return;

    editingIdInput.value = id; 
    document.getElementById('trabajoNombre').value = item.nombre;
    populateCarreraSelect(item.carrera);
    document.getElementById('trabajoCarrera').value = item.carrera;
    document.getElementById('trabajoAno').value = item.ano;
    document.getElementById('trabajoTipo').value = item.tipo;

    updateFileTypeUI();

    const modalTitle = document.querySelector('#addTrabajoModal h2');
    if (modalTitle) modalTitle.textContent = "Editar Trabajo";

    addTrabajoModal.style.display = 'flex';
}

// =========================================================================
// MÓDULO DE GESTIÓN DE SEGURIDAD (ADMINISTRACIÓN INDIVIDUAL DE CREDENCIALES)
// =========================================================================

const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const closeChangePassBtn = document.getElementById('closeChangePassBtn');
const cancelChangePassBtn = document.getElementById('cancelChangePassBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const credsModalTitle = document.getElementById('credsModalTitle');

// Elementos de administración y mini-tabs (para Administrador)
const adminModalTabs = document.getElementById('adminModalTabs');
const tabAdminSelfBtn = document.getElementById('tabAdminSelfBtn');
const tabAdminUsersBtn = document.getElementById('tabAdminUsersBtn');

// Sección Pestaña 1: Mi Contraseña (Admin)
const adminSelfCredsContainer = document.getElementById('adminSelfCredsContainer');
const adminSelfCurrentPass = document.getElementById('adminSelfCurrentPass');
const adminSelfNewPass = document.getElementById('adminSelfNewPass');
const adminSelfConfirmPass = document.getElementById('adminSelfConfirmPass');

// Sección Pestaña 2: Gestión de otros usuarios
const adminCredsContainer = document.getElementById('adminCredsContainer');
const adminUserSelect = document.getElementById('adminUserSelect');
const adminTargetName = document.getElementById('adminTargetName');
const adminTargetEmail = document.getElementById('adminTargetEmail');
const adminTargetNewPass = document.getElementById('adminTargetNewPass');
const adminTargetConfirmPass = document.getElementById('adminTargetConfirmPass');
const adminTargetIutepalista = document.getElementById('adminTargetIutepalista');
const deleteUserBtn = document.getElementById('deleteUserBtn');
const saveCredsBtn = document.getElementById('saveCredsBtn');

// Elementos del mini modal de confirmación de eliminación de usuario
const deleteUserModal = document.getElementById('deleteUserModal');
const closeDeleteUserBtn = document.getElementById('closeDeleteUserBtn');
const cancelDeleteUserModalBtn = document.getElementById('cancelDeleteUserModalBtn');
const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
const deleteUserTargetName = document.getElementById('deleteUserTargetName');
const deleteUserTargetMeta = document.getElementById('deleteUserTargetMeta');

let pendingDeleteUserId = null;
let currentAdminTab = 'self'; // 'self' o 'users'

// Elementos de cambio de contraseña personal (para usuario no-admin / modo usuario)
const userCredsContainer = document.getElementById('userCredsContainer');
const userCurrentPass = document.getElementById('userCurrentPass');
const userNewPass = document.getElementById('userNewPass');
const userConfirmPass = document.getElementById('userConfirmPass');

let cachedUsersList = [];

/**
 * Cambia la pestaña activa del menú de administración de credenciales.
 * @param {'self'|'users'} tab - Pestaña a mostrar.
 */
function switchAdminTab(tab) {
    currentAdminTab = tab;
    if (tab === 'self') {
        if (tabAdminSelfBtn) tabAdminSelfBtn.classList.add('active');
        if (tabAdminUsersBtn) tabAdminUsersBtn.classList.remove('active');
        if (adminSelfCredsContainer) adminSelfCredsContainer.style.display = 'block';
        if (adminCredsContainer) adminCredsContainer.style.display = 'none';
        if (deleteUserBtn) deleteUserBtn.style.display = 'none';
        if (saveCredsBtn) saveCredsBtn.textContent = 'Actualizar Contraseña Admin';
        if (credsModalTitle) credsModalTitle.textContent = 'Administración - Mi Contraseña';
    } else {
        if (tabAdminUsersBtn) tabAdminUsersBtn.classList.add('active');
        if (tabAdminSelfBtn) tabAdminSelfBtn.classList.remove('active');
        if (adminSelfCredsContainer) adminSelfCredsContainer.style.display = 'none';
        if (adminCredsContainer) adminCredsContainer.style.display = 'block';
        if (saveCredsBtn) saveCredsBtn.textContent = 'Guardar Cambios';
        if (credsModalTitle) credsModalTitle.textContent = 'Administración - Configurar Usuarios';
        updateDeleteUserBtnVisibility();
    }
}

if (tabAdminSelfBtn) {
    tabAdminSelfBtn.addEventListener('click', () => switchAdminTab('self'));
}
if (tabAdminUsersBtn) {
    tabAdminUsersBtn.addEventListener('click', () => switchAdminTab('users'));
}

/**
 * Controla la visibilidad del botón de eliminar usuario según el usuario seleccionado.
 * No permite eliminar la cuenta institucional principal (id 0 o email 'admin').
 */
function updateDeleteUserBtnVisibility() {
    if (!deleteUserBtn) return;
    const isUserAdmin = localStorage.getItem('admin') === 'true';
    if (!isUserAdmin || currentAdminTab !== 'users') {
        deleteUserBtn.style.display = 'none';
        return;
    }

    const selectedId = adminUserSelect ? adminUserSelect.value : '';
    if (!selectedId) {
        deleteUserBtn.style.display = 'none';
        return;
    }

    const user = cachedUsersList.find(u => String(u.id) === String(selectedId));
    if (user && (user.id === 0 || user.email === 'admin')) {
        deleteUserBtn.style.display = 'none'; // El Administrador principal no se puede eliminar
    } else if (user) {
        deleteUserBtn.style.display = 'inline-flex';
    } else {
        deleteUserBtn.style.display = 'none';
    }
}

/**
 * Carga la lista completa de usuarios registrados desde el backend
 * y puebla el selector individual para la configuración de otros usuarios.
 */
async function loadUsersForAdmin() {
    try {
        const res = await fetch('/usuarios');
        if (res.ok) {
            cachedUsersList = await res.json();
            if (adminUserSelect) {
                adminUserSelect.innerHTML = '<option value="">-- Seleccionar usuario a configurar --</option>';
                // Filtrar para mostrar estrictamente otros usuarios (excluyendo admin principal id:0 y email:'admin')
                const otherUsers = cachedUsersList.filter(u => u.id !== 0 && String(u.id) !== '0' && (u.email || '').toLowerCase() !== 'admin');
                if (otherUsers.length === 0) {
                    const emptyOpt = document.createElement('option');
                    emptyOpt.value = "";
                    emptyOpt.textContent = "No hay otros usuarios registrados";
                    adminUserSelect.appendChild(emptyOpt);
                } else {
                    otherUsers.forEach(u => {
                        const opt = document.createElement('option');
                        opt.value = u.id;
                        const roleLabel = u.esIutepalista ? 'IUTEPALISTA' : 'VISITANTE';
                        opt.textContent = `${u.nombre} (${u.email}) [${roleLabel}]`;
                        adminUserSelect.appendChild(opt);
                    });
                }
            }
        }
    } catch (e) {
        console.error('Error cargando lista de usuarios:', e);
    }
    updateDeleteUserBtnVisibility();
}

// Al seleccionar un usuario de la lista, sincronizar los campos del formulario con sus datos
if (adminUserSelect) {
    adminUserSelect.addEventListener('change', () => {
        const selectedId = adminUserSelect.value;
        const user = cachedUsersList.find(u => String(u.id) === String(selectedId));
        if (user) {
            if (adminTargetName) adminTargetName.value = user.nombre || '';
            if (adminTargetEmail) adminTargetEmail.value = user.email || '';
            if (adminTargetNewPass) adminTargetNewPass.value = '';
            if (adminTargetConfirmPass) adminTargetConfirmPass.value = '';
            if (adminTargetIutepalista) adminTargetIutepalista.checked = Boolean(user.esIutepalista);
        } else {
            if (adminTargetName) adminTargetName.value = '';
            if (adminTargetEmail) adminTargetEmail.value = '';
            if (adminTargetNewPass) adminTargetNewPass.value = '';
            if (adminTargetConfirmPass) adminTargetConfirmPass.value = '';
            if (adminTargetIutepalista) adminTargetIutepalista.checked = false;
        }
        updateDeleteUserBtnVisibility();
    });
}

/**
 * Abre el mini modal de confirmación para eliminar un usuario de la base de datos.
 * @param {string|number} userId - Identificador del usuario a eliminar.
 */
function openDeleteUserModal(userId) {
    const user = cachedUsersList.find(u => String(u.id) === String(userId));
    if (!user) {
        alert('Por favor, selecciona un usuario válido de la lista.');
        return;
    }

    if (user.id === 0 || user.email === 'admin') {
        alert('La cuenta del Administrador principal no puede ser eliminada.');
        return;
    }

    pendingDeleteUserId = userId;
    if (deleteUserTargetName) {
        deleteUserTargetName.textContent = user.nombre || 'Usuario sin nombre';
    }
    if (deleteUserTargetMeta) {
        const role = user.esIutepalista ? 'Estudiante Iutepalista' : 'Visitante';
        deleteUserTargetMeta.textContent = `${user.email} • Rol: ${role}`;
    }

    if (deleteUserModal) {
        deleteUserModal.style.display = 'flex';
    }
}

/**
 * Cierra el mini modal de confirmación de usuario.
 */
function closeDeleteUserModal() {
    pendingDeleteUserId = null;
    if (deleteUserModal) {
        deleteUserModal.style.display = 'none';
    }
}

if (deleteUserBtn) {
    deleteUserBtn.addEventListener('click', () => {
        const targetUserId = adminUserSelect ? adminUserSelect.value : '';
        if (!targetUserId) {
            alert('Por favor, selecciona un usuario para eliminar.');
            return;
        }
        openDeleteUserModal(targetUserId);
    });
}

if (closeDeleteUserBtn) closeDeleteUserBtn.addEventListener('click', closeDeleteUserModal);
if (cancelDeleteUserModalBtn) cancelDeleteUserModalBtn.addEventListener('click', closeDeleteUserModal);

if (deleteUserModal) {
    deleteUserModal.addEventListener('click', (e) => {
        if (e.target === deleteUserModal) {
            closeDeleteUserModal();
        }
    });
}

// Confirmar la eliminación del usuario en la base de datos
if (confirmDeleteUserBtn) {
    confirmDeleteUserBtn.addEventListener('click', async () => {
        if (!pendingDeleteUserId) return;
        const idToDelete = pendingDeleteUserId;
        closeDeleteUserModal();

        try {
            const response = await fetch(`/admin/delete-user/${encodeURIComponent(idToDelete)}`, {
                method: 'DELETE'
            });
            const data = await response.json().catch(() => ({}));

            if (data.success) {
                alert(data.message || '¡Usuario eliminado exitosamente de la base de datos!');

                // Limpiar campos del formulario
                if (adminTargetName) adminTargetName.value = '';
                if (adminTargetEmail) adminTargetEmail.value = '';
                if (adminTargetNewPass) adminTargetNewPass.value = '';
                if (adminTargetConfirmPass) adminTargetConfirmPass.value = '';
                if (adminTargetIutepalista) adminTargetIutepalista.checked = false;

                // Recargar lista actualizada de usuarios
                await loadUsersForAdmin();
                updateDeleteUserBtnVisibility();
            } else {
                alert('Error al eliminar usuario: ' + (data.message || 'No se pudo completar la operación.'));
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error de conexión con el servidor al intentar eliminar el usuario.');
        }
    });
}

// Atajo de teclado (Escape) para cerrar cualquier mini modal abierto
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (deleteDocModal && deleteDocModal.style.display === 'flex') {
            closeDeleteDocModal();
        }
        if (deleteUserModal && deleteUserModal.style.display === 'flex') {
            closeDeleteUserModal();
        }
        const deleteCarreraModalEl = document.getElementById('deleteCarreraModal');
        if (deleteCarreraModalEl && deleteCarreraModalEl.style.display === 'flex') {
            if (typeof closeDeleteCarreraModal === 'function') closeDeleteCarreraModal();
        }
    }
});

// Abrir modal configurando la vista según el rol del usuario conectado
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async () => {
        const isUserAdmin = localStorage.getItem('admin') === 'true';

        if (isUserAdmin) {
            if (adminModalTabs) adminModalTabs.style.display = 'flex';
            if (userCredsContainer) userCredsContainer.style.display = 'none';
            if (adminSelfCurrentPass) adminSelfCurrentPass.value = '';
            if (adminSelfNewPass) adminSelfNewPass.value = '';
            if (adminSelfConfirmPass) adminSelfConfirmPass.value = '';
            switchAdminTab('self');
            await loadUsersForAdmin();
        } else {
            if (credsModalTitle) credsModalTitle.textContent = "Cambiar Mi Contraseña";
            if (adminModalTabs) adminModalTabs.style.display = 'none';
            if (adminSelfCredsContainer) adminSelfCredsContainer.style.display = 'none';
            if (adminCredsContainer) adminCredsContainer.style.display = 'none';
            if (userCredsContainer) userCredsContainer.style.display = 'block';
            if (deleteUserBtn) deleteUserBtn.style.display = 'none';
            if (saveCredsBtn) saveCredsBtn.textContent = 'Guardar Cambios';
            if (userCurrentPass) userCurrentPass.value = '';
            if (userNewPass) userNewPass.value = '';
            if (userConfirmPass) userConfirmPass.value = '';
        }

        if (changePasswordModal) changePasswordModal.style.display = 'flex';
    });
}

// Cerrar modal al pulsar la 'X'
if (closeChangePassBtn) {
    closeChangePassBtn.addEventListener('click', () => {
        if (changePasswordModal) changePasswordModal.style.display = 'none';
    });
}

// Cerrar modal al pulsar botón cancelar
if (cancelChangePassBtn) {
    cancelChangePassBtn.addEventListener('click', () => {
        if (changePasswordModal) changePasswordModal.style.display = 'none';
    });
}

// Procesar formulario de actualización de credenciales
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isUserAdmin = localStorage.getItem('admin') === 'true';

        // CASO A: ADMINISTRADOR
        if (isUserAdmin) {
            // SUB-CASO A1: PESTAÑA MI CONTRASEÑA (CAMBIAR CONTRASEÑA DEL PROPIO ADMIN)
            if (currentAdminTab === 'self') {
                const currentPassword = adminSelfCurrentPass ? adminSelfCurrentPass.value.trim() : '';
                const newPassword = adminSelfNewPass ? adminSelfNewPass.value.trim() : '';
                const confirmPassword = adminSelfConfirmPass ? adminSelfConfirmPass.value.trim() : '';

                if (!currentPassword || !newPassword) {
                    alert('Por favor, completa los campos requeridos para cambiar tu contraseña.');
                    return;
                }

                if (newPassword.length < 3) {
                    alert('La nueva contraseña debe tener al menos 3 caracteres.');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    alert('La nueva contraseña y su confirmación no coinciden.');
                    return;
                }

                const adminUserId = localStorage.getItem('currentUserId') || '0';

                try {
                    const response = await fetch('/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            usuario_id: adminUserId,
                            currentPassword,
                            newPassword
                        })
                    });

                    const data = await response.json().catch(() => ({}));

                    if (data.success) {
                        alert('¡Contraseña de Administrador actualizada correctamente!');
                        if (changePasswordModal) changePasswordModal.style.display = 'none';
                        if (adminSelfCurrentPass) adminSelfCurrentPass.value = '';
                        if (adminSelfNewPass) adminSelfNewPass.value = '';
                        if (adminSelfConfirmPass) adminSelfConfirmPass.value = '';
                    } else {
                        alert('Error: ' + (data.message || 'Contraseña actual incorrecta.'));
                    }
                } catch (error) {
                    console.error('Error al cambiar contraseña de admin:', error);
                    alert('Error de conexión con el servidor.');
                }
            }
            // SUB-CASO A2: PESTAÑA CONFIGURACIÓN DE OTROS USUARIOS
            else {
                const targetUserId = adminUserSelect ? adminUserSelect.value : '';
                if (!targetUserId) {
                    alert('Por favor, selecciona un usuario de la lista desplegable.');
                    return;
                }

                const nombre = adminTargetName ? adminTargetName.value.trim() : '';
                const email = adminTargetEmail ? adminTargetEmail.value.trim() : '';
                const newPassword = adminTargetNewPass ? adminTargetNewPass.value.trim() : '';
                const confirmPassword = adminTargetConfirmPass ? adminTargetConfirmPass.value.trim() : '';
                const esIutepalista = adminTargetIutepalista ? adminTargetIutepalista.checked : false;

                if (newPassword && newPassword !== confirmPassword) {
                    alert('La nueva contraseña y su confirmación no coinciden.');
                    return;
                }

                try {
                    const response = await fetch('/admin/update-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            targetUserId,
                            nombre,
                            email,
                            newPassword,
                            esIutepalista
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('¡Credenciales del usuario actualizadas exitosamente!');
                        if (changePasswordModal) changePasswordModal.style.display = 'none';
                        await loadUsersForAdmin(); // Refrescar lista de usuarios en memoria
                    } else {
                        alert('Error: ' + (data.message || 'No se pudieron actualizar los datos del usuario.'));
                    }
                } catch (error) {
                    console.error('Error al actualizar usuario:', error);
                    alert('Error de conexión con el servidor.');
                }
            }
        } 
        // CASO B: USUARIO REGULAR (Modo usuario normal - Cambiar su propia contraseña)
        else {
            const userId = localStorage.getItem('currentUserId');
            const currentPassword = userCurrentPass ? userCurrentPass.value.trim() : '';
            const newPassword = userNewPass ? userNewPass.value.trim() : '';
            const confirmPassword = userConfirmPass ? userConfirmPass.value.trim() : '';

            if (!userId && userId !== 0) {
                alert('Error: No se detectó sesión de usuario activa.');
                return;
            }

            if (!currentPassword || !newPassword) {
                alert('Por favor, completa los campos requeridos.');
                return;
            }

            if (newPassword.length < 3) {
                alert('La nueva contraseña debe tener al menos 3 caracteres.');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('La nueva contraseña y su confirmación no coinciden.');
                return;
            }

            try {
                const response = await fetch('/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: userId,
                        currentPassword,
                        newPassword
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('¡Contraseña actualizada correctamente!');
                    if (changePasswordModal) changePasswordModal.style.display = 'none';
                    if (userCurrentPass) userCurrentPass.value = '';
                    if (userNewPass) userNewPass.value = '';
                    if (userConfirmPass) userConfirmPass.value = '';
                } else {
                    alert('Error: ' + (data.message || 'Contraseña actual incorrecta.'));
                }
            } catch (error) {
                console.error('Error al cambiar contraseña:', error);
                alert('Error de conexión con el servidor.');
            }
        }
    });
}

// =========================================================================
// MÓDULO DE GESTIÓN DE CARRERAS (ADMIN - AÑADIR Y EDITAR)
// =========================================================================
const addCarreraBtnEl = document.getElementById('addCarreraBtn');
const addCarreraModal = document.getElementById('addCarreraModal');
const closeAddCarreraBtn = document.getElementById('closeAddCarreraBtn');
const cancelAddCarreraBtn = document.getElementById('cancelAddCarreraBtn');
const addCarreraForm = document.getElementById('addCarreraForm');
const modalCarreraTitle = document.getElementById('modalCarreraTitle');
const carreraSelectAction = document.getElementById('carreraSelectAction');
const editingCarreraIdInput = document.getElementById('editingCarreraId');
const carreraNombreInput = document.getElementById('carreraNombre');
const carreraCodigoInput = document.getElementById('carreraCodigo');
const carreraColorInput = document.getElementById('carreraColor');
const carreraColorHex = document.getElementById('carreraColorHex');
const carreraIconoInput = document.getElementById('carreraIcono');
const carreraIconoHelp = document.getElementById('carreraIconoHelp');
const carreraIconoPreviewContainer = document.getElementById('carreraIconoPreviewContainer');
const carreraIconoPreviewLabel = document.getElementById('carreraIconoPreviewLabel');
const carreraIconoPreview = document.getElementById('carreraIconoPreview');
const carreraStatus = document.getElementById('carreraStatus');
const saveCarreraBtn = document.getElementById('saveCarreraBtn');
const deleteCarreraBtn = document.getElementById('deleteCarreraBtn');

/**
 * Llena el selector de acciones del modal de carreras (Nueva carrera + lista de existentes).
 * @param {string|number} [selectedId] - ID de la carrera a preseleccionar.
 */
function populateCarreraActionSelect(selectedId) {
    if (!carreraSelectAction) return;
    const currentVal = selectedId !== undefined ? String(selectedId) : (carreraSelectAction.value || 'new');
    carreraSelectAction.innerHTML = '<option value="new">➕ Añadir nueva carrera</option>';

    carreras.forEach(c => {
        const opt = document.createElement('option');
        opt.value = String(c.id);
        opt.textContent = `${c.nombre} (${c.codigo})`;
        if (String(c.id) === currentVal) {
            opt.selected = true;
        }
        carreraSelectAction.appendChild(opt);
    });

    if (currentVal && currentVal !== 'new') {
        carreraSelectAction.value = currentVal;
    }
}

/**
 * Configura los campos del formulario según se vaya a crear una nueva carrera o editar una existente.
 * @param {string|number} val - 'new' o el ID numérico de la carrera.
 */
function selectCarreraForModal(val) {
    if (val === 'new' || !val) {
        if (editingCarreraIdInput) editingCarreraIdInput.value = '';
        if (modalCarreraTitle) modalCarreraTitle.textContent = 'Añadir Nueva Carrera';
        if (saveCarreraBtn) saveCarreraBtn.textContent = 'Guardar Carrera';
        if (deleteCarreraBtn) deleteCarreraBtn.style.display = 'none';
        if (carreraNombreInput) carreraNombreInput.value = '';
        if (carreraCodigoInput) carreraCodigoInput.value = '';
        if (carreraColorInput) carreraColorInput.value = '#00bcd4';
        if (carreraColorHex) carreraColorHex.textContent = '#00bcd4';
        if (carreraIconoInput) carreraIconoInput.value = '';
        if (carreraIconoHelp) carreraIconoHelp.textContent = 'Selecciona una imagen representativa para la carrera.';
        if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'none';
        if (carreraIconoPreview) carreraIconoPreview.src = '';
        if (carreraStatus) carreraStatus.textContent = '';
    } else {
        const car = carreras.find(c => String(c.id) === String(val));
        if (!car) return;

        if (editingCarreraIdInput) editingCarreraIdInput.value = car.id;
        if (modalCarreraTitle) modalCarreraTitle.textContent = `Editar Carrera: ${car.nombre}`;
        if (saveCarreraBtn) saveCarreraBtn.textContent = 'Guardar Cambios';
        if (deleteCarreraBtn) deleteCarreraBtn.style.display = 'inline-block';
        if (carreraNombreInput) carreraNombreInput.value = car.nombre || '';
        if (carreraCodigoInput) carreraCodigoInput.value = car.codigo || '';
        const colorVal = car.color || '#00bcd4';
        if (carreraColorInput) carreraColorInput.value = colorVal;
        if (carreraColorHex) carreraColorHex.textContent = colorVal;
        if (carreraIconoInput) carreraIconoInput.value = '';
        if (carreraIconoHelp) carreraIconoHelp.textContent = 'Opcional: Selecciona un archivo nuevo solo si deseas cambiar el icono actual.';

        if (car.icono) {
            if (carreraIconoPreview) carreraIconoPreview.src = car.icono;
            if (carreraIconoPreviewLabel) carreraIconoPreviewLabel.textContent = 'Icono actual:';
            if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'flex';
        } else {
            if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'none';
            if (carreraIconoPreview) carreraIconoPreview.src = '';
        }
        if (carreraStatus) carreraStatus.textContent = '';
    }
}

/**
 * Abre el modal de carreras preseleccionando 'new' o una carrera en específico.
 * @param {string|number} [carreraIdToSelect='new']
 */
window.openCarreraModal = function(carreraIdToSelect = 'new') {
    populateCarreraActionSelect(carreraIdToSelect);
    if (carreraSelectAction) carreraSelectAction.value = String(carreraIdToSelect);
    selectCarreraForModal(carreraIdToSelect);
    if (addCarreraModal) addCarreraModal.style.display = 'flex';
};

if (addCarreraBtnEl) {
    addCarreraBtnEl.addEventListener('click', () => {
        window.openCarreraModal('new');
    });
}

if (carreraSelectAction) {
    carreraSelectAction.addEventListener('change', (e) => {
        selectCarreraForModal(e.target.value);
    });
}

if (closeAddCarreraBtn) {
    closeAddCarreraBtn.addEventListener('click', () => {
        if (addCarreraModal) addCarreraModal.style.display = 'none';
    });
}

if (cancelAddCarreraBtn) {
    cancelAddCarreraBtn.addEventListener('click', () => {
        if (addCarreraModal) addCarreraModal.style.display = 'none';
    });
}

if (carreraColorInput) {
    carreraColorInput.addEventListener('input', (e) => {
        if (carreraColorHex) carreraColorHex.textContent = e.target.value;
    });
}

if (carreraIconoInput) {
    carreraIconoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (carreraIconoPreview) carreraIconoPreview.src = ev.target.result;
                if (carreraIconoPreviewLabel) carreraIconoPreviewLabel.textContent = 'Nueva imagen seleccionada:';
                if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        } else {
            const isEditing = Boolean(editingCarreraIdInput && editingCarreraIdInput.value);
            if (isEditing) {
                const car = carreras.find(c => String(c.id) === String(editingCarreraIdInput.value));
                if (car && car.icono) {
                    if (carreraIconoPreview) carreraIconoPreview.src = car.icono;
                    if (carreraIconoPreviewLabel) carreraIconoPreviewLabel.textContent = 'Icono actual:';
                    if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'flex';
                } else {
                    if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'none';
                    if (carreraIconoPreview) carreraIconoPreview.src = '';
                }
            } else {
                if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'none';
                if (carreraIconoPreview) carreraIconoPreview.src = '';
            }
        }
    });
}

if (addCarreraForm) {
    addCarreraForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isEditing = Boolean(editingCarreraIdInput && editingCarreraIdInput.value);
        const editingId = isEditing ? editingCarreraIdInput.value : null;

        const nombre = (carreraNombreInput ? carreraNombreInput.value : '').trim();
        const codigo = (carreraCodigoInput ? carreraCodigoInput.value : '').trim();
        const color = carreraColorInput ? carreraColorInput.value : '#00bcd4';
        const file = carreraIconoInput ? carreraIconoInput.files[0] : null;

        if (!nombre) {
            alert('Por favor, ingresa el nombre de la carrera.');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        if (codigo) formData.append('codigo', codigo);
        formData.append('color', color);
        if (file) formData.append('icono', file);

        try {
            if (carreraStatus) {
                carreraStatus.textContent = isEditing
                    ? 'Guardando cambios de la carrera en la base de datos...'
                    : 'Guardando carrera en base de datos...';
            }

            const url = isEditing ? `/carreras/${editingId}` : '/carreras';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert(isEditing ? '¡Carrera actualizada con éxito!' : '¡Carrera añadida con éxito!');
                if (addCarreraModal) addCarreraModal.style.display = 'none';
                addCarreraForm.reset();
                if (editingCarreraIdInput) editingCarreraIdInput.value = '';
                if (carreraIconoPreviewContainer) carreraIconoPreviewContainer.style.display = 'none';
                await loadCarreras();
                await loadTrabajos();
                renderCards();
            } else {
                alert('Error: ' + (data.error || 'No se pudo guardar la carrera.'));
            }
        } catch (err) {
            console.error('Error al guardar carrera:', err);
            alert('Error de conexión al guardar la carrera.');
        } finally {
            if (carreraStatus) carreraStatus.textContent = '';
        }
    });
}

// =========================================================================
// MINI MODAL DE CONFIRMACIÓN PARA ELIMINAR CARRERA
// =========================================================================
const deleteCarreraModal = document.getElementById('deleteCarreraModal');
const closeDeleteCarreraBtn = document.getElementById('closeDeleteCarreraBtn');
const cancelDeleteCarreraModalBtn = document.getElementById('cancelDeleteCarreraModalBtn');
const confirmDeleteCarreraBtn = document.getElementById('confirmDeleteCarreraBtn');
const deleteCarreraTargetName = document.getElementById('deleteCarreraTargetName');
const deleteCarreraTargetMeta = document.getElementById('deleteCarreraTargetMeta');

let carreraToDeleteId = null;

function openDeleteCarreraModal(carreraId) {
    carreraToDeleteId = carreraId;
    const car = carreras.find(c => String(c.id) === String(carreraId));
    if (deleteCarreraTargetName) {
        deleteCarreraTargetName.textContent = car ? car.nombre : `Carrera #${carreraId}`;
    }
    if (deleteCarreraTargetMeta) {
        const codigoText = car && car.codigo ? `Código: ${car.codigo} • ` : '';
        deleteCarreraTargetMeta.textContent = `${codigoText}ID: ${carreraId}`;
    }
    if (deleteCarreraModal) {
        deleteCarreraModal.style.display = 'flex';
    }
}

function closeDeleteCarreraModal() {
    carreraToDeleteId = null;
    if (deleteCarreraModal) {
        deleteCarreraModal.style.display = 'none';
    }
}

if (closeDeleteCarreraBtn) {
    closeDeleteCarreraBtn.addEventListener('click', closeDeleteCarreraModal);
}
if (cancelDeleteCarreraModalBtn) {
    cancelDeleteCarreraModalBtn.addEventListener('click', closeDeleteCarreraModal);
}
if (deleteCarreraModal) {
    deleteCarreraModal.addEventListener('click', (e) => {
        if (e.target === deleteCarreraModal) {
            closeDeleteCarreraModal();
        }
    });
}

if (deleteCarreraBtn) {
    deleteCarreraBtn.addEventListener('click', () => {
        const editingId = editingCarreraIdInput ? editingCarreraIdInput.value : null;
        if (!editingId) return;
        openDeleteCarreraModal(editingId);
    });
}

if (confirmDeleteCarreraBtn) {
    confirmDeleteCarreraBtn.addEventListener('click', async () => {
        if (!carreraToDeleteId) return;
        const targetId = carreraToDeleteId;

        try {
            if (carreraStatus) carreraStatus.textContent = 'Eliminando carrera de la base de datos...';
            confirmDeleteCarreraBtn.disabled = true;
            confirmDeleteCarreraBtn.textContent = 'Eliminando...';

            const res = await fetch(`/carreras/${targetId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                closeDeleteCarreraModal();
                alert('¡Carrera eliminada con éxito!');
                if (addCarreraModal) addCarreraModal.style.display = 'none';
                if (addCarreraForm) addCarreraForm.reset();
                if (editingCarreraIdInput) editingCarreraIdInput.value = '';
                await loadCarreras();
                renderCards();
            } else {
                alert('Error: ' + (data.error || 'No se pudo eliminar la carrera.'));
            }
        } catch (err) {
            console.error('Error al eliminar carrera:', err);
            alert('Error de conexión al eliminar la carrera.');
        } finally {
            if (confirmDeleteCarreraBtn) {
                confirmDeleteCarreraBtn.disabled = false;
                confirmDeleteCarreraBtn.textContent = '🗑️ Sí, eliminar';
            }
            if (carreraStatus) carreraStatus.textContent = '';
        }
    });
}

