# Despliegue de Despensa Verde en GitHub Pages

**Repositorio:** `STGO-SV/supermercado-santiago-saez-pfy2202`
**Rama de publicación:** `main`

## 1. Objetivo

Configurar el despliegue automatizado de Despensa Verde en GitHub Pages, conservando su funcionamiento como aplicación de página única (SPA) desarrollada con React y Vite.

La publicación utiliza `main` como única fuente de código. Antes de cada despliegue se ejecutan las validaciones automatizadas y la compilación de producción.

**URL pública comprobada:** https://stgo-sv.github.io/supermercado-santiago-saez-pfy2202/

La configuración está activa y el sitio remoto fue comprobado el 6 de noviembre de 2026. El cierre de publicación y sus evidencias se registran en la sección 10, separados de la preparación local de la sección 5.

## 2. Configuración de Vite

La compilación de producción utiliza la ruta base:

`/supermercado-santiago-saez-pfy2202/`

El servidor de desarrollo conserva `/` como base.

Esta configuración permite servir los recursos generados bajo la subruta del repositorio, sin depender de rutas absolutas del dominio.

Los archivos `productos.json` y `sucursales.json` se solicitan mediante `import.meta.env.BASE_URL`, manteniendo su acceso tanto en desarrollo como en producción.

El archivo `vite.config.js` centraliza la configuración correspondiente.

## 3. Enrutamiento

La aplicación utiliza React Router con dos configuraciones según el entorno:

| Entorno    | Router          | Comportamiento                                                      |
| ---------- | --------------- | ------------------------------------------------------------------- |
| Desarrollo | `BrowserRouter` | Rutas convencionales gestionadas por el servidor de desarrollo      |
| Producción | `HashRouter`    | Rutas internas mediante fragmentos `#` compatibles con GitHub Pages |

Ambos entornos comparten un único árbol de rutas.

Ejemplos de rutas públicas:

- Catálogo: `#/`
- Inventario: `#/inventario`
- Ingreso de artículos: `#/ingreso-articulos`
- Detalle: `#/articulos/p01`
- Carrito: `#/carrito`

El fragmento de la URL no se envía al servidor, lo que permite recargar las rutas internas sin requerir reglas adicionales de reescritura.

La página 404 de la aplicación gestiona rutas desconocidas dentro de `HashRouter`. Las direcciones físicas inexistentes fuera del fragmento continúan sujetas al comportamiento de GitHub Pages.

El enlace accesible «Saltar al contenido» utiliza gestión directa del foco, evitando interferencias con el fragmento empleado por el router.

## 4. Automatización con GitHub Actions

El workflow se define en:

`.github/workflows/deploy.yml`

Se ejecuta automáticamente ante cada push a `main` y admite ejecución manual mediante `workflow_dispatch`.

El proceso se divide en dos trabajos.

### Compilación y validación

1. Obtener el código del commit correspondiente.
2. Configurar Node.js 24.11.0.
3. Instalar dependencias mediante `npm ci`.
4. Ejecutar `npm test`.
5. Ejecutar `npm run lint`.
6. Ejecutar `npm run format:check`.
7. Ejecutar `npm run build`.
8. Comprobar `git diff --check` y `git diff --cached --check`.
9. Preparar `dist/` como artefacto de GitHub Pages.

Un fallo en las validaciones impide ejecutar el trabajo de publicación.

### Publicación

El segundo trabajo depende de la finalización satisfactoria del primero y publica el artefacto validado en el entorno `github-pages`.

Los permisos de escritura de Pages y generación del token de identidad están limitados al trabajo de despliegue.

Las acciones oficiales se referencian mediante hashes SHA. La configuración de concurrencia evita despliegues simultáneos.

No se requiere una rama adicional `gh-pages` ni un token personal de acceso.

## 5. Validación local

La preparación inicial del despliegue, anterior a la incorporación de marcas y validaciones Unicode de las Etapas A y B, fue sometida a las siguientes comprobaciones:

