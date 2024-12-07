import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { CharacterController } from 'engine/controllers/CharacterController.js';
import { FirstPersonController } from 'engine/controllers/FirstPersonController.js';

import {
    Camera,
    Model,
    Node,
    Transform,
} from 'engine/core.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from 'engine/core/MeshUtils.js';

import { Physics } from './Physics.js';

import { 
    mat4,
    vec3,
    quat
} from 'glm';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';

// Audio setup with Web Audio API
let audioContext;
let audioBuffer;
let gainNode;
let source;
let isPlaying = false;
let isMuted = false;

// Load and initialize the audio
async function initializeAudio() {
    try {
        // Create an AudioContext
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Fetch and decode the audio file
        const response = await fetch('Background_noise.mp3');
        const audioData = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(audioData);

        // Create a GainNode for volume control
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.05;

        console.log('Audio initialized successfully.');
    } catch (error) {
        console.error('Error initializing audio:', error);
    }
}

// Play or resume audio
function playAudio() {
    if (!audioContext || !audioBuffer) {
        console.error('Audio not initialized yet.');
        return;
    }

    // Create a new source node for each playback
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true; // Enable looping

    // Connect nodes: Source -> Gain -> Destination (speakers)
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback
    source.start();
    isPlaying = true;
    console.log('Audio playing.');
}

// Toggle mute
function toggleMute(volumeButton) {
    if (!gainNode) {
        console.error('GainNode not initialized.');
        return;
    }

    if (isMuted) {
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Restore volume
        volumeButton.textContent = 'volume_up';
        isMuted = false;
        console.log('Audio unmuted.');
    } else {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Mute
        volumeButton.textContent = 'volume_off';
        isMuted = true;
        console.log('Audio muted.');
    }
}

const volumeButton = document.getElementById('volume-button');
volumeButton.addEventListener('click', async () => {
    if (!audioContext) {
        await initializeAudio(); // Initialize the audio if not already done
    }

    if (!isPlaying) {
        playAudio(); // Start playback on icon click
        volumeButton.textContent = 'volume_up';
    } else {
        toggleMute(volumeButton); // Toggle mute if audio is already playing
    }
});

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('Scene/Island.gltf');

const scene = loader.loadScene(loader.defaultScene);

const camera = loader.loadNode("Camera");
const person = loader.loadNode("Oseba");
person.isDynamic = true;
person.aabb = {
    min: [-0.5, 0, -0.5],
    max: [0.5, 0, 0.5],
};

person.addComponent(new CharacterController(person, canvas));
camera.addComponent(new FirstPersonController(camera, canvas));

loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Desno'));
loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Levo'));

const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});

scene.traverse(node => {
    if (node.name && node.name.startsWith('Ogenj')) {
        console.log(`Ogenj node position: ${node.translation}`);
    }
});

jePozgano(false, 'Center', 'ZivoDrevo', 'PozganoDrevo', 'Ogenj');
jePozgano(false, 'Center.001', 'ZivoDrevo.001', 'PozganoDrevo.001', 'Ogenj.001');
jePozgano(false, 'Center.002', 'ZivoDrevo.002', 'PozganoDrevo.002', 'Ogenj.002');
jePozgano(false, 'Center.003', 'ZivoDrevo.003', 'PozganoDrevo.003', 'Ogenj.003');
jePozgano(false, 'Center.004', 'ZivoDrevo.004', 'PozganoDrevo.004', 'Ogenj.004');

napolniVedro(true, 'Oseba', 'PolnoVedro', 'PraznoVedro');


loader.loadNode('ZivoDrevo').isStatic = true;
loader.loadNode('PozganoDrevo').isStatic = true;
loader.loadNode('ZivoDrevo.001').isStatic = true;
loader.loadNode('PozganoDrevo.001').isStatic = true;
loader.loadNode('ZivoDrevo.002').isStatic = true;
loader.loadNode('PozganoDrevo.002').isStatic = true;
loader.loadNode('ZivoDrevo.003').isStatic = true;
loader.loadNode('PozganoDrevo.003').isStatic = true;
loader.loadNode('ZivoDrevo.004').isStatic = true;
loader.loadNode('PozganoDrevo.004').isStatic = true;
loader.loadNode('Morje').isStatic = true;
loader.loadNode('Nebo').isStatic = true;
loader.loadNode('Kamen').isStatic = true;
loader.loadNode('Kamen.001').isStatic = true;
loader.loadNode('Kamen.002').isStatic = true;
loader.loadNode('Kamen.003').isStatic = true;
loader.loadNode('Kamen.004').isStatic = true;
loader.loadNode('Kamen.005').isStatic = true;
loader.loadNode('Kamen.006').isStatic = true;
loader.loadNode('Kamen.007').isStatic = true;

