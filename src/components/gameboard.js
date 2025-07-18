import Ship from "./ship";

export default class Gameboard {
    constructor() {
        this.size = 10;
        this.blocks = Array.from({ length: this.size }, () => Array(this.size).fill(0))
        this.carrier = new Ship(5, "carrier");
        this.battleship = new Ship(4, "battleship");
        this.destroyer = new Ship(3, "destroyer");
        this.submarine = new Ship(3, "submarine");
        this.boat1 = new Ship(2, "boat1");
        this.boat2 = new Ship(2, "boat2");
        this.lastHit = false;
        this.lastSunk = false;
    }

    placeShip(ship, x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        if ((ship.axis === "y" && y + ship.length > 10) || (ship.axis === "x" && x + ship.length > 10)) {
            return false;
        }
        if (ship.axis === "y") {
            for (let i = 0; i < ship.length; i++) {
                if (this.blocks[x][y + i] != 0) {
                    for (let j = 0; j < i; j++) {
                        this.blocks[x][y + j] = 0;
                    }
                    return false;
                }
                else {
                    this.blocks[x][y + i] = ship.type;
                }
            }
            ship.x = x;
            ship.y = y;
            return true;
        }
        else {
            for (let i = 0; i < ship.length; i++) {
                if (this.blocks[x + i][y] != 0) {
                    for (let j = 0; j < i; j++) {
                        this.blocks[x + j][y] = 0;
                    }
                    return false;
                }
                else {
                    this.blocks[x + i][y] = ship.type;
                }
            }
            ship.x = x;
            ship.y = y;
            return true;
        }

    }

    placeRandomly() {
        const ships = [this.carrier, this.battleship, this.destroyer, this.submarine, this.boat1, this.boat2];
        const directions = ["x", "y"]
        for (const ship of ships) {
            let placed = false;
            let x=null;
            let y=null;
            while (!placed) {
                const axis = directions[Math.floor(Math.random() * 2)];
                ship.axis = axis;
                x = Math.floor(Math.random() * this.size);
                y = Math.floor(Math.random() * this.size);
                placed = this.placeShip(ship, x, y);
            }
            ship.x=x;
            ship.y=y;
        }
    }

    removeShip(ship, x, y) {
        if (ship.axis === "x") {
            for (let i = 0; i < ship.length; i++) {
                if (this.blocks[x + i][y] === ship.type) {
                    this.blocks[x + i][y] = 0;
                }
                else {
                    return false;
                }
            }
            return true;
        }
        else {
            for (let i = 0; i < ship.length; i++) {
                if (this.blocks[x][y + i] === ship.type) {
                    this.blocks[x][y + i] = 0;
                }
                else {
                    return false;
                }
            }
            return true;
        }
    }

    receiveAttack(x, y) {
        console.log(x, y);
        this.lastHit = false;
        this.lastSunk = false;
        if (x < 0 || x > this.size || y < 0 || y > this.size) {
            return false;
        }
        if (this.blocks[x][y] === 1 || this.blocks[x][y] == 2) {
            return false;
        }
        if (this.blocks[x][y] === "carrier") {
            this.blocks[x][y] = 1;
            this.carrier.hit();
            this.lastSunk = this.carrier.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === "battleship") {
            this.blocks[x][y] = 1;
            this.battleship.hit();
            this.lastSunk = this.battleship.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === "destroyer") {
            this.blocks[x][y] = 1;
            this.destroyer.hit();
            this.lastSunk = this.destroyer.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === "submarine") {
            this.blocks[x][y] = 1;
            this.submarine.hit();
            this.lastSunk = this.submarine.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === "boat1") {
            this.blocks[x][y] = 1;
            this.boat1.hit();
            this.lastSunk = this.boat1.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === "boat2") {
            this.blocks[x][y] = 1;
            this.boat2.hit();
            this.lastSunk = this.boat2.isSunk();
            this.lastHit = true;
            return true;
        }
        if (this.blocks[x][y] === 0) {
            this.blocks[x][y] = 2;
            return true;
        }
    }

    allSunk() {
        if (this.carrier.isSunk() && this.battleship.isSunk() && this.submarine.isSunk() &&
            this.destroyer.isSunk() && this.boat1.isSunk() && this.boat2.isSunk()) {
            return true;
        }
        return false;
    }

}