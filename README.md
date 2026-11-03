# Despensa Verde — Supermercado

Proyecto académico de **Desarrollo Frontend II (PFY2202), Experiencia 1, Semanas 1 a 3, Forma B**.

SPA para consultar un catálogo de productos de un supermercado ficticio, incorporar artículos, revisar el inventario, consultar detalles, reservar unidades en un carrito en memoria, conocer sus sucursales activas y validar un formulario de contacto demostrativo.

## Funcionalidades

- Estado global de productos mediante React Context y `useReducer`, compartido entre catálogo, ingreso de artículos e inventario.
- Formulario de incorporación con nombre del artículo, marca, categoría, precio por unidad en CLP y cantidad disponible en unidades.
- Tabla de todos los artículos, incluidos aquellos sin stock, con filtro por categoría.
- Detalle de artículo mediante `/articulos/:id`, con incorporación de una unidad al carrito.
- Carrito con cantidades, existencias adicionales, subtotales y total CLP calculados desde el estado compartido.
- Controles de incremento y disminución con devolución de unidades, eliminación de líneas y gestión de foco.
- Catálogo con búsqueda que ignora mayúsculas y tildes, filtro por categoría y actualización al incorporar artículos.
- Controles directos `− 0 +` en cada tarjeta de Inicio, sincronizados con el carrito y el stock global.
- Menú secundario de inventario y conservación de la navegación inferior de Semana 1.
- Títulos de pestaña según la ruta activa, incluido el detalle de artículos.
- Reintento explícito de productos y sucursales tras un fallo, sin recargar el documento.
- Sucursales activas y formulario de contacto con validación sin envío.
- Estilos responsivos con CSS propio y Tailwind CSS, conservando la identidad Despensa Verde.

**Los artículos agregados se conservan exclusivamente en memoria durante la navegación. Al recargar la página o abrir una nueva instancia de la aplicación, se restablecen los doce productos del JSON inicial.**

## Tecnologías y requisitos

React 19, React Router 8, Vite 8 y JavaScript. Tailwind CSS **4.3.3** y `@tailwindcss/vite` **4.3.3** están instalados como dependencias de desarrollo con versiones exactas. ESLint revisa el código y Prettier mantiene su formato.

Requiere Node.js **22.22.0 o superior** y npm. El entorno comprobado utiliza Node.js **24.11.0** y npm **11.20.0**. Las versiones resueltas se fijan mediante `package-lock.json`.

## Instalación y ejecución

Desde la carpeta `DFE_II_supermercado` de la rama `semana-3`:

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

La aplicación se consulta en <http://127.0.0.1:5173/>. `npm ci` instala las dependencias del archivo de bloqueo, incluido Tailwind; no requiere una instalación global del framework. Para iniciar otra sesión con las dependencias ya instaladas, basta con ejecutar el comando de desarrollo. El servidor se detiene con Ctrl+C.

Para compilar y revisar la versión de producción localmente:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

La vista previa se consulta en <http://127.0.0.1:4173/>. Este procedimiento sirve la compilación local de `dist/`; no publica la aplicación.

## Comandos

| Comando                | Propósito                                                      |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                         |
| `npm run lint`         | Revisión ESLint                                                |
| `npm run format`       | Aplicar formato                                                |
| `npm run format:check` | Comprobar formato                                              |
| `npm test`             | 104 pruebas automáticas con el ejecutor incorporado de Node.js |
| `npm run build`        | Generar producción en `dist/`                                  |
| `npm run preview`      | Revisar localmente la compilación                              |

## Estructura

```text
public/data/       Semillas de productos y sucursales
src/context/      Contexto y proveedor de productos
src/reducers/     Carga, error e incorporación inmutable de artículos
src/components/   Catálogo, tarjetas, formularios, tabla y menú secundario
src/hooks/        Acceso al contexto de productos y carga de sucursales
src/layouts/      Encabezado, contenido y ambos menús
src/pages/        Inicio, tiendas, contacto, ingreso, inventario y página 404
src/utils/        Validaciones, normalización, búsqueda y formato CLP
src/index.css     Estilos originales responsivos
src/inventario.css Estilos específicos de inventario
src/tailwind.css  Tema y utilidades prefijadas de Tailwind, sin Preflight
tests/            Pruebas de datos, validaciones, modelo y reducer
docs/             Informes, protocolos y evidencias por semana y etapa
```

## Páginas

