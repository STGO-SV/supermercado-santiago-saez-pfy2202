# Estado global e ingreso de artículos

PFY2202 · Experiencia 1 · Semana 2 · Forma B · Despensa Verde

Fecha de comprobación: 27 de octubre de 2026.

Se implementó una lista compartida de productos mediante React Context y `useReducer`, junto con el ingreso de artículos y una tabla de inventario. Las incorporaciones aparecen también en el catálogo existente y se conservan durante la navegación. Los datos permanecen exclusivamente en memoria; una recarga restaura la semilla de doce productos.

## Archivos creados y modificados

Las rutas de esta sección son relativas a la raíz del proyecto.

| Estado     | Archivo                                                                                                    | Función                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Creado     | `src/context/ProductosContext.js`                                                                          | Definición del contexto compartido.                                                                  |
| Creado     | `src/context/ProductosProvider.jsx`                                                                        | Carga inicial, reducer y operación de incorporación.                                                 |
| Creado     | `src/reducers/productosReducer.js`                                                                         | Transiciones de carga, error y alta inmutable.                                                       |
| Creado     | `src/utils/productos.js`                                                                                   | Normalización, construcción y validación del modelo compartido.                                      |
| Creado     | `src/utils/validarArticulo.js`                                                                             | Validación de los cinco campos del formulario.                                                       |
| Creado     | `src/components/FormularioArticulo.jsx`                                                                    | Ingreso, errores asociados a campos y confirmación.                                                  |
| Creado     | `src/components/TablaInventario.jsx`                                                                       | Tabla semántica de todos los productos, incluidos aquellos sin stock.                                |
| Creado     | `src/components/MenuInventario.jsx`                                                                        | Navegación secundaria entre las dos páginas nuevas.                                                  |
| Creado     | `src/pages/IngresoArticulos.jsx`                                                                           | Ruta `/ingreso-articulos` y control de carga y error.                                                |
| Creado     | `src/pages/Inventario.jsx`                                                                                 | Ruta `/inventario` y estados de carga, error y lista vacía.                                          |
| Creado     | `src/inventario.css`                                                                                       | Estilos acotados al menú, formulario y tabla nuevos.                                                 |
| Creado     | `tests/productos.test.js`                                                                                  | Veintiuna pruebas unitarias adicionales.                                                             |
| Modificado | `src/main.jsx`                                                                                             | Montaje del proveedor por encima de las rutas e importación del CSS adicional.                       |
| Modificado | `src/App.jsx`                                                                                              | Registro de las dos rutas nuevas.                                                                    |
| Modificado | `src/layouts/MainLayout.jsx`                                                                               | Incorporación del menú secundario; conservación del menú inferior.                                   |
| Modificado | `src/hooks/useProductos.js`                                                                                | Acceso al contexto en reemplazo de una carga independiente.                                          |
| Creado     | `docs/informe-semana-2-etapa-1.md`                                                                         | Descripción técnica y resultados de esta etapa.                                                      |
| Creado     | `docs/pruebas-semana-2-etapa-1.md`                                                                         | Procedimiento de reproducción y alcance de las comprobaciones.                                       |
| Creado     | `docs/evidencia/semana-2/etapa-1-navegador.json`                                                           | Registro de los 26 escenarios de navegador.                                                          |
| Creado     | `docs/evidencia/semana-2/ingreso-375.png`, `ingreso-1366.png`, `inventario-375.png`, `inventario-1366.png` | Capturas de las dos páginas nuevas en móvil y escritorio, dentro del mismo directorio de evidencias. |

Se conservaron sin cambios los JSON, los componentes del catálogo, el formulario de contacto, las sucursales, las pruebas originales, el CSS original y la documentación y evidencias históricas de Semana 1. No se modificaron `package.json`, `package-lock.json` ni la configuración de Vite.

## Estado global y fuente inicial

`ProductosProvider` permanece montado mientras cambia la ruta. `useProductos` expone el mismo estado a Inicio, Ingreso de artículos e Inventario. El catálogo conserva su interfaz de propiedades, su búsqueda y su filtro de categorías.

