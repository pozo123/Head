var id_entrada_button_registroAdmin = "entradaButtonRegistroAdmin";
var id_salida_button_registroAdmin = "salidaButtonRegistroAdmin";
var id_familia_ddl_registroAdmin = "familiaDdlRegistroAdmin";
var id_subfamilia_ddl_registroAdmin = "subfamiliaDdlRegistroAdmin";
var id_actividad_ddl_registroAdmin = "actividadDdlRegistroAdmin";
var id_actividad_otros_registroAdmin = "actividadOtrosRegistroAdmin";

var id_group_entrada_registroAdmin = "entradaGroupRegistroAdmin";
var id_group_otros_registroAdmin = "otrosGroupRegistroAdmin";
var id_group_actividad_registroAdmin = "actividadGroupRegistroAdmin";

var rama_bd_familias_registros_admin = "administracion/investime/familias";
var rama_bd_registros_registros_admin = "administracion/investime/registros";
var rama_bd_obras_magico = "obras";

var familias;

$(document).ready(function(){
    $('#' + id_familia_ddl_registroAdmin).empty();
    var select = document.getElementById(id_familia_ddl_registroAdmin);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_familias_registros_admin).once('value').then(function(snapshot){
    	familias = snapshot.val();
    	snapshot.forEach(function(childSnap){
			var familia = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = familia; 
            select.appendChild(option2);
    	});
    });
});

$("#" + id_familia_ddl_registroAdmin).change(function(){
	$('#' + id_subfamilia_ddl_registroAdmin).empty();
    var select = document.getElementById(id_subfamilia_ddl_registroAdmin);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
	var query;
	var fam = $('#' + id_familia_ddl_registroAdmin + " option:selected").val();
    if(fam == "Especificos"){
    	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
    		snapshot.forEach(function(childSnap){
    			var subfam = childSnap.key;
	            var option2 = document.createElement('option');
	            option2.text = option2.value = subfam; 
	            select.appendChild(option2);
    		});
            var option3 = document.createElement('option');
            option3.text = option3.value = "Otros"; 
            select.appendChild(option3);
    	});
    } else {
    	familias[fam].forEach(function(childSnap){
			var subfam = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = subfam; 
            select.appendChild(option2);
		});
        var option3 = document.createElement('option');
        option3.text = option3.value = "Otros"; 
        select.appendChild(option3);
    }
});

$("#" + id_subfamilia_ddl_registroAdmin).change(function(){
	$('#' + id_actividad_ddl_registroAdmin).empty();
	var subfam = $('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val();
	if(subfam == "Otros"){
		$('#' + id_group_otros_registroAdmin).removeClass('hidden');
		$('#' + id_group_actividad_registroAdmin).addClass('hidden');
	} else {
		$('#' + id_group_otros_registroAdmin).addClass('hidden');
		$('#' + id_group_actividad_registroAdmin).removeClass('hidden');
		var select = document.getElementById(id_actividad_ddl_registroAdmin);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
	    var acts;
	    if(subfam == "Globales"){
			acts = familias[$('#' + id_familia_ddl_registroAdmin + " option:selected").val()][subfam];
	    } else {
	    	acts = familias[$('#' + id_familia_ddl_registroAdmin + " option:selected").val()];
	    }
	    acts.forEach(function(childSnap){
			var act = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = act; 
            select.appendChild(option2);
		});
	}
});

$('#' + id_entrada_button_registroAdmin).change(function(){
	var actividad;
	if($('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val() == "Otros"){
		activiad = $('#' + id_actividad_otros_registroAdmin).val();
	} else {
		actividad = $('#' + id_actividad_ddl_registroAdmin + " option:selected").val();
	}
	var now = new Date().getTime();
	var reg = {
		familia: $('#' + id_familia_ddl_registroAdmin + " option:selected").val(),
		subfamilia: $('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val(),
		actividad: actividad,
		activo: true,
		checkin: now;
		checkout: 0,
		colaborador: firebase.auth().currentUser.uid,
	}
	var dates = getWeek(now);
	var reg_uid = firebase.database().ref(rama_bd_registros_registros_admin + "/" + dates[1] + "/" + dates[0]).push(reg);
});

$('#' + id_salida_button_registroAdmin).change(function(){
	firebase.database().ref(rama_bd_registros_registros_admin).orderByKey().limitToLast(1).once('child_added').then(function(snapshot){
		snapshot.forEach(function(weekSnap){
			weekSnap.forEach(function(regSnap){
				if(regSnap.val().activo == true){
					var fals = false;
					var now = new Date().getTime();
					firebase.database().ref(rama_bd_registros_registros_admin + "/" + snapshot.key + "/" + weekSnap.key + "/" + regSnap.key + "/activo").set(fals);
					firebase.database().ref(rama_bd_registros_registros_admin + "/" + snapshot.key + "/" + weekSnap.key + "/" + regSnap.key + "/checkout").set(now);
				}
			});
		});
	});
});
