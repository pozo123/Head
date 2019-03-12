//var id_nombre_obra = "obraNombre";
var id_nombre_obra_ddl_obra_proy = "obraNombreProy";
var id_clave_obra = "obraClave";
var id_cliente_ddl_obra = "cliente";
var id_direccion_calle_obra = "calleObra";
var id_direccion_num_obra = "numObra";
var id_direccion_colonia_obra = "coloniaObra";
var id_direccion_delegacion_obra = "delegacionObra";
var id_direccion_ciudad_obra = "ciudadObra";
var id_direccion_cp_obra = "cpObra";
var id_registrar_button_obra = "registrarObra";
var rama_bd_obras = "proyectos/obras";
var rama_bd_inges = "proyectos/inges";
var rama_bd_clientes = "clientes";
var rama_bd_obras_magico = "obras";

var procesos = {};

$('#tabAltaObra').click(function(){
    var select = document.getElementById(id_cliente_ddl_obra) ;
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

    var select3 = document.getElementById(id_cliente_ddl_obra) ;
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select3.appendChild(option3);

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var clien = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = clien.nombre;
        option6.value = clien.clave;
        select3.appendChild(option6);
    });
   
});

$("#" + id_nombre_obra_ddl_obra_proy).change(function(){
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val()).once('child_added').then(function(snapshot){
        var obra = snapshot.val();
        $('#' + id_clave_obra).val(obra.clave);
        $("#" + id_cliente_ddl_obra + " option:contains(" + obra.cliente + ")").attr('selected', 'selected');
        document.getElementById(id_clave_obra).disabled = true;
        document.getElementById(id_cliente_ddl_obra).disabled = true;
    });
});

$('#' + id_registrar_button_obra).click(function () {
    if(!$('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val() == "" || !$('#' + id_clave_obra).val() || $('#' + id_cliente_ddl_obra + " option:selected").val() === "" || !$('#' + id_direccion_calle_obra).val() || !$('#' + id_direccion_num_obra).val() || !$('#' + id_direccion_colonia_obra).val() || !$('#' + id_direccion_delegacion_obra).val() || !$('#' + id_direccion_ciudad_obra).val() || !$('#' + id_direccion_cp_obra).val()){
        alert("Llena todos los campos requeridos");
    } else {    
        var obra = {      
            nombre: $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val(),
            clave: $('#' + id_clave_obra).val(),
            direccion: {
                calle: $('#' + id_direccion_calle_obra).val(),
                numero: $('#' + id_direccion_num_obra).val(),
                colonia: $('#' + id_direccion_colonia_obra).val(),
                delegacion: $('#' + id_direccion_delegacion_obra).val(),
                ciudad: $('#' + id_direccion_ciudad_obra).val(),
                cp: $('#' + id_direccion_cp_obra).val()
            },
            cliente: $('#' + id_cliente_ddl_obra + " option:selected").text(),
            timestamps: {
                startedAt: new Date().getTime(),
                finishedAt: 0,
            },
            presupuestos: {
                Miscelaneo: {
                    nombre: "Miscelaneo",
                    clave: $('#' + id_clave_obra).val() + "/" + $('#' + id_cliente_ddl_obra + " option:selected").val() + "/MI001",
                    horas_programadas: 0,
                    proceso: "MISC",
                    colaboradores_asignados: {
                        horas_totales: 0,
                        horas_totales_ie: 0,
                        horas_totales_ihs: 0,
                        ie: {},
                        ihs: {},
                    },
                    cash_presupuestado: 0,
                    timestamps: {
                        startedAt: new Date().getTime(),
                        finishedAt: 0,
                        activacion: 0,
                        reqs_completados: 0
                    },
                    consecutivos:{
                        1:{
                            precio: 0,
                            pdf: "",
                            checkin: new Date().getTime(),
                        }
                    },
                    contrato: true,
                    terminado: false,
                    reqs: "vacio",
                    exclusiones: "vacio",
                    atencion: "vacio",
                    pagos: "vacio",
                    consec: 1,
                    oculto: false,
                    tipo: "miscelaneo",
                    genero: "miscelaneo",
                    clase: "miscelaneo",
                }
            }
        }

    firebase.database().ref(rama_bd_inges).orderByChild("especialidad").equalTo(1).once('value').then(function(snapshot){
        var elec = snapshot.val();
        var keys = Object.keys(elec);
        for(var i=0; i<keys.length; i++){
            if(elec[keys[i]].permisos.perfil === true){
                var inge_ie = {
                    horas: 0,
                    horas_trabajadas: 0,
                    nombre: elec[keys[i]].nombre,
                }
                firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val() + "/presupuestos/Miscelaneo/colaboradores_asignados/ie/" + keys[i]).set(inge_ie);
            }
        }
    });
    firebase.database().ref(rama_bd_inges).orderByChild("especialidad").equalTo(2).once('value').then(function(snapshot){
        var plom = snapshot.val();
        var keys = Object.keys(plom);
        for(var i=0; i<keys.length; i++){
            if(plom[keys[i]].permisos.perfil === true){
                var inge_ihs = {
                    horas: 0,
                    horas_trabajadas: 0,
                    nombre: plom[keys[i]].nombre,
                }
                firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val() + "/presupuestos/Miscelaneo/colaboradores_asignados/ihs/" + keys[i]).set(inge_ihs);
            }
        }
    });
    firebase.database().ref(rama_bd_inges).orderByChild("especialidad").equalTo(3).once('value').then(function(snapshot){
        var gral = snapshot.val();
        var keys = Object.keys(gral);
        for(var i=0; i<keys.length; i++){
            if(gral[keys[i]].permisos.perfil === true){
                var inge_gral = {
                    horas: 0,
                    horas_trabajadas: 0,
                    nombre: gral[keys[i]].nombre,
                }
                firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val() + "/presupuestos/Miscelaneo/colaboradores_asignados/ihs/" + keys[i]).set(inge_gral);
                firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val() + "/presupuestos/Miscelaneo/colaboradores_asignados/ie/" + keys[i]).set(inge_gral);
            }
        }
    });

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra_ddl_obra_proy + " option:selected").val()).set(obra);

    alert("¡Alta exitosa!");
                
    }
});
