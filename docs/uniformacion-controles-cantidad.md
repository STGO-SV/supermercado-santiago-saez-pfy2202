# Uniformación de controles de cantidad

PFY2202 · Semana 3 · Despensa Verde

Comprobación del 3 de noviembre de 2026, America/Santiago.

## Resultado

Catálogo y Carrito presentan el patrón `− cantidad +` con el mismo orden del DOM y del teclado. En Carrito se conserva la etiqueta visual «Cantidad», situada encima y fuera del grupo de botones. En las tarjetas compactas permanece únicamente el número visible, con la descripción accesible específica del producto.

Se parte de `semana-3`, HEAD `6281d26`, conservando todos los cambios pendientes de Etapa 2 y ajustes posteriores. No se modifican reducer, contexto, modelo, operaciones, dependencias u otras ramas. No se preparan archivos ni se ejecutan commits, pushes o despliegues.

## Implementación

`ControlesCantidad` deja de elegir el orden en función de `compacto`: ambas variantes renderizan siempre decremento, contador e incremento. La variante solo decide la etiqueta visible exterior y el anuncio accesible de la cantidad; no interviene en las operaciones.

Se conservan los nombres accesibles que incluyen operación y producto, la descripción de existencias, las referencias de ambos botones y los controladores recibidos desde Catálogo y Carrito. El decremento se deshabilita cuando la cantidad es cero; el incremento se deshabilita cuando no hay stock. Los botones deshabilitados se excluyen naturalmente del recorrido de Tab.

La distribución mantiene los botones sin encogimiento y permite ajustar el número a su ancho disponible. El grupo conserva una sola fila; no se utiliza una inversión visual mediante CSS que contradiga el DOM. La etiqueta «Cantidad» no forma parte del contador central ni del grupo de botones.

La cantidad continúa derivándose del contexto. Se conserva el traslado de foco a `+` cuando `−` se deshabilita, a `−` al agotarse el stock mediante `+` y al estado vacío al eliminar la última línea del carrito.

## Archivos afectados

| Archivo                                    | Cambio                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `src/components/ControlesCantidad.jsx`     | Orden único y etiqueta exterior para Carrito.                                              |
| `tests/catalogo-carrito.test.js`           | Expectativas del catálogo actualizadas y dos casos nuevos para variantes, orden y límites. |
| `tests/semana-3-etapa-2.test.js`           | Expectativa de la etiqueta exterior y del número central del carrito.                      |
| `README.md`                                | Disposición y validación vigentes.                                                         |
| `docs/ajuste-catalogo-carrito.md`          | Aclaración de que el orden anterior y sus comprobaciones son históricos.                   |
| Este informe                               | Implementación, validación y conservación de evidencias.                                   |
| `docs/evidencia/semana-3/orden-controles/` | Cuatro capturas nuevas y resultados de navegador en JSON.                                  |

No se cambian los controladores de `TarjetaProducto` o `Carrito`, ni las utilidades del carrito o importes. Se conserva el prefijo Tailwind `tw:` y la configuración existente de fuentes explícitas y exclusión de Preflight.

## Pruebas automáticas ejecutadas

| Comprobación           | Resultado                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `npm test`             | 104 aprobadas: 102 casos existentes y dos adicionales; cero fallos, cancelaciones u omisiones. |
| `npm run lint`         | Satisfactorio, sin errores ni advertencias.                                                    |
| `npm run format:check` | Satisfactorio.                                                                                 |
| `npm run build`        | Satisfactorio, 130 módulos transformados.                                                      |
| `git diff --check`     | Satisfactorio.                                                                                 |

Se conservan los 102 casos anteriores, actualizando únicamente las expectativas relacionadas con el orden y la posición de la etiqueta. Los dos casos adicionales renderizan cada variante y comprueban el orden de los botones en el HTML, el bloqueo del decremento en cero, el bloqueo del incremento sin stock y la ausencia de la etiqueta visual dentro del grupo.

Las pruebas existentes continúan cubriendo cantidades, conservación de stock, importes, categoría y unidades, altas, filtros, carga y error. No se detecta un defecto que requiera modificar el modelo o la lógica global.

## Navegador

Se ejecutaron 25 escenarios satisfactorios en Vite local, `127.0.0.1:5173`. Los resultados de esta ejecución están en `evidencia/semana-3/orden-controles/navegador.json`.

- Doce tarjetas iniciales con `− 0 +`; los doce decrementos quedan bloqueados y los dos productos agotados bloquean el incremento.
- Enter y Espacio reservan dos unidades de arroz desde Inicio: cantidad dos y stock 40. Con ambos botones habilitados, Tab recorre `−` y después `+`; Shift+Tab realiza el recorrido inverso.
- Carrito conserva esas reservas, muestra su etiqueta exterior y total $2.980. El incremento produce tres unidades y $4.470; el decremento devuelve una unidad y restablece $2.980.
- Al vaciar Carrito se mantiene el foco en su encabezado vacío. En catálogo, devolver la última unidad pasa el foco al incremento habilitado.
- Reservar las doce unidades de queso agota el stock y bloquea `+`; el foco pasa al decremento con contorno visible. Devolver una unidad habilita de nuevo el incremento y produce once reservas con total $36.190. Reservar la última desde Carrito produce $39.480, bloquea `+` y conserva el foco en `−`.
- Los cambios del carrito se reflejan al volver al catálogo, sin cantidades locales independientes.
- Catálogo y Carrito se miden a 375, 768 y 1366 px: seis combinaciones sin desbordamiento horizontal ni superposición entre botones y contador. Las doce tarjetas se midieron en conjunto; Carrito se comprobó con una línea activa.

La consola no registró errores ni advertencias. Las capturas nuevas son `catalogo-375.jpg`, `catalogo-1366.jpg`, `carrito-375.jpg` y `carrito-1366.jpg`. Los resultados y medidas corresponden exclusivamente al orden uniforme.

## Conservación de registros y estado Git

Los JSON, capturas y resultados históricos del catálogo con `+ contador −` no se modifican ni se presentan como validación de la nueva disposición. Su informe incorpora únicamente una aclaración de procedencia y una referencia a esta ejecución posterior. Los registros de Etapas 1 y 2 y del ajuste de categoría/unidades permanecen intactos.

La rama sigue en `semana-3`, HEAD `6281d26`, con los cambios anteriores y actuales sin preparar ni registrar. No se modifican `main`, `semana-1` o `semana-2`. La publicación de GitHub Pages y la continuación de la revisión manual integral permanecen pendientes de sus fases correspondientes.
