import knight from '../assets/knight.png'
import { Entity } from '../lib/entity'
import { Size, Vector2 } from '../lib/util'
import { KnightInfo } from './knight-info'
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

const SPRITE_WIDTH = 175 as const
const SPRITE_HEIGHT = 100 as const
const SPRITE_SCALE = 1.5
const SPRITE_BOTTOM_OFFSET = 10

export class Knight extends Entity {
	public groundY = 100

	private _state: KnightState = new Idle(this)
	public prevStateName: KnightStates | null = null

	public attackBox = new AttackBox(this)
	public hitBox = new HitBox(this)
	public knightInfo: KnightInfo

	public hp = 8

	public facing: Facing = 'right'
	public target?: Knight

	public disableAnimation = false
	public spriteFrameX = 0
	public spriteMaxFrameX = 0
	public spriteFrameY = 0
	readonly spriteMaxFrameDefault = 8
	public spriteMaxFrame = this.spriteMaxFrameDefault
	public isReverseSprite = false

	public velocityY = 0
	public velocityX = 0
	readonly velocityYGravity = 0.5

	constructor(
		startingPos: 'left' | 'right',
		readonly KEY_MAP: KeyMap,
		public readonly bounds: Entity,
		public readonly ground: Entity,
		public readonly name: string
	) {
		const img = new Image()
		img.src = knight
		super(
			new Vector2(
				startingPos === 'left'
					? ground.size.width / 2 - SPRITE_WIDTH - 100
					: ground.size.width / 2,
				ground.position.top -
					SPRITE_HEIGHT * SPRITE_SCALE +
					SPRITE_BOTTOM_OFFSET
			),
			new Size(SPRITE_WIDTH, SPRITE_HEIGHT),
			'transparent',
			SPRITE_SCALE,
			{
				image: img,
				subRect: {
					position: new Vector2(0, 0),
					size: new Size(SPRITE_WIDTH, SPRITE_HEIGHT),
				},
			}
		)

		this.facing = startingPos === 'left' ? 'right' : 'left'
		this.groundY =
			ground.position.top - SPRITE_HEIGHT * SPRITE_SCALE + SPRITE_BOTTOM_OFFSET
		this.knightInfo = new KnightInfo(this)
		this.childEntities = [this.attackBox, this.hitBox, this.knightInfo]
		this._state.enter()
	}

	public update(timestamp: number): void {
		if (!this.disableAnimation) this._animate(timestamp)
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

		let x = this.velocityX

		if (x < 0 && this.bounds.position.left + 1 >= this.position.left) {
			x = 0
		} else if (x > 0 && this.bounds.position.right - 1 <= this.position.right) {
			x = 0
		}

		this.vector.velocity({
			x,
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
