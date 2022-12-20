import { Knight } from './knight'
import { Entity, TextEntity } from '../lib/entity'
import { Size, Vector2 } from '../lib/util'
import hpBarImage from '../assets/healthbar.png'

export class KnightInfo extends Entity {
	playerName: PlayerName
	hpBar: HPBar

	constructor(_knight: Knight) {
		super(new Vector2(0, 0), new Size(0, 0), 'transparent', 1)

		this.playerName = new PlayerName(_knight)
		this.hpBar = new HPBar(_knight)
		this.childEntities = [this.playerName, this.hpBar]
	}
}

class PlayerName extends TextEntity {
	constructor(private _knight: Knight) {
		console.log(_knight.name)
		super(_knight.vector.copy(), 'red', _knight.name, '30px VT323')
	}

	update() {
		this.vector.set({
			x:
				this._knight.facing === 'right'
					? this._knight.vector.x + this._knight.size.width / 2 - 5
					: this._knight.vector.x + this._knight.size.width / 2 + 15,
			y: this._knight.vector.y + 15,
		})
	}
}

class HPBar extends Entity {
	constructor(private _knight: Knight) {
		const img = new Image()
		img.src = hpBarImage
		super(_knight.vector.copy(), new Size(33, 6), 'tranparent', 2.4, {
			image: img,
			subRect: {
				position: new Vector2(0, 0),
				size: new Size(33, 6),
			},
		})
	}

	readonly healthMap: Record<number, number> = {
		8: 0,
		7: 1,
		6: 2,
		5: 3,
		4: 4,
		3: 5,
		2: 6,
		1: 7,
		0: 8,
	}

	update() {
		this.vector.set({
			x:
				this._knight.facing === 'right'
					? this._knight.vector.x + this._knight.size.width / 2
					: this._knight.vector.x + this._knight.size.width / 2 + 10,
			y: this._knight.vector.y + 20,
		})

		if (this.sprite && this.sprite.subRect) {
			this.sprite.subRect.position.y =
				this.healthMap[this._knight.hp] * this.size.height
		}
	}
}
