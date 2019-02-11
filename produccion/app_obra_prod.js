var id_nombre_obra_prod = "obraNombreProd";
var id_cliente_ddl_obra_prod = "clienteProd";
var id_clave_obra_prod = "claveObraProd";
var id_registrar_button_obra_prod = "registrarObraProd";
var id_fecha_inicio_obra_prod = "fechaInicioObraProd";
var id_fecha_final_obra_prod = "fichaFinalObraProd";
//var id_agregar_proceso_obra_prod = "agregarProcesoObraProd";
//var id_alcance_proceso_obra_prod = "alcanceProcesoObraProd";
//var id_clave_proceso_obra_prod = "claveProcesoObraProd";
var id_supervisor_ddl_obra_prod = "supervisorDdlObraProd";

var rama_bd_obras_prod = "produccion/obras";
var rama_bd_obras_magico = "obras";
var rama_bd_clientes = "clientes";
var rama_bd_supervisores = "produccion/colaboradores/supervisores";

var procesos = {};

var kaiz = {
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
    PROFIT: {
        PROG: 0,
        REAL: 0,
    }
};

$('#tabObrasProd').click(function(){

    jQuery('#' + id_fecha_inicio_obra_prod).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_obra_prod).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    var select = document.getElementById(id_cliente_ddl_obra_prod) ;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var clien = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = clien.nombre;
        option2.value = clien.clave;
        select.appendChild(option2);
    });

    var select2 = document.getElementById(id_supervisor_ddl_obra_prod) ;
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option.value = "";
    select2.appendChild(option3);

    firebase.database().ref(rama_bd_supervisores).orderByChild('nombre').on('child_added',function(snapshot){
        var supervisor = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = supervisor.nombre;
        option4.value = supervisor.nombre;
        select2.appendChild(option4);
    });
   
});

/*$('#' + id_agregar_proceso_obra_prod).click(function() {
    procesos[$('#' + id_clave_proceso_obra_prod).val()] = {
        alcance: $('#' + id_alcance_proceso_obra_prod).val(),
        clave: $('#' + id_clave_proceso_obra_prod).val(),
        kaizen: kaiz,
        fechas: {
            fecha_inicio: "",
            ficha_final: "",
        }
        subprocesos: "",
    };
});*/

$('#' + id_registrar_button_obra_prod).click(function () {
    if(!$('#' + id_nombre_obra_prod).val() || !$('#' + id_clave_obra_prod).val() || $('#' + id_cliente_ddl_obra_prod + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {
        var fech = {
                fecha_inicio_real: 0,
                fecha_inicio_teorica: new Date($('#' + id_fecha_inicio_obra_prod).val().getTime(),
                fecha_final_real: 0,
                fecha_final_teorica: new Date($('#' + id_fecha_final_obra_prod).val().getTime(),
            }
        procesos[$('#' + id_clave_obra_prod).val() + "MISC"] = {
            alcance: "MISCELANEOS",
            clave: $('#' + id_clave_obra_prod).val() + "MISC",
            adicional: false,
            fechas: fech,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos[$('#' + id_clave_obra_prod).val() + "PC00"] = {
            alcance: "TRABAJO PREVIO A FIRMAR CONTRATO",
            clave: $('#' + id_clave_obra_prod).val() + "PC00",
            adicional: false,
            fechas: fech,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
        };
        firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra_prod).val()).once('value').then(function(snapshot){
            var o = snapshot.val();
                if(o !== null){
                    alert("Obra ya existente");
                } else {
                    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_nombre_obra_prod).val()).once('value').then(function(snapshot){
                        var ob = snapshot.val();
                        if(ob == null){
                            //Si no existe en magico, crealo
                            var obra_mag = {      
                                    nombre: $('#' + id_nombre_obra_prod).val(),
                                    cliente: $('#' + id_cliente_ddl_obra + " option:selected").text(),
                                    clave: $('#' + id_clave_obra_prod).val(),
                                    num_procesos: 0,
                                    procesos: procesos,
                                    fechas: fech,
                                    kaizen: kaiz,
                                }
                            firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_nombre_obra_prod).val()).set(obra_mag);
                        }
                        var obra = {      
                            nombre: $('#' + id_nombre_obra_prod).val(),
                            clave: $('#' + id_clave_obra_prod).val(),
                            supervisor: $('#' + id_supervisor_ddl_obra_prod + " option:selected").text(),
                            terminado: false,
                            fechas: fech,
                        }
                        firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra_prod).val()).set(obra);
                    });
                }
        });

        firebase.database().ref(rama_bd_supervisores + "/" $('#' + id_supervisor_ddl_obra_prod + " option:selected").text() + "/obras").push($('#' + id_nombre_obra_prod).val());
    }
});
