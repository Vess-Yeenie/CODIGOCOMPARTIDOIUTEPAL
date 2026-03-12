/**
 * ARCHIVO: menu.js - REESTRUCTURADO Y CORREGIDO
 */

let trabajos = []; // Se inicializa vía loadTrabajos()

async function loadTrabajos() {
    try {
        const response = await fetch('http://localhost:3000/trabajos');
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

// Inicialización
(async () => {
    await loadTrabajos();
    initYearSelect();
    renderCards();
    showHeaderButtons();
})();

// --- Funciones de Utilidad ---

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const carreraInput = document.getElementById('carreraInput'); // Asegúrate de tener este ID en tu HTML
    const anoInput = document.getElementById('anoInput');         // Asegúrate de tener este ID en tu HTML
    
    if (!fileInput.files[0]) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append('documento', fileInput.files[0]);
    
    // IMPORTANTE: Enviar estos campos para que el servidor no reciba 'undefined'
    formData.append('carrera', carreraInput ? carreraInput.value : 'INFORMATICA'); 
    formData.append('ano', anoInput ? anoInput.value : new Date().getFullYear());

    try {
        const res = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.url) {
            alert("Subido con éxito");
            location.reload(); 
        }
    } catch (err) {
        console.error("Error al subir:", err);
    }
}

function getCurrentUserName() {
    try { return localStorage.getItem('currentUserName') || ''; } catch (e) { return ''; }
}

function logUserAction(action, docId, docName) {
    try {
        const usuario_id = localStorage.getItem('currentUserId');
        if (!usuario_id) return;
        const fecha = new Date().toISOString();
        fetch('http://localhost:3000/log-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, action, doc_id: docId, fecha })
        }).catch(e => console.warn('Error logging action:', e));
    } catch (e) { console.warn('No se pudo registrar la acción', e); }
}

// Estados de usuario
const isAdmin = (function() {
    try { return localStorage.getItem('admin') === 'true'; } catch (e) { return false; }
})();
const isGuest = (function() {
    try { return !isAdmin && localStorage.getItem('guest') === 'true'; } catch (e) { return false; }
})();
const isIutepalista = (function() {
    try { return localStorage.getItem('iutepalistaStatus') === 'true'; } catch (e) { return false; }
})();

// --- Referencias DOM ---
const contenedorCards = document.querySelector('.documents');
const searchInput = document.querySelector('.search-bar input');
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
const typeButtonsContainer = document.getElementById('typeButtons');
const typeButtons = typeButtonsContainer ? Array.from(typeButtonsContainer.querySelectorAll('.type-btn')) : [];

const LINEAS_PDF_PATH = "STRUCTURE/PDFs/LINEAS DE INVESTIGACION  3  2025, 1 2026, 2 2026.pdf";

let selectedCarrera = null;
let selectedAno = 'todos';
let selectedTipo = 'todos';
let searchText = '';

// --- Renderizado ---
function renderCards() {
    const carreraButtonsLocal = document.querySelectorAll('.carrera-btn');
    carreraButtonsLocal.forEach(b => {
        b.classList.toggle('selected', selectedCarrera && b.dataset.carrera === selectedCarrera);
    });

    typeButtons.forEach(btn => {
        const type = btn.dataset.type;
        if (isAdmin) btn.style.display = '';
        else if (isIutepalista) btn.style.display = (type === 'resumen') ? '' : 'none';
        else btn.style.display = (type === 'trabajo' || type === 'presentacion') ? '' : 'none';
    });

    let items = trabajos.filter(item => {
        const carreraMatch = selectedCarrera ? item.carrera.toUpperCase() === selectedCarrera : true;
        // CAMBIO: Usamos item.ano (con n)
        const anoMatch = (selectedAno === 'todos') ? true : String(item.ano) === String(selectedAno);
        const searchMatch = searchText ? item.nombre.toLowerCase().includes(searchText) || item.carrera.toLowerCase().includes(searchText) : true;
        
        let typeRestriction;
        if (isAdmin) typeRestriction = true;
        else if (isIutepalista) typeRestriction = item.tipo === 'resumen';
        else typeRestriction = item.tipo === 'trabajo' || item.tipo === 'presentacion';

        const tipoMatch = (selectedTipo === 'todos') ? true : item.tipo === selectedTipo;
        return typeRestriction && carreraMatch && anoMatch && tipoMatch && searchMatch;
    });

    contenedorCards.innerHTML = '';
    // CAMBIO: Ordenar por item.ano
    if (!selectedCarrera) items.sort((a, b) => b.ano - a.ano);

    items.forEach(item => {
       const card = document.createElement('div');
card.className = 'doc-card';

card.innerHTML = `
    <div class="tipo-icon tipo-${(item.tipo || 'trabajo').toLowerCase()}"></div>
    <div class="doc-icon"></div>
    <div class="doc-title" title="${item.nombre}">${item.nombre}</div>
    <div class="tag-container">
        <span class="tag carrera-tag" data-carrera-color="${(item.carrera ? item.carrera.toUpperCase() : 'SIN CARRERA')}">
            ${item.carrera}
        </span>
        <span class="tag ano-tag">${item.ano}</span>
    </div>
    <div class="card-actions">
        ${!isGuest ? `<button class="edit-btn doc-btn" onclick="openEditModal(event, '${item.id}')"><img src="STRUCTURE/IMG/edit.svg" class="btn-icon"></button>` : ''}
        <button class="download-btn doc-btn" onclick="downloadItem(event, '${item.id}')"><img src="STRUCTURE/IMG/download.svg" class="btn-icon"></button>
        ${!isGuest ? `<button class="delete-btn doc-btn" onclick="deleteItem(event, '${item.id}')"><img src="STRUCTURE/IMG/trash.svg" class="btn-icon"></button>` : ''}
    </div>
`;
        card.onclick = () => {
            const url = item.pdf || item.pdf_url;
            if (url) { window.open(url, '_blank'); logUserAction('view', item.id, item.nombre); }
        };
        contenedorCards.appendChild(card);
    });

    if (addTrabajoBtn) addTrabajoBtn.style.display = isGuest ? 'none' : '';
    if (elaborarReporteBtn) elaborarReporteBtn.style.display = isGuest ? 'none' : '';
}

