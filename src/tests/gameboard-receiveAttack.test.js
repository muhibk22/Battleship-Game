import Gameboard from "../components/gameboard";

test("Receive attack returns correct value",()=>{
    const gameboard=new Gameboard();
    expect(gameboard.receiveAttack(1,1)).toBe(true);
    expect(gameboard.blocks[1][1]).toEqual(2);
    expect(gameboard.receiveAttack(1,1)).toBe(false);
})

test("Receive attack increases hits correctly",()=>{
    const gameboard=new Gameboard();
    gameboard.placeShip(gameboard.boat1,1,1)
    expect(gameboard.receiveAttack(2,1)).toBe(true);
    expect(gameboard.blocks[2][1]).toEqual(1);
})

test("allSunk() returns true when all ships are sunk", () => {
  const board = new Gameboard();

  board.carrier.hits = 5;
  board.battleship.hits = 4;
  board.destroyer.hits = 3;
  board.submarine.hits = 3;
  board.boat1.hits = 2;
  expect(board.allSunk()).toBe(false);
  board.boat2.hits = 2;

  expect(board.allSunk()).toBe(true);
});