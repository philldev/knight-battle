import { Entity } from './lib/entity'
import { Size, Vector2 } from './lib/util'
import bg from './assets/bg.png'
import { Canvas } from './lib/renderer'

export class Background extends Entity {
	constructor(canvas: Canvas) {
		const bgImage = new Image(928, 793)
		bgImage.src = bg
		const scale = 1.5

		super(
			new Vector2(0, canvas.height - 793 * scale),
			new Size(928, 793),
			'red',
			scale,
			{
				image: bgImage,
			}
		)
	}
}
