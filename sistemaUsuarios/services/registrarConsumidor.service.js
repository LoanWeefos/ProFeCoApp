function crearEmpresa() {
    document.getElementById('register-button').disabled = true;

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    const apellido_paterno = document.getElementById('apellidop').value;
    const apellido_materno = document.getElementById('apellidom').value;
    const tipo = "MERCADO"

    fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, contraseña, tipo, apellido_paterno, apellido_materno })
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('register-button').disabled = false;
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
            let token = data.access_token;
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
                let link = "productos_consumidor.html";
                sessionStorage.setItem('token', token);
                customAlert.alert("¡Inicio de sesión exitoso!", "", link);
            })
                .catch(error => {
                    document.getElementById('register-button').disabled = false;
                    customAlert.alert(error, 'Error!');
                });
        })
        .catch(error => {
            document.getElementById('register-button').disabled = false;
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                error = "Sin conexión con el servidor";
            }
            customAlert.alert(error, 'Error!');
        });
}
