document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных Telegram WebApp
    const telegramWebApp = window.Telegram.WebApp;
    telegramWebApp.expand(); // Разворачиваем на весь экран
    telegramWebApp.ready(); // Сообщаем о готовности приложения
    
    // Отключаем вертикальные свайпы для улучшения скроллинга
    if (telegramWebApp.disableVerticalSwipes) {
        telegramWebApp.disableVerticalSwipes();
    }
    
    // Использовать passive: true для улучшения производительности скролла
    document.addEventListener('touchmove', function(e) {
        // Эта функция только для предотвращения блокировки скролла
    }, { passive: true });
    
    // Изменение стилей в соответствии с темой Telegram
    if (telegramWebApp.colorScheme === 'dark') {
        document.documentElement.style.setProperty('--bg-color', '#10002b');
        document.documentElement.style.setProperty('--card-bg', '#240046');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#f0f2f5');
        document.documentElement.style.setProperty('--text-color', '#240046');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
    }
    
    // DOM элементы - получаем все сразу для оптимизации
    const interactBtn = document.getElementById('interact-btn');
    const addBotBtn = document.getElementById('add-bot-btn');
    const connectChatsBtn = document.getElementById('connect-chats-btn');
    const connectArBtn = document.getElementById('connect-ar-btn');
    const modal = document.getElementById('modal');
    const infoModal = document.getElementById('info-modal');
    const botModal = document.getElementById('bot-modal');
    const closeBtn = document.querySelector('.close-btn');
    const infoCloseBtn = document.querySelector('.info-close-btn');
    const botCloseBtn = document.querySelector('.bot-close-btn');
    const submitInput = document.getElementById('submit-input');
    const userInput = document.getElementById('user-input');
    const digitalSelfTitle = document.getElementById('digital-self-title');
    const pixelAvatar = document.getElementById('pixel-avatar');
    const progressFill = document.querySelector('.progress-fill');
    const daysPassed = document.querySelector('.days-passed');
    const connectTelegramBtn = document.getElementById('connect-telegram-btn');
    
    // Создаем фоновые элементы только на десктопах (для оптимизации)
    if (window.innerWidth > 768) {
        // Ограничиваем количество фоновых элементов для мобильных устройств
        createDigitalParticles(15); // Меньше частиц
    }
    
    // Создание пиксельного аватара
    createPixelAvatar(pixelAvatar);
    
    // Анимируем прогресс-бар при загрузке
    animateProgressBar();
    
    // Обработка отправки данных пользователем
    function handleUserSubmit() {
        const input = userInput.value.trim();
        
        if (input.length > 0) {
            // Добавляем введенные данные в терминал как команду
            const terminalOutput = document.querySelector('.terminal-output');
            const userCommand = document.createElement('p');
            userCommand.className = 'command-msg';
            userCommand.innerHTML = '$> ' + input;
            terminalOutput.appendChild(userCommand);
            
            // Очищаем ввод
            userInput.value = '';
            
            // Добавляем эффект обработки
            const processingMsg = document.createElement('p');
            processingMsg.className = 'system-msg';
            processingMsg.innerHTML = 'Проверка API ключа...';
            terminalOutput.appendChild(processingMsg);
            
            // Прокручиваем терминал вниз
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            // Имитируем обработку с задержкой
            setTimeout(() => {
                const responseMsg = document.createElement('p');
                responseMsg.className = 'system-msg';
                responseMsg.innerHTML = 'API ключ принят. Начинаю сбор данных...';
                terminalOutput.appendChild(responseMsg);
                
                const successMsg = document.createElement('p');
                successMsg.className = 'system-msg';
                successMsg.innerHTML = '<span style="color: #38ef7d;">Успешно!</span> Данные получены.';
                
                // Добавляем с небольшой задержкой для эффекта обработки
                setTimeout(() => {
                    terminalOutput.appendChild(successMsg);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    
                    // Закрываем терминал через некоторое время
                    setTimeout(() => {
                        closeModal();
                        
                        // Показываем уведомление об успешной отправке
                        telegramWebApp.showPopup({
                            title: 'API ключ принят',
                            message: 'Авторизация успешна. Ваш аватар продолжает обучение!',
                            buttons: [{type: 'ok'}]
                        });
                        
                        // Обновляем прогресс
                        const currentProgress = parseInt(daysPassed.textContent);
                        if (currentProgress < 30) {
                            daysPassed.textContent = currentProgress + 1;
                            const newProgressPercent = ((currentProgress + 1) / 30) * 100;
                            progressFill.style.width = newProgressPercent + '%';
                            
                            // Проверяем, нужно ли разблокировать какие-то кнопки
                            checkButtonsUnlock(currentProgress + 1);
                        }
                    }, 2000);
                }, 800);
                
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, 1500);
        }
    }
    
    // Функция для проверки разблокировки кнопок
    function checkButtonsUnlock(daysCount) {
        if (daysCount >= 7 && addBotBtn.classList.contains('locked')) {
            addBotBtn.classList.remove('locked');
            telegramWebApp.showPopup({
                title: 'Новая функция доступна!',
                message: 'Теперь вы можете добавить своего цифрового помощника в чаты.',
                buttons: [{type: 'ok'}]
            });
        }
        
        if (daysCount >= 14 && connectChatsBtn.classList.contains('locked')) {
            connectChatsBtn.classList.remove('locked');
            telegramWebApp.showPopup({
                title: 'Новая функция доступна!',
                message: 'Теперь вы можете подключить записи разговоров.',
                buttons: [{type: 'ok'}]
            });
        }
        
        if (daysCount >= 30 && connectArBtn.classList.contains('locked')) {
            connectArBtn.classList.remove('locked');
            telegramWebApp.showPopup({
                title: 'Новая функция доступна!',
                message: 'Поздравляем! Ваш цифровой аватар полностью обучен и готов к подключению AR очков.',
                buttons: [{type: 'ok'}]
            });
        }
    }
    
    // Функция для анимации прогресс-бара - оптимизирована
    function animateProgressBar() {
        const currentDays = parseInt(daysPassed.textContent);
        const totalDays = parseInt(document.querySelector('.days-total').textContent);
        
        const progressPercent = (currentDays / totalDays) * 100;
        
        // Устанавливаем ширину напрямую без анимации
        progressFill.style.width = progressPercent + '%';
        
        // Проверяем статус кнопок сразу
        checkButtonsUnlock(currentDays);
    }
    
    // Открытие модального окна
    function openModal() {
        modal.style.display = 'flex';
    }
    
    // Закрытие модального окна
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Открытие информационного модального окна
    function openInfoModal() {
        infoModal.style.display = 'flex';
    }
    
    // Закрытие информационного модального окна
    function closeInfoModal() {
        infoModal.style.display = 'none';
    }
    
    // Открытие модального окна бота
    function openBotModal() {
        botModal.style.display = 'flex';
    }
    
    // Закрытие модального окна бота
    function closeBotModal() {
        botModal.style.display = 'none';
    }
    
    // Обработчики событий
    interactBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    submitInput.addEventListener('click', handleUserSubmit);
    digitalSelfTitle.addEventListener('click', openInfoModal);
    infoCloseBtn.addEventListener('click', closeInfoModal);
    botCloseBtn.addEventListener('click', closeBotModal);
    
    // Добавляем обработчик для новой кнопки бота
    const telegramBotBtn = document.getElementById('telegram-bot-btn');
    telegramBotBtn.addEventListener('click', openBotModal);
    
    // Обработчик для кнопки подключения к боту внутри модального окна
    connectTelegramBtn.addEventListener('click', function() {
        // Закрываем модальное окно
        closeBotModal();
        
        // Открываем бота в Telegram
        openTelegramBot();
    });
    
    // Закрываем модальные окна по клику вне их содержимого
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === infoModal) {
            closeInfoModal();
        }
        if (event.target === botModal) {
            closeBotModal();
        }
    });
    
    // Обрабатываем нажатие клавиши Enter в текстовом поле
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleUserSubmit();
        }
    });
    
    // Обработчики событий для новых кнопок
    addBotBtn.addEventListener('click', function(e) {
        if (this.classList.contains('locked')) {
            e.stopPropagation();
            telegramWebApp.showPopup({
                title: 'Функция заблокирована',
                message: 'Эта функция будет доступна после 7 дней обучения вашего цифрового я.',
                buttons: [{type: 'ok'}]
            });
            return;
        }
        
        telegramWebApp.showPopup({
            title: 'Добавление бота в чаты',
            message: 'Вы сможете добавить бота в свои групповые чаты, где он будет наблюдать за вашим общением и учиться вашему стилю коммуникации.',
            buttons: [{type: 'ok'}]
        });
    });
    
    connectChatsBtn.addEventListener('click', function(e) {
        if (this.classList.contains('locked')) {
            e.stopPropagation();
            telegramWebApp.showPopup({
                title: 'Функция заблокирована',
                message: 'Эта функция будет доступна после 14 дней обучения вашего цифрового я.',
                buttons: [{type: 'ok'}]
            });
            return;
        }
        
        telegramWebApp.showPopup({
            title: 'Подключение к записям разговоров',
            message: 'Подключите аватар к вашим прошлым разговорам, чтобы он ускорил обучение на основе ваших предыдущих сообщений.',
            buttons: [{type: 'ok'}]
        });
    });
    
    connectArBtn.addEventListener('click', function(e) {
        if (this.classList.contains('locked')) {
            e.stopPropagation();
            telegramWebApp.showPopup({
                title: 'Функция заблокирована',
                message: 'Эта функция будет доступна после 30 дней обучения вашего цифрового я.',
                buttons: [{type: 'ok'}]
            });
            return;
        }
        
        telegramWebApp.showPopup({
            title: 'Подключение к AR очкам',
            message: 'Интеграция с AR устройствами позволит вашему аватару видеть мир вашими глазами и запоминать ваш визуальный опыт.',
            buttons: [{type: 'ok'}]
        });
    });

    // Создание эффекта цифрового пространства
    createDigitalParticles();
});