// --- Reporte (FUNCIÓN CORREGIDA) ---
async function openReportModal() {
    try {
        const response = await fetch('http://localhost:3000/report');
        const rawLogs = await response.json(); 

        // Verificamos que sea una lista para evitar el error .forEach
        if (!Array.isArray(rawLogs)) {
            console.error('El servidor no envió una lista:', rawLogs);
            alert('El servidor tiene un problema con la consulta de reportes.');
            return;
        }

        const usersMap = {};
        rawLogs.forEach(log => {
            const user = log.nombre || 'Usuario desconocido';
            if (!usersMap[user]) {
                usersMap[user] = { 
                    docs: new Set(), 
                    actions: 0, 
                    // Comprobamos si es 1 (true en MySQL)
                    isIutepalista: log.esIutepalista === 1 || log.esIutepalista === true 
                };
            }
            usersMap[user].actions++;
            if (log.doc_name) usersMap[user].docs.add(log.doc_name);
        });

        const counts = {};
        rawLogs.forEach(entry => {
            const key = entry.doc_name || "Documento sin título";
            counts[key] = (counts[key] || 0) + 1;
        });

        const docCounts = Object.entries(counts)
            .map(([k, v]) => ({ key: k, count: v }))
            .sort((a, b) => b.count - a.count);

        let html = `
            <div style="font-family:sans-serif; padding:10px;">
                <h3 style="color:#2c3e50; border-bottom:2px solid #eee;">📊 Reporte de Actividad</h3>
                <div style="display:flex; gap:20px; flex-wrap:wrap; margin-top:15px;">
                    <div style="flex:1; min-width:280px;">
                        <h4>Usuarios</h4>
                        <div style="max-height:350px; overflow-y:auto; background:#f8f9fa; border-radius:8px; padding:10px; border:1px solid #ddd;">`;

        Object.entries(usersMap).forEach(([name, data]) => {
            const tipo = data.isIutepalista ? 'IUTEPALISTA' : 'VISITANTE';
            const color = data.isIutepalista ? '#27ae60' : '#7f8c8d';
            html += `
                <div style="background:#fff; margin-bottom:8px; padding:10px; border-radius:6px; border:1px solid #eee;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${name}</strong>
                        <span style="font-size:10px; background:${color}; color:#fff; padding:2px 5px; border-radius:3px;">${tipo}</span>
                    </div>
                    <p style="margin:5px 0 0; font-size:12px; color:#666;">Acciones: ${data.actions} | Docs vistos: ${data.docs.size}</p>
                </div>`;
        });

        html += `</div></div>
                <div style="width:250px;">
                    <h4>Top 8 Más Vistos</h4>
                    <div style="background:#fff; border:1px solid #ddd; border-radius:8px; padding:15px;">
                        <ol style="margin:0; padding-left:20px; font-size:13px;">`;

        docCounts.slice(0, 8).forEach(d => {
            html += `<li style="margin-bottom:8px;">${d.key} <b>(${d.count})</b></li>`;
        });

        html += `</ol></div></div></div></div>`;
        
        if (reportContent) reportContent.innerHTML = html;
        if (reportModal) reportModal.style.display = 'flex';

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar el reporte.');
    }
}
// --- Eventos de Botones y Filtros ---

