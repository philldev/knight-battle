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
	/**
	 * update
	 */
	public update() {}
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

		this._keyboard.update()
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
	constructor(private _world: World) {}

	start() {
		this._world.start()
		this.update(0)
	}

	init = () => {
		this.start()
	}

	update = (timeStamp: number) => {
		this._world.update(timeStamp)
		window.requestAnimationFrame(this.update)
	}
}

const canvas = new Canvas({
	// fullscreen: true,
	bgColor: '#0e1217',
}).appendTo(document.body)

const renderer = new Renderer(canvas)
const keyboard = new Keyboard()

const bgImage = new Image(1920, 1080)
bgImage.src = bg

const world = new World({
	keyboard,
	renderer,
})
	.spawn(new Entity(Util.position(0, 0), Util.size(100, 100), 'red', 1))
	.spawn(
		new Entity(
			Util.position(0, 0),
			Util.size(canvas.width, canvas.height),
			'red',
			1,
			{
				image: bgImage,
			}
		)
	)
	.onStart((world) => {
		console.log('world start')
	})

const game = new Game(world)

window.onload = game.init
