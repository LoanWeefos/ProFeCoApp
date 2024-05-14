document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    const productoId = url.searchParams.get('id');

    if (productoId) {
        cargarDatos(productoId);
    }
});

function cargarDatos(productoId) {
    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:8080/api/product/` + productoId, {
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
            const productoId = data.id;
            document.getElementById('nombre').value = data.nombre;
            document.getElementById('precio').value = data.precio;
            document.getElementById('oferta').value = data.oferta;
            document.getElementById('descripcion').value = data.descripcion;
            fetch(`http://localhost:8080/api/category/` + productoId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
                    const contenedor = document.querySelector(".contenedor");
                    contenedor.innerHTML = '';

                    var botonActualizar = document.createElement("button");
                    botonActualizar.onclick = function () {
                        actualizar(productoId);
                    };
                    botonActualizar.type = "button";

                    botonActualizar.textContent = "Actualizar";

                    botonActualizar.id = "actualizar";
                    contenedor.appendChild(botonActualizar);

                    data.forEach(categoria => {
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
                            nuevoInput.value = categoria.nombre;

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
                    });
                })
        })
        .catch(error => {
            console.error('Error al cargar los datos del producto:', error);
            customAlert.alert('Error al cargar los datos del producto.', "", "productos_empresa.html");
        });
}
