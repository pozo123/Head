// JavaScript source code
$(document).ready(function() {    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});



function openTabs(tabLink, tabName) {

    var i;
    var tabContent;
    var tabLinks;
    tabContent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabContent.length; i++) {
        $(tabContent[i]).addClass('hidden');
    }

    tabLinks = document.getElementsByClassName("tab");

    for (i = 0; i < tabLinks.length; i++) {
        $(tabLinks[i]).removeClass('active');
    }

    $("#"+tabName).removeClass('hidden');
    $("#"+tabLink).addClass('active');
};


firebase.auth().onAuthStateChanged(user => {
    if(user) {
        var flag = true;
        $('body').removeClass("hidden");
        firebase.database().ref('inges').orderByChild('uid').equalTo(user.uid).on("child_added", function (snapshot) {
                if(flag === true){

                var user_bd = snapshot.val();

                var usuarioNombre = document.getElementById('usuarioConectado');
                usuarioNombre.innerHTML = user_bd.nombre;
                
                if(user_bd.permisos.alta_colaborador === true)
                    $('#tabAltaColaborador').removeClass('hidden');
                else
                    $('#tabAltaColaborador').addClass('hidden');

                if(user_bd.permisos.alta_obra === true)
                    $('#tabAltaObra').removeClass('hidden');
                else
                    $('#tabAltaObra').addClass('hidden');

                if(user_bd.permisos.alta_cliente === true)
                    $('#tabAltaCliente').removeClass('hidden');
                else
                    $('#tabAltaCliente').addClass('hidden');

                if(user_bd.permisos.reporte === true)
                    $('#tabReporte').removeClass('hidden');
                else
                    $('#tabReporte').addClass('hidden');

                    if(user_bd.permisos.perfil === true)
                    $('#tabPerfil').removeClass('hidden');
                else
                    $('#tabPerfil').addClass('hidden');
                
                if(user_bd.permisos.activar === true)
                    $('#tabActivar').removeClass('hidden');
                else
                    $('#tabActivar').addClass('hidden');

                    if(user_bd.credenciales === 2 || user_bd.credenciales === 1 || user_bd.credenciales === 0)
                    $('#tabPermisos').removeClass('hidden');
                else
                    $('#tabPermisos').addClass('hidden');
                    
                flag = false;
            }
            });
    } else {
        alert("Inicia sesión para entrar a comunidad");
        window.location.reload("index.html");
        window.location.assign("index.html");
    }
});





$('body').removeClass("hidden");



$("#cerrarSesion").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
      
      location.reload();
}));

/* $("#button_registro_entrada").click((function () {
    $("#button_registro_entrada").addClass("hidden");
    $("#button_registro_salida").removeClass("hidden");
}));
$("#button_registro_salida").click(function () {
    $("#button_registro_salida").addClass("hidden");
    $("#button_registro_entrada").removeClass("hidden");
});  */