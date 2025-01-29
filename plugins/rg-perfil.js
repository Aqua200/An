import { canLevelUp, xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import os from 'os'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
  let { exp, limit, name, registered, regTime, age, level, gender, city } = global.db.data.users[who]
  let { min, xp, max } = xpRange(user.level, global.multiplier)
  let username = conn.getName(who)
  let prem = global.prems.includes(who.split`@`[0])

  if(command === 'setcity') {
    if(!args[0]) return m.reply(`🍭 Por favor ingresa la ciudad que deseas establecer.`)
    user.city = args.join(' ').trim()
    return m.reply(`🍭 Ciudad actualizada exitosamente a ${user.city}.`)
  }

  if(command === 'setgender') {
    if(!args[0]) return m.reply(`🍭 Por favor ingresa el sexo que deseas establecer (hombre o mujer).`)
    let gender = args[0].toLowerCase()
    if (gender !== 'hombre' && gender !== 'mujer') {
      return m.reply(`🍭 El sexo debe ser 'hombre' o 'mujer'.`)
    }
    user.gender = gender
    return m.reply(`🍭 Sexo actualizado exitosamente a ${user.gender}.`)
  }

  if (os.platform() === 'android') {
    // Incluir cualquier lógica específica para Termux en caso de ser necesario
    console.log('Ejecutando en Termux')
  }

  let txt = `╭─⬣「 *User Perfil* 」⬣\n`
     txt += `│  ≡◦ *🪴 Nombre ∙* ${name}\n`
     txt += `│  ≡◦ *🐢 Edad ∙* ${age} años\n`
     txt += `│  ≡◦ *✨ Sexo ∙* ${gender || 'No especificado'}\n`
     txt += `│  ≡◦ *🌆 Ciudad ∙* ${city || 'No especificada'}\n`
     txt += `│  ≡◦ *📞 Numero ∙* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}\n`
     txt += `│  ≡◦ *🍬 Dulces ∙* ${limit}\n`
     txt += `│  ≡◦ *💫 Experiencia ∙* Total ${exp} ( *${user.exp - min}/${xp}* )\n`
     txt += `│  ≡◦ *👑 Premium ∙* ${prem ? 'Si' : 'No'}\n`
     txt += `╰─⬣`
  await conn.sendFile(m.chat, pp, 'thumbnail.jpg', txt, m)
}

handler.help = ['perfil', 'perfil @user', 'setcity <ciudad>', 'setgender <hombre|mujer>']
handler.tags = ['rg']
handler.command = ['perfil', 'profile', 'setcity', 'setgender']
handler.register = true

export default handler
