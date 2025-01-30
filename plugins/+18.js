import axios from 'axios';
import fetch from 'node-fetch';

// Main handler function for NSFW commands
let handler = async (m, { command, conn, usedPrefix }) => {
    try {
        // Check if NSFW mode is enabled in the group
        if (!db.data.chats[m.chat].modohorny && m.isGroup)
            throw '⚠ 𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊.';

        // Function to send image response
        const sendImage = async (url) => {
            conn.sendMessage(m.chat, { image: { url }, caption: `_${command}_`.trim() }, { quoted: m });
        };

        // Define a mapping of commands to URLs
        const commandMap = {
            nsfwloli: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwloli.json',
            nsfwfoot: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfoot.json',
            nsfwass: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwass.json',
            nsfwbdsm: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwbdsm.json',
            nsfwcum: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwcum.json',
            nsfwero: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwero.json',
            nsfwfemdom: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfemdom.json',
            nsfwglass: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwglass.json',
            hentai: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/hentai.json',
            nsfworgy: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfworgy.json',
            ecchi: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/ecchi.json',
            furro: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/furro.json',
            panties: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json',
            porno: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json',
            pechos: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/pechos.json',
            yuri: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json',
        };

        // Handle commands mapped to URLs
        if (commandMap[command]) {
            const res = (await axios.get(commandMap[command])).data;
            const url = res[Math.floor(res.length * Math.random())];
            return sendImage(url);
        }

        // Handle specific commands with different URLs
        switch (command) {
            case 'tetas':
            case 'booty':
                const resError = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/${command}.json`)).data;
                let res = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/${command === 'tetas' ? 'boobs' : 'ass'}?apikey=fg-dylux`).data;
                if (!res) res = resError[Math.floor(resError.length * Math.random())];
                return sendImage(res);

            case 'trapito':
                const trapRes = await fetch(`https://api.waifu.pics/nsfw/trap`);
                const trapJson = await trapRes.json();
                return sendImage(trapJson.url);

            case 'imagenlesbians':
                const imgLesbiansError = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json`)).data;
                let imgLesbians = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux`).data;
                if (!imgLesbians) imgLesbians = imgLesbiansError[Math.floor(imgLesbiansError.length * Math.random())];
                return sendImage(imgLesbians);

            case 'pene':
                const peneError = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/pene.json`)).data;
                let pene = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/penis?apikey=fg-dylux`).data;
                if (!pene) pene = peneError[Math.floor(peneError.length * Math.random())];
                return sendImage(pene);

            case 'yaoi':
                const yaoiRes = await fetch(`https://nekobot.xyz/api/image?type=yaoi`);
                const yaoiJson = await yaoiRes.json();
                return sendImage(yaoiJson.message);

            case 'yaoi2':
                const yaoi2Res = await fetch(`https://purrbot.site/api/img/nsfw/yaoi/gif`);
                const yaoi2Json = await yaoi2Res.json();
                return sendImage(yaoi2Json.link);

            case 'yuri2':
                const yuri2Error = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json`)).data;
                const yuri2Res = await fetch(`https://purrbot.site/api/img/nsfw/yuri/gif`);
                const yuri2Json = await yuri2Res.json();
                let yuri2Url = yuri2Json.link;
                if (!yuri2Url) yuri2Url = yuri2Error[Math.floor(yuri2Error.length * Math.random())];
                return sendImage(yuri2Url);

            case 'randomxxx':
                const rawJsonUrls = [
                    'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tetas.json',
                    'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json',
                    'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/hentai.json',
                ];
                const randomJsonUrl = rawJsonUrls[Math.floor(rawJsonUrls.length * Math.random())];
                const randomRes = (await axios.get(randomJsonUrl)).data;
                const randomUrl = randomRes[Math.floor(randomRes.length * Math.random())];
                return sendImage(randomUrl);

            // Add more cases as needed
        }
    } catch (error) {
        console.error('Error in +18.js handler:', error);
    }
};

// Handler metadata
handler.help = [
    'nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'randomxxx'
];
handler.command = [
    'nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'randomxxx'
];
handler.tags = ['nsfw'];
handler.register = true;
handler.group = true;
handler.limit = 4;

export default handler;
