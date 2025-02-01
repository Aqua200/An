import { join, dirname } from 'path';
   import { createRequire } from 'module';
   import { fileURLToPath } from 'url';
   import { setupMaster, fork } from 'cluster';
   import { watch } from 'fs';
   import cfonts from 'cfonts';
   import { createInterface } from 'readline';
   import yargs from 'yargs';
   import express from 'express';
   import chalk from 'chalk';
   import os from 'os';
   import { promises as fsPromises } from 'fs';

   const __dirname = dirname(fileURLToPath(import.meta.url));
   const require = createRequire(__dirname);
   const { say } = cfonts;
   const rl = createInterface(process.stdin, process.stdout);

   const app = express();
   const port = process.env.PORT || 8080;

   // Configuración de colores morados y púrpuras
   say('Anika\nBot', {
     font: 'chrome',
     align: 'center',
     gradient: ['#800080', '#9400D3'], // Morado y púrpura
     transitionGradient: true, // Mejora la transición de colores
   });

   let isRunning = false;
   let restartCount = 0;
   const maxRestarts = 5; // Límite de reinicios

   async function start(files) {
     if (isRunning) return;
     isRunning = true;

     for (const file of files) {
       const currentFilePath = new URL(import.meta.url).pathname;
       let args = [join(__dirname, file), ...process.argv.slice(2)];

       // Mostrar el comando ejecutado con colores morados
       say([process.argv[0], ...args].join(' '), {
         font: 'console',
         align: 'center',
         gradient: ['#800080', '#9400D3'], // Morado y púrpura
       });

       setupMaster({
         exec: args[0],
         args: args.slice(1),
       });

       let p = fork();

       p.on('message', (data) => {
         console.log(chalk.magenta('[RECEIVED]'), data);
         switch (data) {
           case 'reset':
             p.process.kill();
             isRunning = false;
             start(files);
             break;
           case 'uptime':
             p.send(process.uptime());
             break;
         }
       });

       p.on('exit', (_, code) => {
         isRunning = false;
         console.error(chalk.red('Ocurrió un error inesperado:'), code);

         if (restartCount >= maxRestarts) {
           console.error(chalk.red('Se alcanzó el límite de reinicios. Deteniendo el bot...'));
           process.exit(1); // Salir del proceso si se supera el límite
         }

         restartCount++;

         // Reiniciar el proceso
         start(files);

         if (code === 0) return;

         // Usar fs.watch en lugar de fs.watchFile
         const watcher = watch(args[0], (eventType, filename) => {
           if (eventType === 'change') {
             watcher.close(); // Cerrar el watcher antes de reiniciar
             start(files);
           }
         });
       });

       let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
       if (!opts['test']) {
         if (!rl.listenerCount()) {
           rl.on('line', (line) => {
             p.emit('message', line.trim());
           });
         }
       }
     }
   }

   // Iniciar el bot
   start(['Whatsapp-bot.js']);

   // Manejo de cierre limpio
   process.on('SIGINT', () => {
     console.log(chalk.yellow('\nDeteniendo el bot...'));
     process.exit();
   });
