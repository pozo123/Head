var rama_bd_inges = "inges";
var id_boton_refresh_query = "refresh_tabla";

var tabla = [][];

$('#' + id_entrada_button_perfil).click(function () {
	    firebase.database(rama_bd_inges).ref().orderByChild('nombre').on('child_added',function(snapshot){
        	var ing = snapshot.val();
        	//firebase query de proyectos dentro de ese ing
        });

});
