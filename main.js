const BOARD_SIZE = 10;
const CONNECT_LENGTH = 5;
const PIECE_VISIBLE_TIME = 2000;

let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
let visiblePieces = new Set();
let currentPlayer = 1;
let gameActive = true;

function createBoard() {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] !== null) return;
    
    board[row][col] = currentPlayer;
    visiblePieces.add(`${row}-${col}`);
    updateBoard();
    
    setTimeout(() => {
        visiblePieces.delete(`${row}-${col}`);
        updateBoard();
    }, PIECE_VISIBLE_TIME);
    
    if (checkWin(row, col)) {
        document.querySelector('.status').textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] !== null) {
                    visiblePieces.add(`${r}-${c}`);
                }
            }
        }
        updateBoard();
        return;
    }
    
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.querySelector('.status').textContent = `Player ${currentPlayer}'s Turn`;
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        cell.classList.remove('piece-red', 'piece-blue');

        if (visiblePieces.has(`${row}-${col}`)) {
            if (board[row][col] === 1) {
                cell.classList.add('piece-red');
            } else if (board[row][col] === 2) {
                cell.classList.add('piece-blue');
            }
        }
    });
}

function checkWin(row, col) {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    const player = board[row][col];

    for (const [dr, dc] of directions) {
        let count = 1;
        
        for (let i = 1; i < CONNECT_LENGTH; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            if (
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
                board[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }
        
        for (let i = 1; i < CONNECT_LENGTH; i++) {
            const newRow = row - dr * i;
            const newCol = col - dc * i;
            if (
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
                board[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }

        if (count >= CONNECT_LENGTH) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    visiblePieces.clear();
    currentPlayer = 1;
    gameActive = true;
    document.querySelector('.status').textContent = "Player 1's Turn";
    updateBoard();
}

createBoard();