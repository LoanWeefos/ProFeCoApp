document.addEventListener('DOMContentLoaded', function () {
    const datoLocalStorage = localStorage.getItem('delete');
    if (datoLocalStorage) {
        customAlert.alert("Producto " + datoLocalStorage + " eliminado correctamente.", "");
        datoLocalStorage = localStorage.clear();
    }
});