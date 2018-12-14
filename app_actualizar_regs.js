var id_boton_chido = "botonChidoRegs";
var rama_bd_registros = "registros";
var rama_bd_inges = "inges";

$('#' + id_boton_chido).click(function(){
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
});
