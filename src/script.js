import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from "gsap"

/**
 * Base -----------------------------------------------------------------------
 */

/**
 * Debug
 */
//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
//const axesHelper = new THREE.AxesHelper()
//scene.add(axesHelper)

// Test pour que les tableaux ne soien tplus cliquablent quand des trcs sont affichés
let mainScene = true

/**
 * Orverlay pages -----------------------------------------------------------------------
 */



//Les sliders --------------------------------------------------------
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
    console.log('slider next');
    currentIndex = (currentIndex + 1) % sliders[currentSlider].length;
    sliderImage.src = sliders[currentSlider][currentIndex];
});

prev.addEventListener("click", () => {
    console.log('slider prev');
    currentIndex = (currentIndex - 1 + sliders[currentSlider].length) % sliders[currentSlider].length;
    sliderImage.src = sliders[currentSlider][currentIndex];
});


//Les texts ------------------------------------------------------------------
//Bouton +
const fab = document.getElementById('fabOpen');
const overlaytext = document.getElementById('overtext');
//const open = document.getElementById('openModal');
const close = document.getElementById('closeModal');


function showModal(){
    //fab.setAttribute('aria-expanded','true');
    //fab.setAttribute('aria-pressed','true');
    fab.style.display = "none";
    document.documentElement.style.overflow = 'hidden';
    overlaytext.style.display = "flex";
    gsap.set(overlaytext, { opacity: 0});
    gsap.to(overlaytext, {
        opacity:1,
        duration: 0.5,
    })
}

function hideModal(){
    //fab.setAttribute('aria-expanded','false');
    //fab.setAttribute('aria-pressed','false');
    fab.style.display = "inline-grid";
    gsap.to(overlaytext, {
        opacity:0,
        duration: 0.5,
        onComplete: () => {
        overlaytext.style.display = "none"
        }
    })
}

fab.addEventListener('click', ()=>{ showModal(); });
//open.addEventListener('click', showModal);
close.addEventListener('click', hideModal);

//showModal();

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

/**
 * Textures -----------------------------------------------------------------------
 */

// Backed scene texture
const bakedTexture = textureLoader.load('textureScenePrincipale.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace;

//Tableaux textures
const textureTableauUn = textureLoader.load('imageTableau_EthicalQuestions.png');
const textureTableauDeux = textureLoader.load('imageTableau_HumanOrgnoids.png');
const textureTableauTrois = textureLoader.load('imageTableau_MindMap.jpg');
const textureSol = textureLoader.load('texture_sol.jpg');
textureTableauUn.colorSpace = THREE.SRGBColorSpace;
textureTableauDeux.colorSpace = THREE.SRGBColorSpace;
textureTableauTrois.colorSpace = THREE.SRGBColorSpace;
textureSol.colorSpace = THREE.SRGBColorSpace
textureTableauUn.wrapT = THREE.RepeatWrapping;
textureTableauUn.repeat.y = - 1;
textureTableauDeux.wrapT = THREE.RepeatWrapping;
textureTableauDeux.repeat.y = - 1;
textureTableauTrois.wrapT = THREE.RepeatWrapping;
textureTableauTrois.repeat.y = - 1;
textureSol.wrapT = THREE.RepeatWrapping;
textureSol.repeat.y = - 1;

//Text texture
const matCapTexture = textureLoader.load('text_Texture.png')
matCapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials -----------------------------------------------------------------------
 */

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const tableauUnMaterial = new THREE.MeshBasicMaterial({ map: textureTableauUn })
const tableauDeuxMaterial = new THREE.MeshBasicMaterial({ map: textureTableauDeux })
const tableauTroisMaterial = new THREE.MeshBasicMaterial({ map: textureTableauTrois })
const solMaterial = new THREE.MeshBasicMaterial({ map: textureSol })


/**
 * Fonts -----------------------------------------------------------------------
 */

let textLaurineCapdeville = null
const fontLoader = new FontLoader()
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Laurine Capdeville', {
                font: font,
                size: 0.5,
                depth: 0.05,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial({ color:'#3e0e0c', matcap: matCapTexture})
        textLaurineCapdeville = new THREE.Mesh(textGeometry, material)
        textLaurineCapdeville.position.set(1.62, 0.52, 2.43)
        textLaurineCapdeville.rotateX(-1)
        scene.add(textLaurineCapdeville)
    }
)

let textFacilitationGraphique = null
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Synthese Graphique', {
                font: font,
                size: 0.3,
                depth: 0.01,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial({ color:'#3e0e0c', matcap: matCapTexture})
        textFacilitationGraphique = new THREE.Mesh(textGeometry, material)
        textFacilitationGraphique.position.set(2.43, 0.15, 3)
        textFacilitationGraphique.rotateX(-1)
        scene.add(textFacilitationGraphique)
    }
)



/**
 * Model -----------------------------------------------------------------------
 */
