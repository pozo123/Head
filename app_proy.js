// JavaScript source code
var id_nombre = "nombre";

var id_registrar = "registrar";
var id_imprimir = "imprimir";
var rama_bd = "proys";


$('#' + id_registrar).click((function () {
    var proyecto = {
        nombre: $('#' + id_nombre).val(),
        //Falta registrar horas e inges y pues todos los atributos
    }
    firebase.database().ref("" + rama_bd + "/" + $('#' + id_nombre).val()).set(proyecto)
}));

$('#' + id_imprimir).click((function () {
    if ($('#' + id_nombre).val() != "") {
        firebase.database().ref('' + rama_bd).orderByChild('nombre').equalTo($('#' + id_nombre).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //Llenar los demas atributos
            //$('#' + id_email).val(user.email);
        })
    }
   
}))