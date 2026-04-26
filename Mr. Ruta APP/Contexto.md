# Contexto del Proyecto — Mr. Ruta

**Fecha de sesión:** 14 de abril de 2026
**Asistente:** Claude Sonnet 4.6 (Anthropic)
**Tipo de proyecto:** Software de logística DSD + WMS para distribución de consumo masivo
**Estado actual:** Versión 3 funcional en HTML/CSS/JS · Demo interactivo completo

---

## 1. Identidad del Proyecto

### Nombre
**Mr. Ruta** — (también evaluados: Ruta Master / Master Ruta)

### Concepto de marca
Mr. Ruta no es un software de registro pasivo; es el **"Sargento de Hierro"** de la operación logística. Su misión es eliminar el sobrecosto en la última milla y garantizar que cada kilómetro recorrido genere valor, no gasto. El sistema no "muestra datos": **fuerza procesos, bloquea errores y predice fallas** antes de que el camión salga del CEDIS.

### Posicionamiento vs. competencia
- **Competencia directa:** Optimobility / Vitere
- **Diferenciador clave:** *"La competencia solo ve cajas y kilómetros. Nosotros vemos DINERO."*
- **Benchmarks de clase mundial referenciados por el cliente:** Manhattan Associates, JDA, Amazon Hub, DHL Supply Chain

### Tagline de podcast/marketing
> *"Habla Mr. Ruta — El Podcast de la Rentabilidad en Movimiento"*
> *"No somos un GPS. Somos tu rentabilidad blindada."*

---

## 2. Cliente y Contexto Operativo

### Cliente
**Luis Vilchis** — Referido internamente como "Tocayo" en los documentos de trabajo.

### Archivos de referencia originales (subidos en sesión)
| Archivo | Contenido |
|---|---|
| `FINAL_19_03_2026_Observaciones_Draf_I_Luis_Vilchis.docx` | Observaciones definitivas del Draft I — CEDIS WMS y App DSD |
| `18_03_2026_Observaciones_Draf_I_Luis_Vilchis.docx` | Primera ronda de observaciones con benchmarks y recomendaciones |
| `R1_Base_Manuales_LV_17_03_2026.docx` | Manuales operativos: comercial, almacén, reparto, reclutamiento |
| `Draft_2_Mr__Ruta_06_04_2026_.docx` | Concepto de marca Mr. Ruta, guiones de podcast, propuesta de dashboard |

### Industria y modelo de distribución
- **Sector:** Consumo masivo (alimentos perecederos) — categoría pan y pastelería (referencias a Bimbo/Marinela como SKUs de demo)
- **Modelo:** DSD (Direct Store Delivery) — distribución directa al punto de venta
- **Canales de clientes:** Detalle tradicional (tienditas), Minisuper, HORECA, Farmacia, Conveniencia
- **CEDIS:** Centro de Distribución que gestiona almacén, picking, rampa y despacho nocturno

---

## 3. Necesidades Detectadas del Cliente (Base de Conocimiento)

### 3.1 Dashboard CEDIS / WMS

El cliente rechazó explícitamente el Draft I por ser un **"dashboard de observación"** en lugar de un **"dashboard de ejecución"**. Las necesidades clave son:

**Estructura visual — Triángulo de Oro de Operaciones:**
- **Zona superior/centro:** Alertas Críticas (caducidades FEFO, bloqueos de crédito, sobre-inventario)
- **Zona izquierda:** Flujo en tiempo real (picking por cliente, GPS, geofencing)
- **Zona derecha:** KPIs de productividad acumulada

**Flujo operativo que debe reflejar el proceso físico DSD:**
`Recibo → Picking por Cliente → Auditoría en Rampa → Despacho → Última Milla`

**KPIs con Semáforo R-A-V obligatorio:**

