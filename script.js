const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
const ctx = document.getElementById('btcChart').getContext('2d');
let btcChart;

// Сохранение профиля
function saveProfile() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;

        // Переход на главную страницу
        document.getElementById('profile').classList.add('hidden');
        document.getElementById('portfolioPage').classList.remove('hidden');

        fetchBitcoinPrice();
        loadChartData();
    } else {
        alert('Введите имя пользователя.');
    }
}

// Загрузка профиля
function loadProfile() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
        document.getElementById('profile').classList.add('hidden');
        document.getElementById('portfolioPage').classList.remove('hidden');

        fetchBitcoinPrice();
        loadChartData();
        loadPortfolioData();
    } else {
        document.getElementById('profile').classList.remove('hidden');
        document.getElementById('portfolioPage').classList.add('hidden');
    }
}

// Сохранение данных портфеля
function savePortfolioData() {
    const btcQuantity = document.getElementById('btcQuantity').value || '';
    const btcPurchasePrice = document.getElementById('btcPurchasePrice').value || '';

    const portfolioData = { btcQuantity, btcPurchasePrice };
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// Загрузка данных портфеля
function loadPortfolioData() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
    if (portfolioData) {
        document.getElementById('btcQuantity').value = portfolioData.btcQuantity;
        document.getElementById('btcPurchasePrice').value = portfolioData.btcPurchasePrice;

        fetchBitcoinPrice();
    }
}

// Получение текущей цены Bitcoin
async function fetchBitcoinPrice() {
    const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
    try {
        const response = await fetch(BINANCE_API_URL);
        if (!response.ok) throw new Error(`Ошибка API Binance: ${response.statusText}`);
        const data = await response.json();

        const btcPrice = parseFloat(data.price).toFixed(2);
        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Ошибка загрузки цены:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Ошибка загрузки';
    }
}

// Построение графика
async function loadChartData() {
    try {
        const response = await fetch(CHART_API_URL);
        if (!response.ok) throw new Error(`Ошибка API Binance: ${response.statusText}`);
        const data = await response.json();

        const labels = data.map(item => {
            const date = new Date(item[0]);
            return `${date.getHours()}:00`;
        });

        const prices = data.map(item => parseFloat(item[4]));

        if (btcChart) btcChart.destroy();
        btcChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Цена BTC (USD)',
                    data: prices,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.3,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } },
                },
                scales: {
                    x: { ticks: { color: '#fff' } },
                    y: { ticks: { color: '#fff' } },
                },
            },
        });
    } catch (error) {
        console.error('Ошибка загрузки графика:', error);
    }
}

// Обновление портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Калькулятор Bitcoin
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const total = quantity * price;

    document.getElementById('calcResult').textContent = `Общая стоимость: $${total.toFixed(2)}`;
}

// Инициализация
window.onload = () => {
    loadProfile();
    setInterval(fetchBitcoinPrice, 60000);
    setInterval(loadChartData, 60000);
};
