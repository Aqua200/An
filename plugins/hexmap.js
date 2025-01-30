let handler = async (m, { isPrems, conn }) => {
    let time = global.db.data.users[m.sender].lastcofre + 86400000; // 86400000 ms = 24 horas
    if (new Date() - global.db.data.users[m.sender].lastcofre < time) 
        throw `*[❗𝐈𝐍𝐅𝐎❗]* Ya reclamaste tu cofre. Vuelve más tarde.`;

    let img = 'https://telegra.ph/file/e5c2f870680349a9efbc2.jpg';
    let texto = `
    ╔═══════════════════════
    ║ *🌟 MAPA HEXAGONAL 🌟*
    ╠═══════════════════════
    ║ 🗺️ Aquí tienes tu mapa exagonal.
    ╠═══════════════════════
    ║ ⏰ Tiempo restante para reclamar de nuevo: 24 horas.
    ╚═══════════════════════`;

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    await conn.sendFile(m.chat, img, 'hades.jpg', texto, fkontak);
    global.db.data.users[m.sender].lastcofre = new Date() * 1;
};

handler.command = ['exagonal'];
handler.register = false;
handler.admin = true;

export default handler;
