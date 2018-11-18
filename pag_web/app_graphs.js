var rama_bd_obras = "obras";

$(document).ready(function(){
  loadGraphs();
  setInterval(loadGraphs, 5000)
});

function loadGraphs(){
	firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			childSnapshot.child("presupuestos").forEach(function(presu_snapshot){
				var presu = presu_snapshot.val();
				if(presu.contrato === true && presu.oculto === false && presu.terminado === false){
					var horas_programadas_totales = 0;
					var horas_programadas_ie = 0;
					var horas_programadas_ihs = 0;
					var horas_trabajadas_totales = 0;
					var horas_trabajadas_ie = 0;
					var horas_trabajadas_ihs = 0;
					horas_programadas_ie = presu.child("cholaboradores_asignados/horas_totales_ie").val();
					horas_programadas_ihs = presu.child("cholaboradores_asignados/horas_totales_ihs").val();
					horas_programadas_totales = horas_programadas_ie + horas_totales_ihs;
					presu.child("colaboradores_asignados/ie").forEach(function(inge_snapshot){
						horas_trabajadas_ie += inge_snapshot.horas_trabajadas;
					});
					presu.child("colaboradores_asignados/ihs").forEach(function(inge_snapshot){
						horas_trabajadas_ihs += inge_snapshot.horas_trabajadas;
					});
					horas_trabajadas_totales = horas_trabajadas_ie + horas_trabajadas_ihs;
				}
			});
		});
	});

}
