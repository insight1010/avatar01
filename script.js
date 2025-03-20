document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных Telegram WebApp
    const telegramWebApp = window.Telegram.WebApp;
    telegramWebApp.expand(); // Разворачиваем на весь экран
    telegramWebApp.ready(); // Сообщаем о готовности приложения
    
    // Отключаем вертикальные свайпы для улучшения скроллинга
    if (telegramWebApp.disableVerticalSwipes) {
        telegramWebApp.disableVerticalSwipes();
    }
    
    // Определяем возможности устройства для дальнейшей оптимизации
    const isMobile = window.innerWidth < 768;
    const isWeakDevice = isMobile || (telegramWebApp.platform && 
                      (telegramWebApp.platform.includes('android') || 
                       telegramWebApp.platform.includes('ios')));
                       
    // Глобальная переменная для контроля качества эффектов
    window.isLowPerformanceMode = isWeakDevice;
    
    // Устанавливаем пассивные обработчики событий для лучшей производительности
    document.addEventListener('touchmove', function(e) {
        // Разрешаем нативный скроллинг
        e.stopPropagation();
    }, { passive: true });
    
    // Устанавливаем оптимизированный обработчик скроллинга
    let scrollTimeout;
    document.addEventListener('scroll', function() {
        // Используем debounce для оптимизации обработки скролла
        clearTimeout(scrollTimeout);
        document.body.classList.add('is-scrolling');
        
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 150);
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
    
    // DOM элементы - кэшируем все селекторы для увеличения производительности
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
    
    // Вместо инлайн-функций используем именованные функции
    // для лучшей производительности и отладки
    
    // Создание пиксельного аватара с учетом производительности устройства
    createPixelAvatar(pixelAvatar);
    
    // Анимируем прогресс-бар при загрузке - отложенный запуск для улучшения первичной загрузки
    setTimeout(() => {
        animateProgressBar();
    }, 100);
    
    // Для слабых устройств создаем фоновые частицы с задержкой
    // чтобы не блокировать первоначальную загрузку и рендеринг
    if (isWeakDevice) {
        setTimeout(() => {
            createDigitalParticles();
        }, 500);
    } else {
        createDigitalParticles();
    }
    
    // Выполняем все оптимизации с разными задержками для улучшения опыта загрузки
    setTimeout(() => {
        optimizeTouchEvents();
    }, 300);
    
    setTimeout(() => {
        optimizeDOMOperations();
    }, 1000);
    
    // Удаляем индикатор загрузки через небольшую задержку
    setTimeout(() => {
        // Принудительно запускаем перерисовку для устранения мерцания
        window.requestAnimationFrame(() => {
            const pixelAvatar = document.getElementById('pixel-avatar');
            if (pixelAvatar) {
                // Принудительное обновление для правильного рендеринга
                pixelAvatar.style.display = 'none';
                pixelAvatar.offsetHeight; // Триггер перерисовки
                pixelAvatar.style.display = '';
            }
        });
    }, 600);

    // Оптимизация: Обработка отправки данных пользователем
    function handleUserSubmit() {
        const input = userInput.value.trim();
        
        if (input.length > 0) {
            // Создаем фрагмент для оптимизации DOM-операций
            const fragment = document.createDocumentFragment();
            const terminalOutput = document.querySelector('.terminal-output');
            
            // Добавляем введенные данные в терминал как команду
            const userCommand = document.createElement('p');
            userCommand.className = 'command-msg';
            userCommand.textContent = '$> ' + input;
            fragment.appendChild(userCommand);
            
            // Добавляем эффект обработки
            const processingMsg = document.createElement('p');
            processingMsg.className = 'system-msg';
            processingMsg.textContent = 'Проверка API ключа...';
            fragment.appendChild(processingMsg);
            
            // Добавляем весь фрагмент за одну операцию
            terminalOutput.appendChild(fragment);
            
            // Очищаем ввод
            userInput.value = '';
            
            // Прокручиваем терминал вниз
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            // Используем один requestAnimationFrame вместо множества вложенных
            // и прогрессивную задержку для появления сообщений
            requestAnimationFrame(() => {
                // На слабых устройствах уменьшаем задержки 
                const delay1 = isWeakDevice ? 600 : 1000;
                const delay2 = isWeakDevice ? 400 : 800;
                const delay3 = isWeakDevice ? 800 : 1500;
                
                setTimeout(() => {
                    const responseMsg = document.createElement('p');
                    responseMsg.className = 'system-msg';
                    responseMsg.textContent = 'API ключ принят. Начинаю сбор данных...';
                    terminalOutput.appendChild(responseMsg);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    
                    setTimeout(() => {
                        const successMsg = document.createElement('p');
                        successMsg.className = 'system-msg';
                        successMsg.innerHTML = '<span style="color: #38ef7d;">Успешно!</span> Данные получены.';
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
                            
                            // Обновляем прогресс - кэшируем значения для оптимизации
                            const currentProgress = parseInt(daysPassed.textContent);
                            if (currentProgress < 30) {
                                const newValue = currentProgress + 1;
                                daysPassed.textContent = newValue;
                                const newProgressPercent = (newValue / 30) * 100;
                                
                                // Оптимизация: используем transform для анимации
                                progressFill.style.width = newProgressPercent + '%';
                                
                                // Проверяем, нужно ли разблокировать какие-то кнопки
                                checkButtonsUnlock(newValue);
                            }
                        }, delay3);
                    }, delay2);
                }, delay1);
            });
        }
    }
    
    // Функция для проверки разблокировки кнопок - оптимизирована
    function checkButtonsUnlock(daysCount) {
        // Создаем массив объектов для проверки, чтобы избежать дублирования кода
        const buttonsToCheck = [
            { button: addBotBtn, threshold: 7, message: 'Теперь вы можете добавить своего цифрового помощника в чаты.' },
            { button: connectChatsBtn, threshold: 14, message: 'Теперь вы можете подключить записи разговоров.' },
            { button: connectArBtn, threshold: 30, message: 'Поздравляем! Ваш цифровой аватар полностью обучен и готов к подключению AR очков.' }
        ];
        
        // Создаем очередь для отложенных уведомлений
        const notifications = [];
        
        // Проверяем все кнопки в цикле
        for (const item of buttonsToCheck) {
            if (daysCount >= item.threshold && item.button.classList.contains('locked')) {
                item.button.classList.remove('locked');
                
                // Добавляем уведомление в очередь
                notifications.push(item.message);
            }
        }
        
        // Показываем уведомления по очереди с задержкой
        if (notifications.length > 0) {
            // Используем setTimeout для отложенного уведомления,
            // чтобы не блокировать UI
            setTimeout(() => {
                // Показываем только первое уведомление, если их несколько
                telegramWebApp.showPopup({
                    title: 'Новая функция доступна!',
                    message: notifications[0],
                    buttons: [{type: 'ok'}]
                });
            }, 500);
        }
    }
    
    // Оптимизированная функция для анимации прогресс-бара
    function animateProgressBar() {
        const currentDays = parseInt(daysPassed.textContent);
        const totalDays = parseInt(document.querySelector('.days-total').textContent);
        
        const progressPercent = (currentDays / totalDays) * 100;
        
        // На слабых устройствах просто устанавливаем значение без анимации
        if (isWeakDevice) {
            progressFill.style.width = progressPercent + '%';
        } else {
            // Используем requestAnimationFrame для плавной анимации
            // и оптимизации производительности
            requestAnimationFrame(() => {
                progressFill.style.width = '0%';
                
                // Используем второй requestAnimationFrame для обеспечения
                // корректной последовательности анимации
                requestAnimationFrame(() => {
                    progressFill.style.transition = 'width 0.8s ease-out';
                    progressFill.style.width = progressPercent + '%';
                });
            });
        }
        
        // Проверяем статус кнопок
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
            // Вместо показа popup, просто подсвечиваем сообщение о блокировке
            const lockMessage = this.querySelector('.lock-message');
            lockMessage.style.opacity = '1';
            lockMessage.style.visibility = 'visible';
            lockMessage.style.transform = 'translateY(0)';
            
            // Скрываем сообщение через 3 секунды
            setTimeout(() => {
                lockMessage.style.opacity = '0';
                lockMessage.style.visibility = 'hidden';
                lockMessage.style.transform = 'translateY(-10px)';
            }, 3000);
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
            // Вместо показа popup, просто подсвечиваем сообщение о блокировке
            const lockMessage = this.querySelector('.lock-message');
            lockMessage.style.opacity = '1';
            lockMessage.style.visibility = 'visible';
            lockMessage.style.transform = 'translateY(0)';
            
            // Скрываем сообщение через 3 секунды
            setTimeout(() => {
                lockMessage.style.opacity = '0';
                lockMessage.style.visibility = 'hidden';
                lockMessage.style.transform = 'translateY(-10px)';
            }, 3000);
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
            // Вместо показа popup, просто подсвечиваем сообщение о блокировке
            const lockMessage = this.querySelector('.lock-message');
            lockMessage.style.opacity = '1';
            lockMessage.style.visibility = 'visible';
            lockMessage.style.transform = 'translateY(0)';
            
            // Скрываем сообщение через 3 секунды
            setTimeout(() => {
                lockMessage.style.opacity = '0';
                lockMessage.style.visibility = 'hidden';
                lockMessage.style.transform = 'translateY(-10px)';
            }, 3000);
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

    // Функция для открытия Telegram бота
    function openTelegramBot() {
        // Открываем ссылку на бота
        window.open("https://t.me/LivingAvatar_Bot", "_blank");
        
        // Альтернативный способ через API Telegram
        try {
            telegramWebApp.openTelegramLink("https://t.me/LivingAvatar_Bot");
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

    // Оптимизация для тач-событий на мобильных устройствах
    function optimizeTouchEvents() {
        // Определяем, есть ли у нас тач-устройство
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Получаем все кнопки
            const buttons = document.querySelectorAll('button');
            
            // Добавляем обработчики для всех кнопок
            buttons.forEach(button => {
                // Добавляем визуальную обратную связь при нажатии
                button.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                    // Предотвращаем ненужные события
                    if (!this.classList.contains('locked')) {
                        // Предотвращаем двойные клики и увеличение интерфейса
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Удаляем активное состояние при отпускании
                button.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                }, { passive: true });
                
                // На всякий случай удаляем активное состояние при отмене
                button.addEventListener('touchcancel', function() {
                    this.classList.remove('touch-active');
                }, { passive: true });
            });
            
            // Добавляем стили для активных состояний
            const style = document.createElement('style');
            style.innerHTML = `
                .touch-active {
                    opacity: 0.8;
                    transform: scale(0.98) !important;
                    transition: transform 0.1s ease, opacity 0.1s ease !important;
                }
            `;
            document.head.appendChild(style);
            
            // Ускоряем обработку скролла
            document.addEventListener('touchmove', function() {
                // Во время скролла отключаем все hover-эффекты и тяжелые анимации
                document.body.classList.add('is-scrolling');
                
                // Отменяем класс через небольшую задержку
                clearTimeout(window.scrollTimeout);
                window.scrollTimeout = setTimeout(() => {
                    document.body.classList.remove('is-scrolling');
                }, 150);
            }, { passive: true });
        }
    }

    // Оптимизированная функция для создания и обновления DOM-элементов
    function optimizeDOMOperations() {
        if (window.isLowPerformanceMode) {
            // Отключаем все ненужные анимации при скролле
            window.addEventListener('scroll', function() {
                // Используем requestAnimationFrame для оптимизации
                if (!window.isScrolling) {
                    window.isScrolling = true;
                    requestAnimationFrame(function() {
                        document.body.classList.add('is-scrolling');
                        setTimeout(function() {
                            document.body.classList.remove('is-scrolling');
                            window.isScrolling = false;
                        }, 150);
                    });
                }
            }, { passive: true });
            
            // Ограничиваем количество перерисовок
            // при изменении размеров окна
            let resizeTimer;
            window.addEventListener('resize', function() {
                document.body.classList.add('resize-animation-stopper');
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    document.body.classList.remove('resize-animation-stopper');
                }, 400);
            }, { passive: true });
            
            // Добавляем стили для остановки анимаций
            const style = document.createElement('style');
            style.textContent = `
                .resize-animation-stopper *,
                .is-scrolling * {
                    animation: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
            
            // Оптимизируем обработку кликов - предотвращаем множественные вызовы
            const clickableElements = document.querySelectorAll('button, a, .clickable-title');
            clickableElements.forEach(element => {
                element.addEventListener('click', function(e) {
                    if (this.dataset.processing === 'true') {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    
                    this.dataset.processing = 'true';
                    setTimeout(() => {
                        this.dataset.processing = 'false';
                    }, 500);
                });
            });
            
            // Освобождаем память путем удаления ненужных классов и атрибутов
            // у невидимых в текущий момент элементов
            function cleanupOffscreenElements() {
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                
                document.querySelectorAll('.siri-pixel').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    
                    // Если элемент далеко за пределами экрана
                    if (rect.bottom < -100 || rect.top > viewportHeight + 100 ||
                        rect.right < -100 || rect.left > viewportWidth + 100) {
                        // Временно отключаем анимации и эффекты
                        el.style.animation = 'none';
                        el.style.transition = 'none';
                        el.style.boxShadow = 'none';
                        el.style.willChange = 'auto';
                    } else {
                        // Включаем обратно, если класс не содержит атрибуты
                        if (el.style.animation === 'none') {
                            el.style.willChange = 'transform';
                            el.style.transition = 'transform 0.2s linear';
                            // Сбрасываем стили
                            el.style.animation = '';
                        }
                    }
                });
            }
            
            // Запускаем очистку периодически
            setInterval(cleanupOffscreenElements, 2000);
            
            // Оптимизируем эффекты прокрутки
            window.addEventListener('scroll', function() {
                requestAnimationFrame(cleanupOffscreenElements);
            }, { passive: true });
        }
    }
});

// Функция для создания пиксельного аватара в виде аморфной переливающейся фигуры типа Siri
function createPixelAvatar(container) {
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Используем DocumentFragment для оптимизации вставки в DOM
    const fragment = document.createDocumentFragment();
    
    // Определяем, работаем ли мы на мобильном устройстве
    const isMobile = window.innerWidth < 768;
    
    // Настройки пиксельной сетки - ЗНАЧИТЕЛЬНО уменьшаем количество для мобильных
    const gridSize = isMobile ? 40 : 80; // Меньше точек на мобильных
    
    // Цвета для пикселей - используем градиенты голубого, синего и фиолетового
    const colors = [
        'rgba(0, 210, 255, 0.85)',  // Голубой (ярче)
        'rgba(70, 140, 255, 0.85)',  // Синий (ярче)
        'rgba(130, 10, 210, 0.75)',  // Фиолетовый (ярче)
        'rgba(90, 230, 255, 0.85)',  // Светло-голубой (ярче)
    ];
    
    // Размер контейнера
    const containerRect = container.getBoundingClientRect();
    const containerSize = Math.min(containerRect.width, containerRect.height);
    const pixelSize = containerSize / gridSize; // Очень маленькие пиксели
    
    // Центр изображения
    const centerX = gridSize / 2;
    const centerY = gridSize / 2;
    
    // Текущее время для анимации
    const startTime = Date.now();
    
    // Ограничим количество точек для меньшей нагрузки на мобильных
    const totalPoints = isMobile ? 400 : 1600;
    
    // Создаем базовый шаблон для аморфной фигуры типа Siri
    const baseShape = generateSiriLikeShape(centerX, centerY, gridSize * 0.3, totalPoints / 3);
    
    // Создаем ТОЛЬКО один слой на мобильных устройствах
    const layers = isMobile ? [
        { pixels: baseShape, scale: 1.0, opacity: 0.9, zIndex: 3 }
    ] : [
        { pixels: baseShape, scale: 1.0, opacity: 0.9, zIndex: 3 },
        { pixels: generateSiriLikeShape(centerX, centerY, gridSize * 0.35, totalPoints / 3), scale: 1.1, opacity: 0.6, zIndex: 2 },
        { pixels: generateSiriLikeShape(centerX, centerY, gridSize * 0.4, totalPoints / 3), scale: 1.2, opacity: 0.4, zIndex: 1 }
    ];
    
    // Создаем пиксели для каждого слоя
    layers.forEach((layer, layerIndex) => {
        // Для мобильных берем только каждый второй пиксель для ещё большей оптимизации
        const pixelsToRender = isMobile ? 
            layer.pixels.filter((_, idx) => idx % 2 === 0) : 
            layer.pixels;
            
        pixelsToRender.forEach(pixel => {
            const pixelElement = document.createElement('div');
            
            // Общие свойства
            pixelElement.style.position = 'absolute';
            pixelElement.style.width = pixelSize + 'px';
            pixelElement.style.height = pixelSize + 'px';
            pixelElement.style.borderRadius = '50%';
            pixelElement.style.zIndex = layer.zIndex;
            
            // Позиция с учетом масштаба слоя
            const scaleFactor = layer.scale;
            const x = centerX + (pixel.x - centerX) * scaleFactor;
            const y = centerY + (pixel.y - centerY) * scaleFactor;
            
            pixelElement.style.left = (x * pixelSize) + 'px';
            pixelElement.style.top = (y * pixelSize) + 'px';
            
            // Устанавливаем атрибуты для волновой анимации
            pixelElement.dataset.baseX = x * pixelSize;
            pixelElement.dataset.baseY = y * pixelSize;
            pixelElement.dataset.wavePhase = ((x / gridSize) + (y / gridSize)) * Math.PI;
            pixelElement.dataset.layer = layerIndex;
            
            // Раскрашиваем в зависимости от положения и слоя
            const colorIndex = (Math.floor(x + y) + layerIndex) % colors.length;
            pixelElement.style.backgroundColor = colors[colorIndex];
            
            // Устанавливаем прозрачность
            pixelElement.style.opacity = layer.opacity * (0.7 + Math.random() * 0.3);
            
            // Добавляем классы для анимаций
            pixelElement.className = 'pixel siri-pixel';
            
            // Ограничиваем количество highlight-пикселей на мобильных еще сильнее
            const highlightThreshold = isMobile ? 0.98 : 0.9;
            
            // Особые пиксели для создания эффекта светящихся частиц
            if (Math.random() > highlightThreshold) {
                pixelElement.className += ' siri-highlight';
                
                // На мобильных вообще не добавляем тени (box-shadow)
                if (!isMobile) {
                    pixelElement.style.boxShadow = `0 0 ${3 + Math.random() * 5}px ${colors[colorIndex]}`;
                    
                    const animDuration = 2 + Math.random() * 3;
                    const animDelay = Math.random() * 2;
                    pixelElement.style.animation = `glowPulse ${animDuration}s infinite alternate ${animDelay}s`;
                }
            }
            
            // Добавляем элемент в фрагмент
            fragment.appendChild(pixelElement);
        });
    });
    
    // Создаем центральный яркий элемент как у Siri
    const siriCore = document.createElement('div');
    siriCore.className = 'siri-core';
    siriCore.style.position = 'absolute';
    siriCore.style.width = (gridSize * 0.15 * pixelSize) + 'px';
    siriCore.style.height = (gridSize * 0.15 * pixelSize) + 'px';
    siriCore.style.borderRadius = '50%';
    siriCore.style.top = '50%';
    siriCore.style.left = '50%';
    siriCore.style.transform = 'translate(-50%, -50%)';
    
    // Упрощаем градиенты для мобильных
    if (isMobile) {
        siriCore.style.background = 'rgba(0, 210, 255, 0.7)';
        siriCore.style.boxShadow = '0 0 10px rgba(0, 210, 255, 0.4)';
    } else {
        siriCore.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9), rgba(0, 210, 255, 0.7) 50%, rgba(130, 10, 210, 0.5) 80%)';
        siriCore.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.8), 0 0 40px rgba(130, 10, 210, 0.4)';
        siriCore.style.animation = 'corePulse 4s infinite alternate';
    }
    
    siriCore.style.zIndex = '4';
    
    // Добавляем свечение вокруг всей фигуры только для десктопа
    if (!isMobile) {
        const glow = document.createElement('div');
        glow.className = 'avatar-glow';
        glow.style.zIndex = '0';
        fragment.appendChild(glow);
    }
    
    // Добавляем все элементы в DOM за одну операцию
    fragment.appendChild(siriCore);
    container.appendChild(fragment);
    
    // Запускаем волновую анимацию - более медленную на мобильных
    startAdvancedWaveAnimation(container, startTime, isMobile);
}

// Функция для генерации аморфной формы типа Siri
function generateSiriLikeShape(centerX, centerY, baseRadius, totalPoints) {
    const pixels = [];
    
    // Генерируем случайные точки внутри круга с использованием полярных координат
    for (let i = 0; i < totalPoints; i++) {
        // Случайный угол
        const angle = Math.random() * Math.PI * 2;
        
        // Случайное расстояние от центра с концентрацией к центру
        const rFactor = Math.pow(Math.random(), 0.5); // Повышает концентрацию к центру
        
        // Базовый радиус с небольшой вариацией, чтобы форма была аморфной
        const radius = baseRadius * (0.6 + rFactor * 0.4);
        
        // Добавляем волнистость по краям для более органичной формы
        const waveAmplitude = baseRadius * 0.2;
        const waveFrequency = 6; // Количество "волн" по периметру
        const wave = waveAmplitude * Math.sin(angle * waveFrequency);
        
        // Итоговое расстояние с волнистостью
        const distance = radius + wave * rFactor;
        
        // Преобразуем полярные координаты в декартовы
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Добавляем точку если она в пределах сетки
        if (x >= 0 && y >= 0) {
            pixels.push({ x, y });
        }
    }
    
    return pixels;
}

// Расширенная функция для анимации волны и пульсации с оптимизацией для мобильных
function startAdvancedWaveAnimation(container, startTime, isMobile) {
    const pixels = container.querySelectorAll('.siri-pixel');
    
    // Для экстремальной оптимизации на мобильных
    const frameDelay = isMobile ? 3 : 1; // Ещё больше пропусков кадров
    let frameCount = 0;
    let lastTime = 0;
    
    // Используем throttling для ограничения частоты обновлений на мобильных
    const targetFps = isMobile ? 15 : 60; // Ограничиваем до 15 FPS на мобильных
    const minFrameTime = 1000 / targetFps;
    
    // Кэшируем массив пикселей для быстрого доступа
    const pixelsArray = Array.from(pixels);
    
    // Используем объект для хранения предварительно вычисленных значений
    // это снижает нагрузку на CPU при вычислениях
    const precomputed = {
        sin: {},
        cos: {},
        basePositions: [] 
    };
    
    // Предварительно вычисляем базовые позиции для всех пикселей
    pixelsArray.forEach((pixel, idx) => {
        precomputed.basePositions[idx] = {
            x: parseFloat(pixel.dataset.baseX),
            y: parseFloat(pixel.dataset.baseY),
            phase: parseFloat(pixel.dataset.wavePhase),
            layer: parseInt(pixel.dataset.layer) || 0
        };
    });
    
    // Число анимируемых пикселей на мобильных устройствах
    const pixelRatio = isMobile ? 5 : 1; // Анимируем только 1/5 пикселей за кадр на мобильных
    
    function animateWave(timestamp) {
        // Пропускаем кадры для улучшения производительности
        frameCount++;
        
        // Проверяем, прошло ли минимальное время между кадрами
        const elapsed = timestamp - lastTime;
        if (elapsed < minFrameTime) {
            requestAnimationFrame(animateWave);
            return;
        }
        
        lastTime = timestamp;
        
        // На мобильных пропускаем кадры и ещё больше снижаем частоту анимации
        if (isMobile && frameCount % frameDelay !== 0) {
            requestAnimationFrame(animateWave);
            return;
        }
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Время в секундах
        
        // Для мобильных устройств анимируем только часть пикселей за раз
        // и используем более медленную анимацию
        const batchSize = Math.ceil(pixelsArray.length / pixelRatio);
        const startIdx = isMobile ? (frameCount % pixelRatio) * batchSize : 0;
        const endIdx = isMobile ? Math.min(startIdx + batchSize, pixelsArray.length) : pixelsArray.length;
        
        // Анимируем только подмножество пикселей в этом кадре
        for (let i = startIdx; i < endIdx; i++) {
            const pixel = pixelsArray[i];
            
            // Используем кэшированные базовые позиции
            const baseData = precomputed.basePositions[i];
            const baseX = baseData.x;
            const baseY = baseData.y;
            const phase = baseData.phase;
            const layer = baseData.layer;
            
            // Параметры волны зависят от слоя - сильно уменьшены для мобильных
            const amplitude = isMobile ? 
                (0.3 + layer * 0.15) : // Ещё меньшая амплитуда для мобильных
                (1 + layer * 0.5);     // Стандартная амплитуда
                
            const speed = isMobile ?
                (0.2 - layer * 0.05) : // Ещё медленнее для мобильных
                (0.8 - layer * 0.2);   // Стандартная скорость
            
            // Кэширование sin/cos для повторяющихся значений
            const sinKey = Math.round((elapsedTime * speed + phase) * 100);
            const cosKey = Math.round((elapsedTime * speed * 0.7 + phase + Math.PI/4) * 100);
            
            if (!precomputed.sin[sinKey]) {
                precomputed.sin[sinKey] = Math.sin(elapsedTime * speed + phase);
            }
            if (!precomputed.cos[cosKey]) {
                precomputed.cos[cosKey] = Math.cos(elapsedTime * speed * 0.7 + phase + Math.PI/4);
            }
            
            // Используем предварительно вычисленные значения
            const waveX = baseX + amplitude * precomputed.sin[sinKey];
            const waveY = baseY + amplitude * precomputed.cos[cosKey];
            
            // Сверхупрощенная версия для мобильных - только перемещение без масштабирования и эффектов
            if (isMobile) {
                pixel.style.transform = `translate(${waveX - baseX}px, ${waveY - baseY}px)`;
                continue; // Пропускаем остальные вычисления для мобильных
            }
            
            // Полная версия с пульсацией только для десктопов
            const centerX = container.clientWidth / 2;
            const centerY = container.clientHeight / 2;
            const distanceToCenter = Math.sqrt(Math.pow(baseX - centerX, 2) + Math.pow(baseY - centerY, 2));
            const normalizedDistance = distanceToCenter / (container.clientWidth / 2);
            
            // Пульсация увеличивается к краям
            const pulseFactor = 0.5 + normalizedDistance * 0.5;
            const pulseAmplitude = 0.3 * pulseFactor;
            const pulsePhase = elapsedTime * 0.5 + normalizedDistance * 5;
            
            // Применяем новые координаты с волновым эффектом и пульсацией
            pixel.style.transform = `translate(${waveX - baseX}px, ${waveY - baseY}px) scale(${1 + pulseAmplitude * Math.sin(pulsePhase)})`;
        }
        
        // Очищаем кэш вычислений, если он стал слишком большим
        if (Object.keys(precomputed.sin).length > 1000) {
            precomputed.sin = {};
            precomputed.cos = {};
        }
        
        // Запускаем следующий кадр анимации
        requestAnimationFrame(animateWave);
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animateWave);
}

function createDigitalParticles() {
    // Обязательно используем canvas для оптимизации
    const useCanvas = true;
    
    // Определяем мощность устройства (низкая для мобильных)
    const isMobile = window.innerWidth < 768;
    
    // Для мобильных устройств создаем минимальное количество частиц
    const particleCount = isMobile ? 8 : 30;
    
    // Оптимизация через canvas (единственный вариант для мобильных)
    if (useCanvas) {
        // Создаем canvas элемент для рендеринга частиц
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        
        // Уменьшаем размер canvas для мобильных устройств
        // это повышает производительность рендеринга
        const scaleFactor = isMobile ? 0.5 : 1.0;
        canvas.width = window.innerWidth * scaleFactor;
        canvas.height = window.innerHeight * scaleFactor;
        
        // Масштабируем canvas обратно через CSS, чтобы он покрывал весь экран
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
        
        // Создаем частицы
        const particles = [];
        
        // Добавляем обычные частицы
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.1 - 0.05,
                speedY: Math.random() * 0.1 - 0.05,
                opacity: Math.random() * 0.3 + 0.1,
                type: 'dot'
            });
        }
        
        // Добавляем цифры 0 и 1 только для десктопов
        if (!isMobile) {
            for (let i = 0; i < Math.floor(particleCount / 3); i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 14 + 8,
                    speedX: Math.random() * 0.1 - 0.05,
                    speedY: Math.random() * 0.1 - 0.05,
                    opacity: Math.random() * 0.2 + 0.1,
                    type: 'digit',
                    value: Math.random() > 0.5 ? '0' : '1'
                });
            }
        }
        
        // Переменные для управления FPS и ограничением частоты кадров
        let lastTime = 0;
        const targetFps = isMobile ? 10 : 30; // Сильно ограничиваем FPS на мобильных
        const minFrameTime = 1000 / targetFps;
        
        // Анимация с использованием requestAnimationFrame и throttling
        function animate(timestamp) {
            // Проверяем, прошло ли минимальное время между кадрами
            const elapsed = timestamp - lastTime;
            if (elapsed < minFrameTime) {
                requestAnimationFrame(animate);
                return;
            }
            
            lastTime = timestamp;
            
            // Экономим ресурсы: очищаем только необходимую область
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Обновление и отрисовка частиц
            particles.forEach(particle => {
                // На мобильных устройствах обновляем позиции частиц реже
                if (!isMobile || Math.random() > 0.2) {
                    // Обновление позиции
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // Оборачивание частиц при выходе за границы экрана
                    if (particle.x < 0) particle.x = canvas.width;
                    if (particle.x > canvas.width) particle.x = 0;
                    if (particle.y < 0) particle.y = canvas.height;
                    if (particle.y > canvas.height) particle.y = 0;
                }
                
                // Отрисовка частиц
                ctx.globalAlpha = particle.opacity;
                
                if (particle.type === 'dot') {
                    ctx.fillStyle = 'rgba(0, 210, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (particle.type === 'digit') {
                    ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
                    ctx.font = `${particle.size}px Arial`;
                    ctx.fillText(particle.value, particle.x, particle.y);
                }
            });
            
            // Запрос следующего кадра анимации
            requestAnimationFrame(animate);
        }
        
        // Запуск анимации
        requestAnimationFrame(animate);
        
        // Оптимизированный обработчик изменения размера окна
        let resizeTimeout;
        function handleResize() {
            // Используем debounce для предотвращения частых перерисовок
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newScaleFactor = isMobile ? 0.5 : 1.0;
                canvas.width = window.innerWidth * newScaleFactor;
                canvas.height = window.innerHeight * newScaleFactor;
                
                // Перемещаем частицы в пределы нового размера
                particles.forEach(particle => {
                    if (particle.x > canvas.width) particle.x = canvas.width * Math.random();
                    if (particle.y > canvas.height) particle.y = canvas.height * Math.random();
                });
            }, 250); // Задержка 250мс перед обновлением размера
        }
        
        // Обработчик с debounce
        window.addEventListener('resize', handleResize);
    } else {
        // Резервный вариант, если canvas не поддерживается - создаем минимум элементов
        // Рекомендуется не использовать этот вариант на мобильных
        const container = document.body;
        const fragment = document.createDocumentFragment();
        
        // Сокращаем количество элементов до минимума
        const fallbackParticleCount = isMobile ? 5 : 15;
        
        // Создаем элементы только пакетами, используя создание фрагментов
        for (let i = 0; i < fallbackParticleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'digital-particle';
            
            // Задаем позицию
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            
            // Добавляем в фрагмент, а не напрямую в DOM
            fragment.appendChild(particle);
        }
        
        // Добавляем все элементы за одну операцию
        container.appendChild(fragment);
    }
} 