El estado contiene `productos`, `cargando` y `error`. El reducer procesa `CARGA_COMPLETADA`, `CARGA_FALLIDA` y `AGREGAR_ARTICULO`. Las incorporaciones producen un nuevo arreglo y un nuevo registro, sin modificar el estado anterior. Se rechazan altas con identificadores existentes, datos inválidos, carga pendiente o error de inicialización. Una respuesta de carga repetida o tardía no sobrescribe la lista ya inicializada.

La inicialización solicita `public/data/productos.json` mediante `fetch`, respeta `BASE_URL`, comprueba el estado HTTP y valida la lista completa antes de normalizarla. Un `AbortController` cancela la carga al desmontar el proveedor. En desarrollo, `StrictMode` puede iniciar una solicitud adicional cancelada; no se duplica la lista. Cambiar de página no inicia otra carga de productos.

Un fallo HTTP, de red, de sintaxis JSON o de validación produce un aviso compartido y mantiene disponible la navegación. El formulario de ingreso no se muestra hasta completar una carga válida. Una lista vacía es válida y permite incorporar el primer artículo.

## Modelo de producto

Se conservan `id`, `nombre`, `categoria`, `precio`, `stock` y `disponible`. Se añaden `marca` y `tipo`.

- En los doce productos originales, `marca` se normaliza a `null` y la tabla muestra «Sin información». No se asignan marcas ficticias a la semilla.
- La transformación establece explícitamente `tipo = categoria`, sin alterar el JSON. En esta implementación ambos atributos representan la misma clasificación.
- En las altas, el campo Tipo o categoría genera ambos atributos con el mismo texto recortado. El modelo compartido verifica su igualdad para evitar contradicciones.
- Nombre, marca y tipo son textos obligatorios distintos de espacios.
- Precio CLP y stock son enteros seguros no negativos. Se admite cero; se rechazan decimales, negativos, notación exponencial y valores superiores a `Number.MAX_SAFE_INTEGER`.
- La disponibilidad se deriva de `stock > 0`. No existe un control independiente que permita contradecir las existencias.
- Los nuevos identificadores utilizan el prefijo `art-` y `crypto.randomUUID()`. La incorporación también comprueba duplicados dentro del reducer.

El JSON funciona como semilla inmutable; la lista del contexto es la única fuente de datos durante la ejecución. No existen listas paralelas para la tabla o el catálogo.

## Flujo de incorporación

1. Se abre `/ingreso-articulos` desde el menú secundario.
2. Se completan nombre, marca, tipo o categoría, precio CLP y cantidad disponible.
3. La validación identifica errores por campo y enfoca el primero que requiere corrección.
4. Con datos válidos, se recortan los textos, se convierten los números y se construye el producto con disponibilidad derivada.
5. Se incorpora el registro mediante el reducer, se limpian los campos y se muestra una confirmación con acceso a Inventario.
6. La tabla y el catálogo consumen la lista actualizada. Las categorías del filtro se derivan de esa misma lista, incluidas las nuevas clasificaciones.

Se conservan `/`, `/nuestras-tiendas`, `/contactanos`, la ruta 404 y los tres enlaces originales del menú inferior. La navegación secundaria tiene una etiqueta accesible propia y señala su ruta activa mediante `NavLink`.

## Pruebas ejecutadas

| Comprobación           | Resultado ejecutado                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `npm test`             | 35 pruebas aprobadas, cero fallos y cero omitidas: 14 originales y 21 nuevas.                      |
| `npm run lint`         | Finalización satisfactoria, sin errores.                                                           |
| `npm run format:check` | Todos los archivos incluidos cumplen el formato de Prettier.                                       |
| `npm run build`        | Compilación de producción satisfactoria con Vite 8.3.5.                                            |
| Navegador              | 26 escenarios aprobados en Chrome 156.0.8078.48, contra Vite en desarrollo con `StrictMode`.       |
| Revisión visual        | Capturas de ingreso e inventario revisadas a 375 y 1366 px; adaptación comprobada además a 768 px. |
| `git diff --check`     | Sin errores de espacios en los cambios rastreados.                                                 |

