var id_nombre_presupuesto = "presupuestoNombre";
var id_horas_programadas_presupuesto = "horasProgramadas";
var id_registrar_button_presupuesto = "registrarPresupuesto";
var id_obra_ddl_presupuesto = "obraPresupuesto";
var id_tipo_presupuesto_ddl_presupuesto = "DDLtipoPresupuesto"; //Nueva variable
var id_precio_presupuesto = "precioPresupuesto";
var id_precio_sugerido_label_presupuesto = "labelCash";

var id_reqs_ddlcheck_presupuesto = "reqs";
var id_exclusiones_ddl_check_presupuesto = "exc";

var rama_bd_tipos_presupuesto = "tipos_presupuesto";
var rama_bd_obras = "obras";
var rama_bd_reqs = "reqs";
var rama_bd_exclusiones = "exclusiones";

var precio_hora = 2000;
$('#' + id_horas_programadas_presupuesto).change(function(){
    $('#' + id_precio_sugerido_label_presupuesto).text(""+($('#' + id_horas_programadas_presupuesto).val() * precio_hora));
});


$(document).ready(function() {

    var select2 = document.getElementById(id_obra_ddl_presupuesto);   
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    select2.appendChild(option2);

    var select3 = document.getElementById(id_tipo_presupuesto_ddl_presupuesto);   
    var option5 = document.createElement('option');
    option5.style = "display:none";
    option5.text = option5.value = "";
    select3.appendChild(option5);
    
    var myData = [];
    firebase.database().ref(rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
        var req = snapshot.val();
        myData.push({id: req.nombre, label: req.nombre});
        $('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset");
        $('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox({
            data: myData,
            title: "Requisitos"
        });
    });

    var myData2 = [];
    firebase.database().ref(rama_bd_exclusiones).orderByChild('nombre').on('child_added',function(snapshot){
        var exc = snapshot.val();
        myData2.push({id: exc.nombre, label: exc.texto});
        $('#' + id_exclusiones_ddl_check_presupuesto).dropdownCheckbox("reset");
        $('#' + id_exclusiones_ddl_check_presupuesto).dropdownCheckbox({
            data: myData2,
            title: "Exclusiones"
        });
    });

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = option4.value = obra.nombre; 
        select2.appendChild(option4);

    });

    firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild('nombre').on('child_added',function(snapshot){
        
        var tipo = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = tipo.nombre; 
        option6.value = tipo.codigo;
        select3.appendChild(option6);

    });
});


$('#' + id_registrar_button_presupuesto).click(function () {

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_presupuesto + " option:selected").val()).once('value').then(function(snapshot){
        var obra_selec = snapshot.val();
        var codigo_obra = obra_selec.clave;
        var codigo_cliente = obra_selec.cliente.substring(0,3);
        var codigo_tipo_proyecto = $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").val();
        var consecutivo = 0; //Falta programar este pedo, esta denso
        var clave_presu = codigo_obra + "/" + codigo_cliente + "/" + codigo_tipo_proyecto + consecutivo;
        var fecha = new Date().getTime();
        var presupuesto = {      
            nombre: $('#' + id_nombre_presupuesto).val(),
            clave: clave_presu,
            requisitos: reqs,
            horas_programadas: $('#' + id_horas_programadas_presupuesto).val(),
            cash_presupuestado: $('#' + id_precio_presupuesto).val(),
            timestamps: {
                startedAt: new Date().getTime(),
                finishedAt: 0,
                activacion: 0,
                reqs_completados: 0
            },
            contrato: false,
            reqs: $('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("checked"),
            exclusiones: $('#' + id_exclusiones_ddl_check_presupuesto).dropdownCheckbox("checked")
        }
        reqs = [];
        firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).set(presupuesto)

        alert("¡Alta de presupuesto exitosa!");

        //Aqui se genera el pdf... creo
        // Variables: 
        // fecha (falta darle el formato adecuado)
        // obra_selec.nombre
        // obra_selec.direccion (o quieren la direccion del cliente?)
        // obra_selec.cliente
        // clave_presu
        // $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").text() (text jala? el value es el codigo)
        // AT'N hay que jalarlo de un DDL dependiendo de la obra seleccionada, que se puedan añadir como si fueran reqs
        // $('#' + id_precio_presupuesto).val()
    });

    
});
