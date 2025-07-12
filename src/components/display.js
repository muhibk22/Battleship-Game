import Player from "./player";
import Gameboard from "./gameboard";


export function generateBoards() {
    const boards = document.querySelectorAll(".board");
    boards.forEach(board => {
        board.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < 10; j++) {
                const block = document.createElement("div");
                block.classList.add("block");
                block.setAttribute("data-x", i);
                block.setAttribute("data-y", j);
                row.appendChild(block);
            }
            board.appendChild(row);
        }
    });
}


export function setShipUI(gameboard, boardContainer) {
    for (let x = 0; x < gameboard.size; x++) {
        for (let y = 0; y < gameboard.size; y++) {
            const cellValue = gameboard.blocks[x][y];

            const isShip = typeof cellValue === "string" && ["carrier", "battleship", "destroyer", "submarine", "boat1", "boat2"].includes(cellValue);

            if (isShip) {
                const block = boardContainer.querySelector(`.block[data-x="${x}"][data-y="${y}"]`);
                if (block) {
                    block.classList.add("placed");
                }
            }
        }
    }
}

export function makeMoveUI(attacker, receiver, boardContainer) {
    const blocks = boardContainer.querySelectorAll(".block");

    blocks.forEach(block => {
        block.addEventListener("click", (e) => {
            const x = parseInt(block.dataset.x);
            const y = parseInt(block.dataset.y);

            if (block.classList.contains("visited")) return;
            const success = attacker.makeMove(receiver.gameboard, x, y);

            const visited = document.createElement("div");
            visited.classList.add("visited");
            block.appendChild(visited);

            if (success && receiver.gameboard.blocks[x][y] === 1) {
                block.style.backgroundColor = "red";
            }
            else {
                block.style.backgroundColor = "lightgray";
            }
            block.style.pointerEvents = "none";
        });
    });
}


