const defaultTrabajos = [
    {
        id: 't1',
        nombre: "Estrategias Para El Mejoramiento En El Proceso De Cálculo, Pago Y Retención Del Impuesto Al Valor Agregado (I.V.A.) En La Empresa Rectificadora De Motores J&D C.A. De Morón Estado Carabobo",
        año: 2018,
        carrera: "ADMINISTRACION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/TRABAJO DE GRADO MIXARI Y YOSMERY (1).pdf"
    },
    {
        id: 't2',
        nombre: "Diseño De Un Sistema Automatizado Que Registre Y Controle La Matrícula De Los Alumnos De La Escuela Básica Nacional “Taborda”, Ubicada En Puerto Cabello, Estado Carabobo.",
        año: 2018,
        carrera: "INFORMATICA",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/TRABAJO DE GRADO INFORMATICA.pdf"
    },
    {
        id: 't3',
        nombre: "Estrategias Motivacionales Para La Mejora De La Satisfacción Laboral De Los Empleados En La Empresa Martínez Reyes Aduana S.R.L.",
        año: 2021,
        carrera: "ADMINISTRACION",
        tipo: "trabajo",
        pdf: "STRUCTURE/PDFs/TG IUTEPAL EDUARDO BASTIDAS.pdf"
    },
    {
        id: 't4',
        nombre: "Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "trabajo",
        pdf: "STRUCTURE/PDFs/TEG_Marbelis_Pérez PRODUCCION INDUSTRIAL.pdf"
    },
    {
        id: 't5',
        nombre: "Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello",
        año: 2018,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/TEG_JOUSEPH_DÍAZ_DEFINITIVO_JOUSEPH_DÍAZ_LESSIRE_ELECTRONICA.pdf"
    },
    {
        id: 't6',
        nombre: "Mejora Estructural Del Sistema De Cribas En La Unidad De Granulación De La Planta De Urea.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "trabajo",
        pdf: "STRUCTURE/PDFs/TEG_Luis_Mencías PRODUCCION INDUSTRAL.pdf"
    },
    {
        id: 't7',
        nombre: "Plan De Mantenimiento Preventivo A Una Máquina Jumbo 320 C En La Empresa Multireciclajes PC.CA",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "trabajo",
        pdf: "STRUCTURE/PDFs/TEG_EdwinMedina PRODUCCION INDUSTRIAL.pdf"
    },
    {
        id: "t8",
        nombre: "Estrategias Contables Para La Optimización De La Gestión Presupuestaria En El Departamento De Repuesto De La Empresa Toyoprimium, C.A. Puerto Cabello Estado Carabobo",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/estrategias_contables_para_la_optimizacion_de_la_gestion_presupuestaria_en_el_departamento_de_de_la.pdf"
    },
    {
        id: "t9",
        nombre: "Estrategias Administrativas Y Contables Para Mejorar El Modo De Cobranza En La Empresa Servicio De D G M De Puerto Cabello",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/ESTRATEGIAS ADMINISTRATIVAS PARA LA OPTIMIZACIÓN DE LA GESTIÓN.pdf"
    },
    {
        id: "t10",
        nombre: "Sistema Contable Administrativo Para Adecuar La Información Financiera De La Empresa Inversiones Halcones C.A Estado Carabobo, Puerto Cabello 2024",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/carrera_administracion_mencion_contabilidad_y_finanza_sistema_contable_administrativo_para_adecuar_c.pdf"
    },
    {
        id: "t11",
        nombre: "Estrategias Administrativas Para La Optimización De La Gestión Contable De La Empresa F. Stanzione, S.A. Puerto Cabello - Estado Carabobo",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/ESTRATEGIAS ADMINISTRATIVAS PARA LA OPTIMIZACIÓN DE LA GESTIÓN.pdf"
    },
    {
        id: "t12",
        nombre: "Estrategias Gerenciales Para Optimizar El Desarrollo Laboral De Los Trabajadores En La Agencia Aduanal Marguani C.A Puerto Cabello Estado Carabobo.”.",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/ESTRATEGIAS GERENCIALES PARA OPTIMIZAR EL DESARROLLO LABORAL.pdf"
    },
    {
        id: "t13",
        nombre: "Estrategias Contables Para Adecuar Los Gastos En La Empresa Agentes Aduanales Marieka C.A, En Puerto Cabello, Edo. Carabobo",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/estrategias_contables_para_adecuar_los_gastos_en_la_empresa_agentes_aduanales_marieka_c_a_en_puerto.pdf"
    },
    {
        id: "t14",
        nombre: "Estrategias Gerenciales Para Optimizar La Gestión Contable En La Empresa Sugar Fantasy Puerto Cabello Edo. Carabobo",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/estrategias_gerenciales_para_optimizar_la_gestion_contable_en_la_empresa_sugar_fantasy_puerto_edo.pdf"
    },
    {
        id: "t15",
        nombre: "Estrategias Contables Para El Fortalecimiento De La Gestión Administrativa En La Empresa Fariñas Y Colina, C.A., Agente De Aduanas",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/estrategias_contables_para_el_fortalecimiento_de_la_gestion_administrativ_a_en_la_empresa_farinas_y.pdf"
    },
    {
        id: "t16",
        nombre: "Método Contable Para El Control Del Inventario En La Empresa Andy Repuestos F.P, Puerto Cabello Estado Carabobo",
        año: 2024,
        carrera: "CONTABILIDAD",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/Método contable para el control del inventario en la empresa Andy Repuestos.pdf"
    },
    {
        id: "t17",
        nombre: "Implementación De Prácticas De Laboratorio En Microcontroladores Y Plc Para Electrónica",
        año: 2024,
        carrera: "ELECTRONICA",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/de_puerto_cabello_la_investigacion_se_enmarca_bajo_la_modalidad_de_proyecto_factible_con_el_fin_de_7.pdf"
    },
    {
        id: "t18",
        nombre: "Propuesta De Implementación De Prácticas De Laboratorio En Máquinas Eléctricas Para Electrónica",
        año: 2024,
        carrera: "ELECTRONICA",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/proporcionando_a_los_estudiantes_una_experiencia_de_aprendizaje_mas_completa_y_significativa_la_los.pdf"
    },
    {
        id: "t19",
        nombre: "Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello",
        año: 2024,
        carrera: "ELECTRONICA",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/PLAN DE RECUPERACIÓN DE OPERATIVIDAD DE ASCENSORES.pdf"
    },
    {
        id: "t20",
        nombre: "Propuesta Para La Implementación De Un Sistema De Gestión De La Calidad, Basado En La Norma ISO 9001:2015, Para La Empresa Industrias Alimenticias Cocoa, C.A.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/ampliacion_puerto_cabello_propuesta_para_la_implementacion_de_un_sistema_de_gestion_de_la_calidad_en.pdf"
    },
    {
        id: "t21",
        nombre: "Propuesta De Un Programa De Seguridad Y Salud Ocupacional Para Reducir Lesiones Y Enfermedades Laborales En El Área De Soldadura Dirigida A Los Trabajadores De La Asociación Cooperativa Fabrisol RL. Ubicado En El Municipio Juan Jose Mora.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/propuesta_de_un_programa_de_seguridad_y_salud_ocupacional_para_reducir_lesiones_y_enfermedades_en_el.pdf"
    },
    {
        id: "t22",
        nombre: "Plan De Mantenimiento Preventivo A Máquina Jumbo 320C En La Empresa Multireciclajes PC",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/plan_de_mantenimiento_preventivo_a_maquina_jumbo_320c_en_la_empresa_multireciclajes_pc.pdf"
    },
    {
        id: "t23",
        nombre: "Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/sistema_de_gestion_de_mantenimiento_preventivo_y_correctivo_a_las_maquinas_de_ensacado_de_urea_del.pdf"
    },
    {
        id: "t24",
        nombre: "Medidas Para Mejorar Las Condiciones De Seguridad Y Salud Laboral En Las Operaciones De La Empresa Supercines Costa Mar C.A.",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/medidas_para_mejorar_las_condiciones_de_seguridad_y_salud_laboral_en_las_operaciones_de_la_empresa_c.pdf"
    },
    {
        id: "t25",
        nombre: "Evaluación Del Sistema De Ensacado Para La Minimización De Riesgos Laborales De La Empresa Ferro Aluminio CA",
        año: 2024,
        carrera: "PRODUCCION",
        tipo: "resumen",
        pdf: "STRUCTURE/PDFs/evaluacion_del_sistema_de_ensacado_para_la_minimizacion_de_riesgos_laborales_de_la_empresa_ferro_ca.pdf"
    },
];

