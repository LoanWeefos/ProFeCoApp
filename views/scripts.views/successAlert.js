document.addEventListener('DOMContentLoaded', function () {
    const datoLocalStorage = localStorage.getItem('success');
    const datoLocalStorage2 = localStorage.getItem('successUpdate');
    if (datoLocalStorage) {
        customAlert.alert('Producto ' + datoLocalStorage + " actualizado correctamente", '', 'productos_empresa.html');
        datoLocalStorage = localStorage.clear();
    } else if (datoLocalStorage2) {
        customAlert.alert('Producto ' + datoLocalStorage2 + " actualizado correctamente", '', 'productos_empresa.html');
        datoLocalStorage2 = localStorage.clear();
    }
});