| KPI | Verde | Amarillo | Rojo |
|---|---|---|---|
| Fill Rate | >98% | 95–97.9% | <95% |
| Merma % | <1% | 1.1–2% | >2.5% |
| OTD (Puntualidad) | Plan vs Real | — | — |
| DSO (Días de cobro) | <35 días | — | >35 días |
| Time to Load | A tiempo | >15 min retraso | — |
| Recuperación IVA | Acumulado vs Meta | — | — |
| Tiempo prom./visita | <7 min | 7–9 min | >9 min |
| Cumplimiento fotos | >90% | 70–89% | <70% |

**Gráficos específicos solicitados:** Velocímetro para Fill Rate, termómetro invertido para Merma, barras comparativas para OTD, radar para efectividad de rutas.

### 3.2 App de Campo DSD — 3 modalidades

**A. Preventa (Disciplina de Hierro)**
- Geofencing: no se abre la visita si el GPS no coincide
- 7 Pasos de Oro en secuencia forzada (el paso 2 requiere completar el 1)
- Avance en **números absolutos**: "Visitados: 12 / Pendientes: 30" — no porcentajes
- Prospección vía DENUE (dato estratégico confidencial del cliente — no se menciona en foros externos)
- Cierre de jornada bloqueado si hay visitas con "0 minutos de permanencia"

**B. Reparto (On Time Delivery)**
- Surtido por cliente individual — Fill Rate 99%
- Time to Load: si hay >15 min de retraso → prioridad automática de picking
- Evidencia de Rechazo: foto obligatoria, sistema redirige pedido a clientes faltantes
- Comprobante: sin impresora fija → QR en pantalla o impresora Bluetooth de bolsillo (Zebra ZQ220)

**C. Autoventa (ROI Directo)**
- Detección de huecos en anaquel → Sugerido Automático con ROI estimado en $MXN
- Gestión FEFO: prioriza productos con <5 días de vida
- Control físico vs teórico en camión (anti-robo hormiga)

### 3.3 Seguridad Patrimonial (Requisito Crítico)
- **Doble Autorización** obligatoria para cualquier Pedido Manual o Ajuste de Inventario: Supervisor + Finanzas
- Nadie mueve inventario solo — log de auditoría permanente
- Báscula integrada en rampa: si el peso difiere >1% del teórico, la ruta NO se despacha
- Geofencing: alerta si una unidad se desvía de su ruta por más de 10 minutos

### 3.4 Perfiles de Usuario y Pantallas

| Perfil | Pantalla crítica | KPI maestro |
|---|---|---|
| Vendedor | 7 Pasos de Visita + Mapa DENUE | Efectividad de Visita % |
| Repartidor | Orden de entrega + Liquidación | OTD |
| Supervisor Almacén | Surtido vs. capacidad | Cajas por hora / Fill Rate |
| Supervisor Ventas | Efectividad + Motivos No Venta | % Visitas Completas |
| Supervisor Reparto | Geofencing | Alertas desvío >10 min |
| Vigilancia (Puerta) | Validación salida (QR + báscula) | Discrepancia de Salida |
| Dirección | BI: rentabilidad por canal, IVA, cartera | DSO, Fill Rate, Merma |

---

## 4. Decisiones de Diseño y Propuestas Aprobadas en Sesión

### 4.1 El Modelo "Sargento 5-5-5"
Estructura operativa central definida en sesión:
- **5 minutos máximos** por visita en tiendas conocidas (7 en la implementación final por feedback del cliente)
- **5 pasos obligatorios** que el vendedor ejecuta en ese tiempo
- **5 KPIs** que el supervisor ve en tiempo real

### 4.2 Modelo 100% Físico-Digital (Tiendas sin internet)
El cliente confirmó que la mayoría de sus clientes son **tienditas tradicionales sin internet, sin correo, sin cuenta digital**. Solución en 3 capas:

- **Capa 1:** App del vendedor en modo offline — sincroniza al conectarse
- **Capa 2:** Comprobante sin impresora — código QR en pantalla grande; el cliente lo fotografía o anota el número en su libreta
- **Capa 3:** Registro sin formularios — el vendedor toma **foto de la fachada** del negocio + nombre del dueño escrito en papel y fotografiado. Eso genera el expediente.

