function calificar(productoId) {
    const token = sessionStorage.getItem('token');
    let liked;
    let comentario;

    if (document.querySelector('#like').checked) {
        liked = true;
    } else if (document.querySelector('#dislike').checked) {
        liked = false;
    } else {
        customAlert.alert("Califica primero", "Error!");
        return;
    }

    comentario = document.querySelector('#comentario').value;
    if (!comentario) {
        customAlert.alert("Comenta primero", "Error!");
        return;
    }

    fetch(`http://localhost:8080/api/calif/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ liked, comentario, productoId })
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
            document.querySelector('.cc-selector').style.display = 'none';
            document.querySelector('.button-enviar').style.display = 'none';
            document.querySelector('#comentario').style.display = 'none';
            document.querySelector('#calif-titulo').textContent = '¡Gracias por tus comentarios!';
        });
}
