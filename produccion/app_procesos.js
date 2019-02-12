var id_obra_ddl_procesos = "obraDdlProcesos";
var id_subproceso_checkbox_proceso = "checkboxSubproceso";
var id_proceso_ddl_procesos = "procesoDdlProcesos";
var id_categoria_ddl_procesos = "categoriaDdlProcesos";
var id_alcance_proceso_procesos = "alcanceProcesoProcesos";
var id_fecha_inicio_procesos = "fechaInicioProcesos";
var id_fecha_final_procesos = "fichaFinalProcesos";

var id_agregar_procesos = "agregarProcesoProcesos";

var rama_bd_obras_magico = "obras";
var rama_bd_categorias_procesos = "categorias";

var kaiz = {
    PROYECTOS: {
        PPTO: 0,
        PAG: 0,
    },
    PRODUCCION: {
        SUMINISTROS: {
            CUANT: 0,
            OdeC: 0,
            PAG: 0,
        },
        COPEO: {
            PREC: 0,
            COPEO: 0,
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
    PROFIT: {
        PROG: 0,
        REAL: 0,
    }
};


$('#tabProcesosProd').click(function(){
    $('#' + id_obra_ddl_procesos).empty();
    var select = document.getElementById(id_obra_ddl_procesos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.clave;
        select.appendChild(option2);
    });

    $('#' + id_categoria_ddl_procesos).empty();
    var select2 = document.getElementById(id_categoria_ddl_procesos);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select2.appendChild(option3);

    firebase.database().ref(rama_bd_categorias_procesos).orderByChild('nombre').on('child_added',function(snapshot){
        var cat = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = cat.nombre;
        option4.value = cat.calve;
        select2.appendChild(option4);
    });
});

$("#" + id_subproceso_checkbox_proceso).change(function(){
    if(this.checked){
        $('#' + id_proceso_ddl_procesos).empty();
        var select = document.getElementById(id_proceso_ddl_procesos);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);

        firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos").orderByChild('nombre').on('child_added',function(snapshot){
            var proc = snapshot.val();
            var option2 = document.createElement('OPTION');
            option2.text = proc.clave;
            option2.value = proc.clave;
            select.appendChild(option2);
        });
        //unhide ddl proc y ddl categoria
        //hide check adicional
    } else {
        //unhide check adicional
        //hide ddl proc y ddl categoria
    }
});

$('#' + id_agregar_procesos).click(function() {
    var fech = {
        fecha_inicio_real: 0,
        fecha_inicio_teorica: new Date($('#' + id_fecha_inicio_procesos).val().getTime(),
        fecha_final_real: 0,
        fecha_final_teorica: new Date($('#' + id_fecha_final_procesos).val().getTime(),
    }
    var cl;
    if($("#" + id_subproceso_checkbox_proceso).checked){
        firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + $('#' + id_proceso_ddl_procesos + " option:selected").text()).once('child_added').then(function(snapshot){
            var proc = snapshot.val();
            var num_sub = proc.num_subprocesos + 1;
            cl = proc.clave + "-" + $('#' + id_categoria_ddl_procesos + " option:selected").val() + ("0" + num_sub).slice(-2);
            var subproceso = {
                alcance: $('#' + id_alcance_proceso_procesos).val(),
                clave: cl,
                categoria: $('#' + id_categoria_ddl_procesos + " option:selected").text(),
                fechas: fech,
            }
            firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + proc.clave + "/subprocesos/" + cl).set(proceso);
            firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + proc.clave + "/num_subprocesos").set(num_sub);
        });
    } else {
        firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text()).once('child_added').then(function(snapshot){
            var obra = snapshot.val();
            var num_proc = obra.num_procesos + 1;
            cl = "PC" + ("0" + num_proc).slice(-2);
            var proceso = {
                alcance: $('#' + id_alcance_proceso_procesos).val(),
                clave: cl,
                adicional: false,
                fechas: fech,
                num_subprocesos: 0,
                kaizen: kaiz,
            }
            firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + cl).set(proceso);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/num_procesos").set(num_proc);
        });
    }

});
