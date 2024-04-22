document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacion();
});

function verificarAutenticacion() {
    const token = sessionStorage.getItem('token');
    let ruta = window.location.pathname;
    ruta = ruta.replace('/views/', '');

    const rutasAdmin = ["sistema_sanciones.html", "tratar_inconsistencias.html"];
    const rutasConsumidor = ["productos_consumidor.html", "ver_producto.html"];
    const rutasMercado = ["productos_empresa.html", "reportes.html", "agregar_producto.html"];

    if (!token) {
        window.location.href = 'index.html';
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
    }).then(data => {
        switch (data.tipo) {
            case "CONSUMIDOR":
                if (rutasAdmin.includes(ruta) || rutasMercado.includes(ruta)) {
                    window.location.href = 'productos_consumidor.html';
                }
                break;
            case "MERCADO":
                if (rutasAdmin.includes(ruta) || rutasConsumidor.includes(ruta)) {
                    window.location.href = 'productos_empresa.html';
                }
                break;
            case "ADMIN":
                if (rutasMercado.includes(ruta) || rutasConsumidor.includes(ruta)) {
                    window.location.href = 'sistema_sanciones.html';
                }
                break;
            default:
                window.location.href = 'index.html';
        }
    })
        .catch(error => {
            window.location.href = 'index.html';
        });
}