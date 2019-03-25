# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
ESTA SEMANA:
 - Kaizen bonito (ideal: jueves max: viernes)
 
 actualizados/nuevos(25/3/19):
 - app_funciones -> pista de auditoria
 - app_procesos -> sin kaiz para obras_prod
 - app_gestionar_supervisores -> empty con jquery
 - app_asistencia -> asignación de obras, no desplegar un trabajador que ya está en la lista, update faltas
 - app_rrhh_importar_trabajadores -> hardcode "obra_asignada", en la columna de excel tiene que decir "0", descomentar firebase, lo hace con un for ahora para no repetir/borrar
 
 actualizados/nuevos(14/3/19):
 - app_desplegar_kaizen -> profit neto, gris condicional, orden alfabetico y error
 - app_distribucion_supervisores
 
 actualizados/nuevos(13/3/19):
 - app_obra -> ddl con sólo las obras de mágico que no están en proy, pero puedes dar de alta
 
 actualizados/nuevos(12/3/19):
 - app_prod_gestionar_pptos
 
 actualizados/nuevos(11/3/19):
 - app_admin_registro
 - app_areas
 - app_actualizar_regs -> esp == "NA"
  
 actualizados/nuevos(26/2/19):
 - app_atributo
   
 Por probar:
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
 - Graphs central park misc tiene horas en ihs pero no hay registros -> seguro por NAs
 - registros con horas 0
 - falta empty a muchos ddls antes de cargarlos

ARTURO:
 - Asistencia
 - Poner los labels de anterior y nuevo separados en proy_cuant_kaizen
 - cambiar avance "prog" por "pag" en desplegar kaizen
 - Clases en css para avance en rojo y prec/cuant en gris
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Ddl para navegar entre pestañas de areas
 - Poner filtros para pestañas en prod (gerente/supervisor)
 - Kaizen bonito
 - HTMLs de:
    - reporte_obras
    - inve$stime
    - app_atributo
    - app_admin_registro
    - app_areas
    - app_prod_gestionar_pptos -> Que solo salga el tab si eres gerente!
    - app_distribucion_trabajadores
 - Actualizar:
    - app_rrhh_importar_trabajadores
    - app_asistencia
    - app_actualizar_regs
    - app_desplegar_kaizen
 
DIEGO:
 - si copeo/odec = -1 jala el valor de prec/cuant
 - Todo lo de Gantt
 - Desplegar CC
 - Botón respaldo (aunque baje sólo el json)
 - Manual de usuario
 - Agregar terminado a obra_magico
 - app_distribucion_supervisores
 - app_rrhh_pago_nomina
 - app_rrhh_horas_extra
 - app_rrhh_pagos_diversos
 - diversos en bd, alta, editar, etc
 - reporte rrhh
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
 - app_cuenta_cc 
    - crear los fields necesarios para el UML
    - corregir un error
    - programar el boton
 
TO DO:
 - Produccion
   - Quitar datos_kaizen
   - Desplegar Kaizen
     - Estilo:
       - cambiar avance "prog" por "pag"
       - avance.pag > avance.real = pag en rojo 
       - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
     - Funcionalidad:
       - si copeo/odec = -1 jala el valor de prec/cuant
   - Gantt
     - Hitos
     - Fechas raras :S
     - Sem inic no sale
     - editable
   - colvis en desplegar_procesos
 - Proyectos
   - Revisar reporte_obras
   - Si clase = produccion -> hacer mas simple el formato de ppto
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - RRHH
   - alta_trabajadores
     - Conseguir datos
     - Subirlos con el formato de hector
     - Tranformar el json al formato que nosotros queremos
     - Subir el json
   - asistencia
     - ddl obra. Carga trabajadores asignados a esa obra (existe obra "otros"/"misc" que se tiene que ir a cc)
     - Row que permite hacer más trabajadores
     - cada trabajador tiene ddl por proceso (+ falta, + ppr) por dia
     - field para diversos
     - boton actualizar sube lo que hay a la bd
     - boton guardar actualiza todo, lo cierra, y genera reporte faltas
   - pago_pagadora
   - horas_extra
   - pagos_adicionales
   - alta_trabajador (individual)
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
   - modal cambio contraseña
   - Checar que no exista otra obra con esa clave
   - Los editar en bibliotecas ya no solo afectan la bd de proyectos. Checar que si se cambia el nombre de cliente, por ejemplo, se cambie también en obra magico y en todos los lugares que sean correspondientes

  
- EMAIL
  - Todos pueden subir su foto! (click en seleccionar, seleccionas archivo, y luego click en SUBIR imagen)
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  - Si salen igual, desde el cel
  - A supervisores: ya hay sistema y así funciona
  
