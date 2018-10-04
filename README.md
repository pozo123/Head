# Head
Depto. de Innovacion y Optimizacion

sintaxis ids: id_nombreDelObjeto_tipoObjeto_documento (e.g. id_proyecto_ddl_inges) TipoObjeto solo si no text

Pendientes semana  1 oct 

- Primordiales

  - Generar opcion actualizar presupuesto
    - En lugar de guardar viejo y nuevo, se guarda precio anterior en un atriuto "precios_anteriores" con push
    - el PEDO es que puedene haber presu con misma obra, mismo cliente (duh) y mismo tipo sin que sean actualizaciones
  - Definir cómo se guardan los presupuestos en la rama_bd. chance en cliente-> obra -> presu? puede ayudar para consecutivos
  - Actualizar botones html
  - Generar presupuesto
    - En pdf (en el app_presupuesto)
  - Subir a bd tipos de presupeusto con clave
  - programar consecutivo para clave presu
  - Cliente tiene clave o solo se usa para la clave del presu? con substring o jalamos de atributo?
  
- Importantes pero no podemos porque no nos mandan nada
  - Front y back del generador de presupuestos (PDFs) (falta definir realmente este trabajo)
  - Generar presupuestos (ahi va la funcionalidad de reqs)
  - Programar que jale el valor de cada hora de la bd para meter $$ en presupuesto en vez de solo horas

- Importantes pero no primordiales
  - Credenciales -> hide
  - Foto en inges y en reqs
  - Submit en login
  - reqs
    - Cambiar reqs a checkboxes
    - Subir reqs (No nos los han mandado)
  - cuando se cambie de página, se borre lo que se escribió en formularios.
  - en formularios, escribir el código para evitar cosas tipo (si los campos están vacios, mandar alerta y no aplicar método,  No repetir nombres en proys o presu, etc.)
 - Editar proys
    - Activa reqs
    - Edita info
    - alta y BAJA inges asignados

To do:
  - Candado para que los nombres de los proyectos (y cada presupuesto) sean diferentes
  - Hablar con Emmanuel sobre el boton amarillo
  - Hablar con Emmanuel sobre lider proyecto
  - Proyecto asignado o tambien  presupuesto?
  - Pedir correos para dar de alta a los ingenieros de verdad
  - Sólo puede haber un lider?
