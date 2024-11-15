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

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load('Scene/Island.gltf');

const scene = loader.loadScene(loader.defaultScene);
const camera = loader.loadNode("Camera");
scene.children[0].components[0].rotation[3] += 1;

const person = loader.loadNode("Person");
//camera.addComponent(new FirstPersonController(camera, canvas));
person.isDynamic = true;
//camera.isDynamic = true;
person.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};

person.addComponent(new CharacterController(person, canvas));

loader.loadNode('terrain').isStatic = true;
loader.loadNode('palm leaves').isStatic = true;
loader.loadNode('palm stems').isStatic = true;
loader.loadNode('plants').isStatic = true;
loader.loadNode('rocks').isStatic = true;
loader.loadNode('grass').isStatic = true;
loader.loadNode('Plane').isStatic = true;

const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});

function update(time, dt) {
    function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    physics.update(time, dt);

    // Define an offset for the camera (e.g., 5 units behind, 2 units above)
    const offset = vec3.fromValues(-3, -25, -15);

    // Get the player's position
    const playerPosition = person.components[0].translation;

    // Calculate the new camera position relative to the player
    const cameraPosition = vec3.create();
    const playerRotation = person.components[0].rotation; // Assume quaternion
    const rotatedOffset = vec3.create();
    vec3.transformQuat(rotatedOffset, offset, playerRotation); // Rotate offset by player's rotation
    vec3.add(cameraPosition, playerPosition, rotatedOffset);

    // Update the camera's position
    camera.components[0].translation = cameraPosition;

    // Make the camera look at the player
    const lookAtMatrix = mat4.create();
    const up = vec3.fromValues(0, 1, 0); // Up vector
    mat4.targetTo(lookAtMatrix, cameraPosition, playerPosition, up);

    // Extract rotation from the look-at matrix
    const rotation = quat.create();
    mat4.getRotation(rotation, lookAtMatrix);
    camera.components[0].rotation = rotation;
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
