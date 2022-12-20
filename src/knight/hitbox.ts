import { Entity } from '../lib/entity'
import { Size } from '../lib/util'
import { Knight } from './knight'

export class HitBox extends Entity {
	public gotHit = false

	constructor(private _knight: Knight) {
		super(_knight.vector.copy(), new Size(30, 64), 'transparent', _knight.scale)
	}

	public update(): void {
		if (this.gotHit) {
			this.gotHit = false
		}
		this.vector.set({
			x:
				this._knight.facing === 'left'
					? this._knight.vector.x + 132
					: this._knight.vector.x + 128,
			y: this._knight.vector.y + 40,
		})
	}
}
