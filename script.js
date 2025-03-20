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
    const interactBtn = document.getElementById('interact-btn');
    const addBotBtn = document.getElementById('add-bot-btn');
    const connectChatsBtn = document.getElementById('connect-chats-btn');
    const connectArBtn = document.getElementById('connect-ar-btn');
    const modal = document.getElementById('modal');
    const infoModal = document.getElementById('info-modal');
    const closeBtn = document.querySelector('.close-btn');
    const infoCloseBtn = document.querySelector('.info-close-btn');
    const submitInput = document.getElementById('submit-input');
    const userInput = document.getElementById('user-input');
    const digitalSelfTitle = document.getElementById('digital-self-title');
    const pixelAvatar = document.getElementById('pixel-avatar');
    const progressFill = document.querySelector('.progress-fill');
    const daysPassed = document.querySelector('.days-passed');
    
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
    
    // Функция для анимации прогресс-бара
    function animateProgressBar() {
        const currentDays = parseInt(daysPassed.textContent);
        const totalDays = parseInt(document.querySelector('.days-total').textContent);
        
        const progressPercent = (currentDays / totalDays) * 100;
        
        // Сначала установим ширину 0
        progressFill.style.width = '0%';
        
        // Затем анимируем до текущего значения
        setTimeout(() => {
            progressFill.style.width = progressPercent + '%';
        }, 500);
        
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
    
    // Обработчики событий
    interactBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    submitInput.addEventListener('click', handleUserSubmit);
    digitalSelfTitle.addEventListener('click', openInfoModal);
    infoCloseBtn.addEventListener('click', closeInfoModal);
    
    // Закрываем модальные окна по клику вне их содержимого
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === infoModal) {
            closeInfoModal();
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

// Функция для создания пиксельного аватара
function createPixelAvatar(container) {
    if (!container) return;
    
    // Настройки пиксельной сетки
    const pixelSize = 3; // Уменьшаем размер для увеличения количества пикселей
    const gridWidth = Math.floor(container.clientWidth / pixelSize);
    const gridHeight = Math.floor(container.clientHeight / pixelSize);
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Цвета для пикселей
    const colors = [
        'rgba(0, 255, 255, 0.85)',  // Голубой (ярче)
        'rgba(70, 140, 255, 0.85)',  // Синий (ярче)
        'rgba(130, 10, 210, 0.75)',   // Фиолетовый (ярче)
        'rgba(255, 45, 155, 0.75)',  // Розовый (ярче)
        'rgba(90, 230, 255, 0.85)'   // Светло-голубой (ярче)
    ];
    
    // Создаем аморфное пятно пикселей
    const centerX = Math.floor(gridWidth / 2);
    const centerY = Math.floor(gridHeight / 2);
    const baseRadius = Math.min(gridWidth, gridHeight) * 0.35;
    
    // Создаем пиксели
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            // Базовое расстояние от центра
            const baseDist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            // Случайные вариации для создания неровных краев
            const angleRad = Math.atan2(y - centerY, x - centerX);
            
            // Создаем переменную для анимации изменения формы
            const uniqueId = `wave-${x}-${y}`;
            
            // Решаем, нужно ли рисовать пиксель в данной позиции
            if (baseDist < baseRadius) {
                // Увеличиваем вероятность появления пикселей на 40%
                const probability = 0.95 - (baseDist / baseRadius) * 0.5;
                if (Math.random() < probability) {
                    const pixel = document.createElement('div');
                    pixel.className = 'avatar-pixel';
                    pixel.dataset.id = uniqueId;
                    
                    // Задаем позицию
                    pixel.style.width = pixelSize + 'px';
                    pixel.style.height = pixelSize + 'px';
                    pixel.style.position = 'absolute';
                    pixel.style.left = (x * pixelSize) + 'px';
                    pixel.style.top = (y * pixelSize) + 'px';
                    
                    // Случайный цвет из палитры
                    const colorIndex = Math.floor(Math.random() * colors.length);
                    pixel.style.backgroundColor = colors[colorIndex];
                    
                    // Добавляем прозрачность (больше к краям)
                    const edgeFactor = 1 - (baseDist / baseRadius) * 0.7;
                    pixel.style.opacity = (Math.random() * 0.4 + 0.4) * edgeFactor;
                    
                    // Добавляем анимацию мерцания и движения
                    const animDuration = 2 + Math.random() * 5;
                    const animDelay = Math.random() * 4;
                    pixel.style.animation = `
                        pixelPulse ${animDuration}s infinite alternate ${animDelay}s,
                        pixelWave ${3 + Math.random() * 6}s infinite alternate ${Math.random() * 2}s
                    `;
                    
                    // Устанавливаем трансформацию для каждого пикселя
                    const distance = 2 + Math.random() * 6;
                    const angle = Math.random() * 360;
                    pixel.style.setProperty('--wave-distance', `${distance}px`);
                    pixel.style.setProperty('--wave-angle', `${angle}deg`);
                    
                    container.appendChild(pixel);
                }
            } else if (baseDist < baseRadius * 1.3 && Math.random() > 0.8) {
                // Увеличиваем количество внешних "размытых" пикселей
                const pixel = document.createElement('div');
                pixel.className = 'avatar-pixel outer-pixel';
                
                // Задаем позицию
                pixel.style.width = pixelSize + 'px';
                pixel.style.height = pixelSize + 'px';
                pixel.style.position = 'absolute';
                pixel.style.left = (x * pixelSize) + 'px';
                pixel.style.top = (y * pixelSize) + 'px';
                
                // Случайный цвет из палитры
                const colorIndex = Math.floor(Math.random() * colors.length);
                pixel.style.backgroundColor = colors[colorIndex];
                
                // Меньшая непрозрачность для внешних пикселей
                pixel.style.opacity = Math.random() * 0.4 + 0.1;
                
                // Анимация для внешних пикселей
                const animDuration = 3 + Math.random() * 7;
                const animDelay = Math.random() * 5;
                pixel.style.animation = `outerPixelPulse ${animDuration}s infinite alternate ${animDelay}s`;
                
                container.appendChild(pixel);
            }
        }
    }
    
    // Создаем стиль для анимации пикселей
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pixelPulse {
            0% { opacity: 0.2; transform: scale(0.7); }
            50% { opacity: 0.6; }
            100% { opacity: 0.4; transform: scale(1.2); }
        }
        
        @keyframes outerPixelPulse {
            0% { opacity: 0.05; transform: scale(0.5) translateY(3px); }
            50% { opacity: 0.3; }
            100% { opacity: 0.15; transform: scale(1.1) translateY(-3px); }
        }
        
        @keyframes pixelWave {
            0% { transform: translate(calc(cos(var(--wave-angle)) * 0), calc(sin(var(--wave-angle)) * 0)); }
            33% { transform: translate(calc(cos(var(--wave-angle)) * var(--wave-distance)), calc(sin(var(--wave-angle)) * var(--wave-distance))); }
            66% { transform: translate(calc(cos(var(--wave-angle) + 120deg) * var(--wave-distance)), calc(sin(var(--wave-angle) + 120deg) * var(--wave-distance))); }
            100% { transform: translate(calc(cos(var(--wave-angle) + 240deg) * var(--wave-distance)), calc(sin(var(--wave-angle) + 240deg) * var(--wave-distance))); }
        }
        
        .avatar-pixel {
            transition: all 0.5s ease;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
        }
        
        .outer-pixel {
            filter: blur(1.5px);
        }
        
        .pixel-avatar {
            animation: blobMovement 20s ease-in-out infinite alternate;
            filter: blur(0.7px);
        }
        
        @keyframes blobMovement {
            0% { transform: scale(1) rotate(0deg); }
            20% { transform: scale(1.02) rotate(5deg); }
            40% { transform: scale(0.98) rotate(-3deg); }
            60% { transform: scale(1.03) rotate(-6deg); }
            80% { transform: scale(0.97) rotate(2deg); }
            100% { transform: scale(1.01) rotate(7deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Запускаем интервал для периодического обновления положения некоторых пикселей
    setInterval(() => {
        const pixels = container.querySelectorAll('.avatar-pixel');
        pixels.forEach(pixel => {
            if (Math.random() > 0.7) {
                const distance = 2 + Math.random() * 6;
                const angle = Math.random() * 360;
                pixel.style.setProperty('--wave-distance', `${distance}px`);
                pixel.style.setProperty('--wave-angle', `${angle}deg`);
            }
        });
    }, 3000);
}

function createDigitalParticles() {
    const container = document.body;
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('digital-particle');
        
        // Случайное позиционирование
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        
        // Случайная задержка анимации
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        
        container.appendChild(particle);
    }
    
    // Также добавим цифровые элементы
    const digitalElements = ['0', '1'];
    for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.classList.add('digital-particle');
        element.textContent = digitalElements[Math.floor(Math.random() * digitalElements.length)];
        element.style.fontSize = (Math.random() * 14 + 8) + 'px';
        element.style.color = 'rgba(0, 255, 255, 0.2)';
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = Math.random() * 100 + 'vh';
        element.style.animationDelay = (Math.random() * 5) + 's';
        element.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        container.appendChild(element);
    }
} 