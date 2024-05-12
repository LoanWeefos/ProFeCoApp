function eliminarProducto(productoId, ruta) {
    const box = document.getElementById(productoId);
    let scroll;
    if (ruta !== "search") {
        scroll = box.parentNode.parentNode.parentNode;
    }
    box.remove();

    if (ruta !== "search") {
        if (scroll.querySelectorAll(".box").length === 0) {
            scroll.querySelector(".oculto").style.display = "block";
        }
    }

    if (document.querySelectorAll(".box").length === 0 && ruta !== "search") {
        const contenedor = document.querySelector(".principal");
        contenedor.innerHTML = '';
        var divNoProductos = document.createElement('div');
        divNoProductos.classList.add('no-productos');
        var h1NoProductos = document.createElement('h1');
        h1NoProductos.classList.add('texto-no');
        h1NoProductos.textContent = 'No hay productos en ninguna tienda';
        divNoProductos.appendChild(h1NoProductos);

        contenedor.appendChild(divNoProductos);
        const elemento = document.querySelector('.main-container');

        elemento.style.gridTemplateRows = '100% auto';
    } else if(document.querySelectorAll(".box").length === 0){
        vacio();
    }
}