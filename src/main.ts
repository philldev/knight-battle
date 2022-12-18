import { Background } from './background'
import { Knight } from './knight/knight'
import { Game } from './lib'
import { Entity } from './lib/entity'
import { Keyboard } from './lib/keyboard'
import { Canvas, Renderer } from './lib/renderer'
import { Position, Size, Vector2 } from './lib/util'
import { World } from './lib/world'
import './style.css'

class CollisionDetector extends Entity {
	constructor(public a: Entity, public b: Entity) {
		super(new Vector2(0, 0), new Size(0, 0), 'tranparent', 1)
	}
	public override render(): void {}

	public update(timestamp: number): void {
		if (this._isColliding()) {
			console.log('collides')
		}
	}

	private _isColliding() {
		const aPosition = new Position(this.a.position, this.a.size, this.a.scale)
		const bPosition = new Position(this.b.position, this.b.size, this.b.scale)

		if (
			((aPosition.left >= bPosition.left &&
				aPosition.left <= bPosition.right) ||
				(bPosition.right >= aPosition.left &&
					bPosition.left <= aPosition.right)) &&
			((aPosition.bottom >= bPosition.top &&
				aPosition.top <= bPosition.bottom) ||
				(bPosition.bottom >= aPosition.top &&
					bPosition.top <= aPosition.bottom))
		) {
			return true
		}
		return false
	}
}

export const canvas = new Canvas({
	bgColor: '#0e1217',
}).appendTo(document.body)

const KEYS = {
	' ': ' ',
	w: 'w',
	a: 'a',
	d: 'd',
	Enter: 'Enter',
	ArrowUp: 'ArrowUp',
	ArrowLeft: 'ArrowLeft',
	ArrowRight: 'ArrowRight',
}

const KEY_MAP = {
	1: {
		ATTACK: KEYS[' '],
		JUMP: KEYS.w,
		LEFT: KEYS.a,
		RIGHT: KEYS.d,
	},
	2: {
		ATTACK: KEYS.Enter,
		JUMP: KEYS.ArrowUp,
		LEFT: KEYS.ArrowLeft,
		RIGHT: KEYS.ArrowRight,
	},
}

const renderer = new Renderer(canvas)
const keyboard = new Keyboard(KEYS)

const bg = new Background(canvas)
const knight = new Knight(100, 'right', KEY_MAP[1])
const knight2 = new Knight(500, 'left', KEY_MAP[2])

const collisionDetector = new CollisionDetector(knight, knight2)

const world = new World({
	keyboard,
	renderer,
})
	.spawn(bg)
	.spawn(knight)
	.spawn(knight2)
	.spawn(collisionDetector)
	.onStart(() => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
