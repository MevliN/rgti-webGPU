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


// Create the playBackgroundAudio function to be called after a user gesture
async function playBackgroundAudio() {
    // Create a new AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Load the audio file
    const response = await fetch('Background_noise.mp3'); // Replace with your audio file path
    const audioData = await response.arrayBuffer();

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    // Create a buffer source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true; // Enable looping

    // Create a GainNode (to control volume)
    const gainNode = audioContext.createGain();

    // Set the gain to a value between 0 and 1 to make the sound quieter
    gainNode.gain.value = 0.2; // 0.2 means the sound will be quieter (20% of the original volume)

    // Connect the source to the gain node, and then to the destination (the speakers)
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback
    source.start();
}

// Wait for a user gesture (e.g., click) to play the background audio
document.addEventListener('click', () => {
    playBackgroundAudio().catch(error => {
        console.error('Error playing background audio:', error);
    });
});



await playBackgroundAudio();

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('Scene/Island.gltf');

const scene = loader.loadScene(loader.defaultScene);

const camera = scene.children[0];
const person = scene.children[1];
person.isDynamic = true;
person.aabb = {
    min: [-0.5, 0, -0.5],
    max: [0.5, 0, 0.5],
};

person.addComponent(new CharacterController(person, canvas));
camera.addComponent(new FirstPersonController(camera, canvas));

const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
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

// Add event listener for the F key
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyF') {
        const playerPosition = person.components[0].translation;
        let nearFire = false;
        let edgeDist = 95;

        scene.traverse(node => {
            if(node.name) {
                console.log(node.name);
            }
            if (node.name && node.name.startsWith('Ogenj')) {
                const dx = node.translation[0] - playerPosition[0];
                const dy = node.translation[1] - playerPosition[1];
                const dz = node.translation[2] - playerPosition[2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance <= 50) {
                    nearFire = true;
                }
            }
        });

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
                console.log('Bucket emptied');
            } else {
                console.log('No fire nearby');
            }
        }
    }
});

let fireTimer = 0;
let firstFire = true;

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

    if (firstFire) {
        gori(true, 'Center', 'Ogenj');
        console.log('First fire spawned at Center');
        firstFire = false;
    }

    // Increment the fire timer
    fireTimer += dt;

    // Call gori every 5 seconds to spawn a fire
    if (fireTimer >= 5000) {
        const centers = ['Center', 'Center.001', 'Center.002', 'Center.003', 'Center.004'];
        const randomCenter = centers[Math.floor(Math.random() * centers.length)];
        gori(true, randomCenter, 'Ogenj');
        console.log('Fire spawned at', randomCenter);
        fireTimer = 0; // Reset the timer
    }
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
