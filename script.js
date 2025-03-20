document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных Telegram WebApp
    const telegramWebApp = window.Telegram.WebApp;
    telegramWebApp.expand(); // Разворачиваем на весь экран
    telegramWebApp.ready(); // Сообщаем о готовности приложения
    
    // Получаем initData Telegram для корректной работы WebApp
    const initData = telegramWebApp.initData || '';
    const initDataUnsafe = telegramWebApp.initDataUnsafe || {};
    
    // Проверяем наличие параметров из Telegram
    const userId = initDataUnsafe.user ? initDataUnsafe.user.id : null;
    const userName = initDataUnsafe.user ? initDataUnsafe.user.username : null;
    
    // Адаптируем интерфейс под стартовый параметр, если он есть
    const startParam = telegramWebApp.startParam || '';
    if (startParam === 'fast_start') {
        // Быстрый старт: сразу показываем бота
        setTimeout(() => {
            const botModal = document.getElementById('bot-modal');
            if (botModal) botModal.style.display = 'flex';
        }, 1000);
    }
    
    // Отключаем вертикальные свайпы для улучшения скроллинга
    if (telegramWebApp.disableVerticalSwipes) {
        telegramWebApp.disableVerticalSwipes();
    }
    
    // Проверяем тип устройства и платформу
    // Важно! Нужно проверять platform, а не просто ширину экрана
    const isMobile = window.innerWidth < 768;
    const isMobileDevice = telegramWebApp.platform ? 
        ['android', 'ios', 'android_x', 'ios_x'].includes(telegramWebApp.platform) : 
        isMobile;
    
    const isWeakDevice = isMobileDevice || 
                       (telegramWebApp.platform === 'web' && window.innerWidth < 768);
                       
    // Глобальная переменная для контроля качества эффектов
    window.isLowPerformanceMode = isWeakDevice;
    
    // Получаем информацию о цветовой схеме Telegram
    const isLightTheme = telegramWebApp.colorScheme === 'light';
    
    // Меняем цвета в зависимости от темы Telegram
    if (isLightTheme) {
        document.documentElement.style.setProperty('--bg-color', '#f0f2f5');
        document.documentElement.style.setProperty('--text-color', '#240046');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#10002b');
        document.documentElement.style.setProperty('--card-bg', '#240046');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Устанавливаем безопасные отступы под MainButton, если он активен
    if (telegramWebApp.MainButton && telegramWebApp.MainButton.isVisible) {
        document.body.style.paddingBottom = '80px';
    }
    
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
    if (pixelAvatar) {
        createPixelAvatar(pixelAvatar);
    } else {
        console.error("Элемент pixel-avatar не найден");
    }
    
    // Анимируем прогресс-бар при загрузке - отложенный запуск для улучшения первичной загрузки
    setTimeout(() => {
        if (progressFill && daysPassed) {
            // Установим начальное значение - 4 дня из 30
            daysPassed.textContent = '4';
            animateProgressBar();
        } else {
            console.error("Элементы прогресс-бара не найдены");
        }
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
        console.log("Инициализация прогресс-бара");
        
        if (!daysPassed || !progressFill) {
            console.error("Элементы прогресс-бара не найдены");
            return;
        }
        
        // Проверяем, установлено ли начальное значение
        if (!daysPassed.textContent || daysPassed.textContent === '0') {
            console.log("Устанавливаем начальное значение прогресса: 4 дня");
            daysPassed.textContent = '4';
        }
        
        const currentDays = parseInt(daysPassed.textContent);
        
        // Получаем общее количество дней
        const daysTotal = document.querySelector('.days-total');
        const totalDays = daysTotal ? parseInt(daysTotal.textContent) : 30;
        
        console.log(`Прогресс: ${currentDays} из ${totalDays} дней`);
        
        // Вычисляем процент прогресса
        const progressPercent = (currentDays / totalDays) * 100;
        
        // На слабых устройствах просто устанавливаем значение без анимации
        if (window.isLowPerformanceMode) {
            console.log(`Устанавливаем прогресс: ${progressPercent}% без анимации`);
            progressFill.style.width = progressPercent + '%';
        } else {
            // Используем requestAnimationFrame для плавной анимации
            // и оптимизации производительности
            console.log(`Анимируем прогресс до ${progressPercent}%`);
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
        
        // Проверяем статус кнопок на основе прогресса
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
    
    // Обработчик для кнопок с блокировкой - универсальная функция
    function handleLockedButton(e) {
        if (this.classList.contains('locked')) {
            e.stopPropagation();
            
            // Добавим небольшую анимацию самой кнопки
            this.classList.add('shake-effect');
            
            // Показываем информативное сообщение
            const lockMessage = this.querySelector('.lock-message');
            
            // Удаляем предыдущие таймеры, если есть
            if (this.dataset.lockTimeout) {
                clearTimeout(parseInt(this.dataset.lockTimeout));
            }
            
            // Показываем сообщение
            lockMessage.style.opacity = '1';
            lockMessage.style.visibility = 'visible';
            lockMessage.style.transform = 'translateX(-50%) translateY(0)';
            
            // Игровая обратная связь для лучшего UX
            navigator.vibrate && navigator.vibrate(50);
            
            // Создаем пульсацию иконки
            const lockIcon = this.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.style.animation = 'pulseFade 0.8s 3 ease-in-out';
            }
            
            // Скрываем сообщение через 3 секунды
            const timeout = setTimeout(() => {
                lockMessage.style.opacity = '0';
                lockMessage.style.visibility = 'hidden';
                lockMessage.style.transform = 'translateX(-50%) translateY(10px)';
                
                // Удаляем эффект встряски
                this.classList.remove('shake-effect');
                
                // Возвращаем обычную анимацию
                if (lockIcon) {
                    lockIcon.style.animation = 'pulseFade 1.5s infinite ease-in-out';
                }
            }, 3000);
            
            // Сохраняем ID таймера для возможной отмены
            this.dataset.lockTimeout = timeout;
            return false;
        }
        
        return true;
    }
    
    // Применяем обработчик ко всем заблокированным кнопкам
    addBotBtn.addEventListener('click', function(e) {
        if (!handleLockedButton.call(this, e)) return;
        
        telegramWebApp.showPopup({
            title: 'Добавление бота в чаты',
            message: 'Вы сможете добавить бота в свои групповые чаты, где он будет наблюдать за вашим общением и учиться вашему стилю коммуникации.',
            buttons: [{type: 'ok'}]
        });
    });
    
    connectChatsBtn.addEventListener('click', function(e) {
        if (!handleLockedButton.call(this, e)) return;
        
        telegramWebApp.showPopup({
            title: 'Подключение к записям разговоров',
            message: 'Подключите аватар к вашим прошлым разговорам, чтобы он ускорил обучение на основе ваших предыдущих сообщений.',
            buttons: [{type: 'ok'}]
        });
    });
    
    connectArBtn.addEventListener('click', function(e) {
        if (!handleLockedButton.call(this, e)) return;
        
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
        // Формируем URL с параметром start и дополнительным параметром для приветствия
        const botUrl = "https://t.me/LivingAvatar_Bot?start=welcome";
        
        // Открываем ссылку на бота с параметром start
        window.open(botUrl, "_blank");
        
        // Альтернативный способ через API Telegram
        try {
            telegramWebApp.openTelegramLink(botUrl);
        } catch (e) {
            console.log("Ошибка открытия ссылки через Telegram API:", e);
        }
        
        // Показываем уведомление об успешном подключении
        telegramWebApp.showPopup({
            title: 'Подключение к боту',
            message: 'Ваш персональный цифровой аватар готов к общению! Расскажите ему о себе, чтобы ускорить обучение.',
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

    // Обработчик для кнопки подключения к боту внутри модального окна
    connectTelegramBtn.addEventListener('click', function() {
        // Закрываем модальное окно
        closeBotModal();
        
        // Открываем бота в Telegram
        openTelegramBot();
        
        // Если это Telegram WebApp, можем использовать встроенную аналитику
        if (telegramWebApp.isExpanded) {
            try {
                // Отправляем аналитику в Telegram (если доступно)
                telegramWebApp.sendData(JSON.stringify({
                    action: "bot_connect",
                    from: "miniapp"
                }));
            } catch (e) {
                console.log("Ошибка отправки данных в Telegram:", e);
            }
        }
    });
    
    // Закрываем модальные окна по клику вне их содержимого
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    infoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeInfoModal();
        }
    });
    
    botModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeBotModal();
        }
    });
    
    // Проверяем, что все крестики на странице работают корректно
    // Устанавливаем обработчики напрямую для каждого крестика
    const botCloseBtnElement = document.querySelector('.bot-close-btn');
    if (botCloseBtnElement) {
        botCloseBtnElement.onclick = function() {
            const modalElement = document.getElementById('bot-modal');
            if (modalElement) modalElement.style.display = 'none';
        };
    }
    
    const infoCloseBtnElement = document.querySelector('.info-close-btn');
    if (infoCloseBtnElement) {
        infoCloseBtnElement.onclick = function() {
            const modalElement = document.getElementById('info-modal');
            if (modalElement) modalElement.style.display = 'none';
        };
    }
    
    const mainCloseBtnElement = document.querySelector('.terminal-window .close-btn');
    if (mainCloseBtnElement) {
        mainCloseBtnElement.onclick = function() {
            const modalElement = document.getElementById('modal');
            if (modalElement) modalElement.style.display = 'none';
        };
    }
    
    // Обрабатываем нажатие клавиши Enter в текстовом поле
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleUserSubmit();
        }
    });

    // Устанавливаем цвета согласно Telegram WebApp
    function applyTelegramTheme() {
        // Применяем цвета из Telegram WebApp, если они доступны
        const themeParams = telegramWebApp.themeParams || {};
        
        if (themeParams.bg_color) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        }
        
        if (themeParams.text_color) {
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        }
        
        if (themeParams.hint_color) {
            document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
        }
        
        if (themeParams.link_color) {
            document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color);
        }
        
        if (themeParams.button_color) {
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
        }
        
        if (themeParams.button_text_color) {
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        }
    }
    
    // Применяем цвета
    applyTelegramTheme();
    
    // Настраиваем кнопки Telegram WebApp
    function setupTelegramButtons() {
        // Настройка MainButton, если она доступна
        if (telegramWebApp.MainButton) {
            // При открытии любого модального окна скрываем MainButton
            const showMainButton = () => {
                telegramWebApp.MainButton.setText('Активировать бота');
                telegramWebApp.MainButton.show();
                telegramWebApp.MainButton.onClick(() => {
                    openBotModal();
                });
            };
            
            showMainButton();
            
            // Обработчики для скрытия/показа MainButton при открытии/закрытии модальных окон
            botModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeBotModal();
                    showMainButton();
                }
            });
            
            infoModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeInfoModal();
                    showMainButton();
                }
            });
            
            // Скрываем MainButton при открытии модальных окон
            telegramBotBtn.addEventListener('click', function() {
                telegramWebApp.MainButton.hide();
            });
            
            digitalSelfTitle.addEventListener('click', function() {
                telegramWebApp.MainButton.hide();
            });
        }
        
        // Настройка BackButton, если она доступна
        if (telegramWebApp.BackButton) {
            // Показываем кнопку назад только когда открыто модальное окно
            telegramWebApp.BackButton.hide();
            
            // Показываем BackButton при открытии модального окна
            const modalWindows = [modal, infoModal, botModal];
            
            modalWindows.forEach(modalWindow => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'style') {
                            const isVisible = modalWindow.style.display === 'flex';
                            if (isVisible) {
                                telegramWebApp.BackButton.show();
                                // Действие при нажатии на BackButton
                                telegramWebApp.BackButton.onClick(() => {
                                    if (modalWindow === modal) closeModal();
                                    else if (modalWindow === infoModal) closeInfoModal();
                                    else if (modalWindow === botModal) closeBotModal();
                                    
                                    // Проверяем, есть ли еще открытые модальные окна
                                    const anyModalOpen = modalWindows.some(m => m.style.display === 'flex');
                                    if (!anyModalOpen) {
                                        telegramWebApp.BackButton.hide();
                                        // Показываем MainButton, если нет открытых модальных окон
                                        if (telegramWebApp.MainButton) {
                                            showMainButton();
                                        }
                                    }
                                });
                            } else {
                                // Проверяем, есть ли еще открытые модальные окна
                                const anyModalOpen = modalWindows.some(m => m.style.display === 'flex');
                                if (!anyModalOpen) {
                                    telegramWebApp.BackButton.hide();
                                }
                            }
                        }
                    });
                });
                
                // Начинаем наблюдение за атрибутом style
                observer.observe(modalWindow, { attributes: true });
            });
        }
    }
    
    // Настраиваем кнопки Telegram
    setupTelegramButtons();
});

