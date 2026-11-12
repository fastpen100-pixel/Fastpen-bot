const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("FASTPEN Bot est en ligne ✅");
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

console.log("🤖 Bot FASTPEN démarré");

// Mémoire des utilisateurs
const userState = new Map();

// Messages de paiement
const payments = {
  paypal: `💳 Paiement par PayPal

Merci pour votre commande. 😊

Vous pouvez effectuer votre paiement via le lien suivant :

👉 https://www.paypal.me/ChaibArakrak

Une fois le paiement effectué, cliquez sur le bouton « ✅ J'ai effectué le paiement ».`,  revolut: `💜 Paiement par Revolut

Merci pour votre commande. 😊

Vous pouvez effectuer votre paiement au lien suivant :

👉 https://revolut.me/fastpen

Une fois le paiement effectué, cliquez sur le bouton « ✅ J'ai effectué le paiement ».`,

  wero: `🇫🇷 Paiement par Wero

Merci pour votre commande. 😊

Vous pouvez effectuer votre paiement au numéro suivant :

📱 06 52 64 84 93

Une fois le paiement effectué, cliquez sur le bouton « ✅ J'ai effectué le paiement ».`,

  bank: `🏦 Paiement par virement bancaire

Merci pour votre commande. 😊

IBAN :
FR76 2823 3000 0134 7482 3942 119

Titulaire :
ARAKRAK CHAIB

Une fois le virement effectué, cliquez sur le bouton « ✅ J'ai effectué le paiement ».`
};

// Menu principal
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "💙 PayPal", callback_data: "paypal" }],
        [{ text: "💜 Revolut", callback_data: "revolut" }],
        [{ text: "🏦 Virement bancaire", callback_data: "bank" }],
        [{ text: "🇫🇷 Wero", callback_data: "wero" }],
        [{ text: "🌐 Ouvrir FastPenLabs", url: "https://fastpenlabs.com" }]
      ]
    }
  };
}

// Boutons après le choix du paiement
function paymentButtons() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ J'ai effectué le paiement", callback_data: "paid" }],
        [{ text: "🔙 Retour", callback_data: "menu" }]
      ]
    }
  };
}// ===== Gestion des boutons =====

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  // Retour au menu
  if (action === "menu") {
    userState.delete(chatId);

    return bot.sendMessage(
      chatId,
      "👋 Bienvenue chez FASTPEN !\n\nSélectionnez votre mode de paiement :",
      mainMenu()
    );
  }

  // Paiement effectué
  if (action === "paid") {
    userState.set(chatId, "waiting_proof");

    return bot.sendMessage(
      chatId,
      "📸 Merci !\n\nVeuillez maintenant envoyer une capture d'écran de votre confirmation de paiement.\n\n⚠️ Merci d'envoyer uniquement une preuve de paiement."
    );
  }

  // Choix du mode de paiement
  if (payments[action]) {
    userState.set(chatId, "payment_selected");

    return bot.sendMessage(
      chatId,
      payments[action],
      paymentButtons()
    );
  }
});


// ===== Premier message =====

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  // Si le client n'a encore rien fait
  if (!userState.has(chatId)) {

    return bot.sendMessage(
      chatId,
      "👋 Bonjour et bienvenue chez FASTPEN.\n\nMerci pour votre commande.\n\nChoisissez simplement votre mode de paiement ci-dessous :",
      mainMenu()
    );

  }  // ===== Le client envoie une photo =====

  if (msg.photo) {

    // Il a bien cliqué sur "J'ai effectué le paiement"
    if (userState.get(chatId) === "waiting_proof") {

      userState.delete(chatId);

      return bot.sendMessage(
        chatId,
        "✅ Merci !\n\nVotre preuve de paiement a bien été reçue.\n\n📦 Votre dossier est désormais en attente de vérification.\n\nVous recevrez une confirmation dès que votre paiement sera validé."
      );

    }

    // Il envoie une photo sans avoir choisi de paiement
    return bot.sendMessage(
      chatId,
      "📸 J'ai bien reçu votre image.\n\nSi cette photo est une preuve de paiement, veuillez d'abord sélectionner votre mode de paiement puis cliquer sur « ✅ J'ai effectué le paiement »."
    );

  }


  // ===== Le client parle alors qu'on attend une preuve =====

  if (userState.get(chatId) === "waiting_proof") {

    return bot.sendMessage(
      chatId,
      "📸 J'attends votre preuve de paiement.\n\nMerci d'envoyer une capture d'écran de votre confirmation de paiement."
    );

  }


  // ===== Le client a déjà choisi un paiement =====

  if (userState.get(chatId) === "payment_selected") {

    return bot.sendMessage(
      chatId,
      "💳 Si votre paiement est effectué, cliquez sur le bouton « ✅ J'ai effectué le paiement » situé sous les informations de paiement."
    );

  }  // ===== Commandes utiles =====

  if (
    text === "/start" ||
    text === "menu" ||
    text === "bonjour" ||
    text === "salut" ||
    text === "hello"
  ) {

    userState.delete(chatId);

    return bot.sendMessage(
      chatId,
      "👋 Bienvenue chez FASTPEN !\n\nChoisissez votre mode de paiement :",
      mainMenu()
    );

  }

  // ===== Réponse par défaut =====

  return bot.sendMessage(
    chatId,
    "😊 Je suis le bot de paiement FASTPEN.\n\nUtilisez les boutons ci-dessous pour choisir votre mode de paiement.",
    mainMenu()
  );

});// ======================================
// CONFIGURATION
// Remplace par TON ID Telegram
// ======================================

const ADMIN_ID = 1282250264;


// ======================================
// Envoi des preuves de paiement à l'admin
// ======================================

bot.on("photo", async (msg) => {

    const chatId = msg.chat.id;

    if (userState.get(chatId) !== "waiting_proof") return;

    userState.delete(chatId);

    const username =
        msg.from.username
            ? "@" + msg.from.username
            : "Aucun";

    const fullname =
        `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim();

    const caption =
`💳 Nouvelle preuve de paiement

👤 Client : ${fullname}

📱 Username : ${username}

🆔 ID : ${chatId}

📦 Vérifiez le paiement avant validation.`;

    const photo = msg.photo[msg.photo.length - 1].file_id;

    try {

        await bot.sendPhoto(
            ADMIN_ID,
            photo,
            { caption }
        );

    } catch (e) {
        console.log(e);
    }

    bot.sendMessage(
        chatId,
`✅ Merci !

Votre preuve de paiement a bien été reçue.

📦 Votre dossier est maintenant en attente de vérification.

Nous vous confirmerons votre commande dès validation du paiement.`
    );

});


// ======================================
// Gestion des erreurs
// ======================================

bot.on("polling_error", console.log);

bot.on("webhook_error", console.log);

console.log("🚀 FASTPEN Premium Bot prêt !");
