// Сохранение профиля
function saveProfile() {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('Введите имя пользователя.');
        return;
    }

    localStorage.setItem('username', username);
    document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
    document.getElementById('profile').style.display = 'none';
    document.getElementById('portfolio').style.display = 'block';

    loadPortfolio();
}

// Загрузка профиля
function loadProfile() {
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
        document.getElementById('profile').style.display = 'none';
        document.getElementById('portfolio').style.display = 'block';

        loadPortfolio();
    }
}

// Получение текущей цены Биткойна
// URL API Binance для получения текущей цены BTC/USDT
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';

// Функция для получения текущей цены Bitcoin
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка API Binance: ${response.statusText}`);
        }

        const data = await response.json();
        const btcPrice = parseFloat(data.price).toFixed(2); // Текущая цена BTC

        // Отображаем цену на странице
        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;

        // Обновляем расчеты портфеля
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Ошибка загрузки';
    }
}

// Обновляем расчеты портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Автоматически вызываем fetchBitcoinPrice при загрузке страницы
window.onload = () => {
    fetchBitcoinPrice();

    // Автообновление цены каждые 60 секунд
    setInterval(fetchBitcoinPrice, 60000);
};

// Сохранение данных портфеля
async function updatePortfolio() {
    const quantity = parseFloat(document.getElementById('btcQuantity').value);
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value);
    const currentPrice = await fetchCurrentPrice();

    if (isNaN(quantity) || isNaN(purchasePrice) || currentPrice === null) {
        alert('Пожалуйста, введите корректные данные.');
        return;
    }

    const total = quantity * currentPrice;
    const profit = total - (quantity * purchasePrice);

    document.getElementById('btcTotal').textContent = total.toFixed(2);
    document.getElementById('btcProfit').textContent = profit.toFixed(2);

    // Сохранение данных в localStorage
    const portfolioData = { quantity, purchasePrice };
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
}

// Загрузка данных портфеля
function loadPortfolio() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolio'));

    if (portfolioData) {
        document.getElementById('btcQuantity').value = portfolioData.quantity;
        document.getElementById('btcPurchasePrice').value = portfolioData.purchasePrice;
        updatePortfolio();
    }
}

// Загрузка профиля при запуске
window.onload = loadProfile;
// Калькулятор Биткойн
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value);
    const price = parseFloat(document.getElementById('calcPrice').value);

    if (isNaN(quantity) || isNaN(price)) {
        alert('Введите корректные данные.');
        return;
    }

    const total = quantity * price;
    document.getElementById('calcResult').textContent = `Общая стоимость: $${total.toFixed(2)}`;
}

// Показывать калькулятор после входа
function showCalculator() {
    document.getElementById('calculator').style.display = 'block';
}

// Модифицированный saveProfile
function saveProfile() {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('Введите имя пользователя.');
        return;
    }

    localStorage.setItem('username', username);
    document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
    document.getElementById('profile').style.display = 'none';
    document.getElementById('portfolio').style.display = 'block';
    showCalculator(); // Показываем калькулятор

    loadPortfolio();
}

// Модифицированный loadProfile
function loadProfile() {
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
        document.getElementById('profile').style.display = 'none';
        document.getElementById('portfolio').style.display = 'block';
        showCalculator(); // Показываем калькулятор

        loadPortfolio();
    }
}

// Вызов при загрузке страницы
window.onload = loadProfile;