let trabajos =  defaultTrabajos.slice() || JSON.parse(localStorage.getItem('trabajosDeGrado')) ;
// Asegurar ids únicos
trabajos = trabajos.map(item => ({ ...item, id: item.id || (Date.now().toString() + Math.random().toString(36).slice(2)) }));
localStorage.setItem('trabajosDeGrado', JSON.stringify(trabajos));

// Map para URLs creadas en sesión (no persisten al recargar)
const inMemoryPdfMap = {}; // id -> objectURL

// Nuevo: detectar si el acceso es como "admin" o "guest"
const isAdmin = (function() {
    try {
        return localStorage.getItem('admin') === 'true' || (document.referrer && document.referrer.includes('login-admin.html'));
    } catch (e) {
        return false;
    }
})();
const isGuest = (function() {
    try {
        // si es admin, no considerar guest
        if (isAdmin) return false;
        return localStorage.getItem('guest') === 'true' || (document.referrer && document.referrer.includes('login-guest.html'));
    } catch (e) {
        return false;
    }
})();

// Nuevo: detectar si el usuario es "IUTEPALISTA"
const isIutepalista = (function() {
    try {
        // Asume que esta clave se guarda en el login exitoso (como sugerimos antes)
        return localStorage.getItem('iutepalistaStatus') === 'true';
    } catch (e) {
        return false;
    }
})();



