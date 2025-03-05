const Gameboard = (() => {
    let gameboard = ["","","","","","","","",""];

    const displayBoard = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class='square' id='square-${index}'>${square}</div>`;
        })
        document.querySelector(".gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick)
        });
    }

    const updateBoard = (index, symbol) => {
        gameboard[index] = symbol;
        displayBoard();
    }

    const getBoard = () => gameboard

    return {
        displayBoard,
        updateBoard,
        getBoard,
    }
})();

const createPlayer = (name, symbol) => {
    return {
        name,
        symbol,
    };
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O"),
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.displayBoard();
        
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick)
        });
    }

    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1]);

        if (gameOver) {
            return;
        }

        if (Gameboard.getBoard()[index] !== "")
            return;

        Gameboard.updateBoard(index, players[currentPlayerIndex].symbol);

        if (checkForWin(Gameboard.getBoard(), players[currentPlayerIndex].symbol)) {
            gameOver = true;
            displayMessage.showMessage(`${players[currentPlayerIndex].name} wins!`);
        } else if (checkForTie(Gameboard.getBoard())) {
            gameOver = true;
            displayMessage.showMessage("It's a tie");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.updateBoard(i, "");
        }
        Gameboard.displayBoard();
        gameOver = false;
        document.querySelector(".message").innerHTML = "";
    }

    return {
        start,
        handleClick,
        restart,
    }
})();

function checkForWin(board) {
    const winningCombination = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
        [0, 4, 8], [2, 4, 6] //Diagonals
    ]
    for (let i = 0; i < winningCombination.length; i++) {
        const [a, b, c] = winningCombination[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const displayMessage = (() => {
    const showMessage = (message) => {
        document.querySelector(".message").innerHTML = message;
    }

    return {
        showMessage,
    }
})();

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", () => {
    Game.restart();
});

const startButton = document.querySelector(".start");
startButton.addEventListener("click", () => {
    Game.start();
});