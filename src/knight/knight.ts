import knight from '../assets/knight.png'
import { Entity } from '../lib/entity'
import { Size, Vector2 } from '../lib/util'
import { Idle, KnightState, KnightStates } from './states'

interface KeyMap {
	LEFT: string
	RIGHT: string
	JUMP: string
	ATTACK: string
}

export type Facing = 'left' | 'right'

export class Knight extends Entity {
	constructor(x: number, facing: Facing, readonly KEY_MAP: KeyMap) {
		const img = new Image()
		img.src = knight
		super(new Vector2(x, 475), new Size(175, 100), 'transparent', 1.8, {
			image: img,
			subRect: {
				position: new Vector2(0, 0),
				size: new Size(175, 100),
			},
		})
		this.facing = facing
		this.childEntities = [this.stateDisplay, this.attackBox, this.hitBox]
		this._state.enter()
	}

	_state: KnightState = new Idle(this)
	prevStateName: KnightStates | null = null

	stateDisplay = new StateDisplay(this)
	attackBox = new AttackBox(this)
	hitBox = new HitBox(this)

	frameX = 0
	maxFrameX = 0
	frameY = 0
	velocityY = 0
	velocityX = 0
	facing: Facing = 'right'
	groundY = 475
	gravity = 0.5

	reverseAnimation = false

	readonly animationMaxFrameDefault = 8
	animationMaxFrame = this.animationMaxFrameDefault

	public update(timestamp: number): void {
		this._animate(timestamp)
		this._handleVelocity()
		this.state.update()
	}

	private _handleVelocity() {
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

	get state(): KnightState {
		return this._state
	}

	set state(state: KnightState) {
		this.prevStateName = this._state.name
		this._state = state
		this._state.enter()
	}
}

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

	public update(): void {
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

class AttackBox extends Entity {
	hitting = false
	constructor(private _knight: Knight) {
		super(_knight.position.copy(), new Size(27, 63), 'red', _knight.scale)
	}

	offsetPosition: Record<
		KnightStates,
		{
			x: number
			y: number
		}
	> = {
		ATTACK1: { x: 50, y: 15 },
		ATTACK2: { x: 50, y: 15 },
		ATTACK3: { x: 100, y: 35 },
		IDLE: { x: 50, y: 15 },
		JUMP: { x: 50, y: 15 },
		RUNNING: { x: 50, y: 15 },
		WALK: { x: 50, y: 15 },
	}

	getOffset(axis: 'x' | 'y') {
		return this.offsetPosition[this._knight.state.name][axis]
	}

	public update(): void {
		if (this.hitting) this.fill = 'green'
		else this.fill = 'red'
		this.position.set({
			x:
				this._knight.facing === 'left'
					? this._knight.position.x +
					  this.getOffset('x') -
					  this.size.width * this.scale
					: this._knight.position.x +
					  this._knight.size.width * this._knight.scale -
					  this.getOffset('x'),
			y: this._knight.position.y + this.getOffset('y'),
		})
	}
}

class HitBox extends Entity {
	constructor(private _knight: Knight) {
		super(_knight.position.copy(), new Size(30, 64), 'blue', _knight.scale)
	}

	public update(): void {
		this.position.set({
			x:
				this._knight.facing === 'left'
					? this._knight.position.x + 132
					: this._knight.position.x + 128,
			y: this._knight.position.y + 40,
		})
	}
}
