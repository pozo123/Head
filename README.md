# Head
Depto. de Innovacion y Optimizacion

 actualizados/nuevos(8/4/19):
 - app_desplegar_kaizen -> bloqueo de columnas odec, sum pag y proy pag
 - app_rrhh_importar_trabajadores -> num_trabajadores_id
 - app_rrhh_horas_extra -> sumar totales/impuestos y cargar bien datos
 - app_rrhh_pagos_diversos -> generateDdls no declaraba proc hasta cambio, a ver si ahora funciona, suma
 
 actualizados/nuevos(4/4/19):
 - app_compras_odec_kaizen -> limpiar bien ddls
 - app_compras_pag_kaizen -> limpiar bien ddls
  
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
   
 Por probar:
 - app_rrhh_horas_extra ->terminar, sumar en totales, impuestos y kaizen, atencion a clientes
 - app_rrhh_pagos_diversos -> terminar: sumar, distribuir, totales, impuestos y KAIZEN y meter ppr en misc, terminada con nuevo uml, atencion a clientes
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
 - Poner los labels de anterior y nuevo separados en proy_cuant_kaizen
 - cambiar avance "prog" por "pag" en desplegar kaizen
 - Clases en css para avance en rojo y prec/cuant en gris
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Ddl para navegar entre pestañas de areas
 - Poner filtros para pestañas en prod (gerente/supervisor)
 - Kaizen bonito
 - HTMLs de:
    - reporte_obras
    - app_admin_registro
    - app_atributo
    - app_areas
    - app_prod_gestionar_pptos -> Que solo salga el tab si eres gerente!
    - app_distribucion_supervisores (los pagos de la pagadora)
    - app_gestionar_supervisores (las obras asignadas)
    - app_rrhh_trabajadores
 - Actualizar:
    
DIEGO:
 - Titulos de obra en catalogo de proceso en negritas y mas grandes
 - ver que chingados con los calendarios en produccion
 - Semanas quebradas en diversos al distribuir, también Atención al cliente, no puede entrar al Kaizen
 - Hablar con Hector sobre rama_bd_destajistas
 - Checar proceso "Parado" y "Atencion a Clientes" al guardar en kaizen en pagos pagadora 
 - en pagos nomina de la semana 1 si quebrada pasarlos a la otra semana 
 - Todo lo de Gantt
 - Desplegar CC
 - Botón respaldo (aunque baje sólo el json)
 - Manual de usuario
 - Agregar terminado a obra_magico (en el alta pero tambien usar app_atributo)
 - diversos en bd, alta, editar, etc, hacer todo en una tabla
 - app_rrhh_pagos_nomina
 - Diversos no carga existentes
 - En producción revisar qué cosas pueden ver/usar supervisores. Bloquear tabs y cargar ddls sólo con las asignadas
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
     - app de 1 x 1
   - pago_pagadora
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
  
