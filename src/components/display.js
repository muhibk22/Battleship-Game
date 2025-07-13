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
    const size = gameboard.size;
    const grid = gameboard.blocks;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (typeof grid[x][y] === "string") {
                const cell = boardContainer.querySelector(`.block[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.style.backgroundColor = "yellow";
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

            if (receiver.gameboard.blocks[x][y] === 1) {
                block.style.backgroundColor = "red";
            }
            else {
                block.style.backgroundColor = "lightgray";
            }
            block.style.pointerEvents = "none";
            if (receiver.gameboard.allSunk()) {
                alert("You Won! All Enemy Ships Have Been Sunk");
                boardContainer.style.pointerEvents = "none";
            }
            else {
                if (success) {
                    computerMoveUI(receiver, attacker);
                }
                else {
                    alert("Move not registered.");
                }
            }

        });
    });
}

function computerMoveUI(attacker, receiver) {
    const boardContainer = document.querySelector(".player-board");
    if (attacker.makeMove(receiver.gameboard)) {
        for (let x = 0; x < receiver.gameboard.size; x++) {
            for (let y = 0; y < receiver.gameboard.size; y++) {
                const cellValue = receiver.gameboard.blocks[x][y];
                const block = boardContainer.querySelector(`.block[data-x="${x}"][data-y="${y}"]`);
                if ((cellValue === 1 || cellValue === 2) && !block.querySelector(".visited")) {
                    const visited = document.createElement("div");
                    visited.classList.add("visited");
                    block.appendChild(visited);
                    block.style.backgroundColor = "lightgray";
                    if (cellValue === 1) {
                        block.style.backgroundColor = "red";
                    }
                }
            }
        }
        if (receiver.gameboard.allSunk()) {
            alert("You Have Lost. The Enemy Has Sunked All Your Ships!");
            const computer = document.querySelector(".computer-board");
            computer.style.pointerEvents = "none";
        }
    }
}

export function enableDragAndDrop(player) {
    let draggedShip = null;
    let draggedShipLength = 0;
    let draggedShipType = "";
    let axis = "x";
    const startButton = document.getElementById("play");
    startButton.addEventListener("click", () => {
        startGame(player);
    });
    startButton.style.backgroundColor="blue";
    startButton.disabled = true;
    let placeCount = 3;

    document.querySelectorAll(".ship").forEach(ship => {
        ship.addEventListener("dragstart", () => {
            draggedShip = ship;
            draggedShipType = ship.dataset.ship;
            draggedShipLength = parseInt(ship.dataset.length);
            ship.classList.add("dragging");
        });

        ship.addEventListener("dragend", () => {
            draggedShip = null;
            draggedShipType = "";
            draggedShipLength = 0;
            ship.classList.remove("dragging");
        });
    });

    document.getElementById("axis").addEventListener("click", () => {
        axis = axis === "x" ? "y" : "x";
        if (draggedShipType) {
            player.gameboard[draggedShipType].axis = axis;
        }
    });

    const startBoard = document.querySelector(".start-board");
    startBoard.querySelectorAll(".block").forEach(block => {
        block.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        block.addEventListener("drop", () => {
            const x = parseInt(block.dataset.x);
            const y = parseInt(block.dataset.y);

            player.gameboard[draggedShipType].axis = axis;

            const placed = player.gameboard.placeShip(player.gameboard[draggedShipType], x, y);
            if (placed) {
                placeCount++;
                console.log(placeCount);
                for (let i = 0; i < draggedShipLength; i++) {
                    let selector = "";
                    if (axis === "x") {
                        selector = `.block[data-x="${x + i}"][data-y="${y}"]`;
                    } else {
                        selector = `.block[data-x="${x}"][data-y="${y + i}"]`;
                    }
                    const cell = startBoard.querySelector(selector);
                    if (cell) {
                        cell.style.backgroundColor = "yellow";
                    }
                }
                draggedShip.remove();
                if (placeCount >= 2) {
                    startButton.disabled = false;
                    startButton.style.backgroundColor = "pink";
                }
            }

            else {
                alert("Invalid placement");
            }
        });
    });

    const randomButton = document.getElementById("random");
    randomButton.addEventListener("click", () => {
        placeRandomUI(player);
        startButton.disabled=false;
    });

    const resetShipButton = document.getElementById("reset");
    resetShipButton.addEventListener("click", () => {
        startButton.disabled=true;
        placeCount=0;
        resetShipUI(player);
    });
}

function resetShipUI(player) {
    player.gameboard = new Gameboard();
    const shipContainer = document.querySelector(".ships");
    shipContainer.innerHTML = "";
    const ships = [
        { display: "Carrier", name: "carrier", length: 5 },
        { display: "Battleship", name: "battleship", length: 4 },
        { display: "Destroyer", name: "destroyer", length: 3 },
        { display: "Submarine", name: "submarine", length: 3 },
        { display: "Boat", name: "boat1", length: 2 },
        { display: "Boat", name: "boat2", length: 2 }
    ];
    ships.forEach(({ display, name, length }) => {
        const shipEl = document.createElement("div");
        shipEl.classList.add("ship");
        shipEl.setAttribute("data-ship", name);
        shipEl.setAttribute("data-length", length);
        shipEl.textContent = display;
        shipContainer.appendChild(shipEl);
    });

    const blocks = document.querySelectorAll(".start-board .block");
    blocks.forEach(block => {
        block.style.backgroundColor = "";
        const visited = block.querySelector(".visited");
        if (visited) visited.remove();
    });

    enableDragAndDrop(player);
    enableTouchPlaceShips(player);
}
function placeRandomUI(player) {
    const board = document.querySelector(".start-board");
    const blocks = board.querySelectorAll(".block");

    blocks.forEach(block => {
        block.style.backgroundColor = "";
        const visited = block.querySelector(".visited");
        if (visited) visited.remove();
    });

    player.gameboard = new Gameboard();
    player.gameboard.placeRandomly();

    const size = player.gameboard.size;
    const grid = player.gameboard.blocks;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (typeof grid[x][y] === "string") {
                const cell = board.querySelector(`.block[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.style.backgroundColor = "yellow";
                }
            }
        }
    }
    document.querySelectorAll(".ship").forEach(ship => {
        ship.remove();
    });
}
export function enableTouchPlaceShips(player) {
    let selectedShip = null;
    let selectedShipType = "";
    let selectedShipLength = 0;
    let axis = "x";

    const ships = document.querySelectorAll(".ship");
    const board = document.querySelector(".start-board");

    ships.forEach(ship => {
        ship.addEventListener("click", () => {
            selectedShip = ship;
            selectedShipType = ship.dataset.ship;
            selectedShipLength = parseInt(ship.dataset.length);
            player.gameboard[selectedShipType].axis = axis;

            ships.forEach(s => s.classList.remove("selected"));
            ship.classList.add("selected");
        });
    });

    board.querySelectorAll(".block").forEach(block => {
        block.addEventListener("click", () => {
            if (!selectedShip) return;

            const x = parseInt(block.dataset.x);
            const y = parseInt(block.dataset.y);

            const placed = player.gameboard.placeShip(
                player.gameboard[selectedShipType],
                x, y
            );

            if (placed) {
                for (let i = 0; i < selectedShipLength; i++) {
                    let selector = "";
                    if (axis === "x") {
                        selector = `.block[data-x="${x + i}"][data-y="${y}"]`;
                    } else {
                        selector = `.block[data-x="${x}"][data-y="${y + i}"]`;
                    }
                    const cell = board.querySelector(selector);
                    if (cell) cell.style.backgroundColor = "yellow";
                }

                selectedShip.remove();
                selectedShip = null;
                selectedShipType = "";
                selectedShipLength = 0;
            } else {
                alert("Invalid placement");
            }
        });
    });

    document.getElementById("axis").addEventListener("click", () => {
        axis = axis === "x" ? "y" : "x";
        if (selectedShipType) {
            player.gameboard[selectedShipType].axis = axis;
        }
    });
}

export function startGame(player) {
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".container").style.display = "flex";
    const playerBoard = document.querySelector(".player-board");
    setShipUI(player.gameboard, playerBoard);


}