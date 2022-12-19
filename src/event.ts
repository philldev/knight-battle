import { Entity } from './lib/entity'
import { Size, Vector2 } from './lib/util'

export class EventEntity extends Entity {
	constructor() {
		super(new Vector2(0, 0), new Size(0, 0), 'tranparent', 1)
	}

	public override render(): void {}
}
