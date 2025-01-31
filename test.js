import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import syntaxError from 'syntax-error';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(__dirname);

let folders = ['.'];
let files = [];

for (let folder of folders) {
    try {
        for (let file of fs.readdirSync(folder).filter(v => v.endsWith('.js'))) {
            files.push(path.resolve(path.join(folder, file)));
        }
    } catch (err) {
        console.error(`Error reading directory ${folder}:`, err);
        process.exit(1);
    }
}

for (let file of files) {
    if (file === __filename) continue;

    console.error('Checking', file);

    try {
        const code = fs.readFileSync(file, 'utf8');
        const error = syntaxError(code, file, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        });

        if (error) {
            console.error(`Syntax error in ${file}:\n\n${error}`);
            process.exit(1);
        }

        console.log('Done', file);
    } catch (err) {
        console.error(`Error reading or parsing ${file}:`, err);
        process.exit(1);
    }
}
