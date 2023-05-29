import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

import { scene, camera, renderer, controls } from './initScene.js';

export let board, modelRepository;

export function initBoard() {
  const square = new THREE.BoxGeometry(1, 0.1, 1);
  const lightsquare = new THREE.MeshBasicMaterial({ color: 0xE0C4A8 });
  const darksquare = new THREE.MeshBasicMaterial({ color: 0x6A4236 });
  const grayMat = new THREE.MeshBasicMaterial({ color: 0x41251c });

  board = new THREE.Group();
  board.name = "BOARD1";

  let squareNumber = 1;
  for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
      let cube;
      if (z % 2 == 0) {
        cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
        cube.userData.squareNumber = squareNumber;
        squareNumber++;
      } else {
        cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
        cube.userData.squareNumber = squareNumber;
        squareNumber++;
      }
      cube.position.set(x, 0, z);
      board.add(cube);
    }
  }

  for (let x = 0; x < 10; x += 1) {
    for (let z = 0; z < 10; z += 1) {
      if (z === 9 || z === 0 || x === 0 || x === 9) {
        var cube1 = new THREE.Mesh(square, grayMat);
        cube1.position.set(x, 0, z);
      }
      board.add(cube1);
    }
  }

  board.position.set(0, 0, 0);
  scene.add(board);
  // console.log(scene);
}

export function getBoardPosition(row, col) {
  const board = scene.getObjectByName("BOARD1");
  // console.log(board);
  const box = new THREE.Box3().setFromObject(board);
  const size = box.max.x - box.min.x; // same as 'box.max.z - box.min.z'
  const cellWidth = size / 10;

  return { 
      x: col*cellWidth + cellWidth/2 - size/10, 
      y: row*cellWidth + cellWidth/2 - size/10
  };
}


export async function setUpModel() {
  await new GLTFLoader().load("./models/chess.glb", (gltf) => {
    const models = gltf.scene;
    modelRepository = models;
    scene.add(modelRepository);
    createHorses();
    scene.remove(modelRepository);
})
}

export function createHorses(){
    createHorse({row: 2, col: 1, square: 13}, "White-Pawn", "Chess-White-Pawn-0");
    createHorse({row: 2, col: 2, square: 23}, "White-Pawn", "Chess-White-Pawn-1");
    createHorse({row: 2, col: 3, square: 33}, "White-Pawn", "Chess-White-Pawn-2");
    createHorse({row: 2, col: 4, square: 43}, "White-Pawn", "Chess-White-Pawn-3");
    createHorse({row: 2, col: 5, square: 53}, "White-Pawn", "Chess-White-Pawn-4");
    createHorse({row: 2, col: 6, square: 63}, "White-Pawn", "Chess-White-Pawn-5");
    createHorse({row: 2, col: 7, square: 73}, "White-Pawn", "Chess-White-Pawn-6");
    createHorse({row: 2, col: 8, square: 83}, "White-Pawn", "Chess-White-Pawn-7");
        
    createHorse({row: 1, col: 1, square: 12}, "White-Rock", "Chess-White-Rock-0");
    createHorse({row: 1, col: 2, square: 22}, "White-Knight", "Chess-White-Knight-0");
    createHorse({row: 1, col: 3, square: 32}, "White-Bishop", "Chess-White-Bishop-0");
    createHorse({row: 1, col: 4, square: 42}, "White-Queen", "Chess-White-Queen");
    createHorse({row: 1, col: 5, square: 52}, "White-King", "Chess-White-King");
    createHorse({row: 1, col: 6, square: 62}, "White-Bishop", "Chess-White-Bishop-1");
    createHorse({row: 1, col: 7, square: 72}, "White-Knight", "Chess-White-Knight-1");
    createHorse({row: 1, col: 8, square: 82}, "White-Rock", "Chess-White-Rock-1");

    createHorse({row: 7, col: 1, square: 18}, "Black-Pawn", "Chess-Black-Pawn-0");
    createHorse({row: 7, col: 2, square: 28}, "Black-Pawn", "Chess-Black-Pawn-1");
    createHorse({row: 7, col: 3, square: 38}, "Black-Pawn", "Chess-Black-Pawn-2");
    createHorse({row: 7, col: 4, square: 48}, "Black-Pawn", "Chess-Black-Pawn-3");
    createHorse({row: 7, col: 5, square: 58}, "Black-Pawn", "Chess-Black-Pawn-4");
    createHorse({row: 7, col: 6, square: 68}, "Black-Pawn", "Chess-Black-Pawn-5");
    createHorse({row: 7, col: 7, square: 78}, "Black-Pawn", "Chess-Black-Pawn-6");
    createHorse({row: 7, col: 8, square: 88}, "Black-Pawn", "Chess-Black-Pawn-7");
        
    createHorse({row: 8, col: 1, square: 19}, "Black-Rock", "Chess-Black-Rock-0");
    createHorse({row: 8, col: 2, square: 29}, "Black-Knight", "Chess-Black-Knight-0");
    createHorse({row: 8, col: 3, square: 39}, "Black-Bishop", "Chess-Black-Bishop-0");
    createHorse({row: 8, col: 4, square: 49}, "Black-Queen", "Chess-Black-Queen");
    createHorse({row: 8, col: 5, square: 59}, "Black-King", "Chess-Black-King");
    createHorse({row: 8, col: 6, square: 69}, "Black-Bishop", "Chess-Black-Bishop-1");
    createHorse({row: 8, col: 7, square: 79}, "Black-Knight", "Chess-Black-Knight-1");
    createHorse({row: 8, col: 8, square: 89}, "Black-Rock", "Chess-Black-Rock-1");    
}

export function createHorse(boardPos, name, meshName) {
    const mesh = modelRepository.getObjectByName(name).clone();
    mesh.scale.set( mesh.scale.x * 0.3, mesh.scale.y * 0.4, mesh.scale.z * 0.5);
    // mesh.position.y += mesh.scale.y;
    mesh.name = meshName;

    // if(mesh.name.startsWith("Black")){
    //   mesh.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
    // }
    // else{ 
    //   mesh.material = new THREE.MeshStandardMaterial( {color: 0x000000} );
    // }


    mesh.traverse(child => {
        child.castShadow = true;
        child.receiveShadow = true;
    });

    // const posRC = getBoardPosition(boardPos.row, boardPos.col);
    // const pos = { x: posRC.x, y: 0.1, z: posRC.y };
    const quat = { x: 0, y: 0, z: 0, w: 1 };

    // mesh.position.set(pos.x, 0 , pos.z);
    mesh.position.set(boardPos.col, 0, boardPos.row)

    mesh.quaternion.set(quat.x, quat.y, quat.z, quat.z);
    mesh.userData.currentSquare = boardPos.square;  
    mesh.current = boardPos.square;
    scene.add(mesh);        
}