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

const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();

// Configuración global
const { platform, env } = process;
const PORT = env.PORT || env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de logger
const logger = P({ level: 'silent' });

// Base de datos
global.db = new Low(new JSONFile(`${yargs.argv._[0] ? yargs.argv._[0] + '_' : ''}database.json`));
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
  const tmpDir = join(__dirname, 'tmp');
  readdirSync(tmpDir).forEach((file) => {
    const filePath = join(tmpDir, file);
    const stats = statSync(filePath);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 180000)) {
      unlinkSync(filePath);
    }
  });
}

function purgeSession() {
  const preKeys = readdirSync('./sessions').filter((file) => file.startsWith('pre-key-'));
  preKeys.forEach((file) => unlinkSync(`./sessions/${file}`));
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect } = update;
  if (connection === 'open') {
    logger.info('Conectado correctamente.');
  } else if (connection === 'close') {
    if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
      logger.error('Sesión cerrada, elimina la carpeta "sessions" y vuelve a escanear el QR.');
    }
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
  // Código principal aquí
  console.log('Bot de WhatsApp iniciado...');
}

main().catch((err) => logger.error(err));
