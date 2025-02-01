import { createRequire } from 'module';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { spawn } from 'child_process';
import readline from 'readline';
import NodeCache from 'node-cache';
import P from 'pino';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { Low, JSONFile } from 'lowdb';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
import { useMultiFileAuthState, DisconnectReason, jidNormalizedUser } from '@whiskeysockets/baileys';
import pkg from 'google-libphonenumber';
import { tmpdir } from 'os';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();

// Configuración global
const { platform, env } = process;
const PORT = env.PORT || env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de logger
const logger = P({ level: 'silent' });

// Procesar argumentos con yargs
const args = yargs(hideBin(process.argv)).argv;

// Verificar que args._ existe y tiene al menos un elemento
const dbFileName = args._ && args._.length > 0 ? args._[0] + '_' : '';

// Base de datos
global.db = new Low(new JSONFile(`${dbFileName}database.json`));
global.db.data = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
};

// Cargar base de datos
async function loadDatabase() {
  try {
    if (global.db.data === null) {
      global.db.READ = true;
      await global.db.read();
      global.db.READ = null;
      global.db.data = global.db.data || {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
      };
    }
    global.db.chain = lodash.chain(global.db.data);
  } catch (error) {
    logger.error('Error al cargar la base de datos:', error);
  }
}

// Conexión WhatsApp
const { state, saveState, saveCreds } = await useMultiFileAuthState('./sessions');
const connectionOptions = {
  logger: logger,
  printQRInTerminal: true,
  auth: {
    creds: state.creds,
    keys: state.keys,
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (key) => {
    let jid = jidNormalizedUser(key.remoteJid);
    let msg = await store.loadMessage(jid, key.id);
    return msg?.message || "";
  },
};

// Crear socket
global.conn = makeWASocket(connectionOptions);

// Funciones auxiliares
function clearTmp() {
  try {
    const tmpDir = join(__dirname, 'tmp');
    readdirSync(tmpDir).forEach((file) => {
      const filePath = join(tmpDir, file);
      const stats = statSync(filePath);
      if (stats.isFile() && (Date.now() - stats.mtimeMs >= 180000)) {
        unlinkSync(filePath);
      }
    });
  } catch (error) {
    logger.error('Error al limpiar archivos temporales:', error);
  }
}

function purgeSession() {
  try {
    const preKeys = readdirSync('./sessions').filter((file) => file.startsWith('pre-key-'));
    preKeys.forEach((file) => unlinkSync(`./sessions/${file}`));
  } catch (error) {
    logger.error('Error al purgar sesiones:', error);
  }
}

async function connectionUpdate(update) {
  try {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      logger.info('Conectado correctamente.');
    } else if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        logger.error('Sesión cerrada, elimina la carpeta "sessions" y vuelve a escanear el QR.');
      }
    }
  } catch (error) {
    logger.error('Error en la actualización de la conexión:', error);
  }
}

// Iniciar base de datos y conexiones
await loadDatabase();

// Manejadores de eventos
global.conn.ev.on('connection.update', connectionUpdate);
global.conn.ev.on('creds.update', saveCreds);

// Funciones para limpiar y probar
setInterval(clearTmp, 180000);
setInterval(purgeSession, 3600000);

// Función principal
async function main() {
  try {
    // Código principal aquí
    console.log('Bot de WhatsApp iniciado...');
  } catch (error) {
    logger.error('Error en la función principal:', error);
  }
}

main().catch((err) => logger.error(err));
