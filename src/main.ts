import { Entity, Game, Keyboard, Util, World } from './lib/game'
import './style.css'

class MovingRect extends Entity {
	speed = 2
	velocity = {
		x: 0,
		y: 0,
	}

	constructor() {
		super(Util.size(100, 100), Util.position(100, world.height - 500), 'white')
	}

	onUpdate(): void {
		if (this.keyboard.wasPressed(Keyboard.KEYS.w)) {
			this.velocity.y = -10
		} else if (
			this.keyboard.isDown(Keyboard.KEYS.d) &&
			(this.keyboard.lastKey === Keyboard.KEYS.d ||
				this.keyboard.lastKey === Keyboard.KEYS.w)
		) {
			this.velocity.x = this.speed
		} else if (
			this.keyboard.isDown(Keyboard.KEYS.a) &&
			(this.keyboard.lastKey === Keyboard.KEYS.a ||
				this.keyboard.lastKey === Keyboard.KEYS.w)
		) {
			this.velocity.x = this.speed * -1
		} else this.velocity.x = 0

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		if (
			this.position.y + this.size.height / 2 + this.velocity.y >=
			world.height
		) {
			this.velocity.y = 0
		} else this.velocity.y += 0.4
	}
}

const keyboard = new Keyboard()
const world = new World(keyboard)
const movingRect = new MovingRect()

world.spawn(movingRect).onStart(() => {})

new Game(world, keyboard).init()