| Ruta                 | Contenido                                                                         |
| -------------------- | --------------------------------------------------------------------------------- |
| `/`                  | Catálogo inicial de 12 productos y altas de la sesión; búsqueda y categorías      |
| `/nuestras-tiendas`  | Sucursales activas                                                                |
| `/contactanos`       | Formulario demostrativo                                                           |
| `/ingreso-articulos` | Formulario de incorporación de artículos                                          |
| `/inventario`        | Tabla filtrable de todos los productos del estado global                          |
| `/articulos/:id`     | Detalle del artículo e incorporación al carrito                                   |
| `/carrito`           | Cantidades, existencias adicionales, subtotales y total con controles de unidades |
| Cualquier otra ruta  | Página 404 con regreso al inicio                                                  |

El menú inferior conserva Inicio, Nuestras tiendas y Contáctanos. El menú secundario permite abrir Ingresar artículos y Ver inventario. Ambos señalan su ruta activa; React Router gestiona los cambios sin recargar el documento.

## Datos y estado global

Los productos iniciales, precios, existencias, sucursales y direcciones son demostrativos. `ProductosProvider` carga `public/data/productos.json` mediante `fetch()`, valida la lista y la normaliza antes de incorporarla al estado global. El proveedor permanece montado al cambiar de ruta; el catálogo y la tabla consumen la misma lista, sin cargas independientes de productos.

Se conservan los campos originales `id`, `nombre`, `categoria`, `precio`, `stock` y `disponible`, con soporte adicional para `marca` y `tipo`. En los doce registros originales, la marca se representa con `null` y la tabla muestra «Sin información». La transformación establece explícitamente `tipo = categoria`; no modifica el JSON ni inventa marcas.

Las altas requieren los cinco campos del formulario. Los textos se recortan y no pueden estar vacíos; precio y cantidad deben ser enteros seguros no negativos. La categoría informada se conserva en `categoria` y en su alias histórico `tipo`, conforme al contrato existente. La disponibilidad se deriva de `stock > 0`, por lo que una cantidad cero se muestra como «Sin stock».

La incorporación utiliza el reducer con actualizaciones inmutables e identificadores únicos. Al completarse, el artículo aparece tanto en la tabla como en el catálogo y su categoría queda disponible en el filtro. Se controlan los estados de carga, error y lista vacía; el ingreso solo se habilita tras una carga inicial válida.

Las sucursales se cargan y validan por separado desde `public/data/sucursales.json`. El archivo conserva cuatro registros; la interfaz muestra únicamente los tres activos.

## Tailwind CSS

El plugin `@tailwindcss/vite` integra el framework con Vite. `src/tailwind.css` importa tema y utilidades con el prefijo `tw:`, sin activar Preflight. La detección de clases está limitada expresamente a `MenuInventario`, `FormularioArticulo`, `TablaInventario`, `FiltroCategoria`, `DetalleArticulo`, `Carrito`, `LineaCarrito` y `ControlesCantidad`.

Las utilidades controlan la distribución y el espaciado del menú y formulario, la alineación adaptable del botón y el ancho y desplazamiento horizontal de la tabla, el filtro y la presentación del detalle. El CSS propio conserva colores, tipografía, estados activos, mensajes y foco visible. Las reglas sustituidas se retiraron de `inventario.css` para evitar conflictos de cascada; `index.css` permanece intacto.

## Alcance y límites

Los artículos incorporados no se escriben en el JSON ni se almacenan en `localStorage`, `sessionStorage`, una base de datos o un servidor. Su conservación depende de la instancia de la aplicación en memoria.

El formulario de contacto valida nombre, correo, asunto y mensaje; **no envía mensajes ni guarda la información**. Sus campos se reinician al abandonar la página.

No se implementan edición de artículos, eliminación de productos, finalización de compras, ventas, autenticación ni servicios externos. El carrito reserva y devuelve unidades en memoria desde su página propia, sin proceso de compra. La validación visual se realizó en Chrome sobre Windows; las comprobaciones de accesibilidad son parciales. No hay un despliegue configurado.

## Repositorio

