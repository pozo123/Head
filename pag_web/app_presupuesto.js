var id_nombre_presupuesto = "presupuestoNombre";
var id_horas_programadas_presupuesto = "horasProgramadas";
var id_registrar_button_presupuesto = "registrarPresupuesto";
var id_obra_ddl_presupuesto = "obraPresupuesto";
var id_tipo_presupuesto_ddl_presupuesto = "DDLtipoPresupuesto"; //Nueva variable
var id_precio_presupuesto = "precioPresupuesto";
var id_precio_sugerido_label_presupuesto = "labelCash";

var id_anticipo1_rb_presupuesto = "rb1anticipo";
var id_anticipo2_rb_presupuesto = "rb2anticipo";
var id_anticipo3_rb_presupuesto = "rb3anticipo";
var id_anticipo_presupuesto = "anticipo";

var id_reqs_ddlcheck_presupuesto = "reqs";
var id_exclusiones_ddl_check_presupuesto = "exc";
var id_atn_ddl_check_presupuesto = "atn";

var rama_bd_tipos_presupuesto = "tipos_presupuesto";
var rama_bd_obras = "obras";
var rama_bd_reqs = "reqs";
var rama_bd_exclusiones = "exclusiones";
var rama_bd_clientes = "clientes";

var alcance_txt = 'alcance';

var fecha_actual = new Date();
var precio_hora = 2000;
$('#' + id_horas_programadas_presupuesto).change(function(){
    $('#' + id_precio_sugerido_label_presupuesto).text("*Precio mínimo sugerido: "+($('#' + id_horas_programadas_presupuesto).val() * precio_hora));
});

$(document).ready(function() {

    // llenar el textArea desde aquí

    document.getElementById((alcance_txt)).value = " - Dimensionamiento de cisternas, cuarto de bombas, memoria de cálculo para toma de agua municipal y gasto para cálculo de planta de tratamiento." + "\n" +
    "- Dimensionamiento de cuartos eléctricos, muros de concentración de medidores, ubicación de transformadores, planta de emergencia y multitransfer." +  "\n" +
    "- Definición de ductos verticales, eléctrica, instalaciones especiales, hidráulicos y de PCI." +  "\n" +
    "- Proyecto de salidas de iluminación, contactos, apagadores, timbre, zumbador, extractor, salidas de TV y Telefonía, en estacionamiento, bodegas, departamentos, vestíbulos departamentos, escaleras, cuartos eléctricos, de bombas y elevadores." +  "\n" +
    "- Proyecto de salidas de CCTV y Control de Acceso."            


    var select2 = document.getElementById(id_obra_ddl_presupuesto);   
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    select2.appendChild(option2);

    var select3 = document.getElementById(id_tipo_presupuesto_ddl_presupuesto);   
    var option5 = document.createElement('option');
    option5.style = "display:none";
    option5.text = option5.value = "";
    select3.appendChild(option5);
    
    //El id puede que tenga que ser integer
    //var myData = [];
    firebase.database().ref(rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
        var req = snapshot.val();
        //myData.push({id: req.nombre, label: req.nombre});        
        //$('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset",myData);
        $('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("append",{
            id: req.nombre, label: req.nombre
        });
    });

    firebase.database().ref(rama_bd_exclusiones).orderByChild('nombre').on('child_added',function(snapshot){
        var exc = snapshot.val();
        $('#' + id_exclusiones_ddl_check_presupuesto).dropdownCheckbox("append",{
            id: exc.nombre, label: exc.texto
        });
    });

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = option4.value = obra.nombre; 
        select2.appendChild(option4);

    });

    firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild('nombre').on('child_added',function(snapshot){
        
        var tipo = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = tipo.nombre; 
        option6.value = tipo.codigo;
        select3.appendChild(option6);

    });
});

