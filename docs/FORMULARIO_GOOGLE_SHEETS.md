# Conectar el formulario a Google Sheets

1. Crea una hoja de cálculo en Google Sheets.
2. Ve a `Extensiones > Apps Script`.
3. Borra el contenido del editor y pega el código de `docs/google-sheets-rsvp.gs`.
4. Guarda el proyecto.
5. Ve a `Implementar > Nueva implementación`.
6. En tipo selecciona `Aplicación web`.
7. Configura:
   - Ejecutar como: `Yo`
   - Quién tiene acceso: `Cualquier persona`
8. Da clic en `Implementar` y autoriza los permisos.
9. Copia la URL de la aplicación web.
10. Pega esa URL en `.env.local`:

```bash
VITE_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID/exec
```

Después de eso, cada envío del formulario se agregará como una fila en la pestaña `Confirmaciones`.
