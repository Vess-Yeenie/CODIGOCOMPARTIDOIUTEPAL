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
    {
        id: "t26",
        nombre: "PLAN DE CAPACITACIÓN PARA LA OPTIMIZACIÓN DEL DESEMPEÑÓ LABORAL DEL PERSONAL ADMINISTRATIVO EN LA DIRECCIÓN DE RECURSOS HUMANOS EN EL I.V.S.S DE PUERTO – ESTADO CARABOBO 2024.",
        año: 2024,
        carrera: "ADMINISTRACION",
        tipo: "presentacion",
        pdf: "STRUCTURE/PDFs/iutepal Dayerlin Mijares.mp4"
    },
    {
        id: "t27",
        nombre: "Estrategias Motivacionales para la Optimización de los Procesos Administrativos en la Coordinación de Tesorería Adscrita a la División de Gestión Administrativa Bolivariana de puertos (Bolipuertos S.A)",
        año: 2023,
        carrera: "ADMINISTRACION",
        tipo: "presentacion",
        pdf: "STRUCTURE/PDFs/deapositiva yoangel LISTA 08-08-2023.mp4"
    },
    {
        id: "t28",
        nombre: "ESTRATEGIAS PARA LA OPTIMIZACIÓN DE LA GESTIÓN CONTABLE EN BOLIVARIANA DE PUERTO (BOLIPUERTO), PUERTO CABELLO, ESTADO CARABOBO",
        año: 2023,
        carrera: "ADMINISTRACION",
        tipo: "presentacion",
        pdf: "STRUCTURE/PDFs/adriana Arcila diapositiva, FINAL 08-08-2023-.mp4"
    },
    {
        id: "t29",
        nombre: "ESTRATEGIAS ADMINISTRATIVAS PARA FORTALECER EL MANEJO EFICIENTE DE LOS RECURSOS DEL INSTITUTO MUNICIPAL DEL DEPORTE PARA PUERTO CABELLO (IMDEPUERTO), ESTADO CARABOBO",
        año: 2025,
        carrera: "ADMINISTRACION",
        tipo: "presentacion",
        pdf: "STRUCTURE/PDFs/Presentación Maria CerradaY Genesis Nuñlez.mp4"
    },
    {
        id: "t30",
        nombre: "ESTRATEGIAS ADMINISTRATIVAS PARA OPTIMIZAR EL CLIMA ORGANIZACIONAL EN LA EMPRESA AGENTE ADUANAL FRONTERA VENCOL C.A. PUERTO CABELLO ESTADO CARABOBO",
        año: 2025,
        carrera: "ADMINISTRACION",
        tipo: "presentacion",
        pdf: "STRUCTURE/PDFs/DIAPOSITIVAS FABIANA MARQUEZ 05 de agosto (1).mp4"
    },
];

let trabajos = []; // quedará inicializado por loadTrabajos()

function ensureIds(arr) {
    return arr.map(item => ({ ...item, id: item.id || (Date.now().toString() + Math.random().toString(36).slice(2)) }));
}

function loadTrabajos() {
    try {
        const stored = localStorage.getItem('trabajosDeGrado');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) {
                trabajos = ensureIds(parsed);
                return;
            }
        }
    } catch (e) {
        console.warn('Error leyendo trabajos desde localStorage:', e);
    }
    // fallback a datos por defecto
    trabajos = ensureIds(defaultTrabajos.slice());
    // guardar el fallback en storage para la primera carga
    saveToStorage();
}

// llamar inicialización
loadTrabajos();

// Map para URLs creadas en sesión (no persisten al recargar)
const inMemoryPdfMap = {}; // id -> objectURL

// Utilidades para logging de acciones por usuario (view / download)
function getCurrentUserName() {
    try {
        return localStorage.getItem('currentUserName') || '';
    } catch (e) {
        return '';
    }
}

