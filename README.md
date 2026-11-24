# Flor Infinita 🌸

Una flor de puntos luminosos que aparece poco a poco: primero espirales, después pétalos y finalmente una corona de encaje, como un mandala. Creada con **HTML, CSS y JavaScript puro** (Canvas 2D), sin bibliotecas.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `flor-infinita`.
2. Sube **index.html**, **style.css** y **script.js** a la raíz del repositorio (puedes incluir este README).
3. Ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)** y guarda.
5. Cuando GitHub termine de publicar verás una dirección parecida a: `https://TU-USUARIO.github.io/flor-infinita/`.

## Controles

- **Pausar / Continuar**: detiene o reanuda la animación.
- **Volver a florecer**: comienza desde cero.
- **Rosa / Lavanda / Aurora / Océano**: cambia entre cuatro combinaciones de colores.
- **0.75× / 1× / 1.5× / 2×**: cambia la velocidad.
- **Barra de progreso**: adelanta o retrocede hasta la etapa que quieras.
- **Toque o clic sobre la flor**: aparecen pequeños destellos.

## Personalizar

En `script.js`, modifica `DURATION = 28` para cambiar la duración en segundos. Para ajustar colores, edita `colorSchemes`. Para cambiar la intensidad de las flores, ajusta los parámetros de `petals(...)` en `buildGeometry()`.

En `index.html` puedes cambiar las frases. En `style.css`, la tipografía, el fondo, y el diseño adaptable a celulares.

Nota: la tipografía web viene de Google Fonts. Si el dispositivo no tiene conexión, se muestran tipografías de respaldo; la animación continúa funcionando.
