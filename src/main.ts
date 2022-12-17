import { Background } from './background'
import { Knight } from './knight'
import { Game } from './lib'
import { Keyboard } from './lib/keyboard'
import { Canvas, Renderer } from './lib/renderer'
import { World } from './lib/world'
import './style.css'

export const canvas = new Canvas({
	bgColor: '#0e1217',
}).appendTo(document.body)
const renderer = new Renderer(canvas)
const keyboard = new Keyboard()

const bg = new Background(canvas)
const knight = new Knight()

const world = new World({
	keyboard,
	renderer,
})
	.spawn(bg)
	.spawn(knight)
	.onStart(() => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
