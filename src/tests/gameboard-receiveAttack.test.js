import Gameboard from "../components/gameboard";
import Ship from "../components/ship";

test("Receive attack returns correct value",()=>{
    const gameboard=new Gameboard();
    expect(gameboard.receiveAttack(1,1)).toBe(true);
    expect(gameboard.blocks[1][1]).toEqual(2);
    expect(gameboard.receiveAttack(1,1)).toBe(false);
})

test("Receive attack increases hits correctly",()=>{
    const gameboard=new Gameboard();
    gameboard.placeShip(gameboard.boat1,1,1)
    expect(gameboard.receiveAttack(1,2)).toBe(true);
    expect(gameboard.blocks[1][2]).toEqual(1);
})