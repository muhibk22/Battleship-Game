import Gameboard from "./gameboard";

export default class Player {
    constructor(type = "human") {
        this.type = type;
        this.gameboard = new Gameboard();
    }

    makeMove(board, x=null, y=null) {
        if (this.type !== "human") {
            let isValid = false;
            do {
                const a = Math.floor(Math.random() * this.gameboard.size);
                const b = Math.floor(Math.random() * this.gameboard.size);
                isValid = board.receiveAttack(a, b);
            }while(!isValid);
            return true;
        }
        else {
            return board.receiveAttack(x, y);
        }
    }
}

