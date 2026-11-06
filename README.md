# Despensa Verde — Supermercado

Proyecto académico de **Desarrollo Frontend II (PFY2202), Experiencia 1, Semanas 1 a 3, Forma B**.

SPA para consultar un catálogo de productos de un supermercado ficticio, incorporar artículos, revisar el inventario, consultar detalles, reservar unidades en un carrito en memoria, conocer sus sucursales activas y validar un formulario de contacto demostrativo.

## Funcionalidades

- Estado global de productos y carrito mediante React Context y `useReducer`, compartido entre catálogo, ingreso de artículos, inventario, detalle y carrito.
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

Requiere Node.js **22 desde 22.22.0 dentro de esa serie, o 24 o superior**, y npm, conforme a los rangos de React Router, Vite y ESLint instalados. El entorno comprobado utiliza Node.js **24.11.0** y npm **11.20.0**. Las versiones resueltas se fijan mediante `package-lock.json`.

## Instalación y ejecución

Desde la carpeta `DFE_II_supermercado` de la rama `main`:

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

La vista previa se consulta en <http://127.0.0.1:4173/supermercado-santiago-saez-pfy2202/>. Este procedimiento sirve la compilación local de `dist/`; no publica la aplicación.

## Comandos

| Comando                | Propósito                                                      |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                         |
| `npm run lint`         | Revisión ESLint                                                |
| `npm run format`       | Aplicar formato                                                |
| `npm run format:check` | Comprobar formato                                              |
| `npm test`             | 123 pruebas automáticas con el ejecutor incorporado de Node.js |
| `npm run build`        | Generar producción en `dist/`                                  |
| `npm run preview`      | Revisar localmente la compilación                              |

## Estructura

```text
public/data/       Semillas de productos y sucursales
src/context/      Contexto y proveedor de productos
src/reducers/     Carga, error, altas y transferencias entre stock y carrito
src/components/   Catálogo, formularios, tabla, controles, menú y selección de router
src/hooks/        Acceso al contexto de productos y carga de sucursales
src/layouts/      Encabezado, contenido y ambos menús
src/pages/        Inicio, tiendas, contacto, ingreso, inventario, detalle, carrito y 404
src/utils/        Validaciones, carga, filtros, movimientos, importes y títulos
src/index.css     Estilos originales responsivos
src/inventario.css Estilos específicos de inventario
src/tailwind.css  Tema y utilidades prefijadas de Tailwind, sin Preflight
tests/            Datos, validaciones, estado, carrito, renderizado y compilación
.github/workflows/ Validación y publicación preparada de main en GitHub Pages
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

El menú inferior conserva Inicio, Nuestras tiendas y Contáctanos. El menú secundario permite abrir Ingresar artículos, Ver inventario y Carrito. Ambos señalan su ruta activa; React Router gestiona los cambios sin recargar el documento.

## Datos y estado global

Los productos iniciales, precios, existencias, sucursales y direcciones son demostrativos. `ProductosProvider` carga `public/data/productos.json` mediante `fetch()`, valida la lista y la normaliza antes de incorporarla al estado global. El proveedor permanece montado al cambiar de ruta; el catálogo y la tabla consumen la misma lista, sin cargas independientes de productos.

Se conservan los campos originales `id`, `nombre`, `categoria`, `precio`, `stock` y `disponible`, con soporte adicional para `marca` y `tipo`. Los doce productos iniciales incluyen marcas exclusivamente ficticias y demostrativas por categoría: Campo Claro (Abarrotes), Valle Blanco (Lácteos), Fuente Viva (Bebidas), Brillo Sur (Limpieza) y Cuidado Austral (Higiene). La normalización conserva las marcas informadas y mantiene `marca: null` para registros históricos sin marca o con `null` explícito; Inventario y Detalle muestran «Sin información» cuando corresponde. La transformación establece explícitamente `tipo = categoria` sin modificar el JSON durante la carga.

Las altas requieren los cinco campos del formulario. Los textos se recortan y no pueden estar vacíos; precio y cantidad deben ser enteros seguros no negativos. La categoría informada se conserva en `categoria` y en su alias histórico `tipo`, conforme al contrato existente. La disponibilidad se deriva de `stock > 0`, por lo que una cantidad cero se muestra como «Sin stock».

Nombre, marca y categoría admiten letras y números Unicode, tildes, espacios horizontales y esta puntuación comercial: `. , ' ’ " & + % ° º ª ( ) / # : ® ™ × – — -`. Deben incluir al menos una letra o un número; se rechazan controles, saltos de línea, caracteres de formato invisible y contenido solo de puntuación. Se distingue ausencia de contenido de formato no admitido. Para evaluar el formato se usa una copia recortada y normalizada a NFC, sin modificar el Unicode almacenado más allá del recorte existente en las altas. No se utiliza NFKC ni se eliminan tildes. `textoValido` conserva la comprobación genérica de presencia para IDs y sucursales; `textoProductoValido` aplica exclusivamente el formato comercial. Se conservan las marcas históricas ausentes como `null` y las reglas numéricas originales.

