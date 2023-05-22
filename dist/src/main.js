import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import { initScene, animate, onWindowResize } from './initScene.js';
import { initBoard, createHorses, setUpModel, board } from './initBoard.js';
import { scene, camera, changeBackground, bgChange } from "./initScene.js";
import { onClickPiece } from './onMove.js';



window.addEventListener('click', onClickPiece);
window.addEventListener('resize', onWindowResize);


// Reset chessboard, move all piece to its original position
let resetbtn = document.querySelector("#reset");
resetbtn.addEventListener("click", reset1);

let changeBg = document.querySelector("#changeBackground");
changeBg.addEventListener("click", changeBg1);

function changeBg1() {
  initScene();
  bgChange();
  initBoard();
  setUpModel();
  animate();
}

function reset1(){
  initScene();
  changeBackground();
  initBoard();
  setUpModel();
  animate();
}

window.onload = function () {
  initScene();
  changeBackground();
  initBoard();
  setUpModel();
  animate();
};
