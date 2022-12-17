export interface Size {
	width: number
	height: number
}

export interface Vector2 {
	x: number
	y: number
}

export class Vector2 implements Vector2 {
	constructor(public x: number, public y: number) {}

	public set(data: { x?: number; y?: number }) {
		this.x = data.x ?? 0
		this.y = data.y ?? 0
	}

	public velocity(data: { x?: number; y?: number }) {
		this.x += data.x ?? 0
		this.y += data.y ?? 0
	}
}

export class Size {
	constructor(public width: number, public height: number) {}

	public set(data: { width?: number; height?: number }) {
		if (data.width) this.width = data.width
		if (data.height) this.height = data.height
	}
}