function logUserAction(action, docId, docName) {
    try {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        const isIute = (function(){ try { return localStorage.getItem('iutepalistaStatus') === 'true'; } catch(e){ return false; } })();
        const entry = {
            user: getCurrentUserName(),
            action: action,
            id: docId || null,
            name: docName || null,
            isIutepalista: isIute,
            timestamp: new Date().toISOString()
        };
        logs.push(entry);
        localStorage.setItem('logs', JSON.stringify(logs));
    } catch (e) {
        console.warn('No se pudo registrar la acción en logs', e);
    }
}

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
// Referencias para control de archivos y tipo
const trabajoTipoSelect = document.getElementById('trabajoTipo');
const trabajoPdfInput = document.getElementById('trabajoPdf');
const fileLabel = document.getElementById('fileLabel');
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

        // Nuevo: icono de tipo en esquina superior derecha
        const tipoIcon = document.createElement('div');
        tipoIcon.className = `tipo-icon tipo-${(item.tipo || 'trabajo').toString().toLowerCase()}`;
        card.appendChild(tipoIcon);
        
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

// Helpers para validar tipo de archivo
function isVideoFile(file) {
    if (!file) return false;
    try {
        if (file.type && file.type.startsWith('video/')) return true;
        const name = file.name || '';
        return /\.(mp4|webm|mov|ogg|mkv)$/i.test(name);
    } catch(e){ return false; }
}
function isPdfFile(file) {
    if (!file) return false;
    try {
        if (file.type && file.type === 'application/pdf') return true;
        const name = file.name || '';
        return /\.pdf$/i.test(name);
    } catch(e){ return false; }
}

// Actualizar el atributo 'accept' y el texto del label según el tipo seleccionado
function updateFileInputAccept(tipo) {
    if (!trabajoPdfInput || !fileLabel) return;
    if (tipo === 'presentacion') {
        trabajoPdfInput.accept = 'video/*';
        fileLabel.textContent = 'Archivo de video (si desea cambiarlo, suba uno nuevo):';
    } else {
        trabajoPdfInput.accept = 'application/pdf';
        fileLabel.textContent = 'Archivo PDF (si desea cambiarlo, suba uno nuevo):';
    }
}

// Si el select de tipo cambia dentro del modal, actualizar el accept
if (typeof trabajoTipoSelect !== 'undefined' && trabajoTipoSelect) {
    trabajoTipoSelect.addEventListener('change', (e) => {
        updateFileInputAccept(e.target.value);
    });
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
        // Registrar acción de descarga asociada al usuario
        try { logUserAction('download', id, (item && (item.nombre || item.pdf)) || filename); } catch (e) { /* noop */ }
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
        if (url) {
            window.open(url, '_blank');
            // Registrar vista del documento
            try {
                const item = trabajos.find(t => t.id === id) || {};
                logUserAction('view', id, item.nombre || card.dataset.title || url);
            } catch (e) { /* noop */ }
        } else {
            console.error('PDF no disponible para este documento.');
        }
    }
});

