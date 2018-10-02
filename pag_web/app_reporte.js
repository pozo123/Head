var rama_bd_registros = "registros";
var rama_bd_inges = "inges";
var rama_bd_proys = "proys";
var id_imprime_button_reporte = "imprime_reporte";
var id_inge_ddl_reporte = "DDL_inge";
var id_proy_ddl_reporte = "DDL_proy";
var id_pres_ddl_reporte = "DDL_pres";

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

function loadDDLPresupuestos(){
    $('#' + id_pres_ddl_reporte).empty();
    var select = document.getElementById(id_pres_ddl_reporte);
    var option = document.createElement('option');
    //option.style = "display:none";
    option.text = option.value = "Todos";
    select.appendChild(option);

    if($('#' + id_proy_ddl_reporte + " option:selected").val() === "Todos"){
        $('#' + id_pres_ddl_reporte).addClass("hidden");
    }
    else{
        $('#' + id_pres_ddl_reporte).removeClass("hidden");
        firebase.database().ref(rama_bd_proys + "/" + $('#' + id_proy_ddl_reporte + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
            var presu = snapshot.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = presu; 
            select.appendChild(option2);
        });
    }
    
}

$('#' + id_imprime_button_reporte).click(function () {
	regs = [];
	firebase.database(rama_bd_inges).ref().orderByKey().on('child_added',function(snapshot){
    	var registro = snapshot.val();
    	var horas_trabajadas = "" + Math.floor(registro.horas/3600000) + ":" + Math.floor((registro.horas % 3600000)/60000);
    	var datos = {
    		checkin: registro.checkin.toLocaleString('en-GB', {timeZone: 'America/Chicago'}), 
    		horas: horas_trabajadas, 
    		ingeniero: registro.inge, 
    		presupuesto: registro.presupuesto, 
    		proyecto: registro. proyecto
    	}
    	regs.push(datos);
    });
	var doc = {
		content: [
			{
				table: {
					headerRows: 1,
					widths: [ '*', 'auto', 100, '*'],
					body: regs
				}
			}
		]
	};
	pdfMake.createPdf(doc).open();
});
