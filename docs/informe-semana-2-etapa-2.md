# Integración de Tailwind CSS y validación

PFY2202 · Experiencia 1 · Semana 2 · Forma B · Despensa Verde

Fecha de ejecución: 27 de octubre de 2026.

Se integró Tailwind CSS en el menú secundario, el formulario de ingreso y la tabla de inventario. La aplicación conserva el estado global, las incorporaciones y la navegación de la etapa anterior. El efecto del framework se comprobó mediante estilos calculados, retirada y restauración temporal de clases, capturas y una comprobación de la compilación de producción.

## Base funcional y estado Git

Antes de modificar los estilos se repitieron `npm test`, `npm run lint`, `npm run format:check` y `npm run build`. Las 35 pruebas unitarias y los tres controles de calidad finalizaron satisfactoriamente. Se registraron además estilos y capturas de Inicio, Nuestras tiendas y Contáctanos a 375, 768 y 1366 px como base de comparación.

La implementación funcional de la Etapa 1 quedó registrada en el commit local `02d9fd8`, con el mensaje `Implementa estado global e ingreso de artículos de Semana 2`. La rama activa es `semana-2`; `main` conserva `8d4de1f`. Los cambios de integración CSS y las evidencias de esta etapa permanecen sin commit. No se realizaron fusiones ni publicaciones remotas.

La documentación y las evidencias de Semana 1, así como el informe y el protocolo de la Etapa 1, permanecen como registros históricos sin modificaciones retrospectivas.

## Dependencias y configuración

| Herramienta         | Versión comprobada | Función                              |
| ------------------- | ------------------ | ------------------------------------ |
| `tailwindcss`       | `4.3.3`            | Generación de utilidades CSS.        |
| `@tailwindcss/vite` | `4.3.3`            | Integración del compilador con Vite. |
| Vite                | `8.3.5`            | Desarrollo y compilación existentes. |
| Node.js             | `24.11.0`          | Entorno de ejecución comprobado.     |
| npm                 | `11.20.0`          | Instalación y archivo de bloqueo.    |

Las dos dependencias nuevas se instalaron como dependencias de desarrollo con versiones exactas:

```powershell
npm install --save-dev --save-exact tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
```

Se consultaron las etiquetas estables del registro de npm antes de la instalación. El plugin declara compatibilidad con Vite `^5.2.0 || ^6 || ^7 || ^8`. La comparación del archivo de bloqueo confirmó que no cambiaron los registros de paquetes preexistentes; se añadieron las dependencias del framework y sus dependencias transitivas.

En `vite.config.js` se incorporó `tailwindcss()` junto con `react()`, siguiendo la [integración oficial con Vite](https://tailwindcss.com/docs/installation/using-vite).

El nuevo archivo `src/tailwind.css` importa exclusivamente tema y utilidades:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme) prefix(tw);
@import 'tailwindcss/utilities.css' layer(utilities) prefix(tw) source(none);