### 4.3 Cronómetro del Sargento (Timer de Presión)
- Se activa automáticamente al hacer check-in georeferenciado
- Tiempo ideal configurable por tipo de cliente: 7 min tienda conocida, 12 min nueva, 15 min HORECA
- Al **80%** del tiempo → vibración suave + beep tono 440Hz
- Al **100%** → vibración fuerte + alarma 880Hz + pantalla roja parpadeante
- El vendedor que supera el tiempo sin justificación → visita marcada como "Extendida" → supervisor ve alerta en tiempo real
- Score de eficiencia de tiempo alimenta el bono de ejecución

### 4.4 Protocolo "Foto o No Existe"
4 momentos de foto obligatoria en cada visita:

| Momento | Qué fotografía | Para qué sirve |
|---|---|---|
| Entrada | Anaquel completo del cliente | IA detecta huecos automáticamente |
| Exhibición | Frentes y material POP propio | Evidencia de Trade Marketing |
| Rechazo (si aplica) | Producto devuelto + dueño visible | Protección patrimonial + legal |
| Salida | Anaquel surtido + número de pedido visible | Confirmación de entrega |

**Regla:** Sin foto, no se puede avanzar al siguiente paso. El cronómetro sigue corriendo. Las fotos faltantes afectan el bono de ejecución.

### 4.5 Sistema de Contenedores de Bajo Costo (Surtido Individual)
Para el reto de surtido individualizado por cliente sin encarecer la operación:

- **Opción A (Recomendada):** Rejilla plástica modular (~$35–80 MXN/panel) — celdas fijas en el camión con etiqueta del cliente. Reutilizable, visual, costo mínimo.
- **Opción B:** Cajas de cartón reciclado de proveedores — $0, ya están en el CEDIS, se reutilizan con etiqueta impresa.
- **Opción C:** Charola plástica de colores por canal (Verde = Detalle, Azul = Conveniencia, Rojo = HORECA)
- **Recomendación final:** Rejilla en camión + caja reciclada para lo que va al cliente.

---

## 5. Archivos Desarrollados en Sesión

### Inventario de archivos activos

| Archivo | Versión | Descripción |
|---|---|---|
| `MrRuta_App_v3_Campo.html` | **v3 (última)** | App móvil de campo para vendedores/repartidores |
| `MrRuta_CEDIS_WMS_Dashboard_v3.html` | **v3 (última)** | Dashboard web de escritorio para supervisores y dirección |
| `RutaDSD_App_v2_Campo_20260401_075013.html` | v2 (referencia) | Versión anterior de la app de campo |
| `CEDIS_WMS_Dashboard_20260401_075013.html` | v2 (referencia) | Versión anterior del dashboard CEDIS |
| `Contexto.md` | — | Este archivo |

### Historial de versiones

| Versión | Fecha | Cambios principales |
|---|---|---|
| v1 | Antes de 01/04/2026 | Prototipo inicial — "dashboard de observación" |
| v2 | 01/04/2026 | Corrección de layout, integración BroadcastChannel, gamificación |
| v3 | 14/04/2026 | Sargento Timer, Protocolo Foto, Registro offline, Doble Autorización, KPIs RAV completos |

---

## 6. Detalle Técnico — App de Campo v3 (`MrRuta_App_v3_Campo.html`)

### Tecnología
- HTML5 / CSS3 / JavaScript vanilla (sin frameworks)
- Single-file — todo en un archivo para facilitar demo local y distribución
- Modo PWA compatible (meta apple-mobile-web-app-capable)
- BroadcastChannel API para comunicación en tiempo real con CEDIS
- Web Audio API para alarmas de sonido del Sargento Timer
- Navigator Vibration API para alarmas táctiles
- LocalStorage simulation para modo offline

### Pantallas / Screens

