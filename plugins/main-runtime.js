let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Obtener el tiempo de actividad del proceso en milisegundos
        let _muptime = process.uptime() * 1000;
        let muptime = formatUptime(_muptime);

        // Obtener la hora actual
        let currentTime = new Date();
        let formattedTime = formatTime(currentTime);

        // Crear el mensaje
        let message = `*🌹 He estado activa durante:* ${muptime}\n*🕒 Hora actual:* ${formattedTime}`;

        // Enviar el mensaje
        await conn.reply(m.chat, message, m);
    } catch (error) {
        console.error("Error en el handler:", error);
        conn.reply(m.chat, "❌ Ocurrió un error al procesar la solicitud.", m);
    }
};

handler.help = ['runtime'];
handler.tags = ['main'];
handler.command = ['runtime', 'uptime'];
export default handler;

function formatUptime(ms) {
    if (isNaN(ms)) return '--:--:--';
    let days = Math.floor(ms / 86400000);
    let hours = Math.floor((ms % 86400000) / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatTime(date) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son base 0
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
