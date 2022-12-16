import './style.css'
import bg from './assets/bg.png'
import { Canvas, Renderer } from './lib/renderer'
import { Keyboard } from './lib/keyboard'
import { World } from './lib/world'
import { Entity } from './lib/entity'
import { Util } from './lib/util'
import { Game } from './lib'

const canvas = new Canvas({
	bgColor: '#0e1217',
}).appendTo(document.body)

const renderer = new Renderer(canvas)
const keyboard = new Keyboard()

const bgImage = new Image(928, 793)
bgImage.src = bg

const world = new World({
	keyboard,
	renderer,
})
	.spawn(
		new Entity(
			Util.position(0, canvas.height - 793 * 1.5),
			Util.size(928, 793),
			'red',
			1.5,
			{
				image: bgImage,
			}
		)
	)
	.onStart((world) => {
		console.log('world start')
	})

const game = new Game(world, keyboard)

window.onload = game.init
