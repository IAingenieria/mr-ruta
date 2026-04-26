# Bitácora de Desarrollo — Mr. Ruta

Registro cronológico de cambios, decisiones técnicas y resolución de problemas en el proyecto Mr. Ruta.

---

## 25 de Abril de 2026 — Unificación de Deployment y Corrección de Baserow

**Asistente:** Claude Sonnet 4.6 (Windsurf)  
**Duración:** ~2 horas  
**Estado:** ✅ Completado exitosamente

### Contexto inicial
El usuario reportó que:
1. El CRM local funcionaba en `http://localhost:8086/crm`
2. En producción (`digital-hub-crm.vercel.app`) se mostraba un proyecto diferente (de otro cliente)
3. El proyecto correcto debía estar en `mr-ruta.vercel.app`

### Problema identificado
El repositorio `github.com/IAingenieria/mr-ruta` tenía un `vercel.json` en la raíz que **redirigía** `/crm`, `/login` y `/app` a `digital-hub-crm.vercel.app`, que era un proyecto de otro cliente.

### Solución implementada

#### 1. Eliminación de redirecciones externas
**Archivo:** `vercel.json` (raíz)

**Antes:**
```json
{
  "rewrites": [...],
  "redirects": [
    { "source": "/crm", "destination": "https://digital-hub-crm.vercel.app", "permanent": false },
    { "source": "/login", "destination": "https://digital-hub-crm.vercel.app", "permanent": false },
    { "source": "/app", "destination": "https://digital-hub-crm.vercel.app", "permanent": false }
  ]
}
```

**Después:**
```json
{
  "buildCommand": "node build.js",
  "outputDirectory": "dist",
  "redirects": [
    { "source": "/login", "destination": "/crm", "permanent": false },
    { "source": "/app", "destination": "/crm", "permanent": false }
  ],
  "rewrites": [
    { "source": "/crm/:path*", "destination": "/crm.html" },
    { "source": "/crm", "destination": "/crm.html" },
    { "source": "/formulario", "destination": "/formulario.html" },
    { "source": "/cuestionario", "destination": "/cuestionario.html" },
    { "source": "/", "destination": "/MrRuta_Website_Final.html" }
  ]
}
```

#### 2. Configuración de build unificado
**Archivos creados:**

**`build.js`** (raíz):
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');

// Crear carpeta dist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copiar archivos HTML estáticos
const staticFiles = [
  'MrRuta_Website_Final.html',
  'formulario.html',
  'cuestionario.html'
];

console.log('Copiando archivos estáticos...');
staticFiles.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ ${file}`);
  }
});

// Build del CRM
console.log('\nBuildando CRM...');
const crmDir = path.join(__dirname, 'CRM Hub', 'digital-hub-crm');
process.chdir(crmDir);

try {
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Build completado exitosamente');
} catch (error) {
  console.error('Error durante el build:', error.message);
  process.exit(1);
}
```

**`package.json`** (raíz):
```json
{
  "name": "mr-ruta",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "node build.js"
  }
}
```

**`.gitignore`** (raíz):
```
node_modules/
dist/
.env
.env.local
.vercel
*.log
.DS_Store
```

#### 3. Configuración de Vite para output correcto
**Archivo:** `CRM Hub/digital-hub-crm/vite.config.ts`

**Cambio:**
```typescript
build: {
  outDir: path.resolve(__dirname, "../../dist"),
  emptyOutDir: false,
  rollupOptions: {
    input: {
      crm: path.resolve(__dirname, "crm.html"),
    },
  },
}
```

#### 4. Corrección de error Mixed Content en Baserow
**Problema:** El navegador bloqueaba peticiones HTTP desde una página HTTPS.

**Error en consola:**
```
Mixed Content: The page at 'https://www.mr-ruta.com/crm' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://api.baserow.io/...'
```

**Causa:** Baserow devolvía URLs de paginación con `http://` en lugar de `https://`.

**Solución:** Forzar HTTPS en las URLs de paginación.

**Archivo:** `CRM Hub/digital-hub-crm/src/lib/baserow.ts`

**Cambio:**
```typescript
while (nextPath) {
  const { data } = await baserow.get(nextPath);
  results = results.concat(data.results);
  if (data.next) {
    // Force HTTPS to avoid Mixed Content errors
    const nextUrl = data.next.replace("http://", "https://");
    nextPath = nextUrl.replace(BASE_URL, "");
  } else {
    nextPath = null;
  }
}
```

#### 5. Configuración de variables de entorno en Vercel
Se agregaron las siguientes variables de entorno en el dashboard de Vercel (proyecto `mr-ruta`):

