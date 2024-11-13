import { Entity } from './entity.js';

export class Tree extends Entity {
    constructor(position, rotation, scale) {
        super(position, rotation, scale);
        this.state = 'normal'; // Possible states: 'normal', 'onFire', 'burnt'
    }

    ignite() {
        if (this.state === 'normal') {
            this.state = 'onFire';
            console.log('Tree is on fire');
        }
    }

    extinguish() {
        if (this.state === 'onFire') {
            this.state = 'burnt';
            console.log('Tree is burnt');
        }
    }

    update(t, dt, player) {
        if (this.state === 'onFire') {
            // Check if the player is nearby and has water to extinguish the fire
            const dx = this.position[0] - player.position[0];
            const dy = this.position[1] - player.position[1];
            const dz = this.position[2] - player.position[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance <= 2 && player.hasWater) {
                this.extinguish();
                player.pourWater();
            }
        }
    }

    render(device, context, pipeline) {
        // Implement tree-specific rendering logic here
        // Example: Set up the rendering pipeline and draw the tree based on its state
        // This is a placeholder and should be replaced with actual WebGPU rendering code
        console.log(`Rendering tree at position ${this.position} with state ${this.state}`);
    }
}