La incorporación utiliza el reducer con actualizaciones inmutables e identificadores únicos. Al completarse, el artículo aparece tanto en la tabla como en el catálogo y su categoría queda disponible en el filtro. Se controlan los estados de carga, error y lista vacía; el ingreso solo se habilita tras una carga inicial válida.

Las sucursales se cargan y validan por separado desde `public/data/sucursales.json`. El archivo conserva cuatro registros; la interfaz muestra únicamente los tres activos.

## Tailwind CSS

El plugin `@tailwindcss/vite` integra el framework con Vite. `src/tailwind.css` importa tema y utilidades con el prefijo `tw:`, sin activar Preflight. La detección de clases está limitada expresamente a `MenuInventario`, `FormularioArticulo`, `TablaInventario`, `FiltroCategoria`, `DetalleArticulo`, `Carrito`, `LineaCarrito` y `ControlesCantidad`.

Las utilidades controlan la distribución y el espaciado del menú y formulario, la alineación adaptable del botón y el ancho y desplazamiento horizontal de la tabla, el filtro y la presentación del detalle. El CSS propio conserva colores, tipografía, estados activos, mensajes y foco visible. Las reglas sustituidas se retiraron de `inventario.css` para evitar conflictos de cascada; `index.css` permanece intacto.

## Alcance y límites

Los artículos incorporados no se escriben en el JSON ni se almacenan en `localStorage`, `sessionStorage`, una base de datos o un servidor. Su conservación depende de la instancia de la aplicación en memoria.

El formulario de contacto valida nombre, correo, asunto y mensaje; **no envía mensajes ni guarda la información**. Sus campos se reinician al abandonar la página.

No se implementan edición de artículos, eliminación de productos, finalización de compras, ventas, autenticación ni servicios externos. El carrito reserva y devuelve unidades en memoria desde su página propia, sin proceso de compra. La validación visual se realizó en Chrome sobre Windows; las comprobaciones de accesibilidad son parciales. La configuración de GitHub Pages está preparada para revisión; todavía no se ha activado ni verificado una publicación remota.

## Repositorio

