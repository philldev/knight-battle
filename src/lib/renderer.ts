import { Position, Size } from './util'

export class Canvas {
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

export class Renderer {
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
