import Gameboard from "./gameboard";

export default class Player {
    constructor(type = "human") {
        this.type = type;
        this.gameboard = new Gameboard();
        this.visited = [];
        this.lastHit = [];
        this.initialHit = [];
        this.moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        this.currentMove = 0;
        this.x = 0;
        this.y = 0;
        this.firstHit = false;
        this.secondHit = false;
    }
    makeRandom(board) {
        let isValid = false;
        do {
            this.x = Math.floor(Math.random() * this.gameboard.size);
            this.y = Math.floor(Math.random() * this.gameboard.size);
            isValid = board.receiveAttack(this.x, this.y);
            if (board.lastHit) {
                this.lastHit[0] = this.x;
                this.lastHit[1] = this.y;
            }
            if (isValid) {
                this.visited.push([this.x, this.y]);
            }
        } while (!isValid);
        return true;
    }

    moveMade() {
        const length = this.visited.length;
        for (let i = 0; i < length; i++) {
            if (this.x === this.visited[i][0] && this.y === this.visited[i][1]) {
                return true;
            }
        }
        return false;
    }

    isValid() {
        return this.x <= 9 && this.x >= 0 && this.y <= 9 && this.y >= 0;
    }

    makeMove(board, x = null, y = null) {
        if (this.type === "human") {
            return board.receiveAttack(x, y);
        }

        if (board.lastSunk) {
            this.firstHit = false;
            this.secondHit = false;
            this.currentMove = 0;
            this.lastHit = [];
        }

        if (!this.firstHit) {
            let found = false;
            while (!found) {
                this.x = Math.floor(Math.random() * 10);
                this.y = Math.floor(Math.random() * 10);
                if (this.visited.length>=50 && this.isValid()){
                    return board.receiveAttack(this.x, this.y);
                }
                if ((this.x + this.y) %  2!== 0) {
                    continue;
                }

                if (!this.moveMade()) {
                    found = true;
                }
            }

            board.receiveAttack(this.x, this.y);
            this.visited.push([this.x, this.y]);

            if (board.lastHit) {
                this.firstHit = true;
                this.lastHit = [this.x, this.y];
                this.initialHit = [this.x, this.y];
            }

            return true;
        }

        if (this.firstHit && this.secondHit) {
            this.x = this.lastHit[0] + this.moves[this.currentMove][0];
            this.y = this.lastHit[1] + this.moves[this.currentMove][1];

            if (this.isValid() && !this.moveMade()) {
                board.receiveAttack(this.x, this.y);
                this.visited.push([this.x, this.y]);

                if (board.lastHit) {
                    this.lastHit = [this.x, this.y];
                } 
                else {
                    this.secondHit = false;
                    this.currentMove++;
                }

                return true;
            } else {
                this.secondHit = false;
                this.currentMove++;
                return this.makeMove(board);
            }
        }

        if (this.firstHit && !this.secondHit) {
            if (this.currentMove >= 4) {
                this.firstHit = true;
                this.secondHit = false;
                this.lastHit=[...this.initialHit];
                this.currentMove = 0;
                return this.makeMove(board);
            }

            this.x = this.lastHit[0] + this.moves[this.currentMove][0];
            this.y = this.lastHit[1] + this.moves[this.currentMove][1];

            if (!this.isValid() || this.moveMade()) {
                this.currentMove++;
                return this.makeMove(board);
            }

            board.receiveAttack(this.x, this.y);
            this.visited.push([this.x, this.y]);

            if (board.lastHit) {
                this.secondHit = true;
                this.lastHit = [this.x, this.y];
            } 
            else {
                this.currentMove++;
            }

            return true;
        }
        return false;
    }

}

