const BINANCE_API_URL = 'https://api.binance.com/api/v3';
let totalProfit = 0;

// Обновление графика
async function loadChartData() {
    const response = await fetch(`${BINANCE_API_URL}/klines?symbol=BTCUSDT&interval=1h&limit=24`);
    const data = await response.json();

    const labels = data.map(item => {
        const date = new Date(item[0]);
        return `${date.getHours()}:00`;
    });

    const prices = data.map(item => parseFloat(item[4]));

    new Chart(document.getElementById('btcChart').getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Цена BTC (USD)',
                data: prices,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                x: { ticks: { color: '#fff' } },
                y: { ticks: { color: '#fff' } }
            }
        }
    });
}

// Получение текущей цены BTC
async function fetchBitcoinPrice() {
    const response = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=BTCUSDT`);
    const data = await response.json();
    const price = parseFloat(data.price).toFixed(2);

    document.getElementById('btcCurrentPrice').textContent = `$${price}`;
    updatePortfolioCalculations(price);
}

// Обновление данных портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Сохранение данных портфеля
function savePortfolioEntry() {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const currentPrice = parseFloat(document.getElementById('btcCurrentPrice').textContent.replace('$', '')) || 0;
    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    totalProfit += profit;

    localStorage.setItem('portfolio', JSON.stringify({
        totalProfit,
        entries: [{ quantity, purchasePrice, currentPrice, profit }]
    }));

    document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;
}

// Загрузка сохраненных данных
function loadSavedPortfolio() {
    const savedData = JSON.parse(localStorage.getItem('portfolio'));
    if (savedData) {
        totalProfit = savedData.totalProfit || 0;
        document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;
    }
}

// Калькулятор
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;

    const result = quantity * price;
    document.getElementById('calcResult').textContent = `Общая стоимость: $${result.toFixed(2)}`;
}

// Логин
function login() {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert('Введите Email');

    document.getElementById('login').classList.add('hidden');
    document.getElementById('chartSection').classList.remove('hidden');
    document.getElementById('portfolioPage').classList.remove('hidden');
    document.getElementById('calculatorPage').classList.remove('hidden');

    fetchBitcoinPrice();
    loadChartData();
    loadSavedPortfolio();
}

// Загрузка данных при старте
window.onload = () => {
    fetchBitcoinPrice();
    loadChartData();
    setInterval(fetchBitcoinPrice, 60000);
    setInterval(loadChartData, 60000);
};
