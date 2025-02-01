import fs from 'fs';
import chalk from 'chalk';
import util from 'util';
import fetch from 'node-fetch';
import { default as _makeWaSocket } from '@whiskeysockets/baileys';

/**
 * Prototipo extendido para mejorar compatibilidad con Baileys
 */
export const protoType = {
    decodeJid(jid) {
        if (!jid) return null;
        if (/:\d+@/gi.test(jid)) {
            let decode = jid.split("@")[0].split(":");
            return decode.length > 1 ? decode[1] + "@s.whatsapp.net" : jid;
        }
        return jid;
    },

    async getBuffer(filePath) {
        if (/^https?:\/\//.test(filePath)) {
            let res = await fetch(filePath);
            if (!res.ok) throw new Error(`Error al obtener archivo: ${res.statusText}`);
            return Buffer.from(await res.arrayBuffer());
        }
        if (fs.existsSync(filePath)) {
            return fs.promises.readFile(filePath);
        } else {
            throw new Error("Archivo no encontrado");
        }
    },

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

/**
 * Serializa mensajes para hacerlos más manejables
 */
export function serialize(msg) {
    if (!msg || !msg.key) return null;
    return {
        id: msg.key.id || null,
        from: msg.key.remoteJid || null,
        message: msg.message || null,
        pushName: msg.pushName || 'Sin Nombre',
        timestamp: msg.messageTimestamp || null,
        isGroup: msg.key.remoteJid ? msg.key.remoteJid.endsWith('@g.us') : false
    };
}

/**
 * Logger con colores usando Chalk
 */
export const logger = {
    info(...args) {
        console.log(chalk.bold.bgGreen(" INFO "), chalk.green(util.format(...args)));
    },
    error(...args) {
        console.log(chalk.bold.bgRed(" ERROR "), chalk.red(util.format(...args)));
    },
    warn(...args) {
        console.log(chalk.bold.bgYellow(" WARN "), chalk.yellow(util.format(...args)));
    },
    debug(...args) {
        console.log(chalk.bold.bgBlue(" DEBUG "), chalk.blue(util.format(...args)));
    }
};

/**
 * Función para verificar si un valor es nulo o indefinido
 */
export function isNullish(value) {
    return value === null || value === undefined;
}

/**
 * Función para inicializar la conexión con WhatsApp usando Baileys
 */
export function makeWASocket(connectionOptions) {
    return _makeWaSocket(connectionOptions);
}
