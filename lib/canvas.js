import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Levelup image
 * @param {String} teks 
 * @param {Number} level 
 * @returns {Promise<Buffer>}
 */
export function levelup(teks, level) {
    return new Promise((resolve, reject) => {
        if (!(global.support.convert || global.support.magick || global.support.gm)) {
            return reject(new Error('No image processing support available!'));
        }
        
        const font = join(__dirname, '../src/font');
        const fontLevel = join(font, 'level_c.otf');
        const fontTexts = join(font, 'texts.otf');
        const xtsx = join(__dirname, '../src/lvlup_template.jpg');
        
        let anotations = '+1385+260';
        if (level > 2) anotations = '+1370+260';
        if (level > 10) anotations = '+1330+260';
        if (level > 50) anotations = '+1310+260';
        if (level > 100) anotations = '+1260+260';

        const [_spawnprocess, ..._spawnargs] = [
            ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
            'convert',
            xtsx,
            '-font', fontTexts,
            '-fill', '#0F3E6A',
            '-size', '1024x784',
            '-pointsize', '68',
            '-interline-spacing', '-7.5',
            '-annotate', '+153+200', teks,
            '-font', fontLevel,
            '-fill', '#0A2A48',
            '-size', '1024x784',
            '-pointsize', '140',
            '-interline-spacing', '-1.2',
            '-annotate', anotations, level,
            '-append', 'jpg:-'
        ];

        let bufs = [];
        const process = spawn(_spawnprocess, _spawnargs);
        
        process.on('error', reject);
        process.on('close', () => resolve(Buffer.concat(bufs)));
        process.stdout.on('data', chunk => bufs.push(chunk));
    });
}
