document.addEventListener('DOMContentLoaded', function () {
    cargarSanciones();
});

function cargarSanciones() {
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
            if (data.length === 0) {
                console.log(data);
                document.querySelector(".oculto").style.display = "block";
            } else {
                let arrayNo = {};

                data.forEach(reporte => {
                    const mercadoId = reporte.Producto.Usuario.Mercado.id;
                    if (!arrayNo[mercadoId]) {
                        if(reporte.estado === "PROCESO"){
                            arrayNo[mercadoId] = 1;
                        }else{
                            arrayNo[mercadoId] = 0;
                        }
                    } else {
                        if(reporte.estado === "PROCESO"){
                            arrayNo[mercadoId]++;
                        }
                    }
                });

                const reportesPorProducto = {};
                data.forEach(reporte => {
                    const productoId = reporte.Producto.id;
                    if (!reportesPorProducto[productoId] || new Date(reporte.createdAt) > new Date(reportesPorProducto[productoId].createdAt)) {
                        reportesPorProducto[productoId] = reporte;
                    }
                });

                const reportesPorMercado = {};
                Object.values(reportesPorProducto).forEach(reporte => {
                    const mercadoId = reporte.Producto.Usuario.Mercado.id;
                    if (!reportesPorMercado[mercadoId]) {
                        reportesPorMercado[mercadoId] = [];
                    }
                    reportesPorMercado[mercadoId].push(reporte);
                });

                const informacionMercados = [];
                for (const mercadoId in reportesPorMercado) {
                    const reportesMercado = reportesPorMercado[mercadoId];

                    const reporteMasReciente = reportesMercado.reduce((prev, current) => (
                        new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
                    ));

                    const mercadoInfo = {
                        mercadoId: reporteMasReciente.Producto.Usuario.id,
                        nombre: reporteMasReciente.Producto.Usuario.Mercado.nombre,
                        numInconsistencias: arrayNo[reporteMasReciente.Producto.Usuario.Mercado.id],
                        fechaUltimoReporte: reporteMasReciente.createdAt,
                        estadoMercado: reporteMasReciente.Producto.Usuario.Mercado.estado
                    };
                    informacionMercados.push(mercadoInfo);
                }

                informacionMercados.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

                document.querySelector(".table-container").appendChild(generarTabla(informacionMercados));
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

function generarTabla(informacionMercados) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const trHeader = document.createElement('tr');
    const thNombre = document.createElement('th');
    thNombre.className = 'nombre';
    thNombre.innerHTML = '<h1>Nombre de la empresa</h1>';
    const thInconsistencia = document.createElement('th');
    thInconsistencia.className = 'th-inconsistencia';
    thInconsistencia.innerHTML = '<h1>No. de inconsistencias</h1>';
    const thUltimoReporte = document.createElement('th');
    thUltimoReporte.innerHTML = '<h1>Último reporte</h1>';
    const thEstado = document.createElement('th');
    thEstado.innerHTML = '<h1>Estado</h1>';

    trHeader.appendChild(thNombre);
    trHeader.appendChild(thInconsistencia);
    trHeader.appendChild(thUltimoReporte);
    trHeader.appendChild(thEstado);

    thead.appendChild(trHeader);
    table.appendChild(thead);

    informacionMercados.forEach(mercado => {
        const tr = document.createElement('tr');
        tr.onclick = function () {
            window.location = 'tratar_inconsistencias.html?id=' + mercado.mercadoId;
        };

        const tdNombre = document.createElement('td');
        tdNombre.className = 'nombre';
        tdNombre.innerHTML = `<h2>${mercado.nombre}</h2>`;
        const tdInconsistencia = document.createElement('td');
        tdInconsistencia.innerHTML = `<h2>${mercado.numInconsistencias}</h2>`;
        const tdUltimoReporte = document.createElement('td');
        tdUltimoReporte.innerHTML = `<h2>${formatea(mercado.fechaUltimoReporte)}</h2>`;
        const tdEstado = document.createElement('td');

        let estado;
        if (mercado.estadoMercado === "sin_procesar") {
            estado = "Sin procesar"
        } else if (mercado.estadoMercado === "liberado") {
            estado = "Liberado"
        } else {
            estado = "SANCIONADOS"
        }

        tdEstado.innerHTML = `<h2>${estado}</h2>`;
        tdEstado.className = mercado.estadoMercado;

        tr.appendChild(tdNombre);
        tr.appendChild(tdInconsistencia);
        tr.appendChild(tdUltimoReporte);
        tr.appendChild(tdEstado);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}