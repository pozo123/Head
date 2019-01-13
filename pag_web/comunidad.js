
var version;
var rama_bd_inges = "proyectos/inges";
var userPro = ""
var fotoSeleccionada = ""
var rama_storage_colaboradores  = "proyectos/colaboradores"

$(document).ready(function() {    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    //verifyVersion();
    firebase.database().ref("info_web").once('value',function(snapshot){
        version = snapshot.child("version").val();
        verifyVersion();
    });
    //setInterval(verifyVersion, 43200000);

});

function verifyVersion() {
    firebase.database().ref("info_web").on('value',function(snapshot){
        var info = snapshot;
        var ver = info.child("version").val();
        if(ver !== version){
            location.reload();
        }
    });
}


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
        userUID = user.uid;
        var flag = true;
        $('body').removeClass("hidden");
        firebase.database().ref(rama_bd_inges).orderByChild('uid').equalTo(user.uid).on("child_added", function (snapshot) {
                if(flag === true){

                var user_bd = snapshot.val();

                if(user_bd.foto){
                    console.log(user_bd.foto);
                    var imagen = document.getElementById("img_foto");
                    imagen.src = user_bd.foto.url;
                } else {

                }

                var usuarioNombre = document.getElementById('usuarioConectado');
                usuarioNombre.innerHTML = user_bd.nickname;
                
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
                if(user_bd.permisos.reporte_presupuestos === true)
                    $('#tabReportePpto').removeClass('hidden');
                else
                    $('#tabReportePpto').addClass('hidden');

                    if(user_bd.permisos.perfil === true)
                    $('#tabPerfil').removeClass('hidden');
                else
                    $('#tabPerfil').addClass('hidden');
                
                if(user_bd.permisos.activar === true)
                    $('#tabActivar').removeClass('hidden');
                else
                    $('#tabActivar').addClass('hidden');

                if(user_bd.permisos.pagos === true)
                    $('#tabPagos').removeClass('hidden');
                else
                    $('#tabPagos').addClass('hidden');

                if(user_bd.credenciales === 2 || user_bd.credenciales === 1 || user_bd.credenciales === 0)
                    $('#tabPermisos').removeClass('hidden');
                else
                    $('#tabPermisos').addClass('hidden');
                    // agregar botón maestro
                if(user_bd.credenciales === 2 || user_bd.credenciales === 1 || user_bd.credenciales === 0)
                    $('#pageSubmenuCierre').removeClass('hidden');
                else
                    $('#pageSubmenuCierre').addClass('hidden');

                if(user_bd.credenciales === 0)
                    $('#pageSubmenuActRegs').removeClass('hidden');
                else
                    $('#pageSubmenuActRegs').addClass('hidden');
                    
                flag = false;
            }
            });
    } else {
        alert("Inicia sesión para entrar a comunidad");
        window.location.reload("index.html");
        window.location.assign("index.html");
    }
});

$('#fotoPersonal_input').on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#seleccionarFotoPersonal').addClass("hidden");
    $('#subirFotoPersonal').removeClass("hidden");
});

function subirFotoPersonal(){
    var fileName = fotoSeleccionada.name;
    var storageRef = firebase.storage().ref(rama_storage_colaboradores + "/" + userUID + "/" + fileName);

    var uploadTask = storageRef.put(fotoSeleccionada);

    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          var updates = {}
          var data = {
              url: downloadURL,
          }
          updates["/" + rama_bd_inges + "/" + userUID + "/foto"] = data;
          firebase.database().ref().update(updates);

          setTimeout(() => {
              location.reload();
          }, 3000);
        });
      });
}


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