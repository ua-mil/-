const CHART_API_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24';
const ctx = document.getElementById('btcChart').getContext('2d');
let btcChart;

// Функция для загрузки данных и построения графика
async function loadChartData() {
    try {
        const response = await fetch(CHART_API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка API Binance: ${response.statusText}`);
        }

        const data = await response.json();

        // Преобразование данных
        const labels = data.map(item => {
            const date = new Date(item[0]);
            return `${date.getHours()}:00`; // Время
        });

        const prices = data.map(item => parseFloat(item[4])); // Цена закрытия

        // Удаляем предыдущий график, если он существует
        if (btcChart) {
            btcChart.destroy();
        }

        // Создаем новый график
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
                    legend: {
                        labels: {
                            color: '#000',
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#000',
                        },
                    },
                    y: {
                        ticks: {
                            color: '#000',
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Ошибка загрузки данных для графика:', error);
    }
}

// Функция для получения текущей цены Bitcoin
async function fetchBitcoinPrice() {
    const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
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

// Сохраняем профиль пользователя в localStorage
function saveProfile() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
    } else {
        alert('Введите имя пользователя.');
    }
}

// Загружаем данные профиля при загрузке страницы
function loadProfile() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').value = username;
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${username}!`;
    }
}

// Калькулятор Bitcoin
function calculateBTC() {
    const quantity = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const price = parseFloat(document.getElementById('calcPrice').value) || 0;
    const total = quantity * price;

    document.getElementById('calcResult').textContent = `Общая стоимость: $${total.toFixed(2)}`;
}

// Загружаем профиль и данные графика при старте
window.onload = () => {
    loadProfile();
    fetchBitcoinPrice();
    loadChartData();

    // Автообновление данных каждые 60 секунд
    setInterval(loadChartData, 60000);
    setInterval(fetchBitcoinPrice, 60000);
};
