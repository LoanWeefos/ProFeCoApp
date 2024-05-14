document.addEventListener('DOMContentLoaded', function () {

    const token = sessionStorage.getItem('token');
    fetch('http://localhost:8080/api/user', {
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
            cargarProductos(data.id);
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
});

function cargarProductos(usuarioId) {
    const token = sessionStorage.getItem('token');
    fetch('http://localhost:8080/api/products', {
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
            const contenedor = document.querySelector('.principal');

            data = data.filter(producto => producto.usuarioId === usuarioId);

            if (data.length === 0) {
                var divNoProductos = document.createElement('div');
                divNoProductos.classList.add('no-productos');
                var h1NoProductos = document.createElement('h1');
                h1NoProductos.textContent = 'No hay productos';
                divNoProductos.appendChild(h1NoProductos);
                divNoProductos.style.gridColumnStart = '1';
                divNoProductos.style.gridColumnEnd = 'span 3';
                divNoProductos.style.alignSelf = 'start';

                contenedor.appendChild(divNoProductos);
                const elemento = document.querySelector('.main-container');

                elemento.style.gridTemplateRows = '100% auto';
            }

            data.forEach(producto => {
                fetch('http://localhost:8080/api/report/' + producto.id, {
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
                        reportes = data;
                        const divProducto = document.createElement('div');
                        divProducto.classList.add('box');
                        divProducto.id = producto.id;

                        const divNombre = document.createElement('div');
                        divNombre.classList.add('text');
                        const h3Nombre = document.createElement('h3');

                        if (reportes && reportes.length > 0 && reportes.some(reporte => reporte.estado === "PROCESO")) {
                            h3Nombre.textContent = producto.nombre + " ⚠️";
                        } else {
                            h3Nombre.textContent = producto.nombre;
                        }
                        h3Nombre.id = "nombre";
                        divNombre.appendChild(h3Nombre);

                        const divImagen = document.createElement('div');
                        divImagen.classList.add('img');
                        const img = document.createElement('img');

                        fetch('http://localhost:8080/api/img/' + producto.id, {
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
                                img.src = "../" + data.path
                                img.alt = data.filename;
                            })

                        divImagen.appendChild(img);

                        const divPrecioOfertas = document.createElement('div');
                        divPrecioOfertas.classList.add('text');
                        const h2Precio = document.createElement('h2');
                        h2Precio.id = 'precio';
                        h2Precio.textContent = `$${producto.precio}`;
                        const pOfertas = document.createElement('p');
                        pOfertas.id = 'ofertas';
                        pOfertas.textContent = producto.oferta;
                        divPrecioOfertas.appendChild(h2Precio);
                        divPrecioOfertas.appendChild(pOfertas);

                        const divBotones = document.createElement('div');
                        divBotones.classList.add('button-group');
                        const divBotonActualizar = document.createElement('div');
                        divBotonActualizar.classList.add('button-actualizar');
                        const botonActualizar = document.createElement('button');
                        botonActualizar.textContent = 'Actualizar';
                        botonActualizar.onclick = function () {
                            actualizar(producto.id);
                        };
                        divBotonActualizar.appendChild(botonActualizar);
                        const divBotonEliminar = document.createElement('div');
                        divBotonEliminar.classList.add('button-eliminar');
                        const botonEliminar = document.createElement('button');
                        botonEliminar.textContent = 'Eliminar';
                        botonEliminar.onclick = function () {
                            eliminar(producto.id);
                        };
                        divBotonEliminar.appendChild(botonEliminar);
                        divBotones.appendChild(divBotonActualizar);
                        divBotones.appendChild(divBotonEliminar);

                        divProducto.appendChild(divNombre);
                        divProducto.appendChild(divImagen);
                        divProducto.appendChild(divPrecioOfertas);
                        divProducto.appendChild(divBotones);

                        contenedor.appendChild(divProducto);
                    });
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

function eliminar(productoId) {
    fetch('http://localhost:8080/api/product/' + productoId, {
        method: 'DELETE',
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
            const nombre = data.nombre
            var socket = io('http://localhost:3000');
            socket.emit('delete', { productoId, nombre }, (product) => {
                customAlert.alert("Producto " + product.nombre + " eliminado correctamente", 'Logrado', "productos_empresa.html");
            });
        });
}

function actualizar(productoId) {
    const url = `agregar_producto.html?id=${productoId}`;

    window.location.href = url;
}