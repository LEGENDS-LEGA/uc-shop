const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const bot = new TelegramBot('7357455642:AAHbHrrL5X3h1VG_lXX2LNam8-Z0AiPur6E', {polling: true});
const MOD = 7316630403;

// Read the IDs from file
let ids = fs.readFileSync('ids.txt', 'utf-8').split('\n').filter(Boolean);

// Send messages to all IDs
ids.forEach(id => {
  bot.sendMessage(id, "Աշխարհի ամենալավ UC-ները, 𝐋𝐞𝐠𝐞𝐧𝐝-ի կողմից սպասում են ձեզ, ➡️ Սեղմեք այս հրամանին՝ /uc_legends")
    .catch(err => console.error(`Failed to send message to ${id}:`, err));
});

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
  const greeting = "Բարև ձեզ, ես LEGENDA-ն եմ!:Այս հրամանաը կոգնի ձես գնել uc-ները /uc_legends";
  bot.sendMessage(msg.chat.id, greeting);
});

// Global reply array
let replyd = [];

// Handle photo messages
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "**Շնորհակալություն, խնդրում ենք ուղարկել ձեր խաղի ID-ն առանց որևէ այլ նշանների:**");
  
  // Forward message to the MOD
  bot.forwardMessage(MOD, chatId, msg.message_id);
  
  const userLink = msg.from.username ? `@${msg.from.username}` : msg.from.id;
  bot.sendMessage(MOD, `**User link:** ${userLink}\nIf the link doesn't work, user ID: ${msg.from.id}`);

  // Wait for 5 minutes before reminding
  setTimeout(() => {
    if (!replyd.includes(msg.from.id)) {
      bot.sendMessage(chatId, "Սպասեք 5-ր ");
      bot.sendMessage(MOD, `Patasxani exoos: ${msg.from.id}`);
      bot.sendMessage(MOD, `**User link:** ${userLink}`);
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
});

// Handle replies from MOD
bot.onText(/\/reply (.+)/, (msg, match) => {
  const userId = msg.reply_to_message ? msg.reply_to_message.text.split(' ').pop() : null;
  
  if (msg.from.id === MOD && userId) {
    const replyMessage = match[1];
    bot.sendMessage(userId, `**Moderator**: __${replyMessage}__`);
    replyd.push(parseInt(userId));
  } else {
    bot.sendMessage(msg.chat.id, "You forgot to reply to the message with **ID**! Try again");
  }
});

// Handle '/uc_legends' command
bot.onText(/\/uc_legends/, (msg) => {
  const prices = `
✅30💰 - 200֏ 🔥

✅60💰 - 400֏ 🔥

✅120💰 - 800֏ 🔥

✅180💰 - 1100֏ 🔥

✅240💰 - 1400֏ 🔥

✅325💰 - 1800֏ 🔥

✅660💰 - 3500֏ 🔥

✅720💰 - 3700֏ 🔥

✅1800💰 - 8500֏ 🔥

✅1950💰 - 9000֏ 🔥

✅3850💰 - 17000֏ 🔥

✅4000💰 - 17500֏ 🔥

✅5650💰 - 26500֏ 🔥

✅8100💰 - 33000֏ 🔥

✅8400💰 - 34000֏ 🔥

🛒 Մեր բանկային հաշիվները իմանալու համար սեղմեք այս հրամանին /legends\n
ՈՒշադրություն /ID ուղարկեք նկարի հետ\n`;
  
  const legendsPart = `
**💎 LEGENDS 💎**

Մեր փորձառու թիմը պատրաստ է օգնել ձեզ յուրաքանչյուր հարցում: Ադմին @legendsold։
Սեխմեք այս հրամանին /legends որ իմանանք մեր բանկային հաշիվները։
  `;
  
  bot.sendMessage(msg.chat.id, prices + '\n\n' + legendsPart);
});

// Handle '/legends' command
bot.onText(/\/legends/, (msg) => {
  const legendsText = `
**💎 LEGENDS 💎**

💵 TELCEL WALLET → +37498222474
💳 Բանկային քարտ → 4355053926154248

Բարի գալուստ մեր UC-SHOP! 
Մեր փորձառու թիմը պատրաստ է օգնել ձեզ յուրաքանչյուր հարցում: 
Եթե բոտը չի աշխատում գրեք մեր ադմինին @legendsold
  `;
  
  bot.sendMessage(msg.chat.id, legendsText);
});

// Handle game ID check
bot.on('message', (msg) => {
  const text = msg.text;

  // Check if it's a valid ID (just numeric)
  if (/^\d+$/.test(text)) {
    bot.sendMessage(MOD, `**ID of ${msg.from.first_name} is** \`${text}\``);
    bot.sendMessage(msg.chat.id, "Շնորհակալություն, խնդրում եմ սպասեք:");
  } else {
    const randomText = "Սեղմեք կոճակը /start";
    bot.sendMessage(msg.chat.id, randomText);
  }
});

// Save IDs of users who send messages
bot.on('message', (msg) => {
  const id = msg.from.id.toString();
  
  if (!ids.includes(id)) {
    ids.push(id);
    fs.appendFileSync('ids.txt', `${id}\n`);
  }
});
