import { fileURLToPath } from 'url';
import path from 'path';

// Definir __dirname manualmente en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resto del código
import { readdirSync, statSync } from 'fs';
import cluster from 'cluster';

const pluginFolder = path.join(__dirname, './plugins/index');

// Función para cargar plugins
function loadPlugins() {
    try {
        const files = readdirSync(pluginFolder);
        files.forEach(file => {
            const filePath = path.join(pluginFolder, file);
            if (statSync(filePath).isFile() && file.endsWith('.js')) {
                import(filePath).then(module => {
                    console.log(`Plugin cargado: ${file}`);
                }).catch(error => {
                    console.error(`Error al cargar ${file}:`, error);
                });
            }
        });
    } catch (error) {
        console.error('Error al leer la carpeta de plugins:', error);
    }
}

// Si es el proceso principal, cargar los plugins
if (cluster.isPrimary) {
    console.log('Cargando plugins...');
    loadPlugins();
}