// Sonce
const light = new Node();
light.addComponent(new Light({
    direction: [-1, 1, 1],
}));
scene.addChild(light);

var vedro = false;

const centers = ['Center', 'Center.001', 'Center.002', 'Center.003', 'Center.004'];
const trees = ['ZivoDrevo', 'ZivoDrevo.001', 'ZivoDrevo.002', 'ZivoDrevo.003', 'ZivoDrevo.004'];
const burned = ['PozganoDrevo', 'PozganoDrevo.001', 'PozganoDrevo.002', 'PozganoDrevo.003', 'PozganoDrevo.004'];
const fires = ['Ogenj', 'Ogenj.001', 'Ogenj.002', 'Ogenj.003', 'Ogenj.004'];
const  = [false, false, false, false, false];
const burnedTrees = [false, false, false, false, false];
const burnTimer = [0, 0, 0, 0, 0];
const distances = [1000, 1000, 1000, 1000, 1000];
var Count = 0;
var burnedCount = 0;
var extinguished = 0;


// Add event listener for the F key
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyF') {
        const playerPosition = person.components[0].translation;

        let closestFire = null;
        let minDistance = 1000;
        let edgeDist = 90;

        for(let i = 0; i < 5; i++) {
            if (!loader.loadNode(fires[i])) {
                distances[i] = 1000;
                continue;
            }
            else {
                // Calculate the distance between the player and the fire
                const firePosition = loader.loadNode(centers[i]).components[0].translation;
                const distance = vec3.distance(playerPosition, firePosition);
                distances[i] = distance;
            }
        }

        // Find the closest fire
        for (let i = 0; i < 5; i++) {
            if (distances[i] < minDistance) {
                minDistance = distances[i];
                closestFire = i;
            }
        }

        let nearFire = minDistance < 30;

        console.log('Closest fire:', centers[closestFire], 'Distance:', minDistance);

        // Check if the player is near the edge of the main platform
        if (!vedro) {
            if (playerPosition[0] > edgeDist || playerPosition[0] < -edgeDist || playerPosition[2] > edgeDist || playerPosition[2] < -edgeDist) {
                vedro = true;
                console.log('Bucket filled');
            } else {
                console.log('Not near water');
            }
        }
        else {
            if (nearFire && !(playerPosition[0] > edgeDist || playerPosition[0] < -edgeDist || playerPosition[2] > edgeDist || playerPosition[2] < -edgeDist)) {
                vedro = false;
                [closestFire] = false;
                gori(false, centers[closestFire], fires[closestFire]);
                console.log('Fire extinguished:', centers[closestFire]);
                Count--;
                console.log(' trees:', Count);
                extinguished++;
                console.log('Extinguished fires:', extinguished);
            } else {
                console.log('No fire nearby');
            }
        }
    }
});


let fireTimer = 25;
//let firstFire = true;

let t = 0;

// for walk animation
let prevPlayerPosition = 0;
let left = false;
let animationTimer = 0;
let animationDelay = 0.5;
let movementThreshold = 0.001;