| Screen ID | Nombre | Descripción |
|---|---|---|
| `home` | Inicio / Dashboard | Vista del día del vendedor: progreso de ruta, KPIs, alertas de zona, racha semanal |
| `ruta` | Mi ruta del día | Lista de 30 clientes con estado, filtros (todos/pendientes/visitados/alertas) |
| `captura` | Captura de pedido | Sargento Timer + hero del cliente + tabs: Sugerido / Catálogo / Cobro / Fotos |
| `anaquel` | Foto de anaquel IA | Captura con cuadrícula, simulación de bounding boxes, análisis de share of shelf |
| `supervisor` | Dashboard Supervisor | Mapa de rutas, estado de 6 vendedores, alertas activas de zona |
| `gamificacion` | Logros | Nivel, puntos, racha, achievements, ranking por zona/CEDIS, canje de recompensas |
| `registro` | Nuevo cliente (v3) | Registro 100% offline sin internet ni correo: nombre + tipo + dueño + foto fachada |

### Funcionalidades v3 destacadas

**Sargento Timer:**
```javascript
STATE.visitBudget = isNew ? 12 * 60 : 7 * 60; // segundos
// 4 estados: Óptimo (0-60%) → Confirmar (60-80%) → Finalizar (80-100%) → TIEMPO (>100%)
// Web Audio: playBeep(440, 0.3, 'triangle') al 80% / playBeep(880, 0.5, 'sawtooth') al 100%
```

**Protocolo Foto:**
```javascript
const FOTO_PROTOCOL = [
  { id:0, icon:'🏪', title:'Foto de entrada — anaquel', required:true  },
  { id:1, icon:'📋', title:'Foto de exhibición propia', required:true  },
  { id:2, icon:'❌', title:'Foto de rechazo (si aplica)', required:false },
  { id:3, icon:'✅', title:'Foto de salida — pedido listo', required:true  },
];
```

**QR de comprobante** — generado como SVG inline en el overlay de confirmación. El dueño de la tienda lo fotografía o anota el número. Sin impresora.

**Registro offline:**
- Campos: nombre negocio, tipo, nombre dueño, colonia/referencia, foto fachada, teléfono (opcional)
- Cero email, cero cuenta digital
- Se sincroniza al reconectarse a internet

### Navegación
- Bottom nav de 5 ítems: Inicio / Mi ruta / Pedido / Nuevo / Logros
- Swipe horizontal para regresar en pantallas de captura y anaquel
- Tecla "O" en desktop simula modo offline/online (para demos)

### Datos de demo incluidos
- 30 clientes en la Ruta Norte B (Monterrey)
- 15 SKUs de Bimbo/Marinela con precios y cantidades sugeridas
- 6 vendedores activos con métricas
- 9 achievements, 6 recompensas canjeables, 3 rankings

---

## 7. Detalle Técnico — CEDIS WMS Dashboard v3 (`MrRuta_CEDIS_WMS_Dashboard_v3.html`)

### Tecnología
- HTML5 / CSS3 / JavaScript vanilla + Chart.js 4.4.0 (via CDN cdnjs)
- Layout de escritorio: sidebar fijo + topbar + content area
- BroadcastChannel API — recibe pedidos de la App de Campo en tiempo real sin servidor
- Single-file para demo local

### Páginas del sidebar

| Page ID | Nombre | Descripción |
|---|---|---|
| `dashboard` | Dashboard — Vista general | 8 KPIs RAV + Sargento Monitor inline + Feed en vivo + Estado de rutas + Alertas |
| `pedidos` | Pedidos en vivo | Cola de pedidos recibidos desde campo, botón "Procesar", estadísticas del día |
| `inventario` | Inventario FEFO | 12 SKUs con stock, días disponibles, estado crítico/alerta/ok, buffer de carga |
| `despacho` | Despacho de rutas | 6 route cards, timeline nocturno de despacho, liquidaciones en curso |
| `sargento` | ⏱ Sargento Monitor (v3) | Tabla de eficiencia de tiempo por vendedor, alertas de visitas extendidas, config de presupuestos |
| `fotos` | 📸 Cumplimiento Fotos (v3) | Cumplimiento por vendedor, impacto en bono, estadísticas de los 4 tipos de foto |
| `seguridad` | 🔐 Seguridad Patrimonial (v3) | Cola de doble autorización (aprobar/rechazar), historial de auditoría, grid de contenedor |
| `reportes` | Reportes | Fill Rate semanal, Merma semanal, Top 10 SKUs, Radar de efectividad por ruta |
| `conectividad` | Conectividad API | Demo en vivo BroadcastChannel, especificaciones técnicas de integración |

