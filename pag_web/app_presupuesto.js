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
var tiempoEntrega_txt = 'tiempoEntrega';

var fecha_actual = new Date();
var precio_hora = 2000;

$('#' + id_horas_programadas_presupuesto).change(function(){
    $('#' + id_precio_sugerido_label_presupuesto).text("*Precio mínimo sugerido: "+ formatMoney(($('#' + id_horas_programadas_presupuesto).val() * precio_hora)));
});

$(document).ready(function() {

    // llenar el textArea desde aquí

    document.getElementById((tiempoEntrega_txt)).value = "- Proyecto base: 15 días hábiles después de recibir el Anticipo e Información." +  "\n" +
    "- Revisión 01: 5 días hábiles a partir de la entrega de información requerida." +  "\n" +
    "- Entrega Final: 5 días hábiles a partir de la entrega de observaciones."
    
    document.getElementById((alcance_txt)).value = " - Dimensionamiento de cisternas, cuarto de bombas, memoria de cálculo para toma de agua municipal y gasto para cálculo de planta de tratamiento." + "\n" +
    "- Dimensionamiento de cuartos eléctricos, muros de concentración de medidores, ubicación de transformadores, planta de emergencia y multitransfer." +  "\n" +
    "- Definición de ductos verticales, eléctrica, instalaciones especiales, hidráulicos y de PCI." +  "\n" +
    "- Proyecto de salidas de iluminación, contactos, apagadores, timbre, zumbador, extractor, salidas de TV y Telefonía, en estacionamiento, bodegas, departamentos, vestíbulos departamentos, escaleras, cuartos eléctricos, de bombas y elevadores." +  "\n" +
    "- Proyecto de salidas de CCTV y Control de Acceso."  
    

    $( "#anticipo" ).click(function() {
        document.getElementById(id_anticipo2_rb_presupuesto).checked = true
      });

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
            id: exc.nombre, label: exc.nombre
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
            if(document.getElementById(id_anticipo1_rb_presupuesto).checked === true){
                anticipo = 0;
                anticipo_str = "100% contra entrega";
            }
            else if(document.getElementById(id_anticipo2_rb_presupuesto).checked === true){
                anticipo = $('#' + id_anticipo_presupuesto).val();
                anticipo_str = anticipo + "% anticipo, resto contra estimaciones";
            }
            else if(document.getElementById(id_anticipo3_rb_presupuesto).checked === true){
                anticipo = 100;
                anticipo_str = "100% anticipo";
            }

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
            
            //Querys a probar para contar cons
            //Falta programar bien codigo_tipo_proyecto (deberian ser dos fields)
            var consecutivo = 1;
            var clave_presu = codigo_obra + "/" + codigo_cliente + "/" + codigo_tipo_proyecto;
            firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos").orderByChild("nombre").equalTo($('#' + id_nombre_presupuesto).val()).once('child_added').then(function(snapshot){
                var p = snapshot.val();
                consecutivo = p.consecutivos.numChildren();
                if(consecutivo > 0){
                    var cons = {
                        precio: p.cash_presupuestado,
                        pdf: "vacio",//dice vacio para no dar "" y que luego truene
                        checkin: p.timestamps.startedAt,
                    }
                    firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val() + "/consecutivo/" + consecutivo).set(cons);
                    
                    var consecutivo_str = ("00" + consecutivo).slice(-3);
                    clave_presu = clave_presu + consecutivo_str;
                    var presupuesto = {      
                        //nombre: $('#' + id_nombre_presupuesto).val(),
                        clave: clave_presu,
                        horas_programadas: $('#' + id_horas_programadas_presupuesto).val(),
                        cash_presupuestado: $('#' + id_precio_presupuesto).val(),
                        timestamps: {
                            startedAt: new Date().getTime(),
                            finishedAt: 0,
                            activacion: 0,
                            reqs_completados: 0
                        },
                        /*consecutivos:{
                            1:{
                                precio: $('#' + id_precio_presupuesto).val(),
                                pdf: "vacio",
                                checkin: new Date().getTime(),
                            }
                        },*/
                        contrato: false,
                        reqs: reqs_lista,
                        exclusiones: exc_lista,
                        atencion: atn_lista,
                        pagos: "vacio",
                    }
                    
                    firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).update(presupuesto);
                    
                } else {
                    clave_presu = clave_presu + "001";
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
                        consecutivos:{
                            1:{
                                precio: $('#' + id_precio_presupuesto).val(),
                                pdf: "vacio",
                                checkin: new Date().getTime(),
                            }
                        },
                        contrato: false,
                        reqs: reqs_lista,
                        exclusiones: exc_lista,
                        atencion: atn_lista,
                        pagos: "vacio",
                    }
                    
                    firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).set(presupuesto);
                    
                }
            });
            
            //_____
            



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
            var alcance = $('#' + alcance_txt).val()
            var tiempoEntrega = $('#' + tiempoEntrega_txt).val()

            var terminosFiscales = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
            var terminosBancarios = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
            var fiscales = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
            var bancarios = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n"; 
            var tituloF = "";
            var tituloB = "";


            if(document.getElementById('fiscales').checked === true){
                tituloF = "Datos de Facturación"
                terminosFiscales = "Nombre de la empresa:" + "\n" +
                "Contacto:" + "\n" +
                "Teléfono:" + "\n" +
                "Email:" + "\n" +
                "Dirección:" + "\n" + "\n" +
                "RFC:";

                fiscales = "Head Administraciones, S.A. de C.V." + "\n" + "\n"+
                "C.P. Luis Cortez" + "\n" +
                "62737900" + "\n" +
                "luis@headingenieria.mx" + "\n" +
                "Av. Constituyentes 561 Int. 101a, Col. América, Miguel Hidalgo, Ciudad de México, C.P. 11820" + "\n" +
                "HAD160523HH3";
            }

            if(document.getElementById('bancarios').checked === true){
                tituloB = "Datos Bancarios"
                terminosBancarios ="Nombre del beneficiaro:" + "\n" +
                "Banco:" + "\n" +
                "Número de cuenta:" + "\n" +
                "CLABE:" + "\n" +
                "Tipo de cuenta:" + "\n";
                
                bancarios = "Head Administraciones, S.A. de C.V." + "\n" + "\n"+ 
                "Banco Mifel, S.A." + "\n" +
                "1600279218" + "\n" +
                "042180016002792181" + "\n" +
                "Moneda Nacional" + "\n";
            }

            var pdfPresupuesto = {
                pageSize: 'LETTER',
              
                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                pageMargins: [ 40, 20, 20, 40],
                footer: function(currentPage, pageCount) { return { fontSize:8,alignment: 'center', text: (currentPage == 2) ? 'Av. Constituyentes 561 Int. 101a, Col. América, Miguel Hidalgo, Ciudad de México, C.P. 11820, Tel. 6273 7900 , email: proyectos@headingenieria.mx' : '' }; },
                    //text: " Av. Constituyentes 561 Int. 101a, Col. América, Miguel Hidalgo, Ciudad de México, C.P. 11820, Tel. 6273 7900 , email: proyectos@headingenieria.mx",
/*                     margin: [0,10],
                    alignment: 'center',
                    fontSize: 8, */
                content: [
                    {
                        table:{
                            widths: ['*', 120, '*', '*','*',120],
                            body:[
                                //primer segmento, barra y logo. 50%.
                                [
                                    {
                                        text: " ",
                                        margin: [0,5],  
                                        colSpan: 5,
                                        border: [true, true, false, false],
                                        alignment: 'center',
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    {
                                        rowSpan:2,
                                        border: [false, true, true, true],
                                        image: '',
                                        width: 70,
                                        height: 50,
                                        alignment: 'center',
                                    },
                                ],
                               [
                                    {
                                        border: [true, false, false, true],
                                        text: "CDMX,",
                                        fontSize: 8,
                                        alignment: 'right'
                                    },
                                    {
                                        colSpan: 4,
                                        border: [false, false, false, true],
                                        text: fecha_actual.toLocaleDateString("es-ES",options),
                                        fontSize:8,
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
                                        text: "Obra:",
                                        alignment: 'center',
                                        margin: [0,5],
                                        fontSize: 8,
                                    },
                                    {
                                        border: [false, false, false, false],
                                        text: obra_selec.nombre.toUpperCase(),
                                        bold: true,
                                        color:'#2C3F5A',
                                        margin: [0,5],
                                        fontSize:10,
                                    },
                                    {   
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: 'PRESUPUESTO: ',
                                        color:'#2C3F5A',
                                        bold: true,
                                        alignment: 'center',
                                        margin: [0,5],
                                        fontSize: 10,
                                    },
                                    '',
                                    {   
                                        colSpan:2,
                                        border: [false, false, true, false],
                                        text: $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").val().toUpperCase(),
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 10,
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
                                        fontSize: 8,
                                    },
                                    {
                                        rowSpan:5,
                                        border: [false, false, false, false],
                                        text: "Calle: " +  obra_selec.direccion.calle + ", No. " + obra_selec.direccion.numero + "\n" +
                                         "COL. " + obra_selec.direccion.colonia + "\n" + "Delegación: " + obra_selec.direccion.delegacion + ", \n" + 
                                         obra_selec.direccion.ciudad,
                                        margin: [0,5],
                                        fontSize:8,
                                    },
                                    {   
                                        colSpan:4,
                                        border: [false, false, true, false],
                                        text: $('#' + id_nombre_presupuesto).val().toUpperCase(),
                                        bold: true,
                                        margin: [0,5],
                                        fontSize: 8,
                                        alignment: 'center',
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
                                        margin: [0,1],
                                        fontSize: 8,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2, rowSpan:2,
                                        border: [false, false, true, false],
                                        text: clave_presu,
                                        bold: true,
                                        margin: [0,1],
                                        fontSize: 8,
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
                                        margin: [0,1],
                                        fontSize: 8,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2,
                                        border: [false, false, true, false],
                                        text: obra_selec.cliente,
                                        bold: true,
                                        margin: [0,1],
                                        fontSize: 8,
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
                                        margin: [0,1],
                                        fontSize: 8,
                                        alignment: 'right',
                                    },
                                    '',
                                    {   colSpan:2,
                                        border: [false, false, true, false],
                                        text:  atn_str, // falta la programación del ATN
                                        bold: true,
                                        margin: [0,1],
                                        fontSize: 8,
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
                                        fontSize: 8,
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
                                        margin: [0,2],
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
                                        margin: [0,1],
                                        fillColor: '#dddddd',
                                        alignment: 'center'
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").val().toUpperCase(),
                                        bold: true,
                                        margin: [0,1],
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
                                        text:"$ "+ formatMoney($('#' + id_precio_presupuesto).val()),
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize:10,
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
                                        margin: [0,1],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    {   colSpan:5,
                                        border: [true, true, true, true],
                                        text: 'REQUERIMIENTOS ANTES DE INICIAR',
                                        bold: true,
                                        margin: [0,1],
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
                                        margin: [0,1],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: 'EXCLUSIONES',
                                        bold: true,
                                        margin: [0,1],
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
                                        //pageBreak: "after",
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
                                        margin: [0,1],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    {  
                                        colSpan:5,
                                        border: [true, true, true, true],
                                        text: numeroALetras(($('#' + id_precio_presupuesto).val()*1.16).toFixed(2)),
                                        bold: true,
                                        margin: [0,1],
                                        fillColor: '#dddddd',
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                ],
                                
                                [
                                    {  
                                        colSpan:3,
                                        border: [false, false, true, false],
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
                                        text: "$ "+formatMoney($('#' + id_precio_presupuesto).val()),
                                        bold: true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }

                                ],
                                [
                                    {  
                                        colSpan:3,
                                        border: [false, false, false, false],
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
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: "$ " + formatMoney($('#' + id_precio_presupuesto).val()*0.16),
                                        bold:true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }
                                ],

                                [
                                    {  
                                        colSpan:3,
                                        border: [false, false, true, false],
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
                                        bold:true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        border: [true, true, true, true],
                                        text: "$ " + formatMoney($('#' + id_precio_presupuesto).val()*1.16),
                                        bold: true,
                                        margin: [0,0],
                                        alignment: 'right',
                                        fontSize: 8,
                                    }

                                ],
                                [
                                    {  
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: '',
                                        margin: [0,15],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '',
                                    {  
                                        colSpan:4,
                                        border: [false, false, false, false],
                                        text: 'Condiciones Comerciales: ',
                                        bold:true,
                                        margin: [0,15],
                                        alignment: 'left',
                                        fontSize: 10,
                                    },
                                    '','','',

                                ],

                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: anticipo_str,
                                        margin: [0,3],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],

                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: 'Precios incluyen IVA' + '\n' + 'Precios expresados en moneda nacional. ',
                                        margin: [0,10],
                                        bold:true,
                                        alignment: 'left',
                                        fontSize: 8,
                                        color :"#6FAFB4"
                                    },
                                    '',

                                    '','','',

                                ],

                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: 'TIEMPO DE ENTREGA',
                                        bold: true,
                                        margin: [0,7],
                                        alignment: 'left',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],
                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: 'El tiempo requerido para la elaboración de los anteriores trabajos es como se indica más adelante, a partir de la fecha de recepción del anticipo y del 100% de los requerimientos solicitados.',
                                        margin: [0,3],
                                        alignment: 'left',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],
                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: tiempoEntrega + "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n",
                                        margin: [0,10],
                                        alignment: 'left',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],
                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: 'Arq. Miguel E. Bravo Dufau',
                                        margin: [0,5],
                                        alignment: 'center',
                                        fontSize: 10,
                                    },
                                    '','','','','',

                                ],

                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: '______________________________________',
                                        margin: [0,10],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],

                                [
                                    {  
                                        colSpan:3,
                                        border: [false, false, false, false],
                                        text: tituloB,
                                        bold: true,
                                        margin: [0,3],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },
                                    '','',
                                    {  
                                        colSpan:3,
                                        border: [false, false, false, false],
                                        text: tituloF,
                                        bold: true,
                                        margin: [0,3],
                                        alignment: 'center',
                                        fontSize: 8,
                                    },'','',

                                ],

                                [
                                    {  
                                        colSpan:1,
                                        border: [false, false, false, false],
                                        text: terminosBancarios,
                                        margin: [0,2],
                                        alignment: 'left',
                                        fontSize: 7,
                                    },
                                    {  
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: bancarios,
                                        margin: [0,2],
                                        alignment: 'left',
                                        fontSize: 7,
                                    },
                                    '',
                                    {  
                                        colSpan:1,
                                        border: [false, false, false, false],
                                        text: terminosFiscales,
                                        margin: [0,2],
                                        alignment: 'left',
                                        fontSize: 7,
                                    },
                                    {  
                                        colSpan:2,
                                        border: [false, false, false, false],
                                        text: fiscales,
                                        margin: [0,2],
                                        alignment: 'left',
                                        fontSize: 7,
                                    },
                                    '',

                                ],

                                [
                                    {  
                                        colSpan:6,
                                        border: [false, false, false, false],
                                        text: "Notas:" + "\n" +"\n" + "-Todas las cantidades o volumetrias fueron tomadas de acuerdo al proyecto enviado por el cliente",
                                        margin: [0,10],
                                        alignment: 'left',
                                        fontSize: 8,
                                    },
                                    '','','','','',

                                ],
                            ],
                        }
                    }
                ],
                              
            };

            const pdfDocGenerator = pdfMake.createPdf(pdfPresupuesto)

            pdfDocGenerator.open()
            
            pdfDocGenerator.getBase64((data) => {
                alert(data);
            });
        });            
    });
});
