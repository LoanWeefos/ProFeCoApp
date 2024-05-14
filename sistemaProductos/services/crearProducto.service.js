function crearProducto() {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const oferta = document.getElementById('oferta').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').files[0];

    const formData = new FormData();
    formData.append('file', imagen);

    if (!imagen) {
        customAlert.alert("Falta imagen", 'Error!');
        return;
    }

    const token = sessionStorage.getItem('token');
    let usuarioId;

    fetch(`http://localhost:8080/api/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400 || response.status === 401) {
                return response.json().then(data => {
                    const errorMessage = data.message;
                    throw new Error(errorMessage);
                });
            } else if (response.status === 500) {
                throw new Error('Fallo interno del servidor');
            } else {
                throw new Error('Error en la solicitud');
            }
        })
        .then(data => {
            usuarioId = data.id
            fetch('http://localhost:8080/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, precio, oferta, descripcion, usuarioId })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 400 || response.status === 401) {
                        return response.json().then(data => {
                            const errorMessage = data.message;
                            throw new Error(errorMessage);
                        });
                    } else if (response.status === 500) {
                        throw new Error('Fallo interno del servidor');
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                })
                .then(data => {
                    const productoId = data.id
                    asignarEtiquetas(productoId);
                    formData.append('productoId', productoId);
                    fetch('http://localhost:8080/api/upload', {
                        method: 'POST',
                        body: formData
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 400 || response.status === 401) {
                            return response.json().then(data => {
                                const errorMessage = data.message;
                                throw new Error(errorMessage);
                            });
                        } else if (response.status === 500) {
                            throw new Error('Fallo interno del servidor');
                        } else {
                            throw new Error('Error en la solicitud');
                        }
                    }).then(data => {
                        var socket = io('http://localhost:3000');
                        socket.emit('upload', { productoId, nombre }, (product) => {
                            customAlert.alert("Producto " + product.nombre + " creado correctamente", 'Logrado', "productos_empresa.html");
                        });
                    })
                })
                .catch(error => {
                    if (error instanceof TypeError && error.message === "Failed to fetch") {
                        error = "Sin conexión con el servidor";
                        sessionStorage.removeItem('token');
                        customAlert.alert(error, 'Error!', 'index.html');
                    }else{
                        customAlert.alert(error, 'Error!');
                    }
                });
        })
        .catch(error => {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                error = "Sin conexión con el servidor";
                sessionStorage.removeItem('token');
                customAlert.alert(error, 'Error!', 'index.html');
            } else {
                customAlert.alert(error, 'Error!');
            }
        });
}

function agregarInput() {
    var contenedorEtiquetas = document.getElementById("etiquetas-caja");
    var etiquetasInputs = contenedorEtiquetas.getElementsByClassName("etiqueta");
    var mensajeError = contenedorEtiquetas.querySelector(".mensaje-error");
    var botonAgregar = document.getElementById("+");

    if (etiquetasInputs.length < 5) {
        if (mensajeError) {
            contenedorEtiquetas.removeChild(mensajeError);
        }

        var nuevoInput = document.createElement("input");
        nuevoInput.type = "text";
        nuevoInput.className = "etiqueta";
        nuevoInput.name = "etiquetas";
        nuevoInput.id = "etiquetas";

        contenedorEtiquetas.insertBefore(nuevoInput, contenedorEtiquetas.lastChild);
    } else {
        if (!mensajeError) {
            botonAgregar.disabled = true;
            mensajeError = document.createElement("p");
            mensajeError.textContent = "¡Ya has alcanzado el límite de 5 etiquetas!";
            mensajeError.className = "mensaje-error";
            mensajeError.style.color = "red";
            contenedorEtiquetas.appendChild(mensajeError);
        }
    }
}

async function asignarEtiquetas(productoId) {
    var contenedorEtiquetas = document.getElementById("etiquetas-caja");
    var etiquetasInputs = contenedorEtiquetas.getElementsByClassName("etiqueta");

    var etiquetas = [];

    for (var i = 0; i < etiquetasInputs.length; i++) {
        var categoria = etiquetasInputs[i].value;

        try {
            const response = await fetch('http://localhost:8080/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: categoria,
                    productoId: productoId
                })
            });
            if (!response.ok) {
                throw new Error('Error al agregar categoría');
            }
            const data = await response.json();
            etiquetas.push(data);
        } catch (error) {
            console.error('Error al realizar fetch:', error);
        }
    }

    return etiquetas;
}


