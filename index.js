const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.get("/", (req, res) => res.send("FASTPEN Bot en ligne"));
app.listen(process.env.PORT || 10000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const waitingPhoto = new Set();

const menu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "💙 PayPal", callback_data: "paypal" }],
      [{ text: "💜 Revolut", callback_data: "revolut" }],
      [{ text: "🏦 Virement", callback_data: "bank" }],
      [{ text: "🇫🇷 Wero", callback_data: "wero" }]
    ]
  }
};

const paid = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "✅ J'ai effectué le paiement", callback_data: "paid" }],
      [{ text: "🔙 Retour", callback_data: "menu" }]
    ]
  }
};

bot.on("message", (msg) => {

  const id = msg.chat.id;

  if (msg.photo) {

    if (waitingPhoto.has(id)) {

      waitingPhoto.delete(id);

      return bot.sendMessage(id,
`✅ Merci !

Votre preuve de paiement a bien été reçue.

📦 Votre commande est maintenant en attente de vérification.`);

    }

    return bot.sendMessage(id,
`📸 Merci pour votre image.

Si c'est une preuve de paiement, merci de cliquer d'abord sur
✅ J'ai effectué le paiement.`);
  }

  if (waitingPhoto.has(id)) {

    return bot.sendMessage(id,
"📸 Merci d'envoyer une capture d'écran de votre paiement.");
  }

  bot.sendMessage(id,
`👋 Bonjour !

Bienvenue chez FASTPEN.

Choisissez votre mode de paiement :`,
menu);

});bot.on("callback_query", async (query) => {

  const id = query.message.chat.id;

  await bot.answerCallbackQuery(query.id);

  switch (query.data) {

    case "menu":

      waitingPhoto.delete(id);

      return bot.sendMessage(
        id,
        "👋 Choisissez votre mode de paiement :",
        menu
      );

    case "paypal":

      return bot.sendMessage(
        id,
`💙 Paiement par PayPal

Merci pour votre commande.

👉 https://www.paypal.me/ChaibArakrak

Une fois le paiement effectué, cliquez sur le bouton ci-dessous.`,
        paid
      );

    case "revolut":

      return bot.sendMessage(
        id,
`💜 Paiement par Revolut

👉 https://revolut.me/fastpen

Une fois le paiement effectué, cliquez sur le bouton ci-dessous.`,
        paid
      );

    case "bank":

      return bot.sendMessage(
        id,
`🏦 Paiement par virement bancaire

Titulaire :
ARAKRAK CHAIB

IBAN :
FR76 2823 3000 0134 7482 3942 119

Une fois le virement effectué, cliquez sur le bouton ci-dessous.`,
        paid
      );

    case "wero":

      return bot.sendMessage(
        id,
`🇫🇷 Paiement par Wero

📱 06 52 64 84 93

Une fois le paiement effectué, cliquez sur le bouton ci-dessous.`,
        paid
      );

    case "paid":

      waitingPhoto.add(id);

      return bot.sendMessage(
        id,
`📸 Merci !

Votre paiement est presque terminé.

Merci d'envoyer maintenant une capture d'écran de votre confirmation de paiement.

⚠️ Seules les preuves de paiement sont acceptées.`
      );

  }

});

console.log("✅ FASTPEN BOT PREMIUM démarré");
