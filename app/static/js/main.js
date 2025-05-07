const apiBaseUrl = "http://127.0.0.1:8000/api";

// Función para obtener el token CSRF desde las cookies
function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

// Funciones para cerrar modales
function cerrarModalRelacional() {
    document.getElementById("modal-editar-relacional").style.display = "none";
}

function cerrarModalNoSQL() {
    document.getElementById("modal-editar-nosql").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const tabRelacional = document.getElementById("tab-relacional");
    const tabNoSQL = document.getElementById("tab-nosql");
    const contenidoRelacional = document.getElementById("contenido-relacional");
    const contenidoNoSQL = document.getElementById("contenido-nosql");

    obtenerDatos();

    tabRelacional.addEventListener("click", () => {
        contenidoRelacional.style.display = "block";
        contenidoNoSQL.style.display = "none";
        tabRelacional.classList.add("active");
        tabNoSQL.classList.remove("active");
        obtenerDatos();
    });

    tabNoSQL.addEventListener("click", () => {
        contenidoRelacional.style.display = "none";
        contenidoNoSQL.style.display = "block";
        tabNoSQL.classList.add("active");
        tabRelacional.classList.remove("active");
        obtenerDatosNoSQL();
    });


    // Manejar formulario para crear productos
    const formCreateRelacional = document.getElementById("form-create-relacional");
    formCreateRelacional.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre-relacional").value;
        const descripcion = document.getElementById("descripcion-relacional").value;
        const valor = parseFloat(document.getElementById("valor-relacional").value);
    
        const response = await fetch(`${apiBaseUrl}/datos/nuevo/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify({ nombre, descripcion, valor }),
        });
    
        if (response.ok) {
            alert("Nota de alumno agregado exitosamente");
            obtenerDatos();
            formCreateRelacional.reset();
        } else {
            alert("Error al agregar nota");
        }
    });

    // Manejar formulario para crear productos NoSQL
    const formCreateNoSQL = document.getElementById("form-create-nosql");
    formCreateNoSQL.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre-nosql").value;
        const descripcion = document.getElementById("descripcion-nosql").value;
        const valor = parseFloat(document.getElementById("valor-nosql").value);
        const metadata = document.getElementById("metadata-nosql").value.trim();
    
        let metadataObj = {};
        try {
            if (metadata) {
                const jsonString = metadata.replace(/'/g, '"');
                metadataObj = JSON.parse(jsonString);
            }
        } catch (error) {
            alert("El formato de metadata debe ser un JSON válido. Ejemplo: {\"color\": \"rojo\"}");
            return;
        }
    
        const response = await fetch(`${apiBaseUrl}/nosql/datos/nuevo/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify({ 
                nombre, 
                descripcion, 
                valor, 
                metadata: metadataObj
            }),
        });
    
        if (response.ok) {
            alert("Nota agregada exotisamente"); 
            obtenerDatosNoSQL();
            formCreateNoSQL.reset();
        } else {
            const errorResponse = await response.json();
            alert(`Error al agregar nota de alumno: ${errorResponse.error}`);
        }
    });
});

