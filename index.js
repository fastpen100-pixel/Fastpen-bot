const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("FAST Bot est en ligne !");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  if (msg.photo) {
    bot.sendMessage(
      chatId,
      "✅ Merci ! Votre preuve de paiement a bien été reçue. Votre commande est maintenant validée et sera préparée dans les meilleurs délais. 📦"
    );
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
    bot.sendMessage(
      chatId,
      "✅ Merci ! Votre confirmation a bien été reçue. Votre commande est maintenant validée. 📦"
    );
  }
});

console.log("Bot démarré !");
bot.on("polling_error", console.log);

bot.on("message", (msg) => {
  console.log(msg);
});