@source './components/MenuInventario.jsx';
@source './components/FormularioArticulo.jsx';
@source './components/TablaInventario.jsx';
```

No se importa Preflight. La declaración de la capa `base` establece el orden de capas y no aplica por sí misma un reinicio de estilos. La [documentación oficial de Preflight](https://tailwindcss.com/docs/preflight) contempla la importación parcial y el prefijo tanto para el tema como para las utilidades.

`source(none)` deshabilita la detección automática y las tres directivas `@source` delimitan los componentes que generan utilidades. Este mecanismo corresponde a la [detección explícita de clases](https://tailwindcss.com/docs/detecting-classes-in-source-files). No se añadieron configuraciones de PostCSS, plugins de formularios ni bibliotecas visuales adicionales.

## Uso efectivo y cascada

| Componente           | Utilidades aplicadas                                                                        | Responsabilidad conservada en CSS propio                                         |
| -------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `MenuInventario`     | `tw:flex`, `tw:flex-wrap`, separación, márgenes, relleno, bordes, radio y peso tipográfico. | Fondo verde claro, borde de la navegación y colores de la ruta activa.           |
| `FormularioArticulo` | `tw:grid`, `tw:gap-5`, `tw:mt-6`, `tw:m-0` y alineación adaptable del botón.                | Campos, botones, mensajes y foco visible compartidos con la identidad existente. |
| `TablaInventario`    | `tw:w-full`, `tw:min-w-[56rem]`, `tw:border-collapse`, alineación y tamaño de texto.        | Cabecera, celdas, colores, bordes y separación interna.                          |
| Contenedor de tabla  | `tw:max-w-full`, `tw:overflow-x-auto`.                                                      | Contorno visible al recibir foco.                                                |

Se identificó que las reglas de autor sin capa de `inventario.css` tendrían prioridad sobre las utilidades situadas en capas. Se retiraron las declaraciones sustituidas por Tailwind, en lugar de duplicarlas o añadir `!important`. Los colores de la ruta activa conservan deliberadamente su prioridad sobre el borde transparente del enlace. Este tratamiento mantiene la identidad del proyecto y evita que las utilidades queden sin efecto. La [documentación de estilos personalizados](https://tailwindcss.com/docs/adding-custom-styles) describe la combinación de CSS propio y capas del framework.

El prefijo evita colisiones con nombres existentes como `.container`. La hoja original `src/index.css` permanece intacta. El formulario de contacto, las sucursales, las tarjetas y la lógica de estado global no se modificaron.

## Demostración de estilos calculados

Se retiró temporalmente una clase de cada elemento durante la inspección, se midió la propiedad y se restauró la clase. Las seis comprobaciones resultaron satisfactorias y se guardaron las reglas CSS coincidentes.

| Elemento y clase                 | Con Tailwind                | Sin esa clase               |
| -------------------------------- | --------------------------- | --------------------------- |
| Lista del menú, `tw:flex`        | `display: flex`             | `display: block`            |
| Formulario, `tw:grid`            | `display: grid`             | `display: block`            |
| Formulario, `tw:gap-5`           | `gap: 20px`                 | `gap: normal`               |
| Contenedor, `tw:overflow-x-auto` | `overflow-x: auto`          | `overflow-x: visible`       |
| Tabla, `tw:min-w-[56rem]`        | `min-width: 896px`          | `min-width: 0px`            |
| Tabla, `tw:border-collapse`      | `border-collapse: collapse` | `border-collapse: separate` |

Estas mediciones demuestran un efecto real del framework. La compilación generada también contiene las utilidades y se comprobó su aplicación mediante `vite preview`.

## Resultados ejecutados

| Comprobación                             | Resultado                                                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                               | 35 aprobadas; cero fallos, cancelaciones y omisiones.                                                                                          |
| `npm run lint`                           | Finalización satisfactoria, sin errores.                                                                                                       |
| `npm run format:check`                   | Formato correcto.                                                                                                                              |
| `npm run build`                          | Compilación satisfactoria con Vite 8.3.5.                                                                                                      |
| Navegador en desarrollo                  | 35 comprobaciones aprobadas con Chrome 156.0.8078.48.                                                                                          |
| Compilación de producción local          | Cinco comprobaciones aprobadas con el mismo navegador mediante `vite preview`, a 375 px.                                                       |
| Comparación visual de páginas originales | Nueve combinaciones con estilos calculados y capturas idénticos antes y después de Tailwind. Incluidas en las 35 comprobaciones de desarrollo. |
| `git diff --check`                       | Sin errores de espacios en los cambios rastreados.                                                                                             |

Las 35 comprobaciones de desarrollo incluyen nueve comparaciones visuales, seis demostraciones del efecto de utilidades y veinte escenarios de funcionamiento, adaptación y control de errores. No se suman las repeticiones como casos distintos.

Se comprobaron incorporaciones válidas, cinco errores del formulario vacío, espacios, valores negativos y decimales, actualización de tabla y catálogo, nuevas categorías, búsqueda, cantidad cero, identificadores únicos, historial, selección activa, recarga sin persistencia, contacto, sucursales y 404. También se verificaron semilla vacía, HTTP 404, fallo de red, JSON mal formado, registros inválidos y carga pendiente. No se registraron excepciones de JavaScript.

A 375, 768 y 1366 px se comprobó ausencia de desbordamiento horizontal del documento, acceso al contenido por teclado, foco visible y acceso al botón al final del formulario por encima del menú inferior. En móvil y tableta se desplazó la tabla con la tecla de flecha y se alcanzó su última columna dentro del contenedor. El contorno de foco conserva el color `#ad5b00` y un grosor de 3 px.

Las cinco comprobaciones de producción verificaron utilidades compiladas, formulario inválido, alta válida y tabla, actualización y búsqueda en catálogo, y recarga con retorno a doce productos. No sustituyen una validación en alojamiento remoto.

