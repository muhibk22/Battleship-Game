import {add} from "../components/add.js";

test('adds 2 plus 3 to be 5', ()=>{
    expect(add(2,3)).toBe(5);
})