function mostrarLista() {
    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:8080/api/lists`, {
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
            let dialogoverlay = document.createElement('div');
            dialogoverlay.id = 'dialogoverlay';
            let dialogbox = document.createElement('div');
            dialogbox.id = 'dialogbox';
            dialogbox.className = 'slit-in-vertical';
            let dialogContent = document.createElement('div');
            let dialogboxhead = document.createElement('div');
            dialogboxhead.id = 'dialogboxhead';
            let dialogboxbody = document.createElement('div');
            dialogboxbody.id = 'dialogboxbody';
            let dialogboxfoot = document.createElement('div');
            dialogboxfoot.id = 'dialogboxfoot';

            // Configurar contenido del diálogo
            dialogboxhead.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Tu lista de supermercado';
            dialogboxbody.innerHTML = '<ul id="listaElementos"></ul>';
            dialogboxfoot.innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.ok()" type="button">OK</button>';

            dialogbox.appendChild(dialogContent);
            dialogContent.appendChild(dialogboxhead);
            dialogContent.appendChild(dialogboxbody);
            dialogContent.appendChild(dialogboxfoot);
            document.body.appendChild(dialogoverlay);
            document.body.appendChild(dialogbox);

            let winH = window.innerHeight;
            dialogoverlay.style.height = winH + "px";

            dialogoverlay.style.display = "block";
            dialogbox.style.display = "block";

            const listaElementos = document.getElementById('listaElementos');
            data.forEach(elemento => {
                fetch(`http://localhost:8080/api/product/` + elemento.productoId, {
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
                        const divContenedor = document.createElement('div');
                        divContenedor.className = "divCont";
                        const li = document.createElement('li');
                        li.textContent = data.nombre;
                        const botonEliminar = document.createElement('button');
                        botonEliminar.textContent = 'x';
                        botonEliminar.className = "elim-button";
                        botonEliminar.onclick = function () {
                            listaElementos.removeChild(divContenedor);
                            eliminarDeLista(elemento.productoId);
                        };
                        divContenedor.appendChild(li);
                        divContenedor.appendChild(botonEliminar);
                        listaElementos.appendChild(divContenedor);
                    });
            });
            const box = document.querySelector("#dialogbox");
            box.style.width = "30%";
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

function ok() {
    let dialogoverlay = document.getElementById('dialogoverlay');
    let dialogbox = document.getElementById('dialogbox');
    document.body.removeChild(dialogoverlay);
    document.body.removeChild(dialogbox);
}

function eliminarDeLista(productoId) {
    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:8080/api/list/` + productoId, {
        method: 'DELETE',
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
}
