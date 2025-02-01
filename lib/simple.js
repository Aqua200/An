import fs from 'fs';
import chalk from 'chalk';
import util from 'util';

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
    if (!msg) return null;
    return {
        id: msg.key.id,
        from: msg.key.remoteJid,
        message: msg.message,
        pushName: msg.pushName || 'Sin Nombre',
        timestamp: msg.messageTimestamp,
        isGroup: msg.key.remoteJid.endsWith('@g.us')
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
