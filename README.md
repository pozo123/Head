# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Orden Implementacion:
 - app_colaboradores_produccion: CHECK
 - app_cuenta_cc: 
 - app_obras_prod: CHECK
 - app_procesos: CHECK
 - app_desplegar_procesos: CHECK
 - app_kaizen_global: CHECK
 - app_datos_kaizen: CHECK
 - apps que alimentan kaizen:
    - cuant: CHECK
    - odec: CHECK
    - compras_pag: CHECK
    - app_asistencia: 
 
ESTA SEMANA:
 - Kaizen bonito (ideal: jueves max: viernes)
 
 actualizados/nuevos(21/3/19):
 - app_asistencia -> arreglé lo de  nuevo
 
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

 actualizados/nuevos (19/2/19)
 - app_gestionar_supervisores
   
 Por probar:
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - loadScoreKaizen (en app_funciones)
 
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
 - Asistencia
 - si copeo/odec = -1 jala el valor de prec/cuant
 - Todo lo de Gantt
 - Desplegar CC
 - Botón respaldo (aunque baje sólo el json)
 - Manual de usuario
 - Agregar terminado a obra_magico
 - app_distribucion_supervisores
 - app_rrhh_pago_nomina
 - app_rrhh_horas_extra
 - app_gestionar_supervisores que no jale nombre de prod
 - en importar trabajadores hacerlo con un for en vez de updatear todo de golpe. Si ya existe no me dejes
 - Revisar que pedo con procesos (subprocesos de marina en prod, no tienen clave, se hacen undefined, esta loco)
 - en funciones pistaDeAuditoria() return un json con current user y timestamp
 - asistencia
    - que no deje cargar trabajadores qye ya esten
    - que cargue a los trabajadores que ya tenian asistencia anunque no esten asigandos
 - app_cuenta_cc 
    - crear los fields necesarios para el UML
    - corregir un error
    - programar el boton
 
TO DO:
 - Produccion
   - Quitar datos_kaizen y revisar ddl Virgilio
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
   - el borrar todo de utilidad no debe borrar sino recargar. La funcionalidad ya está, sólo hay que quitarle el borra todo
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
  
