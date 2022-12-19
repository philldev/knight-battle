import knight from '../assets/knight.png'
import { Entity } from '../lib/entity'
import { Size, Vector2 } from '../lib/util'
import { AttackBox } from './attackbox'
import { HitBox } from './hitbox'
import { Idle, KnightState, KnightStates } from './states'

interface KeyMap {
	LEFT: string
	RIGHT: string
	JUMP: string
	ATTACK: string
	DEFEND: string
}

export type Facing = 'left' | 'right'

export class Knight extends Entity {
	readonly groundY = 475

	private _state: KnightState = new Idle(this)
	public prevStateName: KnightStates | null = null

	public attackBox = new AttackBox(this)
	public hitBox = new HitBox(this)
	public facing: Facing = 'right'
	public target?: Knight

	public spriteFrameX = 0
	public spriteMaxFrameX = 0
	public spriteFrameY = 0
	readonly spriteMaxFrameDefault = 8
	public spriteMaxFrame = this.spriteMaxFrameDefault
	public isReverseSprite = false

	public velocityY = 0
	public velocityX = 0
	readonly velocityYGravity = 0.5

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
		this.childEntities = [this.attackBox, this.hitBox]
		this._state.enter()
	}

	public update(timestamp: number): void {
		this._animate(timestamp)
		this._handleVelocity()
		this.state.update()
	}

	public addTarget(target: Knight) {
		if (target !== this) this.target = target
	}

	public get state(): KnightState {
		return this._state
	}

	public set state(state: KnightState) {
		this.prevStateName = this._state.name
		this._state = state
		this._state.enter()
	}

	private _handleVelocity() {
		this.velocityY += this.velocityYGravity
		this.vector.velocity({
			x: this.velocityX,
			y: this.vector.y + this.velocityY <= this.groundY ? this.velocityY : 0,
		})
	}

	private _animate(timestamp: number) {
		if (timestamp % this.spriteMaxFrame === 0) {
			this.sprite?.subRect?.position.set({
				x: this.size.width * this.spriteFrameX,
				y: this.size.height * this.spriteFrameY,
			})
			if (!this.isReverseSprite) {
				if (this.spriteFrameX < this.spriteMaxFrameX) {
					this.spriteFrameX++
				} else this.spriteFrameX = 0
			} else {
				if (this.spriteFrameX > 0) {
					this.spriteFrameX--
				} else this.spriteFrameX = this.spriteMaxFrameX
			}
		}
	}
}
