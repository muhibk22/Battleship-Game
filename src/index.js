import "./styles.css";
import { generateBoards, setShipUI, makeMoveUI,enableShipPlacement, playAgain } from "./components/display";
import Player from "./components/player";

const player= new Player();
const computer= new Player("computer");
computer.gameboard.placeRandomly();

generateBoards(); 
enableShipPlacement(player)

const computerBoard=document.querySelector(".computer-board");
makeMoveUI(player, computer, computerBoard);
setShipUI(computer.gameboard, computerBoard);


