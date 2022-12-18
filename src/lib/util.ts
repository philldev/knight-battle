export interface Size {
	width: number
	height: number
}

export interface IVector2 {
	x: number
	y: number
}

export type Axis = keyof IVector2

export class Vector2 implements IVector2 {
	constructor(public x: number, public y: number) {}

	public set(data: { x?: number; y?: number }): void
	public set(data: Vector2): void
	public set(data: { x?: number; y?: number } | Vector2) {
		this.x = data.x ?? 0
		this.y = data.y ?? 0
	}

	public add(axis: 'x' | 'y', value: number) {
		this[axis] += value
	}

	public subtract(axis: 'x' | 'y', value: number) {
		this[axis] -= value
	}

	public velocity(data: { x?: number; y?: number }) {
		this.x += data.x ?? 0
		this.y += data.y ?? 0
	}

	copy() {
		return new Vector2(this.x, this.y)
	}
}

export class Size {
	constructor(public width: number, public height: number) {}

	public set(data: { width?: number; height?: number }) {
		if (data.width) this.width = data.width
		if (data.height) this.height = data.height
	}
}

export class Position {
	public top: number
	public left: number
	public right: number
	public bottom: number
	constructor(vector2: Vector2, size: Size, scale: number | undefined = 1) {
		this.left = vector2.x
		this.top = vector2.y
		this.right = vector2.x + size.width * scale
		this.bottom = vector2.y + size.height * scale
	}
}
