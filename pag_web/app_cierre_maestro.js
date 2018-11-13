var id_cerrar_button_cierre = "cerrarDia";
var rama_bd_inges = "inges";
var rama_bd_registros = "registros";

$('#' + id_cerrar_button_cierre).click(function(){
	var clicked_cierre = true;
	firebase.database().ref(rama_bd_inges).orderByChild("status").equalTo(true).on('child_added',function(snapshot){
		//Entran todos los inges activos
		var ing = snapshot.val();
		if(clicked_cierre === true){
			firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(ing.nombre).once('child_added').then(function(snapshot){
				//Entran TODOS los registros del inge activo
				var regis = snapshot.val();
        	    if(regis.status === false){
        	        var horas_registro = new Date().getTime() - regis.checkin;
        	        var status = true;
        	        firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/status").set(status);
					firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/horas").set(horas_registro);
					var username = ing.uid;
        	        firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras/" + regis.obra).orderByChild("presupuesto").equalTo(regis.presupuesto).once("child_added").then(function(snapshot){
						var pres = snapshot.val();
						var stat = false;
						var horas_tots = pres.horas_trabajadas + horas_registro;
        	            firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + regis.obra + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_tots);
        	            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(stat);
						alert("Sesion de " + ing.nombre + " cerrada.");
        	        });
        	    }
			});
			clicked_cierre = false;
		}
	});
});
