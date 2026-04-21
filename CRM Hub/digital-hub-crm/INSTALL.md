# Instrucciones de Instalación
## CRM Mr. Ruta — Despliegue en Vercel

---

## Resumen del proceso

El CRM se despliega como una **sub-ruta del mismo proyecto Vercel** donde vive el website principal de Mr. Ruta. La URL final será:

```
https://tu-dominio-mrruta.vercel.app/crm
```

---

## Paso 1 — Preparar Baserow

Antes de desplegar, completa primero el esquema de la base de datos:

1. Sigue todas las instrucciones de [BASEROW_SCHEMA.md](BASEROW_SCHEMA.md)
2. Crea las 4 tablas y llena los datos iniciales de prueba
3. Obtén el **API Token** y los **4 Table IDs**

---

## Paso 2 — Actualizar credenciales en el código

Abre [src/lib/baserow.ts](src/lib/baserow.ts) y reemplaza los valores:

```typescript
const TOKEN = "tu_token_real_aqui";

export const TABLE_IDS = {
  clients:  123456,  // ID real de tabla Clientes
  quotes:   123457,  // ID real de tabla Cotizaciones
  tasks:    123458,  // ID real de tabla Tareas
  meetings: 123459,  // ID real de tabla Reuniones
};
```

---

## Paso 3 — Actualizar la URL de cal.com

Cuando tengas la ruta de cal.com para Mr. Ruta, abre [src/pages/Index.tsx](src/pages/Index.tsx) y busca esta línea (~línea 213):

```tsx
src="https://cal.com/mr-ruta"
```

Reemplázala con la URL real que te asigne cal.com.

---

## Paso 4 — Construir el CRM

Abre una terminal en la carpeta `digital-hub-crm` y ejecuta:

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos del CRM.

---

## Paso 5 — Integrar en el proyecto principal de Vercel

### Opción A — Carpeta dentro del mismo repositorio (recomendada)

1. Copia el contenido de `dist/` a una carpeta llamada `crm/` en la raíz del proyecto Mr. Ruta:

```
Mr. Ruta/               ← raíz del proyecto Vercel
├── MrRuta_Website_Final.html
├── vercel.json          ← se modifica en el Paso 6
├── crm/                 ← NUEVA CARPETA (contenido del dist/)
│   ├── index.html
│   ├── assets/
│   └── ...
└── ...
```

2. Los archivos de `dist/` van **directamente** dentro de `crm/` (no crear subcarpeta `dist/` dentro de `crm/`).

---

## Paso 6 — Actualizar vercel.json

El `vercel.json` actual solo redirige `/` al website. Reemplázalo con esta versión que también sirve el CRM:

```json
{
  "rewrites": [
    { "source": "/crm", "destination": "/crm/index.html" },
    { "source": "/crm/(.*)", "destination": "/crm/$1" },
    { "source": "/", "destination": "/MrRuta_Website_Final.html" }
  ]
}
```

> **Importante:** El rewrite de `/crm` debe ir **antes** del rewrite de `/` para que Vercel lo evalúe primero.

---

## Paso 7 — Desplegar

Haz commit de todos los cambios y push al repositorio conectado a Vercel:

```bash
git add .
git commit -m "Add Mr. Ruta CRM under /crm route"
git push
```

Vercel detecta el push y despliega automáticamente. En 1-2 minutos el CRM estará en `/crm`.

---

## Paso 8 — Verificar

Abre en el navegador:

| URL | Debe mostrar |
|---|---|
| `https://tu-dominio.vercel.app/` | Website principal Mr. Ruta |
| `https://tu-dominio.vercel.app/crm` | CRM con login verde Mr. Ruta |

---

## Checklist de verificación post-despliegue

- [ ] El header muestra el logo de camión verde y el nombre "Mr. Ruta"
- [ ] Los colores son verdes (no azules del CRM anterior)
- [ ] El módulo "Clientes" carga registros desde Baserow sin error
- [ ] El módulo "Tareas" muestra notificaciones en la campana
- [ ] El módulo "Cotizaciones" permite crear y ver cotizaciones
- [ ] El módulo "Reuniones" funciona correctamente
- [ ] El módulo "Citas" carga el iframe de cal.com

---

## Notas de seguridad

> El TOKEN de Baserow queda expuesto en el bundle del frontend. Para una instalación de producción con datos sensibles, se recomienda crear un backend proxy (Cloudflare Worker o Vercel Edge Function) que proteja el token. Para uso interno con acceso controlado, la configuración actual es suficiente.

---

*Instrucciones generadas el 20 de abril de 2026 · Mr. Ruta CRM v1.0*
