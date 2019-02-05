# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Por probar:
 - app_inges -> catch (volver a cargar app_inge, tenía una r de sobra en la línea 47)
 - app_reporte_obras -> colorsitos cool (edité, ahora tiene checkboxes... creo :S) (Edit para que el cb de zobra no este activo)
 - app_actualizar_regs -> cambiar Miscelaneo por Otros y hacer todo lo de los registros
 - app_cierre_maestro -> ya suma horas bien (checar en los 5 lugares)
 - app_perfil -> suma horas en inge/obras (checar en los 5 lugares)
 - dashgrid modulo
 - app_areas (:
 
 Actualizar_regs:
 - Sumar las horas de cada ppto (como en ACANTO) para todos los demas
    - poner en 0s todo
    - llenar 5 campos (inges/obra/ppto, ppto/horas_trabajadas, colaboradores/horas_totales, cols/horas_esp, cols/uid)
 - Código mágico para cambiar todos los misceláneo por Otros en registros.
 - Cambiar registros con más de 15 horas por 9 horas

 Errores:
 - registros con horas = 0 :S
 - Pestaña tipos/generos en bibliotecas se duplica
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 
Hoy:


KAIZEN: 
  - Quién es responsable de llenarlo.
    - Por secciones? Global? Que los de una sección no tengan acceso a lo otro para no chingarlo
    - Necesito los supervisores de todas las obras
      - Y pues saber sus responsabilidades y así
  - Base de datos de profit:
    - Admin (20% de lo cobrado en los kaizen)
    - SCORE (lo que se cobra de proyectos por obra, está en kaisen)
    - Profit (ya sin admin ni score)
      
PRODUCCION:
  - Tabla de converción de materiales para la cuantificación.
     - Qué NO te da AutoCAD? Y de qué depende? Todo tiene que ser una función, hay que definir los parámetros
  - A quien le sale y a quien no.
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.

 
SCORE:
  - meter atributo proceso en pptos
  
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
  - Reqs (funcionalidad)
  - Checar que no exista otra obra con esa clave

- JUNTA
  
- EMAIL
  - Todos pueden subir su foto!
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  
- DONE
  - Mover todo a proyectos
  - Ponerle un misc a todas las obras
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - PAGOS
  - Imágenes
  - Cierre maestro automático
  - Rama personal
