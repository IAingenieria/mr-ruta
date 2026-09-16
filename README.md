# mr-ruta.com — sitio público (Next.js 15)

Sitio multi-landing de Mr Ruta: home, 14 giros, 140 páginas giro × ciudad, 15 páginas de mercado por ciudad, producto, planes, comparativas, mediciones, glosario, contacto. Todo estático (SSG); los leads van al worker de demos (`demo.mr-ruta.com/api/sitio/lead`).

## Cómo se trabaja

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # corre scripts/preflight.mjs (guardián) y compila
npm run start -- -p 3051
node scripts/auditar.mjs http://localhost:3051   # 1 h1 · title ≤ 60 · desc 140–155 · canonical · JSON-LD
```

## Dónde vive el contenido

- `src/content/giros.ts` — los 14 giros: keyword, párrafo Answer-First (anclas con `<b>`), dolores, día de ruta, tipos de negocio, FAQ.
- `src/content/zonas.json` — 57 zonas de reparto con conteos por 36 tipos de negocio y ranking por giro (generado por el pipeline interno; no se edita a mano).
- `src/content/sitio.ts` — datos fijos, cifras verificadas, FAQ general, definiciones, mediciones, navegación.

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.mr-ruta.com` (canonical, sitemaps, Schema) |
| `NEXT_PUBLIC_WHATSAPP` | número con lada país, solo dígitos (p. ej. `528100000000`); sin él, los botones de WhatsApp llevan a /contacto |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX`; sin él no hay medición |
| `NEXT_PUBLIC_MOSTRAR_PRECIOS` | `1` para mostrar los importes en /planes |
| `NEXT_PUBLIC_LEADS_ENDPOINT` | por defecto `https://demo.mr-ruta.com/api/sitio/lead` |

## Regla de contenido

`scripts/preflight.mjs` falla el build si en `src/` o `public/` aparece alguna palabra de la lista prohibida (la fuente de los registros nunca se nombra en público). Se dice "registros actualizados", "bases de datos propias".

## Lo viejo

`legacy/` guarda el sitio anterior (HTML estático + CRM de abril de 2026). No se sirve.
