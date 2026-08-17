# Tendero

**Caja, inventario y fiados para tiendas de barrio.** Funciona sin internet, desde cualquier celular.

Un punto de venta que cabe en el bolsillo del tendero de Caucasia, Montería o Apartadó. Sin terminal, sin suscripción, sin cuaderno.

![Tendero](og-image.png)

---

## Qué hace

| Módulo | Qué resuelve |
|---|---|
| **Vender** | Rejilla con los productos más vendidos arriba. Toca, suma, cobra. |
| **Cobro** | Teclado grande + botones de billete (+5.000, +10.000, +20.000). **El cambio se muestra en letra enorme** — que es donde más se pierde plata. |
| **Fiados** | Cuenta por cliente, abonos, y cobro amable por WhatsApp. |
| **Inventario** | Descuento automático al vender, aviso de "reponer", margen por producto. |
| **Caja** | Base inicial, gastos del turno, y cierre que dice si cuadró o faltó. |
| **Reportes** | Hoy / 7 días / mes: ventas, ganancia estimada, qué se mueve más, cómo pagan. |

Métodos de pago: **efectivo**, **transferencia** (Nequi / Daviplata / link) y **fiado**.

---

## Diferencias con Kyte

| | Kyte | Tendero |
|---|---|---|
| Offline | Parcial | Total (service worker + localStorage) |
| Costo | Suscripción | Gratis / propio |
| Fiados | Plan pago | Incluido, con cobro por WhatsApp |
| Cierre de caja con conteo real | No | Sí, con diferencia |
| Datos | Servidor externo | En el celular del tendero |
| Integración con distribuidor | No | Prevista (fase 2 — Distrileco) |

---

## Publicar

### Netlify (recomendado — la URL de las metaetiquetas ya apunta ahí)

1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta completa
3. En *Site settings → Change site name*, escribe **`tendero-pos`**

Queda en `https://tendero-pos.netlify.app`, que es exactamente la URL del `og:image`. Si usas otro nombre, cambia estas dos líneas en `index.html`:

```html
<meta property="og:url" content="https://TU-SITIO.netlify.app/">
<meta property="og:image" content="https://TU-SITIO.netlify.app/og-image.png">
<meta name="twitter:image" content="https://TU-SITIO.netlify.app/og-image.png">
```

### GitHub Pages

```bash
git init
git add .
git commit -m "Tendero 1.0"
git branch -M main
git remote add origin https://github.com/USUARIO/tendero-pos.git
git push -u origin main
```

Luego *Settings → Pages → Deploy from branch → main / root*. Actualiza las tres metaetiquetas a `https://USUARIO.github.io/tendero-pos/`.

> ⚠️ El service worker necesita **HTTPS**. Netlify y GitHub Pages ya lo dan.

---

## Archivos

```
index.html      La app completa (HTML + CSS + JS en un solo archivo)
sw.js           Service worker — hace que funcione sin internet
manifest.json   Para instalarla como app en el celular
icon-192.png    Icono
icon-512.png    Icono (incluye versión maskable)
og-image.png    Vista previa 1200×630 para WhatsApp y redes
README.md       Este archivo
```

---

## Cómo la usa el tendero

1. Abre el enlace en el celular → **Ajustes → Instalar en el celular** (o menú del navegador → *Agregar a pantalla de inicio*).
2. **Ajustes** → escribe el nombre del negocio y el WhatsApp.
3. **Ajustes → Cargar productos de ejemplo** para probar, o **Productos → Agregar producto** para cargar los reales.
4. **Caja → Abrir caja** con la base del día.
5. Vender todo el día.
6. **Caja → Cerrar caja**: cuenta el efectivo y la app dice si cuadró.
7. Cada domingo: **Ajustes → Descargar copia** y guardarla en su propio WhatsApp.

---

## Detalles técnicos

- Un solo archivo HTML, sin build, sin dependencias.
- `localStorage` bajo el prefijo `tendero_v1_`.
- Hora y fecha siempre en `America/Bogota` (UTC−5) vía `Intl.DateTimeFormat`.
- Todo texto de usuario pasa por `esc()` antes de entrar al DOM (probado contra XSS).
- Fuentes Google cacheadas por el service worker; hay respaldo con fuentes del sistema.
- Saldo de fiados **calculado**, nunca almacenado — no se desincroniza.
- Utilidad por venta = `total − Σ(costo × cantidad)`, congelada al momento de vender.
- 24 pruebas automatizadas con jsdom sobre la lógica de venta, stock, fiados y caja.

### Modelo de datos

```js
producto  { id, nombre, precio, costo, stock, min, codigo }
venta     { id, ts, dia, items[], subtotal, descuento, total,
            metodo, clienteId, recibido, cambio, costo, utilidad }
cliente   { id, nombre, tel }
mov       { id, tipo:'cargo'|'abono', clienteId, valor, ts, ventaId }
gasto     { id, concepto, valor, ts }
caja      { abierta, base, desde }
cierre    { id, ts, base, ventasTotal, nVentas, efectivo, abonos,
            gastos, esperado, real, diferencia, utilidad }
```

---

## Hoja de ruta

**Fase 2 — validación en campo**
- [ ] Probar con 3 tiendas reales una semana
- [ ] Lector de código de barras con `BarcodeDetector` (Chrome Android)
- [ ] Foto por producto
- [ ] Venta por peso (gramos, libras)

**Fase 3 — el diferenciador**
- [ ] Conexión con Distrileco: ver cartera, hacer pedido desde el POS
- [ ] Sugerencia de reposición según lo que se está acabando
- [ ] Vitrina web para compartir por WhatsApp
- [ ] Respaldo en la nube (opcional, el tendero decide)

**Fase 4 — producto**
- [ ] `config.json` replicable para vender la app a otras tiendas
- [ ] Multiusuario (dueño / mostrador) con auditoría

---

Desarrollada por **Vibras Positivas HM** — Derechos de Autor Reservados
