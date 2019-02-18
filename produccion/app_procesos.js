var id_obra_ddl_procesos = "obraDdlProcesos";
var id_subproceso_checkbox_proceso = "checkboxSubproceso";
var id_proceso_ddl_procesos = "procesoDdlProcesos";
var id_categoria_ddl_procesos = "categoriaDdlProcesos";
var id_alcance_proceso_procesos = "alcanceProcesoProcesos";
var id_fecha_inicio_procesos = "fechaInicioProcesos";
var id_fecha_final_procesos = "fechaFinalProcesos";

var id_agregar_procesos = "agregarProcesoProcesos";

var id_grupo_subproceso = "grupoSubproceso";
var id_grupo_categoria = "grupoCategoria";

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


$('#tabAltaProceso').click(function(){


    jQuery('#' + id_fecha_inicio_procesos).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_procesos).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

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
        $('#' + id_grupo_subproceso).removeClass("hidden")
        $('#' + id_grupo_categoria).removeClass("hidden")      
    } else {
        $('#' + id_grupo_subproceso).addClass("hidden")
        $('#' + id_grupo_categoria).addClass("hidden")
    }
});

$('#' + id_agregar_procesos).click(function() {
    if($('#' + id_fecha_inicio_procesos).val() === "" || $('#' + id_fecha_final_procesos).val() === "" || ($("#" + id_subproceso_checkbox_proceso).checked && ($('#' + id_categoria_ddl_procesos + " option:selected").val() === "" || $('#' + id_proceso_ddl_procesos + " option:selected").val() === "")) || $('#' + id_obra_ddl_procesos + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {
        var f_i = new Date($('#' + id_fecha_inicio_procesos).val()).getTime();
        var f_f = new Date($('#' + id_fecha_final_procesos).val()).getTime();
        if(f_f < f_i){
            alert("La fecha final debe ser después de la fecha inicial");
        } else {
            var fech = {
                fecha_inicio_real: 0,
                fecha_inicio_teorica: f_i,
                fecha_final_real: 0,
                fecha_final_teorica: f_f,
            }
            var cl;
            if($("#" + id_subproceso_checkbox_proceso).checked){
                firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + $('#' + id_proceso_ddl_procesos + " option:selected").text()).once('child_added').then(function(snapshot){
                    var proc = snapshot.val();
                    var num_sub = proc.num_subprocesos + 1;
                    cl = proc.clave + "-" + $('#' + id_categoria_ddl_procesos + " option:selected").val() + ("0" + num_sub).slice(-2);
                    var subproceso = {
                        clave: cl,
                        categoria: $('#' + id_categoria_ddl_procesos + " option:selected").text(),
                        fechas: fech,
                        kaizen: kaiz,
                    }
                    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + proc.clave + "/subprocesos/" + cl).set(subproceso);
                    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + proc.clave + "/num_subprocesos").set(num_sub);
                });
            } else {
                console.log(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text())
                firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text()).once('value').then(function(snapshot){
                    var obra = snapshot.val();
                    var num_proc = obra.num_procesos + 1;
                    cl = "PC" + ("0" + num_proc).slice(-2);
                    var proceso = {
                        tipo: "continuo",
                        clave: cl,
                        adicional: false,
                        fechas: fech,
                        num_subprocesos: 0,
                        subprocesos: "",
                        kaizen: kaiz,
                    }
                    firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + cl).set(proceso);
                    firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/num_procesos").set(num_proc);
                    if(f_f > obra.fechas.fecha_final_teorica){
                        firebase.database().ref(rama_bd_obras_prod + "/" + obra.nombre + "/fechas/fecha_final_teorica").set(f_f);
                        firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/fechas/fecha_final_teorica" + cl).set(f_f);
                    }
                });
            }
        }
    }
});
