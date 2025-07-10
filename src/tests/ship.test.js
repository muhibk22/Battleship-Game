import Ship from "../components/ship.js";

test('Ship gets hit', ()=>{
    const ship= new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
})

test("Ship Sinks", ()=>{
    const ship=new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})