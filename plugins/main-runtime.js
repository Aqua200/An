let handler = async (m, { conn, args, usedPrefix, command }) => {
    
    let _muptime = 0;
    if (process.send) {
        process.send('uptime');
        _muptime = await new Promise(resolve => {
            process.once('message', resolve);
            setTimeout(() => resolve(0), 1000); // Resuelve con 0 si no se recibe un mensaje en 1 segundo
        }) * 1000;
    }
    let muptime = formatUptime(_muptime);

    let currentTime = new Date();
    let formattedTime = formatTime(currentTime);

    let message = `*🌹 He estado activa durante :* ${muptime}\n*🕒 Hora actual:* ${formattedTime}`;
    conn.reply(m.chat, message, m);
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
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
