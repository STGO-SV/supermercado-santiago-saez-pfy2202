# Categoría comercial y venta por unidades

PFY2202 · Semana 3 · Despensa Verde

Comprobación del 3 de noviembre de 2026, America/Santiago.

## Resultado

Se elimina la etiqueta ambigua «Tipo o categoría» y se explicita la venta por unidades en el formulario y en las vistas de consulta. La rama sigue en `semana-3`, HEAD `6281d26`, conservando los cambios previos sin commit de Etapa 2 y los ajustes del catálogo y continuidad del carrito.

No se migra el contrato de productos. No se modifican la semilla, normalización, validación del modelo compartido, reducer, contexto ni operaciones del carrito. No se añaden unidades de venta, conversiones de peso, persistencia, backend o dependencias.

## Hallazgos sobre tipo y categoria

| Ámbito                       | Comportamiento existente y decisión                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/data/productos.json` | Los doce registros contienen `categoria`; no contienen `tipo` como dato original. Se conservan todos sus nombres, precios y existencias.                                |
| `normalizarProductos`        | Añade `tipo` copiando la categoría para cumplir el modelo de estado existente. No convierte pesos ni volúmenes. Se conserva sin modificaciones.                         |
| `validarProductosEstado`     | Exige expresamente `tipo === categoria`. El contrato actual los trata como alias, no como dos clasificaciones independientes. Se mantiene esa invariante.               |
| Formulario y `crearArticulo` | La clave interna `tipo` se utiliza como entrada de clasificación y se proyecta a ambos atributos. Se conserva por compatibilidad; la etiqueta visible pasa a Categoría. |
| Catálogo y filtros           | Ya utilizan `categoria` como clasificación comercial. Se conserva su funcionamiento.                                                                                    |
| Inventario y detalle         | Mostraban `tipo` con la etiqueta Tipo / categoría. Pasan a mostrar `categoria` y el encabezado Categoría.                                                               |
| Reducer y carrito            | Trasladan unidades enteras y no interpretan nombres ni clasificaciones como unidades de venta. No requieren cambios.                                                    |
| `avisoCarrito.tipo`          | Representa el nivel de un mensaje, por ejemplo error o éxito; no es el atributo de clasificación del producto y permanece intacto.                                      |
| Pruebas existentes           | Comprueban la igualdad de los alias, conservación de datos históricos y límites enteros. Se conservan sus casos.                                                        |

Por tanto, los dos atributos del estado no representan actualmente conceptos separados de categoría y unidad de venta. Mantener el alias existente evita una migración innecesaria; la presentación identifica únicamente la categoría comercial. No se crea un selector de gramos, kilogramos, toneladas o cualquier otra unidad.

## Solución aplicada

El formulario presenta cinco campos: Nombre del artículo, Marca, Categoría, Precio por unidad en CLP y Cantidad disponible en unidades. Conserva las claves, identificadores, controles y límites numéricos existentes. La ayuda explica la comercialización por unidades y los mensajes de validación se alinean con las etiquetas visibles.

Inventario muestra Categoría, Precio por unidad (CLP) y Unidades disponibles. Detalle utiliza esos mismos conceptos y consulta `producto.categoria`. Las tarjetas conservan nombre, categoría, precio, stock y disponibilidad; se añade la indicación CLP por unidad y se distingue «1 unidad» de las cantidades plurales.

Los nombres históricos como Arroz grano largo 1 kg, Yogur natural 125 g y Jabón de manos 250 ml permanecen intactos. Reservar uno de esos artículos consume una unidad de su presentación, no una cantidad de gramos o mililitros. El precio continúa siendo un entero de pesos chilenos por unidad, conforme a la validación previa.

## Archivos afectados

Rutas relativas a la raíz del repositorio:

| Archivo                                       | Cambio de este ajuste                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/components/FormularioArticulo.jsx`       | Etiquetas, ayuda y aclaración interna del alias existente.                                  |
| `src/utils/validarArticulo.js`                | Mensajes de categoría, precio por unidad y cantidad en unidades; reglas numéricas intactas. |
| `src/components/TablaInventario.jsx`          | Encabezados y presentación de `categoria`.                                                  |
| `src/pages/DetalleArticulo.jsx`               | Categoría comercial y textos de precio y existencias por unidades.                          |
| `src/components/TarjetaProducto.jsx`          | Indicación de precio por unidad y concordancia del stock.                                   |
| `tests/categoria-unidades.test.js`            | Ocho pruebas nuevas de presentación, mensajes, contrato, compatibilidad e invariantes.      |
| `README.md`                                   | Descripción funcional y resultados actuales.                                                |
| Este informe                                  | Hallazgos, decisión de compatibilidad y verificación.                                       |
| `docs/evidencia/semana-3/categoria-unidades/` | Dos capturas y `navegador.json` con resultados nuevos.                                      |

