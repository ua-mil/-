const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
let btcChart;
const ctx = document.getElementById('btcChart').getContext('2d');

// Вхід до системи
function login() {
    const email = document.getElementById('email').value.trim();
    if (email) {
        localStorage.setItem('email', email);
        document.getElementById('login').classList.add('hidden');
        document.getElementById('chartSection').classList.remove('hidden');
        document.getElementById('portfolioPage').classList.remove('hidden');
        document.getElementById('calculatorPage').classList.remove('hidden');
        loadPortfolioData();
        loadChartData();
        fetchBitcoinPrice();
    } else {
        alert('Введіть Email для входу.');
    }
}

// Завантаження графіку ціни Bitcoin
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

        btcChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ціна BTC (USD)',
                    data: prices,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.3,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff',
                        },
                    },
                    y: {
                        ticks: {
                            color: '#fff',
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Помилка завантаження графіку:', error);
    }
}

// Отримання поточної ціни Bitcoin
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);
        if (!response.ok) throw new Error(`Помилка API Binance: ${response.statusText}`);

        const data = await response.json();
        const btcPrice = parseFloat(data.price).toFixed(2);
        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Помилка отримання ціни Bitcoin:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Помилка завантаження';
    }
}

// Оновлення розрахунків портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;
}

// Збереження даних портфеля
function savePortfolioData() {
    const email = localStorage.getItem('email');
    const quantity = document.getElementById('btcQuantity').value;
    const purchasePrice = document.getElementById('btcPurchasePrice').value;

    const portfolio = { quantity, purchasePrice };
    localStorage.setItem(`portfolio_${email}`, JSON.stringify(portfolio));
}

// Завантаження даних портфеля
function loadPortfolioData() {
    const email = localStorage.getItem('email');
    const portfolio = JSON.parse(localStorage.getItem(`portfolio_${email}`));
    if (portfolio) {
        document.getElementById('btcQuantity').value = portfolio.quantity || '';
        document.getElementById('btcPurchasePrice').value = portfolio.purchasePrice || '';
    }
}

// Автоматичне збереження даних при зміні
document.getElementById('btcQuantity').addEventListener('input', savePortfolioData);
document.getElementById('btcPurchasePrice').addEventListener('input', savePortfolioData);

// Збереження прибутку
function saveProfit() {
    const profit = parseFloat(document.getElementById('btcProfit').textContent.replace('$', '')) || 0;
    const email = localStorage.getItem('email');
    let totalProfit = parseFloat(localStorage.getItem(`profit_${email}`)) || 0;

    totalProfit += profit;
    localStorage.setItem(`profit_${email}`, totalProfit.toFixed(2));
    alert(`Загальний прибуток збережено: $${totalProfit.toFixed(2)}`);
}

// Калькулятор Bitcoin
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const total = quantity * price;
    document.getElementById('calcResult').textContent = `Загальна вартість: $${total.toFixed(2)}`;
}

// Завантаження початкових даних
window.onload = () => {
    const email = localStorage.getItem('email');
    if (email) {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('chartSection').classList.remove('hidden');
        document.getElementById('portfolioPage').classList.remove('hidden');
        document.getElementById('calculatorPage').classList.remove('hidden');
        loadPortfolioData();
        loadChartData();
        fetchBitcoinPrice();
    }

    setInterval(loadChartData, 60000);
    setInterval(fetchBitcoinPrice, 60000);
};