function loadAtn(){
    $('#' + id_atn_ddl_check_presupuesto).dropdownCheckbox("reset",[]);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_presupuesto + " option:selected").val()).once('value').then(function(snapshot){
        var obra_selec = snapshot.val();
        firebase.database().ref(rama_bd_clientes).orderByChild('nombre').equalTo(obra_selec.cliente).once('child_added',function(snapshot){
            var cliente = snapshot.val();
            firebase.database().ref(rama_bd_clientes + "/" + cliente.nombre + "/atencion").orderByChild('nombre').once("child_added",function(snapshot){
                var atn = snapshot.val();
                alert(atn.nombre);
                $('#' + id_atn_ddl_check_presupuesto).dropdownCheckbox("append",{
                    id: atn.nombre, label: atn.nombre
                });
            });
        });
    });
};

function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$('#' + id_registrar_button_presupuesto).click(function () {

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_presupuesto + " option:selected").val()).once('value').then(function(snapshot){
        var obra_selec = snapshot.val();
        firebase.database().ref(rama_bd_clientes).orderByChild("nombre").equalTo(obra_selec.cliente).once('child_added').then(function(snapshot){
            var cliente_selec = snapshot.val();
            var codigo_obra = obra_selec.clave;
            var codigo_cliente = cliente_selec.clave;
            var codigo_tipo_proyecto = $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").val();
            var anticipo;
            var anticipo_str;
            if($('#' + id_anticipo1_rb_presupuesto).checked === true){
                anticipo = 0;
                anticipo_str = "100% contra entrega";
            }
            else if($('#' + id_anticipo2_rb_presupuesto).checked === true){
                anticipo = $('#' + id_anticipo_presupuesto).val();
                anticipo_str = anticipo + "% anticipo, resto contra estimaciones";
            }
            else if($('#' + id_anticipo3_rb_presupuesto).checked === true){
                anticipo = 100;
                anticipo_str = "100% anticipo";
            }
                 
            var consecutivo = 1;
            var clave_presu = codigo_obra + "/" + codigo_cliente + "/" + codigo_tipo_proyecto;
            firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos").orderByChild("nombre").once('child_added').then(function(snapshot){
                var p = snapshot.val();
                if((""+p.clave).substring(0,(""+p.clave).length-3) === (codigo_obra)){
                    consecutivo++;
                    consecutivo_str = ("00" + consecutivo).slice(-3);
                    clave_presu = clave_presu + consecutivo_str;
                }
            });
            var fecha = new Date().getTime();

            var reqs_lista = $('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("checked");
            var reqs_str = "";
            for(i=0;i<reqs_lista.length;i++){
                reqs_str = reqs_str + "-" + reqs_lista[i].label + "\n";
            }

            var exc_lista = $('#' + id_exclusiones_ddl_check_presupuesto).dropdownCheckbox("checked");
            var exc_str = "";
            for(i=0;i<exc_lista.length;i++){
                exc_str = exc_str + "-" + exc_lista[i].label + "\n";
            }

            var atn_lista = $('#' + id_atn_ddl_check_presupuesto).dropdownCheckbox("checked");
            var atn_str = "";
            for(i=0;i<atn_lista.length;i++){
                atn_str = atn_str + atn_lista[i].label + "\n";
            }

            var precio_str = formatMoney($('#' + id_precio_presupuesto).val());

            var presupuesto = {      
                nombre: $('#' + id_nombre_presupuesto).val(),
                clave: clave_presu,
                horas_programadas: $('#' + id_horas_programadas_presupuesto).val(),
                cash_presupuestado: $('#' + id_precio_presupuesto).val(),
                timestamps: {
                    startedAt: new Date().getTime(),
                    finishedAt: 0,
                    activacion: 0,
                    reqs_completados: 0
                },
                contrato: false,
                reqs: reqs_lista,
                exclusiones: exc_lista,
                atencion: atn_lista
            }
            firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).set(presupuesto);

            alert("¡Alta de presupuesto exitosa!");

            //Aqui se genera el pdf... creo
            // Variables: 
            // fecha (falta darle el formato adecuado)
            // obra_selec.nombre
            // obra_selec.direccion (o quieren la direccion del cliente?)
            // obra_selec.cliente
            // clave_presu
            // $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").text() (text jala? el value es el codigo)
            // AT'N hay que jalarlo de un DDL dependiendo de la obra seleccionada, que se puedan añadir como si fueran reqs
            // $('#' + id_precio_presupuesto).val()
            //________________________________________________________________________________________

            var alcance = $('#' + 'alcance').val()

            var pdfPresupuesto = {
                pageSize: 'LETTER',
              
                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                pageMargins: [ 40, 20, 20, 40],
                content: [
                    {
                        table:{
                            widths: ['*', 120, '*', '*','*',120],
                            body:[
                                //primer segmento, barra y logo. 50%.
                                [
                                    {
                                        colSpan: 5,
                                        border: [true, true, false, false],
                                        text: "aqui viene la barra",
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    {
                                        rowSpan:2,
                                        border: [false, true, true, true],
                                        fillColor: '#dddddd',
                                        text: 'aquí va el logo'
                                    },
                                ],
                               [
                                    {
                                        border: [true, false, false, true],
                                        text: "CDMX,",
                                    },
                                    {
                                        colSpan: 4,
                                        border: [false, false, false, true],
                                        text: fecha_actual.toLocaleDateString("es-ES",options),
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                // segunda linea 100%
                                [
                                    {
                                        border: [true, false, false, false],
                                        text: "Proyecto:",
                                        alignment: 'center',
                                        margin: [0,5],
                                    },
                                    {
                                        border: [false, false, false, false],
                                        text: obra_selec.nombre.toUpperCase(),
                                        bold: true,
                                        color:'#2C3F5A',
                                        margin: [0,5],
                                    },
                                    {   
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: 'PRESUPUESTO: ',
                                        color:'#2C3F5A',
                                        bold: true,
                                        alignment: 'center',
                                        margin: [0,5],
                                        fontSize: 14,
                                    },
                                    '',
                                    {   
                                        colSpan:2,
                                        border: [false, false, true, false],
                                        text: $('#' + id_nombre_presupuesto).val().toUpperCase(),
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 14,
                                    },
                                    '',
                                ],

                                // Tercera línea, falta poner programación de dirección y tipo
                                [
                                    {
                                        rowSpan:5,
                                        border: [true, false, false, false],
                                        text: "Dirección:",
                                        alignment: 'center',
                                        margin: [0,5],
                                    },
                                    {
                                        rowSpan:5,
                                        border: [false, false, false, false],
                                        text: "Calle," + "num:" + "\n" + "Colonia," + "Delegación," + "\n" + "ciudad",
                                        margin: [0,5],
                                        fontSize:10,
                                    },
                                    {   // aquí poner el tipo de presupuesto
                                        colSpan:4,
                                        border: [false, false, true, false],
                                        text: 'PROYECTO DE INSTALACIONES HIDROSANITARIAS, ELECTRICAS Y ESPECIALES: ',
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                ],

                                [
                                    '',
                                    '',
                                    {  
                                        colSpan:2, rowSpan:2,
                                        border: [false, false, false, false],
                                        text: 'CLAVE: ',
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2, rowSpan:2,
                                        border: [false, false, true, false],
                                        text: clave_presu,
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'center',
                                    },
                                    '',
                                ],
                                [
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    '',
                                    '',
                                    {  
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: 'CLIENTE: ',
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2,
                                        border: [false, false, true, false],
                                        text: obra_selec.cliente,
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'center',
                                    },
                                    '',
                                ],
                                [
                                    '',
                                    '',
                                    {  
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: 'AT \' N: ',
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2,
                                        border: [false, false, true, false],
                                        text:  atn_str, // falta la programación del ATN
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'center',
                                    },
                                    '',
                                ],
                                [
                                    {  
                                        colSpan:6,
                                        border: [true, false, true, false],
                                        text: 'Presentamos a su consideración las especificaciones, descripción, alcances y condiciones de este presupuesto por el diseño de las instalaciones abajo mencionadas a efectuarse en la obra:',
                                        margin: [0,5],
                                        fontSize: 10,
                                        alignment: 'justify',
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        colSpan:6,
                                        border: [true, false, true, true],
                                        text: obra_selec.nombre.toUpperCase(),
                                        bold: true,
                                        color:'#2C3F5A',
                                        margin: [0,5],
                                        alignment: 'center'
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                // segundo bloqu2
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: 'N \º',
                                        bold: true,
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    {  
                                        colSpan:4,
                                        border: [true, true, false, true],
                                        text: 'ALCANCE',
                                        bold: true,
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                    {  
                                        border: [false, true, true, true],
                                        text: 'TOTAL',
                                        bold: true,
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                ],
                                // alcances 100%
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '1',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center'
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: $('#' + id_nombre_presupuesto).val().toUpperCase(),
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],

                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '1.1',
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize:8,
                                        textAlign: 'center',
                                    },
                                    {  
                                        colSpan:4,
                                        border: [true, true, true, true],
                                        text: alcance,			
                                        margin: [0,5],
                                        fontSize:8,
                                        alignment: 'justify',
                                    },
                                    '',
                                    '',
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: $('#' + id_precio_presupuesto).val(),
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize:12,
                                    },
                                ],
                                [
                                    {  
                                        colSpan: 6,
                                        border: [true, true, true, true],
                                        margin: [0,2],
                                        text: "",
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],

                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '2',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: 'REQUERIMIENTOS ANTES DE INICIAR',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '2.1',
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize:8,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: reqs_str,			
                                        margin: [0,5],
                                        fontSize:8,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        colSpan: 6,
                                        border: [true, true, true, true],
                                        margin: [0,2],
                                        text: "",
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '3',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: 'EXCLUSIONES',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: '3.1',
                                        margin: [0,5],
                                        alignment: 'center',
                                        textAlign: 'center',
                                        fontSize:8,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: exc_str,			
                                        margin: [0,5],
                                        fontSize:8,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        colSpan: 6,
                                        border: [true, true, true, true],
                                        margin: [0,2],
                                        text: "",
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        border: [true, true, true, true],
                                        text: 'IMPORTE CON LETRA',
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: 'AQUÍ VA EL IMPORTE CON LETRA',
                                        bold: true,
                                        margin: [0,5],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                [
                                    {  
                                        colSpan:3,
                                        border: [true, false, true, false],
                                        text: '',
                                        margin: [0,0],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    '',
                                    {  
                                        colSpan:2,
                                        border: [true, true, true, false],
                                        text: 'Subtotal',
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: $('#' + id_precio_presupuesto).val(),
                                        bold: true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }

                                ],
                                [
                                    {  
                                        colSpan:3,
                                        border: [true, false, true, false],
                                        text: '',
                                        margin: [0,0],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    '',
                                    {  
                                        colSpan:2,
                                        border: [true, false, true, false],
                                        text: 'I.V.A',
                                        bold: true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: $('#' + id_precio_presupuesto).val()*0.16,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }
                                ],

                                [
                                    {  
                                        colSpan:3,
                                        border: [true, false, true, false],
                                        text: '',
                                        margin: [0,0],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    '',
                                    {  
                                        colSpan:2,
                                        border: [true, false, true, true],
                                        text: 'TOTAL',
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: $('#' + id_precio_presupuesto).val()*1.16,
                                        bold: true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }

                                ],
                                [
                                    {  
                                        colSpan:2,
                                        border: [true, false, false, false],
                                        text: '',
                                        margin: [0,20],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        colSpan:4,
                                        border: [false, false, true, false],
                                        text: 'Condiciones Comerciales: ',
                                        bold:true,
                                        margin: [0,20],
                                        alignment: 'left',
                                        fontSize: 10,
                                    },
                                    '','','',

                                ],

                                [
                                    {  
                                        colSpan:2,
                                        border: [true, false, false, false],
                                        text: 'Precios incluyen IVA' + '\n' + 'Precios expresados en moneda nacional. ',
                                        margin: [0,20],
                                        alignment: 'center',
                                        fontSize: 8,
                                        color :"#6FAFB4"
                                    },
                                    '',
                                    {  
                                        colSpan:4,
                                        border: [false, false, true, false],
                                        text: 'aquí va el valor de los radiobuttons',
                                        bold:true,
                                        margin: [0,20],
                                        alignment: 'left',
                                        fontSize: 10,
                                    },
                                    '','','',

                                ],




                            ],
                        }
                    }
                ],
              };

              pdfMake.createPdf(pdfPresupuesto).open();
        });            
    });
});
