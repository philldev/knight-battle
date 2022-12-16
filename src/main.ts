import './style.css'
import bg from './assets/bg.png'

interface Size {
	width: number
	height: number
}
interface Position {
	x: number
	y: number
}
class Util {
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

class Canvas {
	public element: HTMLCanvasElement
	public width: number
	public height: number
	constructor(data: {
		fullscreen?: boolean
		bgColor?: string
		width?: number
		height?: number
	}) {
		this.element = this._createCanvas()

		this.element.width = 1280
		this.element.height = 720

		if (data.fullscreen) {
			this._setCanvasSizeToFullScreen()
			window.addEventListener('resize', () => {
				this._setCanvasSizeToFullScreen()
			})
		}

		if (data.bgColor) {
			this.element.style.background = data.bgColor
		}

		if (data.width) this.width = data.width
		if (data.height) this.height = data.height

		this.width = this.element.width
		this.height = this.element.height
	}

	appendTo(el: HTMLElement) {
		el.appendChild(this.element)
		return this
	}

	private _setCanvasSizeToFullScreen() {
		this._setCanvasSize(window.innerWidth, window.innerHeight)
	}

	private _setCanvasSize(width: number, height: number) {
		this.element.width = width
		this.element.height = height
		this.width = width
		this.height = height
	}

	private _createCanvas() {
		return document.createElement('canvas')
	}
}

class Renderer {
	private _ctx: CanvasRenderingContext2D

	constructor(canvas: Canvas) {
		let ctx = canvas.element.getContext('2d')!
		if (!ctx) throw new Error('Error Context 2d')
		this._ctx = ctx
	}

	/**
	 * draw
	 */
	public draw(params: {
		fill: string
		size: Size
		position: Position
		scale: number
	}) {
		this._ctx.fillStyle = params.fill
		this._ctx.fillRect(
			params.position.x,
			params.position.y,
			params.size.width * params.scale,
			params.size.height * params.scale
		)
	}

	/**
	 * draw
	 */
	public drawImage(params: {
		image: HTMLImageElement
		size: Size
		position: Position
		scale: number
		subRect?: {
			position: Position
			size: Size
		}
	}) {
		if (params.subRect) {
			this._ctx.drawImage(
				params.image,
				params.subRect.position.x,
				params.subRect.position.y,
				params.subRect.size.width * params.scale,
				params.subRect.size.height,
				params.position.x,
				params.position.y,
				params.size.width * params.scale,
				params.size.height * params.scale
			)
		} else {
			this._ctx.drawImage(
				params.image,
				params.position.x,
				params.position.y,
				params.size.width * params.scale,
				params.size.height * params.scale
			)
		}
	}
}

class Keyboard {
	static KEY_STATE = {
		PRESSED: 'PRESSED',
		RELEASED: 'RELEASED',
		DOWN: 'DOWN',
		UP: 'UP',
	} as const

	static KEYS = {
		A: 'a',
		S: 's',
		D: 'd',
		w: 'w',
		SPACE: ' ',
	} as const

	private _keys: Record<string, keyof typeof Keyboard.KEY_STATE> = {}

	constructor() {
		for (const key in Keyboard.KEYS) {
			this._keys[key] = Keyboard.KEY_STATE.UP
		}
	}

	private _keyExist(key: string) {
		return this._keys[key] !== undefined
	}

	public onPressed(key: string) {
		if (this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.UP) {
			this._keys[key] = Keyboard.KEY_STATE.PRESSED
		}
	}
	public onReleased(key: string) {
		if (this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.DOWN) {
			this._keys[key] = Keyboard.KEY_STATE.RELEASED
		}
	}

	public isDown(key: string) {
		return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.DOWN
	}
	public isUp(key: string) {
		return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.UP
	}
	public wasPressed(key: string) {
		return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.PRESSED
	}
	public wasReleased(key: string) {
		return (
			this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.RELEASED
		)
	}

	public update() {
		Object.keys(this._keys).forEach((key) => {
			switch (this._keys[key]) {
				case Keyboard.KEY_STATE.PRESSED:
					this._keys[key] = Keyboard.KEY_STATE.DOWN
					break
				case Keyboard.KEY_STATE.RELEASED:
					this._keys[key] = Keyboard.KEY_STATE.UP
					break
				default:
					break
			}
		})
	}
}

class World {
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

class Entity {
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

class Game {
	constructor(private _world: World, private _keyboard: Keyboard) {}

	start() {
		this._world.start()
		this.update(0)
	}

	init = () => {
		this.start()

		window.addEventListener('keydown', (e) => {
			this._keyboard.onPressed(e.key)
		})
		window.addEventListener('keyup', (e) => {
			this._keyboard.onReleased(e.key)
		})
	}

	update = (timeStamp: number) => {
		this._world.update(timeStamp)
		this._keyboard.update()
		window.requestAnimationFrame(this.update)
	}
}

const canvas = new Canvas({
	bgColor: '#0e1217',
}).appendTo(document.body)

const renderer = new Renderer(canvas)
const keyboard = new Keyboard()

const bgImage = new Image(928, 793)
bgImage.src = bg

const world = new World({
	keyboard,
	renderer,
})
	.spawn(
		new Entity(
			Util.position(0, canvas.height - 793 * 1.5),
			Util.size(928, 793),
			'red',
			1.5,
			{
				image: bgImage,
			}
		)
	)
	.onStart((world) => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
