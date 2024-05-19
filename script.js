// script.js
const X_CLASS = 'x';
const O_CLASS = 'o';
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const span = document.getElementsByClassName('close')[0];
const xSound = document.getElementById('xSound');
const oSound = document.getElementById('oSound');
let totalGames = 0;
let playerXWins = 0;
let playerOWins = 0;
let ties = 0;
let oTurn;
let mode = 'pvp'; // Default to player vs player

document.querySelectorAll('input[name="mode"]').forEach((input) => {
    input.addEventListener('change', (e) => {
        mode = e.target.value;
    });
});

startGame();

restartButton.addEventListener('click', startGame);
settingsButton.addEventListener('click', () => settingsModal.style.display = 'block');
span.onclick = () => settingsModal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == settingsModal) {
        settingsModal.style.display = 'none';
    }
};

function startGame() {
    restartButton.classList.add('buffering');
    setTimeout(() => {
        oTurn = false;
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.classList.remove('win');
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
        restartButton.classList.remove('buffering');
    }, 500); // Add a small delay to simulate buffering
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (currentClass === X_CLASS) {
        xSound.play();
    } else {
        oSound.play();
    }
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (mode === 'pva' && oTurn) {
            aiMove();
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function checkWin(currentClass) {
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw, winner) {
    totalGames++;
    if (draw) {
        ties++;
    } else {
        if (winner === X_CLASS) {
            playerXWins++;
        } else {
            playerOWins++;
        }
        highlightWinningCells(winner);
    }
    updateLeaderboard();
    disableCells();
}

function highlightWinningCells(winner) {
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    WINNING_COMBINATIONS.forEach(combination => {
        if (combination.every(index => cellElements[index].classList.contains(winner))) {
            combination.forEach(index => {
                cellElements[index].classList.add('win');
            });
        }
    });
}

function disableCells() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function updateLeaderboard() {
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('playerXWins').textContent = playerXWins;
    document.getElementById('playerOWins').textContent = playerOWins;
    document.getElementById('ties').textContent = ties;
}

function aiMove() {
    const emptyCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(randomCell, O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false, O_CLASS);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}
