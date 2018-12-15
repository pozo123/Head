
var id_obra_ddl_reportePpto = "ddlObraReportePpto";
var id_ppto_ddl_reportePpto = "ddlPptoReportePpto";
var id_generar_button_reportePpto = "reportePptoButton";

var rama_bd_obras = "obras";


$(document).ready(function(){
//$('#tabReportePpto').click(function() {
	var select = document.getElementById(id_obra_ddl_reportePpto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = obra.nombre; 
        select.appendChild(option2);

    });
});

function loadDDLPresupuestosReportePpto(){
    $('#' + id_ppto_ddl_reportePpto).empty();
    var select = document.getElementById(id_ppto_ddl_reportePpto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_reportePpto + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });
    
}
// Queries para obtener variables
$('#' + id_generar_button_reportePpto).click(function() {
// Datos Generales
	var nombreObra;
	var nombrePresu;
	var clavePresu;
	var clasePresu;
	var tipoPresu;
	var generoPresu;
	var versionPresu;
	var horasProgramadasIE;
	var horasProgramadasIHS;

//Datos administrativos
	var cashPresupuestado;
	var fechaInicio;
	var fechaActivacion;
	var fechaFinal;

// Estatus del presupuesto
	var contrato;
	var terminado;

// Progreso del PPTO.
	var horasTrabajadasIE;
	var horasTrabajadasIHS;// (usando el método de sumar con hora actual)

// Análisis por colaborador
	var nombreInge;
	var horasProgramadasInge;
	var horasTrabajadas;
// tabla de registros
// revisar app_reporte.js y obtener todas variables restantes.

// versiones
// precio, horasProgramadasIE, horasProgramadasIHS.
	
	//Ver si los snapshots sí jalan bien, con eso de que son once value y así
	firebase.database().ref(rama_bd_obras + $('#' + id_obra_ddl_reportePpto + " option:selected").val()).once('value').then(function{
		var obra = snapshot.val();
		//Ver si los atributos se jalan con los soble punto (.timestamps.activacion)
		//Para los colaboradores chance forEach child?
		nombreObra = obra.nombre;
		firebase.database().ref(rama_bd_obras + "/" + nombre_obra + "/presupuestos/" + $('#' + id_ppto_ddl_reportePpto + " option:selected").val()).once('value').then(function{
			var ppto = snapshot.val();
			nombrePresu = ppto.nombre;
			clavePresu = ppto.clave;
			clasePresu = ppto.clase;
			tipoPresu = ppto.tipo;
			generoPresu = ppto.genero;
			versionPresu = ppto.consec;
			horasProgramadasIE = snapshot.child("colaboradores_asignados/horas_totales_ie");
			horasProgramadasIHS = snapshot.child("colaboradores_asignados/horas_totales_ihs");

			cashPresupuestado = ppto.cash_presupuestado;

			if(ppto.timestamps.startedAt === 0)
				fechaInicio = "NA";
			else
				fechaInicio = new Date(snapshot.child("timestamps.startedAt")).toLocaleDateString("es-ES",options);
			if(ppto.timestamps.activacion === 0)
				fechaActivacion = "NA";
			else
				fechaActivacion = new Date(snapshot.child("timestamps.activacion")).toLocaleDateString("es-ES",options);
			if(ppto.timestamps.finishedAt === 0)
				fechaFinal = "NA";
			else
				fechaFinal = new Date(snapshot.child("timestamps.finishedAt")).toLocaleDateString("es-ES",options);

			if(ppto.contrato)
				contrato = "Contrato";
			else
				contrato = "No firmado";

			if(ppto.terminado)
				terminado = "Terminado";
			else
				terminado = "En proceso";

			snapshot.child("colaboradores_asignados/ie").forEach(function(inge_snapshot){
                horasTrabajadasIE += parseFloat(inge_snapshot.val().horas_trabajadas);
			});
			presu_snapshot.child("colaboradores_asignados/ihs").forEach(function(inge_snapshot){
                horasTrabajadasIHS += parseFloat(inge_snapshot.val().horas_trabajadas);
			});				

			firebase.database().ref(rama_bd_registros).orderByChild("status").equalTo(false).on('value',function(snapshot){
                //var regs = snapshot.val();
                snapshot.forEach(function(childSnapshot){
                    reg = childSnapshot.val();
                    if(reg.presupuesto == ppto.nombre){
                        if(reg.esp == "ie")
                        horasTrabajadasIE += parseFloat((new Date().getTime() - reg.checkin)/3600000);
                        else
                        horasTrabajadasIHS += parseFloat((new Date().getTime() - reg.checkin)/3600000);
                    }
                });
            }
			//var horasTrabajadasIE
			//var horasTrabajadasIHS;// (usando el método de sumar con hora actual)

			// Análisis por colaborador
				//var nombreInge;
				//var horasProgramadasInge;
				//var horasTrabajadas;

			// tabla de registros
			// revisar app_reporte.js y obtener todas variables restantes.

			// versiones
			// precio, horasProgramadasIE, horasProgramadasIHS.
		});
	});
});






















// -----------------------------------------------

// Arturo
// HTML reporte PPTO
// PDF
