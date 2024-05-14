function reportar(productoId, nombreProducto) {
    console.log(nombreProducto);
    const token = sessionStorage.getItem('token');
    let descripcion = document.querySelector("#descripcion").value;
    const estado = "PROCESO";

    if (!descripcion) {
        customAlert.alert("Describe tu reporte primero primero", "Error!");
        return;
    }

    fetch(`http://localhost:8080/api/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ descripcion, estado, productoId, nombreProducto })
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
            var socket = io('http://localhost:3000');
            socket.emit('report', { productoId });
            customAlert.alert("Se procesará tu reporte, gracias.", "");
            ocultar();
            let id = document.querySelector(".id").id;
            fetch('http://localhost:8080/api/mercado/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: "sin_procesar" })
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
            return;
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