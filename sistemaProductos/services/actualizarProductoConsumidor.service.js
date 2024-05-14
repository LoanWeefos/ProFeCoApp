function actualizarProducto(productoId) {
    const box = document.getElementById(productoId);
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
            const box = document.getElementById(productoId);
            const h3Nombre = box.querySelector("#nombre");
            h3Nombre.textContent = data.nombre;

            const divImagen = box.querySelector('.img');
            const img = divImagen.querySelector('img');

            fetch('http://localhost:8080/api/img/' + data.id, {
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

            const h2Precio = box.querySelector('#precio');
            h2Precio.textContent = `$${data.precio}`;

            const pOfertas = box.querySelector('#ofertas');
            pOfertas.textContent = data.oferta;
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