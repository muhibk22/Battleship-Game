import Player from "./player";
import Gameboard from "./gameboard";

import carrier1 from '../assets/carrier/carrier1.png';
import carrier2 from '../assets/carrier/carrier2.png';
import carrier3 from '../assets/carrier/carrier3.png';
import carrier4 from '../assets/carrier/carrier4.png';
import carrier5 from '../assets/carrier/carrier5.png';
import battleship1 from '../assets/battleship/battleship1.png';
import battleship2 from '../assets/battleship/battleship2.png';
import battleship3 from '../assets/battleship/battleship3.png';
import battleship4 from '../assets/battleship/battleship4.png';
import destroyer1 from '../assets/destroyer/destroyer1.png';
import destroyer2 from '../assets/destroyer/destroyer2.png';
import destroyer3 from '../assets/destroyer/destroyer3.png';
import submarine1 from '../assets/submarine/submarine1.png';
import submarine2 from '../assets/submarine/submarine2.png';
import submarine3 from '../assets/submarine/submarine3.png';
import boat1 from '../assets/boat/boat1.png';
import boat2 from '../assets/boat/boat2.png';

const shipImages = [[carrier1, carrier2, carrier3, carrier4, carrier5], [battleship1, battleship2, battleship3, battleship4],
[destroyer1, destroyer2, destroyer3], [submarine1, submarine2, submarine3], [boat1, boat2], [boat1, boat2]];


export default class GameUI {
    constructor() {
        this.player = new Player();
        this.computer = new Player("computer");
        this.container = document.querySelector(".container");
        this.startScreen = document.querySelector(".start-screen");
        this.card = document.querySelector(".card");
        this.playArea = document.querySelector(".play-area");
        this.playerBoard = document.querySelector(".player-board");
        this.computerBoard = document.querySelector(".computer-board");
        this.win = undefined;

        this.init();
    }

    init() {
        this.generateBoards();
        this.createButtons();
        this.enableShipPlacement(this.player);
        this.playAgain();
        this.computer.gameboard.placeRandomly();
        this.win = undefined;
    }

