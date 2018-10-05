// JavaScript source code

var rama_bd_inges = "inges";
var rama_bd_registros = "registros";

$(document).ready(function(){
    firebas.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
       var inge = snapshot.val();
       var card = document.createElement('div');
       card.id = "card_" + inge.uid;
       if(inge.status){
        firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(inge.nombre).once("child_added_", function(snapshot){
            var reg = snapshot.val();
            if(reg.status === false){
                card.className = "card borded-success mb-3";
                card.setAttribute("style", "max-width: 18rem;");
                var header = document.createElement('div');
                header.className = "card-header";
                header.innerHTML = inge.nombre;
                var body = document.createElement('div');
                body.className = "card-body text-success";
                var p_obra = document.createElement("p");
                var p_presupuesto = document.createElement("p");
                var node_obra = document.createTextNode("" + reg.obra);
                var node_presupuesto = document.createTextNode("" + reg.presupuesto);
                p_obra.appendChild(node_obra);
                p_presupuesto.appendChild(node_presupuesto);
                body.appendChild(p_obra);
                body.appendChild(p_presupuesto);
                header.appendChild(body);
                card.appendChild(header);
                $('#' + id_card_column_dashboard).appendChild(card);
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
           header.appendChild(body);
           card.appendChild(header);
           $('#' + id_card_column_dashboard).appendChild(card);
       }
       
       
       
    });
});
