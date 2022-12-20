import { Background } from './background'
import { Knight } from './knight/knight'
import { Game } from './lib'
import { Entity } from './lib/entity'
import { Keyboard } from './lib/keyboard'
import { Canvas, Renderer } from './lib/renderer'
import { Size, Vector2 } from './lib/util'
import { World } from './lib/world'
import './style.css'

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
	f: 'f',
	Control: 'Control',
}

const KEY_MAP = {
	1: {
		ATTACK: KEYS[' '],
		JUMP: KEYS.w,
		LEFT: KEYS.a,
		RIGHT: KEYS.d,
		DEFEND: KEYS.f,
	},
	2: {
		ATTACK: KEYS.Enter,
		JUMP: KEYS.ArrowUp,
		LEFT: KEYS.ArrowLeft,
		RIGHT: KEYS.ArrowRight,
		DEFEND: KEYS.Control,
	},
}

const renderer = new Renderer(canvas)
const keyboard = new Keyboard(KEYS)

const bg = new Background(canvas)
const bounds = new Entity(
	new Vector2(0, 0),
	new Size(canvas.width, canvas.height),
	'transparent',
	1
)
const ground = new Entity(
	new Vector2(0, canvas.height - 90),
	new Size(canvas.width, 90),
	'transparent',
	1
)
const knight = new Knight('left', KEY_MAP[1], bounds, ground, 'Player 1')
const knight2 = new Knight('right', KEY_MAP[2], bounds, ground, 'Enemy')

knight.addTarget(knight2)

const world = new World({
	keyboard,
	renderer,
})
	.spawn(bg)
	.spawn(bounds)
	.spawn(ground)
	.spawn(knight)
	.spawn(knight2)
	// .spawn(new Entity(new Vector2(0, 0), new Size(100, 100), 'red', 1))
	.onStart(() => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
