var id_nombre_cliente = "nombreCliente";
var id_director_cliente = "director";
var id_direccion_cliente = "direccion";
var id_tel_cliente = "telefono";
var id_registrar_button_cliente = "registrarCliente";
var rama_bd_clientes = "clientes";

$('#' + id_registrar_button_cliente).click(function () {

    var cliente = {      
        nombre: $('#' + id_nombre_cliente).val(),
        director: $('#' + id_director_cliente).val(),
        direccion: $('#' + id_direccion_cliente).val(),
        telefono: $('#' + id_tel_cliente).val(),
    }
    firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_nombre_cliente).val()).set(cliente)

    alert("¡Alta de cliente exitosa!");
});