### KPIs del Dashboard — Fila 1 (KPIs clásicos con RAV)
- Pedidos recibidos
- Fill Rate (meta >98%)
- Merma hoy (meta <1.5%)
- Venta zona total

### KPIs del Dashboard — Fila 2 (KPIs v3 nuevos)
- Tiempo promedio/visita (meta <7:00 — Sargento)
- Cumplimiento de fotos (meta >90%)
- DSO Días de cobro (meta <35 días)
- Recuperación de IVA (acumulado vs meta mensual)

### Sargento Monitor (panel inline en Dashboard)
Muestra en tiempo real a cada vendedor que está en una visita activa:
- Nombre, cliente actual, tiempo transcurrido, color de estado
- Métricas agregadas: promedio zona, número sobre meta, críticos
- Se actualiza con datos simulados en tiempo real

### Sistema de Doble Autorización
- Botón "🔐 Pedido Manual" en topbar (antes era "+ Pedido Manual" sin restricción)
- Modal requiere: Vendedor, Cliente, SKU, Cantidad, **Motivo justificado**, **PIN del Supervisor**
- La 2da firma de Finanzas llega por notificación separada
- Todo queda en log de auditoría con timestamp
- En la página Seguridad: cola visual con botones Aprobar / Rechazar

### Grid de Contenedor (Surtido Individual)
Grid visual de 30 celdas (una por cliente de la ruta) con 3 estados:
- ✅ Verde = surtido completo
- ⚙ Amarillo = cargando/en proceso
- ○ Gris = pendiente

### Alertas del Dashboard
Conectadas en tiempo real con la App de Campo via BroadcastChannel. Cuando el vendedor confirma un pedido en la App, aparece en el Feed del CEDIS en <100ms sin servidor.

---

## 8. Arquitectura de Comunicación App ↔ CEDIS

```
📱 App de Campo          🔌 BroadcastChannel         🏭 CEDIS WMS
(vendedor confirma)   ─────────── API ──────────── (dashboard recibe)
      │                                                    │
      │  ORDER_CONFIRMED {orderId, vendedor, cliente,      │
      │  total, cajas, timestamp}                         │
      │ ──────────────────────────────────────────────── ▶ │
      │                                                    │
      │ ◀ ────── CEDIS_ORDER_ACK {orderId, timestamp} ──── │
      │                                                    │
      │  PING / PONG (health check cada 30s)               │
      └ ─────────────────────────────────────────────── ↔ ┘
```

**Para demo en cliente:** Abrir ambos archivos HTML en pestañas del mismo navegador. Los pedidos confirmados en la App aparecen en el CEDIS en tiempo real sin ningún servidor.

**Para producción (recomendado):**
- WebSocket + Redis Pub/Sub
- JWT RS256 para autenticación
- TLS 1.3
- SQLite local en el dispositivo del vendedor (offline queue)
- Exponential backoff: 5 reintentos al reconectar

---

## 9. Identidad Visual y Design System

### Paleta de colores (CSS variables)
```css
/* Verdes — color primario de la marca */
--g600: #0F7A4A  /* principal */
--g500: #129057
--g400: #18B36B
--g300: #3FCA88
--g50:  #EBF9F2

/* Azules — datos y métricas */
--b600: #1044A0
--b500: #1A5EC8

/* Ámbar — alertas y advertencias */
--a600: #C45E00
--a500: #E87800

/* Rojos — crítico */
--r500: #C42828
--r50:  #FEF2F2
```

### Tipografía
- **Body / UI:** DM Sans (Google Fonts) — pesos 300, 400, 500, 600, 700
- **Monoespaciado (timers, IDs):** DM Mono — pesos 400, 500

