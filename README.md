# Head
Depto. de Innovacion y Optimizacion

 actualizados/nuevos(22/4/19):
 - app_rrhh_horas_extra -> cree div datatable para los hidden, en guardar no sé por qué no guarda impuestos de los primeros en trabajadores pero sí en nomina, le moví para que estén exactamente igual
 - app_proy_registros -> nuevos registros usando el nuevo uml

 actualizados/nuevos(16/4/19):
 - app_cierre_maestro -> cambié el cierre a las 6 porque diario hay miles de cierres maestros y pos no

 actualizados/nuevos(11/4/19):
 - app_admon_pago_kaizen -> nueva app + pad
   
 actualizados/nuevos(2/4/19):
 - app_perfil -> chance reg 0?
 - app_distribucion_supervisores -> pda, meter datos y revisar
 - app_rrhh_editar_trabajadores -> como en biblioteca, necesita modal
 
 actualizados/nuevos(25/3/19):
 - app_gestionar_supervisores -> empty con jquery
   
 actualizados/nuevos(12/3/19):
 - app_prod_gestionar_pptos
 
 actualizados/nuevos(11/3/19):
 - app_admin_registro
 - app_areas
  
 actualizados/nuevos(26/2/19):
 - app_atributo
 - app_reporte_obras
   
 Por probar:
 - app_pagos_nomina
 - app_rrhh_pagos_diversos -> terminar: sumar, distribuir, y KAIZEN, ya no al kaizen si atencion a clientes, distribuir horas si semana quebrada, que carguen los ddls, si funciona con multiples diversos
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - loadScoreKaizen (en app_funciones)
 - app_gestionar_supervisores
 - app_atributo
 
 Por definir:
 - Centro de costos 
    - Claves
 - eliminar en bibliotecas score

 Errores:
 - Gantt fecha inicial
 - Gantt no saca inicio (sem) pero sí final (sem)
 - registros con horas 0
 - falta empty a muchos ddls antes de cargarlos

ARTURO:
 - en app_pryo_cuant_kaizen cambiar el placeholder de descripcion
 - clase rojo y gris en desplegar kaizen
 - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - Titulos de obra en catalogo de proceso en negritas y mas grandes
 - Poner los labels de anterior y nuevo separados en proy_cuant_kaizen
 - En producción revisar qué cosas pueden ver/usar supervisores. Bloquear tabs y cargar ddls sólo con las asignadas
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Ddl para navegar entre pestañas de areas
 - Poner filtros para pestañas en prod (gerente/supervisor)
 - HTMLs de:
    - reporte_obras
    - app_admin_registro
    - app_atributo
    - app_areas
    - app_prod_gestionar_pptos -> Que solo salga el tab si eres gerente!
    - app_distribucion_supervisores (los pagos de la pagadora)
    - app_gestionar_supervisores (las obras asignadas)
    - app_rrhh_editar_trabajadores
    - app_admon_pago_kaizen
    
DIEGO:
 - Si div ya existe, actualiza el valor. -> eal hacer existe = true guarda el uid y haces un query simple
 - Meter proveedores a bd (por excel e individual)
 - manejo de proveedores en odec_compras, al cambiar sustituir clave por nombre, o meter por nombre? pero al salir alert si no existe y borrarlo? discutir con Taba
 - Al dar alta odec, borrar todos los campos menos obra
 - Desplegar OdeCs para que Taba pueda saber si sí entraron
 - desplegar kaizen lo del cambio de obra
 - app_prod_entrada_estimacion
 - app_presupuesto -> cargar datos a kaizen/proy/ppto (subp, proc y obra) y manejo correcto de ddls y hiddens (empty y hide proc y clase de ppto cuando cambio de obra). Simplificación de formato si clase == prod?
 - Todo lo de Gantt
 - Desplegar CC
 - Botón respaldo (aunque baje sólo el json)
 - Manual de usuario
 - diversos en bd, alta, editar, etc, hacer todo en una tabla
 - app_cuenta_cc 
    - crear los fields necesarios para el UML
    - corregir un error
    - programar el boton
 - Reportes:
    - app_reporte_supervisores
       - filtros
          - obra
          - proceso
          - periodo de tiempo
       - datos
          - OdeC
          - Asistencias/faltas
          - $$
          - completez
          - fechas?
    - app_reporte_rrhh
       - filtros
          - obra
          - proceso
          - trabajador
          - periodo de tiempo
       - datos
          - diversos (ddcheckbox)
          - horas trabajadas
          - horas extra
          - falta
 
TO DO:
 - Produccion
   - Quitar datos_kaizen
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
   - Gantt
     - Hitos
     - Fechas raras :S
     - Sem inic no sale
     - editable
 - Proyectos
   - Revisar reporte_obras
   - Si clase = produccion -> hacer mas simple el formato de ppto
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - RRHH
   - editar_trabajadores (como en bibliotecas en proy)
   - supervisores
 - Pagina Web
   - arreglar las apps de permisos de usuario y de inicio de sesion
   - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
   - Botón respaldo (aunque baje sólo el json)
   - Poner botón regresar a index o links para navegar entre páginas
   - Manual de usuario, por sección y global.

 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos

 - SCORE:
   - actualizar regs > 15 (darle un botonazo)
   - Reporte semanal
      - Tabla de colabs contra procesos con totales
   - Eliminar en bibliotecas
      - Colabs? borrarlos de auth pero no de database, no? meterle atributo "eliminado"? -> No, sólo en auth. lo demás es con permisos.
      - Obras Poner activo/No activo?
      - pptos sí
      - Despachos no, o sí?
      - atn sí
      - req/exc sí
      - tipos/generos sí
   - Dashgrid
   - Dashcards nuevo diseño
   - Amarillo y rojo en dashcards y graphs para cuando esten al 90% o se hayan pasado de las horas programadas
   - Update uml
   - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
   - Los editar en bibliotecas ya no solo afectan la bd de proyectos. Checar que si se cambia el nombre de cliente, por ejemplo, se cambie también en obra magico y en todos los lugares que sean correspondientes

dudas:
Obras divididas ya existentes
   - CPBR -> Son el mismo
   - zentral -> Partirla en t1 y t2, todo lo que ya va a torre 1
   - via -> Partirla en comercios y oficinas, todo lo ya trabajado va en com
Ya terminadas? 
   - Amira -> cerrada
   - Blume -> cerrada
   - Box Metepec -> cerrada
   - LA CITE (td y te) -> clausurada
   - Periferico 2840 -> = pc00
Cambiar UNICO por EJE 8

OBRAS:
 - Kaizen:
   - FOR US -> :S
   - MARINA 196-48
   - UNICO 149
   - ACANTO
   - AVERANDA T-A
   - ENTTORNO T-F
   - NEO
   - VIA 515 oficinas
   - ZENTRAL T2
 - Terminator:
   - Mayo:
      - ICON
      - EPIC
      - WEST PARK
      - COSMOCRAT
      - AVERANDA T-B
      - ENTTORNO T-E
      - ZENTRAL T1
   - Junio:
      - SAN ANTONIO 88 / 95
      - VIA 515 COM
   - Agosto:
      - MINAS
      - LAS VENTANAS
      - CENTRAL PARK T-A/T-B
