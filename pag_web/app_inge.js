// JavaScript source code
var id_nombre = "ingeNombre";
var id_email = "ingeEmail";
var id_password = "ingePwd";
var id_especialidad = "especialidad";
var id_proyecto = "proyecto";
var id_credenciales = "credenciales";
var id_uid = "uid";
var id_registrar = "registrarIngeniero";
var id_imprimir = "imprimir";
var rama_bd1 = "inges";

var rama_bd_proys = "proys";
var id_proys = "proyectoAsignado";
var id_elec = "checkboxElectricidad";
var id_plom = "checkboxPlomeria";
var id_admin = "inlineRadio1";
var id_lider = "inlineRadio2";
var id_proyectista = "inlineRadio3";

$(document).ready(function(){
    var select = document.getElementById(id_proys);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    
    firebase.database().ref('' + rama_bd_proys).orderByChild('nombre').on('child_added',function(snapshot){
        
        var proy = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = proy.nombre; 
        select.appendChild(option2);
    });
    console.log("que pedo")
});

$('#' + id_registrar).click((function () {
    alert("hola");
    firebase.auth().createUserWithEmailAndPassword($('#' + id_email).val(), $('#' + id_password).val())
        .then(function (result) {
            guardaDatos(result.user);
            $('#' + id_uid).val(result.user.uid);
        });

    /*Para imprimir errores, .catch en vez de .then
     * .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            
        });*/
}));

$('#' + id_imprimir).click((function () {
    if ($('#' + id_nombre).val() != "") {
        firebase.database().ref('' + rama_bd1).orderByChild('nombre').equalTo($('#' + id_nombre).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_email).val(user.email);
            $('#' + id_password).val(user.password);
            if(user.especialidad == 1)
                document.getElementById(id_elec).checked = true;
            else if(user.especialidad == 2)
                document.getElementById(id_plom).checked = true;
            else if(user.especialidad == 3){
                document.getElementById(id_elec).checked = true;
                document.getElementById(id_plom).checked = true;
            }
                
            //$('#' + id_proyecto).val(user.proyecto);
            
            if(user.credenciales == 1)
                document.getElementById(id_admin).checked = true;
            else if(user.credenciales == 2)
                document.getElementById(id_lider).checked = true;
            else if(user.credenciales == 3)
                document.getElementById(id_proyectista).checked = true;
                
            $('#' + id_uid).val(user.uid);
        })
    }
    else if ($('#' + id_email).val() != "") {
        firebase.database().ref('' + rama_bd1).orderByChild('email').equalTo($('#' + id_email).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_nombre).val(user.nombre);
            $('#' + id_password).val(user.password);
            if(user.especialidad == 1)
                document.getElementById(id_elec).checked = true;
            else if(user.especialidad == 2)
                document.getElementById(id_plom).checked = true;
            else if(user.especialidad == 3){
                document.getElementById(id_elec).checked = true;
                document.getElementById(id_plom).checked = true;
            }
                
            //$('#' + id_proyecto).val(user.proyecto);
            
            if(user.credenciales == 1)
                document.getElementById(id_admin).checked = true;
            else if(user.credenciales == 2)
                document.getElementById(id_lider).checked = true;
            else if(user.credenciales == 3)
                document.getElementById(id_proyectista).checked = true;
            
            $('#' + id_uid).val(user.uid);
        })
    }
    else if ($('#' + id_uid).val() != "") {
        firebase.database().ref('' + rama_bd1).orderByChild('uid').equalTo($('#' + id_uid).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_nombre).val(user.nombre);
            $('#' + id_email).val(user.email);
            $('#' + id_password).val(user.password);
            if(user.especialidad == 1)
                document.getElementById(id_elec).checked = true;
            else if(user.especialidad == 2)
                document.getElementById(id_plom).checked = true;
            else if(user.especialidad == 3){
                document.getElementById(id_elec).checked = true;
                document.getElementById(id_plom).checked = true;
            }
                
            //$('#' + id_proyecto).val(user.proyecto);
            
            if(user.credenciales == 1)
                document.getElementById(id_admin).checked = true;
            else if(user.credenciales == 2)
                document.getElementById(id_lider).checked = true;
            else if(user.credenciales == 3)
                document.getElementById(id_proyectista).checked = true;
        })
    }
}))

function guardaDatos(user) {
    var espec;
    var creden;
    if(document.getElementById(id_elec).checked == true){
        if(document.getElementById(id_plom).checked == true){
            espec = 3; //especialidad ambas
        }
        else
            espec = 1; //especialidad elec
    }
    else if(document.getElementById(id_plom).checked == true)
        espec = 2; //especialidad plom
    
    if(document.getElementById(id_admin).checked == true)
        creden = 1;
    else if(document.getElementById(id_lider).checked == true)
        creden = 2;
    else if(document.getElementById(id_proyectista).checked == true)
        creden = 3;
    
    var usuario = {
        uid: user.uid,
        nombre: $('#' + id_nombre).val(),
        email: user.email,
        password: $('#' + id_password).val(),
        especialidad: espec,
        proyecto: $('#' + id_proys + " option:selected").val(),
        credenciales: creden,
        activo: false,
    }
    console.log(rama_bd1);

    firebase.database().ref(rama_bd1+"inges/" + user.uid).set(usuario);
}