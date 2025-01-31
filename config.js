#!/usr/bin/env node

import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─────────────────────────────────────────────────────────────────*

global.owner = [
  ['', 'Neykoor', true],
  ['', '', true],
];

//*─────────────────────────────────────────────────────────────────*

global.mods = [];
global.prems = [];

//*─────────────────────────────────────────────────────────────────*

global.packname = '🌸Anika✧🌙';
global.author = '🌸Anika✧🌙';
global.wait = '🌸Anika✧🌙';
global.botname = '🌸Anika✧🌙';
global.textbot = 'Estoy aquí para servirte 💁‍♀️✨';
global.listo = '¿Qué más puedo hacer por ti? 😊💖';
global.namechannel = '🌸Anika✧🌙';
global.baileys = '@whiskeysockets/baileys';

//*─────────────────────────────────────────────────────────────────*

global.catalogo = fs.readFileSync('./storage/img/catalogo.png');
global.siskedurl = fs.readFileSync('./storage/img/siskedurl.jpg');

//*─────────────────────────────────────────────────────────────────*

global.group = 'https://chat.whatsapp.com/KGdftYYFrbVBzTpZE73LBI';
global.canal = 'https://whatsapp.com/channel/0029Vb3uTsb90x2rvI6D3G3b';

//*─────────────────────────────────────────────────────────────────*

global.estilo = { 
  key: { 
    fromMe: false, 
    participant: '0@s.whatsapp.net', 
    ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) 
  }, 
  message: { 
    orderMessage: { 
      itemCount: -999999, 
      status: 1, 
      surface: 'CATALOG', 
      message: 'Anika Bot', 
      orderTitle: 'Menu',
      sellerJid: '0@s.whatsapp.net' 
    } 
  } 
};

//*─────────────────────────────────────────────────────────────────*

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

//*─────────────────────────────────────────────────────────────────*

global.multiplier = 69;
global.maxwarn = '2'; // máxima advertencias

//*─────────────────────────────────────────────────────────────────*

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});
