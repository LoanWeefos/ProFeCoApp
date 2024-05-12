function reportar(productoId) {
    const token = sessionStorage.getItem('token');
    let descripcion = document.querySelector("#descripcion").value;
    let fecha = new Date().toLocaleString('es-mx');
    const estado = "PROCESO";

    if (!descripcion) {
        customAlert.alert("Describe tu reporte primero primero", "Error!");
        return;
    }

    fetch(`http://localhost:8080/api/report/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ descripcion, fecha, estado, productoId })
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
            var socket = io('http://localhost:3000');
            socket.emit('report', { productoId });
            customAlert.alert("Se procesará tu reporte, gracias.", "");
            ocultar();
            return;
        });
}