// --- Abrir modal para crear nuevo ---
addTrabajoBtn.addEventListener('click', () => {
    editingIdInput.value = '';
    addTrabajoForm.reset();
    // asegurar que el input de archivo acepte PDFs por defecto al crear
    try { updateFileInputAccept(''); } catch(e) {}
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
    // ajustar el input de archivo según el tipo del item (video para presentacion)
    try { updateFileInputAccept(item.tipo); } catch(e) {}
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

    // Validación del tipo de archivo según el tipo de documento
    if (pdfFile) {
        if (tipo === 'presentacion') {
            if (!isVideoFile(pdfFile)) { alert('Para presentaciones, sube un archivo de video (mp4, webm, mov, etc.).'); return; }
        } else {
            if (!isPdfFile(pdfFile)) { alert('Para trabajos o resúmenes, sube un archivo PDF.'); return; }
        }
    }

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
    const usuariosStore = (function(){ try { return JSON.parse(localStorage.getItem('usuarios')) || []; } catch(e) { return []; } })();
    const usersMap = {}; // user -> { docs:Set, isIutepalista:boolean, actions:number }
    // Soporte para varios esquemas de registro
    rawLogs.forEach(entry => {
        if (!entry) return;
        // Si entry es string
        if (typeof entry === 'string') {
            const u = '';
            usersMap[u] = usersMap[u] || { docs: new Set(), isIutepalista: false, actions:0 };
            usersMap[u].docs.add(entry);
            usersMap[u].actions += 1;
            return;
        }
        const user = entry.user || entry.username || entry.email || '';
        // determinar si es iutepalista: preferir campo en entry, si no, buscar en usuariosStore
        let isIute = false;
        if (typeof entry.isIutepalista !== 'undefined') {
            isIute = !!entry.isIutepalista;
        } else {
            const foundU = usuariosStore.find(u => (u.nombre && u.nombre === entry.user) || (u.email && u.email === entry.user) || (u.email && u.email === entry.username));
            if (foundU) isIute = !!foundU.esIutepalista;
        }
        // caso: entrada con array reviewed
        if (Array.isArray(entry.reviewed)) {
            usersMap[user] = usersMap[user] || { docs:new Set(), isIutepalista:isIute, actions:0 };
            entry.reviewed.forEach(d => usersMap[user].docs.add(d));
            usersMap[user].actions += entry.reviewed.length;
            return;
        }
        // caso: entrada individual con doc/document/docId/pdf/title
        const possibleDoc = entry.doc || entry.document || entry.docId || entry.pdf || entry.title || entry.file || entry.documentName;
        if (possibleDoc) {
            usersMap[user] = usersMap[user] || { docs:new Set(), isIutepalista:isIute, actions:0 };
            usersMap[user].docs.add(possibleDoc);
            usersMap[user].actions += 1;
            return;
        }
        // caso: logs estilo { user, action: 'view', id: 't123' }
        if (entry.action && (entry.id || entry.itemId || entry.documentId)) {
            const docId = entry.id || entry.itemId || entry.documentId;
            usersMap[user] = usersMap[user] || { docs:new Set(), isIutepalista:isIute, actions:0 };
            usersMap[user].docs.add(docId);
            usersMap[user].actions += 1;
            return;
        }
        // fallback: guardar la entrada completa como JSON string
        usersMap[user] = usersMap[user] || { docs:new Set(), isIutepalista:isIute, actions:0 };
        usersMap[user].docs.add(JSON.stringify(entry));
        usersMap[user].actions += 1;
    });

    // Preparar mapa de id -> nombre de documento (si aplica)
    const idToName = {};
    trabajos.forEach(t => { if (t.id) idToName[t.id] = t.nombre || t.title || ''; });

    // Helper para mostrar etiquetas limpias de documentos (quita llaves y labels si vienen como JSON)
    function formatDocLabel(raw) {
        if (!raw && raw !== 0) return '';
        // si es id conocido
        if (idToName[raw]) return idToName[raw];
        // si es objeto
        if (typeof raw === 'object') {
            if (raw.nombre || raw.Nombre || raw.title) {
                const name = raw.nombre || raw.Nombre || raw.title || '';
                const fecha = raw.Fecha || raw.fecha || raw.date || raw.timestamp || '';
                return fecha ? `${name} — ${fecha}` : name;
            }
            return String(raw);
        }
        // si es string, intentar parsear JSON
        if (typeof raw === 'string') {
            const s = raw.trim();
            try {
                if ((s.startsWith('{') && s.endsWith('}')) || s.startsWith('{"')) {
                    const obj = JSON.parse(s);
                    const name = obj.Nombre || obj.nombre || obj.name || obj.title || '';
                    const fecha = obj.Fecha || obj.fecha || obj.date || obj.timestamp || '';
                    if (name && fecha) return `${name} — ${fecha}`;
                    if (name) return name;
                    if (obj.doc || obj.document || obj.pdf) return obj.doc || obj.document || obj.pdf;
                }
            } catch (e) {
                // no JSON, seguir
            }
            // limpiar llaves y etiquetas si existen en texto no JSON
            let cleaned = s.replace(/[\{\}"]+/g,'');
            cleaned = cleaned.replace(/Nombre:/gi,'').replace(/Fecha:/gi,'').replace(/name:/gi,'').replace(/fecha:/gi,'').trim();
            cleaned = cleaned.replace(/,\s*/g,' — ');
            return cleaned;
        }
        return String(raw);
    }

    // Calcular conteos por documento (para determinar los más revisados)
    const counts = {}; // key (id or name) -> count
    rawLogs.forEach(entry => {
        if (!entry) return;
        if (entry.id) {
            const key = entry.id;
            counts[key] = (counts[key] || 0) + 1;
            return;
        }
        const nameKey = entry.name || entry.title || entry.pdf || entry.document || entry.file;
        if (nameKey) {
            counts[nameKey] = (counts[nameKey] || 0) + 1;
            return;
        }
        if (typeof entry === 'string') {
            counts[entry] = (counts[entry] || 0) + 1;
            return;
        }
    });

    // Construir array ordenado de documentos por conteo
    const docCounts = Object.entries(counts).map(([k, v]) => ({ key: k, count: v }));
    docCounts.sort((a, b) => b.count - a.count);

    // Renderizar contenido con estilo más limpio
    if (rawLogs.length === 0) {
        reportContent.innerHTML = '<p style="padding:12px;color:#444;">No hay registros de actividad.</p>';
    } else {
        // Header con resumen
        let html = `
            <div style="font-family:Nunito,system-ui,Segoe UI,Roboto,Arial; color:#222;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;font-size:18px">Informe de actividad</h3>
                    <div style="font-size:13px;color:#666">Total registros: ${rawLogs.length}</div>
                </div>
                <div style="display:flex;gap:16px;align-items:flex-start;">
                    <div style="flex:1;min-width:260px;">
                        <h4 style="margin:6px 0 10px;color:#333;font-size:14px">Por usuario</h4>
                        <div style="border-radius:8px;padding:10px;background:#fafafa;border:1px solid #eee;max-height:360px;overflow:auto;">
        `;

        // preparar conteo por usuario para ordenar y calcular fecha de ingreso
        const userSummaries = {};
        // helper: parsear fecha de un entry (timestamp ISO o Fecha d-m-yyyy)
        function parseDateFromEntry(entry) {
            if (!entry) return null;
            if (entry.timestamp) {
                const d = new Date(entry.timestamp);
                if (!isNaN(d)) return d;
            }
            if (entry.Fecha) {
                const parts = String(entry.Fecha).split('-').map(p => parseInt(p,10));
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    const d = new Date(year, (month || 1) - 1, day || 1);
                    if (!isNaN(d)) return d;
                }
            }
            if (entry.date) {
                const d = new Date(entry.date);
                if (!isNaN(d)) return d;
            }
            return null;
        }
        function formatDate(d) {
            if (!d) return '';
            try {
                const day = String(d.getDate()).padStart(2,'0');
                const month = String(d.getMonth()+1).padStart(2,'0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
            } catch (e) { return ''; }
        }

        for (const [u, data] of Object.entries(usersMap)) {
            const displayName = u || ''; // empty string used for unknown names
            const docsSet = data.docs || new Set();
            const isIute = !!data.isIutepalista;
            const totalActions = data.actions || 0;
            userSummaries[displayName] = userSummaries[displayName] || { docs: new Set(), totalActions: 0, isIutepalista: isIute, firstLogin: null };
            // sumar conteos y unir documentos
            userSummaries[displayName].totalActions += totalActions;
            userSummaries[displayName].isIutepalista = userSummaries[displayName].isIutepalista || isIute;
            docsSet.forEach(d => userSummaries[displayName].docs.add(d));
            // Buscar en rawLogs la primera fecha asociada a este usuario
            let earliest = userSummaries[displayName].firstLogin;
            rawLogs.forEach(entry => {
                try {
                    // detectar usuario en el entry (varios esquemas)
                    const entryUser = entry.user || entry.username || entry.email || entry.Nombre || '';
                    if ((entryUser || '') === u) {
                        const d = parseDateFromEntry(entry);
                        if (d && (!earliest || d < earliest)) earliest = d;
                    }
                    // algunos logs antiguos guardaban objeto con Nombre y Fecha
                    if (!u && entry.Nombre) {
                        // entrada sin user key but with Nombre -> considerarla para unknown
                        const d2 = parseDateFromEntry(entry);
                        if (d2 && (!earliest || d2 < earliest)) earliest = d2;
                    }
                } catch (err) { /* noop */ }
            });
            userSummaries[displayName].firstLogin = earliest; 
        }

        const userEntries = Object.entries(userSummaries).map(([k, v]) => ({ user:k, docs:Array.from(v.docs), total:v.totalActions, isIutepalista:v.isIutepalista, firstLogin: v.firstLogin }));
        userEntries.sort((a,b) => b.total - a.total);

        // Separar IUTEPALISTAS y No IUTEPALISTAS
        const iuteUsers = userEntries.filter(u => u.isIutepalista);
        const nonIuteUsers = userEntries.filter(u => !u.isIutepalista);

        // Sección IUTEPALISTAS
        html += `<div style="margin-bottom:8px;"><strong style="font-size:13px">IUTEPALISTAS</strong></div>`;
        if (iuteUsers.length === 0) {
            html += `<div style="color:#666;font-size:13px;margin-bottom:8px">No hay IUTEPALISTAS registrados en los logs.</div>`;
        } else {
            iuteUsers.forEach(u => {
                html += `<div style="margin-bottom:10px;padding:8px;border-radius:6px;background:#fff;border:1px solid #eee;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <div style="display:flex;align-items:center"><strong style="font-size:13px;color:#222">${u.user || 'Usuario desconocido'}</strong><span style="font-size:11px;color:#0b6; background:#eaffef;padding:4px 8px;border-radius:999px;margin-left:8px">IUTEPALISTA</span></div>
                                <span style="font-size:12px;color:#666;background:#f0f4f8;border-radius:999px;padding:4px 8px">${u.total} acciones</span>
                            </div>
                            <div style="font-size:13px;color:#444">${u.docs.length} documento(s)</div>
                            <div style="font-size:12px;color:#666;margin-top:6px">Ingreso: ${u.firstLogin ? formatDate(new Date(u.firstLogin)) : '—'}</div>
                            <ul style="margin:6px 0 0 16px;padding:0;color:#444;">`;
                u.docs.forEach(d => {
                    const label = formatDocLabel(d);
                    html += `<li style="margin:4px 0;">${label}</li>`;
                });
                html += `</ul></div>`;
            });
        }

        // Sección No IUTEPALISTAS
        html += `<div style="margin-top:12px;margin-bottom:8px;"><strong style="font-size:13px">No IUTEPALISTAS</strong></div>`;
        if (nonIuteUsers.length === 0) {
            html += `<div style="color:#666;font-size:13px;margin-bottom:8px">No hay registros de usuarios no IUTEPALISTAS.</div>`;
        } else {
            nonIuteUsers.forEach(u => {
                html += `<div style="margin-bottom:10px;padding:8px;border-radius:6px;background:#fff;border:1px solid #eee;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <div style="display:flex;align-items:center"><strong style="font-size:13px;color:#222">${u.user || 'Usuario desconocido'}</strong><span style="font-size:11px;color:#666;background:#f3f4f6;padding:4px 8px;border-radius:999px;margin-left:8px">No IUTEPALISTA</span></div>
                                <span style="font-size:12px;color:#666;background:#f0f4f8;border-radius:999px;padding:4px 8px">${u.total} acciones</span>
                            </div>
                            <div style="font-size:13px;color:#444">${u.docs.length} documento(s)</div>
                            <div style="font-size:12px;color:#666;margin-top:6px">Ingreso: ${u.firstLogin ? formatDate(new Date(u.firstLogin)) : '—'}</div>
                            <ul style="margin:6px 0 0 16px;padding:0;color:#444;">`;
                u.docs.forEach(d => {
                    const label = formatDocLabel(d);
                    html += `<li style="margin:4px 0;">${label}</li>`;
                });
                html += `</ul></div>`;
            });
        }

        html += `</div></div>`;

        // Columna derecha: top documentos
        html += `<div style="width:320px;flex-shrink:0;">
                    <h4 style="margin:6px 0 10px;color:#333;font-size:14px">Top documentos</h4>
                    <div style="border-radius:8px;padding:10px;background:#fff;border:1px solid #eee;">
                        <ol style="margin:0;padding-left:20px;color:#444">`;

        const top = docCounts.slice(0, 8);
        if (top.length === 0) html += `<li style="color:#888">Sin actividad sobre documentos</li>`;
        top.forEach(d => {
            const label = formatDocLabel(d.key);
            html += `<li style="margin:6px 0;display:flex;justify-content:space-between;align-items:center;"><span>${label}</span><small style="color:#666">${d.count}</small></li>`;
        });

        html += `</ol></div></div>`;

        html += `</div></div>`;

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
// --- About modal handlers ---
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAboutBtn = document.getElementById('closeAboutBtn');
if (aboutBtn && aboutModal) {
    aboutBtn.addEventListener('click', () => { aboutModal.style.display = 'flex'; });
}
if (closeAboutBtn) closeAboutBtn.addEventListener('click', () => { if (aboutModal) aboutModal.style.display = 'none'; });
if (aboutModal) {
    aboutModal.addEventListener('click', (e) => { if (e.target === aboutModal) aboutModal.style.display = 'none'; });
}
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

// --- Manejo de logout y cambio de contraseña ---
const logoutBtn = document.getElementById('logoutBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const closeChangePassBtn = document.getElementById('closeChangePassBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const cancelChangePassBtn = document.getElementById('cancelChangePassBtn');

function showHeaderButtons() {
    // Mostrar logout para cualquier usuario logueado
    const current = getCurrentUserName();
    // Mostrar logout si hay usuario actual o si es admin (asegurar que admin siempre vea cerrar sesión)
    if (current || isAdmin) {
        if (logoutBtn) logoutBtn.style.display = '';
    }
    // Mostrar cambio de contraseña solo si es admin
    if (isAdmin) {
        if (changePasswordBtn) changePasswordBtn.style.display = '';
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        try {
            localStorage.removeItem('currentUserName');
            localStorage.removeItem('guest');
            localStorage.removeItem('admin');
            localStorage.removeItem('iutepalistaStatus');
        } catch (e) { /* noop */ }
        // Redirigir a inicio o login
        window.location.href = 'Index.html';
    });
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        // Prefill current admin username if available
        try {
            const storedAdmin = JSON.parse(localStorage.getItem('adminUser')) || null;
            const fallbackUser = (function(){ try { return (typeof user !== 'undefined') ? user : null; } catch(e){ return null; } })();
            const currentUsername = (storedAdmin && storedAdmin.username) ? storedAdmin.username : (fallbackUser && fallbackUser.username) ? fallbackUser.username : 'admin';
            const currentDisplay = document.getElementById('currentAdminUserDisplay');
            const newUserInput = document.getElementById('newAdminUser');
            if (currentDisplay) currentDisplay.textContent = currentUsername;
            if (newUserInput) newUserInput.value = currentUsername;
            // clear password fields
            const c = document.getElementById('currentAdminPass'); if (c) c.value = '';
            const n = document.getElementById('newAdminPass'); if (n) n.value = '';
            const cn = document.getElementById('confirmNewAdminPass'); if (cn) cn.value = '';
        } catch (e) { /* noop */ }
        if (changePasswordModal) changePasswordModal.style.display = 'flex';
    });
}

if (closeChangePassBtn) closeChangePassBtn.addEventListener('click', () => { if (changePasswordModal) changePasswordModal.style.display = 'none'; });
if (cancelChangePassBtn) cancelChangePassBtn.addEventListener('click', () => { if (changePasswordModal) changePasswordModal.style.display = 'none'; });

if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('currentAdminPass').value || '';
        const newUser = (document.getElementById('newAdminUser') && document.getElementById('newAdminUser').value) ? document.getElementById('newAdminUser').value.trim() : '';
        const neo = document.getElementById('newAdminPass').value || '';
        const confirm = document.getElementById('confirmNewAdminPass').value || '';
        if (!current) { alert('Ingrese la contraseña actual para validar los cambios.'); return; }
        if (neo && neo !== confirm) { alert('La nueva contraseña y su confirmación no coinciden.'); return; }
        // Validar contraseña actual contra la guardada (chequear localStorage adminUser o fallback a login.js 'user')
        let storedAdmin = null;
        try { storedAdmin = JSON.parse(localStorage.getItem('adminUser')); } catch (e) { storedAdmin = null; }
        const fallbackUser = (function(){ try { return (typeof user !== 'undefined') ? user : null; } catch(e){ return null; } })();
        const currentPass = (storedAdmin && storedAdmin.password) ? storedAdmin.password : (fallbackUser && fallbackUser.password) ? fallbackUser.password : '';
        if (current !== currentPass) { alert('Contraseña actual incorrecta.'); return; }
        // Prepare admin data: update username if provided, update password if provided
        const finalUsername = newUser || (storedAdmin && storedAdmin.username) || (fallbackUser && fallbackUser.username) || 'admin';
        const finalPassword = neo || (storedAdmin && storedAdmin.password) || (fallbackUser && fallbackUser.password) || '';
        const adminData = { username: finalUsername, password: finalPassword };
        try {
            localStorage.setItem('adminUser', JSON.stringify(adminData));
            alert('Datos de administrador actualizados.');
            if (changePasswordModal) changePasswordModal.style.display = 'none';
        } catch (err) {
            console.warn('No se pudo guardar los datos del administrador', err);
            alert('Error al guardar los datos del administrador.');
        }
    });
}

// Mostrar u ocultar botones al iniciar
showHeaderButtons();

// Render inicial
renderCards();

