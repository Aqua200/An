import express from 'express';
import { createServer } from 'http';
import { toBuffer } from 'qrcode';
import fetch from 'node-fetch';

function connect(conn, PORT) {
    let app = global.app = express();
    let server = global.server = createServer(app);
    let _qr = 'invalid';

    // Escuchar eventos de actualización de conexión para generar el QR
    conn.ev.on('connection.update', function appQR({ qr }) {
        if (qr) _qr = qr;
    });

    // Ruta para servir el código QR como una imagen PNG
    app.use(async (req, res) => {
        try {
            res.setHeader('content-type', 'image/png');
            res.end(await toBuffer(_qr));
        } catch (error) {
            console.error('Error al generar el código QR:', error);
            res.status(500).send('Error al generar el código QR');
        }
    });

    // Iniciar el servidor en el puerto especificado
    server.listen(PORT, () => {
        console.log('Servidor escuchando en el puerto', PORT);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`El puerto ${PORT} ya está en uso.`);
        } else {
            console.error('Error al iniciar el servidor:', err);
        }
    });
}

// Función para mantener el servidor activo (opcional)
function keepAlive(url) {
    if (!url) {
        console.warn('No se proporcionó una URL para keepAlive.');
        return;
    }

    // Verificar si la URL es válida
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.warn('La URL proporcionada para keepAlive no es válida.');
        return;
    }

    // Hacer una solicitud periódica para mantener el servidor activo
    setInterval(() => {
        fetch(url).catch((err) => {
            console.error('Error en keepAlive:', err);
        });
    }, 5 * 1000 * 60); // Cada 5 minutos
}

export default connect;
