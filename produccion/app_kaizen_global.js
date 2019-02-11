//https://github.com/jsGanttImproved/jsgantt-improved/blob/develop/Documentation.md

//<link href="jsgantt.css" rel="stylesheet" type="text/css"/>
//<script src="jsgantt.js" type="text/javascript"></script>

//<div style="position:relative" class="gantt" id="kaizenGlobalDiv"></div>

//Por revisar:
// formato fechas pStart y pEnd
var id_gantt_div_global = "kaizenGlobalDiv";
var id_total_oficina_global = "totalOfGlobal";
var id_total_score_global = "totalScoreGlobal";
var id_total_profit_global = "totalProfitGlobal";
var id_total_total_global = "totalTotalGlobal";

var rama_bd_obras_magico = "obras";

var css = ["gtaskblue", "gtaskred", "gtaskgreen", "gtaskyellow", "gtaskpurple", "gtaskpink"];

//Pasar a tab
//var id_tab_kaizen_global = "kaizenGlobalTab";
//$('#' + id_tab_kaizen_global).click(function(){
$(document).ready(function(){
	$('#' + id_total_oficina_global).val(0);
	$('#' + id_total_score_global).val(0);
	$('#' + id_total_profit_global).val(0);
	$('#' + id_total_total_global).val(0);
	var g = new JSGantt.GanttChart(document.getElementById(id_gantt_div_global), 'month');
	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
		var i = 0;
		snapshot.forEach(function(obraSnap){
			var obra = obraSnap.val();
			var costo_obra = parseFloat(obra.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(obra.ADMINISTRACION.ANTICIPOS.PPTO);
			g.AddTaskItemObject({
				pID: i,
				pName: obra.nombre,
				pStart: obra.fechas.fecha_inicio_teorica,
				pEnd: obras.fechas.fecha_final_teorica,
				pPlanStart: "",//fecha_inicio_real? o al reves?
				pPlanEnd: "",//fecha_final_real? o al reves?
				pClass: "ggroupblack",
				pLink: "",
				pMile: 0,
				pRes: "",//obra.supervisor,
				pComp: obra.kaizen.AVANCE.REAL,
				pGroup: 1, //0-> no grupo, 1-> grupo
				pParent: 0, //id parent. 0-> este es el parent
				pOpen: 0,
				pDepend: "", //Para flechitas si hay dependencia entre procesos
				pCaption: "",
				//AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
				pCost: costo_obra,
				SCORE: obra.kaizen.PROYECTOS.PPTO,
				OF: costo_obra*0.2,
				PROFIT: obra.kaizen.PROFIT.PROG,
			});
			$('#' + id_total_oficina_global).val(0) = $('#' + id_total_oficina_global).val() + obra.kaizen.PROYECTOS.PPTO;
			$('#' + id_total_score_global).val(0) = $('#' + id_total_score_global).val() + costo_obra*0.2;
			$('#' + id_total_profit_global).val(0) = $('#' + id_total_profit_global).val() + obra.kaizen.PROFIT.PROG;
			$('#' + id_total_total_global).val(0) = $('#' + id_total_total_global).val() + obra.kaizen.PROYECTOS.PPTO + costo_obra*0.2 + obra.kaizen.PROFIT.PROG;
			var j = 0;
			obraSnap.child("procesos").forEach(function(childSnapshot){
				var id_obra = i;
				i++;
				var proc = childSnapshot.val();
				var costo_proc = parseFloat(proc.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(proc.ADMINISTRACION.ANTICIPOS.PPTO);
				g.AddTaskItemObject({
					pID: i,
					pName: proc.nombre,
					pStart: proc.fechas.fecha_inicio,
					pEnd: proc.fechas.fecha_final,
					pPlanStart: "",//fecha_inicio_real? o al reves?
					pPlanEnd: "",//fecha_final_real? o al reves?
					pClass: css[j%6],
					pLink: "",
					pMile: 0,
					pRes: "",//obra.supervisor,
					pComp: proc.kaizen.AVANCE.REAL,
					pGroup: 1, //0-> no grupo, 1-> grupo
					pParent: id_obra, //id parent. 0-> este es el parent
					pOpen: 0,
					pDepend: "", //Para flechitas si hay dependencia entre procesos
					pCaption: "",
					//AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
					pCost: costo_proc,
					SCORE: proc.kaizen.PROYECTOS.PPTO,
					OF: costo_proc*0.2,
					PROFIT: proc.kaizen.PROFIT.PROG,
				});
				if(proc.subprocesos != ""){
					var k = 0;
					childSnapshot.child("subprocesos").forEach(function(subProcSnap){
						var id_proc = i;
						i++;
						var subproc = subProcSnap.val();
						var costo_subproc = parseFloat(subproc.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(subproc.ADMINISTRACION.ANTICIPOS.PPTO);
						g.AddTaskItemObject({
							pID: i,
							pName: subproc.nombre,
							pStart: subproc.fechas.fecha_inicio,
							pEnd: subproc.fechas.fecha_final,
							pPlanStart: "",//fecha_inicio_real? o al reves?
							pPlanEnd: "",//fecha_final_real? o al reves?
							pClass: css[k%6],
							pLink: "",
							pMile: 0,
							pRes: "",//obra.supervisor,
							pComp: subproc.kaizen.AVANCE.REAL,
							pGroup: 1, //0-> no grupo, 1-> grupo
							pParent: id_proc, //id parent. 0-> este es el parent
							pOpen: 0,
							pDepend: "", //Para flechitas si hay dependencia entre procesos
							pCaption: "",
							//AQUI Costo, score, of y profit con valores prog.... no? Cómo lo hacemos?
							pCost: costo_subproc,
							SCORE: subproc.kaizen.PROYECTOS.PPTO,
							OF: costo_subproc*0.2,
							PROFIT: subproc.kaizen.PROFIT.PROG,
						});
						k++;
					});
				}
				j++;
			});
			i++;
		});
	})
	g.setShowRes(0);
	g.setShowDur(0);
	g.setShowComp(0);
	g.setShowStartDate(0);
	g.setShowEndDate(0);
	g.setAdditionalHeaders({ SCORE: { title: 'SCORE' } });//checar si sintaxis sí es así
	g.setAdditionalHeaders({ OF: { title: 'OF' } });//checar si sintaxis sí es así
	g.setAdditionalHeaders({ PROFIT: { title: 'PROFIT' } });//checar si sintaxis sí es así

	g.draw();
});
