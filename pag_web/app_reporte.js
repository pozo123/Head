var rama_bd_registros = "registros";
var rama_bd_inges = "inges";
var rama_bd_proys = "proys";
var id_imprime_button_reporte = "imprime_reporte";
var id_inge_ddl_reporte = "DDL_inge";
var id_proy_ddl_reporte = "DDL_proy";
var id_pres_ddl_reporte = "DDL_pres";
var id_presupuestosgroup_reporte = "presAsignado_form";


var regs = new Array();


$(document).ready(function() {

    var select = document.getElementById(id_inge_ddl_reporte);
    var option = document.createElement('option');
    /*option.style = "display:none";
    option.text = option.value = "";*/
    option.text = option.value = 'Todos';
    select.appendChild(option);

    var select2 = document.getElementById(id_proy_ddl_reporte);
    var option2 = document.createElement('option');
    /*option.style = "display:none";
    option.text = option.value = "";*/
    option2.text = option2.value = 'Todos';
    select2.appendChild(option2);

	firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = inge.nombre; 
        select.appendChild(option3);

    });

    firebase.database().ref(rama_bd_proys).orderByChild('nombre').on('child_added',function(snapshot){
        
        var proy = snapshot.val();
        var option4 = document.createElement('option');
        option4.text = option4.value = proy.nombre; 
        select2.appendChild(option4);

    });
});

function loadDDLPresupuestosReporte(){
    $('#' + id_pres_ddl_reporte).empty();
    var select = document.getElementById(id_pres_ddl_reporte);
    var option = document.createElement('option');
    //option.style = "display:none";
    option.text = option.value = "Todos";
    select.appendChild(option);

    if($('#' + id_proy_ddl_reporte + " option:selected").val() === "Todos"){
        $('#' + id_presupuestosgroup_reporte).addClass("hidden");
    }
    else{
        $('#' + id_presupuestosgroup_reporte).removeClass("hidden");
        firebase.database().ref(rama_bd_proys + "/" + $('#' + id_proy_ddl_reporte + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
            var presu = snapshot.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = presu; 
            select.appendChild(option2);
        });
    }
    
}

$('#' + id_imprime_button_reporte).click(function () {
    var doc;
    var selec_inge = $('#' + id_inge_ddl_reporte).val();
    var selec_proy = $('#' + id_proy_ddl_reporte).val();
    var selec_pres = $('#' + id_pres_ddl_reporte).val();
    var filtro_inges =  selec_inge === "Todos";
    var filtro_proys =  selec_proy === "Todos";
    var filtro_presu =  selec_pres === "Todos";

    firebase.database().ref(rama_bd_registros).orderByKey().on('value',function(data){
        var registros_db = data.val();
        var keys = Object.keys(registros_db);
        var regs = [];

        for (var i = 0; i<keys.length; i++){
        	var j = 0;
        	//filtros
        	if(filtro_inges || selec_inge === registros_db[keys[i]].inge){
        		if(filtro_proys || ((selec_proy === registros_db[keys[i]].proyecto) && (filtro_presu || selec_pres === registros_db[keys[i]].presupuesto))){
        			//REGISTRAR
	            	regs[j] = [
	                	registros_db[keys[i]].checkin,//new Date(registros_db[keys[i]].checkin).,
		                "" + Math.floor(registros_db[keys[i]].horas/360000) + ":" + Math.floor((registros_db[keys[i]].horas % 360000)/60000) + ":" + Math.floor((registros_db[keys[i]].horas % 60000) /1000), 
		                registros_db[keys[i]].inge, 
		                registros_db[keys[i]].presupuesto, 
		                registros_db[keys[i]].proyecto
		            ];
		            //REGISTRAR end
		            j++;
        		}
        	}        	
        }
        doc = {
            content: [
                {
                    table: {
                        body: [regs]
                    }
                }
            ]
        };
        pdfMake.createPdf(doc).open();
    });
});