// Функция для создания пиксельного аватара с плавными анимациями
function createPixelAvatar(container) {
    console.log("Создаем аватар в контейнере:", container);
    
    if (!container) {
        console.error("Контейнер для аватара не найден");
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Используем DocumentFragment для оптимизации вставки в DOM
    const fragment = document.createDocumentFragment();
    
    // Определяем, работаем ли мы на мобильном устройстве
    const isMobile = window.innerWidth < 768;
    
    // Настройки пиксельной сетки
    const gridSize = isMobile ? 40 : 60; // Адаптивное количество точек
    
    // Цветовая палитра - голубой и синий
    const colors = [
        'rgba(0, 210, 255, 0.85)',  // Голубой
        'rgba(0, 180, 230, 0.85)',  // Светло-синий
        'rgba(70, 140, 255, 0.85)',  // Синий
    ];
    
    try {
        // Размер контейнера
        const containerRect = container.getBoundingClientRect();
        console.log("Размер контейнера:", containerRect.width, "x", containerRect.height);
        
        const containerSize = Math.min(containerRect.width, containerRect.height);
        const pixelSize = containerSize / gridSize;
        
        // Центр изображения
        const centerX = gridSize / 2;
        const centerY = gridSize / 2;
        
        // Создаем частицы вокруг центра
        const totalPoints = isMobile ? 150 : 300; // Количество точек
        
        console.log("Генерируем", totalPoints, "точек для аватара");
    
        // Генерируем точки в форме круга с небольшим смещением
        for (let i = 0; i < totalPoints; i++) {
            // Меняем диапазон расстояния от центра - размещаем частицы ближе к шару
            // Теперь от 45% до 75% от радиуса вместо 10-50%
            const distanceFromCenter = Math.random() * 0.3 + 0.45;
            
            // Случайный угол
            const angle = Math.random() * Math.PI * 2;
            
            // Вычисляем координаты с небольшим смещением
            const radius = gridSize * 0.3; // Базовый радиус
            const x = centerX + Math.cos(angle) * radius * distanceFromCenter;
            const y = centerY + Math.sin(angle) * radius * distanceFromCenter;
            
            // Создаем элемент пикселя
            const pixelElement = document.createElement('div');
            
            // Общие свойства
            pixelElement.style.position = 'absolute';
            pixelElement.style.width = pixelSize + 'px';
            pixelElement.style.height = pixelSize + 'px';
            pixelElement.style.borderRadius = '50%';
            pixelElement.style.zIndex = '1';
            
            // Позиция
            pixelElement.style.left = (x * pixelSize) + 'px';
            pixelElement.style.top = (y * pixelSize) + 'px';
            
            // Сохраняем данные для анимации
            pixelElement.dataset.baseX = x * pixelSize;
            pixelElement.dataset.baseY = y * pixelSize;
            pixelElement.dataset.angle = angle;
            pixelElement.dataset.distance = distanceFromCenter;
            pixelElement.dataset.speed = 0.2 + Math.random() * 0.4; // Разная скорость
            
            // Цвет пикселя
            const colorIndex = Math.floor(Math.random() * colors.length);
            pixelElement.style.backgroundColor = colors[colorIndex];
            
            // Прозрачность
            pixelElement.style.opacity = 0.6 + Math.random() * 0.4; // От 60% до 100%
            
            // Классы для анимаций
            pixelElement.className = 'pixel siri-pixel';
            
            // Добавляем в фрагмент
            fragment.appendChild(pixelElement);
        }
        
        // Создаем яркий центральный элемент
        const siriCore = document.createElement('div');
        siriCore.className = 'siri-core';
        siriCore.style.position = 'absolute';
        siriCore.style.width = (gridSize * 0.2 * pixelSize) + 'px';
        siriCore.style.height = (gridSize * 0.2 * pixelSize) + 'px';
        siriCore.style.borderRadius = '50%';
        siriCore.style.top = '50%';
        siriCore.style.left = '50%';
        siriCore.style.transform = 'translate(-50%, -50%)';
        
        // Красивое свечение для центрального элемента
        if (isMobile) {
            // Упрощенная версия для мобильных
            siriCore.style.background = 'rgb(0, 210, 255)';
            siriCore.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.8)';
        } else {
            // Полная версия для десктопов
            siriCore.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9), rgba(0, 210, 255, 0.8) 60%)';
            siriCore.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.8), 0 0 30px rgba(0, 180, 230, 0.4)';
        }
        
        siriCore.style.zIndex = '3';
        
        // Добавляем свечение вокруг аватара
        const glow = document.createElement('div');
        glow.className = 'avatar-glow';
        glow.style.position = 'absolute';
        glow.style.top = '50%';
        glow.style.left = '50%';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.width = '90%';
        glow.style.height = '90%';
        glow.style.borderRadius = '50%';
        glow.style.background = 'radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 30%, transparent 70%)';
        glow.style.zIndex = '0';
        
        // Добавляем все элементы в DOM
        fragment.appendChild(siriCore);
        fragment.appendChild(glow);
        container.appendChild(fragment);
        
        console.log("Аватар создан, запускаем анимацию");
        
        // Запускаем плавную анимацию
        startSmoothAnimation(container);
    } catch (error) {
        console.error("Ошибка при создании аватара:", error);
    }
}

