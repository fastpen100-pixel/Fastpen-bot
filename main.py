from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
import os

TOKEN = os.getenv("BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("💙 PayPal", callback_data="paypal")],
        [InlineKeyboardButton("💜 Revolut", callback_data="revolut")],
        [InlineKeyboardButton("🏦 Virement", callback_data="virement")],
        [InlineKeyboardButton("🇫🇷 Wero", callback_data="wero")],
    ]

    await update.message.reply_text(
        "👋 Bonjour !\n\nChoisissez votre mode de paiement :",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    messages = {
        "paypal": """💳 Paiement par PayPal

Merci pour votre commande 😊

👉 https://www.paypal.me/ChaibArakrak

Une fois le paiement effectué, merci d'envoyer une capture d'écran de la confirmation.""",

        "revolut": """💳 Paiement par Revolut

👉 https://revolut.me/fastpen

Merci d'envoyer une capture d'écran après le paiement.""",

        "virement": """💳 Paiement par virement

IBAN :
FR76 2823 3000 0134 7482 3942 119

Titulaire :
ARAKRAK CHAIB

Merci d'envoyer une preuve du virement.""",

        "wero": """💳 Paiement par Wero

📱 06 52 64 84 93

Merci d'envoyer une capture d'écran après le paiement.""",
    }

    await query.edit_message_text(messages[query.data])

app = ApplicationBuilder().token(TOKEN).build()

app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(button))

app.run_polling()
