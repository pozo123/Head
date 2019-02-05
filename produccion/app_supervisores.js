var id_nombre_supervisor = "supervisorNombre";
var id_telefono_supervisor = "supervisorTelefono";
var id_email_supervisor = "supervisorEmail";
var id_registrar_button_supervisor = "registrarSupervisor";

var rama_bd_supervisor = "produccion/colaboradores/supervisores";

$('#' + id_registrar_button_supervisor).click(function () {
    if(!$('#' + id_nombre_supervisor).val()){
        alert("Llena todos los campos requeridos");
    } else {
    	var supervisor = {
    		nombre: $('#' + id_nombre_supervisor).val(),
    		telefono: $('#' + id_telefono_supervisor).val(),
    		email: $('#' + id_email_supervisor).val(),
    		obras: "",
    	}
    	firebase.database().ref(rama_bd_supervisor + "/" + $('#' + id_nombre_supervisor).val()).set(supervisor);
    }
});
