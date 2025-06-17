## Lietweet

Esta pequeña aplicación genera una vista previa de un tweet.

### Puter.js

Se utiliza [Puter.js](https://puter.com) para guardar la foto de perfil y el nombre a mostrar del usuario.
Al cargar la página se solicita iniciar sesión y se recuperan estos datos desde `puter.kv`.
Si ya existe una foto de perfil o nombre guardados, el formulario es más corto y aparecen botones en la esquina superior izquierda para reemplazarlos cuando se desee.
La configuración avanzada permite desactivar el ícono de verificación.
Las modificaciones se guardan de nuevo mediante `puter.kv`.