| Key | Value | Environment |
|---|---|---|
| `VITE_BASEROW_TOKEN` | `zBza79SbZyJ3S2nnbs5N7j2HvKt4qd5S` | Production and Preview |
| `VITE_CRM_EMAIL` | `info@mr-ruta.com` | Production and Preview |
| `VITE_CRM_PASSWORD` | `Zuazua#114` | Production and Preview |

### Commits realizados

1. **`74f4d09`** — fix: unificar deployment del CRM en mr-ruta.vercel.app
   - Eliminar redirecciones a digital-hub-crm (proyecto de otro cliente)
   - Configurar build unificado del CRM en el mismo proyecto
   - Actualizar vercel.json para servir /crm localmente

2. **`6777c2d`** — fix: agregar redirects de /login y /app hacia /crm

3. **`336065c`** — debug: agregar logging para verificar variables de entorno en producción

4. **`227dcc1`** — fix: forzar HTTPS en URLs de paginación de Baserow

### Resultado final

✅ **Deployment unificado en un solo proyecto Vercel**
- Repositorio: `github.com/IAingenieria/mr-ruta`
- Proyecto Vercel: `mr-ruta`
- URL principal: `https://www.mr-ruta.com/` o `https://mr-ruta.vercel.app/`

✅ **URLs funcionales:**
- Website: `https://www.mr-ruta.com/`
- CRM: `https://www.mr-ruta.com/crm`
- Login: `https://www.mr-ruta.com/login` → redirige a `/crm`
- App: `https://www.mr-ruta.com/app` → redirige a `/crm`
- Formulario: `https://www.mr-ruta.com/formulario`
- Cuestionario: `https://www.mr-ruta.com/cuestionario`

✅ **Conexión a Baserow funcionando correctamente**
- Token cargado en variables de entorno
- URLs de paginación forzadas a HTTPS
- Sin errores de Mixed Content

✅ **Servidor local funcionando**
- Puerto: `http://localhost:8080/`
- CRM: `http://localhost:8080/crm`
- Variables de entorno cargadas desde `.env`

### Lecciones aprendidas

1. **Vercel y variables de entorno:** Las variables de entorno deben estar configuradas en el dashboard de Vercel para que Vite las inyecte durante el build (no en runtime).

2. **Mixed Content:** Las páginas HTTPS no pueden hacer peticiones HTTP. Siempre forzar HTTPS en APIs externas.

3. **Deployment unificado:** Es mejor tener todo en un solo proyecto Vercel con rewrites internos que múltiples proyectos con redirects externos.

4. **Git y espacios en rutas:** PowerShell requiere comillas para rutas con espacios: `git add "CRM Hub/digital-hub-crm/..."`

5. **BroadcastChannel vs WebSocket:** Para demo local, BroadcastChannel funciona perfectamente. Para producción, se recomienda WebSocket + Redis.

### Próximos pasos sugeridos

- [ ] Implementar autenticación real (actualmente usa localStorage)
- [ ] Agregar tests unitarios para componentes críticos
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Implementar rate limiting en las peticiones a Baserow
- [ ] Agregar Sentry o similar para monitoreo de errores en producción
- [ ] Optimizar bundle size (code splitting, lazy loading)
- [ ] Implementar PWA completo con service workers
- [ ] Agregar analytics (Google Analytics o Plausible)

---

## 14 de Abril de 2026 — Desarrollo de App de Campo v3 y Dashboard CEDIS v3

**Asistente:** Claude Sonnet 4.6  
**Duración:** Sesión completa  
**Estado:** ✅ Completado

### Trabajo realizado

1. **Análisis de documentos del cliente** (4 archivos Word)
2. **Desarrollo de App de Campo v3** (`MrRuta_App_v3_Campo.html`)
   - Sargento Timer con alarmas visuales y sonoras
   - Protocolo de 4 fotos obligatorias
   - Registro offline sin internet
   - QR de comprobante sin impresora
3. **Desarrollo de Dashboard CEDIS v3** (`MrRuta_CEDIS_WMS_Dashboard_v3.html`)
   - 8 KPIs con semáforo RAV
   - Sargento Monitor inline
   - Sistema de Doble Autorización
   - Grid de contenedor visual
4. **Comunicación en tiempo real** via BroadcastChannel API
5. **Documentación completa** en `Contexto.md`

### Archivos generados
- `MrRuta_App_v3_Campo.html`
- `MrRuta_CEDIS_WMS_Dashboard_v3.html`
- `Contexto.md`

---

*Última actualización: 25 de abril de 2026*  
*Claude Sonnet 4.6 · Anthropic*