// Функция для плавной анимации аватара
function startSmoothAnimation(container) {
    if (!container) {
        console.error("Контейнер для анимации не найден");
        return;
    }
    
    const pixels = container.querySelectorAll('.siri-pixel');
    console.log("Найдено пикселей для анимации:", pixels.length);
    
    if (pixels.length === 0) {
        console.error("Пиксели для анимации не найдены");
        return;
    }
    
    const isMobile = window.innerWidth < 768;
    
    // Запускаем анимацию с оптимальной частотой обновления
    const frameDelay = isMobile ? 3 : 1; // Пропускаем больше кадров на мобильных
    let frameCount = 0;
    
    function animate() {
        frameCount++;
        
        // Пропускаем кадры для мобильных устройств
        if (isMobile && frameCount % frameDelay !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        const time = Date.now() / 1000;
        
        // Анимируем только некоторые пиксели в каждом кадре на мобильных
        const batchSize = isMobile ? Math.ceil(pixels.length / 4) : pixels.length;
        const startIdx = isMobile ? (frameCount % 4) * batchSize : 0;
        const endIdx = isMobile ? Math.min(startIdx + batchSize, pixels.length) : pixels.length;
        
        // Обновляем только выбранные пиксели
        for (let i = startIdx; i < endIdx; i++) {
            const pixel = pixels[i];
            
            const baseX = parseFloat(pixel.dataset.baseX);
            const baseY = parseFloat(pixel.dataset.baseY);
            const angle = parseFloat(pixel.dataset.angle || 0);
            const speed = parseFloat(pixel.dataset.speed || 0.3);
            
            // Создаем плавное движение
            // Увеличиваем амплитуду движения в 2 раза для более заметного эффекта орбиты
            const offsetX = Math.sin(time * speed + angle) * 10;
            const offsetY = Math.cos(time * speed + angle * 0.7) * 10;
            
            // Применяем трансформацию
            pixel.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
        
        // Продолжаем анимацию
        requestAnimationFrame(animate);
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animate);
    
    // Анимация пульсации для центрального элемента
    const siriCore = container.querySelector('.siri-core');
    if (siriCore) {
        if (!isMobile) {
            // Только для десктопов делаем анимацию пульсации
            siriCore.style.animation = 'corePulse 4s infinite alternate';
        }
    } else {
        console.error("Центральный элемент не найден");
    }
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