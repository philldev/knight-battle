import { Knight } from './knight'

export type KnightStates =
	| 'IDLE'
	| 'WALK'
	| 'JUMP'
	| 'RUNNING'
	| 'ATTACK1'
	| 'ATTACK2'
	| 'ATTACK3'
	| 'HURT'
	| 'DEFEND'

export class KnightState {
	constructor(public name: KnightStates) {}
	enter() {}
	update() {}
}

export class Idle extends KnightState {
	constructor(public knight: Knight) {
		super('IDLE')
	}

	readonly frameY = {
		left: 1,
		right: 0,
	}

	enter() {
		this.knight.spriteFrameX = 0
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.spriteMaxFrameX = 3
		this.knight.velocityX = 0
	}

	private _handleInput() {
		if (this.knight.hitBox.gotHit) {
			this.knight.state = new Hurt(this.knight)
		} else {
			if (this.knight.keyboard.isDown(this.knight.KEY_MAP.DEFEND)) {
				this.knight.state = new Defend(this.knight)
			}
			if (this.knight.keyboard.wasPressed(this.knight.KEY_MAP.LEFT, true)) {
				if (this.knight.facing === 'right') {
					this.knight.facing = 'left'
				} else {
					this.knight.state = new Running(this.knight)
				}
			} else if (
				this.knight.keyboard.wasPressed(this.knight.KEY_MAP.RIGHT, true)
			) {
				if (this.knight.facing === 'left') {
					this.knight.facing = 'right'
				} else {
					this.knight.state = new Running(this.knight)
				}
			} else if (this.knight.keyboard.isDown(this.knight.KEY_MAP.RIGHT)) {
				this.knight.state = new Walk(this.knight, 'right')
			} else if (this.knight.keyboard.isDown(this.knight.KEY_MAP.LEFT)) {
				this.knight.state = new Walk(this.knight, 'left')
			} else if (this.knight.keyboard.isDown(this.knight.KEY_MAP.JUMP)) {
				this.knight.state = new Jump(this.knight)
			} else if (this.knight.keyboard.isDown(this.knight.KEY_MAP.ATTACK)) {
				this.knight.state = new Attack1(this.knight)
			}
		}
	}

	update() {
		if (
			this.knight.prevStateName === 'ATTACK3' ||
			this.knight.prevStateName === 'ATTACK2'
		) {
			if (this.knight.spriteFrameX === 2) {
				this._handleInput()
			}
		} else {
			this._handleInput()
		}
	}
}

export class Walk extends KnightState {
	constructor(public knight: Knight, public key: 'left' | 'right') {
		super('WALK')
	}

	readonly frameY = {
		left: 3,
		right: 2,
	}

	readonly velocityX = {
		left: {
			left: -1,
			right: 0.5,
		},
		right: {
			left: -0.5,
			right: 1,
		},
	}

	readonly reverseAnimation = {
		left: {
			left: false,
			right: true,
		},
		right: {
			left: true,
			right: false,
		},
	}

	enter() {
		this.knight.spriteFrameX = 7
		this.knight.spriteMaxFrameX = 7
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing][this.key]
		this.knight.isReverseSprite =
			this.reverseAnimation[this.knight.facing][this.key]
	}

	update() {
		if (
			this.knight.keyboard.wasReleased([
				this.knight.KEY_MAP.LEFT,
				this.knight.KEY_MAP.RIGHT,
			])
		) {
			this.knight.state = new Idle(this.knight)
		}
		if (this.knight.keyboard.isDown(this.knight.KEY_MAP.JUMP)) {
			this.knight.state = new Jump(this.knight)
		}

		if (this.knight.keyboard.isDown(this.knight.KEY_MAP.ATTACK)) {
			this.knight.state = new Attack1(this.knight)
		}
	}
}

