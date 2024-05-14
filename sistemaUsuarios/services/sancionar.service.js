function sancionar() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    const token = sessionStorage.getItem('token');
    fetch('http://localhost:8080/api/mercado/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: "SANCIONADOS" })
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
            socket.emit('sancion', { id }, (product) => {
                customAlert.alert("Sanción aplicada", '', 'sistema_sanciones.html');
            });
        });
}