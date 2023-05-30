import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js";
export let scene, camera, renderer, controls;

let bg1 = new URL('../models/background.hdr', import.meta.url);
let bg2 = new URL('../models/grass.hdr', import.meta.url);
let bg3 = new URL('../models/sky.hdr', import.meta.url);
let bg4 = new URL('../models/arena.hdr', import.meta.url);

export function bgChange(){
  
  const bgList = [bg1, bg2, bg3, bg4];

  var randomNumber = Math.floor(Math.random() * bgList.length);

  const loader = new RGBELoader();
  loader.load(bgList[randomNumber], function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.enviroment = texture;
  })
}

export function changeBackground() {
  const loader = new RGBELoader();
  let hdrTextureURL1 = new URL('../models/background.hdr', import.meta.url);
  loader.load(hdrTextureURL1, function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.enviroment = texture;
  })
}

export function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#background"),});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; 
  renderer.toneMappingExposure = 0.6;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  camera.position.y = 6;
  camera.position.x = -3;
  camera.position.z = 4.3;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(4.5, 0, 4.5);

  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2;

  controls.enableDamping = true;

  // light
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight1.position.set(4.5, 10, 4.5);
  directionalLight1.castShadow = true;
  directionalLight1.shadow.mapSize.width = 1024;
  directionalLight1.shadow.mapSize.height = 1024;
  const d = 30;
  directionalLight1.shadow.camera.left = -d;
  directionalLight1.shadow.camera.right = d;
  directionalLight1.shadow.camera.top = d;
  directionalLight1.shadow.camera.bottom = -d;
  scene.add(directionalLight1);
  // this.scene.add(new THREE.CameraHelper(directionalLight1.shadow.camera));

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight2.position.set(-50, 50, -50);
  directionalLight2.castShadow = true;
  directionalLight2.shadow.mapSize.width = 1024;
  directionalLight2.shadow.mapSize.height = 1024;
  directionalLight2.shadow.camera.left = -d;
  directionalLight2.shadow.camera.right = d;
  directionalLight2.shadow.camera.top = d;
  directionalLight2.shadow.camera.bottom = -d;
  scene.add(directionalLight2);
  // this.scene.add(new THREE.CameraHelper(directionalLight2.shadow.camera));

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
}

export function animate() {
  // onClickPiece();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
