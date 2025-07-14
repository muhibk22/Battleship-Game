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

export function enableShipPlacement(player) {
    let selectedShip = null;
    let selectedShipType = "";
    let selectedShipLength = 0;
    let axis = "x";
    let placeCount = 0;
    const ships = document.querySelectorAll(".ship");
    const startBoard = document.querySelector(".start-board");
    const startButton = document.getElementById("play");
    const resetShipButton = document.getElementById("reset");
    const randomButton = document.getElementById("random");
    const axisButton = document.getElementById("axis");
    const blocks = startBoard.querySelectorAll(".block");

    startButton.disabled = true;
    startButton.style.backgroundColor = "gray";


    ships.forEach(ship => {
        ship.addEventListener("click", () => selectShip(ship));
        ship.addEventListener("dragstart", () => selectShip(ship));
        ship.addEventListener("dragend", clearSelection);
    });

    function selectShip(ship) {
        selectedShip = ship;
        selectedShipType = ship.dataset.ship;
        selectedShipLength = parseInt(ship.dataset.length);
        player.gameboard[selectedShipType].axis = axis;

        ships.forEach(s => s.classList.remove("selected", "dragging"));
        ship.classList.add("selected", "dragging");
    }

    function clearSelection() {
        selectedShip = null;
        selectedShipType = "";
        selectedShipLength = 0;
        ships.forEach(s => s.classList.remove("selected", "dragging"));
    }

    //set axis
    axisButton.addEventListener("click", () => {
        axis = axis === "x" ? "y" : "x";
        if (selectedShipType) {
            player.gameboard[selectedShipType].axis = axis;
        }
    });

    blocks.forEach(block => {
        block.addEventListener("mouseenter", () => { handleHover(blocks, block) });
        block.addEventListener("mouseleave", () => { handleHoverLeave(blocks, block) });
        //for touch
        block.addEventListener("click", () => handlePlacement(block));

        // for drag n drop
        block.addEventListener("dragover", (e) => e.preventDefault());
        block.addEventListener("drop", () => handlePlacement(block));
    });

    function handleHover(blocks, block) {
        const x = parseInt(block.dataset.x);
        const y = parseInt(block.dataset.y);
        if (selectedShip !== null) {
            if (axis === "x") {
                blocks.forEach(blockk => {
                    const dx = parseInt(blockk.dataset.x);
                    const dy = parseInt(blockk.dataset.y);
                    if ((dx < x + selectedShipLength && dx >= x) && dy === y && blockk.dataset.occupied !== "true") {
                        blockk.style.backgroundColor = "pink";
                    }
                });
            }
            else {
                blocks.forEach(blockk => {
                    const dx = parseInt(blockk.dataset.x);
                    const dy = parseInt(blockk.dataset.y);
                    if ((dy < y + selectedShipLength && dy >= y) && dx === x && blockk.dataset.occupied !== "true") {
                        blockk.style.backgroundColor = "pink";
                    }
                });
            }
        }
    }

    function handleHoverLeave(blocks, block) {
        const x = parseInt(block.dataset.x);
        const y = parseInt(block.dataset.y);
        if (selectedShip !== null) {
            if (axis === "x") {
                blocks.forEach(blockk => {
                    const dx = parseInt(blockk.dataset.x);
                    const dy = parseInt(blockk.dataset.y);
                    if ((dx < x + selectedShipLength && dx >= x) && dy === y && blockk.dataset.occupied !== "true") {
                        blockk.style.backgroundColor = "rgb(149, 229, 225)";
                    }
                });
            }
            else {
                blocks.forEach(blockk => {
                    const dx = parseInt(blockk.dataset.x);
                    const dy = parseInt(blockk.dataset.y);
                    if ((dy < y + selectedShipLength && dy >= y) && dx === x && blockk.dataset.occupied !== "true") {
                        blockk.style.backgroundColor = "rgb(149, 229, 225)";
                    }
                });
            }
        }
    }
    function handlePlacement(block) {
        if (!selectedShip) {
            return;
        }

        const x = parseInt(block.dataset.x);
        const y = parseInt(block.dataset.y);

        player.gameboard[selectedShipType].axis = axis;

        const placed = player.gameboard.placeShip(player.gameboard[selectedShipType], x, y);

        if (placed) {
            selectedShip.remove();
            selectedShip = null;
            highlightBlocks(x, y);
            blocks.forEach(blockk => {
                const dx = parseInt(blockk.dataset.x);
                const dy = parseInt(blockk.dataset.y);
                console.log(selectedShipLength);
                if (axis === "x") {
                    if (dx >= x && dx < x + selectedShipLength && dy === y) {
                        blockk.dataset.occupied = "true";
                    }
                }
                else {
                    if (dy >= y && dy < y + selectedShipLength && dx === x) {
                        blockk.dataset.occupied = "true";
                    }
                }
            });

            clearSelection();
            placeCount++;
            if (placeCount >= 6) {
                startButton.disabled = false;
                startButton.style.backgroundColor = "black";
            }
        }
        else {
            alert("Invalid placement");
            return;
        }
    }

    function highlightBlocks(x, y) {
        for (let i = 0; i < selectedShipLength; i++) {
            let selector = "";
            if (axis === "x") {
                selector = `.block[data-x="${x + i}"][data-y="${y}"]`;
            }
            else {
                selector = `.block[data-x="${x}"][data-y="${y + i}"]`;
            }
            const cell = startBoard.querySelector(selector);
            if (cell) {
                cell.style.backgroundColor = "yellow";
            }
        }
    }

    startButton.addEventListener("click", () => {
        startGame(player);
    });

    //reset
    resetShipButton.addEventListener("click", () => {
        clearSelection();
        resetShipUI(player);
        placeCount = 0;
        startButton.disabled = true;
        startButton.style.backgroundColor = "gray";
    });

    // random placement
    randomButton.addEventListener("click", () => {
        placeRandomUI(player);
        startButton.disabled = false;
        startButton.style.backgroundColor = "black";
        selectedShip = null;
    });
}


function resetShipUI(player) {
    player = new Player();
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
        block.classList.remove("visited")
        block.dataset.occupied = "false";
    });
    
    const startBoard = document.querySelector(".start-board");
    startBoard.innerHTML = "";
    generateBoards();
    enableShipPlacement(player);
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
                    cell.dataset.occupied = "true";
                }
            }
        }
    }
    document.querySelectorAll(".ship").forEach(ship => {
        ship.remove();
    });
}

export function startGame(player) {
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".container").style.display = "flex";
    const playerBoard = document.querySelector(".player-board");
    setShipUI(player.gameboard, playerBoard);


}