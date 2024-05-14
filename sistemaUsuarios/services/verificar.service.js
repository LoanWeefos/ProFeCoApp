document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    let ruta = window.location.pathname;
    ruta = ruta.replace(/.*\/views\//, '');

    const rutasAdmin = ["sistema_sanciones.html", "tratar_inconsistencias.html"];
    const rutasConsumidor = ["productos_consumidor.html", "ver_producto.html", "resultados.html"];
    const rutasMercado = ["productos_empresa.html", "reportes.html", "agregar_producto.html"];

    if (!token) {
        if (ruta !== 'index.html') {
            window.location.href = 'index.html';
        }
        return;
    }

    fetch('http://localhost:8080/api/user', {
        method: 'GET',
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
        const tipo = data.tipo
        let link;

        switch (tipo) {
            case "CONSUMIDOR":
                link = 'http://localhost:8080/api/consumidor/' + data.id;
                break;
            case "MERCADO":
                link = 'http://localhost:8080/api/mercado/' + data.id;
                break;
            case "ADMIN":
                link = 'http://localhost:8080/api/user/' + data.id;
                break;
        }
        fetch(link, {
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
            switch (tipo) {
                case "CONSUMIDOR":
                    if (rutasAdmin.includes(ruta) || rutasMercado.includes(ruta) || ruta === "index.html") {
                        window.location.href = 'productos_consumidor.html';
                    }
                    break;
                case "MERCADO":
                    if (rutasAdmin.includes(ruta) || rutasConsumidor.includes(ruta) || ruta === "index.html") {
                        window.location.href = 'productos_empresa.html';
                    }
                    break;
                case "ADMIN":
                    if (rutasMercado.includes(ruta) || rutasConsumidor.includes(ruta) || ruta === "index.html") {
                        if (ruta !== "ver_producto.html") {
                            window.location.href = 'sistema_sanciones.html';
                        }
                    }
                    break;
                default:
                    window.location.href = 'index.html';
            }

            const h1Element = document.querySelector('.userText h1');
            if (data.apellido_paterno) {
                h1Element.textContent = data.nombre + " " + data.apellido_paterno;
            } else if (data.nombre) {
                h1Element.textContent = data.nombre
            } else {
                h1Element.textContent = "ADMINISTRADOR";
            }

            const spanElement = document.createElement('span');
            spanElement.classList.add('dropdown-arrow');
            spanElement.textContent = '▼';

            h1Element.appendChild(spanElement);
        })
    })
        .catch(error => {
            sessionStorage.removeItem('token');
            customAlert.alert(error, 'Error!', 'index.html');
        });
});