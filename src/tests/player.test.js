import Player from "../components/player";

test("Computer places random move",()=>{
    const player= new Player();
    const computer= new Player("computer");
    expect(computer.makeMove(player.gameboard)).toBe(true);
   
});