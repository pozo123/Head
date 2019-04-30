var id_obra_ddl_registros = "obraDdlRegistros";
var id_proc_ddl_registros = "procDdlRegistros";//Si simple, load pptos, si no load procs
var id_proc_group_registros = "procGroupRegistros";
var id_otros_registros = "otrosRegistros";
var id_otros_group_registros = "otrosGroupRegistros";
var id_entrada_button_registros = "entradaButtonRegistros";
var id_entrada_group_registros = "entradaGroupRegistros";
var id_salida_button_registros = "salidaButtonRegistros";

var rama_bd_registros = "proyectos/registros";
var rama_bd_obras = "obras";
var rama_bd_personal = "personal";

var esp;
var path = "";

var precio_hora = 1300;

$(document).ready(function() {
    var user = firebase.auth().currentUser;
    firebase.database().ref(rama_bd_personal + "/" + user.uid).once('value').then(function(snapshot){
        esp = snapshot.child("esp").val();
        if(snapshot.child("areas/proyectos").val() && !snapshot.child("areas/administracion").val()){
            modoRegistros();
            setInterval(modoRegistros, 60000);

            var select = document.getElementById(id_obra_ddl_registros);
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            select.appendChild(option);
            var option2 = document.createElement('option');
            option2.text = option2.value = "Otros";
            select.appendChild(option2);

            firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
                var obra = snapshot.val();
                var tipo = (obra.num_procesos == 0 && obra.procesos.ADIC.num_subprocesos == 0) ? "simple" : "padre";
                if(!obra.terminada){   
                    var option3 = document.createElement('option');
                    option3.text = obra.nombre;
                    option3.value = tipo; 
                    select.appendChild(option3);
                }
            });
        }
    });
});

function modoRegistros(){
    var user = firebase.auth().currentUser;
    firebase.database().ref(rama_bd_personal + "/" + user.uid).once('value').then(function(snapshot){
        if(snapshot.child("status").val()){
            $('#' + id_entrada_group_registros).addClass("hidden");
            $('#' + id_salida_button_registros).removeClass("hidden");
        } else {
            $('#' + id_entrada_group_registros).addClass("hidden");
            $('#' + id_salida_button_registros).removeClass("hidden");
        }
    });
}

$('#' + id_obra_ddl_registros).change(function(){
    var obra_nombre = $('#' + id_obra_ddl_registros + " option:selected").text();
    $('#' + id_proc_ddl_registros).empty();
    if(obra == "Otros"){
        $('#' + id_proc_group_registros).addClass("hidden");
        $('#' + id_otros_group_registros).removeClass("hidden");
    } else {
        $('#' + id_proc_group_registros).removeClass("hidden");
        $('#' + id_otros_group_registros).addClass("hidden");

        var select = document.getElementById(id_proc_ddl_registros);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);

        firebase.database().ref(rama_bd_obras + "/" + obra_nombre).once('value').then(function(snapshot){
            var obra = snapshot.val();
            if(obra.num_procesos == 0 && obra.procesos.ADIC.num_subprocesos == 0){
                snapshot.child("presupuestos").forEach(function(pptoSnap){
                    var ppto = pptoSnap.val();
                    if(!ppto.terminado){
                        var option2 = document.createElement('option');
                        option2.text = pptoSnap.key + " (" + ppto.nombre + ")";
                        option2.value = pptoSnap.key; 
                        select.appendChild(option2);
                    }
                });
            } else {
                snapshot.child("procesos").forEach(function(procSnap){
                    var proc = procSnap.val();
                    if(proc.num_subprocesos == 0){
                        if(!proc.terminado){
                            var option2 = document.createElement('option');
                            option2.text = procSnap.key + " (" + proc.nombre + ")";
                            option2.value = procSnap.key; 
                            select.appendChild(option2);
                        }
                    } else {
                        procSnap.child("num_subprocesos").forEach(function(subpSnap){
                            var subp = subpSnap.val();
                            if(!subp.terminado){
                                var option2 = document.createElement('option');
                                option2.text = subpSnap.key + " (" + subp.nombre + ")";
                                option2.value = subpSnap.key; 
                                select.appendChild(option2);
                            }
                        });
                    }
                });
            }
        });
    }
});

