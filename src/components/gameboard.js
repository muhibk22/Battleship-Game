import Ship  from "./ship";

export default class Gameboard{
    constructor(){
        this.size=10;
        this.blocks=Array.from({length: this.size}, ()=> Array(this.size).fill(0))
        this.carrier= new Ship(5,"carrier");
        this.battleship= new Ship(4,"battleship");
        this.destroyer= new Ship(3,"destroyer");
        this.submarine= new Ship(3,"submarine");
        this.boat1= new Ship(2,"boat1");
        this.boat2 = new Ship(2,"boat2");
    }

    placeShip(ship,x,y){
        if(x<0 || x>this.size ||y <0 || y>this.size){
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
            this.blocks[x][y+i]=ship.type;
        }
        return true;
    }

    receiveAttack(x,y){
        if(x<0 || x>this.size ||y <0 || y>this.size){
            return false;
        }
        if(this.blocks[x][y]===1||this.blocks[x][y]==2){
            return false;
        }
        if(this.blocks[x][y]==="carrier"){
            this.blocks[x][y]=1;
            this.carrier.hit();
            return true;
        }
        if(this.blocks[x][y]==="battleship"){
            this.blocks[x][y]=1;
            this.battleship.hit();
            return true;
        }
        if(this.blocks[x][y]==="destroyer"){
            this.blocks[x][y]=1;
            this.destroyer.hit();
            return true;
        }
        if(this.blocks[x][y]==="submarine"){
            this.blocks[x][y]=1;
            this.submarine.hit();
            return true;
        }
        if(this.blocks[x][y]==="boat1"){
            this.blocks[x][y]=1;
            this.boat1.hit();
            return true;
        }
        if(this.blocks[x][y]==="boat2"){
            this.blocks[x][y]=1;
            this.boat2.hit();
            return true;
        }
        if(this.blocks[x][y]===0){
            this.blocks[x][y]=2;
            return true;
        }
    }
    
}