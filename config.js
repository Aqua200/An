const config = {
  owner: [
    ['', 'Neykoor', true],
    ['', '', true],
  ],
  packname: '🌸Anika✧🌙',
  author: '🌸Anika✧🌙',
  wait: '🌸Anika✧🌙',
  botname: '🌸Anika✧🌙',
  textbot: 'Estoy aquí para servirte 💁‍♀️✨',
  listo: '¿Qué más puedo hacer por ti? 😊💖',
  namechannel: '🌸Anika✧🌙',
  baileys: '@whiskeysockets/baileys',
  catalogo: fs.readFileSync('./storage/img/catalogo.png', { encoding: 'base64' }),
  siskedurl: fs.readFileSync('./storage/img/siskedurl.jpg', { encoding: 'base64' }),
  group: 'https://chat.whatsapp.com/KGdftYYFrbVBzTpZE73LBI',
  canal: 'https://whatsapp.com/channel/0029Vb3uTsb90x2rvI6D3G3b',
  estilo: { 
    key: { 
      fromMe: false, 
      participant: '0@s.whatsapp.net', 
      ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) 
    }, 
    message: { 
      orderMessage: { 
        itemCount: -999999, 
        status: 1, 
        surface: 'CATALOG', 
        message: 'Anika Bot', 
        orderTitle: 'Menu',
        sellerJid: '0@s.whatsapp.net' 
      } 
    } 
  },
  multiplier: 69,
  maxwarn: '2',
};

export default config;
