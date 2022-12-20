import { Entity } from '../lib/entity'
import { Size } from '../lib/util'
import { Knight } from './knight'
import { KnightStates } from './states'

export class AttackBox extends Entity {
	public hitting = false
	private _offsetPosition: Record<
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
		HURT: { x: 50, y: 15 },
		DEFEND: { x: 50, y: 15 },
		DIED: { x: 50, y: 15 },
	}

	constructor(private _knight: Knight) {
		super(_knight.vector.copy(), new Size(27, 63), 'transparent', _knight.scale)
	}

	public getOffset(axis: 'x' | 'y') {
		return this._offsetPosition[this._knight.state.name][axis]
	}

	public tryHitTarget() {
		this._knight.attackBox.hitting = true
		const target = this._knight.target
		if (
			target &&
			target.hitBox.position.isColliding(this._knight.attackBox.position)
		) {
			target.hitBox.gotHit = true
		}
	}

	public override update(): void {
		if (this.hitting) {
			this.hitting = false
		}

		this.vector.set({
			x:
				this._knight.facing === 'left'
					? this._knight.vector.x +
					  this.getOffset('x') -
					  this.size.width * this.scale
					: this._knight.vector.x +
					  this._knight.size.width * this._knight.scale -
					  this.getOffset('x'),
			y: this._knight.vector.y + this.getOffset('y'),
		})
	}
}
