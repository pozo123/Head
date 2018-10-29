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
                firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/status").set(true);
                firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/horas").set(horas_registro);
                firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras").on('child_added',function(snapshot){
                	var obra = snapshot.val();
        	        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + Object.keys(obra)[0]).orderByChild("presupuesto").equalTo(regis.presupuesto)once("child_added").then(function(snapshot){
	        	        var aux = snapshot.val();
	                    horas_previas = aux.horas_trabajadas;
	                    firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + Object.keys(obra)[0] + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_registro + horas_previas);
        	        });
                });
                clicked_cierre = false;
            }
		});
		alert("Sesion de " + ing.nombre + " cerrada.");
	});
});
