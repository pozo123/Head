var id_cerrar_button_cierre = "cerrarDia";
var rama_bd_inges = "inges";
var rama_bd_registros = "registros";

$('#' + id_cerrar_button_cierre).click(function(){
	var clicked_cierre = true;
	firebase.database().ref(rama_bd_inges).orderByChild("status").equalTo(true).on('child_added',function(snapshot){
		var ing = snapshot.val();
		firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(ing.nombre).on('child_added',function(snapshot){
			var regis = snapshot.val();
            if(regis.status === false && clicked_cierre === true){
                var horas_registro = new Date().getTime() - regis.checkin;
                var status = true;
                firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/status").set(status);
				firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/horas").set(horas_registro);
				var username = ing.uid;
                firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras").on('child_added',function(snapshot){
					var obra_key = snapshot.key;
        	        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + obra_key).orderByChild("presupuesto").equalTo(regis.presupuesto).once("child_added").then(function(snapshot){
	        	        var aux = snapshot.val();
						horas_previas = aux.horas_trabajadas;
						var stat = false;
	                    firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + obra_key + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_registro + horas_previas);
	                    firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(stat);
					});
                });
                clicked_cierre = false;
            }
		});
		alert("Sesion de " + ing.nombre + " cerrada.");
	});
});