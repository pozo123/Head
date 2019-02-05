var id_nombre_obra_prod = "obraNombreProd";
var id_cliente_ddl_obra_prod = "clienteProd";
var id_registrar_button_obra_prod = "registrarObraProd";
var id_fecha_inicio_obra_prod = "fechaInicioObraProd";
var id_fecha_final_obra_prod = "fichaFinalObraProd";
var id_agregar_proceso_obra_prod = "agregarProcesoObraProd";
var id_nombre_proceso_obra_prod = "nombreProcesoObraProd";
var id_clave_proceso_obra_prod = "claveProcesoObraProd";

var rama_bd_obras_prod = "produccion/obras";
var rama_bd_clientes_prod = "clientes";

var procesos = {};

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
   
});

$('#' + id_agregar_proceso_obra_prod).click(function() {
    procesos[$('#' + id_nombre_proceso_obra_prod).val()] = {
        nombre: $('#' + id_nombre_proceso_obra_prod).val(),
        clave: $('#' + id_clave_proceso_obra_prod).val(),
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
        },
    };
});

$('#' + id_registrar_button_obra_prod).click(function () {
    if(!$('#' + id_nombre_obra_prod).val() || $('#' + id_cliente_ddl_obra_prod + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {
        firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra_prod).val()).once('value').then(function(snapshot){
            var o = snapshot.val();
                if(o !== null){
                    alert("Obra ya existente");
                } else {

                    var obra = {      
                        nombre: $('#' + id_nombre_obra_prod).val(),
                        cliente: $('#' + id_cliente_ddl_obra + " option:selected").text(),
                        procesos: procesos,
                        fechas: {
                            fecha_inicio_real: 0,
                            fecha_inicio_teorica: new Date($('#' + id_fecha_inicio_obra_prod).val().getTime(),
                            fecha_final_real: 0,
                            fecha_final_teorica: new Date($('#' + id_fecha_final_obra_prod).val().getTime(),
                        },
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
                            PROFIT: {
                                PROG: 0,
                                REAL: 0,
                            },
                        }
                    }

                    firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra).val()).set(obra);

                    alert("¡Alta exitosa!");
                }
        });
    }
});