### Principios de diseño
1. **Ejecutar, no observar** — Todo KPI debe ser procesable. Si es informativo pero no genera acción, se elimina.
2. **Semáforo RAV siempre** — Verde/Amarillo/Rojo en todo indicador, nunca datos neutros.
3. **Números absolutos sobre porcentajes** — "Visitados: 12 / Pendientes: 30" es más urgente que "40%".
4. **Bottom-up reporting** — Un problema en un cliente escala automáticamente al dashboard directivo.
5. **Drill-down siempre disponible** — Rojo en Ventas Totales → clic → cliente específico → motivo de rechazo.

---

## 10. Preguntas Abiertas y Pendientes del Cliente

Estas preguntas fueron documentadas explícitamente en los manuales del cliente y **no han sido resueltas aún**:

1. **Redirección de rechazos:** ¿Cómo identificar automáticamente a qué clientes faltantes de la ruta enviar un pedido rechazado? (el sistema debe sugerir los más cercanos con historial del SKU rechazado)
2. **Eliminar la impresora:** ¿Se puede reemplazar el comprobante de papel con una alternativa digital que el cliente acepte? → *Resuelto parcialmente en v3 con QR en pantalla + número anotable*
3. **Tiempo óptimo de ruta:** ¿Cómo calcular el número de clientes por ruta/día basado en los tiempos de permanencia declarados por cada cliente?
4. **Clientes que no permiten inventario físico:** ¿Qué hacer cuando el cliente dicta el pedido sin permitir conteo? → *Solución propuesta: el vendedor fotografía el anaquel y la IA hace el conteo visual*
5. **Nombre final del producto:** Mr. Ruta vs. Ruta Master vs. Master Ruta — pendiente de decisión del cliente
6. **Palabra DENUE:** El cliente indicó que el origen de los datos de prospección DENUE es información estratégica confidencial — no se menciona la fuente en materiales públicos ni en la app visible al vendedor

---

## 11. Módulos Pendientes de Desarrollar (Backlog v4+)

Basados en los documentos del cliente, estos módulos están especificados pero no prototipados aún:

| Módulo | Descripción | Prioridad |
|---|---|---|
| **Módulo de Recuperación de IVA** | KPI principal en dashboard directivo — cuánto IVA se recupera por pedido y por ruta | Alta |
| **Inventario con Drones** | Vuelos nocturnos cíclicos escaneando QR/RFID en racks del CEDIS | Media |
| **Monitor de Fatiga (NOM-035)** | Bloqueo automático de la App si telemetría detecta exceso de jornada o conducción errática | Alta |
| **Algoritmo de Optimización de Ruta** | Traveling Salesman Problem — reducción de 20-30% de kilometraje | Media |
| **Huecos en Anaquel con IA Real** | Detección automática de espacios vacíos en foto → sugerido de venta con ROI | Alta |
| **Flash Picking** | Picking de emergencia para pedidos HORECA o e-commerce en <20 minutos | Media |
| **Handhelds con Ring Scanner** | Interfaz simplificada para pickers en bodega con ruta óptima de picking | Baja |
| **Ciclo 20/4 de Unidades** | Gestión de flota: 10h reparto diurno + 10h nocturno + 4h mantenimiento | Baja |
| **Prospección DENUE Integrada** | Mapa de zonas blancas con candados estratégicos en la App del vendedor | Alta |
| **Score de Pasos de la Visita** | Calificación automática del cumplimiento de los 7 Pasos de Oro por visita | Alta |

---

## 12. Los 7 Pasos de Oro de la Visita

Secuencia operativa central del sistema — el vendedor **no puede saltar pasos**, el sistema los fuerza en orden:

1. **Check-in Georeferenciado** — La App valida que el GPS coincide con las coordenadas del cliente (margen de ±6 a 10 metros)
2. **Inventario en PDV** — Registro de existencias actuales para calcular el sugerido de venta por IA (o foto del anaquel si el cliente no permite contar)
3. **Encuesta de Trade Marketing** — Foto de exhibición, precios de competencia, frentes en anaquel, material POP
4. **Levantamiento de Pedido** — Sugerido automático basado en historial + inventario del paso 2. Si hay adeudo, el sistema lo bloquea.
5. **Prospección DENUE** — Visita a clientes potenciales identificados en zonas con tiempo liberado por la optimización
6. **Cobranza y Gestión de Cartera** — Registro de pagos, liquidación de facturas vencidas. El pedido no se libera si el cliente excede su límite de crédito.
7. **Check-out y Score** — Registro del tiempo de permanencia vs. estándar. El sistema califica la visita. Si faltan pasos, no se puede cerrar la jornada.

