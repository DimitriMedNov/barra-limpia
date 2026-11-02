// Barra limpia: esconde iconos del menú del sistema (arriba a la derecha) que no quieres ver.
// Deja a la vista Wi-Fi, modo de energía y batería, y los avisos de privacidad (micrófono, cámara,
// pantalla compartida), que solo salen cuando algo te está grabando.

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Iconos de GNOME que se esconden (nombre interno en el menú del sistema).
const DE_GNOME = ['_bluetooth', '_volumeOutput', '_doNotDisturb'];
// Iconos que agregan otras extensiones, reconocidos por su clase de estilo.
const DE_EXTENSIONES = ['kiwi-dnd-indicator'];

export default class BarraLimpia extends Extension {
    enable() {
        this._vigilados = new Map(); // actor → ids de sus conexiones
        const ajustes = Main.panel.statusArea.quickSettings;

        // El menú del sistema se arma de forma asíncrona y Kiwi puede volver a crear su icono
        // más tarde: cada vez que entra un icono nuevo se revisa todo otra vez (es barato).
        this._idHijo = ajustes._indicators.connect('child-added', () => this._revisarTodo());
        this._revisarTodo();
    }

    _revisarTodo() {
        const ajustes = Main.panel.statusArea.quickSettings;
        for (const nombre of DE_GNOME) {
            if (ajustes[nombre])
                this._esconder(ajustes[nombre]);
        }
        for (const hijo of ajustes._indicators.get_children()) {
            if (DE_EXTENSIONES.some(clase => (hijo.style_class ?? '').includes(clase)))
                this._esconder(hijo);
        }
    }

    _esconder(actor) {
        if (this._vigilados.has(actor))
            return;
        actor.hide();
        // GNOME y Kiwi vuelven a mostrar el icono cuando cambia su estado: se vuelve a esconder.
        const id = actor.connect('notify::visible', () => {
            if (actor.visible)
                actor.hide();
        });
        const idFin = actor.connect('destroy', () => this._vigilados.delete(actor));
        this._vigilados.set(actor, [id, idFin]);
    }

    disable() {
        const caja = Main.panel.statusArea.quickSettings._indicators;
        if (this._idHijo)
            caja.disconnect(this._idHijo);
        this._idHijo = 0;
        for (const [actor, ids] of this._vigilados) {
            ids.forEach(id => actor.disconnect(id));
            // Se le devuelve su estado real: los de GNOME lo recalculan solos; el de Kiwi
            // está transparente cuando "No molestar" está apagado.
            if (actor._syncIndicatorsVisible)
                actor._syncIndicatorsVisible();
            else
                actor.visible = actor.opacity > 0;
        }
        this._vigilados.clear();
    }
}
