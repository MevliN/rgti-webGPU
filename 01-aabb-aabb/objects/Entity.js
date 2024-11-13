export class Entity {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1]) {
        if (new.target === Entity) {
            throw new TypeError("Cannot construct Entity instances directly");
        }
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    update(t, dt) {
        throw new Error("Method 'update()' must be implemented.");
    }

    render(device, context, pipeline) {
        throw new Error("Method 'render()' must be implemented.");
    }
}