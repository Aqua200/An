import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const terminalImage = global.opts?.img ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  const _name = await conn.getName(m.sender)
  const sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
  const chat = await conn.getName(m.chat)
  let img
  try {
    if (global.opts?.img)
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error('Error downloading image:', e)
  }
  const filesize = (m.msg ?
    m.msg.vcard ?
      m.msg.vcard.length :
      m.msg.fileLength ?
        m.msg.fileLength.low || m.msg.fileLength :
        m.msg.axolotlSenderKeyDistributionMessage ?
          m.msg.axolotlSenderKeyDistributionMessage.length :
          m.text ?
            m.text.length :
            0
    : m.text ? m.text.length : 0) || 0
  const user = global.DATABASE.data.users[m.sender]
  const me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
  console.log(`
${(chalk.cyan('╭────═[ 𝚂𝚙𝚎𝚎𝚍𝚡 𝙱𝚘𝚝 ]═─────⋆'))}
${(chalk.cyan('│╭───────────────···'))}
${(chalk.cyan('┴│🚩 '))} ${chalk.blue('%s')}
${(chalk.cyan('✩│⚕️ '))} ${chalk.black(chalk.cyan('%s'))}ㅤ${chalk.black(chalk.cyan('%s'))} 
${(chalk.cyan('✩│🍒 '))} ${chalk.magenta('%s [%s %sB]')}
${(chalk.cyan('✩│✨ '))} ${chalk.white('%s')}
${(chalk.cyan('✩│💫 '))} ${chalk.yellow('%s%s')}
${(chalk.cyan('┬│🫧 '))} ${chalk.magenta('%s')} ${chalk.black(chalk.red('%s'))}
${(chalk.cyan('│╰────────────────···'))}
${(chalk.cyan('╰───────────═┅═──────────'))}
`.trim(),
    me + ' ~' + conn.user.name,
    (m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toTimeString(),
    m.messageStubType ? WAMessageStubType[m.messageStubType] : '',
    filesize,
    filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1),
    ['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '',
    sender,
    m ? m.exp : '?',
    user ? '|' + user.exp + '|' + user.diamond : '' + ('|' + user.level),
    m.chat + (chat ? ' ~' + chat : ''),
    m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : ''
  )
  if (img) console.log(img.trimEnd())
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
    const mdFormat = (depth = 4) => (_, type, text, monospace) => {
      const types = {
        _: 'italic',
        '*': 'bold',
        '~': 'strikethrough'
      }
      text = text || monospace
      const formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
      return formatted
    }
    if (log.length < 4096)
      log = log.replace(urlRegex, (url, i, text) => {
        const end = url.length + i
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
      })
    log = log.replace(mdRegex, mdFormat(4))
    if (m.mentionedJid) for (const user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)))
    console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }
  if (m.messageStubParameters) console.log(m.messageStubParameters.map(jid => {
    if (!jid) return ''
    jid = conn.decodeJid(jid)
    const name = conn.getName(jid)
    return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''))
  }).join(', '))
  if (/document/i.test(m.mtype)) console.log(`📄 ${m.msg.fileName || m.msg.displayName || 'Document'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
  else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
  }

  console.log()
  // if (m.quoted) console.log(m.msg.contextInfo)
}

// Ajuste de la ruta del archivo para compatibilidad con Termux
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const file = path.resolve(__dirname, 'print.js')
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})
