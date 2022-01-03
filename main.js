import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

import planeVertexShader from "./shaders/plane/vertex.js";
import planeFragmentShader from "./shaders/plane/fragment.js";
import sphereVertexShader from "./shaders/sphere/vertex.js";
import sphereFragmentShader from "./shaders/sphere/fragment.js";
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

const planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 10, 17);
const planeVertexCount = planeGeometry.attributes.position.count;

const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  wireframe: false,
  // fog: true,
  transparent: true,
  // flatshading: true
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -7;
scene.add(plane);

// const sphereGeometry = new THREE.BoxGeometry(10,10,10, 2,2,2);

const outerSphereGeometry = new THREE.IcosahedronGeometry(5, 1);
const outerSphereMaterial = new THREE.RawShaderMaterial({
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  wireframe: false,
  // fog: true,
  transparent: true,
  // flatshading: true
});

const outerSphere = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);
outerSphere.position.y = 5;
scene.add(outerSphere);

const innerSphereGeometry = new THREE.IcosahedronGeometry(3, 0);
const innerSphereMaterial = new THREE.RawShaderMaterial({
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  wireframe: false,
  // fog: true,
  transparent: true,
  // flatshading: true
});

const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
innerSphere.position.y = 7;
scene.add(innerSphere);

const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.z = 50;
camera.position.x = 0;
camera.position.y = 10;

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.5);
directionalLight.position.x = -20;
directionalLight.position.z = 10;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xfffd00, 0.3);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);

let fogColor = new THREE.Color("red");

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.25, 10);

function animate() {
  // console.log(frequencyData);
  analyser.getByteFrequencyData(frequencyData);

  // console.log(frequencyData)
  let max = 0;
  let min = 1000;
  for (let i = 0; i < frequencyData.length; i++) {
    if (frequencyData[i] > max) {
      max = frequencyData[i];
    }
    if (frequencyData[i] < min) {
      min = frequencyData[i];
    }
  }
  console.log(max, min);

  planeGeometry.setAttribute(
    "aFrequency",
    new THREE.BufferAttribute(frequencyData, 1)
  );

  outerSphereGeometry.setAttribute(
    "aFrequency",
    new THREE.BufferAttribute(frequencyData, 1)
  );

  innerSphereGeometry.setAttribute(
    "aFrequency",
    new THREE.BufferAttribute(frequencyData, 1)
  );

  plane.geometry.verticesNeedsUpdates = true;
  plane.geometry.normalNeedsUpdates = true;
  plane.geometry.computeVertexNormals();
  plane.geometry.computeVertexNormals();

  outerSphere.geometry.verticesNeedsUpdates = true;
  outerSphere.geometry.normalNeedsUpdates = true;
  outerSphere.geometry.computeVertexNormals();
  outerSphere.geometry.computeVertexNormals();

  innerSphere.geometry.verticesNeedsUpdates = true;
  innerSphere.geometry.normalNeedsUpdates = true;
  innerSphere.geometry.computeVertexNormals();
  innerSphere.geometry.computeVertexNormals();

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