## Evidencias

Todas las evidencias de esta etapa se encuentran en `docs/evidencia/semana-2/etapa-2/`:

- `base-visual-etapa-1.json`: estilos calculados y huellas SHA256 registrados antes de modificar los estilos.
- `validacion.json`: 35 resultados, nueve comparaciones SHA256 antes/después, seis inspecciones de utilidades con sus reglas CSS y registro de excepciones vacío.
- `produccion.json`: cinco resultados de la compilación servida localmente.
- `ingreso-*.png`, `inventario-*.png`: nuevas páginas a 375, 768 y 1366 px.
- `foco-ingreso-*.png`, `boton-ingreso-*.png`, `inventario-desplazado-*.png`: foco, acceso al botón y desplazamiento de tabla en los tres anchos.
- `alta-confirmada-1366.png`, `alta-en-tabla-1366.png`: confirmación y artículo incorporado.
- `inicio-*.png`, `tiendas-*.png`, `contacto-*.png`: capturas de las páginas originales a 375 y 1366 px.

Las capturas representativas de foco, botón, tabla desplazada y alta fueron revisadas visualmente. Las nueve comparaciones de las páginas originales incluyen también 768 px y sus huellas se conservan en los registros JSON.

## Archivos afectados

| Archivo                                 | Cambio                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `package.json`, `package-lock.json`     | Dependencias exactas de Tailwind y resolución reproducible.                         |
| `vite.config.js`                        | Plugin oficial de Tailwind.                                                         |
| `src/tailwind.css`                      | Nueva hoja de tema y utilidades prefijadas, sin Preflight y con fuentes explícitas. |
| `src/main.jsx`                          | Importación de la nueva hoja.                                                       |
| `src/components/MenuInventario.jsx`     | Utilidades del menú secundario.                                                     |
| `src/components/FormularioArticulo.jsx` | Utilidades de distribución, espaciado y botón adaptable.                            |
| `src/components/TablaInventario.jsx`    | Utilidades de tabla y contenedor responsivo.                                        |
| `src/inventario.css`                    | Retirada de 44 líneas correspondientes a reglas sustituidas por utilidades.         |
| `docs/informe-semana-2-etapa-2.md`      | Informe independiente de integración y validación.                                  |
| `docs/evidencia/semana-2/etapa-2/`      | Registros y capturas de esta etapa.                                                 |

## Problemas resueltos y límites técnicos

La integración resolvió la prioridad de reglas CSS duplicadas retirando las declaraciones migradas. Se evitó el reinicio global de Preflight y se mantuvieron las reglas visuales y de accesibilidad existentes. No se detectaron regresiones funcionales ni diferencias visuales en las nueve comparaciones de las páginas originales.

La validación de navegador se ejecutó en Chrome sobre Windows. No se ejecutaron comprobaciones en Firefox, Safari ni dispositivos físicos. Tailwind 4 depende de navegadores modernos; la [compatibilidad oficial](https://tailwindcss.com/docs/compatibility) establece sus requisitos. Las comprobaciones de teclado y foco son parciales y no constituyen una certificación completa de accesibilidad.

La tabla mantiene desplazamiento horizontal propio en pantallas estrechas. La lista de fuentes de Tailwind está acotada: nuevos componentes que requieran utilidades deberán registrarse expresamente. Las comprobaciones de navegador corresponden a ejecuciones de validación y no a una suite adicional instalada en el proyecto.

Los artículos siguen existiendo únicamente en memoria y se pierden al recargar. No se incorporaron funcionalidades adicionales ni persistencia. Para un alojamiento remoto con `BrowserRouter` sigue siendo necesaria la resolución de rutas SPA hacia `index.html`.

## Correspondencia con la pauta

| Criterio                                                | Evidencia técnica                                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1. Navegación y gestión de estados con React, 40 puntos | Funcionalidad de la Etapa 1 conservada y comprobada en desarrollo y producción local.                                |
| 2. Uso de framework CSS, 20 puntos                      | Tailwind instalado, integrado y utilizado; seis mediciones de efecto real y comprobación de utilidades compiladas.   |
| 6. Respuesta a los requerimientos definidos, 40 puntos  | Formulario, estado compartido, tabla, menú, rutas y framework CSS implementados; regresión y evidencias registradas. |

La correspondencia describe la implementación y sus comprobaciones; no asigna una calificación.
