import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import { scene, camera } from "./initScene.js";
import { board } from "./initBoard.js";


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedMesh = null;
let i = 0;
let j = 9;

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
      
      if (!selectedObject || !targetSquare) return;
      
      const targetPosition = positionForSquare(targetSquare);

      if( checkValidMove(targetPosition.x, targetPosition.z, selectedObject) === true ){
        timelineT.to(selectedObject.position, {
          x: targetPosition.x,
          z: targetPosition.z,
          duration: 0.5,
        });
        selectedObject.current = targetSquare;
      }
      
      const samePosMesh = scene.children.filter((child) => child.current === targetSquare);
      let deadMesh = samePosMesh.find((mesh) => mesh.userData.currentSquare !== selectedMesh);
      if(deadMesh !== undefined){
        if(deadMesh.name.startsWith("White")){
          timelineT.to(deadMesh.position, {
            x: 0,
            z: i
          });
          i++;
          deadMesh.current = Math.floor(Math.random() * 1000) - 1000;
        }
        else{
          timelineT.to(deadMesh.position, {
            x: 9,
            z: j
          });
          j--;
          deadMesh.current = Math.floor(Math.random() * 1000) - 1000;
        }
      }
      deadMesh = null;
      selectedMesh = null;
    }
  }
}

function checkValidMove(posX, posZ, chess){
  switch (chess.userData.name) {
    case "Black-Pawn":
      
        if (_checkPositionChess_col(chess, posZ)){
            if(_checkPositionChess_row(chess, posX)){
      if(chess.position.z  == 7) {
        if ((chess.position.z == posZ + 1 || chess.position.z == posZ + 2)
        && chess.position.x == posX) {
          if(_Chessed(posX, posZ, chess))
          return true;}
      } else {
        if ( ( chess.position.z == posZ + 1 && chess.position.x == posX + 1 ) || ( chess.position.z == posZ + 1 && chess.position.x == posX - 1 ))
          return true;
        if ( (chess.position.z == posZ + 1)  && chess.position.x == posX ) 
        if(_Chessed(posX, posZ, chess))
          return true;
      }   }}
      break;
    
    case "White-Pawn":
      
        if (_checkPositionChess_col(chess, posZ)){
            if(_checkPositionChess_row(chess, posX)){
      if((chess.position.z) == 2) {
          if (( chess.position.z == posZ - 1 || chess.position.z == posZ - 2 ) 
          && chess.position.x == posX) 
          if(_Chessed(posX, posZ, chess))
            return true;
      } else {
        if ( ( chess.position.z == posZ - 1 && chess.position.x == posX - 1 ) || ( chess.position.z == posZ - 1 && chess.position.x == posX + 1 ))
          return true;
        if ( (chess.position.z == posZ - 1) && chess.position.x == posX)
        if(_Chessed(posX, posZ, chess))
            return true;
        }   }}
      break;   
    case "Black-Rock":
    case "White-Rock":
      if (chess.position.x == posX || chess.position.z == posZ) {
        return true;
      }

      break;

    case "Black-Bishop":
    case "White-Bishop":
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
     {
        if (_checkPositionChess_diag(chess, posZ, posX)) {
      if (Math.abs(dx) === Math.abs(dz)) {
          var stepX = dx > 0 ? 1 : -1;
          var stepZ = dz > 0 ? 1 : -1;
                    
          var currentX = chess.position.x + stepX;
          var currentZ = chess.position.z + stepZ;
          while (currentX !== posX && currentZ !== posZ) {
              currentX += stepX;
              currentZ += stepZ;
          }
          if(_Chessed(posX, posZ, chess))
          return true;
      }}}
      break;

    case "Black-Knight":
    case "White-Knight":
      {
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if ((absDx === 1 && absDz === 2) || (absDx === 2 && absDz === 1)) {
        if(_Chessed(posX, posZ, chess))
        return true;
      }}
    break;
      
    case "Black-Queen":
    case "White-Queen":
      if(chess.position.x == posX){
        if(_checkPositionChess_col(chess, posZ)){
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if (absDx === absDz || absDx === 0 || absDz === 0) 
        if(_Chessed(posX, posZ, chess))
        return true;
        }
        else 
        if(chess.position.z == posZ){
            if(_checkPositionChess_row(chess, posX)){
              var dx = posX - chess.position.x;
                                var dz = posZ - chess.position.z;
                                var absDx = Math.abs(dx);
                                var absDz = Math.abs(dz);
                                if (absDx === absDz || absDx === 0 || absDz === 0) {
                                  if(_Chessed(posX, posZ, chess))  
                                  return true;
                                }
                              }}
                              else {
                                if(_checkPositionChess_diag(chess, posZ, posX)){
                                    var dx = posX - chess.position.x;
                                    var dz = posZ - chess.position.z;
                                    var absDx = Math.abs(dx);
                                    var absDz = Math.abs(dz);
                                    if (absDx === absDz || absDx === 0 || absDz === 0) {
                                      if(_Chessed(posX, posZ, chess))  
                                      return true;
                                    }
                                }}
      }
            
      break;
    
    case "Black-King":
    case "White-King":
      {
      var dx = posX - chess.position.x;
      var dz = posZ - chess.position.z;
      var absDx = Math.abs(dx);
      var absDz = Math.abs(dz);
      if ((absDx === 1 && absDz === 0) || (absDx === 0 && absDz === 1)
      || (absDx === 1 && absDz === 1))
        if(_Chessed(posX, posZ, chess))
        return true
      }
    default:
      break;
  }
}

