import { proto, generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys';

async function before(m, chatUpdate, conn) { // Añadido conn como argumento
    if (m.isBaileys) return;
    if (!m.message) return;

    if (m.mtype === "interactiveResponseMessage" && m.quoted.fromMe) {
        appendTextMessage(JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id, chatUpdate, conn); // Añadido conn como argumento
    }
    
    async function appendTextMessage(text, chatUpdate, conn) { // Añadido conn como argumento
        try {
            let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid }, {
                userJid: conn.user.id,
                quoted: m.quoted && m.quoted.fakeObj
            });

            messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
            messages.key.id = m.key.id;
            messages.pushName = m.pushName;
            if (m.isGroup) messages.participant = m.sender;

            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)],
                type: 'append'
            };

            conn.ev.emit('messages.upsert', msg);
        } catch (error) {
            console.error('❀ Error en appendTextMessage:', error);
        }
    }
}

// Añadiendo decoraciones y mejoras para Termux
console.log('❀ _Buttons.js cargado correctamente ❀');

export default before;
