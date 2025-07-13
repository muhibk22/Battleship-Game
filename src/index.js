import "./styles.css";
import { generateBoards, setShipUI, makeMoveUI,enableDragAndDrop, enableTouchPlaceShips } from "./components/display";
import Player from "./components/player";

const player= new Player();
const computer= new Player("computer");
computer.gameboard.placeRandomly();

const playerBoard = document.querySelector(".player-board");
const computerBoard= document.querySelector(".computer-board");
generateBoards(); 
enableDragAndDrop(player);
enableTouchPlaceShips(player)

setShipUI(player.gameboard, playerBoard);
setShipUI(computer.gameboard, computerBoard);

makeMoveUI(player, computer, computerBoard);