// Referencias DOM
const contenedorCards = document.querySelector('.documents');
const searchInput = document.querySelector('.search-bar input');
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
// Referencias del nuevo reporte
const elaborarReporteBtn = document.getElementById('elaborarReporteBtn');
const reportModal = document.getElementById('reportModal');
const reportCloseBtn = document.getElementById('reportCloseBtn');
const reportContent = document.getElementById('reportContent');
// currentPdfInfo puede no existir en el DOM; guardamos la referencia y comprobamos antes de usar
const currentPdfInfo = document.getElementById('currentPdfInfo');
//DOM para modal de lineas de investigacion
const openLineasModalBtn = document.getElementById('openLineasModalBtn');
const lineasModal = document.getElementById('lineasModal');
const closeLineasModalBtn = document.getElementById('closeLineasModalBtn');
const lineasPdfViewer = document.getElementById('lineasPdfViewer');
const LINEAS_PDF_PATH = "STRUCTURE/PDFs/LINEAS DE INVESTIGACION  3  2025, 1 2026, 2 2026.pdf";



let selectedCarrera = null;
let selectedAno = 'todos';
let selectedTipo = 'todos';
let searchText = '';

// --- Renderizado de tarjetas desde arreglo ---
function renderCards() {
    contenedorCards.innerHTML = '';
    const now = new Date();
    // aplicar filtros sobre array antes de crear DOM
   // CÓDIGO MODIFICADO (dentro de renderCards)

    let items = trabajos.filter(item => {
    
    // Filtros existentes
    const carreraMatch = selectedCarrera ? item.carrera.toUpperCase() === selectedCarrera : true;
    const anoMatch = (selectedAno === 'todos') ? true : String(item.año) === String(selectedAno);
    const searchMatch = searchText ? item.nombre.toLowerCase().includes(searchText) || (item.carrera && item.carrera.toLowerCase().includes(searchText)) : true;
    
    // 🟢 RESTRICCIÓN DE TIPO (Actualizada)
    let typeRestriction;

    if (isAdmin) {
        // Excepción ADMIN: ve todos los tipos
        typeRestriction = true;
    } else if (isIutepalista) {
        // IUTEPALISTA: solo ve 'resumen'
        typeRestriction = item.tipo === 'resumen';
    } else {
        // VISITANTE/NO IUTEPALISTA: ve 'trabajo' o 'presentacion'
        typeRestriction = item.tipo === 'trabajo' || item.tipo === 'presentacion';
    }

    // Filtro de tipo seleccionado (de los botones)
    const tipoMatch = (selectedTipo === 'todos') ? true : item.tipo === selectedTipo;
    
    // La restricción de tipo debe cumplirse, y luego el filtro de tipo (si se aplica)
    return typeRestriction && carreraMatch && anoMatch && tipoMatch && searchMatch;
});
// CÓDIGO MODIFICADO (Al inicio de renderCards)

// 🟢 Ajuste de visibilidad de botones de tipo
if (typeButtonsContainer) {
    typeButtons.forEach(btn => {
        const type = btn.dataset.type;
        
        if (isAdmin) {
            // ADMIN: Muestra todos los botones
            btn.style.display = '';
        } else if (isIutepalista) {
            // IUTEPALISTA: Muestra solo 'resumen'
            btn.style.display = (type === 'resumen') ? '' : 'none';
        } else {
            // VISITANTE/NO IUTEPALISTA: Muestra 'trabajo' y 'presentacion'
            btn.style.display = (type === 'trabajo' || type === 'presentacion') ? '' : 'none';
        }
    });
}

contenedorCards.innerHTML = '';
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
        const carreraColor = item.carrera.toUpperCase()
        const iconDiv = document.createElement('div');
        iconDiv.className = 'doc-icon';
        card.appendChild(iconDiv);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'doc-title';
        // Mostrar texto completo (sin truncado)
        const fullText = `${item.nombre || 'Sin título'}`;
        infoDiv.textContent = fullText;
        infoDiv.title = fullText;
        card.appendChild(infoDiv);

        const tagDiv = document.createElement("div");
        tagDiv.className = "tag-container";
        tagDiv.innerHTML=` <span class="tag carrera-tag" data-carrera-color="${carreraColor}">${item.carrera}</span>
            <span class="tag ano-tag">${item.año}</span>`
        card.appendChild(tagDiv)
        // acciones: si es guest -> solo Descargar; si no -> Editar + Descargar + Eliminar
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        if (isGuest) {
            actions.innerHTML = `<button class="download-btn doc-btn" title="Descargar" data-id="${item.id}"><img src="STRUCTURE/IMG/download.svg" class="btn-icon"></button>`;
        } else {
            actions.innerHTML = `
                <button class="edit-btn doc-btn" title="Editar" data-id="${item.id}"><img src="STRUCTURE/IMG/edit.svg" class="btn-icon"></button>
                <button class="download-btn doc-btn" doc-btn title="Descargar" data-id="${item.id}"><img src="STRUCTURE/IMG/download.svg" class="btn-icon"></button>
                <button class="delete-btn doc-btn" title="Eliminar" data-id="${item.id}"><img src="STRUCTURE/IMG/trash.svg" class="btn-icon"></button>
            `;
        }
        card.appendChild(actions);

        contenedorCards.appendChild(card);
    });

    // Ocultar botones fijos en la interfaz solo si es guest; admin y usuarios normales los ven
    if (isGuest) {
        if (addTrabajoBtn) addTrabajoBtn.style.display = 'none';
        if (elaborarReporteBtn) elaborarReporteBtn.style.display = 'none';
    } else {
        if (addTrabajoBtn) addTrabajoBtn.style.display = '';
        if (elaborarReporteBtn) elaborarReporteBtn.style.display = '';
    }
}

