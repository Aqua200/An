import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, text, args }) => {
    if (!text) {
        return m.reply("❀ Ingrese un texto de lo que quieres buscar");
    }

    let ytres = await search(args.join(" "));
    if (ytres.length === 0) return m.reply("❀ No se encontraron resultados");

    let txt = `
╔═════════════════════════
║ 🎬 *Resultado de la búsqueda* 🎬
╠═════════════════════════
║ - *Título* : ${ytres[0].title}
║ - *Duración* : ${ytres[0].timestamp}
║ - *Publicado* : ${ytres[0].ago}
║ - *Canal* : ${ytres[0].author.name || 'Desconocido'}
║ - *Url* : ${'https://youtu.be/' + ytres[0].videoId}
╚═════════════════════════`;
    await conn.sendFile(m.chat, ytres[0].image, 'thumbnail.jpg', txt, m);

    try {
        let api = await fetch(`https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=https://youtu.be/${ytres[0].videoId}`);
        let json = await api.json();
        if (json.result && json.result.download_url) {
            let { title, download_url } = json.result;
            await conn.sendMessage(m.chat, { video: { url: download_url }, caption: `${title}`, mimetype: 'video/mp4', fileName: `${title}.mp4` }, { quoted: m });
        } else {
            throw new Error("Error en la API de descarga");
        }
    } catch (error) {
        console.error(error);
        m.reply("❀ Hubo un error al intentar descargar el video");
    }
};

handler.command = /^(play2|vid)$/i;

export default handler;

async function search(query, options = {}) {
    let search = await yts.search({ query, hl: "es", gl: "ES", ...options });
    return search.videos;
}
