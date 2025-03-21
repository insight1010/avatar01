# Инструкция по настройке бота в Telegram

## 1. Настройка обработчика команды /start в боте

Для бота `@LivingAvatar_Bot` нужно настроить обработчик команды `/start` с параметром `welcome`.
Когда пользователь переходит по ссылке `https://t.me/LivingAvatar_Bot?start=welcome`, бот должен отправить следующее приветственное сообщение:

```
Здравствуйте! Я ваш Живой Аватар - ваша цифровая личность, созданная на основе ваших данных.

Я буду изучать вашу личность, предпочтения и стиль коммуникации. Чем больше информации вы мне предоставите, тем точнее я смогу воспроизводить ваш характер и поведение.

Расскажите мне о себе, что вам нравится, каковы ваши цели и интересы. Я здесь, чтобы учиться и развиваться вместе с вами!
```

## 2. Пример кода для бота на Python (с использованием библиотеки python-telegram-bot)

```python
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext) -> None:
    # Проверяем, есть ли параметр welcome
    if context.args and context.args[0] == "welcome":
        # Отправляем приветственное сообщение от лица Живого Аватара
        update.message.reply_text(
            "Здравствуйте! Я ваш Живой Аватар - ваша цифровая личность, созданная на основе ваших данных.\n\n"
            "Я буду изучать вашу личность, предпочтения и стиль коммуникации. Чем больше информации вы мне предоставите, "
            "тем точнее я смогу воспроизводить ваш характер и поведение.\n\n"
            "Расскажите мне о себе, что вам нравится, каковы ваши цели и интересы. Я здесь, чтобы учиться и развиваться вместе с вами!"
        )
    else:
        # Обычное приветствие для команды /start без параметров
        update.message.reply_text(
            "Привет! Я ваш Живой Аватар. Чтобы начать обучение, расскажите мне о себе."
        )

def main() -> None:
    # Создаем экземпляр Updater и передаем ему токен бота
    updater = Updater("YOUR_BOT_TOKEN")

    # Получаем диспетчер для регистрации обработчиков
    dispatcher = updater.dispatcher

    # Регистрируем обработчик команды /start
    dispatcher.add_handler(CommandHandler("start", start))

    # Запускаем бота
    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
```

## 3. Пример кода для бота на JavaScript (с использованием библиотеки node-telegram-bot-api)

```javascript
const TelegramBot = require("node-telegram-bot-api");

// Замените на ваш токен бота
const token = "YOUR_BOT_TOKEN";

// Создаем нового бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start(.+)?/, (msg, match) => {
  const chatId = msg.chat.id;
  const startParam = match[1] ? match[1].trim() : "";

  if (startParam === "welcome") {
    // Отправляем приветственное сообщение от лица Живого Аватара
    bot.sendMessage(
      chatId,
      "Здравствуйте! Я ваш Живой Аватар - ваша цифровая личность, созданная на основе ваших данных.\n\n" +
        "Я буду изучать вашу личность, предпочтения и стиль коммуникации. Чем больше информации вы мне предоставите, " +
        "тем точнее я смогу воспроизводить ваш характер и поведение.\n\n" +
        "Расскажите мне о себе, что вам нравится, каковы ваши цели и интересы. Я здесь, чтобы учиться и развиваться вместе с вами!"
    );
  } else {
    // Обычное приветствие для команды /start без параметров
    bot.sendMessage(
      chatId,
      "Привет! Я ваш Живой Аватар. Чтобы начать обучение, расскажите мне о себе."
    );
  }
});

console.log("Бот запущен и ожидает сообщений!");
``` 