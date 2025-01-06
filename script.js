const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
let btcChart;

// Завантаження даних графіка
async function loadChartData() {
    try {
        const response = await fetch(CHART_API_URL);
        const data = await response.json();

        const labels = data.map(item => new Date(item[0]).toLocaleTimeString());
        const prices = data.map(item => parseFloat(item[4]));

        if (btcChart) btcChart.destroy();

        btcChart = new Chart(document.getElementById('btcChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Ціна BTC (USD)',
                    data: prices,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.4
                }]
            }
        });
    } catch (error) {
        console.error('Помилка завантаження графіка:', error);
    }
}

// Оновлення поточної ціни
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);
        const data = await response.json();
        const currentPrice = parseFloat(data.price).toFixed(2);

        document.getElementById('btcCurrentPrice').textContent = `$${currentPrice}`;
        updatePortfolioCalculations(currentPrice);
    } catch (error) {
        console.error('Помилка оновлення ціни:', error);
    }
}

// Розрахунки портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(localStorage.getItem('btcQuantity') || 0);
    const purchasePrice = parseFloat(localStorage.getItem('btcPurchasePrice') || 0);

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Збереження прибутку
function saveProfit() {
    const profit = parseFloat(document.getElementById('btcProfit').textContent.slice(1)) || 0;
    const savedProfit = parseFloat(localStorage.getItem('savedProfit') || 0);
    localStorage.setItem('savedProfit', savedProfit + profit);
    document.getElementById('savedProfit').textContent = `$${(savedProfit + profit).toFixed(2)}`;
}

// Очищення портфеля
function clearPortfolio() {
    localStorage.removeItem('btcQuantity');
    localStorage.removeItem('btcPurchasePrice');
    localStorage.removeItem('savedProfit');
    document.getElementById('btcQuantity').value = '';
    document.getElementById('btcPurchasePrice').value = '';
    document.getElementById('savedProfit').textContent = '$0';
}

// Збереження даних профілю
function saveProfile() {
    const email = document.getElementById('email').value.trim();
    if (email) {
        localStorage.setItem('email', email);
        document.getElementById('profile').classList.add('d-none');
        document.getElementById('portfolio').classList.remove('d-none');
        document.getElementById('calculator').classList.remove('d-none');
        loadSavedData();
    } else {
        alert('Введіть ваш Email!');
    }
}

// Завантаження збережених даних
function loadSavedData() {
    document.getElementById('btcQuantity').value = localStorage.getItem('btcQuantity') || '';
    document.getElementById('btcPurchasePrice').value = localStorage.getItem('btcPurchasePrice') || '';
    document.getElementById('savedProfit').textContent = `$${localStorage.getItem('savedProfit') || 0}`;
}

// Калькулятор
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    document.getElementById('calcResult').textContent = `Загальна вартість: $${(quantity * price).toFixed(2)}`;
}

// Ініціалізація
window.onload = () => {
    const email = localStorage.getItem('email');
    if (email) {
        document.getElementById('profile').classList.add('d-none');
        document.getElementById('portfolio').classList.remove('d-none');
        document.getElementById('calculator').classList.remove('d-none');
        loadSavedData();
    }
    loadChartData();
    fetchBitcoinPrice();
    setInterval(loadChartData, 60000);
    setInterval(fetchBitcoinPrice, 60000);
};
