var id_obra_ddl_procesos = "obraDdlProcesos";
var id_nombre_proceso_procesos = "nombreProcesoProcesos";
var id_clave_proceso_procesos = "claveProcesoProcesos";
var id_agregar_procesos = "agregarProcesoProcesos";

var id_fecha_inicio_procesos = "fechaInicioProcesos";
var id_fecha_final_procesos = "fichaFinalProcesos";

var id_proceso_ddl_procesos = "procesoDdlProcesos"; //para subprocesos

var rama_bd_obras_prod = "produccion/obras";

$('#tabProcesosProd').click(function(){
	var select = document.getElementById(id_obra_ddl_procesos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

	firebase.database().ref(rama_bd_obras_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.nombre;
        select.appendChild(option2);
    });
});

//Para subprocesos
/*
function loadDDLProcesoProcesos(){
    $('#' + id_proceso_ddl_procesos).empty();
    var select = document.getElementById(id_proceso_ddl_procesos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_obra_ddl_procesos + " option:selected").val() + "/procesos").orderByKey().on('child_added',function(snapshot){
        var proc = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = proc; 
        select.appendChild(option2);
    });
};*/

$('#' + id_agregar_procesos).click(function() {

	var proceso = {
        nombre: $('#' + id_nombre_proceso_procesos).val(),
        clave: $('#' + id_clave_proceso_procesos).val(),
        fechas: { 
            fecha_inicio: new Date($('#' + id_fecha_inicio_procesos).val().getTime(),
            fecha_final: new Date($('#' + id_fecha_final_procesos).val().getTime(),
        }
        kaizen: {
            PROYECTOS: {
                PPTO: 0,
                PAG: 0,
            },
        	PRODUCCION: {
        	    SUMINISTROS: {
        	        CUANT: 0,
        	        O de C: 0,
        	        PAG: 0,
        	    },
        	    COPEO: {
        	        PREC: 0,
        	        COPEO: 0,
        	        EST: 0,
        	        PAG: 0,
        	    },
        	},
        	ADMINISTRACION: {
        	    ESTIMACIONES: {
        	        PPTO: 0,
        	        EST: 0,
        	        PAG: 0,
        	    },
        	    ANTICIPOS: {
        	        PPTO: 0,
        	        PAG: 0,
        	    },
        	},
            	AVANCE: {
               	    EST: 0,
	            REAL:0,
        	},
        	PROFIT: {
        	    PROG: 0,
        	    REAL: 0,
        	},
		subprocesos: "",
    	},
    	subprocesos: "",
    };

    firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra + " option:selected").val() + "/procesos/" + $('#' + id_nombre_proceso_procesos)).set(proceso);
});
