// JavaScript source code

var id_card_column_dashboard = "dashCards";

var rama_bd_inges = "inges";
var rama_bd_registros = "registros";

$(document).ready(function(){
  loadDashcards();
  setInterval(loadDashcards, 10000)
});

function loadDashcards(){
  $('#' + id_card_column_dashboard).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
       var inge = snapshot.val();
       var card = document.createElement('div');
       card.id = "card_" + inge.uid;
       if(inge.status === true){
         //alert(inge.nombre + " " + "ingeStatus" + " " + inge.status)
        firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(inge.nombre).on("child_added").then(function(snapshot){
            var reg = snapshot.val();
            if(reg.status === false){
                card.className = "card border-success mb-3";
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
           card.className = "card border-danger mb-3";
           card.setAttribute("style", "max-width: 18rem;");
           var header = document.createElement('div');
           header.className = "card-header";
           header.innerHTML = inge.nombre;
           var body = document.createElement('div');
           body.className = "card-body text-danger";
           var node = document.createTextNode("No activo");
           body.appendChild(node);
           header.appendChild(body);
           card.appendChild(header);
           var div = document.getElementById(id_card_column_dashboard);
           div.appendChild(card);
       }
       
       
       
    });
}
