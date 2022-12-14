import Two from 'two.js'
import { Rectangle } from 'two.js/src/shapes/rectangle'
import { Vector } from 'two.js/src/vector'

const twoJs = new Two({
	fullscreen: true,
	type: Two.Types.svg,
}).appendTo(document.body)

interface Size {
	width: number
	height: number
}

interface Positon {
	x: number
	y: number
}

export class Util {
	static position(x: number, y: number): Positon {
		return { x, y }
	}
	static size(width: number, height: number): Size {
		return {
			width,
			height,
		}
	}
}

export class Entity {
	private rect: Rectangle
	private _world?: World
	private _keyboard?: Keyboard

	get world(): World {
		if (!this._world) {
			throw new Error('World in not initialized')
		}
		return this._world
	}

	get keyboard(): Keyboard {
		if (!this._keyboard) {
			throw new Error('World in not initialized')
		}
		return this._keyboard
	}

	constructor(
		public size: Size,
		public position: Positon,
		public fill: string
	) {
		this.rect = twoJs.makeRectangle(
			position.x,
			position.y,
			size.width,
			size.height
		)
	}

	public initialize(world: World, keyboard: Keyboard) {
		this._keyboard = keyboard
		this._world = world
	}

	public render() {
		this.rect.fill = this.fill
		this.rect.position = new Vector(this.position.x, this.position.y)
	}

	onStart() {}

	public onUpdate() {}
}

type WorldOnstartFn = (w: World) => void

export class World {
	readonly width = twoJs.width
	readonly height = twoJs.height

	private entities: Entity[] = []

	constructor(private keyboard: Keyboard) {}

	spawn(entity: Entity) {
		this.entities.push(entity)
		return this
	}

	start() {
		for (const e of this.entities) {
			e.initialize(this, this.keyboard)
			e.onStart()
		}

		this._onStart?.(this)
		this.update()
	}

	private _onStart?: WorldOnstartFn

	onStart(cb: WorldOnstartFn) {
		this._onStart = cb
	}

	update() {
		for (const e of this.entities) {
			e.onUpdate()
			e.render()
		}
	}
}

export class Game {
	constructor(private world: World, private keyboard: Keyboard) {}

	init() {
		this.start()

		window.addEventListener('keydown', (e) => {
			if (Keyboard.KEYS[e.key as Keys]) {
				this.keyboard.onPress(e.key as Keys)
			}
		})

		window.addEventListener('keyup', (e) => {
			if (Keyboard.KEYS[e.key as Keys]) {
				this.keyboard.onRelease(e.key as Keys)
			}
		})
	}

	private start() {
		this.world.start()
		this.update()
		twoJs.bind('update', this.update)
		twoJs.play()
	}

	private update = (timeStamp?: number) => {
		if (timeStamp) {
			if (timeStamp % 60) {
				this.world.update()
			}
		} else {
			this.world.update()
		}
		this.keyboard.onUpdate()
	}
}

type KeyState = keyof typeof Keyboard.KEY_STATE
type KeysMap = Map<Keys, KeyState>
export type Keys = keyof typeof Keyboard.KEYS

export class Keyboard {
	keys: KeysMap
	lastKey?: Keys

	constructor() {
		let _keys: KeysMap = new Map()

		for (const k in Keyboard.KEYS) {
			_keys.set(k as Keys, Keyboard.KEY_STATE.UP)
		}
		this.keys = _keys
	}

	wasPressed(key: Keys) {
		if (this.keys.get(key) === 'PRESSED') return true
		return false
	}

	wasReleased(key: Keys) {
		if (this.keys.get(key) === 'RELEASED') return true
		return false
	}

	isDown(key: Keys) {
		let state = this.keys.get(key)
		if (state === 'PRESSED' || state === 'DOWN') return true
		return false
	}

	isUp(key: Keys) {
		let state = this.keys.get(key)
		if (state === 'RELEASED' || state === 'UP') return true
		return false
	}

	onPress(key: Keys) {
		if (this.keys.get(key) === Keyboard.KEY_STATE.UP) {
			this.keys.set(key, Keyboard.KEY_STATE.PRESSED)
			this.lastKey = key
		}
	}

	onRelease(key: Keys) {
		if (this.keys.get(key) === Keyboard.KEY_STATE.DOWN) {
			this.keys.set(key, Keyboard.KEY_STATE.RELEASED)
		}
	}

	onUpdate() {
		for (const [key, oldVal] of this.keys) {
			if (oldVal === 'PRESSED') {
				this.keys.set(key, 'DOWN')
			} else if (oldVal === 'RELEASED') {
				this.keys.set(key, 'UP')
			}
		}
	}

	static KEY_STATE = {
		UP: 'UP',
		DOWN: 'DOWN',
		PRESSED: 'PRESSED',
		RELEASED: 'RELEASED',
	} as const

	static KEYS = {
		a: 'a',
		w: 'w',
		s: 's',
		d: 'd',
	} as const
}
