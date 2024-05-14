function cargarProducto(productoId) {
    if (document.querySelectorAll(".box").length === 0) {
        window.location.reload();
        return;
    }

    const ocultos = document.querySelectorAll('.oculto');
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
            const randomNumber = Math.floor(Math.random() * 3) + 1;

            let scroll;
            if (randomNumber === 3) {
                scroll = document.querySelector('#scrollmenu3');
                ocultos[2].style.display = 'none'
            } else if (randomNumber === 2) {
                scroll = document.querySelector('#scrollmenu2');
                ocultos[1].style.display = 'none'
            } else {
                scroll = document.querySelector('#scrollmenu1');
                ocultos[0].style.display = 'none'
            }
            const divProducto = document.createElement('div');
            divProducto.classList.add('box');
            divProducto.id = data.id;

            const divNombre = document.createElement('div');
            divNombre.classList.add('text');
            const h3Nombre = document.createElement('h3');
            h3Nombre.id = "nombre";
            h3Nombre.textContent = data.nombre;
            divNombre.appendChild(h3Nombre);

            const divImagen = document.createElement('div');
            divImagen.classList.add('img');
            const img = document.createElement('img');

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

            divImagen.appendChild(img);

            const divPrecioOfertas = document.createElement('div');
            divPrecioOfertas.classList.add('text');
            const h2Precio = document.createElement('h2');
            h2Precio.id = 'precio';
            h2Precio.textContent = `$${data.precio}`;
            const pOfertas = document.createElement('p');
            pOfertas.id = 'ofertas';
            pOfertas.textContent = data.oferta;
            divPrecioOfertas.appendChild(h2Precio);
            divPrecioOfertas.appendChild(pOfertas);

            const divBotones = document.createElement('div');
            divBotones.classList.add('button-group');
            const divBotonVer = document.createElement('div');
            divBotonVer.classList.add('button-ver');
            const botonVer = document.createElement('button');
            botonVer.textContent = 'Ver';
            botonVer.onclick = function () {
                verProducto(data.id);
            };
            divBotonVer.appendChild(botonVer);
            const divBotonAgregar = document.createElement('div');
            divBotonAgregar.classList.add('button-agregar');
            const botonAgregar = document.createElement('button');
            botonAgregar.textContent = 'Agregar';
            botonAgregar.onclick = function () {
                agregarProductoLista(data.id);
            };
            divBotonAgregar.appendChild(botonAgregar);
            divBotones.appendChild(divBotonVer);
            divBotones.appendChild(divBotonAgregar);

            divProducto.appendChild(divNombre);
            divProducto.appendChild(divImagen);
            divProducto.appendChild(divPrecioOfertas);
            divProducto.appendChild(divBotones);

            scroll.appendChild(divProducto);
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

function verProducto(productoId) {
    const url = `ver_producto.html?id=${productoId}`;

    window.location.href = url;
}