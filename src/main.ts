import { Background } from './background'
import { Knight } from './knight/knight'
import { Game } from './lib'
import { Keyboard } from './lib/keyboard'
import { Canvas, Renderer } from './lib/renderer'
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
const knight = new Knight(100, 'right', KEY_MAP[1])
const knight2 = new Knight(500, 'left', KEY_MAP[2])

knight.addTarget(knight2)

const world = new World({
	keyboard,
	renderer,
})
	.spawn(bg)
	.spawn(knight)
	.spawn(knight2)
	.onStart(() => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
