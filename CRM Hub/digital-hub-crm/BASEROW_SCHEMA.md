# Baserow — Esquema de Base de Datos
## CRM Mr. Ruta · Luis Humberto Muro

---

## Instrucciones de creación

1. Entra a [baserow.io](https://baserow.io) y crea tu cuenta
2. Crea un nuevo **Workspace** llamado `Mr. Ruta`
3. Dentro del workspace, crea una **Database** llamada `CRM Mr. Ruta`
4. Crea las 4 tablas en el orden indicado (Clientes primero, porque las demás tablan se vinculan a ella)

---

## Tabla 1 — Clientes

**Nombre de la tabla:** `Clientes`

| Campo | Tipo en Baserow | Opciones / Notas |
|---|---|---|
| `Nombre` | Text | Campo primario (renombrar el "Name" por defecto) |
| `Tipo` | Single select | Opciones: `Detalle` · `Minisuper` · `HORECA` · `Farmacia` · `Conveniencia` |
| `Contacto` | Text | Nombre del dueño o responsable |
| `Teléfono` | Phone number | |
| `Email` | Email | |
| `Dirección` | Long text | |
| `Colonia` | Text | |
| `Ciudad` | Text | |
| `Estado` | Single select | Opciones: `Activo` · `Inactivo` · `Prospecto` |
| `Crédito límite` | Number | Formato: moneda MXN |
| `DSO` | Number | Días de cobro promedio |
| `Notas` | Long text | |
| `Fecha de alta` | Date | Formato: DD/MM/YYYY |

---

## Tabla 2 — Cotizaciones

**Nombre de la tabla:** `Cotizaciones`

| Campo | Tipo en Baserow | Opciones / Notas |
|---|---|---|
| `Título` | Text | Campo primario |
| `Cliente` | Link to table | Vincular a tabla `Clientes` |
| `Monto total` | Number | Formato: moneda MXN |
| `Estado` | Single select | Opciones: `Borrador` · `Enviada` · `Aprobada` · `Rechazada` · `Facturada` |
| `Canal` | Single select | Opciones: `Detalle` · `Minisuper` · `HORECA` · `Farmacia` · `Conveniencia` |
| `Fecha de emisión` | Date | Formato: DD/MM/YYYY |
| `Fecha de vencimiento` | Date | Formato: DD/MM/YYYY |
| `Descripción` | Long text | Detalle de productos/servicios cotizados |
| `Notas internas` | Long text | Uso interno — no se muestra al cliente |

---

## Tabla 3 — Tareas

**Nombre de la tabla:** `Tareas`

| Campo | Tipo en Baserow | Opciones / Notas |
|---|---|---|
| `Título` | Text | Campo primario |
| `Descripción` | Long text | |
| `Estado` | Single select | Opciones: `Pendiente` · `En proceso` · `Completada` · `Cancelada` |
| `Prioridad` | Single select | Opciones: `Alta` · `Media` · `Baja` |
| `Categoría` | Single select | Opciones: `Seguimiento` · `Cobranza` · `Operaciones` · `Comercial` · `Administrativo` |
| `Fecha límite` | Date | Incluir hora: activar "Include time" |
| `Recordatorio` | Boolean | Checkbox — activa la notificación en el CRM |
| `Asignado a` | Text | Nombre del responsable |
| `Cliente relacionado` | Link to table | Vincular a tabla `Clientes` (opcional) |

---

## Tabla 4 — Reuniones

**Nombre de la tabla:** `Reuniones`

| Campo | Tipo en Baserow | Opciones / Notas |
|---|---|---|
| `Título` | Text | Campo primario |
| `Descripción` | Long text | Agenda / objetivo |
| `Fecha y hora` | Date | Activar "Include time" |
| `Duración` | Number | En minutos |
| `Estado` | Single select | Opciones: `Programada` · `Realizada` · `Cancelada` |
| `Tipo` | Single select | Opciones: `Interna` · `Con cliente` · `Con proveedor` |
| `Participantes` | Long text | Lista de nombres separados por coma |
| `Cliente relacionado` | Link to table | Vincular a tabla `Clientes` (opcional) |
| `Notas post-reunión` | Long text | Resumen de lo que se habló |
| `Acuerdos` | Long text | Compromisos y fechas acordadas |

---

## Obtener los IDs de las tablas

Una vez creadas las 4 tablas, abre cada una y copia el ID de la URL:

```
https://app.baserow.io/database/XXXX/table/YYYY/
                                              ^^^^
                                              Este es el TABLE_ID
```

Luego actualiza [src/lib/baserow.ts](src/lib/baserow.ts):

```typescript
export const TABLE_IDS = {
  clients:  YYYY,  // ID de Clientes
  quotes:   YYYY,  // ID de Cotizaciones
  tasks:    YYYY,  // ID de Tareas
  meetings: YYYY,  // ID de Reuniones
} as const;
```

---

## Obtener el API Token

1. En Baserow, clic en tu avatar (esquina superior derecha)
2. **Settings → API tokens**
3. **Create token** → nombre: `CRM Mr. Ruta`
4. Activar permisos: **Create · Read · Update · Delete** en las 4 tablas
5. Copiar el token y pegarlo en [src/lib/baserow.ts](src/lib/baserow.ts):

```typescript
const TOKEN = "tu_token_aqui";
```

---

*Esquema generado el 20 de abril de 2026 · Mr. Ruta CRM v1.0*
