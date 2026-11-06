# Protocolo de pruebas manuales — Semana 3

**Proyecto:** Despensa Verde
**Asignatura:** Desarrollo Frontend II (PFY2202)
**Evaluación:** Experiencia 1 · Semana 3 · Forma B
**Fecha de ejecución:** 3 de noviembre de 2026
**Resultado general:** 8 pruebas aprobadas, sin incidencias pendientes al cierre.

## 1. Objetivo

Verificar manualmente el funcionamiento de las funcionalidades desarrolladas hasta Semana 3, especialmente la incorporación de artículos al carrito, la sincronización de existencias, los filtros, la navegación, la accesibilidad operativa y la recuperación ante fallos.

Las pruebas se ejecutaron sobre la aplicación local mediante navegador. Los resultados se registran separadamente de las pruebas automatizadas y de las comprobaciones de navegador efectuadas durante las etapas de implementación.

## 2. Preparación

Desde la raíz del proyecto:

```powershell
npm run dev
```

Abrir la dirección local informada por Vite y recargar la aplicación para comenzar con el inventario inicial.

Los artículos incorporados y las reservas permanecen exclusivamente en memoria. Por ello, las pruebas 2 a 7 requieren conservar la sesión y el estado resultante de los pasos anteriores, salvo cuando se indique lo contrario.

## 3. Pruebas ejecutadas

### Prueba 1 — Estado inicial del catálogo

**Procedimiento:**

1. Abrir Inicio.
2. Comprobar la presencia de los doce productos iniciales.
3. Revisar los controles de cantidad de las tarjetas.
4. Verificar el bloqueo del decremento cuando la cantidad es cero.
5. Comprobar que el incremento respete la disponibilidad.
6. Revisar nombre, categoría, precio y existencias.

**Resultado registrado:** Aprobada.

Se confirmó la presencia de los doce productos, sus atributos, los contadores iniciales en cero y los bloqueos correspondientes. La disposición de los controles fue uniformada posteriormente a `− cantidad +` y se comprobó nuevamente.

### Prueba 2 — Incorporación directa desde el catálogo

**Procedimiento:**

1. Localizar Arroz grano largo 1 kg.
2. Comprobar cantidad inicial cero y stock 42.
3. Incorporar una unidad desde la tarjeta.
4. Incorporar una segunda unidad.
5. Verificar la permanencia en Inicio, sin recarga del documento.

**Resultado esperado y observado:**

| Operación             | Cantidad reservada | Stock disponible |
| --------------------- | -----------------: | ---------------: |
| Inicial               |                  0 |               42 |
| Primera incorporación |                  1 |               41 |
| Segunda incorporación |                  2 |               40 |

**Resultado registrado:** Aprobada.

### Prueba 3 — Sincronización entre catálogo y carrito

**Procedimiento:**

1. Abrir Carrito con dos unidades de arroz reservadas.
2. Verificar una única línea del producto.
3. Comprobar precio unitario, cantidad, existencias y total.
4. Activar «Seguir comprando».
5. Confirmar el regreso a Inicio sin pérdida de las reservas.

**Resultado esperado y observado:**

- Cantidad reservada: 2 unidades.
- Precio unitario: $1.490 CLP.
- Subtotal y total: $2.980 CLP.
- Stock disponible: 40 unidades.
- Contador conservado al regresar al catálogo.

**Resultado registrado:** Aprobada.

### Prueba 4 — Modificación de cantidades desde el carrito

**Procedimiento:**

1. Abrir Carrito con dos unidades de arroz.
2. Incrementar la cantidad a tres.
3. Verificar descuento de stock y nuevo importe.
4. Disminuir nuevamente a dos unidades.
5. Regresar al catálogo y verificar la sincronización.

**Resultado esperado y observado:**

| Estado     | Cantidad | Stock |  Total |
| ---------- | -------: | ----: | -----: |
| Inicial    |        2 |    40 | $2.980 |
| Incremento |        3 |    39 | $4.470 |
| Decremento |        2 |    40 | $2.980 |

**Resultado registrado:** Aprobada.

### Prueba 5 — Límites de stock y devolución de existencias

**Procedimiento:**

1. Comprobar los bloqueos de un producto inicialmente agotado.
2. Abrir el formulario de ingreso.
3. Verificar las etiquetas «Categoría», «Precio por unidad en CLP» y «Cantidad disponible en unidades».
4. Incorporar un artículo de prueba con precio $1.000 CLP, categoría Abarrotes y stock de una unidad.
5. Verificar su aparición en el catálogo.
6. Reservar la unidad disponible.
7. Comprobar el bloqueo del incremento por agotamiento.
8. Devolver la unidad y verificar la restitución del stock.
9. Confirmar que las dos unidades de arroz permanecen reservadas.

**Resultado esperado y observado:**

| Estado del artículo nuevo | Cantidad reservada | Stock |
| ------------------------- | -----------------: | ----: |
| Inicial                   |                  0 |     1 |
| Incorporado al carrito    |                  1 |     0 |
| Devuelto                  |                  0 |     1 |

**Resultado registrado:** Aprobada.

