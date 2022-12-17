import knight from './assets/knight.png'
import { Entity } from './lib/entity'
import { Size, Vector2 } from './lib/util'

class StateDisplay extends Entity {
	constructor(private _knight: Knight) {
		super(
			new Vector2(_knight.position.x, 450),
			new Size(_knight.size.width, 25),
			'red',
			_knight.scale
		)

		this.text = this._knight._state.name
	}

	text: string

	public update(timestamp: number): void {
		this.position.set({
			x: this._knight.position.x,
			y: this._knight.position.y - 50,
		})
		this.text = this._knight.state.name
	}

	public render(): void {
		this.renderer.drawText({
			font: '30px Comic Sans MS',
			fill: this.fill,
			position: this.position,
			text: this.text,
		})
	}
}

export class Knight extends Entity {
	constructor() {
		const img = new Image()
		img.src = knight
		super(new Vector2(100, 475), new Size(175, 100), 'transparent', 1.8, {
			image: img,
			subRect: {
				position: new Vector2(0, 0),
				size: new Size(175, 100),
			},
		})
		this.childEntities = [new StateDisplay(this)]
		this._state.enter()
	}

	_state: KnightState = new Idle(this)
	prevStateName: States | null = null

	get state(): KnightState {
		return this._state
	}

	set state(state: KnightState) {
		this.prevStateName = this._state.name
		this._state = state
		this._state.enter()
	}

	frameX = 0
	maxFrameX = 0

	frameY = 0

	velocityY = 0
	velocityX = 0

	facing: Facing = 'right'

	groundY = 475
	gravity = 0.5

	reverseAnimation = false

	readonly animationMaxFrameDefault = 10
	animationMaxFrame = this.animationMaxFrameDefault

	public update(timestamp: number): void {
		this._animate(timestamp)
		this._handleVelocity()
		this.state.update()
	}

	private _handleVelocity() {
		// console.log(this.position.y + this.size.height + this.velocityY)
		this.velocityY += this.gravity
		this.position.velocity({
			x: this.velocityX,
			y: this.position.y + this.velocityY <= this.groundY ? this.velocityY : 0,
		})
	}

	private _animate(timestamp: number) {
		if (timestamp % this.animationMaxFrame === 0) {
			this.sprite?.subRect?.position.set({
				x: this.size.width * this.frameX,
				y: this.size.height * this.frameY,
			})
			if (!this.reverseAnimation) {
				if (this.frameX < this.maxFrameX) {
					this.frameX++
				} else this.frameX = 0
			} else {
				if (this.frameX > 0) {
					this.frameX--
				} else this.frameX = this.maxFrameX
			}
		}
	}
}

type States =
	| 'IDLE'
	| 'WALK'
	| 'JUMP'
	| 'RUNNING'
	| 'ATTACK1'
	| 'ATTACK2'
	| 'ATTACK3'

class KnightState {
	constructor(public name: States) {}
	enter() {}
	update() {}
}

type Facing = 'left' | 'right'

class Idle extends KnightState {
	constructor(public knight: Knight) {
		super('IDLE')
	}

	readonly frameY = {
		left: 1,
		right: 0,
	}

	enter() {
		this.knight.frameX = 0
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.maxFrameX = 3
		this.knight.velocityX = 0
	}

	update() {
		if (this.knight.keyboard.wasPressed('a', true)) {
			if (this.knight.facing === 'right') {
				this.knight.facing = 'left'
			} else {
				this.knight.state = new Running(this.knight)
			}
		} else if (this.knight.keyboard.wasPressed('d', true)) {
			if (this.knight.facing === 'left') {
				this.knight.facing = 'right'
			} else {
				this.knight.state = new Running(this.knight)
			}
		} else if (this.knight.keyboard.isDown('d')) {
			this.knight.state = new Walk(this.knight, 'd')
		} else if (this.knight.keyboard.isDown('a')) {
			this.knight.state = new Walk(this.knight, 'a')
		} else if (this.knight.keyboard.wasPressed('w')) {
			this.knight.state = new Jump(this.knight)
		} else if (this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack1(this.knight)
		}
	}
}

class Walk extends KnightState {
	constructor(public knight: Knight, public key: 'a' | 'd') {
		super('WALK')
	}

	readonly frameY = {
		left: 3,
		right: 2,
	}

	readonly velocityX = {
		left: {
			a: -1,
			d: 0.5,
		},
		right: {
			a: -0.5,
			d: 1,
		},
	}

	readonly reverseAnimation = {
		left: {
			a: false,
			d: true,
		},
		right: {
			a: true,
			d: false,
		},
	}

	enter() {
		this.knight.frameX = 7
		this.knight.maxFrameX = 7
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing][this.key]
		this.knight.reverseAnimation =
			this.reverseAnimation[this.knight.facing][this.key]
	}

	update() {
		if (this.knight.keyboard.wasReleased(['a', 'd'])) {
			this.knight.state = new Idle(this.knight)
		}
		if (this.knight.keyboard.isDown('w')) {
			this.knight.state = new Jump(this.knight)
		}
		if (this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack1(this.knight)
		}
	}
}

class Running extends KnightState {
	constructor(public knight: Knight) {
		super('RUNNING')
	}

	readonly frameY = {
		left: 19,
		right: 18,
	}

	readonly velocityX = {
		left: -2,
		right: 2,
	}

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = 6
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
	}

	update() {
		if (this.knight.keyboard.wasReleased(['a', 'd'])) {
			this.knight.state = new Idle(this.knight)
		}
		if (this.knight.keyboard.isDown('w')) {
			this.knight.state = new Jump(this.knight)
		}
		if (this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack3(this.knight)
		}
	}
}

class Jump extends KnightState {
	constructor(public knight: Knight) {
		super('JUMP')
	}

	readonly frameY = {
		left: 17,
		right: 16,
	}

	readonly velocityXFromRunning = {
		left: -1,
		right: 1,
	}

	maxFrameX = 6

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX =
			this.knight.prevStateName === 'RUNNING'
				? this.velocityXFromRunning[this.knight.facing]
				: 0
		this.knight.velocityY = -10
		this.knight.reverseAnimation = false
	}

	update() {
		if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight)
		}
	}
}

class Attack1 extends KnightState {
	constructor(public knight: Knight) {
		super('ATTACK1')
	}

	readonly frameY = {
		left: 5,
		right: 4,
	}

	maxFrameX = 5

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX = 0
		this.knight.reverseAnimation = false
	}

	update() {
		if (this.knight.frameX > 1 && this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack2(this.knight)
		} else if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.animationMaxFrame = this.knight.animationMaxFrameDefault
		}
	}
}

class Attack2 extends KnightState {
	constructor(public knight: Knight) {
		super('ATTACK2')
	}

	readonly frameY = {
		left: 7,
		right: 6,
	}

	maxFrameX = 4

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX = 0
		this.knight.reverseAnimation = false
	}

	update() {
		if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.animationMaxFrame = this.knight.animationMaxFrameDefault
		}
	}
}

class Attack3 extends KnightState {
	constructor(public knight: Knight) {
		super('ATTACK3')
	}

	readonly frameY = {
		left: 21,
		right: 20,
	}

	readonly velocityX = {
		left: -2,
		right: 2,
	}

	maxFrameX = 5

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
		this.knight.reverseAnimation = false
	}

	update() {
		if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.animationMaxFrame = this.knight.animationMaxFrameDefault
		}
	}
}