Las pruebas unitarias cubren normalización sin mutación, conservación de atributos, marcas ausentes, igualdad entre tipo y categoría, validación de campos, límites numéricos, construcción de artículos, disponibilidad, altas consecutivas, identificadores duplicados y respuestas de carga tardías.

Los escenarios de navegador verificaron rutas nuevas, menús, tabla, errores del formulario, altas visibles en ambas vistas, stock cero, filtros, historial, reinicio tras recarga, contacto, sucursales, 404, adaptación, salto al contenido y manejo de carga, vacío y errores. La ejecución no registró excepciones de JavaScript. Los resultados detallados se encuentran en `evidencia/semana-2/etapa-1-navegador.json`.

Los escenarios de navegador corresponden a una ejecución automatizada de comprobación; no se instaló una suite de navegador en el proyecto. Las comprobaciones de teclado cubren el salto al contenido y el foco ante errores, y no constituyen una certificación completa de accesibilidad. La compilación se ejecutó; la comprobación funcional en navegador utilizó el servidor de desarrollo, no un despliegue de producción.

## Errores detectados y correcciones

La revisión visual detectó encabezados de tabla divididos dentro de palabras y columnas demasiado estrechas. Se estableció un ancho mínimo para la tabla y se evitó la división arbitraria de los encabezados; el desplazamiento horizontal queda contenido en una región enfocable. Las comprobaciones de navegador se repitieron después del ajuste y finalizaron con 26 escenarios aprobados.

No se detectaron fallos funcionales pendientes en el alcance comprobado. Los rechazos de datos inválidos y las cancelaciones de carga son comportamientos previstos y no defectos pendientes.

## Estado Git

La rama de trabajo es `semana-2`. Su punto de partida y `HEAD` permanecen en `8d4de1f`; los cambios de esta etapa están en el árbol de trabajo, sin commits. La rama `main` conserva `8d4de1f` y la entrega de Semana 1. No se realizaron operaciones de publicación ni modificaciones remotas.

## Correspondencia con la pauta

La referencia funcional es Instrucciones específicas, Forma B, de PFY2202, Experiencia 1, Semana 2. La guía de aprendizaje desarrolla la gestión de estados y la integración de frameworks CSS. La pauta de evaluación formativa contiene los siguientes criterios; se conserva su numeración.

| Criterio                                                                                   | Ponderación | Correspondencia de esta etapa                                                                                                                |
| ------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Configura la navegación y la gestión de estados usando tecnologías de React             | 40 puntos   | Dos rutas nuevas, menú secundario, Context, reducer y lista compartida comprobados.                                                          |
| 2. Utiliza framework CSS                                                                   | 20 puntos   | Pendiente. Esta etapa utiliza CSS propio; no hay framework CSS instalado ni utilizado.                                                       |
| 6. Desarrolla un componente frontend que da respuesta a todos los requerimientos definidos | 40 puntos   | Ingreso, modelo compartido y tabla implementados; la integración del framework CSS sigue pendiente para completar el conjunto de requisitos. |

La tabla describe cobertura técnica y no asigna una calificación.

## Pendientes de integración CSS

La siguiente etapa deberá incorporar y utilizar Tailwind CSS. Quedan pendientes la selección de versiones compatibles, la actualización de dependencias y su archivo de bloqueo, la configuración de Vite y las importaciones CSS.

La integración deberá preservar la paleta, tipografía, foco visible y navegación inferior de Despensa Verde. Se deberá controlar el reinicio de estilos de Preflight, las colisiones con `.container` y la prioridad entre estilos globales y utilidades. Posteriormente deberán repetirse las comprobaciones visuales, de formulario, tabla, navegación y compilación.

No se incorporaron edición, eliminación, compras, ventas, movimientos de inventario, persistencia, autenticación, backend ni servicios externos. Para un alojamiento futuro con `BrowserRouter` continúa siendo necesaria la resolución de rutas SPA hacia `index.html`.