// --- Utilidades ---
function saveToStorage() {
    localStorage.setItem('trabajosDeGrado', JSON.stringify(trabajos));
}

// --- Manejo de clicks delegados en sección de documentos ---
contenedorCards.addEventListener('click', (e) => {
    const btnEdit = e.target.closest('.edit-btn');
    const btnDownload = e.target.closest('.download-btn');
    const btnDelete = e.target.closest('.delete-btn');
    const card = e.target.closest('.doc-card');

    if (btnEdit) {
        const id = btnEdit.dataset.id;
        openEditModal(id);
        return;
    }

    if (btnDownload) {
        e.stopPropagation();
        const id = btnDownload.dataset.id;
        // intentar obtener URL preferente: objectURL en memoria -> campo pdf del objeto -> data attribute
        const item = trabajos.find(t => t.id === id);
        const url = inMemoryPdfMap[id] || (item && item.pdf) || (card && (card.dataset.pdfurl || card.dataset.pdfUrl));
        if (!url) {
            alert('Archivo no disponible para descargar (puede ser que el PDF fue subido en otra sesión).');
            return;
        }
        // Derivar nombre de archivo
        const filename = (typeof url === 'string' && url.split('/').pop()) || (item && item.pdf) || 'document.pdf';
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        // algunos navegadores requieren append
        document.body.appendChild(a);
        a.click();
        a.remove();
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

// Reemplazamos el select por botones en el header
const typeButtonsContainer = document.getElementById('typeButtons');
const typeButtons = typeButtonsContainer ? Array.from(typeButtonsContainer.querySelectorAll('.type-btn')) : [];

// Nuevo manejo: listeners en los botones de tipo, usando la clase "selected"
if (typeButtons && typeButtons.length) {
    // Asegurar que no haya clases previas
    typeButtons.forEach(btn => btn.classList.remove('selected'));

    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const t = btn.dataset.type;
            // Toggle: si se pulsa el mismo botón, volver a 'todos' (sin selección)
            if (selectedTipo === t) {
                selectedTipo = 'todos';
            } else {
                selectedTipo = t;
            }
            // actualizar clases "selected"
            typeButtons.forEach(b => b.classList.remove('selected'));
            if (selectedTipo !== 'todos') {
                const toActivate = typeButtons.find(b => b.dataset.type === selectedTipo);
                if (toActivate) toActivate.classList.add('selected');
            }
            renderCards();
        });
    });
}

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

