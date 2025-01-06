// URL для отримання ціни Bitcoin
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';

let btcChart;

// Затримка для зменшення кількості викликів (debounce)
let debounceTimer;
function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

// Завантаження даних портфеля
function loadPortfolioData() {
    const portfolio = JSON.parse(localStorage.getItem('portfolio')) || {};
    document.getElementById('btcQuantity').value = portfolio.quantity || '';
    document.getElementById('btcPurchasePrice').value = portfolio.purchasePrice || '';
    document.getElementById('btcProfit').textContent = `$${(portfolio.profit || 0).toFixed(2)}`;
}

// Збереження даних портфеля
function savePortfolioData(quantity, purchasePrice, profit) {
    const portfolioData = {
        quantity,
        purchasePrice,
        profit,
    };
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
}

// Оновлення розрахунків портфеля
function updatePortfolioCalculations(currentPrice) {
    const quantity = parseFloat(document.getElementById('btcQuantity').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('btcPurchasePrice').value) || 0;

    const totalValue = quantity * currentPrice;
    const profit = totalValue - quantity * purchasePrice;

    document.getElementById('btcTotal').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('btcProfit').textContent = `$${profit.toFixed(2)}`;

    // Оновлюємо клас для позитивного чи негативного прибутку
    const profitElement = document.getElementById('btcProfit');
    profitElement.classList.toggle('negative', profit < 0);

    savePortfolioData(quantity, purchasePrice, profit);
}

// Оновлення ціни Bitcoin
async function fetchBitcoinPrice() {
    try {
        const response = await fetch(BINANCE_API_URL);

        if (!response.ok) {
            throw new Error(`Помилка API Binance: ${response.statusText}`);
        }

        const data = await response.json();
        const btcPrice = parseFloat(data.price).toFixed(2);

        document.getElementById('btcCurrentPrice').textContent = `$${btcPrice}`;
        updatePortfolioCalculations(btcPrice);
    } catch (error) {
        console.error('Помилка отримання ціни Bitcoin:', error);
        document.getElementById('btcCurrentPrice').textContent = 'Помилка завантаження';
    }
}

// Побудова графіка
async function loadChartData() {
    try {
        const response = await fetch(CHART_API_URL);

        if (!response.ok) {
            throw new Error(`Помилка API Binance: ${response.statusText}`);
        }

        const data = await response.json();
        const labels = data.map(item => {
            const date = new Date(item[0]);
            return `${date.getHours()}:00`;
        });
        const prices = data.map(item => parseFloat(item[4]));

        if (btcChart) {
            btcChart.destroy();
        }

        btcChart = new Chart(document.getElementById('btcChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ціна BTC (USD)',
                    data: prices,
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    tension: 0.4,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#000',
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#000' },
                    },
                    y: {
                        ticks: { color: '#000' },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Помилка завантаження графіка:', error);
    }
}

// Обробка введення даних із debounce
document.getElementById('btcQuantity').addEventListener('input', () => {
    debounce(() => {
        const currentPrice = parseFloat(document.getElementById('btcCurrentPrice').textContent.replace('$', '')) || 0;
        updatePortfolioCalculations(currentPrice);
    }, 300);
});

document.getElementById('btcPurchasePrice').addEventListener('input', () => {
    debounce(() => {
        const currentPrice = parseFloat(document.getElementById('btcCurrentPrice').textContent.replace('$', '')) || 0;
        updatePortfolioCalculations(currentPrice);
    }, 300);
});

// Очищення даних
function clearPortfolioData() {
    localStorage.removeItem('portfolio');
    document.getElementById('btcQuantity').value = '';
    document.getElementById('btcPurchasePrice').value = '';
    document.getElementById('btcProfit').textContent = '$0.00';
    document.getElementById('btcTotal').textContent = '$0.00';
}

// Завантаження даних при старті
window.onload = () => {
    loadPortfolioData();
    fetchBitcoinPrice();
    loadChartData();

    setInterval(fetchBitcoinPrice, 60000);
    setInterval(loadChartData, 60000);
};
