var id_file_importarTrabajadores = "importarTrabajadoresFile";
var id_button_guardar_importarTrabajadores = "importarTrabajadoresButton";
var id_filename_importarTrabajadores = "importarTrabajadoresLabelFile";

var rama_bd_trabajadores = "produccion/trabajadores";

var excelSeleccionado = "";
var fileName = "";

$('#' + id_file_importarTrabajadores).on("change",(function(event) {
    console.log("hola"); 
    excelSeleccionado = event.target.files[0];
    fileName = excelSeleccionado.name;
    $('#' + id_filename_importarTrabajadores).text(fileName)
}));;

$('#' + id_button_guardar_importarTrabajadores).on("click",function() {
    var reader = new FileReader();
    var result = {};

    reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {type: 'array'});
        console.log(workbook);
        var json = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
            if (roa.length) json[sheetName] = roa;
        });
        console.log(json);
    };
    reader.readAsArrayBuffer(excelSeleccionado);

    var uid_index;
    var titulos = [];
    //AQUI hay que definir
    var niveles = [0,0,0,"claves","claves","claves","info_personal","info_personal","info_personal","info_personal",0,"datos_bancarios","datos_bancarios","datos_bancarios",0,0,0,"tallas","tallas","tallas",0,0];
    for(key in json[0]){
        if(json[0][key] == "id_trabajadores") 
            uid_index = key;
        titulos[key] = json[0][key];
    }
    console.log(titulos);
    var resultado = {};
    for(key in json){
        if(key > 0){
            var trabajador = {};
            for(i=0;i<titulos.length;i++){
                var n = niveles[i];
                var k = titulos[i];
                if(n != 0){
                    var path = n.split("/");
                    var pointer = trabajador;
                    for(j = 0; j < path.length; j++){
                        if(pointer[path[j]] == undefined){
                            pointer[path[j]] = {};
                        }
                        pointer = pointer[path[j]];
                    }
                    pointer[k] = json[key][i];
                } else {
                    trabajador[k] = json[key][i];
                }
            }
            resultado[json[key][uid_index]] = trabajador;
        }
    }
    console.log(resultado); 
    firebase.database().ref(rama_bd_trabajadores).update(resultado);
});
/*
var json = {
    0: {0: "rango", 1: "nombre", 2:"apellido", 3:"talla_zapatos", 4: "sueldo_base", 5:"uid", 6:"color"},
    1: {0: "Oficial", 1: "Juan", 2:"Perez", 3:"9", 4: "2200", 5:"123", 6:"azul"},
    2: {0: "Oficial", 1: "Pedro", 2:"Lopez", 3:"8.5", 4: "2200", 5:"11230", 6:"azul"},
    3: {0: "Ayudante", 1: "Fer", 2:"Fernandez", 3:"10", 4: "1500", 5:"92511", 6:"azul"},
    4: {0: "Segundo Oficial", 1: "Ramiro", 2:"Ramirez", 3:"14", 4: "1800", 5:"149392", 6:"azul"},
    5: {0: "Encargado", 1: "Lucia", 2:"Martinez", 3:"8", 4: "3000", 5:"80085", 6:"azul"},
}
*/
