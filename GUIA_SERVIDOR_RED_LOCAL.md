# Guía de Configuración: Servidor Local en Red (Windows y Linux)
**Sistema de Gestión y Carga de Documentos — IUTEPAL**

---

## ⚡ Datos Rápidos de tu Servidor Actual

| Parámetro | Valor |
| :--- | :--- |
| **Dirección IP local de tu PC** | `172.16.0.4` |
| **Puerto configurado** | `3000` |
| **URL en esta misma PC** | [http://localhost:3000](http://localhost:3000) |
| **URL desde otra PC o teléfono** | `http://172.16.0.4:3000` |
| **Acceso directo al login** | `http://172.16.0.4:3000/login.html` |

> [!IMPORTANT]
> **Requisito fundamental**: Ambas computadoras (la que tiene el servidor y la que va a ingresar) deben estar conectadas a la **misma red Wi-Fi o al mismo router por cable**.

---

## 🪟 PARTE 1: Configuración en Windows

### Paso 1: Permitir el puerto 3000 en el Firewall de Windows
Windows bloquea por defecto las conexiones entrantes hacia servidores en desarrollo.

* **Opción automática (Recomendada)**:
  1. En la carpeta del proyecto, haz clic derecho en el archivo `abrir_puerto_firewall.bat`.
  2. Selecciona **"Ejecutar como administrador"**.
  3. Presiona cualquier tecla al finalizar.

* **Opción manual (PowerShell como Administrador)**:
  ```powershell
  netsh advfirewall firewall add rule name="Servidor Web IUTEPAL (Puerto 3000)" dir=in action=allow protocol=TCP localport=3000 profile=any
  ```

> [!TIP]
> **Verifica tu perfil de red**: En Windows, ve a *Configuración > Red e Internet > Wi-Fi / Ethernet > Propiedades de tu red* y asegúrate de que esté marcado como **"Red privada"** (no "Pública").

### Paso 2: Iniciar el servidor
* **Opción 1**: Haz doble clic en el archivo `iniciar_servidor.bat`.
* **Opción 2**: Abre una terminal en la carpeta y escribe:
  ```cmd
  npm start
  ```

La consola mostrará:
```text
============================================================
 Servidor IUTEPAL en ejecución
 URL Local       : http://localhost:3000
 URL Red Local   : http://172.16.0.4:3000 (desde otra PC / teléfono)
 Motor BD        : SQLITE
 Almacenamiento  : LOCAL (uploads)
============================================================
```

### Paso 3: Entrar desde la otra computadora o móvil
1. Abre el navegador (Chrome, Edge, Firefox, Safari) en el otro dispositivo.
2. En la barra de direcciones escribe:
   ```text
   http://172.16.0.4:3000
   ```
3. El sistema cargará con todas sus funciones.

---

## 🐧 PARTE 2: Configuración en Linux (Ubuntu, Debian, Fedora, etc.)

Si vas a migrar o correr este servidor en una máquina o servidor con Linux:

### Paso 1: Instalar Node.js y Git
En distribuciones basadas en Debian / Ubuntu:
```bash
sudo apt update
sudo apt install nodejs npm git -y
```

Verifica las versiones:
```bash
node -v
npm -v
```

### Paso 2: Instalar dependencias
Dentro de la carpeta del proyecto:
```bash
npm install
```

### Paso 3: Conocer la IP local de tu máquina Linux
```bash
hostname -I
```
*(Toma la primera IP que aparezca, e.g. `192.168.1.X` o `172.16.X.X`).*

### Paso 4: Abrir el puerto 3000 en el Firewall de Linux
* **Si usas UFW (Ubuntu / Debian / Linux Mint)**:
  ```bash
  sudo ufw allow 3000/tcp
  sudo ufw reload
  ```
* **Si usas Firewalld (Fedora / RHEL / Rocky / CentOS)**:
  ```bash
  sudo firewall-cmd --permanent --add-port=3000/tcp
  sudo firewall-cmd --reload
  ```
* **Si usas Iptables directo**:
  ```bash
  sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
  ```

### Paso 5: Iniciar el servidor
Dale permisos al script y arráncalo:
```bash
chmod +x iniciar_servidor.sh
./iniciar_servidor.sh
```
O directamente:
```bash
npm start
```

### Paso 6 (Recomendado): Ejecución 24/7 en segundo plano con PM2
Para que el servidor continúe en marcha aunque cierres la terminal o sesión en Linux:
```bash
sudo npm install -g pm2
pm2 start server.js --name "iutepal-web"
pm2 save
pm2 startup
```

---

## 🛠️ PARTE 3: Solución de Problemas Comunes

### 1. La otra computadora dice "No se puede acceder a este sitio"
1. **Comprobar conectividad (Ping)**: En la otra PC, abre la consola y escribe:
   ```cmd
   ping 172.16.0.4
   ```
   - Si no responde: El Firewall de Windows sigue bloqueando la conexión o están en redes Wi-Fi diferentes.
2. **Aislamiento de cliente (AP Isolation)**: Algunos routers Wi-Fi corporativos o domésticos tienen una casilla llamada *"Aislamiento de AP"* que bloquea la comunicación entre dispositivos inalámbricos. Si es tu caso, desactívala en la configuración del router o conecta ambas máquinas por cable.
3. **Protocolo**: Asegúrate de escribir `http://` y no `https://`.

### 2. ¿Qué pasa si el router reinicia y cambia mi dirección IP?
El servidor detecta automáticamente tu IP cada vez que arranca. Si tu router cambia la IP por DHCP, al abrir `iniciar_servidor.bat` la consola te mostrará inmediatamente la nueva dirección para ingresar.

### 3. ¿Cómo acceder desde fuera de la red local (por Internet)?
Si deseas que alguien fuera de tu casa/oficina ingrese sin abrir puertos en tu router:
- Descarga e instala **Ngrok** ([ngrok.com](https://ngrok.com/)).
- Ejecuta en la consola:
  ```bash
  ngrok http 3000
  ```
- Te entregará un enlace HTTPS seguro público para compartir.

---

## 🖥️ PARTE 4: Crear un Icono o Acceso Directo para los Usuarios

Tienes 3 métodos fáciles para que el usuario tenga un icono en su escritorio:

### Método 1: Instalar como Aplicación PWA (El más elegante y profesional)
Tu proyecto ya está preparado como **Progressive Web App (PWA)** con el logo oficial de IUTEPAL:
1. Desde la otra PC (o teléfono), entra en Google Chrome o Microsoft Edge a: `http://172.16.0.4:3000`
2. **En Google Chrome**:
   - En la parte derecha de la barra de direcciones verás un icono de pantalla con una flecha que dice *"Instalar aplicación"*, o ve a los 3 puntos del menú > *"Guardar y compartir"* > *"Instalar Trabajos de Grado IUTEPAL"*.
3. **En Microsoft Edge**:
   - Menú de 3 puntos > *"Aplicaciones"* > *"Instalar este sitio como una aplicación"*.
4. **Resultado**: Se creará un acceso directo en el Escritorio con el **logo de IUTEPAL**, y al abrirlo se ejecutará en su propia ventana sin barras de navegador, como si fuera un programa nativo de Windows.

### Método 2: Acceso Directo de Internet (.url en Windows)
- Puedes copiar el archivo `Acceso_IUTEPAL.url` (incluido en el proyecto) al Escritorio de cualquier PC.
- O ejecutar el archivo `crear_acceso_escritorio.bat` en la otra computadora para crearlo de inmediato.

### Método 3: En Linux (.desktop)
- Copia el archivo `acceso_iutepal.desktop` a la carpeta `~/Desktop` o `~/.local/share/applications` de la máquina Linux y dale permisos de ejecución:
  ```bash
  chmod +x ~/Desktop/acceso_iutepal.desktop
  ```

---

## ⏰ PARTE 5: Mantener el Servidor Activo 24/7 sin que se Apague

Para que el servidor dure mucho tiempo encendido y disponible sin apagarse:

### 1. Evitar que la computadora se suspenda (Lo más importante)
Por defecto, Windows entra en modo suspensión a los 15-30 minutos de inactividad, lo que corta la red y apaga el servidor:
- Ve a **Configuración de Windows** $\rightarrow$ **Sistema** $\rightarrow$ **Inicio/apagado y batería** (o *Energía y suspensión*).
- En la opción **"Suspender el equipo"**, cámbialo a **"Nunca"**.
- *(La pantalla sí puede apagarse para ahorrar energía, pero el equipo debe permanecer despierto).*

### 2. Ejecutar en segundo plano (Evita cierres accidentales de ventana)
En lugar de dejar la ventana negra de consola abierta (que alguien podría cerrar por error):
- Haz doble clic en **`iniciar_en_segundo_plano.vbs`**.
- El servidor arrancará de forma invisible y permanente.
- Cuando quieras detenerlo, simplemente ejecuta **`detener_servidor.bat`**.

### 3. Recuperación automática de fallos (Auto-Restart)
- Ya configuramos `server.js` con protección contra errores no controlados (`uncaughtException`).
- El script `iniciar_servidor.bat` cuenta con un bucle de vigilancia continua: si Node.js llegara a cerrarse por cualquier motivo, se reiniciará automáticamente tras 3 segundos.

### 4. Fijar la dirección IP local (Para que nunca cambie)
Los routers a veces cambian las direcciones IP de las máquinas si se reinician:
- Puedes ir a *Configuración de Red $\rightarrow$ Propiedades de Wi-Fi/Ethernet $\rightarrow$ Asignación de IP $\rightarrow$ Manual (Estática)* y dejar fija la `172.16.0.4`.
- O en la configuración de tu router Wi-Fi, agregar una *"Reserva DHCP"* para la MAC address de esta computadora.

---

## 📁 Archivos de Ayuda Creados en la Carpeta del Proyecto

- `iniciar_servidor.bat`: Lanzador con auto-recuperación 24/7 si el proceso falla.
- `iniciar_en_segundo_plano.vbs`: Ejecuta el servidor de forma silenciosa e invisible.
- `detener_servidor.bat`: Cierra el servidor en segundo plano cuando lo necesites.
- `crear_acceso_escritorio.bat`: Crea el acceso directo en el Escritorio con logo de IUTEPAL.
- `Acceso_IUTEPAL.url`: Acceso directo listo para copiar a cualquier Escritorio.
- `abrir_puerto_firewall.bat`: Abre el puerto 3000 en el Firewall de Windows (clic derecho -> Ejecutar como administrador).
- `iniciar_servidor.sh`: Script de arranque para Linux/macOS.
- `GUIA_SERVIDOR_RED_LOCAL.txt`: Versión en texto plano para abrir con el Bloc de notas.
- `GUIA_SERVIDOR_RED_LOCAL.md`: Esta misma guía formateada en Markdown.