Repositorio: [Despensa Verde en GitHub](https://github.com/STGO-SV/supermercado-santiago-saez-pfy2202).

La rama `semana-1` conserva la entrega de Semana 1. La continuidad funcional y visual de Semana 2 se conserva en `semana-2`. Las mejoras de retroalimentación de Semana 1 se incorporan en `semana-3`; no constituyen la implementación de futuros requisitos académicos de Semana 3.

`main` concentra la versión integrada de Semana 3 y es la única fuente admitida por el workflow de publicación. Las ramas históricas se conservan como referencias de sus entregas.

## Pruebas y documentación

### Validación de la versión actual

La aplicación dispone de **123 pruebas automatizadas aprobadas**, que comprueban la normalización y validación de datos, la política textual Unicode y sus límites, las operaciones del estado global, el inventario, el catálogo, el carrito, los cálculos de importes, el renderizado de componentes y la preparación de la compilación para GitHub Pages.

Para ejecutar las comprobaciones:

```powershell
npm test
npm run lint
npm run format:check
npm run build
```

La revisión manual de Semana 3 comprende **ocho pruebas aprobadas**, que abarcan incorporación y devolución de artículos, sincronización de existencias, filtros, navegación, teclado, adaptación responsiva, recuperación del estado inicial y regresión funcional.

Las pruebas automatizadas, las comprobaciones de navegador y las revisiones manuales corresponden a procedimientos distintos y no se suman entre sí. Los informes históricos conservan los resultados obtenidos durante cada etapa.

### Semana 1 — Implementación inicial

Se desarrollaron el catálogo de productos, las páginas de sucursales y contacto, la navegación SPA, los filtros iniciales y las funcionalidades básicas de accesibilidad y adaptación responsiva.

La revisión manual registró **18 pruebas aprobadas**.

**Documentación:**

- [Informe de implementación](docs/informe-implementacion-semana-1.md).
- [Protocolo de pruebas manuales](docs/pruebas-manuales-semana-1.md).

### Semana 2 — Estado global e integración de Tailwind

Se incorporaron el formulario de ingreso de artículos, la tabla de inventario y el estado compartido mediante React Context y `useReducer`. Posteriormente se integró Tailwind CSS, conservando los estilos propios y la presentación de las páginas anteriores.

**Documentación:**

- [Informe de implementación — Etapa 1](docs/informe-semana-2-etapa-1.md).
- [Protocolo de pruebas — Etapa 1](docs/pruebas-semana-2-etapa-1.md).
- [Integración de Tailwind CSS — Etapa 2](docs/informe-semana-2-etapa-2.md).

### Mejoras derivadas de la retroalimentación de Semana 1

Se corrigieron textos de la interfaz y se mejoraron los títulos de página y los mecanismos de recuperación ante errores de carga.

**Documentación:**

- [Informe de mejoras](docs/mejoras-retroalimentacion-semana-1.md).

### Semana 3 — Inventario interactivo y carrito

La implementación incorporó el filtro por categoría en Inventario, la navegación hacia el detalle de artículos y un carrito compartido con el estado global de productos.

El catálogo permite administrar directamente las cantidades mediante controles `− cantidad +`. Las reservas descuentan existencias y las devoluciones las restituyen. Los importes se calculan dinámicamente y el formulario de ingreso distingue explícitamente la categoría comercial y la venta por unidades.

Se verificó el funcionamiento de las rutas, las operaciones del carrito, los límites de stock, la navegación por teclado y la adaptación responsiva.

**Documentación:**

- [Informe técnico — Etapa 1](docs/informe-semana-3-etapa-1.md).
- [Informe técnico — Etapa 2](docs/informe-semana-3-etapa-2.md).
- [Protocolo de pruebas del carrito](docs/pruebas-semana-3-etapa-2.md).
- [Integración del carrito en el catálogo](docs/ajuste-catalogo-carrito.md).
- [Categoría comercial y venta por unidades](docs/ajuste-categoria-unidades.md).
- [Uniformación de controles de cantidad](docs/uniformacion-controles-cantidad.md).
- [Protocolo consolidado de ocho pruebas manuales](docs/pruebas-manuales-semana-3.md).

Las cifras y capturas de cada informe describen la implementación existente en el momento de su ejecución. Las modificaciones posteriores no alteran esos registros.

Las evidencias detalladas se conservan en `docs/evidencia/`, organizadas por semana y etapa.

## GitHub Pages desde main

Despensa Verde dispone de una configuración de despliegue automatizado mediante GitHub Actions, utilizando `main` como única rama de publicación.

La compilación de producción utiliza la subruta `/supermercado-santiago-saez-pfy2202/` y `HashRouter` para ofrecer navegación compatible con GitHub Pages. El desarrollo local conserva `BrowserRouter`.

El workflow ejecuta pruebas automatizadas, ESLint, Prettier y compilación antes de publicar. Si alguna validación falla, se interrumpe el despliegue.

**URL prevista:** https://stgo-sv.github.io/supermercado-santiago-saez-pfy2202/

**Estado:** configuración preparada y validada localmente; publicación remota pendiente de activación y verificación.

La aplicación no dispone de persistencia. Las reservas y artículos incorporados se pierden al recargar la página.

**Documentación:** [Configuración, validación y procedimiento de despliegue](docs/despliegue-github-pages.md).