Los informes, pruebas y evidencias anteriores se conservan. El modelo mantiene `id`, `nombre`, `marca`, `tipo`, `categoria`, `precio`, `stock` y `disponible`, sin campos adicionales.

## Pruebas automáticas ejecutadas

| Comprobación           | Resultado final                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm test`             | 102 aprobadas: 94 anteriores y ocho nuevas; cero fallos, cancelaciones u omisiones. |
| `npm run lint`         | Satisfactorio, sin errores ni advertencias.                                         |
| `npm run format:check` | Satisfactorio.                                                                      |
| `npm run build`        | Satisfactorio, 130 módulos transformados.                                           |
| `git diff --check`     | Satisfactorio.                                                                      |

Las pruebas nuevas verifican los cinco campos, ausencia de selector de unidad, etiquetas y ayuda explícitas, mensajes de error, conservación de la estructura del modelo y de los doce registros históricos, categoría en inventario y detalle, categoría nueva en filtros y catálogo, precios por unidad, singular/plural y movimientos enteros para presentaciones con peso o volumen en sus nombres. Se prueban existencias negativas, fraccionarias, con coma decimal, notación exponencial o sufijos de unidades; continúan rechazándose. El stock cero sigue admitido y representa un artículo agotado.

La primera ejecución de la nueva prueba de formulario detectó una aserción que dependía del orden de los atributos HTML del campo stock. Se corrigió seleccionando el campo por su nombre y comprobando `min` y `step` de manera independiente. No se identificó un defecto de aplicación en ese control; la batería completa se repitió satisfactoriamente.

## Comprobaciones de navegador

Se ejecutaron 24 escenarios satisfactorios en Vite local, `127.0.0.1:5173`, registrados en `evidencia/semana-3/categoria-unidades/navegador.json`.

| Requisito                          | Resultado observado                                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Categoría sin ambigüedad           | Etiqueta Categoría y mensaje «Ingresa la categoría del artículo».                                                                                          |
| Alta con stock entero              | Aceite de prueba 500 ml, marca informada, categoría Despensa especial, precio 1590 y dos unidades: alta satisfactoria.                                     |
| Categoría en catálogo e inventario | La nueva categoría aparece en la tarjeta y en la tabla del inventario.                                                                                     |
| Filtros                            | Ambos selectores incorporan Despensa especial y muestran únicamente el artículo correspondiente.                                                           |
| Controles del carrito              | Los controles directos de Inicio reservan y devuelven unidades normalmente; el agotamiento bloquea el incremento.                                          |
| Conservación de existencias        | Una reserva deja una unidad disponible; dos reservas agotan el stock. El decremento y el carrito devuelven las unidades. Una reserva produce total $1.590. |
| Datos históricos                   | Arroz conserva su nombre 1 kg y descuenta solo una unidad: 42 → 41 → 42. Yogur mantiene su stock cero y bloqueo inicial.                                   |
| Rechazo de cantidades inválidas    | El formulario rechaza -1 y 1.5, muestra el mensaje en unidades y enfoca el campo stock.                                                                    |

También se comprueban el detalle con categoría y precio por unidad y la concordancia singular/plural. Formulario, Inventario y Detalle se miden en 375, 768 y 1366 px: nueve combinaciones sin desbordamiento horizontal del documento. La tabla conserva su desplazamiento interno. La consola no registró errores ni advertencias.

Las capturas nuevas son `formulario-1366.jpg` y `detalle-375.jpg`. No se reemplazan imágenes ni registros de ejecuciones anteriores.

## Estado Git y continuidad de revisión

`semana-3` permanece en `6281d26`. Todos los cambios anteriores y los de este ajuste quedan sin preparar y sin commit. No se modifican otras ramas, dependencias, semilla, operaciones de carrito ni configuración de despliegue.

La revisión manual integral permanece interrumpida desde la Prueba 5. Las comprobaciones específicas aquí registradas no la dan por completada; su continuación queda pendiente de la revisión de estos resultados.
