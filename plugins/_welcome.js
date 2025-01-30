import { WAMessageStubType } from '@whiskeysockets/baileys';

const WELCOME_MESSAGES = [
  "¡Bienvenido @${username} a ${group}!",
  "¡Hola @${username}, bienvenido a ${group}!",
  "@${username} se ha unido a ${group}. ¡Disfruta tu estancia!",
  "¡Saludos @${username}! Bienvenido a ${group}.",
  "@${username} acaba de unirse a ${group}. ¡Démosle la bienvenida!",
  "¡Qué alegría tenerte aquí @${username}! Bienvenido a ${group}.",
  "¡Hey @${username}! Bienvenido a nuestra familia en ${group}.",
  "¡Un aplauso para @${username} que acaba de unirse a ${group}!",
  "¡@${username}, bienvenido! Esperamos que disfrutes de tu tiempo en ${group}.",
  "¡Hola @${username}! Bienvenido a ${group}. ¡Esperamos que hagas grandes amigos aquí!",
  "¡@${username}, nos alegra verte en ${group}!",
  "¡@${username}, bienvenido a nuestro grupo! ¡Diviértete!",
  "¡@${username}, esperamos que te sientas como en casa en ${group}!",
  "¡@${username}, un fuerte abrazo de bienvenida a ${group}!",
  "¡@${username}, estamos encantados de tenerte en ${group}!"
];

const GOODBYE_MESSAGES = [
  "@${username} ha dejado el grupo. ¡Adiós!",
  "¡Hasta luego @${username}! Esperamos verte de nuevo.",
  "Lamentamos ver partir a @${username}. ¡Adiós!",
  "@${username} ha salido del grupo. ¡Buena suerte!",
  "¡Adiós @${username}! Que tengas un gran día.",
  "¡Nos vemos @${username}! Fue un placer tenerte en ${group}.",
  "@${username} ha decidido irse. ¡Te deseamos lo mejor!",
  "¡Adiós @${username}! ${group} no será lo mismo sin ti.",
  "¡Qué triste verte partir @${username}! ¡Adiós!",
  "¡Hasta pronto @${username}! Esperamos que regreses algún día.",
  "¡@${username}, adiós y buena suerte!",
  "¡@${username}, fue genial tenerte en ${group}!",
  "¡@${username}, te extrañaremos en ${group}!",
  "¡@${username}, gracias por ser parte de ${group}!",
  "¡@${username}, que tengas éxito en todo lo que hagas!"
];

const KICK_MESSAGES = [
  "@${username} ha sido expulsado del grupo.",
  "@${username} ya no es parte de ${group}.",
  "@${username} fue removido del grupo.",
  "Se ha expulsado a @${username} de ${group}.",
  "@${username} ya no está en el grupo.",
  "Lamentablemente @${username} ha sido expulsado de ${group}.",
  "@${username} ha sido removido del grupo por incumplir las normas.",
  "Hemos tenido que expulsar a @${username} de ${group}.",
  "¡@${username} fue expulsado del grupo! Esperamos que aprenda de esta experiencia.",
  "¡@${username} ya no forma parte de ${group}! Ha sido removido.",
  "¡@${username} fue expulsado por romper las reglas!",
  "¡@${username} ha sido excluido de ${group}!",
  "¡@${username} no está más en ${group}!",
  "¡@${username} fue eliminado por comportamiento inapropiado!",
  "¡@${username} ha sido retirado por el bienestar del grupo!"
];

const JOIN_APPROVAL_MESSAGES = [
  "@${username} ha solicitado unirse al grupo.",
  "@${username} desea unirse a ${group}.",
  "Solicitud de unión de @${username} a ${group}.",
  "¡Nuevo miembro potencial! @${username} ha solicitado unirse.",
  "@${username} está esperando aprobación para unirse a ${group}.",
  "¡@${username} quiere unirse a nosotros en ${group}! ¿Lo aprobamos?",
  "@${username} ha enviado una solicitud para unirse a ${group}.",
  "Estamos considerando la solicitud de @${username} para unirse a ${group}.",
  "¡@${username} desea unirse a nuestra comunidad en ${group}!",
  "¡@${username} está a la espera de ser aprobado para unirse a ${group}!",
  "¡@${username} quiere formar parte de ${group}!",
  "¡@${username} ha pedido unirse a nuestro grupo!",
  "¡@${username} espera nuestra aprobación para unirse a ${group}!",
  "¡@${username} está deseando ser parte de ${group}!",
  "¡@${username} ha enviado una solicitud para unirse a nuestra comunidad en ${group}!"
];

function getRandomMessage(messages, username, group) {
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message.replace('${username}', username).replace('${group}', group);
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let chat = global.db.data.chats[m.chat];

  const username = m.messageStubParameters[0].split`@`[0];
  const group = groupMetadata.subject;

  console.log(`Event triggered: ${m.messageStubType} for ${username} in ${group}`);
  
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const bienvenida = getRandomMessage(WELCOME_MESSAGES, username, group);
    await conn.sendMessage(m.chat, { text: bienvenida, mentions: [m.messageStubParameters[0]] });
  }

  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    const bye = getRandomMessage(GOODBYE_MESSAGES, username, group);
    await conn.sendMessage(m.chat, { text: bye, mentions: [m.messageStubParameters[0]] });
  }

  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    const kick = getRandomMessage(KICK_MESSAGES, username, group);
    await conn.sendMessage(m.chat, { text: kick, mentions: [m.messageStubParameters[0]] });
  }

  if (chat.bienvenida && m.messageStubType == 172) {
    const joinApproval = getRandomMessage(JOIN_APPROVAL_MESSAGES, username, group);
    await conn.sendMessage(m.chat, { text: joinApproval, mentions: [m.messageStubParameters[0]] });
  }
}
  
  

  
