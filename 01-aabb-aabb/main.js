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

loader.loadNode('Deblo').isStatic = true;
loader.loadNode('Deblo.001').isStatic = true;
loader.loadNode('Listi').isStatic = true;
loader.loadNode('Listi.001').isStatic = true;
loader.loadNode('Morje').isStatic = true;
loader.loadNode('Nebo').isStatic = true;
loader.loadNode('Nebo.001').isStatic = true;
loader.loadNode('Nebo.002').isStatic = true;
loader.loadNode('Nebo.003').isStatic = true;
loader.loadNode('Kamen').isStatic = true;
loader.loadNode('Kamen.001').isStatic = true;
loader.loadNode('Kamen.002').isStatic = true;
loader.loadNode('Kamen.003').isStatic = true;
loader.loadNode('Kamen.004').isStatic = true;
loader.loadNode('Kamen.005').isStatic = true;
loader.loadNode('Kamen.006').isStatic = true;
loader.loadNode('Kamen.007').isStatic = true;

const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});

const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

let cameraVerticalOffset = 0;

function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    physics.update(time, dt);

    const cameraSpeed = 20;

    // da ne more pogledat prenizko (pod naš pesek) ali preveč navpično
    if (keys['KeyE'] && cameraVerticalOffset + dt * cameraSpeed < 25) {
        cameraVerticalOffset += dt * cameraSpeed;
    }
    if (keys['KeyQ'] && cameraVerticalOffset - dt * cameraSpeed > -25) {
        cameraVerticalOffset -= dt * cameraSpeed;
    }

    // kolko je kamera zamaknjena od osebe
    const offset = vec3.fromValues(-5, -70, -25);

    const playerPosition = person.components[0].translation;

    const cameraPosition = vec3.create();
    const playerRotation = person.components[0].rotation;
    const rotatedOffset = vec3.create();
    vec3.transformQuat(rotatedOffset, offset, playerRotation);
    vec3.add(cameraPosition, playerPosition, rotatedOffset);

    cameraPosition[1] += cameraVerticalOffset;

    camera.components[0].translation = cameraPosition;

    const lookAtMatrix = mat4.create();
    const up = vec3.fromValues(0, 1, 0);
    mat4.targetTo(lookAtMatrix, cameraPosition, playerPosition, up);

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