contenedorCards.addEventListener('click', (e) => {
    const btnEdit = e.target.closest('.edit-btn');
    const btnDownload = e.target.closest('.download-btn');
    const btnDelete = e.target.closest('.delete-btn');

    if (btnEdit) { e.stopPropagation(); openEditModal(btnEdit.dataset.id); }
    if (btnDelete) { e.stopPropagation(); if(confirm('¿Eliminar?')) deleteItem(btnDelete.dataset.id); }
    if (btnDownload) {
        e.stopPropagation();
        const item = trabajos.find(t => t.id === btnDownload.dataset.id);
        if (item) {
            const a = document.createElement('a');
            a.href = item.pdf || item.pdf_url;
            a.download = item.nombre;
            a.click();
            logUserAction('download', item.id, item.nombre);
        }
    }
});

if (addTrabajoBtn) addTrabajoBtn.addEventListener('click', () => {
    addTrabajoForm.reset();
    editingIdInput.value = '';
    addTrabajoModal.style.display = 'flex';
});

if (closeModalBtn) closeModalBtn.addEventListener('click', () => addTrabajoModal.style.display = 'none');

if (elaborarReporteBtn) elaborarReporteBtn.addEventListener('click', openReportModal);
if (reportCloseBtn) reportCloseBtn.addEventListener('click', () => reportModal.style.display = 'none');

if (openLineasModalBtn) {
    openLineasModalBtn.addEventListener('click', () => {
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

// --- MANEJO DEL FORMULARIO DE AÑADIR TRABAJO ---
// Referencias a elementos

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
    let urlFinal = "";

    // Solo requerimos archivo si no estamos editando o si se seleccionó uno nuevo
    if (!file && !isEditing) {
        alert("Por favor, selecciona un archivo (PDF o Video).");
        return;
    }

    try {
        uploadStatus.textContent = "Subiendo archivo a la nube...";
        
        // 2. Si hay un archivo nuevo, subirlo a Cloudinary
        if (file) {
            const formData = new FormData();
            formData.append('documento', file);

            const uploadRes = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Fallo en la subida");
            const uploadData = await uploadRes.json();
            urlFinal = uploadData.url;
        }

        // 3. Preparar datos para el servidor (MySQL)
        const trabajoData = {
            id: isEditing ? editingIdInput.value : null,
            nombre: document.getElementById('trabajoNombre').value,
            carrera: document.getElementById('trabajoCarrera').value,
            ano: document.getElementById('trabajoAno').value,
            // Si el archivo es video, forzamos el tipo 'video'
            tipo: (file && file.type.startsWith('video/')) ? 'video' : document.getElementById('trabajoTipo').value,
            pdf_url: urlFinal
        };

        const endpoint = isEditing ? '/updateTrabajo' : '/addTrabajo';
        
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trabajoData)
        });

        if (response.ok) {
            alert(isEditing ? "¡Actualizado con éxito!" : "¡Guardado con éxito!");
            closeModal();
            loadTrabajos(); // Recarga las tarjetas
        } else {
            throw new Error("Error al guardar en la base de datos");
        }

    } catch (error) {
        console.error(error);
        alert("Hubo un error: " + error.message);
    } finally {
        uploadStatus.textContent = "";
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
        searchText = e.target.value.toLowerCase();
        renderCards();
    });
}

document.querySelectorAll('.carrera-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCarrera = (selectedCarrera === btn.dataset.carrera) ? null : btn.dataset.carrera;
        renderCards();
    });
});

typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedTipo = (selectedTipo === btn.dataset.type) ? 'todos' : btn.dataset.type;
        typeButtons.forEach(b => b.classList.toggle('selected', b.dataset.type === selectedTipo));
        renderCards();
    });
});

// Inicializar Select de Años
function initYearSelect() {
    if (!yearSelect) return;
    yearSelect.innerHTML = '<option value="todos">Todos</option>';
    for (let y = 2018; y <= 2026; y++) {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        yearSelect.appendChild(opt);
    }
}

// --- CORRECCIÓN FILTRO DE FECHA ---

if (dateDropdown) {
    dateDropdown.addEventListener('click', (e) => {
        // e.stopPropagation() evita que el clic "atraviese" el botón 
        // y active otros eventos de cierre.
        e.stopPropagation();
        
        const isVisible = monthYearMenu.style.display === 'block';
        monthYearMenu.style.display = isVisible ? 'none' : 'block';
    });
}

