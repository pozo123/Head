# Head
Depto. de Innovacion y Optimizacion

 actualizados/nuevos(16/4/19):
 - app_rrhh_horas_extra -> si week en pagos nomina no existe permite crear nuevos
 - app_rrhh_pagos_diversos -> checo si terminada en week change. No guardo repetidos (checo en la bd y entre los renglones). guardo al terminar. Cosas de asincronía y orden. Hideo un group (NUEVO)
 - app_rrhh_trabajadores -> cambie destajistas de textfield a ddl
 - app_compras_asigna_contrato -> MARINA NACIONAL 385 hardcodeado, añadí IQONO MEXICO

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
 - app_rrhh_pagos_diversos -> terminar: sumar, distribuir, y KAIZEN, ya no al kaizen si atencion a clientes, distribuir horas si semana quebrada, que carguen los ddls
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
 - Terminado en procs, subprocs y obras, tanto en altas como con atributo, y revisarlo en todos los ddls que alimentan kaizen
 - Cambiar "MARINA NACIONAL 385" por "IQONO MEXICO" en TOOOOOOODOOOOOOOS LAAAAAADOOOOOS
    - Compras -> Obras
    - Obras_magico -> Nada más clave, nombre y key
    - producción:
       - Colaboradores -> obras (checar en todos)
       - Obras -> nombre, clave y key
       - pagos_nomina -> en todas las semanas de todos los años
       - trabajadores
          - obra_asignada
          - nomina -> en todo año, toda semana, todos los diversos, todos los dias, todas las horas extra
    - proyectos: (con bibliotecas sirve para todo)
       - inges -> obras
       - obras -> nombre, key, clave, pptos.clave?
       - registros
 - Diversos: no guardar repetidos, y está sumando nada mas una entrada, en vez de todas
 - desplegar kaizen lo del cambio de obra
 - Definir Adic en obras simples
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

  
- EMAIL
  - Todos pueden subir su foto! (click en seleccionar, seleccionas archivo, y luego click en SUBIR imagen)
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  - Si salen igual, desde el cel  
