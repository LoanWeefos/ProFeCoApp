document.addEventListener('DOMContentLoaded', function () {
    cargarResultados();
});

function cargarResultados() {
    const h1Element = document.querySelector('.filtros h1');
    h1Element.textContent = "Resultados de búsqueda de " + '"' + "BUSQUEDA" + '"';
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
                h1NoProductos.textContent = 'No hay productos que coinicidan...';
                divNoProductos.appendChild(h1NoProductos);

                contenedor.appendChild(divNoProductos);
                const elemento = document.querySelector('.main-container');
                elemento.style.gridTemplateRows = '100% auto';

                const principal = document.querySelector('.principal');
                principal.style.gridTemplateRows = '1fr';
                principal.style.gridTemplateColumns = '1fr';
            }

            data.forEach(producto => {

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
                const divBotonVer = document.createElement('div');
                divBotonVer.classList.add('button-ver');
                const botonVer = document.createElement('button');
                botonVer.textContent = 'Ver';
                botonVer.onclick = function () {
                    verProducto(producto.id);
                };
                divBotonVer.appendChild(botonVer);
                const divBotonAgregar = document.createElement('div');
                divBotonAgregar.classList.add('button-agregar');
                const botonAgregar = document.createElement('button');
                botonAgregar.textContent = 'Agregar';

                let id = producto.id;
                let nombre = producto.nombre;

                botonAgregar.onclick = function () {
                    agregarProductoLista(id, nombre);
                };
                divBotonAgregar.appendChild(botonAgregar);
                divBotones.appendChild(divBotonVer);
                divBotones.appendChild(divBotonAgregar);

                divProducto.appendChild(divNombre);
                divProducto.appendChild(divImagen);
                divProducto.appendChild(divPrecioOfertas);
                divProducto.appendChild(divBotones);

                document.querySelector(".principal").appendChild(divProducto);

                fetch('http://localhost:8080/api/list/' + producto.id, {
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
                        if (data) {
                            botonAgregar.classList.remove('button-agregar');
                            botonAgregar.classList.add('button-no');
                            botonAgregar.disabled = true;
                        }
                    })
            });
        })
        .catch(error => {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                error = "Sin conexión con el servidor";
            }
            customAlert.alert(error, 'Error!');
        });
}

function verProducto(productoId) {
    const url = `ver_producto.html?id=${productoId}`;

    window.location.href = url;
}