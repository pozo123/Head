var id_cerrar_button_cierre = "cerrarDia";
var rama_bd_inges = "proyectos/inges";
var rama_bd_registros = "proyectos/registros";
var rama_bd_obras = "proyectos/obras";

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
				var stat = false;
				firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(stat);

				firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + regis.obra).orderByChild("presupuesto").equalTo(regis.presupuesto).once("child_added").then(function(snapshot){
					var aux = snapshot.val();
					var horas_previas = aux.horas_trabajadas;
					var horas_nuevas = parseFloat(horas_registro) + parseFloat(horas_previas)
					firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + obra_key + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_nuevas);
				});
				var esp;
				if(ing.especialidad == 1)
				esp = "ie";
				else if(ing.especialidad == 2)
				esp = "ihs";
				else if(ing.especialidad == 3)
				esp = ing.esp_chamba;
				else
				esp = "NA";
				if(esp !== "NA" && regis.obra != "Otros"){
					firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").once("value").then(function(snapshot){
						var horas_trabajadas = snapshot.val();
						horas_trabajadas = (horas_trabajadas + horas_registro)/3600000;
						firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").set(horas_trabajadas);
					});
					firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto).once("value").then(function(snapshot){
						var presu = snapshot.val();
						var horas_trabajadas_p;
						if(presu.horas_trabajadas === null)
						horas_trabajadas_p = (presu.horas_trabajadas + horas_registro)/3600000;
						else
						horas_trabajadas_p = horas_registro/3600000;
						firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas_p);
					});
				}
				alert("Sesion de " + ing.nombre + " cerrada.");
            }
		});		
	});
	clicked_cierre = false;
});