export default class Ship{
    constructor(length,type){
        this.length=length;
        this.hits=0;
        this.type=type;
        this.axis="x";
        this.x=null;
        this.y=null;
    }

    hit(){
        this.hits++;
    }

    isSunk(){
        return this.hits>=this.length;
    }
}