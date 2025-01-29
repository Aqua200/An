// Regex to match links from Telegram and WhatsApp
let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i;

/**
 * Function to handle anti-link behavior in groups
 * @param {object} m - Message object
 * @param {boolean} isAdmin - Indicates if the sender is an admin
 * @param {boolean} isBotAdmin - Indicates if the bot is an admin
 */
export async function before(m, { isAdmin, isBotAdmin }) {
    try {
        // Ignore messages from the bot itself
        if (m.isBaileys && m.fromMe) return true;
        if (!m.isGroup) return false; // Only apply in groups

        // Retrieve chat and bot settings from the database
        let chat = global.db.data.chats[m.chat];
        let delet = m.key.participant;
        let bang = m.key.id;
        let bot = global.db.data.settings[this.user.jid] || {};
        const isGroupLink = linkRegex.exec(m.text);
        const grupo = `https://chat.whatsapp.com`;

        // If the sender is an admin and anti-link is enabled, allow the message
        if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
            return conn.reply(m.chat, `🏷 *Hey!! el anti link está activo, pero eres admin, ¡salvado!*`, m);
        }

        // If anti-link is enabled and the sender is not an admin, handle the link
        if (chat.antiLink && isGroupLink && !isAdmin) {
            if (isBotAdmin) {
                const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
                if (m.text.includes(linkThisGroup)) return true; // Allow links from the same group
            }
            await conn.reply(m.chat, `📎 *¡Enlace detectado!*\n\n*${await this.getName(m.sender)} mandaste un enlace prohibido, serás eliminado*`, m);
            if (!isBotAdmin) return conn.reply(m.chat, `🌼 *No soy admin, no puedo eliminar intrusos*`, m);
            if (isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } else if (!bot.restrict) {
                return conn.reply(m.chat, `*¡Esta característica está desactivada!*`, m);
            }
        }
        return true; // Allow message if no conditions are met
    } catch (error) {
        console.error('Error in _antilink.js:', error);
        return false; // Return false if an error occurs
    }
}
