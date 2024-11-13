import { Entity } from './entity.js';

export class Flame extends Entity {
    constructor(position, rotation, scale, extinguishRadius = 2) {
        super(position, rotation, scale);
        this.extinguishRadius = extinguishRadius;
        this.isExtinguished = false;
    }

    update(t, dt, player) {
        if (this.isExtinguished) return;

        // Calculate the distance between the flame and the player
        const dx = this.position[0] - player.position[0];
        const dy = this.position[1] - player.position[1];
        const dz = this.position[2] - player.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Extinguish the flame if the player is within the extinguish radius
        if (distance <= this.extinguishRadius && player.hasWater) {
            this.isExtinguished = true;
            player.pourWater();
            console.log('Flame extinguished');
        }
    }

    render(device, context, pipeline) {
        if (this.isExtinguished) return;

        // Implement flame-specific rendering logic here
        // Example: Set up the rendering pipeline and draw the flame
        // This is a placeholder and should be replaced with actual WebGPU rendering code
        console.log('Rendering flame at position', this.position);
    }
}