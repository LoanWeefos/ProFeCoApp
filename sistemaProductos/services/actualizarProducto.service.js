function actualizar(productoId) {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const oferta = document.getElementById('oferta').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').files[0];

    const formData = new FormData();

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

            fetch('http://localhost:8080/api/product/' + productoId, {
                method: 'PUT',
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
                    const nombre = data.nombre

                    asignarEtiquetas(productoId);

                    if (imagen) {
                        formData.append('file', imagen);
                        formData.append('productoId', productoId);

                        fetch('http://localhost:8080/api/img/' + productoId, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
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
                                socket.emit('update', { productoId, nombre }, (product) => {
                                    customAlert.alert('Producto ' + product.nombre + " actualizado correctamente", '', 'productos_empresa.html');
                                });
                            })
                        })
                    } else {
                        var socket = io('http://localhost:3000');
                        socket.emit('update', { productoId, nombre }, (product) => {
                            customAlert.alert('Producto ' + product.nombre + " actualizado correctamente", '', 'productos_empresa.html');
                        });
                    }
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

async function asignarEtiquetas(productoId) {
    var contenedorEtiquetas = document.getElementById("etiquetas-caja");
    var etiquetasInputs = contenedorEtiquetas.getElementsByClassName("etiqueta");

    var etiquetas = [];

    fetch('http://localhost:8080/api/category/' + productoId, {
        method: 'DELETE',
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
        for (var i = 0; i < etiquetasInputs.length; i++) {
            var categoria = etiquetasInputs[i].value;

            try {
                fetch('http://localhost:8080/api/category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: categoria,
                        productoId: productoId
                    })
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
                    etiquetas.push(data);
                })
            } catch (error) {
                console.error('Error al realizar fetch:', error);
            }
        }
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

    return etiquetas;
}