// Оптимизированная функция создания пиксельного аватара 
function createPixelAvatar(container) {
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем фрагмент для оптимизации отрисовки
    const fragment = document.createDocumentFragment();
    
    // Размер сетки
    const gridSize = 12;
    
    // Вероятность заполнения пикселей (оптимизировано)
    const fillProbability = 0.45;
    
    // Создаем меньше пикселей для улучшения производительности
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Пропускаем некоторые пиксели для улучшения производительности
            if ((i + j) % 2 === 0 && Math.random() > 0.7) continue;
            
            // Создаем только необходимые пиксели
            if (Math.random() < fillProbability) {
                const pixel = document.createElement('div');
                pixel.className = 'pixel';
                
                // Избегаем преобразований, которые вызывают repainting
                pixel.style.top = `${(i / gridSize) * 100}%`;
                pixel.style.left = `${(j / gridSize) * 100}%`;
                
                // Оптимизация: уменьшаем количество анимаций
                if ((i+j) % 4 === 0) {
                    // Применяем анимацию только к каждому четвертому пикселю
                    const animDuration = 2 + Math.random() * 2;
                    const animDelay = Math.random() * 1;
                    pixel.style.animation = `pixelPulse ${animDuration}s infinite alternate ${animDelay}s`;
                }
                
                fragment.appendChild(pixel);
            }
        }
    }
    
    // Создаём меньше декоративных элементов 
    for (let i = 0; i < 4; i++) {
        const outerPixel = document.createElement('div');
        outerPixel.className = 'outer-pixel';
        
        // Устанавливаем позицию без лишних вычислений
        const angle = (i / 4) * 360;
        const distance = 40 + Math.random() * 20;
        
        outerPixel.style.top = `calc(50% + ${Math.sin(angle * Math.PI / 180) * distance}px)`;
        outerPixel.style.left = `calc(50% + ${Math.cos(angle * Math.PI / 180) * distance}px)`;
        
        // Применяем только необходимые стили
        outerPixel.style.opacity = 0.6 + Math.random() * 0.4;
        
        // Оптимизация: более простая анимация
        const animDuration = 4 + Math.random() * 2;
        const animDelay = Math.random() * 2;
        outerPixel.style.animation = `outerPixelPulse ${animDuration}s infinite alternate ${animDelay}s`;
        
        fragment.appendChild(outerPixel);
    }
    
    // Единоразовое добавление всех элементов
    container.appendChild(fragment);
}