export class Running extends KnightState {
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
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = 6
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
	}

	update() {
		if (
			this.knight.keyboard.wasReleased([
				this.knight.KEY_MAP.LEFT,
				this.knight.KEY_MAP.RIGHT,
			])
		) {
			this.knight.state = new Idle(this.knight)
		}
		if (this.knight.keyboard.isDown(this.knight.KEY_MAP.JUMP)) {
			this.knight.state = new Jump(this.knight)
		}
		if (this.knight.keyboard.wasPressed(this.knight.KEY_MAP.ATTACK)) {
			this.knight.state = new RunningAttack(this.knight)
		}
	}
}

export class Jump extends KnightState {
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

	readonly velocityXFromWalking = {
		left: -0.7,
		right: 0.7,
	}

	maxFrameX = 6

	enter() {
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX =
			this.knight.prevStateName === 'RUNNING'
				? this.velocityXFromRunning[this.knight.facing]
				: this.knight.prevStateName === 'WALK'
				? this.velocityXFromWalking[this.knight.facing]
				: 0
		this.knight.velocityY = -10
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.maxFrameX === this.knight.spriteFrameX) {
			this.knight.state = new Idle(this.knight)
		}
	}
}

export class Attack1 extends KnightState {
	constructor(public knight: Knight) {
		super('ATTACK1')
	}

	readonly frameY = {
		left: 5,
		right: 4,
	}

	maxFrameX = 5

	enter() {
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = 0
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.knight.spriteFrameX === 4) {
			this.knight.attackBox.tryHitTarget()
		} else if (this.maxFrameX === this.knight.spriteFrameX) {
			if (this.knight.keyboard.isDown(this.knight.KEY_MAP.ATTACK)) {
				this.knight.state = new Attack2(this.knight)
			} else {
				this.knight.state = new Idle(this.knight)
				this.knight.spriteMaxFrame = this.knight.spriteMaxFrameDefault
			}
		}
	}
}

export class Attack2 extends KnightState {
	constructor(public knight: Knight) {
		super('ATTACK2')
	}

	readonly frameY = {
		left: 7,
		right: 6,
	}

	maxFrameX = 4

	enter() {
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = 0
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.knight.spriteFrameX === 2) {
			this.knight.attackBox.tryHitTarget()
		} else if (this.maxFrameX === this.knight.spriteFrameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.spriteMaxFrame = this.knight.spriteMaxFrameDefault
		}
	}
}

export class RunningAttack extends KnightState {
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
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.knight.spriteFrameX === 4) {
			this.knight.attackBox.tryHitTarget()
		}
		if (this.maxFrameX === this.knight.spriteFrameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.spriteMaxFrame = this.knight.spriteMaxFrameDefault
		}
	}
}

export class Hurt extends KnightState {
	constructor(public knight: Knight) {
		super('HURT')
	}

	readonly frameY = {
		left: 13,
		right: 12,
	}

	readonly velocityX = {
		left: 0,
		right: 0,
	}

	maxFrameX = 2

	enter(): void {
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.maxFrameX === this.knight.spriteFrameX) {
			this.knight.state = new Idle(this.knight)
			this.knight.spriteMaxFrame = this.knight.spriteMaxFrameDefault
		}
	}
}

export class Defend extends KnightState {
	constructor(public knight: Knight) {
		super('DEFEND')
	}

	readonly frameY = {
		left: 11,
		right: 10,
	}

	readonly velocityX = {
		left: 0,
		right: 0,
	}

	maxFrameX = 4

	enter(): void {
		this.knight.spriteFrameX = 0
		this.knight.spriteMaxFrameX = this.maxFrameX
		this.knight.spriteFrameY = this.frameY[this.knight.facing]
		this.knight.velocityX = this.velocityX[this.knight.facing]
		this.knight.isReverseSprite = false
	}

	update() {
		if (this.knight.keyboard.wasReleased(this.knight.KEY_MAP.DEFEND)) {
			this.knight.state = new Idle(this.knight)
			this.knight.spriteMaxFrame = this.knight.spriteMaxFrameDefault
		}
	}
}