// --- Función para abrir modal de reporte ---
function openReportModal() {
    // Obtener logs desde localStorage (posibles formatos)
    const rawLogs = JSON.parse(localStorage.getItem('logs')) || [];
    const usersMap = {}; // user -> Set of doc identifiers/names
    // Soporte para varios esquemas de registro
    rawLogs.forEach(entry => {
        if (!entry) return;
        // Si entry es string
        if (typeof entry === 'string') {
            usersMap['Sin usuario'] = usersMap['Sin usuario'] || new Set();
            usersMap['Sin usuario'].add(entry);
            return;
        }
        const user = entry.user || entry.username || entry.email || 'Sin usuario';
        // caso: entrada con array reviewed
        if (Array.isArray(entry.reviewed)) {
            usersMap[user] = usersMap[user] || new Set();
            entry.reviewed.forEach(d => usersMap[user].add(d));
            return;
        }
        // caso: entrada individual con doc/document/docId/pdf/title
        const possibleDoc = entry.doc || entry.document || entry.docId || entry.pdf || entry.title || entry.file || entry.documentName;
        if (possibleDoc) {
            usersMap[user] = usersMap[user] || new Set();
            usersMap[user].add(possibleDoc);
            return;
        }
        // caso: logs estilo { user, action: 'view', id: 't123' }
        if (entry.action && (entry.id || entry.itemId || entry.documentId)) {
            const docId = entry.id || entry.itemId || entry.documentId;
            usersMap[user] = usersMap[user] || new Set();
            usersMap[user].add(docId);
            return;
        }
        // fallback: guardar la entrada completa como JSON string
        usersMap[user] = usersMap[user] || new Set();
        usersMap[user].add(JSON.stringify(entry));
    });

    // Preparar mapa de id -> nombre de documento (si aplica)
    const idToName = {};
    trabajos.forEach(t => { if (t.id) idToName[t.id] = t.nombre || t.title || ''; });

    // Renderizar contenido
    if (Object.keys(usersMap).length === 0) {
        reportContent.innerHTML = '<p>No hay registros de usuarios.</p>';
    } else {
        let html = '<div class="report-list">';
        for (const [user, docSet] of Object.entries(usersMap)) {
            html += `<div class="report-user"><strong>${user}</strong><ul>`;
            Array.from(docSet).forEach(doc => {
                // Si el doc coincide con un id conocido, mostrar nombre legible
                const resolved = idToName[doc] || doc;
                html += `<li>${resolved}</li>`;
            });
            html += '</ul></div>';
        }
        html += '</div>';
        reportContent.innerHTML = html;
    }

    // Mostrar modal
    if (reportModal) reportModal.style.display = 'flex';
}

//Modal lineas de investiacion
if (openLineasModalBtn) {
    openLineasModalBtn.addEventListener('click', () => {
        // Cargar el PDF en el iframe
        lineasPdfViewer.src = LINEAS_PDF_PATH; 
        
        // Mostrar el modal
        lineasModal.style.display = 'flex';
    });
}
//  Lógica para cerrar el modal
if (closeLineasModalBtn) {
    closeLineasModalBtn.addEventListener('click', () => {
        lineasModal.style.display = 'none';
        // Opcional: Detener la carga del PDF para liberar recursos
        lineasPdfViewer.src = ''; 
    });
}

// Cerrar al hacer clic fuera del modal (si lo deseas)
window.addEventListener('click', (event) => {
    if (event.target === lineasModal) {
        lineasModal.style.display = 'none';
        lineasPdfViewer.src = ''; 
    }
});
// Listeners para abrir/cerrar reporte
if (elaborarReporteBtn) {
    elaborarReporteBtn.addEventListener('click', openReportModal);
}
if (reportCloseBtn) {
    reportCloseBtn.addEventListener('click', () => { if (reportModal) reportModal.style.display = 'none'; });
}
if (reportModal) {
    reportModal.addEventListener('click', (e) => { if (e.target === reportModal) reportModal.style.display = 'none'; });
}

// Render inicial
renderCards();

