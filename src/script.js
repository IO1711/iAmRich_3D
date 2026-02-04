import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTextute = textureLoader.load('/textures/matcaps/3.png')
matcapTextute.colorSpace = THREE.SRGBColorSpace

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTextute })

/**
 * Font loader
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        console.log('Font loaded')
        const textGeometry = new TextGeometry(
            'I am rich',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3,
                bevelThickness: 0.03
            }
        )
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)
        /*textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.z - 0.02) * 0.5
        )*/
       textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
    }
)
/**
 * Object
 */
//const donutGeometry = new THREE.TorusGeometry(0.1, 0.01, 20, 45)

const randomShapes = [new THREE.TorusGeometry(0.1, 0.01, 20, 45), new THREE.BoxGeometry(0.2, 0.2, 0.2, 3, 3, 3), new THREE.TorusKnotGeometry(0.1, 0.03, 50, 45)]

for(let i = 0; i < 1000; i++){
    const mesh = new THREE.Mesh(randomShapes[Math.floor(Math.random() * randomShapes.length)], material)
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    mesh.rotation.x = Math.random() * Math.PI
    mesh.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    mesh.scale.set(scale, scale, scale)

    scene.add(mesh)
}

//scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()