document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    const productoId = url.searchParams.get('id');

    verProducto(productoId);
});

function verProducto(productoId) {
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
            let producto = data;
            let src;

            let reportes;

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
                    let productos = data;
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
                            src = "../" + data.path
                            fetch('http://localhost:8080/api/mercado/' + producto.usuarioId, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
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
                                const nombre = producto.nombre.toString();
                                const id = data.usuarioId;
                                const productoHTML = `
                        <div class="producto-precio">
                            <h1>${nombre}</h1>
                            <h1>$${producto.precio}</h1>
                        </div>
                        <div class="vendido-boton">
                            <h2 id=${id} class="id">Vendido por ${data.nombre}</h2>
                            <button class="regresar" onclick="window.history.back();">Regresar</button>
                        </div>
                        <div class="oculto">
                            <h3>Este producto tiene inconsistencias reportadas ⚠️</h3>
                        </div>
                        <img src="${src}" alt="producto">
                        <p class="desc">${producto.descripcion}</p>

                        <div class="agregar-ver">
                            <button class="button-agregar" onclick="agregarProductoLista(${producto.id}, '${nombre}')">Agregar a lista</button>
                            <button class="button-ver" onclick="buscarProducto();">Ver en otras tiendas</button>
                        </div>
                        <div class="calificacion" id="calificacion-comentario">
                            <h3 id="calif-titulo">¡Califícalo!</h3>
                            <div class="cc-selector">
                                <input id="like" type="radio" name="calif" value="like" />
                                <label class="calif-cc1 like" for="like"></label>
                                <input id="dislike" type="radio" name="calif" value="dislike" />
                                <label class="calif-cc2 dislike" for="dislike"></label>
                            </div>
                            <button class="button-enviar" onclick="calificar(${producto.id}, '${producto.nombre}')">Enviar</button>
                        </div>
                        <textarea id="comentario"></textarea>
                        <div class="comentario-reportar">
                            <button class="button-reportar" onclick="mostrar()">Reportar</button>
                            <textarea id="descripcion" class="reporte"></textarea>
                            <button class="button-reportar reporte" onclick="reportar(${producto.id}, '${nombre}')">Enviar</button>
                        </div>
                    `;

                                const contenedor = document.querySelector('.principal');
                                contenedor.innerHTML = productoHTML;

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
                                        if (data) {
                                            const botonAgregar = document.querySelector('.button-agregar');

                                            botonAgregar.classList.remove('button-agregar');
                                            botonAgregar.classList.add('button-no');
                                            botonAgregar.disabled = true;
                                        }
                                    });

                                fetch('http://localhost:8080/api/calif/' + producto.id, {
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
                                        if (data) {
                                            document.querySelector('.cc-selector').style.display = 'none';
                                            document.querySelector('.button-enviar').style.display = 'none';
                                            document.querySelector('#comentario').style.display = 'none';
                                            document.querySelector('#calif-titulo').textContent = '¡Gracias por tus comentarios!';
                                        }
                                    })

                                if (productos && productos.length > 0 && productos.some(reporte => reporte.estado === "PROCESO")) {
                                    document.querySelector(".oculto").style.display = "block";
                                }

                                const url = new URL(window.location.href);

                                if (url.searchParams.get('admin')) {
                                    document.querySelector('.container').style.gridTemplateColumns = 'auto 2fr 1fr';
                                    document.querySelector('.user').style.gridColumn = '3 / 4';
                                    document.querySelector('.search-container').style.display = 'none';
                                    document.querySelector('.agregar-ver').style.display = 'none';
                                    document.querySelector('.calificacion').style.display = 'none';
                                    document.querySelector('#comentario').style.display = 'none';
                                    document.querySelector('.comentario-reportar').style.display = 'none';
                                }

                            })
                        })
                })
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

function buscarProducto() {
    const producto = document.querySelector(".producto-precio h1").textContent;
    const url = `resultados.html?search=${producto}`;
    window.location.href = url;
}