import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
scene.background = new THREE.Color( "rgb(242, 218, 145)" );

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);
camera.position.z = 80;
camera.position.y = 10;
camera.position.x = -50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

const loader = new GLTFLoader();
var planet = null;
loader.load( '1.glb',
    function ( object )
    {
        planet = object.scene;
        planet.scale.set(20,20,20);
        scene.add( planet );
    } );

function animate()
{
    requestAnimationFrame(animate);

    planetRorating();
    
    renderer.render(scene, camera);
}

animate();

function planetRorating()
{
    if (planet == null) return;
    
    planet.rotation.y += 0.0025;
    planet.rotation.x += 0.003;
}

let camSpeed = 0.1;
let light = false;
let scroll = 0;
let currentMouseX;
let lastMouseX;
let canMove = false;

document.body.onscroll = handlerScroll;

document.body.addEventListener("mousedown", (e) => {
    if (e.button == 0)
    {
        canMove = true;
        ambientLight.intensity = 1;
        lastMouseX = ( event.clientX / window.innerWidth ) * 2 - 1;;
    }
})

document.body.addEventListener("mouseup", (e) => {
    if (e.button == 0)
    {
        canMove = false;
        ambientLight.intensity = 1;
    }
})

document.body.addEventListener("mousemove", (e) => {
    if (e.button == 0)
    {
        if (planet == null) return;
        if (canMove == false) return;
        
        currentMouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
        let delta = currentMouseX - lastMouseX;
        planet.position.x += delta * 100;
        lastMouseX = currentMouseX;
    }
})

function handlerScroll()
{
    const t = document.body.getBoundingClientRect().top;
    let newScroll = t - scroll;
    scroll = t;
    camera.position.y += newScroll * camSpeed;
}