import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from "gsap"

/**
 * Base -----------------------------------------------------------------------
 */

// Debug
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Test pour que les tableaux ne soien tplus cliquablent quand des trcs sont affichés
let mainScene = true

/**
 * Orverlay pages -----------------------------------------------------------------------
 */

const overlays = {
    sliderOverlay: document.querySelector(".overlay.sliders")
}

//slider
const sliderImage = document.getElementById("sliderImage");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

//close buttons
document.querySelectorAll(".close-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const overlay = event.target.closest(".overlay");
        hideOverlay(overlay);
    })
})

//show the overlay on screen
const showOverlay = (overlay) => {
    overlay.style.display = "flex";
    sliderImage.src = sliders[currentSlider][currentIndex];
    gsap.set(overlay, { opacity: 0});
    gsap.to(overlay, {
        opacity:1,
        duration: 0.5,
    })
}

//Hide the overlay from screen
const hideOverlay = (overlay) => {
    gsap.to(overlay, {
        opacity:0,
        duration: 0.5,
        onComplete: () => {
        overlay.style.display = "none"
        }
    })
    mainScene = true;
}

//Images dans le slider affiché
const sliders = {
    1: [
        "imageTableau_EthicalQuestions.png",
        "imageTableau_Definition.png",
        "imageTableau_Complexification.png",
        "imageTableau_Organization.png"
    ],
    2: [
        "imageTableau_HumanOrgnoids.png"
    ],
    3: [
        "imageTableau_MindMap.jpg"
    ]
};

// Un seul slider, on modifie juste les photos mises dans l'element html
let currentIndex = 0;
let currentSlider = 0;

next.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % sliders[currentSlider].length;
    sliderImage.src = sliders[currentSlider][currentIndex];
});

prev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + sliders[currentSlider].length) % sliders[currentSlider].length;
    sliderImage.src = sliders[currentSlider][currentIndex];
});

/**
 * Loaders -----------------------------------------------------------------------
 */

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//Fonts
const fontLoader = new FontLoader()



/**
 * Textures -----------------------------------------------------------------------
 */

// Backed scene texture
const bakedTexture = textureLoader.load('textureScenePrincipale.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

//Tableaux textures
const textureTableauUn = textureLoader.load('imageTableau_EthicalQuestions.png')
const textureTableauDeux = textureLoader.load('imageTableau_HumanOrgnoids.png')
const textureTableauTrois = textureLoader.load('imageTableau_MindMap.jpg')
textureTableauUn.colorSpace = THREE.SRGBColorSpace
textureTableauDeux.colorSpace = THREE.SRGBColorSpace
textureTableauTrois.colorSpace = THREE.SRGBColorSpace
textureTableauUn.wrapT = THREE.RepeatWrapping;
textureTableauUn.repeat.y = - 1;
textureTableauDeux.wrapT = THREE.RepeatWrapping;
textureTableauDeux.repeat.y = - 1;
textureTableauTrois.wrapT = THREE.RepeatWrapping;
textureTableauTrois.repeat.y = - 1;

/**
 * Materials -----------------------------------------------------------------------
 */

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const tableauUnMaterial = new THREE.MeshBasicMaterial({ map: textureTableauUn })
const tableauDeuxMaterial = new THREE.MeshBasicMaterial({ map: textureTableauDeux })
const tableauTroisMaterial = new THREE.MeshBasicMaterial({ map: textureTableauTrois })

/**
 * Model -----------------------------------------------------------------------
 */
let tableauUnMesh = null
let tableauDeuxMesh = null
let tableauTroisMesh = null
gltfLoader.load(
    'modelBlender.glb',
    (gltf) =>
    {
        
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)
        // Get each object
        tableauUnMesh = gltf.scene.children.find((child) => child.name === 'Tableau_1')
        tableauDeuxMesh = gltf.scene.children.find((child) => child.name === 'Tabelau_2')
        tableauTroisMesh = gltf.scene.children.find((child) => child.name === 'Tabelau_2001')

        // Apply materials
        tableauUnMesh.material = tableauUnMaterial
        tableauDeuxMesh.material = tableauDeuxMaterial
        tableauTroisMesh.material = tableauTroisMaterial
    }
)

/**
 * Raycaster -----------------------------------------------------------------------
 */

const raycaster = new THREE.Raycaster()
let currentIntersect = null
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

/**
 * Sizes -----------------------------------------------------------------------
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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () =>
{
    if(currentIntersect && mainScene){
        currentIndex = 0;
        switch(currentIntersect.object){
            case tableauUnMesh:
                console.log('click on object 1')
                currentSlider = 1;
                break

            case tableauDeuxMesh:
                console.log('click on object 2')
                currentSlider = 2;
                break

            case tableauTroisMesh:
                console.log('click on object 3')
                currentSlider = 3;
                break
        }
        console.log(currentIndex)
        showOverlay(overlays.sliderOverlay)
        mainScene = false;
        if(sliders[currentSlider].length>1){
            next.style.display = "flex";
            prev.style.display = "flex";
        }else{
            next.style.display = "none";
            prev.style.display = "none";
        }
    }
})

/**
 * Camera -----------------------------------------------------------------------
 */

// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2.945081815365921, 5.274112703137292, 5.888552619312466)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(-2.3595239729713784, 2.167683496199888, 1.553650428545754)

/**
 * Renderer -----------------------------------------------------------------------
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0.0);


/**
 * Animate -----------------------------------------------------------------------
 */

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Cast a ray from the mouse and handle events
    raycaster.setFromCamera(mouse, camera)
    if(tableauTroisMesh){
        const objectsToTest = [tableauUnMesh, tableauDeuxMesh, tableauTroisMesh]
        const intersects = raycaster.intersectObjects(objectsToTest)
    
        if(intersects.length){
            if(!currentIntersect){
                document.body.style.cursor = "pointer"
            }
            currentIntersect = intersects[0]
        }
        else{
            if(currentIntersect){
                document.body.style.cursor = "default"
            }
        currentIntersect = null
        }
        //to make boards bigger on mouse intersection
        if(currentIntersect && mainScene){
            switch(currentIntersect.object) {
                case tableauUnMesh:
                    tableauUnMesh.scale.set(1.2, 1.2, 1.2)
                    tableauUnMesh.position.set(-3.1, 2.4, 0.75)
                    break

                case tableauDeuxMesh:
                    tableauDeuxMesh.scale.set(1.2, 1.2, 1.2)
                    tableauDeuxMesh.position.set(-0.75, 2.3, -0.7)
                    break

                case tableauTroisMesh:
                    tableauTroisMesh.scale.set(1.2, 1.2, 1.2)
                    tableauTroisMesh.position.set(-4.15, 2.25, 3.3)
                    break
            }
        }else{
            //set boards to original size & position
            tableauUnMesh.scale.set(1, 1, 1)
            tableauUnMesh.position.set(-3.153846502304077, 2.373289108276367, 0.6512370109558105)
            tableauDeuxMesh.scale.set(1, 1, 1)
            tableauDeuxMesh.position.set( -0.7122294902801514, 2.1664178371429443, -0.8150078058242798)
            tableauTroisMesh.scale.set(1, 1, 1)
            tableauTroisMesh.position.set(-4.269794464111328, 2.1664178371429443, 3.322157859802246)
        }
    }


    // Update controls
    controls.update()

    //console.log(controls.target);
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()