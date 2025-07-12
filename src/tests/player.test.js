import Player from "../components/player";

test("Player gameboards initialize correctly",()=>{
    const player= new Player();
    const computer= new Player("computer");
    expect(computer.makeMove(player.gameboard)).toBe(true);
   
})