import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
scene.background = new THREE.Color( 167,242,242 );
const camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const file = './scene.gltf'
let model;
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.screenSpacePanning = true;


function addLight() {
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
  hemiLight.position.set( 0, 300, 0 );
  scene.add( hemiLight );

//   var dirLight = new THREE.DirectionalLight( 0xffffff );
// dirLight.position.set( 75, 300, -75 );
// scene.add( dirLight );

}


function adjustModelAndCamera() {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  model.position.x += (model.position.x - center.x);
  model.position.y += (model.position.y - center.y);
  model.position.z += (model.position.z - center.z);

  camera.near = size / 100;
  camera.far = size * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(center);
  camera.position.x += size / 0.2;
  camera.position.y += size / 2;
  camera.position.z += size / 100;
  camera.lookAt(center);
}



loader.load( file, function ( gltf ) {
    model = gltf.scene;
    addLight()
    adjustModelAndCamera();
    controls.update();
    scene.add( model );
},undefined, function ( error ) {
    console.error( error );
});


renderer.setSize( (window.innerWidth/2)*1.3, (window.innerHeight/2)*1.3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor( 0x444444, 20 );

document.body.appendChild( renderer.domElement );
function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
}
animate();