| Comprobación                  | Resultado                        |
| ----------------------------- | -------------------------------- |
| Pruebas automatizadas         | 108 aprobadas                    |
| ESLint                        | Satisfactorio                    |
| Prettier                      | Satisfactorio                    |
| Build de producción           | Satisfactorio                    |
| `git diff --check`            | Satisfactorio                    |
| Navegador en producción local | 29 comprobaciones satisfactorias |
| Navegador en desarrollo       | 6 comprobaciones satisfactorias  |
| Recursos HTTP                 | 5 respuestas 200                 |

Las comprobaciones abarcan navegación, títulos, filtros, inventario, detalle de artículos, carrito, reservas, devolución de existencias, formularios, rutas desconocidas y recargas internas.

Se verificó la carga de HTML, JavaScript, CSS y los archivos JSON de productos y sucursales desde la subruta de producción.

Las evidencias locales se conservan en:

`docs/evidencia/github-pages-local/`

Los resultados anteriores no constituyen una verificación de la publicación remota.

## 6. Activación de GitHub Pages

La fuente activa es **GitHub Actions**, con el entorno `github-pages` restringido exclusivamente a la rama `main`. Las acciones oficiales utilizadas están permitidas por la política existente, sin modificaciones de esa política ni eliminación de aprobaciones. El procedimiento reproducible es:

1. Abrir **Settings → Pages** en el repositorio.
2. Seleccionar **Build and deployment → Source: GitHub Actions**.
3. Comprobar que las políticas de Actions permitan ejecutar las acciones oficiales referenciadas.
4. Configurar, cuando corresponda, el entorno `github-pages` para admitir despliegues exclusivamente desde `main`.
5. Registrar y publicar la configuración aprobada en `main`.

El push correspondiente deberá iniciar la ejecución del workflow.

La opción de ejecución manual también estará disponible desde GitHub Actions, seleccionando la rama `main`.

## 7. Verificación de la publicación

La verificación remota del 6 de noviembre de 2026 cubrió los siguientes aspectos. Deben revisarse de nuevo cuando una actualización afecte su comportamiento:

- Carga correcta de la página principal y los recursos estáticos.
- Acceso a los doce productos originales.
- Visualización de las tres sucursales activas.
- Funcionamiento de los filtros y formularios.
- Navegación entre catálogo, inventario, detalle y carrito.
- Incorporación y devolución de unidades.
- Cálculo de subtotales y total.
- Funcionamiento de «Seguir comprando».
- Recarga de rutas internas con fragmentos.
- Presentación de la página 404.
- Ausencia de errores inesperados en consola y Network.
- Adaptación a resoluciones de 375, 768 y 1366 píxeles.

La publicación se verificó mediante 32 comprobaciones de navegador sobre la URL remota y cinco respuestas HTTP 200 de recursos públicos, además del resultado satisfactorio de ambos jobs. No se atribuyen estos resultados a las ejecuciones locales anteriores.

## 8. Limitaciones

La aplicación utiliza estado temporal en memoria.

Al recargar, el inventario recupera los datos originales, el carrito se vacía y desaparecen los artículos incorporados durante la sesión.

No existe sincronización de inventario entre dispositivos o sesiones, almacenamiento persistente, backend ni procesamiento de compras.

La publicación mediante GitHub Pages no modifica estas limitaciones funcionales.

## 9. Referencias técnicas