function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    physics.update(time, dt);

    // offset kamere od osebe
    const offset = vec3.fromValues(-5, -75, -25);

    // točka kamor gleda kamera
    const playerPosition = [person.components[0].translation[0] + 5, person.components[0].translation[1], person.components[0].translation[2]];

    // Premikanje kamere z osebo
    const cameraPosition = vec3.create();
    const playerRotation = person.components[0].rotation; // Assume quaternion
    const rotatedOffset = vec3.create();
    vec3.transformQuat(rotatedOffset, offset, playerRotation); // Rotate offset by player's rotation
    vec3.add(cameraPosition, playerPosition, rotatedOffset);

    camera.components[0].translation = cameraPosition;

    // Kamera spremlja točko pogleda
    const lookAtMatrix = mat4.create();
    const up = vec3.fromValues(0, 1, 0); // Up vector
    mat4.targetTo(lookAtMatrix, cameraPosition, playerPosition, up);

    // Rotacija kamere
    const rotation = quat.create();
    mat4.getRotation(rotation, lookAtMatrix);
    camera.components[0].rotation = rotation;

    if (vedro) {
        napolniVedro(true, 'Oseba', 'PolnoVedro', 'PraznoVedro');
    }
    else {
        napolniVedro(false, 'Oseba', 'PolnoVedro', 'PraznoVedro');
    }

    /*
    if (firstFire) {
        gori(false, 'Center', 'Ogenj');
        gori(false, 'Center.001', 'Ogenj.001');
        gori(false, 'Center.002', 'Ogenj.002');
        gori(false, 'Center.003', 'Ogenj.003');
        gori(false, 'Center.004', 'Ogenj.004');
        firstFire = false;
    }
    */
    
    // Check if the tree is 
    for (let i = 0; i < 5; i++) {
        if ([i]) {
            burnTimer[i] += dt;
            if (burnTimer[i] >= 20) {
                [i] = false;
                gori(false, centers[i], fires[i]);
                jePozgano(true, centers[i], trees[i], burned[i], fires[i]);
                burnTimer[i] = 0;
                burnedTrees[i] = true;
                Count--;
                console.log('Tree burned down:', centers[i]);
                burnedCount++;
                console.log('Burned trees:', burnedCount);
            }
        }
    }

    // Increment the fire timer
    if ((Count < 5 - burnedCount) && burnedCount < 5){
        fireTimer += dt;

        // Call gori every 7 seconds to spawn a fire
        // Because we have minutes and I needed to check that
        if (fireTimer >= 7) {
            let randomIndex = -1;
            while (true) {
                randomIndex = Math.floor(Math.random() * .length);
                if (!burnedTrees[randomIndex]){ 
                    if (![randomIndex]){
                        console.log('Found non- tree:', randomIndex);
                        [randomIndex] = true;
                        Count++;
                        console.log(' trees:', Count);
                        break;
                    }
                    else {
                        console.log('Tree already :', randomIndex);
                    }
                }
                else {
                    console.log('Tree already burned:', randomIndex);
                }
            }
            gori(true, centers[randomIndex], fires[randomIndex]);
            console.log('Fire', fires[randomIndex], 'spawned at', centers[randomIndex]);
            fireTimer = 0; // Reset the timer
        }
    }


    // for displaying game score
    var all = 5;

    // overall timer
    t += dt;

    // Update the count down every time the tree burns down
    var x = setInterval(function() {

        // Display the result in the element with id="demo"
        var minutes = Math.trunc(t / 60);
        var seconds = Math.trunc(t % 60);
        
        if (minutes > 0) {
            document.getElementById("demo").innerHTML = "Burned: " + burnedCount + " / " + all + " Extinguished: " + extinguished + " / 10 " + "Time: " + minutes + "m " + seconds + "s";
        }
        else {
            document.getElementById("demo").innerHTML = "Burned: " + burnedCount + " / " + all + " Extinguished: " + extinguished + " / 10 " + " Time: " + seconds + "s";
        }
        
        // If the count down is finished, write some text
        if (burnedCount == all) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "Game Over";
        }
        else if (extinguished == 10) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "You Win!";
        }
    }, 1000);

    // Walk animation
    animationTimer += dt;
    const movementDelta = vec3.distance(playerPosition, prevPlayerPosition);

    if (movementDelta < movementThreshold) {
        // Stop walking animation and switch to standing
        if (!loader.loadNode('Oseba').children.includes(loader.loadNode('Oseba.Stoji'))) {
            loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Desno'));
            loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Levo'));
            loader.loadNode('Oseba').addChild(loader.loadNode('Oseba.Stoji'));
        }
    } else {
        // Animate walking at a slower pace
        if (animationTimer >= animationDelay) {
            animationTimer = 0; // Reset the timer for the next animation frame
            if (left) {
                loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Stoji'));
                loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Levo'));
                loader.loadNode('Oseba').addChild(loader.loadNode('Oseba.Desno'));
                left = false;
            } else {
                loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Stoji'));
                loader.loadNode('Oseba').removeChild(loader.loadNode('Oseba.Desno'));
                loader.loadNode('Oseba').addChild(loader.loadNode('Oseba.Levo'));
                left = true;
            }
        }
    }

    prevPlayerPosition = playerPosition;
}



function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();

function gori (gori, center, ogenj) {
    if (!gori) {
        loader.loadNode(center).removeChild(loader.loadNode(ogenj));
    }
    else {
        loader.loadNode(center).addChild(loader.loadNode(ogenj));
    }
}

function jePozgano (jePozgano, center, zivoDr, pozganoDr, ogenj) {
    if (jePozgano) {
        loader.loadNode(center).addChild(loader.loadNode(pozganoDr));
        loader.loadNode(center).removeChild(loader.loadNode(zivoDr));
        gori(false, center, ogenj);
    }
    else {
        loader.loadNode(center).addChild(loader.loadNode(zivoDr));
        loader.loadNode(center).removeChild(loader.loadNode(pozganoDr));
        gori(false, center, ogenj);
    }
}

function napolniVedro (jePolno, oseba, polnoVedro, praznoVedro) {
    if (jePolno) {
        loader.loadNode(oseba).addChild(loader.loadNode(polnoVedro));
        loader.loadNode(oseba).removeChild(loader.loadNode(praznoVedro));
    }
    else {
        loader.loadNode(oseba).addChild(loader.loadNode(praznoVedro));
        loader.loadNode(oseba).removeChild(loader.loadNode(polnoVedro));
    }
}