---

## 13. Glosario de Términos Clave

| Término | Definición en contexto |
|---|---|
| **DSD** | Direct Store Delivery — entrega directa al punto de venta sin intermediario |
| **CEDIS** | Centro de Distribución — almacén principal desde donde salen las rutas |
| **WMS** | Warehouse Management System — sistema de gestión de almacén |
| **Fill Rate** | Porcentaje de pedidos entregados completos. Meta: >98% |
| **FEFO** | First Expired, First Out — rotación de inventario por fecha de vencimiento |
| **OTD** | On Time Delivery — entrega a tiempo. Métrica clave del repartidor |
| **DSO** | Days Sales Outstanding — días promedio de cobro de la cartera |
| **OTIF** | On Time In Full — combinación de puntualidad + completitud de entrega |
| **Time to Load** | Tiempo de carga del camión. Si supera 15 min → prioridad de picking |
| **Robo hormiga** | Pérdida de inventario por pedidos manuales sin autorización |
| **Merma** | Producto perdido por caducidad, daño o robo. Meta: <1.5% |
| **PDV** | Punto de Venta — la tienda del cliente |
| **SKU** | Stock Keeping Unit — código único de producto |
| **Hueco** | Espacio vacío en el anaquel del cliente — oportunidad de venta |
| **Liquidación** | Proceso de cierre de ruta: devoluciones, cobros y reconciliación |
| **Rampa** | Área de andén en el CEDIS donde se valida y carga la mercancía |
| **Sargento** | Concepto de marca: el sistema que presiona, fuerza y audita la operación |
| **Triángulo de Oro** | Framework de layout del dashboard: Alertas (centro) + Flujo (izq) + KPIs (der) |
| **RAV** | Rojo-Amarillo-Verde — sistema de semáforo operativo |
| **DENUE** | Directorio Estadístico Nacional de Unidades Económicas (INEGI) — fuente confidencial de prospección |
| **NOM-035** | Norma mexicana de factores de riesgo psicosocial en el trabajo — aplica a control de fatiga |

---

## 14. Cómo Usar Este Contexto en la Próxima Sesión

Para retomar el proyecto con Claude, sube este archivo y los dos HTML de la v3. Instrucción sugerida:

```
Lee el archivo Contexto.md. Somos un equipo desarrollando Mr. Ruta, 
un software de logística DSD + WMS. Este archivo tiene todo el contexto 
de lo que hemos construido hasta la versión 3. 
Los archivos MrRuta_App_v3_Campo.html y MrRuta_CEDIS_WMS_Dashboard_v3.html 
son los archivos activos. Continúa desde donde quedamos.
```

---

## 15. Notas de la Sesión del 14 de Abril de 2026

- Se analizaron los 4 documentos del cliente y se construyó una Base de Conocimiento estructurada en las 7 secciones del skill de analizador-clientes.
- Se propuso el **Modelo "Sargento 5-5-5"** como estructura operativa maestra.
- Se definió la solución para **tiendas sin internet**: registro offline por foto + QR como comprobante.
- Se aclararon 5 puntos críticos: (1) propuesta más efectiva, (2) tiendas sin internet, (3) contador de tiempo con alarma, (4) el vendedor hace todo en foto, (5) la caja de surtido puede ser reciclada o rejilla plástica.
- Se desarrollaron las versiones 3 completas de ambos archivos HTML con todas las funcionalidades integradas.
- Los archivos v2 de referencia se conservan para comparación.

---

*Documento generado el 14 de abril de 2026 · Claude Sonnet 4.6 · Anthropic*
*Para uso interno del proyecto Mr. Ruta — Luis Vilchis*
