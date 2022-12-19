import { Keyboard } from './keyboard'
import { Renderer } from './renderer'
import { Vector2, Size, RectPosition } from './util'
import { World } from './world'

export class Entity {
	private _keyboard?: Keyboard
	private _world?: World
	private _renderer?: Renderer

	public childEntities?: Entity[]
	public position: RectPosition

	constructor(
		public vector: Vector2,
		public size: Size,
		public fill: string,
		public scale: number,
		public sprite?: {
			image: HTMLImageElement
			subRect?: {
				position: Vector2
				size: Size
			}
		}
	) {
		this.position = new RectPosition(this.vector, this.size, this.scale)
	}

	/**
	 * init
	 */
	public init(world: World, keyboard: Keyboard, renderer: Renderer) {
		this._keyboard = keyboard
		this._world = world
		this._renderer = renderer
	}

	/**
	 * onStart
	 */
	public onStart() {}

	/**
	 * update
	 */
	public update(timestamp: number) {}

	public updateRectPosition() {
		this.position.update(this.vector, this.size, this.scale)
	}

	/**
	 * render
	 */
	public render() {
		if (this.sprite) {
			this.renderer.drawImage({
				image: this.sprite.image,
				position: this.vector,
				size: this.size,
				subRect: this.sprite.subRect ? this.sprite.subRect : undefined,
				scale: this.scale,
			})
		} else {
			this.renderer.draw({
				position: this.vector,
				fill: this.fill,
				size: this.size,
				scale: this.scale,
			})
		}
	}

	get world() {
		if (!this._world) throw new Error('Entity is not initialized')
		return this._world
	}
	get keyboard() {
		if (!this._keyboard) throw new Error('Entity is not initialized')
		return this._keyboard
	}
	get renderer() {
		if (!this._renderer) throw new Error('Entity is not initialized')
		return this._renderer
	}
}
