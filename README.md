# Despensa Verde — Supermercado

Proyecto académico de **Desarrollo Frontend II (PFY2202), Experiencia 1, Semanas 1 y 2, Forma B**.

SPA para consultar un catálogo de productos de un supermercado ficticio, incorporar artículos, revisar el inventario, conocer sus sucursales activas y validar un formulario de contacto demostrativo.

## Funcionalidades

- Estado global de productos mediante React Context y `useReducer`, compartido entre catálogo, ingreso de artículos e inventario.
- Formulario de incorporación con nombre, marca, tipo o categoría, precio CLP y cantidad disponible.
- Tabla de todos los artículos, incluidos aquellos sin stock.
- Catálogo con búsqueda que ignora mayúsculas y tildes, filtro por categoría y actualización al incorporar artículos.
- Menú secundario de inventario y conservación de la navegación inferior de Semana 1.
- Sucursales activas y formulario de contacto con validación sin envío.
- Estilos responsivos con CSS propio y Tailwind CSS, conservando la identidad Despensa Verde.

**Los artículos agregados se conservan exclusivamente en memoria durante la navegación. Al recargar la página o abrir una nueva instancia de la aplicación, se restablecen los doce productos del JSON inicial.**

## Tecnologías y requisitos

React 19, React Router 8, Vite 8 y JavaScript. Tailwind CSS **4.3.3** y `@tailwindcss/vite` **4.3.3** están instalados como dependencias de desarrollo con versiones exactas. ESLint revisa el código y Prettier mantiene su formato.

Requiere Node.js **22.22.0 o superior** y npm. El entorno comprobado utiliza Node.js **24.11.0** y npm **11.20.0**. Las versiones resueltas se fijan mediante `package-lock.json`.

## Instalación y ejecución

Desde la carpeta `DFE_II_supermercado` de la rama `semana-2`:

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

| Comando                | Propósito                                                   |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                      |
| `npm run lint`         | Revisión ESLint                                             |
| `npm run format`       | Aplicar formato                                             |
| `npm run format:check` | Comprobar formato                                           |
| `npm test`             | 35 pruebas unitarias con el ejecutor incorporado de Node.js |
| `npm run build`        | Generar producción en `dist/`                               |
| `npm run preview`      | Revisar localmente la compilación                           |

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

| Ruta                 | Contenido                                                                    |
| -------------------- | ---------------------------------------------------------------------------- |
| `/`                  | Catálogo inicial de 12 productos y altas de la sesión; búsqueda y categorías |
| `/nuestras-tiendas`  | Sucursales activas                                                           |
| `/contactanos`       | Formulario demostrativo                                                      |
| `/ingreso-articulos` | Formulario de incorporación de artículos                                     |
| `/inventario`        | Tabla de todos los productos del estado global                               |
| Cualquier otra ruta  | Página 404 con regreso al inicio                                             |

El menú inferior conserva Inicio, Nuestras tiendas y Contáctanos. El menú secundario permite abrir Ingresar artículos y Ver inventario. Ambos señalan su ruta activa; React Router gestiona los cambios sin recargar el documento.

## Datos y estado global

Los productos iniciales, precios, existencias, sucursales y direcciones son demostrativos. `ProductosProvider` carga `public/data/productos.json` mediante `fetch()`, valida la lista y la normaliza antes de incorporarla al estado global. El proveedor permanece montado al cambiar de ruta; el catálogo y la tabla consumen la misma lista, sin cargas independientes de productos.

Se conservan los campos originales `id`, `nombre`, `categoria`, `precio`, `stock` y `disponible`, con soporte adicional para `marca` y `tipo`. En los doce registros originales, la marca se representa con `null` y la tabla muestra «Sin información». La transformación establece explícitamente `tipo = categoria`; no modifica el JSON ni inventa marcas.

Las altas requieren los cinco campos del formulario. Los textos se recortan y no pueden estar vacíos; precio y cantidad deben ser enteros seguros no negativos. El tipo informado se asigna también a categoría. La disponibilidad se deriva de `stock > 0`, por lo que una cantidad cero se muestra como «Sin stock».

La incorporación utiliza el reducer con actualizaciones inmutables e identificadores únicos. Al completarse, el artículo aparece tanto en la tabla como en el catálogo y su categoría queda disponible en el filtro. Se controlan los estados de carga, error y lista vacía; el ingreso solo se habilita tras una carga inicial válida.

Las sucursales se cargan y validan por separado desde `public/data/sucursales.json`. El archivo conserva cuatro registros; la interfaz muestra únicamente los tres activos.

## Tailwind CSS

El plugin `@tailwindcss/vite` integra el framework con Vite. `src/tailwind.css` importa tema y utilidades con el prefijo `tw:`, sin activar Preflight. La detección de clases está limitada expresamente a `MenuInventario`, `FormularioArticulo` y `TablaInventario`.

Las utilidades controlan la distribución y el espaciado del menú y formulario, la alineación adaptable del botón y el ancho y desplazamiento horizontal de la tabla. El CSS propio conserva colores, tipografía, estados activos, mensajes y foco visible. Las reglas sustituidas se retiraron de `inventario.css` para evitar conflictos de cascada; `index.css` permanece intacto.

## Alcance y límites

Los artículos incorporados no se escriben en el JSON ni se almacenan en `localStorage`, `sessionStorage`, una base de datos o un servidor. Su conservación depende de la instancia de la aplicación en memoria.

El formulario de contacto valida nombre, correo, asunto y mensaje; **no envía mensajes ni guarda la información**. Sus campos se reinician al abandonar la página.

No se implementan edición, eliminación, compras, ventas, movimientos de inventario, autenticación ni servicios externos. La validación visual se realizó en Chrome sobre Windows; las comprobaciones de accesibilidad son parciales. No hay un despliegue configurado.

## Repositorio

Repositorio: [Despensa Verde en GitHub](https://github.com/STGO-SV/supermercado-santiago-saez-pfy2202).

La rama `main` conserva la entrega de Semana 1. La continuidad funcional y visual de Semana 2 se desarrolla en `semana-2`.

Para un alojamiento con `BrowserRouter` se debe configurar la resolución de rutas SPA hacia `index.html` y revisar `base` si se publica bajo una subcarpeta.

## Pruebas y documentación

Para repetir las comprobaciones automáticas del proyecto:

```powershell
npm test
npm run lint
npm run format:check
npm run build
```

Las 35 pruebas unitarias cubren los datos originales, validaciones, normalización, construcción de artículos y transiciones del reducer. Las comprobaciones de navegador se registran por separado y no forman parte de `npm test`; no existe una suite de navegador adicional instalada en el proyecto.

La última validación funcional registrada el 27 de octubre de 2026 incluye 35 pruebas unitarias, 35 comprobaciones de navegador en desarrollo y cinco de producción local, todas satisfactorias. Las nueve comparaciones visuales de las páginas originales y las seis demostraciones del efecto de utilidades están incluidas en las 35 comprobaciones de desarrollo.

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
