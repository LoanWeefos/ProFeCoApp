function CustomAlert() {
    let link;

    this.alert = function (message, title, redireccion) {
        link = redireccion;

        // Crear elementos del diálogo de alerta
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
        dialogboxhead.style.display = (title && title !== "") ? 'block' : 'none';
        dialogboxhead.innerHTML = (title && title !== "") ? '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title : '';
        dialogboxbody.innerHTML = message;
        dialogboxfoot.innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.ok()" type="button">OK</button>';

        // Adjuntar elementos al DOM
        dialogbox.appendChild(dialogContent);
        dialogContent.appendChild(dialogboxhead);
        dialogContent.appendChild(dialogboxbody);
        dialogContent.appendChild(dialogboxfoot);
        document.body.appendChild(dialogoverlay);
        document.body.appendChild(dialogbox);

        // Ajustar altura del overlay
        let winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        // Mostrar diálogo
        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";
    }

    this.alertBack = function (message, title) {

        // Crear elementos del diálogo de alerta
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
        dialogboxhead.style.display = (title && title !== "") ? 'block' : 'none';
        dialogboxhead.innerHTML = (title && title !== "") ? '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title : '';
        dialogboxbody.innerHTML = message;
        dialogboxfoot.innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.okBack()" type="button">OK</button>';

        // Adjuntar elementos al DOM
        dialogbox.appendChild(dialogContent);
        dialogContent.appendChild(dialogboxhead);
        dialogContent.appendChild(dialogboxbody);
        dialogContent.appendChild(dialogboxfoot);
        document.body.appendChild(dialogoverlay);
        document.body.appendChild(dialogbox);

        // Ajustar altura del overlay
        let winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        // Mostrar diálogo
        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";
    }

    this.ok = function () {
        if (typeof link !== 'undefined') {
            window.location.href = link;
        }
        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');
        document.body.removeChild(dialogoverlay);
        document.body.removeChild(dialogbox);
    }

    this.okBack = function () {
        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');
        document.body.removeChild(dialogoverlay);
        document.body.removeChild(dialogbox);
        window.history.back();
    }
}

let customAlert = new CustomAlert();
