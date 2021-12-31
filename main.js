import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

import planeVertexShader from "./shaders/plane/vertex.js";
import planeFragmentShader from "./shaders/plane/fragment.js";
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.querySelector(".overlay").addEventListener("click", () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  document.querySelector(".overlay").classList.add("hide");
  document.getElementById("test-song").play();
  analyser.getByteFrequencyData(frequencyData);
});

const frequencyData = new Uint8Array(200);

const audioSrc = audioCtx.createMediaElementSource(
  document.getElementById("test-song")
);
const analyser = audioCtx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

const sizes = { height: window.innerHeight, width: window.innerWidth };
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);
});

const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
  transparent: true,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.z = 10;
camera.position.y = 0;

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  // console.log(frequencyData);
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  analyser.getByteFrequencyData(frequencyData);
}
animate();
