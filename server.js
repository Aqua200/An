import express from 'express';
import { createServer } from 'http';
import { toBuffer } from 'qrcode';
import fetch from 'node-fetch';
import winston from 'winston';

// Configuración de logging con Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

// Configuración dinámica desde variables de entorno
const PORT = process.env.PORT || 3000;
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL;

// Función para generar el código QR
async function generateQR(qr) {
    try {
        return await toBuffer(qr);
    } catch (error) {
        logger.error('Error al generar el código QR:', error);
        throw new Error('Error al generar el código QR');
    }
}

// Función para mantener el servidor activo
function keepAlive(url) {
    if (!url) {
        logger.warn('No se proporcionó una URL para keepAlive.');
        return;
    }

    // Verificar si la URL es válida
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        logger.warn('La URL proporcionada para keepAlive no es válida.');
        return;
    }

    // Hacer una solicitud periódica para mantener el servidor activo
    setInterval(() => {
        fetch(url).catch((err) => {
            logger.error('Error en keepAlive:', err);
        });
    }, 5 * 1000 * 60); // Cada 5 minutos
}

// Función principal para conectar y configurar el servidor
function connect(conn) {
    let app = global.app = express();
    let server = global.server = createServer(app);
    let _qr = 'invalid';

    // Escuchar eventos de actualización de conexión para generar el QR
    conn.ev.on('connection.update', function appQR({ qr }) {
        if (qr) _qr = qr;
    });

    // Ruta específica para servir el código QR como una imagen PNG
    app.get('/qr', async (req, res) => {
        try {
            const qrBuffer = await generateQR(_qr);
            res.setHeader('content-type', 'image/png');
            res.end(qrBuffer);
        } catch (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        }
    });

    // Iniciar el servidor en el puerto especificado
    server.listen(PORT, () => {
        logger.info(`Servidor escuchando en el puerto ${PORT}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger.error(`El puerto ${PORT} ya está en uso.`);
        } else {
            logger.error('Error al iniciar el servidor:', err);
        }
    });

    // Activar keepAlive si se proporciona una URL
    if (KEEP_ALIVE_URL) {
        keepAlive(KEEP_ALIVE_URL);
    } else {
        logger.warn('No se configuró una URL para keepAlive.');
    }
}

export default connect;