Durante la preparación de esta prueba se identificó una ambigüedad entre categoría comercial y tipo de producto. La interfaz fue corregida antes de completar su ejecución. El modelo y las operaciones de inventario conservaron su contrato de venta por unidades.

### Prueba 6 — Filtros y conservación de cantidades

**Procedimiento:**

1. Buscar ARROZ desde Inicio.
2. Verificar que la búsqueda conserve las dos reservas y el stock disponible.
3. Aplicar el filtro Lácteos y revisar los productos mostrados.
4. Retirar el filtro y comprobar que las reservas persistan.
5. Buscar el artículo incorporado durante la sesión.
6. Aplicar el filtro Abarrotes desde Inventario.
7. Confirmar las existencias del arroz y del artículo nuevo.
8. Retirar el filtro y comprobar el listado completo.
9. Abrir Carrito y verificar su contenido.

**Resultado observado:**

Se conservaron dos unidades de arroz, stock disponible de 40 unidades y total de $2.980 CLP. Los filtros no modificaron las reservas ni eliminaron artículos del estado compartido.

**Resultado registrado:** Aprobada.

### Prueba 7 — Teclado, foco y adaptación responsiva

**Procedimiento:**

1. Utilizar Tab para recorrer controles del catálogo.
2. Comprobar indicadores de foco visibles.
3. Incrementar la cantidad de arroz mediante Enter.
4. Disminuirla mediante Espacio.
5. Acceder a Carrito mediante teclado.
6. Activar «Seguir comprando» sin utilizar el mouse.
7. Revisar Inicio y Carrito a 375, 768 y 1366 píxeles.
8. Comprobar que no existan superposiciones ni desbordamiento horizontal involuntario.
9. Confirmar la disponibilidad de la navegación inferior y la conservación de las reservas.

**Resultado observado:**

Se verificaron operaciones mediante teclado, continuidad de navegación, foco visible y presentación adaptable en las tres resoluciones. El estado final conservó las dos unidades de arroz reservadas.

**Resultado registrado:** Aprobada.

Esta revisión no constituye una certificación integral de accesibilidad ni de compatibilidad con todos los navegadores.

### Prueba 8 — Recarga, recuperación y regresión

**Procedimiento:**

1. Confirmar dos unidades de arroz reservadas y stock disponible de 40 unidades.
2. Recargar la aplicación.
3. Comprobar la recuperación de los doce productos iniciales.
4. Verificar el restablecimiento del stock de arroz a 42 unidades y su contador a cero.
5. Confirmar la desaparición del artículo incorporado temporalmente.
6. Abrir el carrito y verificar su estado vacío, total $0 CLP y enlace «Seguir comprando».
7. Revisar catálogo, filtros, inventario, detalle, ingreso de artículos, sucursales, contacto y página 404.
8. Reproducir un fallo de carga desde las herramientas de red del navegador.
9. Restaurar la conexión y comprobar la recuperación mediante «Reintentar».

**Resultado observado:**

Se confirmó la recuperación del inventario original, el vaciado del carrito, la eliminación de las altas temporales y el funcionamiento de las vistas revisadas. También se confirmó el comportamiento de error de carga y recuperación mediante reintento.

**Resultado registrado:** Aprobada.

## 4. Consolidación de resultados

| Prueba | Área evaluada                         | Resultado |
| ------ | ------------------------------------- | --------- |
| 1      | Catálogo inicial y controles          | Aprobada  |
| 2      | Incorporación de unidades             | Aprobada  |
| 3      | Sincronización catálogo/carrito       | Aprobada  |
| 4      | Incremento y devolución desde carrito | Aprobada  |
| 5      | Límites de stock y formulario         | Aprobada  |
| 6      | Filtros y conservación del estado     | Aprobada  |
| 7      | Teclado, foco y diseño responsivo     | Aprobada  |
| 8      | Recarga, regresión y recuperación     | Aprobada  |

**Resultado consolidado: 8 de 8 pruebas manuales aprobadas.**

## 5. Alcance de la evidencia

Este documento consolida los resultados comunicados durante la revisión manual de la aplicación. No representa una nueva ejecución de las pruebas ni sustituye los archivos de evidencia generados durante las etapas de implementación.

No se atribuyen capturas, registros automáticos de interacción ni mediciones adicionales a estas ocho comprobaciones.

Las pruebas automatizadas y las verificaciones estructuradas de navegador se documentan por separado en los informes técnicos y en `docs/evidencia/`.

## 6. Limitaciones

La aplicación funciona con estado temporal en memoria. La recarga restablece los productos originales, las reservas y las incorporaciones de la sesión.

No se implementan almacenamiento persistente, backend, autenticación ni procesamiento de compras.

La ejecución manual se realizó sobre el entorno local. La publicación y las verificaciones remotas de GitHub Pages corresponden a una actividad posterior.

## 7. Conclusión

Las ocho pruebas manuales previstas para la revisión funcional de Semana 3 finalizaron satisfactoriamente. No quedaron incidencias funcionales pendientes en los recorridos evaluados.

La validación confirma el funcionamiento observado del catálogo, el inventario y el carrito, así como la sincronización de cantidades, los controles de disponibilidad, la navegación y la recuperación del estado en los escenarios comprobados.
