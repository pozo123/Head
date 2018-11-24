var id_boton_chido = "botonChidoRegs";
var rama_bd_registros = "registros";
var rama_bd_inges = "inges";

$('#' + id_boton_chido).click(function(){
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(reg.inge).once('value').then(function(snapshot){
                var ing = snapshot.val();
                //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/esp").set(ing.esp_chamba);
                alert("ref: " + rama_bd_registros + "/" + reg.cu + "/esp");
                alert("esp: " + ing.esp_chamba);
            });
        });
    });
});

