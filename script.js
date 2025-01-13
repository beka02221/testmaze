
// Telegram WebApp инициализация
const tg = window.Telegram.WebApp;
tg.ready();

// Получаем данные пользователя
const user = tg.initDataUnsafe?.user || { username: 'Guest', first_name: 'Гость' };

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyAKw7TvjMqrNAgCP4lMjVFxaCWGfUSSXvI",
    authDomain: "glitch-wallet-test.firebaseapp.com",
    databaseURL: "https://glitch-wallet-test-default-rtdb.firebaseio.com",
    projectId: "glitch-wallet-test",
    storageBucket: "glitch-wallet-test.appspot.com",
    messagingSenderId: "153863222027",
    appId: "1:153863222027:web:bca641b7c3bd890a21a80e",
    measurementId: "G-V6F0LRQRG5"
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Автоматическое сохранение пользователя
const userRef = db.ref('players/' + user.username);
userRef.once('value')
    .then(snapshot => {
        if (!snapshot.exists()) {
            userRef.set({
                username: user.username,
                score: 0,
                timestamp: new Date().toISOString()
            });
        }
    })
    .catch(error => console.error('Ошибка сохранения пользователя:', error));

// Установка приветственного сообщения
document.getElementById('user-info').textContent = `Привет, ${user.first_name} (@${user.username})! Добро пожаловать в игру.`;

let score = 0;

// Функция обновления счёта
function updateScore() {
    score += 1;
    document.getElementById('score-display').textContent = `Счёт: ${score}`;
}

// Функция сохранения прогресса
function saveProgress() {
    const progress = {
        username: user.username,
        score: score,
        timestamp: new Date().toISOString()
    };

    userRef.set(progress)
        .then(() => alert('Прогресс сохранён!'))
        .catch((error) => alert('Ошибка сохранения: ' + error.message));
}

// Функция загрузки прогресса
function loadProgress() {
    userRef.get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                score = data.score;
                document.getElementById('score-display').textContent = `Счёт: ${score}`;
                alert(`Прогресс загружен!\nСчёт: ${data.score}\nПоследнее сохранение: ${data.timestamp}`);
            } else {
                alert('Прогресс не найден.');
            }
        })
        .catch((error) => alert('Ошибка загрузки: ' + error.message));
}

// Показываем кнопки и мини-игру
document.getElementById('clicker-btn').style.display = 'block';
document.getElementById('score-display').style.display = 'block';
document.getElementById('save-progress-btn').style.display = 'block';
document.getElementById('load-progress-btn').style.display = 'block';

document.getElementById('clicker-btn').addEventListener('click', updateScore);
document.getElementById('save-progress-btn').addEventListener('click', saveProgress);
document.getElementById('load-progress-btn').addEventListener('click', loadProgress);
