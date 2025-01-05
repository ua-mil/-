const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
let btcChart;
let currentUserEmail = null;
let savedPortfolioEntries = [];

// Вход пользователя
function login() {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        alert('Введите ваш email.');
        return;
    }
    currentUserEmail = email;
    localStorage.setItem('currentUser', email);

    document.getElementById('login').classList.add('hidden');
    document.getElementById('portfolioPage').classList.remove('hidden');

    loadPortfolioData();
    loadSavedPortfolioEntries();
    fetchBitcoinPrice();
    loadChartData();
}

// Сохранение данных портфеля
function savePortfolioEntry() {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;
    const currentPrice = parseFloat(document.getElementById('btcCurrentPrice').textContent.replace('$', '')) || 0;

    if (quantity === 0 || purchasePrice === 0) {
        alert('Пожалуйста, введите количество и цену покупки.');
        return;
    }

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    const newEntry = {
        quantity,
        purchasePrice,
        currentPrice,
        profit,
    };

    savedPortfolioEntries.push(newEntry);
    localStorage.setItem(`portfolio_entries_${currentUserEmail}`, JSON.stringify(savedPortfolioEntries));

    updateTotalProfit();
    alert('Данные сохранены!');
}

// Загрузка данных портфеля
function loadSavedPortfolioEntries() {
    const savedData = localStorage.getItem(`portfolio_entries_${currentUserEmail}`);
    if (savedData) {
        savedPortfolioEntries = JSON.parse(savedData);
        updateTotalProfit();
    }
}

// Обновление общего дохода
function updateTotalProfit() {
    const totalProfit = savedPortfolioEntries.reduce((sum, entry) => sum + entry.profit, 0);
    document.getElementById('totalProfit').textContent = `${totalProfit.toFixed(2)} USD`;
}

// Получение текущей цены BTC
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);
        if (!response.ok) throw new Error(`Ошибка API Binance: ${response.statusText}`);

        const data = await response.json();
        const btcPrice = parseFloat(data.price).toFixed(2);

        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Ошибка загрузки';
    }
}

// Обновление расчетов портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Загрузка графика
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

        btcChart = new Chart(document.getElementById('btcChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Цена BTC (USD)',
                    data: prices,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                }],
            },
            options: {
                responsive: true,
                scales: {
                    x: { ticks: { color: '#000' } },
                    y: { ticks: { color: '#000' } },
                },
            },
        });
    } catch (error) {
        console.error('Ошибка загрузки данных для графика:', error);
    }
}

// Калькулятор Bitcoin
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const total = quantity * price;

    document.getElementById('calcResult').textContent = `Общая стоимость: $${total.toFixed(2)}`;
}

// Загрузка при старте
window.onload = () => {
    currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail) {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('portfolioPage').classList.remove('hidden');

        loadPortfolioData();
        loadSavedPortfolioEntries();
        fetchBitcoinPrice();
        loadChartData();
    }
};