// Obtener todos los productos
async function obtenerDatos() {
    const response = await fetch(`${apiBaseUrl}/datos/`);
    const productos = await response.json();
    const listaProductos = document.getElementById("lista-productos-relacional");
    listaProductos.innerHTML = "";

    productos.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - ${producto.descripcion} - ${producto.valor}
            <button onclick="editarProductoRelacional(${producto.id}, '${producto.nombre}', '${producto.descripcion}', ${producto.valor})">Editar</button>
            <button onclick="eliminarProductoRelacional(${producto.id})">Eliminar</button>
        `;
        listaProductos.appendChild(li);
    });
}

// Obtener todos los productos NoSQL
async function obtenerDatosNoSQL() {
    const response = await fetch(`${apiBaseUrl}/nosql/datos/`);
    const productos = await response.json();
    const listaProductos = document.getElementById("lista-productos-nosql");
    listaProductos.innerHTML = "";

    productos.forEach((producto) => {
        const li = document.createElement("li");
        const metadataStr = JSON.stringify(producto.metadata || {});
        li.innerHTML = `
            ${producto.nombre} - ${producto.descripcion}  ${producto.valor} 
            <button onclick="editarProductoNoSQL('${producto._id}', '${producto.nombre}', '${producto.descripcion}', ${producto.valor}, '${encodeURIComponent(metadataStr)}')">Editar</button>
            <button onclick="eliminarProductoNoSQL('${producto._id}')">Eliminar</button>
        `;
        listaProductos.appendChild(li);
    });
}

// Función para mostrar el modal de edición de producto relacional
function editarProductoRelacional(id, nombre, descripcion, valor) {
    document.getElementById("editar-id-relacional").value = id;
    document.getElementById("editar-nombre-relacional").value = nombre;
    document.getElementById("editar-descripcion-relacional").value = descripcion;
    document.getElementById("editar-valor-relacional").value = valor;
    document.getElementById("modal-editar-relacional").style.display = "block";
}

// Función para mostrar el modal de edición de producto NoSQL
function editarProductoNoSQL(id, nombre, descripcion, valor, metadataEncoded) {
    document.getElementById("editar-id-nosql").value = id;
    document.getElementById("editar-nombre-nosql").value = nombre;
    document.getElementById("editar-descripcion-nosql").value = descripcion;
    document.getElementById("editar-valor-nosql").value = valor;
    
    try {
        const metadata = JSON.parse(decodeURIComponent(metadataEncoded));
        
        document.getElementById("editar-metadata-nosql").value = 
            metadata ? JSON.stringify(metadata, null, 2) : '{}';
    } catch (error) {
        console.error('Error al parsear metadata:', error);
        document.getElementById("editar-metadata-nosql").value = '{}';
    }

    document.getElementById("modal-editar-nosql").style.display = "block";
}

// Manejar formulario para editar productos
const formEditRelacional = document.getElementById("form-edit-relacional");
formEditRelacional.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editar-id-relacional").value;
    const nombre = document.getElementById("editar-nombre-relacional").value;
    const descripcion = document.getElementById("editar-descripcion-relacional").value;
    const valor = parseFloat(document.getElementById("editar-valor-relacional").value);

    const response = await fetch(`${apiBaseUrl}/datos/${id}/editar/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ nombre, descripcion, valor }),
    });

    if (response.ok) {
        alert("Nota de alumno actualizada exitosamente");
        cerrarModalRelacional();
        obtenerDatos();
    } else {
        alert("Error al actualizar nota");
    }
});

// Manejar formulario para editar productos NoSQL
const formEditNoSQL = document.getElementById("form-edit-nosql");
formEditNoSQL.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editar-id-nosql").value;
    const nombre = document.getElementById("editar-nombre-nosql").value;
    const descripcion = document.getElementById("editar-descripcion-nosql").value;
    const valor = parseFloat(document.getElementById("editar-valor-nosql").value);
    const metadata = document.getElementById("editar-metadata-nosql").value.trim();

    let metadataObj = {};
    try {
        if (metadata) {
            const jsonString = metadata.replace(/'/g, '"');
            metadataObj = JSON.parse(jsonString);
        }
    } catch (error) {
        alert("El formato de metadata debe ser un JSON válido. Ejemplo: {\"color\": \"rojo\"}");
        return;
    }

    const response = await fetch(`${apiBaseUrl}/nosql/datos/${id}/editar/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ 
            nombre, 
            descripcion, 
            valor,
            metadata: metadataObj 
        }),
    });

    if (response.ok) {
        alert("Nota actualizada exitosamente");
        document.getElementById("modal-editar-nosql").style.display = "none";
        obtenerDatosNoSQL();
    } else {
        const errorResponse = await response.json();
        alert(`Error al actualizar nota: ${errorResponse.error}`);
    }
});

// Eliminar un producto relacional
async function eliminarProductoRelacional(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
        const response = await fetch(`${apiBaseUrl}/datos/${id}/eliminar/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCSRFToken(),
            },
        });

        if (response.ok) {
            alert("Nota eliminada correctamente");
            obtenerDatos();
        } else {
            alert("Error al eliminar nota");
        }
    }
}

// Eliminar un producto NoSQL
async function eliminarProductoNoSQL(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
        const response = await fetch(`${apiBaseUrl}/nosql/datos/${id}/eliminar/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCSRFToken(),
            },
        });

        if (response.ok) {
            alert("Producto eliminado correctamente");
            obtenerDatosNoSQL();
        } else {
            alert("Error al eliminar producto");
        }
    }
}