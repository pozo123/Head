// JavaScript source code

var id_card_column_dashboard = "dashCards";

var rama_bd_inges = "inges";
var rama_bd_registros = "registros";

$(document).ready(function(){
  loadDashcards();
  setInterval(loadDashcards, 5000)
});

var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

$('#fullScreen').click(function () {
    openFullscreen();
    $('#notFullScreen').removeClass('hidden');
    $('#fullScreen').addClass('hidden');
});
$('#notFullScreen').click(function () {
  closeFullscreen();
  $('#fullScreen').removeClass('hidden');
  $('#notFullScreen').addClass('hidden');
});



function loadDashcards(){
    // aquí habías puesto el flag
  $('#' + id_card_column_dashboard).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
      var flag = true;
      var inge = snapshot.val();
      var card = document.createElement('div');
      card.id = "card_" + inge.uid;
      if(inge.permisos.perfil === true){
        if(inge.status === true){
              //alert(inge.nombre + " " + "ingeStatus" + " " + inge.status)
            firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(inge.nombre).on("child_added",function(snapshot){
              var reg = snapshot.val();
              if(reg.status === false && flag === true){
                  flag = false;
                  card.className = "card card_dash border-success mb-3";
                  card.setAttribute("style", "max-width: 18rem;");
                  var header = document.createElement('div');
                  header.className = "card-header";
                  header.innerHTML = inge.nombre;
                  var body = document.createElement('div');
                  body.className = "card-body text-success";
                  var p_obra = document.createElement("h6");
                  var p_presupuesto = document.createElement("h6");
                  var p_checkin = document.createElement("h6");
                  var node_obra = document.createTextNode("Obra: " + reg.obra);
                  var node_presupuesto = document.createTextNode("Presupuesto: " + reg.presupuesto);
                  var d = new Date(reg.checkin);
                  //alert(reg.checkin);
                  var node_checkin = document.createTextNode("Hora de Inicio: " + d.toLocaleTimeString());
                  p_obra.appendChild(node_obra);
                  p_presupuesto.appendChild(node_presupuesto);
                  p_checkin.appendChild(node_checkin);
                  body.appendChild(p_obra);
                  body.appendChild(p_presupuesto);
                  body.appendChild(p_checkin);
                  header.appendChild(body);
                  card.appendChild(header);
                  var div = document.getElementById(id_card_column_dashboard);
                  div.appendChild(card);
              }
          });
          }else{
              card.className = "card card_dash border-danger mb-3 ";
              card.setAttribute("style", "max-width: 18rem;");
              var header = document.createElement('div');
              header.className = "card-header";
              header.innerHTML = inge.nombre;
              var body = document.createElement('div');
              body.className = "card-body text-danger";
              var node = document.createTextNode("No activo");
              body.appendChild(node);
              card.appendChild(header);
              card.appendChild(body);
              var div = document.getElementById(id_card_column_dashboard);
              div.appendChild(card);
          }
        }
        
        
    });
}