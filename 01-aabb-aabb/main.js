import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
import { CharacterController } from 'engine/controllers/CharacterController.js';
import { FirstPersonController } from 'engine/controllers/FirstPersonController.js';

import { Camera, Model } from 'engine/core.js';

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

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('Scene/Island.gltf');

const scene = loader.loadScene(loader.defaultScene);
const camera = scene.children[0];
const person = scene.children[5];
person.isDynamic = true;
person.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};

person.addComponent(new CharacterController(person, canvas));
camera.addComponent(new FirstPersonController(camera, canvas));

jePozgano(false, 'Center', 'ZivoDrevo', 'PozganoDrevo', 'Ogenj');
jePozgano(true, 'Center.001', 'ZivoDrevo.001', 'PozganoDrevo.001', 'Ogenj.001');
jePozgano(true, 'Center.002', 'ZivoDrevo.002', 'PozganoDrevo.002', 'Ogenj.002');
jePozgano(true, 'Center.003', 'ZivoDrevo.003', 'PozganoDrevo.003', 'Ogenj.003');
jePozgano(true, 'Center.004', 'ZivoDrevo.004', 'PozganoDrevo.004', 'Ogenj.004');

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
}


function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();


// funkcije gorenja
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
        loader.loadNode(center).removeChild(loader.loadNode(zivoDr));
        gori(false, center, ogenj);
    }
    else {
        loader.loadNode(center).addChild(loader.loadNode(zivoDr));
        loader.loadNode(center).removeChild(loader.loadNode(pozganoDr));
        gori(false, center, ogenj);
    }
}

