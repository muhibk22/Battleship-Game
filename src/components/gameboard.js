import Ship  from "./ship";

export default class Gameboard{
    constructor(){
        this.blocks=Array.from({length: 10}, ()=> Array(10).fill(0))
        this.carrier= new Ship(5);
        this.battleship= new Ship(4);
        this.destroyer= new Ship(3);
        this.submarine= new Ship(3);
        this.boat1= new Ship(2);
        this.boat2 = new Ship(2);
    }

    placeShip(ship,x,y){
        if(x<0 || x>10 ||y <0 || y>10){
            return false;
        }
        if (y+ship.length >10){
            return false;
        }
        let isTaken=false;
        for (let i=0; i<ship.length; i++){
            if (isTaken) {
                return false;
            }
            if (this.blocks[x][y+i]!=0){
                isTaken= true;
            }
        }
        
        for (let i=0; i<ship.length; i++){
            this.blocks[x][y+i]=1;
        }
        return true;
    }

    
}