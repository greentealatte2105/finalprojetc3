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
    const timelineT = gsap.timeline();

    if ( intersects.length > 0 && intersects[0].object.userData.squareNumber ) {
      const targetSquare = intersects[0].object.userData.squareNumber;
      const selectedObject = scene.children.find((child) => child.userData.currentSquare === selectedMesh);
      console.log(selectedObject);
      if (!selectedObject || !targetSquare) return;

      const targetPosition = positionForSquare(targetSquare);
      if( checkValidMove(targetPosition.x, targetPosition.z, selectedObject) === true ){
        timelineT.to(selectedObject.position, {
          x: targetPosition.x,
          z: targetPosition.z,
          duration: 0.5,
        });
        selectedObject.currentSquare = targetSquare;
      }
      
      selectedMesh = null;
    }
  }
}

function checkValidMove(posX, posZ, chess){


  switch (chess.userData.name) {
    case "Black-Pawn":
      if(chess.position.z  == 7) {
        if ((chess.position.z == posZ + 1 || chess.position.z == posZ + 2) && chess.position.x == posX) return true;
      } else {
        if ( (chess.position.z == posZ + 1)  && chess.position.x == posX ) 
          return true;
      }   
      break;
    
    case "White-Pawn":
      if((chess.position.z) == 2) {
          if (( chess.position.z == posZ - 1 || chess.position.z == posZ - 2 ) && chess.position.x == posX) return true;
      } else {
        if ( (chess.position.z == posZ - 1) && chess.position.x == posX)
            return true;
        }   
      break;   
    case "Black-Rock":
    case "White-Rock":
      if (chess.position.x == posX || chess.position.z == posZ) {
        console.log("asdas")
        return true;
      }
      break;

    case "Black-Bishop":
    case "White-Bishop":
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      if (Math.abs(dx) === Math.abs(dz)) {
          var stepX = dx > 0 ? 1 : -1;
          var stepZ = dz > 0 ? 1 : -1;
                    
          var currentX = chess.position.x + stepX;
          var currentZ = chess.position.z + stepZ;
          while (currentX !== posX && currentZ !== posZ) {
              currentX += stepX;
              currentZ += stepZ;
          }
                    
          return true;
      }
      break;

    case "Black-Knight":
    case "White-Knight":
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if ((absDx === 1 && absDz === 2) || (absDx === 2 && absDz === 1)) {
        return true;
      }
    break;
      
    case "Black-Queen":
    case "White-Queen":
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if (absDx === absDz || absDx === 0 || absDz === 0) 
        return true;
      break;
    
    case "Black-King":
    case "White-King":
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if ((absDx === 1 && absDz === 0) || (absDx === 0 && absDz === 1)
      || (absDx === 1 && absDz === 1))
        return true

    default:
      break;
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