function _Chessed(pos_x, pos_z, chess) {
  var check_chess = 0;

  if(chess.name.includes("Black")){
      scene.traverse((object) => {
              if(object.name.includes("Chess")){
                  var ob_x = object.position.x;
                  var ob_z = object.position.z;
                  if(pos_x == ob_x && pos_z == ob_z) {
                      if(object.name.includes("White")){
                          object.position.z = 100;
                          object.position.x = 100; 
                      } else check_chess = 1;
                  };
              }
      });
  } else
      if(chess.name.includes("White")){
          scene.traverse((object) => {
              
                  if(object.name.includes("Chess")){
                      var ob_x = object.position.x;
                      var ob_z = object.position.z;
                      if(pos_x == ob_x && pos_z == ob_z) {
                          if(object.name.includes("Black")){
                              object.position.z = 100;
                              object.position.x = 100; 
                          } else check_chess = 1;
                      };
                  }
              
          });
      }

  if (check_chess == 1){
    console.log("chessed fasle");
      return false;
  } else return true;
}


function _checkPositionChess_row(chess, pos_x) {
  const height = chess.position.z;
  const width = chess.position.x;
  var check_row = 0;
  scene.traverse((object) => {      
    if(object.name.includes("Chess")){
          var ob_x = object.position.x;
          var ob_z = object.position.z;
          
          if(ob_z == height ) {
            console.log(width + " "+ pos_x)
            console.log(ob_x);
            if (width < pos_x){
              if(ob_x > width && ob_x < pos_x) {
                check_row = 1;
              }
            } else
                if (ob_z > pos_x && ob_z < width){
                  check_row = 1;
                }
          }
      }
  });

  if (check_row == 1) {
    console.log("row false");
      return false;
      
  } else {
      return true;
  }
}

function _isOnDiagonal(row, col, selectedRow1, selectedCol1, selectedRow2, selectedCol2) {
  if (
    Math.abs(row - selectedRow1) === Math.abs(col - selectedCol1) &&
    Math.abs(row - selectedRow2) === Math.abs(col - selectedCol2) &&
    !(row === selectedRow1 && col === selectedCol1) &&
    !(row === selectedRow2 && col === selectedCol2)
  ) {
    return true;
  }
  return false;
}

function _checkPositionChess_diag(chess, pos_z, pos_x) {
  const width = chess.position.x;
  const height = chess.position.z;

  var check_diag = 0;
  scene.traverse((object) => {
    if(object.name.includes("Chess")){
          var ob_x = object.position.x;
          var ob_z = object.position.z;
          if (height < pos_z)
            if(ob_z > height && ob_z < pos_z)
              if(_isOnDiagonal(ob_x, ob_z, width, height, pos_x, pos_z))
                check_diag = 1;    
        
          if (height > pos_z) 
            if(ob_z < height && ob_z > pos_z)
              if(_isOnDiagonal(ob_x, ob_z, width, height, pos_x, pos_z))
                check_diag = 1;    
      }
  });
  if (check_diag == 1) {
      console.log("Dia false");
      return false;
  } else {
      return true;
  }
}
function _checkPositionChess_col(chess, pos_z) {
  const withd = chess.position.x;
  const height = chess.position.z;

  var check_col = 0;
  scene.traverse((object) => {
      
    if(object.name.includes("Chess")){
          var ob_x = object.position.x;
          var ob_z = object.position.z;
          if(ob_x == withd ) {
            if (height < pos_z){
              if(ob_z > height && ob_z < pos_z) {
                check_col = 1;
              }
            } else
                if (ob_z > pos_z && ob_z < height){
                  check_col = 1;
                }
          }
      }
  });
  if (check_col == 1){
    console.log("Col false")
      return false;
      
  } else return true;
}
export function reset(scene){
  console.log(scene);
}