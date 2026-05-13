# Configurar Supabase para RSVP y Dashboard

1. Crea un proyecto en Supabase.
2. Ve a `SQL Editor`.
3. Ejecuta el contenido de `docs/supabase-rsvps.sql`.
4. Ve a `Project Settings > API`.
5. Copia:
   - `Project URL`
   - `anon public key`
6. Crea un archivo `.env.local` en la raíz del proyecto.
7. Pega tus valores ahí:

```bash
VITE_ADMIN_PASSWORD=tu_contrasena_admin
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_SUPABASE_TABLE=rsvps
```

Con eso:

- El formulario guardará respuestas en `public.rsvps`.
- La pantalla oculta `#admin` leerá esa misma tabla.
- El acceso desde la invitación está al final, en el texto discreto `MEGAN`.

Nota: esta protección por contraseña vive en el frontend. Para venderlo como producto real, conviene mover el dashboard a una zona autenticada con Supabase Auth o protegerlo desde un backend.
