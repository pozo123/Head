var id_boton_chido = "botonChidoRegs";
var rama_bd_registros = "proyectos/registros";
var rama_bd_inges = "proyectos/inges";
var rama_bd_obras = "proyectos/obras";

$('#' + id_boton_chido).click(function(){
    
    /*
    //CAMBIAR REGISTROS "MISCELANEOS" POR "OTROS"
    var i = 0;
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            if(reg.obra == "Miscelaneo"){
                console.log("Registro " + i + ": " + cu + " actualizado.")
                //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/obra").update("Otros");
            }
        });
    });
    */

    //REGISTROS CON MAS DE 15 HORAS -> 9 HORAS
    /*
    var i = 0;
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            if(reg.horas/3600000 > 15){
                i++;
                console.log("Registro " + i + ": " + cu + " acotado.");
                //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/horas").set(9);
            }
        });
    });
    */

    //RESETEAR TODAS LAS HORAS TRABAJADAS DE LOS PPTOS A 0
    /*
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            obra_snap.child("presupuestos").forEach(function(presu_snap){//CHECA QUE SI SEA ASI
                var presu = presu_snap.val();
                //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales" + " = 0");
                //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales_ie").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales_ie" + " = 0");
                //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales_ihs").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/horas_totales_ihs" + " = 0");
                //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas" + " = 0");
                presu_snap.child("colaboradores_asignados/ie").forEach(function(col_snap){
                    var col = col_snap.key;
                    //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas" + " = 0");
                });
                presu_snap.child("colaboradores_asignados/ihs").forEach(function(col_snap){
                    var col = col_snap.key;
                    //firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas" + " = 0");
                });
            });
        });
    });
    */

    //VOLVER A CARGAR LAS HORAS TRABAJADAS A TODOS LOS PPTOS DESDE REGISTROS
    //5 lugares a actualizar:
    //horas_trabajadas en presu
    //horas_totales y horas_totales_esp en colaboradores_asignados
    //horas_trabajadas en el colaborador especifico en colaboradores_asignados
    //horas_trabajadas en ppto en inge
    /*
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var regis = childSnapshot.val();

            firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(regis.inge).once('child_added').then(function(ing_snapshot){
                var ing = ing_snapshot.val();
                var username = ing.uid;
                firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto).once("value").then(function(snapshot){
                    var presu = snapshot.val();
                    var horas_trabajadas_p;
                    if(presu.horas_trabajadas !== null)
                        horas_trabajadas_p = presu.horas_trabajadas + regis.horas/3600000;
                    else
                        horas_trabajadas_p = regis.horas/3600000;
                    //firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas_p);
                    console.log("Modificando: " + rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas" + " = " + horas_trabajadas_p);
                    //firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales").set(horas_trabajadas_p);
                    console.log("Modificando: " + rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales" + " = " + horas_trabajadas_p);
                });
                if(regis.esp != "NA"){
                    if(regis.esp == "ie"){
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie").once("value").then(function(snapshot){
                        var horas_trabajadas = snapshot.val();
                        horas_trabajadas = horas_trabajadas + regis.horas/3600000;
                        //firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie").set(horas_trabajadas);
                        console.log("Modificando: " + rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie" + " = " + horas_trabajadas);
                    });
                    } else {  
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie").once("value").then(function(snapshot){
                        var horas_trabajadas = snapshot.val();
                        horas_trabajadas = horas_trabajadas + regis.horas/3600000;
                        //firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie").set(horas_trabajadas);
                        console.log("Modificando: " + rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/horas_totales_ie" + " = " + horas_trabajadas);
                    });
                    }
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + regis.esp + "/" + username + "/horas_trabajadas").once("value").then(function(snapshot){
                        var horas_trabajadas = snapshot.val();
                        horas_trabajadas = horas_trabajadas + regis.horas/3600000;
                        //firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + regis.esp + "/" + username + "/horas_trabajadas").set(horas_trabajadas);
                        console.log("Modificando: " + rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + regis.esp + "/" + username + "/horas_trabajadas" + " = " + horas_trabajadas);
                    });
                }
                
                firebase.database().ref(rama_bd_inges + "/" + regis.obra).orderByKey().equalTo(regis.presupuesto).once('child_added').then(function(snapshot){
                    var ppto = snapshot.val();
                    if(ppto.horas_trabajadas != null)
                        var horas_trabajadas = ppto.horas_trabajadas + regis.horas;
                    else 
                        var horas_trabajadas = regis.horas;
                    //firebase.database().ref(rama_bd_inges + "/" + regis.obra + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas);
                    console.log("Modificando: " + rama_bd_inges + "/" + regis.obra + "/" + regis.presupuesto + "/horas_trabajadas" + " = " + horas_trabajadas);
                });
                
            });
        });
    });
    */

    //ELIMINAR REGISTROS NUESTROS
    /*
    var i = 0;
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(reg.inge).once('child_added').then(function(ing_snapshot){
                var ing = ing_snapshot.val();
                if(flag === true && ing.credenciales === 0){
                    //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/esp").set(ing.esp_chamba);
                    var cu = reg.cu;
                    //console.log("Registro " + i + ": " + cu + " eliminado.");
                    firebase.database().ref(rama_bd_registros).child(cu).once('value').then(function(snapshot){
                        var update = {};
                        update[cu] = null;
                        //firebase.database().ref(rama_bd_registros).update(update);
                    });
                    flag = false;
                }
            });
        });
    });
    */

});
