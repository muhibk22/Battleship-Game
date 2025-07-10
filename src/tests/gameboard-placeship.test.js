import Gameboard from "../components/gameboard";
import Ship from "../components/ship";

test('Ship gets placed inside gameboard', ()=>{
    const gameboard = new Gameboard;
    const ship = new Ship(2);
    
    expect(gameboard.placeShip(ship, 0,0)).toBe(true);
})

test("Blocks are taken so ship does not get placed,",()=>{
    const gameboard = new Gameboard;
    const ship = new Ship(2);
    gameboard.placeShip(ship, 0,0)
    expect(gameboard.placeShip(ship, 0,0)).toBe(false);
})

test("Ship size exceeds gameboard edges", ()=>{
    const gameboard = new Gameboard;
    const ship = new Ship(5);
    expect(gameboard.placeShip(ship, 0,6)).toBe(false);
})