Repositorio: [Despensa Verde en GitHub](https://github.com/STGO-SV/supermercado-santiago-saez-pfy2202).

La rama `semana-1` conserva la entrega de Semana 1. La continuidad funcional y visual de Semana 2 se conserva en `semana-2`. Las mejoras de retroalimentación de Semana 1 se incorporan en `semana-3`; no constituyen la implementación de futuros requisitos académicos de Semana 3.

Para un alojamiento con `BrowserRouter` se debe configurar la resolución de rutas SPA hacia `index.html` y revisar `base` si se publica bajo una subcarpeta.

## Pruebas y documentación

Para repetir las comprobaciones automáticas del proyecto:

```powershell
npm test
npm run lint
npm run format:check
npm run build
```

Las 104 pruebas automáticas cubren los datos originales, validaciones, normalización, construcción de artículos, transiciones del reducer, títulos, control de reintentos, filtro de inventario, selección de artículos y conservación de unidades entre inventario y carrito, cálculos exactos de importes y renderizado de la interfaz. Las comprobaciones de navegador se registran por separado y no forman parte de `npm test`; no existe una suite de navegador adicional instalada en el proyecto.

La validación histórica de Semana 2 registrada el 27 de octubre de 2026 incluye 35 pruebas unitarias, 35 comprobaciones de navegador en desarrollo y cinco de producción local, todas satisfactorias. Las nueve comparaciones visuales de las páginas originales y las seis demostraciones del efecto de utilidades están incluidas en las 35 comprobaciones de desarrollo.

### Semana 2

- [Etapa 1: estado global e ingreso de artículos](docs/informe-semana-2-etapa-1.md).
- [Etapa 1: protocolo de pruebas y reproducción](docs/pruebas-semana-2-etapa-1.md).
- [Etapa 1: resultados de navegador](docs/evidencia/semana-2/etapa-1-navegador.json).
- [Etapa 2: integración de Tailwind, validación y referencias de evidencias](docs/informe-semana-2-etapa-2.md).
- [Etapa 2: resultados de navegador e inspección de estilos](docs/evidencia/semana-2/etapa-2/validacion.json).
- [Etapa 2: resultados de producción local](docs/evidencia/semana-2/etapa-2/produccion.json).
- [Etapa 2: capturas y base de comparación visual](docs/evidencia/semana-2/etapa-2/).

Los informes describen el estado y los resultados de cada etapa en su fecha de ejecución. Las comprobaciones posteriores a Tailwind se encuentran en el informe de la Etapa 2.

### Semana 1 histórica

- [Protocolo de 18 pruebas manuales](docs/pruebas-manuales-semana-1.md).
- [Informe de implementación y comprobaciones](docs/informe-implementacion-semana-1.md).

La validación manual de Semana 1 registró 18 pruebas aprobadas el 22 de octubre de 2026. Sus resultados y las comprobaciones técnicas anteriores se conservan en los documentos históricos; no se presentan como nuevas ejecuciones de Semana 2.

### Mejoras de retroalimentación de Semana 1

El layout actualiza el título con React Router. Productos y sucursales ofrecen «Reintentar» solo ante un error; durante la solicitud se muestra el estado de carga. Se bloquean solicitudes simultáneas, se cancelan cargas desmontadas y se descartan sus respuestas tardías. Una carga satisfactoria cierra la operación y evita reemplazar las altas en memoria.

La comprobación del 31 de octubre de 2026 y la relación de archivos se documentan en el [informe de mejoras](docs/mejoras-retroalimentacion-semana-1.md). Las capturas históricas con identidad y encabezados anteriores se identifican en la sección I del informe de Semana 1; no se han reemplazado ni alterado sus resultados.

### Semana 3 Etapa 1

El filtro de `/inventario` deriva sus categorías de todos los artículos actuales y no modifica la lista compartida. Cada nombre enlaza con `/articulos/:id`. El detalle presenta los atributos del artículo, su disponibilidad y las unidades reservadas; permite incorporar una unidad mientras exista stock. Los identificadores desconocidos muestran un estado específico y el detalle conserva carga, error y reintento.

El estado añade `carrito: [{ productoId, cantidad }]` y `avisoCarrito`. El contexto expone `agregarAlCarrito`, `incrementarCantidad`, `disminuirCantidad` y `articulosCarrito` como información derivada. Agregar o incrementar descuenta existencias; disminuir las devuelve y elimina la línea al llegar a cero. El reducer valida cantidades e identificadores sobre el estado vigente. La suma de unidades disponibles y reservadas se conserva para cada artículo. Una recarga restaura la semilla y vacía el carrito.

La comprobación del 3 de noviembre de 2026 comprende 72 pruebas unitarias aprobadas y 33 escenarios de navegador registrados por separado. Se mantienen `BrowserRouter`, las dependencias y la configuración de Vite. Al cierre de Etapa 1, la página `/carrito` y los controles visuales de incremento y disminución quedaban pendientes para Etapa 2. Su integración posterior se registra en la sección siguiente.

- [Arquitectura, archivos, pruebas, límites y pendientes de Etapa 1](docs/informe-semana-3-etapa-1.md).
- [Resultados de navegador y medidas de las vistas nuevas](docs/evidencia/semana-3/etapa-1/navegador.json).

Las mejoras de retroalimentación de Semana 1 se mantienen como antecedentes separados de estas nuevas funcionalidades sumativas. Los informes y evidencias históricos permanecen sin alteraciones.

### Semana 3 Etapa 2

La página `/carrito` presenta cada artículo con enlace al detalle, precio unitario CLP, cantidad, subtotal y existencias adicionales. Los controles usan `incrementarCantidad` y `disminuirCantidad` del contexto existente. Al llegar a cero se elimina la línea y se devuelve el stock; sin existencias se bloquea el incremento. Se conserva el foco en un control disponible o en el encabezado del carrito vacío.

Subtotales y total se calculan en cada render, sin añadir estado. La proyección utiliza `BigInt` para mantener importes exactos incluso cuando el producto de precio y cantidad supera el límite seguro de `Number`. Se reutiliza el formato CLP existente. El menú secundario incorpora Carrito y su título es «Carrito | Despensa Verde».

La validación del 3 de noviembre de 2026 registra 84 pruebas automáticas aprobadas —72 existentes y 12 nuevas— y 42 escenarios de navegador satisfactorios. Las nuevas pruebas incluyen renderizado real de componentes mediante React DOM Server y Vite, sin bibliotecas adicionales. Las interacciones y la gestión de foco se verifican en navegador.

- [Informe técnico de Etapa 2](docs/informe-semana-3-etapa-2.md).
- [Protocolo de pruebas de Etapa 2](docs/pruebas-semana-3-etapa-2.md).
- [Resultados y evidencias de navegador](docs/evidencia/semana-3/etapa-2/).

Se conservan el reducer, el modelo de productos, `BrowserRouter`, las dependencias y la configuración de Vite. La publicación en GitHub Pages permanece pendiente de una fase posterior.

### Carrito directo desde el catálogo

Las tarjetas de Inicio reutilizan `ControlesCantidad` en una variante compacta con orden `− contador +`. El contador se deriva de las líneas del carrito; el incremento utiliza `agregarAlCarrito` y el decremento utiliza `disminuirCantidad`. No se almacenan cantidades locales ni se requiere navegar a Inventario o Detalle.

El decremento se deshabilita en cero y el incremento al agotarse el stock. Se conservan nombres accesibles, anuncio de cantidad, foco visible y continuidad del foco al deshabilitar un botón. Los filtros y cambios de página mantienen las cantidades compartidas; recargar restablece el inventario inicial y los doce contadores cero.

La comprobación previa a la uniformación del orden registró el 3 de noviembre de 2026 un total de 94 pruebas automáticas aprobadas —84 conservadas y diez nuevas— y 29 escenarios de navegador. Estos resultados corresponden al diseño anterior `+ contador −`. El [informe del ajuste](docs/ajuste-catalogo-carrito.md) describe los archivos afectados, la reutilización y los resultados. Las evidencias se guardan en `docs/evidencia/semana-3/catalogo-carrito/`; las de Etapa 2 permanecen sin cambios.

### Categoría comercial y venta por unidades

El formulario solicita «Categoría», «Precio por unidad en CLP» y «Cantidad disponible en unidades». Inventario y Detalle presentan la categoría comercial mediante `categoria`; las tarjetas indican «CLP por unidad». Todas las operaciones reservan y devuelven unidades enteras. Los pesos y volúmenes incluidos en nombres describen la presentación del producto.

La semilla define `categoria`; el estado normalizado conserva `tipo` como alias de compatibilidad. No se añade un concepto de unidad de venta ni se migra el contrato. La validación mantiene el rechazo de existencias negativas o fraccionarias.

La comprobación del ajuste de categoría y unidades, anterior a la uniformación del orden, registró el 3 de noviembre de 2026 un total de 102 pruebas automáticas aprobadas —94 conservadas y ocho nuevas— y 24 escenarios de navegador. El [informe de categoría y unidades](docs/ajuste-categoria-unidades.md) detalla los hallazgos, cambios y resultados. La revisión manual integral permanece pendiente desde la Prueba 5; estas comprobaciones específicas no sustituyen su continuación.

### Orden uniforme de cantidad

Catálogo y Carrito utilizan el mismo orden visual y de teclado `− cantidad +`. La variante compacta conserva únicamente el número visible; en Carrito la etiqueta «Cantidad» se muestra encima y fuera del grupo de botones. Se mantienen el contador derivado del contexto, los bloqueos y la gestión del foco.

La validación del 3 de noviembre de 2026 registra 104 pruebas aprobadas —las 102 existentes con sus expectativas de presentación actualizadas y dos casos adicionales— y 25 comprobaciones nuevas de navegador. El [informe de uniformación](docs/uniformacion-controles-cantidad.md) distingue esta ejecución de los registros anteriores al cambio de orden. Las capturas y resultados históricos permanecen intactos.
