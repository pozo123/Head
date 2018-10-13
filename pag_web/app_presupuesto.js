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
            var consecutivo = 1;
            var clave_presu = codigo_obra + "/" + codigo_cliente + "/" + codigo_tipo_proyecto;
            firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos").orderByChild("nombre").equalTo($('#' + id_nombre_presupuesto).val()).once('child_added').then(function(snapshot){
                var p = snapshot.val();
                consecutivo = p.consecutivos.numChildren();
                if(consecutivo > 1){
                    var cons = {
                        precio: p.cash_presupuestado,
                        pdf: "vacio",//dice vacio para no dar "" y que luego truene
                        checkin: p.timestamps.startedAt,
                }
            });
            consecutivo_str = ("00" + consecutivo).slice(-3);
            clave_presu = clave_presu + consecutivo_str;
            //_____
            
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
                pagos: "",

            }
            firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).set(presupuesto);
            //firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val() + "/consecutivo/1").set(presupuesto);
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
/*                                         image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABfwAAAA9CAYAAAD4SKg0AAAAAXNSR0IArs4c6QAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAACexJREFUeAHt3G1u3DYUBVC7SdoU3UDX1YV2Xd1A0PTLrq7sK9DKOCXQcYdADwGaGuqNhj76d0Xo/u5yu78wfWnuQpkpAgQIECBAgAABAgQIECBAgAABAgQIECBA4IoCjxeu9cXc+1NRQ/1/Gk9f85EAAQIECBAgQIAAAQIECBAgQIAAAQIECBB4A4EG++exP9X5uwb7OdHjjF/rvUjr+9lIgAABAgQIECBAgAABAgQIECBAgAABAgQI/HuBI8TfLpXjr/X82l7f0H4cc/xN+g8///I5lRoBAgQIECBAgAABAgQIECBAgAABAgQIECBwe4FPP/34cVvFw3Pvg4As7HF8pU+C/iPs347fpUIjQIAAAQIECBAgQIAAAQIECBAgQIAAAQIElhEYs/sE/2n7Dv9z4L/v7N9O5gvjuXxBI0CAAAECBAgQIECAAAECBAgQIECAAAECBG4rcM7uE/ofgX939nd3f8P+85du+y/4dQIECBAgQIAAAQIECBAgQIAAAQIECBAgQOCc3SfsT77/Yhd/g//s8k/o/yEFGgECBAgQIECAAAECBAgQIECAAAECBAgQILCMQLL7hPx9j/8e9md1CffTxrC/gf/5KcFTpb8ECBAgQIAAAQIECBAgQIAAAQIECBAgQIDArQSS3WfTfl/R33z/CPyzsE428M8XNAIECBAgQIAAAQIECBAgQIAAAQIECBAgQGAdgWT3Dfyb6++r6w7/LjUn+1TADv+qGAkQIECAAAECBAgQIECAAAECBAgQIECAwBoCye6b4yfTP1oD/z4F6Njio9ABAQIECBAgQIAAAQIECBAgQIAAAQIECBAgcHOB5vfN8zu+eKVPV9mTGTUCBAgQIECAAAECBAgQIECAAAECBAgQIEBgHYFXM/zu8O9Sx0KBf1WMBAgQIECAAAECBAgQIECAAAECBAgQIEBgDYFXc/xz4D8uV+A/ajgmQIAAAQIECBAgQIAAAQIECBAgQIAAAQK3F3g1u/9a4H/7ZVsBAQIECBAgQIAAAQIECBAgQIAAAQIECBAgMCUg8J9iUkSAAAECBAgQIECAAAECBAgQIECAAAECBNYWEPivfX+sjgABAgQIECBAgAABAgQIECBAgAABAgQITAkI/KeYFBEgQIAAAQIECBAgQIAAAQIECBAgQIAAgbUFBP5r3x+rI0CAAAECBAgQIECAAAECBAgQIECAAAECUwIC/ykmRQQIECBAgAABAgQIECBAgAABAgQIECBAYG0Bgf/a98fqCBAgQIAAAQIECBAgQIAAAQIECBAgQIDAlIDAf4pJEQECBAgQIECAAAECBAgQIECAAAECBAgQWFtA4L/2/bE6AgQIECBAgAABAgQIECBAgAABAgQIECAwJSDwn2JSRIAAAQIECBAgQIAAAQIECBAgQIAAAQIE1hYQ+K99f6yOAAECBAgQIECAAAECBAgQIECAAAECBAhMCQj8p5gUESBAgAABAgQIECBAgAABAgQIECBAgACBtQUE/mvfH6sjQIAAAQIECBAgQIAAAQIECBAgQIAAAQJTAgL/KSZFBAgQIECAAAECBAgQIECAAAECBAgQIEBgbQGB/9r3x+oIECBAgAABAgQIECBAgAABAgQIECBAgMCUgMB/ikkRAQIECBAgQIAAAQIECBAgQIAAAQIECBBYW0Dgv/b9sToCBAgQIECAAAECBAgQIECAAAECBAgQIDAlIPCfYlJEgAABAgQIECBAgAABAgQIECBAgAABAgTWFhD4r31/rI4AAQIECBAgQIAAAQIECBAgQIAAAQIECEwJCPynmBQRIECAAAECBAgQIECAAAECBAgQIECAAIG1BQT+a98fqyNAgAABAgQIECBAgAABAgQIECBAgAABAlMCAv8pJkUECBAgQIAAAQIECBAgQIAAAQIECBAgQGBtAYH/2vfH6ggQIECAAAECBAgQIECAAAECBAgQIECAwJSAwH+KSREBAgQIECBAgAABAgQIECBAgAABAgQIEFhbQOC/9v2xOgIECBAgQIAAAQIECBAgQIAAAQIECBAgMCUg8J9iUkSAAAECBAgQIECAAAECBAgQIECAAAECBNYWEPivfX+sjgABAgQIECBAgAABAgQIECBAgAABAgQITAkI/KeYFBEgQIAAAQIECBAgQIAAAQIECBAgQIAAgbUFBP5r3x+rI0CAAAECBAgQIECAAAECBAgQIECAAAECUwIC/ykmRQQIECBAgAABAgQIECBAgAABAgQIECBAYG0Bgf/a98fqCBAgQIAAAQIECBAgQIAAAQIECBAgQIDAlIDAf4pJEQECBAgQIECAAAECBAgQIECAAAECBAgQWFvgUuD/+Lzkjmv/B1ZHgAABAgQIECBAgAABAgQIECBAgAABAgT+PwLN7jse//k58G9Bxh4fxQ4IECBAgAABAgQIECBAgAABAgQIECBAgACBmwqM+f2LHH8M/HviYVtq+01X7ccJECBAgAABAgQIECBAgAABAgQIECBAgACBFwLN7zOmNdu/u98+pCf4f7/1D8/9u238uPXvn/u325ie8++2nvrxYcH2USNAgAABAgQIECBAgAABAgQIECBAgAABAgSuINBQ/6/tWn9s/ffn/us2pn/e+m9bz7n0P7f+kJC/LU8BepGMuVCKUpyHAmmZb+Dfuf2EPwQIECBAgAABAgQIECBAgAABAgQIECBAgMBVBJrXjzl9g/3MjVn+scP/HPjnRPp4kezk78XzAEDgvyFoBAgQIECAAAECBAgQIECAAAECBAgQIEDgjQSaySerT+9O/jH0b56fcW8N/DvRnf0J+RPu97U9fQDQsL/zT1fxlwABAgQIECBAgAABAgQIECBAgAABAgQIELimQHfxN5/vG3ky9kFAatL2jL+BfyZyIq/pyZgvtPXzGPanzit9KmQkQIAAAQIECBAgQIAAAQIECBAgQIAAAQLXE+ju/eTz6Q34x9A/86nLuLcE/t3dn4njxH726VwuJOx/BjEQIECAAAECBAgQIECAAAECBAgQIECAAIH/QOC10L/hf8aG/nvtuMM/6+sFUtjjfCGfu6u/4zalESBAgAABAgQIECBAgAABAgQIECBAgAABAm8g0Iy+Y7L65vVj0H/89Bj450tpKezrejKX47yzfwz6e36b1ggQIECAAAECBAgQIECAAAECBAgQIECAAIErCzSzHwP/S8etO4L9rKMh/jg25B/nrrxmlyNAgAABAgQIECBAgAABAgQIECBAgAABAgReEWig37C/Y8rHc0fI3+s02D9/Ps/3vJEAAQIECBAgQIAAAQIECBAgQIAAAQIECBB4e4EX4f7wc53/IvAfavZDQf9ZxGcCBAgQIECAAAECBAgQIECAAAECBAgQIHA7gSPgPy/hb8j1xiyxA3CsAAAAAElFTkSuQmCC',
                                        height: 15,
                                        width: 300, */
                                        alignment: 'center',
                                    },
                                    '',
                                    '',
                                    '',
                                    '',
                                    {
                                        rowSpan:2,
                                        border: [false, true, true, true],
                                        image: 'data:image/png;base64,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',
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