$('#' + id_entrada_button_registros).click(function(){
    var obra_ddl = $('#' + id_obra_ddl_registros + " option:selected").val();
    if(obra_ddl == "" || (obra_ddl == "Otros" && $('#' + id_otros_registros).val()) || $('#' + id_proc_ddl_registros + " option:selected").val()){
        alert("Llena todos los campos");
    } else {
        var proc = "";
        var ppto = "";
        if(obra_ddl == "Otros"){
            proc = "NA";
            ppto = $('#' + id_otros_registros).val();
        } else if(obra_ddl == "simple"){
            proc = "PC00";
            ppto = $('#' + id_proc_ddl_registros + " option:selected").val();
        } else if(obra_ddl == "padre"){
            proc = $('#' + id_proc_ddl_registros + " option:selected").val();
            ppto = "NA";
        }
        var user = firebase.auth().currentUser;
        var reg = {
            esp: esp,
            horas: 0,
            inge: user.uid,
            obra: $('#' + id_obra_ddl_registros + " option:selected").text(),
            proceso: proc,
            presupuesto: ppto,
            status: false,
            checkin: new Date().getTime(),
        }
        var hoy = getWeek(new Date().getTime());
        var cu_reg = firebase.database().ref(rama_bd_registros + "/" + hoy[1] + "/" + hoy[0]).push(reg).key;
        var tru = true;
        firebase.database().ref(rama_bd_personal + "/" + user.uid + "/status").set(tru);
        path = hoy[1] + "/" + hoy[0] + "/" + cu_reg;
    }
});

$('#' + id_salida_button_registros).click(function(){
    var hoy = getWeek(new Date().getTime());
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        if(path != "" && snapshot.child(path).exists()){
            cierraRegistro(snapshot.child(path));
        } else {
            snapshot.forEach(function(yearSnap){
                yearSnap.forEach(function(weekSnap){
                    weekSnap.forEach(function(regSnap){
                        var reg == regSnap.val();
                        if(reg.status == false && reg.inge == user){
                            path = yearSnap.key + "/" + weekSnap.key + "/" + regSnap.key;
                            cierraRegistro(regSnap);
                        }
                    });
                });
            });
        }
        var user = firebase.auth().currentUser;
        var fal = false;
        firebase.database().ref(rama_bd_personal + "/" + user.uid + "/status").set(fal);
    });
});

function cierraRegistro(regSnap){
    var reg = regSnap.val();
    var checkin = parseInt(reg.checkin);
    esp = reg.esp;
    var horas = new Date().getTime() - checkin;
    var updates = {
        horas: horas,
        status: true,
    }
    firebase.database().ref(rama_bd_registros + "/" + path).update(updates);
    if(reg.obra != "Otros"){
        var cant_horas = parseFloat(horas / 3600000);
        var cant = cant_horas * precio_hora;
        var proc_path = reg.proceso.split("-");
        if(proc_path.length > 1){
            //sumaScoreKaizen(reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso, cant);
            sumaScoreProc(reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso, cant_horas);
        } else {
            sumaScoreProc(reg.obra + "/procesos/" + reg.proceso, cant_horas);
        }
        //sumaScoreKaizen(reg.obra + "/procesos/" + proc_path[0], cant);
        //sumaScoreKaizen(reg.obra,cant);
        if(reg.proceso == "PC00"){
            sumaScoreProc(reg.obra + "/presupuestos/" + reg.presupuesto, cant_horas);
        }
    }
}

function sumaScoreProc(query,cant){
    firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE").once('value').then(function(snapshot){
        if(snapshot.exists() && (esp == "ie" || esp == "ihs")){
            var u_uid = firebase.auth().currentUser.uid;
            var total = snapshot.child("total_trabajado").exists() ? parseFloat(snapshot.child("total_trabajado").val()) : 0;
            var total_esp = snapshot.child("total_" + esp + "_trabajado").exists() ? parseFloat(snapshot.child("total_" + esp + "_trabajado").val()) : 0;
            var horas_trabajador = snapshot.child(esp + "/" + u_uid + "/horas_trabajadas").exists() ? parseFloat(snapshot.child(esp + "/" + firebase.auth().currentUser.uid + "/horas_trabajadas").val()) : 0;
            total += cant;
            total_esp += cant;
            horas_trabajador += cant;
            firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE/total_trabajado").set(total);
            firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE/total_" + esp + "_trabajado").set(total_esp);
            firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE/" + esp + "/" + u_uid + "/horas_trabajadas").set(horas_trabajador);
        }
    });
}
/*
function sumaScoreKaizen(query,cant){
    firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PROYECTOS/PAG").once('value').then(function(snapshot){
        var precio_anterior = snapshot.exists() ? parseFloat(snapshot.val()) : 0;
        var nuevo_precio = precio_anterior + cant;
        firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PROYECTOS/PAG").set(nuevo_precio);
    });
}*/
