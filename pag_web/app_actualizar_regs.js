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
    //RESETEAR TODAS LAS HORAS TRABAJADAS DE LOS PPTOS A 0
    /*
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            obra_snap.child("presupuestos").forEach(function(presu.snap){//CHECA QUE SI SEA ASI
    
            })

        })
    })
    */

    //VOLVER A CARGAR LAS HORAS TRABAJADAS A TODOS LOS PPTOS DESDE REGISTROS
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
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas_p);
                });
                if(regis.esp != "NA"){
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + regis.esp + "/" + username + "/horas_trabajadas").once("value").then(function(snapshot){
                        var horas_trabajadas = snapshot.val();
                        horas_trabajadas = horas_trabajadas + regis.horas/3600000;
                        firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").set(horas_trabajadas);
                    });
                }
                
                firebase.database().ref(rama_bd_inges + "/" + regis.obra).orderByKey().equalTo(regis.presupuesto).once('child_added').then(function(snapshot){
                    var ppto = snapshot.val();
                    if(ppto.horas_trabajadas != null)
                        var horas_trabajadas = ppto.horas_trabajadas + regis.horas;
                    else 
                        var horas_trabajadas = regis.horas;
                    firebase.database().ref(rama_bd_inges + "/" + regis.obra + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas);
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
