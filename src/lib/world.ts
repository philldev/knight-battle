import { Entity } from './entity'
import { Keyboard } from './keyboard'
import { Renderer } from './renderer'

export class World {
	private _entities: Entity[] = []
	private _keyboard: Keyboard
	private _renderer: Renderer
	private _onStartCb?: (world: World) => void

	constructor(params: { keyboard: Keyboard; renderer: Renderer }) {
		this._keyboard = params.keyboard
		this._renderer = params.renderer
	}

	/**
	 * start world
	 */
	public start() {
		this._onStartCb?.(this)
	}

	/**
	 * onStart
	 */
	public onStart(cb: (world: World) => void) {
		this._onStartCb = cb
		return this
	}

	/**
	 * update world
	 */
	public update(timestamp: number) {
		for (const e of this._entities) {
			e.update(timestamp)
			e.render()
		}
	}

	public spawn(e: Entity) {
		e.init(this, this._keyboard, this._renderer)
		this._entities.push(e)
		return this
	}
}
