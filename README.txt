7a ¡Escala como puedas! — landing desde cero

Archivos incluidos:
- index.html
- styles.css
- script.js
- assets/

Uso:
1. Descomprime el ZIP.
2. Abre index.html en tu navegador.

Notas:
- El fondo usa la imagen de roca/cañón, no se deforma, no se repite y se desplaza lentamente con el scroll hasta mostrar su recorrido vertical.
- En “Cómo se juega” solo aparece “Ejemplo de juego”.
- El vídeo se abre con enlace directo a YouTube para evitar el Error 153 del iframe.
- Los CTA usan “Quiero mi juego”.
- Sustituye el href="#" del botón final por el enlace real de campaña cuando lo tengas.


Actualización: se ha sustituido el título superior por el logotipo proporcionado por el usuario, se ha cambiado el texto de la premisa a “Escalar o entrenar, esa es la cuestión.” y se ha reforzado la tipografía con un estilo más cómic.


Actualización dinámica:
- Todos los botones principales de “Quiero mi juego” enlazan a https://vkm.is/7a.
- Se han añadido animaciones de entrada, barra de progreso, CTA flotante, brillos, movimiento del logo y efectos tipo cómic.


Actualización: el vídeo ahora está embebido directamente en la página mediante reproductor de YouTube. Si se abre el HTML como archivo local y algún navegador lo bloquea, úsalo desde un servidor local o súbelo al hosting/crowdfunding para que se muestre correctamente.


Actualización crowdfunding + vídeo:
- Se ha añadido una sección para explicar que la campaña está en precampaña: todavía no es una compra, sino apuntarse para recibir el aviso.
- Los botones llevan a https://vkm.is/7a.
- Se explica el funcionamiento básico de Verkami: recompensas, apertura de campaña y modelo todo o nada.
- El vídeo está embebido en la página. Si no carga al abrir el index.html como archivo local, ejecuta abrir_servidor_local.bat en Windows o abrir_servidor_local.sh/.command en Mac/Linux y abre http://localhost:8000.


Corrección vídeo: el reproductor ahora se carga al pulsar “Reproducir vídeo aquí” y usa youtube-nocookie con parámetro origin cuando la web se abre desde servidor local u online. Para evitar el Error 153, no abras index.html como archivo local; usa abrir_servidor_local.bat/.sh/.command o publícalo en hosting.


Actualización solicitada:
- Los textos “Avísame” pasan a “!QUIERO MI JUEGO! AVISAME”.
- Se añade enlace a Instagram: https://www.instagram.com/7a.climb/
- Se elimina el texto explicativo sobre el Error 153 bajo el vídeo.
- El bloque “¿Por qué apuntarse antes?” se rediseña para ser más llamativo.
- El vídeo se deja como iframe directo estándar de YouTube dentro de la página.


Actualización seguidores: se ha añadido en la barra superior un contador visible con 123 personas siguiendo el proyecto en Verkami, enlazado a https://vkm.is/7a.


CONTADOR DE SEGUIDORES EN VERKAMI
---------------------------------
El número NO puede actualizarse solo desde un HTML estático abierto directamente, porque el navegador bloquea la lectura de Verkami desde otra web por CORS.

Esta versión incluye tres formas de actualización:
1. Local: abre `abrir_servidor_local.bat` en Windows o `abrir_servidor_local.sh` / `.command` en Mac/Linux. Ese servidor incluye `/api/verkami-followers`.
2. Netlify: sube la carpeta completa. La función está en `netlify/functions/verkami-followers.js`.
3. Vercel: sube la carpeta completa. La función está en `api/verkami-followers.js`.

Si no hay backend disponible, el contador muestra el último valor manual guardado en el HTML.


Actualización móvil: se han añadido reglas responsive/mobile-first para que la página se vea bien en teléfono, con cabecera compacta, navegación horizontal, CTA fijo inferior, secciones en una columna y vídeo adaptable.


Ajustes adicionales: se han eliminado los bursts “¡Entrena!” y “¡Escala!” sobre la portada para evitar fallos en móvil; se ha corregido el texto a “Escalar o entrenar, esa es la cuestión.”; y se ha añadido compatibilidad Netlify para que el contador de seguidores se actualice al abrir la página cuando esté publicada online.


Corrección contador: el parser ahora reconoce el texto real de Verkami en precampaña: “123 are already following it”. Sube la carpeta completa a Netlify para que la función /.netlify/functions/verkami-followers se despliegue y el contador se actualice al abrir la página.


Corrección final contador/ móvil:
- Se elimina el número fijo 123 del HTML. El contador empieza como “...” y se actualiza al cargar desde /.netlify/functions/verkami-followers.
- El parser reconoce el texto actual de Verkami en inglés: “122 are already following it”.
- Se elimina definitivamente “¡Entrena!” y “¡Escala!” sobre la portada.
- Se fuerza la portada inicial a ancho 100% y sin posición absoluta en móvil.

Para Netlify: sube los archivos de esta carpeta como raíz del repositorio, o configura Base directory = 7a_web_desde_cero si subes la carpeta completa. La función debe estar accesible en /.netlify/functions/verkami-followers.