- [Vite — Despliegue de sitios estáticos](https://vite.dev/guide/static-deploy#github-pages)
- [GitHub — Workflows personalizados para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [React Router — HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)

## 10. Cierre de publicación del 6 de noviembre de 2026

El commit funcional publicado y comprobado es `98e73310357c5c5164dfa522583fc85031c48f8c`, «feat: integrar entrega semana 3 y despliegue GitHub Pages». Integra Semana 3, las marcas demostrativas de Etapa A, la validación Unicode de Etapa B, el protocolo de ocho pruebas manuales y la configuración de despliegue. Se publicaron 21 archivos revisados con rutas explícitas; las auditorías y evidencias internas quedaron excluidas y no estaban previamente rastreadas.

La [ejecución de publicación comprobada](https://github.com/STGO-SV/supermercado-santiago-saez-pfy2202/actions/runs/42263109680) terminó con `build: success` y `deploy: success`. La fuente de Pages es `workflow`, HTTPS está activo y la única política de rama del entorno corresponde a `main`. Las referencias históricas `semana-1`, `semana-2` y `semana-3` se conservan.

Antes de publicar se ejecutaron `npm ci`, `npm test`, `npm run lint`, `npm run format:check`, `npm run build`, `git diff --check` y `git diff --cached --check`. La batería registró 123 aprobadas y cero fallos, cancelaciones u omisiones; la compilación transformó 132 módulos. No se alteraron dependencias ni el archivo de bloqueo. El cierre documental posterior conserva el mismo código, semilla y recursos compilados; su commit se publica y se verifica de nuevo mediante el workflow de `main`. La revisión vigente del sitio corresponde al despliegue satisfactorio asociado al último commit publicado, consultable en [GitHub Actions de main](https://github.com/STGO-SV/supermercado-santiago-saez-pfy2202/actions?query=branch%3Amain).

### Evidencias remotas

- [Resultados de navegador](evidencia/github-pages-produccion/navegador.json): 32 comprobaciones remotas satisfactorias; no son otras 32 pruebas de `npm test`.
- [Respuestas de recursos](evidencia/github-pages-produccion/recursos.json): HTML, JS, CSS, productos y sucursales con HTTP 200, tamaño y SHA256. Los recursos coinciden con `dist/` local de la versión funcional comprobada.
- [Resultado de Actions y configuración](evidencia/github-pages-produccion/actions.json): commit, ejecución, jobs y restricción de rama verificados mediante la API de GitHub.
- [Carrito remoto](evidencia/github-pages-produccion/carrito-remoto.png): dos arroces reservados, stock 40 y total $2.980.
- [Catálogo remoto a 375 px](evidencia/github-pages-produccion/catalogo-remoto-375.png): controles, contenido y navegación en la publicación real.

Se comprobaron doce productos y las cinco marcas en JSON/Inventario, marca y stock en Detalle, búsqueda sin tildes, filtros, conservación de reservas al navegar, incrementos/decrementos, totales, agotamiento y devolución. Un alta temporal válida produjo trece artículos y una segunda línea del carrito; los textos comerciales inválidos mostraron errores asociados y foco en el primer campo. La prueba de contacto utilizó datos ficticios y confirmó su validación demostrativa sin envío.

Los enlaces directos `#/inventario`, `#/carrito` y `#/articulos/p01` conservaron la ruta tras recargar. Se restablecieron doce productos, stock 42 para arroz y carrito vacío; desapareció el alta temporal. La SPA resolvió su 404 y el título correspondiente. Se revisó Catálogo a 375, 768 y 1366 px, sin desbordamiento horizontal ni inversión del grupo de cantidad. La sesión de comprobación no registró errores ni advertencias de consola.

Durante la primera activación, la URL respondió con el 404 del alojamiento mientras el despliegue seguía en curso. Se repitió el acceso después del éxito de Actions; no se registró esa respuesta transitoria como un resultado aprobado de la aplicación. Una aserción del procedimiento de prueba de contacto se corrigió para utilizar su ID real `contacto-nombre`; no fue necesario cambiar código de aplicación.

### Observaciones pendientes y límites

`npm ci` finalizó correctamente. `npm audit --json` informó cuatro alertas moderadas relacionadas con `minimatch` y la cadena de desarrollo de ESLint (`eslint`, `@eslint/js`, `@eslint/config-array`), sin alertas altas o críticas en ese resultado. La recomendación automática supone cambios mayores; no se ejecutó `audit fix --force`. La revisión de dependencias queda como mantenimiento posterior, sin modificar la versión entregada. Referencia del aviso: [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

La validación publicada no certifica accesibilidad exhaustiva ni todos los navegadores. Se mantienen los límites de estado en memoria, ausencia de backend y contacto sin recepción. No se modificaron informes históricos para aparentar una publicación anterior.
