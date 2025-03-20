document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных Telegram WebApp
    const telegramWebApp = window.Telegram.WebApp;
    telegramWebApp.expand(); // Разворачиваем на весь экран
    telegramWebApp.ready(); // Сообщаем о готовности приложения
    
    // Отключаем вертикальные свайпы для улучшения скроллинга
    if (telegramWebApp.disableVerticalSwipes) {
        telegramWebApp.disableVerticalSwipes();
    }
    
    // Установка обработчика для исправления проблем со скроллингом
    document.addEventListener('touchmove', function(e) {
        // Разрешаем нативный скроллинг
        e.stopPropagation();
    }, { passive: false });
    
    // Изменение стилей в соответствии с темой Telegram
    if (telegramWebApp.colorScheme === 'dark') {
        document.documentElement.style.setProperty('--bg-color', '#10002b');
        document.documentElement.style.setProperty('--card-bg', '#240046');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#f0f2f5');
        document.documentElement.style.setProperty('--text-color', '#240046');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
    }
    
    // DOM элементы
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
    
    // Создание пиксельного аватара
    createPixelAvatar(pixelAvatar);
    
    // Анимируем прогресс-бар при загрузке
    animateProgressBar();
    
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
            
            // Оптимизация: используем requestAnimationFrame для отложенных обновлений UI
            // вместо множества setTimeout
            requestAnimationFrame(() => {
                setTimeout(() => {
                    const responseMsg = document.createElement('p');
                    responseMsg.className = 'system-msg';
                    responseMsg.textContent = 'API ключ принят. Начинаю сбор данных...';
                    terminalOutput.appendChild(responseMsg);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    
                    requestAnimationFrame(() => {
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
                                    // это использует GPU-ускорение
                                    requestAnimationFrame(() => {
                                        progressFill.style.width = newProgressPercent + '%';
                                    });
                                    
                                    // Проверяем, нужно ли разблокировать какие-то кнопки
                                    checkButtonsUnlock(newValue);
                                }
                            }, 1500);
                        }, 800);
                    });
                }, 1000);
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
        
        // Проверяем все кнопки в цикле
        for (const item of buttonsToCheck) {
            if (daysCount >= item.threshold && item.button.classList.contains('locked')) {
                item.button.classList.remove('locked');
                
                // Используем setTimeout для отложенного уведомления,
                // чтобы не блокировать UI
                setTimeout(() => {
                    telegramWebApp.showPopup({
                        title: 'Новая функция доступна!',
                        message: item.message,
                        buttons: [{type: 'ok'}]
                    });
                }, 500);
            }
        }
    }
    
    // Функция для анимации прогресс-бара - оптимизирована
    function animateProgressBar() {
        const currentDays = parseInt(daysPassed.textContent);
        const totalDays = parseInt(document.querySelector('.days-total').textContent);
        
        const progressPercent = (currentDays / totalDays) * 100;
        
        // Используем requestAnimationFrame для плавной анимации
        // и оптимизации производительности
        requestAnimationFrame(() => {
            progressFill.style.width = '0%';
            
            // Используем второй requestAnimationFrame для обеспечения
            // корректной последовательности анимации
            requestAnimationFrame(() => {
                progressFill.style.width = progressPercent + '%';
            });
        });
        
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
});

