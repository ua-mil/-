const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
let btcChart;

// Завантаження профілю
function loadProfile() {
    const email = localStorage.getItem('email');
    if (email) {
        document.getElementById('profileSection').classList.add('d-none');
        document.getElementById('portfolioSection').classList.remove('d-none');
        loadPortfolioData(); // Завантаження даних портфеля
    } else {
        document.getElementById('profileSection').classList.remove('d-none');
        document.getElementById('portfolioSection').classList.add('d-none');
    }
}

// Вхід до профілю
function loginProfile() {
    const email = document.getElementById('email').value.trim();
    if (email) {
        localStorage.setItem('email', email); // Збереження електронної пошти
        loadProfile();
    } else {
        alert('Введіть електронну пошту.');
    }
}

// Завантаження даних портфеля
function loadPortfolioData() {
    const portfolio = JSON.parse(localStorage.getItem('portfolio')) || {};
    document.getElementById('btcQuantity').value = portfolio.quantity || '';
    document.getElementById('btcPurchasePrice').value = portfolio.purchasePrice || '';
    document.getElementById('btcProfit').textContent = `$${(portfolio.profit || 0).toFixed(2)}`;
}

// Збереження даних портфеля
function savePortfolioData() {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;
    const currentPrice = parseFloat(document.getElementById('btcCurrentPrice').textContent.replace('$', '')) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    const portfolioData = { quantity, purchasePrice, profit };
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
}

// Оновлення портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;

    savePortfolioData(); // Збереження даних після оновлення
}

// Отримання ціни Bitcoin
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);
        if (!response.ok) throw new Error(`Помилка API Binance: ${response.statusText}`);
        const data = await response.json();
        const btcPrice = parseFloat(data.price).toFixed(2);

        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Помилка отримання ціни:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Помилка завантаження';
    }
}

// Побудова графіка
async function loadChartData() {
    try {
        const response = await fetch(CHART_API_URL);
        if (!response.ok) throw new Error(`Помилка API Binance: ${response.statusText}`);
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
                labels,
                datasets: [{ label: 'Ціна BTC (USD)', data: prices, borderColor: '#ffc107', tension: 0.4 }],
            },
            options: { responsive: true },
        });
    } catch (error) {
        console.error('Помилка завантаження графіка:', error);
    }
}

// Очищення портфеля
function clearPortfolioData() {
    localStorage.removeItem('portfolio');
    document.getElementById('btcQuantity').value = '';
    document.getElementById('btcPurchasePrice').value = '';
    document.getElementById('btcProfit').textContent = '$0.00';
    document.getElementById('btcTotal').textContent = '$0.00';
}

// Існуючий код (не змінюється)

// Функція для розрахунків у калькуляторі
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const total = quantity * price;

    document.getElementById('calcResult').textContent = `Загальна вартість: $${total.toFixed(2)}`;
}

// Оновлення ініціалізації при завантаженні сторінки
window.onload = () => {
    loadProfile();
    fetchBitcoinPrice();
    loadChartData();
    setInterval(fetchBitcoinPrice, 60000);
    setInterval(loadChartData, 60000);

    document.getElementById('btcQuantity').addEventListener('input', savePortfolioData);
    document.getElementById('btcPurchasePrice').addEventListener('input', savePortfolioData);
};
