//https://github.com/jsGanttImproved/jsgantt-improved/blob/develop/Documentation.md

//<link href="jsgantt.css" rel="stylesheet" type="text/css"/>
//<script src="jsgantt.js" type="text/javascript"></script>

//<div style="position:relative" class="gantt" id="kaizenGlobalDiv"></div>

//Por revisar:
// formato fechas pStart y pEnd
var rama_bd_obras_magico = "obras";
var id_gantt_div_global = "kaizenGlobalDiv"
var css = ["gtaskblue", "gtaskred", "gtaskgreen", "gtaskyellow", "gtaskpurple", "gtaskpink"];

//Pasar a tab
//var id_tab_kaizen_global = "kaizenGlobalTab";
//$('#' + id_tab_kaizen_global).click(function(){
$(document).ready(function(){
	var g = new JSGantt.GanttChart(document.getElementById(id_gantt_div_global), 'day');
    g.setOptions({
        vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
        vQuarterColWidth: 36,
        vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
        vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to dates in the "Major" header of the "Day" view
        vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
        vLang: 'en',
        vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
        vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily
        vAdditionalHeaders: { // Add data columns to your table
            category: {
              title: 'Category'
            },
            sector: {
              title: 'Sector'
            }
          },
        vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
        vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers,
    });
	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        var i = 1;
		snapshot.forEach(function(obraSnap){
			var obra = obraSnap.val();
			g.AddTaskItemObject({
				pID: i,
				pName: obra.nombre,
				pStart: obra.fechas.fecha_inicio_teorica,
				pEnd: obra.fechas.fecha_final_teorica,
				pPlanStart: "",//fecha_inicio_real? o al reves?
				pPlanEnd: "",//fecha_final_real? o al reves?
				pClass: "ggroupblack",
				pLink: "",
				pMile: 0,
				pRes: "",//obra.supervisor,
				pComp: "",//obra.kaizen.AVANCE.REAL,
				pGroup: 1, //0-> no grupo, 1-> grupo
				pParent: 0, //id parent. 0-> este es el parent
				pOpen: 0,
				pDepend: "", //Para flechitas si hay dependencia entre procesos
				pCaption: "",
				//AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
				/*pCost: costo_obra,
				SCORE: obra.kaizen.PROYECTOS.PPTO,
				OF: costo_obra*0.2,
				PROFIT: obra.kaizen.PROFIT.PROG,*/
            });
            console.log("Obra: " + obra.nombre + " id: " + i);
			var j = 0;
            var id_obra = i;
			obraSnap.child("procesos").forEach(function(childSnapshot){
				i++;
                var proc = childSnapshot.val();
                console.log(proc);
				//var costo_proc = parseFloat(proc.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(proc.ADMINISTRACION.ANTICIPOS.PPTO);
				g.AddTaskItemObject({
					pID: i,
					pName: proc.clave,
					pStart: proc.fechas.fecha_inicio,
					pEnd: proc.fechas.fecha_final,
					pPlanStart: "",//fecha_inicio_real? o al reves?
					pPlanEnd: "",//fecha_final_real? o al reves?
					pClass: css[j%6],
					pLink: "",
					pMile: 0,
					pRes: "",//obra.supervisor,
					pComp: "",//proc.kaizen.AVANCE.REAL,
					pGroup: 1, //0-> no grupo, 1-> grupo
					pParent: id_obra, //id parent. 0-> este es el parent
					pOpen: 0,
					pDepend: "", //Para flechitas si hay dependencia entre procesos
					pCaption: "",
					//AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
					pCost: "",//costo_proc,
					SCORE: proc.kaizen.PROYECTOS.PPTO,
					OF: "",//costo_proc*0.2,
					PROFIT: proc.kaizen.PROFIT.PROG,
                });
                console.log("proc: " + proc.clave + " id: " + i);
                if(proc.subprocesos != ""){
                    var k = 0;
                    var id_proc = i;
                    childSnapshot.child("subprocesos").forEach(function(subProcSnap){
                        i++;
                        var subproc = subProcSnap.val();
                        //var costo_subproc = parseFloat(subproc.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(subproc.ADMINISTRACION.ANTICIPOS.PPTO);
                        g.AddTaskItemObject({
                            pID: i,
                            pName: subproc.clave,
                            pStart: subproc.fechas.fecha_inicio,
                            pEnd: subproc.fechas.fecha_final,
                            pPlanStart: "",//fecha_inicio_real? o al reves?
                            pPlanEnd: "",//fecha_final_real? o al reves?
                            pClass: css[k%6],
                            pLink: "",
                            pMile: 0,
                            pRes: "",//obra.supervisor,
                            pComp: "",//subproc.kaizen.AVANCE.REAL,
                            pGroup: 1, //0-> no grupo, 1-> grupo
                            pParent: id_proc, //id parent. 0-> este es el parent
                            pOpen: 0,
                            pDepend: "", //Para flechitas si hay dependencia entre procesos
                            pCaption: "",
                            //AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
                            pCost: "",//costo_subproc,
                            SCORE: subproc.kaizen.PROYECTOS.PPTO,
                            OF: "",//costo_subproc*0.2,
                            PROFIT: subproc.kaizen.PROFIT.PROG,
                        });
                        k++;
                    });
                }
                j++;

			});
			i++;
        });
        g.Draw();
	})
	//g.setShowRes(0);
	//g.setShowDur(0);
	//g.setShowComp(0);
	//g.setShowStartDate(0);
	//g.setShowEndDate(0);
	//g.setAdditionalHeaders({ SCORE: { title: 'SCORE' } });//checar si sintaxis sí es así
	//g.setAdditionalHeaders({ OF: { title: 'OF' } });//checar si sintaxis sí es así
	//g.setAdditionalHeaders({ PROFIT: { title: 'PROFIT' } });//checar si sintaxis sí es así
});
