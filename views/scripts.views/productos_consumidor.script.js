document.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
});

function cargarProductos() {
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
            } else if (response.status === 400) {
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

            if (data.length === 0) {
                contenedor.innerHTML = '';
                var divNoProductos = document.createElement('div');
                divNoProductos.classList.add('no-productos');
                var h1NoProductos = document.createElement('h1');
                h1NoProductos.classList.add('texto-no');
                h1NoProductos.textContent = 'No hay productos en ninguna tienda';
                divNoProductos.appendChild(h1NoProductos);

                contenedor.appendChild(divNoProductos);
                const elemento = document.querySelector('.main-container');

                elemento.style.gridTemplateRows = '100% auto';
            }

            data.forEach(producto => {
                fetch('http://localhost:8080/api/user/' + producto.usuarioId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 400) {
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

                        fetch('http://localhost:8080/api/mercado/' + data.id, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            if (response.ok) {
                                return response.json();
                            } else if (response.status === 400) {
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

                            let scroll;
                            if (data.tipo === 'supermercado') {
                                scroll = document.querySelector('#scrollmenu3');
                            } else if (data.tipo === 'mercado-popular') {
                                scroll = document.querySelector('#scrollmenu2');
                            } else {
                                scroll = document.querySelector('#scrollmenu1');
                            }
                            const divProducto = document.createElement('div');
                            divProducto.classList.add('box');

                            const divNombre = document.createElement('div');
                            divNombre.classList.add('text');
                            const h3Nombre = document.createElement('h3');
                            h3Nombre.textContent = producto.nombre;
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
                                    } else if (response.status === 400) {
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
                                })

                            img.alt = producto.imagenId;
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
                            divBotonActualizar.classList.add('button-ver');
                            const botonActualizar = document.createElement('button');
                            botonActualizar.textContent = 'Actualizar';
                            botonActualizar.onclick = function () {
                                actualizar(producto.id);
                            };
                            divBotonActualizar.appendChild(botonActualizar);
                            const divBotonEliminar = document.createElement('div');
                            divBotonEliminar.classList.add('button-agregar');
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

                            scroll.appendChild(divProducto);
                        });
                    });
                const productsContainers = document.querySelectorAll('.products-container');
                productsContainers.forEach(container => {
                    const scrollmenu = container.querySelector('.scrollmenu');

                    if (!scrollmenu.hasChildNodes()) {
                        container.style.display = 'none';
                        console.log(scrollmenu);
                    }
                });
            });
        })
        .catch(error => {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                error = "Sin conexión con el servidor";
            }
            customAlert.alert(error, 'Error!');
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
            } else if (response.status === 400) {
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
            localStorage.setItem('delete', data.nombre);
        });
}

function actualizar(productoId) {
    const url = `agregar_producto.html?id=${productoId}`;

    window.location.href = url;
}