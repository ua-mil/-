/* Загальні стилі */
body {
    background-color: #121212; /* Темний фон */
    color: #ffffff; /* Білий текст */
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
}

h1, h2 {
    color: #ffd700; /* Золотий текст для заголовків */
    text-align: center;
}

header {
    margin-bottom: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

canvas {
    background-color: #1e1e1e; /* Темний фон для графіка */
    border: 1px solid #ffd700;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

/* Кнопки */
button {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button.btn-primary {
    background-color: #007bff;
    color: #fff;
}

button.btn-primary:hover {
    background-color: #0056b3;
}

button.btn-success {
    background-color: #28a745;
    color: #fff;
}

button.btn-success:hover {
    background-color: #1e7e34;
}

button.btn-danger {
    background-color: #dc3545;
    color: #fff;
}

button.btn-danger:hover {
    background-color: #c82333;
}

/* Поля введення */
input[type="number"], input[type="email"] {
    width: 100%;
    padding: 10px;
    margin: 5px 0 15px 0;
    display: block;
    border: 1px solid #ffd700;
    border-radius: 5px;
    background-color: #1e1e1e;
    color: #fff;
    font-size: 16px;
}

input[type="number"]::placeholder, input[type="email"]::placeholder {
    color: #ccc;
}

/* Текстовий вміст */
label {
    font-weight: bold;
}

p {
    margin: 5px 0;
}

/* Футер */
footer {
    margin-top: 40px;
    text-align: center;
    padding: 20px;
    background-color: #1e1e1e;
    border-top: 1px solid #ffd700;
}

/* Відступи для розділів */
section {
    margin-bottom: 40px;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

/* Адаптивність */
@media (max-width: 768px) {
    h1, h2 {
        font-size: 1.5rem;
    }

    button {
        font-size: 14px;
        padding: 8px 16px;
    }
        }
