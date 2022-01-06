import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

let audioCtx;
let analyser;
let audioSrc;
let mode = "red"; // red or #ff00ff
let songNum = 0;
document.querySelector(".overlay").addEventListener("click", () => {
  // console.log(audioCtx);
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  audioSrc = audioCtx.createMediaElementSource(
    document.getElementById("test-song")
  );
  analyser = audioCtx.createAnalyser();

  document.querySelector(".overlay").classList.add("hide");
  document.getElementById("test-song").play();
  analyser.getByteFrequencyData(frequencyData);
  console.log(audioCtx);
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);
  document.getElementById('change-btn').classList.remove('hide')
  document.getElementById("test-song").classList.remove('hide')
});

// setInterval(() => {
//   document.getElementById("test-song").play();
// }, 500)

const frequencyData = new Uint8Array(210);

const sizes = { height: window.innerHeight, width: window.innerWidth };
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);
});

const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 10, 17);
const planeVertexCount = planeGeometry.attributes.position.count;

const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  
  attribute vec3 position;
  attribute float aFrequency;
  varying float vFrequency;
  void main()
  {
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += (aFrequency - 150.0) * 0.15;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
  
      gl_Position = projectedPosition;
  
      vFrequency = aFrequency;
  }`,
  fragmentShader: `
  precision mediump float;
  
  varying float vFrequency;
  void main()
  {
  
      gl_FragColor = vec4(1.0, vFrequency/350.0, ${
        mode == "red" ? 0.0 : 1.0
      }, 1.0);
  }
  `,
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
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  
  attribute vec3 position;
  attribute float aFrequency;
  attribute float aFactor;
  varying float vFrequency;
  void main()
  {
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      if(aFrequency > 100.0){
          modelPosition.y *= aFrequency * 0.01;
      }
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
  
      gl_Position = projectedPosition;
  
      vFrequency = aFrequency * 1.0;
  }`,
  fragmentShader: `
  precision mediump float;
  
  varying float vFrequency;
  void main()
  {
  
      gl_FragColor = vec4(1.0, vFrequency/350.0, ${
        mode == "red" ? 0.0 : 1.0
      }, 1.0);
  }
  `,
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
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  
  attribute vec3 position;
  attribute float aFrequency;
  attribute float aFactor;
  varying float vFrequency;
  void main()
  {
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      if(aFrequency > 100.0){
          modelPosition.y *= aFrequency * 0.01;
      }
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
  
      gl_Position = projectedPosition;
  
      vFrequency = aFrequency * 1.0;
  }`,
  fragmentShader: `
  precision mediump float;
  
  varying float vFrequency;
  void main()
  {
  
      gl_FragColor = vec4(1.0, vFrequency/350.0, ${
        mode == "red" ? 0.0 : 1.0
      }, 1.0);
  }
  `,
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
camera.position.z = 55;
camera.position.x = 0;
camera.position.y = 10;

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.5);
directionalLight.position.x = -20;
directionalLight.position.z = 10;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xfffd00, 0.3);
scene.add(ambientLight);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);

let fogColor = new THREE.Color(mode);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.25, 10);

let clock = new THREE.Clock();
function animate() {
  // console.log(frequencyData);
  if (analyser) analyser.getByteFrequencyData(frequencyData);
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
  // console.log(max, min);

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
  outerSphere.rotation.y = clock.getElapsedTime() * 1.5;

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// const updateMode = () => {};

// document.getElementById("change-btn").addEventListener("click", () => {
//   // console.log("clicked", mode);
//   if (mode === "red") {
//     mode = "#ff00ff";
//     updateMode();
//   } else {
//     mode = "red";
//     updateMode();
//   }
// });

// setInterval(() => {
//   scene.background = new THREE.Color(
//     `rgb(${Math.round(Math.random() * 300)},${Math.round(
//       Math.random() * 300
//     )},${Math.round(Math.random() * 300)})`
//   );
// }, 1500);
document.getElementById("change-btn").addEventListener("click", () => {
  // console.log("clicked", mode);
  document.getElementById('test-song').src = `./Music/test-song${songNum++%4 + 1}.mp3`
  console.log()
  
  document.getElementById("test-song").play();
});