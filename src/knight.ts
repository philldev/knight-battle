import knight from './assets/knight.png'
import { Entity } from './lib/entity'
import { Size, Vector2 } from './lib/util'

type States = 'IDLE' | 'WALK' | 'JUMP'

class KnightState {
	constructor(public state: States) {}
	enter() {}
	update() {}
}

type Facing = 'left' | 'right'

class Idle extends KnightState {
	constructor(public knight: Knight, public facing: Facing) {
		super('IDLE')
	}

	readonly frameY = {
		left: 1,
		right: 0,
	}

	enter() {
		this.knight.frameX = 0
		this.knight.frameY = this.frameY[this.facing]
		this.knight.maxFrameX = 3
		this.knight.velocityX = 0
	}

	update() {
		if (this.knight.keyboard.isDown('d')) {
			this.knight.state = new Walk(this.knight, 'right', 'forward')
		}
		if (this.knight.keyboard.isDown('a')) {
			this.knight.state = new Walk(this.knight, 'left', 'backward')
		}
		if (this.knight.keyboard.isDown('w')) {
			this.knight.state = new Jump(this.knight, this.facing)
		}
		if (this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack1(this.knight, this.facing)
		}
	}
}

class Walk extends KnightState {
	constructor(
		public knight: Knight,
		public facing: Facing,
		public walkType: 'forward' | 'backward'
	) {
		super('WALK')

		console.log(facing)
	}

	readonly frameY = {
		left: 3,
		right: 2,
	}

	readonly velocityX = {
		left: -1,
		right: 1,
	}

	enter() {
		this.knight.frameX = 7
		this.knight.maxFrameX = 7
		this.knight.frameY =
			this.frameY[
				this.walkType === 'forward' && this.facing === 'right'
					? 'right'
					: this.walkType === 'forward' && this.facing === 'left'
					? 'left'
					: this.walkType === 'backward' && this.facing === 'left'
					? 'right'
					: 'left'
			]
		this.knight.velocityX = this.velocityX[this.facing]
		this.knight.reverseAnimation = this.walkType === 'backward'
	}

	update() {
		if (this.knight.keyboard.wasReleased(['a', 'd'])) {
			this.knight.state = new Idle(this.knight, this.facing)
		}
		if (this.knight.keyboard.isDown('w')) {
			this.knight.state = new Jump(this.knight, this.facing)
		}
		if (this.knight.keyboard.wasPressed(' ')) {
			this.knight.state = new Attack1(this.knight, this.facing)
		}
	}
}

class Jump extends KnightState {
	constructor(public knight: Knight, public facing: Facing) {
		super('JUMP')
	}

	readonly frameY = {
		left: 17,
		right: 16,
	}

	maxFrameX = 6

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.facing]
		this.knight.velocityX = 0
		this.knight.velocityY = -10
	}

	update() {
		if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight, this.facing)
		}
	}
}

class Attack1 extends KnightState {
	constructor(public knight: Knight, public facing: Facing) {
		super('JUMP')
	}

	readonly frameY = {
		left: 5,
		right: 4,
	}

	maxFrameX = 5

	enter() {
		this.knight.frameX = 0
		this.knight.maxFrameX = this.maxFrameX
		this.knight.frameY = this.frameY[this.facing]
		this.knight.velocityX = 0
		this.knight.animationMaxFrame = 5
	}

	update() {
		if (this.maxFrameX === this.knight.frameX) {
			this.knight.state = new Idle(this.knight, this.facing)
			this.knight.animationMaxFrame = this.knight.animationMaxFrameDefault
		}
	}
}

export class Knight extends Entity {
	constructor() {
		const img = new Image()
		img.src = knight

		super(new Vector2(100, 500), new Size(175, 86), 'transparent', 1.5, {
			image: img,
			subRect: {
				position: new Vector2(0, 0),
				size: new Size(175, 86),
			},
		})

		this._state.enter()
	}

	_state: KnightState = new Idle(this, 'right')

	get state(): KnightState {
		return this._state
	}

	set state(state: KnightState) {
		this._state = state
		this._state.enter()
	}

	frameX = 0
	maxFrameX = 0

	frameY = 0

	velocityY = 0
	velocityX = 0

	groundY = 500

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
