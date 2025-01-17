const apiURL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
let trades = JSON.parse(localStorage.getItem('trades')) || [];

// Завантажити графік
async function loadChart() {
    const chartData = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        price: Math.random() * (35000 - 30000) + 30000, // Mock data
    }));

    const ctx = document.getElementById('btcChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => d.time),
            datasets: [
                {
                    label: 'Ціна BTC (USD)',
                    data: chartData.map(d => d.price),
                    borderColor: '#ffd700',
                },
            ],
        },
    });
}

// Додати угоду
function addTrade() {
    const quantity = parseFloat(document.getElementById('btcQuantity').value);
    const price = parseFloat(document.getElementById('btcPrice').value);

    if (quantity && price) {
        trades.push({
            date: new Date().toLocaleString(),
            quantity,
            price,
            type: 'Buy',
        });

        saveTrades();
        renderTrades();
    }
}

// Зберегти угоди в localStorage
function saveTrades() {
    localStorage.setItem('trades', JSON.stringify(trades));
}

// Відобразити угоди
function renderTrades() {
    const tableBody = document.querySelector('#tradesTable tbody');
    tableBody.innerHTML = trades
        .map(
            trade => `
        <tr>
            <td>${trade.date}</td>
            <td>${trade.quantity.toFixed(4)}</td>
            <td>${trade.price.toFixed(2)}</td>
            <td>${trade.type}</td>
        </tr>
    `
        )
        .join('');

    updateTotalProfit();
}

// Розрахувати загальний прибуток
async function updateTotalProfit() {
    const response = await fetch(apiURL);
    const data = await response.json();
    const currentPrice = parseFloat(data.price);

    let totalProfit = 0;
    trades.forEach(trade => {
        totalProfit += (currentPrice - trade.price) * trade.quantity;
    });

    document.getElementById('btcTotalProfit').textContent = `${totalProfit.toFixed(2)} USD`;
    document.getElementById('btcCurrentPrice').textContent = `${currentPrice.toFixed(2)} USD`;
}

// Очистити дані
function clearData() {
    if (confirm('Ви впевнені, що хочете очистити всі дані?')) {
        trades = [];
        saveTrades();
        renderTrades();
        updateTotalProfit();
    }
}

// Завантаження при старті
document.addEventListener('DOMContentLoaded', () => {
    renderTrades();
    loadChart();

    document.getElementById('addTradeBtn').addEventListener('click', addTrade);
    document.getElementById('updateDataBtn').addEventListener('click', updateTotalProfit);
    document.getElementById('clearDataBtn').addEventListener('click', clearData);
});
