# Controles de carrito desde el catálogo

PFY2202 · Semana 3 · Despensa Verde

Comprobación del 3 de noviembre de 2026, America/Santiago.

## Alcance histórico del orden de los controles

Este informe y sus 29 escenarios documentan la ejecución anterior a la uniformación del selector. Las referencias a `+ contador −` y sus capturas corresponden al diseño probado entonces. El orden vigente es `− cantidad +` en Catálogo y Carrito, con validación posterior registrada en [Uniformación de controles de cantidad](uniformacion-controles-cantidad.md). Los resultados y evidencias originales se conservan sin atribuirlos al diseño nuevo.

## Resultado y base conservada

Se incorporan controles de cantidad en todas las tarjetas del catálogo de Inicio, sin requerir navegación previa a Inventario o Detalle. La rama permanece en `semana-3`, HEAD `6281d26`. Al iniciar existían los cambios de Etapa 2 sin commit; se conservan y se amplían únicamente los componentes necesarios para este ajuste.

No se modifica el reducer, el modelo de productos, el contexto, las operaciones del carrito ni las protecciones de carga. No se añaden dependencias, persistencia, backend, publicaciones o configuración de GitHub Pages. Los cambios permanecen sin preparar y sin commit.

## Reutilización e integración

`TarjetaProducto` consulta `carrito`, `agregarAlCarrito`, `disminuirCantidad` y `avisoCarrito` mediante `useProductos`. La cantidad se deriva de la línea cuyo `productoId` coincide con la tarjeta, con valor cero cuando no existe. Los atributos del producto y su stock proceden de la lista compartida que ya alimenta el catálogo.

El botón `+` llama a `agregarAlCarrito`, operación que admite tanto crear una línea como acumular unidades en la existente. Se utiliza esta operación porque `incrementarCantidad` exige una entrada previa. El botón `−` llama a `disminuirCantidad`, devolviendo existencias y eliminando la línea al llegar a cero. Las validaciones definitivas continúan en el reducer existente.

`ControlesCantidad` añade una variante `compacto` para representar el orden visual y de teclado `+ contador −`. La cantidad central solo muestra el número; una etiqueta exclusiva para accesibilidad identifica producto y unidades reservadas, con anuncio de cambios mediante `aria-live`. La variante predeterminada del carrito conserva `− Cantidad +`.

El decremento se deshabilita cuando la cantidad es cero; el incremento cuando el stock es cero. Ambos botones tienen nombres accesibles que incluyen operación y nombre del producto. La descripción del incremento apunta al stock de la tarjeta mediante un identificador específico, sin reutilizar el identificador de la vista del carrito.

Las referencias locales solo gestionan elementos y foco. Al agotar la última existencia se enfoca `−`; al devolver la última unidad y deshabilitar el decremento se enfoca `+`. No se utiliza estado local para cantidades. Los avisos de rechazo se muestran como alerta en la tarjeta correspondiente; los cambios satisfactorios se anuncian mediante el contador.

Las utilidades Tailwind se concentran en `ControlesCantidad`, ya registrado en las fuentes explícitas. No se requiere ampliar `src/tailwind.css` por este ajuste. Se conservan nombre, categoría, precio, stock y disponibilidad en cada tarjeta, así como la configuración sin Preflight y el prefijo `tw:`.

## Archivos afectados por el ajuste

| Intervención           | Archivo                                     | Finalidad                                                                                |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Modificado             | `src/components/TarjetaProducto.jsx`        | Contexto, cantidad derivada, operaciones y continuidad de foco.                          |
| Ampliado sobre Etapa 2 | `src/components/ControlesCantidad.jsx`      | Variante compacta, referencia de incremento, descripción configurable y bloqueo en cero. |
| Creado                 | `tests/catalogo-carrito.test.js`            | Diez pruebas de renderizado e integración con el estado existente.                       |
| Ampliado sobre Etapa 2 | `README.md`                                 | Funcionalidad actual y recuento de pruebas.                                              |
| Creado                 | Este informe                                | Arquitectura, resultados, incidencias y estado Git.                                      |
| Creado                 | `docs/evidencia/semana-3/catalogo-carrito/` | Tres capturas y `navegador.json`.                                                        |

Los demás archivos y evidencias de Etapa 2 conservan el contenido previo. Los informes y evidencias históricos de Semanas 1 y 2 y de Etapa 1 permanecen intactos.

## Pruebas automáticas ejecutadas