    generateBoards() {
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

    setShipUI(gameboard, boardContainer) {
        const ships = [gameboard.carrier, gameboard.battleship, gameboard.destroyer, gameboard.submarine, gameboard.boat1, gameboard.boat2];
        let img = 0;
        for (const ship of ships) {
            const length = ship.length;
            const axis = ship.axis;

            for (let i = 0; i < length; i++) {
                if (axis === "x") {
                    const cell = boardContainer.querySelector(`.block[data-x="${ship.x + i}"][data-y="${ship.y}"]`);
                    if (cell) {
                        cell.style.backgroundImage = `url(${shipImages[img][i]})`;
                        cell.style.transform = 'rotate(90deg)';
                        cell.style.transformOrigin = 'center';
                        cell.style.backgroundSize = 'cover';
                        cell.style.backgroundPosition = 'center';
                        cell.dataset.occupied = "true";
                    }
                }
                else if (axis === "y") {
                    const cell = boardContainer.querySelector(`.block[data-x="${ship.x}"][data-y="${ship.y + i}"]`);
                    if (cell) {
                        cell.style.backgroundImage = `url(${shipImages[img][i]})`;
                        cell.style.transformOrigin = 'center';
                        cell.style.backgroundSize = 'cover';
                        cell.style.backgroundPosition = 'center';
                        cell.dataset.occupied = "true";

                    }
                }
            }
            img++;
        }
    }

    makeMoveUI(attacker, receiver, boardContainer) {
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
                    this.win = true;
                    this.displayWinStatus();
                }

                else {
                    if (success) {
                        this.computerMoveUI();
                    }
                    else {
                        alert("Move not registered.");
                    }
                }

            });
        });
    }
    displayWinStatus() {
        this.playArea.classList.add("blurred");
        this.card.style.display = "block";
        let msg = "";
        if (this.win) {
            msg = "<h3>You Win! All Enemy Ships Have Been Sunk.</h3>"
        }
        else {
            msg = "<h3>You Lose! The Enemy Has Sunk All Your Ships</h3>"
        }
        const msgEl = document.querySelector(".message");
        msgEl.innerHTML = msg;
    }

    playAgain() {
        const playAgain = document.getElementById("play-again");
        playAgain.addEventListener("click", () => {
            this.container.style.display = "none";
            this.card.style.display = "none";
            this.playArea.classList.remove("blurred");
            this.startScreen.style.display = "flex";
            this.player = new Player();
            this.computer = new Player("computer");
            this.init();
            this.resetShipUI();
        });
    }

    computerMoveUI() {
        const boardContainer = document.querySelector(".player-board");
        const size = this.player.gameboard.size;
        if (this.computer.makeMove(this.player.gameboard)) {
            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    const cellValue = this.player.gameboard.blocks[x][y];
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
            if (this.player.gameboard.allSunk()) {
                this.win = false;
                this.displayWinStatus();
            }
        }
    }

    enableShipPlacement(player) {
        let selectedShip = null;
        let selectedShipType = "";
        let selectedShipLength = 0;
        let selectedShipIndex = null;
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
            selectedShipIndex = ship.dataset.index;
            selectedShipLength = parseInt(ship.dataset.length);
            player.gameboard[selectedShipType].axis = axis;

            ships.forEach(s => s.classList.remove("selected", "dragging"));
            ship.classList.add("selected", "dragging");
        }

        function clearSelection() {
            selectedShip = null;
            selectedShipType = "";
            selectedShipLength = 0;
            selectedShipIndex = null;
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
                            blockk.style.backgroundColor = "grey";
                        }
                    });
                }
                else {
                    blocks.forEach(blockk => {
                        const dx = parseInt(blockk.dataset.x);
                        const dy = parseInt(blockk.dataset.y);
                        if ((dy < y + selectedShipLength && dy >= y) && dx === x && blockk.dataset.occupied !== "true") {
                            blockk.style.backgroundColor = "grey";
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
                const boardContainer = document.querySelector(".start-board");
                if (axis === "x") {
                    const cell = boardContainer.querySelector(`.block[data-x="${x + i}"][data-y="${y}"]`);
                    if (cell) {
                        cell.style.backgroundImage = `url(${shipImages[selectedShipIndex][i]})`;
                        cell.style.transform = 'rotate(90deg)';
                        cell.style.transformOrigin = 'center';
                        cell.style.backgroundSize = 'cover';
                        cell.style.backgroundPosition = 'center';
                    }
                }
                else if (axis === "y") {
                    const cell = boardContainer.querySelector(`.block[data-x="${x}"][data-y="${y + i}"]`);
                    if (cell) {
                        cell.style.backgroundImage = `url(${shipImages[selectShipIndex][i]})`;
                        cell.style.transformOrigin = 'center';
                        cell.style.backgroundSize = 'cover';
                        cell.style.backgroundPosition = 'center';

                    }
                }
            }
        }

        startButton.addEventListener("click", () => {
            this.startGame();
        });

        //reset
        resetShipButton.addEventListener("click", () => {
            clearSelection();
            this.resetShipUI();
            placeCount = 0;
            startButton.disabled = true;
            startButton.style.backgroundColor = "gray";
        });

        // random placement
        randomButton.addEventListener("click", () => {
            this.resetShipUI();
            this.placeRandomUI();
            const startButton = document.getElementById("play");
            if (startButton) {
                startButton.disabled = false;
                startButton.style.backgroundColor = "black";
            }
            selectedShip = null;
        });
    }

    resetShipUI() {
        this.player = new Player()
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
        let index = 0;
        ships.forEach(({ display, name, length }) => {
            const shipEl = document.createElement("div");
            shipEl.classList.add("ship");
            shipEl.setAttribute("data-ship", name);
            shipEl.setAttribute("data-length", length);
            shipEl.setAttribute("data-index", index);
            shipEl.textContent = display;
            shipContainer.appendChild(shipEl);
            index++;
        });

        const blocks = document.querySelectorAll(".start-board .block");
        blocks.forEach(block => {
            block.style.backgroundColor = "";
            block.classList.remove("visited")
            block.dataset.occupied = "false";
        });

        this.generateBoards();
        this.createButtons();
        this.enableShipPlacement(this.player);
    }

    createButtons() {
        const buttons = document.querySelector(".buttons");
        const shipButtons = document.querySelector(".ship-buttons");
        buttons.innerHTML = "";
        shipButtons.innerHTML = "";

        const startButton = document.createElement("button");
        startButton.id = "play";
        startButton.textContent = "Start Game";
        startButton.classList.add("button");

        const randomButton = document.createElement("button");
        randomButton.id = "random";
        randomButton.textContent = "Place Ships Randomly";
        randomButton.classList.add("button");


        buttons.appendChild(startButton);
        buttons.appendChild(randomButton);

        const resetButton = document.createElement("button");
        resetButton.id = "reset";
        resetButton.textContent = "Reset Ships";
        resetButton.classList.add("button");


        const axisButton = document.createElement("button");
        axisButton.id = "axis";
        axisButton.textContent = "Change Axis";
        axisButton.classList.add("button");

        shipButtons.appendChild(axisButton);
        shipButtons.appendChild(resetButton);
    }

    placeRandomUI() {
        const board = document.querySelector(".start-board");
        const blocks = board.querySelectorAll(".block");

        blocks.forEach(block => {
            block.style.backgroundColor = "";
            const visited = block.querySelector(".visited");
            if (visited) visited.remove();
        });

        this.player.gameboard = new Gameboard();
        this.player.gameboard.placeRandomly();

        this.setShipUI(this.player.gameboard, board);

        document.querySelectorAll(".ship").forEach(ship => {
            ship.remove();
        });
    }

    startGame() {
        document.querySelector(".start-screen").style.display = "none";
        document.querySelector(".container").style.display = "flex";
        this.setShipUI(this.player.gameboard, this.playerBoard);
        this.makeMoveUI(this.player, this.computer, this.computerBoard);

    }

}