// Функция для создания пиксельного аватара в виде аморфной переливающейся фигуры типа Siri
function createPixelAvatar(container) {
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Используем DocumentFragment для оптимизации вставки в DOM
    const fragment = document.createDocumentFragment();
    
    // Настройки пиксельной сетки - делаем пиксели в 5 раз меньше
    const gridSize = 80; // Очень детализированная сетка
    
    // Цвета для пикселей - используем градиенты голубого, синего и фиолетового
    const colors = [
        'rgba(0, 210, 255, 0.85)',  // Голубой (ярче)
        'rgba(30, 160, 255, 0.85)',  // Синий-голубой
        'rgba(70, 140, 255, 0.85)',  // Синий (ярче)
        'rgba(100, 120, 255, 0.8)',  // Сине-фиолетовый
        'rgba(130, 10, 210, 0.75)',  // Фиолетовый (ярче)
        'rgba(160, 10, 240, 0.7)',   // Ярко-фиолетовый
        'rgba(90, 230, 255, 0.85)',  // Светло-голубой (ярче)
        'rgba(10, 180, 230, 0.8)'    // Бирюзовый
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
    
    // Создаем базовый шаблон для аморфной фигуры типа Siri
    const baseShape = generateSiriLikeShape(centerX, centerY, gridSize * 0.3);
    
    // Создаем несколько слоев с разными размерами для эффекта глубины
    const layers = [
        { pixels: baseShape, scale: 1.0, opacity: 0.9, zIndex: 3 },
        { pixels: generateSiriLikeShape(centerX, centerY, gridSize * 0.35), scale: 1.1, opacity: 0.6, zIndex: 2 },
        { pixels: generateSiriLikeShape(centerX, centerY, gridSize * 0.4), scale: 1.2, opacity: 0.4, zIndex: 1 }
    ];
    
    // Создаем пиксели для каждого слоя
    layers.forEach((layer, layerIndex) => {
        layer.pixels.forEach(pixel => {
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
            
            // Особые пиксели для создания эффекта светящихся частиц
            if (Math.random() > 0.9) {
                pixelElement.className += ' siri-highlight';
                pixelElement.style.boxShadow = `0 0 ${3 + Math.random() * 5}px ${colors[colorIndex]}`;
                
                // Анимация для светящихся частиц
                const animDuration = 2 + Math.random() * 3;
                const animDelay = Math.random() * 2;
                pixelElement.style.animation = `glowPulse ${animDuration}s infinite alternate ${animDelay}s`;
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
    siriCore.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9), rgba(0, 210, 255, 0.7) 50%, rgba(130, 10, 210, 0.5) 80%)';
    siriCore.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.8), 0 0 40px rgba(130, 10, 210, 0.4)';
    siriCore.style.zIndex = '4';
    siriCore.style.animation = 'corePulse 4s infinite alternate';
    
    // Добавляем свечение вокруг всей фигуры
    const glow = document.createElement('div');
    glow.className = 'avatar-glow';
    glow.style.zIndex = '0';
    
    // Добавляем все элементы в DOM за одну операцию
    fragment.appendChild(siriCore);
    fragment.appendChild(glow);
    container.appendChild(fragment);
    
    // Запускаем волновую анимацию
    startAdvancedWaveAnimation(container, startTime);
    
    // Создаем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        .siri-pixel {
            will-change: transform, opacity;
            transition: transform 0.1s ease-out;
        }
        
        .siri-highlight {
            z-index: 5;
            will-change: opacity, box-shadow;
        }
        
        @keyframes glowPulse {
            0% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; }
            100% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes corePulse {
            0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.9); box-shadow: 0 0 20px rgba(0, 210, 255, 0.6), 0 0 30px rgba(130, 10, 210, 0.3); }
            50% { opacity: 1; box-shadow: 0 0 30px rgba(0, 210, 255, 0.8), 0 0 50px rgba(130, 10, 210, 0.5); }
            100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 25px rgba(0, 210, 255, 0.7), 0 0 40px rgba(130, 10, 210, 0.4); }
        }
        
        .avatar-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            height: 90%;
            background: radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 10%, rgba(130, 10, 210, 0.1) 60%, transparent 75%);
            border-radius: 50%;
            animation: glowRadiate 8s infinite alternate;
            z-index: 0;
            pointer-events: none;
        }
        
        @keyframes glowRadiate {
            0% { opacity: 0.4; width: 90%; height: 90%; transform: translate(-50%, -50%) rotate(0deg); }
            50% { opacity: 0.6; width: 95%; height: 95%; transform: translate(-50%, -50%) rotate(180deg); }
            100% { opacity: 0.5; width: 100%; height: 100%; transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .pixel-avatar {
            will-change: transform;
            animation: avatarFloat 15s ease-in-out infinite alternate;
            background: transparent;
        }
        
        @keyframes avatarFloat {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(1deg) scale(1.01); }
            75% { transform: rotate(-1deg) scale(0.99); }
            100% { transform: rotate(0.5deg) scale(1.01); }
        }
    `;
    document.head.appendChild(style);
}

// Функция для генерации аморфной формы типа Siri
function generateSiriLikeShape(centerX, centerY, baseRadius) {
    const pixels = [];
    const totalPoints = 2000; // Много точек для плавности
    
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

// Расширенная функция для анимации волны и пульсации
function startAdvancedWaveAnimation(container, startTime) {
    const pixels = container.querySelectorAll('.siri-pixel');
    
    function animateWave() {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000; // Время в секундах
        
        pixels.forEach(pixel => {
            // Получаем базовые позиции и параметры
            const baseX = parseFloat(pixel.dataset.baseX);
            const baseY = parseFloat(pixel.dataset.baseY);
            const phase = parseFloat(pixel.dataset.wavePhase);
            const layer = parseInt(pixel.dataset.layer) || 0;
            
            // Параметры волны зависят от слоя
            const amplitude = 1 + layer * 0.5; // Разная амплитуда для разных слоев
            const period = 4 + layer; // Разные периоды для создания более сложной анимации
            const speed = 0.8 - layer * 0.2; // Разная скорость
            
            // Вычисляем новые координаты с волновым эффектом
            const waveX = baseX + amplitude * Math.sin(elapsed * speed + phase);
            const waveY = baseY + amplitude * Math.cos(elapsed * speed * 0.7 + phase + Math.PI/4);
            
            // Добавляем пульсацию, зависящую от расстояния до центра
            const centerX = container.clientWidth / 2;
            const centerY = container.clientHeight / 2;
            const distanceToCenter = Math.sqrt(Math.pow(baseX - centerX, 2) + Math.pow(baseY - centerY, 2));
            const normalizedDistance = distanceToCenter / (container.clientWidth / 2);
            
            // Пульсация увеличивается к краям
            const pulseFactor = 0.5 + normalizedDistance * 0.5;
            const pulseAmplitude = 0.3 * pulseFactor;
            const pulsePhase = elapsed * 0.5 + normalizedDistance * 5;
            
            // Применяем новые координаты с волновым эффектом и пульсацией
            pixel.style.transform = `translate(${waveX - baseX}px, ${waveY - baseY}px) scale(${1 + pulseAmplitude * Math.sin(pulsePhase)})`;
        });
        
        // Запускаем следующий кадр анимации
        requestAnimationFrame(animateWave);
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animateWave);
}

function createDigitalParticles() {
    // Проверяем, поддерживает ли браузер canvas для оптимизации
    const useCanvas = true;
    
    // Уменьшаем количество частиц в зависимости от устройства
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;
    
    if (useCanvas) {
        // Создаем canvas элемент для рендеринга частиц
        // Это намного эффективнее с точки зрения производительности
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Создаем частицы
        const particles = [];
        
        // Добавляем обычные частицы
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.2 - 0.1,
                speedY: Math.random() * 0.2 - 0.1,
                opacity: Math.random() * 0.3 + 0.1,
                type: 'dot'
            });
        }
        
        // Добавляем цифры 0 и 1
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
        
        // Анимация с использованием requestAnimationFrame
        // для оптимальной частоты кадров
        function animate() {
            // Очистка канваса
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Обновление и отрисовка частиц
            particles.forEach(particle => {
                // Обновление позиции
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Оборачивание частиц при выходе за границы экрана
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
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
        animate();
        
        // Обработчик изменения размера окна
        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Добавляем прослушиватель событий для изменения размера
        window.addEventListener('resize', handleResize);
    } else {
        // Резервный вариант для браузеров, которые не поддерживают canvas
        // с уменьшенным количеством элементов
        const container = document.body;
        const fragment = document.createDocumentFragment();
        
        // Создаем элементы только пакетами, используя создание фрагментов
        for (let i = 0; i < particleCount; i++) {
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