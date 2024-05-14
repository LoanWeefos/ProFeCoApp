function generarReporte() {
    const token = sessionStorage.getItem('token');
    const nombreProducto = document.querySelector("#productos").value;
    const tipo = document.querySelector("#tipo-reporte").value;
    const desde = document.querySelector("#desde").value;
    const hasta = document.querySelector("#hasta").value;

    let link;
    if (tipo === "comentarios") {
        link = "http://localhost:8080/api/generateComentarios"
    } else if (tipo === "inconsistencias") {
        link = "http://localhost:8080/api/generateInconsistencias"
    } else if (tipo === "wishlist") {
        link = "http://localhost:8080/api/generateWishlist"
    }

    fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ desde, hasta, nombreProducto })
    }).then(response => {
        if (response.ok) {
            return response.blob();
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
    }).then(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    })
        .catch(error => {
            sessionStorage.removeItem('token');
            customAlert.alert(error, 'Error!', 'index.html');
        });
}