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
var rama_bd_colaboradores_prod = "produccion/colaboradores";

var procesos = {};
var procesos_sin_kaiz = {};
var existe = false;

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

    firebase.database().ref(rama_bd_colaboradores_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var colab = snapshot.val();
        if(colab.tipo == "supervisor"){
            var option4 = document.createElement('OPTION');
            option4.text = colab.nombre;
            option4.value = colab.uid;
            select2.appendChild(option4);
        }
    });
   
});

$("#" + id_nombre_obra_prod).change(function(){
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_nombre_obra_prod).val()).once('child_added').then(function(snapshot){
        var obra = snapshot.val();
        if(obra != null){
            $('#' + id_clave_obra_prod).val(obra.clave);
            document.getElementById(id_clave_obra_prod).disabled = true;
            existe = true;
            //fechas
        } else {
            document.getElementById(id_clave_obra_prod).disabled = false;
            existe = false;
            //fechas
        }
    });
});


$('#' + id_registrar_button_obra_prod).click(function () {
    if(!$('#' + id_nombre_obra_prod).val() || !$('#' + id_clave_obra_prod).val() || $('#' + id_cliente_ddl_obra_prod + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {
        var fech = {
                fecha_inicio_real: 0,
                fecha_inicio_teorica: new Date($('#' + id_fecha_inicio_obra_prod).val()).getTime(),
                fecha_final_real: 0,
                fecha_final_teorica: new Date($('#' + id_fecha_final_obra_prod).val()).getTime(),
            }
        procesos_sin_kaiz["MISC"] = {
            alcance: "MISCELANEOS",
            clave: "MISC",
            tipo: "miscelaneo",    
            fechas: fech,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos_sin_kaiz["PC00"] = {
            alcance: "TRABAJO PREVIO A FIRMAR CONTRATO",
            clave: "PC00",
            tipo: "proyecto",
            fechas: fech,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos_sin_kaiz["ADIC"] = {
            alcance: "ADICIONALES",
            clave: "ADIC",
            tipo: "adicional",
            fechas: fech,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos["MISC"] = {
            alcance: "MISCELANEOS",
            clave: "MISC",
            tipo: "miscelaneo",    
            fechas: fech,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos["PC00"] = {
            alcance: "TRABAJO PREVIO A FIRMAR CONTRATO",
            clave: "PC00",
            tipo: "proyecto",
            fechas: fech,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
        };
        procesos["ADIC"] = {
            alcance: "ADICIONALES",
            clave: "ADIC",
            tipo: "adicional",
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
                    if(!existe){
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
                    var supervisores = {};
                    supervisores[$('#' + id_supervisor_ddl_obra_prod + " option:selected").val()] = {nombre: $('#' + id_supervisor_ddl_obra_prod + " option:selected").text(), activo: true};
                    var obra = {      
                        nombre: $('#' + id_nombre_obra_prod).val(),
                        clave: $('#' + id_clave_obra_prod).val(),
                        supervisor: supervisores,
                        num_procesos: 0,
                        procesos: procesos_sin_kaiz,
                        terminado: false,
                        fechas: fech,
                    }
                    firebase.database().ref(rama_bd_obras_prod + "/" + $('#' + id_nombre_obra_prod).val()).set(obra);
                }
        });
        var obr = {
            nombre: $('#' + id_nombre_obra_prod).val(),
            activa: true,
        }
        firebase.database().ref(rama_bd_colaboradores_prod + "/" + $('#' + id_supervisor_ddl_obra_prod + " option:selected").val() + "/obras").push(obr);
    }
});
