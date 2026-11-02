# Barra limpia

Extensión de GNOME que esconde de la barra de arriba los iconos de **Bluetooth**, **volumen** y
**No molestar** (el de GNOME y el de Kiwi). Quedan a la vista Wi-Fi, modo de energía y batería.

Los avisos de privacidad (micrófono, cámara y pantalla compartida) no se tocan: solo aparecen
cuando algo te está grabando y conviene verlos.

Los controles siguen en el menú del sistema; solo se esconde el icono de la barra.

Para cambiar qué se esconde, edita las listas `DE_GNOME` y `DE_EXTENSIONES` al principio de
`extension/extension.js`.

## Instalar
Requisitos: GNOME Shell 48 a 51 (Wayland o X11).
Probada en CachyOS (Arch) con GNOME 51.

```bash
git clone https://github.com/DimitriMedNov/barra-limpia.git
cd barra-limpia
./install.sh
```

No pide sudo: todo queda en tu usuario (`~/.local/share/gnome-shell/extensions/`).
Después **cierra sesión y vuelve a entrar**. En Wayland, GNOME solo carga extensiones nuevas o
actualizadas al iniciar sesión (bloquear la pantalla no basta).

Para actualizar: `git pull` y otra vez `./install.sh` (y cerrar sesión).
Para quitarla: `./install.sh --quitar`.

## Problemas comunes
- **No la veo después de instalar.** Cierra sesión y vuelve a entrar. Si sigue sin salir, revisa que
  esté activa: `gnome-extensions info barra-limpia@dimitrimednov.github.io` debe decir `State: ACTIVE`.
- **Ver los errores:** `journalctl --user -b -o cat /usr/bin/gnome-shell | grep -i "Barra limpia"`.
- **Tu GNOME es más nuevo que 51.** Agrega tu versión a `shell-version` en
  `extension/metadata.json`, instala otra vez y prueba. Si algo falla, abre un *issue*.

## Licencia
[MIT](LICENSE). Úsala, cópiala y cámbiala como quieras.
