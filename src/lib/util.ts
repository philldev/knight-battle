export interface Size {
	width: number
	height: number
}

export interface Position {
	x: number
	y: number
}

export class Util {
	static size(width: number, height: number): Size {
		return {
			width,
			height,
		}
	}
	static position(x: number, y: number): Position {
		return {
			x,
			y,
		}
	}
}
