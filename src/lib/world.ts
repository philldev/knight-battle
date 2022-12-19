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
		for (const e of this._entities) {
			e.onStart()
		}
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
		this._renderer.clear()

		for (const e of this._entities) {
			e.update(timestamp)
			e.updateRectPosition()
			e.render()
			this.renderChild(e.childEntities, timestamp)
		}
	}

	private renderChild(children: Entity[] | undefined, timestamp: number) {
		if (children) {
			for (const child of children) {
				child.update(timestamp)
				child.updateRectPosition()
				child.render()
				this.renderChild(child.childEntities, timestamp)
			}
		}
		return
	}

	private initChild(children: Entity[] | undefined) {
		if (children) {
			for (const child of children) {
				child.init(this, this._keyboard, this._renderer)
				this.initChild(child.childEntities)
			}
		}
		return
	}

	public spawn(e: Entity) {
		e.init(this, this._keyboard, this._renderer)
		this.initChild(e.childEntities)
		this._entities.push(e)
		return this
	}
}
