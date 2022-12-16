import { Keyboard } from './keyboard'
import { Renderer } from './renderer'
import { Position, Size } from './util'
import { World } from './world'

export class Entity {
	private _keyboard?: Keyboard
	private _world?: World
	private _renderer?: Renderer

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

	constructor(
		public position: Position,
		public size: Size,
		public fill: string,
		public scale: number,
		public sprite?: {
			image: HTMLImageElement
			subRect?: {
				position: Position
				size: Size
			}
		}
	) {}

	/**
	 * init
	 */
	public init(world: World, keyboard: Keyboard, renderer: Renderer) {
		this._keyboard = keyboard
		this._world = world
		this._renderer = renderer
	}

	/**
	 * update
	 */
	public update(timestamp: number) {}

	/**
	 * render
	 */
	public render() {
		if (this.sprite) {
			this.renderer.drawImage({
				image: this.sprite.image,
				position: this.position,
				size: this.size,
				subRect: this.sprite.subRect ? this.sprite.subRect : undefined,
				scale: this.scale,
			})
		} else {
			this.renderer.draw({
				position: this.position,
				fill: this.fill,
				size: this.size,
				scale: this.scale,
			})
		}
	}
}