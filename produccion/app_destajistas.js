var id_nombre_destajista = "destajistaNombre";
var id_id_destajista = "destajistaId";
var id_registrar_button_destajista = "registrarDestajista";

var rama_bd_destajista = "produccion/colaboradores/destajistas";

$('#' + id_registrar_button_destajista).click(function () {
    if(!$('#' + id_nombre_destajista).val()){
        alert("Llena todos los campos requeridos");
    } else {
    	var destajista = {
    		nombre: $('#' + id_nombre_destajista).val(),
    		pagos: "",
    	}
    	firebase.database().ref(rama_bd_destajista + "/" + nombre: $('#' + id_nombre_destajista).val()).set(destajista);
    }
});
