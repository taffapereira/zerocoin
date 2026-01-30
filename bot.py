import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, CallbackQueryHandler

# Configuração de Log
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# TOKEN DO SEU BOT
TOKEN = "8463785267:AAG8XGtEgIJFlEVcO7A2qB8KGIBgw56TnMg"

# LINKS E TEXTOS
CONTRACT_ADDRESS = "0xb918b6ad21211B075a0761b87b09561D2A5e5a1f"
SITE_URL = "https://zerocoin.digital"  # Ajuste se necessário
TWITTER_URL = "https://twitter.com/zerocoindigital"
INSTAGRAM_URL = "https://instagram.com/zerocoin.digital"
GROUP_URL = "https://t.me/ZeroCoinOfficialGroup" # Crie um grupo e coloque o link aqui depois!

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📝 Contrato (Contract)", callback_data='contract')],
        [InlineKeyboardButton("💰 Como Comprar (How to Buy)", callback_data='buy')],
        [InlineKeyboardButton("🌐 Redes Sociais (Socials)", callback_data='social')],
        [InlineKeyboardButton("🚀 Site Oficial", url=SITE_URL)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"Olá, {update.effective_user.first_name}! 🤖\n\n"
        "Eu sou o **ZeroCoin Bot**. Estou aqui para te ajudar na jornada *From Zero to Hero*.\n\n"
        "O que você precisa saber?",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == 'contract':
        await query.message.reply_text(
            f"📋 **ZeroCoin Contract (BSC - BEP20):**\n\n`{CONTRACT_ADDRESS}`\n\n(Clique para copiar)",
            parse_mode='Markdown'
        )
    
    elif query.data == 'social':
        keyboard = [
            [InlineKeyboardButton("Twitter (X)", url=TWITTER_URL)],
            [InlineKeyboardButton("Instagram", url=INSTAGRAM_URL)],
            [InlineKeyboardButton("Site", url=SITE_URL)]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.message.reply_text("Siga a ZeroCoin em todas as redes! 🚀", reply_markup=reply_markup)

    elif query.data == 'buy':
        await query.message.reply_text(
            "💰 **Como Comprar ZeroCoin:**\n\n"
            "1. Tenha BNB na sua carteira (MetaMask/TrustWallet).\n"
            "2. Acesse a PancakeSwap.\n"
            "3. Cole nosso contrato: `" + CONTRACT_ADDRESS + "`\n"
            "4. Ajuste o Slippage para **6-7%** (Devido à queima).\n"
            "5. Troque BNB por ZERO.\n\n"
            "Bem-vindo à elite! 💎",
            parse_mode='Markdown'
        )

if __name__ == '__main__':
    application = ApplicationBuilder().token(TOKEN).build()

    application.add_handler(CommandHandler('start', start))
    application.add_handler(CallbackQueryHandler(button))

    print("🤖 ZeroCoin Bot está rodando! Pressione Ctrl+C para parar.")
    application.run_polling()
