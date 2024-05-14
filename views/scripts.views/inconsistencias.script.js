document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    generarTabla(id);
});

function generarTabla(id) {
    let reportes;
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:8080/api/reportesTabla', {
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
            const reportes = data.filter(reporte => {
                return reporte.estado === "PROCESO" &&
                    reporte.Producto.Usuario.id.toString() === id;
            });

            if (reportes.length === 0) {
                verificar();
            }

            const tableContainer = document.querySelector('.table-container');
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const trHeader = document.createElement('tr');
            const thProducto = document.createElement('th');
            thProducto.className = 'nombre';
            thProducto.innerHTML = '<h1>Producto</h1>';
            const thReporte = document.createElement('th');
            thReporte.innerHTML = '<h1>Reporte</h1>';
            const thFecha = document.createElement('th');
            thFecha.innerHTML = '<h1>Fecha del reporte</h1>';
            const thAccion = document.createElement('th');
            trHeader.appendChild(thProducto);
            trHeader.appendChild(thReporte);
            trHeader.appendChild(thFecha);
            trHeader.appendChild(thAccion);
            thead.appendChild(trHeader);
            table.appendChild(thead);

            let nombreMercado;
            reportes.forEach(reporte => {
                nombreMercado = reporte.Producto.Usuario.Mercado.nombre
                const tr = document.createElement('tr');

                const tdProducto = document.createElement('td');
                tdProducto.className = 'nombre';
                tdProducto.onclick = function () {
                    window.location = 'ver_producto.html?id=' + reporte.Producto.id + '&admin=true';
                };
                tdProducto.innerHTML = `<h2>${reporte.Producto.nombre}</h2>`;

                const tdReporte = document.createElement('td');
                tdReporte.className = 'reporte';
                tdReporte.onclick = function () {
                    window.location = 'ver_producto.html?id=' + reporte.Producto.id + '&admin=true';
                };
                tdReporte.innerHTML = `<h2>${reporte.descripcion}</h2>`;

                const tdFecha = document.createElement('td');
                tdFecha.className = 'fecha';
                tdFecha.onclick = function () {
                    window.location = 'ver_producto.html?id=' + reporte.Producto.id + '&admin=true';
                };
                tdFecha.innerHTML = `<h2>${formatea(reporte.createdAt)}</h2>`;

                const tdAccion = document.createElement('td');
                tdAccion.onclick = function () {
                    liberar(reporte);
                };
                tdAccion.className = 'liberado';
                tdAccion.innerHTML = '<h2>Liberar</h2>';

                tr.appendChild(tdProducto);
                tr.appendChild(tdReporte);
                tr.appendChild(tdFecha);
                tr.appendChild(tdAccion);

                tbody.appendChild(tr);
            });

            document.querySelector(".titulo h1").textContent = nombreMercado;

            table.appendChild(tbody);

            tableContainer.appendChild(table);
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

function formatea(fechaString) {
    const fecha = new Date(fechaString);

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    const diaStr = dia < 10 ? '0' + dia : dia;
    const mesStr = mes < 10 ? '0' + mes : mes;
    const horasStr = horas < 10 ? '0' + horas : horas;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos;
    const segundosStr = segundos < 10 ? '0' + segundos : segundos;

    const fechaFormateada = `${diaStr}/${mesStr}/${año} ${horasStr}:${minutosStr}:${segundosStr}`;
    return fechaFormateada
}

function liberar(reporte) {
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:8080/api/report/' + reporte.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: "LIBERADO" })
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
            const url = new URL(window.location.href);
            const id = url.searchParams.get('id');
            document.querySelector(".table-container").innerHTML = '';
            generarTabla(id);
        })
}

function verificar() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:8080/api/mercado/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: "liberado" })
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
            customAlert.alert("Todos los reportes fueron liberados!","", "sistema_sanciones.html");
        })
}