// Evitar que el menú se cierre al hacer clic dentro de él (en el select o el botón set)
if (monthYearMenu) {
    monthYearMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Cerrar el menú si haces clic en cualquier otro lugar de la pantalla
document.addEventListener('click', () => {
    if (monthYearMenu) {
        monthYearMenu.style.display = 'none';
    }
});

if (setYear) {
    setYear.addEventListener('click', () => {
        selectedAno = yearSelect.value;
        // Actualizar el texto del botón para que el usuario vea qué año eligió
        if (selectedDate) {
            selectedDate.textContent = (selectedAno === 'todos') ? 'Todos' : selectedAno;
        }
        monthYearMenu.style.display = 'none'; // Cerrar al aplicar
        renderCards(); // Filtrar los documentos
    });
}

// Cerrar sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'Index.html';
    });
}

function showHeaderButtons() {
    const userId = localStorage.getItem('currentUserId');
    const userRole = localStorage.getItem('userRole');

    // Seleccionamos los botones por sus IDs (asegúrate que existan en el HTML)
    const logoutBtn = document.getElementById('logoutBtn');
    const changePassBtn = document.getElementById('changePassBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn'); // Si tienes uno de admin

    if (userId) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (changePassBtn) changePassBtn.style.display = 'block';
        
        // Mostrar panel de admin solo si el rol es 'admin'
        if (adminPanelBtn) {
            adminPanelBtn.style.display = (userRole === 'admin') ? 'block' : 'none';
        }
    } else {
        // Si no hay sesión, los ocultamos
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (changePassBtn) changePassBtn.style.display = 'none';
    }
}

// Función para borrar corregida
async function deleteItem(event, id) {
    if (event) event.stopPropagation(); // Evita abrir el PDF
    if (!confirm('¿Estás seguro de que deseas eliminar este trabajo?')) return;

    try {
        const response = await fetch(`http://localhost:3000/deleteTrabajo/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadTrabajos();
            renderCards();
        }
    } catch (error) {
        console.error("Error al borrar:", error);
    }
}
// Función para descargar sin abrir el visor
function downloadItem(event, id) {
    event.stopPropagation(); // Evita abrir el PDF
    const item = trabajos.find(t => t.id === id);
    if (item) {
        const a = document.createElement('a');
        a.href = item.pdf || item.pdf_url;
        a.download = item.nombre;
        a.target = '_blank';
        a.click();
        logUserAction('download', item.id, item.nombre);
    }
}



function openEditModal(event, id) {
    if (event) event.stopPropagation(); // Evita abrir el PDF
    
    const item = trabajos.find(t => t.id === id);
    if (!item) return;

    editingIdInput.value = id; 
    document.getElementById('trabajoNombre').value = item.nombre;
    document.getElementById('trabajoCarrera').value = item.carrera;
    document.getElementById('trabajoAno').value = item.ano; // Con N
    document.getElementById('trabajoTipo').value = item.tipo;

    const modalTitle = document.querySelector('#addTrabajoModal h2');
    if (modalTitle) modalTitle.textContent = "Editar Trabajo";

    addTrabajoModal.style.display = 'flex';
}

// --- FUNCIÓN PARA CAMBIAR CONTRASEÑA ---
const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const closeChangePassBtn = document.getElementById('closeChangePassBtn');
const savePasswordBtn = document.getElementById('savePasswordBtn');

// Abrir modal
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        if (changePasswordModal) changePasswordModal.style.display = 'flex';
    });
}

// Cerrar modal
if (closeChangePassBtn) {
    closeChangePassBtn.addEventListener('click', () => {
        changePasswordModal.style.display = 'none';
    });
}

// Guardar nueva contraseña en la Base de Datos
if (savePasswordBtn) {
    savePasswordBtn.addEventListener('click', async () => {
        const current = document.getElementById('currentPassword').value;
        const neo = document.getElementById('newPassword').value;
        const userId = localStorage.getItem('currentUserId');

        if (!userId) {
            alert('Error: No se detectó sesión de usuario.');
            return;
        }

        if (!current || !neo) {
            alert('Por favor, completa los campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: userId,
                    currentPassword: current,
                    newPassword: neo
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('¡Contraseña actualizada correctamente!');
                changePasswordModal.style.display = 'none';
                // Limpiar campos
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
            } else {
                alert('Error: ' + (data.message || 'No se pudo cambiar la contraseña.'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor.');
        }
    });
}
