import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load('textures/NormalMap.png');

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereGeometry(.7, 64, 64);


// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = .6;
material.roughness = .2;
// material.color = new THREE.Color(0x478bff);
material.normalMap = normalTexture;
material.side = THREE.DoubleSide;


// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(2, 3, 4)

const pointLightRed = new THREE.PointLight(0xff0000, 10)
pointLightRed.position.set(-1.86, 1, -1.59)

const pointLightBlue = new THREE.PointLight(0x0062ff, 10)
pointLightBlue.position.set(1.8, -1.50, -1.6);

// const pointLightHelperRed = new THREE.PointLightHelper( pointLightRed, 1 );
// const pointLightHelperBlue = new THREE.PointLightHelper( pointLightBlue, 1 );

const light3Color = {
    color: 0x0062ff,
}

scene.add(pointLight)
scene.add(pointLightRed)
scene.add(pointLightBlue)
// scene.add(pointLightHelperRed)
// scene.add(pointLightHelperBlue)

// Using GUI
const whiteLight = gui.addFolder('White Light')
const blueLight = gui.addFolder('Blue Light')
const redLight = gui.addFolder('Red Light')

gui.add(material, 'metalness', 0, 1).onChange(() => {   
    material.needsUpdate = true;
});
gui.add(material, 'roughness', 0, 1).onChange(() => {
    material.needsUpdate = true;
});

redLight.add(pointLightRed.position, 'x', -10, 10, 0.01);
redLight.add(pointLightRed.position, 'y', -10, 10, 0.01);
redLight.add(pointLightRed.position, 'z', -10, 10, 0.01);
redLight.add(pointLightRed, 'intensity', 0, 10, 0.01);

blueLight.add(pointLightBlue.position, 'x', -10, 10, 0.01);
blueLight.add(pointLightBlue.position, 'y', -10, 10, 0.01);
blueLight.add(pointLightBlue.position, 'z', -10, 10, 0.01);
blueLight.add(pointLightBlue, 'intensity', 0, 10, 0.01);
blueLight.addColor(light3Color, 'color').onChange(() => {
    pointLightBlue.color.setHex(light3Color.color);
    material.needsUpdate = true;
});

gui.close();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // transparent background
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove, false);

let mouseX = 0
let mouseY = 0


let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocumentMouseMove (event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

window.addEventListener('scroll', updateSphere, false)

function updateSphere (event) {
    sphere.position.y = window.screenY * .001;
}

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX - .001;
    targetY = mouseY - .001;

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .001 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .001 * (targetY - sphere.rotation.x)
    sphere.position.z += -.000001 * (targetY - sphere.rotation.x) 

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()