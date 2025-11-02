// ⚠️ Paso 4.1: Configuración del Cliente Supabase
// Reemplaza los placeholders con tu URL y clave del Paso 1
const SUPABASE_URL = 'https://hvltuptwytwgbxhsmdis.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHR1cHR3eXR3Z2J4aHNtZGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDY1ODMsImV4cCI6MjA3NzU4MjU4M30.OtfKc6qGT0L4bzvpWSMBMbxz1-NU4trSH89koj_UIts'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listaDiv = document.getElementsByClassName('documents');

// --- Funciones CRUD ---

// 1. READ (Leer) - Obtener todos los libros
async function obtenerTrabajos() {
    listaDiv.innerHTML = 'Cargando libros...';
    
    // Consulta a la tabla 'libros'
    
let { data: Trabajos, error } = await supabaseClient
  .from('Trabajos')
  .select('*')

    console.log(Trabajos)
    if (error) {
        listaDiv.innerHTML = `Error al cargar: ${error.message}`;
        console.error(error);
        return;
    }

    // Muestra los libros en el HTML
    listaDiv.innerHTML = '';
    if (Trabajos.length === 0) {
        listaDiv.innerHTML = '<p>Aún no hay Trabajos en la biblioteca.</p>';
    } else {
        Trabajos.forEach(libro => {
            const item = document.createElement('div');
            // item.innerHTML = `
            //     <p><strong>${libro.titulo}</strong> por ${libro.autor} (ISBN: ${libro.isbn})</p>
            //     <button onclick="eliminarLibro(${libro.id})">Eliminar</button>`
            // ;
            listaDiv.appendChild(item);
        });
    }
}


// 2. CREATE (Crear) - Añadir un nuevo libro
async function crearLibro(titulo, autor, isbn) {
    const { error } = await supabase
        .from('Trabajos')
        .insert([
            { titulo: titulo, autor: autor, isbn: isbn },
        ]);
    if (error) {
        alert('Error al crear el libro: ' + error.message);
    } else {
        alert('Libro añadido con éxito!');
        obtenerTrabajos(); // Recarga la lista para ver el nuevo libro
    }
}


// 3. DELETE (Eliminar) - Borrar un libro por ID
async function eliminarLibro(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;

    const { error } = await supabase
        .from('Trabajos')
        .delete()
        .match({ id: id }); // Condición: id del libro a eliminar

    if (error) {
        alert('Error al eliminar el libro: ' + error.message);
    } else {
        alert('Libro eliminado con éxito!');
        obtenerTrabajos(); // Recarga la lista
    }
}

// 4. UPDATE (Actualizar) - (Lo omitimos por simplicidad, pero se usa .update().match())

// Inicia la carga de libros al cargar la página
obtenerTrabajos();

// Ejemplo de uso de la función CREATE (puedes llamarla desde un formulario)
// crearLibro('Cien Años de Soledad', 'Gabo', '1234567890123');