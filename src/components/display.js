import Player from "./player";

export function generateBoards(){
    const boards=document.querySelectorAll(".board");
    boards.forEach(board => {
        for (let i = 0; i < 10; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < 10; j++) {
                const block = document.createElement("div");
                block.classList.add("block");
                block.setAttribute("data-y", i);
                block.setAttribute("data-x", j);
                row.appendChild(block);
            }
            board.appendChild(row);
        }
    });
}