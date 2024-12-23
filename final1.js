const boardElement = document.getElementById('board');
const confettiContainer = document.getElementById('confettiContainer');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const winnerMessage = document.getElementById('winnerMessage');
const resetButton = document.getElementById('resetButton');
const resetScoreButton = document.getElementById('resetScoreButton');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');
const playerVsComputerButton = document.getElementById('playerVsComputer');
const timerElement = document.getElementById('timer');
let board = Array(9).fill(null);
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let gameMode = '';
let timer = 15;
let gameInterval;

function createBoard() {
    boardElement.innerHTML = '';
    board.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index;
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] !== null || winnerMessage.textContent !== '') return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('taken');

    if (checkWinner()) {
        scores[currentPlayer]++;
        updateScoreboard();
        showWinnerMessage(`${currentPlayer} победил! 🎉`);
        createConfetti();
        clearInterval(gameInterval);
        return;
    }

    if (board.every(cell => cell !== null)) {
        showWinnerMessage('Ничья! 🤝');
        clearInterval(gameInterval);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'playerVsComputer' && currentPlayer === 'O') {
        setTimeout(computerMove, 500); // Даем время для обновления состояния
    }

    resetTimer();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] !== null && board[a] === board[b] && board[a] === board[c];
    });
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    winnerMessage.textContent = '';
    confettiContainer.style.display = 'none';
    createBoard();
    resetTimer();
}

function resetTimer() {
    clearInterval(gameInterval);
    timer = 15;
    timerElement.textContent = timer;
    gameInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            showWinnerMessage(`${currentPlayer} пропустил ход!`);
            scores[currentPlayer === 'X' ? 'O' : 'X']++;
            updateScoreboard();
            clearInterval(gameInterval);
        }
    }, 1000);
}

function createConfetti() {
    confettiContainer.innerHTML = '';
    confettiContainer.style.display = 'block';

    for (let i = 0; i < 300; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDuration = `${Math.random() * 2 + 1}s`;
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 85%)`;
        confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
        confettiContainer.style.display = 'none';
    }, 5000);
}

function showWinnerMessage(message) {
    winnerMessage.textContent = message;
}

function resetScore() {
    scores = { X: 0, O: 0 };
    updateScoreboard();
}

function computerMove() {
    const availableCells = board
        .map((value, index) => value === null ? index : -1)
        .filter(index => index !== -1);

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = 'O';
    const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
    cell.textContent = 'O';
    cell.classList.add('taken');

    if (checkWinner()) {
        scores['O']++;
        updateScoreboard();
        showWinnerMessage('Компьютер победил! 🎉');
        createConfetti();
        clearInterval(gameInterval);
        return;
    }

    if (board.every(cell => cell !== null)) {
        showWinnerMessage('Ничья! 🤝');
        clearInterval(gameInterval);
        return;
    }

    currentPlayer = 'X';
    resetTimer();
}

playerVsPlayerButton.addEventListener('click', () => {
    gameMode = 'playerVsPlayer';
    resetGame();
    winnerMessage.textContent = '';
});

playerVsComputerButton.addEventListener('click', () => {
    gameMode = 'playerVsComputer';
    resetGame();
    winnerMessage.textContent = '';
});

resetButton.addEventListener('click', resetGame);
resetScoreButton.addEventListener('click', resetScore);

createBoard();
resetTimer();
