# Huriz - LMU Setup HUB

[English](#english) | [Español](#español) · [Changelog](CHANGELOG.md) · [Download](../../releases/latest)

---

## English

**TL;DR:** A free **SimHub plugin** for **Le Mans Ultimate** to share car setups with your team mates in seconds.
One driver sends the setup with a name, the other types the same name and the setup is applied to their game.
No files, no Discord uploads.

**Download:** [Huriz - LMU Setup HUB](../../releases/latest) (v2.0.7)

▶ [Installation video on YouTube](https://www.youtube.com/watch?v=Gj0C-dNAhBI)

### In short

- **What it is:** a SimHub plugin that sends your current LMU setup to a team mate, or loads theirs into your car.
- **Where you use it:** an **overlay on top of the game** that only shows in the **garage (setup screen)**, or
  your **phone / tablet** (scan the QR code in the plugin tab).
- **Changes applied:** after receiving, you see every value that changed (before → after).
- **Same name all the time:** sending again with the same name overwrites the previous setup.
- **No setup files** are created or modified: values are applied directly through LMU's API.

### How it works

1. **Driver A**, in the garage, types a name (e.g. `p2lmu`) and presses **SEND**. The plugin reads the active setup
   from LMU and stores it for a while (1 hour by default) in an online Redis database.
2. Driver A tells the name to **Driver B** (chat, Discord, voice…).
3. **Driver B**, in the garage, types the same name and presses **LOAD INTO LMU**. Only the values that are different
   are sent to LMU. The **CHANGES APPLIED** button shows the list.

### Important

> **See the changes: switch tab in the garage.** After receiving a setup, the values are already applied to your car,
> but **LMU's setup screen does not refresh by itself**. To see them, move to **any other tab at the top of the garage
> menu** (Standings, Live Timing…) and back to Car Setup. This is a **limitation of the game**: LMU's API has no way
> to refresh that screen from outside.

> **The default database is shared and free.** Out of the box the plugin uses a **shared Redis database on Upstash's
> free plan**, used by everyone who installs the plugin. It **works until it reaches its monthly limit** of commands;
> after that it stops until the next month. **The ideal is that each group of friends creates its own** free
> database (it takes 2 minutes, see [Your own database](#your-own-database)).

### Installation

1. Download the installer from the [latest release](../../releases/latest).
2. **Close SimHub** and run it. It finds SimHub, installs the plugin and allows phones and tablets on the Windows
   Firewall (local network only, nothing is opened to the internet).
3. Open SimHub, enable the plugin if it asks, and open the **Huriz - LMU Setup HUB** tab.
4. Run LMU in **windowed or borderless** mode and go to the **garage**: the overlay appears.

**Note:** Windows may show a SmartScreen warning because the installer isn't code-signed. Click **"More info"** and
then **"Run anyway"**.

**Requirements:** SimHub and Le Mans Ultimate in windowed or borderless mode (no overlay shows in exclusive fullscreen).

### The plugin tab

- **Setup**
  - **Status:** Server, Redis, LMU and Overlay. Green = OK, yellow = waiting for you (e.g. "you need to be in the
    garage"), red = not available. It also shows the last changes applied.
  - **Mobile server:** start / stop, port, QR code for your phone, and a button to allow it on the firewall.
  - **Redis:** server and token of the database (token hidden with `*`), **↺ Default database** to go back to the
    shared one, and how long setups last.
- **Overlay**
  - **On / Off**, **size** (Normal / Large / Extra large).
  - **Show to place it:** shows the overlay anywhere so you can drag it into place. Press **Done** when finished.
  - **Reset position:** moves it back to the top right.

### The overlay

- Title bar: **LMU**, **REDIS** and **GARAGE** lights. Outside the garage everything is **read only**.
- **SEND / RECEIVE**, the setup name, and the main button.
- After receiving: **CHANGES APPLIED (n)** with every value, before in red → after in green.
- Drag it by the title, fold it with **–**.

### Your own database

1. Create a free account at [Upstash](https://console.upstash.com/login) and create a **Redis** database.
2. In the database page, copy the **Endpoint** (server) and the **Password** (token).
3. In the plugin tab, **Setup → Redis**: paste them and press **Save and test**.
4. Give the same server and token to your team mates. Only your group will use that database.

### Troubleshooting

- **The overlay doesn't show:** LMU must be in windowed or borderless mode, the overlay **On**, and you must be in the
  **garage** (setup screen). The **Overlay** row in the Status card tells you why.
- **"Session not found or expired":** the name is wrong or the setup expired (1 hour by default). Send it again.
- **Redis in red:** the shared database may have reached its monthly limit. Create your own (see above).
- **The values didn't change on screen:** switch tab at the top of the garage menu (see *Important*).

### Feedback and proposals welcome

Ideas, bugs and **proposals are welcome** in the [Issues](../../issues) tab: new features, or **other places to upload
and share setups** besides Redis.

### Previous versions

Versions **1.0.x** (May 2026) were a standalone Node.js server with a web page for the phone. They are still in
[Releases](../../releases). Since **2.0** it is a SimHub plugin and Node.js is no longer needed.

---

## Español

**En resumen:** un **plugin de SimHub** gratuito para **Le Mans Ultimate** para compartir setups con tus compañeros en
segundos. Un piloto envía su setup con un nombre, el otro escribe el mismo nombre y el setup se aplica en su juego.
Sin archivos ni subidas a Discord.

**Descarga:** [Huriz - LMU Setup HUB](../../releases/latest) (v2.0.7)

▶ [Vídeo de la instalación en YouTube](https://www.youtube.com/watch?v=Gj0C-dNAhBI)

### Lo esencial

- **Qué es:** un plugin de SimHub que envía tu setup actual de LMU a un compañero, o carga el suyo en tu coche.
- **Dónde se usa:** un **overlay encima del juego** que solo aparece en el **garaje (pantalla de setup)**, o desde el
  **móvil / tablet** (escanea el QR de la pestaña del plugin).
- **Cambios aplicados:** al recibir, ves cada valor que ha cambiado (antes → después).
- **Siempre el mismo nombre:** enviar otra vez con el mismo nombre sobrescribe el setup anterior.
- **No se crean ni modifican archivos de setup:** los valores se aplican directamente por la API de LMU.

### Cómo funciona

1. El **piloto A**, en el garaje, escribe un nombre (p. ej. `p2lmu`) y pulsa **ENVIAR**. El plugin lee el setup activo
   de LMU y lo guarda un rato (1 hora de serie) en una base de datos Redis en internet.
2. El piloto A le dice el nombre al **piloto B** (chat, Discord, voz…).
3. El **piloto B**, en el garaje, escribe el mismo nombre y pulsa **CARGAR EN LMU**. Solo se mandan a LMU los valores
   distintos. El botón **CAMBIOS APLICADOS** enseña la lista.

### Importante

> **Para ver los cambios, cambia de pestaña en el garaje.** Al recibir un setup los valores ya están aplicados en tu
> coche, pero **la pantalla de setup de LMU no se refresca sola**. Para verlos, ve a **cualquier otra pestaña de la parte
> superior del menú del garaje** (Standings, Live Timing…) y vuelve a Car Setup. Es una **limitación del juego**: la API
> de LMU no permite refrescar esa pantalla desde fuera.

> **La base de datos de serie es compartida y gratuita.** De serie el plugin usa una **base Redis compartida en el plan
> gratuito de Upstash**, la misma para todos los que instalen el plugin. **Funciona hasta llegar a su límite mensual** de
> comandos; a partir de ahí deja de funcionar hasta el mes siguiente. **Lo ideal es que cada grupo de amigos se cree la
> suya**, gratis y en 2 minutos (ver [Tu propia base de datos](#tu-propia-base-de-datos)).

### Instalación

1. Descarga el instalador de la [última release](../../releases/latest).
2. **Cierra SimHub** y ejecútalo. Encuentra SimHub, instala el plugin y permite el móvil y la tablet en el Firewall de
   Windows (solo red local, no abre nada a internet).
3. Abre SimHub, activa el plugin si lo pide y abre la pestaña **Huriz - LMU Setup HUB**.
4. Pon LMU en modo **ventana o sin bordes** y entra en el **garaje**: aparece el overlay.

**Nota:** Windows puede mostrar un aviso de SmartScreen porque el instalador no está firmado. Pulsa **"Más
información"** y luego **"Ejecutar de todas formas"**.

**Requisitos:** SimHub y Le Mans Ultimate en modo ventana o sin bordes (en pantalla completa exclusiva no se ve ningún
overlay).

### La pestaña del plugin

- **Setup**
  - **Estado:** Servidor, Redis, LMU y Overlay. Verde = bien, amarillo = te está esperando (p. ej. "tienes que estar
    en el garaje"), rojo = no disponible. También enseña los últimos cambios aplicados.
  - **Servidor para el móvil:** arrancar / parar, puerto, QR para el móvil y un botón para permitirlo en el firewall.
  - **Redis:** servidor y token de la base (el token oculto con `*`), **↺ Base de serie** para volver a la compartida, y
    cuánto duran los setups.
- **Overlay**
  - **Activado / Desactivado**, **tamaño** (Normal / Grande / Muy grande).
  - **Mostrar para colocarlo:** enseña el overlay en cualquier sitio para arrastrarlo a su lugar. Pulsa **Hecho** al
    terminar.
  - **Recolocar:** lo devuelve arriba a la derecha.

### El overlay

- Barra del título: luces de **LMU**, **REDIS** y **GARAJE**. Fuera del garaje todo queda en **solo lectura**.
- **ENVIAR / RECIBIR**, el nombre del setup y el botón principal.
- Al recibir: **CAMBIOS APLICADOS (n)** con cada valor, antes en rojo → después en verde.
- Se arrastra por el título y se pliega con **–**.

### Tu propia base de datos

1. Crea una cuenta gratuita en [Upstash](https://console.upstash.com/login) y crea una base **Redis**.
2. En la página de la base, copia el **Endpoint** (servidor) y la **Password** (token).
3. En la pestaña del plugin, **Setup → Redis**: pégalos y pulsa **Guardar y probar**.
4. Pasa el mismo servidor y token a tus compañeros. Esa base solo la usará vuestro grupo.

### Problemas frecuentes

- **No sale el overlay:** LMU tiene que estar en ventana o sin bordes, el overlay **Activado** y tú en el **garaje**
  (pantalla de setup). La fila **Overlay** de la tarjeta Estado te dice por qué.
- **"La sesión no existe o ha caducado":** el nombre no es correcto o el setup ha caducado (1 hora de serie). Vuelve a
  enviarlo.
- **Redis en rojo:** puede que la base compartida haya llegado a su límite mensual. Créate la tuya (ver arriba).
- **Los valores no cambian en pantalla:** cambia de pestaña en la parte superior del menú del garaje (ver
  *Importante*).

### Se aceptan ideas y propuestas

Ideas, fallos y **propuestas son bienvenidas** en la pestaña [Issues](../../issues): funciones nuevas u **otros sitios
donde subir y compartir los setups** además de Redis.

### Versiones anteriores

Las versiones **1.0.x** (mayo de 2026) eran un servidor Node.js con una web para el móvil. Siguen en
[Releases](../../releases). Desde la **2.0** es un plugin de SimHub y ya no hace falta Node.js.
