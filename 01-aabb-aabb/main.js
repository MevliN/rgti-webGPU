import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
import { CharacterController } from 'engine/controllers/CharacterController.js';

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

const person = loader.loadNode("Person");
person.addComponent(new CharacterController(person, canvas));
person.isDynamic = true;
person.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};

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
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
    
    physics.update(time, dt);

    /* scene.children[0].components[0].translation[0] = scene.children[7].components[0].translation[0];
	scene.children[0].components[0].translation[1] = scene.children[7].components[0].translation[1];
	scene.children[0].components[0].translation[2] = scene.children[7].components[0].translation[2]; */

    // console.log(scene.children[7].components[0])

}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
