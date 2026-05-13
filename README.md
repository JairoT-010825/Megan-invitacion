# Invitación web: Fiesta 80s de Megan

Proyecto listo para abrir en Antigravity, VS Code o cualquier IDE. Está hecho con **Vite + HTML/CSS/JavaScript moderno** para que cargue rápido, funcione bien en Android/iOS y se despliegue fácilmente en Vercel.

## Incluye

- Diseño responsive con temática neon de los 80s.
- Stickers flotantes en SVG: cassette, boombox, cubo retro, lentes, walkman, rayo, patín y arcade.
- Cuenta regresiva al evento.
- Formulario RSVP conectado a webhook o Supabase.
- Guardado local de confirmaciones en el dispositivo.
- Webhook opcional para mandar respuestas a Google Sheets.
- Dashboard admin oculto con lectura desde Supabase.
- Enlace interactivo a Google Maps.
- Mini juegos: memoria 80s y rompecabezas deslizante.
- Botón de compartir, modo fiesta, confetti y descarga de calendario `.ics`.
- Manifest PWA y service worker básico para cachear recursos.

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Luego abre la URL local que muestre Vite, normalmente `http://localhost:5173`.

## Variables privadas

No pegues API keys ni contraseñas en `src/config.js`. Crea un archivo `.env.local` en la raíz del proyecto. Ese archivo está ignorado por Git.

```bash
VITE_RSVP_WEBHOOK_URL=
VITE_ADMIN_PASSWORD=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_TABLE=rsvps
```

## Cómo desplegarlo en Vercel

1. Sube esta carpeta a GitHub.
2. En Vercel, crea un proyecto nuevo e importa el repositorio.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Publica el proyecto.

También puedes desplegar desde terminal:

```bash
npm install
npm run build
npx vercel
```

## Personalización rápida

Edita `src/config.js`:

```js
export const EVENT = {
  guestOfHonor: 'Megan',
  age: 11,
  dateTime: '2026-05-16T15:30:00-06:00',
  endDateTime: '2026-05-16T20:30:00-06:00',
  venue: 'Salón La Cabaña',
  address: 'Privada de la Fábrica la Trinidad, Cuautepec, Hgo.',
  whatsappPhone: '527751372847'
};
```

Si el año del evento cambia, ajusta `dateTime` y `endDateTime`.

## Opcional: guardar RSVP en Google Sheets

1. Crea una hoja de cálculo en Google Sheets.
2. Abre **Extensiones > Apps Script**.
3. Pega este script:

```js
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
  const data = JSON.parse(e.postData.contents || '{}');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre', 'Asistencia', 'Adultos', 'Niños', 'Canción', 'Mensaje']);
  }

  sheet.appendRow([
    new Date(),
    data.guestName || '',
    data.attendance || '',
    data.adults || 0,
    data.kids || 0,
    data.song || '',
    data.message || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Publica como **Implementar > Nueva implementación > Aplicación web**.
5. Acceso: **Cualquier usuario**.
6. Copia la URL de la aplicación web.
7. Pégala en `.env.local`:

```bash
VITE_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID/exec
```

El formulario guardará la respuesta en la hoja.

## Estructura del proyecto

```txt
megan-80s-invitacion/
├─ index.html
├─ package.json
├─ vercel.json
├─ README.md
├─ src/
│  ├─ config.js
│  ├─ main.js
│  └─ styles.css
└─ public/
   ├─ puzzle-board.svg
   ├─ manifest.webmanifest
   ├─ sw.js
   └─ stickers/
```

## Recomendación de edición

Para cambiar colores, revisa las variables CSS al inicio de `src/styles.css`. Para cambiar textos, fecha o dirección, edita `src/config.js`. Para claves, contraseñas y URLs privadas, usa `.env.local`.