| Comprobación           | Resultado                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm test`             | 94 aprobadas: 84 anteriores y diez nuevas; cero fallos, cancelaciones u omisiones. |
| `npm run lint`         | Satisfactorio, sin errores ni advertencias.                                        |
| `npm run format:check` | Satisfactorio.                                                                     |
| `npm run build`        | Satisfactorio, 130 módulos transformados.                                          |
| `git diff --check`     | Satisfactorio.                                                                     |

Las pruebas nuevas renderizan los componentes reales mediante React DOM Server y Vite, con el contexto de productos. Verifican doce contadores iniciales y orden visual, bloqueos de agotados, reservas existentes, devolución hasta cero, cantidades conservadas al volver a representar una tarjeta filtrada, cambios originados en el carrito, altas nuevas, nombres y descripciones accesibles, alertas de rechazo y conservación de la variante del carrito. Las interacciones reales y el foco se comprueban por separado en navegador.

## Navegador y requisitos verificados

Se ejecutaron 29 escenarios satisfactorios en Vite local, `127.0.0.1:5173`, registrados en `evidencia/semana-3/catalogo-carrito/navegador.json`. No se alteraron las semillas ni se añadieron accesos de prueba al estado global.

| Requisito                   | Resultado observado                                                                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Doce contadores cero        | Doce tarjetas iniciales, doce decrementos bloqueados y dos incrementos bloqueados por stock cero.                                                               |
| Agregar con `+`             | Arroz pasa de cero a una y luego dos reservas, con stock 42 → 41 → 40, sin abandonar Inicio.                                                                    |
| Devolver con `−`            | La cantidad baja y devuelve unidades; al llegar a cero se recupera stock 42 y se deshabilita el decremento.                                                     |
| Conservar al filtrar        | Búsqueda ARROZ y aplicación/retirada de categoría mantienen la cantidad global al remontar la tarjeta.                                                          |
| Bloquear agotados           | Yogur y Lavalozas bloquean `+`; un alta con una unidad también lo bloquea tras reservarla.                                                                      |
| Incorporar altas nuevas     | Avena catálogo UX, categoría Granel, precio 1290 y stock uno recibe controles iniciales cero, permite reserva y devolución.                                     |
| Navegar a Carrito y volver  | Las reservas originadas en Inicio aparecen en Carrito y se conservan al regresar.                                                                               |
| Reflejar cambios de Carrito | Incrementar en Carrito muestra dos unidades y stock 40 en la tarjeta; eliminar la línea restablece cero.                                                        |
| Recargar                    | Regresan doce tarjetas, todas con contador cero y stock inicial; desaparece el alta temporal.                                                                   |
| Operación accesible         | Enter y Espacio modifican cantidades; los nombres identifican producto y operación. El foco visible pasa a un botón habilitado al llegar a cero o agotar stock. |

Se verifican también el inventario y detalle sincronizados, la variante visual original del carrito, el carrito vacío, sucursales, contacto y la página 404. La consola de la pestaña de pruebas no registró errores ni advertencias.

En 375, 768 y 1366 px se midieron las trece tarjetas presentes durante la prueba. No se detectó desbordamiento horizontal del documento o del grupo de controles. Las posiciones de los botones y el contador confirmaron el orden `+ contador −` sin superposición en los tres anchos. Las capturas `catalogo-375.jpg`, `catalogo-768.jpg` y `catalogo-1366.jpg` muestran una tarjeta filtrada con reserva y foco visible; las medidas del JSON corresponden a la lista completa de trece tarjetas.

## Incidencias resueltas y límites

El catálogo anterior solo permitía consultar productos y obligaba a cambiar de vista para reservar unidades. La integración directa elimina esa dependencia de navegación y mantiene las mismas operaciones atómicas del contexto.

Reutilizar únicamente `incrementarCantidad` habría rechazado la primera unidad al no existir una línea. Se utiliza `agregarAlCarrito` para ambas situaciones, sin cambios en el reducer.

La desaparición o deshabilitación del botón activo puede interrumpir el recorrido de teclado. Las referencias y el efecto posterior al render conservan el foco en el control habilitado de la misma tarjeta. Se verifican ambas transiciones.

No se detectan pendientes funcionales dentro de este ajuste. Se conservan los límites existentes: estado solo en memoria, pruebas de accesibilidad parciales y publicación en GitHub Pages pendiente de una fase posterior.

## Estado Git

La referencia `semana-3` permanece en `6281d26`; `main`, `semana-1` y `semana-2` no se modifican. El directorio contiene los cambios previos de Etapa 2 y los de este ajuste, sin preparar ni registrar. No se ejecutan commits, fusiones o publicaciones.