// Оптимизация анимаций
// Убираем лишние кадры анимации
const style = document.createElement('style');
style.textContent = `
@keyframes pixelPulse {
    0% { transform: scale(0.8); opacity: 0.4; }
    100% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes outerPixelPulse {
    0% { transform: scale(0.9); opacity: 0.3; }
    100% { transform: scale(1.1); opacity: 0.6; }
}
`;
document.head.appendChild(style);

// Оптимизированная функция создания цифровых частиц
function createDigitalParticles(count = 15) {
    // Создаем контейнер для частиц, если его еще нет
    let particlesContainer = document.querySelector('.background-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'background-particles';
        document.body.appendChild(particlesContainer);
    }
    
    // Используем фрагмент для оптимизации DOM-операций
    const fragment = document.createDocumentFragment();
    
    // Создаем меньше частиц
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        
        // Случайное начальное положение
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Используем translate3d для GPU-ускорения
        particle.style.transform = `translate3d(0, 0, 0)`;
        
        // Случайный размер
        const size = 2 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Случайная непрозрачность
        particle.style.opacity = 0.1 + Math.random() * 0.3;
        
        fragment.appendChild(particle);
    }
    
    // Добавляем все элементы за одну операцию
    particlesContainer.appendChild(fragment);
}

// Функция для открытия Telegram бота
function openTelegramBot() {
    // Открываем ссылку на бота
    window.open("https://t.me/mamayadoma_bot", "_blank");
    
    // Альтернативный способ через API Telegram
    try {
        telegramWebApp.openTelegramLink("https://t.me/mamayadoma_bot");
    } catch (e) {
        console.log("Ошибка открытия ссылки через Telegram API:", e);
    }
    
    // Обновляем прогресс
    const currentProgress = parseInt(daysPassed.textContent);
    if (currentProgress < 30) {
        daysPassed.textContent = currentProgress + 1;
        const newProgressPercent = ((currentProgress + 1) / 30) * 100;
        progressFill.style.width = newProgressPercent + '%';
        
        // Проверяем, нужно ли разблокировать какие-то кнопки
        checkButtonsUnlock(currentProgress + 1);
    }
}

// Функция для активации и перехода к боту
function activateTelegramBot() {
    // Показываем уведомление о подключении бота
    telegramWebApp.showPopup({
        title: 'Подключение к боту',
        message: 'Переход к вашему цифровому я в Telegram. Для активации просто отправьте команду /start боту.',
        buttons: [{
            id: "open_bot",
            type: "default",
            text: "Открыть бота"
        }]
    }, function(buttonId) {
        if (buttonId === "open_bot") {
            openTelegramBot();
        }
    });
} 