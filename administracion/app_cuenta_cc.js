var id_familia_ddl_cc = "familiaDdlCC";
var id_nombre_cc = "nombreCC";
var id_clave_cc = "claveCC";
var id_button_registrar_cc = "registrarCC";

var rama_bd_cc = "administracion/centro_de_costos";

$('#tabCuentaCC').click(function(){
	var select = document.getElementById(id_familia_ddl_cc) ;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_cc).on('child_added',function(snapshot){
        var familia = snapshot.key;
        var option2 = document.createElement('OPTION');
        option2.text = familia;
        option2.value = familia;
        select.appendChild(option2);
    });
});

$('#' + id_button_registrar_cc).click(function(){
	if($('#' + id_familia_ddl_cc + " option:selected").val() == "" || !$('#' + id_nombre_cc).val() || !$('#' + id_clave_cc).val()){
		alert("Llena todos los campos");
	} else { 
		var cuenta = {
			nombre: ,
			clave: ,
			total_cuenta: 0,
			registros: {
				2019:{
					total_year: 0,
				}
			}
		}
		firebase.database().ref(rama_bd_cc + "/" + $('#' + id_familia_ddl_cc + " option:selected").val() + $('#' + id_nombre_cc).val()).set(cuenta);
		alert("Alta exitosa");
	}
});