let tableauUnMesh = null
let tableauDeuxMesh = null
let tableauTroisMesh = null
let solMesh = null
gltfLoader.load(
    'facilitation_simple_sol.glb',
    (gltf) => {
        
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial
        })

        scene.add(gltf.scene);
        // Get each object
        tableauUnMesh = gltf.scene.children.find((child) => child.name === 'Tableau_1')
        tableauDeuxMesh = gltf.scene.children.find((child) => child.name === 'Tabelau_2')
        tableauTroisMesh = gltf.scene.children.find((child) => child.name === 'Tabelau_2001')
        solMesh = gltf.scene.children.find((child) => child.name === 'Plane')

        // Apply materials
        tableauUnMesh.material = tableauUnMaterial
        tableauDeuxMesh.material = tableauDeuxMaterial
        tableauTroisMesh.material = tableauTroisMaterial
        solMesh.material = solMaterial
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

window.addEventListener('resize', () => {
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

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
    if(currentIntersect && mainScene){
        currentIndex = 0;
        switch(currentIntersect.object){
            case tableauUnMesh:
                currentSlider = 1;
                break

            case tableauDeuxMesh:
                currentSlider = 2;
                break

            case tableauTroisMesh:
                currentSlider = 3;
                break

            case textLaurineCapdeville:
                showModal();
                break
        }

        if(currentIntersect.object == textLaurineCapdeville){
            console.log('nous sommes super')
        }else{
            showOverlay(overlays.sliderOverlay)
            mainScene = false;
            if(sliders[currentSlider].length>1) {
                next.style.display = "flex";
                prev.style.display = "flex";
            }else{
                next.style.display = "none";
                prev.style.display = "none";
            }  
        }
    }
})

window.addEventListener('touchstart', () => {
    if(currentIntersect && mainScene){
        currentIndex = 0;
        switch(currentIntersect.object){
            case tableauUnMesh:
                currentSlider = 1;
                break

            case tableauDeuxMesh:
                currentSlider = 2;
                break

            case tableauTroisMesh:
                currentSlider = 3;
                break

            case textLaurineCapdeville:
                showModal();
                break
        }

        if(currentIntersect.object == textLaurineCapdeville){
            console.log('nous sommes super')
        }else{
            showOverlay(overlays.sliderOverlay)
            mainScene = false;
            if(sliders[currentSlider].length>1) {
                next.style.display = "flex";
                prev.style.display = "flex";
            }else{
                next.style.display = "none";
                prev.style.display = "none";
            }  
        }
    }
})



/**
 * Camera -----------------------------------------------------------------------
 */

// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.6133588556553488, 6.940435675686704, 7.7259938781719715);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 9;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0.6298416927480969, 1.7228212278209427, 1.270452935860918);


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
let mouvement = 0.002;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Screen Animation---------------------------------------------------------------
    if (camera.position.x < -0.5){
        mouvement = 0.002;
    }
    if(camera.position.x > 1.5){
        mouvement = -0.002;
    }
    camera.position.x = camera.position.x + mouvement;

    // Cast a ray from the mouse and handle events-----------------------------------
    raycaster.setFromCamera(mouse, camera)
    if(tableauTroisMesh && textLaurineCapdeville){
        const objectsToTest = [tableauUnMesh, tableauDeuxMesh, tableauTroisMesh, textLaurineCapdeville]
        const intersects = raycaster.intersectObjects(objectsToTest)
    
        //Changement de l'aspect de la souris
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
        if(currentIntersect && mainScene && controls.getAzimuthalAngle() < 0.95 && controls.getAzimuthalAngle() > -0.8){
            switch(currentIntersect.object) {
                case tableauUnMesh:
                    tableauUnMesh.scale.set(1.2, 1.2, 1.2)
                    tableauUnMesh.position.set(0.11, 2.3, -0.5)
                    break

                case tableauDeuxMesh:
                    tableauDeuxMesh.scale.set(1.2, 1.2, 1.2)
                    tableauDeuxMesh.position.set(2.8, 2.3, 0.29)
                    break

                case tableauTroisMesh:
                    tableauTroisMesh.scale.set(1.2, 1.2, 1.2)
                    tableauTroisMesh.position.set(-2.55, 2.3, 0.4)
                    break
                
                case textLaurineCapdeville:
                    textLaurineCapdeville.material.color.set('#f5e5ba')
                    textFacilitationGraphique.material.color.set('#f5e5ba')
                    break
            }
        }else{
            //set boards to original size & position
            tableauUnMesh.scale.set(1, 1, 1)
            tableauUnMesh.position.set(0.11383968591690063, 2.373289108276367, -0.6732069253921509)
            tableauDeuxMesh.scale.set(1, 1, 1)
            tableauDeuxMesh.position.set(2.815455675125122, 2.1664178371429443, 0.2282574474811554)
            tableauTroisMesh.scale.set(1, 1, 1)
            tableauTroisMesh.position.set(-2.640939950942993, 2.1664178371429443, 0.21580806374549866)
            textLaurineCapdeville.material.color.set('#3e0e0c')
            textFacilitationGraphique.material.color.set('#3e0e0c')
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