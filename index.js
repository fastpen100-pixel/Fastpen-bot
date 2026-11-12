const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  if (msg.photo) {
    bot.sendMessage(chatId, "✅ Merci ! Votre preuve de paiement a bien été reçue. Votre commande est maintenant validée et sera préparée dans les meilleurs délais. 📦");
    return;
  }

  if (
    text.includes("c'est bon") ||
    text.includes("cest bon") ||
    text.includes("c'est fait") ||
    text.includes("cest fait") ||
    text.includes("fait") ||
    text.includes("payé") ||
    text.includes("paye") ||
    text.includes("envoyé") ||
    text.includes("envoye")
  ) {
    bot.sendMessage(chatId, "✅ Merci ! Votre confirmation a bien été reçue. Votre commande est maintenant validée. 📦");
  }
});

console.log("Bot démarré !");
