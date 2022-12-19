import { Keyboard } from './keyboard'
import { World } from './world'

export class Game {
	constructor(private _world: World, private _keyboard: Keyboard) {}

	start() {
		this._world.start()
		this.update()
	}

	init = () => {
		this.start()

		window.addEventListener('keydown', (e) => {
			e.preventDefault()
			this._keyboard.onPressed(e.key)
		})
		window.addEventListener('keyup', (e) => {
			this._keyboard.onReleased(e.key)
		})
	}

	frame = 0

	update = () => {
		this._world.update(this.frame)
		this._keyboard.update()
		window.requestAnimationFrame(this.update)
		this.frame++
	}
}
