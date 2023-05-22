import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import { scene, camera } from "./initScene.js";
import { board } from "./initBoard.js";


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedMesh = null;

// var raycaster = new THREE.Raycaster();

// export function onMouseMove( event ) {
//     raycaster.clickPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
//     raycaster.clickPosition.y = - (event.clientY / window.innerHeight) * 2 + 1; 
// }
export function positionForSquare(square) {
    const found = board.children.find((child) => child.userData.squareNumber == square);
    if (found)
      return found.position;
    return null;
}

export function onClickPiece(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1; 

  // var selectedMesh = null;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects[0].object.userData);
  if(intersects.length > 0 && selectedMesh == null) {
    selectedMesh = intersects[0].object.userData.currentSquare;
    return;
  }
  if(selectedMesh) {
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(board.children);
    
    if ( intersects.length > 0 && intersects[0].object.userData.squareNumber ) {
      const targetSquare = intersects[0].object.userData.squareNumber;
      const selectedObject = scene.children.find((child) => child.userData.currentSquare === selectedMesh);
      if (!selectedObject || !targetSquare) return;

      const targetPosition = positionForSquare(targetSquare);
      selectedObject.position.set(targetPosition.x, selectedObject.position.y, targetPosition.z);
      selectedObject.currentSquare = targetSquare;

      selectedMesh = null;
    }
  }
}

export function reset(scene){
  console.log(scene);
    // for(const p of scene.children){
    //   if(p.name){
    //     const orgPos = positionForSquare(p.userData.currentSquare);
    //     p.position.set(orgPos.x, orgPos.y, orgPos.z);
    //     p.currentSquare = orgPos;
    //   }
    // }
}