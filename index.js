const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("Bot démarré");

bot.on("message", (msg) => {
  console.log("Message reçu :", msg.text);

  bot.sendMessage(msg.chat.id, "✅ Test OK !");
});
