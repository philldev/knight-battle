import { Keyboard } from './keyboard'
import { World } from './world'

export class Game {
	constructor(private _world: World, private _keyboard: Keyboard) {}

	start() {
		this._world.start()
		this.update(0)
	}

	init = () => {
		this.start()

		window.addEventListener('keydown', (e) => {
			this._keyboard.onPressed(e.key)
		})
		window.addEventListener('keyup', (e) => {
			this._keyboard.onReleased(e.key)
		})
	}

	update = (timeStamp: number) => {
		this._world.update(timeStamp)
		this._keyboard.update()
		window.requestAnimationFrame(this.update)
	}
}
