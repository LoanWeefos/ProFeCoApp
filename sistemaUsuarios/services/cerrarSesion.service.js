function cerrarSesion() {
    const token = sessionStorage.getItem('token');

    fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
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
        sessionStorage.clear();
        window.location.href = "index.html";
    })
    .catch(error => {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            error = "Sin conexión con el servidor";
            sessionStorage.removeItem('token');
            customAlert.alert(error, 'Error!', 'index.html');
        }else{
            customAlert.alert(error, 'Error!');
        }
    });
}
