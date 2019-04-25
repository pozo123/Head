var id_obra_ddl_gestionarPptos = "obraDdlGestionarPptos";
var id_ppto_ddl_gestionarPptos = "pptoDdlGestionarPptos";
var id_activar_button_gestionarPptos = "activarButtonGestionarPptos";
var id_ocultar_button_gestionarPptos = "ocultarButtonGestionarPptos";
var id_terminar_button_gestionarPptos = "terminarButtonGestionarPptos";
var id_label_activo_gestionarPptos = "activoGestionarPptos";
var id_label_oculto_gestionarPptos = "ocultoGestionarPptos";

var tab_gestionarPptos = "tabGestionarPptos";

var rama_bd_obras_proy = "proyectos/obras";

var obras_global;

$('#' + tab_pag_suministros_kaizen).click(function(){
	$('#' + id_obra_ddl_gestionarPptos).empty();

	var select = document.getElementById(id_obra_ddl_gestionarPptos);
	var option = document.createElement('option');
	option.style = "display:none";
  	option.text = option.value = "";
  	select.appendChild(option);

	firebase.database().ref(rama_bd_obras_proy).once('value').then(function(snapshot){
		obras_global = snapshot;
		snapshot.forEach(function(childSnap){
			var obra = childSnap.val();
			var option2 = document.createElement('OPTION');
	        option2.text = obra.nombre;
	        option2.value = obra.nombre;
	        select.appendChild(option2);
		});
	});
});

$('#' + id_obra_ddl_gestionarPptos).change(function(){
	$('#' + id_ppto_ddl_gestionarPptos).empty();

	var select = document.getElementById(id_ppto_ddl_gestionarPptos);
	var option = document.createElement('option');
	option.style = "display:none";
  	option.text = option.value = "";
  	select.appendChild(option);

  	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()].child("presupuestos").forEach(function(snapshot){
  		var ppto = snapshot.val();
  		if(!ppto.terminado && ppto.clase == "produccion"){
	  		var option2 = document.createElement('OPTION');
	        option2.text = ppto.nombre;
	        option2.value = ppto.nombre;
	        select.appendChild(option2);
  		}
  	});

  	loadEstadoPpto();
});

function loadEstadoPpto(){
	var presu = obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()];

    if(presu.contrato){
      $('#' + id_label_activo_gestionarPptos).text("Activado")
      $('#' + id_label_activo_gestionarPptos).addClass("text-success");
      $('#' + id_label_activo_gestionarPptos).removeClass("text-danger");
    } else {
      $('#' + id_label_activo_gestionarPptos).text("No Activado")
      $('#' + id_label_activo_gestionarPptos).removeClass("text-success");
      $('#' + id_label_activo_gestionarPptos).addClass("text-danger");
    }

    if(presu.oculto){
      $('#' + id_label_oculto_gestionarPptos).text("Oculto")
      $('#' + id_label_oculto_gestionarPptos).addClass("text-warning");
      $('#' + id_label_oculto_gestionarPptos).removeClass("text-success");
      $("#" + id_ocultar_button_gestionarPptos).html("Desocultar");
    } else {
      $('#' + id_label_oculto_gestionarPptos).text("No oculto")
      $('#' + id_label_oculto_gestionarPptos).removeClass("text-warning");
      $('#' + id_label_oculto_gestionarPptos).addClass("text-success");
      $("#" + id_ocultar_button_gestionarPptos).html("Ocultar");
    }
}

$('#' + id_activar_button_gestionarPptos).click(function(){
	var tru = true;
	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["contrato"] = true;
	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["timepstamps"]["activacion"] = new Date().getTime();
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_gestionarPptos + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_gestionarPptos + " option:selected").val() + "/contrato").set(tru);
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_gestionarPptos + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_gestionarPptos + " option:selected").val() + "/timestamps/activacion").set(new Date().getTime());
	loadEstadoPpto();
	alert("Presupuesto activado")
});

$('#' + id_terminar_button_gestionarPptos).click(function(){
	var tru = true;
	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["terminado"] = true;
	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["timepstamps"]["finishedAt"] = new Date().getTime();
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_gestionarPptos + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_gestionarPptos + " option:selected").val() + "/terminado").set(tru);
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_gestionarPptos + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_gestionarPptos + " option:selected").val() + "/timestamps/finishedAt").set(new Date().getTime());
	loadEstadoPpto();
	alert("Presupuesto terminado")
});

$('#' + id_ocultar_button_gestionarPptos).click(function(){
	var oculto;
	var anuncio;
	if(obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["oculto"] == true){
		oculto = false;
		anuncio = "desocultado";
	} else {
		oculto = true;
		anuncio = "ocultado";
	}
	obras_global[$('#' + id_obra_ddl_gestionarPptos + " option:selected").val()]["presupuestos"][$('#' + id_ppto_ddl_gestionarPptos " option:selected").val()]["oculto"] = oculto;
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_gestionarPptos + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_gestionarPptos + " option:selected").val() + "/oculto").set(oculto);
	loadEstadoPpto();
	alert("Presupuesto " + anuncio);
});
